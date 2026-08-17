/* Identity, contact details, and the copy the shell and Home chapter read.
   Every user-facing string on this page originates in js/data/ — components
   receive text, they never contain it. */

export const profile = Object.freeze({
  name: 'Warren Villagonzalo Gallardo',
  /* The wordmark below 800px. The full name cannot wrap or shrink far enough
     to sit beside the controls on a 360px phone. */
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
    emailMe: 'Email me',
    github: 'GitHub',
    linkedin: 'LinkedIn',
  }),

  contact: Object.freeze({
    strip: 'OPEN TO WORK · REMOTE, HYBRID, OR ONSITE',
    eyebrow: 'CONTACT · GMT+8',
    /* Addressed to someone hiring, which is who reads this chapter, and named
       with the same three tracks the paragraph below it goes on to list. */
    headlineLead: 'Hiring for automation, analytics, or ',
    headlineTail: 'project delivery?',
    body: 'I am open to three kinds of role: Microsoft Power Platform and automation development, data analytics and business intelligence, and project management or coordination. Remote, hybrid, or onsite. The fastest way to reach me is email.',
    details:
      'warrengallardo0204@gmail.com · +63 968 725 6022 · replies within a day · GMT+8',
  }),

  /* The loading screen's copy is the one exception to "all text lives here":
     it is written into index.html so it paints before this module loads. */

  themeToggleLabel: 'Switch between dark and light mode',
  themeLabels: Object.freeze({ light: 'LIGHT', dark: 'DARK' }),
  homeLabel: 'Warren Gallardo, home',
});
