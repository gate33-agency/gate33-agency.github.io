// Seven pillars — copy from content/services/_index.md (name + promise) and each service file (scope, first 4 picked
// for the home card). Order = nav order. Each card links to /<lang>/services/<slug>/ (pages come later; URLs stable).
type T = { en: string; ar: string };
export interface Service { slug: string; name: T; promise: T; subs: T[] }
const t = (en: string, ar: string): T => ({ en, ar });
export const services: Service[] = [
  { slug: 'ai-search-visibility', name: t('AI Search Visibility', 'الظهور في\u00A0البحث بالذكاء الاصطناعي'),
    promise: t('Make your\u00A0brand clear and\u00A0accurate to\u00A0the\u00A0AI tools your\u00A0customers ask.', 'اجعل علامتك حاضرة بدقة في\u00A0إجابات أدوات الذكاء الاصطناعي التي يستعين بها عملاؤك.'),
    subs: [t('AI Visibility Audit', 'تدقيق الظهور في\u00A0الذكاء الاصطناعي'), t('Answer-Ready Content (AEO)', 'محتوى جاهز للإجابة'), t('Structured Data &\u00A0Technical Setup', 'البيانات المنظّمة والإعداد التقني'), t('Arabic-First Visibility', 'ظهور يبدأ بالعربية')] },
  { slug: 'branding-creative-design', name: t('Branding + Creative Design', 'الهوية والتصميم الإبداعي'),
    promise: t('Names, logos and\u00A0visual systems built to\u00A0work in\u00A0Arabic and\u00A0English.', 'أسماء وشعارات وأنظمة بصرية مبنية لتعمل بالعربية والإنجليزية.'),
    subs: [t('Naming', 'تسمية العلامة'), t('Logo Design', 'تصميم الشعار'), t('Visual Identity System', 'نظام الهوية البصرية'), t('Packaging Design', 'تصميم العبوات')] },
  { slug: 'creative-production', name: t('Creative Production', 'الإنتاج الإبداعي'),
    promise: t('Corporate films, commercials, photography and\u00A0reels, from\u00A0script to\u00A0final\u00A0cut.', 'أفلام تعريفية وإعلانات وصور ومقاطع ريلز، من\u00A0كتابة النص حتى\u00A0النسخة النهائية.'),
    subs: [t('Corporate Film', 'الفيلم التعريفي للشركة'), t('TV &\u00A0Digital Commercial', 'الإعلان التلفزيوني والرقمي'), t('Product &\u00A0Brand Photography', 'تصوير المنتجات والعلامة'), t('Reels &\u00A0Short-Form Content', 'الريلز والمحتوى القصير')] },
  { slug: 'web-apps-business-systems', name: t('Web, Apps + Business Systems', 'المواقع والتطبيقات وأنظمة الأعمال'),
    promise: t('Websites, stores and\u00A0systems that run the\u00A0business behind the\u00A0brand.', 'مواقع ومتاجر وأنظمة تُدار بها أعمالك اليومية خلف\u00A0علامتك.'),
    subs: [t('Corporate Websites', 'المواقع التعريفية للشركات'), t('E-commerce Stores', 'المتاجر الإلكترونية'), t('Mobile &\u00A0Web Apps', 'تطبيقات الجوال والويب'), t('CRM &\u00A0Booking Systems', 'أنظمة إدارة العملاء والحجوزات')] },
  { slug: 'digital-marketing-growth', name: t('Digital Marketing + Growth', 'التسويق الرقمي والنمو'),
    promise: t('Strategy, content and\u00A0paid media planned around what you need to\u00A0sell.', 'استراتيجية ومحتوى وإعلانات مدفوعة نخطّطها انطلاقاً مما\u00A0تريد بيعه.'),
    subs: [t('Marketing Strategy &\u00A0Launch Plans', 'الاستراتيجية التسويقية وخطط الإطلاق'), t('Social Media Management', 'إدارة حسابات التواصل الاجتماعي'), t('Paid Media', 'الإعلانات المدفوعة'), t('Campaign Concepts &\u00A0Copywriting', 'أفكار الحملات وكتابة المحتوى')] },
  { slug: 'product-development-sourcing', name: t('Product Development + Sourcing', 'تطوير المنتجات والتوريد'),
    promise: t('From\u00A0the\u00A0first sketch to\u00A0a\u00A0finished, packaged product.', 'من\u00A0الرسم الأول إلى\u00A0منتج مكتمل ومغلّف.'),
    subs: [t('Product Concept &\u00A0Development', 'فكرة المنتج وتطويره'), t('Supplier Sourcing', 'البحث عن\u00A0الموردين'), t('Samples &\u00A0Prototyping', 'العيّنات والنماذج الأولية'), t('Manufacturing Follow-up', 'متابعة التصنيع')] },
  { slug: 'events-brand-experiences', name: t('Events + Brand Experiences', 'الفعاليات وتجارب العلامة'),
    promise: t('Openings, sales days and\u00A0activations run end to\u00A0end.', 'افتتاحات وأيام تخفيضات وفعاليات ترويجية ندير تفاصيلها من\u00A0البداية إلى\u00A0النهاية.'),
    subs: [t('Store Openings &\u00A0Launches', 'افتتاح المتاجر وإطلاق المنتجات'), t('Brand Activations', 'الفعاليات الترويجية'), t('Styling &\u00A0Décor', 'التنسيق والديكور'), t('Event Content Coverage', 'التغطية المرئية للفعاليات')] },
];
