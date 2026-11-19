// /<lang>/privacy/ and /<lang>/terms/ copy (Stage 5-4). SAMPLE legal text: it describes what the site really does today.
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
        'This is sample text. It describes how this preview behaves today and the approach Gate33 proposes once the site is live.',
        'The final wording will be reviewed by a lawyer in Israel who specialises in privacy and e-commerce, with a further review in the UAE or the GCC where the site makes contracts or takes payments there. Until then, read it as a description, not as a statement of Gate33’s legal obligations.',
      ] },
      { id: 'who', title: 'Who is responsible', body: [
        'The website belongs to Gate33 Agency, the name the agency trades under. Its registered legal name and registration details will be added from its official documents before the site is published.',
        'Gate33 works with clients remotely and does not publish an office address. The contact details required by law will be added here once the text has been reviewed.',
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
        'Messages from the contact and proposal forms will go to the Gate33 team’s mailbox, gate33.adv@gmail.com. Access is limited to the team members who handle your enquiry.',
      ] },
      { id: 'services', title: 'Services we may add', body: [
        'Gate33 plans to connect a payment provider, Google Analytics and Search Console, and an AI service that lets Ask Gate answer questions. None of them is active today. This text will name each one, and what it receives, before it goes live.',
      ] },
      { id: 'keep', title: 'How long information is kept', body: [
        'Proposed: enquiries that are no longer active are deleted after 12 months, unless a legal or contractual reason requires Gate33 to keep them for longer.',
      ] },
      { id: 'choices', title: 'Your choices and questions', body: [
        'If you have a question about your information, or want it corrected or deleted, write to the email address shown on the Contact page. The rights that apply to you depend on the law that applies, and will be set out here after the legal review.',
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
        'This is sample text. It describes how this preview works today and the terms Gate33 proposes for its projects.',
        'The final wording will be reviewed by Gate33’s lawyer before the site is published. Until then, read it as a description, not as a binding agreement. Your signed proposal or contract always takes precedence.',
      ] },
      { id: 'site', title: 'Using this site', body: [
        'The site presents Gate33’s services, work and packages. The information on it is general. While the site is a preview, prices, numbers, testimonials and some examples are samples and are labelled as such.',
      ] },
      { id: 'proposals', title: 'Services and\u00A0proposals', body: [
        'Packages and services show an indicative starting price or are quoted per project. Prices exclude VAT and any other applicable taxes, and are shown in the local currency (shekels in Israel, dirhams in the UAE and the GCC), based on a US dollar reference.',
        'The scope, timeline, number of revision rounds and payment terms of a project are set out in a written proposal and agreed with you before work begins.',
      ] },
      { id: 'ordering', title: 'Ordering online', body: [
        'The Buy now button opens a checkout preview. In the preview no payment is taken and no order is created. How online payment will work, and which provider will process it, are to be confirmed by Gate33.',
      ] },
      { id: 'payments', title: 'Payments, refunds and cancellation', body: [
        'Proposed payment terms: for smaller projects, 50% when work starts and 50% before the final files are delivered. Larger projects are paid monthly or by milestone. Either way, the schedule is stated clearly in the approved proposal and contract.',
        'Proposed approach to cancellation and refunds: they are handled under the signed proposal and the law that applies. Work already completed, and third-party costs that cannot be refunded, are charged.',
      ] },
      { id: 'work', title: 'Work, files and ownership', body: [
        'Proposed: once everything due has been paid, the client receives the rights to the approved final deliverables, subject to any third-party licences (such as fonts, stock images or music).',
        'Gate33 shows a project in its portfolio only with the client’s consent, and never shows confidential material.',
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
        'Proposed: Israeli law and the competent courts in Israel, for work by Gate33 as registered in Israel. Where a project in the UAE or the GCC has a different contracting entity, or local rules that must apply, the jurisdiction is set in the client’s contract.',
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
        'هذا نص تجريبي يصف ما تفعله هذه النسخة التجريبية اليوم، والنهج الذي تقترحه Gate33 بعد إطلاق الموقع.',
        'وستُراجَع الصيغة النهائية لدى محامٍ في إسرائيل مختص بالخصوصية والتجارة الإلكترونية، مع مراجعة إضافية في الإمارات أو دول الخليج إذا أبرم الموقع عقوداً أو عالج مدفوعات هناك. وإلى ذلك الحين يُقرأ هذا النص بوصفه وصفاً، لا بياناً بالتزامات Gate33 القانونية.',
      ] },
      { id: 'who', title: 'الجهة المسؤولة', body: [
        'هذا الموقع يخص Gate33 Agency، وهو الاسم التجاري للوكالة. وسيُضاف الاسم القانوني المسجّل وبيانات التسجيل من المستندات الرسمية قبل نشر الموقع.',
        'تعمل Gate33 مع عملائها عن بُعد، ولا تنشر عنوان مكتب. وستُضاف بيانات التواصل التي يتطلبها القانون هنا بعد مراجعة النص.',
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
        'وستصل رسائل نموذجي التواصل وطلب العرض إلى بريد فريق Gate33: gate33.adv@gmail.com، ويقتصر الاطلاع عليها على أعضاء الفريق المعنيين باستفسارك.',
      ] },
      { id: 'services', title: 'خدمات قد تُضاف', body: [
        'تعتزم Gate33 ربط الموقع بمزوّد دفع، وبخدمتي Google Analytics وSearch Console، وبخدمة ذكاء اصطناعي تتيح لـ«اسأل Gate» الإجابة عن الأسئلة. لا شيء من ذلك مفعَّل اليوم، وسيذكر هذا النص كل خدمة وما تتلقاه من بيانات قبل تفعيلها.',
      ] },
      { id: 'keep', title: 'مدة الاحتفاظ\u00A0بالمعلومات', body: [
        'المقترح: تُحذف بيانات الاستفسارات غير النشطة بعد 12 شهراً، ما لم يستلزم سبب قانوني أو تعاقدي الاحتفاظ بها مدة أطول.',
      ] },
      { id: 'choices', title: 'خياراتك واستفساراتك', body: [
        'إن كان لديك سؤال عن معلوماتك، أو أردت تصحيحها أو حذفها، فراسلنا على البريد الإلكتروني المعروض في صفحة التواصل. وتتوقف الحقوق التي تنطبق عليك على القانون الساري، وستُبيَّن هنا بعد المراجعة القانونية.',
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
        'هذا نص تجريبي يصف آلية عمل هذه النسخة التجريبية اليوم، والشروط التي تقترحها Gate33 لمشاريعها.',
        'وسيُراجع المستشار القانوني لـ Gate33 الصيغة النهائية قبل نشر الموقع. وإلى ذلك الحين يُقرأ هذا النص بوصفه وصفاً، لا اتفاقاً ملزماً، ويُقدَّم عليه دائماً عرض السعر أو العقد الموقّع معك.',
      ] },
      { id: 'site', title: 'استخدام الموقع', body: [
        'يعرض الموقع خدمات Gate33 وأعمالها وباقاتها، والمعلومات الواردة فيه عامة. وما دام الموقع نسخة تجريبية، فإن الأسعار والأرقام وآراء العملاء وبعض الأمثلة نماذج تجريبية، ومُعلَّمة بذلك.',
      ] },
      { id: 'proposals', title: 'الخدمات والعروض', body: [
        'تعرض الباقات والخدمات سعراً استرشادياً يبدأ من مبلغ معيّن، أو تُسعَّر حسب كل مشروع. والأسعار غير شاملة ضريبة القيمة المضافة أو الضرائب المطبّقة، وتُعرض بالعملة المحلية (الشيكل في إسرائيل، والدرهم في الإمارات ودول الخليج) استناداً إلى سعر مرجعي بالدولار الأمريكي.',
        'أما نطاق المشروع ومدته وعدد جولات التعديل وشروط الدفع، فتُحدَّد في عرض مكتوب يُتفق عليه معك قبل بدء العمل.',
      ] },
      { id: 'ordering', title: 'الطلب عبر الموقع', body: [
        'يفتح زر «اشترِ الآن» معاينةً لصفحة الدفع. وفي هذه المعاينة لا يُحصَّل أي مبلغ ولا يُنشأ أي طلب. أما آلية الدفع عبر الموقع والمزوّد الذي سيعالجه فهما قيد التأكيد من Gate33.',
      ] },
      { id: 'payments', title: 'الدفع والاسترداد والإلغاء', body: [
        'شروط الدفع المقترحة: في المشاريع الصغيرة، 50% عند البدء و50% قبل تسليم الملفات النهائية. أما المشاريع الكبيرة فتُقسَّم دفعاتها شهرياً أو على مراحل. وفي الحالتين يُذكر الجدول بوضوح في عرض السعر والعقد المعتمدين.',
        'النهج المقترح للإلغاء والاسترداد: يُعالَجان وفق عرض السعر الموقّع والقانون الساري، وتُحتسب قيمة الأعمال المنجزة والتكاليف الخارجية غير القابلة للاسترداد.',
      ] },
      { id: 'work', title: 'العمل والملفات والملكية', body: [
        'المقترح: يحصل العميل على حقوق المخرجات النهائية المعتمدة بعد سداد كامل المستحقات، مع مراعاة تراخيص الأطراف الثالثة (كالخطوط والصور والموسيقى المرخّصة).',
        'ولا تعرض Gate33 أي مشروع ضمن أعمالها إلا بموافقة العميل، ولا تعرض المواد السرية مطلقاً.',
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
        'المقترح: القانون الإسرائيلي والمحاكم المختصة في إسرائيل، لأعمال Gate33 المسجّلة في إسرائيل. وإذا كان لمشروع في الإمارات أو دول الخليج كيان متعاقد مختلف، أو أحكام محلية واجبة التطبيق، فيُحدَّد الاختصاص في عقد العميل.',
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
