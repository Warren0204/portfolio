/* The opening of a page section: a mono eyebrow, the heading, and one lead
   line. Extracted because four sections now share it — on a single scrolling
   page the heading is the only thing telling a reader they have crossed into
   new territory, so all four have to announce themselves identically. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.eyebrow
 * @param {string} props.heading
 * @param {string} props.lead
 * @param {string} [props.headingId] Wired to the section's aria-labelledby.
 * @returns {HTMLElement}
 */
export function createSectionHead({ eyebrow, heading, lead, headingId }) {
  return el('header', { class: 'section-head' }, [
    el('p', { class: 'eyebrow eyebrow--accent section-head__eyebrow', text: eyebrow }),
    el('h2', {
      class: 'section__heading section-head__heading',
      text: heading,
      attrs: { id: headingId || null },
    }),
    el('p', { class: 'section__lead section-head__lead', text: lead }),
  ]);
}
