/* The loading screen: a count to 100 and the welcome line, then the screen
   breaks apart down the middle. Typography and the progress count only — no
   monogram, no logo, no avatar. Shows once per session.

   The markup lives in index.html so it paints with the first byte rather than
   after the module graph has loaded; this module only drives and removes it.

   Under reduced motion the welcome is still shown — it is content, not
   decoration — but nothing moves: the count is not animated, the halves do not
   travel, and it simply clears after a beat. */

import { DURATIONS, STORAGE_KEYS } from '../core/constants.js';
import { prefersReducedMotion } from '../core/motion.js';
import { qs } from '../core/dom.js';
import { session } from '../core/storage.js';

/** @returns {boolean} whether the intro should run at all. */
export function shouldShowPreloader() {
  return !session.has(STORAGE_KEYS.introSeen);
}

/** Remove the element and release the hold on the chapter animations. */
function finish(root, resolve) {
  document.documentElement.classList.remove('is-preloading');
  root.remove();
  resolve();
}

/**
 * Drive the intro that index.html painted, and resolve once it is gone.
 *
 * @returns {Promise<void>}
 */
export function runPreloader() {
  const root = qs('#intro');
  if (!root) return Promise.resolve();

  session.write(STORAGE_KEYS.introSeen, '1');
  // Chapter entrance animations are paused against this, so they play when the
  // screen opens instead of finishing behind it.
  document.documentElement.classList.add('is-preloading');

  const count = qs('.preloader__count', root);
  const bar = qs('.preloader__bar', root);

  // Reduced motion suppresses travel, not the loading screen itself. A number
  // counting up and a bar filling are progress, not the kind of movement the
  // preference protects against, so they still run; only the break-apart — a
  // full-screen translate — is dropped, and the screen clears at once instead.
  const reduced = prefersReducedMotion();

  return new Promise((resolve) => {
    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / DURATIONS.introCount);
      // Ease out so the count decelerates into 100 instead of stopping dead.
      const eased = 1 - Math.pow(1 - progress, 3);

      count.textContent = String(Math.round(eased * 100));
      bar.style.setProperty('transform', `scaleX(${eased})`);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }

      cancelAnimationFrame(frame);

      if (reduced) {
        finish(root, resolve);
        return;
      }

      // The bar is full: this is the moment the screen comes apart.
      root.classList.add('preloader--leaving');
      // Released as the halves start parting, not after they land, so the page
      // is already rising into view through the seam.
      document.documentElement.classList.remove('is-preloading');

      window.setTimeout(() => finish(root, resolve), DURATIONS.introExit);
    };

    frame = requestAnimationFrame(tick);
  });
}
