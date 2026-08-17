/* The process diagram block: a caption and the control that reveals the
   drawing. One-off, so it lives beside its section rather than in components/. */

import { el } from '../core/dom.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { experienceCopy } from '../data/experience.js';
import { createDiagramSvg } from './experienceDiagramSvg.js';

/**
 * @param {object} spec The diagram data.
 * @param {string} caption
 * @returns {HTMLElement}
 */
export function createDiagram(spec, caption) {
  const figure = el('div', { class: 'diagram__figure', attrs: { hidden: '' } }, [
    el('div', { class: 'diagram__scroll' }, createDiagramSvg(spec)),
    el('p', { class: 'eyebrow eyebrow--dim', text: spec.scrollHint }),
  ]);

  const label = el('span', { text: experienceCopy.diagramShow });

  const toggle = el(
    'button',
    {
      class: 'button button--primary diagram__toggle',
      attrs: { type: 'button', 'aria-expanded': 'false' },
      on: {
        click: () => {
          const opening = figure.hasAttribute('hidden');
          toggle.setAttribute('aria-expanded', String(opening));
          toggle.classList.toggle('diagram__toggle--open', opening);
          label.textContent = opening ? experienceCopy.diagramHide : experienceCopy.diagramShow;
          if (opening) figure.removeAttribute('hidden');
          else figure.setAttribute('hidden', '');
        },
      },
    },
    [el('span', { class: 'diagram__chevron', text: '›', attrs: { 'aria-hidden': 'true' } }), label]
  );

  return el('div', { class: 'diagram' }, [
    el('div', { class: 'diagram__head' }, [
      el('div', { class: 'diagram__intro' }, [
        createSectionEyebrow({ text: experienceCopy.eyebrows.diagram }),
        el('p', { class: 'diagram__caption', text: caption }),
      ]),
      toggle,
    ]),
    figure,
  ]);
}
