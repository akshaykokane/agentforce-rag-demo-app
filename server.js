/* ================================================
   STRIDE SHOES — Backend Proxy for Salesforce Agentforce
   ================================================ */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve frontend files

// ── Config from .env ──────────────────────────────
let config = {
  myDomainUrl: process.env.SF_MY_DOMAIN_URL || "",
  consumerKey: process.env.SF_CONSUMER_KEY || "",
  consumerSecret: process.env.SF_CONSUMER_SECRET || "",
  agentId: process.env.SF_AGENT_ID || "",
};

// In-memory session + token store (per-client)
let cachedToken = null;
let tokenExpiresAt = 0;
const sessions = new Map(); // sessionId -> { sfSessionId, agentId }

// ── Health / Config Status ────────────────────────
app.get("/api/config/status", (req, res) => {
  const configured =
    config.myDomainUrl && config.consumerKey && config.consumerSecret && config.agentId;
  res.json({
    configured: !!configured,
    myDomainUrl: config.myDomainUrl ? maskString(config.myDomainUrl) : "",
    agentId: config.agentId ? maskString(config.agentId) : "",
  });
});

// ── Update Config at runtime (from settings UI) ───
app.post("/api/config", (req, res) => {
  const { myDomainUrl, consumerKey, consumerSecret, agentId } = req.body;
  if (myDomainUrl) config.myDomainUrl = myDomainUrl.replace(/\/+$/, "");
  if (consumerKey) config.consumerKey = consumerKey;
  if (consumerSecret) config.consumerSecret = consumerSecret;
  if (agentId) config.agentId = agentId;
  // Reset cached token when config changes
  cachedToken = null;
  tokenExpiresAt = 0;
  res.json({ success: true, message: "Configuration updated." });
});

// ── Get OAuth Token ───────────────────────────────
async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const tokenUrl = `https://${config.myDomainUrl}/services/oauth2/token`;
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: config.consumerKey,
    client_secret: config.consumerSecret,
  });

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!resp.ok) {
    const errorText = await resp.text();
    throw new Error(`Token request failed (${resp.status}): ${errorText}`);
  }

  const data = await resp.json();
  cachedToken = data.access_token;
  // Tokens typically last ~2 hours; refresh after 1h50m
  tokenExpiresAt = now + 110 * 60 * 1000;
  return cachedToken;
}

// ── Create Agent Session ──────────────────────────
app.post("/api/agent/session", async (req, res) => {
  try {
    validateConfig();
    const accessToken = await getAccessToken();
    const externalSessionKey = uuidv4();

    const sfResp = await fetch(
      `https://api.salesforce.com/einstein/ai-agent/v1/agents/${config.agentId}/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          externalSessionKey,
          instanceConfig: {
            endpoint: `https://${config.myDomainUrl}`,
          },
          streamingCapabilities: {
            chunkTypes: ["Text"],
          },
          bypassUser: true,
        }),
      }
    );

    if (!sfResp.ok) {
      const errorText = await sfResp.text();
      throw new Error(`Session creation failed (${sfResp.status}): ${errorText}`);
    }

    const data = await sfResp.json();

    // Store session mapping
    sessions.set(data.sessionId, {
      sfSessionId: data.sessionId,
      agentId: config.agentId,
      externalSessionKey,
    });

    res.json({
      sessionId: data.sessionId,
      greeting:
        data.messages && data.messages.length > 0
          ? data.messages[0].message
          : "Hi! How can I help you today?",
      messages: data.messages || [],
    });
  } catch (err) {
    console.error("Session creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Send Message to Agent ─────────────────────────
app.post("/api/agent/message", async (req, res) => {
  try {
    validateConfig();
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message are required." });
    }

    const accessToken = await getAccessToken();

    const sfResp = await fetch(
      `https://api.salesforce.com/einstein/ai-agent/v1/sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          message: {
            sequenceId: Date.now(),
            type: "Text",
            text: message,
          },
        }),
      }
    );

    if (!sfResp.ok) {
      const errorText = await sfResp.text();
      throw new Error(`Message send failed (${sfResp.status}): ${errorText}`);
    }

    const data = await sfResp.json();
    res.json(data);
  } catch (err) {
    console.error("Message error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── End Session ───────────────────────────────────
app.delete("/api/agent/session/:sessionId", async (req, res) => {
  try {
    validateConfig();
    const { sessionId } = req.params;
    const accessToken = await getAccessToken();

    const sfResp = await fetch(
      `https://api.salesforce.com/einstein/ai-agent/v1/sessions/${sessionId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    sessions.delete(sessionId);

    if (!sfResp.ok) {
      const errorText = await sfResp.text();
      throw new Error(`Session end failed (${sfResp.status}): ${errorText}`);
    }

    res.json({ success: true, message: "Session ended." });
  } catch (err) {
    console.error("End session error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Helpers ───────────────────────────────────────
function validateConfig() {
  if (!config.myDomainUrl || !config.consumerKey || !config.consumerSecret || !config.agentId) {
    throw new Error(
      "Salesforce Agentforce is not configured. Please enter your credentials in the EcomPro settings."
    );
  }
}

function maskString(str) {
  if (str.length <= 8) return "****";
  return str.slice(0, 4) + "****" + str.slice(-4);
}

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Stride Shoes server running at http://localhost:${PORT}`);
  if (config.myDomainUrl && config.agentId) {
    console.log(`✅ Salesforce Agentforce configured (Agent: ${maskString(config.agentId)})`);
  } else {
    console.log(`⚠️  Agentforce not configured — open settings in EcomPro chat to connect.`);
    console.log(`   Or fill in the .env file and restart.`);
  }
  console.log("");
});
