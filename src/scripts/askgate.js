// Ask Gate (Stage 3.6): launcher that emerges on scroll, a chat window that grows out of it, typing + streamed mock replies.
// Copy and facts arrive as JSON from src/data/askgate.ts (#ag-data). Motion: GSAP (shared chunk with the motion system).
// Reduced motion: no bubble morph, no streaming, instant text. No network calls anywhere in this file.
import { gsap } from 'gsap';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = $('[data-ag]');
if (root) init();

function init() {
  const D = JSON.parse($('#ag-data').textContent);
  const { t, lang } = D;
  const launcher = $('[data-ag-launcher]', root), teaser = $('[data-ag-teaser]', root);
  const panel = $('[data-ag-panel]', root), shape = $('[data-ag-shape]', root);
  const body = $('[data-ag-body]', root), log = $('[data-ag-log]', root), chips = $('[data-ag-chips]', root);
  const form = $('[data-ag-form]', root), input = form.q, send = $('.ag-send', form);
  const hero = $('[data-hero]');
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rm = () => mq.matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, rm() ? 0 : ms));
  const ARROW = '<svg class="icon icon--arrow icon--flip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
  const TICK = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

  // ---------- 1. Launcher: emerges once ~40% of the hero has scrolled away, hides again near the top ----------
  let shown = false, isOpen = false, teased = false, teaserY = 0, teaserTimer = 0;
  const setShown = (v) => {
    if (v === shown) return; shown = v;
    launcher.classList.toggle('is-in', v);
    if (v) tease(); else hideTeaser();
  };
  const onScroll = () => {
    setShown(isOpen || !hero || window.scrollY > hero.offsetHeight * 0.4);
    if (!teaser.hidden && Math.abs(window.scrollY - teaserY) > 80) hideTeaser();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // 13 Nov (Ahmed): the launcher steps aside while the page is scrolling, so it never sits on the text being read,
  // and slides back about half a second after scrolling stops. Not while the chat is open.
  let restTimer = 0;
  window.addEventListener('scroll', () => {
    if (isOpen) return;
    launcher.classList.add('is-scrolling');
    clearTimeout(restTimer);
    restTimer = setTimeout(() => launcher.classList.remove('is-scrolling'), 550);
  }, { passive: true });

  // One teaser per session, beside the launcher; hides after 5s, on scroll, or when the chat opens.
  function tease() {
    if (teased) return; teased = true;
    try { if (sessionStorage.getItem('g33-ag-teaser')) return; sessionStorage.setItem('g33-ag-teaser', '1'); } catch (e) { /* storage blocked: show once per page */ }
    setTimeout(() => {
      if (!shown || isOpen) return;
      teaser.hidden = false; teaserY = window.scrollY;
      requestAnimationFrame(() => teaser.classList.add('is-in'));
      teaserTimer = setTimeout(hideTeaser, 5000);
    }, rm() ? 0 : 650);
  }
  function hideTeaser() {
    clearTimeout(teaserTimer);
    if (teaser.hidden) return;
    teaser.classList.remove('is-in');
    setTimeout(() => { teaser.hidden = true; }, rm() ? 0 : 260);
  }
  teaser.addEventListener('click', () => open(launcher));

  // ---------- 2. Open / close: the window grows out of the launcher (clip-path circle -> rounded window) ----------
  let lastFocus = null, tl = null, greeted = false, pendingIntent = null;
  const clip = (a) => `inset(${a[0]}px ${a[1]}px ${a[2]}px ${a[3]}px round ${a[4]}px)`;
  function geometry() {
    // fixed elements: offset* are viewport-relative and ignore transforms (the launcher may still be scaled to 0)
    const px = panel.offsetLeft, py = panel.offsetTop, pw = panel.offsetWidth, ph = panel.offsetHeight;
    const lx = launcher.offsetLeft, ly = launcher.offsetTop, ls = launcher.offsetWidth;
    const cs = getComputedStyle(panel);
    const gap = parseFloat(cs.getPropertyValue('--ag-gap')) || 0, r = parseFloat(cs.getPropertyValue('--ag-r')) || 0;
    return {
      from: [ly - py, px + pw - (lx + ls), py + ph - (ly + ls), lx - px, ls / 2],
      to: [0, 0, gap, 0, r],
      origin: `${lx - px + ls / 2}px ${ly - py + ls / 2}px`,
    };
  }
  function tweenClip(from, to, vars) {
    const k = ['t', 'r', 'b', 'l', 'q'], s = {}, end = {};
    k.forEach((n, i) => { s[n] = from[i]; end[n] = to[i]; });
    return gsap.to(s, { ...end, ...vars, onUpdate: () => { shape.style.clipPath = clip(k.map((n) => s[n])); } });
  }

  let modal = false;
  const isSheet = () => window.matchMedia('(max-width: 639px)').matches;

  function open(trigger, intent) {
    if (intent) pendingIntent = intent;
    if (isOpen) { runPending(); return; }
    document.dispatchEvent(new CustomEvent('g33:ag-open')); // ui.js closes any open sheet (mobile nav, drawer)
    isOpen = true; lastFocus = trigger && trigger !== launcher ? trigger : launcher;
    hideTeaser(); setShown(true);
    root.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true'); launcher.setAttribute('aria-label', launcher.dataset.labelClose);
    panel.hidden = false;
    // Ahmed 9 Nov: the page keeps scrolling while Gate is open (non-modal on desktop).
    // Only the mobile full-screen sheet locks the page behind it.
    modal = isSheet();
    panel.setAttribute('aria-modal', modal ? 'true' : 'false');
    if (modal) {
      document.body.classList.add('lock');
      document.dispatchEvent(new CustomEvent('g33:lock', { detail: true })); // motion/smooth.js pauses Lenis
      $$('body > *').forEach((n) => { if (n !== root && n.tagName !== 'SCRIPT') n.setAttribute('inert', ''); });
    }
    if (tl) tl.kill();
    const parts = $$('[data-ag-part], [data-ag-body]', shape);
    const focusIn = () => {
      const fine = window.matchMedia('(pointer: fine)').matches;
      (fine ? input : $('[data-ag-title]', shape)).focus({ preventScroll: true });
    };
    if (rm()) {
      shape.style.clipPath = ''; gsap.set(parts, { clearProps: 'all' }); focusIn(); greet(); return;
    }
    const g = geometry();
    gsap.set(shape, { transformOrigin: g.origin, scale: 0.9 });
    shape.style.clipPath = clip(g.from);
    gsap.set(parts, { autoAlpha: 0, y: 10 });
    tl = gsap.timeline({ onComplete: () => { shape.style.clipPath = ''; } }); // CSS holds the settled shape
    tl.add(tweenClip(g.from, g.to, { duration: 0.62, ease: 'expo.out' }), 0)
      .to(shape, { scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, 0)
      .to(parts, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.05, ease: 'power2.out' }, 0.34)
      .call(greet, null, 0.4)
      .call(focusIn); // after the composer is visible (a hidden field cannot take focus)
  }

  function close(restore = true, instant = false) {
    if (!isOpen) return;
    isOpen = false;
    root.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false'); launcher.setAttribute('aria-label', launcher.dataset.labelOpen);
    if (modal) {
      document.body.classList.remove('lock');
      document.dispatchEvent(new CustomEvent('g33:lock', { detail: false }));
      $$('[inert]').forEach((n) => n.removeAttribute('inert'));
    }
    modal = false;
    const done = () => { panel.hidden = true; shape.style.clipPath = ''; gsap.set(shape, { clearProps: 'transform' }); onScroll(); };
    if (tl) tl.kill();
    if (rm() || instant) done();
    else {
      const g = geometry();
      const parts = $$('[data-ag-part], [data-ag-body]', shape);
      gsap.set(shape, { transformOrigin: g.origin });
      tl = gsap.timeline({ onComplete: done });
      tl.to(parts, { autoAlpha: 0, duration: 0.14, ease: 'power1.in' }, 0)
        .add(tweenClip(g.to, g.from, { duration: 0.42, ease: 'power3.in' }), 0.06)
        .to(shape, { scale: 0.9, duration: 0.42, ease: 'power3.in' }, 0.06);
    }
    const f = lastFocus; lastFocus = null;
    if (restore && f && f.focus) f.focus({ preventScroll: true });
  }

  launcher.addEventListener('click', () => (isOpen ? close() : open(launcher)));
  $('[data-ag-close]', root).addEventListener('click', () => close());
  // Every "Ask Gate" button on the page (header, hero, services card, CTA, mobile nav) opens the same window.
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open-panel]');
    if (!b) return;
    e.preventDefault(); open(b, b.dataset.askIntent);
  });
  // Click outside the window closes it (the page behind is inert, so the click lands on <body>).
  // Mobile full-screen only: a tap outside closes it. On desktop the page stays usable, so clicks outside don't close Gate.
  document.addEventListener('pointerdown', (e) => {
    if (isOpen && modal && !shape.contains(e.target) && !launcher.contains(e.target)) close();
  });
  // A route inside the window opens the proposal drawer: ui.js tells us, we step aside without animation.
  document.addEventListener('g33:sheet', () => close(false, true));
  document.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab' || !modal) return; // focus trap only for the mobile full-screen sheet
    // DOM order: the launcher (desktop: stays visible as the close toggle) comes before the window
    const f = [launcher, ...$$('a[href], button:not([disabled]), textarea', shape)];
    const visible = f.filter((n) => n.getClientRects().length && !n.closest('[hidden]') && getComputedStyle(n).visibility !== 'hidden');
    if (!visible.length) return;
    const first = visible[0], last = visible[visible.length - 1];
    if (!visible.includes(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // ---------- 3. Conversation ----------
  let busy = false;
  const asked = new Set();
  const toEnd = (smooth) => body.scrollTo({ top: body.scrollHeight, behavior: smooth && !rm() ? 'smooth' : 'auto' });
  const appear = (el) => { if (!rm()) gsap.from(el, { autoAlpha: 0, y: 10, duration: 0.3, ease: 'power2.out' }); };
  function row(who) {
    const r = document.createElement('div'); r.className = `ag-msg ag-msg--${who}`;
    const b = document.createElement('p'); b.className = 'ag-bubble';
    const sr = document.createElement('span'); sr.className = 'visually-hidden'; sr.textContent = `${who === 'user' ? t.you : t.name}: `;
    b.append(sr); r.append(b); log.append(r); appear(r); toEnd(true);
    return { r, b };
  }
  async function stream(el, text) {
    const node = document.createTextNode(''); el.append(node);
    if (rm()) { node.data = text; return; }
    const parts = text.split(/(\s+)/); // word by word (Arabic letters stay joined)
    for (const w of parts) { node.data += w; if (/\S/.test(w)) { toEnd(); await sleep(26 + Math.random() * 38); } }
  }
  async function botSay(text, attach, wait = 600 + Math.random() * 600) {
    log.setAttribute('aria-busy', 'true');
    const dots = document.createElement('div'); dots.className = 'ag-msg ag-msg--bot ag-typing';
    dots.innerHTML = `<span class="ag-dots" role="img" aria-label="${t.typing}"><i></i><i></i><i></i></span>`;
    log.append(dots); appear(dots); toEnd(true);
    await sleep(wait);
    dots.remove();
    const { r, b } = row('bot');
    await stream(b, text);
    if (attach) { const a = render(attach); if (a) { r.append(a); appear(a); } }
    log.setAttribute('aria-busy', 'false');
    toEnd(true);
  }
  async function greet() {
    if (greeted) { runPending(); return; }
    greeted = true; busy = true;
    await botSay(t.greeting, null, 800);
    busy = false; runPending();
  }
  function runPending() { if (pendingIntent && greeted && !busy) { const i = pendingIntent; pendingIntent = null; const c = t.chips.find((x) => x.intent === i); ask(c ? c.text : i, i); } }

  async function ask(text, intent) {
    if (busy || !text) return;
    busy = true; send.disabled = true;
    if (intent) asked.add(intent);
    chips.classList.add('is-compact');
    chips.hidden = true;
    const { b } = row('user'); b.append(text);
    const reply = await getReply(text, intent);
    if (reply.intent) asked.add(reply.intent);
    await botSay(reply.text, reply.attach);
    renderChips();
    busy = false; send.disabled = !input.value.trim();
  }
  function renderChips() {
    const left = $$('.ag-chip', chips).filter((c) => !asked.has(c.dataset.intent));
    $$('.ag-chip', chips).forEach((c) => { c.hidden = asked.has(c.dataset.intent); });
    chips.hidden = !left.length;
    if (left.length) { body.append(chips); appear(chips); toEnd(true); }
  }
  chips.addEventListener('click', (e) => { const c = e.target.closest('.ag-chip'); if (c) ask(c.textContent.trim(), c.dataset.intent); });

  // Composer: Enter sends, Shift+Enter breaks the line, the field grows up to 5 lines, Send stays disabled until there is text.
  const grow = () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 132)}px`; };
  input.addEventListener('input', () => { send.disabled = busy || !input.value.trim(); grow(); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit', (e) => {
    e.preventDefault(); const v = input.value.trim(); if (!v || busy) return;
    input.value = ''; grow(); ask(v);
  });

  // ---------- 4. Replies ----------
  // ===== AI INTEGRATION POINT =====
  // Swap this one function for the Cloudflare Worker (Claude API) call later. It must resolve to
  // { text, attach?, intent? } where attach is one of: {kind:'services'} {kind:'service', i} {kind:'package', i, others}
  // {kind:'work', film} {kind:'routes', only?}. Typing dots, streaming, cards and accessibility stay as they are.
  async function getReply(question, intent) {
    return mockReply(question, intent);
  }

  const norm = (s) => s.toLowerCase().replace(/[ً-ْٰـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  const hit = (q, k) => { k = norm(k); return /^[a-z-]{1,4}$/.test(k) ? new RegExp(`\\b${k}\\b`).test(q) : q.includes(k); };
  const any = (q, keys) => keys.some((k) => hit(q, k));
  const fill = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => o[k]);
  const filmKeys = ['film', 'video', 'motion', 'reel', 'فيلم', 'افلام', 'فيديو', 'موشن'];

  function mockReply(question, intent) {
    const R = t.replies, q = norm(question || '');
    if (intent && intent.startsWith('pkg:')) return pkg(+intent.slice(4));
    if (!intent) {
      const pk = D.packages.findIndex((p) => any(q, p.keys) && any(q, [...D.intents.packages, 'package', 'باقه', ...p.keys.slice(0, 1)]));
      if (any(q, D.intents.person)) intent = 'person';
      else if (pk > -1) return pkg(pk);
      else if (any(q, D.intents.packages)) intent = 'packages';
      else if (any(q, D.intents.work)) return { text: any(q, filmKeys) ? R.workFilm : R.work, attach: { kind: 'work', film: any(q, filmKeys) }, intent: 'work' };
      else {
        let best = -1, score = 0;
        D.services.forEach((s, i) => { const n = s.keys.filter((k) => hit(q, k)).length; if (n > score) { score = n; best = i; } });
        if (best > -1) { const s = D.services[best]; return { text: fill(R.service, s), attach: { kind: 'service', i: best }, intent: 'services' }; }
        if (any(q, D.intents.services)) intent = 'services';
        else if (any(q, D.intents.hello)) return { text: R.hello };
        else if (any(q, D.intents.thanks)) return { text: R.thanks };
        else return { text: R.fallback, attach: { kind: 'routes', only: ['brief', 'call'] } };
      }
    }
    if (intent === 'person') return { text: R.person, attach: { kind: 'routes' }, intent };
    if (intent === 'packages') { const i = Math.max(0, D.packages.findIndex((p) => p.popular)); return { text: R.packages, attach: { kind: 'package', i, others: true }, intent }; }
    if (intent === 'work') return { text: R.work, attach: { kind: 'work' }, intent };
    return { text: R.services, attach: { kind: 'services' }, intent: 'services' };
  }
  function pkg(i) { const p = D.packages[i]; return { text: fill(t.replies.package, p), attach: { kind: 'package', i, others: true }, intent: 'packages' }; }

  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function render(a) {
    if (a.kind === 'services') {
      const ul = el('ul', 'ag-att ag-list');
      D.services.forEach((s) => { const li = el('li'); li.append(el('a', '', `<span>${esc(s.name)}</span>${ARROW}`)); li.firstChild.href = `/${lang}/services/${s.slug}/`; ul.append(li); });
      return ul;
    }
    if (a.kind === 'service') {
      const s = D.services[a.i], c = el('div', 'ag-att ag-card');
      c.innerHTML = `<ul class="ag-tags">${s.subs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><a class="ag-link" href="/${lang}/services/${s.slug}/">${esc(t.viewService)} · ${esc(s.name)}${ARROW}</a>`;
      return c;
    }
    if (a.kind === 'package') {
      const p = D.packages[a.i], w = el('div', 'ag-att');
      const c = el('div', 'ag-card ag-pkg');
      c.innerHTML = `${p.popular ? `<span class="ag-pkg__badge">${esc(D.popular)}</span>` : ''}<h3 class="ag-pkg__name">${esc(p.name)}</h3><p class="ag-pkg__line">${esc(p.line)}</p>
        <ul class="ag-pkg__items">${p.items.map((x) => `<li>${TICK}<span>${esc(x)}</span></li>`).join('')}</ul>
        <p class="ag-pkg__price">${D.prices && D.prices[a.i] === 'quote' ? `<strong>${esc(D.quote)}</strong><span>${esc(D.quoteNote)}</span>` : D.prices && D.prices[a.i] ? `<strong>${esc((document.documentElement.dataset.cur === 'ILS' ? D.fromPriceIls : D.fromPrice).replace('{p}', (document.documentElement.dataset.cur === 'ILS' ? D.pricesIls : D.prices)[a.i]))} <em class="ag-sample">${esc(D.sampleLabel)}</em></strong><span>${esc(D.vat)}</span>` : `<strong>${esc(t.from)}</strong><span>${esc(D.priceNote)} · ${esc(D.vat)}</span>`}</p>
        <a class="ag-btn" href="/${lang}/packages/#${p.slug}" data-ag-nav>${esc(t.viewPackage)}${ARROW}</a>`;
      w.append(c);
      if (a.others) {
        w.append(el('p', 'ag-note', esc(t.replies.otherPackages)));
        const o = el('div', 'ag-mini-chips');
        D.packages.forEach((x, j) => { if (j === a.i) return; const b = el('button', 'ag-chip ag-chip--mini', `<span>${esc(x.name)}</span>`); b.type = 'button'; b.addEventListener('click', () => ask(x.name, `pkg:${j}`)); o.append(b); });
        w.append(o);
      }
      return w;
    }
    if (a.kind === 'work') {
      const list = (a.film ? D.cases.filter((c) => c.film) : D.cases.filter((c) => !c.film)).slice(0, 2);
      const w = el('div', 'ag-att');
      const g = el('div', 'ag-work');
      list.forEach((c) => g.append(el('a', 'ag-case', `<img src="${c.img}" alt="${esc(c.alt)}" width="480" height="300" loading="lazy" decoding="async"><span class="ag-case__client">${esc(c.client)}</span><span class="ag-case__tag">${esc(c.tag)}</span><span class="visually-hidden"> · ${esc(t.viewCase)}</span>`)));
      $$('a', g).forEach((n, i) => { n.href = `/${lang}/work/${list[i].slug}/`; });
      w.append(g);
      const all = el('a', 'ag-link', `${esc(t.allWork)}${ARROW}`); all.href = `/${lang}/work/`; all.dataset.agNav = '';
      w.append(all);
      return w;
    }
    if (a.kind === 'routes') {
      const w = el('div', 'ag-att ag-actions');
      $$('[data-route]', $('[data-ag-routes]', root)).forEach((n) => { if (!a.only || a.only.includes(n.dataset.route)) w.append(n.cloneNode(true)); });
      return w;
    }
    return null;
  }
  // In-page links (#packages, #work) on the home page: close the window and let the page scroll there.
  log.addEventListener('click', (e) => {
    const a = e.target.closest('[data-ag-nav]'); if (!a) return;
    const u = new URL(a.href, location.href);
    if (u.pathname === location.pathname && u.hash) { e.preventDefault(); close(false); const target = document.getElementById(u.hash.slice(1)); if (target) target.scrollIntoView({ behavior: rm() ? 'auto' : 'smooth' }); }
  });
  mq.addEventListener('change', () => { if (tl) tl.progress(1); });
}
