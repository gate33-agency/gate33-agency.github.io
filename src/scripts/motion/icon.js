// Icon-shape motion (Ahmed, 10 Nov): the Gate33 mark used at key moments only.
// 1) Gate entry is pure CSS (GateEntry.astro + icon-motion.css); this file only exposes its length so the page intro can wait for it.
// 2) Icon slices: three diagonal bands at the slant of the mark's blocks slide away along their own length and uncover a key image.
//    Transform only (the bands carry a static clip-path; nothing is clipped on the image itself).

// Seconds until the gate starts to part (0 when the entry is not playing on this page view).
import { isPhone } from './tokens.js';

export const entryDelay = () => (document.documentElement.classList.contains('has-gate-entry') ? 0.8 : 0);

const SLANT = 76.22 / 78.58; // rise over run of the slanted edge in the icon artwork (about 44 degrees)

// 12 Nov (Ahmed: "a professional solution that animates the shape of the image itself"). No bands, nothing laid over the
// picture. The frame opens in the slant of the mark: it starts as a slanted hairline across the centre and widens to the full
// frame while the picture settles (scale 1.18 -> 1). One-off, about 1.4 s, a single clip-path on one frame (not scrubbed).
// Frames already in view on arrival open just after the page intro; the rest open as they come into view while scrolling.
export function iconSlices(gsap, ScrollTrigger) {
  const phone = isPhone(); // phones/tablets: the frame fades and settles (compositor only) instead of the animated slanted clip-path
  document.querySelectorAll('[data-slices]').forEach((frame) => {
    if (frame.getBoundingClientRect().bottom < 0) return;
    const media = frame.querySelectorAll('img, video');
    if (phone) {
      gsap.set(frame, { opacity: 0 });
      gsap.set(media, { scale: 1.12 });
      const run = (delay = 0) => {
        gsap.to(frame, { opacity: 1, duration: 0.9, delay, ease: 'power2.out', clearProps: 'opacity' });
        gsap.to(media, { scale: 1, duration: 1.4, delay, ease: 'power3.out', clearProps: 'transform' });
      };
      ScrollTrigger.create({ trigger: frame, start: frame.dataset.slicesStart || 'top 85%', once: true, onEnter: () => run(window.scrollY > 4 ? 0 : 0.35 + entryDelay()) });
      return;
    }
    const poly = (w, h, open) => {
      const k = h / SLANT;                       // horizontal shift of the slanted edge over the frame height
      const c = w / 2 + k / 2;                   // the slit runs through the centre of the frame
      const lt = open ? 0 : c, rt = open ? w + k : c; // top x of the left and right edges
      return `polygon(${lt}px 0px, ${rt}px 0px, ${rt - k}px ${h}px, ${lt - k}px ${h}px)`;
    };
    const closed = () => poly(frame.offsetWidth, frame.offsetHeight, false);
    const opened = () => poly(frame.offsetWidth, frame.offsetHeight, true);
    gsap.set(frame, { clipPath: closed() });
    gsap.set(media, { scale: 1.18 });
    const onResize = () => gsap.set(frame, { clipPath: closed() });
    window.addEventListener('resize', onResize);

    let done = false;
    const play = (delay = 0) => {
      if (done) return; done = true;
      window.removeEventListener('resize', onResize);
      gsap.set(frame, { clipPath: closed() });
      gsap.to(frame, { clipPath: opened(), duration: 1.6, delay, ease: 'power3.inOut', clearProps: 'clipPath' });
      gsap.to(media, { scale: 1, duration: 2.1, delay, ease: 'power3.out', clearProps: 'transform' });
    };
    const start = frame.dataset.slicesStart || 'top 80%';
    ScrollTrigger.create({ trigger: frame, start, once: true, onEnter: () => play(window.scrollY > 4 ? 0 : 0.35 + entryDelay()) });
  });
}
