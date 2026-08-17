/* Focus containment for dialogs. Keeps Tab inside the dialog while it is open
   and returns focus to whatever opened it, so keyboard users are never dropped
   back at the top of the document. */

import { on } from './dom.js';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function focusableWithin(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (node) => node.offsetParent !== null || node === document.activeElement
  );
}

/**
 * @param {HTMLElement} container
 * @returns {{ release: () => void }}
 */
export function trapFocus(container) {
  const previouslyFocused = document.activeElement;

  const stopKeydown = on(container, 'keydown', (event) => {
    if (event.key !== 'Tab') return;

    const focusable = focusableWithin(container);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !container.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const initial = focusableWithin(container)[0] || container;
  initial.focus();

  return {
    release() {
      stopKeydown();
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    },
  };
}
