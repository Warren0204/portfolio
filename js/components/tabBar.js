/* Bottom navigation for phones. A hamburger hides five destinations behind a
   tap and puts them at the far end of the screen from the thumb; this keeps
   them in reach and visible, so you always know where you are and what else
   there is. Above the phone breakpoint the header nav takes over and this is
   not rendered at all.

   It earns its place more on a scrolling page than it did on a paged one: the
   header nav is the only other way to jump, and a reader four screens into the
   experience section should not have to scroll back up to leave it. */

import { el } from '../core/dom.js';
import { createIcon } from './icon.js';
import { chapters } from '../data/navigation.js';

function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

/**
 * @param {object} options
 * @param {HTMLElement} options.mount
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @param {(index: number) => void} options.onNavigate
 * @returns {{ destroy: () => void }}
 */
export function createTabBar({ mount, store, onNavigate }) {
  const tabs = chapters.map((chapter, index) =>
    el(
      'a',
      {
        class: 'tab-bar__tab',
        attrs: { href: chapter.route },
        dataset: { chapter: chapter.id },
        on: {
          click: (event) => {
            if (isModifiedClick(event)) return;
            event.preventDefault();
            onNavigate(index);
          },
        },
      },
      [
        // The pill the icon sits in is the indicator. createIcon marks the
        // SVG aria-hidden, so the label alone names the tab.
        el('span', { class: 'tab-bar__icon' }, createIcon(chapter.icon, 24)),
        el('span', { class: 'tab-bar__label', text: chapter.menuLabel }),
      ]
    )
  );

  const element = el('nav', { class: 'tab-bar', attrs: { 'aria-label': 'Sections' } }, tabs);

  // Sections the reader has been in, so passing one leaves a trace behind.
  const visited = new Set();

  function render(index) {
    visited.add(index);
    tabs.forEach((tab, tabIndex) => {
      const isCurrent = tabIndex === index;
      tab.classList.toggle('tab-bar__tab--current', isCurrent);
      tab.classList.toggle('tab-bar__tab--visited', !isCurrent && visited.has(tabIndex));
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
