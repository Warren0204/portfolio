/* The pieces of the Home hero: availability, headline, and the calls to
   action. Kept beside home.js so that module stays an assembly of parts. */

import { el } from '../core/dom.js';
import { createStatusDot } from '../components/statusDot.js';
import { chapterById } from '../data/navigation.js';
import { profile } from '../data/profile.js';

/** @returns {HTMLElement} */
export function createAvailabilityStrip() {
  return el('p', { class: 'home__availability' }, [
    createStatusDot({ tone: 'ok' }),
    el('span', { class: 'home__availability-status', text: profile.availability.status }),
    el('span', { class: 'home__availability-detail', text: profile.availability.detail }),
  ]);
}

/** @returns {HTMLElement} */
export function createHeadline() {
  return el('h1', { class: 'home__headline' }, [
    profile.headline.lead,
    el('em', { class: 'serif-tail', text: profile.headline.tail }),
  ]);
}

/** @returns {HTMLElement} */
export function createActions() {
  return el('div', { class: 'home__actions' }, [
    el('a', {
      class: 'button button--primary',
      text: profile.ctas.viewProjects,
      attrs: { href: chapterById('projects').route },
    }),
    el('a', {
      class: 'button button--outline',
      text: profile.ctas.downloadCv,
      attrs: { href: profile.cv.href, download: profile.cv.downloadName },
    }),
    el('a', {
      class: 'button button--outline',
      text: profile.ctas.emailMe,
      attrs: { href: `mailto:${profile.email}` },
    }),
  ]);
}
