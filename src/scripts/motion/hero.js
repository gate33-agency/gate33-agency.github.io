// Hero choreography (~1.6s on load) and the subtle scrubbed drift on scroll.
// Order: reel settles from 1.08 + shade eases in -> overline -> headline lines rise from a mask -> lede + CTAs -> services index -> header + pause control.
// The page is usable from the first frame (nothing blocks clicks; this is not a preloader).
import { scrubLag, isPhone } from './tokens.js';
import { DUR, STAGGER } from './tokens.js';
import { keepFlow, markFlow } from './pages.js';

export function heroIntro(gsap, SplitText) {
  const root = document.documentElement;
  const hero = document.querySelector('[data-hero]');
  const done = () => root.classList.remove('motion-intro');
  if (!hero) return null; // inner pages: pageIntro owns the hide (html.motion-intro)
  const q = (s) => hero.querySelector(s);
  const qa = (s) => [...hero.querySelectorAll(s)];
  const header = document.querySelector('[data-header]');
  const media = q('.hero__media');
  const shade = q('.hero__shade');
  const title = q('.hero__title');
  const services = qa('.hero__services-label, .hero__services li');

  // Reloaded mid-page: no intro, just show everything.
  if (window.scrollY > hero.offsetHeight * 0.3) { done(); return null; }

  markFlow(title);
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', linesClass: 'g-line', aria: 'auto' });
  const flow = keepFlow(title);
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'gate' },
    onComplete: () => {
      split.revert();
      flow(); // back to the original markup (and its accessible name) once settled
      gsap.set([media, shade, header, ...services, ...qa('.hero__eyebrow, .hero__lede, .hero__actions > *, .hero__toggle')], { clearProps: 'transform,opacity,willChange' });
    },
  });

  tl.set(title, { opacity: 1 })
    .fromTo(media, { opacity: 0, scale: 1.08, willChange: 'transform,opacity' }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 0)
    .to(media, { scale: 1, duration: 1.6, ease: 'gateHero' }, 0)
    .fromTo(shade, { opacity: 0 }, { opacity: 1, duration: 1.0, ease: 'power1.out' }, 0.1)
    .from(q('.hero__eyebrow'), { opacity: 0, y: 12, duration: DUR.base, immediateRender: true }, 0.2)
    .from(split.lines, { yPercent: 108, duration: 1.05, stagger: STAGGER.lines, ease: 'gateHero', immediateRender: true }, 0.28)
    .from(qa('.hero__lede, .hero__actions > *'), { opacity: 0, y: 16, duration: 0.7, stagger: STAGGER.items, immediateRender: true }, 0.68)
    .from(services, { opacity: 0, y: 10, duration: DUR.base, stagger: STAGGER.list, immediateRender: true }, 0.8)
    .from(q('.hero__toggle'), { opacity: 0, duration: 0.5, immediateRender: true }, 1.0);
  if (header) tl.from(header, { opacity: 0, y: -18, duration: DUR.base, immediateRender: true }, 1.0);

  // From-values are rendered now (immediateRender); the CSS hide (html.motion-intro) can go without a flash.
  gsap.set(title, { opacity: 1 }); // its lines are already hidden under their masks
  done();
  return tl;
}

// Scrubbed on scroll: the content drifts up and fades a little; the reel scales very slightly. Transform/opacity only.
export function heroScroll(gsap) {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  const st = { trigger: hero, start: 'top top', end: 'bottom top', scrub: scrubLag() };
  gsap.to(hero.querySelectorAll('.hero__content, .hero__foot'), { y: -70, opacity: 0.25, ease: 'none', scrollTrigger: st });
  // The playing film is not scaled on phones/tablets: rescaling a full-screen video every scroll frame is costly on iOS.
  if (!isPhone()) gsap.fromTo(hero.querySelectorAll('.hero__poster, .hero__video'), { scale: 1 }, { scale: 1.06, ease: 'none', scrollTrigger: { ...st } });
}
