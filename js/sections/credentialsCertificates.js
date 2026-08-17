/* The Certifications view, and the zoom dialog its proof image opens into.
   A certification with an image renders as a featured row with a click-to-
   enlarge proof; without one it renders as a compact card. */

import { el } from '../core/dom.js';
import { createBadge } from '../components/badge.js';
import { createCard } from '../components/card.js';
import { createModal } from '../components/modal.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { certifications, credentialsCopy } from '../data/credentials.js';

function createZoomHeader(certification, close) {
  const heading = el('div', { class: 'zoom__heading' }, [
    el('p', { class: 'zoom__eyebrow', text: credentialsCopy.zoomEyebrow }),
    el('p', { class: 'zoom__title', text: certification.title }),
  ]);

  const actions = el('div', { class: 'zoom__actions' }, [
    el(
      'a',
      {
        class: 'zoom__verify',
        attrs: { href: certification.verify, target: '_blank', rel: 'noopener' },
      },
      [
        el('span', { text: credentialsCopy.verifyLabel }),
        el('span', { text: '↗', attrs: { 'aria-hidden': 'true' } }),
      ]
    ),
    el(
      'button',
      {
        class: 'zoom__close',
        attrs: { type: 'button', 'aria-label': credentialsCopy.zoomCloseAria },
        on: { click: close },
      },
      [
        el('span', { text: credentialsCopy.zoomClose }),
        el('span', { text: '✕', attrs: { 'aria-hidden': 'true' } }),
      ]
    ),
  ]);

  return el('div', { class: 'modal__bar' }, [heading, actions]);
}

function openCertificateZoom(certification) {
  let modal = null;
  const close = () => modal.destroy();

  modal = createModal({
    variant: 'zoom',
    label: credentialsCopy.zoomLabel,
    header: createZoomHeader(certification, close),
    // The certificate itself is not dead space: clicking it should let you
    // keep reading it, not dismiss what you just opened.
    body: el('img', {
      class: 'zoom__image',
      attrs: {
        src: certification.image.src,
        alt: certification.image.alt,
        'data-modal-keep': '',
      },
    }),
    onClose: close,
  });
}

function createFeaturedCertification(certification) {
  const thumbnail = el(
    'button',
    {
      class: 'certificate__thumb',
      attrs: { type: 'button', 'aria-label': `Enlarge the ${certification.title}` },
      on: { click: () => openCertificateZoom(certification) },
    },
    [
      el('img', {
        class: 'certificate__image',
        attrs: {
          src: certification.image.src,
          alt: certification.image.alt,
          loading: 'lazy',
          decoding: 'async',
        },
        style: { 'aspect-ratio': certification.image.aspectRatio },
      }),
      el('span', { class: 'certificate__hint' }, [
        el('span', { text: credentialsCopy.enlargeHint }),
        el('span', { text: '⤢', attrs: { 'aria-hidden': 'true' } }),
      ]),
    ]
  );

  return createCard({
    modifier: 'certificate',
    children: [
      el('div', { class: 'certificate__body' }, [
        createSectionEyebrow({ text: certification.scope }),
        el('h3', { class: 'certificate__title', text: certification.title }),
        el('p', { class: 'certificate__issuer', text: certification.issuer }),
        el('p', { class: 'prose', text: certification.why }),
        createBadge({ text: certification.status }),
      ]),
      thumbnail,
    ],
  });
}

function createCompactCertification(certification) {
  return createCard({
    modifier: 'certificate-compact',
    children: [
      createSectionEyebrow({ text: certification.scope }),
      el('p', { class: 'certificate__title', text: certification.title }),
      el('p', { class: 'certificate__issuer', text: certification.issuer }),
      createBadge({ text: certification.status }),
    ],
  });
}

/** @returns {HTMLElement} */
export function createCertificationsView() {
  const featured = certifications.filter((entry) => entry.image);
  const compact = certifications.filter((entry) => !entry.image);

  return el('div', { class: 'certificates' }, [
    el('h3', { class: 'credentials__subheading', text: credentialsCopy.certificationsHeading }),
    ...featured.map(createFeaturedCertification),
    compact.length
      ? el('div', { class: 'certificates__grid' }, compact.map(createCompactCertification))
      : null,
  ]);
}
