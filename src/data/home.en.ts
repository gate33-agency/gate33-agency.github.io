import type { HomeCopy } from './types';
import { packageItems } from './packages';

// Stage 3 copy: content/pages/home.md + content/services/_index.md (Researcher, 8 Nov 2026). UK spelling.
// {{TODO}} = open with Shifaa; never invented, never rendered as text (components show a quiet placeholder instead).
const en: HomeCopy = {
  lang: 'en',
  meta: {
    title: 'Gate33 Agency | Branding, Production &\u00A0Growth in\u00A0Dubai',
    description: 'A Dubai creative and marketing agency for brands across the UAE and the Gulf: branding, production, websites, marketing and events, in Arabic and English.',
  },
  nav: [
    { label: 'Services', href: '/en/services/' },
    { label: 'Work', href: '/en/work/' },
    { label: 'Packages', href: '/en/packages/' },
    { label: 'About', href: '/en/about/' },
    { label: 'Contact', href: '/en/contact/' },
  ],
  switchLabel: 'العربية',
  askGate: 'Ask Gate',
  hero: {
    eyebrow: 'Creative &\u00A0marketing agency, Dubai',
    headline: ['Build the\u00A0brand.', 'Create the\u00A0experience.', 'Grow the\u00A0business.'],
    lede: 'Identities, films, websites and\u00A0campaigns for\u00A0companies across the\u00A0UAE and\u00A0the\u00A0Gulf, made in\u00A0Arabic and\u00A0English by\u00A0one team in\u00A0Dubai.',
    cta: 'Request a\u00A0proposal',
    servicesLabel: 'Our\u00A0services',
    pause: 'Pause background video',
    play: 'Play background video',
  },
  intro: 'One team handles the\u00A0identity, the\u00A0film, the\u00A0website and\u00A0the\u00A0campaign. You brief us once, and\u00A0your\u00A0brand looks and\u00A0sounds the\u00A0same from\u00A0the\u00A0logo to\u00A0the\u00A0launch.',
  clients: { eyebrow: 'Clients', title: 'Brands we\u00A0have helped\u00A0build', viewCase: 'View case study' },
  work: {
    eyebrow: 'Selected work',
    title: 'Identities and\u00A0films we\u00A0have\u00A0made',
    all: 'All work',
    viewCase: 'View case study',
    play: 'Play film',
    moreTitle: 'More marks we\u00A0have drawn.',
    moreLine: 'The\u00A0full logo archive, with\u00A0every identity and\u00A0film we\u00A0can show.',
    moreCta: 'All work',
  },
  services: {
    eyebrow: 'Services',
    title: 'Seven services, one\u00A0team',
    line: 'Start with\u00A0one, or\u00A0bring us the\u00A0whole launch.',
    lead: 'From\u00A0first logo to\u00A0full launch, one\u00A0gate for\u00A0your\u00A0brand.',
    swipe: 'Swipe to\u00A0see all seven services',
    explore: 'Explore',
    askTitle: 'Not sure where to\u00A0start?',
    askLine: 'Tell Ask Gate what you are building, and\u00A0it will point you to\u00A0the\u00A0services that fit.',
    askCta: 'Help me choose',
  },
  packages: {
    eyebrow: 'Packages',
    title: 'Ready to\u00A0start? Pick a\u00A0package.',
    line: 'Four packages with\u00A0a\u00A0fixed scope and\u00A0a\u00A0starting price, paid online.',
    popular: 'Most popular',
    from: 'From\u00A0AED',
    price: '{{TODO: price}}', // prices, scopes and timelines per package from Shifaa
    priceNote: 'Price to\u00A0be confirmed',
    vat: 'excl. VAT',
    swipe: 'Swipe to\u00A0compare all four packages',
    buy: 'Buy now',
    reassurance: 'Fixed scope · Clear price · Buy online',
    // Items: src/data/packages.ts (one source of truth, also used by /packages/).
    items: packageItems('en'),
  },
  how: {
    eyebrow: 'How we\u00A0work',
    title: 'Four steps from\u00A0brief to\u00A0launch',
    steps: [
      { title: 'Brief', line: 'Tell us the\u00A0goal; we\u00A0ask the\u00A0right questions.' },
      { title: 'Plan', line: 'Scope, timeline and\u00A0price, agreed in\u00A0writing.' },
      { title: 'Create', line: 'Design, production and\u00A0build, with\u00A0reviews at\u00A0each stage.' },
      { title: 'Launch', line: 'Deliver, go live and\u00A0keep improving.' },
    ],
  },
  results: {
    eyebrow: 'In\u00A0numbers',
    title: '{{TODO: keep or\u00A0remove — only with\u00A0verified figures}}',
    stats: [
      { value: '{{TODO: verified number}}', label: 'Brands built' },
      { value: '{{TODO: verified number}}', label: 'Projects delivered' },
      { value: '{{TODO: verified number}}', label: 'Years of\u00A0experience' },
      { value: '{{TODO: e.g. UAE · KSA — confirm}}', label: 'Markets served' },
    ],
    note: 'Figures are being verified and\u00A0will appear here once confirmed.',
  },
  cta: {
    eyebrow: 'Let’s talk',
    title: 'Have a\u00A0project in\u00A0mind?',
    line: 'Send a\u00A0short brief or\u00A0use Ask Gate. We\u00A0will reply with\u00A0a\u00A0clear next step.',
    button: 'Send my brief',
    ask: 'Ask Gate',
  },
  footer: {
    tagline: 'Creative &\u00A0marketing agency in\u00A0Dubai, for\u00A0brands across the\u00A0UAE and\u00A0the\u00A0Gulf.',
    services: 'Services', company: 'Company', contact: 'Contact',
    companyLinks: ['Work', 'Packages', 'About', 'Contact'],
    email: 'hello@gate-33.com', // TODO: confirm email with Shifaa
    city: 'Dubai, UAE', // TODO: confirm office location
    brief: 'Send my brief',
    rights: '© 2026 Gate33 Agency. All rights reserved.',
    privacy: 'Privacy', terms: 'Terms',
  },
  ui: { openMenu: 'Open menu', closeMenu: 'Close menu', play: 'Play video', skip: 'Skip to\u00A0content' },

  drawer: {
    title: 'Request a\u00A0proposal', line: 'Send a\u00A0short brief and\u00A0we\u00A0will reply with\u00A0a\u00A0clear next step.', // {{TODO: confirm response time with Shifaa before adding one}}
    name: 'Name', email: 'Email', company: 'Company', need: 'What do you need?', submit: 'Send my brief',
    todo: 'Preview: this form is not connected yet, so nothing is sent.', close: 'Close',
    notConnected: 'This form is\u00A0not connected in\u00A0the preview. Nothing was sent.',
  },
};
export default en;
