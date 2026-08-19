/* The motion layer. The only module in the project that imports GSAP; every
   section asks for an effect by name and gets a destroy() back.

   Two rules hold this together:

   1. Motion is additive. Every animated element is fully visible and readable
      with no JavaScript at all — these helpers animate *from* an offset state
      that GSAP applies itself at creation time. A failed script or a blocked
      vendor file leaves a plain, complete page rather than a blank one.

   2. Reduced motion is answered here, once. Each helper returns the same shape
      whether or not it animated, so callers never branch on the preference.
      Under `prefers-reduced-motion: reduce` nothing is tweened and no
      ScrollTrigger is created — CSS suppressing an animation that is already
      running still costs the visitor the layout thrash it caused. */

import { gsap, ScrollTrigger } from '../vendor/gsap.js';
import { prefersReducedMotion } from './motion.js';

gsap.registerPlugin(ScrollTrigger);

/* ScrollTrigger reads the scroller's height at creation. Web fonts and images
   settle after that, so a refresh is scheduled once the page is fully loaded
   and again whenever a section changes shape (a tab switch, a disclosure). */
if (document.readyState !== 'complete') {
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

const NOOP_HANDLE = Object.freeze({ destroy() {} });

/* Where a trigger fires, as a fraction of the viewport. 0.85 means "when the
   element's top has risen into the bottom 15% of the screen" — late enough to
   feel like a response to scrolling, early enough that the visitor never
   arrives at an element mid-animation. */
const ENTER_AT = 'top 85%';

/** @returns {boolean} true when motion should actually run. */
export function motionEnabled() {
  return !prefersReducedMotion();
}

/** Recompute every trigger's start and end. Call after a layout change. */
export function refreshTriggers() {
  ScrollTrigger.refresh();
}

/**
 * Rise-and-fade a set of elements as they scroll into view.
 *
 * @param {Element|Element[]|NodeList} targets
 * @param {object} [options]
 * @param {Element} [options.trigger] Element that drives the timing. Defaults
 *   to the first target, which is right when the targets are one block.
 * @param {number} [options.y] Distance to rise, in pixels.
 * @param {number} [options.stagger] Seconds between successive targets.
 * @param {number} [options.duration] Seconds.
 * @param {number} [options.delay] Seconds.
 * @returns {{ destroy: () => void }}
 */
export function revealOnScroll(targets, options = {}) {
  const list = toArray(targets);
  if (!list.length || !motionEnabled()) return NOOP_HANDLE;

  const tween = gsap.from(list, {
    opacity: 0,
    y: options.y ?? 26,
    duration: options.duration ?? 0.7,
    delay: options.delay ?? 0,
    stagger: options.stagger ?? 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: options.trigger || list[0],
      start: options.start || ENTER_AT,
      once: true,
    },
  });

  return handleFor(tween);
}

/**
 * Play a set of elements in immediately, without waiting for a scroll. For the
 * hero, which is already on screen when the page opens.
 *
 * @param {Element|Element[]|NodeList} targets
 * @param {object} [options] Same shape as revealOnScroll, minus the trigger.
 * @returns {{ destroy: () => void }}
 */
export function revealNow(targets, options = {}) {
  const list = toArray(targets);
  if (!list.length || !motionEnabled()) return NOOP_HANDLE;

  const tween = gsap.from(list, {
    opacity: 0,
    y: options.y ?? 22,
    duration: options.duration ?? 0.8,
    delay: options.delay ?? 0,
    stagger: options.stagger ?? 0.07,
    ease: 'power3.out',
  });

  return handleFor(tween);
}

/**
 * Drift an element against the scroll. Small distances only: this is depth,
 * not a ride. Anything past about 80px stops reading as parallax and starts
 * reading as a bug.
 *
 * @param {Element} target
 * @param {number} [distance] Pixels travelled across the whole trigger range.
 * @returns {{ destroy: () => void }}
 */
export function parallax(target, distance = 60) {
  if (!target || !motionEnabled()) return NOOP_HANDLE;

  const tween = gsap.fromTo(
    target,
    { y: distance * -0.5 },
    {
      y: distance * 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    }
  );

  return handleFor(tween);
}

/**
 * Build a timeline that is scrubbed by scroll position rather than played on
 * a clock, so the visitor drives it and can scrub back.
 *
 * Used for the process diagrams: scrolling through the block draws the flow in
 * execution order, which is the one thing a static picture cannot show.
 *
 * @param {Element} trigger
 * @param {(timeline: object) => void} build Receives the empty timeline.
 * @param {object} [options]
 * @param {string} [options.start]
 * @param {string} [options.end]
 * @returns {{ destroy: () => void }}
 */
export function scrubTimeline(trigger, build, options = {}) {
  if (!trigger || !motionEnabled()) return NOOP_HANDLE;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger,
      // Starts as the block's top edge crosses the bottom of the screen. A
      // later start leaves an empty bordered box on screen for the first
      // couple of hundred pixels of scrolling, which reads as a broken image
      // rather than as an animation waiting its turn.
      start: options.start || 'top 96%',
      end: options.end || 'bottom 70%',
      scrub: 0.6,
    },
  });

  build(timeline);
  return handleFor(timeline);
}

/**
 * Report scroll progress through the whole document, 0 to 1. Drives the hairline
 * progress bar under the header.
 *
 * @param {(progress: number) => void} onProgress
 * @returns {{ destroy: () => void }}
 */
export function onScrollProgress(onProgress) {
  // Deliberately not gated on reduced motion: this is a position indicator,
  // not an animation. Someone who suppressed motion still wants to know how
  // far down the page they are.
  const trigger = ScrollTrigger.create({
    trigger: document.documentElement,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => onProgress(self.progress),
  });

  return { destroy: () => trigger.kill() };
}

/**
 * Call back whenever a section becomes the one the visitor is looking at.
 * Used for the navigation's active state, so it is a plain observer rather
 * than an animation and runs regardless of the motion preference.
 *
 * @param {Element[]} sections In document order.
 * @param {(index: number) => void} onChange
 * @returns {{ destroy: () => void }}
 */
export function onSectionChange(sections, onChange) {
  let current = -1;

  const announce = (index) => {
    if (index === current) return;
    current = index;
    onChange(index);
  };

  const triggers = sections.map((section, index) =>
    ScrollTrigger.create({
      trigger: section,
      // A section counts as current once it covers the middle of the screen,
      // which is where a reader's attention actually is.
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) announce(index);
      },
    })
  );

  return {
    destroy() {
      triggers.forEach((trigger) => trigger.kill());
    },
  };
}

function toArray(targets) {
  if (!targets) return [];
  if (Array.isArray(targets)) return targets.filter(Boolean);
  if (targets instanceof Element) return [targets];
  return Array.from(targets);
}

/* GSAP tweens and timelines both kill their own ScrollTrigger when killed, so
   one shape covers every helper above. */
function handleFor(animation) {
  return {
    destroy() {
      if (animation.scrollTrigger) animation.scrollTrigger.kill();
      animation.kill();
    },
  };
}
