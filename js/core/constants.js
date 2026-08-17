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
   JavaScript side reads window.innerWidth, not em. */
export const BREAKPOINTS = Object.freeze({
  /* Below this, the phone layout takes over and the inline nav collapses. */
  phone: 800,
  /* The narrowest width the credentials connector spine still reads at. */
  trackTree: 892,
  /* Wide layout, where the edge chapter arrows have room to appear. */
  wide: 1440,
});

/* Milliseconds. The chapter duration is mirrored by --duration-chapter. */
export const DURATIONS = Object.freeze({
  chapter: 350,
  panel: 340,
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

/* A swipe must be decisively horizontal before it changes chapter, so that
   vertical scrolling is never hijacked. */
export const SWIPE = Object.freeze({
  minDistancePx: 64,
  horizontalRatio: 1.4,
});
