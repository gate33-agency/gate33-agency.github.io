// Pointer-only details (desktop with a fine pointer; never on touch or reduced motion):
// - cursor pill "View" / "شاهد" on work cards only (follows with lerp; native cursor everywhere else)
// - magnetic primary buttons (subtle, <= 8px)
// - work card hover: cycles through 2–3 extra images of the same project
export function pointerDetails(gsap) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!fine || touch) return;
  const ar = document.documentElement.lang === 'ar';

  // Cursor pill
  const cards = [...document.querySelectorAll('.work__media')];
  if (cards.length) {
    const cur = document.createElement('div');
    cur.className = 'cursor'; cur.setAttribute('aria-hidden', 'true');
    cur.innerHTML = `<span class="cursor__pill">${ar ? 'شاهد' : 'View'}</span>`;
    document.body.append(cur);
    document.documentElement.classList.add('has-cursor');
    const x = gsap.quickTo(cur, 'x', { duration: 0.45, ease: 'power3' });
    const y = gsap.quickTo(cur, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); }, { passive: true });
    cards.forEach((c) => {
      c.addEventListener('pointerenter', (e) => { gsap.set(cur, { x: e.clientX, y: e.clientY }); x(e.clientX); y(e.clientY); cur.classList.add('is-on'); });
      c.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
    });
    // a video card that starts playing gets its controls and the native cursor back
    document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('[data-play]')) cur.classList.remove('is-on'); });
  }

  // Magnetic primary buttons
  document.querySelectorAll('.hero__actions .btn--light, .cta__actions .btn--light, .pkg .btn--light').forEach((btn) => {
    btn.classList.add('is-magnetic');
    const mx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const my = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2), dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      mx(Math.max(-1, Math.min(1, dx)) * 8); my(Math.max(-1, Math.min(1, dy)) * 6);
    });
    btn.addEventListener('pointerleave', () => { mx(0); my(0); });
  });

  // Hover image cycling (image cards with data-cycle)
  document.querySelectorAll('[data-cycle]').forEach((frame) => {
    const srcs = frame.dataset.cycle.split(',').filter(Boolean);
    if (!srcs.length) return;
    const link = frame.closest('.work__media');
    let imgs = null, timer = 0, i = -1;
    const step = () => { imgs.forEach((im) => im.classList.remove('is-on')); i = (i + 1) % imgs.length; imgs[i].classList.add('is-on'); };
    link.addEventListener('pointerenter', () => {
      if (!imgs) imgs = srcs.map((s) => { const im = new Image(); im.src = s; im.alt = ''; im.decoding = 'async'; im.className = 'work__cyc'; im.setAttribute('aria-hidden', 'true'); frame.append(im); return im; });
      clearInterval(timer); i = -1;
      timer = setTimeout(() => { step(); timer = setInterval(step, 1100); }, 260);
    });
    link.addEventListener('pointerleave', () => { clearTimeout(timer); clearInterval(timer); if (imgs) imgs.forEach((im) => im.classList.remove('is-on')); });
  });
}
