// Gate33 motion system (Stage 3.5 A). GSAP + ScrollTrigger + SplitText + CustomEase + Lenis, all bundled from npm (CSP 'self').
// Progressive enhancement:
// - No JS: nothing is ever hidden (boot.js never runs, so no motion classes exist).
// - Reduced motion: boot.js adds no motion classes and this module exits before touching anything.
// - JS fails after boot.js: boot.js removes its hiding classes after 2.5s unless this module has started (html.motion-on).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { EASE } from './tokens.js';
import { heroIntro, heroScroll } from './hero.js';
import { textReveals } from './text.js';
import { smoothScroll } from './smooth.js';
import { statementFill, clientsWave, workSequence, servicesShift, packagesFan, processLine, ctaScale } from './sections.js';
import { pointerDetails } from './pointer.js';
import { entryDelay, iconSlices } from './icon.js';
import { workIndexGrid, archiveWave } from './work.js';
import { caseGallery } from './case.js';
import { cardsLevel, compareTick } from './packages.js';
import { rolesMerge, routesFan } from './company.js';
import { formSettle, legalOpen, nextArrive } from './settle.js';
import { pageIntro, rowsWipe, askGrow, countUp, scopeTilt, processStack, workDrift, faqRules } from './pages.js';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  root.classList.add('motion-on');
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('gate', EASE.gate);
  CustomEase.create('gateHero', EASE.gateHero);
  gsap.defaults({ ease: 'gate' });
  ScrollTrigger.defaults({ invalidateOnRefresh: true });

  // Fonts before any split (capped so a slow font never holds the page back; the split is transient anyway).
  const fontsReady = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 700))]);

  // Native scrolling (macOS, or Lenis off) is already smooth, so scroll-linked motion follows the scroll 1:1 there;
  // with Lenis (stepped mouse wheels) a short catch-up keeps it soft. Read by scrubLag() in tokens.js.
  window.__g33Lenis = !!smoothScroll(gsap, ScrollTrigger);
  // First visit of the session: the gate entry plays first, and the page intro starts as the gate parts.
  const gateWait = new Promise((r) => { const ms = entryDelay() * 1000 - performance.now(); if (ms > 0) setTimeout(r, ms); else r(); });
  Promise.all([fontsReady, gateWait]).then(() => {
    // Intros first, paused: their start states are rendered at once (nothing is shown and then hidden). They start
    // after the rest of the set-up below, so the heavy work never stalls them halfway (15 Nov: About "shook" on load).
    let intro = null;
    try { intro = heroIntro(gsap, SplitText) || pageIntro(gsap, SplitText); }
    finally { root.classList.remove('motion-intro'); } // never leave the page hidden, even if an intro fails
    heroScroll(gsap);
    // Stage 3.5 B: one idea per section, created in page order (the work pin refreshes first: refreshPriority 1)
    const mm = gsap.matchMedia();
    // heroGate removed 12 Nov (Ahmed): the reel is full-bleed from the start, no side leaves, no rounded corners.
    // The gate entry (icon blocks, once per session) is the hero's gate now.
    statementFill(gsap, SplitText);
    clientsWave(gsap);
    workSequence(gsap, ScrollTrigger, mm);
    servicesShift(gsap, ScrollTrigger);
    packagesFan(gsap, mm);
    processLine(gsap, mm);
    ctaScale(gsap);
    // Stage 4A: services index + service pages (no-ops elsewhere)
    rowsWipe(gsap);
    askGrow(gsap);
    scopeTilt(gsap);
    processStack(gsap, mm);
    workDrift(gsap);
    countUp(gsap);
    faqRules(gsap);
    // Stage 5-1: packages page (no-ops elsewhere)
    cardsLevel(gsap, mm);
    compareTick(gsap);
    // Stage 5-3: about + contact (no-ops elsewhere)
    rolesMerge(gsap, mm);
    routesFan(gsap, mm);
    // Stage 4B-1: work index (no-ops elsewhere)
    workIndexGrid(gsap, ScrollTrigger);
    archiveWave(gsap);
    // Stage 4B-2: case-study pages (no-op elsewhere)
    caseGallery(gsap, mm);
    // Final 2: entrances for the sections that had none (no-ops elsewhere)
    formSettle(gsap);
    legalOpen(gsap);
    nextArrive(gsap);
    iconSlices(gsap, ScrollTrigger); // key project images only (work pages)
    textReveals(gsap, ScrollTrigger, SplitText);
    pointerDetails(gsap);
    ScrollTrigger.refresh();
    if (intro) requestAnimationFrame(() => intro.play());
  });
  // Images change heights (lazy work frames, logos): measure again once everything has loaded.
  if (document.readyState === 'complete') fontsReady.then(() => ScrollTrigger.refresh());
  else window.addEventListener('load', () => fontsReady.then(() => ScrollTrigger.refresh()), { once: true });
}
