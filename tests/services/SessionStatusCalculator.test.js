const SessionStatusCalculator = require('../../src/services/SessionStatusCalculator');
const SessionStatus = require('../../src/constants/SessionStatus');

describe('SessionStatusCalculator Service', () => {
  let calculator;
  let startDateTime, endDateTime;

  beforeEach(() => {
    calculator = new SessionStatusCalculator();
    startDateTime = new Date(2026, 1, 18, 14, 0, 0); // 2:00 PM
    endDateTime = new Date(2026, 1, 18, 16, 0, 0);   // 4:00 PM
  });

  describe('getStatus', () => {
    it('should return "Not started yet" before start time', () => {
      const now = new Date(2026, 1, 18, 13, 0, 0);
      expect(calculator.getStatus(now, startDateTime, endDateTime)).toBe(SessionStatus.NOT_STARTED);
    });

    it('should return "In progress" during session', () => {
      const now = new Date(2026, 1, 18, 15, 0, 0);
      expect(calculator.getStatus(now, startDateTime, endDateTime)).toBe(SessionStatus.IN_PROGRESS);
    });

    it('should return "In progress" at exact start time', () => {
      const now = new Date(2026, 1, 18, 14, 0, 0);
      expect(calculator.getStatus(now, startDateTime, endDateTime)).toBe(SessionStatus.IN_PROGRESS);
    });

    it('should return "In progress" at exact end time', () => {
      const now = new Date(2026, 1, 18, 16, 0, 0);
      expect(calculator.getStatus(now, startDateTime, endDateTime)).toBe(SessionStatus.IN_PROGRESS);
    });

    it('should return "Finished" after end time', () => {
      const now = new Date(2026, 1, 18, 17, 0, 0);
      expect(calculator.getStatus(now, startDateTime, endDateTime)).toBe(SessionStatus.FINISHED);
    });

    it('should return null when times not set', () => {
      const now = new Date();
      expect(calculator.getStatus(now, null, null)).toBeNull();
      expect(calculator.getStatus(now, startDateTime, null)).toBeNull();
      expect(calculator.getStatus(now, null, endDateTime)).toBeNull();
    });
  });

  describe('getElapsed', () => {
    it('should return 0 before start', () => {
      const now = new Date(2026, 1, 18, 13, 0, 0);
      expect(calculator.getElapsed(now, startDateTime, endDateTime)).toBe(0);
    });

    it('should return time since start during session', () => {
      const now = new Date(2026, 1, 18, 15, 0, 0); // 1 hour after start
      const elapsed = calculator.getElapsed(now, startDateTime, endDateTime);
      expect(elapsed).toBe(60 * 60 * 1000); // 1 hour in milliseconds
    });

    it('should return total duration after end', () => {
      const now = new Date(2026, 1, 18, 17, 0, 0);
      const elapsed = calculator.getElapsed(now, startDateTime, endDateTime);
      expect(elapsed).toBe(2 * 60 * 60 * 1000); // 2 hours total
    });

    it('should return null when times not set', () => {
      const now = new Date();
      expect(calculator.getElapsed(now, null, null)).toBeNull();
    });
  });

  describe('getRemaining', () => {
    it('should return full duration before start', () => {
      const now = new Date(2026, 1, 18, 13, 0, 0);
      const remaining = calculator.getRemaining(now, startDateTime, endDateTime);
      expect(remaining).toBe(2 * 60 * 60 * 1000); // 2 hours
    });

    it('should return time until end during session', () => {
      const now = new Date(2026, 1, 18, 15, 0, 0); // 1 hour before end
      const remaining = calculator.getRemaining(now, startDateTime, endDateTime);
      expect(remaining).toBe(60 * 60 * 1000); // 1 hour
    });

    it('should return 0 after end', () => {
      const now = new Date(2026, 1, 18, 17, 0, 0);
      expect(calculator.getRemaining(now, startDateTime, endDateTime)).toBe(0);
    });

    it('should return null when times not set', () => {
      const now = new Date();
      expect(calculator.getRemaining(now, null, null)).toBeNull();
    });
  });

  describe('getDuration', () => {
    it('should calculate duration between times', () => {
      const duration = calculator.getDuration(startDateTime, endDateTime);
      expect(duration).toBe(2 * 60 * 60 * 1000); // 2 hours
    });

    it('should return null when times not set', () => {
      expect(calculator.getDuration(null, null)).toBeNull();
      expect(calculator.getDuration(startDateTime, null)).toBeNull();
      expect(calculator.getDuration(null, endDateTime)).toBeNull();
    });
  });

  describe('getSessionInfo', () => {
    it('should return complete info during session', () => {
      const now = new Date(2026, 1, 18, 15, 0, 0);
      const info = calculator.getSessionInfo(now, startDateTime, endDateTime);

      expect(info.status).toBe(SessionStatus.IN_PROGRESS);
      expect(info.elapsed).toBe(60 * 60 * 1000); // 1 hour
      expect(info.remaining).toBe(60 * 60 * 1000); // 1 hour
      expect(info.duration).toBe(2 * 60 * 60 * 1000); // 2 hours
    });

    it('should return complete info before start', () => {
      const now = new Date(2026, 1, 18, 13, 0, 0);
      const info = calculator.getSessionInfo(now, startDateTime, endDateTime);

      expect(info.status).toBe(SessionStatus.NOT_STARTED);
      expect(info.elapsed).toBe(0);
      expect(info.remaining).toBe(2 * 60 * 60 * 1000);
      expect(info.duration).toBe(2 * 60 * 60 * 1000);
    });

    it('should return complete info after end', () => {
      const now = new Date(2026, 1, 18, 17, 0, 0);
      const info = calculator.getSessionInfo(now, startDateTime, endDateTime);

      expect(info.status).toBe(SessionStatus.FINISHED);
      expect(info.elapsed).toBe(2 * 60 * 60 * 1000);
      expect(info.remaining).toBe(0);
      expect(info.duration).toBe(2 * 60 * 60 * 1000);
    });
  });
});
