/* Experience. An accordion of roles; inside an open role, the delivered systems
   are a grid of cards, and each card opens the system detail dialog. */

import { el } from '../core/dom.js';
import { createAccordion } from '../components/accordion.js';
import { createBadge } from '../components/badge.js';
import { createCard } from '../components/card.js';
import { logoPathFor } from '../components/chip.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createStickyClose } from '../components/stickyClose.js';
import { padCount } from '../core/format.js';
import { experienceCopy, roles } from '../data/experience.js';
import { openSystemModal } from './experienceSystemModal.js';

const { eyebrows } = experienceCopy;

/* The first few product marks, as a visual signature for the card. */
function createStackMarks(system) {
  return system.stack
    .slice(0, 4)
    .map(logoPathFor)
    .filter(Boolean)
    .map((src) =>
      el('img', {
        class: 'chip__logo',
        attrs: { src, alt: '', 'aria-hidden': 'true', loading: 'lazy', width: 22, height: 22 },
      })
    );
}

function createSystemCard(system, position, onOpen) {
  return createCard({
    modifier: 'system',
    onClick: onOpen,
    ariaLabel: `Open system details: ${system.title}`,
    children: [
      el('span', { class: 'system__meta' }, [
        el('span', {
          class: 'system__number',
          text: `${experienceCopy.systemLabel} ${position.index}`,
        }),
        el('span', { class: 'system__of', text: `${experienceCopy.ofLabel} ${position.total}` }),
        createBadge({ text: experienceCopy.inProduction, tone: 'ok' }),
      ]),
      el('span', { class: 'system__title', text: system.title }),
      el('span', { class: 'system__role', text: system.role }),
      el('span', { class: 'system__teaser', text: system.summary }),
      el('span', { class: 'system__footer' }, [
        el('span', { class: 'system__marks' }, createStackMarks(system)),
        el('span', { class: 'system__open' }, [
          experienceCopy.openLabel,
          el('span', { text: '›', attrs: { 'aria-hidden': 'true' } }),
        ]),
      ]),
    ],
  });
}

function createRolePanel(role, onClose) {
  const total = role.systems.length;

  return el('div', { class: 'experience__panel' }, [
    el('div', { class: 'experience__systems-head' }, [
      createSectionEyebrow({ text: experienceCopy.systemsEyebrow }),
      el('span', { class: 'experience__rule', attrs: { 'aria-hidden': 'true' } }),
      el('p', {
        class: 'eyebrow eyebrow--dim',
        text: `${total} ${experienceCopy.systemsCountSuffix}`,
      }),
    ]),
    el(
      'div',
      { class: 'experience__systems' },
      role.systems.map((system, index) => {
        const position = { index: padCount(index + 1), total: padCount(total) };
        return createSystemCard(system, position, () => openSystemModal(system, position));
      })
    ),
    createStickyClose({
      label: experienceCopy.stickyCloseLabel,
      ariaLabel: experienceCopy.stickyCloseAria,
      onClick: onClose,
    }),
  ]);
}

function createRoleSummary(role) {
  return [
    el('span', { class: 'accordion__meta' }, [
      el('span', { class: 'accordion__tag', text: role.kind }),
      el('span', { class: 'accordion__rule', attrs: { 'aria-hidden': 'true' } }),
      el('span', { class: 'accordion__period', text: role.period }),
    ]),
    el('span', { class: 'accordion__title', text: role.title }),
    el('span', { class: 'accordion__org', text: role.organisation }),
    el('span', { class: 'accordion__lead', text: role.summary }),
    el('span', { class: 'accordion__roles' }, [
      createSectionEyebrow({ text: eyebrows.role, tone: 'accent' }),
      el(
        'span',
        { class: 'accordion__role-chips' },
        role.roles.map((name) => el('span', { class: 'chip chip--role', text: name }))
      ),
    ]),
  ];
}

/**
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createExperienceSection() {
  const accordions = roles.map((role) => {
    const accordion = createAccordion({
      summary: createRoleSummary(role),
      openLabel: experienceCopy.openRoleLabel,
      closeLabel: experienceCopy.closeRoleLabel,
      renderPanel: () => createRolePanel(role, () => accordion.toggle()),
    });
    return accordion;
  });

  const element = el('div', { class: 'well experience' }, [
    el('h2', { class: 'section__heading', text: experienceCopy.heading }),
    el('p', { class: 'section__lead', text: experienceCopy.lead }),
    el(
      'div',
      { class: 'experience__list' },
      accordions.map((accordion) => accordion.element)
    ),
  ]);

  return {
    element,

    /* Leaving the chapter collapses every role, matching Projects. */
    reset() {
      accordions.forEach((accordion) => accordion.close());
    },

    destroy() {},
  };
}
