import { defineConfig } from 'astro/config';

// Static output for Cloudflare Pages. Nothing is published from this repo in Phase 1.
export default defineConfig({
  site: 'https://gate-33.com',
  output: 'static',
  trailingSlash: 'always',
  redirects: { '/': '/en/' },
  build: { inlineStylesheets: 'never' }, // keeps the CSP free of 'unsafe-inline'
  vite: { build: { assetsInlineLimit: 0 } },
});
