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

    /* Stated up front, before any of the detail below it.

       A reader who reaches three systems with process diagrams and no
       screenshots will otherwise wonder why. Saying so first turns an apparent
       gap into what it actually is — a signed agreement being kept — and
       respecting a confidentiality term is itself a thing worth demonstrating
       to whoever reads this next. */
    disclosure: Object.freeze({
      eyebrow: 'ON WHAT IS SHOWN HERE',
      body: 'In respect of the non-disclosure agreement signed for this internship, what follows is the architecture of each system and its process flow only. No screenshots, records, data, or working copies of the systems themselves are shown anywhere on this site.',
    }),

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
        diagram: 'contract',
        diagramCaption:
          'HR never edits a template. The app collects and validates the details, the flow picks the matching Word template, derives the next version number from the highest one already stored, and writes the document back. Compensation figures travel through the flow at generation time and are never written to the record.',
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
        stack: Object.freeze(['Power Automate', 'SharePoint', 'Excel Online', 'Microsoft Teams']),
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
        diagram: 'recruitment',
        diagramCaption:
          'One scheduled flow rebuilds the analytics dataset every day through Office Scripts, and the Power BI refresh follows half an hour later so the report is never reading a half written file. The same dataset drives the referral raffle, so entries and reporting can never disagree.',
      }),
    ]),
  }),
]);

/* The three process diagrams, as data. experienceDiagramSvg.js renders them and
   experienceDiagram.js animates them; neither knows what any of them mean.

   All three share one grid language on purpose - a vertical spine, a circular
   hub for the artefact everything reads and writes, numbered badges on the
   flows I built, and side branches for inputs and outputs. Three systems drawn
   three different ways would make the reader relearn the notation each time.

   Coordinates are in each diagram's own viewBox. Both arrays are authored in
   execution order, because the scroll-scrubbed reveal plays them in the order
   they appear here - reordering an array reorders the animation. */

export const diagrams = Object.freeze({
  attendance: Object.freeze({
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
  }),

  /* Contract Studio: one path from HR opening the app to a versioned document,
     with the template as an input and the record as an output. */
  contract: Object.freeze({
    viewBox: '0 0 1120 810',
    title: 'Contract Studio generation flow diagram',
    description:
      'HR opens Contract Studio, a Power Apps canvas app. Step 1, the employee dashboard, offers search, filter, and generation status badges. Step 2, the finalization form, shows fields conditional on employment type, full time or contractor, and captures compensation without storing it. After a review, the generation flow runs in Power Automate. It reads the correct Word template, full time or contractor, and produces step 3, a versioned .docx numbered one above the highest version already stored. The document is saved to the SharePoint document library alongside the employee record, and the record status flips to Generated.',
    scrollHint: 'SCROLL HORIZONTALLY TO VIEW THE FULL DIAGRAM ON SMALL SCREENS',

    edges: Object.freeze([
      Object.freeze({ type: 'line', x1: 560, y1: 104, x2: 560, y2: 150 }),
      Object.freeze({ type: 'line', x1: 560, y1: 226, x2: 560, y2: 272 }),
      Object.freeze({ type: 'line', x1: 560, y1: 348, x2: 560, y2: 390 }),
      Object.freeze({ type: 'line', x1: 320, y1: 470, x2: 480, y2: 470 }),
      Object.freeze({ type: 'line', x1: 640, y1: 470, x2: 800, y2: 470 }),
      Object.freeze({ type: 'polyline', points: '940,506 940,658 700,658' }),
      Object.freeze({ type: 'line', x1: 560, y1: 550, x2: 560, y2: 620 }),
      Object.freeze({ type: 'line', x1: 560, y1: 696, x2: 560, y2: 730 }),
    ]),

    edgeLabels: Object.freeze([
      Object.freeze({ x: 572, y: 132, text: 'opens' }),
      Object.freeze({ x: 572, y: 254, text: 'selects an employee' }),
      Object.freeze({ x: 572, y: 376, text: 'reviews, then generates' }),
      Object.freeze({ x: 400, y: 458, text: 'matching template', anchor: 'middle' }),
      Object.freeze({ x: 720, y: 458, text: 'generates', anchor: 'middle' }),
      Object.freeze({ x: 952, y: 590, text: 'saved to' }),
      Object.freeze({ x: 572, y: 590, text: 'writes record' }),
      Object.freeze({ x: 572, y: 718, text: 'status flips to' }),
    ]),

    nodes: Object.freeze([
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 40,
        width: 280,
        height: 64,
        lines: Object.freeze([Object.freeze({ text: 'HR opens Contract Studio', role: 'title' })]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 150,
        width: 280,
        height: 76,
        step: '1',
        lines: Object.freeze([
          Object.freeze({ text: 'Employee Dashboard', role: 'title' }),
          Object.freeze({ text: 'Search \u00b7 filter \u00b7 status badges', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 272,
        width: 280,
        height: 76,
        step: '2',
        lines: Object.freeze([
          Object.freeze({ text: 'Finalization Form', role: 'title' }),
          Object.freeze({ text: 'Fields switch by employment type', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 60,
        y: 436,
        width: 260,
        height: 68,
        lines: Object.freeze([
          Object.freeze({ text: 'Word Templates', role: 'title' }),
          Object.freeze({ text: 'Full time \u00b7 Contractor', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'circle',
        cx: 560,
        cy: 470,
        radius: 80,
        accent: true,
        lines: Object.freeze([
          Object.freeze({ text: 'Generation', role: 'hub' }),
          Object.freeze({ text: 'Flow', role: 'hub' }),
          /* Kept short deliberately: a hub caption is centred in an 80px
             radius and there is no wrapping in SVG text. */
          Object.freeze({ text: 'Power Automate', role: 'mono-small' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 800,
        y: 434,
        width: 280,
        height: 72,
        step: '3',
        lines: Object.freeze([
          Object.freeze({ text: 'Versioned .docx', role: 'title' }),
          Object.freeze({ text: 'Highest existing version, plus one', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 620,
        width: 280,
        height: 76,
        radius: 10,
        lines: Object.freeze([
          Object.freeze({ text: 'SharePoint', role: 'hub' }),
          Object.freeze({ text: 'RECORD + DOCUMENT LIBRARY', role: 'mono-tracked' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 730,
        width: 280,
        height: 60,
        lines: Object.freeze([Object.freeze({ text: 'Status \u2192 Generated', role: 'title' })]),
      }),
    ]),
  }),

  /* Recruitment Analytics: one dataset rebuilt daily, read by two consumers -
     the report a human opens and the raffle logic nobody has to administer. */
  recruitment: Object.freeze({
    viewBox: '0 0 1120 760',
    title: 'Recruitment analytics and referral pipeline diagram',
    description:
      'The applicant tracking list in SharePoint is the source. Step 1, the recruitment sync flow, runs daily in Power Automate and calls an Office Script that shapes the rows. The result is the analytics dataset, an Excel Online file rebuilt every day. Step 2, a scheduled Power BI refresh, runs thirty minutes later and publishes the four page report: Leaderboard, Quarterly Summary, Monthly Summary, and Applicant Detail. Step 3, the raffle entry logic, reads the same dataset and awards stage weighted entries per recruitment milestone, capped per referral.',
    scrollHint: 'SCROLL HORIZONTALLY TO VIEW THE FULL DIAGRAM ON SMALL SCREENS',

    edges: Object.freeze([
      Object.freeze({ type: 'line', x1: 560, y1: 104, x2: 560, y2: 150 }),
      Object.freeze({ type: 'line', x1: 320, y1: 188, x2: 420, y2: 188 }),
      Object.freeze({ type: 'line', x1: 560, y1: 226, x2: 560, y2: 356 }),
      Object.freeze({ type: 'line', x1: 644, y1: 440, x2: 800, y2: 440 }),
      Object.freeze({ type: 'line', x1: 476, y1: 440, x2: 320, y2: 440 }),
      Object.freeze({ type: 'polyline', points: '940,478 940,580' }),
    ]),

    edgeLabels: Object.freeze([
      Object.freeze({ x: 572, y: 132, text: 'reads daily' }),
      Object.freeze({ x: 370, y: 176, text: 'calls', anchor: 'middle' }),
      Object.freeze({ x: 572, y: 300, text: 'writes shaped rows' }),
      Object.freeze({ x: 722, y: 428, text: 'refreshes from', anchor: 'middle' }),
      Object.freeze({ x: 398, y: 428, text: 'scores entries from', anchor: 'middle' }),
      Object.freeze({ x: 952, y: 536, text: 'publishes' }),
    ]),

    nodes: Object.freeze([
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 40,
        width: 280,
        height: 64,
        lines: Object.freeze([Object.freeze({ text: 'Applicant Tracking List', role: 'title' })]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 60,
        y: 154,
        width: 260,
        height: 68,
        lines: Object.freeze([
          Object.freeze({ text: 'Office Script', role: 'title' }),
          Object.freeze({ text: 'Shapes rows for analysis', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 420,
        y: 150,
        width: 280,
        height: 76,
        step: '1',
        lines: Object.freeze([
          Object.freeze({ text: 'Recruitment Sync', role: 'title' }),
          Object.freeze({ text: 'Daily \u00b7 Power Automate', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'circle',
        cx: 560,
        cy: 440,
        radius: 84,
        accent: true,
        lines: Object.freeze([
          Object.freeze({ text: 'Analytics', role: 'hub' }),
          Object.freeze({ text: 'Dataset', role: 'hub' }),
          Object.freeze({ text: 'rebuilt every day', role: 'mono-small' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 60,
        y: 396,
        width: 260,
        height: 88,
        step: '3',
        lines: Object.freeze([
          Object.freeze({ text: 'Raffle Entry Logic', role: 'title' }),
          Object.freeze({ text: 'Stage weighted per milestone', role: 'meta' }),
          Object.freeze({ text: 'Capped per referral', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 800,
        y: 402,
        width: 280,
        height: 76,
        step: '2',
        lines: Object.freeze([
          Object.freeze({ text: 'Power BI Refresh', role: 'title' }),
          Object.freeze({ text: 'Scheduled 30 minutes later', role: 'meta' }),
        ]),
      }),
      Object.freeze({
        shape: 'rect',
        x: 760,
        y: 580,
        width: 320,
        height: 110,
        radius: 10,
        lines: Object.freeze([
          Object.freeze({ text: 'Four Page Report', role: 'hub' }),
          Object.freeze({ text: 'LEADERBOARD \u00b7 QUARTERLY', role: 'mono-tracked' }),
          Object.freeze({ text: 'MONTHLY \u00b7 APPLICANT DETAIL', role: 'mono-tracked' }),
        ]),
      }),
    ]),
  }),
});

export const experienceCopy = Object.freeze({
  eyebrow: 'WHERE I HAVE SHIPPED',
  heading: 'Experience',
  overviewLabel: 'Overview',
  diagramScrollLabel: 'Diagram, scrolls sideways',
  lead: 'One internship, three systems built and left running. Pick a system to read how it works.',
  systemsEyebrow: 'DELIVERED SYSTEMS \u00b7 POWER PLATFORM',
  systemsCountSuffix: 'SEPARATE SYSTEMS',
  systemsTabsLabel: 'Delivered systems',
  inProduction: 'IN PRODUCTION',
  systemLabel: 'SYSTEM',
  ofLabel: 'OF',
  eyebrows: Object.freeze({
    role: 'MY ROLE',
    problem: 'THE PROBLEM',
    solution: 'THE SOLUTION',
    built: 'WHAT I BUILT',
    stack: 'BUILT WITH',
    notes: 'WHAT MADE IT HOLD',
    status: 'STATUS',
    diagram: 'HOW IT FITS TOGETHER',
  }),
});
