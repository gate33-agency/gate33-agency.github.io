// Stage 5-1: packages page motion. transform / opacity only, no pins. Nothing is ever covered or blank while waiting:
// the cards are fully legible the whole time (they only move), and the compare table keeps its frame, headers and row
// labels on screen while its marks are ticked in. Reduced motion / no JS never reach this file (index.js exits first).
const rtl = document.documentElement.dir === 'rtl';
const passed = (el) => el.getBoundingClientRect().bottom < 0;

// CARDS: the four cards arrive as a staircase (each column a step lower, in reading order) and level into one row,
// like four steps becoming one line. Under 768px (one column) each card simply lifts into place as it is reached.
export function cardsLevel(gsap, mm) {
  const grid = document.querySelector('[data-pk-cards]');
  if (!grid || passed(grid)) return;
  const cards = [...grid.children];
  mm.add('(min-width: 768px)', () => {
    // column index from the rendered layout (4-up or 2-up), reading order in both directions
    const lefts = [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().left)))].sort((a, b) => (rtl ? b - a : a - b));
    const col = (c) => lefts.indexOf(Math.round(c.getBoundingClientRect().left));
    cards.forEach((c) => gsap.set(c, { y: 40 + col(c) * 34 }));
    gsap.timeline({ scrollTrigger: { trigger: grid, start: 'top 88%', once: true } })
      .add(() => cards.forEach((c) => gsap.to(c, { y: 0, duration: 1.05, delay: col(c) * 0.08, ease: 'gateHero', clearProps: 'transform' })));
    return () => gsap.set(cards, { clearProps: 'transform' });
  });
  mm.add('(max-width: 767.98px)', () => {
    cards.forEach((c) => gsap.fromTo(c, { y: 36 }, { y: 0, duration: 1, ease: 'gateHero', clearProps: 'transform',
      scrollTrigger: { trigger: c, start: 'top 94%', once: true } }));
  });
}

// COMPARE: the table, its package headers and every row label are there from the start; the marks (ticks, dashes and
// values) are ticked in column by column in reading order, each column running top to bottom, ~1.2s in all.
export function compareTick(gsap) {
  const table = document.querySelector('[data-cmp]');
  if (!table || passed(table)) return;
  const rows = [...table.querySelectorAll('tbody tr:not(.cmp__group)')];
  const cols = [0, 1, 2, 3].map((j) => rows.map((r) => r.children[j + 1]?.querySelector('.cmp__mark')).filter(Boolean));
  const all = cols.flat();
  gsap.set(all, { opacity: 0, scale: 0.55 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: table, start: 'top 78%', once: true } });
  cols.forEach((marks, j) => tl.to(marks, { opacity: 1, scale: 1, duration: 0.6, ease: 'gateHero', stagger: 0.016, clearProps: 'transform,opacity' }, j * 0.12));
}
