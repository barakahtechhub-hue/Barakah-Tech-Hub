/* Barakah Tech Hub — Cookies + toggle de precios (al contado vs plan) */
(function () {
  'use strict';

  // ---------- Banner de cookies ----------
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  const rejectBtn = document.getElementById('cookieReject');
  const CONSENT_KEY = 'barakah_cookie_consent';

  function showBanner() { if (banner) banner.classList.add('visible'); }
  function hideBanner() { if (banner) banner.classList.remove('visible'); }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
    hideBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => setConsent('all'));
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => setConsent('essential'));
  }

  if (banner) {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) showBanner();
  }

  // ---------- Toggle de precios: al contado / plan ----------
  const toggle = document.getElementById('planToggle');
  const pricesContado = document.querySelectorAll('.plan-price:not(.plan-price-plan)');
  const pricesPlan = document.querySelectorAll('.plan-price-plan');
  const planOnly = document.querySelectorAll('.plan-only');

  if (toggle) {
    function applyMode(isPlan) {
      pricesContado.forEach((el) => { el.style.display = isPlan ? 'none' : 'inline'; });
      pricesPlan.forEach((el) => {
        el.style.display = isPlan ? 'inline' : 'none';
        el.classList.toggle('display', isPlan);
      });
      planOnly.forEach((el) => { el.style.display = isPlan ? 'list-item' : 'none'; });
    }

    toggle.addEventListener('change', (e) => applyMode(e.target.checked));

    // Inicializar: por defecto mostramos al contado
    applyMode(false);
  }
})();