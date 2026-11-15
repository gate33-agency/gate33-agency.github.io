// Case-study template data (Stage 4B-2). One file per case in src/data/cases/<slug>.ts, registered below.
// Route: /<lang>/work/<slug>/ (src/pages/[lang]/work/[slug].astro -> src/components/CasePage.astro).
// Every block is optional and rendered in the order given, so the same template serves a branding case, a case with a
// video, or a short-film page. Values written {{TODO...}} are never rendered (the field or row is skipped).
// Sample results / testimonials come ONLY from src/data/placeholders.ts (caseResults, testimonials) and carry the Sample tag.
import type { Img } from './media';
import { cyrin } from './cases/cyrin';
import { plutrex } from './cases/plutrex';
import { zakharef } from './cases/zakharef';
import { thePoint } from './cases/the-point';
import { abdo } from './cases/abdo';
import { coffeeFilm } from './cases/coffee-film';

export type T = { en: string; ar: string };
export type Lang = 'en' | 'ar';

export type CaseBlock =
  // Text: overline + heading + paragraphs. key names the beat (challenge / idea / solution / any other) for anchors and QA.
  | { type: 'text'; key: string; over: T; title: T; body: T[] }
  // Images. tone = the colour of the artwork's own background, so the frame can sit on it without a hard edge.
  | { type: 'full'; img: Img; caption?: T; ratio?: string; tone?: 'dark' | 'light' }
  // ratio = frame shape ('16/9' default, '7/5', '5/4'): match the artwork so slides with text are never cropped.
  | { type: 'pair'; imgs: [Img, Img]; caption?: T; ratio?: string }
  | { type: 'trio'; imgs: [Img, Img, Img]; caption?: T; ratio?: string }
  // Video: poster first, plays on tap with controls (ui.js [data-play]); never autoplays. src per language.
  | { type: 'video'; src: T; poster: Img; posterAr?: Img; title: T; caption?: T; ratio?: string }
  // System: label / value rows (logo, colour, type, device, applications). swatches = hex colours drawn as SVG (CSP-safe).
  | { type: 'system'; over: T; title: T; rows: { label: T; value: T; swatches?: string[] }[] };

export interface CaseStudy {
  slug: string;                 // same slug as src/data/work.ts (card, filters, next-project order)
  kind: 'case' | 'film';        // film = short-film page (overline + labels change, no system block expected)
  meta: { title: T; description: T };
  overline: T;
  headline: T;                  // the page's only h1
  intro: T;
  facts: { client: T; sector?: T; services: T; market?: T; year?: T };
  cover: Img;                   // gets the icon-slices reveal (data-slices), the only one on the page
  coverTone?: 'dark' | 'light';
  blocks: CaseBlock[];
  outcome?: { over: T; line: T; facts?: { value: string; label: T }[] };
  // Sample-only extras (placeholder policy): ids into placeholders.ts. Leave out for a real client unless Ahmed approves.
  sampleResults?: string;       // key of caseResults in placeholders.ts -> "Results (sample)"
  sampleTestimonial?: string;   // key of testimonials in placeholders.ts (generic attribution only)
  todo?: string[];              // open facts, listed for the owner (never rendered)
}

export const caseStudies: CaseStudy[] = [cyrin, plutrex, zakharef, thePoint, abdo, coffeeFilm];
export const caseBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);

// Shared labels for every case page.
const t = (en: string, ar: string): T => ({ en, ar });
export const caseUi = {
  home: t('Home', 'الرئيسية'),
  work: t('Work', 'أعمالنا'),
  breadcrumb: t('Breadcrumb', 'مسار التنقل'),
  client: t('Client', 'العميل'),
  sector: t('Sector', 'القطاع'),
  services: t('Services', 'الخدمات'),
  market: t('Market', 'السوق'),
  year: t('Year', 'السنة'),
  details: t('Project details', 'تفاصيل المشروع'),
  gallery: t('Project images', 'صور المشروع'),
  play: t('Play film', 'شغّل الفيلم'),
  results: t('Results (sample)', 'النتائج (نموذج تجريبي)'),
  quoteOver: t('Client words', 'كلمة العميل'),
  next: t('Next project', 'المشروع التالي'),
  allWork: t('All work', 'كل الأعمال'),
  ask: t('Ask Gate about this project', 'اسأل Gate عن هذا المشروع'),
  brief: t('Request a proposal', 'اطلب عرض سعر'),
};
