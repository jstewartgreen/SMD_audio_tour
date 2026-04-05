// ─────────────────────────────────────────────────────────────────
// San Miguel de Allende Audio Tour — App Logic
// Depends on: stops.js (defines STOPS array), Leaflet library
// ─────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────────
  let lang = (function () {
    try {
      const stored = sessionStorage.getItem('lang');
      return stored === 'es' ? 'es' : 'en'; // only accept known values
    } catch (e) { return 'en'; }
  }());
  let currentStop  = null;
  let activePinEl  = null;
  let imgList      = [];   // images[] for the open stop
  let imgIdx       = 0;   // current carousel position

  // ── DOM references ─────────────────────────────────────────────
  const sheet           = document.getElementById('bottom-sheet');
  const overlay         = document.getElementById('overlay');
  const closeBtn        = document.getElementById('close-btn');
  const langToggle      = document.getElementById('lang-toggle');
  const stopNumber      = document.getElementById('stop-number');
  const stopName        = document.getElementById('stop-name');
  const stopDesc        = document.getElementById('stop-description');
  const player          = document.getElementById('audio-player');
  const carousel        = document.getElementById('image-carousel');
  const carouselImg     = document.getElementById('carousel-img');
  const imgPrev         = document.getElementById('img-prev');
  const imgNext         = document.getElementById('img-next');
  const imgDots         = document.getElementById('img-dots');
  const parroquiaBtn    = document.getElementById('parroquia-map-btn');
  const parroquiaModal  = document.getElementById('parroquia-modal');
  const modalClose      = document.getElementById('parroquia-modal-close');

  // Sync toggle label with restored language
  if (lang === 'es') {
    langToggle.textContent = 'EN';
    langToggle.setAttribute('aria-label', 'Switch to English');
    document.documentElement.lang = 'es';
  }

  // ── Map ────────────────────────────────────────────────────────
  const map = L.map('map', {
    center: [20.9131, -100.7452],
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
    });

    const marker = L.marker([stop.lat, stop.lng], { icon: icon }).addTo(map);

    marker.on('add', function () {
      const el = marker.getElement();
      if (el) marker._pinInner = el.querySelector('.pin-inner');
    });

    marker.on('click', function () {
      openStop(stop, index + 1, marker);
    });
  });

  // ── Open a stop ────────────────────────────────────────────────
  function openStop(stop, number, marker) {
    currentStop = stop;

    // Highlight active pin
    if (activePinEl) activePinEl.classList.remove('active');
    activePinEl = marker._pinInner || null;
    if (activePinEl) activePinEl.classList.add('active');

    // Stop number label
    stopNumber.textContent = 'Stop ' + number;

    // Image carousel
    imgList = stop.images || [];
    imgIdx  = 0;
    renderCarousel();

    // Parroquia map button (stops 6 & 7 only)
    parroquiaBtn.style.display = stop.parroquia_map ? 'inline-block' : 'none';

    // Text + audio
    updateLanguage(stop);

    // Show sheet
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
  }

  // ── Image carousel ─────────────────────────────────────────────
  function renderCarousel() {
    if (imgList.length === 0) {
      carousel.style.display = 'none';
      return;
    }

    carousel.style.display = 'block';
    carouselImg.src = imgList[imgIdx];
    carouselImg.alt = currentStop ? (currentStop['name_' + lang] || '') : '';
    carouselImg.onerror = function () {
      // Skip broken images and try the next one
      if (imgIdx < imgList.length - 1) {
        imgIdx++;
        renderCarousel();
      } else {
        carousel.style.display = 'none';
      }
    };

    const multi = imgList.length > 1;
    imgPrev.style.display = multi ? 'flex' : 'none';
    imgNext.style.display = multi ? 'flex' : 'none';

    // Rebuild dots
    imgDots.innerHTML = '';
    if (multi) {
      imgList.forEach(function (_, i) {
        const dot = document.createElement('span');
        dot.className = 'img-dot' + (i === imgIdx ? ' active' : '');
        dot.addEventListener('click', function () { imgIdx = i; renderCarousel(); });
        imgDots.appendChild(dot);
      });
    }
  }

  imgPrev.addEventListener('click', function () {
    if (imgIdx > 0) { imgIdx--; renderCarousel(); }
  });

  imgNext.addEventListener('click', function () {
    if (imgIdx < imgList.length - 1) { imgIdx++; renderCarousel(); }
  });

  // ── Update text + audio for current language ───────────────────
  function updateLanguage(stop) {
    stopName.textContent = stop['name_' + lang] || stop.name_en;
    stopDesc.textContent = stop['description_' + lang] || stop.description_en;

    // Fall back to English audio if no Spanish version exists
    const src = stop['audio_' + lang] || stop.audio_en || '';
    if (player.getAttribute('src') !== src) {
      player.pause();
      player.setAttribute('src', src);
      player.load();
    }
  }

  // ── Language toggle ────────────────────────────────────────────
  langToggle.addEventListener('click', function () {
    lang = lang === 'en' ? 'es' : 'en';
    langToggle.textContent = lang === 'en' ? 'ES' : 'EN';
    langToggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Switch to English');
    document.documentElement.lang = lang;
    try { sessionStorage.setItem('lang', lang); } catch (e) {}
    if (currentStop) updateLanguage(currentStop);
  });

  // ── Parroquia modal ────────────────────────────────────────────
  parroquiaBtn.addEventListener('click', function () {
    parroquiaModal.classList.add('open');
    parroquiaModal.setAttribute('aria-hidden', 'false');
  });

  function closeParroquiaModal() {
    parroquiaModal.classList.remove('open');
    parroquiaModal.setAttribute('aria-hidden', 'true');
  }

  modalClose.addEventListener('click', closeParroquiaModal);
  parroquiaModal.addEventListener('click', function (e) {
    if (e.target === parroquiaModal) closeParroquiaModal();
  });

  // ── Close bottom sheet ─────────────────────────────────────────
  function closeSheet() {
    player.pause();
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    if (activePinEl) { activePinEl.classList.remove('active'); activePinEl = null; }
    currentStop = null;
  }

  closeBtn.addEventListener('click', closeSheet);
  overlay.addEventListener('click', closeSheet);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (parroquiaModal.classList.contains('open')) closeParroquiaModal();
      else if (currentStop) closeSheet();
    }
  });

})();
