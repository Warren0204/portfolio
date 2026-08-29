/* The label above a block. One implementation, two tones. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.text
 * @param {'muted'|'accent'} [props.tone]
 * @returns {HTMLElement}
 */
export function createSectionEyebrow({ text, tone = 'muted' }) {
  return el('p', { class: `eyebrow eyebrow--${tone}`, text });
}
