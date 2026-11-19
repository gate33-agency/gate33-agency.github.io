// Plutrex — case study (Stage 4B-3). Copy source: /home/claude/content/work/plutrex.md only (from the 55-page guidelines).
// Images: guideline pages rendered by scripts/build-assets.mjs into public/images/plutrex/pNN-{480,800,1200,1600}.webp.
// Never used: pp. 1, 31-33, 38, 55 (personal data). p.29 (tone of voice) is not quoted: it contradicts the fintech positioning.
// Hex values read from the colour pages (pp. 19-21). Applications are guideline mockups: labelled as identity applications.
import type { CaseStudy, T } from '../case-studies';
import type { Img } from '../media';

const t = (en: string, ar: string): T => ({ en, ar });
const W = [480, 800, 1200, 1600];
const p = (n: string, en: string, ar: string): Img => ({ base: `plutrex/p${n}`, widths: W, w: 1700, h: 956, alt: { en, ar } });

const img = {
  building: p('48', 'The Plutrex logo as dimensional lettering on a glass office building', 'شعار بلوتركس بحروف بارزة على واجهة مبنى زجاجي'),
  logo: p('11', 'Guideline page: the Plutrex logomark and wordmark forming the full logo', 'صفحة من الدليل: رمز بلوتركس وكلمة الشعار يكوّنان الشعار الكامل'),
  dark: p('12', 'Guideline page: the white Plutrex logo on a black background', 'صفحة من الدليل: شعار بلوتركس الأبيض على خلفية سوداء'),
  icon: p('13', 'Guideline page: the Plutrex icon on indigo, purple and pale lavender tiles', 'صفحة من الدليل: أيقونة بلوتركس على مربعات بالنيلي والبنفسجي والخزامي الفاتح'),
  primary: p('19', 'Guideline page: the primary colours, purple and deep indigo, as overlapping circles', 'صفحة من الدليل: اللونان الأساسيان، البنفسجي والنيلي الداكن، في دوائر متداخلة'),
  secondary: p('20', 'Guideline page: the secondary colours, deep plum, soft blue and pale lavender, as rings', 'صفحة من الدليل: الألوان الثانوية، البرقوقي الداكن والأزرق الهادئ والخزامي الفاتح، في حلقات'),
  pattern: p('27', 'Guideline page: four pattern tiles of layered curves in purple, indigo and teal', 'صفحة من الدليل: أربعة نماذج للنمط بمنحنيات متراكبة بالبنفسجي والنيلي والأزرق المخضرّ'),
  icons: p('26', 'Guideline page: sixteen line icons in purple', 'صفحة من الدليل: ست عشرة أيقونة خطية باللون البنفسجي'),
  web: p('35', 'Website homepage with the line Precision Powered by Intelligence over a glowing globe', 'الصفحة الرئيسية للموقع بعبارة Precision Powered by Intelligence فوق كرة أرضية مضيئة'),
  app: p('36', 'The Plutrex app icon on a phone home screen against purple', 'أيقونة تطبيق بلوتركس على شاشة هاتف بخلفية بنفسجية'),
  keychain: p('47', 'Engraved metal keychain with the Plutrex logo', 'ميدالية مفاتيح معدنية محفور عليها شعار بلوتركس'),
  pack: p('54', 'Purple sachet packaging with the white Plutrex logo', 'عبوة مغلّفة بنفسجية بشعار بلوتركس الأبيض'),
  tote: p('43', 'Purple Plutrex tote bag with the brand line, hanging on a chair', 'حقيبة قماشية بنفسجية بشعار بلوتركس وعبارة العلامة معلّقة على كرسي'),
};

export const plutrex: CaseStudy = {
  slug: 'plutrex',
  kind: 'case',
  meta: {
    title: t('Plutrex: Fintech Brand Identity Case Study | Gate33', 'بلوتركس: دراسة حالة في هوية علامة للتقنية المالية | Gate33'),
    description: t(
      'How Gate33 built the Plutrex identity: a logomark for intelligent data flow, a purple and indigo palette, Manrope and a 55-page guidelines system.',
      'كيف بنت Gate33 هوية بلوتركس: رمز يعبّر عن تدفّق البيانات الذكي، ولوحة ألوان بالبنفسجي والنيلي، وخط Manrope، ودليل هوية من 55 صفحة.',
    ),
  },
  overline: t('Case study · Branding', 'دراسة حالة · الهوية'),
  headline: t('A fintech brand, calm and sure.', 'علامة تقنية مالية تتحدّث بثقة وهدوء.'),
  intro: t(
    'An identity and a 55-page guidelines system for Plutrex, a platform that turns complex financial data into clear, real-time insight.',
    'هوية ودليل من 55 صفحة لبلوتركس، المنصة التي تحوّل البيانات المالية المعقّدة إلى رؤى واضحة وفورية.',
  ),
  facts: {
    client: t('Plutrex', 'بلوتركس'),
    sector: t('Fintech · AI-driven financial analytics', 'التقنية المالية · تحليلات مالية بالذكاء الاصطناعي'),
    services: t('Brand identity · Logo design · Brand guidelines · Digital and print applications', 'الهوية التجارية · تصميم الشعار · دليل الهوية · التطبيقات الرقمية والمطبوعة'),
    market: t('{{TODO: market}}', '{{TODO: market}}'),
    year: t('{{TODO: year (guidelines dated 2026)}}', '{{TODO: year}}'),
  },
  cover: img.building,
  coverTone: 'light',
  blocks: [
    { type: 'text', key: 'challenge', over: t('The challenge', 'التحدّي'), title: t('Advanced technology, with financial credibility.', 'تقنية متقدمة بمصداقية مالية.'),
      body: [t(
        'Plutrex turns complex financial data into clear, real-time insight for investors, analysts and institutions. Its brand had to balance two worlds, advanced technology and financial credibility, and hold together across apps, investor presentations, market displays and print.',
        'تحوّل بلوتركس البيانات المالية المعقّدة إلى رؤى واضحة وفورية للمستثمرين والمحلّلين والمؤسسات. وكان على هويتها أن توازن بين عالمين: التقنية المتقدمة والمصداقية المالية، وأن تبقى متماسكة عبر التطبيقات، وعروض المستثمرين، وشاشات الأسواق، والمطبوعات.',
      )] },
    { type: 'full', img: img.logo, tone: 'light',
      caption: t('The full logo: a logomark for intelligent data flow, and a clear, confident wordmark.', 'الشعار الكامل: رمز يعبّر عن تدفّق البيانات الذكي، وكلمة شعار واضحة وواثقة.') },
    { type: 'text', key: 'idea', over: t('The idea', 'الفكرة'), title: t('Substance and clarity over noise.', 'الجوهر والوضوح بدلاً من الضجيج.'),
      body: [
        t('The brand rests on four pillars: Intelligence, Speed, Professionalism and Trust. The logomark expresses intelligent data flow and financial insight, and works alone as an app icon.',
          'تقوم العلامة على أربع ركائز: الذكاء، والسرعة، والاحترافية، والثقة. يعبّر رمز الشعار عن تدفّق البيانات الذكي والرؤية المالية، ويعمل منفرداً أيقونةً للتطبيق.'),
        t('The line “Precision Powered by Intelligence” carries the same idea into communication: substance and clarity over noise.',
          'وتنقل عبارة "Precision Powered by Intelligence" الفكرة نفسها إلى الرسائل: الجوهر والوضوح بدلاً من الضجيج.'),
      ] },
    { type: 'pair', imgs: [img.dark, img.icon],
      caption: t('The white logo for dark surfaces · the icon, used alone where space is limited.', 'الشعار الأبيض للخلفيات الداكنة · الأيقونة منفردةً حيث تضيق المساحة.') },
    { type: 'system', over: t('The system', 'النظام'), title: t('One gradient, one typeface and clear rules.', 'تدرّج لوني واحد، وخط واحد، وقواعد واضحة.'),
      rows: [
        { label: t('Logo', 'الشعار'), value: t('Logomark and wordmark; a white version for dark backgrounds; a standalone icon. Clear space, minimum sizes (print 52 mm, icon 20 mm; digital 150 px, icon 57 px), partner lock-up rules and misuse examples.',
          'رمز وكلمة شعار، ونسخة بيضاء للخلفيات الداكنة، وأيقونة مستقلة. وقواعد للمساحة المحيطة والأحجام الدنيا (للطباعة 52 مم والأيقونة 20 مم، وللشاشات 150 بكسل والأيقونة 57 بكسل)، وقواعد الظهور مع الشركاء، وأمثلة للاستخدام الخاطئ.') },
        { label: t('Colour', 'الألوان'), swatches: ['#704599', '#191970', '#1A0040', '#6694ED', '#E8E5FA', '#F04545', '#21C45E'],
          value: t('Primary: purple #704599 and deep indigo #191970, used as a gradient. Secondary: deep plum #1A0040, soft blue #6694ED and pale lavender #E8E5FA. Tertiary: red #F04545 and green #21C45E, limited to about 10% and reserved for charts and data.',
            'الأساسية: البنفسجي #704599 والنيلي الداكن #191970 بتدرّج لوني. الثانوية: البرقوقي الداكن #1A0040، والأزرق الهادئ #6694ED، والخزامي الفاتح #E8E5FA. والثالثية: الأحمر #F04545 والأخضر #21C45E، بنسبة لا تتجاوز 10% تقريباً، وتُخصَّص للرسوم البيانية والبيانات.') },
        { label: t('Typography', 'الخط'), value: t('Manrope, from Light to Black: one family for digital and print.', 'خط Manrope بأوزانه من الخفيف إلى الأسود، عائلة واحدة للشاشات والمطبوعات.') },
        { label: t('Icons', 'الأيقونات'), value: t('A clean, line-based icon set.', 'مجموعة أيقونات خطية بسيطة.') },
        { label: t('Pattern', 'النمط'), value: t('A geometric system inspired by motion, orbit and interconnected elements; layered curves for rhythm and depth.', 'نمط هندسي مستوحى من الحركة والمدار والعناصر المترابطة، بمنحنيات متراكبة تمنح إيقاعاً وعمقاً.') },
        { label: t('Photography', 'التصوير'), value: t('Real moments of analysis, product close-ups and authentic professionals; no generic stock.', 'لحظات تحليل حقيقية، ولقطات قريبة للمنتج، وأشخاص حقيقيون في بيئة عمل، دون صور جاهزة نمطية.') },
      ] },
    { type: 'pair', imgs: [img.primary, img.secondary],
      caption: t('Primary colours, used as a gradient · secondary colours, used sparingly.', 'الألوان الأساسية بتدرّج لوني · الألوان الثانوية باستخدام مقتصد.') },
    { type: 'pair', imgs: [img.pattern, img.icons],
      caption: t('Pattern tiles built from layered curves · the line icon set.', 'نماذج النمط بمنحنيات متراكبة · مجموعة الأيقونات الخطية.') },
    { type: 'text', key: 'solution', over: t('Applications', 'التطبيقات'), title: t('From the app icon to the building.', 'من أيقونة التطبيق حتى واجهة المبنى.'),
      body: [t(
        'The guidelines carry the system into stationery, an ID card, the website, the app icon and a social poster, and into environment mockups: folders, a tote bag, a laptop, apparel, a keychain, building signage, a notebook, cups and packaging. The applications shown are visualisations from the guidelines.',
        'ينقل الدليل النظام إلى القرطاسية، وبطاقة التعريف، والموقع الإلكتروني، وأيقونة التطبيق، ومنشور التواصل الاجتماعي، وإلى نماذج تطبيقية تشمل الملفات، وحقيبة القماش، والحاسوب المحمول، والملابس، وميدالية المفاتيح، ولافتة المبنى، والدفتر، والأكواب، والتغليف. والتطبيقات المعروضة تصوّرات من دليل الهوية.',
      )] },
    { type: 'full', img: img.web, tone: 'dark',
      caption: t('Identity application: the website, led by the brand line.', 'من تطبيقات الهوية: الموقع الإلكتروني تتصدّره عبارة العلامة.') },
    { type: 'trio', imgs: [img.app, img.keychain, img.pack],
      caption: t('Identity applications: app icon, keychain and packaging.', 'من تطبيقات الهوية: أيقونة التطبيق، وميدالية المفاتيح، والتغليف.') },
    { type: 'full', img: img.tote, tone: 'dark',
      caption: t('Identity application: a tote bag carrying the brand line.', 'من تطبيقات الهوية: حقيبة قماشية تحمل عبارة العلامة.') },
  ],
  outcome: {
    over: t('The outcome', 'النتيجة'),
    line: t('A 55-page system that lets a young fintech platform speak with the calm authority of an established financial brand.', 'نظام هوية من 55 صفحة يمنح منصة تقنية مالية حضوراً هادئاً وواثقاً يليق بالعلامات المالية الراسخة.'),
    // Counts taken from the guidelines (not measured results).
    facts: [
      { value: '55', label: t('pages of brand guidelines', 'صفحة في دليل الهوية') },
      { value: '7', label: t('colours in three tiers', 'ألوان في ثلاث فئات') },
      { value: '1', label: t('type family for screen and print', 'عائلة خطوط للشاشات والمطبوعات') },
      { value: '4', label: t('brand pillars', 'ركائز للعلامة') },
    ],
  },
  todo: [
    'Market and project year (guidelines are dated 2026)',
    'Tone-of-voice page (p.29) speaks of space infrastructure: confirm or correct before it is ever quoted',
    'Verified results (no Results block on the page)',
    'Client testimonial with name/title and written consent (no quote on the page)',
  ],
};
