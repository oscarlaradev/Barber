/**
 * VAULT // 09 — Architectural Grooming & Avant-Garde Atelier Engine
 * Native Vanilla ES6+ Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initAudioEngine();
  initCustomCursor();
  initSpecimenDossier();
  initBookingProtocol();
  initLedgerTriggers();
  initMobileNav();
  drawProceduralQR();
});

/* ==========================================================================
   1. LIVE ATELIER TELEMETRY & WORLD CLOCK
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}:${secs} LOC`;
  }
  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. PROCEDURAL WEB AUDIO SYNTHESIZER (RAZOR CLICKS & AMBIENT DRONE)
   ========================================================================== */
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;
let isAudioActive = false;

function initAudioEngine() {
  const toggleBtn = document.getElementById('audio-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioActive = !isAudioActive;
    toggleBtn.classList.toggle('audio-active', isAudioActive);
    const label = toggleBtn.querySelector('.audio-label');

    if (isAudioActive) {
      startAmbientSound();
      if (label) label.textContent = 'AUDIO ON';
      playRazorSnip();
    } else {
      stopAmbientSound();
      if (label) label.textContent = 'AUDIO OFF';
    }
  });

  // Attach tactile razor feedback to interactive elements
  document.querySelectorAll('button, .selector-pill, .dossier-tab-btn, .time-slot-btn, .btn-monolith').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isAudioActive) playRazorSnip();
    });
  });
}

function startAmbientSound() {
  if (!audioCtx) return;
  try {
    // Warm low-frequency atelier room hum
    ambientOsc = audioCtx.createOscillator();
    ambientGain = audioCtx.createGain();

    ambientOsc.type = 'sine';
    ambientOsc.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

    ambientGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    ambientGain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 2);

    ambientOsc.connect(ambientGain);
    ambientGain.connect(audioCtx.destination);
    ambientOsc.start();
  } catch (e) {
    console.warn('Audio synthesis initialized', e);
  }
}

function stopAmbientSound() {
  if (ambientGain && audioCtx) {
    try {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientOsc) {
          ambientOsc.stop();
          ambientOsc.disconnect();
          ambientOsc = null;
        }
      }, 500);
    } catch (e) {
      // Audio stop safeguard
    }
  }
}

function playRazorSnip() {
  if (!audioCtx) return;
  try {
    const bufferSize = audioCtx.sampleRate * 0.05; // 50ms snip
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2800;
    filter.Q.value = 4;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    noise.start();
  } catch (e) {
    // Fallback safe
  }
}

/* ==========================================================================
   3. CUSTOM FLUID MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const dot = document.querySelector('.custom-cursor-dot');
  if (!cursor || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function loop() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .hotspot-pin, .ledger-item, .selector-pill, .time-slot-btn').forEach(target => {
    target.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    target.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   4. THE SPECIMEN DOSSIER (INTERACTIVE CUT ANATOMY LOOKBOOK)
   ========================================================================== */
const specimensData = {
  '01': {
    name: 'MID-FADE & SCULPTED GEOMETRY',
    tagline: 'SPECIMEN A-01: SURGICAL TRANSITION',
    img: 'assets/img/look_fade.jpg',
    description: 'Arquitectura milimétrica con degradado medio que se desvanece suavemente a piel expuesta. Contornos afeitados a navaja de acero damasco con acabado satinado. Diseñado para proyectar autoridad ejecutiva con filo urbano.',
    specs: [
      { label: 'TRANSICIÓN', val: '0.0mm a 4.5mm' },
      { label: 'ÁNGULO DE CAÍDA', val: '28° Anatómico' },
      { label: 'ACABADO', val: 'Matte Clay / Low Sheen' },
      { label: 'DURACIÓN DE FILO', val: '14 - 18 Días' }
    ],
    hotspots: [
      { top: '35%', left: '26%', title: 'Micro-Taper Zero', desc: 'Desvanecido quirúrgico al ras' },
      { top: '22%', left: '60%', title: 'Textura Superior', desc: 'Capas desconectadas con navaja' },
      { top: '56%', left: '55%', title: 'Contorno de Barba', desc: 'Línea de mandíbula esculpida 90°' }
    ]
  },
  '02': {
    name: 'TEXTURED STREET CROP // TAPER',
    tagline: 'SPECIMEN B-02: RAW BRUTALIST CROP',
    img: 'assets/img/look_crop.jpg',
    description: 'Frente blunt con textura quebrada artesanal. Inspirado en la alta sastrería callejera europea y la vanguardia estética berlinesa. El corte mantiene densidad superior con peso controlado y volumen dinámico.',
    specs: [
      { label: 'TEXTURA', val: 'Feathered Shear Razor' },
      { label: 'LÍNEA FRONTAL', val: 'Blunt Razor Cut' },
      { label: 'PRODUCTO', val: 'Sea Salt & Volcanic Dust' },
      { label: 'ESTILO', val: 'Avant-Garde Streetwear' }
    ],
    hotspots: [
      { top: '15%', left: '48%', title: 'Textura Fracturada', desc: 'Vaciado por mechones a 45°' },
      { top: '28%', left: '58%', title: 'Sien Pulida', desc: 'Drop taper de baja penetración' },
      { top: '22%', left: '38%', title: 'Frontal Estructurado', desc: 'Navajazo recto sin compresión' }
    ]
  },
  '03': {
    name: 'DAMASCUS STRAIGHT RAZOR CRAFT',
    tagline: 'SPECIMEN C-03: THE BLADE RITUAL',
    img: 'assets/img/blade_craft.jpg',
    description: 'El pináculo del afeitado clásico reimaginado con tecnología de vapor con ozono, toallas térmicas infusionadas con eucalipto silvestre y navaja de acero damasquino forjado a mano. El contorno definitivo.',
    specs: [
      { label: 'HOJA', val: 'Damascus Steel 60 HRC' },
      { label: 'INFUSIÓN', val: 'Eucalipto & Bergamota' },
      { label: 'SELLADO', val: 'Piedra de Alumbre Fría' },
      { label: 'EXPERIENCIA', val: 'Silenciosa / Zen' }
    ],
    hotspots: [
      { top: '48%', left: '55%', title: 'Hoja de Precisión', desc: 'Acero damasco a 30° constante' },
      { top: '65%', left: '60%', title: 'Espuma Caliente', desc: 'Lather batido en cuenco de nogal' },
      { top: '78%', left: '45%', title: 'Línea del Cuello', desc: 'Definición simétrica con láser' }
    ]
  }
};

function initSpecimenDossier() {
  const tabs = document.querySelectorAll('.dossier-tab-btn');
  const imgEl = document.getElementById('specimen-img');
  const nameEl = document.getElementById('specimen-name');
  const taglineEl = document.getElementById('specimen-tagline');
  const descEl = document.getElementById('specimen-desc');
  const specsContainer = document.getElementById('specimen-specs-container');
  const hotspotsContainer = document.getElementById('hotspots-layer');

  if (!imgEl || !tabs.length) return;

  function loadSpecimen(id) {
    const data = specimensData[id];
    if (!data) return;

    // Smooth fade effect
    imgEl.style.opacity = '0';
    setTimeout(() => {
      imgEl.src = data.img;
      imgEl.alt = data.name;
      imgEl.style.opacity = '1';
    }, 200);

    if (nameEl) nameEl.textContent = data.name;
    if (taglineEl) taglineEl.textContent = data.tagline;
    if (descEl) descEl.textContent = data.description;

    // Render Specs
    if (specsContainer) {
      specsContainer.innerHTML = data.specs.map(s => `
        <div class="spec-cell">
          <div class="spec-cell-label">${s.label}</div>
          <div class="spec-cell-value ${s.label === 'TRANSICIÓN' || s.label === 'HOJA' ? 'highlight' : ''}">${s.val}</div>
        </div>
      `).join('');
    }

    // Render Hotspots
    if (hotspotsContainer) {
      hotspotsContainer.innerHTML = data.hotspots.map(h => `
        <div class="hotspot-pin" style="top: ${h.top}; left: ${h.left};">
          <div class="hotspot-radar"></div>
          <div class="hotspot-center"></div>
          <div class="hotspot-tooltip">
            <strong>${h.title}</strong><br>
            <span>${h.desc}</span>
          </div>
        </div>
      `).join('');
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const id = tab.getAttribute('data-specimen');
      loadSpecimen(id);
    });
  });

  // Initial load
  loadSpecimen('01');
}

/* ==========================================================================
   5. INTERACTIVE VIP BOOKING PROTOCOL & TICKET BOARDING PASS
   ========================================================================== */
const bookingState = {
  service: 'THE ARCHITECTURAL CUT',
  price: '$65 USD',
  barber: 'ENZO VALENTI',
  date: 'HOY',
  time: '15:30',
  beverage: 'DOBLE ESPRESSO',
  clientName: 'GUEST ATELIER',
  ticketCode: 'VLT-' + Math.floor(100000 + Math.random() * 900000)
};

function initBookingProtocol() {
  const form = document.getElementById('booking-form');
  const servicePills = document.querySelectorAll('.service-pill');
  const barberPills = document.querySelectorAll('.barber-pill');
  const beveragePills = document.querySelectorAll('.beverage-pill');
  const timeBtns = document.querySelectorAll('.time-slot-btn:not(.unavailable)');
  const clientInput = document.getElementById('client-name-input');

  // Preview elements
  const passService = document.getElementById('pass-service');
  const passPrice = document.getElementById('pass-price');
  const passBarber = document.getElementById('pass-barber');
  const passDateTime = document.getElementById('pass-datetime');
  const passBeverage = document.getElementById('pass-beverage');
  const passCode = document.getElementById('pass-code');

  function updatePass() {
    if (passService) passService.textContent = bookingState.service;
    if (passPrice) passPrice.textContent = bookingState.price;
    if (passBarber) passBarber.textContent = bookingState.barber;
    if (passDateTime) passDateTime.textContent = `${bookingState.date} • ${bookingState.time}`;
    if (passBeverage) passBeverage.textContent = bookingState.beverage;
    if (passCode) passCode.textContent = bookingState.ticketCode;
  }

  // Service pill click
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      bookingState.service = pill.getAttribute('data-name');
      bookingState.price = pill.getAttribute('data-price');
      updatePass();
    });
  });

  // Barber pill click
  barberPills.forEach(pill => {
    pill.addEventListener('click', () => {
      barberPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      bookingState.barber = pill.getAttribute('data-barber');
      updatePass();
    });
  });

  // Beverage pill click
  beveragePills.forEach(pill => {
    pill.addEventListener('click', () => {
      beveragePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      bookingState.beverage = pill.getAttribute('data-bev');
      updatePass();
    });
  });

  // Time slot click
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.time = btn.getAttribute('data-time');
      updatePass();
    });
  });

  // Client name change
  if (clientInput) {
    clientInput.addEventListener('input', (e) => {
      bookingState.clientName = e.target.value.trim() || 'GUEST ATELIER';
    });
  }

  // Handle booking form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const modal = document.getElementById('booking-modal');
      const modalClient = document.getElementById('modal-client-name');
      const modalCode = document.getElementById('modal-booking-code');

      if (modalClient) modalClient.textContent = bookingState.clientName.toUpperCase();
      if (modalCode) modalCode.textContent = bookingState.ticketCode;
      if (modal) modal.classList.add('active');

      // Celebration tone
      if (isAudioActive && audioCtx) {
        playConfirmationChime();
      }
    });
  }

  const closeModalBtn = document.getElementById('modal-close-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      const modal = document.getElementById('booking-modal');
      if (modal) modal.classList.remove('active');
    });
  }

  updatePass();
}

function playConfirmationChime() {
  if (!audioCtx) return;
  try {
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
    freqs.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + idx * 0.08);
      osc.stop(audioCtx.currentTime + idx * 0.08 + 0.6);
    });
  } catch (e) {}
}

/* ==========================================================================
   6. LEDGER CLICKS DIRECT TO BOOKING
   ========================================================================== */
function initLedgerTriggers() {
  document.querySelectorAll('.ledger-item').forEach(item => {
    item.addEventListener('click', () => {
      const sName = item.getAttribute('data-service');
      const sPrice = item.getAttribute('data-price');
      if (!sName) return;

      const targetPill = document.querySelector(`.service-pill[data-name="${sName}"]`);
      if (targetPill) {
        targetPill.click();
      }

      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const dropdown = document.getElementById('dropdown-menu');
  if (!toggle || !dropdown) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    dropdown.classList.toggle('active');
  });

  // Close when clicking any link
  dropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      dropdown.classList.remove('active');
    });
  });
}

/* ==========================================================================
   8. PROCEDURAL 2D CANVAS QR CODE MATRIX
   ========================================================================== */
function drawProceduralQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 15; // 15x15 grid
  const cellSize = canvas.width / size;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000000';

  // Seeded pattern to look like authentic cyber barcode/QR
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Corner position squares
      const inTopLeft = r < 4 && c < 4;
      const inTopRight = r < 4 && c >= size - 4;
      const inBottomLeft = r >= size - 4 && c < 4;

      if (inTopLeft || inTopRight || inBottomLeft) {
        const isBorder = (r === 0 || r === 3 || c === 0 || c === 3) ||
                         (r === 0 || r === 3 || c === size - 1 || c === size - 4) ||
                         (r === size - 1 || r === size - 4 || c === 0 || c === 3);
        const isCenter = (r >= 1 && r <= 2 && c >= 1 && c <= 2) ||
                         (r >= 1 && r <= 2 && c >= size - 3 && c <= size - 2) ||
                         (r >= size - 3 && r <= size - 2 && c >= 1 && c <= 2);
        if (isBorder || isCenter) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      } else {
        // Pseudo-random deterministic fill
        if ((r * 7 + c * 13 + (r * c)) % 3 === 0) {
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
        }
      }
    }
  }
}
