/* Storage wrappers. Private browsing and hardened settings make Web Storage
   throw on access, which must never take the page down — every call degrades
   to a no-op and the caller falls back to its default. */

function safeRead(store, key) {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(store, key, value) {
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export const local = Object.freeze({
  /**
   * @param {string} key
   * @param {string|null} [fallback]
   * @returns {string|null}
   */
  read(key, fallback = null) {
    return safeRead(window.localStorage, key) ?? fallback;
  },

  /** @returns {boolean} whether the value was persisted. */
  write(key, value) {
    return safeWrite(window.localStorage, key, value);
  },
});

export const session = Object.freeze({
  read(key, fallback = null) {
    return safeRead(window.sessionStorage, key) ?? fallback;
  },

  write(key, value) {
    return safeWrite(window.sessionStorage, key, value);
  },

  /** @returns {boolean} whether the key is already set. */
  has(key) {
    return safeRead(window.sessionStorage, key) !== null;
  },
});
