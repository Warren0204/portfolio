/* Vite is optional here. The site runs from any static server exactly as it is
   written — no bare specifiers, no JSX, no CSS imported from JavaScript — so
   this config only provides a dev server and a minify-and-copy production
   build. Nothing in js/ or css/ may depend on a feature only Vite provides. */

import { defineConfig } from 'vite';

export default defineConfig({
  // Deployed at a domain root, not a subpath, so assets resolve from '/'.
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    cssMinify: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
