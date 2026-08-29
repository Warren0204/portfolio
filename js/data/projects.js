/* Project case studies. Adding a project means appending one object here —
   no component or stylesheet changes. This copy is the authoritative wording;
   the section renders whatever is here and adds nothing of its own.

   An entry with `kind: 'compact'` renders as one card rather than a full case
   study: for work that is real but small. Tags and periods are sentence case
   here and uppercased by the stylesheet. */

/* The notebook behind the guided project. One constant, so it can be swapped
   in one line. */
export const DATACAMP_NOTEBOOK_URL =
  'https://www.datacamp.com/datalab/w/c51273ae-41ff-47f6-b2ad-df3bc716c6a8/edit';

export const projects = Object.freeze([
  Object.freeze({
    id: 'transprafund',
    tag: 'Capstone project',
    period: '2025 to 2026',
    title: 'TranspiraFund',
    team: 'Team of four',
    roles: Object.freeze(['Project Manager', 'Web and Mobile Developer', 'QA Tester']),

    summary:
      'A cross-platform monitoring system, web and mobile, giving a city engineering department one place to track barangay infrastructure projects from creation through field submission to review, with AI assisted milestone planning and photo verification.',

    problem:
      'City funded barangay level infrastructure projects in Cebu City were monitored through fragmented manual methods: group chats, verbal updates, and paper reports. The Construction Services Division had no centralized digital system for tracking field progress, validating proof of work, or maintaining an audit trail during the post award implementation phase.',

    impact:
      'A centralized monitoring pipeline that takes a project from creation through field submission to review in one place, replacing group chats and paper reports with an audit trail and real time notifications across both surfaces. Validated by our sponsor user at the Cebu City Construction Department against the workflows their office actually follows, ready to be implemented.',

    status:
      'Completed and validated with the Cebu City Construction Department under the Department of Engineering and Public Works, against the monitoring workflows that office actually follows.',

    /* The surface switcher. Each surface is one tab. */
    surfaces: Object.freeze([
      Object.freeze({
        id: 'web',
        label: 'Web dashboard',
        caption: 'For the Head of the Construction Services Division',
        items: Object.freeze([
          'Project creation and engineer assignment',
          'Centralized monitoring of every active project',
          'AI photo verification review with inline verdicts',
          'Compliance document review',
          'Dual lane audit trail and real time notifications',
        ]),
      }),
      Object.freeze({
        id: 'mobile',
        label: 'Mobile app',
        caption: 'For assigned Project Engineers in the field',
        items: Object.freeze([
          'Geotagged proof of work capture',
          'AI assisted milestone planning',
          'Progress submission from the field',
          'Notice to Proceed compliance uploads',
        ]),
      }),
      /* The AI work under both surfaces, split out of the shared foundation
         so it is one token rather than three lines inside another. */
      Object.freeze({
        id: 'ai-layer',
        label: 'AI layer',
        caption: 'Shared foundation under both surfaces',
        items: Object.freeze([
          'Milestone generation and title validation on Claude Haiku 4.5, structured through forced tool use and server side validation',
          'Vision based proof of work verification on Claude Sonnet, triggered automatically on upload',
          'Retrieval based milestone selection over a 20 project SME validated corpus',
        ]),
      }),
      Object.freeze({
        id: 'foundation',
        label: 'Shared foundation',
        caption: 'Shared foundation under both surfaces',
        items: Object.freeze([
          'Multi tenant architecture with a four tier role hierarchy and tenant isolation through custom claims plus Firestore and Storage rules',
          'Tamper evident server side image stamping with geotag and timestamp burn in',
        ]),
      }),
    ]),

    stackGroups: Object.freeze([
      Object.freeze({
        label: 'WEB DASHBOARD',
        items: Object.freeze(['React + Vite', 'Firebase Hosting']),
      }),
      Object.freeze({ label: 'MOBILE APP', items: Object.freeze(['React Native', 'Gradle']) }),
      Object.freeze({
        label: 'BACKEND AND AI',
        items: Object.freeze(['Firebase', 'Node.js 22', 'Claude API']),
      }),
      Object.freeze({ label: 'DESIGN', items: Object.freeze(['Figma']) }),
    ]),
  }),

  Object.freeze({
    id: 'students-mental-health',
    kind: 'compact',
    tag: 'Guided project',
    period: '2026',
    title: "Analyzing Students' Mental Health",
    summary:
      'PostgreSQL analysis of a 286-record mental health survey from a Japanese international university, testing whether international students show higher depression risk and whether length of stay is a factor. Completed the DataCamp guided project deliverable, then extended it with a data-quality audit, a missing-value investigation, severity and connectedness banding, and a stress comparison.',
    context:
      'DataCamp guided project, SQL coursework (Associate Data Engineer in SQL track). Completed and extended.',
    tags: Object.freeze(['SQL', 'PostgreSQL', 'DataCamp DataLab']),
    links: Object.freeze([
      Object.freeze({ label: 'Open notebook', href: DATACAMP_NOTEBOOK_URL, external: true }),
    ]),
    status: Object.freeze({ text: 'Completed', tone: 'ok' }),
  }),
]);

/* Section furniture, kept beside the content it labels. */
export const projectsCopy = Object.freeze({
  eyebrow: 'WHAT I HAVE BUILT',
  heading: 'Projects',
  lead: 'Case studies from the problem through to what shipped, and who it was validated with.',
  eyebrows: Object.freeze({
    problem: 'THE PROBLEM',
    solution: 'OUR SOLUTION',
    built: 'WHAT WE BUILT',
    surfaces: 'Project surfaces',
    stack: 'BUILT WITH',
    status: 'STATUS',
    role: 'MY ROLE',
  }),
});
