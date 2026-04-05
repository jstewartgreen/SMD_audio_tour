// Landing page logic: language toggle + stop card generation
(function () {
  'use strict';

  let lang = 'en';

  // ── Render stop cards from stops.js data ───────────────────────
  const container = document.getElementById('stop-cards');
  STOPS.forEach(function (stop, i) {
    const card = document.createElement('div');
    card.className = 'stop-card';

    card.innerHTML =
      '<div class="card-num">' + (i + 1) + '</div>' +
      '<div class="card-body">' +
        '<h3 class="card-name">' + escHtml(stop.name_en) + '</h3>' +
        '<p class="card-desc">' + escHtml(stop.description_en.split('.')[0] + '.') + '</p>' +
      '</div>';

    card.dataset.nameEn   = stop.name_en;
    card.dataset.nameEs   = stop.name_es;
    card.dataset.descEn   = stop.description_en.split('.')[0] + '.';
    card.dataset.descEs   = stop.description_es.split('.')[0] + '.';

    container.appendChild(card);
  });

  // ── Language toggle ────────────────────────────────────────────
  const toggle = document.getElementById('lang-toggle-landing');

  toggle.addEventListener('click', function () {
    lang = lang === 'en' ? 'es' : 'en';
    toggle.textContent = lang === 'en' ? 'ES' : 'EN';
    toggle.setAttribute('aria-label', lang === 'en' ? 'Switch to Spanish' : 'Switch to English');
    document.documentElement.lang = lang;
    applyLang();
  });

  // Persist language choice (only known values) so map.html picks it up
  toggle.addEventListener('click', function () {
    try { sessionStorage.setItem('lang', lang === 'es' ? 'es' : 'en'); } catch (e) {}
  });

  function applyLang() {
    // Update all elements with data-en / data-es attributes
    document.querySelectorAll('[data-' + lang + ']').forEach(function (el) {
      el.textContent = el.dataset[lang];
    });

    // Update stop cards
    document.querySelectorAll('.stop-card').forEach(function (card) {
      card.querySelector('.card-name').textContent = card.dataset['name' + cap(lang)];
      card.querySelector('.card-desc').textContent = card.dataset['desc' + cap(lang)];
    });
  }

  // ── Pass language to map page via URL param ────────────────────
  document.querySelectorAll('a[href="map.html"]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('lang', lang); } catch (e) {}
    });
  });

  // ── Helpers ────────────────────────────────────────────────────
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function escHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
