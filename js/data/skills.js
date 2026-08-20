/* Skill groups and the tools shown on Home. Adding a group means appending one
   object to the matching array. `note` is optional and renders as an accented
   qualifier under the group title. */

export const practices = Object.freeze([
  Object.freeze({
    title: 'AUTOMATION AND WORKFLOW DESIGN',
    items: Object.freeze([
      'Process mapping',
      'Process auditing',
      'Process improvement',
      'Requirements gathering',
      'Flow design',
      'Error handling and retries',
      'Ownership handover',
    ]),
  }),
  Object.freeze({
    title: 'DATA ANALYSIS AND REPORTING',
    items: Object.freeze([
      'Deciding what to measure',
      'Dashboard design',
      'Measure and metric definition',
      'Reporting data models',
      'Scheduled refresh',
      'Data validation',
    ]),
  }),
  Object.freeze({
    title: 'AI ASSISTED BUILDING',
    items: Object.freeze([
      'Prompt engineering',
      'Retrieval design',
      'Output evaluation',
      'Agent and tool workflows',
      'Responsible use',
    ]),
  }),
  Object.freeze({
    title: 'PROJECT DELIVERY',
    items: Object.freeze([
      'Scoping and work breakdown',
      'Stakeholder communication',
      'System testing and QA',
      'Technical documentation',
      'Turnover material',
    ]),
  }),
]);

export const platforms = Object.freeze([
  Object.freeze({
    title: 'MICROSOFT POWER PLATFORM',
    items: Object.freeze([
      'Power Automate',
      'Power Apps (canvas)',
      'Power BI',
      'AI Builder',
      'Adaptive Cards',
      'Office Scripts',
      'Microsoft Graph API',
    ]),
  }),
  Object.freeze({
    title: 'MICROSOFT 365 ENVIRONMENT',
    items: Object.freeze([
      'SharePoint',
      'Teams',
      'Outlook',
      'Excel and Excel Online',
      'Forms',
      'Planner',
      'Service account governance',
    ]),
  }),
  Object.freeze({
    title: 'GOOGLE WORKSPACE ENVIRONMENT',
    items: Object.freeze([
      'Google Sheets',
      'Google Forms',
      'Google Drive',
      'Gmail',
      'Google Apps Script',
    ]),
  }),
  Object.freeze({
    title: 'AI AND COPILOT TOOLING',
    items: Object.freeze(['Claude and Claude Code', 'Microsoft Copilot', 'MCP integrations']),
  }),
  Object.freeze({
    title: 'DELIVERY TOOLING',
    items: Object.freeze(['Jira', 'Visio', 'Figma']),
  }),
]);

export const stack = Object.freeze([
  Object.freeze({
    title: 'APPLICATION DEVELOPMENT',
    items: Object.freeze([
      'React + Vite',
      'React Native',
      'Node.js',
      'TypeScript',
      'Firebase',
      'REST APIs and webhooks',
      'Git and GitHub',
    ]),
  }),
  Object.freeze({
    title: 'DATA AND QUERY',
    items: Object.freeze(['SQL', 'PostgreSQL', 'Firestore', 'DAX']),
  }),
  Object.freeze({
    title: 'AI INTEGRATION',
    items: Object.freeze(['Anthropic API', 'Prompt and retrieval design', 'Output evaluation']),
  }),
  Object.freeze({
    title: 'DATA ENGINEERING STACK',
    note: 'in active training, certification track underway',
    items: Object.freeze(['dbt', 'Airflow', 'DuckDB', 'Microsoft Fabric', 'Data modeling']),
  }),
]);

/* The logo chips on Home, in display order.

   Seven, not eight. SQL is still claimed in the data group above, where it is
   read alongside PostgreSQL, Firestore, and DAX and means something specific;
   in the hero it was one more chip competing with the calls to action for the
   first screen. The hero is a summary, not an inventory. */
export const heroTools = Object.freeze([
  'JavaScript',
  'React',
  'Firebase',
  'Power Automate',
  'Power Apps',
  'Power BI',
  'SharePoint',
]);

export const skillsCopy = Object.freeze({
  groups: Object.freeze([
    Object.freeze({
      eyebrow: 'PRACTICES · WHAT I DO IN A ROLE',
      lead: 'The work itself, independent of any one product.',
    }),
    Object.freeze({
      eyebrow: 'TOOLS · PLATFORMS AND ENVIRONMENTS I WORK IN',
      lead: 'Licensed platforms and the environments the work is delivered inside.',
    }),
    Object.freeze({
      eyebrow: 'TECH STACK · WHAT I BUILD WITH IN CODE',
      lead: 'Languages, frameworks, data layers, and the tooling around them.',
    }),
  ]),
});
