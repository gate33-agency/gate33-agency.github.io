// Text animation system, data-attribute driven:
//   data-reveal="lines"  masked line-by-line rise (section headings, statements)
//   data-reveal="words"  soft word cascade (never characters: Arabic letters must stay joined)
//   data-reveal="fade"   soft fade-up (overlines, body, intros)
//   data-reveal-delay="ms" optional offset
// Each element plays once when it enters the viewport. The split is made right before the animation (current fonts and
// width, so lines are always correct, also after a resize) and reverted when it settles, so the DOM and the accessible
// name go back to the original string. Screen readers read the string once (SplitText aria:auto -> aria-label + aria-hidden parts).
import { DUR, STAGGER, REVEAL } from './tokens.js';

export function textReveals(gsap, ScrollTrigger, SplitText) {
  const els = [...document.querySelectorAll('[data-reveal]')];
  els.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0) return; // already scrolled past (reload mid-page): leave it as is
    const mode = el.dataset.reveal;
    const delay = (parseFloat(el.dataset.revealDelay) || 0) / 1000;
    gsap.set(el, { opacity: 0 }); // initial state set by JS right before it can animate
    ScrollTrigger.create({
      trigger: el,
      start: REVEAL.start,
      once: true,
      onEnter: () => play(gsap, SplitText, el, mode, delay),
    });
  });
}

function play(gsap, SplitText, el, mode, delay) {
  if (mode === 'lines' || mode === 'words') {
    const lines = mode === 'lines';
    const split = SplitText.create(el, lines
      ? { type: 'lines', mask: 'lines', linesClass: 'g-line', aria: 'auto' }
      : { type: 'words', wordsClass: 'g-word', aria: 'auto' });
    gsap.set(el, { opacity: 1 });
    const done = () => { split.revert(); gsap.set(el, { clearProps: 'opacity' }); };
    if (lines) gsap.from(split.lines, { yPercent: 108, duration: DUR.text, stagger: STAGGER.lines, ease: 'gateHero', delay, onComplete: done });
    else gsap.from(split.words, { opacity: 0, y: '0.35em', duration: 0.6, stagger: STAGGER.words, delay, onComplete: done });
    return;
  }
  gsap.fromTo(el, { opacity: 0, y: REVEAL.rise }, { opacity: 1, y: 0, duration: 0.65, delay, clearProps: 'transform,opacity' });
}
