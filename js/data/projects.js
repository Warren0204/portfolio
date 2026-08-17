/* Project case studies. Adding a project means appending one object here —
   no component or stylesheet changes. Copy is transcribed from the design
   prototype and is authoritative. */

export const projects = Object.freeze([
  Object.freeze({
    id: 'transprafund',
    tag: 'CAPSTONE',
    period: '2025 TO 2026',
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
        label: 'WEB DASHBOARD',
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
        label: 'MOBILE APP',
        caption: 'For assigned Project Engineers in the field',
        items: Object.freeze([
          'Geotagged proof of work capture',
          'AI assisted milestone planning',
          'Progress submission from the field',
          'Notice to Proceed compliance uploads',
        ]),
      }),
      Object.freeze({
        id: 'foundation',
        label: 'SHARED FOUNDATION',
        caption: 'Shared foundation under both surfaces',
        items: Object.freeze([
          'Multi tenant architecture with a four tier role hierarchy and tenant isolation through custom claims plus Firestore and Storage rules',
          'Milestone generation and title validation on Claude Haiku 4.5, structured through forced tool use and server side validation',
          'Vision based proof of work verification on Claude Sonnet, triggered automatically on upload',
          'Retrieval based milestone selection over a 20 project SME validated corpus',
          'Tamper evident server side image stamping with geotag and timestamp burn in',
        ]),
      }),
    ]),

    stackGroups: Object.freeze([
      Object.freeze({ label: 'WEB DASHBOARD', items: Object.freeze(['React + Vite', 'Firebase Hosting']) }),
      Object.freeze({ label: 'MOBILE APP', items: Object.freeze(['React Native', 'Gradle']) }),
      Object.freeze({
        label: 'BACKEND AND AI',
        items: Object.freeze(['Firebase', 'Node.js 22', 'Claude API']),
      }),
      Object.freeze({ label: 'DESIGN', items: Object.freeze(['Figma']) }),
    ]),
  }),
]);

/* Section furniture, kept beside the content it labels. */
export const projectsCopy = Object.freeze({
  heading: 'Projects',
  lead: 'Open a project to read the full case study, from the problem through to what shipped.',
  eyebrows: Object.freeze({
    problem: 'THE PROBLEM',
    solution: 'OUR SOLUTION',
    built: 'WHAT WE BUILT',
    surfaces: 'Project surfaces',
    stack: 'STACK',
    status: 'STATUS',
    role: 'MY ROLE',
  }),
  openLabel: 'OPEN CASE STUDY',
  closeLabel: 'CLOSE',
  stickyCloseLabel: 'CLOSE CASE STUDY',
  stickyCloseAria: 'Close the TranspiraFund case study',
});
