/* Global input: the keyboard and the swipe. Both are ways of asking for the
   same two things — change chapter, or close what is open — so they live
   together rather than inside the entry point. */

import { on } from './dom.js';
import { SWIPE } from './constants.js';

const TYPING_TAGS = /^(INPUT|TEXTAREA|SELECT)$/;

/* Escape closes a modal, then an open panel — in that order. */
function wireKeyboard({ store, router, resetChapter }) {
  return on(window, 'keydown', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement) {
      if (TYPING_TAGS.test(target.tagName)) return;
      // Arrow keys inside a tab bar belong to the tab bar.
      if (target.closest('[data-tabgroup]')) return;
    }

    // A dialog handles its own Escape and stops it before it reaches here.
    if (document.querySelector('.modal')) return;

    if (event.key === 'Escape') {
      resetChapter(store.get().chapterIndex);
      return;
    }

    if (event.key === 'ArrowRight') router.navigate(store.get().chapterIndex + 1);
    else if (event.key === 'ArrowLeft') router.navigate(store.get().chapterIndex - 1);
  });
}

/* Horizontal swipe changes chapter. Vertical scrolling is never hijacked. */
function wireSwipe({ store, router }) {
  let start = null;

  const stopStart = on(
    window,
    'touchstart',
    (event) => {
      start = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    },
    { passive: true }
  );

  const stopEnd = on(
    window,
    'touchend',
    (event) => {
      if (!start) return;
      const deltaX = event.changedTouches[0].clientX - start.x;
      const deltaY = event.changedTouches[0].clientY - start.y;
      start = null;

      const decisivelyHorizontal =
        Math.abs(deltaX) > SWIPE.minDistancePx &&
        Math.abs(deltaX) > Math.abs(deltaY) * SWIPE.horizontalRatio;

      if (!decisivelyHorizontal) return;
      router.navigate(store.get().chapterIndex + (deltaX < 0 ? 1 : -1));
    },
    { passive: true }
  );

  return () => {
    stopStart();
    stopEnd();
  };
}

/**
 * @param {object} options
 * @param {ReturnType<import('./store.js').createStore>} options.store
 * @param {{ navigate: (index: number) => void }} options.router
 * @param {(index: number) => void} options.resetChapter
 * @returns {() => void} removes every global listener it registered.
 */
export function wireGlobalInput({ store, router, resetChapter }) {
  const stopKeyboard = wireKeyboard({ store, router, resetChapter });
  const stopSwipe = wireSwipe({ store, router });

  return () => {
    stopKeyboard();
    stopSwipe();
  };
}
