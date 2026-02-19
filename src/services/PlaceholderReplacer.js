/**
 * Placeholder Replacer Service
 *
 * Responsibility: Replace placeholders with actual values
 * Dependency Inversion: Depends on abstractions (services), not concrete implementations
 * Open/Closed: Open for extension (new placeholder types) but closed for modification
 */
class PlaceholderReplacer {
  /**
   * @param {TimeFormatter} timeFormatter - Time formatting service
   * @param {TimerManager} timerManager - Timer management service
   * @param {SessionStatusCalculator} sessionCalculator - Session status calculator
   * @param {StatusFormatter} statusFormatter - Status formatter for i18n
   */
  constructor(timeFormatter, timerManager, sessionCalculator, statusFormatter) {
    this.timeFormatter = timeFormatter;
    this.timerManager = timerManager;
    this.sessionCalculator = sessionCalculator;
    this.statusFormatter = statusFormatter;
  }

  /**
   * Replace all placeholders in text
   * @param {string} text - Original text with placeholders
   * @param {Date} now - Current time
   * @param {Date} startDateTime - Session start time (optional)
   * @param {Date} endDateTime - Session end time (optional)
   * @returns {string} Text with placeholders replaced
   */
  replacePlaceholders(text, now, startDateTime = null, endDateTime = null) {
    let result = text;

    // Replace <<time>> with modifiers
    result = result.replace(/<<time([&^]*)>>/gi, (match, modifiers) => {
      return this.timeFormatter.formatTime(now, modifiers);
    });

    // Replace date placeholders
    result = result.replace(/<<date>>/gi, () => {
      return this.timeFormatter.formatDate(now);
    });

    result = result.replace(/<<shortdate>>/gi, () => {
      return this.timeFormatter.formatShortDate(now);
    });

    result = result.replace(/<<longdate>>/gi, () => {
      return this.timeFormatter.formatLongDate(now);
    });

    // Replace countdown/countup timers (HH:MM:SS format)
    result = result.replace(/<<(\d+):(\d+):(\d+)([-+])>>/g, (match, hours, minutes, seconds, direction) => {
      const totalSeconds = this.timerManager.calculateTimer(
        match,
        parseInt(hours),
        parseInt(minutes),
        parseInt(seconds),
        direction
      );
      return this.timeFormatter.formatTimerDisplay(totalSeconds);
    });

    // Replace countdown/countup timers (MM:SS format)
    result = result.replace(/<<(\d+):(\d+)([-+])>>/g, (match, minutes, seconds, direction) => {
      const totalSeconds = this.timerManager.calculateTimer(
        match,
        0,
        parseInt(minutes),
        parseInt(seconds),
        direction
      );
      return this.timeFormatter.formatTimerDisplay(totalSeconds);
    });

    // Replace time-range placeholders (only if start/end times are provided)
    if (startDateTime && endDateTime) {
      // Replace <<start>> and <<end>> with modifiers (smart date display)
      result = result.replace(/<<start([&^]*)>>/gi, (match, modifiers) => {
        return this.timeFormatter.formatDateTime(startDateTime, modifiers);
      });

      result = result.replace(/<<end([&^]*)>>/gi, (match, modifiers) => {
        return this.timeFormatter.formatDateTime(endDateTime, modifiers);
      });

      // Replace <<startTime>> and <<endTime>> with modifiers (time only)
      result = result.replace(/<<startTime([&^]*)>>/gi, (match, modifiers) => {
        return this.timeFormatter.formatTime(startDateTime, modifiers);
      });

      result = result.replace(/<<endTime([&^]*)>>/gi, (match, modifiers) => {
        return this.timeFormatter.formatTime(endDateTime, modifiers);
      });

      // Replace <<startDate>> and <<endDate>> (standard date)
      result = result.replace(/<<startDate>>/gi, () => {
        return this.timeFormatter.formatDate(startDateTime);
      });

      result = result.replace(/<<endDate>>/gi, () => {
        return this.timeFormatter.formatDate(endDateTime);
      });

      // Replace <<startShortDate>> and <<endShortDate>>
      result = result.replace(/<<startShortDate>>/gi, () => {
        return this.timeFormatter.formatShortDate(startDateTime);
      });

      result = result.replace(/<<endShortDate>>/gi, () => {
        return this.timeFormatter.formatShortDate(endDateTime);
      });

      // Replace <<startLongDate>> and <<endLongDate>>
      result = result.replace(/<<startLongDate>>/gi, () => {
        return this.timeFormatter.formatLongDate(startDateTime);
      });

      result = result.replace(/<<endLongDate>>/gi, () => {
        return this.timeFormatter.formatLongDate(endDateTime);
      });

      // Get session info
      const sessionInfo = this.sessionCalculator.getSessionInfo(now, startDateTime, endDateTime);

      // Replace <<duration>>
      if (sessionInfo.duration !== null) {
        result = result.replace(/<<duration>>/gi, () => {
          return this.timeFormatter.formatDuration(sessionInfo.duration);
        });
      }

      // Replace <<status>>
      if (sessionInfo.status) {
        result = result.replace(/<<status>>/gi, () => {
          return this.statusFormatter.formatStatus(sessionInfo.status);
        });
      }

      // Replace <<elapsed>>
      if (sessionInfo.elapsed !== null) {
        result = result.replace(/<<elapsed>>/gi, () => {
          return this.timeFormatter.formatDuration(sessionInfo.elapsed);
        });
      }

      // Replace <<remaining>>
      if (sessionInfo.remaining !== null) {
        result = result.replace(/<<remaining>>/gi, () => {
          return this.timeFormatter.formatDuration(sessionInfo.remaining);
        });
      }
    }

    return result;
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlaceholderReplacer;
}
