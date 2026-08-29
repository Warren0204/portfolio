/* Experience.

   The role is stated once and stays on screen. Inside its card, a row of
   tokens switches one detail panel between an overview of the role and each
   of the three systems delivered in it. That replaces the old
   accordion-then-dialog arrangement, which put a recruiter two clicks and a
   modal away from the only thing they came to read, and the tab strip that
   later sat below the role card and read as a row of tags. Tokens keep every
   system one click deep, keep the page a sane length, and, unlike an
   accordion, never leave the reader scrolling past three collapsed headers
   wondering whether there is anything underneath.

   The overview is open on arrival: the role in its own words, with each
   system one tap away. */

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
const OVERVIEW_ID = 'overview';

/**
 * The role itself: what it was and where, then the token row and the panel it
 * drives, all in one card so the systems read as part of the role rather than
 * as a list underneath it.
 */
function createRoleCard(role, tokens, panel) {
  return el('div', { class: 'experience__role' }, [
    el('div', { class: 'experience__role-meta' }, [
      el('span', { class: 'experience__role-kind', text: role.kind }),
      el('span', { class: 'experience__rule', attrs: { 'aria-hidden': 'true' } }),
      el('span', { class: 'experience__role-period', text: role.period }),
    ]),
    el('h3', { class: 'experience__role-title', text: role.title }),
    el('p', { class: 'experience__role-org', text: role.organisation }),
    el('div', { class: 'experience__tokens' }, [
      el('p', {
        class: 'eyebrow eyebrow--muted experience__tokens-label',
        text: experienceCopy.systemsLine,
      }),
      tokens,
    ]),
    panel,
  ]);
}

/** The overview: the role in its own words, the NDA note, and what I was doing there. */
function createOverviewPanel(role) {
  return el('div', { class: 'system-detail' }, [
    el('p', { class: 'prose', text: role.summary }),
    role.disclosure
      ? el('aside', { class: 'experience__disclosure' }, [
          createSectionEyebrow({ text: role.disclosure.eyebrow, tone: 'accent' }),
          el('p', { class: 'experience__disclosure-body', text: role.disclosure.body }),
        ])
      : null,
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

  function show(id) {
    if (current) current.diagram?.destroy();

    if (id === OVERVIEW_ID) {
      current = { element: createOverviewPanel(role), diagram: null };
    } else {
      const index = role.systems.findIndex((system) => system.id === id);
      current = createSystemPanel(role.systems[index], {
        index: padCount(index + 1),
        total: padCount(total),
      });
    }

    replaceChildren(panel, current.element);
    panel.setAttribute('aria-labelledby', `tab-${PANEL_ID}-${id}`);

    // The panel just changed height by hundreds of pixels. Every trigger below
    // it on the page is now measuring against a layout that no longer exists.
    refreshTriggers();
  }

  const tabs = createTabs({
    items: [
      { id: OVERVIEW_ID, label: experienceCopy.overviewLabel },
      ...role.systems.map((system) => ({ id: system.id, label: system.tokenLabel })),
    ],
    selectedId: OVERVIEW_ID,
    onSelect: show,
    label: experienceCopy.systemsTabsLabel,
    panelId: PANEL_ID,
    variant: 'segmented',
  });

  show(OVERVIEW_ID);

  const head = createSectionHead({
    eyebrow: experienceCopy.eyebrow,
    heading: experienceCopy.heading,
    lead: experienceCopy.lead,
    headingId: 'experience-heading',
  });

  const roleCard = createRoleCard(role, tabs.element, panel);

  const element = el('div', { class: 'well experience' }, [head, roleCard]);

  let reveals = [];

  return {
    element,

    armReveal() {
      reveals = [
        revealOnScroll(Array.from(head.children), { trigger: head }),
        revealOnScroll(roleCard, { y: 30 }),
      ];
    },

    destroy() {
      tabs.destroy();
      if (current) current.diagram?.destroy();
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
