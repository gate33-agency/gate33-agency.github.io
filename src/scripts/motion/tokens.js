// Gate33 motion tokens (JS side). Mirrors the --dur-* / --ease-* custom properties in src/styles/tokens.css.
// Direction: "calm luxury" — slow, confident, one signature ease, nothing bounces.
export const DUR = {
  fast: 0.15,  // hovers, small UI feedback
  base: 0.6,   // small elements, overlines, buttons
  text: 0.9,   // headings / line reveals
  slow: 1.1,   // images, media
  hero: 1.4,   // the hero moment (whole sequence settles by ~1.6s)
};

// Signature curves (registered with CustomEase in index.js)
export const EASE = {
  gate: '0.2,0.8,0.2,1',      // signature: every reveal and UI move (same as CSS --ease-gate)
  gateHero: '0.16,1,0.3,1',   // long expo-out settle for the hero moment and masked line rises
};

export const STAGGER = {
  lines: 0.09,  // masked heading lines
  words: 0.02,  // word cascade (AR + EN; DOM order = reading order, so RTL runs right-to-left by itself)
  items: 0.06,  // buttons, small groups
  list: 0.03,   // long lists (hero services index)
};

export const REVEAL = {
  start: 'top 86%', // when a [data-reveal] element triggers (once)
  rise: 22,         // px travel for fade-ups
};

// Scrub for scroll-linked tweens: true = locked to the scroll position (no lag), a number = seconds of catch-up.
export const scrubLag = () => (window.__g33Lenis ? 0.3 : true);

// Phones and tablets (< 1024px): motion stays compositor-only (transform / opacity), no animated clip-path and no scrubbed
// scaling of the playing hero film (19 Nov, Ahmed: "finish the phone performance items").
export const isPhone = () => window.matchMedia('(max-width: 1023.98px)').matches;
