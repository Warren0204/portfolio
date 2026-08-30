/* The identity line every project opens with: what kind of project it is, a
   rule, then when. Shared by the case study and the compact card so the two
   read as one set.

   The chip used to open with a zero-padded number taken from the array index.
   Two cards are not a sequence, so the number carried no information and it is
   gone, along with the middot that separated it. Uppercasing is the
   stylesheet's job; the data stays sentence case. */

import { el } from '../core/dom.js';

/**
 * @param {object} project One entry from `projects` in js/data/projects.js.
 * @returns {HTMLElement}
 */
export function createProjectMeta(project) {
  return el('div', { class: 'project__meta' }, [
    el('span', { class: 'project__tag', text: project.tag }),
    el('span', { class: 'project__rule', attrs: { 'aria-hidden': 'true' } }),
    el('span', { class: 'project__period', text: project.period }),
  ]);
}
