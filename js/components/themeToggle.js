/* The theme switch.

   Precedence: an explicit choice always wins, and until one is made the site
   opens dark.

   Dark is the default by decision, not by detection. The site was built
   dark-first — the ambient wash, the brand glow behind the portrait, and the
   diagram draw-on were all composed against the deep ground — and that is the
   version a first-time visitor should meet. The previous behaviour followed
   `prefers-color-scheme`, which meant roughly half of all arrivals saw the
   weaker of the two designs before they saw the better one.

   The trade-off is real and worth naming: a visitor who has set their whole
   machine to light gets dark anyway. The switch is in the header on every
   screen size, and the moment they touch it their choice is stored and
   outranks this default forever after. */

import { el } from '../core/dom.js';
import { local } from '../core/storage.js';
import { STORAGE_KEYS, THEMES } from '../core/constants.js';
import { profile } from '../data/profile.js';

/** @returns {string} the persisted choice, or dark on a first visit. */
export function readStoredTheme() {
  const stored = local.read(STORAGE_KEYS.theme);
  if (stored === THEMES.dark || stored === THEMES.light) return stored;
  return THEMES.dark;
}

/** Apply a theme to the document. Does not persist — see persistTheme. */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

/* Internal. Called from exactly one place — the toggle click — because that
   click is the only moment a preference has actually been expressed. */
function persistTheme(theme) {
  local.write(STORAGE_KEYS.theme, theme);
}

/**
 * Components that register nothing global return a node; this one subscribes to
 * the store, so it hands its owner the way to release that subscription.
 *
 * @param {object} options
 * @param {ReturnType<import('../core/store.js').createStore>} options.store
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createThemeToggle({ store }) {
  const label = el('span', {
    class: 'header__theme-label',
    attrs: { 'aria-hidden': 'true' },
  });

  const track = el(
    'span',
    { class: 'header__theme-track', attrs: { 'aria-hidden': 'true' } },
    el('span', { class: 'header__theme-thumb' })
  );

  const button = el(
    'button',
    {
      class: 'header__theme target',
      attrs: {
        type: 'button',
        role: 'switch',
        'aria-label': profile.themeToggleLabel,
      },
      on: {
        click: () => {
          const next = store.get().theme === THEMES.dark ? THEMES.light : THEMES.dark;
          // Written here and nowhere else: this click is the only moment the
          // visitor has actually expressed a preference.
          persistTheme(next);
          store.set({ theme: next });
        },
      },
    },
    [label, track]
  );

  function render(theme) {
    const isLight = theme === THEMES.light;
    button.setAttribute('aria-checked', String(isLight));
    label.textContent = isLight ? profile.themeLabels.light : profile.themeLabels.dark;
  }

  render(store.get().theme);
  const unsubscribe = store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('theme')) render(state.theme);
  });

  return { element: button, destroy: unsubscribe };
}
