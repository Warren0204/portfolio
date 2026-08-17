/* The system detail dialog opened from an Experience system card. */

import { el } from '../core/dom.js';
import { createBadge } from '../components/badge.js';
import { createBulletList } from '../components/bulletList.js';
import { createChip } from '../components/chip.js';
import { createModal } from '../components/modal.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createStatusDot } from '../components/statusDot.js';
import { attendanceDiagram, experienceCopy } from '../data/experience.js';
import { createDiagram } from './experienceDiagram.js';

const { eyebrows } = experienceCopy;

function createBody(system) {
  const children = [
    el('div', { class: 'system-detail__head' }, [
      createStatusDot({ tone: 'ok' }),
      el('h3', { class: 'system-detail__title', text: system.title }),
    ]),
    el('p', { class: 'system-detail__role', text: system.role }),
    el('div', { class: 'system-detail__grid' }, [
      el('div', { class: 'system-detail__column' }, [
        createSectionEyebrow({ text: eyebrows.problem }),
        el('p', { class: 'prose', text: system.problem }),
        createSectionEyebrow({ text: eyebrows.solution }),
        el('p', { class: 'prose', text: system.impact }),
      ]),
      el('div', { class: 'system-detail__column' }, [
        createSectionEyebrow({ text: eyebrows.built }),
        createBulletList({ items: system.built }),
        el(
          'div',
          { class: 'chip-row' },
          system.stack.map((tool) => createChip({ label: tool }))
        ),
      ]),
    ]),
  ];

  if (system.notes) {
    children.push(
      el('div', { class: 'system-detail__notes' }, [
        createSectionEyebrow({ text: eyebrows.notes }),
        el('p', { class: 'prose', text: system.notes }),
      ])
    );
  }

  if (system.diagram) {
    children.push(createDiagram(attendanceDiagram, system.diagramCaption));
  }

  children.push(
    el('div', { class: 'system-detail__status' }, [
      createSectionEyebrow({ text: eyebrows.status }),
      el('p', { class: 'prose', text: system.status }),
    ])
  );

  return el('div', { class: 'system-detail' }, children);
}

function createHeader(system, position, close) {
  return el('div', { class: 'modal__bar' }, [
    el('span', { class: 'system__number', text: `${experienceCopy.systemLabel} ${position.index}` }),
    el('span', { class: 'system__of', text: `${experienceCopy.ofLabel} ${position.total}` }),
    createBadge({ text: experienceCopy.inProduction, tone: 'ok' }),
    el(
      'button',
      {
        class: 'modal__close',
        attrs: { type: 'button', 'aria-label': experienceCopy.modalCloseAria },
        on: { click: close },
      },
      [
        el('span', { text: '✕', attrs: { 'aria-hidden': 'true' } }),
        el('span', { text: experienceCopy.closeLabel }),
      ]
    ),
  ]);
}

/**
 * @param {object} system
 * @param {{ index: string, total: string }} position Padded display numbers.
 */
export function openSystemModal(system, position) {
  let modal = null;
  const close = () => modal.destroy();

  modal = createModal({
    label: experienceCopy.modalLabel,
    header: createHeader(system, position, close),
    body: createBody(system),
    onClose: close,
  });
}
