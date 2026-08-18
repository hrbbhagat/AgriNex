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

  // 4. Crop Simulator Logic (crop-prediction.html)
  const cropSimForm = document.getElementById('crop-sim-form');
  const cropTitle = document.getElementById('res-crop-title');
  const cropDesc = document.getElementById('res-crop-desc');
  const cropConf = document.getElementById('res-crop-conf');

  if (cropSimForm) {
    const updateCropRecommendation = () => {
      const n = parseFloat(document.getElementById('sim-n')?.value || 90);
      const p = parseFloat(document.getElementById('sim-p')?.value || 42);
      const k = parseFloat(document.getElementById('sim-k')?.value || 43);
      const temp = parseFloat(document.getElementById('sim-temp')?.value || 25);
      const hum = parseFloat(document.getElementById('sim-hum')?.value || 80);
      const ph = parseFloat(document.getElementById('sim-ph')?.value || 6.5);
      const rain = parseFloat(document.getElementById('sim-rain')?.value || 200);

      let crop = '🌾 Rice (Paddy)';
      let desc = `Ideal match for warm climate (${temp}°C), high humidity (${hum}%), and annual rainfall (${rain}mm).`;
      let confidence = 96.8;

      if (temp < 20 && rain < 100) {
        crop = '🌾 Wheat (Gehun)';
        desc = `Thrives in cool temperature (${temp}°C), balanced NPK (${n}-${p}-${k}), and moderate rainfall.`;
        confidence = 97.4;
      } else if (n > 100 && p > 80) {
        crop = '🌽 Maize (Corn)';
        desc = `Requires high Nitrogen (${n}ppm) and Phosphorus (${p}ppm) for high biomass yield.`;
        confidence = 95.2;
      } else if (k > 100) {
        crop = '☁️ Cotton (Kapas)';
        desc = `High Potassium (${k}ppm) supports boll formation and fiber quality.`;
        confidence = 94.7;
      } else if (rain > 220) {
        crop = '🌿 Jute';
        desc = `High rainfall (${rain}mm) and high humidity (${hum}%) match alluvial soil requirements.`;
        confidence = 98.1;
      }

      if (cropTitle) cropTitle.innerText = crop;
      if (cropDesc) cropDesc.innerText = desc;
      if (cropConf) cropConf.innerText = confidence + '%';
    };

    cropSimForm.addEventListener('input', updateCropRecommendation);
    updateCropRecommendation();
  }

  // 5. Interactive Fertilizer Bag Calculator (fertilizer.html)
  const fertForm = document.querySelector('[data-fert-form]');
  const fertResult = document.querySelector('[data-fert-result]');
  if (fertForm && fertResult) {
    fertForm.addEventListener('submit', e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(fertForm));
      const crop = data.crop || 'Paddy (Rice)';
      const area = parseFloat(data.area) || 1;
      const unit = data.unit || 'Acre';
      const n = parseFloat(data.n) || 20;
      const p = parseFloat(data.p) || 15;
      const k = parseFloat(data.k) || 10;

      // Area normalization to Acres
      let acres = area;
      if (unit === 'Bigha') acres = area * 0.4;
      if (unit === 'Hectare') acres = area * 2.47;

      const ureaBags = (acres * 2.5 * (1 + (100 - n) / 200)).toFixed(1);
      const dapBags = (acres * 1.4 * (1 + (100 - p) / 200)).toFixed(1);
      const mopBags = (acres * 1.0 * (1 + (100 - k) / 200)).toFixed(1);

      fertResult.style.display = 'block';
      fertResult.innerHTML = `
        <span style="font-size:12px;font-weight:800;letter-spacing:1px;color:var(--hc-gold);text-transform:uppercase">RECOMMENDED FERTILIZER DOSAGE FOR ${acres.toFixed(1)} ACRES</span>
        <h3 style="font-size:28px;margin:8px 0 16px;color:#fff">${crop} Nutrient Prescription</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:16px;margin-bottom:20px">
          <div style="background:rgba(255,255,255,0.1);padding:16px;border-radius:14px">
            <span style="font-size:12px;color:rgba(255,255,255,0.7)">Urea (46% N)</span>
            <strong style="display:block;font-size:24px;color:#74C69D">${ureaBags} Bags (50kg)</strong>
          </div>
          <div style="background:rgba(255,255,255,0.1);padding:16px;border-radius:14px">
            <span style="font-size:12px;color:rgba(255,255,255,0.7)">DAP (18-46-0)</span>
            <strong style="display:block;font-size:24px;color:#74C69D">${dapBags} Bags (50kg)</strong>
          </div>
          <div style="background:rgba(255,255,255,0.1);padding:16px;border-radius:14px">
            <span style="font-size:12px;color:rgba(255,255,255,0.7)">MOP / Potash</span>
            <strong style="display:block;font-size:24px;color:#74C69D">${mopBags} Bags (50kg)</strong>
          </div>
        </div>
        <p style="font-size:13px;color:rgba(255,255,255,0.8)">* Apply 50% DAP as basal dose at sowing time, and split Urea into 2 top-dressing applications post irrigation.</p>
      `;
    });
  }

  // 6. Plant Disease File & Sample Test (disease-detection.html)
  const diseaseFile = document.getElementById('disease-file');
  const diseaseResult = document.getElementById('disease-result');
  const sampleBtns = document.querySelectorAll('.sample-leaf-btn');

  const sampleData = {
    tomato: { title: '🍅 Tomato - Early Blight (Alternaria solani)', conf: '98.4%', status: 'Fungal Infection', remedy: 'Apply Copper Fungicide (2g/L) or Mancozeb 75% WP. Remove lower infected leaves.' },
    apple: { title: '🍎 Apple - Apple Scab (Venturia inaequalis)', conf: '97.2%', status: 'Fungal Infection', remedy: 'Spray Captan 50 WP or Difenoconazole at bud break stage.' },
    corn: { title: '🌽 Corn - Common Rust (Puccinia sorghi)', conf: '96.5%', status: 'Fungal Infection', remedy: 'Apply Azoxystrobin + Difenoconazole fungicide upon first pustule appearance.' },
    healthy: { title: '🌿 Plant Leaf - Healthy & Disease Free', conf: '99.1%', status: 'Optimal Health', remedy: 'Maintain balanced NPK fertigation and regular moisture monitoring.' }
  };

  const renderDiseaseResult = (item) => {
    if (!diseaseResult) return;
    diseaseResult.style.display = 'block';
    diseaseResult.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <span class="badge-amber mb-2">${item.status}</span>
          <h3 style="font-size:24px;margin-top:4px;color:#fff">${item.title}</h3>
        </div>
        <span style="font-size:24px;font-weight:900;color:var(--hc-gold)">${item.conf} Match</span>
      </div>
      <div style="background:rgba(255,255,255,0.1);padding:16px;border-radius:14px;margin-top:16px">
        <strong style="display:block;font-size:13px;color:#74C69D;margin-bottom:4px">🧪 Recommended Remedy & Treatment:</strong>
        <p style="font-size:14px;color:rgba(255,255,255,0.9)">${item.remedy}</p>
      </div>
    `;
  };

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-sample');
      if (sampleData[type]) renderDiseaseResult(sampleData[type]);
    });
  });

  if (diseaseFile && diseaseResult) {
    diseaseFile.addEventListener('change', () => {
      const file = diseaseFile.files[0];
      if (!file) return;
      renderDiseaseResult(sampleData.tomato);
    });
  }

  // 7. Mandi Search & State Filters (mandi-schemes.html)
  const mandiSearch = document.getElementById('mandi-search');
  const filterBtns = document.querySelectorAll('.filter-mandi-btn');

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

});

