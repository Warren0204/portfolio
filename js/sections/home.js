/* Home. The one chapter that has to work as a landing screen on a phone and a
   single-screen composition on a desktop, so its parts are ordered for the
   phone and re-placed by grid areas above 800px. */

import { el } from '../core/dom.js';
import { prefersReducedMotion } from '../core/motion.js';
import { createTypewriter } from '../components/typewriter.js';
import { createChip } from '../components/chip.js';
import { createImageFrame } from '../components/imageFrame.js';
import { createCard } from '../components/card.js';
import { chapterById, exploreCards } from '../data/navigation.js';
import { profile } from '../data/profile.js';
import { heroTools } from '../data/skills.js';
import { createActions, createAvailabilityStrip, createHeadline } from './homeIntro.js';

function createExplore() {
  return el(
    'div',
    { class: 'home__explore' },
    exploreCards.map((entry) => {
      const chapter = chapterById(entry.chapterId);
      return createCard({
        modifier: 'explore',
        href: chapter.route,
        children: [
          el('span', { class: 'home__explore-head' }, [
            el('span', { class: 'home__explore-title', text: entry.title }),
            el('span', {
              class: 'home__explore-arrow',
              text: '→',
              attrs: { 'aria-hidden': 'true' },
            }),
          ]),
          el('span', { class: 'home__explore-hook', text: entry.hook }),
        ],
      });
    })
  );
}

/**
 * Rise the shortcut cards in as they scroll into view. The hidden state is
 * applied from JavaScript, never from the stylesheet, so that without script —
 * or with motion reduced — the cards are simply visible rather than stranded
 * at opacity zero.
 *
 * @returns {{ observer: IntersectionObserver|null }}
 */
function revealOnScroll(target) {
  if (prefersReducedMotion()) return { observer: null };

  target.classList.add('home__explore--pending');

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('home__explore--pending');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(target);
  return { observer };
}

/**
 * @returns {{ element: HTMLElement, armReveal: () => void, destroy: () => void }}
 */
export function createHomeSection() {
  const typewriter = createTypewriter({ phrases: profile.heroPhrases });

  const portrait = createImageFrame({
    src: profile.portrait.src,
    alt: profile.portrait.alt,
    width: profile.portrait.width,
    height: profile.portrait.height,
    caption: profile.locationCaption,
    figureLabel: profile.portrait.figureLabel,
    eager: true,
  });

  const explore = createExplore();

  // DOM order is the phone's reading order: the face sits with the name,
  // directly under the headline, rather than after the calls to action. The
  // desktop layout lifts the portrait into its own column with grid areas, so
  // neither arrangement is the accidental by-product of the other.
  const element = el('div', { class: 'well well--home home' }, [
    el('div', { class: 'home__lead' }, [
      typewriter.element,
      createAvailabilityStrip(),
      createHeadline(),
      portrait,
      el('p', { class: 'home__summary', text: profile.summary }),
      // Actions before tools: on a phone this is reading order, and the thing
      // to do must come before the list of what I do it with. The desktop grid
      // places them by area, so it is unaffected by this order.
      createActions(),
      el(
        'div',
        { class: 'home__tools' },
        heroTools.map((tool) => createChip({ label: tool, size: 'md' }))
      ),
    ]),
    explore,
  ]);

  let reveal = { observer: null };

  return {
    element,

    /* Armed by the caller once the preloader is out of the way. Arming at
       construction would spend the reveal behind the curtain, where nobody
       is there to see it. */
    armReveal() {
      reveal = revealOnScroll(explore);
    },

    destroy() {
      typewriter.destroy();
      if (reveal.observer) reveal.observer.disconnect();
    },
  };
}
