# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm start         # Start the server (also: npm run dev)
```

The server runs at `http://localhost:3000` (or `PORT` from `.env`).

## Architecture

This is a single-page e-commerce demo with a thin Node.js/Express backend acting as a **proxy** to the Salesforce Agentforce API. There is no build step — the frontend is served as static files directly from Express.

**Request flow for the AI chat:**
1. Browser (`app.js`) calls `/api/agent/*` endpoints on the local Express server
2. `server.js` exchanges OAuth credentials for a Bearer token (cached in-memory, refreshed every 110 minutes), then forwards requests to `https://api.salesforce.com/einstein/ai-agent/v1/`
3. Agent sessions are stored in a `Map` in `server.js` memory — they are lost on server restart

**Salesforce OAuth:** Uses the `client_credentials` grant type (not user OAuth). Credentials come from `.env` or can be updated at runtime via `POST /api/config`, which also resets the cached token.

**Chat fallback:** If Agentforce is not configured, `app.js` uses a local keyword-matching `knowledgeBase` array as a fallback. The `generateLocalResponse()` function scores entries by keyword hits — this is the offline/demo mode.

## Key files

- [server.js](server.js) — Express server, OAuth token management, Agentforce proxy routes
- [app.js](app.js) — All frontend logic: product catalog, cart, chat UI, Agentforce session management, local fallback KB
- [index.html](index.html) — Single HTML page; all UI is rendered here or injected by `app.js`
- [.env.sample](.env.sample) — Template for required Salesforce credentials

## Environment setup

Copy `.env.sample` to `.env` and fill in the four Salesforce values:

```
SF_MY_DOMAIN_URL=your-org.my.salesforce.com   # no https://
SF_CONSUMER_KEY=...
SF_CONSUMER_SECRET=...
SF_AGENT_ID=...
```

Credentials can also be set at runtime through the settings panel in the chat UI (calls `POST /api/config`), without restarting the server.
