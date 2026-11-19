// Ask Gate (Stage 3.6): every string the assistant shows, EN + AR, plus the facts its mock replies are allowed to use.
// Facts come only from services.ts, work.ts and the packages copy in home.<lang>.ts. Nothing here invents a price,
// client, timeline or claim. Arabic = formal MSA (premium voice, never colloquial), Western digits.
import { services } from './services';
import { cases } from './work';
import en from './home.en';
import ar from './home.ar';
import type { Lang } from './types';
import { SAMPLE, sampleLabel, packages as pkgSamples, quoteLabel, quoteNote, ils } from './placeholders';

const copy = {
  en: {
    launcher: 'Ask Gate, the Gate33 AI assistant',
    closeLauncher: 'Close Ask Gate',
    teaser: 'Ask Gate anything',
    name: 'Gate',
    sub: 'Gate33 AI assistant',
    online: 'Online',
    close: 'Close',
    title: 'Chat with Gate',
    typing: 'Gate is typing…',
    you: 'You',
    greeting: "Hi, I'm Gate. Tell me what you're building and I'll point you to the right service, package or person.",
    chips: [
      { intent: 'services', text: 'What can Gate33 do for me?' },
      { intent: 'packages', text: 'Help me choose a package' },
      { intent: 'work', text: 'Show me your work' },
      { intent: 'person', text: 'Talk to a person' },
    ],
    placeholder: 'Type your question…',
    send: 'Send',
    routes: { brief: 'Request a proposal', call: 'Arrange a call', whatsapp: 'WhatsApp' },
    privacy: "Gate may make mistakes. Don't share sensitive information.",
    replies: {
      services: 'Gate33 offers seven services, all run by one team. Pick the one closest to what you need:',
      service: 'That sits within {name}. {promise} It covers:',
      packages: 'We offer four packages: three with a fixed scope that you can buy online, and Content Production, quoted per project. Prices are being finalised. This is our most popular one:',
      package: 'Here is {name}, {line}',
      otherPackages: 'Compare the others:',
      work: 'Here are two projects from our portfolio:',
      workFilm: 'Here are two of our films and motion pieces:',
      person: "Of course. Choose the route that suits you and the team will take it from there.",
      hello: 'Hello, good to meet you. What are you working on?',
      thanks: "You're welcome. Is there anything else I can help with?",
      fallback: "I don't have a confirmed answer to that yet, and I'd rather not guess. The team can answer it properly:",
    },
    viewService: 'Explore',
    viewPackage: 'View package',
    viewCase: 'View case study',
    allWork: 'All work',
    from: 'From AED —',
  },
  ar: {
    launcher: 'اسأل Gate، المساعد الذكي لـGate33',
    closeLauncher: 'أغلق «اسأل Gate»',
    teaser: 'اسأل Gate عمّا تريد',
    name: 'Gate',
    sub: 'مساعد Gate33 الذكي',
    online: 'متصل الآن',
    close: 'إغلاق',
    title: 'محادثة مع Gate',
    typing: 'Gate يكتب الآن…',
    you: 'أنت',
    greeting: 'أهلاً بك، أنا Gate. حدّثني عن مشروعك، وسأرشدك إلى الخدمة الأنسب، أو الباقة الملائمة، أو الشخص المناسب من فريقنا.',
    chips: [
      { intent: 'services', text: 'ما الذي يمكن أن تقدّمه Gate33 لي؟' },
      { intent: 'packages', text: 'ساعدني في اختيار الباقة المناسبة' },
      { intent: 'work', text: 'اعرض لي نماذج من أعمالكم' },
      { intent: 'person', text: 'أودّ التحدث إلى أحد أعضاء الفريق' },
    ],
    placeholder: 'اكتب سؤالك هنا…',
    send: 'إرسال',
    routes: { brief: 'اطلب عرض سعر', call: 'رتّب مكالمة', whatsapp: 'واتساب' },
    privacy: 'قد يخطئ Gate أحياناً، فلا تشارك أي معلومات حساسة.',
    replies: {
      services: 'تقدّم Gate33 سبع خدمات يتولّاها فريق واحد. اختر أقربها إلى ما تحتاجه:',
      service: 'يندرج ذلك ضمن خدمة {name}. {promise} وتشمل:',
      packages: 'نقدّم أربع باقات: ثلاث بنطاق عمل محدّد تُشترى عبر الإنترنت، وإنتاج المحتوى الذي يُسعَّر حسب نطاق كل مشروع. والأسعار قيد الاعتماد حالياً، وهذه أكثرها طلباً:',
      package: 'إليك باقة {name}: {line}',
      otherPackages: 'قارن ببقية الباقات:',
      work: 'إليك مشروعين من أعمالنا:',
      workFilm: 'إليك نموذجين من أفلامنا وأعمال الموشن:',
      person: 'بكل سرور. اختر الطريقة التي تناسبك، وسيتولّى فريقنا المتابعة معك.',
      hello: 'أهلاً وسهلاً بك. ما الذي تعمل عليه؟',
      thanks: 'على الرحب والسعة. هل من أمر آخر أساعدك فيه؟',
      fallback: 'لا تتوفّر لديّ إجابة مؤكّدة عن ذلك بعد، ولا أودّ أن أخمّن. يستطيع فريقنا أن يجيبك بدقّة:',
    },
    viewService: 'استكشف',
    viewPackage: 'اطّلع على الباقة',
    viewCase: 'اطّلع على دراسة الحالة',
    allWork: 'كل الأعمال',
    from: 'تبدأ من — درهم',
  },
};

// Keyword map for the rule-based mock (normalised: lower case, Arabic hamza/taa marbuta/alef maqsura folded, no diacritics).
const svcKeys: Record<string, string[]> = {
  'ai-search-visibility': ['ai search', 'chatgpt', 'seo', 'aeo', 'gemini', 'perplexity', 'visibility', 'ظهور', 'محركات البحث', 'شات جي بي تي', 'البحث'],
  'branding-creative-design': ['brand', 'logo', 'identity', 'naming', 'packaging', 'design', 'هويه', 'شعار', 'لوجو', 'تسميه', 'عبوات', 'تغليف', 'تصميم', 'علامه'],
  'creative-production': ['film', 'video', 'photo', 'reel', 'commercial', 'shoot', 'motion', 'فيلم', 'فيديو', 'تصوير', 'ريلز', 'اعلان تلفزيوني', 'موشن', 'صور'],
  'web-apps-business-systems': ['website', 'web', 'site', 'app', 'store', 'shopify', 'ecommerce', 'e-commerce', 'system', 'موقع', 'تطبيق', 'متجر', 'شوبيفاي', 'نظام', 'انظمه'],
  'digital-marketing-growth': ['marketing', 'ads', 'advert', 'social', 'growth', 'campaign', 'instagram', 'tiktok', 'تسويق', 'اعلان', 'اعلانات', 'حمله', 'نمو', 'سوشيال', 'تواصل اجتماعي'],
  'product-development-sourcing': ['product development', 'sourcing', 'manufactur', 'supplier', 'factory', 'تطوير منتج', 'تصنيع', 'مورد', 'موردين', 'مصنع', 'منتج'],
  'events-brand-experiences': ['event', 'exhibition', 'activation', 'booth', 'launch event', 'فعاليه', 'فعاليات', 'معرض', 'معارض', 'تفعيل', 'جناح'],
};
const intentKeys = {
  person: ['person', 'human', 'someone', 'team', 'talk', 'speak', 'call', 'whatsapp', 'contact', 'meeting', 'شخص', 'فريق', 'تحدث', 'اتحدث', 'اكلم', 'مكالمه', 'اتصال', 'واتساب', 'تواصل معكم', 'موظف', 'اجتماع'],
  packages: ['package', 'price', 'pricing', 'cost', 'budget', 'how much', 'باقه', 'باقات', 'سعر', 'اسعار', 'تكلفه', 'كم يكلف', 'ميزانيه'],
  work: ['work', 'portfolio', 'case', 'project', 'example', 'client', 'اعمال', 'اعمالكم', 'مشاريع', 'مشروع', 'نماذج', 'عملاء', 'سابقه'],
  services: ['service', 'what can', 'what do', 'offer', 'help me', 'خدمات', 'خدمه', 'تقدم', 'تقدمون', 'تقدمه', 'ماذا تفعل', 'تساعد'],
  hello: ['hello', 'hi', 'hey', 'salam', 'مرحبا', 'اهلا', 'السلام', 'صباح', 'مساء'],
  thanks: ['thank', 'thanks', 'شكرا', 'مشكور', 'جزاك'],
};
const pkgKeys = [['starter', 'انطلاقه'], ['brand system', 'نظام العلامه', 'system'], ['e-commerce', 'ecommerce', 'store launch', 'shopify', 'متجر'], ['content', 'محتوي', 'monthly']];

export function askGateData(lang: Lang) {
  const home = lang === 'en' ? en : ar;
  return {
    lang,
    t: copy[lang],
    services: services.map((s) => ({ slug: s.slug, name: s.name[lang], promise: s.promise[lang], subs: s.subs.map((x) => x[lang]), keys: svcKeys[s.slug] || [] })),
    packages: home.packages.items.map((p, i) => ({ slug: p.slug, name: p.name, line: p.line, items: p.items, popular: !!p.popular, keys: pkgKeys[i] || [] })),
    popular: home.packages.popular,
    priceNote: home.packages.priceNote,
    // Stage R: the same sample prices as the package cards (marked "Sample"), so Ask Gate and the page never disagree
    prices: SAMPLE ? pkgSamples.map((p) => p.value.price) : null,
    fromPrice: lang === 'en' ? 'From AED {p}' : 'تبدأ من {p} درهم',
    // Same prices in shekels for visitors in Israel (html[data-cur=ILS], set by BaseLayout)
    pricesIls: SAMPLE ? pkgSamples.map((p) => ils(p.value.price) ?? p.value.price) : null,
    fromPriceIls: lang === 'en' ? 'From ILS {p}' : 'تبدأ من {p} شيكل',
    quote: quoteLabel[lang], quoteNote: quoteNote[lang],
    sampleLabel: sampleLabel[lang],
    vat: home.packages.vat,
    cases: cases.map((c) => ({ slug: c.slug, client: c.client[lang], tag: c.tag[lang], img: `/images/${c.img.base}-480.webp`, alt: c.img.alt[lang], film: !!c.video })),
    intents: intentKeys,
  };
}
export const askGateCopy = copy;
