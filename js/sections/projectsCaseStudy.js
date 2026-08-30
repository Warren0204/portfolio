/* One project, as a case study a recruiter can read top to bottom: what it was
   and who it was for, the problem, what we did about it, what got built on each
   surface, what it was built with, and where it stands.

   Nothing here is behind a disclosure any more. The old version put the entire
   study behind an "open case study" button, which meant the page's strongest
   evidence rendered as a single collapsed row — an eight-second skim came away
   with a title and nothing else.

   The study sits in the same card shell as the compact card, so every project
   is one bounded object with the same identity line, and it closes with its
   status block behind a hairline. On a phone a slim identity strip stays under
   the header while the card scrolls, because a long run of open blocks
   otherwise gives no clue what they belong to. */

import { el, replaceChildren } from '../core/dom.js';
import { createBulletList } from '../components/bulletList.js';
import { createChip } from '../components/chip.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createStatusDot } from '../components/statusDot.js';
import { createTabs } from '../components/tabs.js';
import { refreshTriggers } from '../core/animate.js';
import { projectsCopy } from '../data/projects.js';
import { createProjectMeta } from './projectsMeta.js';

const { eyebrows } = projectsCopy;

/** Identity: the strip, what it is called, and my part in it. */
function createHeader(project) {
  return el('header', { class: 'project__header' }, [
    createProjectMeta(project),
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
  const panel = el(
    'div',
    { class: 'project__surface', attrs: { id: panelId, role: 'tabpanel', tabindex: '0' } },
    [caption, list]
  );

  function show(surfaceId) {
    const surface = project.surfaces.find((entry) => entry.id === surfaceId);
    // Named by whichever token opened it, as the Experience and Credentials
    // panels are; the panel takes focus, so it needs a name to announce.
    panel.setAttribute('aria-labelledby', `tab-${panelId}-${surfaceId}`);
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
    variant: 'segmented',
  });

  show(project.surfaces[0].id);

  const element = el('div', { class: 'project__surfaces' }, [
    createSectionEyebrow({ text: eyebrows.built }),
    tabs.element,
    panel,
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
          // No marks here. This block is an inventory, and only the labels that
          // happen to be in the logo map would carry one, which singles them out
          // for a reason a reader cannot infer.
          el(
            'div',
            { class: 'chip-row' },
            group.items.map((item) => createChip({ label: item, mark: false }))
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

  // The footer closes the card behind a hairline, so the study visibly ends
  // before whatever comes next.
  const footer = el('div', { class: 'project__footer' }, status);

  const blocks = [header, narrative, surfaces.element, stack, footer];

  // Phones only, see projects.css: stays under the header while the card
  // scrolls and leaves with the card. Not a block, so it never animates.
  const strip = el('p', {
    class: 'project__strip eyebrow eyebrow--muted',
    text: `${project.title} · ${project.tag}`,
  });

  return {
    element: el('article', { class: 'project' }, el('div', { class: 'card' }, [strip, ...blocks])),
    blocks,
    destroy: surfaces.destroy,
  };
}
