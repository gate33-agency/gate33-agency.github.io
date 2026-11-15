// Stage 5-3: About + Contact motion, one calm idea per page beyond the shared page intro. transform / opacity only, no pins.
// Nothing is hidden or covered while waiting: every card stays fully legible and only moves. Reduced motion / no JS never
// reach this file (index.js exits first), so everything is simply in place.
const rtl = document.documentElement.dir === 'rtl';
const passed = (el) => el.getBoundingClientRect().bottom < 0;

// ABOUT · point of view: the four roles (designer, production house, web developer, marketing agency) start apart, each
// slightly turned like four separate suppliers, then drift together and lock into one bar, with the "one creative
// direction" band settling beneath them. ~1.2s, once.
export function rolesMerge(gsap, mm) {
  const fig = document.querySelector('[data-merge]');
  if (!fig || passed(fig)) return;
  const roles = [...fig.querySelectorAll('.ab-merge__role')];
  const one = fig.querySelector('.ab-merge__one');
  const s = rtl ? -1 : 1;
  const play = (k) => {
    const from = [[-56, -40, -4], [56, -30, 3], [-44, 34, 3], [60, 42, -3]];
    roles.forEach((r, i) => gsap.set(r, { x: from[i][0] * k * s, y: from[i][1] * k, rotation: from[i][2] * s, zIndex: 4 - i }));
    gsap.set(one, { y: 28 * k, scaleX: 0.88, opacity: 0.4, transformOrigin: '50% 50%' });
    gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 82%', once: true } })
      .to(roles, { x: 0, y: 0, rotation: 0, duration: 1.2, ease: 'gateHero', stagger: 0.05, clearProps: 'transform,zIndex' }, 0)
      .to(one, { y: 0, scaleX: 1, opacity: 1, duration: 0.9, ease: 'gateHero', clearProps: 'transform,opacity' }, 0.45);
    return () => gsap.set([...roles, one], { clearProps: 'transform,opacity,zIndex' });
  };
  mm.add('(min-width: 768px)', () => play(1));
  mm.add('(max-width: 767.98px)', () => play(0.5));
}

// CONTACT · the three routes open like a fan from one point below the row (the gate opening into three ways): each card
// turns up from a small angle around a shared pivot under the centre card, in reading order. ~1.1s, once.
// Under 900px (stacked) each card turns up around its own lower start corner as it is reached.
export function routesFan(gsap, mm) {
  const list = document.querySelector('[data-routes]');
  if (!list || passed(list)) return;
  const cards = [...list.children];
  // in view on arrival: start once the hero headline has risen, so the fan reads as its own moment
  const lead = () => (window.scrollY < 4 ? 0.6 : 0);
  mm.add('(min-width: 900px)', () => {
    const box = list.getBoundingClientRect();
    const order = rtl ? [...cards].reverse() : cards; // left-to-right on screen
    const angles = [-7, 0, 7];
    order.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const ox = box.left + box.width / 2 - r.left; // shared pivot: centre of the row, well below it
      gsap.set(c, { rotation: angles[i], y: 36, transformOrigin: `${ox}px ${r.height * 2.2}px` });
    });
    gsap.timeline({ scrollTrigger: { trigger: list, start: 'top 86%', once: true } })
      .to(cards, { rotation: 0, y: 0, duration: 1.1, ease: 'gateHero', stagger: 0.07, delay: lead(), clearProps: 'transform,transformOrigin' });
    return () => gsap.set(cards, { clearProps: 'transform,transformOrigin' });
  });
  mm.add('(max-width: 899.98px)', () => {
    cards.forEach((c) => gsap.fromTo(c, { rotation: rtl ? -5 : 5, y: 32, transformOrigin: rtl ? '100% 100%' : '0% 100%' },
      { rotation: 0, y: 0, duration: 1, delay: c.getBoundingClientRect().top < innerHeight ? lead() : 0, ease: 'gateHero', clearProps: 'transform,transformOrigin', scrollTrigger: { trigger: c, start: 'top 94%', once: true } }));
  });
}
