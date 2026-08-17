/* A minimal observable store: the one place shared state lives. Components
   read from it and subscribe to it; they never hold state of their own. */

/**
 * @param {object} initialState
 * @returns {{
 *   get: () => object,
 *   set: (patch: object) => void,
 *   subscribe: (listener: (state: object, changedKeys: string[]) => void) => () => void
 * }}
 */
export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  function get() {
    return state;
  }

  function set(patch) {
    const changedKeys = Object.keys(patch).filter((key) => state[key] !== patch[key]);
    if (changedKeys.length === 0) return;

    state = { ...state, ...patch };
    // Copy first: a listener may unsubscribe itself while we are iterating.
    for (const listener of Array.from(listeners)) {
      listener(state, changedKeys);
    }
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { get, set, subscribe };
}
