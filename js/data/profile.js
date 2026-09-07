/* Identity, contact details, and the copy the shell and Home section read.
   Every user-facing string on this page originates in js/data/ — components
   receive text, they never contain it. */

export const profile = Object.freeze({
  name: 'Warren Villagonzalo Gallardo',
  /* The wordmark below 1080px. The full name cannot wrap or shrink far
     enough to sit beside the nav and the theme switch. */
  shortName: 'Warren Gallardo',
  role: 'Power Platform Developer and Data Analyst',
  /* Still needed outside contact.routes: contactForm falls back to a mailto
     link when a send fails. */
  email: 'warrengallardo0204@gmail.com',

  /* Stated once, at the top of the hero, in the eyebrow treatment. No pill and
     no dot: a coloured dot carries its meaning by colour alone, which is the
     one thing a status indicator may not do, and the words carry it already.

     One string rather than an object, because there is one rendering now. It
     used to be three: a card in Contact, a pill in the header, and a pill in
     the hero before that. This is also the only place the location and the
     time zone appear in rendered copy, which is what puts both on the first
     screen at every width. */
  availability: 'Open to work · Cebu City, GMT+8 · Replies within a day',

  /* The one-line role statement, above the headline. One phrase, not two: the
     second said what the About paragraph a few lines down already says, and a
     line that retypes itself every few seconds is harder to read, not easier. */
  heroPhrases: Object.freeze(['Power Platform, reporting, and AI-assisted delivery.']),

  headline: Object.freeze({
    lead: 'I modernize how operations run, and build ',
    tail: 'systems that stay standing.',
  }),

  /* The About copy. First person, no numbers: what I am and where I have built
     it. The numbers are the stat strip's job and the detail is Experience's;
     repeating either here would be the same fact twice on one screen. The
     certifications have their own cards in Credentials and the target roles are
     stated in the Contact paragraph, so neither is claimed twice. */
  summary:
    'I am an Information Technology graduate in Cebu City. I build business process automation and AI assisted applications. During my internship at an Australian managed service provider I built Power Platform automations and a Power BI dashboard, and for my capstone I built the web application and Firebase backend of a monitoring system validated with a Cebu City government office, where Claude assesses project reports through Anthropic’s API.',

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

    /* The viewer's own copy. The title is visible in the toolbar and is also
       what names the dialog through aria-labelledby, so it is one string doing
       both jobs rather than a heading and an aria-label that can drift. */
    viewerTitle: 'Warren Gallardo, CV',
    viewerDownload: 'Download PDF',
    viewerCloseAria: 'Close CV viewer',

    /* Page renders of the PDF above, regenerated with it. See the rule in
       docs/HANDOFF.md: the two are one artefact and are updated together.

       The native size is 1819x2573, and stating the ratio here is what keeps
       the panel from resizing under the reader while a page is still on the
       wire. Change the renders, change this. */
    pageAspectRatio: '1819 / 2573',

    /* The panel is 920px wide at most with 16px of padding either side, so a
       page is never drawn wider than 888 CSS px; below 600 the sheet is the
       screen less the same padding. Both terms overstate by a few pixels,
       which errs toward the sharper file, the same way the certificate thumbs
       in js/data/credentials.js do. */
    pageSizes: '(width >= 600px) min(888px, calc(100vw - 80px)), calc(100vw - 32px)',

    pages: Object.freeze([
      Object.freeze({
        src: '/assets/img/cv/cv-page-1.webp',
        srcset: '/assets/img/cv/cv-page-1-800.webp 800w, /assets/img/cv/cv-page-1.webp 1819w',
        alt: 'CV page 1 of 2',
      }),
      Object.freeze({
        src: '/assets/img/cv/cv-page-2.webp',
        srcset: '/assets/img/cv/cv-page-2-800.webp 800w, /assets/img/cv/cv-page-2.webp 1819w',
        alt: 'CV page 2 of 2',
      }),
    ]),
  }),

  ctas: Object.freeze({
    viewProjects: 'View projects',
    /* One CV control, not two. Reading it and keeping it are two different
       intentions, and the one that comes first should not cost a file on the
       reader's disk; the download is offered inside the viewer, at the point
       where they have seen what they would be keeping. */
    viewCv: 'View CV',
    /* Deliberately not "Email me". This scrolls to the contact form; a label
       promising a mail client and not opening one is a small lie, and on a
       phone with no mail app configured a mailto is a dead end. */
    getInTouch: 'Get in touch',
  }),

  /* Each line here says one thing, once. Every element has one job: the
     paragraph carries what the roles are and the routes carry the addresses.
     The status is stated at the top of the hero and nowhere else. */
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
    lead: 'I read every message.',

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
