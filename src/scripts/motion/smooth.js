// Lenis smooth scroll: desktop with a fine pointer only (touch keeps native scrolling). Synced with ScrollTrigger on GSAP's ticker.
// Keyboard, scrollbar and find-in-page stay native (Lenis follows the native scroll position). Sheets scroll natively inside.
import Lenis from 'lenis';

export function smoothScroll(gsap, ScrollTrigger) {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!fine || touch) return null;
  // Ahmed 10 Nov: on Mac the scroll felt slow and shaky. Trackpads and Magic Mouse already deliver smooth, inertial
  // scrolling; Lenis on top of that double-smooths it. So macOS keeps native scrolling; Lenis only smooths stepped mouse wheels.
  // QA override: ?smooth=on / ?smooth=off
  const q = new URLSearchParams(location.search).get('smooth');
  const mac = /mac/i.test((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '');
  if (q === 'off' || (mac && q !== 'on')) return null;

  const lenis = new Lenis({
    lerp: 0.14,
    wheelMultiplier: 1,
    autoRaf: false,
    prevent: (node) => !!(node.closest && node.closest('.sheet, [data-lenis-prevent]')),
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // ui.js locks the body while a sheet (Ask Gate, proposal drawer, mobile nav) is open
  document.addEventListener('g33:lock', (e) => (e.detail ? lenis.stop() : lenis.start()));

  // In-page anchors (#work, #services ...): smooth, landing under the header, URL hash kept. The skip link stays native (focus moves).
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.classList.contains('skip') || a.hasAttribute('data-close')) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, // Lenis already honours html { scroll-padding-top } (header height)
       duration: 1.2, easing: (x) => 1 - Math.pow(1 - x, 4) });
    history.pushState(null, '', url.hash);
  });
  return lenis;
}
