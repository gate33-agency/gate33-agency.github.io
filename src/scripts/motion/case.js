// Stage 4B-2: case-study gallery motion — "registration". Scrubbed, transform only, no pins, no hiding.
// - Pair / trio (>= 768px): the frames start out of step (alternate frames lower) and slide into one line as the row
//   reaches the middle of the screen, like two printed plates coming into register.
// - Full-width image (and every frame under 768px, where rows stack): the picture pulls into focus inside its frame
//   (scale 1.1 -> 1); the frame itself stays still.
// Reduced motion / no JS never reach this file (index.js exits first), so everything is visible as laid out.
// Scrubbed tweens always resolve to the resting layout, so a reload mid-page lands in the right state.
import { scrubLag } from './tokens.js';

export function caseGallery(gsap, mm) {
  const figs = [...document.querySelectorAll('[data-case-fig]')];
  if (!figs.length) return;
  const focus = (img, trigger) => gsap.fromTo(img, { scale: 1.1 }, { scale: 1, ease: 'none', immediateRender: true,
    scrollTrigger: { trigger, start: 'top bottom', end: 'center 55%', scrub: scrubLag() } });

  figs.filter((f) => f.dataset.caseFig === 'full').forEach((f) => {
    const img = f.querySelector('.case-frame img');
    if (img) focus(img, f);
  });

  const rows = figs.filter((f) => f.dataset.caseFig === 'pair' || f.dataset.caseFig === 'trio');
  mm.add('(min-width: 768px)', () => {
    rows.forEach((f) => {
      const frames = [...f.querySelectorAll('.case-frame')];
      const lift = Math.min(96, f.offsetHeight * 0.18);
      frames.forEach((fr, i) => {
        if (i % 2 === 0) return; // the first (and third) frame stays put: the others come into register with it
        gsap.fromTo(fr, { y: lift }, { y: 0, ease: 'none', immediateRender: true,
          scrollTrigger: { trigger: f, start: 'top bottom', end: 'center 55%', scrub: scrubLag() } });
      });
    });
    return () => rows.forEach((f) => gsap.set(f.querySelectorAll('.case-frame'), { clearProps: 'transform' }));
  });
  mm.add('(max-width: 767.98px)', () => {
    rows.forEach((f) => f.querySelectorAll('.case-frame').forEach((fr) => { const img = fr.querySelector('img'); if (img) focus(img, fr); }));
    return () => rows.forEach((f) => gsap.set(f.querySelectorAll('.case-frame img'), { clearProps: 'transform' }));
  });
}
