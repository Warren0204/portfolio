/* Section order, labels, icons, and routes. Index order is the reading order, which on
   a single scrolling page is literally top to bottom. Adding a section means
   appending one object here and one module in js/sections/.

   They are still called chapters in the code. The word predates the scrolling
   layout, and renaming it would touch every module for no behavioural gain. */

export const chapters = Object.freeze([
  Object.freeze({
    id: 'home',
    label: 'Home',
    menuLabel: 'Home',
    /* The phone tab bar's glyph, a key in js/components/icon.js. */
    icon: 'house',
    route: '#/',
    title: 'Warren Villagonzalo Gallardo — Power Platform Developer and Data Analyst',
    description:
      'Power Platform developer and data analyst in Cebu City. I put automation and reporting into live operations, then document and hand them over so they keep running.',
  }),
  Object.freeze({
    id: 'projects',
    label: 'Projects',
    menuLabel: 'Projects',
    icon: 'folder',
    route: '#/projects',
    title: 'Projects — Warren Villagonzalo Gallardo',
    description:
      'Case studies from problem to deployment, including TranspiraFund, a monitoring platform built and validated with a city engineering department.',
  }),
  Object.freeze({
    id: 'experience',
    label: 'Experience',
    menuLabel: 'Experience',
    icon: 'briefcase',
    route: '#/experience',
    title: 'Experience — Warren Villagonzalo Gallardo',
    description:
      'The Benchmark365 internship: nine cloud flows, a canvas app, and a four page Power BI report shipped into production and handed to service account ownership.',
  }),
  Object.freeze({
    id: 'credentials',
    label: 'Credentials',
    menuLabel: 'Credentials',
    icon: 'award',
    route: '#/credentials',
    title: 'Credentials — Warren Villagonzalo Gallardo',
    description:
      'BSIT from the University of Cebu, the Google AI Professional Certificate, four development tracks, and the skills underneath them.',
  }),
  Object.freeze({
    id: 'contact',
    label: 'Contact',
    menuLabel: 'Contact',
    icon: 'email',
    route: '#/contact',
    title: 'Contact — Warren Villagonzalo Gallardo',
    description:
      'Open to Power Platform and automation development, data analytics, and project coordination roles. Remote, hybrid, or onsite from Cebu City.',
  }),
]);

/** @returns {object} the chapter with this id. */
export function chapterById(id) {
  return chapters.find((chapter) => chapter.id === id);
}

/** @returns {number} chapter index for a hash, or 0 when it matches nothing. */
export function indexForRoute(hash) {
  const normalized = hash === '' || hash === '#' ? '#/' : hash;
  const index = chapters.findIndex((chapter) => chapter.route === normalized);
  return index === -1 ? 0 : index;
}
