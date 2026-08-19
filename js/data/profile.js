/* Identity, contact details, and the copy the shell and Home section read.
   Every user-facing string on this page originates in js/data/ — components
   receive text, they never contain it. */

export const profile = Object.freeze({
  name: 'Warren Villagonzalo Gallardo',
  /* The wordmark below 1080px. The full name cannot wrap or shrink far
     enough to sit beside the nav and the theme switch. */
  shortName: 'Warren Gallardo',
  role: 'Power Platform Developer and Data Analyst',
  location: 'Cebu City, Philippines',
  locationCaption: 'CEBU CITY, PHILIPPINES',
  timezone: 'GMT+8',

  email: 'warrengallardo0204@gmail.com',
  phone: '+63 968 725 6022',
  github: 'https://github.com/Warren0204',
  linkedin: 'https://www.linkedin.com/in/warren-gallardo/',

  availability: Object.freeze({
    status: 'OPEN TO WORK',
    detail: 'CEBU CITY · REMOTE, HYBRID, OR ONSITE',
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
      detail: 'In production at Benchmark365',
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
      value: '2',
      label: 'SURFACES BUILT',
      detail: 'Web and mobile, one platform',
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
    github: 'GitHub',
    linkedin: 'LinkedIn',
  }),

  /* Each line here says one thing, once.

     This section used to state GMT+8 three times (strip, eyebrow, footer),
     "remote, hybrid, or onsite" twice (strip and the paragraph below it), and
     the email and phone twice (footer, and the link column directly above it)
     — all inside a single screenful. Repetition across sections a whole page
     apart is fine; repetition a reader can see all at once reads as an
     oversight.

     So the division of labour is: the strip carries status, the paragraph
     carries what the roles are, the link column carries the addresses, and
     the footer carries identity. */
  contact: Object.freeze({
    /* Status, at the moment someone is deciding whether to write: still
       looking, and how long an answer takes. The work arrangement is not
       repeated here — the paragraph below states it. */
    strip: 'OPEN TO WORK · REPLIES WITHIN A DAY',
    /* The timezone belongs to the strip, which is the only place it now
       appears in this section. */
    eyebrow: 'CONTACT',
    heading: 'Let’s talk',
    /* Addressed to someone hiring, which is who reads this section, and named
       with the same three tracks the sentence goes on to list. The only place
       the work arrangement is stated. */
    body: 'I am open to three kinds of role: Microsoft Power Platform and automation development, data analytics and business intelligence, and project management or coordination. Remote, hybrid, or onsite.',
    /* The contentinfo landmark. It carries who and where, because the email,
       the phone, and the timezone are all already on screen above it. */
    details: 'Warren Villagonzalo Gallardo · Cebu City, Philippines',

    /* Direct routes, for the visitor who would rather not fill anything in.
       Offered beside the form, never instead of it. */
    directEyebrow: 'OR REACH ME DIRECTLY',
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
        invalid: 'That does not look like an email address — check for a typo.',
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
    successBody: 'Thanks — I have it, and I will reply within a day.',
    successAgain: 'Send another message',
    errorTitle: 'That did not send',
    errorBody: 'Something went wrong on the way out. Try again, or email me directly at',
    offlineBody:
      'You appear to be offline. Reconnect and try again — nothing you typed has been lost.',
    /* No "above" or "below": the summary sits under the button, the fields it
       refers to are above it, and a live region is read out of place anyway. */
    invalidSummary: 'Check the highlighted fields, then send again.',

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
