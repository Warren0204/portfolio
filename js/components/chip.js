/* Chip: a mono tag. With a recognised tool name it gains the logo variant and
   carries that product's mark. Maps a label to an asset path — presentation,
   not copy, so it belongs here rather than in js/data/.

   A caller can decline the mark with `mark: false`, for a block that should
   read as one uniform inventory rather than a row where the few labels that
   happen to be in the map above are singled out by carrying a logo. */

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

/* Internal: createChip is the only thing that needs a mark, and a caller
   building its own <img> would bypass the sizing rules in chip.css.
   @returns {string|null} asset path for a tool label, or null when unknown. */
function logoPathFor(label) {
  const slug = LOGO_SLUG_BY_LABEL[label];
  return slug ? `/assets/img/logos/${slug}.webp` : null;
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {'sm'|'md'} [props.size] md carries a larger mark, used on Home.
 * @param {boolean} [props.mark] False renders plain text with no product mark.
 * @returns {HTMLElement}
 */
export function createChip({ label, size = 'sm', mark = true }) {
  const logo = mark ? logoPathFor(label) : null;
  const classes = ['chip'];
  if (logo) classes.push('chip--logo', `chip--${size}`);

  const logoImage = logo
    ? el('img', {
        class: 'chip__logo',
        attrs: {
          src: logo,
          alt: '',
          'aria-hidden': 'true',
          loading: size === 'md' ? 'eager' : 'lazy',
          decoding: 'async',
          width: size === 'md' ? 26 : 22,
          height: size === 'md' ? 26 : 22,
        },
      })
    : null;

  return el('span', { class: classes.join(' ') }, [
    logoImage,
    el('span', { class: 'chip__label', text: label }),
  ]);
}
