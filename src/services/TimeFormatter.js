/**
 * Time Formatter Service
 *
 * Responsibility: Format times and dates in various formats
 * Single Responsibility Principle: Only handles time/date formatting
 * Interface Segregation: Clients only use methods they need
 * Dependency Inversion: Depends on TranslationService for i18n
 */
class TimeFormatter {
  /**
   * @param {TranslationService} translationService - Translation service for i18n (required)
   */
  constructor(translationService) {
    if (!translationService) {
      throw new Error('TimeFormatter requires a TranslationService instance');
    }
    this.translationService = translationService;
  }
  /**
   * Format time with optional modifiers
   * @param {Date} date - Date to format
   * @param {string} modifiers - Format modifiers (^ = no seconds, & = 24h)
   * @returns {string} Formatted time
   */
  formatTime(date, modifiers = '') {
    const noSeconds = modifiers.includes('^');
    const use24Hour = modifiers.includes('&');

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (use24Hour) {
      // 24-hour format
      const hoursStr = String(hours).padStart(2, '0');
      const minutesStr = String(minutes).padStart(2, '0');
      const secondsStr = String(seconds).padStart(2, '0');

      return noSeconds
        ? `${hoursStr}:${minutesStr}`
        : `${hoursStr}:${minutesStr}:${secondsStr}`;
    } else {
      // 12-hour format with AM/PM
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12

      const minutesStr = String(minutes).padStart(2, '0');
      const secondsStr = String(seconds).padStart(2, '0');

      return noSeconds
        ? `${hours}:${minutesStr} ${ampm}`
        : `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
    }
  }

  /**
   * Format date as MM/DD/YYYY
   * @param {Date} date - Date to format
   * @returns {string}
   */
  formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Format short date as MM/DD/YY
   * @param {Date} date - Date to format
   * @returns {string}
   */
  formatShortDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  }

  /**
   * Format long date as "Month Day, Year" with localized month
   * @param {Date} date - Date to format
   * @returns {string}
   */
  formatLongDate(date) {
    const month = this.getLongMonthName(date.getMonth());
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  /**
   * Format duration in milliseconds
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted as M:SS or H:MM:SS
   */
  formatDuration(ms) {
    const totalSeconds = Math.floor(Math.abs(ms) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
  }

  /**
   * Format timer display from seconds
   * @param {number} totalSeconds - Total seconds
   * @returns {string} Formatted as M:SS or H:MM:SS
   */
  formatTimerDisplay(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
  }

  /**
   * Parse time string to Date object
   * Supports both ISO 8601 format and legacy HH:MM format
   * @param {string} timeStr - Time string (ISO 8601 "2026-02-18T14:00:00" or legacy "HH:MM")
   * @returns {Date|null} Parsed date or null if invalid
   */
  parseTimeString(timeStr) {
    if (!timeStr) return null;

    // Handle ISO 8601 format (contains 'T' or '-')
    if (timeStr.includes('T') || timeStr.includes('-')) {
      return new Date(timeStr);
    }

    // Handle old format (HH:MM or HH:MM:SS) - assume today's date
    const now = new Date();
    const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);
  }

  /**
   * Get localized month name (abbreviated)
   * @param {number} monthIndex - Month index (0-11)
   * @returns {string} Localized month abbreviation
   */
  getMonthName(monthIndex) {
    const monthKeys = [
      'MONTH_JAN', 'MONTH_FEB', 'MONTH_MAR', 'MONTH_APR', 'MONTH_MAY', 'MONTH_JUN',
      'MONTH_JUL', 'MONTH_AUG', 'MONTH_SEP', 'MONTH_OCT', 'MONTH_NOV', 'MONTH_DEC'
    ];

    return this.translationService.translate(monthKeys[monthIndex]);
  }

  /**
   * Get localized long month name
   * @param {number} monthIndex - Month index (0-11)
   * @returns {string} Localized full month name
   */
  getLongMonthName(monthIndex) {
    const monthKeys = [
      'MONTH_LONG_JAN', 'MONTH_LONG_FEB', 'MONTH_LONG_MAR', 'MONTH_LONG_APR',
      'MONTH_LONG_MAY', 'MONTH_LONG_JUN', 'MONTH_LONG_JUL', 'MONTH_LONG_AUG',
      'MONTH_LONG_SEP', 'MONTH_LONG_OCT', 'MONTH_LONG_NOV', 'MONTH_LONG_DEC'
    ];

    return this.translationService.translate(monthKeys[monthIndex]);
  }

  /**
   * Format date and time with ISO 8601 date format
   * Outputs: ISO 8601 date (YYYY-MM-DD) + space + formatted time
   *
   * Examples:
   *   - No modifiers: "2026-02-19 2:00:00 PM"
   *   - With ^:       "2026-02-19 2:00 PM"
   *   - With &:       "2026-02-19 14:00:00"
   *   - With ^&:      "2026-02-19 14:00"
   *
   * Note: This uses ISO 8601 date format (YYYY-MM-DD) only, NOT the full
   *       ISO 8601 timestamp format (YYYY-MM-DDTHH:MM:SS) used for storage.
   *
   * @param {Date} date - Date to format
   * @param {string} modifiers - Format modifiers (^ = no seconds, & = 24h)
   * @returns {string} Formatted datetime with ISO 8601 date + formatted time
   */
  formatDateTime(date, modifiers = '') {
    if (!date) return '';

    // Format date in ISO 8601 date format: YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const isoDate = `${year}-${month}-${day}`;

    // Format time part with modifiers (12h/24h, with/without seconds)
    const timeStr = this.formatTime(date, modifiers);

    // Return: "YYYY-MM-DD HH:MM:SS AM/PM" format
    return `${isoDate} ${timeStr}`;
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimeFormatter;
}
