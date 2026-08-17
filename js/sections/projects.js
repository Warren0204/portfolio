/* Projects. An accordion of case studies; currently one. The opened body is
   built by projectsCaseStudy.js; this module owns the list and its headers. */

import { el } from '../core/dom.js';
import { createAccordion } from '../components/accordion.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { projects, projectsCopy } from '../data/projects.js';
import { createCaseStudy } from './projectsCaseStudy.js';

const { eyebrows } = projectsCopy;

function createSummary(project) {
  return [
    el('span', { class: 'accordion__meta' }, [
      el('span', { class: 'accordion__tag', text: project.tag }),
      el('span', { class: 'accordion__rule', attrs: { 'aria-hidden': 'true' } }),
      el('span', { class: 'accordion__period', text: project.period }),
    ]),
    el('span', { class: 'accordion__title', text: project.title }),
    el('span', { class: 'accordion__lead', text: project.summary }),
    el('span', { class: 'accordion__roles' }, [
      createSectionEyebrow({ text: eyebrows.role, tone: 'accent' }),
      el(
        'span',
        { class: 'accordion__role-chips' },
        project.roles.map((role) => el('span', { class: 'chip chip--role', text: role }))
      ),
      el('span', { class: 'accordion__team', text: project.team }),
    ]),
  ];
}

/**
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createProjectsSection() {
  const tabsHolder = { current: null };

  const accordions = projects.map((project) => {
    const accordion = createAccordion({
      summary: createSummary(project),
      openLabel: projectsCopy.openLabel,
      closeLabel: projectsCopy.closeLabel,
      renderPanel: () => createCaseStudy(project, tabsHolder, () => accordion.toggle()),
    });
    return accordion;
  });

  const element = el('div', { class: 'well projects' }, [
    el('h2', { class: 'section__heading', text: projectsCopy.heading }),
    el('p', { class: 'section__lead', text: projectsCopy.lead }),
    el(
      'div',
      { class: 'projects__list' },
      accordions.map((accordion) => accordion.element)
    ),
  ]);

  function releaseTabs() {
    if (tabsHolder.current) tabsHolder.current.destroy();
    tabsHolder.current = null;
  }

  return {
    element,

    /* Leaving the chapter collapses every case study, so coming back shows the
       list again rather than wherever the visitor happened to stop reading. */
    reset() {
      accordions.forEach((accordion) => accordion.close());
      releaseTabs();
    },

    destroy: releaseTabs,
  };
}
