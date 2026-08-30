/* One project as a compact card: for work that is real but small, such as a
   guided project, where a full case study would be padding. It shares the
   card shell and the identity line of the case study so the two read as one
   set, and says the rest in one surface: what it was, what it was built on,
   then a footer row with where it stands and where to open it. */

import { el } from '../core/dom.js';
import { createBadge } from '../components/badge.js';
import { createChip } from '../components/chip.js';
import { createIcon } from '../components/icon.js';
import { createProjectMeta } from './projectsMeta.js';

/**
 * @param {object} project One entry from `projects` in js/data/projects.js
 *   with `kind: 'compact'`.
 * @returns {{ element: HTMLElement, blocks: HTMLElement[], destroy: () => void }}
 *   The same shape as createCaseStudy, so the section treats both alike.
 */
export function createProjectCard(project) {
  const links = el(
    'p',
    { class: 'project__links' },
    project.links.map((link) =>
      el(
        'a',
        {
          class: 'project__link',
          attrs: {
            href: link.href,
            target: link.external ? '_blank' : null,
            rel: link.external ? 'noopener noreferrer' : null,
          },
        },
        [link.label, link.external ? createIcon('external', 14, { inline: true }) : null]
      )
    )
  );

  const card = el('div', { class: 'card' }, [
    createProjectMeta(project),
    el('h3', { class: 'project__title', text: project.title }),
    el('p', { class: 'project__summary', text: project.summary }),
    el('p', { class: 'project__context', text: project.context }),
    el(
      'div',
      { class: 'chip-row' },
      project.tags.map((tag) => createChip({ label: tag }))
    ),
    // The footer closes the card: where it stands on the left, the way in on
    // the right. The badge qualifies everything above it and the link leaves
    // the page, so the thing that sends a reader away is last in the row.
    el('div', { class: 'project__footer' }, [
      createBadge({ text: project.status.text, tone: project.status.tone }),
      links,
    ]),
  ]);

  const element = el('article', { class: 'project project--compact' }, card);

  return { element, blocks: [element], destroy() {} };
}
