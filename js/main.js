/* Entry point. Creates the one store, mounts the shell and the five chapters,
   and keeps the document in sync with it. */

import { createStore } from './core/store.js';
import { qs } from './core/dom.js';
import { createRouter } from './core/router.js';
import { wireGlobalInput } from './core/input.js';
import { DURATIONS } from './core/constants.js';
import { prefersReducedMotion } from './core/motion.js';
import { createHeader } from './components/header.js';
import { createChapterStage } from './components/chapterStage.js';
import { createChapterNav } from './components/chapterNav.js';
import { createTabBar } from './components/tabBar.js';
import { closeActiveModal } from './components/modal.js';
import { applyTheme, readStoredTheme } from './components/themeToggle.js';
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

  // The inline bootstrap in index.html already set the attribute for the
  // stored theme; this keeps it authoritative for every later change.
  applyTheme(store.get().theme);
  store.subscribe((state, changedKeys) => {
    if (changedKeys.includes('theme')) applyTheme(state.theme);
  });

  const router = createRouter({ store });

  // Chapters are built once and kept, so their state survives navigation.
  const sections = {
    home: createHomeSection(),
    projects: createProjectsSection(),
    experience: createExperienceSection(),
    credentials: createCredentialsSection(),
    contact: createContactSection(),
  };

  createHeader({ mount: headerMount, store });
  // Phones navigate from the bottom bar; wider screens use the header nav.
  createTabBar({ mount: document.body, store });
  createChapterStage({
    mount: stage,
    store,
    content: Object.fromEntries(
      Object.entries(sections).map(([id, section]) => [id, section.element])
    ),
  });
  createChapterNav({ mount: stage, store, onNavigate: (index) => router.navigate(index) });

  /** Collapse the open panels of the chapter at this index. */
  function resetChapter(index) {
    const chapter = chapters[index];
    const section = chapter && sections[chapter.id];
    if (section && section.reset) section.reset();
  }

  wireGlobalInput({ store, router, resetChapter });

  // Leaving a chapter puts it back to its resting state: dialog dismissed and
  // every panel collapsed. Returning to it should look the way it looked on
  // arrival, not like wherever the visitor stopped reading.
  //
  // The collapse waits for the slide to finish. The outgoing chapter is still
  // on screen for the length of the transition, and snapping its panels shut
  // underneath the visitor as it leaves is exactly the flinch this avoids.
  let pendingReset = 0;
  let previousIndex = store.get().chapterIndex;
  const chaptersToReset = new Set();

  store.subscribe((state, changedKeys) => {
    if (!changedKeys.includes('chapterIndex')) return;

    chaptersToReset.add(previousIndex);
    previousIndex = state.chapterIndex;

    closeActiveModal();

    // Collected in a set, not a single pending index: navigating three
    // chapters in quick succession must still collapse all of them.
    window.clearTimeout(pendingReset);
    const delay = prefersReducedMotion() ? 0 : DURATIONS.chapter + 80;
    pendingReset = window.setTimeout(() => {
      for (const index of chaptersToReset) {
        // Never reset the chapter the visitor ended up on — they may have
        // opened something on it while the transition was still running.
        if (index !== store.get().chapterIndex) resetChapter(index);
      }
      chaptersToReset.clear();
    }, delay);
  });

  // The intro is already running, started by js/intro.js. Arm the reveal for
  // when it clears, so it is not spent behind the loading screen.
  introComplete.then(() => sections.home.armReveal());
}

boot();
