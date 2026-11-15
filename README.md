# Gate33 website

Review build of the Gate33 Agency website (creative and marketing agency, Dubai). Bilingual: English (`/en/`) and Arabic (`/ar/`, right to left).

**This is a private review preview, not the launched site.** Prices, figures and the testimonial marked "Sample" are placeholders. The contact form and checkout do not send anything, and Ask Gate answers from fixed site data. Search engines are blocked in `robots.txt`.

## Pages

Home, services index and 7 service pages, work index and 6 case studies, packages and comparison, checkout, about, contact, privacy, terms and 404, in both languages.

## Stack

- [Astro](https://astro.build) static site, no server and no third-party requests
- GSAP and Lenis for motion, with reduced-motion and no-JavaScript fallbacks
- Self-hosted fonts: Montserrat (English) and Readex Pro (Arabic)

## Run locally

```
npm ci
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview
```

## Structure

```
src/components   page and UI components
src/data         bilingual copy and site data
src/scripts      interface and motion scripts
src/styles       design tokens and global styles
public           fonts, images, video
scripts          asset pipeline and QA scripts
```

## Deployment

Pushes to `main` build and publish to GitHub Pages through `.github/workflows/deploy.yml`. The site uses root-relative URLs, so it must be served from a domain root.

## Rights

All client work, logos, photography and film shown here belong to Gate33 Agency and its clients. No licence is granted to reuse them.
