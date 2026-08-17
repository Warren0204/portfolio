/* The fixed chapter bar. Nav entries are real links to their hash routes, so
   they work as links do: middle-click, copy, and open in a new tab. */

import { el } from '../core/dom.js';
import { createThemeToggle } from './themeToggle.js';
import { chapters } from '../data/navigation.js';
import { profile } from '../data/profile.js';

/**
 * @param {object} options
 * @param {HTMLElement} options.mount The <header> element in index.html.
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @returns {{ destroy: () => void }}
 */
export function createHeader({ mount, store }) {
  const wordmark = el(
    'a',
    {
      class: 'header__wordmark',
      attrs: { href: chapters[0].route, 'aria-label': profile.homeLabel },
    },
    // Both are rendered and one is shown per breakpoint, so the wordmark never
    // has to reflow or re-measure when the viewport changes.
    [
      el('span', { class: 'header__name header__name--full', text: profile.name }),
      el('span', { class: 'header__name header__name--short', text: profile.shortName }),
    ]
  );

  const links = chapters.map((chapter) =>
    el('a', {
      class: 'header__link',
      text: chapter.label,
      attrs: { href: chapter.route },
      dataset: { chapter: chapter.id },
    })
  );

  const nav = el('nav', { class: 'header__nav', attrs: { 'aria-label': 'Chapters' } }, links);

  const themeToggle = createThemeToggle({ store });

  const controls = el('div', { class: 'header__controls' }, [nav, themeToggle.element]);

  mount.replaceChildren(wordmark, controls);

  function markCurrent(index) {
    links.forEach((link, linkIndex) => {
      if (linkIndex === index) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  markCurrent(store.get().chapterIndex);
  const unsubscribe = store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('chapterIndex')) markCurrent(state.chapterIndex);
  });

  return {
    destroy() {
      unsubscribe();
      themeToggle.destroy();
      mount.replaceChildren();
    },
  };
}
