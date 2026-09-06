/* The CV viewer. Two page renders of assets/docs/Warren_Gallardo_CV.pdf,
   stacked in a native <dialog>, so the top layer, the focus trap, the inert
   background, Escape, and the backdrop are all the browser's rather than this
   file's. What is left is the panel, the toolbar, and when the images load.

   Deliberately not components/modal.js. That one is a div with role="dialog"
   and the project's own trapFocus, written before this needed a dialog and
   shaped around one image on empty ground; reusing it here would mean keeping
   a hand-rolled trap alive next to an element that ships one. The pieces that
   are genuinely shared are shared: the button recipes, the icon set, the
   scroll lock class layout/page.css already answers, and the tokens. */

import { el, on } from '../core/dom.js';
import { createIcon } from './icon.js';
import { profile } from '../data/profile.js';

/* The hero's aria-controls points at this, so it is exported rather than
   spelled twice. One viewer exists per page, so one id is enough. */
export const CV_VIEWER_ID = 'cv-viewer';

const TITLE_ID = `${CV_VIEWER_ID}-title`;

/* Built with no src and no srcset: an img with neither requests nothing, so a
   visitor who never opens the viewer never pays for it. The ratio is set now
   rather than on arrival, because a box that has no height until its image
   lands is a scroll position that moves under the reader. */
function createPage(page) {
  return el('img', {
    class: 'cv-viewer__page',
    attrs: { alt: page.alt, decoding: 'async' },
    style: { 'aspect-ratio': profile.cv.pageAspectRatio },
  });
}

/**
 * @param {object} [options]
 * @param {HTMLElement} [options.mount] Where the dialog is attached.
 * @returns {{ id: string, open: (trigger: HTMLElement) => void }}
 */
export function createCvViewer({ mount = document.body } = {}) {
  const pages = profile.cv.pages.map(createPage);
  let loaded = false;
  let trigger = null;

  const close = () => dialog.close();

  const download = el(
    'a',
    {
      class: 'button button--outline cv-viewer__download',
      attrs: { href: profile.cv.href, download: profile.cv.downloadName },
    },
    // The glyph says this one saves a file, the same as it did in the hero.
    [profile.cv.viewerDownload, createIcon('download', 16, { inline: true })]
  );

  /* autofocus, so the dialog opens on the way out rather than on the way
     deeper in. Without it the element's own focusing steps take the first
     tabbable child, which is the download link, and the first thing a keyboard
     visitor would meet is the action they did not ask for. */
  const closeButton = el(
    'button',
    {
      class: 'button button--ghost cv-viewer__close',
      attrs: { type: 'button', autofocus: '', 'aria-label': profile.cv.viewerCloseAria },
      on: { click: close },
    },
    createIcon('close', 18)
  );

  const body = el('div', { class: 'cv-viewer__body' }, pages);

  const dialog = el(
    'dialog',
    {
      class: 'cv-viewer',
      attrs: { id: CV_VIEWER_ID, 'aria-labelledby': TITLE_ID },
      on: {
        /* A click on ::backdrop reports the dialog itself as its target, and
           nothing inside the panel can: the panel has no padding of its own,
           so every pixel of it belongs to the bar or to the body. */
        click: (event) => {
          if (event.target === dialog) close();
        },
      },
    },
    [
      el('div', { class: 'cv-viewer__bar' }, [
        el('h2', {
          class: 'cv-viewer__title',
          text: profile.cv.viewerTitle,
          attrs: { id: TITLE_ID },
        }),
        el('div', { class: 'cv-viewer__actions' }, [download, closeButton]),
      ]),
      body,
    ]
  );

  /* One handler for all three ways out, because the element funnels Escape,
     close() and form-method dismissal through the same event. */
  on(dialog, 'close', () => {
    document.body.classList.remove('is-modal-open');

    /* The element restores focus by itself, but only to whatever happened to
       hold it when the dialog opened. Naming the control means the ring comes
       back to View CV even when the open was not a click on it. */
    if (trigger && document.contains(trigger)) trigger.focus();
  });

  mount.appendChild(dialog);

  return {
    id: CV_VIEWER_ID,

    open(control) {
      trigger = control;

      /* First open is where the pages are asked for. srcset and sizes are set
         before src, so the browser picks once: src first would start the full
         1819px file and then re-decide. */
      if (!loaded) {
        pages.forEach((image, index) => {
          const page = profile.cv.pages[index];
          image.setAttribute('sizes', profile.cv.pageSizes);
          image.setAttribute('srcset', page.srcset);
          image.setAttribute('src', page.src);
        });
        loaded = true;
      }

      /* showModal makes the rest of the document inert, which stops clicks and
         Tab but not the wheel. The scroll lock is layout/page.css's, and it is
         the same one the certificate lightbox uses. */
      document.body.classList.add('is-modal-open');
      body.scrollTop = 0;
      dialog.showModal();
    },
  };
}
