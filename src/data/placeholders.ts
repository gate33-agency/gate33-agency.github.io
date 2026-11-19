// Sample data for the PRIVATE preview (placeholder policy, Ahmed 9 Nov 2026, 22:09).
// ONE switch: while SAMPLE is true, every value below renders with a visible "Sample" / «نموذج تجريبي» marker.
// `npm run build` prints every sample item; `npm run build:production` FAILS while SAMPLE is true (scripts/check-samples.mjs).
// Nothing here is real data. All of it is replaced by Shifaa's figures before launch.
// Never put here: client names, awards, team bios, legal/VAT numbers. Facts Shifaa confirmed (19 Nov) are plain values, not samples.
// Standalone on purpose (no imports), so the build guard can load it directly with Node.

export const SAMPLE = true;

type T = { en: string; ar: string };
export interface Sample<V = T> { id: string; value: V; sample: true }
/** A sample slot that now holds a confirmed value (no Sample marker). */
export type Slot<V = T> = Sample<V> | { id: string; value: V; sample?: undefined };
const s = <V = T>(id: string, value: V): Sample<V> => ({ id, value, sample: true });
const t = (en: string, ar: string): T => ({ en, ar });

export const sampleLabel: T = t('Sample', 'نموذج تجريبي');
export const tbc: T = t('To be confirmed', 'قيد التأكيد');

// Currency by visitor location (Shifaa Q15/Q18: shekel in Israel, dirham in the UAE/GCC, from a USD reference; Ahmed 19 Nov:
// automatic). The page is built in AED; an inline script in BaseLayout swaps to ILS when the visitor's time zone is Israel's
// (or ?cur=ils for testing). ILS = Shifaa's USD figures × 3.0 ILS/USD (rate checked 19 Nov 2026), rounded to 100; services she
// gave in AED only are converted at 3.6725 AED/USD first. Every figure is still a Sample.
const ILS_OF: Record<string, string> = { '4,500': '3,700', '12,000': '9,800', '9,500': '7,800', '3,000': '2,500', '2,000': '1,600', '6,000': '4,900', '15,000': '12,300', '20,000': '16,300' };
export const ils = (aed?: string | null): string | undefined => (aed ? ILS_OF[aed] : undefined);
export const curLabel = { en: { aed: 'AED', ils: 'ILS' }, ar: { aed: 'درهم', ils: 'شيكل' } };
// Prices Shifaa quotes per project (19 Nov, Q15–Q18): the value 'quote' renders as this text, without a Sample marker.
export const isQuote = (v?: string | null) => v === 'quote';
export const quoteLabel: T = t('Quoted per project', 'حسب نطاق المشروع');
export const quoteNote: T = t('Scope, timeline and price are set in your proposal', 'يُحدَّد النطاق والمدة والسعر في عرض السعر');

// Packages (CEO, Dubai mid-tier ranges, 9 Nov). All "From", excl. VAT. Order = home.<lang>.ts packages.items.
export interface PkgSample { price: string; timeline: T; revisions?: T }
export const packages: Slot<PkgSample>[] = [
  // 19 Nov: Shifaa's own sample figures (Q15). Still samples: replaced and approved before launch.
  s('package.brand-starter', { price: '4,500', timeline: t('2–3 weeks', '2–3 أسابيع'), revisions: t('2 revision rounds', 'جولتا تعديل') }),
  s('package.brand-system', { price: '12,000', timeline: t('4–6 weeks', '4–6 أسابيع'), revisions: t('2 revision rounds', 'جولتا تعديل') }),
  s('package.ecommerce-launch', { price: '9,500', timeline: t('5–8 weeks', '5–8 أسابيع'), revisions: t('2 revision rounds', 'جولتا تعديل') }),
  // Content Production is quoted per project (Shifaa Q15/Q16): real, not a sample.
  { id: 'package.content-production', value: { price: 'quote', timeline: t('Set per project', 'تُحدَّد لكل مشروع') } },
];

// Package scope numbers (CEO indicative scopes, policy 9 Nov): E-commerce Launch products; Content Production deliverables.
export const packageScope = s('package.scope', { products: '40', shootDays: '1', filmSeconds: '60', cuts: '5', photos: '20' });

// Service starting points, shown as "Projects from AED …" on each service hero.
export const serviceFrom: Record<string, Slot<{ amount: string; unit?: T; note?: T }>> = {
  // 19 Nov: Shifaa's UAE sample figures (Q18). AI search, product and events are quoted per project ('quote' = real, shown as text).
  'ai-search-visibility': { id: 'from.ai-search-visibility', value: { amount: 'quote' } },
  'branding-creative-design': s('from.branding-creative-design', { amount: '4,500' }),
  'creative-production': s('from.creative-production', { amount: '3,000' }),
  'web-apps-business-systems': s('from.web-apps-business-systems', { amount: '9,500' }),
  'digital-marketing-growth': s('from.digital-marketing-growth', { amount: '2,000', unit: t('/ month', 'شهرياً'), note: t('Media budget separate', 'ميزانية الإعلانات منفصلة') }),
  'product-development-sourcing': { id: 'from.product-development-sourcing', value: { amount: 'quote' } },
  'events-brand-experiences': { id: 'from.events-brand-experiences', value: { amount: 'quote' } },
};

// Timelines used inside FAQ answers. 19 Nov: indicative ranges from Shifaa (Q19), confirmed per brief, so they are real
// (no Sample marker). Product sourcing and event lead time vary by project (written as such in the FAQs).
export interface Real<V = T> { id: string; value: V }
const r = <V = T>(id: string, value: V): Real<V> => ({ id, value });
export const timelines = {
  logo: r('timeline.logo', t('1–2 weeks', '1–2 أسبوع')),
  identity: r('timeline.identity', t('3–6 weeks', '3–6 أسابيع')),
  film: r('timeline.film', t('2–4 weeks', '2–4 أسابيع')),
  website: r('timeline.website', t('3–6 weeks', '3–6 أسابيع')),
  store: r('timeline.store', t('5–8 weeks', '5–8 أسابيع')),
  campaign: r('timeline.campaign', t('2–4 weeks', '2–4 أسابيع')),
  audit: r('timeline.audit', t('1–2 weeks', '1–2 أسبوع')),
  // Suggested by us; Shifaa asked to confirm it before publishing (Q5), so it stays a sample.
  reply: s('timeline.reply', t('1 business day', 'يوم عمل واحد')),
  revisions: s('timeline.revisions', t('2–3', '2–3')),
};

// Budget ranges offered on the proposal forms (web, marketing, events). AED.
export const budgetRangesIls = {
  en: ['Under ILS 16,000', 'ILS 16,000–40,000', 'ILS 40,000–80,000', 'Above ILS 80,000', 'Not sure yet'],
  ar: ['أقل من 16,000 شيكل', '16,000–40,000 شيكل', '40,000–80,000 شيكل', 'أكثر من 80,000 شيكل', 'لم أحدّد بعد'],
};
export const adBudgetRangesIls = {
  en: ['Under ILS 8,000', 'ILS 8,000–25,000', 'ILS 25,000–60,000', 'Above ILS 60,000', 'Not sure yet'],
  ar: ['أقل من 8,000 شيكل', '8,000–25,000 شيكل', '25,000–60,000 شيكل', 'أكثر من 60,000 شيكل', 'لم أحدّد بعد'],
};
export const budgetRanges = s('form.budget-ranges', {
  en: ['Under AED 20,000', 'AED 20,000–50,000', 'AED 50,000–100,000', 'Above AED 100,000', 'Not sure yet'],
  ar: ['أقل من 20,000 درهم', '20,000–50,000 درهم', '50,000–100,000 درهم', 'أكثر من 100,000 درهم', 'لم أحدّد بعد'],
});
export const adBudgetRanges = s('form.ad-budget-ranges', {
  en: ['Under AED 10,000', 'AED 10,000–30,000', 'AED 30,000–75,000', 'Above AED 75,000', 'Not sure yet'],
  ar: ['أقل من 10,000 درهم', '10,000–30,000 درهم', '30,000–75,000 درهم', 'أكثر من 75,000 درهم', 'لم أحدّد بعد'],
});

// Home "In numbers": 19 Nov real figures from Shifaa (Q8/Q14), rendered from home.<lang>.ts. No samples left here.
export const results: (Sample<string> | null)[] = [null, null, null, null];

// Case-study "Results (sample)" blocks, keyed by case slug (src/data/case-studies.ts sampleResults). Policy rule 5: only
// with the block titled "Results (sample)", never as if measured. Empty until Ahmed approves one for a given case.
export const caseResults: Record<string, Sample<{ value: string; label: T }[]>> = {};

// Testimonials: invented sample quotes, NEVER attributed to a real client or person; no logos next to them (policy rule 4).
export const attribution: T = t('Client name · Role, Company', 'اسم العميل · المنصب، الشركة');
export const testimonials: Record<string, Sample> = {
  home: s('testimonial.home', t(
    'One team handled our identity, the launch film and the first campaign. Everything looked like one brand from the very first day, and we never had to brief the same thing twice.',
    'تولّى فريق واحد هويتنا وفيلم الإطلاق وأول حملة، فظهر كل شيء بوصفه علامة واحدة منذ اليوم الأول، ولم نضطر إلى شرح الفكرة نفسها مرتين.')),
  'ai-search-visibility': s('testimonial.ai-search-visibility', t(
    'The audit showed us exactly where AI assistants were getting our services wrong. Three months later, the answers our customers see are accurate in Arabic and English.',
    'كشف لنا التدقيق بدقة أين كانت المساعدات الذكية تخطئ في وصف خدماتنا. وبعد ثلاثة أشهر، باتت الإجابات التي يراها عملاؤنا صحيحة بالعربية والإنجليزية.')),
  'branding-creative-design': s('testimonial.branding-creative-design', t(
    'They gave us a logo that reads beautifully in both languages and a system our suppliers actually follow. Our branches finally look like one brand.',
    'منحونا شعاراً يُقرأ بجمال باللغتين، ونظاماً يلتزم به موردونا فعلاً. وأخيراً باتت فروعنا تبدو علامة واحدة.')),
  'creative-production': s('testimonial.creative-production', t(
    'The film was planned down to the last shot, and the shoot day ran without a single surprise. We got the hero film and the vertical cuts in the same week.',
    'خُطِّط للفيلم حتى آخر لقطة، ومرّ يوم التصوير دون أي مفاجأة. واستلمنا الفيلم الرئيسي والنسخ العمودية في الأسبوع نفسه.')),
  'web-apps-business-systems': s('testimonial.web-apps-business-systems', t(
    'Our new store works properly in Arabic, and bookings now land straight in the system. The team stopped copying orders by hand.',
    'يعمل متجرنا الجديد بالعربية كما ينبغي، وتصل الحجوزات الآن مباشرة إلى النظام. ولم يعد فريقنا ينقل الطلبات يدوياً.')),
  'digital-marketing-growth': s('testimonial.digital-marketing-growth', t(
    'For the first time we get a monthly report we can read in five minutes: what we spent, what it brought and what changes next.',
    'لأول مرة نتلقّى تقريراً شهرياً نقرؤه في خمس دقائق: ما أنفقناه، وما حقّقه، وما الذي سيتغيّر بعد ذلك.')),
  'product-development-sourcing': s('testimonial.product-development-sourcing', t(
    'They took our idea from a sketch to a finished, packaged product, and kept us updated at every sample. We knew where things stood all the way.',
    'نقلوا فكرتنا من رسم أولي إلى منتج مكتمل ومغلّف، وأطلعونا على كل عيّنة أولاً بأول، فكنّا على بيّنة من كل مرحلة.')),
  'events-brand-experiences': s('testimonial.events-brand-experiences', t(
    'The opening ran exactly to plan, and every corner looked like our brand. We had guests photographing the space before the doors even opened.',
    'سار الافتتاح وفق الخطة تماماً، وحملت كل زاوية ملامح علامتنا، حتى إن الضيوف بدؤوا تصوير المكان قبل أن تُفتح الأبواب.')),
};

// Contact (19 Nov, Shifaa's answers Q1–Q7b; Ahmed confirmed the +972 code): all real, no Sample marker.
// No street address or office (Q3). Hours set later: contact and meetings by appointment (Q4).
// WhatsApp: Shifaa asked for the Instagram bio link, which opens a chat with this number; wa.me/<number> opens the same chat.
export const contact = {
  email: { value: 'hello@gate-33.com' },
  phone: { display: '+972 52 741 9819', tel: '+972527419819' },
  whatsapp: { url: 'https://wa.me/972527419819' },
  instagram: { handle: '@gate_33agency', url: 'https://www.instagram.com/gate_33agency/' },
  markets: { value: t('Israel, the UAE and the GCC', 'إسرائيل والإمارات ودول مجلس التعاون الخليجي') },
  hours: { value: t('By appointment', 'بموعد مسبق') },
};

/** Every sample item (id + short value), for the build guard. */
export function sampleItems(): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (!v || typeof v !== 'object') return;
    if ((v as Sample).sample === true) {
      const val = (v as Sample<unknown>).value as unknown;
      const show = typeof val === 'string' ? val : (val as T).en ?? (val as { price?: string; amount?: string }).price ?? (val as { amount?: string }).amount ?? '';
      out.push(`${(v as Sample).id}${show ? ` = ${String(show).replace(/ /g, ' ').slice(0, 60)}` : ''}`);
      return;
    }
    Object.values(v as object).forEach(walk);
  };
  walk({ packages, packageScope, serviceFrom, timelines, budgetRanges, adBudgetRanges, results, caseResults, testimonials });
  return out;
}
