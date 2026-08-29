/* The process diagram block: a caption, the drawing, and the scroll-scrubbed
   reveal that plays the flow in execution order.

   The diagram is visible from the moment the section is, rather than sitting
   behind a "view diagram" button as it used to. Hiding the one artefact that
   proves the system was designed rather than assembled put the strongest
   evidence on this page one click further away than the weakest.

   Scrubbing rather than playing is the point: a static picture of a pipeline
   cannot show which step waits on which. Tying the draw to scroll position
   lets the reader move through the flow at their own pace, and back up. */

import { el } from '../core/dom.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import { scrubTimeline } from '../core/animate.js';
import { experienceCopy } from '../data/experience.js';
import { createDiagramSvg } from './experienceDiagramSvg.js';

/**
 * Draw the flow on as the reader scrolls through it: connectors extend from
 * their source, arrowheads land when their connector arrives, and each box
 * settles in as the step that produced it completes.
 *
 * @param {HTMLElement} figure The element whose scroll position drives it.
 * @param {ReturnType<typeof createDiagramSvg>} parts
 * @returns {{ destroy: () => void }}
 */
function animateDiagram(figure, parts) {
  const { connectors, arrows, nodes, labels } = parts;

  return scrubTimeline(figure, (timeline) => {
    // Nodes first and slightly ahead of the connectors, so a line always has
    // somewhere to arrive rather than reaching into blank space.
    timeline.from(
      nodes,
      {
        opacity: 0,
        scale: 0.9,
        transformOrigin: 'center center',
        stagger: 0.22,
        duration: 0.5,
        ease: 'power2.out',
      },
      0
    );

    connectors.forEach((connector, index) => {
      // Measured here rather than at build time: getTotalLength needs the
      // element to be laid out, and this runs a frame after mounting.
      const length = connector.getTotalLength();
      const at = 0.18 + index * 0.22;

      timeline.fromTo(
        connector,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.45, ease: 'none' },
        at
      );

      // The arrowhead is a separate path precisely so it can wait for its
      // connector; it appears as the line reaches its endpoint.
      timeline.from(arrows[index], { opacity: 0, duration: 0.12 }, at + 0.4);
    });

    timeline.from(labels, { opacity: 0, stagger: 0.22, duration: 0.3 }, 0.3);
  });
}

/**
 * @param {object} spec One entry from `diagrams` in js/data/experience.js.
 * @param {string} caption
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createDiagram(spec, caption) {
  const parts = createDiagramSvg(spec);

  // Focusable, so a keyboard can scroll the drawing sideways; the label says
  // what the box is, since a bare scrollable region announces nothing.
  const scroller = el(
    'div',
    {
      class: 'diagram__scroll',
      attrs: { tabindex: '0', role: 'group', 'aria-label': experienceCopy.diagramScrollLabel },
    },
    parts.element
  );

  const figure = el('figure', { class: 'diagram__figure' }, [
    scroller,
    el('figcaption', { class: 'diagram__hint eyebrow eyebrow--muted', text: spec.scrollHint }),
  ]);

  const element = el('div', { class: 'diagram' }, [
    el('div', { class: 'diagram__head' }, [
      createSectionEyebrow({ text: experienceCopy.eyebrows.diagram }),
      el('p', { class: 'diagram__caption', text: caption }),
    ]),
    figure,
  ]);

  /* getTotalLength() on a detached element is unreliable, and this block is
     built before its section is mounted. One frame is enough: by the time it
     runs, main.js has put the page together. */
  let animation = { destroy() {} };
  const armed = window.requestAnimationFrame(() => {
    animation = animateDiagram(figure, parts);
  });

  return {
    element,
    destroy() {
      window.cancelAnimationFrame(armed);
      animation.destroy();
    },
  };
}
