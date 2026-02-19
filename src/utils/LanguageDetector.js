/**
 * Language Detector Utility
 *
 * Responsibility: Detect browser language and extract base locale
 * Single Responsibility Principle: Only handles language detection
 * Returns Locale enum values for type safety
 */

// Import Locale enum (for Node.js testing only)
// Check for Node.js environment first to avoid hoisting issues in browser
if (typeof module !== 'undefined' && module.exports && typeof Locale === 'undefined') {
  Locale = require('../constants/Locale');
}

class LanguageDetector {
  /**
   * @param {Object} chromeI18n - Chrome i18n API (for dependency injection)
   * @param {TranslationService} translationService - To check supported locales
   */
  constructor(chromeI18n, translationService) {
    this.chromeI18n = chromeI18n;
    this.translationService = translationService;
    this.defaultLocale = Locale.EN;
  }

  /**
   * Detect and return the best locale to use
   * @returns {string} Locale enum value (e.g., Locale.EN, Locale.ES)
   */
  detectLocale() {
    try {
      // Get Chrome's UI language
      const browserLanguage = this.chromeI18n?.getUILanguage?.();

      if (!browserLanguage) {
        console.log('[Slides Timer for GS] No browser language detected, using default:', this.defaultLocale);
        return this.defaultLocale;
      }

      // Parse base language from BCP 47 format (e.g., "en-US" → Locale.EN)
      const baseLocale = this.parseLanguageCode(browserLanguage);

      // Check if locale is supported
      if (this.translationService.hasLocale(baseLocale)) {
        console.log('[Slides Timer for GS] Detected browser language:', browserLanguage, '→ Using locale:', baseLocale);
        return baseLocale;
      }

      // Fallback to default if not supported
      console.log('[Slides Timer for GS] Language', browserLanguage, 'not supported, using default:', this.defaultLocale);
      return this.defaultLocale;

    } catch (error) {
      console.warn('[Slides Timer for GS] Error detecting language:', error);
      return this.defaultLocale;
    }
  }

  /**
   * Parse language code from BCP 47 format to Locale enum
   * @param {string} languageCode - Full language code (e.g., "en-US", "es-ES", "pt-BR")
   * @returns {string} Locale enum value (e.g., Locale.EN, Locale.ES)
   */
  parseLanguageCode(languageCode) {
    if (!languageCode || typeof languageCode !== 'string') {
      return this.defaultLocale;
    }

    // Extract base language (2 letters followed by hyphen, underscore, or end of string)
    const match = languageCode.match(/^([a-z]{2})(?:[-_]|$)/i);

    if (!match) {
      return this.defaultLocale;
    }

    const baseCode = match[1].toLowerCase();

    // Map to Locale enum values
    switch (baseCode) {
      case 'en':
        return Locale.EN;
      case 'es':
        return Locale.ES;
      // Future languages can be added here
      default:
        return this.defaultLocale;
    }
  }

  /**
   * Get default locale
   * @returns {string} Default locale enum value (Locale.EN)
   */
  getDefaultLocale() {
    return this.defaultLocale;
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageDetector;
}
