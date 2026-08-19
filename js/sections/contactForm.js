/* The contact form.

   Three fields, because three is what it takes to reply to someone: who you
   are, where to answer, and what you want. A subject line, a company field, a
   phone number, and a "how did you hear about me" dropdown would each cost a
   real visitor a decision and buy nothing that the message itself does not
   already carry.

   All five states the review checklist asks for are here: idle, submitting
   (busy button, resists a second click), invalid (inline messages, focus moved
   to the first bad field, one summary line in the live region), failed (the
   values are still there, with the mailto as a way out), and sent.

   Nothing is stored, and nothing is sent anywhere except the endpoint in
   js/core/config.js, which mails it to one inbox. */

import { el, on } from '../core/dom.js';
import { createFormField } from '../components/formField.js';
import { createSectionEyebrow } from '../components/sectionEyebrow.js';
import {
  CONTACT_FORM_ACCESS_KEY,
  CONTACT_FORM_ENDPOINT,
  contactFormConfigured,
} from '../core/config.js';
import { profile } from '../data/profile.js';

const copy = profile.contactForm;

/**
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createContactForm() {
  const fields = {
    name: createFormField({ id: 'contact-name', name: 'name', copy: copy.fields.name }),
    email: createFormField({ id: 'contact-email', name: 'email', copy: copy.fields.email }),
    message: createFormField({
      id: 'contact-message',
      name: 'message',
      copy: copy.fields.message,
    }),
  };

  const ordered = [fields.name, fields.email, fields.message];

  /* Off-screen rather than display:none, and never focusable: a bot that fills
     every input it can find fills this one, and a real visitor never sees it. */
  const honeypot = el('div', { class: 'field field--honeypot', attrs: { 'aria-hidden': 'true' } }, [
    el('label', { text: copy.honeypotLabel, attrs: { for: 'contact-botcheck' } }),
    el('input', {
      attrs: {
        id: 'contact-botcheck',
        name: 'botcheck',
        type: 'text',
        tabindex: '-1',
        autocomplete: 'off',
      },
    }),
  ]);

  const submit = el('button', {
    class: 'button button--primary contact-form__submit',
    text: copy.submit,
    attrs: { type: 'submit' },
  });

  /* One live region for the whole form. Announcing per-field errors here as
     well as beside the control would read every message twice. */
  const status = el('p', {
    class: 'contact-form__status',
    attrs: { role: 'status', 'aria-live': 'polite' },
  });

  const form = el('form', { class: 'contact-form__form', attrs: { novalidate: '' } }, [
    ...ordered.map((field) => field.element),
    honeypot,
    submit,
    status,
  ]);

  const element = el('div', { class: 'contact-form' }, [
    createSectionEyebrow({ text: copy.eyebrow, tone: 'accent' }),
    el('h3', { class: 'contact-form__heading', text: copy.heading }),
    el('p', { class: 'contact-form__lead', text: copy.lead }),
    form,
  ]);

  let sending = false;

  function setStatus(message, tone) {
    status.textContent = message;
    status.className = `contact-form__status${tone ? ` contact-form__status--${tone}` : ''}`;
  }

  /** Swap the form for a confirmation, with a way back to it. */
  function showSuccess() {
    const again = el('button', {
      class: 'button button--outline',
      text: copy.successAgain,
      attrs: { type: 'button' },
    });

    const panel = el('div', { class: 'contact-form__done', attrs: { role: 'status' } }, [
      el('p', { class: 'contact-form__done-title', text: copy.successTitle }),
      el('p', { class: 'contact-form__done-body', text: copy.successBody }),
      again,
    ]);

    again.addEventListener('click', () => {
      ordered.forEach((field) => field.clear());
      setStatus('', null);
      element.replaceChild(form, panel);
      fields.name.focus();
    });

    element.replaceChild(panel, form);
  }

  function showFailure(body) {
    setStatus('', null);
    status.replaceChildren(
      el('span', { class: 'contact-form__status-title', text: copy.errorTitle }),
      el('span', { text: ` ${body} ` }),
      el('a', { text: profile.email, attrs: { href: `mailto:${profile.email}` } })
    );
    status.className = 'contact-form__status contact-form__status--error';
  }

  /* Sent as FormData, not JSON, and that is not a style choice.

     `Content-Type: application/json` is not a CORS-safelisted value, so the
     browser fires an OPTIONS preflight before the real request — and the
     preflight is refused, which fails the send with
     "Response to preflight request doesn't pass access control check" and no
     hint that the body was ever the problem.

     FormData sends multipart/form-data, which is safelisted. No preflight, no
     CORS negotiation, and the request works from any origin including a local
     static server. Do not set Content-Type by hand here either: the browser
     has to add the multipart boundary itself. */
  async function send(payload) {
    const body = new FormData();
    for (const [key, value] of Object.entries(payload)) body.append(key, value);

    const response = await fetch(CONTACT_FORM_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    });

    // The endpoint answers 200 with { success: false } for its own rejections,
    // so the status code alone is not the answer.
    const result = await response.json().catch(() => ({ success: false }));
    if (!response.ok || !result.success) throw new Error('rejected');
  }

  const stopSubmit = on(form, 'submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    // Validate everything, then move focus to the first thing that failed —
    // the visitor should never have to hunt for which field the form means.
    const problems = ordered.map((field) => field.validate());
    const firstBad = problems.findIndex(Boolean);
    if (firstBad !== -1) {
      setStatus(copy.invalidSummary, 'error');
      ordered[firstBad].focus();
      return;
    }

    if (honeypot.querySelector('input').value) return;

    if (!navigator.onLine) {
      showFailure(copy.offlineBody);
      return;
    }

    if (!contactFormConfigured()) {
      // A developer problem, surfaced to the developer. The visitor gets the
      // same honest way out they would get from any other failure.
      window.console.warn(
        'Contact form: CONTACT_FORM_ACCESS_KEY is unset in js/core/config.js, so nothing was sent.'
      );
      showFailure(copy.errorBody);
      return;
    }

    sending = true;
    submit.textContent = copy.submitting;
    submit.setAttribute('aria-busy', 'true');
    setStatus('', null);

    try {
      await send({
        access_key: CONTACT_FORM_ACCESS_KEY,
        subject: `Portfolio message from ${fields.name.value()}`,
        from_name: fields.name.value(),
        name: fields.name.value(),
        email: fields.email.value(),
        message: fields.message.value(),
      });
      showSuccess();
    } catch {
      // Every value the visitor typed is still in the form. Retrying is one
      // click, and nothing has to be re-entered.
      showFailure(copy.errorBody);
    } finally {
      sending = false;
      submit.textContent = copy.submit;
      submit.removeAttribute('aria-busy');
    }
  });

  return { element, destroy: stopSubmit };
}
