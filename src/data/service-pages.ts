// Service pages (Stage 4A): shared structure per service + types. Copy lives in service-pages.en.ts / service-pages.ar.ts
// (Researcher's content/services/*.md, used as written; {{TODO}} figures replaced by sample values from placeholders.ts).
import type { Img } from './media';
import { images, videos } from './media';
import { services } from './services';
import en from './service-pages.en';
import ar from './service-pages.ar';
import type { Lang } from './types';

export interface Field { label: string; type: 'multi' | 'choice' | 'text' | 'long' | 'date' | 'number' | 'url' | 'select'; options?: string[]; optionsIls?: string[]; sample?: boolean }
export interface ScopeItem { name: string; desc: string; best: string }
export interface Faq { q: string; a: string; sample?: boolean }
export interface ServiceCopy {
  meta: { title: string; description: string };
  overline: string; headline: string; intro: string; cta: string;
  honesty?: string;            // AI Search Visibility: no-guarantee note under the hero
  groups?: [string, string];   // Creative Production: two scope groups (Film / Photo, edit + social)
  scope: ScopeItem[];
  process: { title: string; line: string }[];
  faq: Faq[];
  form: Field[];
  custom: string;              // "Custom quote" line (what is quoted on scope)
}
export interface PagesCopy {
  ui: {
    home: string; services: string; breadcrumb: string;
    from: string; vat: string; askAbout: string;
    scopeOver: string; scopeTitle: string; best: string;
    processOver: string; processTitle: string;
    workRelated: string; workSelected: string; workSelectedLine: string; workRelatedLine: string;
    pkgOver: string; pkgTitle: string; pkgLine: string; customTitle: string; customCta: string;
    quoteOver: string; faqOver: string; faqTitle: string;
    prev: string; next: string; allServices: string; samplesNote: string;
    formService: string; formServiceAny: string; formSample: string;
  };
  index: {
    meta: { title: string; description: string };
    overline: string; headline: string; intro: string; cta: string; ctaHelp: string;
    listLabel: string; explore: string;
    askOver: string; askTitle: string; askLine: string; askCta: string;
    pkgOver: string; pkgTitle: string; pkgBody: string; pkgCta: string;
    ctaOver: string; ctaTitle: string; ctaBody: string; ctaBrief: string; ctaAsk: string;
  };
  services: Record<string, ServiceCopy>;
}

export interface Visual { img: Img; video?: string; contain?: boolean; flip?: boolean }
const hex = (n: string, en: string, ar: string): Img => ({ base: `brand/hex-${n}`, widths: [800, 1600], w: 1600, h: 900, alt: { en, ar } });
const hexAlt = { en: 'Gate33 brand render: green hexagonal gate forms on black', ar: 'تصميم ثلاثي الأبعاد من هوية Gate33: أشكال سداسية خضراء على خلفية سوداء' };

// Per service: hero visual, related work (real cases from work.ts only), related packages (index in the packages list).
// workMode 'related' = the content file lists a fit. 19 Nov (Shifaa Q27): services without their own documented case show
// no work section until approved examples arrive ('selected' kept for when they do).
export const serviceShared: Record<string, { visual: Visual; work: string[]; workMode: 'related' | 'selected'; packages: number[]; logoStrip?: boolean }> = {
  'ai-search-visibility': { visual: { img: hex('03', hexAlt.en, hexAlt.ar) }, work: [], workMode: 'selected', packages: [] },
  'branding-creative-design': { visual: { img: images.zakharefMural }, work: ['cyrin', 'plutrex', 'zakharef', 'the-point', 'abdo'], workMode: 'related', packages: [0, 1], logoStrip: true },
  'creative-production': { visual: { img: images.coffee, video: videos.coffee.loop }, work: ['coffee-film', 'the-point'], workMode: 'related', packages: [3] },
  'web-apps-business-systems': { visual: { img: hex('01', hexAlt.en, hexAlt.ar) }, work: [], workMode: 'selected', packages: [2] },
  'digital-marketing-growth': { visual: { img: hex('05', hexAlt.en, hexAlt.ar) }, work: [], workMode: 'selected', packages: [] },
  'product-development-sourcing': { visual: { img: hex('01', hexAlt.en, hexAlt.ar), flip: true }, work: [], workMode: 'selected', packages: [] },
  'events-brand-experiences': { visual: { img: hex('05', hexAlt.en, hexAlt.ar), flip: true }, work: [], workMode: 'selected', packages: [] },
};

export const pagesCopy = (lang: Lang): PagesCopy => (lang === 'ar' ? ar : en);
export const serviceOrder = services.map((s) => s.slug);
