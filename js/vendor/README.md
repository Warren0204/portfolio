# Vendored third-party code

GSAP 3.13.0, committed rather than installed. This project has no build step and
no package manager in its runtime path, so a dependency either lives here or it
does not exist.

| File                   | Source                                                               |
| ---------------------- | -------------------------------------------------------------------- |
| `gsap.min.js`          | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js`          |
| `ScrollTrigger.min.js` | `https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js` |
| `gsap.js`              | Written here. The ES module facade the rest of the project imports.  |

Both `.min.js` files are UMD, and both are loaded by classic `<script defer>`
tags in `index.html` — **not** imported from `gsap.js`.

That matters. With no `exports` and no `define`, the UMD wrapper assigns onto
its `this`. In an ES module top-level `this` is `undefined`, so the wrapper
resolves it to `self` and runs `window.window = window.window || {}`. `window.window`
is getter-only: under a classic script that assignment is a silent no-op in
sloppy mode, but under a module it throws

    TypeError: Cannot set property window of #<Window> which has only a getter

and GSAP never loads. Importing the minified files from a module looks tidier
and does not work.

So the scripts run as scripts, and `gsap.js` re-exports the globals they
defined. Load order is guaranteed because classic deferred scripts and module
scripts share one queue and execute in document order, and `index.html` puts
these first.

Do not edit the minified files. To upgrade, re-download both at the same
version, bump the table above, and re-check two things: that ScrollTrigger still
self-registers, and that the script tags in `index.html` still come before the
module scripts. `gsap.js` asserts the first and will throw loudly if it stops.
