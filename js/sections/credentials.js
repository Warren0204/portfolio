/* Credentials. A tab bar over four views: the degree, the certification
   ledger, the tracks with their connector tree, and the skills beneath them.
   Each view is built by its own module; this one only switches between them. */

import { el, replaceChildren } from '../core/dom.js';
import { createSectionHead } from '../components/sectionHead.js';
import { createTabs } from '../components/tabs.js';
import { refreshTriggers, revealOnScroll } from '../core/animate.js';
import { certifications, credentialsCopy, tracks } from '../data/credentials.js';
import { createCertificationsView } from './credentialsCertificates.js';
import { createEducationView } from './credentialsEducation.js';
import { createSkillsView } from './credentialsSkills.js';
import { createTrackTree } from './credentialsTree.js';

const PANEL_ID = 'credentials-panel';

/**
 * @returns {{ element: HTMLElement, armReveal: () => void, destroy: () => void }}
 */
export function createCredentialsSection() {
  const panel = el('div', {
    class: 'credentials__view',
    attrs: { id: PANEL_ID, role: 'tabpanel', tabindex: '0' },
  });

  // The tree holds the selected track, so it is built once and kept rather
  // than rebuilt every time its tab is chosen.
  const tree = createTrackTree({ tracks });

  const views = {
    education: createEducationView,
    certifications: createCertificationsView,
    tracks: () => tree.element,
    skills: createSkillsView,
  };

  function show(id) {
    replaceChildren(panel, views[id]());
    panel.setAttribute('aria-labelledby', `tab-${PANEL_ID}-${id}`);
    // The panel's height just changed, so every trigger below it is measuring
    // against a page that no longer exists.
    refreshTriggers();
  }

  const tabs = createTabs({
    items: [
      { id: 'education', label: credentialsCopy.tabs.education },
      {
        id: 'certifications',
        label: `${credentialsCopy.tabs.certifications} · ${certifications.length}`,
      },
      { id: 'tracks', label: `${credentialsCopy.tabs.tracks} · ${tracks.length}` },
      { id: 'skills', label: credentialsCopy.tabs.skills },
    ],
    selectedId: 'education',
    onSelect: show,
    label: credentialsCopy.tabsLabel,
    panelId: PANEL_ID,
  });

  show('education');

  const head = createSectionHead({
    eyebrow: credentialsCopy.eyebrow,
    heading: credentialsCopy.heading,
    lead: credentialsCopy.lead,
    headingId: 'credentials-heading',
  });

  const tabsHolder = el('div', { class: 'credentials__tabs' }, tabs.element);

  const element = el('div', { class: 'well credentials' }, [head, tabsHolder, panel]);

  let reveals = [];

  return {
    element,

    armReveal() {
      reveals = [
        revealOnScroll(Array.from(head.children), { trigger: head }),
        revealOnScroll([tabsHolder, panel], { trigger: tabsHolder, y: 24, stagger: 0.1 }),
      ];
    },

    destroy() {
      tabs.destroy();
      tree.destroy();
      reveals.forEach((reveal) => reveal.destroy());
    },
  };
}
