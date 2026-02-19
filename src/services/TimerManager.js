/**
 * Timer Manager Service
 *
 * Responsibility: Manage countdown and countup timers
 * Single Responsibility Principle: Only handles timer state and calculations
 */
class TimerManager {
  constructor() {
    this.timerStarts = new Map(); // Store when each timer started
    this.presentationStartTime = null;
  }

  /**
   * Start presentation timer tracking
   */
  startPresentation() {
    this.presentationStartTime = new Date();
    this.timerStarts.clear();
  }

  /**
   * Stop presentation timer tracking
   */
  stopPresentation() {
    this.presentationStartTime = null;
    this.timerStarts.clear();
  }

  /**
   * Calculate timer value
   * @param {string} timerKey - Unique identifier for this timer
   * @param {number} hours - Initial hours
   * @param {number} minutes - Initial minutes
   * @param {number} seconds - Initial seconds
   * @param {string} direction - '+' for countup, '-' for countdown
   * @returns {number} Current timer value in seconds
   */
  calculateTimer(timerKey, hours, minutes, seconds, direction) {
    // Initialize timer start time if not exists
    if (!this.timerStarts.has(timerKey)) {
      this.timerStarts.set(timerKey, new Date());
    }

    const startTime = this.timerStarts.get(timerKey);
    const now = new Date();
    const elapsedMs = now - startTime;
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    // Calculate initial time in seconds
    const initialSeconds = hours * 3600 + minutes * 60 + seconds;

    let displaySeconds;
    if (direction === '-') {
      // Countdown: start from initial time and go down
      displaySeconds = Math.max(0, initialSeconds - elapsedSeconds);
    } else {
      // Countup: start from initial time and go up
      displaySeconds = initialSeconds + elapsedSeconds;
    }

    return displaySeconds;
  }

  /**
   * Get all active timers
   * @returns {Array<string>} Array of timer keys
   */
  getActiveTimers() {
    return Array.from(this.timerStarts.keys());
  }

  /**
   * Reset a specific timer
   * @param {string} timerKey - Timer identifier
   */
  resetTimer(timerKey) {
    this.timerStarts.delete(timerKey);
  }

  /**
   * Reset all timers
   */
  resetAllTimers() {
    this.timerStarts.clear();
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TimerManager;
}
