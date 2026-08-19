/* Routing for a single scrolling page.

   The five chapters are no longer separate views — they are sections of one
   document — but they keep their hash routes, because those routes are already
   in the sitemap and in anything anyone has linked. So the hash and the scroll
   position are kept as two views of one fact:

     a link or a back button   ->  scroll to that section
     scrolling past a section  ->  rewrite the hash to name it

   Routes stay in the `#/projects` form rather than becoming bare `#projects`
   element ids. A bare id would let the browser jump to it natively, which
   sounds simpler but costs the smooth scroll and the header offset, and would
   break every existing link the moment the ids changed. Nothing here relies on
   the hash matching an element id.

   The hash is written with replaceState while scrolling, so a visitor who
   scrolls the whole page once does not have to press Back five times to leave. */

import { chapters, indexForRoute } from '../data/navigation.js';
import { on } from './dom.js';
import { prefersReducedMotion } from './motion.js';

const DESCRIPTION_SELECTOR = 'meta[name="description"]';

/** Point the document's title and description at a chapter. */
function describeChapter(index) {
  const chapter = chapters[index];
  document.title = chapter.title;

  const description = document.querySelector(DESCRIPTION_SELECTOR);
  if (description) description.setAttribute('content', chapter.description);
}

/**
 * @param {object} options
 * @param {ReturnType<import('./store.js').createStore>} options.store
 * @param {Record<string, HTMLElement>} options.sections Chapter id to its
 *   section element, which is what gets scrolled to.
 * @returns {{ navigate: (index: number) => void, syncToScroll: (index: number) => void, destroy: () => void }}
 */
export function createRouter({ store, sections }) {
  /* Set while a programmatic scroll is in flight. The scroll-spy fires for
     every section the page passes through on the way to the target; without
     this the URL would flicker through three routes before settling. */
  let scrollingTo = -1;
  let settleTimer = 0;

  function elementFor(index) {
    return sections[chapters[index].id];
  }

  /**
   * Move to a chapter by index and push it onto history, so Back returns to
   * where the visitor was rather than to the top of the page.
   */
  function navigate(index) {
    if (index < 0 || index >= chapters.length) return;

    const target = elementFor(index);
    if (!target) return;

    const route = chapters[index].route;
    if (window.location.hash !== route) {
      window.history.pushState(null, '', route);
    }

    scrollTo(index, target);
  }

  function scrollTo(index, target) {
    scrollingTo = index;
    store.set({ chapterIndex: index });
    describeChapter(index);

    // scroll-margin-top on the section clears the fixed header, so the caller
    // never has to know how tall it is. See css/layout/page.css.
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });

    // No event tells us a smooth scroll has finished, so the lock is released
    // on a timer long enough to cover a full-page scroll on a slow device.
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(() => {
      scrollingTo = -1;
    }, 1000);
  }

  /**
   * Called by the scroll-spy when the section under the reader changes. Writes
   * the hash without adding a history entry.
   *
   * @param {number} index
   */
  function syncToScroll(index) {
    if (scrollingTo !== -1 && index !== scrollingTo) return;

    store.set({ chapterIndex: index });
    describeChapter(index);

    const route = chapters[index].route;
    if (window.location.hash !== route) {
      window.history.replaceState(null, '', route);
    }
  }

  /* Back and forward. hashchange rather than popstate: replaceState during
     scrolling fires neither, but a hash the visitor types fires only the
     former, and this has to answer both. */
  const stopListening = on(window, 'hashchange', () => {
    const index = indexForRoute(window.location.hash);
    const target = elementFor(index);
    if (target) scrollTo(index, target);
  });

  const initialIndex = indexForRoute(window.location.hash);
  if (window.location.hash !== chapters[initialIndex].route) {
    window.history.replaceState(null, '', chapters[initialIndex].route);
  }
  describeChapter(initialIndex);

  return {
    navigate,
    syncToScroll,

    /**
     * Jump to whatever the opening URL asked for. Deferred by the caller until
     * the intro has cleared: scrolling underneath the loading screen would
     * spend the arrival where nobody can see it, and lands the visitor
     * mid-section with no idea how they got there.
     */
    restoreInitialPosition() {
      if (initialIndex === 0) return;
      const target = elementFor(initialIndex);
      if (target) scrollTo(initialIndex, target);
    },

    destroy() {
      window.clearTimeout(settleTimer);
      stopListening();
    },
  };
}
