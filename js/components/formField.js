/* A labelled form control that knows whether it is valid and can say why.

   The rules it follows, and why each one:

   - The label is a real <label> above the control, never a placeholder. A
     placeholder disappears the moment someone starts typing, which is exactly
     when they need to check what the field was for, and it fails contrast in
     every browser's default styling.
   - Validation runs on blur, not on every keystroke. Validating as someone
     types tells them their half-finished email address is wrong.
   - Once a field has failed, it re-validates on input, so the error clears the
     instant it is fixed rather than at the next blur.
   - The error message says how to fix it, sits beside the field, and is wired
     to the control with aria-describedby plus aria-invalid, so a screen reader
     reads the problem when it lands on the input rather than announcing an
     error somewhere else on the page. */

import { el } from '../core/dom.js';

/**
 * @param {object} props
 * @param {string} props.id
 * @param {string} props.name Submitted field name.
 * @param {object} props.copy `{ label, type?, autocomplete?, hint?, rows?, required, invalid? }`
 * @returns {{
 *   element: HTMLElement,
 *   control: HTMLElement,
 *   value: () => string,
 *   validate: () => string|null,
 *   clear: () => void,
 *   focus: () => void
 * }}
 */
export function createFormField({ id, name, copy }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const isTextarea = Boolean(copy.rows);
  const describedBy = [copy.hint ? hintId : null, errorId].filter(Boolean).join(' ');

  const control = el(isTextarea ? 'textarea' : 'input', {
    class: `field__control${isTextarea ? ' field__control--area' : ''}`,
    attrs: {
      id,
      name,
      type: isTextarea ? null : copy.type || 'text',
      rows: copy.rows || null,
      autocomplete: copy.autocomplete || null,
      // required is deliberately absent: the browser's own bubble cannot be
      // styled, cannot be read by the page's live region, and fires before
      // this module gets a chance to write a message worth reading.
      'aria-describedby': describedBy,
    },
  });

  const error = el('p', { class: 'field__error', attrs: { id: errorId, hidden: '' } });

  const element = el('div', { class: 'field' }, [
    el('label', { class: 'field__label', text: copy.label, attrs: { for: id } }),
    copy.hint ? el('p', { class: 'field__hint', text: copy.hint, attrs: { id: hintId } }) : null,
    control,
    error,
  ]);

  let showing = false;

  function problem() {
    const value = control.value.trim();
    if (!value) return copy.required;

    // Deliberately permissive. The only thing worth rejecting here is an
    // address that cannot be one; anything stricter turns valid addresses
    // away, and the real check is whether the reply arrives.
    if (copy.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return copy.invalid;
    }

    return null;
  }

  function show(message) {
    showing = Boolean(message);
    error.textContent = message || '';
    error.toggleAttribute('hidden', !message);
    element.classList.toggle('field--invalid', showing);
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  }

  control.addEventListener('blur', () => show(problem()));
  control.addEventListener('input', () => {
    if (showing) show(problem());
  });

  return {
    element,
    control,
    value: () => control.value.trim(),

    /** @returns {string|null} The message shown, or null when the field is fine. */
    validate() {
      const message = problem();
      show(message);
      return message;
    },

    clear() {
      control.value = '';
      show(null);
    },

    focus() {
      control.focus();
    },
  };
}
