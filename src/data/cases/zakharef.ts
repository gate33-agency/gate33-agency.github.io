// Zakharef · زخارف للفنون — case study (Stage 4B-3). Copy source: /home/claude/content/work/zakharef.md only (from the deck).
// Images: deck pages (1400x1000, rendered 1700x1214) by scripts/build-assets.mjs into public/images/zakharef/pNN-*.webp.
// Frames use ratio '7/5' so slides with text are never cropped. Not used: p.2 (brief text), pp. 11-12 (web address and
// social handle shown as design). Applications are deck mockups: labelled as identity applications.
import type { CaseStudy, T } from '../case-studies';
import type { Img } from '../media';

const t = (en: string, ar: string): T => ({ en, ar });
const W = [480, 800, 1200, 1600];
const p = (n: string, en: string, ar: string): Img => ({ base: `zakharef/p${n}`, widths: W, w: 1700, h: 1214, alt: { en, ar } });

const img = {
  cover: p('01', 'The Zakharef calligraphic wordmark in white and gold over fine blue lines of the symbol, on navy', 'الشعار المكتوب لزخارف للفنون بالأبيض والذهبي فوق خطوط زرقاء دقيقة للرمز على خلفية كحلية'),
  concept: p('03', 'Concept page: mandala in wedding décor, mandala art, a flower and the first Arabic letter of the name, drawn as the symbol', 'صفحة الفكرة: الماندالا في زينة الأعراس، وفن الماندالا، والزهرة، والحرف العربي الأول من الاسم مرسوماً رمزاً'),
  build: p('04', 'Construction of the star-flower symbol, its points and curves marked on navy', 'بناء رمز الزهرة النجمية بنقاطه ومنحنياته على خلفية كحلية'),
  lockups: p('05', 'Logo lock-ups on gold, blue and navy, with an Arabic line in the brand typeface', 'صيغ الشعار على الذهبي والأزرق والكحلي، مع سطر عربي بخط الهوية'),
  pattern: p('07', 'The repeating pattern built from the symbol, in blue on navy', 'النمط المتكرر المبني من الرمز، بالأزرق على الكحلي'),
  colour: p('06', 'Colour page: Space Cadet navy, Picton Blue, Aztec Gold, black and white', 'صفحة الألوان: الكحلي والأزرق السماوي والذهبي والأسود والأبيض'),
  type: p('08', 'Typography page: Reem Kufi in four weights, with Latin and Arabic samples', 'صفحة الخط: ريم كوفي بأوزانه الأربعة، مع نماذج لاتينية وعربية'),
  mural: p('14', 'A large wall mural with the symbol, the logo and an Arabic line, on a street corner', 'جدارية كبيرة بالرمز والشعار وسطر عربي على ناصية شارع'),
  bag: p('13', 'Navy shopping bag with the Zakharef logo, on blue', 'حقيبة تسوّق كحلية بشعار زخارف على خلفية زرقاء'),
  flag: p('15', 'A flag printed with the Zakharef pattern and logo', 'علم مطبوع بنمط زخارف وشعارها'),
};

export const zakharef: CaseStudy = {
  slug: 'zakharef',
  kind: 'case',
  meta: {
    title: t('Zakharef: Arabic Brand Identity Case Study | Gate33', 'زخارف للفنون: دراسة حالة في هوية عربية | Gate33'),
    description: t(
      'How Gate33 turned the Arabic letter ز into a star-flower symbol and a pattern for Zakharef, with a calligraphic wordmark, colours and applications.',
      'كيف حوّلت Gate33 حرف الزاي إلى رمز على هيئة زهرة نجمية ونمط زخرفي لزخارف للفنون، مع شعار مكتوب بخط عربي وألوان وتطبيقات.',
    ),
  },
  overline: t('Case study · Branding', 'دراسة حالة · الهوية'),
  headline: t('An Arabic letter that became an ornament.', 'حرف عربي صار زخرفة.'),
  intro: t(
    'An identity for Zakharef, a company that makes ornament available to everyone: decorative products and art tools for parties and occasions.',
    'هوية لزخارف للفنون، الشركة التي تجعل الزخرفة متاحة للجميع: منتجات وأدوات فنية وزخرفية للحفلات والمناسبات.',
  ),
  facts: {
    client: t('Zakharef', 'زخارف للفنون'),
    sector: t('Decorative art products for parties and occasions', 'منتجات وأدوات فنية وزخرفية للحفلات والمناسبات'),
    services: t('Logo design · Visual identity · Pattern system · Brand applications', 'تصميم الشعار · الهوية البصرية · نظام النمط الزخرفي · تطبيقات الهوية'),
    market: t('{{TODO: market}}', '{{TODO: market}}'),
    year: t('{{TODO: year}}', '{{TODO: year}}'),
  },
  cover: img.cover,
  coverTone: 'dark',
  blocks: [
    { type: 'text', key: 'challenge', over: t('The challenge', 'التحدّي'), title: t('Ornament for everyone, not only for artists.', 'زخرفة للجميع، لا للفنانين وحدهم.'),
      body: [
        t('Zakharef was founded by a group of creative friends who wanted to make ornament available to everyone, not only to skilled artists and craftsmen. The company offers decorative products and art tools for parties and occasions, and competes on fair prices and variety.',
          'أسّس "زخارف" مجموعةٌ من الأصدقاء المبدعين أرادوا أن يجعلوا الزخرفة متاحة للجميع، بعد أن ظلّت محصورة في الفنانين المهرة والحرفيين المتخصصين. تقدّم الشركة منتجات وأدوات فنية وزخرفية للحفلات والمناسبات، وتتميّز بالسعر المناسب والتنوّع.'),
        t('Its identity had to feel artistic and joyful while staying clear and easy to apply across products, packaging and social media, for people and companies who love art and plan events, and for party hosts.',
          'وكان على هويتها أن تجمع الروح الفنية والبهجة، مع البقاء واضحة وسهلة التطبيق على المنتجات والعبوات ووسائل التواصل، لجمهور من الأشخاص والشركات المهتمين بالفن وتنظيم الحفلات، وأصحاب المناسبات.'),
      ] },
    { type: 'full', img: img.concept, tone: 'dark', ratio: '7/5',
      caption: t('The concept: mandala art, the mandala of wedding décor, a flower and the letter ز.', 'الفكرة: فن الماندالا، وماندالا زينة الأعراس، والزهرة، وحرف الزاي.') },
    { type: 'text', key: 'idea', over: t('The idea', 'الفكرة'), title: t('One letter, repeated into a flower.', 'حرف واحد يتكرّر حتى يصير زهرة.'),
      body: [
        t('The symbol brings three references together: mandala art, the mandala patterns used in wedding décor, and the form of a flower, all built from ز, the first Arabic letter of the name.',
          'يجمع الرمز ثلاثة مراجع: فن الماندالا، وزخارف الماندالا في تزيين الأعراس، وهيئة الزهرة، وكلها مبنية من الحرف الأول من الاسم: الزاي.'),
        t('Repeated around a centre, the letter becomes a star-like flower, giving the brand a mark that is both Arabic and ornamental. Paired with a calligraphic wordmark, it reads naturally in Arabic.',
          'ومع تكرار الحرف حول مركز واحد يتحوّل إلى زهرة نجمية الشكل، فتحصل العلامة على رمز عربي وزخرفي في آن واحد، يرافقه شعار مكتوب بخط عربي يُقرأ بسلاسة.'),
      ] },
    { type: 'pair', imgs: [img.build, img.lockups], ratio: '7/5',
      caption: t('Building the star-flower · the lock-ups on gold, blue and navy.', 'بناء الزهرة النجمية · صيغ الشعار على الذهبي والأزرق والكحلي.') },
    { type: 'system', over: t('The system', 'النظام'), title: t('Three colours, one typeface and a pattern.', 'ثلاثة ألوان، وخط واحد، ونمط زخرفي.'),
      rows: [
        { label: t('Logo', 'الشعار'), value: t('The star-flower symbol with the calligraphic wordmark “زخارف للفنون”; a construction grid; stacked and horizontal lock-ups; colour, mono and reversed versions; an app icon.',
          'رمز الزهرة النجمية مع الشعار المكتوب "زخارف للفنون"، وشبكة بناء الشعار، وصيغ عمودية وأفقية، ونسخ ملوّنة وأحادية اللون ومعكوسة، وأيقونة التطبيق.') },
        { label: t('Colour', 'الألوان'), swatches: ['#16215B', '#4FC5F7', '#CC9545', '#000000', '#FFFFFF'],
          value: t('Space Cadet navy #16215B · Picton Blue #4FC5F7 · Aztec Gold #CC9545 · black · white.', 'كحلي #16215B · أزرق سماوي #4FC5F7 · ذهبي #CC9545 · أسود · أبيض.') },
        { label: t('Typography', 'الخط'), value: t('Reem Kufi in Regular, Medium, Semibold and Bold, for Arabic and Latin.', 'خط ريم كوفي بأوزانه العادي والمتوسط وشبه العريض والعريض، للعربية واللاتينية.') },
        { label: t('Pattern', 'النمط'), value: t('A repeating pattern built from the symbol, in blue on navy.', 'نمط متكرر مبني من الرمز، بالأزرق على الكحلي.') },
      ] },
    { type: 'full', img: img.pattern, tone: 'dark', ratio: '7/5',
      caption: t('The pattern: the symbol, repeated in blue on navy.', 'النمط: الرمز متكرراً بالأزرق على الكحلي.') },
    { type: 'pair', imgs: [img.colour, img.type], ratio: '7/5',
      caption: t('Navy, blue and gold, with black and white · Reem Kufi in four weights.', 'الكحلي والأزرق والذهبي مع الأسود والأبيض · خط ريم كوفي بأربعة أوزان.') },
    { type: 'text', key: 'solution', over: t('Applications', 'التطبيقات'), title: t('From the phone screen to the wall.', 'من شاشة الهاتف حتى الجدار.'),
      body: [t(
        'The deck carries the identity into social media posts and a profile, an app icon, a website, a T-shirt, a shopping bag, a large-scale wall mural and a flag. The applications shown are concept visualisations of the identity.',
        'ينقل العرض الهوية إلى منشورات وحساب على وسائل التواصل، وأيقونة تطبيق، وموقع إلكتروني، وقميص، وحقيبة تسوّق، وجدارية كبيرة، وعَلَم. والتطبيقات المعروضة تصوّرات مفاهيمية للهوية.',
      )] },
    { type: 'full', img: img.mural, tone: 'dark', ratio: '7/5',
      caption: t('Identity application: a large-scale wall mural.', 'من تطبيقات الهوية: جدارية كبيرة.') },
    { type: 'pair', imgs: [img.bag, img.flag], ratio: '7/5',
      caption: t('Identity applications: shopping bag and flag.', 'من تطبيقات الهوية: حقيبة التسوّق والعَلَم.') },
  ],
  outcome: {
    over: t('The outcome', 'النتيجة'),
    line: t('An Arabic identity with its own ornament, applied to bags, screens, a flag and a wall mural.', 'هوية عربية تملك زخرفتها الخاصة، وتظهر على الحقائب والشاشات والعَلَم والجدارية.'),
    // Counts taken from the deck (not measured results).
    facts: [
      { value: '1', label: t('Arabic letter behind the symbol', 'حرف عربي وراء الرمز') },
      { value: '3', label: t('brand colours, with black and white', 'ألوان للهوية مع الأسود والأبيض') },
      { value: '4', label: t('weights of one typeface', 'أوزان لخط واحد') },
      { value: '7', label: t('kinds of identity application', 'أنواع من تطبيقات الهوية') },
    ],
  },
  todo: [
    'Market and year',
    'Which applications were produced (now labelled as concept visualisations)',
    'Deck pp. 11-12 show a web address and a social handle: not used until the client confirms',
    'Verified results (no Results block on the page)',
    'Client testimonial with name/title and written consent (no quote on the page)',
  ],
};
