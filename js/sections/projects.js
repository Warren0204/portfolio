/* Projects. A list of case studies, each rendered open, plus compact cards for
   the smaller pieces. The section owns the heading and the scroll reveals;
   projectsCaseStudy.js and projectsCard.js own what a single entry looks like. */

import { el } from '../core/dom.js';
import { createSectionHead } from '../components/sectionHead.js';
import { revealOnScroll } from '../core/animate.js';
import { projects, projectsCopy } from '../data/projects.js';
import { createProjectCard } from './projectsCard.js';
import { createCaseStudy } from './projectsCaseStudy.js';

/**
 * @returns {{ element: HTMLElement, armReveal: () => void, destroy: () => void }}
 */
export function createProjectsSection() {
  const head = createSectionHead({
    eyebrow: projectsCopy.eyebrow,
    heading: projectsCopy.heading,
    lead: projectsCopy.lead,
    headingId: 'projects-heading',
  });

  // A compact entry is one card; everything else is a full case study.
  const studies = projects.map((project) =>
    project.kind === 'compact' ? createProjectCard(project) : createCaseStudy(project)
  );

  const element = el('div', { class: 'well projects' }, [
    head,
    el(
      'div',
      { class: 'projects__list' },
      studies.map((study) => study.element)
    ),
  ]);

  let reveals = [];

  return {
    element,

    /* Each block of the case study rises as it is reached, rather than the
       whole article arriving at once — a 2,000px article animated as one unit
       either starts before the reader can see it or finishes after they have
       read it. */
    armReveal() {
      reveals = [
        revealOnScroll(Array.from(head.children), { trigger: head }),
        ...studies.flatMap((study) =>
          study.blocks.map((block) => revealOnScroll(block, { y: 30, stagger: 0 }))
        ),
      ];
    },

    destroy() {
      studies.forEach((study) => study.destroy());
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
