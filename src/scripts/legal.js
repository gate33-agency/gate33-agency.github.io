// Legal pages (Stage 5-4): highlights the contents link of the section being read, and closes the mobile contents list after a
// link is used. No scroll-linked tweens. Without JS the anchors and the list still work.
const links = [...document.querySelectorAll('[data-toc-link]')];
const secs = [...document.querySelectorAll('.lg-sec')];
if (links.length && 'IntersectionObserver' in window) {
  const mark = (id) => links.forEach((a) => { if (a.getAttribute('href') === `#${id}`) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  const seen = new Set();
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) seen.add(e.target.id); else seen.delete(e.target.id); });
    const first = secs.find((s) => seen.has(s.id)); if (first) mark(first.id);
  }, { rootMargin: '-96px 0px -60% 0px' });
  secs.forEach((s) => io.observe(s));
}
const fold = document.querySelector('[data-toc-fold]');
if (fold) fold.addEventListener('click', (e) => { if (e.target.closest('a')) fold.open = false; });
