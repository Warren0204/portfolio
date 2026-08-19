/* Experience.

   The role is stated once and stays on screen; the three systems delivered
   inside it are a tab strip over one detail panel. That replaces the old
   accordion-then-dialog arrangement, which put a recruiter two clicks and a
   modal away from the only thing they came to read. Tabs keep every system one
   click deep, keep the page a sane length, and — unlike an accordion — never
   leave the reader scrolling past three collapsed headers wondering whether
   there is anything underneath.

   One system is open on arrival, because an empty panel with three unlabelled
   choices teaches nothing about what is in them. */

import { el, replaceChildren } from '../core/dom.js';
import { createBadge } from '../components/badge.js';
import { createBulletList } from '../components/bulletList.js';
import { createChip } from '../components/chip.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createSectionHead } from '../components/sectionHead.js';
import { createStatusDot } from '../components/statusDot.js';
import { createTabs } from '../components/tabs.js';
import { padCount } from '../core/format.js';
import { refreshTriggers, revealOnScroll } from '../core/animate.js';
import { diagrams, experienceCopy, roles } from '../data/experience.js';
import { createDiagram } from './experienceDiagram.js';

const { eyebrows } = experienceCopy;
const PANEL_ID = 'experience-system';

/** The role itself: what it was, where, and what I was doing there. */
function createRoleCard(role) {
  return el('div', { class: 'experience__role' }, [
    el('div', { class: 'experience__role-meta' }, [
      el('span', { class: 'experience__role-kind', text: role.kind }),
      el('span', { class: 'experience__rule', attrs: { 'aria-hidden': 'true' } }),
      el('span', { class: 'experience__role-period', text: role.period }),
    ]),
    el('h3', { class: 'experience__role-title', text: role.title }),
    el('p', { class: 'experience__role-org', text: role.organisation }),
    el('p', { class: 'prose experience__role-summary', text: role.summary }),
    el('div', { class: 'experience__role-tags' }, [
      createSectionEyebrow({ text: eyebrows.role, tone: 'accent' }),
      el(
        'div',
        { class: 'chip-row' },
        role.roles.map((name) => el('span', { class: 'chip chip--role', text: name }))
      ),
    ]),
  ]);
}

/**
 * One system, in full. Returns the diagram alongside the element so the caller
 * can destroy its ScrollTrigger when the panel is replaced — a scrubbed
 * timeline pointed at a detached element keeps recalculating forever.
 */
function createSystemPanel(system, position) {
  const diagram = system.diagram
    ? createDiagram(diagrams[system.diagram], system.diagramCaption)
    : null;

  const children = [
    el('div', { class: 'system-detail__head' }, [
      el('div', { class: 'system-detail__identity' }, [
        el('span', {
          class: 'system__number',
          text: `${experienceCopy.systemLabel} ${position.index}`,
        }),
        el('span', { class: 'system__of', text: `${experienceCopy.ofLabel} ${position.total}` }),
        createBadge({ text: experienceCopy.inProduction, tone: 'ok' }),
      ]),
      el('h4', { class: 'system-detail__title', text: system.title }),
      el('p', { class: 'system-detail__role', text: system.role }),
    ]),

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
        createSectionEyebrow({ text: eyebrows.stack }),
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

  if (diagram) children.push(diagram.element);

  children.push(
    el('div', { class: 'system-detail__status' }, [
      createStatusDot({ tone: 'ok' }),
      el('p', { class: 'prose', text: system.status }),
    ])
  );

  return { element: el('div', { class: 'system-detail' }, children), diagram };
}

/**
 * @returns {{ element: HTMLElement, armReveal: () => void, destroy: () => void }}
 */
export function createExperienceSection() {
  const role = roles[0];
  const total = role.systems.length;

  const panel = el('div', {
    class: 'experience__panel',
    attrs: { id: PANEL_ID, role: 'tabpanel', tabindex: '0' },
  });

  let current = null;

  function show(systemId) {
    if (current) current.diagram?.destroy();

    const index = role.systems.findIndex((system) => system.id === systemId);
    const system = role.systems[index];
    current = createSystemPanel(system, {
      index: padCount(index + 1),
      total: padCount(total),
    });

    replaceChildren(panel, current.element);
    panel.setAttribute('aria-labelledby', `tab-${PANEL_ID}-${systemId}`);

    // The panel just changed height by hundreds of pixels. Every trigger below
    // it on the page is now measuring against a layout that no longer exists.
    refreshTriggers();
  }

  const tabs = createTabs({
    items: role.systems.map((system, index) => ({
      id: system.id,
      label: `${padCount(index + 1)} · ${system.title}`,
    })),
    selectedId: role.systems[0].id,
    onSelect: show,
    label: experienceCopy.systemsTabsLabel,
    panelId: PANEL_ID,
  });

  show(role.systems[0].id);

  const head = createSectionHead({
    eyebrow: experienceCopy.eyebrow,
    heading: experienceCopy.heading,
    lead: experienceCopy.lead,
    headingId: 'experience-heading',
  });

  const roleCard = createRoleCard(role);

  const systemsHead = el('div', { class: 'experience__systems-head' }, [
    createSectionEyebrow({ text: experienceCopy.systemsEyebrow }),
    el('span', { class: 'experience__rule', attrs: { 'aria-hidden': 'true' } }),
    el('p', {
      class: 'eyebrow eyebrow--dim',
      text: `${total} ${experienceCopy.systemsCountSuffix}`,
    }),
  ]);

  const element = el('div', { class: 'well experience' }, [
    head,
    roleCard,
    el('div', { class: 'experience__systems' }, [systemsHead, tabs.element, panel]),
  ]);

  let reveals = [];

  return {
    element,

    armReveal() {
      reveals = [
        revealOnScroll(Array.from(head.children), { trigger: head }),
        revealOnScroll(roleCard, { y: 30 }),
        revealOnScroll([systemsHead, tabs.element], { trigger: systemsHead }),
      ];
    },

    destroy() {
      tabs.destroy();
      if (current) current.diagram?.destroy();
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
