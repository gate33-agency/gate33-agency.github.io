// Static sitemap (no library): every built page with its EN/AR alternate. robots.txt still blocks crawling until launch.
import { services } from '../data/services';
import { caseStudies } from '../data/case-studies';
const site = 'https://gate-33.com';
// TODO(legal): privacy/ and terms/ are SAMPLE text (noindex) and stay out of this list until Gate33's approved text replaces them;
// then add 'privacy/', 'terms/' here and set noindex false in LegalPage.astro.
const paths = ['', 'services/', 'work/', 'packages/', 'about/', 'contact/', ...services.map((s) => `services/${s.slug}/`), ...caseStudies.map((k) => `work/${k.slug}/`)];
export function GET() {
  const urls = paths.flatMap((p) => ['en', 'ar'].map((l) => `  <url><loc>${site}/${l}/${p}</loc>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${site}/en/${p}"/><xhtml:link rel="alternate" hreflang="ar" href="${site}/ar/${p}"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${site}/en/${p}"/></url>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
