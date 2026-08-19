/* Education, the certification ledger, and the four development tracks.
   A certification with an `image` renders as a featured row with a
   click-to-enlarge proof; without one it renders as a compact card. */

export const education = Object.freeze({
  eyebrow: 'EDUCATION',
  degree: 'Bachelor of Science in Information Technology',
  school: 'University of Cebu, Banilad Campus',
  logo: Object.freeze({
    src: '/assets/img/logos/university-of-cebu.png',
    alt: 'University of Cebu',
    width: 112,
    height: 112,
  }),
  columns: Object.freeze([
    Object.freeze({
      eyebrow: 'THE JOURNEY INTO IT',
      body: 'Alongside the degree I served as an officer of PSITS, the Philippine Society of Information Technology Students, our department organization. I was operations manager for the College of Computer Studies intramural basketball event and handled logistics and registration for a department wide eSports tournament with more than 50 participants. Coordinating people and deadlines while studying is where the project side of my work started.',
    }),
    Object.freeze({
      eyebrow: 'WHERE THE SKILLS BECAME REAL',
      body: 'The internship at Benchmark365 is where the skills became real. Shipping a production suite as sole developer and analyst, and taking a capstone all the way to a real government stakeholder, taught me to design for the handover: a system only counts if it keeps working for the people who live with it after I am gone.',
    }),
  ]),
});

export const certifications = Object.freeze([
  Object.freeze({
    id: 'google-ai-professional',
    scope: 'ACROSS ALL FOUR TRACKS',
    title: 'Google AI Professional Certificate',
    issuer: 'Google · Coursera · 8 courses',
    status: 'EARNED · AUG 2026',
    why: 'Eight courses covering AI for data analysis, research, writing, and app building, closing with a custom AI solution built end to end. It certifies the judgement part: prompting effectively, evaluating what comes back, and using these tools responsibly on real work. That sits under every track rather than inside one.',
    image: Object.freeze({
      src: '/assets/img/credentials/google-ai-professional.jpg',
      alt: 'Google AI Professional Certificate awarded to Warren Villagonzalo Gallardo, August 16 2026',
      aspectRatio: '1650 / 1275',
    }),
    verify: 'https://coursera.org/verify/professional-cert/2ANROX2PSCRY',
  }),
]);

export const tracks = Object.freeze([
  Object.freeze({
    id: 'project-management',
    kicker: 'TRACK 01',
    name: 'Project management and coordination',
    summary:
      'Led a three member capstone team end to end and ran department wide events as operations lead, now formalising the practice against an industry standard.',
    fundamentals: Object.freeze([
      'Scoping and breaking work down: turning a stakeholder’s described problem into phases, deliverables, and a schedule a small team can actually hold.',
      'Running a team through delivery: assigning by strength, tracking progress, and keeping a three member capstone on schedule to a real government client.',
      'Stakeholder communication: requirements gathering, demo and validation sessions, and translating technical constraints into plain terms for non technical decision makers.',
      'Documentation and handover: writing the specifications, user guides, and turnover material a system needs to survive without its builder.',
      'Risk and change handling: spotting scope and dependency risk early, then re planning around it instead of absorbing it silently.',
    ]),
    certWhy:
      'Formalises the vocabulary and artefacts behind what I already ran in practice: charters, work breakdown, stakeholder management, and the difference between Agile and waterfall delivery.',
    certs: Object.freeze([
      Object.freeze({
        title: 'Google Project Management Certificate',
        issuer: 'Coursera · DTI Google Learning Program',
        status: 'IN PROGRESS',
      }),
    ]),
  }),

  Object.freeze({
    id: 'data-analytics',
    kicker: 'TRACK 02',
    name: 'Data analytics and business intelligence',
    summary:
      'Dashboard and reporting work already running in production, now being deepened through formal SQL and analytics certification.',
    fundamentals: Object.freeze([
      'Data modelling for reporting: shaping flat operational lists into star schema style tables with clean relationships before any visual is built.',
      'DAX and measure design: calculated columns, aggregations, and time based measures that hold up when the underlying data grows.',
      'Power BI report design: multi page reports with slicers, drillthrough, and a layout that answers the stakeholder’s question in the first screen.',
      'SQL: joins, aggregation, filtering, subqueries, and window functions for pulling and reshaping data at the source.',
      'Data cleaning and transformation: Power Query and Office Scripts to normalise inconsistent operational data into an analysis ready dataset.',
      'Deciding what to measure: working with the business owner to define the metric that matters rather than reporting everything available.',
    ]),
    certWhy:
      'Certifies the query layer underneath my reporting work: relational modelling and SQL against real datasets, assessed rather than self declared.',
    certs: Object.freeze([
      Object.freeze({ title: 'SQL Associate', issuer: 'DataCamp', status: 'IN PROGRESS' }),
    ]),
  }),

  Object.freeze({
    id: 'data-engineering',
    kicker: 'TRACK 03',
    name: 'Data engineering',
    summary:
      'The next step past reporting. Building fundamentals in data modeling and pipeline tooling before claiming anything here.',
    fundamentals: Object.freeze([
      'Scheduled pipelines in production: four cloud flows that extract, transform, and write on their own schedule, with duplicate protection so re runs are safe.',
      'Incremental and idempotent loads: designing a daily sync that can fail and re run without corrupting what came before.',
      'Dimensional modelling: the fact and dimension thinking I apply in reporting, now being taken further into warehouse design.',
      'Currently learning: dbt for transformation as code, Airflow for orchestration, DuckDB for local analytical work, and Microsoft Fabric for the lakehouse side.',
    ]),
    fundamentalsNote:
      'Listed as working knowledge and study in progress, not as a claim of professional experience.',
    certs: Object.freeze([]),
    empty:
      'No certification yet, and I will not list one until it is real. The fundamentals above are what I can genuinely account for today.',
  }),

  Object.freeze({
    id: 'power-platform',
    kicker: 'TRACK 04',
    name: 'Microsoft Power Platform',
    summary:
      'The track with the most production evidence. Automation, a canvas app, and a Power BI report shipped and handed to service account ownership.',
    fundamentals: Object.freeze([
      'Power Automate cloud flows: scheduled and event driven flows, branching and error handling, approvals, and role based notification routing.',
      'Power Apps canvas apps: multi screen apps with searchable, filterable data views, form validation, and generation status feedback for the user.',
      'SharePoint as a data layer: list design, column typing, permissions, and deciding deliberately what is persisted versus passed through in memory.',
      'Power BI within the platform: connecting to platform data and publishing reports that refresh without manual export.',
      'Office Scripts and Excel automation: templated monthly files, self creating folder structures, and script driven transformation inside the flow.',
      'Environment and ownership hygiene: migrating solutions to a service account so nothing breaks when a personal account leaves, including the platform constraints that migration exposes.',
    ]),
    certWhy:
      'Confirms the platform level fundamentals under the builds: environments, the Dataverse and connector model, licensing boundaries, and where each tool in the suite is the right choice.',
    certs: Object.freeze([
      Object.freeze({
        title: 'Microsoft Power Platform Fundamentals',
        issuer: 'Microsoft Learn · all coursework completed, exam booking pending',
        status: 'COURSEWORK DONE',
      }),
    ]),
  }),
]);

export const credentialsCopy = Object.freeze({
  eyebrow: 'WHAT I AM BUILT ON',
  heading: 'Credentials',
  lead: 'Where I am strongest today and where I am deliberately growing next. Four views: the degree behind it, the certifications, the tracks, and the skills underneath.',
  tabsLabel: 'Credentials views',
  tabs: Object.freeze({
    education: 'EDUCATION',
    certifications: 'CERTIFICATIONS',
    tracks: 'TRACKS',
    skills: 'SKILLS',
  }),
  certificationsHeading: 'Certifications',
  apexEyebrow: 'WHERE I AM HEADED',
  apexStatement:
    'Improving how operations run, to the standard the industry is moving toward, and building it to stay running after handover',
  tracksFallbackEyebrow: 'TRACKS · SELECT ONE',
  fundamentalsEyebrow: 'FUNDAMENTALS I WORK WITH IN THIS TRACK',
  trackCertEyebrow: 'TRACK ALIGNED CERTIFICATION',
  noCertLabel: 'NO CERT YET',
  certCountSuffix: 'CERT',
  certCountSuffixPlural: 'CERTS',
  enlargeHint: 'CLICK TO ENLARGE',
  zoomLabel: 'Certificate, enlarged',
  zoomEyebrow: 'CERTIFICATE',
  zoomClose: 'CLOSE',
  zoomCloseAria: 'Close the enlarged certificate',
  verifyLabel: 'VERIFY',
});
