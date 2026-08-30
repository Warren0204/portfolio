/* The project's small icon set, as inline SVG.

   Inline rather than an icon font or sprite sheet: there are twelve of them, they
   need to inherit `currentColor` so they follow the theme without a second set
   of rules, and a font would be a network request for twelve glyphs.

   Every icon here is decorative — each one sits beside a visible text label —
   so they are all `aria-hidden`. If one is ever used without a label, it needs
   an accessible name from the control that contains it, not from here. */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* All paths are drawn on a 24x24 grid. The two brand marks are the official
   logotypes; the other ten are drawn to match their weight, as filled shapes
   about two units thick rather than strokes, so one `fill` rule covers all. */
const PATHS = Object.freeze({
  email:
    'M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5v-13Zm2.6.5L12 12.15 19.4 6H4.6ZM20 7.96l-7.38 6.14a1 1 0 0 1-1.24 0L4 7.96V18h16V7.96Z',

  message:
    'M12 3.5c-5.1 0-9.25 3.36-9.25 7.5 0 2.35 1.34 4.45 3.44 5.82-.17.98-.63 2.2-1.63 3.28a.6.6 0 0 0 .52 1c1.3-.14 3.3-.65 4.86-2.02.66.1 1.35.16 2.06.16 5.1 0 9.25-3.36 9.25-7.5S17.1 3.5 12 3.5Zm0 1.75c4.24 0 7.5 2.7 7.5 5.75s-3.26 5.75-7.5 5.75c-.7 0-1.38-.07-2.02-.2a.88.88 0 0 0-.75.2c-.7.63-1.5 1.05-2.25 1.32.32-.6.55-1.22.68-1.83a.88.88 0 0 0-.42-.94c-1.85-1.06-3.24-2.73-3.24-4.3 0-3.05 3.26-5.75 7.5-5.75Z',

  linkedin:
    'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z',

  github:
    'M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.25.82-.58v-2.03c-3.34.71-4.04-1.61-4.04-1.61-.55-1.37-1.34-1.74-1.34-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.58-2.67-.29-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.24-3.17-.13-.29-.54-1.49.11-3.1 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 6.01 0c2.29-1.53 3.3-1.21 3.3-1.21.65 1.61.24 2.81.12 3.1.77.83 1.24 1.88 1.24 3.17 0 4.54-2.81 5.54-5.49 5.83.43.36.82 1.09.82 2.2v3.26c0 .33.21.7.82.58A11.8 11.8 0 0 0 24 12.29C24 5.78 18.63.5 12 .5Z',

  /* Arrow out of a box with its top-right corner open: leaves this site. */
  external: 'M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42L17.59 5H14V3ZM4 6h6v2H6v10h10v-4h2v6H4V6Z',

  /* Arrow down into a tray: saves a file. */
  download:
    'M11 3h2v9.17l3.29-3.29 1.42 1.42L12 16l-5.71-5.7 1.42-1.42L11 12.17V3ZM4 14h2v4h12v-4h2v6H4v-6Z',

  /* Two bars crossed: dismisses. */
  close:
    'M6.22 4.81a1 1 0 0 0-1.41 1.41L10.59 12l-5.78 5.78a1 1 0 1 0 1.41 1.41L12 13.41l5.78 5.78a1 1 0 0 0 1.41-1.41L13.41 12l5.78-5.78a1 1 0 0 0-1.41-1.41L12 10.59 6.22 4.81Z',

  /* Two corner arrows pulling apart: enlarges. */
  expand:
    'M14 3h7v7h-2V6.41l-4.29 4.3-1.42-1.42L17.59 5H14V3ZM10 21H3v-7h2v3.59l4.29-4.3 1.42 1.42L6.41 19H10v2Z',

  /* The phone tab bar's destinations, each a hollow outline two units thick
     like the envelope above, which the Contact tab reuses. The outer contour
     runs clockwise and the inner one the other way, so one fill leaves the
     hole. */

  /* A gabled house. */
  house: 'M12 3l8 7v10H4V10l8-7Zm0 2.65L6 10.9V18h12v-7.1L12 5.65Z',

  /* A folder with its tab raised. */
  folder: 'M2 3h8l2 3h10v15H2V3Zm2 2v14h16V8h-9L9 5H4Z',

  /* A case with a handle. */
  briefcase: 'M2 8h20v12H2V8Zm2 2v8h16v-8H4ZM8 4h8v4h-2V6h-4v2H8V4Z',

  /* A medal over a swallow-tailed ribbon. */
  award:
    'M12 2.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13Zm0 2a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9ZM8.5 14.2h7L17 22l-5-2.8L7 22l1.5-7.8Z',
});

/**
 * @param {string} name One of the keys in PATHS.
 * @param {number} [size] Rendered edge length in pixels.
 * @param {object} [options]
 * @param {boolean} [options.inline] Set the icon in running text: sized by the
 *   type it follows and aligned to it, via `icon--inline` in icon.css.
 * @returns {SVGElement|null} null for an unknown name, so a typo drops the
 *   icon rather than breaking the row it sits in.
 */
export function createIcon(name, size = 18, { inline = false } = {}) {
  const d = PATHS[name];
  if (!d) return null;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', inline ? 'icon icon--inline' : 'icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.appendChild(path);

  return svg;
}
