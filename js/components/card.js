/* Card: the project's one surface panel. It renders as a div, a link, or a
   button depending on whether it does anything when clicked — an interactive
   card must be a real control, not a div with a handler. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {Array|Node} props.children
 * @param {string} [props.href] Renders an anchor.
 * @param {() => void} [props.onClick] Renders a button.
 * @param {string} [props.ariaLabel] Required when the visible text is not a
 *   sufficient accessible name.
 * @param {string} [props.modifier] Adds card--<modifier>.
 * @returns {HTMLElement}
 */
export function createCard({ children, href, onClick, ariaLabel, modifier }) {
  const classes = ['card'];
  if (modifier) classes.push(`card--${modifier}`);

  if (href) {
    classes.push('card--interactive');
    return el(
      'a',
      { class: classes.join(' '), attrs: { href, 'aria-label': ariaLabel || null } },
      children
    );
  }

  if (onClick) {
    classes.push('card--interactive');
    return el(
      'button',
      {
        class: classes.join(' '),
        attrs: { type: 'button', 'aria-label': ariaLabel || null },
        on: { click: onClick },
      },
      children
    );
  }

  return el('div', { class: classes.join(' ') }, children);
}
