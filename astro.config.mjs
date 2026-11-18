// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wangmingshu.me',
  integrations: [sitemap()],
  // ClientRouter's own prefetch module only runs when `prefetch` is not
  // `false`. Prefetching on viewport meant every page fetched the whole other
  // locale's HTML while the hero was still loading; `hover` keeps the page
  // transition warm without spending first-screen bandwidth.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
