# Architecture

One HTML page, five sections on a single scroll, no framework and no build step.
`index.html` holds only the shell — head, the `<header>` hook, and
`<main id="stage">`. Everything visible is built by JavaScript from data.

There is exactly one runtime dependency, GSAP, and it is vendored into the repo
rather than installed. See [Motion](#motion).

## Layers

Dependencies point one way: **data → sections → components → core → vendor**.

| Layer            | Owns                                                             | May import                      |
| ---------------- | ---------------------------------------------------------------- | ------------------------------- |
| `js/vendor/`     | third-party code, committed not installed                        | nothing                         |
| `js/core/`       | DOM building, state, routing, storage, motion, focus, formatting | `vendor/`                       |
| `js/data/`       | every user-facing string, frozen plain objects                   | nothing                         |
| `js/components/` | reusable, data-in / element-out pieces                           | `core/`, `data/`                |
| `js/sections/`   | one section each, composing components with data                 | `core/`, `data/`, `components/` |

A component never imports a section. There are no circular imports.
`js/core/animate.js` is the only module that imports GSAP.

CSS mirrors the same shape and colocates by name: `js/components/modal.js` pairs
with `css/components/modal.css`. `css/main.css` is an import manifest and
nothing else; its order is the cascade order.

## Rules that keep it that way

- Components are factory functions — `createChip(props)` returns a DOM node.
  No classes, no state inside a component, no `innerHTML` with interpolated
  data. Build nodes with `el()` from `js/core/dom.js`.
- A component that registers anything global (keydown, resize, an observer, a
  ScrollTrigger) returns a `destroy()` that removes it.
- No strings in components. Copy lives in `js/data/`.
- No magic values. Durations, breakpoints, z-index layers, and spacing come from
  `css/base/tokens.css` or `js/core/constants.js`.
- No inline styles from JavaScript except genuinely dynamic values, such as a
  computed offset or a progress width.
- One canonical implementation per concept: one modal, one tab bar, one chip,
  one card. Two things that look alike are the same component with a modifier.
- Rule of three — duplicate once, extract on the third use.

## One page, five sections

The five sections are `<section>` landmarks stacked in `<main>`, and the
document is the scroller. They keep their hash routes — `#/`, `#/projects`,
`#/experience`, `#/credentials`, `#/contact` — because those are already in the
sitemap and in anything anyone has linked.

`js/core/router.js` keeps the hash and the scroll position as two views of one
fact:

- a nav click, a deep link, or the back button **scrolls** to that section
- scrolling past a section **rewrites the hash** to name it, with
  `replaceState`, so scrolling the whole page once does not cost the visitor
  five presses of Back to leave

Routes stay in the `#/projects` form rather than becoming bare `#projects`
element ids. A bare id would let the browser jump natively, which sounds simpler
but costs the smooth scroll and the header offset. Nothing relies on the hash
matching an element id; the header is cleared by a single `scroll-padding-top`
on `html` in `css/layout/page.css`.

That offset is stated **once**, on the scrollport, not per section. It was
briefly declared twice — `scroll-padding-top` on `html` and `scroll-margin-top`
on `.page-section` — and the two compounded, landing every section 172px down
instead of 86px. Padding on the scrollport is the one to keep: it also covers
the browser scrolling a focused element into view when someone tabs into a
section, which a margin on the section would miss.

The nav's active state follows the reader, not the last thing they clicked —
`onSectionChange` in `js/core/animate.js` reports whichever section covers the
middle of the screen.

## Motion

`js/core/animate.js` is the whole motion layer and the only importer of GSAP.
Sections ask for an effect by name and get a `destroy()` back.

Two rules hold it together:

**Motion is additive.** Every animated element is fully visible and readable
with no JavaScript at all — the helpers animate _from_ an offset state that GSAP
applies itself at creation time. A failed script or a blocked vendor file leaves
a plain, complete page rather than a blank one.

**Reduced motion is answered once, at the source.** Under
`prefers-reduced-motion: reduce` nothing is tweened and no ScrollTrigger is
created; every helper returns the same shape either way, so callers never
branch. CSS suppressing an animation that has already started still costs the
layout thrash that started it.

GSAP is committed to `js/vendor/` and loaded by classic `<script defer>` tags in
`index.html`, **not** imported from a module. The `.min.js` files are UMD, and a
UMD wrapper evaluated as a module throws on its own global-assignment fallback.
`js/vendor/README.md` has the full explanation; do not "tidy" those script tags
into imports.

### The process diagrams

The three diagrams in Experience are data, not pictures:
`diagrams` in `js/data/experience.js` is a set of node/edge specs,
`js/sections/experienceDiagramSvg.js` renders one to SVG, and
`js/sections/experienceDiagram.js` scrubs it on scroll so the flow draws itself
in execution order. Both arrays in a spec are authored in execution order —
reordering an array reorders the animation.

Arrowheads are their own paths rather than SVG markers, because a marker paints
the instant its line exists and would hang in space ahead of a connector that is
still being drawn.

## The shell changes shape, not just size

Below 920px the site is built as an app, not as a narrowed page. 920 is where
the five mono nav labels stop fitting beside the wordmark and the theme switch —
measured, not guessed.

|                 | phone (< 920px)                        | 920px and up                     |
| --------------- | -------------------------------------- | -------------------------------- |
| Navigation      | bottom tab bar, in the thumb arc       | section nav in the header        |
| Header          | slim title bar: short wordmark + theme | wordmark + nav + theme           |
| Detail dialog   | bottom sheet with a grab handle        | centred dialog                   |
| Home            | one column, portrait first as a circle | two columns, portrait in its own |
| Calls to action | one full-width action per row          | inline row                       |

The header is `position: sticky`, not `fixed`. A fixed element is laid out
against the initial containing block, which includes the classic scrollbar
gutter — that put the theme switch under the scrollbar at tablet widths.

`env(safe-area-inset-*)` keeps the header below the status bar and the tab bar
above the home indicator. Hover affordances are neutralised under
`@media (hover: none)` in `css/utilities/touch.css`, because a browser leaves
`:hover` on the last thing tapped — without that, tapping a card leaves it stuck
in its lifted state.

## Theme

An explicit choice always wins; until one is made, the site opens **dark**.

Dark is a decision, not a detection. The design was composed dark-first — the
ambient wash, the brand glow behind the portrait, and the diagram draw-on were
all built against the deep ground — so that is the version a first-time visitor
should meet. Reading `prefers-color-scheme` instead meant roughly half of all
arrivals saw the weaker of the two designs first. The cost is real and worth
naming: someone whose machine is set to light gets dark anyway, and has to
touch the switch. The switch is in the header at every width, and their choice
is stored the moment they use it.

The choice is written to storage only on an actual click, so the default is
never frozen in as though the visitor had picked it. The pre-paint bootstrap in
`index.html` mirrors `readStoredTheme()` exactly — change one and you must
change the other, or the wrong theme flashes past on load.

Both palettes are measured, not eyeballed. Every ink clears 7:1 against its own
background; the weakest text on the page is 6.8:1 and the smallest is 11px. An
earlier pass passed WCAG AA everywhere and was still tiring to read in light
mode, because AA's 4.5:1 floor was being met by 10px uppercase mono at 4.98:1.

## Where new content goes

Adding content is a one-object data edit. Nothing in `js/components/`,
`js/sections/`, or the CSS should need to change.

| To add                          | Edit                                       | Append                                                                                                        |
| ------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| A project case study            | `js/data/projects.js`                      | one object to `projects`                                                                                      |
| A compact project card          | `js/data/projects.js`                      | one object to `projects` with `kind: 'compact'`; it takes the card renderer instead of the case study         |
| A delivered system under a role | `js/data/experience.js`                    | one object to that role's `systems`                                                                           |
| A process diagram               | `js/data/experience.js`                    | one entry to `diagrams`, and `diagram: '<key>'` on the system                                                 |
| A certification                 | `js/data/credentials.js`                   | one object to `certifications`; include `image` to get the click-to-enlarge proof, omit it for a compact card |
| A track                         | `js/data/credentials.js`                   | one object to `tracks`                                                                                        |
| A skill group                   | `js/data/skills.js`                        | one object to `practices`, `platforms`, or `stack`                                                            |
| A section                       | `js/data/navigation.js` and `js/sections/` | one object to `chapters`, one section module registered in `js/main.js`                                       |

Sections are still called chapters in the code. The word predates the scrolling
layout; renaming it would touch every module for no behavioural gain.

## The contact form

Three fields, posted to a third-party endpoint — there is no backend. The
endpoint and its access key live in `js/core/config.js`, which explains how to
get one. **The form does not send anything until that key is set**; until then a
submit fails into the error state, which points the visitor at the mailto link.
It never silently swallows a message.
