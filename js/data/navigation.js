/* Chapter order, labels, and routes. Index order is the reading order:
   forward equals right. Adding a chapter means appending one object here. */

export const chapters = Object.freeze([
  Object.freeze({
    id: 'home',
    label: 'HOME',
    menuLabel: 'Home',
    route: '#/',
    title: 'Warren Villagonzalo Gallardo — Power Platform Developer and Data Analyst',
    description:
      'Power Platform developer and data analyst in Cebu City. I put automation and reporting into live operations, then document and hand them over so they keep running.',
  }),
  Object.freeze({
    id: 'projects',
    label: 'PROJECTS',
    menuLabel: 'Projects',
    route: '#/projects',
    title: 'Projects — Warren Villagonzalo Gallardo',
    description:
      'Case studies from problem to deployment, including TranspiraFund, a monitoring platform built and validated with a city engineering department.',
  }),
  Object.freeze({
    id: 'experience',
    label: 'EXPERIENCE',
    menuLabel: 'Experience',
    route: '#/experience',
    title: 'Experience — Warren Villagonzalo Gallardo',
    description:
      'The Benchmark365 internship: nine cloud flows, a canvas app, and a four page Power BI report shipped into production and handed to service account ownership.',
  }),
  Object.freeze({
    id: 'credentials',
    label: 'CREDENTIALS',
    menuLabel: 'Credentials',
    route: '#/credentials',
    title: 'Credentials — Warren Villagonzalo Gallardo',
    description:
      'BSIT from the University of Cebu, the Google AI Professional Certificate, four development tracks, and the skills underneath them.',
  }),
  Object.freeze({
    id: 'contact',
    label: 'CONTACT',
    menuLabel: 'Contact',
    route: '#/contact',
    title: 'Contact — Warren Villagonzalo Gallardo',
    description:
      'Open to Power Platform and automation development, data analytics, and project coordination roles. Remote, hybrid, or onsite from Cebu City.',
  }),
]);

/* The three shortcut cards at the foot of Home. */
export const exploreCards = Object.freeze([
  Object.freeze({
    chapterId: 'projects',
    title: 'Projects',
    hook: 'Case studies of what I have built, from problem to deployment.',
  }),
  Object.freeze({
    chapterId: 'experience',
    title: 'Experience',
    hook: 'Where I have worked and the systems I shipped there.',
  }),
  Object.freeze({
    chapterId: 'credentials',
    title: 'Credentials',
    hook: 'Tracks I am building in, certifications, and education.',
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
