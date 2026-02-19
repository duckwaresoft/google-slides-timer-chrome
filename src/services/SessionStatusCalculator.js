/**
 * Session Status Calculator Service
 *
 * Responsibility: Calculate session status and time ranges
 * Single Responsibility Principle: Only handles session status logic
 *
 * Dependencies: SessionStatus enum (loaded globally in browser via manifest.json)
 */

// Import SessionStatus enum (for Node.js testing only)
// Check for Node.js environment first to avoid hoisting issues in browser
if (typeof module !== 'undefined' && module.exports && typeof SessionStatus === 'undefined') {
  SessionStatus = require('../constants/SessionStatus');
}

class SessionStatusCalculator {
  /**
   * Get current session status
   * @param {Date} now - Current time
   * @param {Date} startDateTime - Session start time
   * @param {Date} endDateTime - Session end time
   * @returns {string|null} Status enum value or null
   */
  getStatus(now, startDateTime, endDateTime) {
    if (!startDateTime || !endDateTime) {
      return null;
    }

    if (now < startDateTime) {
      return SessionStatus.NOT_STARTED;
    } else if (now >= startDateTime && now <= endDateTime) {
      return SessionStatus.IN_PROGRESS;
    } else {
      return SessionStatus.FINISHED;
    }
  }

  /**
   * Calculate elapsed time
   * @param {Date} now - Current time
   * @param {Date} startDateTime - Session start time
   * @param {Date} endDateTime - Session end time
   * @returns {number|null} Elapsed time in milliseconds or null
   */
  getElapsed(now, startDateTime, endDateTime) {
    if (!startDateTime || !endDateTime) {
      return null;
    }

    if (now < startDateTime) {
      return 0; // Not started yet
    } else if (now >= startDateTime && now <= endDateTime) {
      return now - startDateTime; // Time since start
    } else {
      return endDateTime - startDateTime; // Total duration
    }
  }

  /**
   * Calculate remaining time
   * @param {Date} now - Current time
   * @param {Date} startDateTime - Session start time
   * @param {Date} endDateTime - Session end time
   * @returns {number|null} Remaining time in milliseconds or null
   */
  getRemaining(now, startDateTime, endDateTime) {
    if (!startDateTime || !endDateTime) {
      return null;
    }

    const duration = endDateTime - startDateTime;

    if (now < startDateTime) {
      return duration; // Full duration (not started)
    } else if (now >= startDateTime && now <= endDateTime) {
      return endDateTime - now; // Time until end
    } else {
      return 0; // Finished
    }
  }

  /**
   * Calculate total duration
   * @param {Date} startDateTime - Session start time
   * @param {Date} endDateTime - Session end time
   * @returns {number|null} Duration in milliseconds or null
   */
  getDuration(startDateTime, endDateTime) {
    if (!startDateTime || !endDateTime) {
      return null;
    }

    return endDateTime - startDateTime;
  }

  /**
   * Get all session information at once
   * @param {Date} now - Current time
   * @param {Date} startDateTime - Session start time
   * @param {Date} endDateTime - Session end time
   * @returns {Object} Complete session info
   */
  getSessionInfo(now, startDateTime, endDateTime) {
    return {
      status: this.getStatus(now, startDateTime, endDateTime),
      elapsed: this.getElapsed(now, startDateTime, endDateTime),
      remaining: this.getRemaining(now, startDateTime, endDateTime),
      duration: this.getDuration(startDateTime, endDateTime)
    };
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionStatusCalculator;
}
