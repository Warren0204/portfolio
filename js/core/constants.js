/* Named values shared across modules. Nothing in the project hard-codes a
   duration, breakpoint, or storage key — it comes from here, and the CSS side
   of the same value lives in css/base/tokens.css. */

export const STORAGE_KEYS = Object.freeze({
  theme: 'nc-theme',
  introSeen: 'nc-intro-v2',
});

export const THEMES = Object.freeze({
  light: 'light',
  dark: 'dark',
});

/* Mirrors the media queries in the stylesheets. Kept in pixels because the
   JavaScript side reads window.innerWidth, not em.

   Only breakpoints JavaScript actually tests belong here. The shell breakpoint
   -- below which the section nav becomes the bottom tab bar -- is 920px and
   lives in css/layout/header.css, because nothing in js/ needs to know it. */
export const BREAKPOINTS = Object.freeze({
  /* The narrowest width the credentials connector spine still reads at. */
  trackTree: 892,
});

/* Milliseconds. Only the values JavaScript has to time itself live here;
   everything scroll-driven is owned by js/core/animate.js and expressed in
   seconds, the unit GSAP works in. */
export const DURATIONS = Object.freeze({
  base: 200,
  fast: 160,
  /* Preloader: count, then the split. Together they stay under three seconds —
     long enough to register as an entrance, short enough not to be a toll. */
  introCount: 1600,
  introExit: 920,
});

export const TYPEWRITER = Object.freeze({
  typeMinMs: 46,
  typeJitterMs: 46,
  holdMs: 2100,
  deleteMs: 24,
  restartMs: 320,
});
