/* The pieces of the Home hero: headline, calls to action, and the evidence
   strip. Kept beside home.js so that module stays an assembly of parts rather
   than a wall of construction.

   The availability pill used to live here too. It now appears once, in
   Contact — two identical status strips on one page read as an oversight
   rather than as emphasis. */

import { el, isModifiedClick } from '../core/dom.js';
import { createIcon } from '../components/icon.js';
import { chapters } from '../data/navigation.js';
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
function splitWords(value, className) {
  const words = value.trim().split(/\s+/);
  return words.flatMap((word, index) => {
    const span = el('span', { class: className, text: word });
    return index === words.length - 1 ? [span] : [span, ' '];
  });
}

/**
 * The headline, with every word individually placeable. The emphasised tail
 * keeps its own element so the emphasis survives the split.
 *
 * @returns {{ element: HTMLElement, words: HTMLElement[] }}
 */
export function createHeadline() {
  const lead = splitWords(profile.headline.lead, 'home__word');
  const tail = splitWords(profile.headline.tail, 'home__word');

  const emphasis = el('em', { class: 'display-tail' }, tail);
  const element = el('h1', { class: 'home__headline' }, [...lead, ' ', emphasis]);

  const words = [...lead, ...tail].filter((node) => node instanceof HTMLElement);
  return { element, words };
}

/**
 * One primary action, two secondary. "View projects" is the primary because it
 * is the thing this page exists to get someone to do; the CV and the contact
 * jump are for people who have already decided.
 *
 * The third action used to be a `mailto:`. It is now an in-page jump to the
 * contact form, for three reasons: a mailto dead-ends on a phone with no mail
 * client configured, it handed the visitor off the site at the exact moment
 * they were interested, and it duplicated the contact section a scroll away.
 * The label changed with it — a button promising to open mail that instead
 * scrolls is a small lie, and small lies are what make an interface feel
 * untrustworthy.
 *
 * All three are real links to real destinations and stay that way, so
 * middle-click, copy link and open in a new tab keep working. What changed is
 * who answers a plain left click.
 *
 * The two in-page actions used to have no handler at all, on the reasoning that
 * changing the hash was enough because the router listens for `hashchange`.
 * That was true as far as it went, and it left these two on a different path
 * from the header nav and the tab bar: the browser runs its own fragment step
 * first, and because no element has the id `/projects`, that step scrolls the
 * document to the beginning before the router has said anything. They now call
 * `onNavigate`, which is what the other two navigations have always done.
 *
 * @param {object} options
 * @param {(index: number) => void} options.onNavigate Moves the page to a
 *   chapter by index. Wired in js/main.js.
 * @returns {HTMLElement}
 */
export function createActions({ onNavigate }) {
  /* Both in-page actions are the same shape, so the difference between them is
     the chapter, the class and the label rather than a second copy of this. */
  function jump(id, className, label) {
    const index = chapters.findIndex((chapter) => chapter.id === id);

    return el('a', {
      class: className,
      text: label,
      attrs: { href: chapters[index].route },
      on: {
        click: (event) => {
          if (isModifiedClick(event)) return;
          event.preventDefault();
          onNavigate(index);
        },
      },
    });
  }

  return el('div', { class: 'home__actions' }, [
    jump('projects', 'button button--primary', profile.ctas.viewProjects),
    el(
      'a',
      {
        class: 'button button--outline',
        attrs: { href: profile.cv.href, download: profile.cv.downloadName },
      },
      // The glyph says this one saves a file rather than moving down the page.
      [profile.ctas.downloadCv, createIcon('download', 18, { inline: true })]
    ),
    jump('contact', 'button button--ghost', profile.ctas.getInTouch),
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
