// Work index (/<lang>/work/) copy, EN + AR (Stage 4B-1). Projects come from work.ts, the logo archive from clients.ts.
// Arabic: formal Gulf MSA, Western digits. Short words are bound to the next word with   (qa-linebreaks).
import type { WorkType } from './work';
type Filter = { id: 'all' | WorkType; label: string };
export interface WorkPageCopy {
  meta: { title: string; description: string };
  ui: { home: string; work: string; breadcrumb: string };
  overline: string; headline: string; intro: string;
  cta: string; ctaAsk: string;
  filterLabel: string; filters: Filter[];
  count: (projects: number, logos: number) => string;
  gridLabel: string; viewCase: string; play: string;
  archiveOver: string; archiveTitle: string; archiveLine: string; archiveCase: string;
  ctaOver: string; ctaTitle: string; ctaBody: string; ctaBrief: string; ctaAskGate: string;
}

const en: WorkPageCopy = {
  meta: {
    title: 'Work: Branding, Logo Design & Film | Gate33',
    description: 'Selected brand identities, logos and films by Gate33 Agency, with the full archive of client logos.',
  },
  ui: { home: 'Home', work: 'Work', breadcrumb: 'Breadcrumb' },
  overline: 'Work',
  headline: 'Selected identities, logos and films.',
  intro: 'Six projects across branding, logo design and film, followed by the archive of every mark we have drawn. Filter by service, or open a project to see how it was made.',
  cta: 'Request a proposal', ctaAsk: 'Ask Gate about our work',
  filterLabel: 'Filter by service',
  filters: [
    { id: 'all', label: 'All' },
    { id: 'branding', label: 'Branding' },
    { id: 'logo', label: 'Logo Design' },
    { id: 'video', label: 'Video Production' },
  ],
  count: (p, l) => {
    const ps = p ? `${p} ${p === 1 ? 'project' : 'projects'}` : '';
    const ls = l ? `${l} logos` : '';
    return `Showing ${[ps, ls].filter(Boolean).join(' and ')}`;
  },
  gridLabel: 'Projects', viewCase: 'View case study', play: 'Play film',
  archiveOver: 'Logo archive',
  archiveTitle: 'Every mark we have drawn.',
  archiveLine: 'Fourteen logos for brands in hospitality, finance, food, beauty, education and more. Marks with a case study open it.',
  archiveCase: 'Case study',
  ctaOver: 'Let’s talk', ctaTitle: 'Have a project in mind?',
  ctaBody: 'Tell us what you are building. We will reply with a clear next step and a proposal shaped to your brand.',
  ctaBrief: 'Send my brief', ctaAskGate: 'Ask Gate',
};

// Arabic count: 1 = مشروع واحد · 2 = مشروعان · 3–10 = مشاريع · 11+ = مشروعاً (logos: 14 شعاراً)
const arProjects = (n: number) => (n === 1 ? 'مشروع واحد' : n === 2 ? 'مشروعان' : n <= 10 ? `${n} مشاريع` : `${n} مشروعاً`);
const arLogos = (n: number) => (n === 1 ? 'شعار واحد' : n === 2 ? 'شعاران' : n <= 10 ? `${n} شعارات` : `${n} شعاراً`);
const ar: WorkPageCopy = {
  meta: {
    title: 'أعمالنا: الهوية وتصميم الشعارات والأفلام | Gate33',
    description: 'مختارات من أعمال وكالة Gate33 في الهوية التجارية وتصميم الشعارات وإنتاج الأفلام، مع أرشيف كامل لشعارات عملائنا.',
  },
  ui: { home: 'الرئيسية', work: 'أعمالنا', breadcrumb: 'مسار التنقل' },
  overline: 'أعمالنا',
  headline: 'مختارات من الهويات والشعارات والأفلام.',
  intro: 'ستة مشاريع في الهوية التجارية وتصميم الشعارات وإنتاج الفيديو، يليها أرشيف يضمّ كل شعار صمّمناه. اختر الخدمة التي تهمّك، أو افتح أي مشروع لترى كيف صُنع.',
  cta: 'اطلب عرض سعر', ctaAsk: 'اسأل Gate عن أعمالنا',
  filterLabel: 'تصفية حسب الخدمة',
  filters: [
    { id: 'all', label: 'الكل' },
    { id: 'branding', label: 'الهوية' },
    { id: 'logo', label: 'تصميم الشعارات' },
    { id: 'video', label: 'إنتاج الفيديو' },
  ],
  count: (p, l) => `يُعرض ${[p ? arProjects(p) : '', l ? arLogos(l) : ''].filter(Boolean).join(' و')}`,
  gridLabel: 'المشاريع', viewCase: 'اطّلع على دراسة الحالة', play: 'شغّل الفيلم',
  archiveOver: 'أرشيف الشعارات',
  archiveTitle: 'كل شعار رسمناه.',
  archiveLine: 'أربعة عشر شعاراً لعلامات في الضيافة والتقنية المالية والأغذية والتجميل والتعليم وغيرها. والشعارات التي لها دراسة حالة تنقلك إليها مباشرة.',
  archiveCase: 'دراسة حالة',
  ctaOver: 'لنتحدّث', ctaTitle: 'لديك مشروع في ذهنك؟',
  ctaBody: 'أخبرنا بما تعمل عليه، وسنعود إليك بخطوة تالية واضحة وعرض مصمَّم على مقاس علامتك.',
  ctaBrief: 'أرسل موجز مشروعي', ctaAskGate: 'اسأل Gate',
};

export const workPage = (lang: 'en' | 'ar') => (lang === 'ar' ? ar : en);
