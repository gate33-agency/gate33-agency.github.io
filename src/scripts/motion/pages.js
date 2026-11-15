// Stage 4A: motion for the services index and the service pages. One distinct idea per section; transform / opacity /
// clip-path only; no pins (the process stack uses CSS sticky on >= 1024px). Every function is a no-op when its section is
// missing, and reduced motion / no JS never reach this file (index.js exits first), so everything stays visible.
import { scrubLag } from './tokens.js';
import { DUR, STAGGER } from './tokens.js';
const rtl = document.documentElement.dir === 'rtl';
const passed = (el) => el.getBoundingClientRect().bottom < 0;

// HERO (index + service pages): breadcrumbs/overline fade, the headline rises line by line from a mask (one of the two
// allowed masked reveals), intro, actions and price chip follow. Service pages: the visual opens out of a hexagon, the
// Gate33 brand shape, while the image settles from 1.15.
const HEX_FROM = 'polygon(38% 32%, 62% 32%, 74% 50%, 62% 68%, 38% 68%, 26% 50%)';
const HEX_TO = 'polygon(0% 0%, 100% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%)';
export function pageIntro(gsap, SplitText) {
  const hero = document.querySelector('[data-page-hero]');
  const done = () => document.documentElement.classList.remove('motion-intro');
  if (!hero || window.scrollY > hero.offsetHeight * 0.5) { done(); return null; }
  const header = document.querySelector('[data-header]');
  const title = hero.querySelector('.page-hero__title');
  const parts = [...hero.querySelectorAll('.ph-part')];
  const hex = hero.querySelector('[data-hex]');
  markFlow(title);
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'g-line', aria: 'auto' });
  const flow = keepFlow(title); // the line masks must not change the space the title takes (no jump when they are removed)
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'gate' }, onComplete: () => { split.revert(); flow(); gsap.set([title, ...parts, header].filter(Boolean), { clearProps: 'opacity,transform' }); } });
  tl.set(title, { opacity: 1 }, 0)
    .from(parts.slice(0, 2), { opacity: 0, y: 12, duration: DUR.base, stagger: STAGGER.items, immediateRender: true }, 0.1)
    .from(split.lines, { yPercent: 108, duration: 1.05, stagger: STAGGER.lines, ease: 'gateHero', immediateRender: true }, 0.2)
    .from(parts.slice(2), { opacity: 0, y: 18, duration: 0.7, stagger: STAGGER.items, immediateRender: true }, 0.6);
  if (hex) {
    const frame = hex.querySelector('.svc-visual__frame');
    const media = frame.querySelectorAll('img, video');
    tl.set(hex, { opacity: 1 }, 0)
      .fromTo(frame, { clipPath: HEX_FROM }, { clipPath: HEX_TO, duration: 1.1, ease: 'gateHero', clearProps: 'clipPath' }, 0.25)
      .fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.3, ease: 'gateHero', clearProps: 'transform' }, 0.25);
  }
  if (header) tl.from(header, { opacity: 0, y: -12, duration: DUR.base, immediateRender: true }, 0);
  gsap.set(title, { opacity: 1 }); // lines are already hidden under their masks
  done(); // every start state is rendered now, so the CSS hide can go without a flash
  return tl;
}

// Line masks add room under each line; in some layouts that changes the title's height for the length of the reveal and
// the content below jumps back when the masks go. Measure the next element before and after the split and cancel the
// difference with a temporary margin. Returns the undo function.
export function keepFlow(el) {
  const next = el.nextElementSibling;
  const probe = () => (next ? next.getBoundingClientRect().top : el.parentElement.getBoundingClientRect().bottom);
  const before = el.__flowBefore;
  if (before === undefined) return () => {};
  const delta = probe() - before;
  if (Math.abs(delta) < 0.5) return () => {};
  const mb = parseFloat(getComputedStyle(el).marginBottom) || 0;
  el.style.marginBottom = `${mb - delta}px`;
  return () => { el.style.marginBottom = ''; };
}
export const markFlow = (el) => { const next = el.nextElementSibling; el.__flowBefore = next ? next.getBoundingClientRect().top : el.parentElement.getBoundingClientRect().bottom; };

// INDEX LIST: each row wipes in from the reading edge (left in EN, right in AR) with its hairline, in sequence.
export function rowsWipe(gsap) {
  const list = document.querySelector('[data-srows]');
  if (!list || passed(list)) return;
  const rows = [...list.querySelectorAll('.srow')];
  const from = rtl ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
  gsap.set(rows, { clipPath: from });
  gsap.to(rows, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'gateHero', stagger: 0.05, clearProps: 'clipPath',
    scrollTrigger: { trigger: list, start: 'top 86%', once: true } });
}

// INDEX ASK GATE BLOCK: the purple block grows out of the bottom-right corner, where the Ask Gate launcher lives
// (bottom-right in both languages), then its text settles.
export function askGrow(gsap) {
  const block = document.querySelector('[data-ask-block]');
  if (!block || passed(block)) return;
  const inner = block.querySelectorAll('.ask-block__text > *, .ask-block > .btn');
  gsap.set(block, { clipPath: 'circle(0% at 100% 100%)' });
  gsap.set(inner, { opacity: 0, y: 16 });
  gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 80%', once: true } })
    .to(block, { clipPath: 'circle(150% at 100% 100%)', duration: 0.9, ease: 'gateHero', clearProps: 'clipPath' })
    .to(inner, { opacity: 1, y: 0, duration: 0.6, stagger: STAGGER.items, clearProps: 'transform,opacity' }, 0.25);
}

// PRICES (index packages teaser, service package / custom quote): sample figures count up from zero once.
// The markup always holds the final value (no JS / reduced motion = the number as written).
export function countUp(gsap) {
  document.querySelectorAll('[data-count-group]').forEach((group) => {
    if (passed(group)) return;
    const els = [...group.querySelectorAll('[data-count]')].filter((el) => /\d/.test(el.dataset.count));
    if (!els.length) return;
    const fmt = (n) => Math.round(n).toLocaleString('en-US');
    els.forEach((el) => { el.textContent = '0'; });
    gsap.timeline({ scrollTrigger: { trigger: group, start: 'top 80%', once: true } }).add(() => {
      els.forEach((el, i) => {
        const target = parseFloat(el.dataset.count.replace(/,/g, '')); const o = { v: 0 };
        gsap.to(o, { v: target, duration: 0.9, delay: i * 0.06, ease: 'gateHero', onUpdate: () => { el.textContent = fmt(o.v); }, onComplete: () => { el.textContent = el.dataset.count; } });
      });
    });
  });
}

// SCOPE: the cards tilt up into place from below (3D, hinged at their bottom edge), in reading order.
export function scopeTilt(gsap) {
  document.querySelectorAll('[data-scope]').forEach((list) => {
    if (passed(list)) return;
    const cards = [...list.children];
    gsap.set(cards, { opacity: 0, y: 48, rotationX: 22, transformOrigin: '50% 100%' });
    gsap.to(cards, { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: 'gateHero', stagger: 0.05, clearProps: 'transform,opacity',
      scrollTrigger: { trigger: list, start: 'top 84%', once: true } });
  });
}

// PROCESS: desktop = the cards are sticky (CSS) and stack; as each next card slides over, the one beneath steps back
// (scale 0.94, dimmed), scrubbed. Under 1024px: no sticky; cards slide in from the reading edge.
export function processStack(gsap, mm) {
  const stack = document.querySelector('[data-stack]');
  if (!stack || passed(stack)) return;
  const cards = [...stack.children];
  mm.add('(min-width: 1024px)', () => {
    cards.slice(0, -1).forEach((card, i) => {
      gsap.to(card, { scale: 0.94, opacity: 0.5, ease: 'none',
        scrollTrigger: { trigger: cards[i + 1], start: 'top 85%', end: 'top 30%', scrub: scrubLag() } });
    });
    return () => gsap.set(cards, { clearProps: 'transform,opacity' });
  });
  mm.add('(max-width: 1023.98px)', () => {
    cards.forEach((card) => gsap.from(card, { opacity: 0, x: rtl ? -40 : 40, duration: 0.7, ease: 'gateHero', clearProps: 'transform,opacity',
      scrollTrigger: { trigger: card, start: 'top 90%', once: true } }));
  });
}

// WORK: a lateral weave with scroll: alternate cards drift in opposite directions (scrubbed), so the strip feels alive
// without hiding anything. The section clips the overflow.
export function workDrift(gsap) {
  const grid = document.querySelector('[data-drift]');
  if (!grid) return;
  const cards = [...grid.children];
  cards.forEach((card, i) => {
    const d = (i % 2 ? -1 : 1) * (rtl ? -1 : 1) * 36;
    gsap.fromTo(card, { x: d }, { x: -d, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: scrubLag() } });
  });
}

// FAQ: the hairlines draw in from the reading edge, one after the other, and each question settles with its line.
export function faqRules(gsap) {
  const faq = document.querySelector('[data-faq]');
  if (!faq || passed(faq)) return;
  const items = [...faq.querySelectorAll('[data-faq-item]')];
  const rules = items.map((it) => it.querySelector('.faq__rule'));
  const qs = items.map((it) => it.querySelector('.faq__q'));
  gsap.set(rules, { scaleX: 0 }); gsap.set(qs, { opacity: 0 });
  gsap.timeline({ scrollTrigger: { trigger: faq, start: 'top 82%', once: true } })
    .to(rules, { scaleX: 1, duration: 0.7, ease: 'gateHero', stagger: 0.06, clearProps: 'transform' }, 0)
    .to(qs, { opacity: 1, duration: 0.5, stagger: 0.06, clearProps: 'opacity' }, 0.12);
}
