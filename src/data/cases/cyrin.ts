// Cyrin · The Blue House — case study (Stage 4B-2). Copy source: /home/claude/content/work/cyrin.md only (from the deck).
// Images: deck pages rendered by scripts/build-assets.mjs into public/images/cyrin/pNN-{480,800,1200,1600}.webp.
// The applications are concept visualisations (deck mockups): captions say "identity applications", never "installed".
// Not on the page (open, see todo): verified results, client testimonial, market, year, confirmed sector and brief.
import type { CaseStudy, T } from '../case-studies';
import type { Img } from '../media';

const t = (en: string, ar: string): T => ({ en, ar });
const W = [480, 800, 1200, 1600];
const p = (n: string, en: string, ar: string): Img => ({ base: `cyrin/p${n}`, widths: W, w: 1700, h: 956, alt: { en, ar } });

const img = {
  cover: p('02', 'The Cyrin · The Blue House wordmark beside a black horse in a dark room', 'الكلمة الشعار لسيرين · ذا بلو هاوس بجانب حصان أسود في مساحة معتمة'),
  concept: p('03', 'Concept page: the C drawn as a horseshoe and the dot as a point of identity, over an oversized Cyrin wordmark', 'صفحة الفكرة: حرف C مرسوم على هيئة حدوة حصان، والنقطة علامةً للهوية، فوق الكلمة الشعار بحجم كبير'),
  palette: p('08', 'Cyrin colour palette: near-black, deep navy, charcoal, slate grey, orange and light grey', 'لوحة ألوان سيرين: الأسود العميق والكحلي الداكن والفحمي والرمادي الأردوازي والبرتقالي والرمادي الفاتح'),
  type: p('09', 'The Loew Next typeface in four weights, beside a portrait styled in navy', 'خط Loew Next بأوزانه الأربعة بجانب صورة شخصية بألوان كحلية'),
  plate: p('07', 'Sushi plated in the shape of the Cyrin C', 'طبق سوشي مقدّم على هيئة حرف C من هوية سيرين'),
  roll: p('06', 'The C mark of The Blue House drawn around a sushi roll', 'حرف C من شعار ذا بلو هاوس يلتفّ حول قطعة سوشي'),
  navy: p('11', 'The C monogram with The Blue House descriptor in light grey on navy', 'حرف C مع الوصف The Blue House بالرمادي الفاتح على خلفية كحلية'),
  interior: p('01', 'Cyrin restaurant interior in the navy brand palette', 'المساحة الداخلية لمطعم سيرين بألوان الهوية الكحلية'),
  tag: p('10', 'Cyrin hang tag on a navy cardigan, with the C monogram printed inside the collar', 'بطاقة تعليق بشعار سيرين على سترة كحلية، وحرف C مطبوع داخل الياقة'),
  bag: p('12', 'Navy shopping bag with The Blue House C monogram', 'حقيبة تسوّق كحلية بحرف C وشعار ذا بلو هاوس'),
  menu: p('13', 'Navy menu cover with an embossed C, on a stone table set with sushi', 'غلاف قائمة طعام كحلي بحرف C نافر على طاولة حجرية مع أطباق سوشي'),
  storefront: p('14', 'Storefront with a C-shaped arch framing the entrance', 'واجهة متجر بقوس على هيئة حرف C يحيط بالمدخل'),
};

export const cyrin: CaseStudy = {
  slug: 'cyrin',
  kind: 'case',
  meta: {
    title: t('Cyrin · The Blue House: Brand Identity Case Study | Gate33', 'سيرين · ذا بلو هاوس: دراسة حالة في الهوية التجارية | Gate33'),
    description: t(
      'How Gate33 built the Cyrin identity around a horseshoe-shaped C: wordmark, palette, typography and applications from the plate to the storefront.',
      'كيف بنت Gate33 هوية سيرين حول حرف C على هيئة حدوة حصان: الكلمة الشعار والألوان والخط والتطبيقات من طبق التقديم حتى واجهة المتجر.',
    ),
  },
  overline: t('Case study · Branding', 'دراسة حالة · الهوية'),
  headline: t('One letter, drawn from a horseshoe, signs the whole brand.', 'حرف واحد بهيئة حدوة حصان يوقّع العلامة بأكملها.'),
  intro: t(
    'An identity for Cyrin · The Blue House, drawn around one letter: a C shaped like a horseshoe, used from the dining room to the storefront.',
    'هوية لسيرين · ذا بلو هاوس، بُنيت حول حرف واحد: C على هيئة حدوة حصان، يرافق العلامة من صالة الطعام حتى واجهة المتجر.',
  ),
  facts: {
    client: t('Cyrin · The Blue House', 'سيرين · ذا بلو هاوس'),
    sector: t('Hospitality & lifestyle', 'الضيافة وأسلوب الحياة'), // shown on the work card too; {{TODO: confirm with Shifaa}}
    services: t('Logo design · Visual identity · Brand applications', 'تصميم الشعار · الهوية البصرية · تطبيقات الهوية'),
    market: t('{{TODO: market}}', '{{TODO: market}}'),
    year: t('{{TODO: year}}', '{{TODO: year}}'),
  },
  cover: img.cover,
  coverTone: 'dark',
  blocks: [
    { type: 'text', key: 'challenge', over: t('The challenge', 'التحدّي'), title: t('Bold and refined, on every surface.', 'جرأة ورقيّ على كل سطح.'),
      body: [t(
        'Cyrin needed an identity that felt bold and refined at once, and that could carry a name with personality across very different touchpoints: a dining room, a plate, a garment tag and a building façade.',
        'احتاجت سيرين إلى هوية تجمع الجرأة والرقيّ معاً، وتحمل اسماً ذا شخصية عبر نقاط تواصل متباينة: صالة الطعام، وطبق التقديم، وبطاقة الملابس، وواجهة المبنى.',
      )] },
    { type: 'full', img: img.concept, tone: 'light',
      caption: t('The concept: a horseshoe C, and a dot that marks a point of identity.', 'الفكرة: حرف C على هيئة حدوة، ونقطة تمثّل علامة الهوية.') },
    { type: 'text', key: 'idea', over: t('The idea', 'الفكرة'), title: t('A horseshoe, drawn as a C.', 'حدوة حصان مرسومة على هيئة C.'),
      body: [
        t('The C traces the outline of a horseshoe, an old sign of strength and character. Its open, flowing stroke gives the letter movement, which suits a brand built on change and discovery.',
          'يرسم حرف الـC هيئة حدوة حصان، الرمز القديم للقوة والشخصية. ويمنح خطّه المفتوح المنساب الحرفَ حركةً تناسب علامة قائمة على التحوّل والاستكشاف.'),
        t('A single dot completes the wordmark: a small detail that gives the name a fixed point.',
          'وتكتمل الكلمة الشعار بنقطة واحدة؛ تفصيل صغير يمنح الاسم نقطة ارتكاز.'),
      ] },
    { type: 'pair', imgs: [img.palette, img.type],
      caption: t('Six colours led by navy, with orange as the accent · Loew Next in four weights.', 'ستة ألوان يتصدّرها الكحلي، والبرتقالي لون إبراز · خط Loew Next بأربعة أوزان.') },
    { type: 'system', over: t('The system', 'النظام'), title: t('A short palette, one typeface and one oversized letter.', 'لوحة ألوان موجزة، وخط واحد، وحرف واحد مكبَّر.'),
      rows: [
        { label: t('Logo', 'الشعار'), value: t('The Cyrin wordmark with “The Blue House” descriptor; the C monogram used alone as a signature mark.', 'الكلمة الشعار "Cyrin" مع الوصف "The Blue House"، وحرف الـC منفرداً كعلامة توقيع.') },
        { label: t('Colour', 'الألوان'), swatches: ['#0B0C11', '#023560', '#3F3A41', '#76828E', '#DB5226', '#E0E0E0'],
          value: t('Near-black #0B0C11 · deep navy #023560 · charcoal #3F3A41 · slate grey #76828E · orange #DB5226 · light grey #E0E0E0. Navy leads; orange is the accent.',
            'أسود عميق #0B0C11 · كحلي داكن #023560 · فحمي #3F3A41 · رمادي أردوازي #76828E · برتقالي #DB5226 · رمادي فاتح #E0E0E0. يتصدّر الكحلي، والبرتقالي لون إبراز.') },
        { label: t('Typography', 'الخط'), value: t('Loew Next in Light, Regular, Medium and Bold.', 'خط Loew Next بأوزانه الخفيف والعادي والمتوسط والعريض.') },
        { label: t('Graphic device', 'العنصر الجرافيكي'), value: t('No pattern: the oversized C does the work, cropped on imagery, embossed on covers and echoed in architecture.', 'لا يوجد نمط زخرفي؛ يؤدّي حرف الـC المكبَّر دور العنصر الجرافيكي، مقتطعاً على الصور، ونافراً على الأغلفة، ومتجسّداً في العمارة.') },
      ] },
    { type: 'full', img: img.plate, tone: 'light',
      caption: t('A signature dish, plated in the shape of the C.', 'طبق مميّز يُقدَّم على هيئة حرف الـC.') },
    { type: 'pair', imgs: [img.roll, img.navy],
      caption: t('The C as a signature mark, on its own and with The Blue House descriptor.', 'حرف الـC علامةَ توقيع، منفرداً ومع الوصف The Blue House.') },
    { type: 'text', key: 'solution', over: t('Applications', 'التطبيقات'), title: t('From the plate to the storefront.', 'من طبق التقديم حتى واجهة المتجر.'),
      body: [t(
        'The C travels across a restaurant interior, a signature dish plated in its shape, a hang tag, a shopping bag, an embossed menu cover and a storefront arch. The applications shown are concept visualisations of the identity.',
        'ينتقل حرف الـC عبر التصميم الداخلي للمطعم، وطبق مميّز يُقدَّم على هيئته، وبطاقة تعليق للملابس، وحقيبة تسوّق، وغلاف قائمة طعام بحرف نافر، وواجهة متجر بقوس على هيئته. والتطبيقات المعروضة تصوّرات مفاهيمية للهوية.',
      )] },
    { type: 'full', img: img.interior, tone: 'dark',
      caption: t('Identity application: the dining room in the navy palette.', 'من تطبيقات الهوية: صالة الطعام بألوان الهوية الكحلية.') },
    { type: 'trio', imgs: [img.tag, img.bag, img.menu],
      caption: t('Identity applications: hang tag, shopping bag and embossed menu cover.', 'من تطبيقات الهوية: بطاقة التعليق، وحقيبة التسوّق، وغلاف القائمة بالحرف النافر.') },
    { type: 'full', img: img.storefront, tone: 'dark',
      caption: t('Identity application: a storefront arch drawn from the C.', 'من تطبيقات الهوية: قوس واجهة المتجر مستوحى من حرف الـC.') },
  ],
  outcome: {
    over: t('The outcome', 'النتيجة'),
    line: t('One letter, the C, now gives Cyrin a signature it carries from the plate to the storefront.', 'حرف واحد، الـC، يمنح سيرين اليوم توقيعاً بصرياً يرافقها من طبق التقديم حتى واجهة المتجر.'),
    // Counts taken from the deck (not measured results).
    facts: [
      { value: '6', label: t('colours in the palette', 'ألوان في لوحة الهوية') },
      { value: '4', label: t('weights of one typeface', 'أوزان لخط واحد') },
      { value: '6', label: t('identity applications', 'تطبيقات للهوية') },
      { value: '1', label: t('letter that signs them all', 'حرف واحد يوقّعها جميعاً') },
    ],
  },
  todo: [
    'Sector: confirm (deck shows a restaurant, apparel tags and a storefront)',
    'Client brief: confirm the challenge wording with Shifaa',
    'Market and year',
    'Which applications were produced (now labelled as concept visualisations)',
    'Verified results (no Results block on the page)',
    'Client testimonial with name/title and written consent (no quote on the page)',
  ],
};
