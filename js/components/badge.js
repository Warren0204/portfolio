/* Badge: a small outlined status label. Green carries meaning — in production,
   earned — so tone is a deliberate choice, never decoration. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.text
 * @param {'ok'|'accent'} [props.tone]
 * @returns {HTMLElement}
 */
export function createBadge({ text, tone = 'accent' }) {
  return el('span', { class: `badge badge--${tone}`, text });
}
