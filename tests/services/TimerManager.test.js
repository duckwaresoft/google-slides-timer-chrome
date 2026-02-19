const TimerManager = require('../../src/services/TimerManager');

describe('TimerManager Service', () => {
  let timerManager;

  beforeEach(() => {
    timerManager = new TimerManager();
  });

  describe('Presentation lifecycle', () => {
    it('should start presentation', () => {
      timerManager.startPresentation();
      expect(timerManager.presentationStartTime).not.toBeNull();
      expect(timerManager.getActiveTimers()).toEqual([]);
    });

    it('should stop presentation', () => {
      timerManager.startPresentation();
      timerManager.stopPresentation();
      expect(timerManager.presentationStartTime).toBeNull();
      expect(timerManager.getActiveTimers()).toEqual([]);
    });

    it('should clear timers when starting new presentation', () => {
      timerManager.startPresentation();
      timerManager.calculateTimer('timer1', 0, 5, 0, '-');
      expect(timerManager.getActiveTimers()).toHaveLength(1);

      timerManager.startPresentation(); // Start again
      expect(timerManager.getActiveTimers()).toHaveLength(0);
    });
  });

  describe('calculateTimer', () => {
    beforeEach(() => {
      timerManager.startPresentation();
    });

    it('should countdown from initial value', () => {
      const initial = timerManager.calculateTimer('test1', 0, 5, 0, '-');
      expect(initial).toBe(300); // 5 minutes = 300 seconds
    });

    it('should countup from initial value', () => {
      const initial = timerManager.calculateTimer('test2', 0, 2, 0, '+');
      expect(initial).toBeGreaterThanOrEqual(120); // 2 minutes + elapsed
    });

    it('should not go below zero for countdown', () => {
      // Create a timer that would be negative
      const result = timerManager.calculateTimer('test3', 0, 0, 0, '-');
      expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should track multiple independent timers', () => {
      timerManager.calculateTimer('timer1', 0, 5, 0, '-');
      timerManager.calculateTimer('timer2', 0, 10, 0, '-');

      expect(timerManager.getActiveTimers()).toHaveLength(2);
      expect(timerManager.getActiveTimers()).toContain('timer1');
      expect(timerManager.getActiveTimers()).toContain('timer2');
    });

    it('should calculate with hours', () => {
      const result = timerManager.calculateTimer('test4', 1, 30, 0, '-');
      expect(result).toBeGreaterThanOrEqual(5400); // 1.5 hours = 5400 seconds
    });

    it('should return stored start time for existing timer', () => {
      // First call creates the timer
      const result1 = timerManager.calculateTimer('test5', 0, 5, 0, '-');

      // Second call should use same start time
      const result2 = timerManager.calculateTimer('test5', 0, 5, 0, '-');

      // Results should be very close (within 1 second difference)
      expect(Math.abs(result1 - result2)).toBeLessThan(2);
    });
  });

  describe('Timer management', () => {
    beforeEach(() => {
      timerManager.startPresentation();
    });

    it('should reset specific timer', () => {
      timerManager.calculateTimer('timer1', 0, 5, 0, '-');
      timerManager.calculateTimer('timer2', 0, 10, 0, '-');

      timerManager.resetTimer('timer1');

      expect(timerManager.getActiveTimers()).toHaveLength(1);
      expect(timerManager.getActiveTimers()).not.toContain('timer1');
      expect(timerManager.getActiveTimers()).toContain('timer2');
    });

    it('should reset all timers', () => {
      timerManager.calculateTimer('timer1', 0, 5, 0, '-');
      timerManager.calculateTimer('timer2', 0, 10, 0, '-');

      timerManager.resetAllTimers();

      expect(timerManager.getActiveTimers()).toHaveLength(0);
    });

    it('should get all active timers', () => {
      timerManager.calculateTimer('timer1', 0, 5, 0, '-');
      timerManager.calculateTimer('timer2', 0, 10, 0, '-');
      timerManager.calculateTimer('timer3', 0, 15, 0, '+');

      const active = timerManager.getActiveTimers();
      expect(active).toHaveLength(3);
      expect(active).toEqual(['timer1', 'timer2', 'timer3']);
    });
  });
});
