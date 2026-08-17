/* Image frame: a bordered figure with a mono caption. Width and height are
   required so the box is reserved before the image arrives and nothing shifts. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {number} props.width
 * @param {number} props.height
 * @param {string} [props.caption]
 * @param {string} [props.figureLabel] Accessible name for the figure itself.
 * @param {boolean} [props.eager] True for above-the-fold images only.
 * @returns {HTMLElement}
 */
export function createImageFrame({
  src,
  alt,
  width,
  height,
  caption,
  figureLabel,
  eager = false,
}) {
  const image = el('img', {
    class: 'image-frame__img',
    attrs: {
      src,
      alt,
      width,
      height,
      loading: eager ? 'eager' : 'lazy',
      decoding: 'async',
      fetchpriority: eager ? 'high' : null,
    },
  });

  return el(
    'figure',
    {
      class: 'image-frame',
      attrs: { 'aria-label': figureLabel || null },
    },
    [
      el('div', { class: 'image-frame__media' }, [
        image,
        el('span', { class: 'image-frame__wash', attrs: { 'aria-hidden': 'true' } }),
      ]),
      caption ? el('figcaption', { class: 'image-frame__caption', text: caption }) : null,
    ]
  );
}
