// The four packages: ONE source of truth for Home (#packages), the service pages, Ask Gate and /<lang>/packages/.
// Name, line and the three card bullets are the approved Home copy (Figma Style Tile v2), moved here unchanged.
// Scope details (forWho, gets, compare rows) come from content/services/*.md and the CEO's indicative scopes in
// briefs/placeholder-policy.md. Every price, timeline and number is SAMPLE data from placeholders.ts (shown with the tag).
// TODO: final scopes, prices and timelines from Shifaa.
import type { Lang, Pkg } from './types';
import { packages as pkgSamples, packageScope as sc, SAMPLE } from './placeholders';

type T = { en: string; ar: string };
const t = (en: string, ar: string): T => ({ en, ar });
const nb = ' ';

export interface PackageDef {
  slug: string;
  service: string;     // the service pre-selected in the proposal sheet
  name: T; line: T; items: T[]; popular?: boolean;
  forWho: T;           // "Best for"
  gets: T[];           // "What you get" (packages page)
}

export const packageDefs: PackageDef[] = [
  {
    slug: 'brand-starter', service: 'branding-creative-design',
    name: t('Brand Starter', 'انطلاقة العلامة'),
    line: t(`The${nb}essentials for${nb}a${nb}new brand.`, 'الأساسيات لعلامة جديدة.'),
    items: [t(`Logo and${nb}colour palette`, 'الشعار ونظام الألوان'), t('Mini brand guide', 'دليل هوية مختصر'), t('Social media templates', 'قوالب تواصل اجتماعي')],
    forWho: t('New businesses that need a professional identity to open with.', 'المشاريع الجديدة التي تحتاج إلى هوية احترافية تنطلق بها.'),
    gets: [t('Logo, with final files in every format', 'شعار بملفاته النهائية بكل الصيغ'), t('Colour palette and typography', 'لوحة الألوان والخطوط'), t('Mini brand guide', 'دليل هوية مختصر'), t('Social media templates', 'قوالب تواصل اجتماعي')],
  },
  {
    slug: 'brand-system', service: 'branding-creative-design', popular: true,
    name: t('Brand System', 'نظام العلامة'),
    line: t(`A${nb}complete identity, ready for${nb}every touchpoint.`, 'هوية متكاملة جاهزة لكل نقاط التواصل.'),
    items: [t(`Logo, colour and${nb}type system`, 'الشعار ونظام الألوان والخطوط'), t('Brand guidelines', 'دليل الهوية'), t('Social media templates', 'قوالب التواصل الاجتماعي')],
    forWho: t('Growing brands with several branches, products or teams.', 'العلامات النامية متعددة الفروع أو المنتجات أو الفرق.'),
    gets: [t('Strategy and positioning session', 'جلسة لاستراتيجية العلامة وتموضعها'), t('Logo, colour and type system', 'الشعار ونظام الألوان والخطوط'), t('Patterns, icons and imagery rules', 'الأنماط والأيقونات وقواعد الصور'), t('Full brand guidelines', 'دليل هوية كامل'), t('Core applications and social templates', 'التطبيقات الأساسية وقوالب التواصل الاجتماعي'), t('Arabic and English logo versions', 'نسختان عربية وإنجليزية من الشعار')],
  },
  {
    slug: 'ecommerce-launch', service: 'web-apps-business-systems',
    name: t('E-commerce Launch', 'إطلاق المتجر الإلكتروني'),
    line: t(`A${nb}store ready to${nb}sell.`, 'متجر جاهز للبيع.'),
    items: [t('Custom Shopify store', 'متجر Shopify بتصميم مخصص'), t(`Product pages and${nb}copy`, 'صفحات منتجات وكتابة محتوى'), t(`Payments and${nb}shipping set-up`, 'إعداد الدفع والشحن')],
    forWho: t('Brands ready to sell online in the UAE and the Gulf.', 'العلامات المستعدة للبيع عبر الإنترنت في الإمارات والخليج.'),
    gets: [t('Custom Shopify store, designed and built', 'متجر Shopify مخصص، تصميماً وتطويراً'), t(`Up to ${sc.value.products} product pages with copy`, `حتى ${sc.value.products} صفحة منتج مع المحتوى`), t('Arabic and English checkout', 'إتمام الشراء بالعربية والإنجليزية'), t('Payments and shipping set-up', 'إعداد الدفع والشحن')],
  },
  {
    slug: 'content-production', service: 'creative-production',
    name: t('Content Production', 'إنتاج المحتوى'),
    line: t(`Monthly content, ready to${nb}post.`, 'محتوى شهري جاهز للنشر.'),
    items: [t(`Monthly photo and${nb}video shoot`, 'جلسة تصوير شهرية'), t(`Posts and${nb}reels`, 'منشورات ومقاطع ريلز'), t('Content calendar', 'تقويم محتوى')],
    forWho: t('Brands that post often and need content shot to their identity.', 'العلامات التي تنشر باستمرار وتحتاج إلى محتوى يُصوَّر وفق هويتها.'),
    gets: [t(`${sc.value.shootDays} shoot day, photo and video`, 'يوم تصوير واحد للصور والفيديو'), t(`One hero film up to ${sc.value.filmSeconds} seconds`, `فيلم رئيسي حتى ${sc.value.filmSeconds} ثانية`), t(`${sc.value.cuts} vertical cuts for reels`, `${sc.value.cuts} مقاطع عمودية للريلز`), t(`${sc.value.photos} edited photos`, `${sc.value.photos} صورة معدّلة`), t('Content calendar', 'تقويم محتوى')],
  },
];

/** The Home / service-page card shape (unchanged from the approved Home copy). */
export const packageItems = (lang: Lang): Pkg[] =>
  packageDefs.map((p) => ({ name: p.name[lang], line: p.line[lang], items: p.items.map((i) => i[lang]), ...(p.popular ? { popular: true } : {}), slug: p.slug, service: p.service }));

// ── Compare table (packages page). Cell: true = included, false = not included, T = a short value (sample numbers).
// Rows only where the service content or the indicative scopes support them; when unsure, the item is left out.
export type Cell = boolean | T;
export interface CompareRow { label: T; cells: [Cell, Cell, Cell, Cell]; sample?: boolean }
export interface CompareGroup { title: T; rows: CompareRow[] }
const P = pkgSamples.map((p) => p.value);
const inProposal = t('In your proposal', 'ضمن عرض السعر');
export const compare: CompareGroup[] = [
  { title: t('Strategy', 'الاستراتيجية'), rows: [
    { label: t('Strategy and positioning session', 'جلسة الاستراتيجية والتموضع'), cells: [false, true, false, false] },
  ] },
  { title: t('Identity', 'الهوية'), rows: [
    { label: t('Logo, final files in every format', 'الشعار بملفاته النهائية بكل الصيغ'), cells: [true, true, false, false] },
    { label: t('Colour palette and typography', 'لوحة الألوان والخطوط'), cells: [true, true, false, false] },
    { label: t('Patterns, icons and imagery rules', 'الأنماط والأيقونات وقواعد الصور'), cells: [false, true, false, false] },
    { label: t('Brand guide', 'دليل الهوية'), cells: [t('Mini', 'مختصر'), t('Full', 'كامل'), false, false] },
    { label: t('Social media templates', 'قوالب التواصل الاجتماعي'), cells: [true, true, false, false] },
    { label: t('Core brand applications', 'التطبيقات الأساسية للهوية'), cells: [false, true, false, false] },
  ] },
  { title: t('Digital', 'الرقمي'), rows: [
    { label: t('Custom Shopify store, design and build', 'متجر Shopify مخصص، تصميماً وتطويراً'), cells: [false, false, true, false] },
    { label: t('Product pages with copy', 'صفحات المنتجات مع المحتوى'), cells: [false, false, t(`Up to ${sc.value.products}`, `حتى ${sc.value.products}`), false], sample: true },
    { label: t('Arabic and English checkout', 'إتمام الشراء بالعربية والإنجليزية'), cells: [false, false, true, false] },
    { label: t('Payments and shipping set-up', 'إعداد الدفع والشحن'), cells: [false, false, true, false] },
  ] },
  { title: t('Production', 'الإنتاج'), rows: [
    { label: t('Shoot day, photo and video', 'يوم تصوير للصور والفيديو'), cells: [false, false, false, t(`${sc.value.shootDays} day`, 'يوم واحد')], sample: true },
    { label: t('Hero film', 'الفيلم الرئيسي'), cells: [false, false, false, t(`Up to ${sc.value.filmSeconds}${nb}s`, `حتى ${sc.value.filmSeconds} ثانية`)], sample: true },
    { label: t('Vertical cuts for reels', 'مقاطع عمودية للريلز'), cells: [false, false, false, t(sc.value.cuts, sc.value.cuts)], sample: true },
    { label: t('Edited photos', 'صور معدّلة'), cells: [false, false, false, t(sc.value.photos, sc.value.photos)], sample: true },
    { label: t('Content calendar', 'تقويم المحتوى'), cells: [false, false, false, true] },
  ] },
  { title: t('Support', 'المتابعة'), rows: [
    { label: t('Revision rounds', 'جولات التعديل'), cells: [t(revN(0, 'en'), revN(0, 'ar')), t(revN(1, 'en'), revN(1, 'ar')), inProposal, inProposal], sample: true },
    { label: t('Typical timeline', 'المدة المعتادة'), cells: [P[0].timeline, P[1].timeline, P[2].timeline, P[3].timeline], sample: true },
  ] },
];
function revN(i: number, lang: Lang) { const r = pkgSamples[i].value.revisions; return r ? r[lang] : inProposal[lang]; }

export const pkgPrice = (i: number): string | null => (SAMPLE ? pkgSamples[i].value.price : null);
