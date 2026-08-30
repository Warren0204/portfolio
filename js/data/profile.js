/* Identity, contact details, and the copy the shell and Home section read.
   Every user-facing string on this page originates in js/data/ — components
   receive text, they never contain it. */

export const profile = Object.freeze({
  name: 'Warren Villagonzalo Gallardo',
  /* The wordmark below 1080px. The full name cannot wrap or shrink far
     enough to sit beside the nav and the theme switch. */
  shortName: 'Warren Gallardo',
  role: 'Power Platform Developer and Data Analyst',
  /* The portrait caption. The other addresses live in contact.routes, which is
     their single source — keeping copies up here meant two places to forget. */
  locationCaption: 'CEBU CITY, PHILIPPINES',

  /* Still needed outside contact.routes: contactForm falls back to a mailto
     link when a send fails. */
  email: 'warrengallardo0204@gmail.com',

  /* Stated once, in Contact. It used to sit in the hero as well, which meant a
     reader met the same five words twice on one page.

     The work arrangement is not repeated here — the Contact paragraph says
     "remote, hybrid, or onsite" — and neither is the location, which the
     footer carries. What is left is the part that changes: am I looking, and
     how fast will you hear back. */
  availability: Object.freeze({
    status: 'OPEN TO WORK',
    response: 'Replies within a day',
    window: 'GMT+8',

    /* The header's compact form of the same fact. Sentence case rather than a
       lowercased copy of `status`: the contact chip's caps are a deliberate
       mono-label treatment, and the header chip sits beside sentence-case nav
       furniture. One string per rendering, not one string reused in two cases.

       `shortAria` names the destination, which the visible text alone does
       not. It contains the visible text verbatim, so it satisfies WCAG 2.5.3
       Label in Name — a speech-input user saying "open to work" still hits it. */
    short: 'Open to work',
    shortAria: 'Open to work, go to contact',
  }),

  /* Typewriter line above the headline. */
  heroPhrases: Object.freeze([
    'I build automation that runs on its own.',
    'Power Platform, reporting, and AI-assisted delivery.',
  ]),

  headline: Object.freeze({
    lead: 'I modernize how operations run, and build ',
    tail: 'systems that stay standing.',
  }),

  summary:
    'Power Platform developer and data analyst. BSIT graduate in Cebu City. I put automation and reporting into a company’s live operations, then documented and handed them over so they keep running without me. I also led a monitoring platform built and validated with a government engineering office.',

  /* The evidence strip under the hero. A recruiter reading for eight seconds
     reads numbers, not paragraphs — so these are counts of shipped work, each
     one traceable to something further down the page. Nothing aspirational
     goes in here. */
  heroStats: Object.freeze([
    Object.freeze({
      value: '9',
      label: 'CLOUD FLOWS',
      /* The client is deliberately unnamed here and everywhere else on this
         page. See the disclosure note in js/data/experience.js. */
      detail: 'Scheduled, self maintaining, in production',
    }),
    Object.freeze({
      value: '3',
      label: 'SYSTEMS SHIPPED',
      detail: 'Built, documented, handed over',
    }),
    Object.freeze({
      value: '4',
      label: 'PAGE BI REPORT',
      detail: 'On a scheduled daily refresh',
    }),
    Object.freeze({
      value: '1',
      label: 'PROJECT VALIDATED',
      /* "Surfaces built" counted an implementation detail. Validation by the
         office that would actually use it is the harder thing and the one
         worth claiming. */
      detail: 'TranspiraFund, with its sponsor user',
    }),
  ]),

  scrollCue: 'SCROLL',

  portrait: Object.freeze({
    src: '/assets/img/portrait.webp',
    alt: 'Warren Gallardo',
    width: 400,
    height: 400,
    figureLabel: 'Portrait of Warren Gallardo',
  }),

  cv: Object.freeze({
    href: '/assets/docs/Warren_Gallardo_CV.pdf',
    downloadName: 'Warren_Gallardo_CV.pdf',
  }),

  ctas: Object.freeze({
    viewProjects: 'View projects',
    downloadCv: 'Download CV',
    /* Deliberately not "Email me". This scrolls to the contact form; a label
       promising a mail client and not opening one is a small lie, and on a
       phone with no mail app configured a mailto is a dead end. */
    getInTouch: 'Get in touch',
  }),

  /* Each line here says one thing, once. Every element has one job: the
     availability card carries status, the paragraph carries what the roles
     are, the routes carry the addresses, and the footer carries identity. */
  contact: Object.freeze({
    eyebrow: 'CONTACT',
    heading: 'Let’s talk',
    /* Addressed to someone hiring, which is who reads this section, and named
       with the same three tracks the sentence goes on to list. The only place
       the work arrangement is stated. */
    body: 'I am open to three kinds of role: Microsoft Power Platform and automation development, data analytics and business intelligence, and project management or coordination. Remote, hybrid, or onsite.',
    /* Direct routes, for the visitor who would rather not fill anything in.
       Offered beside the form, never instead of it — the form cannot attach a
       job description, CC a colleague, or land in someone's ATS thread, and a
       recruiter who needs any of those will just leave if there is no address.

       Ordered by how likely each is to be wanted. */
    routesEyebrow: 'Or reach me directly',
    routes: Object.freeze([
      Object.freeze({
        id: 'email',
        icon: 'email',
        label: 'Email',
        value: 'warrengallardo0204@gmail.com',
        href: 'mailto:warrengallardo0204@gmail.com',
      }),
      Object.freeze({
        id: 'linkedin',
        icon: 'linkedin',
        label: 'LinkedIn',
        value: 'warren-gallardo',
        href: 'https://www.linkedin.com/in/warren-gallardo/',
        external: true,
      }),
      Object.freeze({
        id: 'github',
        icon: 'github',
        label: 'GitHub',
        value: 'Warren0204',
        href: 'https://github.com/Warren0204',
        external: true,
      }),
      /* Deliberately not a tel: link, and deliberately last.

         An unscheduled call from an unknown number does not get answered, so
         a tap-to-call button would send people to a dead end and make me look
         unresponsive. Stating the preference positively — text first, calls
         arranged by email — tells someone how to succeed rather than
         advertising what I distrust. The number stays selectable text so it
         can still be copied. */
      Object.freeze({
        id: 'phone',
        icon: 'message',
        label: 'Phone',
        value: '+63 968 725 6022',
        note: 'Text me here. I arrange calls by email first.',
      }),
    ]),
  }),

  /* The contact form. Three fields, because three is what it takes to reply to
     someone: who you are, where to answer, and what you want. Anything else
     would be data collected for its own sake. */
  contactForm: Object.freeze({
    eyebrow: 'SEND A MESSAGE',
    heading: 'Tell me what you are hiring for',
    lead: 'I read every message and reply within a day.',

    fields: Object.freeze({
      name: Object.freeze({
        label: 'Your name',
        autocomplete: 'name',
        required: 'Enter your name so I know who I am replying to.',
      }),
      email: Object.freeze({
        label: 'Email address',
        type: 'email',
        autocomplete: 'email',
        hint: 'I will only use this to reply.',
        required: 'Enter your email address so I can reply.',
        invalid: 'That does not look like an email address. Check for a typo.',
      }),
      message: Object.freeze({
        label: 'Message',
        autocomplete: 'off',
        rows: 5,
        required: 'Add a short message so I know what you need.',
      }),
    }),

    submit: 'Send message',
    submitting: 'Sending…',

    /* Every one of the five states the review checklist asks for. */
    successTitle: 'Message sent',
    successBody: 'Thanks. I have it and will reply within a day.',
    successAgain: 'Send another message',
    errorTitle: 'That did not send',
    errorBody: 'Something went wrong on the way out. Try again, or email me directly at',
    offlineBody:
      'You appear to be offline. Reconnect and try again. Nothing you typed has been lost.',
    /* No "above" or "below": the summary sits under the button, the fields it
       refers to are above it, and a live region is read out of place anyway. */
    invalidSummary: 'Check the highlighted fields, then send again.',

    /* Says what to do, not what went wrong. "Captcha failed" would be accurate
       and useless — the visitor has not failed anything, they have simply not
       ticked the box yet. */
    captchaRequired: 'Please confirm you are human before sending.',

    /* Honeypot. A real visitor never sees this field, so anything in it came
       from a bot filling every input it found. */
    honeypotLabel: 'Leave this field empty',
  }),

  /* The loading screen's copy is the one exception to "all text lives here":
     it is written into index.html so it paints before this module loads. */

  themeToggleLabel: 'Switch between dark and light mode',
  themeLabels: Object.freeze({ light: 'LIGHT', dark: 'DARK' }),
  homeLabel: 'Warren Gallardo, home',
});
