/* hCaptcha, loaded on demand and wrapped so nothing else touches the global.

   This lives in core/ rather than components/ because it is a service, not a
   factory: it returns no DOM node, it owns a network side effect, and it wraps
   a third-party global the way js/vendor/gsap.js does. Everything in
   components/ takes data and hands back an element.

   ── Explicit rendering, not the zero-config script ─────────────────────────

   Web3Forms' drop-in script auto-renders any `.h-captcha` div that exists when
   it loads. This form does not exist then — it is built at runtime, and it is
   rebuilt again after every successful send — so implicit rendering would find
   nothing to bind to. `?render=explicit` plus a render() call per widget is the
   only arrangement that survives a form that comes and goes.

   ── Failing open ───────────────────────────────────────────────────────────

   Every function here is safe to call when the script never arrived: an ad
   blocker, a corporate proxy, or an offline visitor all leave `window.hcaptcha`
   undefined. In that case render() rejects, getResponse() answers with an empty
   string, and the caller is expected to let the submit through anyway. Web3Forms
   verifies the token server-side and rejects a missing one, which lands the
   visitor in the form's existing failure state with the mailto fallback. A
   captcha that cannot load must not be a locked door. */

import { el } from './dom.js';
import { HCAPTCHA_SITEKEY } from './config.js';

/* hCaptcha calls this global when its API is genuinely ready.

   The script's own `load` event is too early: `window.hcaptcha` exists by then
   but the API is still initialising, and rendering into that window logs
   "should not render before js api is fully loaded" and races. The documented
   pairing for `render=explicit` is an `onload` callback, so that is what this
   waits on. */
const READY_CALLBACK = '__portfolioHcaptchaReady';
const API_SRC = `https://js.hcaptcha.com/1/api.js?render=explicit&onload=${READY_CALLBACK}`;

/* One in-flight load shared by every caller, so a second render() while the
   first is still fetching does not inject the script twice. */
let pending = null;

/** @returns {Promise<object>} the hcaptcha global, once it is ready to render. */
function loadApi() {
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    window[READY_CALLBACK] = () => {
      delete window[READY_CALLBACK];
      resolve(window.hcaptcha);
    };

    const script = el('script', {
      attrs: { src: API_SRC, async: '', defer: '' },
      on: {
        error: () => {
          // Let a later attempt retry rather than caching the failure forever.
          delete window[READY_CALLBACK];
          pending = null;
          reject(new Error('hCaptcha script could not be loaded'));
        },
      },
    });

    document.head.appendChild(script);
  });

  return pending;
}

/**
 * Draw a widget into a container.
 *
 * @param {HTMLElement} container Emptied by the caller before re-rendering —
 *   hCaptcha refuses a container that already holds a widget.
 * @param {object} [options]
 * @param {string} [options.theme] 'dark' or 'light'. Anything else means dark,
 *   matching the site's own default.
 * @returns {Promise<string>} the widget id, needed by getResponse and reset.
 */
export async function renderCaptcha(container, { theme } = {}) {
  const hcaptcha = await loadApi();

  return hcaptcha.render(container, {
    sitekey: HCAPTCHA_SITEKEY,
    theme: theme === 'light' ? 'light' : 'dark',
  });
}

/**
 * @param {string|null} widgetId
 * @returns {string} the token, or '' when there is no widget or nothing solved.
 */
export function getCaptchaResponse(widgetId) {
  if (widgetId === null || widgetId === undefined || !window.hcaptcha) return '';

  try {
    return window.hcaptcha.getResponse(widgetId) || '';
  } catch {
    // A widget id that hCaptcha no longer recognises throws rather than
    // returning empty. Same outcome either way: no token.
    return '';
  }
}

/**
 * Re-arm a widget for another attempt. Tokens are single use, so a failed send
 * leaves a spent one behind and the next submit would be rejected for a reason
 * the visitor cannot see.
 *
 * @param {string|null} widgetId
 */
export function resetCaptcha(widgetId) {
  if (widgetId === null || widgetId === undefined || !window.hcaptcha) return;

  try {
    window.hcaptcha.reset(widgetId);
  } catch {
    // Nothing to re-arm. The next render makes a fresh widget anyway.
  }
}
