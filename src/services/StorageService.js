/**
 * Storage Service
 *
 * Responsibility: Handle Chrome storage operations
 * Single Responsibility Principle: Only handles storage
 * Dependency Inversion: Depends on storage abstraction, not concrete implementation
 */
class StorageService {
  /**
   * @param {Object} storage - Storage implementation (chrome.storage.local or mock)
   */
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * Get stored times
   * @returns {Promise<{startTime: string, endTime: string}>}
   */
  async getTimes() {
    return new Promise((resolve) => {
      this.storage.get(['startTime', 'endTime'], (result) => {
        resolve({
          startTime: result.startTime || null,
          endTime: result.endTime || null
        });
      });
    });
  }

  /**
   * Save times
   * @param {string} startTime - Start time (ISO 8601 format: "2026-02-18T14:00:00")
   * @param {string} endTime - End time (ISO 8601 format: "2026-02-18T16:00:00")
   * @returns {Promise<void>}
   */
  async saveTimes(startTime, endTime) {
    return new Promise((resolve) => {
      this.storage.set({
        startTime,
        endTime
      }, resolve);
    });
  }

  /**
   * Clear stored times
   * @returns {Promise<void>}
   */
  async clearTimes() {
    return new Promise((resolve) => {
      this.storage.remove(['startTime', 'endTime'], resolve);
    });
  }

  /**
   * Get stored language preference
   * @returns {Promise<string|null>} Language code ('en', 'es') or 'auto', or null if not set
   */
  async getLanguage() {
    return new Promise((resolve) => {
      this.storage.get(['language'], (result) => {
        resolve(result.language || null);
      });
    });
  }

  /**
   * Save language preference
   * @param {string} language - Language code ('auto', 'en', 'es')
   * @returns {Promise<void>}
   */
  async saveLanguage(language) {
    return new Promise((resolve) => {
      this.storage.set({ language }, resolve);
    });
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageService;
}
