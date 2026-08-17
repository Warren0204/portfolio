/* Second entry point, loaded before main.js and deliberately kept small.

   main.js pulls in roughly forty modules, and the browser must fetch all of
   them before a single line runs. Driving the loading screen from there meant
   the counter sat at zero for however long that took — the progress bar was
   waiting on the thing it exists to cover. This module reaches only the
   preloader and its four helpers, so counting starts almost immediately.

   main.js imports the same promise; module instances are shared by URL, so it
   waits on this run rather than starting a second one. */

import { runPreloader, shouldShowPreloader } from './components/preloader.js';

export const introComplete = shouldShowPreloader() ? runPreloader() : Promise.resolve();
