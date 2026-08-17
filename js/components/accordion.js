/* Accordion: the disclosure Projects and Experience both use. The header is a
   button that owns aria-expanded; the panel is only in the DOM while open, so
   nothing hidden sits in the tab order. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {Array|Node} props.summary Content of the header button.
 * @param {() => Node} props.renderPanel Called each time the panel opens.
 * @param {string} props.openLabel Header control text while closed.
 * @param {string} props.closeLabel Header control text while open.
 * @param {boolean} [props.open] Initial state. Closed by default: a chapter
 *   should open showing its list, not one expanded item.
 * @returns {{ element: HTMLElement, toggle: () => void, close: () => void }}
 */
export function createAccordion({ summary, renderPanel, openLabel, closeLabel, open = false }) {
  let isOpen = open;

  const controlLabel = el('span', { class: 'accordion__control-label' });
  const control = el(
    'span',
    { class: 'accordion__control', attrs: { 'aria-hidden': 'true' } },
    [el('span', { class: 'accordion__chevron', text: '›' }), controlLabel]
  );

  const header = el(
    'button',
    {
      class: 'accordion__header',
      attrs: { type: 'button' },
      on: { click: () => toggle() },
    },
    [el('span', { class: 'accordion__summary' }, summary), control]
  );

  const panel = el('div', { class: 'accordion__panel' });
  const root = el('div', { class: 'accordion' }, [header, panel]);

  function render() {
    header.setAttribute('aria-expanded', String(isOpen));
    root.classList.toggle('accordion--open', isOpen);
    controlLabel.textContent = isOpen ? closeLabel : openLabel;

    if (isOpen) panel.replaceChildren(renderPanel());
    else panel.replaceChildren();
  }

  function toggle() {
    isOpen = !isOpen;
    render();
    // Re-opening from far down the page should bring the header back into view.
    if (isOpen) header.scrollIntoView({ block: 'nearest' });
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    render();
  }

  render();

  return { element: root, toggle, close };
}
