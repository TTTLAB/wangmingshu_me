// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://wangmingshu.me',
  // ClientRouter's own prefetch module only runs when `prefetch` is not
  // `false`. `prefetchAll` + `viewport` warms every same-origin link as soon
  // as it intersects the viewport, so the fetch inside the page transition
  // resolves from the HTTP cache instead of blocking the URL swap.
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
