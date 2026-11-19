// /<lang>/about/ copy (Stage 5-3). Source: /home/claude/content/pages/about.md (the only copy source for this page) +
// the approved Home "How we work" steps (home.<lang>.ts, presented differently here). Section labels are short editorial
// headings only. Never invented: founding year or story, team size, founder bio or photo, awards. Those stay {{TODO}} in
// about.md and render as "To be confirmed" (facts) or a calm placeholder (founder photo). Values are PROPOSED in about.md
// ("confirm with Shifaa"), so they carry the Sample marker while SAMPLE is true.
import type { Lang } from './types';
import { bindAll } from './text';

export interface AboutCopy {
  meta: { title: string; description: string };
  crumb: string; overline: string; headline: string; intro: string; cta: string; workLink: string;
  povOver: string; povTitle: string; pov: string; roles: string[]; merged: string; rolesLabel: string;
  facts: { label: string; value: string; tbc?: boolean }[];
  approachOver: string; approachTitle: string; approach: { title: string; line: string }[];
  howOver: string; howTitle: string; howLine: string; howCta: string;
  servicesOver: string; servicesTitle: string; servicesLine: string; servicesAll: string;
  clientsOver: string; clientsTitle: string; viewCase: string;
  founderOver: string; founderName: string; founderRole: string; founderBio: string; photo: string;
  valuesOver: string; valuesTitle: string; values: { title: string; line: string }[]; valuesNote: string;
  ctaOver: string; ctaTitle: string; ctaLine: string; ctaBrief: string; ctaWork: string;
}

const en: AboutCopy = {
  meta: {
    title: 'About Gate33 | Creative & Marketing Agency',
    description: 'Gate33 is a multidisciplinary creative agency, founded in 2016, helping businesses in Israel, the UAE and the GCC build their identity, produce meaningful content and grow.',
  },
  crumb: 'About',
  overline: 'About Gate33',
  headline: 'One team for your identity, films, website and marketing.',
  intro: 'Gate33 was established in 2016, building on professional experience in the field since 2014. It has grown into a multidisciplinary creative agency that helps businesses in Israel, the UAE and the GCC shape their identity, produce meaningful content and grow across digital channels.',
  cta: 'Request a proposal',
  workLink: 'See our work',
  povOver: 'Our point of view',
  povTitle: 'Planned together, built as one brand',
  pov: 'Most brands work with a designer, a production house, a web developer and a marketing agency, then spend their time keeping them aligned. Gate33 puts these under one creative direction, so the identity, the content, the website and the campaigns are planned together and look like they belong to the same brand.',
  rolesLabel: 'Four roles brought together under one creative direction',
  roles: ['Designer', 'Production house', 'Web developer', 'Marketing agency'],
  merged: 'One creative direction',
  facts: [
    { label: 'Experience', value: 'Since 2014' },
    { label: 'Founded', value: '2016' },
    { label: 'Serving', value: 'Israel, the UAE and the GCC' },
    { label: 'Team', value: 'Six disciplines' },
  ],
  approachOver: 'Our approach',
  approachTitle: 'What shapes every project',
  approach: [
    { title: 'Strategy first', line: 'We start with who you serve and what you need to achieve, then design.' },
    { title: 'Built as systems', line: 'Every identity is built as a system of logo, colour, type and pattern, so it scales across every touchpoint.' },
    { title: 'Arabic and English, together', line: 'Both languages are designed and written from the start; neither is a translation of the other.' },
    { title: 'One team, start to launch', line: 'The people who design your brand also produce, build and market it.' },
  ],
  howOver: 'How we work',
  howTitle: 'Four steps from brief to launch',
  howLine: 'The same four steps for a logo or a full launch.',
  howCta: 'Request a proposal',
  servicesOver: 'What we do',
  servicesTitle: 'Seven services, one team',
  servicesLine: 'Start with one, or bring us the whole launch.',
  servicesAll: 'All services',
  clientsOver: 'Clients',
  clientsTitle: 'Brands we have helped build',
  viewCase: 'View case study',
  founderOver: 'Founder',
  founderName: 'Shifaa Mokari',
  founderRole: 'Founder & Creative Director',
  founderBio: 'Shifaa founded Gate33 in 2016 and leads its creative direction.',
  photo: 'Photo to come',
  valuesOver: 'Values',
  valuesTitle: 'What we hold ourselves to',
  values: [
    { title: 'Clarity', line: 'We say what is included and what it costs before we start.' },
    { title: 'Craft', line: 'We check the small things: spacing, Arabic letterforms, print files.' },
    { title: 'Honesty', line: 'We promise what we can deliver and report what really happened.' },
    { title: 'Local understanding', line: 'We build for how people in each market we serve actually buy, speak and celebrate.' },
  ],
  valuesNote: '',
  ctaOver: 'Let’s talk',
  ctaTitle: 'Have a project in mind?',
  ctaLine: 'Send a short brief or use Ask Gate. We will reply with a clear next step.',
  ctaBrief: 'Request a proposal',
  ctaWork: 'See our work',
};

const ar: AboutCopy = {
  meta: {
    title: 'من نحن | Gate33 وكالة إبداعية وتسويقية',
    description: 'Gate33 وكالة إبداعية متعددة التخصصات تأسست عام 2016، تساعد الشركات في إسرائيل والإمارات ودول الخليج على بناء هويتها وإنتاج محتوى مؤثر والنمو.',
  },
  crumb: 'من نحن',
  overline: 'من نحن',
  headline: 'فريق واحد لهويتك وأفلامك وموقعك وتسويقك.',
  intro: 'تأسست Gate33 عام 2016، مستندةً إلى خبرة مهنية في المجال منذ 2014، وتطورت لتصبح وكالة إبداعية متعددة التخصصات تساعد الشركات في إسرائيل والإمارات ودول مجلس التعاون الخليجي على بناء هويتها، وإنتاج محتوى مؤثر، والنمو عبر القنوات الرقمية.',
  cta: 'اطلب عرض سعر',
  workLink: 'شاهد أعمالنا',
  povOver: 'رؤيتنا',
  povTitle: 'تخطيط مشترك، وعلامة واحدة',
  pov: 'تتعامل معظم العلامات مع مصمم، وشركة إنتاج، ومطوّر مواقع، ووكالة تسويق، ثم تقضي وقتها في التنسيق بينهم. أمّا Gate33 فتجمع هذه الأدوار تحت إدارة إبداعية واحدة، لتُخطَّط الهوية والمحتوى والموقع والحملات معاً، وتبدو جميعها منتمية إلى العلامة نفسها.',
  rolesLabel: 'أربعة أدوار تجتمع تحت إدارة إبداعية واحدة',
  roles: ['مصمم', 'شركة إنتاج', 'مطوّر مواقع', 'وكالة تسويق'],
  merged: 'إدارة إبداعية واحدة',
  facts: [
    { label: 'الخبرة', value: 'منذ 2014' },
    { label: 'سنة التأسيس', value: '2016' },
    { label: 'نخدم', value: 'إسرائيل والإمارات ودول الخليج' },
    { label: 'الفريق', value: 'ستة تخصصات' },
  ],
  approachOver: 'نهجنا',
  approachTitle: 'ما يوجّه كل مشروع',
  approach: [
    { title: 'الاستراتيجية أولاً', line: 'نبدأ بفهم جمهورك وما تريد تحقيقه، ثم نصمّم.' },
    { title: 'هويات تُبنى كأنظمة', line: 'نبني كل هوية كنظام متكامل من الشعار والألوان والخطوط والأنماط، ليتّسع لكل نقطة تواصل.' },
    { title: 'العربية والإنجليزية معاً', line: 'نصمّم ونكتب باللغتين منذ البداية، فلا تكون إحداهما ترجمة للأخرى.' },
    { title: 'فريق واحد من البداية حتى الإطلاق', line: 'الفريق الذي يصمّم علامتك هو نفسه الذي ينتجها ويطوّرها ويسوّقها.' },
  ],
  howOver: 'طريقة عملنا',
  howTitle: 'أربع خطوات من الموجز حتى الإطلاق',
  howLine: 'الخطوات الأربع نفسها، لشعار واحد أو لإطلاق متكامل.',
  howCta: 'اطلب عرض سعر',
  servicesOver: 'ما نقدّمه',
  servicesTitle: 'سبع خدمات، وفريق واحد',
  servicesLine: 'ابدأ بخدمة واحدة، أو أوكل إلينا الإطلاق كاملاً.',
  servicesAll: 'جميع الخدمات',
  clientsOver: 'عملاؤنا',
  clientsTitle: 'علامات أسهمنا في بنائها',
  viewCase: 'اطّلع على دراسة الحالة',
  founderOver: 'المؤسِّسة',
  founderName: 'شفاء موكاري',
  founderRole: 'المؤسِّسة والمديرة الإبداعية',
  founderBio: 'أسّست شفاء Gate33 عام 2016، وتقود إدارتها الإبداعية.',
  photo: 'الصورة لاحقاً',
  valuesOver: 'قيمنا',
  valuesTitle: 'ما نلتزم به',
  values: [
    { title: 'الوضوح', line: 'نوضّح ما يشمله العمل وكم يكلّف قبل أن نبدأ.' },
    { title: 'الإتقان', line: 'نراجع التفاصيل الصغيرة: المسافات، وتشكيل الحروف العربية، وملفات الطباعة.' },
    { title: 'الصدق', line: 'نَعِد بما نستطيع تحقيقه، ونرفع تقارير بما حدث فعلاً.' },
    { title: 'فهم السوق المحلية', line: 'نبني وفق الطريقة التي يشتري بها الناس ويتحدّثون ويحتفلون في كل سوق نخدمها.' },
  ],
  valuesNote: '',
  ctaOver: 'لنتحدّث',
  ctaTitle: 'لديك مشروع؟',
  ctaLine: 'أرسل موجز مشروعك أو استعن بـ«اسأل Gate»، وسنعود إليك بخطوة تالية واضحة.',
  ctaBrief: 'اطلب عرض سعر',
  ctaWork: 'شاهد أعمالنا',
};

// Headings, labels and titles are bound (no short word at a line end); running body copy wraps naturally.
const skip = ['meta', 'intro', 'pov', 'line', 'howLine', 'servicesLine', 'valuesNote', 'ctaLine', 'rolesLabel', 'roles', 'value'];
const bound = { en: bindAll(en, 'en', skip), ar: bindAll(ar, 'ar', skip) };
export const aboutPage = (lang: Lang): AboutCopy => bound[lang];
