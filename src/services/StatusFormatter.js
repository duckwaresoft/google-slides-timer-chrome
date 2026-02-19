/**
 * Status Formatter Service
 *
 * Responsibility: Format session status enums into human-readable text
 * Single Responsibility Principle: Only handles status formatting
 * Dependency Inversion Principle: Depends on TranslationService abstraction
 */
class StatusFormatter {
  /**
   * @param {TranslationService} translationService - Translation service for i18n
   */
  constructor(translationService) {
    this.translationService = translationService;
  }

  /**
   * Format a status enum value to display text
   * @param {string} statusEnum - Status enum value (e.g., 'NOT_STARTED', 'IN_PROGRESS', 'FINISHED')
   * @returns {string} Formatted status message in current locale
   */
  formatStatus(statusEnum) {
    if (!statusEnum) {
      return '';
    }

    return this.translationService.translate(statusEnum);
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatusFormatter;
}
