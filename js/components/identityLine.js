/* The row a card opens with: what kind of thing this is, a rule, then when it
   ran. The Experience role card and both project cards use it, so the three
   read as one row instead of two near-identical ones that drift apart the next
   time only one of them gets a phone override.

   The chip used to open with a zero-padded number taken from the array index.
   Two cards are not a sequence, so the number carried no information and it is
   gone, along with the middot that separated it. Uppercasing is the
   stylesheet's job; the data stays sentence case.

   The period is optional. Not every card is dated — a self-directed piece with
   no delivery window has nothing honest to put there — so an entry that omits
   it drops the date span and nothing else. The rule is already the row's only
   flexible item, so it takes the freed space and runs to the card's edge; there
   is no stub left where the date was and no trailing gap. Dropping the rule too
   would have left a lone chip and made the undated cards read as a different
   component, which is the opposite of why this file exists. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.kind What sort of thing the card describes.
 * @param {string} [props.period] When it ran. Omit for an undated card; the
 *   rule then fills the row on its own.
 * @returns {HTMLElement}
 */
export function createIdentityLine({ kind, period }) {
  /* Blank and whitespace-only are the same as absent: a date is either there
     or it is not, and an empty string would otherwise render as a period
     element of zero width that still claims its gap. */
  const dated = typeof period === 'string' && period.trim() !== '';

  return el('div', { class: 'identity-line' }, [
    el('span', { class: 'identity-line__kind', text: kind }),
    el('span', { class: 'identity-line__rule', attrs: { 'aria-hidden': 'true' } }),
    dated ? el('span', { class: 'identity-line__period', text: period }) : null,
  ]);
}
