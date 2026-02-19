/**
 * Slides Timer Extension Main Class
 *
 * Responsibility: Orchestrate all services and manage extension lifecycle
 * Dependency Inversion: Depends on service interfaces, not implementations
 * Single Responsibility: Coordinates services, doesn't do the work itself
 */
class SlidesTimerExtension {
  /**
   * @param {Object} services - All required services
   */
  constructor(services) {
    this.presentationModeDetector = services.presentationModeDetector;
    this.storageService = services.storageService;
    this.placeholderParser = services.placeholderParser;
    this.timeFormatter = services.timeFormatter;
    this.timerManager = services.timerManager;
    this.sessionCalculator = services.sessionCalculator;
    this.placeholderReplacer = services.placeholderReplacer;
    this.domNodeTracker = services.domNodeTracker;

    this.updateInterval = null;
    this.modeWatcher = null;
  }

  /**
   * Initialize the extension
   */
  async init() {
    console.log('[Slides Timer for GS] Initializing...');

    // Start watching for presentation mode changes
    this.modeWatcher = this.presentationModeDetector.watchModeChanges((inPresentMode) => {
      if (inPresentMode) {
        console.log('[Slides Timer for GS] ✓ Entering presentation mode');
        this.startReplacements();
      } else {
        console.log('[Slides Timer for GS] ✗ Exiting presentation mode');
        this.stopReplacements();
      }
    });

    // Check if already in presentation mode
    if (this.presentationModeDetector.isInPresentationMode()) {
      this.startReplacements();
    }
  }

  /**
   * Start replacing placeholders
   */
  async startReplacements() {
    if (this.updateInterval) {
      return; // Already running
    }

    console.log('[Slides Timer for GS] Starting replacements');

    // Start presentation tracking
    this.timerManager.startPresentation();
    this.domNodeTracker.clear();

    // Start update loop
    await this.update();
    this.updateInterval = setInterval(() => this.update(), 1000);
  }

  /**
   * Stop replacing placeholders
   */
  stopReplacements() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.timerManager.stopPresentation();
    this.domNodeTracker.clear();

    console.log('[Slides Timer for GS] Stopped replacements');
  }

  /**
   * Update all placeholders (called every second)
   */
  async update() {
    try {
      const now = new Date();

      // Get saved times
      const { startTime, endTime } = await this.storageService.getTimes();
      const startDateTime = startTime ? this.timeFormatter.parseTimeString(startTime) : null;
      const endDateTime = endTime ? this.timeFormatter.parseTimeString(endTime) : null;

      // Find new nodes with placeholders
      const newNodes = this.domNodeTracker.findPlaceholderNodes(document.body);
      newNodes.forEach(node => this.domNodeTracker.trackNode(node));

      // Clean up stale nodes
      this.domNodeTracker.cleanupStaleNodes();

      // Update all tracked nodes
      const trackedNodes = this.domNodeTracker.getTrackedNodes();
      trackedNodes.forEach(node => {
        const originalText = this.domNodeTracker.getOriginalText(node);
        if (!originalText) return;

        // Replace placeholders
        const newText = this.placeholderReplacer.replacePlaceholders(
          originalText,
          now,
          startDateTime,
          endDateTime
        );

        // Update node if changed
        this.domNodeTracker.updateNodeText(node, newText);
      });
    } catch (error) {
      console.error('[Slides Timer for GS] Error during update:', error);
    }
  }

  /**
   * Destroy the extension
   */
  destroy() {
    this.stopReplacements();

    if (this.modeWatcher) {
      this.modeWatcher.disconnect();
      this.modeWatcher = null;
    }

    console.log('[Slides Timer for GS] Destroyed');
  }

  /**
   * Get extension status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isRunning: this.updateInterval !== null,
      inPresentationMode: this.presentationModeDetector.isInPresentationMode(),
      trackedNodes: this.domNodeTracker.getStats(),
      activeTimers: this.timerManager.getActiveTimers().length
    };
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SlidesTimerExtension;
}
