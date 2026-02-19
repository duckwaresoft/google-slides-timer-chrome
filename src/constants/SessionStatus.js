/**
 * Session Status Constants
 *
 * Enum for session status values used by SessionStatusCalculator
 * These are used internally and translated to display text by StatusFormatter
 */
const SessionStatus = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED'
};

// Freeze to prevent modifications
Object.freeze(SessionStatus);

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionStatus;
}
