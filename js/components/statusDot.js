/* Status dot. Green carries meaning — in production, earned — and never
   decoration. Blue is the working accent. The stagger is the one genuinely
   dynamic value, so it is the one thing set inline. */

import { el } from '../core/dom.js';

/**
 * @param {object} [props]
 * @param {'ok'|'accent'} [props.tone]
 * @param {number} [props.delaySeconds] Negative values start mid-cycle, which
 *   is what makes a row of dots breathe out of phase instead of in unison.
 * @returns {HTMLElement}
 */
export function createStatusDot({ tone = 'ok', delaySeconds = 0 } = {}) {
  return el('span', {
    class: `status-dot status-dot--${tone}`,
    attrs: { 'aria-hidden': 'true' },
    style: delaySeconds ? { 'animation-delay': `${delaySeconds}s` } : {},
  });
}
