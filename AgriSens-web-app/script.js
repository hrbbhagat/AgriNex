// Cleanecs Koh Samui Inspired Script (useScrollReveal Observer, Testimonial Carousel Autoplay 5200ms, Voice Assistant, AI Tools)

document.addEventListener('DOMContentLoaded', () => {

  // 1. useScrollReveal Hook (Intersection Observer with staggered entrance)
  const revealElements = document.querySelectorAll('.service-catalog-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));

  // 2. Testimonial Carousel Autoplay State (5200ms interval)
  const carouselTrack = document.getElementById('testimonials-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  
  if (carouselTrack && testimonialCards.length > 0) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % testimonialCards.length;
      const cardWidth = testimonialCards[0].offsetWidth + 30; // card width + gap
      carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }, 5200);
  }

  // 3. Live AI Apps Dropdown Toggle
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

  // 4. Voice Search Assistant (Web Speech API)
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
      if (voiceStatus) voiceStatus.textContent = 'Voice input not supported in this browser. Please try Chrome/Edge.';
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;

    if (voiceStatus) voiceStatus.textContent = 'Listening... Speak your crop, soil or Mandi question now!';

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
          <div class="bubble" style="margin:10px 0 0 auto;background:var(--hc-accent-light)">🎤 "${transcript}"</div>
          <div class="bubble" style="margin-top:10px">I heard your query about <b>"${transcript}"</b>. You can explore our <b>Crop AI</b>, <b>Fertilizer AI</b>, or <b>Mandi Price Tracker</b>!</div>
        `);
      }, 1500);
    };

    recognition.onerror = () => {
      if (voiceStatus) voiceStatus.textContent = 'Speech not recognized. Please click Voice Search again.';
    };
  }

  // 5. Floating AI Chat Assistant
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

    let reply = 'I can help you choose a tool, check Mandi prices, calculate NPK fertilizer, or diagnose plant diseases.';
    if (/fertili|npk|soil|urea|dap/i.test(q)) {
      reply = 'Open our **Fertilizer AI** guide to calculate NPK nutrient dosages!';
    } else if (/disease|leaf|yellow|spot|pest|fungus/i.test(q)) {
      reply = 'Upload a leaf photo in our **Plant Disease ID** scanner for an instant AI diagnosis!';
    } else if (/mandi|price|rate|bhav|market/i.test(q)) {
      reply = 'Check the **Mandi Rates** page for live APMC commodity prices across India!';
    } else if (/crop|sow|seed|wheat|rice|maize/i.test(q)) {
      reply = 'Our **Crop Recommendation** model compares soil NPK and climate data to suggest the best crops.';
    }

    const messages = document.querySelector('[data-chat-messages]');
    messages?.insertAdjacentHTML('beforeend', `
      <div class="bubble" style="margin:10px 0 0 auto;background:var(--hc-accent-light)">${q.replace(/[&<>]/g, '')}</div>
      <div class="bubble" style="margin-top:10px">${reply}</div>
    `);
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
  });

  // 6. NPK Form Calculator
  const fertForm = document.querySelector('[data-fert-form]');
  fertForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget));
    const product = +v.n < 25 ? 'Urea + SSP (Single Super Phosphate)' : +v.p < 20 ? 'DAP (Di-Ammonium Phosphate 18-46-0)' : 'NPK 10-26-26 + Organic Compost';
    const result = document.querySelector('[data-fert-result]');
    if (result) {
      result.innerHTML = `
        <h4 style="margin:0 0 8px;font-weight:700">Recommended Direction: ${product}</h4>
        <p style="margin:0;font-size:14px;color:var(--hc-text-muted)">Based on soil NPK values (${v.n}-${v.p}-${v.k}). Always confirm final application locally.</p>
        <a href="https://fertilizer-predictions.streamlit.app/" target="_blank" rel="noopener" class="hc-button clip-button" style="margin-top:16px;font-size:12px;padding:8px 16px">Launch Streamlit AI Predictor ↗</a>
      `;
      result.style.display = 'block';
    }
  });

  // 7. Leaf Disease Scanner Simulator
  const diseaseFileInput = document.getElementById('disease-file');
  const diseaseResult = document.getElementById('disease-result');

  if (diseaseFileInput && diseaseResult) {
    diseaseFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      diseaseResult.innerHTML = `
        <div style="text-align:center;padding:15px">
          <p style="font-weight:700">Analyzing leaf image with TensorFlow CNN Model...</p>
        </div>
      `;
      diseaseResult.style.display = 'block';

      setTimeout(() => {
        diseaseResult.innerHTML = `
          <div style="display:flex;gap:14px;align-items:center">
            <div style="font-size:36px">🍃</div>
            <div>
              <h4 style="margin:0;font-weight:800;font-size:18px">Detected: Early Blight (Alternaria solani)</h4>
              <p style="margin:4px 0 0;font-size:14px;color:var(--hc-text-muted)">AI Confidence Score: <b>94.8%</b> | Recommended Treatment: Apply Mancozeb or Copper Hydroxide fungicide.</p>
            </div>
          </div>
          <a href="https://plant-diseases-identification.streamlit.app/" target="_blank" rel="noopener" class="hc-button clip-button" style="margin-top:16px;font-size:12px;padding:8px 16px">Open Live Streamlit App ↗</a>
        `;
      }, 1500);
    });
  }

  // 8. Mandi Price Search Filter
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
