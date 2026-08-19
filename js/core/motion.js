/* Motion preference, read at the source. CSS neutralises animations that have
   already started; this lets callers not start them at all — no preloader, no
   typing loop, no observers. */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** @returns {boolean} */
export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
