// /<lang>/privacy/ and /<lang>/terms/ copy (Stage 5-4). SAMPLE legal text: it describes only what the site really does today
// and names, as "to be confirmed by Gate33", everything that is not decided yet. It never states a law, court, retention
// period, refund policy, company registration, licence number or address as fact. Replace the whole text with the approved
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

// {{TODO: set to the date Gate33 approves the final text; the "Last updated" line stays hidden while this is null}}
export const LEGAL_UPDATED: Record<Lang, string> | null = null;

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
    meta: { title: 'Privacy | Gate33 Agency', description: 'How the Gate33 website handles information today, and what Gate33 will confirm before launch. Sample text.' },
    crumb: 'Privacy', overline: 'Legal', title: 'Privacy',
    intro: 'This page explains, in plain language, what this website does with information today. It is a sample structure: the parts Gate33 has not decided yet are marked as to be confirmed.',
    other: { text: 'Using the site and ordering are covered in the', label: 'Terms', href: '/en/terms/' },
    sections: [
      { id: 'about', title: 'About this text', body: [
        'This is sample text that shows how Gate33’s privacy information will be laid out. It will be replaced by the legal text Gate33 approves before the website is published.',
        'Until then, read it as a description of how this preview behaves, not as a statement of Gate33’s legal obligations.',
      ] },
      { id: 'who', title: 'Who is responsible', body: [
        'The website belongs to Gate33 Agency. The legal name of the company, its registration details and its postal address are to be confirmed by Gate33.',
      ] },
      { id: 'today', title: 'What the site does today', body: [
        'In its current preview state the site is deliberately simple:',
        { list: [
          'It sets no cookies of its own.',
          'It has no analytics or tracking tools.',
          'It does not process payments.',
          'Its forms (contact, proposal request and checkout) check what you type and show a preview message. Nothing is sent and nothing is saved.',
          'Ask Gate replies are generated on the page itself from the site’s own content, by fixed rules. What you type to Ask Gate is not sent anywhere and is not stored.',
          'Your browser’s session storage keeps two small flags for the length of your visit (that the welcome animation was shown and that the Ask Gate hint was shown). They hold no personal information and are not sent to anyone.',
        ] },
      ] },
      { id: 'later', title: 'Information you may share later', body: [
        'Once the forms are connected, the details you choose to enter (such as your name, email, company, phone number and a description of your project) would be used to reply to you and to prepare a proposal.',
        'Which service receives and stores these messages, and where, is to be confirmed by Gate33.',
      ] },
      { id: 'services', title: 'Services we may add', body: [
        'Gate33 may later add a payment provider, analytics and a message-handling service. None of them is active today. Each is to be confirmed by Gate33, and this text will be updated before any of them goes live.',
      ] },
      { id: 'keep', title: 'How long information is kept', body: [
        'Retention periods are to be confirmed by Gate33.',
      ] },
      { id: 'choices', title: 'Your choices and questions', body: [
        'If you have a question about your information, write to the email address shown on the Contact page. How requests are handled, and which rights apply to you under the law that applies, are to be confirmed by Gate33.',
      ] },
      { id: 'changes', title: 'Changes to this text', body: [
        'When Gate33 approves its final text, this page will be replaced and the date of the last update will be shown at the top.',
      ] },
    ],
  },
  terms: {
    meta: { title: 'Terms | Gate33 Agency', description: 'How the Gate33 website and its services are offered, and what Gate33 will confirm before launch. Sample text.' },
    crumb: 'Terms', overline: 'Legal', title: 'Terms',
    intro: 'This page explains, in plain language, how this website and Gate33’s services are offered. It is a sample structure: the parts Gate33 has not decided yet are marked as to be confirmed.',
    other: { text: 'How information is handled is covered in the', label: 'Privacy page', href: '/en/privacy/' },
    sections: [
      { id: 'about', title: 'About this text', body: [
        'This is sample text that shows how Gate33’s terms will be laid out. It will be replaced by the legal text Gate33 approves before the website is published.',
        'Until then, read it as a description of how this preview works, not as a binding agreement.',
      ] },
      { id: 'site', title: 'Using this site', body: [
        'The site presents Gate33’s services, work and packages. The information on it is general. While the site is a preview, prices, numbers, testimonials and some examples are samples and are labelled as such.',
      ] },
      { id: 'proposals', title: 'Services and\u00A0proposals', body: [
        'Packages show an indicative “from” price. The scope, timeline, number of revision rounds and payment terms of a project are set out in a written proposal and agreed with you before work begins.',
      ] },
      { id: 'ordering', title: 'Ordering online', body: [
        'The Buy now button opens a checkout preview. In the preview no payment is taken and no order is created. How online payment will work, and which provider will process it, are to be confirmed by Gate33.',
      ] },
      { id: 'payments', title: 'Payments, refunds and cancellation', body: [
        'The payment schedule, the treatment of VAT, and the approach to cancellation and refunds are to be confirmed by Gate33.',
      ] },
      { id: 'work', title: 'Work, files and ownership', body: [
        'Who owns the final work, when rights pass to the client, and whether Gate33 may show a project in its portfolio are to be confirmed by Gate33 and set out in each proposal or agreement.',
      ] },
      { id: 'names', title: 'Names and\u00A0brands shown', body: [
        'Case studies and logos on this site show work and names of other organisations. Those names and marks belong to their respective owners and appear here to describe Gate33’s work.',
      ] },
      { id: 'use', title: 'Responsible use', body: [
        'Please use the site in good faith. Do not try to disrupt it, to reach parts that are not public, or to copy its content as your own.',
      ] },
      { id: 'liability', title: 'Responsibility and limits', body: [
        'The extent of Gate33’s responsibility, and any limits to it, are to be confirmed by Gate33.',
      ] },
      { id: 'law', title: 'Governing law and disputes', body: [
        'The governing law, the place where disputes are resolved and how they are handled are to be confirmed by Gate33.',
      ] },
      { id: 'changes', title: 'Changes and contact', body: [
        'When Gate33 approves its final text, this page will be replaced and the date of the last update will be shown at the top. Questions can be sent to the email address shown on the Contact page.',
      ] },
    ],
  },
};

const ar: { privacy: LegalDoc; terms: LegalDoc } = {
  privacy: {
    meta: { title: 'الخصوصية | Gate33 Agency', description: 'كيف يتعامل موقع Gate33 مع المعلومات اليوم، وما ستؤكده Gate33 قبل الإطلاق. نص تجريبي.' },
    crumb: 'الخصوصية', overline: 'قانوني', title: 'الخصوصية',
    intro: 'توضّح هذه الصفحة بلغة مبسّطة ما يفعله هذا الموقع بالمعلومات اليوم. وهي هيكل تجريبي، وما لم تحسمه Gate33 بعد مُعلَّم بعبارة «قيد التأكيد».',
    other: { text: 'يرد استخدام الموقع والطلب عبره في', label: 'صفحة الشروط', href: '/ar/terms/' },
    sections: [
      { id: 'about', title: 'عن هذا النص', body: [
        'هذا نص تجريبي يبيّن كيف ستُعرض معلومات الخصوصية الخاصة بـ Gate33، وسيُستبدل بالنص القانوني الذي تعتمده Gate33 قبل نشر الموقع.',
        'وإلى ذلك الحين يُقرأ بوصفه وصفاً لما تفعله هذه النسخة التجريبية، لا بياناً بالتزامات Gate33 القانونية.',
      ] },
      { id: 'who', title: 'الجهة المسؤولة', body: [
        'هذا الموقع يخص Gate33 Agency. أما الاسم القانوني للشركة وبيانات تسجيلها وعنوانها البريدي فهي قيد التأكيد من Gate33.',
      ] },
      { id: 'today', title: 'ما يفعله الموقع اليوم', body: [
        'الموقع في نسخته التجريبية الحالية بسيط عن قصد:',
        { list: [
          'لا يضع ملفات تعريف ارتباط (كوكيز) خاصة به.',
          'لا يستخدم أدوات تحليل أو تتبّع.',
          'لا يعالج أي مدفوعات.',
          'تتحقق نماذجه (التواصل وطلب العرض والدفع) مما تكتبه وتعرض رسالة معاينة، دون إرسال شيء أو حفظه.',
          'تُولَّد ردود «اسأل Gate» داخل الصفحة نفسها من محتوى الموقع وفق قواعد ثابتة، وما تكتبه فيها لا يُرسَل إلى أي جهة ولا يُحفظ.',
          'يحتفظ المتصفح، عبر ذاكرة الجلسة، بإشارتين صغيرتين طوال زيارتك فقط (عرض الحركة الافتتاحية وعرض تلميح «اسأل Gate»)، ولا تتضمنان أي معلومات شخصية ولا تُرسَلان إلى أحد.',
        ] },
      ] },
      { id: 'later', title: 'معلومات قد\u00A0تقدّمها لاحقاً', body: [
        'متى جرى تفعيل النماذج، ستُستخدم البيانات التي تختار إدخالها (كالاسم والبريد الإلكتروني والجهة ورقم الهاتف ووصف المشروع) للرد عليك وإعداد عرض مناسب.',
        'أما الخدمة التي ستستقبل هذه الرسائل وتحفظها، ومكان حفظها، فهما قيد التأكيد من Gate33.',
      ] },
      { id: 'services', title: 'خدمات قد تُضاف', body: [
        'قد تضيف Gate33 لاحقاً مزوّد دفع وأدوات تحليل وخدمة لمعالجة الرسائل. لا شيء من ذلك مفعَّل اليوم، وكلٌّ منها قيد التأكيد من Gate33، وسيُحدَّث هذا النص قبل تفعيل أيٍّ منها.',
      ] },
      { id: 'keep', title: 'مدة الاحتفاظ\u00A0بالمعلومات', body: [
        'مُدد الاحتفاظ قيد التأكيد من Gate33.',
      ] },
      { id: 'choices', title: 'خياراتك واستفساراتك', body: [
        'إن كان لديك سؤال عن معلوماتك، فراسلنا على البريد الإلكتروني المعروض في صفحة التواصل. وآلية التعامل مع الطلبات، والحقوق التي تنطبق عليك بموجب القانون الساري، قيد التأكيد من Gate33.',
      ] },
      { id: 'changes', title: 'تعديل هذا النص', body: [
        'عندما تعتمد Gate33 نصّها النهائي ستُستبدل هذه الصفحة، وسيظهر تاريخ آخر تحديث في أعلاها.',
      ] },
    ],
  },
  terms: {
    meta: { title: 'الشروط | Gate33 Agency', description: 'كيف يُقدَّم موقع Gate33 وخدماتها، وما ستؤكده Gate33 قبل الإطلاق. نص تجريبي.' },
    crumb: 'الشروط', overline: 'قانوني', title: 'الشروط',
    intro: 'توضّح هذه الصفحة بلغة مبسّطة كيف يُقدَّم هذا الموقع وتُقدَّم خدمات Gate33. وهي هيكل تجريبي، وما لم تحسمه Gate33 بعد مُعلَّم بعبارة «قيد التأكيد».',
    other: { text: 'تُعرض كيفية التعامل مع المعلومات في', label: 'صفحة الخصوصية', href: '/ar/privacy/' },
    sections: [
      { id: 'about', title: 'عن هذا النص', body: [
        'هذا نص تجريبي يبيّن كيف ستُعرض شروط Gate33، وسيُستبدل بالنص القانوني الذي تعتمده Gate33 قبل نشر الموقع.',
        'وإلى ذلك الحين يُقرأ بوصفه وصفاً لآلية عمل هذه النسخة التجريبية، لا اتفاقاً ملزماً.',
      ] },
      { id: 'site', title: 'استخدام الموقع', body: [
        'يعرض الموقع خدمات Gate33 وأعمالها وباقاتها، والمعلومات الواردة فيه عامة. وما دام الموقع نسخة تجريبية، فإن الأسعار والأرقام وآراء العملاء وبعض الأمثلة نماذج تجريبية، ومُعلَّمة بذلك.',
      ] },
      { id: 'proposals', title: 'الخدمات والعروض', body: [
        'تعرض الباقات سعراً استرشادياً يبدأ من مبلغ معيّن. أما نطاق المشروع ومدته وعدد جولات التعديل وشروط الدفع، فتُحدَّد في عرض مكتوب يُتفق عليه معك قبل بدء العمل.',
      ] },
      { id: 'ordering', title: 'الطلب عبر الموقع', body: [
        'يفتح زر «اشترِ الآن» معاينةً لصفحة الدفع. وفي هذه المعاينة لا يُحصَّل أي مبلغ ولا يُنشأ أي طلب. أما آلية الدفع عبر الموقع والمزوّد الذي سيعالجه فهما قيد التأكيد من Gate33.',
      ] },
      { id: 'payments', title: 'الدفع والاسترداد والإلغاء', body: [
        'جدول الدفعات، ومعاملة ضريبة القيمة المضافة، وسياسة الإلغاء والاسترداد، كلها قيد التأكيد من Gate33.',
      ] },
      { id: 'work', title: 'العمل والملفات والملكية', body: [
        'ملكية العمل النهائي، ووقت انتقال الحقوق إلى العميل، وإمكان عرض Gate33 للمشروع ضمن أعمالها، كلها قيد التأكيد من Gate33، وتُحدَّد في كل عرض أو اتفاق.',
      ] },
      { id: 'names', title: 'الأسماء والعلامات\u00A0المعروضة', body: [
        'تعرض دراسات الحالة والشعارات في هذا الموقع أعمالاً وأسماء لجهات أخرى. وتعود هذه الأسماء والعلامات إلى أصحابها، وترد هنا لوصف أعمال Gate33.',
      ] },
      { id: 'use', title: 'الاستخدام المسؤول', body: [
        'نرجو استخدام الموقع بحسن نية، وعدم محاولة تعطيله أو الوصول إلى ما ليس متاحاً للعموم أو نسخ محتواه ونسبته إلى غير أصحابه.',
      ] },
      { id: 'liability', title: 'المسؤولية وحدودها', body: [
        'نطاق مسؤولية Gate33 وما قد يرد عليه من حدود قيد التأكيد من Gate33.',
      ] },
      { id: 'law', title: 'القانون الواجب التطبيق والنزاعات', body: [
        'القانون الواجب التطبيق، وجهة النظر في النزاعات وآلية معالجتها، قيد التأكيد من Gate33.',
      ] },
      { id: 'changes', title: 'التعديلات والتواصل', body: [
        'عندما تعتمد Gate33 نصّها النهائي ستُستبدل هذه الصفحة، وسيظهر تاريخ آخر تحديث في أعلاها. ويمكن إرسال الاستفسارات إلى البريد الإلكتروني المعروض في صفحة التواصل.',
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
