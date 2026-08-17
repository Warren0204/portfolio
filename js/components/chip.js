/* Chip: a mono tag. With a recognised tool name it gains the logo variant and
   carries that product's mark. Maps a label to an asset path — presentation,
   not copy, so it belongs here rather than in js/data/. */

import { el } from '../core/dom.js';

const LOGO_SLUG_BY_LABEL = Object.freeze({
  'Power Automate': 'power-automate',
  'Power Apps': 'power-apps',
  'Power BI': 'power-bi',
  SharePoint: 'sharepoint',
  'Excel Online': 'excel',
  'Microsoft Teams': 'teams',
  'Office Scripts': 'office-scripts',
  'Word automation': 'word',
  'Microsoft Forms': 'forms',
  JavaScript: 'javascript',
  React: 'react',
  Firebase: 'firebase',
  SQL: 'sql',
});

/** @returns {string|null} asset path for a tool label, or null when unknown. */
export function logoPathFor(label) {
  const slug = LOGO_SLUG_BY_LABEL[label];
  return slug ? `/assets/img/logos/${slug}.png` : null;
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {'sm'|'md'} [props.size] md carries a larger mark, used on Home.
 * @returns {HTMLElement}
 */
export function createChip({ label, size = 'sm' }) {
  const logo = logoPathFor(label);
  const classes = ['chip'];
  if (logo) classes.push('chip--logo', `chip--${size}`);

  const mark = logo
    ? el('img', {
        class: 'chip__logo',
        attrs: {
          src: logo,
          alt: '',
          'aria-hidden': 'true',
          loading: 'lazy',
          decoding: 'async',
          width: size === 'md' ? 26 : 22,
          height: size === 'md' ? 26 : 22,
        },
      })
    : null;

  return el('span', { class: classes.join(' ') }, [
    mark,
    el('span', { class: 'chip__label', text: label }),
  ]);
}
