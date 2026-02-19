const TimeFormatter = require('../../src/services/TimeFormatter');
const TranslationService = require('../../src/services/TranslationService');
const Locale = require('../../src/constants/Locale');

describe('TimeFormatter Service', () => {
  let formatter;
  let translationService;

  beforeEach(() => {
    translationService = new TranslationService(Locale.EN);
    formatter = new TimeFormatter(translationService);
  });

  describe('formatTime', () => {
    const testDate = new Date(2026, 1, 18, 14, 30, 45);

    it('should format time without modifiers (default)', () => {
      expect(formatter.formatTime(testDate)).toBe('2:30:45 PM');
    });

    it('should format time with ^ modifier (no seconds)', () => {
      expect(formatter.formatTime(testDate, '^')).toBe('2:30 PM');
    });

    it('should format time with & modifier (24-hour)', () => {
      expect(formatter.formatTime(testDate, '&')).toBe('14:30:45');
    });

    it('should format time with ^& modifiers', () => {
      expect(formatter.formatTime(testDate, '^&')).toBe('14:30');
    });

    it('should format midnight correctly', () => {
      const midnight = new Date(2026, 1, 18, 0, 0, 0);
      expect(formatter.formatTime(midnight)).toBe('12:00:00 AM');
      expect(formatter.formatTime(midnight, '&')).toBe('00:00:00');
    });

    it('should format noon correctly', () => {
      const noon = new Date(2026, 1, 18, 12, 0, 0);
      expect(formatter.formatTime(noon)).toBe('12:00:00 PM');
      expect(formatter.formatTime(noon, '&')).toBe('12:00:00');
    });
  });

  describe('formatDate', () => {
    it('should format date as MM/DD/YYYY', () => {
      const date = new Date(2026, 1, 18);
      expect(formatter.formatDate(date)).toBe('02/18/2026');
    });

    it('should pad single digits', () => {
      const date = new Date(2026, 0, 5);
      expect(formatter.formatDate(date)).toBe('01/05/2026');
    });
  });

  describe('formatShortDate', () => {
    it('should format date as MM/DD/YY', () => {
      const date = new Date(2026, 1, 18);
      expect(formatter.formatShortDate(date)).toBe('02/18/26');
    });
  });

  describe('formatLongDate', () => {
    it('should format date as Month Day, Year', () => {
      const date = new Date(2026, 1, 18);
      expect(formatter.formatLongDate(date)).toBe('February 18, 2026');
    });

    it('should handle all months', () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      months.forEach((month, index) => {
        const date = new Date(2026, index, 1);
        expect(formatter.formatLongDate(date)).toContain(month);
      });
    });

    it('should use Spanish month names when locale is Spanish', () => {
      translationService.setLocale(Locale.ES);
      const date = new Date(2026, 0, 15); // January
      expect(formatter.formatLongDate(date)).toBe('Enero 15, 2026');
    });
  });

  describe('formatDuration', () => {
    it('should format durations under 1 hour', () => {
      expect(formatter.formatDuration(5 * 60 * 1000)).toBe('5:00');
      expect(formatter.formatDuration(45 * 1000)).toBe('0:45');
    });

    it('should format durations over 1 hour', () => {
      expect(formatter.formatDuration(90 * 60 * 1000)).toBe('1:30:00');
    });
  });

  describe('formatTimerDisplay', () => {
    it('should format seconds correctly', () => {
      expect(formatter.formatTimerDisplay(300)).toBe('5:00');
      expect(formatter.formatTimerDisplay(5400)).toBe('1:30:00');
    });
  });

  describe('parseTimeString', () => {
    it('should parse HH:MM format (legacy)', () => {
      const result = formatter.parseTimeString('14:30');
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
    });

    it('should parse HH:MM:SS format (legacy)', () => {
      const result = formatter.parseTimeString('14:30:45');
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(45);
    });

    it('should parse ISO 8601 format with T separator', () => {
      const result = formatter.parseTimeString('2026-02-18T14:30:00');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1); // February (0-indexed)
      expect(result.getDate()).toBe(18);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
      expect(result.getSeconds()).toBe(0);
    });

    it('should parse ISO 8601 format without seconds', () => {
      const result = formatter.parseTimeString('2026-02-18T14:30');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(18);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(30);
    });

    it('should parse date-only format (with dashes)', () => {
      const result = formatter.parseTimeString('2026-02-18');
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1);
      // Date may vary by timezone when parsed without time, so just check it's valid
      expect(result.getDate()).toBeGreaterThanOrEqual(17);
      expect(result.getDate()).toBeLessThanOrEqual(18);
    });

    it('should return null for empty string', () => {
      const result = formatter.parseTimeString('');
      expect(result).toBeNull();
    });

    it('should return null for null input', () => {
      const result = formatter.parseTimeString(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined input', () => {
      const result = formatter.parseTimeString(undefined);
      expect(result).toBeNull();
    });
  });

  describe('getMonthName', () => {
    it('should return English month names by default', () => {
      expect(formatter.getMonthName(0)).toBe('Jan');
      expect(formatter.getMonthName(1)).toBe('Feb');
      expect(formatter.getMonthName(11)).toBe('Dec');
    });

    it('should return Spanish month names when locale is Spanish', () => {
      translationService.setLocale(Locale.ES);
      expect(formatter.getMonthName(0)).toBe('Ene');
      expect(formatter.getMonthName(3)).toBe('Abr');
      expect(formatter.getMonthName(7)).toBe('Ago');
      expect(formatter.getMonthName(11)).toBe('Dic');
    });

  });

  describe('getLongMonthName', () => {
    it('should return English full month names by default', () => {
      expect(formatter.getLongMonthName(0)).toBe('January');
      expect(formatter.getLongMonthName(1)).toBe('February');
      expect(formatter.getLongMonthName(11)).toBe('December');
    });

    it('should return Spanish full month names when locale is Spanish', () => {
      translationService.setLocale(Locale.ES);
      expect(formatter.getLongMonthName(0)).toBe('Enero');
      expect(formatter.getLongMonthName(3)).toBe('Abril');
      expect(formatter.getLongMonthName(7)).toBe('Agosto');
      expect(formatter.getLongMonthName(11)).toBe('Diciembre');
    });
  });

  describe('constructor', () => {
    it('should require TranslationService', () => {
      expect(() => new TimeFormatter()).toThrow('TimeFormatter requires a TranslationService instance');
      expect(() => new TimeFormatter(null)).toThrow('TimeFormatter requires a TranslationService instance');
      expect(() => new TimeFormatter(undefined)).toThrow('TimeFormatter requires a TranslationService instance');
    });
  });

  describe('formatDateTime', () => {
    it('should format with ISO 8601 date and time', () => {
      const testDate = new Date(2026, 1, 18, 14, 30, 45); // Feb 18, 2026 2:30:45 PM
      const result = formatter.formatDateTime(testDate);

      expect(result).toBe('2026-02-18 2:30:45 PM');
    });

    it('should format with ISO 8601 date for today', () => {
      const today = new Date(2026, 1, 19, 10, 15, 30); // Feb 19, 2026 10:15:30 AM
      const result = formatter.formatDateTime(today);

      // Should always show ISO date, even for today
      expect(result).toBe('2026-02-19 10:15:30 AM');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d+:\d+:\d+ (AM|PM)$/);
    });

    it('should apply ^ modifier (no seconds)', () => {
      const testDate = new Date(2026, 6, 20, 14, 30, 45); // July 20, 2026
      const result = formatter.formatDateTime(testDate, '^');

      expect(result).toBe('2026-07-20 2:30 PM');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d+:\d+ (AM|PM)$/);
    });

    it('should apply & modifier (24-hour format)', () => {
      const testDate = new Date(2026, 1, 18, 14, 30, 45);
      const result = formatter.formatDateTime(testDate, '&');

      expect(result).toBe('2026-02-18 14:30:45');
      expect(result).not.toMatch(/AM|PM/);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });

    it('should apply ^& modifiers (24-hour, no seconds)', () => {
      const testDate = new Date(2026, 6, 20, 14, 30, 45);
      const result = formatter.formatDateTime(testDate, '^&');

      expect(result).toBe('2026-07-20 14:30');
      expect(result).not.toMatch(/AM|PM/);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
    });

    it('should apply &^ modifiers (order does not matter)', () => {
      const testDate = new Date(2026, 6, 20, 14, 30, 45);
      const result = formatter.formatDateTime(testDate, '&^');

      expect(result).toBe('2026-07-20 14:30');
    });

    it('should handle midnight correctly', () => {
      const midnight = new Date(2026, 0, 1, 0, 0, 0);
      const result = formatter.formatDateTime(midnight);

      expect(result).toBe('2026-01-01 12:00:00 AM');
    });

    it('should handle noon correctly', () => {
      const noon = new Date(2026, 11, 31, 12, 0, 0);
      const result = formatter.formatDateTime(noon);

      expect(result).toBe('2026-12-31 12:00:00 PM');
    });

    it('should pad single-digit months and days', () => {
      const testDate = new Date(2026, 0, 5, 9, 5, 5); // Jan 5, 2026
      const result = formatter.formatDateTime(testDate);

      expect(result).toBe('2026-01-05 9:05:05 AM');
      expect(result).toMatch(/^2026-01-05/); // ISO date should be padded
    });

    it('should return empty string for null date', () => {
      const result = formatter.formatDateTime(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined date', () => {
      const result = formatter.formatDateTime(undefined);
      expect(result).toBe('');
    });
  });
});
