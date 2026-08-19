/* Deployment configuration. Values that change with where the site is hosted
   or which services it talks to, kept apart from content and from code.

   The contact form posts to Web3Forms, which emails the submission straight to
   profile.email. There is no build step and no environment variable: the key
   below is the entire configuration.

   The key is public on purpose — it is an inbox address in disguise, not a
   credential. It grants nothing except the ability to send mail to that one
   inbox, which is what a contact form is for. It cannot read anything, it
   cannot be used to fetch past submissions, and it is safe in a public
   repository. Web3Forms does the spam filtering, and the form carries its own
   honeypot on top.

   To point the form at a different inbox, get a new key at
   https://web3forms.com — enter the address, confirm it, and paste the key
   here. No account or password is created.

   If the key is ever cleared, the form still renders and still validates, but
   a send fails into the error state, which points the visitor at the mailto
   link instead. It never silently swallows a message. */

export const CONTACT_FORM_ENDPOINT = 'https://api.web3forms.com/submit';

export const CONTACT_FORM_ACCESS_KEY = '2519e12b-e926-4c41-a381-dd03ce07521b';

/** @returns {boolean} false while the access key is still the placeholder. */
export function contactFormConfigured() {
  return (
    typeof CONTACT_FORM_ACCESS_KEY === 'string' &&
    CONTACT_FORM_ACCESS_KEY.length > 0 &&
    !CONTACT_FORM_ACCESS_KEY.startsWith('PASTE-')
  );
}

/* hCaptcha, in front of the form. The honeypot catches the bots that fill every
   input they find; this catches the ones that read the markup first.

   Web3Forms publishes this sitekey for free-plan accounts to share — it is not
   account-specific and not a secret, and it is the one their Manual Setup docs
   hand out. Verification happens server-side at Web3Forms: they check the token
   against hCaptcha before mailing anything, so the browser cannot be talked out
   of it by editing this value.

   To use a sitekey of your own instead, create one at hcaptcha.com and paste it
   here. Nothing else changes. */
export const HCAPTCHA_SITEKEY = '50b2fe65-b00b-4b9e-ad62-3ba471098be2';
