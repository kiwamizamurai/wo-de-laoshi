import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/wo-de-laoshi/',
  esbuild: {
    jsxImportSource: 'hono/jsx/dom',
  },
  test: {
    environment: 'happy-dom',
  },
});
