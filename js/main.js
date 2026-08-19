/* Entry point. Creates the one store, mounts the shell and the five sections
   into one scrolling page, and keeps the document in sync with it. */

import { createStore } from './core/store.js';
import { el, qs } from './core/dom.js';
import { createRouter } from './core/router.js';
import { onSectionChange } from './core/animate.js';
import { createHeader } from './components/header.js';
import { createTabBar } from './components/tabBar.js';
import { applyTheme, onSystemThemeChange, readStoredTheme } from './components/themeToggle.js';
import { introComplete } from './intro.js';
import { chapters, indexForRoute } from './data/navigation.js';
import { createHomeSection } from './sections/home.js';
import { createProjectsSection } from './sections/projects.js';
import { createExperienceSection } from './sections/experience.js';
import { createCredentialsSection } from './sections/credentials.js';
import { createContactSection } from './sections/contact.js';

function boot() {
  const headerMount = qs('#site-header');
  const stage = qs('#stage');

  if (!headerMount || !stage) {
    throw new Error('Shell markup is missing: expected #site-header and #stage in index.html.');
  }

  const store = createStore({
    theme: readStoredTheme(),
    chapterIndex: indexForRoute(window.location.hash),
  });

  // The inline bootstrap in index.html already set the attribute before first
  // paint; this keeps it authoritative for every later change.
  applyTheme(store.get().theme);
  store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('theme')) applyTheme(state.theme);
  });

  // Until the visitor makes a choice of their own, follow their system.
  onSystemThemeChange((theme) => store.set({ theme }));

  const builders = {
    home: createHomeSection,
    projects: createProjectsSection,
    experience: createExperienceSection,
    credentials: createCredentialsSection,
    contact: createContactSection,
  };

  /* Every section is in the document at once now, so each is a real <section>
     landmark named by its own heading rather than a panel that has to be made
     inert when it is not the current one. */
  const sections = {};
  const panels = chapters.map((chapter) => {
    const built = builders[chapter.id]();
    sections[chapter.id] = built;

    return el(
      'section',
      {
        class: 'page-section',
        attrs: {
          id: chapter.id,
          'aria-labelledby': chapter.id === 'home' ? null : `${chapter.id}-heading`,
          'aria-label': chapter.id === 'home' ? chapter.menuLabel : null,
        },
      },
      built.element
    );
  });

  stage.replaceChildren(...panels);

  const elements = Object.fromEntries(
    chapters.map((chapter, index) => [chapter.id, panels[index]])
  );

  const router = createRouter({ store, sections: elements });

  createHeader({ mount: headerMount, store, onNavigate: router.navigate });
  // Phones navigate from the bottom bar; wider screens use the header nav.
  createTabBar({ mount: document.body, store, onNavigate: router.navigate });

  // The nav's active state follows the reader rather than the last thing they
  // clicked, which on a scrolling page is the only honest source for it.
  onSectionChange(panels, router.syncToScroll);

  /* The intro is already running, started by js/intro.js. Everything visual is
     armed for when it clears, so no entrance is spent behind the curtain and
     no deep link scrolls the page while it is still covered. */
  introComplete.then(() => {
    router.restoreInitialPosition();
    for (const section of Object.values(sections)) {
      if (section.armReveal) section.armReveal();
    }
  });
}

boot();
