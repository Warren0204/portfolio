/* Draws the attendance process diagram from its data spec. SVG needs its own
   namespaced builder — el() from core/dom.js creates HTML elements, which the
   renderer would accept and then never paint. */

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW_MARKER_ID = 'diagram-arrow';

/* Vertical offsets for a node's stacked text lines, keyed by line count. */
const LINE_OFFSETS = Object.freeze({
  1: [0],
  2: [-10, 13],
  3: [-14, 8, 28],
});

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

function createEdges(edges) {
  return svg(
    'g',
    { class: 'diagram__edges', 'marker-end': `url(#${ARROW_MARKER_ID})` },
    edges.map((edge) =>
      edge.type === 'line'
        ? svg('line', { x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 })
        : svg('polyline', { points: edge.points })
    )
  );
}

function createEdgeLabels(labels) {
  return svg(
    'g',
    { class: 'diagram__edge-labels' },
    labels.map((label) =>
      text(label.text, { x: label.x, y: label.y, 'text-anchor': label.anchor || null })
    )
  );
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

  return svg('g', {}, [
    shape,
    ...createNodeLines(node, centreX, centreY),
    ...(node.step ? createStepBadge(node) : []),
  ]);
}

/**
 * @param {object} spec The diagram data from js/data/experience.js.
 * @returns {SVGElement}
 */
export function createDiagramSvg(spec) {
  const marker = svg(
    'marker',
    {
      id: ARROW_MARKER_ID,
      viewBox: '0 0 10 10',
      refX: 9,
      refY: 5,
      markerWidth: 7.5,
      markerHeight: 7.5,
      orient: 'auto-start-reverse',
    },
    svg('path', { d: 'M0 0 L10 5 L0 10 z', class: 'diagram__arrowhead' })
  );

  const title = svg('title', { id: 'diagram-title' });
  title.textContent = spec.title;

  // The long description is what a screen reader reads instead of the picture.
  const description = svg('desc', { id: 'diagram-desc' });
  description.textContent = spec.description;

  return svg(
    'svg',
    {
      viewBox: spec.viewBox,
      class: 'diagram__svg',
      role: 'img',
      'aria-labelledby': 'diagram-title diagram-desc',
    },
    [
      title,
      description,
      svg('defs', {}, marker),
      createEdges(spec.edges),
      createEdgeLabels(spec.edgeLabels),
      ...spec.nodes.map(createNode),
    ]
  );
}
