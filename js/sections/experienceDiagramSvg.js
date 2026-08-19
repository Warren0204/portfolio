/* Draws a process diagram from its data spec. SVG needs its own namespaced
   builder — el() from core/dom.js creates HTML elements, which the renderer
   would accept and then never paint.

   Three diagrams now share one page, so nothing here may use a fixed id. The
   title and the description are suffixed per instance; duplicated ids would
   point every diagram's aria-labelledby at whichever copy the browser happened
   to parse first.

   Arrowheads are drawn as their own paths rather than as an SVG `marker`. A
   marker is painted whole the instant its host line exists, and the connectors
   are revealed by animating stroke-dashoffset — so a marker-based arrow would
   hang in empty space for the whole length of the draw, ahead of a line that
   has not arrived yet. Owning the arrowhead means it can fade in when its
   connector actually reaches it. */

const SVG_NS = 'http://www.w3.org/2000/svg';

/* Arrowhead pointing along +x with its tip at the origin, so one path can be
   translated to any endpoint and rotated to any heading. */
const ARROWHEAD_PATH = 'M0 0 L-9.5 -5 L-9.5 5 z';

/* Vertical offsets for a node's stacked text lines, keyed by line count. */
const LINE_OFFSETS = Object.freeze({
  1: [0],
  2: [-10, 13],
  3: [-14, 8, 28],
});

let instanceCount = 0;

function svg(tag, attrs = {}, children = []) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value === null || value === undefined) continue;
    node.setAttribute(name, String(value));
  }
  for (const child of [].concat(children)) {
    if (child) node.appendChild(child);
  }
  return node;
}

function text(content, attrs) {
  const node = svg('text', attrs);
  node.textContent = content;
  return node;
}

/* The last segment of an edge, which is what the arrowhead has to align with.
   A polyline turns corners, so its heading is the heading of its final leg,
   not the straight line from its first point to its last. */
function finalSegment(edge) {
  if (edge.type === 'line') {
    return { fromX: edge.x1, fromY: edge.y1, toX: edge.x2, toY: edge.y2 };
  }

  const points = edge.points
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(',').map(Number));
  const [fromX, fromY] = points[points.length - 2];
  const [toX, toY] = points[points.length - 1];
  return { fromX, fromY, toX, toY };
}

function createEdge(edge) {
  const connector =
    edge.type === 'line'
      ? svg('line', { x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 })
      : svg('polyline', { points: edge.points });

  const { fromX, fromY, toX, toY } = finalSegment(edge);
  const heading = (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;

  const arrow = svg('path', {
    d: ARROWHEAD_PATH,
    class: 'diagram__arrowhead',
    transform: `translate(${toX} ${toY}) rotate(${heading.toFixed(2)})`,
  });

  return { connector, arrow };
}

function createNodeLines(node, centreX, centreY) {
  const offsets = LINE_OFFSETS[node.lines.length] || LINE_OFFSETS[1];
  return node.lines.map((line, index) =>
    text(line.text, {
      x: centreX,
      y: centreY + offsets[index] + 5,
      'text-anchor': 'middle',
      class: `diagram__text diagram__text--${line.role}`,
    })
  );
}

/* The numbered flow badge, pinned to the shape's leading corner. */
function createStepBadge(node) {
  const x = node.shape === 'circle' ? node.cx : node.x;
  const y = node.shape === 'circle' ? node.cy : node.y;
  return [
    svg('circle', { cx: x, cy: y, r: 13, class: 'diagram__step' }),
    text(node.step, { x, y: y + 4.5, 'text-anchor': 'middle', class: 'diagram__step-label' }),
  ];
}

function createNode(node) {
  const isCircle = node.shape === 'circle';
  const centreX = isCircle ? node.cx : node.x + node.width / 2;
  const centreY = isCircle ? node.cy : node.y + node.height / 2;

  const shape = isCircle
    ? svg('circle', {
        cx: node.cx,
        cy: node.cy,
        r: node.radius,
        class: `diagram__shape${node.accent ? ' diagram__shape--accent' : ''}`,
      })
    : svg('rect', {
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        rx: node.radius || (node.height > 50 ? 8 : 6),
        class: 'diagram__shape',
      });

  return svg('g', { class: 'diagram__node' }, [
    shape,
    ...createNodeLines(node, centreX, centreY),
    ...(node.step ? createStepBadge(node) : []),
  ]);
}

/**
 * @param {object} spec One entry from `diagrams` in js/data/experience.js.
 * @returns {{
 *   element: SVGElement,
 *   connectors: SVGElement[],
 *   arrows: SVGElement[],
 *   nodes: SVGElement[],
 *   labels: SVGElement[]
 * }} The parts are handed back individually, index-aligned with the spec's own
 *   arrays, so the animation can drive them in flow order without re-querying
 *   the DOM or knowing anything about the markup.
 */
export function createDiagramSvg(spec) {
  instanceCount += 1;
  const uid = `diagram-${instanceCount}`;
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  const title = svg('title', { id: titleId });
  title.textContent = spec.title;

  // The long description is what a screen reader reads instead of the picture.
  const description = svg('desc', { id: descId });
  description.textContent = spec.description;

  const edges = spec.edges.map(createEdge);
  const connectors = edges.map((edge) => edge.connector);
  const arrows = edges.map((edge) => edge.arrow);

  const labels = spec.edgeLabels.map((label) =>
    text(label.text, { x: label.x, y: label.y, 'text-anchor': label.anchor || null })
  );
  const nodes = spec.nodes.map(createNode);

  const element = svg(
    'svg',
    {
      viewBox: spec.viewBox,
      class: 'diagram__svg',
      role: 'img',
      'aria-labelledby': `${titleId} ${descId}`,
    },
    [
      title,
      description,
      svg('g', { class: 'diagram__edges' }, connectors),
      svg('g', { class: 'diagram__arrows' }, arrows),
      svg('g', { class: 'diagram__edge-labels' }, labels),
      ...nodes,
    ]
  );

  return { element, connectors, arrows, nodes, labels };
}
