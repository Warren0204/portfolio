/* Contact. The last section, and the one the whole page is pointed at.

   Three blocks, each with one job:

     availability   am I looking, and how fast will you hear back
     form           the primary way in
     routes         the addresses, for someone who would rather not use a form

   The routes sit beside the form rather than instead of it. A form cannot
   attach a job description, CC a colleague, or land in someone's ATS thread,
   and a recruiter who needs any of those will leave if there is no address to
   use. Equally, someone on a phone with no mail client configured needs the
   form. Both paths exist because neither covers everyone. */

import { el } from '../core/dom.js';
import { createIcon } from '../components/icon.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { createSectionHead } from '../components/sectionHead.js';
import { createStatusDot } from '../components/statusDot.js';
import { revealOnScroll } from '../core/animate.js';
import { profile } from '../data/profile.js';
import { createContactForm } from './contactForm.js';

const { contact, availability } = profile;

/* The one place on the page that says I am looking. It used to be a pill in
   the hero as well; two identical strips on one page read as an oversight. */
function createAvailability() {
  return el('div', { class: 'availability' }, [
    el('p', { class: 'availability__status' }, [
      createStatusDot({ tone: 'ok' }),
      el('span', { text: availability.status }),
    ]),
    el('p', { class: 'availability__detail' }, [
      el('span', { text: availability.response }),
      el('span', { class: 'availability__sep', attrs: { 'aria-hidden': 'true' } }),
      el('span', { text: availability.window }),
    ]),
  ]);
}

/**
 * One route. Renders as a link when there is somewhere to go, and as plain
 * selectable text when there is not — the phone number has no href on purpose,
 * so nothing offers to dial it.
 */
function createRoute(route) {
  const body = [
    el('span', { class: 'route__icon' }, createIcon(route.icon)),
    el('span', { class: 'route__text' }, [
      el('span', { class: 'route__label', text: route.label }),
      el('span', { class: 'route__value' }, [
        route.value,
        // The glyph says the link leaves this site, beside the address it opens.
        route.external ? createIcon('external', 14, { inline: true }) : null,
      ]),
      route.note ? el('span', { class: 'route__note', text: route.note }) : null,
    ]),
  ];

  if (!route.href) return el('div', { class: 'route route--static' }, body);

  return el(
    'a',
    {
      class: 'route',
      attrs: {
        href: route.href,
        target: route.external ? '_blank' : null,
        rel: route.external ? 'noopener noreferrer' : null,
      },
    },
    body
  );
}

function createRoutes() {
  return el('div', { class: 'contact__routes' }, [
    createSectionEyebrow({ text: contact.routesEyebrow, tone: 'accent' }),
    el('div', { class: 'contact__route-list' }, contact.routes.map(createRoute)),
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

  const availabilityCard = createAvailability();
  const form = createContactForm();
  const routes = createRoutes();

  /* DOM order is heading, intro, status, the addresses, then the form, and
     that is the tab order everywhere. On a phone the routes card is moved
     below the form by `order` in css/sections/contact.css, so the primary way
     in comes before the addresses; the DOM stays put so the reveal targets
     below keep pointing at real elements.

     Above 900px the same four children are placed by grid area — head, chip
     and form down the left, routes card spanning the right from the very top.

     The consequence, accepted deliberately: on desktop the four route links
     take focus before the form does, and on a phone the visual order and the
     tab order differ by one card. */
  const grid = el('div', { class: 'contact__grid' }, [
    head,
    availabilityCard,
    routes,
    form.element,
  ]);

  const element = el('div', { class: 'well contact' }, grid);

  let reveals = [];

  return {
    element,

    armReveal() {
      // The form and the routes card each reveal on their own trigger. They
      // used to share one keyed to the routes card, which was fine while the
      // card sat above the form — but a phone now puts it below by `order`,
      // and a reveal waiting on it held the form invisible while the form was
      // the thing on screen. Above 900px the two sit side by side and still
      // arrive together.
      reveals = [
        revealOnScroll([...Array.from(head.children), availabilityCard], { trigger: head }),
        revealOnScroll(form.element, { y: 30 }),
        revealOnScroll(routes, { y: 30 }),
      ];
    },

    destroy() {
      form.destroy();
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
