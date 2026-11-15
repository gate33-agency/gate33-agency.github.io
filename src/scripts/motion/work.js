// Stage 4B-1: motion for the work index. One idea per section, transform / opacity only, no pins, once per visit.
// Reduced motion / no JS never reach this file (index.js exits first), so everything stays visible.
// The featured Cyrin frame is not touched here: it has the icon slices reveal (icon.js).
const passed = (el) => el.getBoundingClientRect().bottom < 0;

// PROJECT GRID: "through the window". Each card rises into place while its image glides the other way inside the frame
// (the frame stays put as a window, the picture settles behind it). Cards in the same row start together, rows in turn.
export function workIndexGrid(gsap, ScrollTrigger) {
  const grid = document.querySelector('[data-windex]');
  if (!grid) return;
  // filters change heights: measure again (work-filter.js)
  window.addEventListener('g33:layout', () => ScrollTrigger.refresh());
  const items = [...grid.children].filter((li) => !li.querySelector('[data-slices]'));
  items.forEach((li) => {
    if (passed(li)) return;
    const media = li.querySelectorAll('.work__frame > img, .work__frame > picture > img');
    const body = li.querySelector('.work__body');
    gsap.set(li, { opacity: 0, y: 56 });
    gsap.set(media, { yPercent: -7, scale: 1.14 });
    gsap.set(body, { opacity: 0, y: 14 });
    gsap.timeline({ scrollTrigger: { trigger: li, start: 'top 90%', once: true },
      // a right-hand card in a pair waits a beat, so the row reads in order
      delay: li.previousElementSibling && li.offsetTop === li.previousElementSibling.offsetTop ? 0.08 : 0 })
      .to(li, { opacity: 1, y: 0, duration: 1.3, ease: 'gateHero', clearProps: 'opacity,transform' }, 0)
      .to(media, { yPercent: 0, scale: 1, duration: 1.7, ease: 'gateHero', clearProps: 'transform' }, 0)
      .to(body, { opacity: 1, y: 0, duration: 0.9, clearProps: 'opacity,transform' }, 0.4);
  });
}

// LOGO ARCHIVE: the marks settle in a diagonal wave across the register (grid-aware stagger from the reading corner).
export function archiveWave(gsap) {
  const list = document.querySelector('[data-archive-list]');
  if (!list || passed(list)) return;
  const cells = [...list.children];
  const logos = cells.map((li) => li.querySelector('.arch__logo'));
  const caps = cells.map((li) => li.querySelector('.arch__cap'));
  // columns from the layout (4 / 3 / 2); DOM order is reading order, so 'start' is the reading corner in EN and AR
  const top0 = cells[0].getBoundingClientRect().top;
  const cols = Math.max(1, cells.filter((c) => Math.abs(c.getBoundingClientRect().top - top0) < 2).length);
  const grid = [Math.ceil(cells.length / cols), cols], from = 'start';
  gsap.set(logos, { opacity: 0, y: 18, scale: 0.94 });
  gsap.set(caps, { opacity: 0 });
  gsap.timeline({ scrollTrigger: { trigger: list, start: 'top 82%', once: true } })
    .to(logos, { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'gateHero', stagger: { each: 0.07, grid, from }, clearProps: 'opacity,transform' }, 0)
    .to(caps, { opacity: 1, duration: 0.7, stagger: { each: 0.07, grid, from }, clearProps: 'opacity' }, 0.15);
}
