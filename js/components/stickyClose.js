/* The pill close control that follows an open panel down the page, so a long
   case study can always be closed without scrolling back to its header. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.ariaLabel
 * @param {() => void} props.onClick
 * @returns {HTMLElement}
 */
export function createStickyClose({ label, ariaLabel, onClick }) {
  return el(
    'div',
    { class: 'sticky-close' },
    el(
      'button',
      {
        class: 'sticky-close__button',
        attrs: { type: 'button', 'aria-label': ariaLabel },
        on: { click: onClick },
      },
      [
        el('span', {
          class: 'sticky-close__chevron',
          text: '›',
          attrs: { 'aria-hidden': 'true' },
        }),
        el('span', { text: label }),
      ]
    )
  );
}
