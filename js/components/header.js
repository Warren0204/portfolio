/* The fixed section bar.

   Nav entries stay real links to their hash routes, so they behave like links —
   middle-click, copy link, open in a new tab. The click handler only takes over
   the plain left-click, to trade the browser's instant jump for a smooth
   scroll; anything with a modifier key falls through to the browser untouched.

   The hairline under the bar is scroll progress through the whole page. On a
   document this tall it is the only thing telling a reader how much is left,
   and it is deliberately not gated on the motion preference: it reports a
   position rather than performing an animation. */

import { el } from '../core/dom.js';
import { createThemeToggle } from './themeToggle.js';
import { onScrollProgress } from '../core/animate.js';
import { chapters } from '../data/navigation.js';
import { profile } from '../data/profile.js';

/** True for a click the browser should keep: new tab, new window, download. */
function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

/**
 * @param {object} options
 * @param {HTMLElement} options.mount The <header> element in index.html.
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @param {(index: number) => void} options.onNavigate
 * @returns {{ destroy: () => void }}
 */
export function createHeader({ mount, store, onNavigate }) {
  const wordmark = el(
    'a',
    {
      class: 'header__wordmark',
      attrs: { href: chapters[0].route, 'aria-label': profile.homeLabel },
      on: {
        click: (event) => {
          if (isModifiedClick(event)) return;
          event.preventDefault();
          onNavigate(0);
        },
      },
    },
    [
      el('img', {
        class: 'header__mark',
        attrs: { src: '/assets/favicon/favicon.svg', alt: '', width: 26, height: 26 },
      }),
      // Both are rendered and one is shown per breakpoint, so the wordmark never
      // has to reflow or re-measure when the viewport changes.
      el('span', { class: 'header__name header__name--full', text: profile.name }),
      el('span', { class: 'header__name header__name--short', text: profile.shortName }),
    ]
  );

  const links = chapters.map((chapter, index) =>
    el('a', {
      class: 'header__link',
      text: chapter.label,
      attrs: { href: chapter.route },
      dataset: { chapter: chapter.id },
      on: {
        click: (event) => {
          if (isModifiedClick(event)) return;
          event.preventDefault();
          onNavigate(index);
        },
      },
    })
  );

  const nav = el('nav', { class: 'header__nav', attrs: { 'aria-label': 'Sections' } }, links);

  const themeToggle = createThemeToggle({ store });
  const controls = el('div', { class: 'header__controls' }, [nav, themeToggle.element]);

  const progressBar = el('span', { class: 'header__progress-bar' });
  const progress = el(
    'span',
    { class: 'header__progress', attrs: { 'aria-hidden': 'true' } },
    progressBar
  );

  mount.replaceChildren(wordmark, controls, progress);

  function markCurrent(index) {
    links.forEach((link, linkIndex) => {
      const isCurrent = linkIndex === index;
      link.classList.toggle('header__link--current', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  markCurrent(store.get().chapterIndex);
  const unsubscribe = store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('chapterIndex')) markCurrent(state.chapterIndex);
  });

  const scroll = onScrollProgress((value) => {
    progressBar.style.setProperty('transform', `scaleX(${value})`);
  });

  return {
    destroy() {
      unsubscribe();
      scroll.destroy();
      themeToggle.destroy();
      mount.replaceChildren();
    },
  };
}
