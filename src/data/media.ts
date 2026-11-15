// Real portfolio media (see scripts/build-assets.mjs). Paths are relative to /images/.
// Rule: no Hebrew text, no +972 numbers. Abdo slides 5-7, Plutrex pp. 1/31-33/38/55 and The Point "Cover Facebook.jpg" are deliberately NOT used.
export interface Img { base: string; widths: number[]; w: number; h: number; alt: { en: string; ar: string } }
const W = [480, 800, 1200, 1600];
const img = (base: string, en: string, ar: string, w = 1700, h = 956, widths = W): Img => ({ base, widths, w, h, alt: { en, ar } });

export const images = {
  cyrinPlate: img('cyrin/p07', 'Sushi plated in the shape of the Cyrin C', 'طبق سوشي مقدّم على هيئة حرف C من هوية سيرين'),
  zakharefFlagBlue: img('zakharef/p15', 'Zakharef pattern flag on the brand blue', 'علم بنمط زخارف على الأزرق الخاص بالهوية', 1700, 1214),
  pointAr: img('video/the-point-ar-poster', 'The Point Arabic logo animation, final frame', 'الإطار الأخير من حركة شعار نقطة بالعربية', 1280, 720, [800, 1280]),
  hero: img('video/hero-poster', 'Production reel: coffee roasting, olives and pastry', 'مقتطفات إنتاج: تحميص القهوة والزيتون والحلويات', 1280, 720, [800, 1280]),
  cyrinInterior: img('cyrin/p01', 'Cyrin restaurant interior with the navy brand palette', 'المساحة الداخلية لمطعم سيرين بألوان الهوية الكحلية'),
  cyrinBag: img('cyrin/p12', 'Cyrin shopping bag mockup', 'تصميم حقيبة تسوق لعلامة سيرين'),
  cyrinBook: img('cyrin/p13', 'Cyrin embossed menu book on a stone table', 'قائمة طعام سيرين بطباعة بارزة'),
  plutrexTote: img('plutrex/p43', 'Plutrex purple tote bag with the brand mark', 'حقيبة قماشية بنفسجية بشعار بلوتريكس'),
  plutrexPattern: img('plutrex/p27', 'Plutrex pattern system in purple and teal', 'نظام الأنماط في هوية بلوتريكس'),
  zakharefMural: img('zakharef/p14', 'Zakharef brand mural with Arabic calligraphy', 'جدارية هوية زخارف بالخط العربي', 1700, 1214),
  zakharefFlag: img('zakharef/flag', 'Zakharef pattern printed on a street flag', 'نمط زخارف مطبوعاً على علم في الشارع', 2000, 1333),
  zakharefCover: img('zakharef/p01', 'Zakharef wordmark on navy', 'شعار زخارف على خلفية كحلية', 1700, 1214),
  abdoSteak: img('abdo/p03', 'Abdo Butchery Arabic wordmark over a steak', 'شعار عبدو بالخط العربي فوق قطعة لحم', 1280, 1024),
  abdoSign: img('abdo/p02', 'Abdo Butchery storefront sign', 'لافتة واجهة ملحمة عبدو', 1280, 1024),
  pointEn: img('video/the-point-en-poster', 'The Point logo animation, final frame', 'الإطار الأخير من حركة شعار ذا بوينت', 1280, 720, [800, 1280]),
  coffee: img('video/coffee-poster', 'Coffee roaster brand film, roasting beans', 'فيلم تعريفي لمحمصة قهوة: حبوب البن أثناء التحميص', 1280, 544, [800, 1280]),
};

export const videos = {
  coffee: { src: '/video/coffee-film.mp4', loop: '/video/coffee-loop.mp4' },
  pointEn: { src: '/video/the-point-en.mp4' },
  pointAr: { src: '/video/the-point-ar.mp4' },
  hero: { desktop: '/video/hero/hero-reel-1280.mp4', mobile: '/video/hero/hero-reel-mobile.mp4', poster: '/video/hero/hero-reel-poster.jpg' },
};

export const logoArchive: { slug: string; name: { en: string; ar: string }; w: number }[] = [
  { slug: 'nilam', name: { en: 'Nilam Events Hall', ar: 'قاعة نيلام' }, w: 320 },
  { slug: 'eureka', name: { en: 'Eureka', ar: 'يوريكا' }, w: 320 },
  { slug: 'shehade', name: { en: 'Shehade Sandwich and Bakery', ar: 'شحادة للساندويش والمخبوزات' }, w: 320 },
  { slug: 'marah-saadi', name: { en: 'Marah Saadi Photography', ar: 'مرح سعدي للتصوير' }, w: 320 },
  { slug: 'fairuz', name: { en: 'Fairuz Biatra Glam Beauty', ar: 'فيروز بياترا للجمال' }, w: 320 },
  { slug: 'lina-board', name: { en: 'Lina Board Chess School', ar: 'مدرسة لينا بورد للشطرنج' }, w: 320 },
];
