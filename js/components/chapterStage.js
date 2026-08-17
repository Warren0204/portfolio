/* The chapter stage: mounts every chapter once, then slides between them.
   Forward moves left, back moves right. Only one chapter is in the accessibility
   tree at a time, so a screen reader never walks four hidden chapters. */

import { el } from '../core/dom.js';
import { DURATIONS } from '../core/constants.js';
import { prefersReducedMotion } from '../core/motion.js';
import { chapters } from '../data/navigation.js';

const TRANSITION_CLASSES = [
  'chapter--in-forward',
  'chapter--out-forward',
  'chapter--in-back',
  'chapter--out-back',
  'chapter--leaving',
];

/**
 * @param {object} options
 * @param {HTMLElement} options.mount The <main id="stage"> element.
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @param {Record<string, HTMLElement>} options.content Chapter id to its content.
 * @returns {{ destroy: () => void }}
 */
export function createChapterStage({ mount, store, content }) {
  let transitionTimer = 0;

  const panels = chapters.map((chapter) => {
    const panel = el('section', {
      class: 'chapter chapter--hidden',
      attrs: { 'aria-label': chapter.label.toLowerCase(), inert: '' },
      dataset: { chapter: chapter.id },
    });
    panel.appendChild(content[chapter.id]);
    return panel;
  });

  mount.replaceChildren(...panels);

  function clearTransitionClasses(panel) {
    panel.classList.remove(...TRANSITION_CLASSES);
  }

  function show(index, previousIndex) {
    const incoming = panels[index];
    const outgoing = previousIndex >= 0 ? panels[previousIndex] : null;
    const goingForward = index > previousIndex;

    window.clearTimeout(transitionTimer);
    panels.forEach(clearTransitionClasses);

    panels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === index;
      panel.classList.toggle('chapter--active', isActive);
      panel.classList.toggle('chapter--hidden', !isActive);
      // inert keeps off-screen chapters out of tab order and the a11y tree.
      if (isActive) panel.removeAttribute('inert');
      else panel.setAttribute('inert', '');
    });

    // A fresh chapter always starts at the top, the way a new page would.
    incoming.scrollTop = 0;

    if (!outgoing || outgoing === incoming || prefersReducedMotion()) return;

    // The outgoing panel has to stay painted for the length of the slide.
    outgoing.classList.remove('chapter--hidden');
    outgoing.classList.add('chapter--leaving');
    outgoing.classList.add(goingForward ? 'chapter--out-forward' : 'chapter--out-back');
    incoming.classList.add(goingForward ? 'chapter--in-forward' : 'chapter--in-back');

    transitionTimer = window.setTimeout(() => {
      clearTransitionClasses(outgoing);
      outgoing.classList.add('chapter--hidden');
      clearTransitionClasses(incoming);
    }, DURATIONS.chapter + 80);
  }

  let currentIndex = store.get().chapterIndex;
  show(currentIndex, -1);

  const unsubscribe = store.subscribe((state, changedKeys) => {
    if (!changedKeys.includes('chapterIndex')) return;
    const previousIndex = currentIndex;
    currentIndex = state.chapterIndex;
    show(currentIndex, previousIndex);
  });

  return {
    destroy() {
      window.clearTimeout(transitionTimer);
      unsubscribe();
      mount.replaceChildren();
    },
  };
}
