/* Bottom navigation for phones. A hamburger hides five destinations behind a
   tap and puts them at the far end of the screen from the thumb; an app puts
   them in reach and keeps them visible, so you always know where you are and
   what else there is. Above the phone breakpoint the header nav takes over and
   this is not rendered at all. */

import { el } from '../core/dom.js';
import { chapters } from '../data/navigation.js';

/**
 * @param {object} options
 * @param {HTMLElement} options.mount
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @returns {{ destroy: () => void }}
 */
export function createTabBar({ mount, store }) {
  const tabs = chapters.map((chapter, index) =>
    el(
      'a',
      {
        class: 'tab-bar__tab',
        attrs: { href: chapter.route },
        dataset: { chapter: chapter.id },
      },
      [
        el('span', { class: 'tab-bar__marker', attrs: { 'aria-hidden': 'true' } }),
        el('span', { class: 'tab-bar__index', text: String(index + 1).padStart(2, '0') }),
        el('span', { class: 'tab-bar__label', text: chapter.menuLabel }),
      ]
    )
  );

  const element = el(
    'nav',
    { class: 'tab-bar', attrs: { 'aria-label': 'Chapters' } },
    tabs
  );

  function render(index) {
    tabs.forEach((tab, tabIndex) => {
      const isCurrent = tabIndex === index;
      tab.classList.toggle('tab-bar__tab--current', isCurrent);
      if (isCurrent) tab.setAttribute('aria-current', 'page');
      else tab.removeAttribute('aria-current');
    });
  }

  render(store.get().chapterIndex);
  const unsubscribe = store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('chapterIndex')) render(state.chapterIndex);
  });

  mount.appendChild(element);

  return {
    destroy() {
      unsubscribe();
      element.remove();
    },
  };
}
