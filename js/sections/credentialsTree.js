/* The credentials track tree. One-off, so it lives beside its section. The lit
   branch has to read as one unbroken line from the apex down to the selected
   card, which means the horizontal run is drawn from the centre out to that
   card's centre — the only genuinely computed geometry on the page, and so the
   only place an inline style is warranted. */

import { el, on, replaceChildren } from '../core/dom.js';
import { BREAKPOINTS } from '../core/constants.js';
import { pluralise } from '../core/format.js';
import { createCard } from '../components/card.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { credentialsCopy } from '../data/credentials.js';
import { createTrackDetail } from './credentialsTrackDetail.js';

const CARD_GAP_PX = 14;

/** Horizontal centre of card `index` within a `count`-column grid. */
function cardCentre(index, count) {
  const totalGap = (count - 1) * CARD_GAP_PX;
  const fraction = (index + 0.5) / count;
  return `calc((100% - ${totalGap}px) * ${fraction} + ${CARD_GAP_PX * index}px)`;
}

function createTrackCard(track, index, isSelected, onSelect) {
  const certCount = track.certs.length;
  const countLabel = certCount
    ? `${certCount} ${pluralise(certCount, credentialsCopy.certCountSuffix, credentialsCopy.certCountSuffixPlural)}`
    : credentialsCopy.noCertLabel;

  const card = createCard({
    modifier: 'track',
    onClick: () => onSelect(index),
    children: [
      el('span', { class: 'track__kicker', text: track.kicker }),
      el('span', { class: 'track__name', text: track.name }),
      el('span', { class: 'track__count', text: countLabel }),
    ],
  });

  card.setAttribute('aria-pressed', String(isSelected));
  card.classList.toggle('card--track-selected', isSelected);
  card.style.setProperty('animation-delay', `${index * 70}ms`);
  return card;
}

/**
 * @param {object} options
 * @param {ReadonlyArray<object>} options.tracks
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createTrackTree({ tracks }) {
  let selectedIndex = 0;
  const count = tracks.length;

  const apex = el('div', { class: 'track-tree__apex' }, [
    createSectionEyebrow({ text: credentialsCopy.apexEyebrow, tone: 'accent' }),
    el('p', { class: 'track-tree__statement', text: credentialsCopy.apexStatement }),
  ]);

  const spineLit = el('span', { class: 'track-tree__spine-lit' });
  const stubLit = el('span', { class: 'track-tree__stub-lit' });
  const dropLit = el('span', { class: 'track-tree__drop-lit' });
  const dropCap = el('span', { class: 'track-tree__drop-cap' });

  const spine = el('div', { class: 'track-tree__spine', attrs: { 'aria-hidden': 'true' } }, [
    el('span', { class: 'track-tree__spine-base' }),
    spineLit,
    ...tracks.map((_, index) =>
      el('span', { class: 'track-tree__stub', style: { left: cardCentre(index, count) } })
    ),
    stubLit,
  ]);

  const fallbackEyebrow = createSectionEyebrow({ text: credentialsCopy.tracksFallbackEyebrow });
  fallbackEyebrow.classList.add('track-tree__fallback');

  const grid = el('div', { class: 'track-tree__grid' });
  const detail = el('div', { class: 'track-tree__detail' });

  function paintBranch() {
    const centre = cardCentre(selectedIndex, count);
    const isLeftHalf = selectedIndex < count / 2;

    // Drawn from the apex's centre outward, so apex and card stay connected.
    spineLit.style.setProperty('left', isLeftHalf ? centre : '50%');
    spineLit.style.setProperty('right', isLeftHalf ? '50%' : `calc(100% - (${centre}))`);

    for (const node of [stubLit, dropLit, dropCap]) {
      node.style.setProperty('left', centre);
    }
  }

  function render() {
    replaceChildren(
      grid,
      tracks.map((track, index) => createTrackCard(track, index, index === selectedIndex, select))
    );
    replaceChildren(detail, createTrackDetail(tracks[selectedIndex]));
    paintBranch();
  }

  function select(index) {
    if (index === selectedIndex) return;
    selectedIndex = index;
    render();
    // render() replaced the card that was just activated, so move focus onto
    // its replacement rather than losing it to the document.
    grid.children[index].focus();
  }

  const element = el('div', { class: 'track-tree' }, [
    apex,
    el('div', { class: 'track-tree__stem', attrs: { 'aria-hidden': 'true' } }),
    spine,
    fallbackEyebrow,
    grid,
    el('div', { class: 'track-tree__drop', attrs: { 'aria-hidden': 'true' } }, [dropLit, dropCap]),
    detail,
  ]);

  /* Below 892px the spine has no room to read, so the cards stand alone. */
  const query = window.matchMedia(`(min-width: ${BREAKPOINTS.trackTree}px)`);
  const applyLayout = (fits) => element.classList.toggle('track-tree--flat', !fits);

  applyLayout(query.matches);
  const stopWatching = on(query, 'change', (event) => applyLayout(event.matches));

  render();

  return {
    element,

    /* Back to the first track, without stealing focus the way select() does —
       nobody clicked anything here. */
    reset() {
      if (selectedIndex === 0) return;
      selectedIndex = 0;
      render();
    },

    destroy: stopWatching,
  };
}
