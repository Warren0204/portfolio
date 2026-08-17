/* The opened case study: problem and solution, the tabbed surface switcher,
   the stack, and the status. */

import { el, replaceChildren } from '../core/dom.js';
import { createBulletList } from '../components/bulletList.js';
import { createCard } from '../components/card.js';
import { createChip } from '../components/chip.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createStatusDot } from '../components/statusDot.js';
import { createStickyClose } from '../components/stickyClose.js';
import { createTabs } from '../components/tabs.js';
import { projectsCopy } from '../data/projects.js';

const { eyebrows } = projectsCopy;

function createSurfacePanel(project, tabsHolder) {
  const panelId = `surfaces-${project.id}`;
  const caption = el('p', { class: 'projects__surface-caption' });
  const list = el('div', { class: 'projects__surface-list' });

  function show(surfaceId) {
    const surface = project.surfaces.find((entry) => entry.id === surfaceId);
    caption.textContent = surface.caption;
    replaceChildren(list, createBulletList({ items: surface.items }));
  }

  const tabs = createTabs({
    items: project.surfaces.map((surface) => ({ id: surface.id, label: surface.label })),
    selectedId: project.surfaces[0].id,
    onSelect: show,
    label: eyebrows.surfaces,
    panelId,
    variant: 'inline',
  });

  // This panel is rebuilt every time the accordion opens, so release the
  // previous tab bar's key handler rather than accumulating them.
  if (tabsHolder.current) tabsHolder.current.destroy();
  tabsHolder.current = tabs;

  show(project.surfaces[0].id);

  return createCard({
    children: [
      createSectionEyebrow({ text: eyebrows.built }),
      tabs.element,
      el('div', { class: 'projects__surface', attrs: { id: panelId, role: 'tabpanel' } }, [
        caption,
        list,
      ]),
    ],
  });
}

function createStackCard(project) {
  return createCard({
    children: [
      createSectionEyebrow({ text: eyebrows.stack }),
      el(
        'div',
        { class: 'projects__stack' },
        project.stackGroups.map((group) =>
          el('div', { class: 'projects__stack-group' }, [
            createSectionEyebrow({ text: group.label, tone: 'accent' }),
            el(
              'div',
              { class: 'chip-row' },
              group.items.map((item) => createChip({ label: item }))
            ),
          ])
        )
      ),
    ],
  });
}

/**
 * @param {object} project
 * @param {{ current: object|null }} tabsHolder Holds the live tab bar so it can
 *   be released when the panel is rebuilt.
 * @param {() => void} onClose
 * @returns {HTMLElement}
 */
export function createCaseStudy(project, tabsHolder, onClose) {
  const problem = createCard({
    children: [
      createSectionEyebrow({ text: eyebrows.problem }),
      el('p', { class: 'prose', text: project.problem }),
      createSectionEyebrow({ text: eyebrows.solution }),
      el('p', { class: 'prose', text: project.impact }),
    ],
  });

  const status = createCard({
    children: [
      createSectionEyebrow({ text: eyebrows.status }),
      el('p', { class: 'projects__status' }, [
        createStatusDot({ tone: 'ok' }),
        el('span', { class: 'prose', text: project.status }),
      ]),
    ],
  });

  return el('div', { class: 'projects__case' }, [
    el('div', { class: 'projects__split' }, [problem, createSurfacePanel(project, tabsHolder)]),
    createStackCard(project),
    status,
    createStickyClose({
      label: projectsCopy.stickyCloseLabel,
      ariaLabel: projectsCopy.stickyCloseAria,
      onClick: onClose,
    }),
  ]);
}
