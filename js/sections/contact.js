/* Contact. The last chapter, and the one the whole site is pointed at: make
   emailing the obvious next action. */

import { el } from '../core/dom.js';
import { createStatusDot } from '../components/statusDot.js';
import { profile } from '../data/profile.js';

const { contact } = profile;

function createAvailabilityBar() {
  return el('p', { class: 'contact__strip' }, [
    createStatusDot({ tone: 'ok' }),
    el('span', { class: 'contact__strip-text', text: contact.strip }),
    el('span', { class: 'contact__strip-zone', text: profile.timezone }),
  ]);
}

function createActions() {
  return el('div', { class: 'contact__actions' }, [
    el('a', {
      class: 'button button--primary',
      text: profile.ctas.emailMe,
      attrs: { href: `mailto:${profile.email}` },
    }),
    el('a', {
      class: 'button button--outline',
      text: profile.ctas.github,
      attrs: { href: profile.github, target: '_blank', rel: 'noopener' },
    }),
    el('a', {
      class: 'button button--outline',
      text: profile.ctas.linkedin,
      attrs: { href: profile.linkedin, target: '_blank', rel: 'noopener' },
    }),
  ]);
}

/**
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createContactSection() {
  const element = el('div', { class: 'well contact' }, [
    createAvailabilityBar(),
    el('div', { class: 'contact__body' }, [
      el('p', { class: 'eyebrow eyebrow--muted', text: contact.eyebrow }),
      el('h2', { class: 'contact__headline' }, [
        contact.headlineLead,
        el('em', { class: 'serif-tail', text: contact.headlineTail }),
      ]),
      el('p', { class: 'contact__lead', text: contact.body }),
      createActions(),
      // The one contentinfo landmark on the page, carrying the details a
      // visitor would otherwise hunt for in a footer.
      el(
        'footer',
        { class: 'contact__footer' },
        el('p', { class: 'contact__details', text: contact.details })
      ),
    ]),
  ]);

  return { element, destroy() {} };
}
