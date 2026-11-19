// Selected work on Home — copy from content/pages/home.md (card line) + content/work/<slug>.md (outcome line).
// Links: /<lang>/work/<slug>/ (case pages arrive in Stage 4; keep these URLs stable).
import { images, videos } from './media';
import type { Img } from './media';
type T = { en: string; ar: string };
export type WorkType = 'branding' | 'logo' | 'video';
export interface Case {
  slug: string; layout: 'feature' | 'tall' | 'cinema' | 'wide' | 'half';
  client: T; sector: T; tag: T; line: T; outcome: T;
  img: Img; video?: { en: string; ar: string }; posterAr?: Img; contain?: boolean;
  // market: where the work runs (e.g. 'UAE', 'GCC'). Unknown = {{TODO}} (never rendered, never invented).
  market: T;
  // cycle: extra images of the same project (public/images/<base>-1200.webp), shown in turn on desktop hover
  cycle?: string[];
  todo?: string;
  // types: services shown on this project, used by the /work/ filters (Stage 4B-1). From content/work/<slug>.md "Services" rows.
  types: WorkType[];
}
const t = (en: string, ar: string): T => ({ en, ar });
export const cases: Case[] = [
  { slug: 'cyrin', types: ['branding', 'logo'], market: t('{{TODO: market}}', '{{TODO: market}}'), cycle: ['cyrin/p01', 'cyrin/p13', 'cyrin/p12'], layout: 'feature', img: images.cyrinPlate,
    client: t('Cyrin · The\u00A0Blue House', 'سيرين · ذا بلو هاوس'), sector: t('Hospitality &\u00A0lifestyle', 'الضيافة وأسلوب الحياة'), tag: t('Branding', 'الهوية'),
    line: t('One\u00A0C, carried from\u00A0the\u00A0plate to\u00A0the\u00A0storefront.', 'حرف C واحد، من\u00A0طبق التقديم حتى\u00A0واجهة المتجر.'),
    outcome: t('A\u00A0horseshoe-shaped C on\u00A0the\u00A0menu, the\u00A0shopping bag, the\u00A0hang tag and\u00A0the\u00A0shopfront arch.', 'حرف C على\u00A0هيئة حدوة حصان، يظهر على\u00A0قائمة الطعام وحقيبة التسوّق وبطاقة الملابس وقوس الواجهة.'),
    todo: '{{TODO: confirm sector; mockups = identity applications}}' },
  { slug: 'plutrex', types: ['branding', 'logo'], market: t('{{TODO: market}}', '{{TODO: market}}'), cycle: ['plutrex/p53', 'plutrex/p27'], layout: 'tall', img: images.plutrexTote,
    client: t('Plutrex', 'بلوتركس'), sector: t('Fintech', 'التقنية المالية'), tag: t('Branding', 'الهوية'),
    line: t('A\u00A0calm, confident identity for\u00A0a\u00A0fintech platform.', 'هوية هادئة وواثقة لمنصة تقنية مالية.'),
    // "young" fintech confirmed by Shifaa (19 Nov, Q33)
    outcome: t('A\u00A055-page brand guide for\u00A0a\u00A0young fintech platform: logo, colour, type, icons, pattern and\u00A0applications.', 'دليل هوية من\u00A055 صفحة لمنصة تقنية مالية ناشئة: الشعار والألوان والخط والأيقونات والنمط والتطبيقات.') },
  { slug: 'coffee-film', types: ['video'], market: t('{{TODO: market}}', '{{TODO: market}}'), layout: 'cinema', img: images.coffee, video: { en: videos.coffee.src, ar: videos.coffee.src },
    client: t('Specialty coffee roaster', 'محمصة قهوة مختصة'), sector: t('Food &\u00A0beverage', 'الأغذية والمشروبات'), tag: t('Video Production', 'إنتاج الفيديو'),
    line: t('One\u00A0minute with\u00A0a\u00A0coffee roaster and\u00A0his craft.', 'دقيقة واحدة مع\u00A0صانع قهوة وحرفته.'),
    outcome: t('A\u00A0one-minute film that introduces customers to\u00A0the\u00A0founder, the\u00A0beans and\u00A0the\u00A0roasting.', 'فيلم من\u00A0دقيقة واحدة يعرّف العملاء بالمؤسس والحبوب وحرفة التحميص.'),
    todo: '{{TODO: client name}}' },
  { slug: 'zakharef', types: ['branding', 'logo'], market: t('{{TODO: market}}', '{{TODO: market}}'), cycle: ['zakharef/p14', 'zakharef/p01'], layout: 'tall', img: images.zakharefFlagBlue,
    client: t('Zakharef', 'زخارف للفنون'), sector: t('Party &\u00A0occasion décor', 'منتجات زخرفية للحفلات والمناسبات'), tag: t('Branding', 'الهوية'),
    line: t('An\u00A0Arabic letter that became an\u00A0ornament.', 'حرف عربي صار زخرفة.'),
    outcome: t('An\u00A0Arabic identity with\u00A0its\u00A0own ornament, applied to\u00A0bags, screens, a\u00A0flag and\u00A0a\u00A0wall mural.', 'هوية عربية تملك زخرفتها الخاصة، وتظهر على\u00A0الحقائب والشاشات والعَلَم والجدارية.') },
  { slug: 'the-point', types: ['branding', 'logo'], market: t('{{TODO: market}}', '{{TODO: market}}'), layout: 'feature', img: images.pointEn, posterAr: images.pointAr, contain: true, video: { en: videos.pointEn.src, ar: videos.pointAr.src },
    client: t('The\u00A0Point', 'نقطة'), sector: t('Travel &\u00A0tourism', 'السياحة والسفر'), tag: t('Branding · Motion', 'الهوية · الحركة'),
    line: t('One\u00A0P, two languages, in\u00A0motion.', 'حرف P واحد، بلغتين، في\u00A0حركة.'),
    outcome: t('One\u00A0bold P with\u00A0Arabic and\u00A0English lock-ups, and\u00A0a\u00A0logo animation in\u00A0each language.', 'حرف P جريء بصيغتين عربية وإنجليزية، وتحريك للشعار بكل\u00A0لغة.') },
  { slug: 'abdo', types: ['branding', 'logo'], market: t('{{TODO: market}}', '{{TODO: market}}'), cycle: ['abdo/p02', 'abdo/p08'], layout: 'feature', img: images.abdoSteak,
    client: t('Abdo Butchery', 'ملحمة عبدو'), sector: t('Butchery &\u00A0supermarket', 'ملحمة وسوبر ماركت'), tag: t('Branding', 'الهوية'),
    line: t('A\u00A0family name, written by\u00A0hand.', 'اسم عائلي بخط يدوي.'),
    outcome: t('A\u00A0hand-drawn Arabic wordmark, used on\u00A0the\u00A0shop sign, stickers and\u00A0wrapping paper.', 'شعار عربي بخط يدوي، على\u00A0لافتة المتجر والملصقات وورق التغليف.') },
];
