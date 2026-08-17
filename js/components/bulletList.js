/* Bullet list: a dot and a line of prose. Extracted once Projects, Experience,
   and the credentials tracks all needed the same thing. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {ReadonlyArray<string>} props.items
 * @returns {HTMLElement}
 */
export function createBulletList({ items }) {
  return el(
    'ul',
    { class: 'bullet-list' },
    items.map((item) =>
      el('li', { class: 'bullet-list__item' }, [
        el('span', { class: 'bullet-list__dot', attrs: { 'aria-hidden': 'true' } }),
        el('span', { class: 'bullet-list__text', text: item }),
      ])
    )
  );
}
