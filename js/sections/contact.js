/* Contact. The last section, and the one the whole page is pointed at.

   Two columns: the form, and the direct routes for someone who would rather
   not fill anything in. Offered beside the form rather than instead of it —
   a recruiter on a phone with no mail client configured hits a dead end on a
   mailto link, and someone who already has my address in their clipboard
   should not have to type it into a form. */

import { el } from '../core/dom.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createSectionHead } from '../components/sectionHead.js';
import { createStatusDot } from '../components/statusDot.js';
import { revealOnScroll } from '../core/animate.js';
import { profile } from '../data/profile.js';
import { createContactForm } from './contactForm.js';

const { contact } = profile;

function createAvailabilityBar() {
  return el('p', { class: 'contact__strip' }, [
    createStatusDot({ tone: 'ok' }),
    el('span', { class: 'contact__strip-text', text: contact.strip }),
    el('span', { class: 'contact__strip-zone', text: profile.timezone }),
  ]);
}

function createDirectRoutes() {
  return el('div', { class: 'contact__direct' }, [
    createSectionEyebrow({ text: contact.directEyebrow, tone: 'accent' }),
    el('div', { class: 'contact__links' }, [
      el('a', {
        class: 'contact__link contact__link--primary',
        text: profile.email,
        attrs: { href: `mailto:${profile.email}` },
      }),
      el('a', {
        class: 'contact__link',
        text: profile.phone,
        attrs: { href: `tel:${profile.phone.replace(/\s/g, '')}` },
      }),
      el('a', {
        class: 'contact__link',
        text: profile.ctas.linkedin,
        attrs: { href: profile.linkedin, target: '_blank', rel: 'noopener' },
      }),
      el('a', {
        class: 'contact__link',
        text: profile.ctas.github,
        attrs: { href: profile.github, target: '_blank', rel: 'noopener' },
      }),
    ]),
  ]);
}

/**
 * @returns {{ element: HTMLElement, armReveal: () => void, destroy: () => void }}
 */
export function createContactSection() {
  const head = createSectionHead({
    eyebrow: contact.eyebrow,
    heading: contact.heading,
    lead: contact.body,
    headingId: 'contact-heading',
  });

  const strip = createAvailabilityBar();
  const form = createContactForm();
  const direct = createDirectRoutes();

  const body = el('div', { class: 'contact__body' }, [form.element, direct]);

  const element = el('div', { class: 'well contact' }, [
    strip,
    head,
    body,
    // The one contentinfo landmark on the page, carrying the details a
    // visitor would otherwise hunt for in a footer.
    el(
      'footer',
      { class: 'contact__footer' },
      el('p', { class: 'contact__details', text: contact.details })
    ),
  ]);

  let reveals = [];

  return {
    element,

    armReveal() {
      reveals = [
        revealOnScroll([strip, ...Array.from(head.children)], { trigger: strip }),
        revealOnScroll([form.element, direct], { trigger: body, y: 30, stagger: 0.12 }),
      ];
    },

    destroy() {
      form.destroy();
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
