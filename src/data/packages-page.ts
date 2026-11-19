// /<lang>/packages/ copy (Stage 5-1). Package data itself: packages.ts. Sample figures: placeholders.ts (always tagged).
// FAQ is sample-safe: payment terms, VAT, timelines and revisions are "confirmed in your proposal"; no invented policy.
import type { Lang } from './types';
import { bindAll } from './text';
import { packages as pkgSamples } from './placeholders';
import type { Faq } from './service-pages';

export interface PackagesPageCopy {
  meta: { title: string; description: string };
  crumb: string; overline: string; headline: string; intro: string; cta: string; compareLink: string;
  cardsOver: string; cardsTitle: string; cardsLine: string;
  bestFor: string; youGet: string; timeline: string; note: string; pkgLabel: string;
  compareOver: string; compareTitle: string; compareLine: string; caption: string; feature: string;
  yes: string; no: string; swipe: string; priceRow: string;
  askOver: string; askTitle: string; askLine: string; askCta: string; briefCta: string;
  faqOver: string; faqTitle: string; faq: Faq[];
  ctaOver: string; ctaTitle: string; ctaLine: string; ctaBrief: string; ctaAsk: string;
}

const P = pkgSamples.map((p) => p.value);
const en: PackagesPageCopy = {
  meta: {
    title: 'Packages: Branding, E-commerce and Content | Gate33',
    description: 'Four fixed-scope packages from Gate33: Brand Starter, Brand System, E-commerce Launch and Content Production. Compare what each one includes.',
  },
  crumb: 'Packages',
  overline: 'Packages',
  headline: 'Packages with a fixed scope and a starting price.',
  intro: 'Four packages for the most common starting points: a new brand, a complete identity, an online store and content to post. Compare what each one includes, then request it in a few lines.',
  cta: 'Request a proposal',
  compareLink: 'Compare packages',
  cardsOver: 'The packages',
  cardsTitle: 'Choose where to start',
  cardsLine: 'Each package has a set scope and a starting price. Your proposal confirms the details.',
  bestFor: 'Best for',
  youGet: 'What you get',
  timeline: 'Timeline',
  note: 'Prices are starting points and exclude VAT. Larger or mixed projects are quoted on scope.',
  pkgLabel: 'Package',
  compareOver: 'Compare',
  compareTitle: 'What each package includes',
  compareLine: 'The standard scope, side by side. Anything you need to add is quoted in your proposal.',
  caption: 'What each of the four packages includes',
  feature: 'Included',
  yes: 'Included',
  no: 'Not included',
  swipe: 'Swipe sideways to see all four packages',
  priceRow: 'Starting price',
  askOver: 'Not sure which one?',
  askTitle: 'Tell us what you are launching',
  askLine: 'Ask Gate can compare the packages with you. Or send a short brief, and we will recommend one in your proposal.',
  askCta: 'Help me choose',
  briefCta: 'Send my brief',
  faqOver: 'Questions',
  faqTitle: 'About the packages',
  faq: [
    { q: 'What exactly is included in each package?', a: 'The cards and the comparison above show the standard scope. Your proposal lists every deliverable before any work starts.' },
    { q: 'How do payment terms work?', a: 'Payment terms and milestones are set out in your proposal and agreed with you before work begins.' },
    { q: 'Do the prices include VAT?', a: 'No. Prices are shown excluding VAT, and the VAT that applies is shown in your proposal.' },
    { q: 'How long does each package take?', a: `Typical timelines run from ${P[3].timeline.en} for Content Production to ${P[2].timeline.en} for an online store. Your exact schedule is confirmed in your proposal.`, sample: true },
    { q: 'How many revision rounds are included?', a: `Brand Starter includes ${P[0].revisions!.en} and Brand System ${P[1].revisions!.en}. For the other packages, the number of rounds is confirmed in your proposal.`, sample: true },
    { q: 'Can I adjust a package or combine two?', a: 'Yes. Tell us what you would add or remove, and we will reflect it in the scope and price of your proposal.' },
    { q: 'Do the packages work in Arabic and English?', a: 'Yes. Every identity is designed to read well in both languages, and the online store includes Arabic and English checkout.' },
    { q: 'What happens after I choose a package?', a: 'You send a short request for that package. We reply with a clear next step and a proposal that confirms the scope, timeline and payment terms.' },
  ],
  ctaOver: 'Let’s talk',
  ctaTitle: 'Need more than a package?',
  ctaLine: 'Send a short brief or use Ask Gate. Naming, websites, campaigns and events are quoted on scope.',
  ctaBrief: 'Send my brief',
  ctaAsk: 'Ask Gate',
};

const ar: PackagesPageCopy = {
  meta: {
    title: 'الباقات: الهوية والمتاجر الإلكترونية والمحتوى | Gate33',
    description: 'أربع باقات بنطاق عمل محدّد من Gate33: انطلاقة العلامة، ونظام العلامة، وإطلاق المتجر الإلكتروني، وإنتاج المحتوى. قارن ما تتضمّنه كل باقة.',
  },
  crumb: 'الباقات',
  overline: 'الباقات',
  headline: 'باقات بنطاق محدّد وسعر يبدأ من رقم معلن.',
  intro: 'أربع باقات لأكثر نقاط الانطلاق شيوعاً: علامة جديدة، وهوية متكاملة، ومتجر إلكتروني، ومحتوى جاهز للنشر. قارن ما تتضمّنه كل باقة، ثم اطلبها في بضعة أسطر.',
  cta: 'اطلب عرض سعر',
  compareLink: 'قارن الباقات',
  cardsOver: 'الباقات',
  cardsTitle: 'اختر نقطة البداية',
  cardsLine: 'لكل باقة نطاق عمل محدّد وسعر تبدأ منه، ويؤكّد عرض السعر تفاصيلها.',
  bestFor: 'مناسبة لـ',
  youGet: 'ما تحصل عليه',
  timeline: 'المدة',
  note: 'الأسعار المعروضة أسعار بداية غير شاملة ضريبة القيمة المضافة، وتُسعَّر المشاريع الأكبر أو المركّبة حسب نطاقها.',
  pkgLabel: 'الباقة',
  compareOver: 'المقارنة',
  compareTitle: 'ما تتضمّنه كل باقة',
  compareLine: 'نطاق العمل المعتاد جنباً إلى جنب، وكل إضافة تحتاجها تُسعَّر ضمن عرض السعر.',
  caption: 'ما تتضمّنه كل باقة من الباقات الأربع',
  feature: 'المشمول',
  yes: 'مشمول',
  no: 'غير مشمول',
  swipe: 'اسحب أفقياً لعرض الباقات الأربع',
  priceRow: 'السعر يبدأ من',
  askOver: 'لست متأكداً أيّها يناسبك؟',
  askTitle: 'أخبرنا بما تستعد لإطلاقه',
  askLine: 'يمكن لـ«اسأل Gate» أن يقارن الباقات معك، أو أرسل موجز مشروعك لنقترح عليك الباقة الأنسب ضمن عرض السعر.',
  askCta: 'ساعدني في الاختيار',
  briefCta: 'أرسل موجز مشروعي',
  faqOver: 'الأسئلة الشائعة',
  faqTitle: 'عن الباقات',
  faq: [
    { q: 'ما الذي تتضمّنه كل باقة تحديداً؟', a: 'تعرض البطاقات والمقارنة أعلاه نطاق العمل المعتاد، ويحدّد عرض السعر كل المخرجات قبل بدء العمل.' },
    { q: 'كيف تُحدَّد شروط الدفع؟', a: 'تُفصَّل شروط الدفع ومراحله في عرض السعر، ونتّفق عليها معك قبل بدء العمل.' },
    { q: 'هل الأسعار شاملة ضريبة القيمة المضافة؟', a: 'لا، الأسعار المعروضة غير شاملة الضريبة، وتظهر الضريبة المستحقة في عرض السعر.' },
    { q: 'كم تستغرق كل باقة؟', a: `تتراوح المدد المعتادة بين ${P[3].timeline.ar} لباقة إنتاج المحتوى و${P[2].timeline.ar} للمتجر الإلكتروني، ويؤكّد عرض السعر جدولك الزمني بدقة.`, sample: true },
    { q: 'كم جولة تعديل تتضمّن الباقة؟', a: `في باقة انطلاقة العلامة ${P[0].revisions!.ar}، وفي باقة نظام العلامة ${P[1].revisions!.ar}. أما الباقات الأخرى فيُحدَّد عدد جولاتها في عرض السعر.`, sample: true },
    { q: 'هل يمكن تعديل الباقة أو الجمع بين باقتين؟', a: 'نعم، أخبرنا بما تودّ إضافته أو حذفه، وسنعكس ذلك في نطاق العمل وسعره ضمن عرض السعر.' },
    { q: 'هل تعمل الباقات بالعربية والإنجليزية؟', a: 'نعم، تُصمَّم كل هوية لتُقرأ بوضوح باللغتين، ويتضمّن المتجر الإلكتروني إتمام الشراء بالعربية والإنجليزية.' },
    { q: 'ماذا يحدث بعد اختيار الباقة؟', a: 'ترسل إلينا طلباً قصيراً للباقة، فنردّ عليك بخطوة تالية واضحة وعرض سعر يؤكّد نطاق العمل والمدة وشروط الدفع.' },
  ],
  ctaOver: 'لنتحدّث',
  ctaTitle: 'تحتاج إلى أكثر من باقة؟',
  ctaLine: 'أرسل موجز مشروعك أو استعن بـ«اسأل Gate». وتُسعَّر التسمية والمواقع والحملات والفعاليات حسب نطاق كل مشروع.',
  ctaBrief: 'أرسل موجز مشروعي',
  ctaAsk: 'اسأل Gate',
};

// Headings, labels and questions are bound (no short word at a line end); running body copy is left to wrap naturally.
const skip = ['meta', 'intro', 'cardsLine', 'note', 'compareLine', 'askLine', 'ctaLine', 'a'];
const bound = { en: bindAll(en, 'en', skip), ar: bindAll(ar, 'ar', skip) };
export const packagesPage = (lang: Lang): PackagesPageCopy => bound[lang];
