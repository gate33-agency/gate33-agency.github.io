// Final review 2 (13 Nov): calm entrances for the sections that had none (checkout + contact forms, legal text,
// case "next project"). transform / opacity only, once, ~0.9-1.2s on the gateHero ease; no pins, no clip-path, no blur.
// Reduced motion and no JS never reach this file (index.js exits first), so everything stays visible there.
const rtl = document.documentElement.dir === 'rtl';
const passed = (el) => el.getBoundingClientRect().bottom < 0;
const inView = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.86;

// FORMS (checkout + contact): the summary / details card lifts in first, then the fields settle in reading order.
// On checkout the section is already on screen under the hero, so it plays right after the hero intro.
export function formSettle(gsap) {
  document.querySelectorAll('.co-sec, .ct-sec').forEach((sec) => {
    if (passed(sec)) return;
    const card = sec.querySelector('.co-sum__in, .co-sum, .ct-details');
    const form = sec.querySelector('.co-form, .ct-form');
    if (!form) return;
    const head = form.querySelector('.co-form__head');
    const fields = [...form.querySelectorAll('.co-field, .co-check, .ct-field, .ct-chips, fieldset, .co-pay, .ct-send, .co-alt')].filter((el, i, a) => !a.some((o) => o !== el && o.contains(el)));
    const parts = [head, ...fields].filter(Boolean);
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'gateHero' } });
    if (card) tl.from(card, { y: 36, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0);
    tl.from(parts, { y: 18, opacity: 0, duration: 0.9, stagger: 0.05, clearProps: 'transform,opacity' }, card ? 0.15 : 0);
    if (inView(sec)) tl.delay(0.55).play();
    else gsap.timeline({ scrollTrigger: { trigger: sec, start: 'top 82%', once: true, onEnter: () => tl.play() } });
  });
}

// LEGAL: the page opens into its two columns: the contents rail slides in from the reading edge, item by item,
// while the text column rises once (the sections inside it do not each animate, so reading is never interrupted).
export function legalOpen(gsap) {
  const grid = document.querySelector('.lg-grid');
  if (!grid || passed(grid)) return;
  const items = [...grid.querySelectorAll('.lg-toc--side li, .lg-toc--side .lg-toc__title')].filter((el) => el.getClientRects().length);
  const fold = grid.querySelector('.lg-toc--fold');
  const body = grid.querySelector('.lg-body');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'gateHero' } });
  if (items.length) tl.from(items, { x: rtl ? 24 : -24, opacity: 0, duration: 0.9, stagger: 0.04, clearProps: 'transform,opacity' }, 0);
  if (fold && fold.getClientRects().length) tl.from(fold, { y: 20, opacity: 0, duration: 0.9, clearProps: 'transform,opacity' }, 0);
  if (body) tl.from(body, { y: 28, opacity: 0, duration: 1.1, clearProps: 'transform,opacity' }, 0.1);
  if (inView(grid)) tl.delay(0.5).play();
  else gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 84%', once: true, onEnter: () => tl.play() } });
}

// CASE "NEXT PROJECT": the next project arrives from the forward edge (right in EN, left in AR), the way you are about
// to travel; its picture settles from a slight zoom and the text follows. Neighbours: outcome fades up, CTA rises by lines.
export function nextArrive(gsap) {
  const link = document.querySelector('.case-next__link');
  if (!link || passed(link)) return;
  const thumb = link.querySelector('.case-next__thumb');
  const img = thumb && thumb.querySelector('img');
  const text = [...link.querySelectorAll('.case-next__text > *')];
  const tl = gsap.timeline({ defaults: { ease: 'gateHero' }, scrollTrigger: { trigger: link, start: 'top 84%', once: true } });
  if (thumb) tl.from(thumb, { x: rtl ? -64 : 64, opacity: 0, duration: 1.2, clearProps: 'transform,opacity' }, 0);
  if (img) tl.from(img, { scale: 1.08, duration: 1.3, clearProps: 'transform' }, 0);
  tl.from(text, { y: 16, opacity: 0, duration: 0.8, stagger: 0.06, clearProps: 'transform,opacity' }, 0.2);
}
