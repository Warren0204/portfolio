/* The theme switch.

   Precedence: an explicit choice always wins, and until one is made the
   visitor's system preference decides. Previously light was hard-coded as the
   default and the system was ignored entirely, so someone whose whole machine
   is dark was handed a bright page and had to fix it by hand.

   The choice is only written on an actual click. Persisting on every apply —
   which the first version did — would save the system-derived value on the
   first page load and freeze it, making the preference a one-time reading
   rather than something that keeps following the system. */

import { el } from '../core/dom.js';
import { local } from '../core/storage.js';
import { STORAGE_KEYS, THEMES } from '../core/constants.js';
import { profile } from '../data/profile.js';

/** @returns {string} the visitor's system preference. */
function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.dark : THEMES.light;
}

/** @returns {string} the persisted choice, or the system preference. */
export function readStoredTheme() {
  const stored = local.read(STORAGE_KEYS.theme);
  if (stored === THEMES.dark || stored === THEMES.light) return stored;
  return systemTheme();
}

/** Apply a theme to the document. Does not persist — see persistTheme. */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

/** Remember an explicit choice, so it outranks the system from now on. */
export function persistTheme(theme) {
  local.write(STORAGE_KEYS.theme, theme);
}

/**
 * Follow the system while the visitor has never chosen. Someone who switches
 * their machine to dark at sunset should not have to reload this page.
 *
 * @param {(theme: string) => void} onChange
 * @returns {() => void} unsubscribe
 */
export function onSystemThemeChange(onChange) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    if (local.read(STORAGE_KEYS.theme)) return;
    onChange(systemTheme());
  };
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
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
