// The Point · نقطة — compact case (logo + motion), Stage 4B-3. Copy source: /home/claude/content/work/the-point.md only.
// Media: the two logo animations (public/video/the-point-{en,ar}.mp4, posters = final lock-up frames), a cover frame from
// the animation at 2.0 s, and Important details.pdf pp. 2-3 (colour, typeface). Never used: "Cover Facebook.jpg" (phone numbers).
// The brief and the intended concept are not in the files: the copy describes only what is visible (see todo).
import type { CaseStudy, T } from '../case-studies';
import type { Img } from '../media';
import { images, videos } from '../media';

const t = (en: string, ar: string): T => ({ en, ar });
const W = [480, 800, 1200, 1600];

const img = {
  cover: { base: 'the-point/cover', widths: W, w: 1920, h: 1080, alt: t('A frame of The Point logo animation: a red winged stroke flies in towards the open bowl of the P', 'إطار من حركة شعار نقطة: خطّ أحمر مجنّح يطير نحو الجزء المفتوح من حرف P') } as Img,
  colour: { base: 'the-point/p02', widths: W, w: 1700, h: 980, alt: t('Colour page: red #CC0000 (Pantone 3517 C), white and black', 'صفحة الألوان: الأحمر #CC0000 (Pantone 3517 C) والأبيض والأسود') } as Img,
  type: { base: 'the-point/p03', widths: W, w: 1700, h: 979, alt: t('Typeface page: Cairo, on a white card over red', 'صفحة الخط: خط القاهرة (Cairo) على بطاقة بيضاء فوق الأحمر') } as Img,
};

export const thePoint: CaseStudy = {
  slug: 'the-point',
  kind: 'case',
  meta: {
    title: t('The Point: Bilingual Logo and Motion Case Study | Gate33', 'نقطة: دراسة حالة في شعار ثنائي اللغة وتحريكه | Gate33'),
    description: t(
      'How Gate33 designed one bold P for The Point, a travel and tourism brand, with Arabic and English lock-ups and a logo animation in each language.',
      'كيف صمّمت Gate33 حرف P جريئاً لعلامة نقطة للسياحة والسفر، بصيغتين عربية وإنجليزية، وتحريك للشعار بكل لغة.',
    ),
  },
  overline: t('Case study · Branding · Motion', 'دراسة حالة · الهوية · الحركة'),
  headline: t('One P, two languages, in motion.', 'حرف P واحد، بلغتين، في حركة.'),
  intro: t(
    'A logo for The Point, a travel and tourism brand: one symbol, an Arabic and an English lock-up, and a short animation for each.',
    'شعار لعلامة نقطة للسياحة والسفر: رمز واحد، وصيغة عربية وأخرى إنجليزية، وتحريك قصير لكل منهما.',
  ),
  facts: {
    client: t('The Point', 'نقطة'),
    sector: t('Travel & tourism', 'السياحة والسفر'),
    services: t('Logo design · Arabic and English lock-ups · Logo animation', 'تصميم الشعار · صيغ عربية وإنجليزية · تحريك الشعار'),
    market: t('{{TODO: market}}', '{{TODO: market}}'),
    year: t('{{TODO: year}}', '{{TODO: year}}'),
  },
  cover: img.cover,
  coverTone: 'light',
  blocks: [
    { type: 'text', key: 'challenge', over: t('The challenge', 'التحدّي'), title: t('One mark for two languages, made to move.', 'علامة واحدة للغتين، مصمَّمة لتتحرّك.'),
      body: [t(
        'A travel and tourism company needed one mark that could serve Arabic- and English-speaking customers equally, and work in motion on social media and screens.',
        'احتاجت شركة سياحة وسفر إلى علامة واحدة تخدم عملاءها الناطقين بالعربية والإنجليزية بالقدر نفسه، وتتحرّك بسلاسة على وسائل التواصل والشاشات.',
      )] },
    // The page's own language first; the other lock-up follows.
    { type: 'video', src: t(videos.pointEn.src, videos.pointAr.src), poster: images.pointEn, posterAr: images.pointAr, ratio: '16/9',
      title: t('The Point logo animation, English', 'تحريك شعار نقطة بالعربية'),
      caption: t('The English lock-up in motion: The Point · Travel & Tourism.', 'الصيغة العربية في حركة: نقطة · السياحة والسفر.') },
    { type: 'text', key: 'idea', over: t('The idea', 'الفكرة'), title: t('A single, heavy P with direction.', 'حرف P واحد عريض يحمل اتجاهاً.'),
      body: [
        t('The mark is a single, heavy P whose folded stroke gives it direction and movement, a fitting gesture for a brand about going places.',
          'الشعار حرف P واحد عريض، تمنحه ثنية خطّه اتجاهاً وحركة، في إيماءة تناسب علامة قائمة على السفر والتنقّل.'),
        t('The same symbol anchors both lock-ups: “نقطة · السياحة والسفر” in Arabic and “The Point · Travel & Tourism” in English.',
          'ويتصدّر الرمز نفسه الصيغتين: "نقطة · السياحة والسفر" بالعربية، و"The Point · Travel & Tourism" بالإنجليزية.'),
      ] },
    { type: 'video', src: t(videos.pointAr.src, videos.pointEn.src), poster: images.pointAr, posterAr: images.pointEn, ratio: '16/9',
      title: t('The Point logo animation, Arabic', 'تحريك شعار نقطة بالإنجليزية'),
      caption: t('The Arabic lock-up in motion: نقطة · السياحة والسفر.', 'الصيغة الإنجليزية في حركة: The Point · Travel & Tourism.') },
    { type: 'system', over: t('The system', 'النظام'), title: t('One red, one typeface, two lock-ups.', 'أحمر واحد، وخط واحد، وصيغتان.'),
      rows: [
        { label: t('Logo', 'الشعار'), value: t('The P symbol with an Arabic lock-up (نقطة · السياحة والسفر) and an English lock-up (The Point · Travel & Tourism).', 'رمز P مع صيغة عربية (نقطة · السياحة والسفر) وصيغة إنجليزية (The Point · Travel & Tourism).') },
        { label: t('Colour', 'الألوان'), swatches: ['#CC0000', '#FFFFFF', '#000000'],
          value: t('Red #CC0000 (Pantone 3517 C) · white · black.', 'أحمر #CC0000 (Pantone 3517 C) · أبيض · أسود.') },
        { label: t('Typography', 'الخط'), value: t('Cairo.', 'خط القاهرة (Cairo).') },
        { label: t('Motion', 'الحركة'), value: t('Logo animations in Arabic (about 9 seconds) and English (about 10 seconds).', 'تحريك للشعار بالعربية (نحو 9 ثوانٍ) وبالإنجليزية (نحو 10 ثوانٍ).') },
        { label: t('Files', 'الملفات'), value: t('A full logo package: AI, EPS, PDF, SVG, JPG and PNG, in RGB, CMYK and Pantone.', 'حزمة كاملة لملفات الشعار: AI وEPS وPDF وSVG وJPG وPNG، بأنظمة RGB وCMYK وبانتون.') },
      ] },
    { type: 'pair', imgs: [img.colour, img.type],
      caption: t('Red, white and black · the Cairo typeface.', 'الأحمر والأبيض والأسود · خط القاهرة.') },
  ],
  outcome: {
    over: t('The outcome', 'النتيجة'),
    line: t('One bold P that works in both languages and moves, ready for every screen a traveller sees.', 'حرف P جريء يعمل باللغتين ويتحرّك، جاهز لكل شاشة يراها المسافر.'),
    // Counts taken from the logo files (not measured results).
    facts: [
      { value: '1', label: t('symbol for both languages', 'رمز واحد للغتين') },
      { value: '2', label: t('lock-ups, Arabic and English', 'صيغتان، عربية وإنجليزية') },
      { value: '2', label: t('logo animations', 'تحريكان للشعار') },
      { value: '3', label: t('colours, led by one red', 'ألوان يتصدّرها الأحمر') },
    ],
  },
  todo: [
    'Real brief: the challenge wording is an inference from the files; confirm with Shifaa',
    'Intended concept of the P (ticket fold, route, location point, the winged stroke in the animation?): confirm before publishing; the copy describes only what is visible',
    'Market and year',
    'Clean applications without contact details (the case stays compact: logo + motion)',
    'Verified results (no Results block on the page)',
    'Client testimonial with name/title and written consent (no quote on the page)',
  ],
};
