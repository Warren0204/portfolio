/* Credentials. A sticky tab bar over four views: the degree, the certification
   ledger, the tracks with their connector tree, and the skills beneath them.
   Each view is built by its own module; this one only switches between them. */

import { el, replaceChildren } from '../core/dom.js';
import { createTabs } from '../components/tabs.js';
import { certifications, credentialsCopy, tracks } from '../data/credentials.js';
import { createCertificationsView } from './credentialsCertificates.js';
import { createEducationView } from './credentialsEducation.js';
import { createSkillsView } from './credentialsSkills.js';
import { createTrackTree } from './credentialsTree.js';

const PANEL_ID = 'credentials-panel';

/**
 * @returns {{ element: HTMLElement, destroy: () => void }}
 */
export function createCredentialsSection() {
  const panel = el('div', {
    class: 'credentials__view',
    attrs: { id: PANEL_ID, role: 'tabpanel' },
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

  const element = el('div', { class: 'well credentials' }, [
    el('h2', { class: 'section__heading', text: credentialsCopy.heading }),
    el('p', { class: 'section__lead', text: credentialsCopy.lead }),
    el('div', { class: 'credentials__tabs' }, tabs.element),
    panel,
  ]);

  return {
    element,

    /* Leaving the chapter returns it to the first view and the first track. */
    reset() {
      tabs.select('education');
      tree.reset();
    },

    destroy() {
      tabs.destroy();
      tree.destroy();
    },
  };
}
