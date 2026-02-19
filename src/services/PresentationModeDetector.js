/**
 * Presentation Mode Detector Service
 *
 * Responsibility: Detect if Google Slides is in presentation mode
 * Single Responsibility Principle: Only handles presentation mode detection
 */
class PresentationModeDetector {
  /**
   * Check if we're currently in presentation mode
   * @returns {boolean} True if in presentation mode
   */
  isInPresentationMode() {
    const url = window.location.href;

    // Edit mode URLs contain '/edit' - definitely NOT in presentation
    if (url.includes('/edit')) {
      return false;
    }

    // Only these indicate actual presentation mode
    const isPresent = url.includes('/present') ||
                     url.includes('/pub?') ||
                     // We're in an iframe with presentation in the URL
                     (window !== window.top &&
                      (url.includes('/present') ||
                       document.body.classList.contains('punch-present-mode')));

    return isPresent;
  }

  /**
   * Watch for presentation mode changes
   * @param {Function} callback - Called when mode changes (receives boolean)
   * @returns {Object} Observer object with disconnect() method
   */
  watchModeChanges(callback) {
    let lastState = this.isInPresentationMode();

    // Check periodically
    const intervalId = setInterval(() => {
      const currentState = this.isInPresentationMode();
      if (currentState !== lastState) {
        lastState = currentState;
        callback(currentState);
      }
    }, 1000);

    // Also watch DOM changes
    const observer = new MutationObserver(() => {
      const currentState = this.isInPresentationMode();
      if (currentState !== lastState) {
        lastState = currentState;
        callback(currentState);
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
    }

    return {
      disconnect: () => {
        clearInterval(intervalId);
        observer.disconnect();
      }
    };
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PresentationModeDetector;
}
