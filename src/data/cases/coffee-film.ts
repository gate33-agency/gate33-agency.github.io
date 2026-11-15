// Coffee roaster corporate film — short-film page (kind 'film'), Stage 4B-3. Copy source: /home/claude/content/work/coffee-film.md only.
// Film: public/video/coffee-film.mp4 (an excerpt cut from the source: 8-15 s + 18-25 s, letterbox removed, no audio track).
// It is the page's cover (poster first, plays on click). Stills: single frames from outside 0:38-0:42, without the shirt
// logo, street signage or landmarks (scripts/build-assets.mjs, G33_ONLY=coffee-film). Client name stays {{TODO}} (consent).
import type { CaseStudy, T } from '../case-studies';
import type { Img } from '../media';
import { images, videos } from '../media';

const t = (en: string, ar: string): T => ({ en, ar });
const s = (n: string, en: string, ar: string): Img => ({ base: `coffee-film/${n}`, widths: [480, 800, 1200], w: 1280, h: 544, alt: { en, ar } });

const img = {
  founder: s('founder', 'Still from the film: the founder in his roastery, looking away from the camera', 'لقطة من الفيلم: المؤسس في محمصته ينظر بعيداً عن الكاميرا'),
  raking: s('raking', 'Still from the film: a hand rakes freshly roasted beans in the roaster’s tray', 'لقطة من الفيلم: يد تقلّب حبوب البن المحمّصة للتوّ في صينية آلة التحميص'),
  beans: s('beans', 'Still from the film: roasted coffee beans in mid-air, close up', 'لقطة من الفيلم: حبوب بن محمّصة في الهواء عن قرب'),
  tamper: s('tamper', 'Still from the film: a hand over a portafilter, beside an orange tamper', 'لقطة من الفيلم: يد فوق مقبض آلة الإسبريسو بجانب أداة كبس برتقالية'),
};

export const coffeeFilm: CaseStudy = {
  slug: 'coffee-film',
  kind: 'film',
  meta: {
    title: t('Coffee Roaster Corporate Film | Gate33', 'فيلم تعريفي لمحمصة قهوة | Gate33'),
    description: t(
      'A one-minute corporate film by Gate33 for a specialty coffee roaster: the founder, the beans and the craft of roasting, in warm, tactile shots.',
      'فيلم تعريفي من دقيقة واحدة أنتجته Gate33 لمحمصة قهوة مختصة: المؤسس، والحبوب، وحرفة التحميص، بلقطات دافئة وملموسة.',
    ),
  },
  overline: t('Film · Corporate film', 'فيلم · فيلم تعريفي'),
  headline: t('One minute with a coffee roaster and his craft.', 'دقيقة واحدة مع صانع قهوة وحرفته.'),
  intro: t(
    'A short film that shows what happens before the cup: the founder, the beans and the craft of roasting.',
    'فيلم قصير يُظهر ما يسبق الفنجان: المؤسس، والحبوب، وحرفة التحميص.',
  ),
  facts: {
    client: t('Specialty coffee roaster', 'محمصة قهوة مختصة'), // {{TODO: client name, with consent}}
    sector: t('Food & beverage · Coffee', 'الأغذية والمشروبات · القهوة'),
    services: t('Corporate film · Filming · Editing · Colour grading', 'فيلم تعريفي · تصوير · مونتاج · تصحيح ألوان'),
    market: t('{{TODO: market}}', '{{TODO: market}}'),
    year: t('{{TODO: year}}', '{{TODO: year}}'),
  },
  cover: images.coffee,
  coverTone: 'dark',
  blocks: [
    // Becomes the cover on a film page (poster = cover, plays on click); not repeated in the body.
    { type: 'video', src: t(videos.coffee.src, videos.coffee.src), poster: images.coffee, ratio: '47/20',
      title: t('Coffee roaster corporate film, excerpt', 'مقتطف من الفيلم التعريفي لمحمصة القهوة'),
      caption: t('An excerpt from the film.', 'مقتطف من الفيلم.') },
    { type: 'text', key: 'story', over: t('The film', 'الفيلم'), title: t('What happens before the cup.', 'ما يسبق الفنجان.'),
      body: [
        t('A coffee roaster wanted to show what happens before the cup: the founder, the beans and the craft of roasting.',
          'أرادت محمصة قهوة أن تُظهر ما يسبق الفنجان: المؤسس، والحبوب، وحرفة التحميص.'),
        t('We built a cinematic film around three moments: the founder at his roaster, the beans being raked, and the roast itself in close-up, ending with customers enjoying the result. Warm grading and slow, tactile shots keep the focus on the product.',
          'فبنينا فيلماً سينمائياً حول ثلاث لحظات: المؤسس أمام آلة التحميص، والحبوب وهي تُقلَّب، ثم التحميص نفسه في لقطات قريبة، وصولاً إلى العملاء وهم يستمتعون بالنتيجة. وتُبقي الألوان الدافئة واللقطات البطيئة الملموسة التركيز على المنتج.'),
      ] },
    { type: 'pair', imgs: [img.founder, img.raking], ratio: '47/20',
      caption: t('Stills from the film: the founder · the beans, raked by hand.', 'لقطات من الفيلم: المؤسس · الحبوب تُقلَّب باليد.') },
    { type: 'pair', imgs: [img.beans, img.tamper], ratio: '47/20',
      caption: t('Stills from the film: the roast in close-up · the cup in the making.', 'لقطات من الفيلم: التحميص عن قرب · الفنجان قيد التحضير.') },
  ],
  outcome: {
    over: t('The outcome', 'النتيجة'),
    line: t('A one-minute film that lets customers meet the founder and smell the roast before they visit.', 'فيلم من دقيقة واحدة يعرّف العملاء بالمؤسس ويُشعرهم برائحة التحميص قبل زيارتهم.'),
    // Counts from the film itself (not measured results).
    facts: [
      { value: '1', label: t('minute, the full film', 'دقيقة، مدة الفيلم كاملاً') },
      { value: '3', label: t('moments: founder, beans, roast', 'لحظات: المؤسس والحبوب والتحميص') },
    ],
  },
  todo: [
    'Client name: only with the client’s consent (staff shirt and shop show the brand)',
    'Gate33’s exact role (concept, shoot, edit) and whether the farm scenes were shot by Gate33 or sourced',
    'Market and year',
    'The excerpt on the site (14 s) briefly shows the shirt logo out of focus at ~0:04: owner to confirm or recut',
    'Full film on the site: only after the edit avoids 0:38-0:42, the street signage and the second landmark (~1:02)',
    'Verified results (no Results block on the page)',
  ],
};
