/* The theme switch. Light is the default; the choice persists and is the only
   input — a system dark-mode preference deliberately does not override it. */

import { el } from '../core/dom.js';
import { local } from '../core/storage.js';
import { STORAGE_KEYS, THEMES } from '../core/constants.js';
import { profile } from '../data/profile.js';

/** @returns {string} the persisted theme, or light when nothing is stored. */
export function readStoredTheme() {
  const stored = local.read(STORAGE_KEYS.theme);
  return stored === THEMES.dark ? THEMES.dark : THEMES.light;
}

/** Apply a theme to the document and persist it. */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
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
