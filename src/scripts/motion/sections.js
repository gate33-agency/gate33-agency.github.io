import { scrubLag } from './tokens.js';
// Stage 3.5 B: one distinct motion idea per Home section (no repeated reveal). Transform / opacity / clip-path only.
// Every function is a no-op when its section is missing. Pins only on >= 1024px (gsap.matchMedia); touch keeps native scroll.
// Reduced motion / no JS never reach this file (index.js exits first), so everything stays visible and the gate fully open.
const rtl = document.documentElement.dir === 'rtl';
const clamp01 = (v) => Math.max(0, Math.min(1, v));
// Offset of el inside an ancestor (layout only, ignores transforms, so it stays right while things move).
const offsetIn = (el, anc) => { let y = 0, n = el; while (n && n !== anc) { y += n.offsetTop; n = n.offsetParent; } return y; };
const passed = (el) => el.getBoundingClientRect().bottom < 0; // reload mid-page: leave what is already behind us alone

// 1 HERO "gate opening": two lavender leaves left/right of the reel slide apart from the centre over ~1 viewport.
// At first paint the gate is already open (leaves narrower than the gutter, so the reel and the headline are fully visible).
// 1 HERO GATE (scroll leaves): removed 12 Nov at Ahmed's request. The reel is full-bleed; the gate entry (icon.js / GateEntry) opens the site.

// 2 STATEMENT: words start faint (ink ~18%) and fill to full ink one by one, scrubbed. Words only (Arabic letters stay joined).
export function statementFill(gsap, SplitText) {
  const el = document.querySelector('[data-fill]');
  if (!el || passed(el)) return;
  const split = SplitText.create(el, { type: 'words', wordsClass: 'g-word', aria: 'auto' });
  gsap.fromTo(split.words, { opacity: 0.18 }, { opacity: 1, ease: 'none', stagger: 0.12,
    scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 42%', scrub: scrubLag() } });
}

// 3 CLIENTS: the grid hairlines draw in (scaleX / scaleY from 0), then the logos arrive in a diagonal wave (row + col).
// DOM order = reading order, so in Arabic column 0 is on the right and the wave starts there by itself.
export function clientsWave(gsap) {
  const grid = document.querySelector('[data-clients]');
  if (!grid || passed(grid)) return;
  const cells = [...grid.children];
  const top = Object.assign(document.createElement('span'), { className: 'clients__rule clients__rule--x' });
  top.style.top = '0'; grid.prepend(top);
  const xs = [top], ys = [];
  cells.forEach((li) => {
    const x = Object.assign(document.createElement('span'), { className: 'clients__rule clients__rule--x' }); x.style.bottom = '-1px';
    const y = Object.assign(document.createElement('span'), { className: 'clients__rule clients__rule--y' }); y.style.insetInlineEnd = '-1px';
    li.append(x, y); xs.push(x); ys.push(y);
  });
  [top, ...grid.querySelectorAll('.clients__rule')].forEach((r) => r.setAttribute('aria-hidden', 'true'));
  grid.setAttribute('data-drawn', '');
  const logos = cells.map((li) => li.querySelector('.client__in'));
  gsap.set(xs, { scaleX: 0 }); gsap.set(ys, { scaleY: 0 }); gsap.set(logos, { opacity: 0, y: 16 });
  const cols = () => getComputedStyle(grid).gridTemplateColumns.split(' ').length || 1;
  gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 82%', once: true } })
    .to(xs, { scaleX: 1, duration: 0.8, ease: 'gateHero', stagger: 0.02 }, 0)
    .to(ys, { scaleY: 1, duration: 0.8, ease: 'gateHero', stagger: 0.02 }, 0.08)
    .to(logos, { opacity: 1, y: 0, duration: 0.6, clearProps: 'transform,opacity',
      delay: 0, stagger: (i) => { const c = cols(); return (Math.floor(i / c) + (i % c)) * 0.045; } }, 0.2); // Stage R: whole wave lands in ~1.1s (was ~1.8s)
}

// 4 SELECTED WORK: desktop = pinned stage. Frames travel through it (scrubbed), each opening from the centre (clip inset -> 0)
// with a slight inner parallax; the coffee film holds and grows to near full width; the heading lets go as the work arrives.
// Mobile / tablet: no pin, each frame opens from the centre as it enters.
// Performance (10 Nov): while pinned and scrubbed, frames grow in with transform + opacity only (compositor), not clip-path —
// animating clip-path on large images every scroll frame made scrolling stutter, worst on Mac. Phones use the same compositor-only grow.
const GROW_FROM = { scale: 0.86, transformOrigin: '50% 50%' }, GROW_TO = { scale: 1 };
// 12 Nov (Ahmed: the first frames looked like a white glitch): each project frame now opens like the hero gate. Two lavender
// leaves inside the frame start ajar (a centre strip of the picture already shows) and slide out to the frame's edges.
// Transform only, nothing translucent over the picture. The "more work" tile keeps the plain grow.
const LEAF_FROM = [{ xPercent: -24 }, { xPercent: 24 }], LEAF_TO = [{ xPercent: -101 }, { xPercent: 101 }];
const addLeaves = (f) => ['work__leaf work__leaf--l', 'work__leaf work__leaf--r'].map((c) => {
  const s = document.createElement('span'); s.className = c; s.setAttribute('aria-hidden', 'true'); f.appendChild(s); return s;
});
export function workSequence(gsap, ScrollTrigger, mm) {
  const sec = document.querySelector('.work-sec');
  const works = sec && sec.querySelector('[data-works]');
  if (!works || passed(sec)) return;
  const frames = [...works.querySelectorAll('.work__frame'), ...works.querySelectorAll('.work-more')];
  const cinema = works.querySelector('.work--cinema .work__frame');
  const cinemaBody = works.querySelector('.work--cinema .work__body');
  const head = sec.querySelector('.sec-head');

  mm.add('(max-width: 1023.98px)', () => {
    // QA 15 Nov (Ahmed on iPhone: scrolling up and down felt heavy here): the frames used to open with an animated clip-path,
    // which repaints the whole picture on every frame. Same idea, compositor only: the frame grows from 92% and fades in.
    frames.forEach((f) => gsap.fromTo(f, { scale: 0.92, opacity: 0, transformOrigin: '50% 50%' }, { scale: 1, opacity: 1, duration: 0.8, ease: 'gateHero', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: f, start: 'top 92%', once: true } }));
  });

  mm.add('(min-width: 1024px)', () => {
    sec.classList.add('is-pinned');
    sec.style.position = 'relative';
    const vh = () => window.innerHeight;
    const m = {}; // measured on every refresh (invalidateOnRefresh)
    const measure = () => {
      m.top = offsetIn(works, sec);
      m.T = Math.max(0, m.top + works.offsetHeight + 96 - vh()); // travel until the last row sits above the fold
      m.H = cinema ? vh() * 0.45 : 0;                                 // the hold while the film grows
      m.tc = cinema ? Math.min(m.T, Math.max(0, offsetIn(cinema, sec) + cinema.offsetHeight / 2 - vh() / 2 - 20)) : m.T;
      m.S = cinema ? Math.min(1.25, (document.documentElement.clientWidth - 48) / cinema.offsetWidth) : 1;
    };
    measure();
    const tt = (t) => (t <= m.tc ? t : t + m.H); // travel px -> timeline time (the hold sits at tc)
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    const build = () => {
      tl.clear(); measure();
      tl.fromTo(works, { y: 0 }, { y: -m.tc, duration: m.tc }, 0)
        .to(works, { y: -m.T, duration: m.T - m.tc }, m.tc + m.H);
      if (head) tl.fromTo(head, { opacity: 1, y: 0 }, { opacity: 0, y: -48, duration: Math.max(1, m.top * 0.75) }, 0);
      if (cinema) {
        tl.fromTo(cinema, { scale: 1 }, { scale: m.S, duration: m.H * 0.8, ease: 'power1.inOut', immediateRender: false }, m.tc + m.H * 0.05);
        if (cinemaBody) tl.fromTo(cinemaBody, { y: 0 }, { y: (m.S - 1) * cinema.offsetHeight / 2, duration: m.H * 0.8, ease: 'power1.inOut' }, m.tc + m.H * 0.05);
      }
      frames.forEach((f) => {
        const o = offsetIn(f, sec), h = f.offsetHeight;
        const tIn = o - vh() * 0.92;
        // frames already on screen when the pin starts open in the lead-in (below); the rest open as they travel in
        if (tIn > 0) {
          if (f.leaves) f.leaves.forEach((l, i) => tl.fromTo(l, LEAF_FROM[i], { ...LEAF_TO[i], duration: vh() * 0.85, ease: 'power2.inOut' }, tt(tIn)));
          else tl.fromTo(f, GROW_FROM, { ...GROW_TO, duration: vh() * 0.45, ease: 'power2.out' }, tt(tIn));
        }
        const img = !f.closest('.work--contain') && f.querySelector('img');
        if (img) {
          const a = Math.max(0, o - vh()), b = Math.min(m.T, o + h);
          if (b > a) tl.fromTo(img, { yPercent: -5, scale: 1.12 }, { yPercent: 5, scale: 1.12, duration: tt(b) - tt(a) }, tt(a));
        }
      });
      tl.duration(m.T + m.H);
    };
    frames.forEach((f) => { if (f.classList.contains('work__frame')) f.leaves = addLeaves(f); });
    build();
    // Lead-in (before the pin): the first frames open as the section rises into view.
    const early = frames.filter((f) => offsetIn(f, sec) - vh() * 0.92 <= 0);
    const lead = gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 95%', end: 'top top', scrub: scrubLag() } }); // 12 Nov: longer, the opening was too quick
    early.forEach((f, k) => {
      if (f.leaves) f.leaves.forEach((l, i) => lead.fromTo(l, LEAF_FROM[i], { ...LEAF_TO[i], ease: 'power2.inOut', duration: 1 }, k * 0.2));
      else lead.fromTo(f, GROW_FROM, { ...GROW_TO, ease: 'power2.out', duration: 1 }, k * 0.2);
    });
    const pin = ScrollTrigger.create({
      trigger: sec, start: 'top top', end: () => `+=${m.T + m.H}`, pin: true, scrub: scrubLag(), animation: tl,
      invalidateOnRefresh: true, refreshPriority: 1, onRefreshInit: build, anticipatePin: 1,
    });
    return () => { pin.kill(); lead.kill(); tl.kill(); sec.classList.remove('is-pinned'); sec.style.position = '';
      frames.forEach((f) => { if (f.leaves) { f.leaves.forEach((l) => l.remove()); delete f.leaves; } });
      gsap.set([works, head, cinema, cinemaBody, ...frames, ...works.querySelectorAll('.work__frame img')].filter(Boolean), { clearProps: 'all' }); };
  });
}

// 5 SERVICES (dark): the page washes from lavender to ink as the section enters (fixed layer, opacity only), back after.
// The 7 cards cascade in; on hover the card lifts (CSS) and its sub-services stagger in (CSS, delays set here).
export function servicesShift(gsap, ScrollTrigger) {
  const sec = document.querySelector('.services-sec');
  if (!sec) return;
  const wash = Object.assign(document.createElement('div'), { className: 'bg-wash' });
  wash.setAttribute('aria-hidden', 'true');
  document.body.prepend(wash);
  document.documentElement.classList.add('has-wash');
  const set = gsap.quickSetter(wash, 'opacity');
  // Stage R: positions come from the trigger's own start/end (measured once per refresh), so scrolling does no layout reads.
  let st = null, last = -1;
  const update = () => {
    if (!st) return;
    const vh = window.innerHeight, top = st.start + vh - st.scroll(), bottom = top + (st.end - st.start - vh);
    const v = Math.round(clamp01((vh * 0.8 - top) / (vh * 0.5)) * clamp01((bottom - vh * 0.45) / (vh * 0.4)) * 1000) / 1000; // fully ink from top 30% until the bottom nears mid-screen
    if (v !== last) { last = v; set(v); }
  };
  st = ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onUpdate: update, onRefresh: update, onToggle: update });
  update();
  sec.querySelectorAll('.svc__subs').forEach((ul) => [...ul.children].forEach((li, i) => li.style.setProperty('--i', i)));
  const cards = [...sec.querySelectorAll('[data-svcs] > li')];
  if (passed(sec)) return;
  gsap.set(cards, { opacity: 0, y: 40 });
  gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, ease: 'gateHero', stagger: 0.05, clearProps: 'transform,opacity',
    scrollTrigger: { trigger: sec.querySelector('[data-svcs]'), start: 'top 85%', once: true } });
}

// 6 PACKAGES: the cards start stacked near the centre, fan out and settle into the grid; Brand System lands last, in front.
export function packagesFan(gsap, mm) {
  const grid = document.querySelector('[data-pkgs]');
  if (!grid || passed(grid)) return;
  const cards = [...grid.children];
  const order = [...cards.filter((c) => !c.classList.contains('pkg--popular')), ...cards.filter((c) => c.classList.contains('pkg--popular'))];
  mm.add('(min-width: 768px)', () => {
    gsap.set(cards, { opacity: 0 });
    gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 90%', once: true } }).add(() => { // Ahmed 10 Nov: the packages felt slow — starts earlier, lands faster
      const g = grid.getBoundingClientRect(), cx = g.left + g.width / 2, cy = g.top + g.height / 2;
      order.forEach((c, i) => {
        const r = c.getBoundingClientRect(), k = i - (order.length - 1) / 2;
        gsap.fromTo(c, { opacity: 0, x: cx - (r.left + r.width / 2) + k * 18, y: cy - (r.top + r.height / 2) + 40 + i * 6, rotation: k * (rtl ? -3 : 3) },
          { opacity: 1, x: 0, y: 0, rotation: 0, duration: 0.75, ease: 'gateHero', delay: i * 0.06, clearProps: 'transform,opacity',
            onStart: () => gsap.set(c, { opacity: 1 }) });
      });
    });
  });
  mm.add('(max-width: 767.98px)', () => {
    gsap.from(cards, { opacity: 0, y: 24, duration: 0.6, stagger: 0.06, clearProps: 'transform,opacity', scrollTrigger: { trigger: grid, start: 'top 88%', once: true } });
  });
}

// 7 PROCESS: one line draws across with scroll; each number + title appears when the line reaches it. AR draws right -> left.
export function processLine(gsap, mm) {
  const wrap = document.querySelector('[data-steps]');
  if (!wrap || passed(wrap)) return;
  const line = wrap.querySelector('.steps__line');
  const steps = [...wrap.querySelectorAll('.step')];
  mm.add('(min-width: 900px)', () => {
    wrap.setAttribute('data-drawn', '');
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: wrap, start: 'top 82%', end: 'top 38%', scrub: scrubLag() } });
    tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: steps.length }, 0);
    steps.forEach((s, i) => {
      const parts = [...s.children];
      gsap.set(parts, { opacity: 0, y: 18 });
      tl.to(parts, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: 'power2.out', immediateRender: false }, i + 0.05);
    });
    return () => wrap.removeAttribute('data-drawn');
  });
  mm.add('(max-width: 899.98px)', () => {
    steps.forEach((s) => gsap.from(s, { opacity: 0, y: 20, duration: 0.6, clearProps: 'transform,opacity', scrollTrigger: { trigger: s, start: 'top 90%', once: true } }));
  });
}

// 8 FINAL CTA: the headline starts oversized and scales down to its size with scroll (its line-mask reveal stays, see text.js).
export function ctaScale(gsap) {
  const title = document.querySelector('[data-cta-scale]');
  if (!title) return;
  gsap.fromTo(title, { scale: 1.24 }, { scale: 1, ease: 'none', transformOrigin: rtl ? '100% 50%' : '0% 50%',
    scrollTrigger: { trigger: title.closest('section'), start: 'top bottom', end: 'top 20%', scrub: scrubLag() } });
}
