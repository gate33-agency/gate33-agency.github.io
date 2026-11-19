// Gate33 clients (owner decision, 8 Nov 2026) — copy from content/work/clients.md. Logos: scripts/build-client-logos.mjs.
// Values starting with "{{TODO" are open items: they stay in the data and are never rendered as text.
export interface Client {
  slug: string; logo: string; w: number; h: number;
  name: { en: string; ar: string }; sector: { en: string; ar: string };
  logoAr?: string; wAr?: number; hAr?: number; // language-specific lock-up
  caseSlug?: string; // has a case study (Stage 4 pages, URL kept stable)
  todo?: string;
}
export const clients: Client[] = [
  { slug: 'cyrin', logo: 'cyrin', w: 640, h: 179, name: { en: 'Cyrin · The\u00A0Blue House', ar: 'سيرين · ذا بلو هاوس' }, sector: { en: 'Hospitality &\u00A0lifestyle', ar: 'الضيافة وأسلوب الحياة' }, caseSlug: 'cyrin', todo: '{{TODO: confirm sector}}' },
  { slug: 'plutrex', logo: 'plutrex', w: 640, h: 142, name: { en: 'Plutrex', ar: 'بلوتركس' }, sector: { en: 'Fintech · Financial analytics', ar: 'التقنية المالية · التحليلات المالية' }, caseSlug: 'plutrex' },
  { slug: 'zakharef', logo: 'zakharef', w: 640, h: 232, name: { en: 'Zakharef', ar: 'زخارف للفنون' }, sector: { en: 'Party &\u00A0occasion décor', ar: 'منتجات زخرفية للحفلات والمناسبات' }, caseSlug: 'zakharef' },
  { slug: 'the-point', logo: 'the-point-en', w: 640, h: 149, logoAr: 'the-point-ar', wAr: 627, hAr: 280, name: { en: 'The\u00A0Point', ar: 'نقطة' }, sector: { en: 'Travel &\u00A0tourism', ar: 'السياحة والسفر' }, caseSlug: 'the-point' },
  { slug: 'abdo', logo: 'abdo', w: 428, h: 280, name: { en: 'Abdo Butchery', ar: 'ملحمة عبدو' }, sector: { en: 'Butchery &\u00A0supermarket', ar: 'ملحمة وسوبر ماركت' }, caseSlug: 'abdo' },
  { slug: 'nilam', logo: 'nilam', w: 123, h: 280, name: { en: 'Nilam Events Hall', ar: 'قاعة نيلم للمناسبات' }, sector: { en: 'Events venue', ar: 'قاعة مناسبات' }, todo: '{{TODO: confirm AR wording}}' },
  { slug: 'eureka', logo: 'eureka', w: 432, h: 280, name: { en: 'Eureka', ar: 'يوريكا' }, sector: { en: 'Enrichment, therapy &\u00A0guidance', ar: 'إثراء وعلاج وإرشاد' }, todo: '{{TODO: confirm sector}}' },
  { slug: 'shehade', logo: 'shehade', w: 258, h: 280, name: { en: 'Shehade Sandwich', ar: 'شحادة' }, sector: { en: 'Sandwich &\u00A0bakery', ar: 'سندويشات ومخبوزات' } },
  { slug: 'marah-saadi', logo: 'marah-saadi', w: 338, h: 280, name: { en: 'Marah Saadi Photography', ar: 'مرح سعدي للتصوير' }, sector: { en: 'Photography', ar: 'التصوير الفوتوغرافي' } },
  { slug: 'fairuz', logo: 'fairuz', w: 245, h: 280, name: { en: 'Fairuz Biatra Glam Beauty', ar: 'فيروز بياترا للتجميل' }, sector: { en: 'Beauty', ar: 'التجميل' }, todo: '{{TODO: confirm AR spelling}}' },
  { slug: 'lina-board', logo: 'lina-board', w: 235, h: 280, name: { en: 'Lina Board Chess School', ar: 'مدرسة لينا بورد للشطرنج' }, sector: { en: 'Education · Chess', ar: 'التعليم · الشطرنج' } },
  { slug: 'yara-amara', logo: 'yara-amara', w: 489, h: 280, name: { en: 'Yara Amara', ar: 'يارا عمارة' }, sector: { en: 'Make-up artist', ar: 'خبيرة مكياج' } },
  { slug: 'olla', logo: 'olla', w: 640, h: 106, name: { en: 'Olla Esmeir, Accountant', ar: 'علا اسمير، محاسبة' }, sector: { en: 'Accounting', ar: 'المحاسبة' }, todo: '{{TODO: confirm AR spelling}}' },
  { slug: 'coordinate', logo: 'coordinate', w: 512, h: 280, name: { en: 'Coordinate Engineering', ar: 'كوردينيت للهندسة' }, sector: { en: 'Engineering &\u00A0surveying', ar: 'الهندسة والمساحة' }, todo: '{{TODO: confirm AR name}}' },
];
export const isTodo = (s?: string) => !s || s.startsWith('{{TODO');
