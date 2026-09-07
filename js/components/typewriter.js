/* The hero line. Types once, at a varying rate so it reads as typing rather
   than as a machine, and then stops: the caret settles and nothing on the first
   screen moves again. It used to delete itself and cycle, which meant the one
   line stating the role was unreadable for part of every four second cycle,
   forever. Under reduced motion it never starts and the line is simply
   printed. */

import { el } from '../core/dom.js';
import { TYPEWRITER } from '../core/constants.js';
import { prefersReducedMotion } from '../core/motion.js';

/**
 * @param {object} props
 * @param {ReadonlyArray<string>} props.phrases
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createTypewriter({ phrases }) {
  const output = el('span', { class: 'typewriter__text' });
  const caret = el('span', {
    class: 'typewriter__caret',
    attrs: { 'aria-hidden': 'true' },
  });

  const element = el(
    'p',
    {
      class: 'typewriter',
      // The line rewrites itself constantly; announcing every frame would be
      // unusable, so it is announced as a whole only when a phrase completes.
      attrs: { 'aria-live': 'polite', 'aria-atomic': 'true' },
    },
    [output, caret]
  );

  /* One pass over the first phrase. `phrases` stays an array because the data
     in js/data/profile.js still models the line as a list; only the first is
     typed, and nothing follows it. */
  const phrase = phrases[0];
  let timer = 0;
  let shown = '';

  function step() {
    if (shown.length === phrase.length) {
      // Typed out. The caret stops blinking rather than disappearing, so the
      // line keeps the shape it had while it was being written.
      element.classList.add('typewriter--done');
      return;
    }

    shown = phrase.slice(0, shown.length + 1);
    output.textContent = shown;
    timer = window.setTimeout(step, TYPEWRITER.typeMinMs + Math.random() * TYPEWRITER.typeJitterMs);
  }

  if (prefersReducedMotion()) {
    output.textContent = phrase;
    element.classList.add('typewriter--static');
  } else {
    step();
  }

  return {
    element,
    destroy() {
      window.clearTimeout(timer);
    },
  };
}
