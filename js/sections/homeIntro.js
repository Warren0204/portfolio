/* The pieces of the Home hero: availability, headline, calls to action, and
   the evidence strip. Kept beside home.js so that module stays an assembly of
   parts rather than a wall of construction. */

import { el } from '../core/dom.js';
import { createStatusDot } from '../components/statusDot.js';
import { chapterById } from '../data/navigation.js';
import { profile } from '../data/profile.js';

/**
 * Split a run of text into one inline-block span per word, with real spaces
 * between them.
 *
 * The headline is the first thing on the page and the one line worth animating
 * properly, and a word can only be moved independently if it is its own box.
 * Real text nodes for the spaces mean a screen reader still reads one
 * sentence, and selecting and copying the headline still yields prose.
 *
 * @param {string} value
 * @param {string} className
 * @returns {Array<HTMLElement|string>}
 */
export function splitWords(value, className) {
  const words = value.trim().split(/\s+/);
  return words.flatMap((word, index) => {
    const span = el('span', { class: className, text: word });
    return index === words.length - 1 ? [span] : [span, ' '];
  });
}

/** @returns {HTMLElement} */
export function createAvailabilityStrip() {
  return el('p', { class: 'home__availability' }, [
    createStatusDot({ tone: 'ok' }),
    el('span', { class: 'home__availability-status', text: profile.availability.status }),
    el('span', { class: 'home__availability-detail', text: profile.availability.detail }),
  ]);
}

/**
 * The headline, with every word individually placeable. The serif tail keeps
 * its own element so the emphasis survives the split.
 *
 * @returns {{ element: HTMLElement, words: HTMLElement[] }}
 */
export function createHeadline() {
  const lead = splitWords(profile.headline.lead, 'home__word');
  const tail = splitWords(profile.headline.tail, 'home__word');

  const emphasis = el('em', { class: 'serif-tail' }, tail);
  const element = el('h1', { class: 'home__headline' }, [...lead, ' ', emphasis]);

  const words = [...lead, ...tail].filter((node) => node instanceof HTMLElement);
  return { element, words };
}

/**
 * One primary action, two secondary. "View projects" is the primary because it
 * is the thing this page exists to get someone to do; the CV and the mailto are
 * for people who have already decided.
 *
 * @returns {HTMLElement}
 */
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
      class: 'button button--ghost',
      text: profile.ctas.emailMe,
      attrs: { href: `mailto:${profile.email}` },
    }),
  ]);
}

/**
 * Counts of shipped work, directly under the hero. A recruiter skimming reads
 * numbers before prose, and every number here is answered further down the
 * page rather than asserted and dropped.
 *
 * @returns {{ element: HTMLElement, items: HTMLElement[] }}
 */
export function createStats() {
  const items = profile.heroStats.map((stat) =>
    el('div', { class: 'home__stat' }, [
      el('span', { class: 'home__stat-value', text: stat.value }),
      el('span', { class: 'home__stat-label', text: stat.label }),
      el('span', { class: 'home__stat-detail', text: stat.detail }),
    ])
  );

  return { element: el('div', { class: 'home__stats' }, items), items };
}
