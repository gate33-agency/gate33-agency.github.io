// /<lang>/privacy/ and /<lang>/terms/ copy (Stage 5-4). Rewritten 19 Nov 2026 as general, common-practice text (see below).
// 19 Nov 2026: Shifaa's proposed wording (answers Q39–Q45) is now in, always written as "proposed" and subject to review by
// her lawyer (Israeli privacy / e-commerce lawyer, plus UAE/GCC review where contracts or payments happen there). It still
// never states a company registration, licence number or address as fact. Replace the whole text with the approved
// legal text before launch (then drop the sample notice, set `updated`, set noindex false and add both pages to sitemap.xml.ts).
import type { Lang } from './types';

export type Block = string | { list: string[] };
export interface LegalSection { id: string; title: string; body: Block[] }
export interface LegalDoc {
  meta: { title: string; description: string };
  crumb: string; overline: string; title: string; intro: string;
  other: { text: string; label: string; href: string };
  sections: LegalSection[];
}
export interface LegalUi {
  breadcrumb: string; home: string; notice: string; noticeTag: string; updated: string; toc: string; tocOpen: string; tocClose: string;
  section: string; backTop: string; skipToc: string; related: string;
}

// 19 Nov 2026 (Ahmed): general, plain-language text that is common practice for agency websites and needs no legal review.
// No named law, court, licence or registration. If Shifaa later wants different wording, she supplies it and it replaces this.
export const LEGAL_UPDATED: Record<Lang, string> | null = { en: '19 November 2026', ar: '19 نوفمبر 2026' };
/** true shows the "sample text" notice at the top of both pages. */
export const LEGAL_SAMPLE = false;

export const legalUi: Record<Lang, LegalUi> = {
  en: {
    breadcrumb: 'Breadcrumb', home: 'Home',
    notice: 'Sample text — to be replaced by Gate33’s approved legal text',
    noticeTag: 'Sample',
    updated: 'Last updated', toc: 'On this page', tocOpen: 'Show contents', tocClose: 'Hide contents', section: 'Section',
    backTop: 'Back to top', skipToc: 'Skip contents', related: 'Related',
  },
  ar: {
    breadcrumb: 'مسار التصفح', home: 'الرئيسية',
    notice: 'نص تجريبي — يُستبدل بالنص القانوني المعتمد من Gate33',
    noticeTag: 'نموذج تجريبي',
    updated: 'آخر تحديث', toc: 'في هذه الصفحة', tocOpen: 'عرض المحتويات', tocClose: 'إخفاء المحتويات', section: 'القسم',
    backTop: 'العودة إلى الأعلى', skipToc: 'تخطَّ المحتويات', related: 'ذو صلة',
  },
};

const en: { privacy: LegalDoc; terms: LegalDoc } = {
  privacy: {
    meta: { title: 'Privacy | Gate33 Agency', description: 'How Gate33 Agency collects, uses and protects the information you share through its website.' },
    crumb: 'Privacy', overline: 'Legal', title: 'Privacy',
    intro: 'This page explains, in plain language, what information Gate33 Agency collects through this website, why we collect it and how we look after it.',
    other: { text: 'Using the site and working with us are covered in the', label: 'Terms', href: '/en/terms/' },
    sections: [
      { id: 'who', title: 'Who we are', body: [
        'This website is run by Gate33 Agency (“Gate33”, “we”, “us”), a creative and marketing agency. For any question about this page or your information, write to hello@gate-33.com.',
      ] },
      { id: 'collect', title: 'What we collect', body: [
        'We only collect what you choose to send us, and the basic technical information any website receives:',
        { list: [
          'Contact and proposal forms: your name, email address and, if you add them, your phone number, company and the details of your project.',
          'Checkout: the details you enter to request or buy a package.',
          'Messages: anything you send us by email, WhatsApp or Instagram.',
          'Technical information: like any website, our hosting provider may record basic data such as your browser type and the pages requested, to keep the site running and secure.',
        ] },
      ] },
      { id: 'use', title: 'How we use it', body: [
        { list: [
          'To reply to your message and prepare a proposal.',
          'To deliver and manage the work you ask us to do.',
          'To keep the website working, secure and easy to use.',
        ] },
        'We do not sell your information, and we do not use it for purposes unrelated to your enquiry or project.',
      ] },
      { id: 'share', title: 'Who we share it with', body: [
        'We share information only with the service providers we need to run the website and our work, such as website hosting, email, analytics and, when online payment is available, a payment provider. They use it only to provide their service to us.',
        'Card details, when payment is taken online, are handled by the payment provider. Gate33 does not see or store them.',
        'We may also share information if the law requires it.',
      ] },
      { id: 'cookies', title: 'Cookies and similar tools', body: [
        'The site keeps a few small settings in your browser for the length of your visit, for example whether the welcome animation has already played. They contain no personal information.',
        'If we use analytics tools to understand how visitors use the site, they may set cookies. You can block or delete cookies in your browser settings at any time.',
      ] },
      { id: 'askgate', title: 'Ask Gate', body: [
        'Ask Gate helps you find the right service or package. Please do not share sensitive personal information in it. If Ask Gate uses an AI service to answer, your question is sent to that service only to produce the reply.',
      ] },
      { id: 'keep', title: 'How long we keep it', body: [
        'We keep your information only for as long as we need it to reply to you, to carry out our work, and to keep the business records we are required to keep. After that, we delete it.',
      ] },
      { id: 'security', title: 'Keeping it safe', body: [
        'Access to your information is limited to the team members who need it. We take reasonable steps to protect it, although no method of sending or storing information online is completely secure.',
      ] },
      { id: 'choices', title: 'Your choices', body: [
        'You can ask us at any time what information we hold about you, or ask us to correct or delete it. Write to hello@gate-33.com and we will reply as soon as we can.',
      ] },
      { id: 'links', title: 'Other websites', body: [
        'Our site links to other websites, such as Instagram and WhatsApp. Their own privacy policies apply when you use them.',
      ] },
      { id: 'changes', title: 'Changes to this page', body: [
        'We may update this page from time to time. The date at the top shows when it last changed.',
      ] },
    ],
  },
  terms: {
    meta: { title: 'Terms | Gate33 Agency', description: 'The terms for using the Gate33 Agency website and requesting its services.' },
    crumb: 'Terms', overline: 'Legal', title: 'Terms',
    intro: 'These terms explain how you may use this website and how requests for our services work. By using the site, you agree to them.',
    other: { text: 'How we handle your information is covered in the', label: 'Privacy page', href: '/en/privacy/' },
    sections: [
      { id: 'about', title: 'About these terms', body: [
        'This website is run by Gate33 Agency (“Gate33”, “we”, “us”). These terms cover the website. Each project is also covered by its own written proposal or agreement, and where the two differ, the proposal or agreement applies.',
      ] },
      { id: 'site', title: 'Information on this site', body: [
        'The information on this site is general and is provided to help you understand our services. We work to keep it accurate and up to date, but it may change without notice and is not a binding offer.',
      ] },
      { id: 'proposals', title: 'Services and proposals', body: [
        'The scope, deliverables, timeline, number of revision rounds and price of a project are confirmed in a written proposal before any work begins. Work starts once you have approved the proposal.',
      ] },
      { id: 'prices', title: 'Prices', body: [
        'Prices on this site are starting points, or are quoted per project. They exclude VAT and any other taxes that apply, and are shown in the local currency of your market. The final price is the one in your approved proposal.',
      ] },
      { id: 'payments', title: 'Payments and cancellation', body: [
        'Payment terms are set out in your proposal. Online payments, when available, are processed by a third-party payment provider.',
        'If a project is cancelled, the arrangements in your proposal or agreement apply. Work already completed and third-party costs already paid are normally charged.',
      ] },
      { id: 'work', title: 'Work and ownership', body: [
        'The rights in the final work are set out in your proposal or agreement, and normally pass to you once everything due has been paid. Third-party material, such as licensed fonts, images or music, stays subject to its own licence.',
        'We show client work in our portfolio only with the client’s consent, and we never share confidential material.',
      ] },
      { id: 'content', title: 'Content on this site', body: [
        'The design, text, images and videos on this site belong to Gate33 or are used with permission. Please do not copy or reuse them without our written consent.',
        'Client names, logos and work shown in our case studies belong to their owners and appear here to describe our work.',
      ] },
      { id: 'use', title: 'Using the site responsibly', body: [
        'Please use the site lawfully and in good faith. Do not try to disrupt it, reach parts that are not public, or send us harmful or misleading information.',
      ] },
      { id: 'links', title: 'Links to other websites', body: [
        'The site links to other websites, such as Instagram and WhatsApp. We are not responsible for their content or how they work.',
      ] },
      { id: 'liability', title: 'Availability and responsibility', body: [
        'We aim to keep the site available and working, but we cannot promise it will always be free of interruptions or errors. To the extent the law allows, we are not responsible for loss that results from using the site or relying on its general information.',
      ] },
      { id: 'changes', title: 'Changes and contact', body: [
        'We may update these terms from time to time. The date at the top shows when they last changed. For any question, write to hello@gate-33.com.',
      ] },
    ],
  },
};

const ar: { privacy: LegalDoc; terms: LegalDoc } = {
  privacy: {
    meta: { title: 'الخصوصية | Gate33 Agency', description: 'كيف تجمع Gate33 Agency المعلومات التي تشاركها عبر موقعها، وكيف تستخدمها وتحميها.' },
    crumb: 'الخصوصية', overline: 'قانوني', title: 'الخصوصية',
    intro: 'توضّح هذه الصفحة بلغة مبسّطة المعلومات التي تجمعها Gate33 Agency عبر هذا الموقع، وسبب جمعها، وكيف نحافظ عليها.',
    other: { text: 'يرد استخدام الموقع والتعامل معنا في', label: 'صفحة الشروط', href: '/ar/terms/' },
    sections: [
      { id: 'who', title: 'من نحن', body: [
        'يُدار هذا الموقع من Gate33 Agency («Gate33» أو «نحن»)، وهي وكالة إبداعية وتسويقية. ولأي سؤال عن هذه الصفحة أو عن معلوماتك، راسلنا على hello@gate-33.com.',
      ] },
      { id: 'collect', title: 'ما الذي نجمعه', body: [
        'لا نجمع إلا ما تختار إرساله إلينا، إضافةً إلى المعلومات التقنية الأساسية التي يتلقاها أي موقع:',
        { list: [
          'نموذجا التواصل وطلب العرض: اسمك وبريدك الإلكتروني، وإن أضفتها، رقم هاتفك واسم جهتك وتفاصيل مشروعك.',
          'صفحة الطلب: البيانات التي تدخلها لطلب باقة أو شرائها.',
          'الرسائل: كل ما ترسله إلينا عبر البريد الإلكتروني أو واتساب أو إنستغرام.',
          'المعلومات التقنية: كأي موقع، قد يسجّل مزوّد الاستضافة بيانات أساسية مثل نوع المتصفح والصفحات المطلوبة، لضمان عمل الموقع وأمانه.',
        ] },
      ] },
      { id: 'use', title: 'كيف نستخدمها', body: [
        { list: [
          'للرد على رسالتك وإعداد عرض السعر.',
          'لتنفيذ العمل الذي تطلبه منا وإدارته.',
          'لإبقاء الموقع عاملاً وآمناً وسهل الاستخدام.',
        ] },
        'لا نبيع معلوماتك، ولا نستخدمها لأغراض لا صلة لها باستفسارك أو مشروعك.',
      ] },
      { id: 'share', title: 'مع من نشاركها', body: [
        'لا نشارك المعلومات إلا مع مزوّدي الخدمات الذين نحتاجهم لتشغيل الموقع وإنجاز عملنا، مثل الاستضافة والبريد الإلكتروني وأدوات التحليل، ومزوّد الدفع عند إتاحة الدفع عبر الموقع. ولا يستخدمونها إلا لتقديم خدماتهم لنا.',
        'وعند الدفع عبر الموقع، يتولى مزوّد الدفع بيانات البطاقة، ولا تطّلع عليها Gate33 ولا تحفظها.',
        'وقد نشارك المعلومات أيضاً إذا اقتضى القانون ذلك.',
      ] },
      { id: 'cookies', title: 'ملفات تعريف الارتباط والأدوات المشابهة', body: [
        'يحتفظ الموقع في متصفحك ببعض الإعدادات الصغيرة طوال زيارتك، مثل معرفة ما إذا عُرضت الحركة الافتتاحية من قبل، ولا تتضمن أي معلومات شخصية.',
        'وإذا استخدمنا أدوات تحليل لفهم طريقة استخدام الزوّار للموقع، فقد تضع ملفات تعريف ارتباط (كوكيز). ويمكنك حظرها أو حذفها من إعدادات متصفحك في أي وقت.',
      ] },
      { id: 'askgate', title: 'اسأل Gate', body: [
        'يساعدك «اسأل Gate» في الوصول إلى الخدمة أو الباقة المناسبة. نرجو عدم مشاركة معلومات شخصية حساسة فيه. وإذا استعان «اسأل Gate» بخدمة ذكاء اصطناعي للإجابة، فيُرسل سؤالك إليها لإعداد الرد فقط.',
      ] },
      { id: 'keep', title: 'مدة الاحتفاظ بها', body: [
        'نحتفظ بمعلوماتك ما دمنا نحتاجها للرد عليك وتنفيذ عملنا، وللاحتفاظ بالسجلات التي يلزمنا الاحتفاظ بها، ثم نحذفها.',
      ] },
      { id: 'security', title: 'الحفاظ عليها', body: [
        'يقتصر الاطلاع على معلوماتك على أعضاء الفريق الذين يحتاجون إليها، ونتخذ خطوات معقولة لحمايتها، علماً بأنه لا توجد وسيلة لإرسال المعلومات أو تخزينها عبر الإنترنت آمنة تماماً.',
      ] },
      { id: 'choices', title: 'خياراتك', body: [
        'يمكنك في أي وقت أن تسألنا عن المعلومات التي نحتفظ بها عنك، أو أن تطلب تصحيحها أو حذفها. راسلنا على hello@gate-33.com، وسنرد عليك في أقرب وقت.',
      ] },
      { id: 'links', title: 'المواقع الأخرى', body: [
        'يتضمن موقعنا روابط إلى مواقع أخرى مثل إنستغرام وواتساب، وتسري سياسات الخصوصية الخاصة بها عند استخدامها.',
      ] },
      { id: 'changes', title: 'تحديث هذه الصفحة', body: [
        'قد نحدّث هذه الصفحة من وقت لآخر، ويبيّن التاريخ في أعلاها موعد آخر تحديث.',
      ] },
    ],
  },
  terms: {
    meta: { title: 'الشروط | Gate33 Agency', description: 'شروط استخدام موقع Gate33 Agency وطلب خدماتها.' },
    crumb: 'الشروط', overline: 'قانوني', title: 'الشروط',
    intro: 'توضّح هذه الشروط كيفية استخدام هذا الموقع وآلية طلب خدماتنا، وباستخدامك الموقع فإنك توافق عليها.',
    other: { text: 'تُعرض كيفية التعامل مع معلوماتك في', label: 'صفحة الخصوصية', href: '/ar/privacy/' },
    sections: [
      { id: 'about', title: 'عن هذه الشروط', body: [
        'يُدار هذا الموقع من Gate33 Agency («Gate33» أو «نحن»). تتناول هذه الشروط استخدام الموقع، ويخضع كل مشروع أيضاً لعرض سعر أو اتفاق مكتوب خاص به، وعند الاختلاف بينهما يُعتمد عرض السعر أو الاتفاق.',
      ] },
      { id: 'site', title: 'المعلومات على الموقع', body: [
        'المعلومات الواردة في الموقع عامة، وتهدف إلى التعريف بخدماتنا. ونحرص على دقتها وتحديثها، لكنها قد تتغير دون إشعار، ولا تُعدّ عرضاً ملزماً.',
      ] },
      { id: 'proposals', title: 'الخدمات وعروض الأسعار', body: [
        'يُحدَّد نطاق المشروع ومخرجاته ومدته وعدد جولات التعديل وسعره في عرض مكتوب قبل بدء أي عمل، ويبدأ العمل بعد موافقتك على العرض.',
      ] },
      { id: 'prices', title: 'الأسعار', body: [
        'الأسعار المعروضة في الموقع أسعار بداية، أو تُحدَّد حسب كل مشروع، وهي غير شاملة ضريبة القيمة المضافة أو أي ضرائب أخرى مطبّقة، وتُعرض بالعملة المحلية لسوقك. والسعر النهائي هو المذكور في عرض السعر المعتمد.',
      ] },
      { id: 'payments', title: 'الدفع والإلغاء', body: [
        'تُحدَّد شروط الدفع في عرض السعر. وعند إتاحة الدفع عبر الموقع، يُعالَج الدفع من خلال مزوّد دفع خارجي.',
        'وفي حال إلغاء المشروع، تُطبَّق الترتيبات الواردة في عرض السعر أو الاتفاق، وتُحتسب عادةً قيمة الأعمال المنجزة والتكاليف الخارجية المدفوعة.',
      ] },
      { id: 'work', title: 'العمل والملكية', body: [
        'تُحدَّد حقوق العمل النهائي في عرض السعر أو الاتفاق، وتنتقل إليك عادةً بعد سداد كامل المستحقات. أما المواد الخاصة بأطراف أخرى، كالخطوط والصور والموسيقى المرخّصة، فتبقى خاضعة لتراخيصها.',
        'ولا نعرض أعمال العملاء ضمن أعمالنا إلا بموافقتهم، ولا نشارك أي مواد سرية.',
      ] },
      { id: 'content', title: 'محتوى الموقع', body: [
        'تصميم الموقع ونصوصه وصوره ومقاطعه مملوكة لـ Gate33 أو مستخدمة بإذن، فنرجو عدم نسخها أو إعادة استخدامها دون موافقتنا الكتابية.',
        'أما أسماء العملاء وشعاراتهم وأعمالهم المعروضة في دراسات الحالة فتعود إلى أصحابها، وترد هنا للتعريف بعملنا.',
      ] },
      { id: 'use', title: 'الاستخدام المسؤول', body: [
        'نرجو استخدام الموقع بصورة مشروعة وبحسن نية، وعدم محاولة تعطيله أو الوصول إلى ما ليس متاحاً للعموم، أو إرسال معلومات ضارة أو مضلّلة.',
      ] },
      { id: 'links', title: 'روابط المواقع الأخرى', body: [
        'يتضمن الموقع روابط إلى مواقع أخرى مثل إنستغرام وواتساب، ولسنا مسؤولين عن محتواها أو طريقة عملها.',
      ] },
      { id: 'liability', title: 'إتاحة الموقع والمسؤولية', body: [
        'نسعى إلى إبقاء الموقع متاحاً وعاملاً، لكن لا يمكننا ضمان خلوّه الدائم من الانقطاع أو الأخطاء. وفي الحدود التي يسمح بها القانون، لا نتحمّل مسؤولية أي خسارة تنتج عن استخدام الموقع أو الاعتماد على معلوماته العامة.',
      ] },
      { id: 'changes', title: 'التحديثات والتواصل', body: [
        'قد نحدّث هذه الشروط من وقت لآخر، ويبيّن التاريخ في أعلاها موعد آخر تحديث. ولأي استفسار، راسلنا على hello@gate-33.com.',
      ] },
    ],
  },
};

// Short consent line for the proposal sheet (Drawer): links to the privacy page in the current language.
export const sheetConsent: Record<Lang, { a: string; link: string; b: string }> = {
  en: { a: 'By sending your brief you agree to the ', link: 'Privacy Policy', b: '.' },
  ar: { a: 'بإرسال موجزك فأنت توافق على ', link: 'سياسة الخصوصية', b: '.' },
};

export const legalDoc = (lang: Lang, kind: 'privacy' | 'terms'): LegalDoc => (lang === 'ar' ? ar : en)[kind];
