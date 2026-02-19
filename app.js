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
const ecomproModeNote   = $("#ecomproModeNote");
const connectionStatus  = $("#ecomproConnectionStatus");
const sfConnectBtn      = $("#sfConnectBtn");
const sfBackBtn         = $("#sfBackBtn");
const openSettingsLink  = $("#openSettingsLink");

// State
let agentforceSessionId = null;
let isAgentforceConnected = false;

// ── Toggle Chat ───────────────────────────────────
ecomproFab.addEventListener("click", () => {
  ecomproChat.classList.add("open");
  ecomproFab.classList.add("hidden");
  ecomproInput.focus();
  checkConfigStatus();
});

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

openSettingsLink.addEventListener("click", (e) => {
  e.preventDefault();
  ecomproSettings.classList.add("open");
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
      updateModeNote(true);
      if (!agentforceSessionId) {
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
    await createAgentSession();

    isAgentforceConnected = true;
    ecomproSettingsBtn.classList.add("connected");
    updateConnectionUI("online", "Connected to Agentforce ✓");
    updateModeNote(true);
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

  if (data.greeting && data.greeting !== "Hi! How can I help you today?") {
    appendMessage("bot", data.greeting);
  }

  return data;
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
    return data.messages
      .filter(m => m.type === "Inform" || m.type === "Text" || m.message)
      .map(m => m.message || m.text || "")
      .filter(Boolean)
      .join("<br><br>") || "I'm here to help! Could you rephrase your question?";
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

// ── UI Helpers ────────────────────────────────────
function appendMessage(role, text) {
  const div = document.createElement("div");
  div.className = `ecompro-msg ${role}`;
  const icon = role === "bot"
    ? `<div class="ecompro-msg-avatar"><i class="fa-solid fa-robot"></i></div>`
    : `<div class="ecompro-msg-avatar"><i class="fa-solid fa-user"></i></div>`;
  div.innerHTML = `${icon}<div class="ecompro-msg-bubble">${text}</div>`;
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

function updateModeNote(connected) {
  if (connected) {
    ecomproModeNote.innerHTML = `✅ Powered by <strong>Salesforce Agentforce</strong>`;
    ecomproModeNote.classList.add("connected");
  } else {
    ecomproModeNote.innerHTML = `⚡ Using local AI — <a href="#" id="openSettingsLink">connect Agentforce</a> for full power`;
    ecomproModeNote.classList.remove("connected");
    const link = document.getElementById("openSettingsLink");
    if (link) link.addEventListener("click", (e) => { e.preventDefault(); ecomproSettings.classList.add("open"); });
  }
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
