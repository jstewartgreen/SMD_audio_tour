// ─────────────────────────────────────────────────────────────────
// San Miguel de Allende Audio Tour — App Logic
// Depends on: stops.js (defines STOPS array), Leaflet library
// ─────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────
  let lang = 'en';
  let currentStop = null;
  let activePinEl = null;

  // ── DOM references ─────────────────────────────────────────────
  const sheet      = document.getElementById('bottom-sheet');
  const overlay    = document.getElementById('overlay');
  const closeBtn   = document.getElementById('close-btn');
  const langToggle = document.getElementById('lang-toggle');
  const stopImage  = document.getElementById('stop-image');
  const stopNumber = document.getElementById('stop-number');
  const stopName   = document.getElementById('stop-name');
  const stopDesc   = document.getElementById('stop-description');
  const player     = document.getElementById('audio-player');

  // ── Map setup ──────────────────────────────────────────────────
  // Centered on the Jardín Principal, the heart of San Miguel
  const map = L.map('map', {
    center: [20.9131, -100.7450],
    zoom: 16,
    zoomControl: true,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // ── Place pins ─────────────────────────────────────────────────
  STOPS.forEach(function (stop, index) {
    const pinEl = document.createElement('div');
    pinEl.className = 'pin-inner';
    pinEl.textContent = index + 1;

    const icon = L.divIcon({
      className: 'stop-pin',
      html: pinEl.outerHTML,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20],
    });

    const marker = L.marker([stop.lat, stop.lng], { icon: icon }).addTo(map);

    // Keep a reference to the pin DOM element so we can highlight it
    marker.on('add', function () {
      const el = marker.getElement();
      if (el) {
        const inner = el.querySelector('.pin-inner');
        marker._pinInner = inner;
      }
    });

    marker.on('click', function () {
      openStop(stop, index + 1, marker);
    });
  });

  // ── Open a stop ────────────────────────────────────────────────
  function openStop(stop, number, marker) {
    currentStop = stop;

    // Highlight the tapped pin, un-highlight the previous one
    if (activePinEl) activePinEl.classList.remove('active');
    activePinEl = marker._pinInner || null;
    if (activePinEl) activePinEl.classList.add('active');

    // Stop number label
    stopNumber.textContent = 'Stop ' + number;

    // Photo (hide if missing)
    if (stop.image) {
      stopImage.src = stop.image;
      stopImage.alt = stop['name_' + lang] || stop.name_en;
      stopImage.style.display = 'block';
      stopImage.onerror = function () { stopImage.style.display = 'none'; };
    } else {
      stopImage.style.display = 'none';
    }

    // Text + audio for current language
    updateLanguage(stop);

    // Show sheet
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
  }

  // ── Update text/audio when language changes ────────────────────
  function updateLanguage(stop) {
    stopName.textContent = stop['name_' + lang] || stop.name_en;
    stopDesc.textContent = stop['description_' + lang] || stop.description_en;

    const src = stop['audio_' + lang] || '';
    if (player.src !== src) {          // avoid reloading the same file
      player.pause();
      player.src = src;
      player.load();
    }
  }

  // ── Close sheet ────────────────────────────────────────────────
  function closeSheet() {
    player.pause();
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    if (activePinEl) {
      activePinEl.classList.remove('active');
      activePinEl = null;
    }
    currentStop = null;
  }

  // ── Language toggle ────────────────────────────────────────────
  langToggle.addEventListener('click', function () {
    lang = lang === 'en' ? 'es' : 'en';
    langToggle.textContent = lang === 'en' ? 'ES' : 'EN';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Switch to English');
    document.documentElement.lang = lang;

    if (currentStop) {
      updateLanguage(currentStop);
    }
  });

  // ── Close via button or overlay tap ────────────────────────────
  closeBtn.addEventListener('click', closeSheet);
  overlay.addEventListener('click', closeSheet);

  // ── Keyboard accessibility ─────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && currentStop) closeSheet();
  });

})();
