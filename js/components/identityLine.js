/* The row a card opens with: what kind of thing this is, a rule, then when it
   ran. The Experience role card and both project cards use it, so the three
   read as one row instead of two near-identical ones that drift apart the next
   time only one of them gets a phone override.

   The chip used to open with a zero-padded number taken from the array index.
   Two cards are not a sequence, so the number carried no information and it is
   gone, along with the middot that separated it. Uppercasing is the
   stylesheet's job; the data stays sentence case. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.kind What sort of thing the card describes.
 * @param {string} props.period When it ran.
 * @returns {HTMLElement}
 */
export function createIdentityLine({ kind, period }) {
  return el('div', { class: 'identity-line' }, [
    el('span', { class: 'identity-line__kind', text: kind }),
    el('span', { class: 'identity-line__rule', attrs: { 'aria-hidden': 'true' } }),
    el('span', { class: 'identity-line__period', text: period }),
  ]);
}
