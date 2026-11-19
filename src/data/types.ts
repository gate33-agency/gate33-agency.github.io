export type Lang = 'en' | 'ar';
export interface Pkg { name: string; line: string; items: string[]; popular?: boolean; slug?: string; service?: string }
export interface Step { title: string; line: string }
export interface Stat { value: string; label: string }
export interface HomeCopy {
  lang: Lang;
  meta: { title: string; description: string };
  nav: { label: string; href: string }[];
  switchLabel: string;
  askGate: string;
  hero: { eyebrow: string; headline: [string, string, string]; lede: string; cta: string; servicesLabel: string; pause: string; play: string };
  intro: string;
  clients: { eyebrow: string; title: string; viewCase: string };
  work: { eyebrow: string; title: string; all: string; viewCase: string; play: string; moreTitle: string; moreLine: string; moreCta: string };
  services: { eyebrow: string; title: string; line: string; lead: string; swipe: string; explore: string; askTitle: string; askLine: string; askCta: string };
  packages: { eyebrow: string; title: string; line: string; popular: string; from: string; price: string; priceNote: string; vat: string; swipe: string; buy: string; reassurance: string; items: Pkg[] };
  how: { eyebrow: string; title: string; steps: Step[] };
  results: { eyebrow: string; title: string; stats: Stat[]; note: string };
  cta: { eyebrow: string; title: string; line: string; button: string; ask: string };
  footer: { tagline: string; services: string; company: string; contact: string; companyLinks: string[]; email: string; brief: string; rights: string; privacy: string; terms: string };
  ui: { openMenu: string; closeMenu: string; play: string; skip: string };
  drawer: { title: string; line: string; name: string; email: string; company: string; need: string; submit: string; todo: string; close: string; notConnected: string };
}
