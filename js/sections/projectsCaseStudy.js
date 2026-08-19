/* One project, as a case study a recruiter can read top to bottom: what it was
   and who it was for, the problem, what we did about it, what got built on each
   surface, what it was built with, and where it stands.

   Nothing here is behind a disclosure any more. The old version put the entire
   study behind an "open case study" button, which meant the page's strongest
   evidence rendered as a single collapsed row — an eight-second skim came away
   with a title and nothing else. */

import { el, replaceChildren } from '../core/dom.js';
import { createBulletList } from '../components/bulletList.js';
import { createChip } from '../components/chip.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createStatusDot } from '../components/statusDot.js';
import { createTabs } from '../components/tabs.js';
import { refreshTriggers } from '../core/animate.js';
import { projectsCopy } from '../data/projects.js';

const { eyebrows } = projectsCopy;

/** Identity: what kind of project, when, what it is called, and my part in it. */
function createHeader(project) {
  return el('header', { class: 'project__header' }, [
    el('div', { class: 'project__meta' }, [
      el('span', { class: 'project__tag', text: project.tag }),
      el('span', { class: 'project__rule', attrs: { 'aria-hidden': 'true' } }),
      el('span', { class: 'project__period', text: project.period }),
    ]),
    el('h3', { class: 'project__title', text: project.title }),
    el('p', { class: 'project__summary', text: project.summary }),
    el('div', { class: 'project__roles' }, [
      createSectionEyebrow({ text: eyebrows.role, tone: 'accent' }),
      el(
        'div',
        { class: 'chip-row' },
        project.roles.map((role) => el('span', { class: 'chip chip--role', text: role }))
      ),
      el('span', { class: 'project__team', text: project.team }),
    ]),
  ]);
}

/* Problem beside solution, because the whole claim of a case study is that the
   second one answers the first. Stacked on a phone, side by side above 900px. */
function createNarrative(project) {
  return el('div', { class: 'project__narrative' }, [
    el('div', { class: 'project__narrative-column' }, [
      createSectionEyebrow({ text: eyebrows.problem }),
      el('p', { class: 'prose', text: project.problem }),
    ]),
    el('div', { class: 'project__narrative-column' }, [
      createSectionEyebrow({ text: eyebrows.solution }),
      el('p', { class: 'prose', text: project.impact }),
    ]),
  ]);
}

/**
 * The surface switcher. One platform, three faces — showing all three at once
 * reads as one undifferentiated feature list, which is exactly the confusion
 * the tabs exist to remove.
 */
function createSurfaces(project) {
  const panelId = `surfaces-${project.id}`;
  const caption = el('p', { class: 'project__surface-caption' });
  const list = el('div', { class: 'project__surface-list' });

  function show(surfaceId) {
    const surface = project.surfaces.find((entry) => entry.id === surfaceId);
    caption.textContent = surface.caption;
    replaceChildren(list, createBulletList({ items: surface.items }));
    refreshTriggers();
  }

  const tabs = createTabs({
    items: project.surfaces.map((surface) => ({ id: surface.id, label: surface.label })),
    selectedId: project.surfaces[0].id,
    onSelect: show,
    label: eyebrows.surfaces,
    panelId,
  });

  show(project.surfaces[0].id);

  const element = el('div', { class: 'project__surfaces' }, [
    createSectionEyebrow({ text: eyebrows.built }),
    tabs.element,
    el(
      'div',
      {
        class: 'project__surface',
        attrs: { id: panelId, role: 'tabpanel', tabindex: '0' },
      },
      [caption, list]
    ),
  ]);

  return { element, destroy: tabs.destroy };
}

function createStack(project) {
  return el('div', { class: 'project__stack' }, [
    createSectionEyebrow({ text: eyebrows.stack }),
    el(
      'div',
      { class: 'project__stack-groups' },
      project.stackGroups.map((group) =>
        el('div', { class: 'project__stack-group' }, [
          createSectionEyebrow({ text: group.label, tone: 'accent' }),
          el(
            'div',
            { class: 'chip-row' },
            group.items.map((item) => createChip({ label: item }))
          ),
        ])
      )
    ),
  ]);
}

/**
 * @param {object} project One entry from `projects` in js/data/projects.js.
 * @returns {{ element: HTMLElement, blocks: HTMLElement[], destroy: () => void }}
 *   `blocks` are the pieces the section staggers in on scroll.
 */
export function createCaseStudy(project) {
  const header = createHeader(project);
  const narrative = createNarrative(project);
  const surfaces = createSurfaces(project);
  const stack = createStack(project);

  const status = el('div', { class: 'project__status' }, [
    createStatusDot({ tone: 'ok' }),
    el('div', {}, [
      createSectionEyebrow({ text: eyebrows.status }),
      el('p', { class: 'prose', text: project.status }),
    ]),
  ]);

  const blocks = [header, narrative, surfaces.element, stack, status];

  return {
    element: el('article', { class: 'project' }, blocks),
    blocks,
    destroy: surfaces.destroy,
  };
}
