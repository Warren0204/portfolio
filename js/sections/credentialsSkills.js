/* The Skills view: three labelled groups of compact chip panels. */

import { el } from '../core/dom.js';
import { createCard } from '../components/card.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { practices, platforms, skillsCopy, stack } from '../data/skills.js';

/* Order matches skillsCopy.groups: practices, then platforms, then stack. */
const GROUP_SETS = [practices, platforms, stack];

function createSkillPanels(groups) {
  return el(
    'div',
    { class: 'skills__grid' },
    groups.map((group) =>
      createCard({
        modifier: 'skill',
        children: [
          createSectionEyebrow({ text: group.title, tone: 'accent' }),
          group.note ? el('p', { class: 'skills__note', text: group.note }) : null,
          el(
            'div',
            { class: 'chip-row' },
            group.items.map((item) => el('span', { class: 'chip', text: item }))
          ),
        ],
      })
    )
  );
}

/** @returns {HTMLElement} */
export function createSkillsView() {
  return el(
    'div',
    { class: 'skills' },
    skillsCopy.groups.flatMap((group, index) => [
      createSectionEyebrow({ text: group.eyebrow, tone: 'muted' }),
      el('p', { class: 'skills__lead', text: group.lead }),
      createSkillPanels(GROUP_SETS[index]),
    ])
  );
}
