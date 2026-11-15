// Sample data for the PRIVATE preview (placeholder policy, Ahmed 9 Nov 2026, 22:09).
// ONE switch: while SAMPLE is true, every value below renders with a visible "Sample" / «نموذج تجريبي» marker.
// `npm run build` prints every sample item; `npm run build:production` FAILS while SAMPLE is true (scripts/check-samples.mjs).
// Nothing here is real data. All of it is replaced by Shifaa's figures before launch.
// Never put here: client names, awards, founding year, team bios, legal/VAT numbers, phone numbers (those stay "To be confirmed").
// Standalone on purpose (no imports), so the build guard can load it directly with Node.

export const SAMPLE = true;

type T = { en: string; ar: string };
export interface Sample<V = T> { id: string; value: V; sample: true }
const s = <V = T>(id: string, value: V): Sample<V> => ({ id, value, sample: true });
const t = (en: string, ar: string): T => ({ en, ar });

export const sampleLabel: T = t('Sample', 'نموذج تجريبي');
export const tbc: T = t('To be confirmed', 'قيد التأكيد');

// Packages (CEO, Dubai mid-tier ranges, 9 Nov). All "From", excl. VAT. Order = home.<lang>.ts packages.items.
export interface PkgSample { price: string; timeline: T; revisions?: T }
export const packages: Sample<PkgSample>[] = [
  s('package.brand-starter', { price: '9,500', timeline: t('3 weeks', '3 أسابيع'), revisions: t('2 revision rounds', 'جولتا تعديل') }),
  s('package.brand-system', { price: '28,000', timeline: t('6 weeks', '6 أسابيع'), revisions: t('3 revision rounds', '3 جولات تعديل') }),
  s('package.ecommerce-launch', { price: '24,000', timeline: t('6–8 weeks', '6–8 أسابيع') }),
  s('package.content-production', { price: '12,000', timeline: t('2–3 weeks', '2–3 أسابيع') }),
];

// Package scope numbers (CEO indicative scopes, policy 9 Nov): E-commerce Launch products; Content Production deliverables.
export const packageScope = s('package.scope', { products: '40', shootDays: '1', filmSeconds: '60', cuts: '5', photos: '20' });

// Service starting points, shown as "Projects from AED …" on each service hero.
export const serviceFrom: Record<string, Sample<{ amount: string; unit?: T; note?: T }>> = {
  'ai-search-visibility': s('from.ai-search-visibility', { amount: '6,000', unit: t('/ month', 'شهرياً'), note: t('3-month minimum', 'بحد أدنى 3 أشهر') }),
  'branding-creative-design': s('from.branding-creative-design', { amount: '9,500' }),
  'creative-production': s('from.creative-production', { amount: '8,000', unit: t('per film', 'للفيلم') }),
  'web-apps-business-systems': s('from.web-apps-business-systems', { amount: '18,000' }),
  'digital-marketing-growth': s('from.digital-marketing-growth', { amount: '7,500', unit: t('/ month', 'شهرياً'), note: t('Media budget separate', 'ميزانية الإعلانات منفصلة') }),
  'product-development-sourcing': s('from.product-development-sourcing', { amount: '15,000' }),
  'events-brand-experiences': s('from.events-brand-experiences', { amount: '20,000' }),
};

// Timelines and revisions used inside FAQ answers (policy "Typical timelines for FAQs").
export const timelines = {
  logo: s('timeline.logo', t('2–3 weeks', '2–3 أسابيع')),
  identity: s('timeline.identity', t('4–6 weeks', '4–6 أسابيع')),
  film: s('timeline.film', t('3–4 weeks', '3–4 أسابيع')),
  website: s('timeline.website', t('6–8 weeks', '6–8 أسابيع')),
  store: s('timeline.store', t('6–8 weeks', '6–8 أسابيع')),
  campaign: s('timeline.campaign', t('2–3 weeks', '2–3 أسابيع')),
  audit: s('timeline.audit', t('2–3 weeks', '2–3 أسابيع')),
  product: s('timeline.product', t('3–6 months', '3–6 أشهر')),
  eventBooking: s('timeline.event-booking', t('6–8 weeks', '6–8 أسابيع')),
  reply: s('timeline.reply', t('1 business day', 'يوم عمل واحد')),
  revisions: s('timeline.revisions', t('2–3', '2–3')),
};

// Budget ranges offered on the proposal forms (web, marketing, events). AED.
export const budgetRanges = s('form.budget-ranges', {
  en: ['Under AED 20,000', 'AED 20,000–50,000', 'AED 50,000–100,000', 'Above AED 100,000', 'Not sure yet'],
  ar: ['أقل من 20,000 درهم', '20,000–50,000 درهم', '50,000–100,000 درهم', 'أكثر من 100,000 درهم', 'لم أحدّد بعد'],
});
export const adBudgetRanges = s('form.ad-budget-ranges', {
  en: ['Under AED 10,000', 'AED 10,000–30,000', 'AED 30,000–75,000', 'Above AED 75,000', 'Not sure yet'],
  ar: ['أقل من 10,000 درهم', '10,000–30,000 درهم', '30,000–75,000 درهم', 'أكثر من 75,000 درهم', 'لم أحدّد بعد'],
});

// Home "In numbers". Plausible, modest, clearly sample. Years of experience = founding-year territory (policy rule 7): stays "To be confirmed".
export const results: (Sample<string> | null)[] = [
  s('results.brands-built', '40+'),
  s('results.projects-delivered', '120+'),
  null,
  s('results.markets-served', '3'),
];

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

// Contact samples (policy). Phone / WhatsApp are never invented: they stay "To be confirmed".
export const contact = {
  email: s('contact.email', 'hello@gate-33.com'),
  // Real (13 Nov): the agency's own public Instagram account, linked from Shifaa's profile ("Owner of @gate_33agency").
  instagram: { handle: '@gate_33agency', url: 'https://www.instagram.com/gate_33agency/' },
  city: s('contact.city', t('Dubai, United Arab Emirates', 'دبي، الإمارات العربية المتحدة')),
  hours: s('contact.hours', t('Sun–Thu 9:00–18:00 GST', 'الأحد–الخميس 9:00–18:00 بتوقيت الخليج')),
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
  walk({ packages, packageScope, serviceFrom, timelines, budgetRanges, adBudgetRanges, results, caseResults, testimonials, contact });
  return out;
}
