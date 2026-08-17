/* The Education view of the Credentials chapter. */

import { el } from '../core/dom.js';
import { createCard } from '../components/card.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { education } from '../data/credentials.js';

/** @returns {HTMLElement} */
export function createEducationView() {
  return createCard({
    children: [
      createSectionEyebrow({ text: education.eyebrow, tone: 'muted' }),
      el('div', { class: 'education__head' }, [
        el('div', { class: 'education__degree' }, [
          el('h3', { class: 'education__title', text: education.degree }),
          el('p', { class: 'education__school', text: education.school }),
        ]),
        el('img', {
          class: 'education__logo',
          attrs: {
            src: education.logo.src,
            alt: education.logo.alt,
            width: education.logo.width,
            height: education.logo.height,
            loading: 'lazy',
            decoding: 'async',
          },
        }),
      ]),
      el(
        'div',
        { class: 'education__columns' },
        education.columns.map((column) =>
          el('div', {}, [
            createSectionEyebrow({ text: column.eyebrow }),
            el('p', { class: 'prose', text: column.body }),
          ])
        )
      ),
    ],
  });
}
