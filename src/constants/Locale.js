/**
 * Locale Constants
 *
 * ISO 639-1 language codes supported by the extension
 * Currently only EN is used (Option A), but infrastructure supports future languages
 */
const Locale = {
  EN: 'en',
  ES: 'es'
  // Easy to add: FR: 'fr', DE: 'de', PT: 'pt', etc.
};

// Freeze to prevent modifications
Object.freeze(Locale);

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Locale;
}
