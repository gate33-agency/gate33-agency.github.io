// /<lang>/contact/ copy (Stage 5-3). Contact details come from placeholders.ts (confirmed by Shifaa, 19 Nov). No office
// address or map (Shifaa, Q3). Careers and press removed from the topics (Q7). The form sends nothing:
// contact.js validates in the browser and shows the "Preview: messages are not sent yet" confirmation inline.
import type { Lang } from './types';
import { bindAll } from './text';
import { timelines } from './placeholders';
import type { Faq } from './service-pages';

export interface ContactCopy {
  meta: { title: string; description: string };
  crumb: string; overline: string; headline: string; intro: string;
  routesLabel: string;
  routes: { title: string; line: string; action: string }[];
  form: {
    title: string; line: string; optional: string; name: string; email: string; phone: string; phoneHint: string; company: string;
    topic: string; topicPick: string; topics: { value: string; label: string }[]; message: string; messageHint: string;
    consentA: string; privacy: string; consentB: string; submit: string; working: string; noscript: string;
  };
  errors: { name: string; email: string; emailFormat: string; phoneFormat: string; topic: string; message: string; consent: string; summaryOne: string; summaryTwo: string; summaryMany: string };
  done: { title: string; line: string };
  details: { title: string; email: string; phone: string; whatsapp: string; whatsappCta: string; markets: string; hours: string; note: string };
  faqOver: string; faqTitle: string; faq: Faq[];
}

const R = timelines.reply.value;
const en: ContactCopy = {
  meta: {
    title: 'Contact Gate33 | Creative & Marketing Agency',
    description: 'Talk to Gate33 about branding, production, websites, marketing or events. Write to us, ask Gate or send a short brief.',
  },
  crumb: 'Contact',
  overline: 'Contact',
  headline: 'Tell us what you are building.',
  intro: 'Three ways to reach the team: write a short message, use Ask Gate for a quick answer, or send a brief for a proposal. Write in Arabic or English.',
  routesLabel: 'Ways to reach us',
  routes: [
    { title: 'Write to us', line: 'A short message to the team, about a project or anything else.', action: 'Write a message' },
    { title: 'Ask Gate', line: 'Quick answers about our services, packages and how we work.', action: 'Ask Gate' },
    { title: 'Send a brief', line: 'Tell us about the project. We reply with a clear next step and a proposal.', action: 'Request a proposal' },
  ],
  form: {
    title: 'Write to us', line: 'Fields marked * are required.', optional: 'optional',
    name: 'Name', email: 'Email', phone: 'Phone', phoneHint: 'Include the country code.', company: 'Company',
    topic: 'Topic', topicPick: 'Choose a topic',
    topics: [
      { value: 'new-project', label: 'New project' }, { value: 'packages', label: 'Packages' }, { value: 'other', label: 'Other' },
    ],
    message: 'Message', messageHint: 'A few lines are enough: what you need, and roughly when.',
    consentA: 'I agree that Gate33 may use these details to reply to me, as set out in the ', privacy: 'Privacy Policy', consentB: '.',
    submit: 'Send message', working: 'Checking your message…',
    noscript: 'This preview needs JavaScript to check the form. Nothing is sent either way.',
  },
  errors: {
    name: 'Enter your name.', email: 'Enter your email address.', emailFormat: 'Enter an email address like name@company.com.',
    phoneFormat: 'Enter a phone number with the country code, using digits only.', topic: 'Choose a topic.',
    message: 'Write a short message.', consent: 'Agree to the Privacy Policy so we can reply to you.',
    summaryOne: 'One field needs your attention.', summaryTwo: 'Two fields need your attention.', summaryMany: '{n} fields need your attention.',
  },
  done: {
    title: 'Preview: messages are not sent yet',
    line: 'Your message is complete, but this preview does not send or store anything. Once the form is connected, it will reach the team directly.',
  },
  details: { title: 'Details', email: 'Email', phone: 'Phone', whatsapp: 'WhatsApp', whatsappCta: 'Chat on WhatsApp', markets: 'Markets', hours: 'Meetings', note: 'We work with clients remotely. Calls and meetings are arranged after your first message, by email or WhatsApp.' },
  faqOver: 'Questions',
  faqTitle: 'Before you write',
  faq: [
    { q: 'How soon will you reply?', a: `We aim to reply within ${R.en}, with a clear next step.`, sample: true },
    { q: 'What should I include in my message?', a: 'What you need, roughly when, and any links that help. A few lines are enough; we ask the right questions when we reply.' },
    { q: 'Which markets do you work in?', a: 'Our main markets are Israel, the UAE and the GCC, and we work with clients remotely. Projects in other markets are considered depending on their scope.' },
    { q: 'Can I write in Arabic?', a: 'Yes. Write in Arabic or English, and we reply in the same language.' },
    { q: 'What happens after the first message?', a: 'We agree the goal with you, then set out the scope, timeline and price in writing before any work starts.' },
  ],
};

const ar: ContactCopy = {
  meta: {
    title: 'تواصل معنا | Gate33 وكالة إبداعية وتسويقية',
    description: 'تحدّث إلى Gate33 عن الهوية والإنتاج والمواقع والتسويق والفعاليات. راسلنا، أو اسأل Gate، أو أرسل موجز مشروعك.',
  },
  crumb: 'تواصل معنا',
  overline: 'تواصل معنا',
  headline: 'حدّثنا عن مشروعك.',
  intro: 'ثلاث طرق للوصول إلى فريقنا: رسالة قصيرة، أو إجابة سريعة من «اسأل Gate»، أو موجز مشروع نعدّ لك عليه عرض سعر. راسلنا بالعربية أو الإنجليزية.',
  routesLabel: 'طرق التواصل معنا',
  routes: [
    { title: 'راسلنا', line: 'رسالة قصيرة إلى الفريق، عن مشروع أو أي أمر آخر.', action: 'اكتب رسالتك' },
    { title: 'اسأل Gate', line: 'إجابات سريعة عن خدماتنا وباقاتنا وطريقة عملنا.', action: 'اسأل Gate' },
    { title: 'أرسل موجز مشروعك', line: 'حدّثنا عن مشروعك، وسنعود إليك بخطوة تالية واضحة وعرض سعر.', action: 'اطلب عرض سعر' },
  ],
  form: {
    title: 'راسلنا', line: 'الحقول المعلَّمة بـ * مطلوبة.', optional: 'اختياري',
    name: 'الاسم', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', phoneHint: 'أضف رمز الدولة.', company: 'الجهة',
    topic: 'الموضوع', topicPick: 'اختر الموضوع',
    topics: [
      { value: 'new-project', label: 'مشروع جديد' }, { value: 'packages', label: 'الباقات' }, { value: 'other', label: 'موضوع آخر' },
    ],
    message: 'الرسالة', messageHint: 'تكفي أسطر قليلة: ما الذي تحتاجه، وموعده التقريبي.',
    consentA: 'أوافق على أن تستخدم Gate33 هذه البيانات للرد عليّ، وفق ', privacy: 'سياسة الخصوصية', consentB: '.',
    submit: 'أرسل الرسالة', working: 'جارٍ التحقق من رسالتك…',
    noscript: 'تحتاج هذه المعاينة إلى تفعيل JavaScript للتحقق من النموذج، ولا يُرسَل أي شيء في الحالتين.',
  },
  errors: {
    name: 'أدخل اسمك.', email: 'أدخل بريدك الإلكتروني.', emailFormat: 'أدخل بريداً إلكترونياً صحيحاً، مثل name@company.com.',
    phoneFormat: 'أدخل رقم الهاتف بالأرقام مع رمز الدولة.', topic: 'اختر موضوع الرسالة.',
    message: 'اكتب رسالة قصيرة.', consent: 'وافق على سياسة الخصوصية لنتمكّن من الرد عليك.',
    summaryOne: 'هناك حقل واحد يحتاج إلى مراجعة.', summaryTwo: 'هناك حقلان يحتاجان إلى مراجعة.', summaryMany: 'هناك {n} حقول تحتاج إلى مراجعة.',
  },
  done: {
    title: 'معاينة: لا تُرسل الرسائل بعد',
    line: 'اكتملت رسالتك، لكن نسخة المعاينة لا ترسل أي بيانات ولا تحفظها. وبعد تفعيل النموذج، ستصل رسائلك إلى الفريق مباشرة.',
  },
  details: { title: 'بيانات التواصل', email: 'البريد الإلكتروني', phone: 'الهاتف', whatsapp: 'واتساب', whatsappCta: 'راسلنا عبر واتساب', markets: 'الأسواق', hours: 'الاجتماعات', note: 'نعمل مع عملائنا عن بُعد، ونرتّب المكالمات والاجتماعات بعد وصول رسالتك الأولى عبر البريد أو واتساب.' },
  faqOver: 'الأسئلة الشائعة',
  faqTitle: 'قبل أن تراسلنا',
  faq: [
    { q: 'متى تردّون على الرسائل؟', a: `نحرص على الرد خلال ${R.ar}، مع خطوة تالية واضحة.`, sample: true },
    { q: 'ماذا أكتب في رسالتي؟', a: 'ما تحتاجه، وموعده التقريبي، وأي روابط تساعدنا على الفهم. تكفي أسطر قليلة، ونطرح الأسئلة الصحيحة عند الرد.' },
    { q: 'في أي أسواق تعملون؟', a: 'أسواقنا الأساسية إسرائيل والإمارات ودول مجلس التعاون الخليجي، ونعمل مع عملائنا عن بُعد. ويمكن دراسة المشاريع في أسواق أخرى بحسب نطاقها.' },
    { q: 'هل يمكنني المراسلة بالعربية؟', a: 'نعم، راسلنا بالعربية أو الإنجليزية، ونردّ عليك باللغة نفسها.' },
    { q: 'ماذا يحدث بعد الرسالة الأولى؟', a: 'نتّفق معك على الهدف، ثم نحدّد نطاق العمل والجدول الزمني والسعر كتابياً قبل بدء أي عمل.' },
  ],
};

// Headings, labels and questions are bound; running copy, hints, errors and the consent sentence wrap naturally.
const skip = ['meta', 'intro', 'line', 'a', 'messageHint', 'phoneHint', 'errors', 'consentA', 'consentB', 'noscript', 'note', 'working', 'value'];
const bound = { en: bindAll(en, 'en', skip), ar: bindAll(ar, 'ar', skip) };
export const contactPage = (lang: Lang): ContactCopy => bound[lang];
