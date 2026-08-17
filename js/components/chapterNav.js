/* Previous and next chapter buttons at the lower edges of the stage. They are
   an affordance for wide screens; on narrower ones the header nav and swipe
   already cover it, and the edges are too tight to hold them. */

import { el } from '../core/dom.js';
import { chapters } from '../data/navigation.js';

/**
 * @param {object} options
 * @param {HTMLElement} options.mount
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @param {(index: number) => void} options.onNavigate
 * @returns {{ destroy: () => void }}
 */
export function createChapterNav({ mount, store, onNavigate }) {
  function build(side, captionText) {
    const caption = el('span', { class: 'chapter-nav__caption', text: captionText });
    const name = el('span', { class: 'chapter-nav__name' });
    const arrow = el('span', {
      class: 'chapter-nav__arrow',
      text: side === 'prev' ? '‹' : '›',
      attrs: { 'aria-hidden': 'true' },
    });

    const labels = el('span', { class: 'chapter-nav__labels' }, [caption, name]);

    const button = el(
      'button',
      {
        class: `chapter-nav chapter-nav--${side}`,
        attrs: {
          type: 'button',
          'aria-label': side === 'prev' ? 'Previous chapter' : 'Next chapter',
        },
        on: {
          click: () => onNavigate(store.get().chapterIndex + (side === 'prev' ? -1 : 1)),
        },
      },
      side === 'prev' ? [arrow, labels] : [labels, arrow]
    );

    return { button, name };
  }

  const previous = build('prev', 'PREVIOUS');
  const next = build('next', 'NEXT');
  mount.append(previous.button, next.button);

  function render(index) {
    const hasPrevious = index > 0;
    const hasNext = index < chapters.length - 1;

    previous.button.hidden = !hasPrevious;
    next.button.hidden = !hasNext;

    if (hasPrevious) previous.name.textContent = chapters[index - 1].label;
    if (hasNext) next.name.textContent = chapters[index + 1].label;
  }

  render(store.get().chapterIndex);
  const unsubscribe = store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('chapterIndex')) render(state.chapterIndex);
  });

  return {
    destroy() {
      unsubscribe();
      previous.button.remove();
      next.button.remove();
    },
  };
}
