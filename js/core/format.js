/* Small string and number helpers. */

/**
 * Zero-pad a counter for display: 1 of 3 reads as "01" of "03".
 *
 * @param {number} value
 * @param {number} [length]
 * @returns {string}
 */
export function padCount(value, length = 2) {
  return String(value).padStart(length, '0');
}

/**
 * Pick the singular or plural label for a count.
 *
 * @param {number} count
 * @param {string} singular
 * @param {string} plural
 * @returns {string}
 */
export function pluralise(count, singular, plural) {
  return count === 1 ? singular : plural;
}
