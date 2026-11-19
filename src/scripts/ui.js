// Small vanilla JS: reveals, video-on-tap, drawers (focus trap, Esc). Ask Gate lives in askgate.js. No third-party code.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lang = document.documentElement.lang;

// delays set via CSSOM (CSP-safe)
$$('[data-delay]').forEach((el) => el.style.setProperty('--d', `${el.dataset.delay}ms`));

// Section reveals (600-700ms soft, once)
const root = document.documentElement;
if (root.classList.contains('reveal-ready')) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.reveal').forEach((el) => io.observe(el));
}

// Header: transparent over the hero, solid lavender once the hero top has scrolled away
const header = $('[data-header]');
const heroEl = $('[data-hero]');
if (header) {
  const setSolid = () => header.classList.toggle('is-solid', window.scrollY > (heroEl ? 40 : 16));
  setSolid();
  window.addEventListener('scroll', setSolid, { passive: true });
}

// Client logos: the colour versions only show on desktop hover / focus, so they are fetched on the first approach to the grid
// (Stage R: they used to download ~280 KB on every visit, phones included). Without JS the ink logos simply stay.
const clientGrid = $('[data-clients]');
if (clientGrid && window.matchMedia('(hover: hover) and (min-width: 768px)').matches) {
  const loadColour = () => { $$('img[data-src]', clientGrid).forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); }); };
  clientGrid.addEventListener('pointerenter', loadColour, { once: true });
  clientGrid.addEventListener('focusin', loadColour, { once: true });
}

// Hero reel: muted background loop. Poster first; paused when off-screen; user pause/play; reduced motion = poster only.
const reel = $('[data-hero-video]');
const toggle = $('[data-hero-toggle]');
if (reel && heroEl) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false, onScreen = true;
  const stopReel = () => { reel.pause(); reel.removeAttribute('autoplay'); [...reel.querySelectorAll('source')].forEach((s) => s.remove()); reel.load(); heroEl.classList.add('no-video'); };
  const label = () => {
    const paused = reel.paused;
    heroEl.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause);
  };
  if (reduced.matches) stopReel();
  else {
    const show = () => reel.classList.add('is-ready');
    if (reel.readyState >= 3) show(); else reel.addEventListener('playing', show, { once: true });
    reel.addEventListener('play', label); reel.addEventListener('pause', label);
    const sync = () => { if (userPaused || !onScreen || document.hidden) reel.pause(); else reel.play().catch(() => label()); };
    new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }, { threshold: 0.05 }).observe(heroEl);
    document.addEventListener('visibilitychange', sync);
    toggle.addEventListener('click', () => { userPaused = !reel.paused; sync(); label(); });
    reduced.addEventListener('change', (m) => { if (m.matches) stopReel(); });
    label();
  }
}

// Work video cards: poster first, plays on tap with controls (never autoplays)
$$('[data-play]').forEach((btn) => btn.addEventListener('click', () => {
  const card = btn.closest('[data-video-card]');
  const v = document.createElement('video');
  v.src = card.dataset.video; v.controls = true; v.playsInline = true; v.preload = 'auto';
  v.setAttribute('aria-label', btn.getAttribute('aria-label'));
  card.querySelector('.work__frame').replaceChildren(v);
  card.classList.add('is-playing');
  v.play().catch(() => {});
  v.focus();
}));

// Sheets: proposal drawer, mobile nav (Ask Gate is its own window: askgate.js; the two talk through g33:sheet / g33:ag-open)
const scrim = $('[data-scrim]');
const sheets = Object.fromEntries($$('[data-sheet]').map((s) => [s.dataset.sheet, s]));
let active = null, lastFocus = null;
const focusables = (el) => $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', el).filter((n) => !n.hidden && n.offsetParent !== null);

function open(name, trigger) {
  if (active) close(false);
  const s = sheets[name]; if (!s) return;
  // Proposal drawer: a trigger may pre-select a service (data-service="<slug>"); service pages pre-select their own in the markup.
  const pick = trigger && trigger.closest && trigger.closest('[data-service]');
  const sel = name === 'drawer' && s.querySelector('[data-service-select]');
  if (sel && pick && [...sel.options].some((o) => o.value === pick.dataset.service)) sel.value = pick.dataset.service;
  // Package triggers (Home / service / packages cards, compare table): show the package in the sheet and send it along.
  if (name === 'drawer') {
    const pk = trigger && trigger.closest && trigger.closest('[data-package]');
    const note = s.querySelector('[data-package-note]'), inp = s.querySelector('[data-package-input]');
    if (note && inp) { inp.value = pk ? pk.dataset.package : ''; note.hidden = !pk; s.querySelector('[data-package-name]').textContent = inp.value; }
  }
  document.dispatchEvent(new CustomEvent('g33:sheet')); // Ask Gate steps aside
  active = s; lastFocus = trigger || document.activeElement;
  if (lastFocus && lastFocus.closest && lastFocus.closest('[data-ag]')) lastFocus = document.querySelector('[data-ag-launcher]');
  s.classList.add('is-open'); scrim.classList.add('is-open'); document.body.classList.add('lock');
  document.dispatchEvent(new CustomEvent('g33:lock', { detail: true })); // motion/smooth.js pauses Lenis
  // inert background while open
  $$('body > *').forEach((n) => { if (n !== s && n !== scrim && !n.classList.contains('sheet')) n.setAttribute('inert', ''); });
  setTimeout(() => (focusables(s)[1] || s).focus(), 60);
}
function close(restore = true) {
  if (!active) return;
  active.classList.remove('is-open'); scrim.classList.remove('is-open'); document.body.classList.remove('lock');
  document.dispatchEvent(new CustomEvent('g33:lock', { detail: false }));
  $$('[inert]').forEach((n) => n.removeAttribute('inert'));
  const f = lastFocus; active = null;
  if (restore && f && f.focus) f.focus();
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-open-drawer],[data-open-nav],[data-close]');
  if (!t) return;
  if (t.matches('[data-close]')) {
    const href = t.getAttribute('href');
    if (!href) { e.preventDefault(); close(); return; }
    const url = new URL(href, location.href);
    if (url.pathname === location.pathname && url.hash) { e.preventDefault(); close(false); location.hash = url.hash; return; }
    close(false); return; // another page: let the browser navigate
  }
  e.preventDefault();
  const trigger = t;
  if (t.matches('[data-open-drawer]')) open('drawer', trigger);
  else if (t.matches('[data-open-nav]')) open('nav', trigger);
});
scrim.addEventListener('click', () => close());
document.addEventListener('keydown', (e) => {
  if (!active) return;
  if (e.key === 'Escape') { e.preventDefault(); close(); }
  if (e.key === 'Tab') {
    const f = focusables(active); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// Ask Gate opening closes any open sheet
document.addEventListener('g33:ag-open', () => close(false));

// Proposal form is an inert shell in Phase 1
$('[data-proposal-form]').addEventListener('submit', (e) => {
  e.preventDefault();
  $('[data-form-status]').textContent = lang === 'ar' ? 'النموذج غير مفعَّل في نسخة المعاينة، ولم يُرسَل أي شيء.' : 'This form is not connected in the preview. Nothing was sent.';
});

// FAQ accordion (service pages): button[aria-expanded] + region. One open at a time; height eases open in CSS (grid rows).
// Without JS (no .faq--js) every answer stays visible.
$$('[data-faq]').forEach((faq) => {
  faq.classList.add('faq--js');
  const items = $$('[data-faq-item]', faq);
  const set = (item, open) => {
    item.classList.toggle('is-open', open);
    $('[data-faq-btn]', item).setAttribute('aria-expanded', String(open));
  };
  items.forEach((item) => $('[data-faq-btn]', item).addEventListener('click', () => {
    const open = !item.classList.contains('is-open');
    items.forEach((o) => o !== item && set(o, false));
    set(item, open);
  }));
});

// Service hero loop (Creative Production): short muted clip, loaded only when visible; paused off-screen / tab hidden;
// visible pause/play control. Reduced motion = the poster image only (the video never loads).
$$('[data-loop-video]').forEach((v) => {
  const fig = v.closest('.svc-visual'); const btn = fig && $('[data-loop-toggle]', fig);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let user = false, on = false, loaded = false;
  const label = () => { fig.classList.toggle('is-paused', v.paused); if (btn) btn.setAttribute('aria-label', v.paused ? btn.dataset.labelPlay : btn.dataset.labelPause); };
  const sync = () => {
    if (on && !loaded) { v.src = v.dataset.loopVideo; loaded = true; v.addEventListener('playing', () => v.classList.add('is-ready'), { once: true }); if (btn) btn.hidden = false; }
    if (!loaded) return;
    if (user || !on || document.hidden) v.pause(); else v.play().catch(() => label());
  };
  v.addEventListener('play', label); v.addEventListener('pause', label);
  new IntersectionObserver(([e]) => { on = e.isIntersecting; sync(); }, { threshold: 0.1 }).observe(fig);
  document.addEventListener('visibilitychange', sync);
  if (btn) btn.addEventListener('click', () => { user = !v.paused; sync(); label(); });
});
