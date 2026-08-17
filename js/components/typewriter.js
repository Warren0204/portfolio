/* The looping hero line. Types at a varying rate so it reads as typing rather
   than as a machine, holds, deletes fast, then moves to the next phrase.
   Under reduced motion it never starts: the first phrase is simply printed. */

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

  let timer = 0;
  let phraseIndex = 0;
  let shown = '';
  let deleting = false;

  function step() {
    const phrase = phrases[phraseIndex];
    let wait;

    if (deleting) {
      if (shown === '') {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        wait = TYPEWRITER.restartMs;
      } else {
        shown = shown.slice(0, -1);
        wait = TYPEWRITER.deleteMs;
      }
    } else if (shown.length < phrase.length) {
      shown = phrase.slice(0, shown.length + 1);
      wait = TYPEWRITER.typeMinMs + Math.random() * TYPEWRITER.typeJitterMs;
    } else {
      deleting = true;
      wait = TYPEWRITER.holdMs;
    }

    output.textContent = shown;
    timer = window.setTimeout(step, wait);
  }

  if (prefersReducedMotion()) {
    output.textContent = phrases[0];
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
