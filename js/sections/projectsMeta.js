/* The identity line every project opens with: its number in the list and what
   kind of project it is, a rule, then when. Shared by the case study and the
   compact card so the two read as one numbered list. The number comes from
   the array index, so reordering the data renumbers the page. Uppercasing is
   the stylesheet's job; the data stays sentence case. */

import { el } from '../core/dom.js';
import { padCount } from '../core/format.js';

/**
 * @param {object} project One entry from `projects` in js/data/projects.js.
 * @param {number} index Position in that array, zero based.
 * @returns {HTMLElement}
 */
export function createProjectMeta(project, index) {
  return el('div', { class: 'project__meta' }, [
    el('span', { class: 'project__tag', text: `${padCount(index + 1)} \u00b7 ${project.tag}` }),
    el('span', { class: 'project__rule', attrs: { 'aria-hidden': 'true' } }),
    el('span', { class: 'project__period', text: project.period }),
  ]);
}
