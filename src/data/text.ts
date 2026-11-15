// Line-break helpers (Ahmed 9 Nov): short words are bound to the next word with a no-break space, in data,
// so headings never end a line on "the" / «في». Applied to whole copy objects with bindAll().
const EN = ['a', 'an', 'the', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'and', 'or', '&', 'with', 'from', 'your', 'our', 'its', 'is', 'as', 'we', 'one', 'per', 'no', 'not', 'up', 'so', 'it'];
const AR = ['في', 'من', 'على', 'إلى', 'عن', 'مع', 'أو', 'حتى', 'ثم', 'قد', 'لا', 'ما', 'كل', 'بين', 'منذ', 'و', 'لم', 'لن', 'هل', 'كم', 'متى', 'أين'];
const esc = (w: string) => w.replace(/[&]/g, '\\$&');
const reEN = new RegExp(`(?<=^|[\\s(“"'‘/])(${EN.map(esc).join('|')}) +`, 'gi');
const reAR = new RegExp(`(?<=^|[\\s(«])(${AR.join('|')}) +`, 'g');

/** Keeps the last two words together (no one-word last line). */
// (+ a word joiner after hyphens, so 'E-commerce Launch' never breaks at the hyphen either)
export const tail = (s: string): string => {
  const t = s.replace(/-(?=\p{L})/gu, '-\u2060');
  const m = t.match(/ ([^ \u00A0]+)$/);
  if (!m || m.index === undefined) return t;
  // QA 15 Nov: never glue the last word to a group that is already bound ("with financial" + "credibility.") when the
  // result would be longer than 18 characters: such a group cannot wrap and spilled out of narrow columns and cards.
  const prev = t.slice(0, m.index).match(/([^ ]+)$/);
  const group = ((prev ? prev[1] : '') + ' ' + m[1]).replace(/\u2060/g, '');
  return group.length <= 18 ? t.slice(0, m.index) + '\u00A0' + m[1] : t;
};
/** Final 2: 'is-long' when a heading holds an unbreakable group longer than `limit` characters (bound short words +
 *  the joined last two words). CSS steps such headings down on phones so the group still fits the screen. */
export const fitClass = (s: string, limit = 18): string =>
  Math.max(...s.split(' ').map((w) => w.replace(/\u2060/g, '').length)) > limit ? 'is-long' : '';
export const bind = (s: string, lang: 'en' | 'ar'): string => tail(s.replace(lang === 'ar' ? reAR : reEN, '$1\u00A0'));

/** Deep-binds every string in a copy object (keys listed in `skip` are left as they are, e.g. meta). */
export function bindAll<T>(obj: T, lang: 'en' | 'ar', skip: string[] = ['meta', 'slug', 'href', 'type', 'id']): T {
  const walk = (v: unknown, key?: string): unknown => {
    if (key && skip.includes(key)) return v;
    if (typeof v === 'string') return bind(v, lang);
    if (Array.isArray(v)) return v.map((x) => walk(x));
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, k)]));
    return v;
  };
  return walk(obj) as T;
}
