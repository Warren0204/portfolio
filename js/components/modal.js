/* The project's one dialog. The system detail and the certificate zoom are the
   same component with a modifier. Backdrop click, the close control, and Escape
   all dismiss it; focus is trapped while open and restored on close; the page
   behind it cannot scroll. */

import { el, on } from '../core/dom.js';
import { trapFocus } from '../core/focusTrap.js';

/* Only one dialog is ever open. Tracking it lets navigation dismiss whatever
   is showing without every caller having to hold on to its handle. */
let activeModal = null;

/** Dismiss the open dialog, if there is one. */
export function closeActiveModal() {
  if (activeModal) activeModal.destroy();
}

/**
 * @param {object} props
 * @param {string} props.label Accessible name for the dialog.
 * @param {Node} props.header Content of the top bar, including the close control.
 * @param {Node} props.body Scrolling content.
 * @param {() => void} props.onClose
 * @param {'panel'|'zoom'} [props.variant]
 * @param {HTMLElement} [props.mount] Where the dialog is attached.
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createModal({
  label,
  header,
  body,
  onClose,
  variant = 'panel',
  mount = document.body,
}) {
  const dialog = el(
    'div',
    {
      class: `modal__dialog modal__dialog--${variant}`,
      attrs: {
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': label,
        tabindex: '-1',
        // The panel is content edge to edge, so the whole dialog is live.
        // The zoom is a lit image on empty ground, and that ground dismisses,
        // so only its controls and the image itself opt out.
        'data-modal-keep': variant === 'panel' ? '' : null,
      },
    },
    [
      el('div', { class: 'modal__header', attrs: { 'data-modal-keep': '' } }, header),
      el('div', { class: 'modal__body' }, body),
    ]
  );

  const backdrop = el(
    'div',
    {
      class: `modal modal--${variant}`,
      on: {
        click: (event) => {
          // Anything outside a kept region is dead space, and clicking dead
          // space is how people expect to leave a lightbox.
          if (!event.target.closest('[data-modal-keep]')) onClose();
        },
      },
    },
    dialog
  );

  const stopKeydown = on(backdrop, 'keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
  });

  // Attach before trapping: focus cannot move into a detached subtree, and
  // offsetParent-based visibility checks read every node as hidden there.
  mount.appendChild(backdrop);
  const trap = trapFocus(dialog);
  document.body.classList.add('is-modal-open');

  const api = {
    element: backdrop,
    destroy() {
      if (activeModal === api) activeModal = null;
      stopKeydown();
      trap.release();
      document.body.classList.remove('is-modal-open');
      backdrop.remove();
    },
  };

  activeModal = api;
  return api;
}
