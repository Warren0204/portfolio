/* Hash routing. The hash is the single source of truth for which chapter is
   showing: every navigation goes through the URL, so back, forward, deep links,
   and a hard refresh all land in the same place. */

import { chapters, indexForRoute } from '../data/navigation.js';
import { on } from './dom.js';

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
 * @returns {{ navigate: (index: number) => void, destroy: () => void }}
 */
export function createRouter({ store }) {
  function readHash() {
    const index = indexForRoute(window.location.hash);
    store.set({ chapterIndex: index });
    describeChapter(index);
  }

  /** Move to a chapter by index. Out-of-range requests are ignored. */
  function navigate(index) {
    if (index < 0 || index >= chapters.length) return;
    if (index === store.get().chapterIndex) return;
    window.location.hash = chapters[index].route;
  }

  const stopListening = on(window, 'hashchange', readHash);

  // Normalise a bare or unknown hash to the canonical route for chapter 0, so
  // the URL always names the chapter on screen.
  const initialIndex = indexForRoute(window.location.hash);
  if (window.location.hash !== chapters[initialIndex].route) {
    window.history.replaceState(null, '', chapters[initialIndex].route);
  }
  describeChapter(initialIndex);

  return {
    navigate,
    destroy: stopListening,
  };
}
