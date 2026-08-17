/* The detail panel below the credentials track cards. */

import { el } from '../core/dom.js';
import { createBadge } from '../components/badge.js';
import { createBulletList } from '../components/bulletList.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { credentialsCopy } from '../data/credentials.js';

function createFundamentals(track) {
  return el('div', { class: 'track-detail__block' }, [
    createSectionEyebrow({ text: credentialsCopy.fundamentalsEyebrow }),
    createBulletList({ items: track.fundamentals }),
    track.fundamentalsNote
      ? el('p', { class: 'track-detail__note', text: track.fundamentalsNote })
      : null,
  ]);
}

function createCertificationBlock(certification, certWhy) {
  return el('div', { class: 'track-detail__block' }, [
    createSectionEyebrow({ text: credentialsCopy.trackCertEyebrow }),
    el('p', { class: 'certificate__title', text: certification.title }),
    el('p', { class: 'certificate__issuer', text: certification.issuer }),
    createBadge({ text: certification.status }),
    certWhy ? el('p', { class: 'track-detail__why', text: certWhy }) : null,
  ]);
}

/**
 * @param {object} track
 * @returns {HTMLElement}
 */
export function createTrackDetail(track) {
  const children = [
    el('div', { class: 'track-detail__head' }, [
      el('h3', { class: 'track-detail__name', text: track.name }),
      el('p', { class: 'track-detail__summary', text: track.summary }),
    ]),
  ];

  if (track.fundamentals.length) children.push(createFundamentals(track));

  for (const certification of track.certs) {
    children.push(createCertificationBlock(certification, track.certWhy));
  }

  // A track with nothing certified says so, rather than showing an empty slot.
  if (track.empty) {
    children.push(
      el('div', { class: 'track-detail__block' }, [
        createSectionEyebrow({ text: credentialsCopy.trackCertEyebrow }),
        el('p', { class: 'prose', text: track.empty }),
      ])
    );
  }

  return el('div', { class: 'track-detail' }, children);
}
