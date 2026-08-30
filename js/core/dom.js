/* DOM construction helpers. Every node in the project is built here rather
   than through innerHTML, so no user-facing string is ever parsed as markup. */

/**
 * Build an element.
 *
 * @param {string} tag
 * @param {object} [options]
 * @param {string} [options.class] Class attribute.
 * @param {string} [options.text] Text content, set safely.
 * @param {object} [options.attrs] Attributes; null or undefined values are skipped.
 * @param {object} [options.dataset] data-* values.
 * @param {object} [options.style] Inline style, for genuinely dynamic values only.
 * @param {object} [options.on] Event handlers, keyed by event name.
 * @param {Array|Node|string} [children]
 * @returns {HTMLElement}
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);

  if (options.class) node.className = options.class;
  if (options.text !== undefined) node.textContent = options.text;

  for (const [name, value] of Object.entries(options.attrs || {})) {
    if (value === null || value === undefined) continue;
    node.setAttribute(name, String(value));
  }

  for (const [name, value] of Object.entries(options.dataset || {})) {
    node.dataset[name] = String(value);
  }

  for (const [name, value] of Object.entries(options.style || {})) {
    node.style.setProperty(name, value);
  }

  for (const [type, handler] of Object.entries(options.on || {})) {
    node.addEventListener(type, handler);
  }

  append(node, children);
  return node;
}

/* Internal. Every caller outside this file goes through el() or
   replaceChildren(), so exporting it would only invite a second way to do the
   same thing. */
function append(parent, children) {
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined || child === false) continue;
    if (Array.isArray(child)) {
      append(parent, child);
    } else if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
    } else {
      parent.appendChild(child);
    }
  }
  return parent;
}

/**
 * Add a listener and get its removal back, so callers can hand a single
 * function to their destroy().
 *
 * @returns {() => void}
 */
export function on(target, type, handler, options) {
  target.addEventListener(type, handler, options);
  return () => target.removeEventListener(type, handler, options);
}

/**
 * True for a click the browser should keep for itself: new tab, new window,
 * download, or any button but the primary one.
 *
 * Three places take over a plain left click on a real link and have to let
 * every other click through untouched, so the test is stated here once rather
 * than copied into each of them.
 *
 * @param {MouseEvent} event
 * @returns {boolean}
 */
export function isModifiedClick(event) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

/** Replace an element's children in one pass. */
export function replaceChildren(parent, children) {
  parent.replaceChildren();
  append(parent, children);
  return parent;
}
