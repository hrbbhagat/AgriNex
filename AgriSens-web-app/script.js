// AgriNex Interactive Logic (Voice Assistant, Multi-Language, Mandi Prices, Disease Scanner)

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Menu Toggle
  const navToggle = document.querySelector('[data-nav-toggle]');
  const links = document.querySelector('.links');
  if (navToggle && links) {
    navToggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Live AI Apps Dropdown Toggle
  const appsBtn = document.getElementById('apps-toggle-btn');
  const appsDropdown = document.getElementById('apps-dropdown');
  if (appsBtn && appsDropdown) {
    appsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = appsDropdown.classList.toggle('open');
      appsBtn.setAttribute('aria-expanded', open);
      appsBtn.innerHTML = open ? 'Live AI apps ✕' : 'Live AI apps ▾';
    });
    document.addEventListener('click', () => {
      appsDropdown.classList.remove('open');
      appsBtn.setAttribute('aria-expanded', 'false');
      appsBtn.innerHTML = 'Live AI apps ▾';
    });
    appsDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  // Voice Assistant Modal Logic
  const voiceBtn = document.getElementById('btn-voice');
  const voiceModal = document.getElementById('voice-modal');
  const voiceClose = document.getElementById('voice-modal-close');
  const voiceStatus = document.getElementById('voice-status');

  if (voiceBtn && voiceModal) {
    voiceBtn.addEventListener('click', () => {
      voiceModal.classList.add('open');
      startVoiceRecognition();
    });
    voiceClose?.addEventListener('click', () => {
      voiceModal.classList.remove('open');
    });
  }

  function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (voiceStatus) voiceStatus.textContent = 'Voice input not supported in this browser. Please use Chrome/Edge.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Default to Hindi/English support
    recognition.interimResults = false;

    if (voiceStatus) voiceStatus.textContent = 'Listening... Speak your crop, soil or farming question now!';

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (voiceStatus) voiceStatus.textContent = `You said: "${transcript}"`;

      setTimeout(() => {
        voiceModal?.classList.remove('open');
        // Open chat assistant with speech text
        const chat = document.querySelector('.chat');
        chat?.classList.add('open');
        const messages = document.querySelector('[data-chat-messages]');
        messages?.insertAdjacentHTML('beforeend', `
          <div class="bubble" style="margin:10px 0 0 auto;background:#d2f068;color:#0b1a12">🎤 "${transcript}"</div>
          <div class="bubble" style="margin-top:10px">I heard your query about <b>"${transcript}"</b>. You can use our <b>Crop Recommender</b>, <b>Fertilizer Predictor</b> or <b>Mandi Price Tracker</b> from the menu above!</div>
        `);
      }, 1500);
    };

    recognition.onerror = () => {
      if (voiceStatus) voiceStatus.textContent = 'Speech not recognized. Please click Voice Search again.';
    };
  }

  // Floating Chat Assistant Logic
  const chat = document.querySelector('.chat');
  const chatToggle = document.querySelector('.chat-toggle');
  const chatClose = document.querySelector('[data-chat-close]');
  const chatForm = document.querySelector('[data-chat-form]');

  chatToggle?.addEventListener('click', () => chat?.classList.toggle('open'));
  chatClose?.addEventListener('click', () => chat?.classList.remove('open'));

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    const q = input.value.trim();
    if (!q) return;

    let reply = 'I can help you choose a tool, check Mandi prices, understand NPK values, or diagnose plant diseases.';
    if (/fertili|npk|soil|urea|dap/i.test(q)) {
      reply = 'Open our **Fertilizer Prediction** app to get an exact NPK blend recommendation for your soil type!';
    } else if (/disease|leaf|yellow|spot|pest|fungus/i.test(q)) {
      reply = 'Upload a leaf photo in our **Plant Disease ID** tool to identify diseases with AI confidence scores!';
    } else if (/mandi|price|rate|bhav|market/i.test(q)) {
      reply = 'Check the **Mandi Prices** tab for daily market rates across Wheat, Paddy, Cotton, Mustard and Maize!';
    } else if (/crop|sow|seed|wheat|rice|maize/i.test(q)) {
      reply = 'Our **Crop Recommendation** model compares your soil NPK and local climate to recommend optimal crops.';
    }

    const messages = document.querySelector('[data-chat-messages]');
    messages?.insertAdjacentHTML('beforeend', `
      <div class="bubble" style="margin:10px 0 0 auto;background:#d2f068;color:#0b1a12">${q.replace(/[&<>]/g, '')}</div>
      <div class="bubble" style="margin-top:10px">${reply}</div>
    `);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
  });

  // Fertilizer Form Calculator
  const fertForm = document.querySelector('[data-fert-form]');
  fertForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    const product = +v.n < 25 ? 'Urea + SSP (Single Super Phosphate)' : +v.p < 20 ? 'DAP (Di-Ammonium Phosphate 18-46-0)' : 'NPK 10-26-26 + Organic Compost';
    const result = document.querySelector('[data-fert-result]');
    if (result) {
      result.innerHTML = `
        <h4 style="margin:0 0 8px;color:#d2f068">Recommended Dosage: ${product}</h4>
        <p style="margin:0;font-size:14px;color:#a3b899">This calculation is based on soil NPK values (${v.n}-${v.p}-${v.k}). Always verify final field application with a local agricultural extension officer.</p>
        <a href="https://fertilizer-predictions.streamlit.app/" target="_blank" rel="noopener" class="button" style="margin-top:16px;font-size:12px;padding:8px 16px">Launch Full Streamlit AI Predictor ↗</a>
      `;
      result.classList.add('show');
    }
  });

  // Plant Disease Diagnostic Scanner Simulator
  const diseaseFileInput = document.getElementById('disease-file');
  const diseaseResult = document.getElementById('disease-result');

  if (diseaseFileInput && diseaseResult) {
    diseaseFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      diseaseResult.innerHTML = `
        <div style="text-align:center;padding:20px">
          <div class="preloader-spinner" style="margin:0 auto 15px;width:40px;height:40px;border:3px solid rgba(210,240,104,0.2);border-top-color:#d2f068;border-radius:50%;animation:spin 1s linear infinite"></div>
          <p style="color:#d2f068;font-weight:700">Analyzing leaf sample image with AI CNN Model...</p>
        </div>
      `;
      diseaseResult.classList.add('show');

      setTimeout(() => {
        diseaseResult.innerHTML = `
          <div style="display:flex;gap:16px;align-items:center">
            <div style="font-size:36px">🍃</div>
            <div>
              <h4 style="margin:0;color:#d2f068;font-size:18px">Detected Condition: Early Blight (Alternaria solani)</h4>
              <p style="margin:6px 0 0;font-size:14px;color:#a3b899">Confidence Score: <b>94.8%</b> | Recommended Treatment: Apply Mancozeb or Copper Hydroxide fungicide in early morning.</p>
            </div>
          </div>
          <a href="https://plant-diseases-identification.streamlit.app/" target="_blank" rel="noopener" class="button" style="margin-top:18px;font-size:12px;padding:8px 16px">Open Live Disease ID Streamlit App ↗</a>
        `;
      }, 1500);
    });
  }

  // Mandi Price Search & Filter Logic
  const mandiSearch = document.getElementById('mandi-search');
  const mandiCards = document.querySelectorAll('.mandi-card');

  if (mandiSearch && mandiCards.length > 0) {
    mandiSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      mandiCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? 'flex' : 'none';
      });
    });
  }
});
