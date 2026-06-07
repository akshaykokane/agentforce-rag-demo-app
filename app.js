/* ================================================
   STRIDE SHOES — Main Application JS
   + EcomPro AI Agent (Salesforce Agentforce Integration)
   ================================================ */

// ── Product Data ──────────────────────────────────
const products = [
  { id: 1,  name: "Stride AirMax Pro",     category: "running",   price: 189.99, oldPrice: 229.99, rating: 4.9, reviews: 324, badge: "Best Seller", emoji: "👟" },
  { id: 2,  name: "Stride Urban Glide",    category: "casual",    price: 129.99, oldPrice: null,   rating: 4.7, reviews: 198, badge: null,          emoji: "👞" },
  { id: 3,  name: "Stride TrailBlazer",    category: "sport",     price: 169.99, oldPrice: 199.99, rating: 4.8, reviews: 256, badge: "New",         emoji: "🥾" },
  { id: 4,  name: "Stride CloudWalk",      category: "lifestyle", price: 109.99, oldPrice: null,   rating: 4.6, reviews: 142, badge: null,          emoji: "👟" },
  { id: 5,  name: "Stride Velocity X",     category: "running",   price: 199.99, oldPrice: 249.99, rating: 5.0, reviews: 410, badge: "Top Rated",   emoji: "👟" },
  { id: 6,  name: "Stride StreetKing",     category: "casual",    price: 139.99, oldPrice: null,   rating: 4.5, reviews: 87,  badge: null,          emoji: "👞" },
  { id: 7,  name: "Stride PowerStrike",    category: "sport",     price: 179.99, oldPrice: 219.99, rating: 4.8, reviews: 301, badge: "Sale",        emoji: "👟" },
  { id: 8,  name: "Stride Zen Walker",     category: "lifestyle", price: 99.99,  oldPrice: null,   rating: 4.7, reviews: 176, badge: null,          emoji: "🩴" },
];

let cart = [];

// ── DOM Elements ──────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const productGrid     = $("#productGrid");
const cartBtn         = $("#cartBtn");
const cartCount       = $("#cartCount");
const cartSidebar     = $("#cartSidebar");
const cartOverlay     = $("#cartOverlay");
const cartClose       = $("#cartClose");
const cartItems       = $("#cartItems");
const cartFooter      = $("#cartFooter");
const cartTotal       = $("#cartTotal");
const toastContainer  = $("#toastContainer");
const navbar          = $("#navbar");
const hamburger       = $("#hamburger");
const navLinks        = $("#navLinks");

// ── Render Products ───────────────────────────────
function renderProducts(filter = "all") {
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  productGrid.innerHTML = filtered.map(p => `
    <div class="product-card" data-category="${p.category}">
      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
      <div class="product-img">${p.emoji}</div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">
          ${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5 - Math.floor(p.rating))}
          <span>(${p.reviews})</span>
        </div>
        <div class="product-bottom">
          <span class="product-price">
            $${p.price.toFixed(2)}
            ${p.oldPrice ? `<span class="old-price">$${p.oldPrice.toFixed(2)}</span>` : ""}
          </span>
          <button class="add-to-cart" data-id="${p.id}" title="Add to cart">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join("");

  $$(".add-to-cart").forEach(btn =>
    btn.addEventListener("click", () => addToCart(+btn.dataset.id))
  );
}

// ── Filter Buttons ────────────────────────────────
$$(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts(btn.dataset.filter);
  });
});

// ── Cart Logic ────────────────────────────────────
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ ...product, qty: 1 }); }
  updateCart();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
}

function updateCart() {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);
  cartCount.textContent = count;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty</p></div>`;
    cartFooter.style.display = "none";
  } else {
    cartItems.innerHTML = cart.map(c => `
      <div class="cart-item">
        <span class="cart-item-emoji">${c.emoji}</span>
        <div class="cart-item-details">
          <strong>${c.name}</strong>
          <span>$${c.price.toFixed(2)} × ${c.qty}</span>
        </div>
        <button class="cart-item-remove" data-id="${c.id}"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join("");
    cartFooter.style.display = "block";
    cartTotal.textContent = `$${total.toFixed(2)}`;

    $$(".cart-item-remove").forEach(btn =>
      btn.addEventListener("click", () => removeFromCart(+btn.dataset.id))
    );
  }
}

// ── Cart Sidebar Toggle ───────────────────────────
cartBtn.addEventListener("click", () => { cartSidebar.classList.add("open"); cartOverlay.classList.add("open"); });
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
function closeCart() { cartSidebar.classList.remove("open"); cartOverlay.classList.remove("open"); }

// ── Toast ─────────────────────────────────────────
function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${msg}`;
  toastContainer.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

// ── Navbar Scroll ─────────────────────────────────
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// ── Mobile Menu ───────────────────────────────────
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ── Active Nav Link (Scroll Spy) ──────────────────
const sections = $$("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.querySelectorAll("a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
});

// ── Forms ─────────────────────────────────────────
$("#newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  showToast("Thanks for subscribing! 🎉");
  e.target.reset();
});

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  showToast("Message sent! We'll get back to you soon.");
  e.target.reset();
});

// ── Initial Render ────────────────────────────────
renderProducts();


/* ================================================
   ECOMPRO — AI SUPPORT AGENT
   Salesforce Agentforce Integration + Local Fallback
   ================================================ */

const API_BASE = window.location.origin; // proxy server

const ecomproFab        = $("#ecomproFab");
const ecomproChat       = $("#ecomproChat");
const ecomproClose      = $("#ecomproClose");
const ecomproForm       = $("#ecomproForm");
const ecomproInput      = $("#ecomproInput");
const ecomproMsgs       = $("#ecomproMessages");
const ecomproSettingsBtn = $("#ecomproSettingsBtn");
const ecomproSettings   = $("#ecomproSettings");
const connectionStatus  = $("#ecomproConnectionStatus");
const ecomproHeaderStatus = $("#ecomproHeaderStatus");
const sfConnectBtn      = $("#sfConnectBtn");
const sfBackBtn         = $("#sfBackBtn");

// State
let agentforceSessionId = null;
let isAgentforceConnected = false;

// ── Toggle Chat ───────────────────────────────────
ecomproFab.addEventListener("click", () => {
  ecomproChat.classList.add("open");
  ecomproFab.classList.add("hidden");
  ecomproInput.focus();
  
  // Initialize chat if first time opening
  if (ecomproMsgs.children.length === 0) {
    showWelcomeMessage();
  }
  
  checkConfigStatus();
});

// ── Show Welcome Message ────────────────────────────────
function showWelcomeMessage() {
  const welcomeDiv = document.createElement('div');
  welcomeDiv.className = 'ecompro-msg bot';
  welcomeDiv.innerHTML = `
    <div class="ecompro-msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ecompro-msg-bubble">
      <div class="ecompro-suggestions">
        <button class="ecompro-suggestion" data-q="What are your best running shoes?">Best running shoes?</button>
        <button class="ecompro-suggestion" data-q="What is your return policy?">Return policy</button>
        <button class="ecompro-suggestion" data-q="Do you offer free shipping?">Free shipping?</button>
        <button class="ecompro-suggestion" data-q="How do I track my order?">Track my order</button>
      </div>
      <p class="ecompro-mode-note" id="ecomproModeNote">⚡ Using local AI — <a href="#" id="openSettingsLink">connect Agentforce</a> for full power</p>
    </div>
  `;
  ecomproMsgs.appendChild(welcomeDiv);
  
  // Re-attach event listener for settings link
  const openSettingsLink = document.getElementById('openSettingsLink');
  if (openSettingsLink) {
    openSettingsLink.addEventListener('click', (e) => {
      e.preventDefault();
      ecomproSettings.classList.add('open');
    });
  }
}

ecomproClose.addEventListener("click", () => {
  ecomproChat.classList.remove("open");
  ecomproFab.classList.remove("hidden");
});

// ── Settings Panel ────────────────────────────────
ecomproSettingsBtn.addEventListener("click", () => {
  ecomproSettings.classList.toggle("open");
});

sfBackBtn.addEventListener("click", () => {
  ecomproSettings.classList.remove("open");
});

// ── Check Config Status ───────────────────────────
async function checkConfigStatus() {
  try {
    const resp = await fetch(`${API_BASE}/api/config/status`);
    const data = await resp.json();
    if (data.configured) {
      updateConnectionUI("online", `Connected (${data.agentId})`);
      isAgentforceConnected = true;
      ecomproSettingsBtn.classList.add("connected");
      if (!agentforceSessionId) {
        updateHeaderStatus("connecting", "Agentforce Joining...");
        await createAgentSession();
      }
    }
  } catch (e) {
    console.log("Agentforce proxy not available, using local mode.");
  }
}

// ── Connect to Agentforce ─────────────────────────
sfConnectBtn.addEventListener("click", async () => {
  const myDomainUrl    = $("#sfDomainUrl").value.trim();
  const consumerKey    = $("#sfConsumerKey").value.trim();
  const consumerSecret = $("#sfConsumerSecret").value.trim();
  const agentId        = $("#sfAgentId").value.trim();

  if (!myDomainUrl || !consumerKey || !consumerSecret || !agentId) {
    showToast("Please fill in all Salesforce fields.");
    return;
  }

  sfConnectBtn.disabled = true;
  sfConnectBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Connecting...`;
  updateConnectionUI("connecting", "Connecting...");

  try {
    // Save config to proxy server
    const configResp = await fetch(`${API_BASE}/api/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ myDomainUrl, consumerKey, consumerSecret, agentId }),
    });
    const configData = await configResp.json();
    if (!configData.success) throw new Error("Failed to save config");

    // Create Agentforce session
    updateHeaderStatus("connecting", "Agentforce Joining...");
    await createAgentSession();

    isAgentforceConnected = true;
    ecomproSettingsBtn.classList.add("connected");
    updateConnectionUI("online", "Connected to Agentforce ✓");
    showToast("Connected to Salesforce Agentforce! 🚀");

    setTimeout(() => ecomproSettings.classList.remove("open"), 800);
  } catch (err) {
    console.error("Connection error:", err);
    updateConnectionUI("offline", `Failed: ${err.message}`);
    showToast("Connection failed — check your credentials.");
  } finally {
    sfConnectBtn.disabled = false;
    sfConnectBtn.innerHTML = `<i class="fa-solid fa-plug"></i> Connect & Start Session`;
  }
});

// ── Create Agentforce Session ─────────────────────
async function createAgentSession() {
  const resp = await fetch(`${API_BASE}/api/agent/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Session creation failed");
  }

  const data = await resp.json();
  agentforceSessionId = data.sessionId;

  // Update status to online
  updateHeaderStatus("online", "Agentforce Online");

  // Clear any welcome message and show Agentforce greeting
  ecomproMsgs.innerHTML = '';
  
  if (data.greeting) {
    appendMessage("bot", data.greeting);
  }
  
  // Add suggestion buttons
  addSuggestions();

  return data;
}

// ── Add Suggestion Buttons ────────────────────────
function addSuggestions() {
  const suggestionsDiv = document.createElement('div');
  suggestionsDiv.className = 'ecompro-msg bot';
  suggestionsDiv.innerHTML = `
    <div class="ecompro-msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ecompro-msg-bubble">
      <div class="ecompro-suggestions">
        <button class="ecompro-suggestion" data-q="What are your best running shoes?">Best running shoes?</button>
        <button class="ecompro-suggestion" data-q="What is your return policy?">Return policy</button>
        <button class="ecompro-suggestion" data-q="Do you offer free shipping?">Free shipping?</button>
        <button class="ecompro-suggestion" data-q="How do I track my order?">Track my order</button>
      </div>
      <p class="ecompro-mode-note connected">✅ Powered by <strong>Salesforce Agentforce</strong></p>
    </div>
  `;
  ecomproMsgs.appendChild(suggestionsDiv);
  ecomproMsgs.scrollTop = ecomproMsgs.scrollHeight;
}

// ── Send Message ──────────────────────────────────
document.addEventListener("click", e => {
  if (e.target.classList.contains("ecompro-suggestion")) {
    sendUserMessage(e.target.dataset.q);
  }
});

ecomproForm.addEventListener("submit", e => {
  e.preventDefault();
  const msg = ecomproInput.value.trim();
  if (!msg) return;
  sendUserMessage(msg);
});

async function sendUserMessage(msg) {
  appendMessage("user", msg);
  ecomproInput.value = "";
  showTypingIndicator();

  if (isAgentforceConnected && agentforceSessionId) {
    // ── Agentforce API mode ──
    try {
      const resp = await fetch(`${API_BASE}/api/agent/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: agentforceSessionId,
          message: msg,
        }),
      });

      removeTypingIndicator();

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Message failed");
      }

      const data = await resp.json();
      const reply = extractAgentResponse(data);
      appendMessage("bot", reply);
    } catch (err) {
      removeTypingIndicator();
      console.error("Agentforce message error:", err);
      appendMessage("bot", `❌ <strong>Error:</strong> ${err.message}`);
    }
  } else {
    removeTypingIndicator();
    appendMessage("bot", `❌ <strong>Error:</strong> Agentforce is not connected. Please open settings and configure your Salesforce credentials.`);
  }
}

// ── Extract response from Agentforce API ──────────
function extractAgentResponse(data) {
  if (data.messages && data.messages.length > 0) {
    const messageText = data.messages
      .filter(m => m.type === "Inform" || m.type === "Text" || m.message)
      .map(m => m.message || m.text || "")
      .filter(Boolean)
      .join("<br><br>") || "I'm here to help! Could you rephrase your question?";
    
    // Check if message contains case data
    const caseData = detectCaseData(messageText);
    if (caseData) {
      return { type: 'cases', cases: caseData.cases, additionalText: caseData.additionalText };
    } 
    
    // Check if message contains slot data
    const slotData = detectSlotData(messageText);
    if (slotData) {
      return { type: 'slots', slots: slotData.slots, additionalText: slotData.additionalText };
    }
    
    // Check if message contains order data
    const orderData = detectOrderData(messageText);
    if (orderData) {
      return { type: 'orders', orders: orderData.orders, additionalText: orderData.additionalText };
    }
    
    return messageText;
  }
  if (data.message) return data.message;
  if (data.text) return data.text;
  if (data.data) {
    try {
      const parsed = typeof data.data === "string" ? JSON.parse(data.data) : data.data;
      if (parsed.message) return parsed.message;
    } catch (e) { /* not JSON */ }
    return data.data;
  }
  return "I received your message but couldn't extract a response. Please try again.";
}

// ── Detect Case Data in Response ──────────────────
function detectCaseData(text) {
  try {
    // Clean up the text and normalize newlines
    const cleanText = text.replace(/\\n/g, '\n').replace(/\\\"/g, '"');
    
    // Method 1: Try JSON array or object patterns
    const jsonMatch = cleanText.match(/\[\s*\{[\s\S]*?\}\s*\]|\{[\s\S]*?"Case Number"[\s\S]*?\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      // Check if it's a case or array of cases
      const cases = Array.isArray(parsed) ? parsed : [parsed];
      
      // Validate it contains case data
      if (cases.length > 0 && cases[0]["Case Number"]) {
        // Extract any text after the JSON
        const jsonEndIndex = cleanText.indexOf(jsonStr) + jsonStr.length;
        const additionalText = cleanText.substring(jsonEndIndex).trim();
        
        return {
          cases,
          additionalText: additionalText || null
        };
      }
    }
    
    // Method 2: Look for text-based case format with "Case Subject:"
    if (/Subject:/i.test(cleanText)) {
      const subjectMatch = cleanText.match(/Case Subject:\s*(.+?)(?=Case Description:|$)/is);
      const descriptionMatch = cleanText.match(/Case Description:\s*(.+?)(?=Please|$)/is);
      
      if (subjectMatch) {
        const caseSubject = subjectMatch[1].trim();
        const caseDescription = descriptionMatch ? descriptionMatch[1].trim() : '';
        
        // Extract text before "Case Subject:" and after the case details
        const subjectIndex = cleanText.search(/Case Subject:/i);
        const beforeText = cleanText.substring(0, subjectIndex).trim();
        
        // Find where case details end (at "Please" or similar confirmation text)
        const afterMatch = cleanText.match(/Please\s+confirm.+$/is);
        const afterText = afterMatch ? afterMatch[0].trim() : '';
        
        const additionalText = (beforeText + (afterText ? '\n\n' + afterText : '')).trim();
        
        // Create a case object in the expected format
        const caseObj = {
          "Case Number": "Pending",
          "CaseSubject": caseSubject,
          "CaseDescription": caseDescription,
          "CaseStatus": "Draft"
        };
        
        return {
          cases: [caseObj],
          additionalText: additionalText || null
        };
      }
    }
  } catch (e) {
    // Not valid JSON or not case data
    console.log('Case detection failed:', e.message);
  }
  return null;
}

// ── Detect Slot Data in Response ──────────────────
function detectSlotData(text) {
  try {
    // Clean up the text and normalize
    const cleanText = text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    // Method 1: Try JSON object with "slots" field
    const jsonMatch = cleanText.match(/\{[^}]*"slots"\s*:\s*"[^"]+"[^}]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      
      // Check if it has slots field
      if (parsed.slots) {
        // Split the slots string by comma
        const slotsArray = parsed.slots.split(',').map(s => s.trim()).filter(Boolean);
        
        // Extract any text before the JSON
        const jsonStartIndex = cleanText.indexOf(jsonStr);
        const additionalText = cleanText.substring(0, jsonStartIndex).trim();
        
        return {
          slots: slotsArray,
          additionalText: additionalText || null
        };
      }
    }
    console.log(cleanText);
    // Method 2: Look for text containing "slot" and time patterns
    if (/slot/i.test(cleanText)) {
      // Find all time slot patterns (e.g., "8:00AM–10:00AM" or "12:00PM–2:00PM")
      const timeSlotRegex = /\d{1,2}:\d{2}\s*[AP]M\s*[–-]\s*\d{1,2}:\d{2}\s*[AP]M/g;
      const slotsArray = cleanText.match(timeSlotRegex);
      
      if (slotsArray && slotsArray.length > 0) {
        // Remove all time slots from the text to get the additional message
        let additionalText = cleanText;
        slotsArray.forEach(slot => {
          additionalText = additionalText.replace(slot, '');
        });
        // Clean up extra whitespace
        additionalText = additionalText.replace(/\s+/g, ' ').trim();
        
        return {
          slots: slotsArray.map(s => s.trim()),
          additionalText: additionalText || null
        };
      }
    }
  } catch (e) {
    // Not valid JSON or not slot data
    console.log('Slot detection failed:', e.message);
  }
  return null;
}

// ── Detect Order Data in Response ─────────────────
function detectOrderData(text) {
  try {
    // Clean up the text and normalize
    const cleanText = text.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    // Look for JSON array with order objects - more flexible pattern
    const jsonMatch = cleanText.match(/\[\s*\{[\s\S]*?orderId[\s\S]*?\}\s*\]/i);
    if (!jsonMatch) return null;
    
    const jsonStr = jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    // Check if it's an array of orders
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].orderId) {
      // Extract any text before the JSON
      const jsonStartIndex = cleanText.indexOf(jsonStr);
      const beforeText = cleanText.substring(0, jsonStartIndex).trim();
      
      // Extract any text after the JSON
      const jsonEndIndex = jsonStartIndex + jsonStr.length;
      const afterText = cleanText.substring(jsonEndIndex).trim();
      
      const additionalText = (beforeText + (afterText ? '\n\n' + afterText : '')).trim();
      
      return {
        orders: parsed,
        additionalText: additionalText || null
      };
    }
  } catch (e) {
    // Not valid JSON or not order data
    console.log('Order detection failed:', e.message);
  }
  return null;
}

// ── Render Case Cards ─────────────────────────────
let currentCases = []; // Store cases globally for modal access
let currentOrders = []; // Store orders globally for selection

function renderCaseCards(cases) {
  currentCases = cases; // Store for later access
  
  const casesHtml = cases.map((caseData, index) => `
    <div class="case-card" onclick="handleCaseAction(${index}, 'view')">
      <div class="case-card-content">
        <div class="case-number">
          <i class="fa-solid fa-ticket"></i>
          <strong>${caseData["Case Number"]}</strong>
        </div>
        <h4 class="case-subject">${caseData.CaseSubject || 'No Subject'}</h4>
      </div>
      <div class="case-card-arrow">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  `).join('');
  
  return `
    <div class="cases-container">
      <div class="cases-header">
        <i class="fa-solid fa-folder-open"></i>
        <span>Your Cases (${cases.length})</span>
      </div>
      ${casesHtml}
    </div>
  `;
}

// ── Render Slot Cards ─────────────────────────────
function renderSlotCards(slots) {
  const slotsHtml = slots.map((slot, index) => {
    const timeIcon = slot.includes('AM') || slot.includes('PM') ? 'fa-clock' : 'fa-calendar';
    return `
      <button class="slot-card" onclick="handleSlotSelection('${slot}')">
        <div class="slot-icon">
          <i class="fa-solid ${timeIcon}"></i>
        </div>
        <div class="slot-time">${slot}</div>
        <div class="slot-arrow">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </button>
    `;
  }).join('');
  
  return `
    <div class="slots-container">
      <div class="slots-header">
        <i class="fa-solid fa-truck-fast"></i>
        <span>Select Delivery Time</span>
      </div>
      ${slotsHtml}
    </div>
  `;
}

// ── Render Order Cards ────────────────────────────
function renderOrderCards(orders) {
  currentOrders = orders; // Store for later access
  
  const ordersHtml = orders.map((order, index) => {
    const statusColors = {
      'Shipped': '#00b894',
      'Not shipped': '#fdcb6e',
      'Delivered': '#00cec9',
      'Cancelled': '#e17055',
      'Processing': '#74b9ff'
    };
    
    const statusColor = statusColors[order.status] || '#dfe6e9';
    
    return `
      <button class="order-card" onclick="handleOrderSelection(${index})">
        <div class="order-card-content">
          <div class="order-id">
            <i class="fa-solid fa-box"></i>
            <strong>#${order.orderId}</strong>
          </div>
          <div class="order-item">${order.item || 'Unknown Item'}</div>
          <div class="order-status" style="background: ${statusColor}20; color: ${statusColor}; border: 1px solid ${statusColor}40;">
            ${order.status || 'Unknown'}
          </div>
        </div>
        <div class="order-card-arrow">
          <i class="fa-solid fa-chevron-right"></i>
        </div>
      </button>
    `;
  }).join('');
  
  return `
    <div class="orders-container">
      <div class="orders-header">
        <i class="fa-solid fa-shopping-cart"></i>
        <span>Select an Order (${orders.length})</span>
      </div>
      ${ordersHtml}
    </div>
  `;
}

// ── Handle Order Selection ────────────────────────
function handleOrderSelection(orderIndex) {
  const order = currentOrders[orderIndex];
  if (!order) return;
  
  // Send the selected order as a user message
  ecomproInput.value = `I want to update order #${order.orderId}`;
  ecomproForm.dispatchEvent(new Event('submit'));
}

// ── Handle Slot Selection ─────────────────────────
function handleSlotSelection(slot) {
  // Send the selected slot as a user message
  ecomproInput.value = `I choose ${slot}`;
  ecomproForm.dispatchEvent(new Event('submit'));
}

// ── Handle Case Actions ───────────────────────────
function handleCaseAction(caseIndex, action) {
  const caseData = currentCases[caseIndex];
  if (!caseData) return;
  
  if (action === 'view') {
    showCaseModal(caseData);
  } else if (action === 'comment') {
    sendUserMessage(`I want to add a comment to case ${caseData["Case Number"]}`);
  }
}

// ── Case Modal Management ──────────────────────────
function showCaseModal(caseData) {
  const modal = document.getElementById('caseModal');
  const overlay = document.getElementById('caseModalOverlay');
  const modalBody = document.getElementById('caseModalBody');
  
  const statusColors = {
    'New': '#00cec9',
    'In Progress': '#fdcb6e',
    'Escalated': '#e17055',
    'Closed': '#00b894',
    'Pending': '#74b9ff',
    'Draft': '#a29bfe'
  };
  
  modalBody.innerHTML = `
    <div class="case-detail-item">
      <label><i class="fa-solid fa-hashtag"></i> Case Number</label>
      <div class="case-detail-value">${caseData["Case Number"]}</div>
    </div>
    <div class="case-detail-item">
      <label><i class="fa-solid fa-info-circle"></i> Status</label>
      <div class="case-detail-value">
        <span class="case-status-badge" style="background-color: ${statusColors[caseData.CaseStatus] || '#6c5ce7'}">
          ${caseData.CaseStatus}
        </span>
      </div>
    </div>
    <div class="case-detail-item">
      <label><i class="fa-solid fa-heading"></i> Subject</label>
      <div class="case-detail-value">${caseData.CaseSubject || 'No Subject'}</div>
    </div>
    <div class="case-detail-item">
      <label><i class="fa-solid fa-align-left"></i> Description</label>
      <div class="case-detail-value case-description-text">${caseData.CaseDescription || 'No description available.'}</div>
    </div>
    <div class="case-modal-actions">
      ${caseData.CaseStatus === 'Draft' || caseData["Case Number"] === 'Pending' 
        ? `<button class="btn btn-primary" onclick="closeCaseModal(); sendUserMessage('Yes, please create this case')">
             <i class="fa-solid fa-check"></i> Confirm & Create Case
           </button>
           <button class="btn btn-outline" onclick="closeCaseModal(); sendUserMessage('No, cancel the case creation')">
             Cancel
           </button>`
        : `<button class="btn btn-primary" onclick="closeCaseModal(); sendUserMessage('I want to add a comment to case ${caseData["Case Number"]}')">
             <i class="fa-solid fa-comment"></i> Add Comment
           </button>
           <button class="btn btn-outline" onclick="closeCaseModal()">
             Close
           </button>`
      }
    </div>
  `;
  
  modal.classList.add('open');
  overlay.classList.add('open');
}

function closeCaseModal() {
  const modal = document.getElementById('caseModal');
  const overlay = document.getElementById('caseModalOverlay');
  modal.classList.remove('open');
  overlay.classList.remove('open');
}

// Close modal when clicking overlay
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('caseModalOverlay');
  const closeBtn = document.getElementById('caseModalClose');
  
  if (overlay) {
    overlay.addEventListener('click', closeCaseModal);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeCaseModal);
  }
});

// Make functions available globally for inline onclick handlers
window.handleCaseAction = handleCaseAction;
window.closeCaseModal = closeCaseModal;
window.handleSlotSelection = handleSlotSelection;
window.handleOrderSelection = handleOrderSelection;

// ── UI Helpers ────────────────────────────────────
function appendMessage(role, content) {
  const div = document.createElement("div");
  div.className = `ecompro-msg ${role}`;
  const icon = role === "bot"
    ? `<div class="ecompro-msg-avatar"><i class="fa-solid fa-robot"></i></div>`
    : `<div class="ecompro-msg-avatar"><i class="fa-solid fa-user"></i></div>`;
  
  // Handle special content types
  let messageContent;
  if (typeof content === 'object' && content.type === 'cases') {
    const casesHtml = renderCaseCards(content.cases);
    messageContent = casesHtml + (content.additionalText ? `<p style="margin-top: 16px;">${content.additionalText}</p>` : '');
  } else if (typeof content === 'object' && content.type === 'slots') {
    const slotsHtml = renderSlotCards(content.slots);
    messageContent = (content.additionalText ? `<p style="margin-bottom: 12px;">${content.additionalText}</p>` : '') + slotsHtml;
  } else if (typeof content === 'object' && content.type === 'orders') {
    const ordersHtml = renderOrderCards(content.orders);
    messageContent = (content.additionalText ? `<p style="margin-bottom: 12px;">${content.additionalText}</p>` : '') + ordersHtml;
  } else {
    messageContent = content;
  }
  
  div.innerHTML = `${icon}<div class="ecompro-msg-bubble">${messageContent}</div>`;
  ecomproMsgs.appendChild(div);
  ecomproMsgs.scrollTop = ecomproMsgs.scrollHeight;
}

function showTypingIndicator() {
  const div = document.createElement("div");
  div.className = "ecompro-msg bot";
  div.id = "typingIndicator";
  div.innerHTML = `
    <div class="ecompro-msg-avatar"><i class="fa-solid fa-robot"></i></div>
    <div class="ecompro-msg-bubble">
      <div class="ecompro-typing"><span></span><span></span><span></span></div>
    </div>`;
  ecomproMsgs.appendChild(div);
  ecomproMsgs.scrollTop = ecomproMsgs.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function updateConnectionUI(status, text) {
  connectionStatus.innerHTML = `<span class="status-dot ${status}"></span> ${text}`;
}

function updateHeaderStatus(status, text) {
  const statusMap = {
    'connecting': '⏳ ',
    'online': '🟢 ',
    'offline': '🔴 '
  };
  const icon = statusMap[status] || '';
  ecomproHeaderStatus.textContent = `${icon}${text}`;
}


/* ── Local Knowledge Base (Fallback) ────────────── */

const knowledgeBase = [
  {
    keywords: ["shipping", "delivery", "ship", "deliver", "how long", "arrive"],
    answer: "🚚 <strong>Free shipping</strong> on all orders! Standard delivery takes <strong>3-5 business days</strong>, and express delivery takes <strong>1-2 business days</strong>. We ship worldwide to over 120 countries."
  },
  {
    keywords: ["return", "refund", "exchange", "money back", "send back"],
    answer: "↩️ We offer a <strong>30-day hassle-free return policy</strong>. If your shoes don't fit or you simply change your mind, you can return them for a full refund or exchange. Just make sure they're unworn and in original packaging."
  },
  {
    keywords: ["size", "sizing", "fit", "size guide", "measure", "too big", "too small"],
    answer: "📏 Quick size guide:<br>• <strong>US 7</strong> = EU 40 = 25 cm<br>• <strong>US 8</strong> = EU 41 = 25.5 cm<br>• <strong>US 9</strong> = EU 42 = 26.5 cm<br>• <strong>US 10</strong> = EU 43 = 27 cm<br>• <strong>US 11</strong> = EU 44 = 28 cm<br>Pro tip: If you're between sizes, go <strong>half a size up</strong>!"
  },
  {
    keywords: ["running", "run", "jog", "marathon", "best running"],
    answer: "🏃 Top running shoes:<br>1. <strong>Stride Velocity X</strong> ($199.99) — 5-star rated<br>2. <strong>Stride AirMax Pro</strong> ($189.99) — Best seller with cloud-like cushioning"
  },
  {
    keywords: ["casual", "everyday", "daily", "street", "urban"],
    answer: "🌆 For everyday style:<br>1. <strong>Stride Urban Glide</strong> ($129.99)<br>2. <strong>Stride StreetKing</strong> ($139.99)"
  },
  {
    keywords: ["sport", "training", "gym", "workout", "trail", "hike"],
    answer: "⚡ For sports & training:<br>1. <strong>Stride TrailBlazer</strong> ($169.99)<br>2. <strong>Stride PowerStrike</strong> ($179.99)"
  },
  {
    keywords: ["lifestyle", "comfort", "walk", "walking", "relax"],
    answer: "🧘 Comfort lifestyle shoes:<br>1. <strong>Stride CloudWalk</strong> ($109.99)<br>2. <strong>Stride Zen Walker</strong> ($99.99)"
  },
  {
    keywords: ["price", "cost", "how much", "cheap", "affordable", "expensive", "budget"],
    answer: "💰 Our shoes range from <strong>$99.99 to $199.99</strong>.<br>• <strong>Budget:</strong> Zen Walker ($99.99), CloudWalk ($109.99)<br>• <strong>Mid:</strong> Urban Glide ($129.99), StreetKing ($139.99)<br>• <strong>Premium:</strong> AirMax Pro ($189.99), Velocity X ($199.99)"
  },
  {
    keywords: ["discount", "coupon", "promo", "sale", "deal", "offer", "code"],
    answer: "🎉 Current offers:<br>• <strong>15% off</strong> with newsletter signup<br>• TrailBlazer on sale: $169.99 (was $199.99)<br>• PowerStrike on sale: $179.99 (was $219.99)<br>• <strong>Free shipping</strong> on every order!"
  },
  {
    keywords: ["track", "order", "tracking", "where", "status", "package"],
    answer: "📦 To track your order:<br>1. Check your <strong>email</strong> for a tracking link<br>2. Visit our <strong>Order Status</strong> page<br>3. Or email <strong>hello@strideshoes.com</strong> with your order number"
  },
  {
    keywords: ["payment", "pay", "credit card", "paypal", "apple pay"],
    answer: "💳 We accept: Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, Klarna, and Afterpay. All secured with 256-bit SSL."
  },
  {
    keywords: ["material", "eco", "sustainable", "recycle", "vegan"],
    answer: "🌱 Our shoes use <strong>60% recycled materials</strong>, vegan-friendly options, water-based adhesives, and 100% recyclable packaging."
  },
  {
    keywords: ["contact", "support", "help", "phone", "email", "reach"],
    answer: "📞 Reach us at:<br>• <strong>Email:</strong> hello@strideshoes.com<br>• <strong>Phone:</strong> +1 (555) 123-4567<br>• <strong>Hours:</strong> Mon–Fri, 9AM–6PM EST"
  },
  {
    keywords: ["warranty", "guarantee", "broken", "defect", "damaged"],
    answer: "🛡️ All shoes come with a <strong>1-year warranty</strong> covering defects. Contact us within 48 hours for damaged deliveries — we'll send a free replacement!"
  },
  {
    keywords: ["new", "latest", "collection", "2026", "upcoming"],
    answer: "✨ Our <strong>2026 Spring Collection</strong> just dropped! Check the Shop section for the latest styles."
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    answer: "Hey there! 👋 I'm EcomPro. I can help with products, orders, sizing, shipping, returns & more. What do you need?"
  },
  {
    keywords: ["thank", "thanks", "appreciate", "helpful"],
    answer: "You're welcome! 😊 Happy to help. Ask anytime!"
  },
  {
    keywords: ["who are you", "what are you", "your name", "ecompro"],
    answer: "🤖 I'm <strong>EcomPro</strong>, Stride Shoes' AI support agent — available 24/7 for product info, orders, sizing, and more!"
  },
  {
    keywords: ["best", "popular", "recommend", "top", "favorite"],
    answer: "🏆 Most popular:<br>1. 🥇 <strong>Velocity X</strong> — 5.0★ (410 reviews) — $199.99<br>2. 🥈 <strong>AirMax Pro</strong> — 4.9★ (324 reviews) — $189.99<br>3. 🥉 <strong>PowerStrike</strong> — 4.8★ (301 reviews) — $179.99"
  },
  {
    keywords: ["wash", "clean", "care", "maintain", "dirty", "stain"],
    answer: "🧼 Care tips: Remove laces, scrub with mild soap, air dry (never use a dryer), and store with shoe trees."
  }
];

function generateLocalResponse(userMsg) {
  const lower = userMsg.toLowerCase();
  let bestMatch = null, bestScore = 0;

  for (const entry of knowledgeBase) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.answer;

  return `I appreciate your question! I can help with:<br>• 🛍️ Product info & recommendations<br>• 📏 Sizing & fit guide<br>• 🚚 Shipping & delivery<br>• ↩️ Returns & refunds<br>• 💳 Payment methods<br>• 📦 Order tracking<br>• 💰 Deals & discounts<br><br>Or email <strong>hello@strideshoes.com</strong> for more help!`;
}
