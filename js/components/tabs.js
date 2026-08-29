/* Tabs: one tab bar, used by the credentials views, the project surfaces, and
   the Experience tokens. Follows the tab pattern properly — arrow keys move
   between tabs and only the selected tab is in the tab order. The
   data-tabgroup marker tells the global keyboard handler to leave left and
   right arrows alone in here. */

import { el, on } from '../core/dom.js';

const PREVIOUS_KEYS = ['ArrowLeft', 'ArrowUp'];
const NEXT_KEYS = ['ArrowRight', 'ArrowDown'];

/**
 * @param {object} props
 * @param {ReadonlyArray<{ id: string, label: string }>} props.items
 * @param {string} props.selectedId
 * @param {(id: string) => void} props.onSelect
 * @param {string} props.label Accessible name for the tab list.
 * @param {string} props.panelId Id of the element the tabs control.
 * @param {'bar'|'segmented'} [props.variant] `segmented` is one
 *   scrolling row with a filled selected token; see css/components/tabs.css.
 * @returns {{ element: HTMLElement, select: (id: string) => void, destroy: () => void }}
 */
export function createTabs({ items, selectedId, onSelect, label, panelId, variant = 'bar' }) {
  let currentId = selectedId;

  const buttons = items.map((item) =>
    el('button', {
      // `target` is the 44px accessibility floor from css/utilities/a11y.css.
      class: 'tabs__tab target',
      text: item.label,
      attrs: {
        type: 'button',
        role: 'tab',
        id: `tab-${panelId}-${item.id}`,
        'aria-controls': panelId,
      },
      dataset: { tab: item.id },
      on: { click: () => select(item.id) },
    })
  );

  const list = el(
    'div',
    {
      class: `tabs tabs--${variant}`,
      attrs: { role: 'tablist', 'aria-label': label },
      dataset: { tabgroup: panelId },
    },
    buttons
  );

  function render() {
    buttons.forEach((button) => {
      const isSelected = button.dataset.tab === currentId;
      button.setAttribute('aria-selected', String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
      button.classList.toggle('tabs__tab--selected', isSelected);
    });
  }

  function select(id) {
    if (id === currentId) return;
    currentId = id;
    render();
    onSelect(id);
  }

  function focusByOffset(offset) {
    const index = items.findIndex((item) => item.id === currentId);
    const next = (index + offset + items.length) % items.length;
    select(items[next].id);
    buttons[next].focus();
  }

  const stopKeys = on(list, 'keydown', (event) => {
    if (PREVIOUS_KEYS.includes(event.key)) {
      event.preventDefault();
      focusByOffset(-1);
    } else if (NEXT_KEYS.includes(event.key)) {
      event.preventDefault();
      focusByOffset(1);
    }
  });

  render();

  return { element: list, select, destroy: stopKeys };
}
