// Checkout shell (Stage 5-2): /<lang>/checkout/<package>/, /<lang>/checkout/success/, /<lang>/checkout/failed/.
// There is NO payment provider yet (to be chosen with Shifaa). Nothing is sent or charged anywhere: the form is
// validated in the browser and then opens the success page with ?preview=1. No card fields, no third-party scripts.
// PAYMENT_LIVE is the one switch the gateway work flips: while false, every checkout page shows the preview note.
// Legal: no promises beyond "confirmed in your proposal / invoice" (no refund, guarantee or VAT figure is stated).
import type { Lang } from './types';
import { bindAll, tail } from './text';

export const PAYMENT_LIVE = false;

type Opt = { value: string; label: string };
export interface CheckoutCopy {
  meta: { title: string; description: string };
  resultMeta: { success: { title: string; description: string }; failed: { title: string; description: string } };
  crumbPackages: string; crumb: string;
  overline: string; headline: string; intro: string;
  preview: { title: string; line: string };
  summary: { over: string; change: string; includes: string; duration: string; revisions: string; price: string; from: string; vat: string; vatLabel: string; vatValue: string; note: string };
  form: {
    title: string; line: string; required: string; optional: string;
    name: string; email: string; phone: string; phoneHint: string; company: string; country: string; countryPick: string;
    uae: string; gcc: string; other: string; notes: string; notesHint: string; trn: string; trnHint: string;
    consentA: string; terms: string; consentB: string; privacy: string; consentC: string;
  };
  countries: { uae: Opt[]; gcc: Opt[]; other: Opt[] };
  errors: { name: string; email: string; emailFormat: string; phone: string; phoneFormat: string; country: string; trn: string; consent: string; summaryOne: string; summaryTwo: string; summaryMany: string };
  pay: { title: string; line: string; button: string; talk: string; talkLink: string; working: string; noscript: string };
  success: { overline: string; headline: string; intro: string; preview: string; pkgLabel: string; ref: string; refValue: string; stepsTitle: string; steps: { title: string; line: string }[] };
  failed: { overline: string; headline: string; intro: string; preview: string; stepsTitle: string; steps: { title: string; line: string }[]; retry: string; retryAll: string; proposal: string };
  links: { title: string; packages: string; ask: string; contact: string };
}

const en: CheckoutCopy = {
  meta: {
    title: 'Checkout: {pkg} | Gate33 Dubai',
    description: 'Confirm your Gate33 package and your details. Payment is completed on a secure page after confirmation.',
  },
  resultMeta: {
    success: { title: 'Thank you | Gate33 Dubai', description: 'Your Gate33 package is confirmed. Here is what happens next.' },
    failed: { title: 'Payment not completed | Gate33 Dubai', description: 'Your payment was not completed. Try again, or request a proposal and talk to us first.' },
  },
  crumbPackages: 'Packages',
  crumb: 'Checkout',
  overline: 'Checkout',
  headline: '{pkg}', // 13 Nov: the package name is the headline, "Checkout" sits above it (fits a phone without shrinking)
  intro: 'Check your package, add your details, then continue to payment. Your proposal and invoice confirm every detail.',
  preview: { title: 'Preview: payment is not active yet.', line: 'Nothing you enter here is sent or stored, and no payment is taken.' },
  summary: {
    over: 'Your package', change: 'Change package', includes: 'What’s included', duration: 'Typical duration', revisions: 'Revisions',
    price: 'Starting price', from: 'From', vat: 'excl. VAT', vatLabel: 'VAT', vatValue: 'Calculated at payment and confirmed in your invoice',
    note: 'The final scope and timeline are confirmed in your proposal.',
  },
  form: {
    title: 'Your details', line: 'We use these to prepare your proposal and invoice.', required: 'required', optional: 'optional',
    name: 'Full name', email: 'Email', phone: 'Phone', phoneHint: 'Include the country code.',
    company: 'Company', country: 'Country or emirate', countryPick: 'Select', uae: 'United Arab Emirates', gcc: 'Gulf', other: 'Elsewhere',
    notes: 'Project notes', notesHint: 'Anything we should know before we start: deadlines, links, existing assets.',
    trn: 'Tax Registration Number (TRN)', trnHint: '15 digits, if your company is VAT-registered in the UAE.',
    consentA: 'I agree to the ', terms: 'Terms', consentB: ' and the ', privacy: 'Privacy Policy', consentC: '.',
  },
  countries: {
    uae: [
      { value: 'AE-AZ', label: 'Abu Dhabi' }, { value: 'AE-DU', label: 'Dubai' }, { value: 'AE-SH', label: 'Sharjah' },
      { value: 'AE-AJ', label: 'Ajman' }, { value: 'AE-UQ', label: 'Umm Al Quwain' }, { value: 'AE-RK', label: 'Ras Al Khaimah' },
      { value: 'AE-FU', label: 'Fujairah' },
    ],
    gcc: [
      { value: 'SA', label: 'Saudi Arabia' }, { value: 'QA', label: 'Qatar' }, { value: 'KW', label: 'Kuwait' },
      { value: 'BH', label: 'Bahrain' }, { value: 'OM', label: 'Oman' },
    ],
    other: [{ value: 'OTHER', label: 'Another country' }],
  },
  errors: {
    name: 'Enter your full name.', email: 'Enter your email address.', emailFormat: 'Enter an email address like name@company.com.',
    phone: 'Enter your phone number.', phoneFormat: 'Enter a phone number with the country code, using digits only.',
    country: 'Select your country or emirate.', trn: 'A TRN has 15 digits. Check the number, or leave it empty.',
    consent: 'Agree to the Terms and the Privacy Policy to continue.',
    summaryOne: 'One field needs your attention.', summaryTwo: 'Two fields need your attention.', summaryMany: '{n} fields need your attention.',
  },
  pay: {
    title: 'Payment',
    line: 'After you confirm your details, you complete payment on a secure page. Your invoice shows the final amount, with VAT.',
    button: 'Continue to payment', talk: 'Prefer to talk first?', talkLink: 'Request a proposal',
    working: 'Checking your details…', noscript: 'This preview needs JavaScript. You can still request a proposal from the menu.',
  },
  success: {
    overline: 'Confirmed', headline: 'Thank you. Your package is confirmed.',
    intro: 'We have your details and your package. Here is what happens next.',
    preview: 'Preview: this is a sample confirmation. No payment was taken and nothing was sent.',
    pkgLabel: 'Package', ref: 'Reference', refValue: 'G33-000000',
    stepsTitle: 'What happens next',
    steps: [
      { title: 'Confirmation', line: 'You receive an email with your reference and a summary of your package.' },
      { title: 'Kick-off', line: 'We get in touch to book a short kick-off call and gather what we need to start.' },
      { title: 'Proposal and invoice', line: 'Your proposal confirms the scope and timeline. Your invoice confirms the final amount, with VAT.' },
    ],
  },
  failed: {
    overline: 'Payment', headline: 'Your payment was not completed.',
    intro: 'Nothing is confirmed yet. You can try again, or talk to us first.',
    preview: 'Preview: this is a sample page. No payment was attempted.',
    stepsTitle: 'What you can do',
    steps: [
      { title: 'Check the details', line: 'Make sure your card details are correct, or ask your bank whether the payment was blocked.' },
      { title: 'Try again', line: 'Go back to your package and continue to payment once more.' },
      { title: 'Talk to us', line: 'Request a proposal, and we will agree the payment route with you.' },
    ],
    retry: 'Try again', retryAll: 'Choose a package', proposal: 'Request a proposal',
  },
  links: { title: 'Elsewhere', packages: 'All packages', ask: 'Ask Gate', contact: 'Contact us' },
};

const ar: CheckoutCopy = {
  meta: {
    title: 'إتمام الطلب: {pkg} | Gate33 دبي',
    description: 'أكّد باقتك من Gate33 وبياناتك، ثم أتمّ الدفع عبر صفحة آمنة بعد التأكيد.',
  },
  resultMeta: {
    success: { title: 'شكراً لك | Gate33 دبي', description: 'تأكّدت باقتك من Gate33، وإليك الخطوات التالية.' },
    failed: { title: 'لم يكتمل الدفع | Gate33 دبي', description: 'لم تكتمل عملية الدفع. حاول مجدداً، أو اطلب عرض سعر وتحدّث إلينا أولاً.' },
  },
  crumbPackages: 'الباقات',
  crumb: 'إتمام الطلب',
  overline: 'إتمام الطلب',
  headline: '{pkg}',
  intro: 'راجع باقتك وأضف بياناتك، ثم تابع إلى الدفع. ويؤكّد عرض السعر والفاتورة كل التفاصيل.',
  preview: { title: 'معاينة: الدفع غير مفعّل بعد.', line: 'لا يُرسَل أي شيء تُدخله هنا ولا يُحفَظ، ولا يُخصَم أي مبلغ.' },
  summary: {
    over: 'باقتك', change: 'تغيير الباقة', includes: 'ما تتضمّنه', duration: 'المدة المعتادة', revisions: 'التعديلات',
    price: 'السعر يبدأ من', from: 'يبدأ من', vat: 'غير شامل ضريبة القيمة المضافة', vatLabel: 'ضريبة القيمة المضافة', vatValue: 'تُحتسَب عند الدفع وتُؤكَّد في فاتورتك',
    note: 'يؤكّد عرض السعر نطاق العمل والمدة النهائيين.',
  },
  form: {
    title: 'بياناتك', line: 'نستخدمها لإعداد عرض السعر والفاتورة.', required: 'مطلوب', optional: 'اختياري',
    name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', phoneHint: 'أضف رمز الدولة.',
    company: 'الشركة', country: 'الدولة أو الإمارة', countryPick: 'اختر', uae: 'الإمارات العربية المتحدة', gcc: 'الخليج', other: 'خارج الخليج',
    notes: 'ملاحظات عن المشروع', notesHint: 'كل ما ينبغي أن نعرفه قبل البدء: المواعيد، والروابط، والمواد المتوفّرة.',
    trn: 'رقم التسجيل الضريبي (TRN)', trnHint: '15 رقماً، إن كانت شركتك مسجّلة في ضريبة القيمة المضافة في الإمارات.',
    consentA: 'أوافق على ', terms: 'الشروط والأحكام', consentB: ' و', privacy: 'سياسة الخصوصية', consentC: '.',
  },
  countries: {
    uae: [
      { value: 'AE-AZ', label: 'أبوظبي' }, { value: 'AE-DU', label: 'دبي' }, { value: 'AE-SH', label: 'الشارقة' },
      { value: 'AE-AJ', label: 'عجمان' }, { value: 'AE-UQ', label: 'أم القيوين' }, { value: 'AE-RK', label: 'رأس الخيمة' },
      { value: 'AE-FU', label: 'الفجيرة' },
    ],
    gcc: [
      { value: 'SA', label: 'المملكة العربية السعودية' }, { value: 'QA', label: 'قطر' }, { value: 'KW', label: 'الكويت' },
      { value: 'BH', label: 'البحرين' }, { value: 'OM', label: 'عُمان' },
    ],
    other: [{ value: 'OTHER', label: 'دولة أخرى' }],
  },
  errors: {
    name: 'أدخل اسمك الكامل.', email: 'أدخل بريدك الإلكتروني.', emailFormat: 'أدخل بريداً إلكترونياً صحيحاً، مثل name@company.com.',
    phone: 'أدخل رقم هاتفك.', phoneFormat: 'أدخل رقم الهاتف بالأرقام مع رمز الدولة.',
    country: 'اختر الدولة أو الإمارة.', trn: 'يتكوّن رقم التسجيل الضريبي من 15 رقماً. راجع الرقم أو اترك الحقل فارغاً.',
    consent: 'وافق على الشروط والأحكام وسياسة الخصوصية للمتابعة.',
    summaryOne: 'هناك حقل واحد يحتاج إلى مراجعة.', summaryTwo: 'هناك حقلان يحتاجان إلى مراجعة.', summaryMany: 'هناك {n} حقول تحتاج إلى مراجعة.',
  },
  pay: {
    title: 'الدفع',
    line: 'بعد تأكيد بياناتك، تُتمّ الدفع عبر صفحة آمنة، وتُظهر فاتورتك المبلغ النهائي شاملاً الضريبة.',
    button: 'المتابعة إلى الدفع', talk: 'تفضّل الحديث معنا أولاً؟', talkLink: 'اطلب عرض سعر',
    working: 'جارٍ التحقق من بياناتك…', noscript: 'تحتاج هذه المعاينة إلى تفعيل JavaScript، ويمكنك طلب عرض سعر من القائمة.',
  },
  success: {
    overline: 'تمّ التأكيد', headline: 'شكراً لك، تأكّد طلب باقتك.',
    intro: 'وصلتنا بياناتك وباقتك، وإليك الخطوات التالية.',
    preview: 'معاينة: هذا تأكيد تجريبي، فلم يُخصَم أي مبلغ ولم يُرسَل أي شيء.',
    pkgLabel: 'الباقة', ref: 'الرقم المرجعي', refValue: 'G33-000000',
    stepsTitle: 'الخطوات التالية',
    steps: [
      { title: 'رسالة التأكيد', line: 'تصلك رسالة بريد إلكتروني تتضمّن رقمك المرجعي وملخّص باقتك.' },
      { title: 'جلسة الانطلاق', line: 'نتواصل معك لتحديد موعد جلسة انطلاق قصيرة، وجمع ما نحتاج إليه للبدء.' },
      { title: 'عرض السعر والفاتورة', line: 'يؤكّد عرض السعر نطاق العمل والمدة، وتؤكّد الفاتورة المبلغ النهائي شاملاً الضريبة.' },
    ],
  },
  failed: {
    overline: 'الدفع', headline: 'لم تكتمل عملية الدفع.',
    intro: 'لم يُؤكَّد أي شيء بعد. يمكنك المحاولة مجدداً، أو التحدّث إلينا أولاً.',
    preview: 'معاينة: هذه صفحة تجريبية، ولم تجرِ أي محاولة دفع.',
    stepsTitle: 'ما يمكنك فعله',
    steps: [
      { title: 'راجع البيانات', line: 'تأكّد من صحة بيانات بطاقتك، أو اسأل مصرفك إن كان قد أوقف عملية الدفع.' },
      { title: 'حاول مجدداً', line: 'عُد إلى باقتك وتابع إلى الدفع مرة أخرى.' },
      { title: 'تحدّث إلينا', line: 'اطلب عرض سعر، وسنتّفق معك على طريقة الدفع المناسبة.' },
    ],
    retry: 'حاول مجدداً', retryAll: 'اختر باقة', proposal: 'اطلب عرض سعر',
  },
  links: { title: 'روابط أخرى', packages: 'كل الباقات', ask: 'اسأل Gate', contact: 'تواصل معنا' },
};

// Headings, labels and buttons are bound (no short word at a line end); running copy wraps naturally.
const skip = ['meta', 'resultMeta', 'intro', 'line', 'notesHint', 'trnHint', 'phoneHint', 'vatValue', 'note', 'errors', 'countries', 'consentA', 'consentB', 'consentC', 'preview', 'refValue', 'noscript'];
const bound = { en: bindAll(en, 'en', skip), ar: bindAll(ar, 'ar', skip) };
export const checkoutCopy = (lang: Lang): CheckoutCopy => bound[lang];
/** Fills {pkg} in a bound string (the last two words stay together). */
export const withPkg = (s: string, name: string) => tail(s.replace('{pkg}', name));
