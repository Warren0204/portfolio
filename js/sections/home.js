/* Home. The landing screen: who this is, what he does, proof, and the one
   thing to do next.

   Ordered for the phone and re-placed by grid areas above 900px, so neither
   arrangement is the accidental by-product of the other. The three "explore"
   shortcut cards that used to close this section are gone — on a single
   scrolling page they were a second navigation for destinations the visitor
   reaches by doing nothing at all. */

import { el } from '../core/dom.js';
import { createTypewriter } from '../components/typewriter.js';
import { createChip } from '../components/chip.js';
import { createImageFrame } from '../components/imageFrame.js';
import { parallax, revealNow, revealOnScroll } from '../core/animate.js';
import { profile } from '../data/profile.js';
import { heroTools } from '../data/skills.js';
import { createActions, createHeadline, createStats } from './homeIntro.js';

/**
 * @param {object} options
 * @param {(index: number) => void} options.onNavigate Moves the page to a
 *   chapter by index, for the two calls to action that jump down the page.
 * @returns {{ element: HTMLElement, armReveal: () => void, destroy: () => void }}
 */
export function createHomeSection({ onNavigate }) {
  const typewriter = createTypewriter({ phrases: profile.heroPhrases });
  const headline = createHeadline();
  const summary = el('p', { class: 'home__summary', text: profile.summary });
  const actions = createActions({ onNavigate });

  const tools = el(
    'div',
    { class: 'home__tools' },
    heroTools.map((tool) => createChip({ label: tool, size: 'md' }))
  );

  const portrait = createImageFrame({
    src: profile.portrait.src,
    alt: profile.portrait.alt,
    width: profile.portrait.width,
    height: profile.portrait.height,
    caption: profile.locationCaption,
    figureLabel: profile.portrait.figureLabel,
    eager: true,
  });

  const stats = createStats();

  const cue = el('p', { class: 'home__cue', attrs: { 'aria-hidden': 'true' } }, [
    el('span', { class: 'home__cue-label', text: profile.scrollCue }),
    el('span', { class: 'home__cue-line' }),
  ]);

  /* Three blocks rather than two, and the split is load-bearing.

     On a phone this is the reading order: who is speaking, then the face, then
     what he does and what to do about it. Keeping the portrait inside one long
     lead column pushed it below everything — a visitor on a 390px screen met
     six paragraphs before they met a person.

     Above 900px the grid puts intro and body in the left column and spans the
     portrait down the right, so the desktop composition is unchanged and
     neither layout is the accidental by-product of the other. */
  const element = el('div', { class: 'well well--home home' }, [
    el('div', { class: 'home__hero' }, [
      el('div', { class: 'home__intro' }, [typewriter.element, headline.element]),
      el('div', { class: 'home__portrait' }, portrait),
      el('div', { class: 'home__body' }, [summary, actions, tools]),
    ]),
    stats.element,
    cue,
  ]);

  let reveals = [];

  return {
    element,

    /* Armed by the caller once the preloader is out of the way. Arming at
       construction would spend the entrance behind the curtain, where nobody
       is there to see it. */
    armReveal() {
      reveals = [
        // The hero is already on screen, so it plays rather than waits. Words
        // first and tightly staggered: the headline should read as one line
        // assembling, not as thirteen separate arrivals.
        revealNow(headline.words, { y: 34, stagger: 0.035, duration: 0.7 }),
        revealNow(typewriter.element, { delay: 0.1, y: 14 }),
        revealNow([summary, actions, tools], { delay: 0.35, stagger: 0.1 }),
        parallax(portrait, 50),
        revealOnScroll(stats.items, { trigger: stats.element, y: 24, stagger: 0.09 }),
      ];
    },

    destroy() {
      typewriter.destroy();
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
