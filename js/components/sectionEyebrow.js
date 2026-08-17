/* The mono label above a block. One implementation, three tones. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.text
 * @param {'dim'|'accent'|'muted'} [props.tone]
 * @returns {HTMLElement}
 */
export function createSectionEyebrow({ text, tone = 'dim' }) {
  return el('p', { class: `eyebrow eyebrow--${tone}`, text });
}
