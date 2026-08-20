// AgriNex AI — Universal Shared JavaScript
document.addEventListener('DOMContentLoaded', () => {

  // 1. Scroll Reveal Observer
  const revealEls = document.querySelectorAll('.service-catalog-reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible'); });
    }, { threshold: 0.08 });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // 2. Apps Menu Dropdown Toggle
  const appsBtn = document.getElementById('apps-toggle-btn');
  const appsDropdown = document.getElementById('apps-dropdown');
  if (appsBtn && appsDropdown) {
    appsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = appsDropdown.classList.toggle('open');
      appsBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', () => {
      appsDropdown.classList.remove('open');
      if (appsBtn) appsBtn.setAttribute('aria-expanded', 'false');
    });
    appsDropdown.addEventListener('click', e => e.stopPropagation());
  }

  // 3. Voice Search Modal System
  const voiceBtns = [document.getElementById('btn-voice'), document.getElementById('btn-voice-hero')].filter(Boolean);
  const voiceModal = document.getElementById('voice-modal') || createVoiceModal();
  const voiceClose = document.getElementById('voice-modal-close');
  const voiceStatus = document.getElementById('voice-status');

  function createVoiceModal() {
    const modal = document.createElement('div');
    modal.id = 'voice-modal';
    modal.innerHTML = `
      <div id="voice-modal-inner">
        <button id="voice-modal-close" aria-label="Close Modal">✕</button>
        <span style="font-size:12px;font-weight:800;letter-spacing:1px;color:var(--hc-accent);text-transform:uppercase">VOICE ASSISTANT</span>
        <h3 style="font-size:22px;margin:8px 0 12px">AgriNex Voice Search</h3>
        <div class="soundwave">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <p id="voice-status">Listening… Speak your crop or soil question in Hindi/English</p>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  voiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      voiceModal.classList.add('open');
      startVoice();
    });
  });

  if (voiceClose) {
    voiceClose.addEventListener('click', () => voiceModal.classList.remove('open'));
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const statusEl = document.getElementById('voice-status');
    if (!SR) {
      if (statusEl) statusEl.textContent = 'Voice input not supported on this browser. Try Chrome or Edge.';
      return;
    }
    const rec = new SR();
    rec.lang = 'hi-IN';
    rec.interimResults = false;
    if (statusEl) statusEl.textContent = 'Listening… Speak your crop or soil question!';
    rec.start();
    rec.onresult = e => {
      const text = e.results[0][0].transcript;
      if (statusEl) statusEl.textContent = `Received: "${text}" — Searching AgriNex database…`;
      setTimeout(() => voiceModal?.classList.remove('open'), 2200);
    };
    rec.onerror = () => {
      if (statusEl) statusEl.textContent = 'Could not process audio. Please try speaking again.';
    };
  }

  // 4. Mandi Search & State Filters (mandi-schemes.html)
  const mandiSearch = document.getElementById('mandi-search');
  if (mandiSearch) {
    mandiSearch.addEventListener('input', () => {
      const query = mandiSearch.value.trim().toLowerCase();
      document.querySelectorAll('.mandi-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
    });
  }

  // 8. Mobile Drawer Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-toggle');
  if (mobileBtn) {
    let mobileDrawer = document.getElementById('mobile-drawer');
    if (!mobileDrawer) {
      mobileDrawer = document.createElement('div');
      mobileDrawer.id = 'mobile-drawer';
      mobileDrawer.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.9);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;opacity:0;pointer-events:none;transition:opacity 0.3s ease;';
      mobileDrawer.innerHTML = `
        <button id="mobile-drawer-close" style="position:absolute;top:20px;right:20px;background:none;border:none;color:#fff;font-size:32px;cursor:pointer;">✕</button>
        <a href="index.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Home</a>
        <a href="dashboard.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Dashboard</a>
        <a href="crop-prediction.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Crop AI</a>
        <a href="fertilizer.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Fertilizer AI</a>
        <a href="disease-detection.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Disease ID</a>
        <a href="mandi-schemes.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Mandi & Schemes</a>
        <a href="farmer-hub.html" style="color:#fff;font-size:20px;font-weight:800;text-decoration:none">Farmer Hub</a>
      `;
      document.body.appendChild(mobileDrawer);
      document.getElementById('mobile-drawer-close').addEventListener('click', () => {
        mobileDrawer.style.opacity = '0';
        mobileDrawer.style.pointerEvents = 'none';
      });
    }

    mobileBtn.addEventListener('click', () => {
      mobileDrawer.style.opacity = '1';
      mobileDrawer.style.pointerEvents = 'all';
    });
  }

  // 9. Universal AI Kisan Chatbot Widget
  function initChatbot() {
    if (document.getElementById('agri-chatbot-fab')) return;

    // Create FAB
    const fab = document.createElement('button');
    fab.id = 'agri-chatbot-fab';
    fab.setAttribute('aria-label', 'Open AgriNex Kisan AI Chatbot');
    fab.innerHTML = `
      <iconify-icon icon="solar:chat-round-dots-bold" style="font-size:20px;color:#74C69D"></iconify-icon>
      <span>Ask Kisan AI</span>
    `;

    // Create Modal Window
    const modal = document.createElement('div');
    modal.id = 'agri-chatbot-modal';
    modal.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <iconify-icon icon="solar:leaf-bold"></iconify-icon>
          </div>
          <div>
            <h4 class="chat-title">AgriNex Kisan AI</h4>
            <div class="chat-subtitle">
              <span style="width:7px;height:7px;border-radius:50%;background:#10B981;display:inline-block"></span>
              <span>Online • Smart Advisory</span>
            </div>
          </div>
        </div>
        <button class="chat-close-btn" id="chat-close-trigger" aria-label="Close Chat">✕</button>
      </div>

      <div class="chat-messages" id="chat-messages-box">
        <div class="chat-bubble bot">
          <strong>Namaste Farmer! 🙏</strong><br>
          I am your <b>AgriNex AI Assistant</b>. Ask me anything about crop selection, fertilizer doses (Urea/DAP), leaf disease treatment, or today's APMC Mandi rates!
        </div>
      </div>

      <div class="chat-pills">
        <button class="chat-pill-btn" data-query="Best crop for loamy soil and 200mm rain?">🌾 Crop Recommendation</button>
        <button class="chat-pill-btn" data-query="How many Urea & DAP bags for 2 acres Wheat?">🧪 Fertilizer Dosage</button>
        <button class="chat-pill-btn" data-query="What is the remedy for Yellow Leaf Spot in Paddy?">🐛 Leaf Disease Remedy</button>
        <button class="chat-pill-btn" data-query="What is the latest Wheat Mandi rate in Varanasi?">📈 Mandi Price Alert</button>
      </div>

      <div class="chat-input-row">
        <input type="text" id="chat-input-val" class="chat-input-field" placeholder="Ask in Hindi or English (e.g. Urea dose for Wheat)..." />
        <button id="chat-send-trigger" class="chat-send-btn" aria-label="Send Message">
          <iconify-icon icon="solar:plain-3-bold"></iconify-icon>
        </button>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(modal);

    const msgBox = document.getElementById('chat-messages-box');
    const inputVal = document.getElementById('chat-input-val');
    const sendBtn = document.getElementById('chat-send-trigger');
    const closeBtn = document.getElementById('chat-close-trigger');
    const pillBtns = modal.querySelectorAll('.chat-pill-btn');

    const toggleModal = () => modal.classList.toggle('open');
    fab.addEventListener('click', toggleModal);
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));

    function appendMessage(sender, text) {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${sender}`;
      bubble.innerHTML = text;
      msgBox.appendChild(bubble);
      msgBox.scrollTop = msgBox.scrollHeight;
    }

    function processQuery(query) {
      const q = query.toLowerCase();
      let reply = "I am analyzing your farm query using AgriNex AI models... ";

      if (q.includes('crop') || q.includes('loamy') || q.includes('recommend')) {
        reply = "🌾 <b>Crop Advisory:</b> Based on loamy soil, pH 6.5, and 200mm rainfall, <b>Rice (Paddy)</b> and <b>Maize</b> are the highest yield crops. For cool seasons (15-20°C), <b>Wheat</b> yields up to 22 Quintals/Acre.";
      } else if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('bag')) {
        reply = "🧪 <b>Fertilizer Dose (per Acre):</b><br>• <b>Paddy:</b> 2.5 Bags Urea (45kg) + 1.2 Bags DAP + 0.8 Bag MOP.<br>• <b>Wheat:</b> 2.8 Bags Urea + 1.4 Bags DAP.<br><i>Apply 50% DAP as basal dose during sowing!</i>";
      } else if (q.includes('disease') || q.includes('spot') || q.includes('blight') || q.includes('remedy')) {
        reply = "🐛 <b>Leaf Disease Treatment:</b><br>For Early Blight / Brown Spot: Spray <b>Mancozeb 75% WP</b> (2g/Liter water) or <b>Copper Oxychloride</b>. Ensure adequate spacing and avoid over-irrigation.";
      } else if (q.includes('mandi') || q.includes('price') || q.includes('rate') || q.includes('varanasi')) {
        reply = "📈 <b>Live APMC Mandi Rates:</b><br>• <b>Wheat:</b> ₹2,450 / Qtl (+₹45)<br>• <b>Paddy (Common):</b> ₹2,180 / Qtl (+₹30)<br>• <b>Mustard:</b> ₹5,400 / Qtl (+₹110)<br>Prices updated from regional UP Mandis!";
      } else if (q.includes('scheme') || q.includes('kisan') || q.includes('subsidy')) {
        reply = "📜 <b>Govt Scheme Alert:</b> PM-KISAN 17th installment of ₹2,000 is active. Ensure your e-KYC and Aadhaar link is complete on pmkisan.gov.in!";
      } else {
        reply = `🌾 <b>AgriNex Advisory:</b> For "${query}", our AI model recommends checking our live <b>Crop AI</b> or <b>Fertilizer Calculator</b>. Would you like assistance calculating Urea bags or Mandi prices?`;
      }

      setTimeout(() => appendMessage('bot', reply), 600);
    }

    function handleSend() {
      const txt = inputVal.value.trim();
      if (!txt) return;
      appendMessage('user', txt);
      inputVal.value = '';
      processQuery(txt);
    }

    sendBtn.addEventListener('click', handleSend);
    inputVal.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    pillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const q = btn.getAttribute('data-query');
        appendMessage('user', q);
        processQuery(q);
      });
    });
  }

  initChatbot();

});


