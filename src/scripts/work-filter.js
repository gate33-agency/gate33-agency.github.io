// Work index filters (Stage 4B-1). Progressive enhancement: without JS the bar stays hidden and everything shows.
// Buttons carry aria-pressed; the live region announces the new count; the state lives in ?type= (replaceState, no reload,
// no scroll jump). "logo" shows the logo archive; the other filters show matching projects.
const root = document.querySelector('[data-wfilter-root]');
const bar = root && root.querySelector('[data-wfilter]');
if (bar) {
  const btns = [...bar.querySelectorAll('[data-filter]')];
  const count = bar.querySelector('[data-wcount]');
  const grid = root.querySelector('[data-windex]');
  const items = [...grid.children];
  const archive = document.querySelector('[data-archive]');
  const ids = btns.map((b) => b.dataset.filter);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  bar.hidden = false;

  const apply = (id) => {
    if (!ids.includes(id)) id = 'all';
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === id)));
    const y = window.scrollY; // keep the reader where they are
    const appeared = [];
    items.forEach((li) => {
      const on = id === 'all' || (id !== 'logo' && li.dataset.types.split(' ').includes(id));
      if (on && li.hidden) appeared.push(li.firstElementChild);
      li.hidden = !on;
    });
    // first visible card takes the featured size (the film or a pair card when Cyrin is filtered out)
    const vis = items.filter((li) => !li.hidden);
    items.forEach((li) => li.classList.remove('is-lead'));
    if (vis.length && !vis[0].classList.contains('windex__item--feature')) vis[0].classList.add('is-lead');
    // an odd card left alone in a row spans the row
    items.forEach((li) => li.classList.remove('is-solo'));
    let run = [];
    const flush = () => { if (run.length % 2) run[run.length - 1].classList.add('is-solo'); run = []; };
    vis.forEach((li) => { if (li.classList.contains('windex__item--half') && !li.classList.contains('is-lead')) run.push(li); else flush(); });
    flush();
    grid.hidden = vis.length === 0;
    const showArchive = id === 'all' || id === 'logo';
    if (archive) { if (showArchive && archive.hidden) appeared.push(archive); archive.hidden = !showArchive; }
    const btn = btns.find((b) => b.dataset.filter === id);
    if (count.textContent !== btn.dataset.count) count.textContent = btn.dataset.count;
    if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
    if (!reduced) appeared.forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
      { duration: 450, delay: i * 50, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
    window.dispatchEvent(new CustomEvent('g33:layout')); // ScrollTrigger measures again (motion/work.js)
  };

  btns.forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.filter;
    const url = new URL(location.href);
    if (id === 'all') url.searchParams.delete('type'); else url.searchParams.set('type', id);
    history.replaceState(history.state, '', url);
    apply(id);
  }));
  // Arrow keys move between the buttons (Tab still reaches each one)
  bar.addEventListener('keydown', (e) => {
    const i = btns.indexOf(document.activeElement);
    if (i < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    const rtl = document.documentElement.dir === 'rtl';
    const fwd = (e.key === 'ArrowRight') !== rtl;
    const n = e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : (i + (fwd ? 1 : -1) + btns.length) % btns.length;
    e.preventDefault(); btns[n].focus();
  });
  const initial = new URLSearchParams(location.search).get('type');
  if (initial) apply(initial);
}
