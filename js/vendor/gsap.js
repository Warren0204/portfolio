/* ES module facade over the vendored GSAP builds.

   The two .min.js files are UMD, and they are loaded by classic <script defer>
   tags in index.html rather than imported here. That is not a stylistic choice.
   A UMD wrapper with no `exports` and no `define` falls back to assigning onto
   its `this`, and in an ES module top-level `this` is undefined — the wrapper
   then resolves it to `self` and executes `window.window = window.window || {}`,
   which is a getter-only property. Under a classic script that assignment is a
   silent no-op in sloppy mode; under a module it throws
   `TypeError: Cannot set property window of #<Window> which has only a getter`
   and GSAP never loads at all.

   So the scripts run as scripts, and this module simply hands the rest of the
   project the globals they defined. Everything else imports from here, so no
   other file has to know that any of this is true.

   Load order is guaranteed: classic deferred scripts and module scripts share
   one queue and run in document order, and index.html puts these first. */

const { gsap, ScrollTrigger } = window;

if (!gsap || !ScrollTrigger) {
  throw new Error(
    'GSAP is missing. index.html must load /js/vendor/gsap.min.js and ' +
      '/js/vendor/ScrollTrigger.min.js as deferred classic scripts before any module.'
  );
}

export { gsap, ScrollTrigger };
