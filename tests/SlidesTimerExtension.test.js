const SlidesTimerExtension = require('../src/SlidesTimerExtension');

describe('SlidesTimerExtension', () => {
  let extension;
  let mockServices;

  beforeEach(() => {
    // Create mock services
    mockServices = {
      presentationModeDetector: {
        isInPresentationMode: jest.fn(() => false),
        watchModeChanges: jest.fn((callback) => ({
          disconnect: jest.fn()
        }))
      },
      storageService: {
        getTimes: jest.fn(async () => ({
          startTime: '14:00',
          endTime: '16:00'
        }))
      },
      placeholderParser: {},
      timeFormatter: {
        parseTimeString: jest.fn((timeStr) => {
          const [hours, minutes] = timeStr.split(':').map(Number);
          return new Date(2026, 1, 18, hours, minutes, 0);
        })
      },
      timerManager: {
        startPresentation: jest.fn(),
        stopPresentation: jest.fn(),
        getActiveTimers: jest.fn(() => [])
      },
      sessionCalculator: {},
      placeholderReplacer: {
        replacePlaceholders: jest.fn((text) => text.replace('<<time>>', '2:30 PM'))
      },
      domNodeTracker: {
        clear: jest.fn(),
        findPlaceholderNodes: jest.fn(() => []),
        trackNode: jest.fn(),
        cleanupStaleNodes: jest.fn(),
        getTrackedNodes: jest.fn(() => []),
        getOriginalText: jest.fn(() => '<<time>>'),
        updateNodeText: jest.fn(),
        getStats: jest.fn(() => ({ totalTracked: 0, inDOM: 0 }))
      }
    };

    extension = new SlidesTimerExtension(mockServices);
  });

  afterEach(() => {
    if (extension.updateInterval) {
      clearInterval(extension.updateInterval);
    }
  });

  describe('init', () => {
    it('should initialize and start watching for mode changes', async () => {
      await extension.init();

      expect(mockServices.presentationModeDetector.watchModeChanges).toHaveBeenCalled();
    });

    it('should not start replacements if not in presentation mode', async () => {
      mockServices.presentationModeDetector.isInPresentationMode.mockReturnValue(false);

      await extension.init();

      expect(mockServices.timerManager.startPresentation).not.toHaveBeenCalled();
    });

    it('should start replacements if already in presentation mode', async () => {
      mockServices.presentationModeDetector.isInPresentationMode.mockReturnValue(true);

      await extension.init();

      expect(mockServices.timerManager.startPresentation).toHaveBeenCalled();
      expect(mockServices.domNodeTracker.clear).toHaveBeenCalled();
    });

    it('should call startReplacements when mode changes to presentation', async () => {
      let modeChangeCallback;
      mockServices.presentationModeDetector.watchModeChanges.mockImplementation((cb) => {
        modeChangeCallback = cb;
        return { disconnect: jest.fn() };
      });

      await extension.init();

      // Simulate mode change to presentation
      modeChangeCallback(true);

      expect(mockServices.timerManager.startPresentation).toHaveBeenCalled();
    });

    it('should call stopReplacements when mode changes away from presentation', async () => {
      let modeChangeCallback;
      mockServices.presentationModeDetector.watchModeChanges.mockImplementation((cb) => {
        modeChangeCallback = cb;
        return { disconnect: jest.fn() };
      });

      await extension.init();
      await extension.startReplacements();

      // Simulate mode change away from presentation
      modeChangeCallback(false);

      expect(mockServices.timerManager.stopPresentation).toHaveBeenCalled();
    });
  });

  describe('startReplacements', () => {
    it('should start timer manager and clear DOM tracker', async () => {
      await extension.startReplacements();

      expect(mockServices.timerManager.startPresentation).toHaveBeenCalled();
      expect(mockServices.domNodeTracker.clear).toHaveBeenCalled();
    });

    it('should not start if already running', async () => {
      await extension.startReplacements();
      mockServices.timerManager.startPresentation.mockClear();

      await extension.startReplacements();

      expect(mockServices.timerManager.startPresentation).not.toHaveBeenCalled();
    });

    it('should call update immediately', async () => {
      await extension.startReplacements();

      expect(mockServices.storageService.getTimes).toHaveBeenCalled();
    });
  });

  describe('stopReplacements', () => {
    it('should stop timer manager and clear DOM tracker', async () => {
      await extension.startReplacements();

      extension.stopReplacements();

      expect(mockServices.timerManager.stopPresentation).toHaveBeenCalled();
      expect(mockServices.domNodeTracker.clear).toHaveBeenCalledTimes(2); // Once on start, once on stop
    });

    it('should clear update interval', async () => {
      await extension.startReplacements();
      expect(extension.updateInterval).not.toBeNull();

      extension.stopReplacements();

      expect(extension.updateInterval).toBeNull();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      document.body.innerHTML = '<div><<time>></div>';
      const textNode = document.body.firstChild.firstChild;

      mockServices.domNodeTracker.findPlaceholderNodes.mockReturnValue([textNode]);
      mockServices.domNodeTracker.getTrackedNodes.mockReturnValue([textNode]);
      mockServices.domNodeTracker.getOriginalText.mockReturnValue('<<time>>');
    });

    it('should fetch storage times', async () => {
      await extension.update();

      expect(mockServices.storageService.getTimes).toHaveBeenCalled();
    });

    it('should find and track new placeholder nodes', async () => {
      await extension.update();

      expect(mockServices.domNodeTracker.findPlaceholderNodes).toHaveBeenCalled();
      expect(mockServices.domNodeTracker.trackNode).toHaveBeenCalled();
    });

    it('should cleanup stale nodes', async () => {
      await extension.update();

      expect(mockServices.domNodeTracker.cleanupStaleNodes).toHaveBeenCalled();
    });

    it('should replace placeholders in tracked nodes', async () => {
      await extension.update();

      expect(mockServices.placeholderReplacer.replacePlaceholders).toHaveBeenCalled();
      expect(mockServices.domNodeTracker.updateNodeText).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockServices.storageService.getTimes.mockRejectedValue(new Error('Storage error'));
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await extension.update();

      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[Slides Timer for GS] Error during update:',
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });

    it('should skip nodes without original text', async () => {
      mockServices.domNodeTracker.getOriginalText.mockReturnValue(null);

      await extension.update();

      expect(mockServices.placeholderReplacer.replacePlaceholders).not.toHaveBeenCalled();
    });

    it('should parse startTime when provided', async () => {
      mockServices.storageService.getTimes.mockResolvedValue({
        startTime: '14:00',
        endTime: null
      });

      await extension.update();

      expect(mockServices.timeFormatter.parseTimeString).toHaveBeenCalledWith('14:00');
    });

    it('should parse endTime when provided', async () => {
      mockServices.storageService.getTimes.mockResolvedValue({
        startTime: null,
        endTime: '16:00'
      });

      await extension.update();

      expect(mockServices.timeFormatter.parseTimeString).toHaveBeenCalledWith('16:00');
    });

    it('should handle null startTime and endTime', async () => {
      mockServices.storageService.getTimes.mockResolvedValue({
        startTime: null,
        endTime: null
      });

      await extension.update();

      expect(mockServices.placeholderReplacer.replacePlaceholders).toHaveBeenCalledWith(
        '<<time>>',
        expect.any(Date),
        null,
        null
      );
    });
  });

  describe('destroy', () => {
    it('should stop replacements and disconnect watcher', async () => {
      await extension.init();
      const disconnectSpy = jest.fn();
      extension.modeWatcher = { disconnect: disconnectSpy };

      extension.destroy();

      expect(mockServices.timerManager.stopPresentation).toHaveBeenCalled();
      expect(disconnectSpy).toHaveBeenCalled();
      expect(extension.modeWatcher).toBeNull();
    });

    it('should work when modeWatcher is null', () => {
      extension.modeWatcher = null;

      expect(() => extension.destroy()).not.toThrow();
    });

    it('should work when not initialized', () => {
      const freshExtension = new SlidesTimerExtension(mockServices);

      expect(() => freshExtension.destroy()).not.toThrow();
    });
  });

  describe('getStatus', () => {
    it('should return extension status', async () => {
      mockServices.presentationModeDetector.isInPresentationMode.mockReturnValue(true);
      mockServices.timerManager.getActiveTimers.mockReturnValue(['timer1', 'timer2']);
      mockServices.domNodeTracker.getStats.mockReturnValue({ totalTracked: 5, inDOM: 4 });

      const status = extension.getStatus();

      expect(status).toEqual({
        isRunning: false,
        inPresentationMode: true,
        trackedNodes: { totalTracked: 5, inDOM: 4 },
        activeTimers: 2
      });
    });

    it('should indicate running state when interval active', async () => {
      await extension.startReplacements();

      const status = extension.getStatus();

      expect(status.isRunning).toBe(true);
    });
  });
});
