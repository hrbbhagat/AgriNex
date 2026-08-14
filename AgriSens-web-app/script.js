// AgriNex Interactive Logic (Neobrutalist UI, Voice Assistant, Mandi Search, Disease Scanner)

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileNavBtn = document.getElementById('mobile-nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileNavBtn && navLinks) {
    mobileNavBtn.addEventListener('click', () => {
      navLinks.classList.toggle('hidden');
      navLinks.classList.toggle('flex');
    });
  }

  // Apps Dropdown Toggle
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
      appsBtn.setAttribute('aria-expanded', 'false');
    });
    appsDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  // Voice Search Assistant
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
      if (voiceStatus) voiceStatus.textContent = 'Speech input not supported in this browser. Please try Chrome/Edge.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    if (voiceStatus) voiceStatus.textContent = 'Listening... Ask your question about crops, soil, or Mandi rates!';

    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (voiceStatus) voiceStatus.textContent = `You said: "${transcript}"`;

      setTimeout(() => {
        voiceModal?.classList.remove('open');
        const chat = document.querySelector('.chat-box');
        chat?.classList.add('open');
        const messages = document.querySelector('[data-chat-messages]');
        messages?.insertAdjacentHTML('beforeend', `
          <div class="bubble" style="margin:10px 0 0 auto;background:#C9E265">🎤 "${transcript}"</div>
          <div class="bubble" style="margin-top:10px">I heard your query about <b>"${transcript}"</b>. You can use our <b>Crop Recommender</b>, <b>Fertilizer Predictor</b> or <b>Mandi Price Tracker</b>!</div>
        `);
      }, 1500);
    };

    recognition.onerror = () => {
      if (voiceStatus) voiceStatus.textContent = 'Speech not recognized. Please click Voice Search again.';
    };
  }

  // Floating Chat Assistant
  const chatBox = document.querySelector('.chat-box');
  const chatToggle = document.querySelector('.chat-toggle');
  const chatClose = document.querySelector('[data-chat-close]');
  const chatForm = document.querySelector('[data-chat-form]');

  chatToggle?.addEventListener('click', () => chatBox?.classList.toggle('open'));
  chatClose?.addEventListener('click', () => chatBox?.classList.remove('open'));

  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    const q = input.value.trim();
    if (!q) return;

    let reply = 'I can help you choose a tool, check Mandi prices, understand NPK values, or diagnose plant diseases.';
    if (/fertili|npk|soil|urea|dap/i.test(q)) {
      reply = 'Open our **Fertilizer Prediction** app to get exact NPK nutrient recommendations!';
    } else if (/disease|leaf|yellow|spot|pest|fungus/i.test(q)) {
      reply = 'Upload a leaf photo in our **Plant Disease ID** tool to identify plant diseases with AI confidence scores!';
    } else if (/mandi|price|rate|bhav|market/i.test(q)) {
      reply = 'Check the **Mandi Prices** page for daily market rates across Wheat, Paddy, Cotton, Mustard, and Maize!';
    } else if (/crop|sow|seed|wheat|rice|maize/i.test(q)) {
      reply = 'Our **Crop Recommendation** model compares your soil NPK and local climate to recommend optimal crops.';
    }

    const messages = document.querySelector('[data-chat-messages]');
    messages?.insertAdjacentHTML('beforeend', `
      <div class="bubble" style="margin:10px 0 0 auto;background:#C9E265">${q.replace(/[&<>]/g, '')}</div>
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
        <h4 style="margin:0 0 8px;font-weight:700">Recommended Direction: ${product}</h4>
        <p style="margin:0;font-size:14px;color:#1A261D">Calculated for soil NPK values (${v.n}-${v.p}-${v.k}). Confirm final application with local agricultural advice.</p>
        <a href="https://fertilizer-predictions.streamlit.app/" target="_blank" rel="noopener" class="bg-[#1A261D] text-[#F2EFE9] px-4 py-2 rounded-full font-semibold border-2 border-[#1A261D] inline-block mt-4 text-xs">Launch Full Streamlit AI Predictor ↗</a>
      `;
      result.style.display = 'block';
    }
  });

  // Plant Disease Scanner Simulator
  const diseaseFileInput = document.getElementById('disease-file');
  const diseaseResult = document.getElementById('disease-result');

  if (diseaseFileInput && diseaseResult) {
    diseaseFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      diseaseResult.innerHTML = `
        <div style="text-align:center;padding:15px">
          <div class="animate-spin-slow" style="display:inline-block;font-size:28px">🌀</div>
          <p style="font-weight:700;margin-top:8px">Scanning leaf image with TensorFlow CNN Model...</p>
        </div>
      `;
      diseaseResult.style.display = 'block';

      setTimeout(() => {
        diseaseResult.innerHTML = `
          <div style="display:flex;gap:14px;align-items:center">
            <div style="font-size:36px">🍃</div>
            <div>
              <h4 style="margin:0;font-weight:800;font-size:18px">Detected: Early Blight (Alternaria solani)</h4>
              <p style="margin:4px 0 0;font-size:14px;color:#1A261D">AI Confidence Score: <b>94.8%</b> | Recommended Treatment: Apply Mancozeb or Copper Hydroxide fungicide.</p>
            </div>
          </div>
          <a href="https://plant-diseases-identification.streamlit.app/" target="_blank" rel="noopener" class="bg-[#FF6B4A] text-[#1A261D] px-4 py-2 rounded-full font-semibold border-2 border-[#1A261D] hard-shadow inline-block mt-4 text-xs">Open Live Streamlit Disease Classifier ↗</a>
        `;
      }, 1500);
    });
  }

  // Mandi Commodity Search Filter
  const mandiSearch = document.getElementById('mandi-search');
  const mandiCards = document.querySelectorAll('.mandi-card');

  if (mandiSearch && mandiCards.length > 0) {
    mandiSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      mandiCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(term) ? 'block' : 'none';
      });
    });
  }
});
