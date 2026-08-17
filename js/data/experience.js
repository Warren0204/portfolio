/* Roles, the systems delivered inside them, and the process diagram spec.
   Adding a system means appending one object to a role's systems array. */

export const roles = Object.freeze([
  Object.freeze({
    id: 'benchmark365',
    kind: 'INTERNSHIP',
    period: 'FEB TO MAY 2026',
    title: 'HR and IT Intern, Benchmark365',
    organisation: 'Australian managed service provider',
    roles: Object.freeze([
      'Microsoft Power Platform Developer',
      'Data and Reporting Analyst',
      'Tester',
      'Technical Writer',
    ]),
    summary:
      'As the company’s first IT intern, I worked with the People and Culture team to find where manual HR and admin work was eating time, then built the systems to remove it. Nine cloud flows, a canvas app, and a four page Power BI report went into production. I owned both sides of that work: the developer who built the automation, and the analyst who modelled the data, defined the measures, and decided what HR actually needed to see. I documented every build and handed the suite to a company service account, so it keeps running now that the internship has ended.',

    systems: Object.freeze([
      Object.freeze({
        id: 'contract-studio',
        title: 'Contract Studio',
        role: 'Power Apps canvas app with a generation flow',
        summary:
          'A guided contract generation workflow that replaced manual template editing, with versioning built into the data model.',
        problem:
          'Employment contracts were manual template edits: slow, inconsistent, without version control, exposed to overwrite risk, and at risk of storing sensitive salary figures where they should not live.',
        built: Object.freeze([
          'A canvas app for HR with a searchable, filterable employee dashboard and generation status badges.',
          'A validated finalization form with conditional fields per employment type, full time or contractor, plus a review modal before generation.',
          'One click generation of versioned, branded .docx contracts from the correct Word template through a flow that fills the record, generates the document, and flips status automatically.',
        ]),
        impact:
          'A guided, validated workflow that generates the contract in one click, versions it automatically so nothing gets overwritten, and keeps compensation figures out of stored records entirely.',
        notes:
          'Compensation is transient by design: salary and allowance figures are captured in the app and passed to the flow at generation time only, never persisted to SharePoint. Version numbers are derived from the highest existing version rather than a maintained flag, so version integrity cannot silently rot.',
        stack: Object.freeze([
          'Power Apps',
          'Power Automate',
          'Microsoft Forms',
          'SharePoint',
          'Word automation',
        ]),
        status: 'Live end to end and fully handed off to service account operation.',
      }),

      Object.freeze({
        id: 'attendance-suite',
        title: 'Attendance Automation Suite',
        role: '4 cloud flows · Power Automate, SharePoint, Teams',
        summary:
          'A self maintaining attendance and disciplinary pipeline that replaced daily manual monitoring across the company.',
        problem:
          'Lateness monitoring and monthly disciplinary tracking were fully manual: checking files daily, messaging team leads by hand, counting late instances per employee, and remembering which escalation stage applied. Weekend gaps and month boundaries meant lates slipped through, and enforcement was inconsistent by nature.',
        built: Object.freeze([
          'A monthly file system that creates its own year folders and monthly Excel files from a master template, with duplicate creation protection so re runs are safe.',
          'A duplicate proof daily sync into organized monthly files, with three layer validation and automatic month and year transition handling.',
          'Daily Teams notifications that mention the correct team lead per late employee, with Monday logic covering the full weekend and a cross month boundary fix that prevents duplicate alerts.',
          'A six tier progressive escalation engine, from an advisory at three monthly lates through formal reminder, verbal, written, and final warnings to a grounds for termination notice at eight, built on a flat Switch architecture to stay within nesting depth limits.',
        ]),
        impact:
          'A self running daily pipeline. Team leads and HR get correctly targeted alerts each morning without anyone opening a file, and every threshold breach records the disciplinary step required, with a timestamp.',
        notes:
          'Personnel turnover is a single email field change that propagates through all fourteen notification messages through role based mention tokens. Counters reset on their own because each month is its own file, so there is no monthly or yearly maintenance.',
        stack: Object.freeze([
          'Power Automate',
          'SharePoint',
          'Excel Online',
          'Microsoft Teams',
        ]),
        status: 'In production, migrated to service account ownership.',
        diagram: 'attendance',
        diagramCaption:
          'Four scheduled flows keep the current month’s Excel file up to date and post late arrival notifications to a Teams group chat. On the first of every month a fresh file is created and the flows switch to it on their own, so counts reset without anyone touching them.',
      }),

      Object.freeze({
        id: 'recruitment-analytics',
        title: 'Recruitment Analytics and Referral Dashboard',
        role: 'ATS sync flow, Office Scripts, and a 4 page Power BI report',
        summary:
          'A daily sync that turns the applicant tracking list into a self updating analytics product for HR.',
        problem:
          'There was no live visibility into the recruitment pipeline or the employee referral program. Reporting meant manual exports, and the referral raffle was administered by hand.',
        built: Object.freeze([
          'A daily automated sync that turns the applicant tracking list into an analytics ready dataset through Office Scripts.',
          'A four page Power BI report on a scheduled refresh thirty minutes later: Leaderboard, Quarterly Summary, Monthly Summary, and Applicant Detail.',
          'Stage weighted raffle entry logic, with entries earned per recruitment milestone and capped per referral, administering the incentive program automatically.',
        ]),
        impact:
          'A self updating analytics product for the referral programme. HR opens a live dashboard instead of building an export, and raffle entries are calculated automatically.',
        notes:
          'Service account migration required solving a non obvious platform constraint: Office Scripts do not travel inside Power Automate export packages, so the scripts were recreated and the flow definition.json edited directly to swap hardcoded script IDs. Production hardening, not just building.',
        stack: Object.freeze(['Power Automate', 'Office Scripts', 'Power BI', 'SharePoint']),
        status: 'In production under service account ownership.',
      }),
    ]),
  }),
]);

/* The attendance process diagram, as data. The section renders it to SVG.
   Coordinates are in the diagram's own 1120x780 viewBox. */
export const attendanceDiagram = Object.freeze({
  viewBox: '0 0 1120 780',
  title: 'Late automation ecosystem diagram',
  description:
    'Flow 1, New Month File Creator, runs on the first of each month at 12:00 AM and duplicates the attendance template to create the monthly Excel file. Flow 2, Attendance Sync, runs daily at 7:00 AM, reads the source file and writes data into the current month’s Excel file. Flow 3, Daily Late Notification, runs daily at 8:00 AM, reads daily lates from the current month’s Excel file and posts to the Microsoft Teams group chat mentioning the team lead. Flow 4, HR Late Threshold Alert, runs daily at 8:15 AM, counts monthly data and posts to the same group chat mentioning HR and the team lead.',
  scrollHint: 'SCROLL HORIZONTALLY TO VIEW THE FULL DIAGRAM ON SMALL SCREENS',

  /* Connectors. `line` uses x1/y1/x2/y2, `polyline` uses points. */
  edges: Object.freeze([
    Object.freeze({ type: 'line', x1: 560, y1: 150, x2: 560, y2: 90 }),
    Object.freeze({ type: 'line', x1: 560, y1: 222, x2: 560, y2: 326 }),
    Object.freeze({ type: 'line', x1: 185, y1: 300, x2: 185, y2: 246 }),
    Object.freeze({ type: 'polyline', points: '185,372 185,410 476,410' }),
    Object.freeze({ type: 'line', x1: 644, y1: 410, x2: 816, y2: 410 }),
    Object.freeze({ type: 'polyline', points: '560,490 560,584 340,584' }),
    Object.freeze({ type: 'polyline', points: '195,628 195,706 386,706' }),
    Object.freeze({ type: 'polyline', points: '965,454 965,706 734,706' }),
  ]),

  edgeLabels: Object.freeze([
    Object.freeze({ x: 572, y: 124, text: 'duplicate from' }),
    Object.freeze({ x: 572, y: 278, text: 'creates file' }),
    Object.freeze({ x: 197, y: 277, text: 'reads source file' }),
    Object.freeze({ x: 330, y: 398, text: 'writes data into', anchor: 'middle' }),
    Object.freeze({ x: 730, y: 398, text: 'counts monthly data', anchor: 'middle' }),
    Object.freeze({ x: 452, y: 572, text: 'reads daily lates', anchor: 'middle' }),
    Object.freeze({ x: 288, y: 694, text: 'posts to', anchor: 'middle' }),
    Object.freeze({ x: 852, y: 694, text: 'posts to', anchor: 'middle' }),
  ]),

  /* Boxes. `step` renders the numbered flow badge on the top-left corner. */
  nodes: Object.freeze([
    Object.freeze({
      shape: 'rect',
      x: 455,
      y: 40,
      width: 210,
      height: 46,
      lines: Object.freeze([Object.freeze({ text: 'Attendance Template', role: 'title' })]),
    }),
    Object.freeze({
      shape: 'rect',
      x: 420,
      y: 150,
      width: 280,
      height: 72,
      step: '1',
      lines: Object.freeze([
        Object.freeze({ text: 'New Month File Creator', role: 'title' }),
        Object.freeze({ text: 'Every 1st day of month · 12:00 AM', role: 'meta' }),
      ]),
    }),
    Object.freeze({
      shape: 'rect',
      x: 55,
      y: 196,
      width: 260,
      height: 46,
      lines: Object.freeze([Object.freeze({ text: 'Daily source export', role: 'mono' })]),
    }),
    Object.freeze({
      shape: 'rect',
      x: 55,
      y: 300,
      width: 260,
      height: 72,
      step: '2',
      lines: Object.freeze([
        Object.freeze({ text: 'Attendance Sync', role: 'title' }),
        Object.freeze({ text: 'Daily at 7:00 AM', role: 'meta' }),
      ]),
    }),
    Object.freeze({
      shape: 'circle',
      cx: 560,
      cy: 410,
      radius: 80,
      accent: true,
      lines: Object.freeze([
        Object.freeze({ text: 'Current Month', role: 'hub' }),
        Object.freeze({ text: 'Excel File', role: 'hub' }),
        Object.freeze({ text: 'new file each month', role: 'mono-small' }),
      ]),
    }),
    Object.freeze({
      shape: 'rect',
      x: 820,
      y: 366,
      width: 280,
      height: 88,
      step: '4',
      lines: Object.freeze([
        Object.freeze({ text: 'HR Late Threshold Alert', role: 'title' }),
        Object.freeze({ text: 'Daily at 8:15 AM', role: 'meta' }),
        Object.freeze({ text: '@mentions HR + Team Lead', role: 'meta' }),
      ]),
    }),
    Object.freeze({
      shape: 'rect',
      x: 55,
      y: 540,
      width: 280,
      height: 88,
      step: '3',
      lines: Object.freeze([
        Object.freeze({ text: 'Daily Late Notification', role: 'title' }),
        Object.freeze({ text: 'Daily at 8:00 AM', role: 'meta' }),
        Object.freeze({ text: '@mentions Team Lead', role: 'meta' }),
      ]),
    }),
    Object.freeze({
      shape: 'rect',
      x: 390,
      y: 660,
      width: 340,
      height: 92,
      radius: 10,
      lines: Object.freeze([
        Object.freeze({ text: 'Microsoft Teams', role: 'hub' }),
        Object.freeze({ text: 'LATE NOTIFICATION DAILY', role: 'mono-tracked' }),
        Object.freeze({ text: 'Group chat', role: 'meta' }),
      ]),
    }),
  ]),
});

export const experienceCopy = Object.freeze({
  heading: 'Experience',
  lead: 'Open a role to see the systems I shipped there and how they were handed over.',
  systemsEyebrow: 'DELIVERED SYSTEMS · POWER PLATFORM',
  systemsCountSuffix: 'SEPARATE SYSTEMS · SELECT ONE TO OPEN',
  inProduction: 'IN PRODUCTION',
  systemLabel: 'SYSTEM',
  ofLabel: 'OF',
  openLabel: 'OPEN',
  openRoleLabel: 'VIEW EXPERIENCE',
  closeRoleLabel: 'CLOSE',
  stickyCloseLabel: 'CLOSE EXPERIENCE',
  stickyCloseAria: 'Close the Benchmark365 experience',
  eyebrows: Object.freeze({
    role: 'MY ROLE',
    problem: 'THE PROBLEM',
    solution: 'THE SOLUTION',
    built: 'WHAT I BUILT',
    notes: 'WHAT MADE IT HOLD',
    status: 'STATUS',
    diagram: 'HOW IT FITS TOGETHER',
  }),
  diagramShow: 'VIEW PROCESS DIAGRAM',
  diagramHide: 'HIDE PROCESS DIAGRAM',
  modalLabel: 'System detail',
  modalCloseAria: 'Close system detail',
  closeLabel: 'CLOSE',
});
