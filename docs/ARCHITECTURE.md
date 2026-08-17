# Architecture

One HTML page, five hash-routed chapters, no framework and no runtime
dependencies. `index.html` holds only the shell — head, the `<header>` hook, and
`<main id="stage">`. Everything visible is built by JavaScript from data.

## Layers

Dependencies point one way: **data → sections → components → core**.

| Layer | Owns | May import |
|---|---|---|
| `js/core/` | DOM building, state, routing, storage, motion, focus, formatting | nothing above it |
| `js/data/` | every user-facing string, frozen plain objects | nothing |
| `js/components/` | reusable, data-in / element-out pieces | `core/`, `data/` |
| `js/sections/` | one chapter each, composing components with data | `core/`, `data/`, `components/` |

A component never imports a section. There are no circular imports.

CSS mirrors the same shape and colocates by name: `js/components/modal.js` pairs
with `css/components/modal.css`. `css/main.css` is an import manifest and
nothing else; its order is the cascade order.

## Rules that keep it that way

- Components are factory functions — `createChip(props)` returns a DOM node.
  No classes, no state inside a component, no `innerHTML` with interpolated
  data. Build nodes with `el()` from `js/core/dom.js`.
- A component that registers anything global (keydown, resize, an observer)
  returns a `destroy()` that removes it.
- No strings in components. Copy lives in `js/data/`.
- No magic values. Durations, breakpoints, z-index layers, and spacing come from
  `css/base/tokens.css` or `js/core/constants.js`.
- No inline styles from JavaScript except genuinely dynamic values, such as a
  computed offset or a progress width.
- One canonical implementation per concept: one modal, one tab bar, one chip,
  one card. Two things that look alike are the same component with a modifier.
- Rule of three — duplicate once, extract on the third use.

## The shell changes shape, not just size

Below 800px the site is built as an app, not as a narrowed page. These are
different structures, not one structure scaled:

| | phone (< 800px) | 800px and up |
|---|---|---|
| Navigation | bottom tab bar, in the thumb arc | chapter nav in the header |
| Header | slim title bar: short wordmark + theme | full wordmark + nav + theme |
| Detail dialog | bottom sheet with a grab handle | centred dialog |
| Home | one column, portrait under the headline | two columns, portrait in its own |
| Calls to action | full-width primary over two secondaries | inline row |

`env(safe-area-inset-*)` keeps the header below the status bar and the tab bar
above the home indicator; the stage is inset between them. Hover affordances are
neutralised under `@media (hover: none)` in `css/utilities/touch.css`, because a
browser leaves `:hover` on the last thing tapped — without that, tapping a card
leaves it stuck in its lifted state.

## Where new content goes

Adding content is a one-object data edit. Nothing in `js/components/`,
`js/sections/`, or the CSS should need to change.

| To add | Edit | Append |
|---|---|---|
| A project case study | `js/data/projects.js` | one object to `projects` |
| A delivered system under a role | `js/data/experience.js` | one object to that role's `systems` |
| A certification | `js/data/credentials.js` | one object to `certifications`; include `image` to get the click-to-enlarge proof, omit it for a compact card |
| A track | `js/data/credentials.js` | one object to `tracks` |
| A skill group | `js/data/skills.js` | one object to `practices`, `platforms`, or `stack` |
| A chapter | `js/data/navigation.js` and `js/sections/` | one object to `chapters`, one section module |

## Reference

`reference/` holds the original design prototype and is not shipped. Shipped
code never imports from it. See [DEPLOYMENT.md](DEPLOYMENT.md) for how to
regenerate its decoded form.
