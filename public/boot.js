// Tiny blocking script (served from /, CSP-safe): enables reveal + hero-intro styles only when they can actually run.
// Failsafe: if the motion module has not started within 2.5s (script error, blocked bundle), every hiding class is removed.
// Every page opens at the top (12 + 13 Nov, Ahmed: pages appeared at the middle or the end, then jumped up).
// The page itself starts at 0; inside a frame (the claude.ai preview) the outer page keeps its scroll between pages.
// So this runs at once, before anything is painted: the page is held invisible, every scroll container up the chain is
// sent to the top, then the page is shown. A #link keeps its target. Failsafe: shown after 700 ms whatever happens.
(function () {
  if (location.hash) return;
  var d = document.documentElement;
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  var framed = window.top !== window;
  var top = function () {
    if (window.scrollY) window.scrollTo(0, 0);
    if (framed) { try { d.scrollIntoView({ block: 'start', inline: 'nearest' }); } catch (e) {} }
  };
  var show = function () { d.classList.remove('g33-placing'); };
  if (framed) d.classList.add('g33-placing');
  top();
  requestAnimationFrame(function () { top(); show(); });          // shown at the first frame, already at the top
  document.addEventListener('DOMContentLoaded', top);
  window.addEventListener('load', top);
  setTimeout(show, 400);
})();
(function () {
  var d = document.documentElement;
  d.classList.add('js');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  if ('IntersectionObserver' in window) d.classList.add('reveal-ready');
  d.classList.add('motion-intro');
  // Gate entry (icon blocks assemble, then part): once per browser session. ?entry=on forces it (QA), ?entry=off skips it.
  var q = location.search, seen = false;
  try { seen = !!sessionStorage.getItem('g33-entry'); sessionStorage.setItem('g33-entry', '1'); }
  catch (e) { seen = window.name === 'g33-entry'; window.name = 'g33-entry'; } // storage blocked: remember in the tab instead
  if ((!seen || q.indexOf('entry=on') > -1) && q.indexOf('entry=off') < 0) d.classList.add('has-gate-entry');
  setTimeout(function () {
    if (!d.classList.contains('motion-on')) { d.classList.remove('motion-intro'); d.classList.remove('reveal-ready'); }
  }, 2500);
})();
