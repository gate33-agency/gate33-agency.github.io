// Abdo Butchery · ملحمة عبدو — short case (Stage 4B-3). Copy source: /home/claude/content/work/abdo.md only.
// Images: deck pages already rendered by scripts/build-assets.mjs (public/images/abdo/pNN-*.webp, 1280x1024 = 5:4 frames).
// Safe pages only: 1, 2, 3, 8, 9, 10, 11. Never used: 4-7 (second-language line and/or phone numbers).
// "Since 1978" is the client's own line inside the artwork: it is NOT stated in our copy or alt text until confirmed.
// Palette names are read from the visuals (no spec page): no hex values, no swatches.
import type { CaseStudy, T } from '../case-studies';
import type { Img } from '../media';

const t = (en: string, ar: string): T => ({ en, ar });
const W = [480, 800, 1200, 1600];
const p = (n: string, en: string, ar: string): Img => ({ base: `abdo/p${n}`, widths: W, w: 1280, h: 1024, alt: { en, ar } });

const img = {
  steak: p('03', 'The hand-drawn Arabic wordmark عبدو in white over a cut of steak', 'الشعار المكتوب "عبدو" بخط يدوي أبيض فوق قطعة لحم'),
  logo: p('01', 'The Abdo Butchery logo: the Arabic wordmark with BUTCHERY beneath, in black on off-white', 'شعار ملحمة عبدو: الكلمة العربية المكتوبة وتحتها BUTCHERY، بالأسود على خلفية فاتحة'),
  sign: p('02', 'Abdo Butchery sign on a wall', 'لافتة ملحمة عبدو على جدار'),
  stickers: p('08', 'Two round stickers, black and deep red, with the Abdo logo', 'ملصقان دائريان بالأسود والأحمر القاني بشعار عبدو'),
  paper: p('09', 'Kraft wrapping paper printed with the Abdo logo, half rolled', 'ورق تغليف بني مطبوع بشعار عبدو، نصفه ملفوف'),
  apron: p('10', 'Black apron with the Abdo logo on the pocket', 'مريلة عمل سوداء بشعار عبدو على الجيب'),
  card: p('11', 'Thank-you card: the wordmark on a cut of beef against pale pink', 'بطاقة شكر: الشعار المكتوب على قطعة لحم فوق خلفية وردية فاتحة'),
};

export const abdo: CaseStudy = {
  slug: 'abdo',
  kind: 'case',
  meta: {
    title: t('Abdo Butchery: Hand-Lettered Logo Case Study | Gate33', 'ملحمة عبدو: دراسة حالة في شعار بخط يدوي | Gate33'),
    description: t(
      'How Gate33 built the Abdo Butchery identity on a hand-drawn Arabic wordmark, a restrained palette and applications from the shop sign to the wrapping paper.',
      'كيف بنت Gate33 هوية ملحمة عبدو على شعار مكتوب بخط عربي يدوي وألوان مقتصدة، وتطبيقات من لافتة المتجر حتى ورق التغليف.',
    ),
  },
  overline: t('Case study · Branding', 'دراسة حالة · الهوية'),
  headline: t('A family name, written by hand.', 'اسم عائلي بخط يدوي.'),
  intro: t(
    'A logo and its applications for Abdo, a butchery and supermarket: a hand-drawn Arabic wordmark that feels rooted and personal.',
    'شعار وتطبيقاته لعبدو، الملحمة والسوبر ماركت: كلمة عربية مكتوبة بخط يدوي تمنح العلامة أصالة وقرباً.',
  ),
  facts: {
    client: t('Abdo Butchery', 'ملحمة عبدو'),
    sector: t('Butchery & supermarket', 'ملحمة وسوبر ماركت'),
    services: t('Logo design · Brand applications', 'تصميم الشعار · تطبيقات الهوية'),
    market: t('{{TODO: market}}', '{{TODO: market}}'),
    year: t('{{TODO: year}}', '{{TODO: year}}'),
  },
  cover: img.stickers, // 5:4 artwork in a 16:9 cover: the stickers sit in the middle, so nothing is cut (the steak page would lose its lettering)
  coverTone: 'dark',
  blocks: [
    { type: 'text', key: 'idea', over: t('The idea', 'الفكرة'), title: t('Rooted and personal at the same time.', 'أصالة وقرب في آن واحد.'),
      body: [
        t('The identity is built on a hand-drawn Arabic calligraphic wordmark of the name عبدو, paired with a clean “BUTCHERY” in English, so the brand feels rooted and personal at the same time.',
          'بُنيت الهوية على شعار مكتوب بخط عربي يدوي لاسم "عبدو"، ترافقه كلمة "BUTCHERY" بخط إنجليزي واضح، فتبدو العلامة أصيلة وقريبة في آن واحد.'),
        t('The palette stays restrained, black, white and a deep meat red, letting the calligraphy lead.',
          'وتبقى الألوان مقتصدة، الأسود والأبيض والأحمر القاني، لتتصدّر الكتابة اليدوية المشهد.'),
      ] },
    { type: 'full', img: img.steak, tone: 'dark', ratio: '5/4',
      caption: t('The wordmark, drawn by hand, set over the product itself.', 'الشعار المكتوب باليد فوق المنتج نفسه.') },
    { type: 'pair', imgs: [img.logo, img.sign], ratio: '5/4',
      caption: t('The wordmark with BUTCHERY set beneath · identity application: the shop sign.', 'الشعار وتحته كلمة BUTCHERY · من تطبيقات الهوية: لافتة المتجر.') },
    { type: 'system', over: t('The system', 'النظام'), title: t('One wordmark, three colours.', 'شعار واحد، وثلاثة ألوان.'),
      rows: [
        { label: t('Logo', 'الشعار'), value: t('A hand-drawn Arabic calligraphic wordmark of the name, with “BUTCHERY” in clean English capitals.', 'شعار مكتوب بخط عربي يدوي للاسم، ترافقه كلمة "BUTCHERY" بحروف إنجليزية واضحة.') },
        { label: t('Colour', 'الألوان'), value: t('Black, white and a deep meat red.', 'الأسود والأبيض والأحمر القاني.') },
        { label: t('Applications', 'التطبيقات'), value: t('Shop sign, round stickers, butcher’s wrapping paper, aprons and thank-you cards.', 'لافتة المتجر، والملصقات الدائرية، وورق تغليف اللحوم، ومرايل العمل، وبطاقات الشكر.') },
      ] },
    { type: 'pair', imgs: [img.paper, img.apron], ratio: '5/4',
      caption: t('Identity applications: wrapping paper and apron.', 'من تطبيقات الهوية: ورق التغليف ومريلة العمل.') },
    { type: 'full', img: img.card, tone: 'light', ratio: '5/4',
      caption: t('Identity application: a thank-you card.', 'من تطبيقات الهوية: بطاقة شكر.') },
  ],
  outcome: {
    over: t('The outcome', 'النتيجة'),
    line: t('A family name, written by hand, now signs every sign, sticker and wrap.', 'اسم عائلي بخط يدوي يوقّع اليوم كل لافتة وملصق وورق تغليف.'),
    // Counts taken from the deck (not measured results).
    facts: [
      { value: '1', label: t('hand-drawn wordmark', 'شعار مكتوب بخط يدوي') },
      { value: '2', label: t('scripts, Arabic and English', 'خطّان، عربي وإنجليزي') },
      { value: '3', label: t('colours', 'ألوان') },
      { value: '5', label: t('identity applications', 'تطبيقات للهوية') },
    ],
  },
  todo: [
    '"Since 1978": appears in the client artwork only; confirm with Shifaa before it is ever stated in copy',
    'Palette: confirm (names read from the visuals; no hex values on the page)',
    'Market and year',
    'Verified results (no Results block on the page)',
    'Client testimonial with name/title and written consent (no quote on the page)',
  ],
};
