import type { HomeCopy } from './types';
import { packageItems } from './packages';

// Stage 3 copy: content/pages/home.md + content/services/_index.md. Formal Gulf MSA, Western digits.
// {{TODO}} = open with Shifaa; never invented, never rendered as text.
const ar: HomeCopy = {
  lang: 'ar',
  meta: {
    title: 'Gate33 | وكالة إبداعية وتسويقية في\u00A0دبي',
    description: 'وكالة إبداعية وتسويقية في\u00A0دبي تخدم العلامات في\u00A0الإمارات والخليج: الهوية، والإنتاج، والمواقع، والتسويق، والفعاليات، بالعربية والإنجليزية.',
  },
  nav: [
    { label: 'الخدمات', href: '/ar/services/' },
    { label: 'أعمالنا', href: '/ar/work/' },
    { label: 'الباقات', href: '/ar/packages/' },
    { label: 'من\u00A0نحن', href: '/ar/about/' },
    { label: 'تواصل معنا', href: '/ar/contact/' },
  ],
  switchLabel: 'English',
  askGate: 'اسأل Gate',
  hero: {
    eyebrow: 'وكالة إبداعية وتسويقية في\u00A0دبي',
    headline: ['ابنِ العلامة.', 'اصنع التجربة.', 'نمِّ أعمالك.'],
    lede: 'هويات بصرية وأفلام ومواقع وحملات لشركات في\u00A0الإمارات والخليج، يصنعها فريق واحد في\u00A0دبي بالعربية والإنجليزية.',
    cta: 'اطلب عرض سعر',
    servicesLabel: 'خدماتنا',
    pause: 'أوقف فيديو الخلفية',
    play: 'شغّل فيديو الخلفية',
  },
  intro: 'يتولّى فريق واحد الهوية والفيلم والموقع والحملة. ترسل إلينا موجزك مرة واحدة، فتظهر علامتك بالصورة نفسها وتتحدّث بالنبرة نفسها من\u00A0الشعار حتى\u00A0الإطلاق.',
  clients: { eyebrow: 'عملاؤنا', title: 'علامات أسهمنا في\u00A0بنائها', viewCase: 'اطّلع على\u00A0دراسة الحالة' },
  work: {
    eyebrow: 'أعمال مختارة',
    title: 'هويات وأفلام من\u00A0أعمالنا',
    all: 'كل\u00A0الأعمال',
    viewCase: 'اطّلع على\u00A0دراسة الحالة',
    play: 'شغّل الفيلم',
    moreTitle: 'شعارات أخرى صمّمناها.',
    moreLine: 'أرشيف الشعارات كاملاً، مع\u00A0كل هوية وفيلم يمكننا عرضه.',
    moreCta: 'كل\u00A0الأعمال',
  },
  services: {
    eyebrow: 'خدماتنا',
    title: 'سبع خدمات وفريق\u00A0واحد',
    line: 'ابدأ بخدمة واحدة، أو\u00A0أوكل إلينا الإطلاق كاملاً.',
    lead: 'من\u00A0الشعار الأول حتى\u00A0الإطلاق الكامل، بوابة واحدة لعلامتك.',
    swipe: 'اسحب لعرض الخدمات السبع',
    explore: 'استكشف',
    askTitle: 'لست متأكداً من\u00A0أين تبدأ؟',
    askLine: 'أخبر «اسأل Gate» بما تعمل عليه، وسيرشدك إلى\u00A0الخدمات المناسبة لك.',
    askCta: 'ساعدني في\u00A0الاختيار',
  },
  packages: {
    eyebrow: 'الباقات',
    title: 'جاهز للبدء؟ اختر باقتك.',
    line: 'أربع باقات بنطاق محدّد وسعر يبدأ من\u00A0رقم معلن، والدفع عبر الموقع.',
    popular: 'الأكثر طلباً',
    from: 'تبدأ من',
    price: '{{TODO: السعر}}',
    priceNote: 'السعر قيد التأكيد',
    vat: 'غير شامل ضريبة القيمة المضافة',
    swipe: 'اسحب لمقارنة الباقات الأربع',
    buy: 'اشترِ الآن',
    reassurance: 'نطاق محدّد · سعر واضح · شراء عبر الموقع',
    // Items: src/data/packages.ts (one source of truth, also used by /packages/).
    items: packageItems('ar'),
  },
  how: {
    eyebrow: 'طريقة عملنا',
    title: 'أربع خطوات من\u00A0الموجز حتى\u00A0الإطلاق',
    steps: [
      { title: 'الموجز', line: 'أخبرنا بهدفك، ونطرح الأسئلة الصحيحة.' },
      { title: 'الخطة', line: 'النطاق والجدول الزمني والسعر، باتفاق مكتوب.' },
      { title: 'التنفيذ', line: 'التصميم والإنتاج والتطوير، مع\u00A0مراجعة في\u00A0كل\u00A0مرحلة.' },
      { title: 'الإطلاق', line: 'التسليم والتشغيل والتحسين المستمر.' },
    ],
  },
  results: {
    eyebrow: 'بالأرقام',
    title: '{{TODO}}',
    stats: [
      { value: '{{TODO: verified number}}', label: 'علامة تجارية' },
      { value: '{{TODO: verified number}}', label: 'مشروعاً منجزاً' },
      { value: '{{TODO: verified number}}', label: 'سنوات من\u00A0الخبرة' },
      { value: '{{TODO: e.g. UAE · KSA — confirm}}', label: 'أسواق نخدمها' },
    ],
    note: 'الأرقام قيد التحقق، وستظهر هنا بعد تأكيدها.',
  },
  cta: {
    eyebrow: 'لنتحدّث',
    title: 'لديك مشروع؟',
    line: 'أرسل موجز مشروعك أو\u00A0استعن بـ«اسأل Gate»، وسنعود إليك بخطوة تالية واضحة.',
    button: 'أرسل موجز مشروعي',
    ask: 'اسأل Gate',
  },
  footer: {
    tagline: 'وكالة إبداعية وتسويقية في\u00A0دبي، لعلامات الإمارات والخليج.',
    services: 'الخدمات', company: 'الشركة', contact: 'تواصل',
    companyLinks: ['أعمالنا', 'الباقات', 'من\u00A0نحن', 'تواصل معنا'],
    email: 'hello@gate-33.com', // TODO: confirm email
    city: 'دبي، الإمارات', // TODO: confirm office location
    brief: 'أرسل موجز مشروعي',
    rights: '© 2026 Gate33. جميع الحقوق محفوظة.',
    privacy: 'الخصوصية', terms: 'الشروط',
  },
  ui: { openMenu: 'افتح القائمة', closeMenu: 'أغلق القائمة', play: 'شغّل الفيديو', skip: 'انتقل إلى\u00A0المحتوى' },

  drawer: {
    title: 'اطلب عرض سعر', line: 'أرسل موجز مشروعك، وسنعود إليك بخطوة تالية واضحة.', // {{TODO: response time}}
    name: 'الاسم', email: 'البريد الإلكتروني', company: 'الجهة', need: 'ما\u00A0الذي تحتاجه؟', submit: 'أرسل موجز مشروعي',
    todo: 'نسخة معاينة: النموذج غير مفعَّل بعد، ولن يُرسَل أي شيء.', close: 'إغلاق',
    notConnected: 'النموذج غير مفعَّل في\u00A0نسخة المعاينة، ولم يُرسَل أي شيء.',
  },
};
export default ar;
