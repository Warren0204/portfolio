/* Motion preference, read at the source. CSS neutralises animations that have
   already started; this lets callers not start them at all — no preloader, no
   typing loop, no observers. */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** @returns {boolean} */
export function prefersReducedMotion() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * Run a callback whenever the motion preference changes, so a visitor who
 * turns reduced motion on mid-session is respected without a reload.
 *
 * @param {(reduced: boolean) => void} listener
 * @returns {() => void} unsubscribe
 */
export function onMotionPreferenceChange(listener) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = (event) => listener(event.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}

/**
 * Resolve once an element's running animation finishes, or immediately when
 * motion is reduced. Falls back to a timeout so a dropped animationend event
 * can never strand the caller.
 *
 * @param {HTMLElement} element
 * @param {number} timeoutMs
 * @returns {Promise<void>}
 */
export function afterAnimation(element, timeoutMs) {
  if (prefersReducedMotion()) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      element.removeEventListener('animationend', finish);
      window.clearTimeout(timer);
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs + 80);
    element.addEventListener('animationend', finish);
  });
}
