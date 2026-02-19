const PlaceholderReplacer = require('../../src/services/PlaceholderReplacer');
const TimeFormatter = require('../../src/services/TimeFormatter');
const TimerManager = require('../../src/services/TimerManager');
const SessionStatusCalculator = require('../../src/services/SessionStatusCalculator');
const StatusFormatter = require('../../src/services/StatusFormatter');
const TranslationService = require('../../src/services/TranslationService');
const Locale = require('../../src/constants/Locale');

describe('PlaceholderReplacer Service', () => {
  let replacer;
  let timeFormatter;
  let timerManager;
  let sessionCalculator;
  let statusFormatter;
  let translationService;

  beforeEach(() => {
    translationService = new TranslationService(Locale.EN);
    timeFormatter = new TimeFormatter(translationService);
    timerManager = new TimerManager();
    sessionCalculator = new SessionStatusCalculator();
    statusFormatter = new StatusFormatter(translationService);
    replacer = new PlaceholderReplacer(timeFormatter, timerManager, sessionCalculator, statusFormatter);
  });

  describe('replacePlaceholders - time placeholders', () => {
    it('should replace <<time>> with current time', () => {
      const now = new Date(2026, 1, 18, 14, 30, 45);
      const text = 'Current: <<time>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('Current: 2:30:45 PM');
    });

    it('should replace <<time>> with modifiers', () => {
      const now = new Date(2026, 1, 18, 14, 30, 45);
      const text = 'Current: <<time^>> and <<time&>> and <<time^&>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('Current: 2:30 PM and 14:30:45 and 14:30');
    });
  });

  describe('replacePlaceholders - date placeholders', () => {
    it('should replace <<date>>', () => {
      const now = new Date(2026, 1, 18);
      const text = '<<date>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('02/18/2026');
    });

    it('should replace <<shortdate>>', () => {
      const now = new Date(2026, 1, 18);
      const text = '<<shortdate>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('02/18/26');
    });

    it('should replace <<longdate>>', () => {
      const now = new Date(2026, 1, 18);
      const text = '<<longdate>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('February 18, 2026');
    });
  });

  describe('replacePlaceholders - timer placeholders', () => {
    beforeEach(() => {
      timerManager.startPresentation();
    });

    it('should replace countdown timer (MM:SS format)', () => {
      const now = new Date();
      const text = 'Timer: <<5:00->>';

      const result = replacer.replacePlaceholders(text, now);

      // Should be close to 5:00 (300 seconds)
      expect(result).toMatch(/Timer: \d+:\d+/);
    });

    it('should replace countup timer (MM:SS format)', () => {
      const now = new Date();
      const text = 'Timer: <<2:00+>>';

      const result = replacer.replacePlaceholders(text, now);

      // Should be at least 2:00 (120 seconds)
      expect(result).toMatch(/Timer: \d+:\d+/);
    });

    it('should replace timer with HH:MM:SS format', () => {
      const now = new Date();
      const text = 'Timer: <<1:30:00->>';

      const result = replacer.replacePlaceholders(text, now);

      // Should be close to 1:30:00
      expect(result).toMatch(/Timer: \d+:\d+:\d+/);
    });

    it('should handle multiple independent timers', () => {
      const now = new Date();
      const text = '<<5:00->> and <<10:00->>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toMatch(/\d+:\d+ and \d+:\d+/);
    });
  });

  describe('replacePlaceholders - time-range placeholders', () => {
    let now, startDateTime, endDateTime;

    beforeEach(() => {
      now = new Date(2026, 1, 18, 15, 0, 0); // 3:00 PM
      startDateTime = new Date(2026, 1, 18, 14, 0, 0); // 2:00 PM
      endDateTime = new Date(2026, 1, 18, 16, 0, 0); // 4:00 PM
    });

    it('should replace <<start>> and <<end>> with ISO date format', () => {
      const text = '<<start>> - <<end>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      // Always shows ISO 8601 date format (YYYY-MM-DD)
      expect(result).toBe('2026-02-18 2:00:00 PM - 2026-02-18 4:00:00 PM');
    });

    it('should replace <<start>> and <<end>> with modifiers', () => {
      const text = '<<start^>> - <<end^>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      // Always shows ISO 8601 date format with modifiers applied
      expect(result).toBe('2026-02-18 2:00 PM - 2026-02-18 4:00 PM');
    });

    it('should replace <<status>>', () => {
      const text = 'Status: <<status>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Status: In progress');
    });

    it('should replace <<duration>>', () => {
      const text = 'Duration: <<duration>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Duration: 2:00:00');
    });

    it('should not replace <<duration>> when duration is null', () => {
      const text = 'Duration: <<duration>>';
      jest.spyOn(sessionCalculator, 'getSessionInfo').mockReturnValue({
        status: 'In progress',
        elapsed: 3600000,
        remaining: 3600000,
        duration: null
      });

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Duration: <<duration>>');
      sessionCalculator.getSessionInfo.mockRestore();
    });

    it('should replace <<elapsed>>', () => {
      const text = 'Elapsed: <<elapsed>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Elapsed: 1:00:00');
    });

    it('should not replace <<elapsed>> when elapsed is null', () => {
      const text = 'Elapsed: <<elapsed>>';
      jest.spyOn(sessionCalculator, 'getSessionInfo').mockReturnValue({
        status: 'In progress',
        elapsed: null,
        remaining: 3600000,
        duration: 7200000
      });

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Elapsed: <<elapsed>>');
      sessionCalculator.getSessionInfo.mockRestore();
    });

    it('should replace <<remaining>>', () => {
      const text = 'Remaining: <<remaining>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Remaining: 1:00:00');
    });

    it('should not replace <<remaining>> when remaining is null', () => {
      const text = 'Remaining: <<remaining>>';
      jest.spyOn(sessionCalculator, 'getSessionInfo').mockReturnValue({
        status: 'In progress',
        elapsed: 3600000,
        remaining: null,
        duration: 7200000
      });

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Remaining: <<remaining>>');
      sessionCalculator.getSessionInfo.mockRestore();
    });

    it('should not replace <<status>> when status is falsy', () => {
      const text = 'Status: <<status>>';
      jest.spyOn(sessionCalculator, 'getSessionInfo').mockReturnValue({
        status: null,
        elapsed: 3600000,
        remaining: 3600000,
        duration: 7200000
      });

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toBe('Status: <<status>>');
      sessionCalculator.getSessionInfo.mockRestore();
    });

    it('should not replace time-range placeholders without start/end times', () => {
      const text = '<<start>> - <<end>> | <<status>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('<<start>> - <<end>> | <<status>>');
    });

    it('should handle only startDateTime without endDateTime', () => {
      const text = '<<start>> - <<end>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, null);

      expect(result).toBe('<<start>> - <<end>>');
    });

    it('should handle only endDateTime without startDateTime', () => {
      const text = '<<start>> - <<end>>';

      const result = replacer.replacePlaceholders(text, now, null, endDateTime);

      expect(result).toBe('<<start>> - <<end>>');
    });
  });

  describe('replacePlaceholders - complex scenarios', () => {
    it('should replace all placeholder types together', () => {
      const now = new Date(2026, 1, 18, 15, 0, 0);
      const startDateTime = new Date(2026, 1, 18, 14, 0, 0);
      const endDateTime = new Date(2026, 1, 18, 16, 0, 0);
      timerManager.startPresentation();

      const text = `
        Time: <<time^>>
        Date: <<date>>
        Session: <<start^>> - <<end^>>
        Status: <<status>>
        Timer: <<5:00->>
      `;

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toContain('Time: 3:00 PM');
      expect(result).toContain('Date: 02/18/2026');
      // Always shows ISO 8601 date format
      expect(result).toContain('Session: 2026-02-18 2:00 PM - 2026-02-18 4:00 PM');
      expect(result).toContain('Status: In progress');
      expect(result).toMatch(/Timer: \d+:\d+/);
    });

    it('should handle text without placeholders', () => {
      const now = new Date();
      const text = 'No placeholders here';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('No placeholders here');
    });

    it('should handle empty text', () => {
      const now = new Date();
      const text = '';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('');
    });
  });

  describe('Granular Date/Time Placeholders', () => {
    let startDateTime, endDateTime, now;

    beforeEach(() => {
      startDateTime = new Date(2026, 1, 18, 14, 0, 0);
      endDateTime = new Date(2026, 1, 18, 16, 0, 0);
      now = new Date(2026, 1, 18, 15, 0, 0);
    });

    it('should replace <<startTime>> and <<endTime>> with time only', () => {
      const text = '<<startTime>> - <<endTime>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toMatch(/\d+:\d+:\d+ (AM|PM) - \d+:\d+:\d+ (AM|PM)/);
      expect(result).not.toContain('Feb'); // Should NOT contain date
    });

    it('should replace <<startTime^>> and <<endTime^>> without seconds', () => {
      const text = '<<startTime^>> - <<endTime^>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toMatch(/\d+:\d+ (AM|PM) - \d+:\d+ (AM|PM)/);
      expect(result).not.toMatch(/:\d+:\d+/); // Should NOT have seconds pattern
    });

    it('should replace <<startTime&>> and <<endTime&>> in 24-hour format', () => {
      const text = '<<startTime&>> - <<endTime&>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toMatch(/\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}/);
      expect(result).not.toMatch(/AM|PM/); // Should NOT have AM/PM
    });

    it('should replace <<startTime^&>> with 24-hour, no seconds', () => {
      const text = '<<startTime^&>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toMatch(/\d{2}:\d{2}/);
      expect(result).not.toMatch(/AM|PM/);
      expect(result).not.toMatch(/:\d{2}:\d{2}/); // No seconds pattern
    });

    it('should replace <<startDate>> and <<endDate>> with standard date format', () => {
      const text = '<<startDate>> to <<endDate>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4} to \d{2}\/\d{2}\/\d{4}/);
    });

    it('should replace <<startShortDate>> and <<endShortDate>> with short format', () => {
      const text = '<<startShortDate>> to <<endShortDate>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      expect(result).toMatch(/\d{2}\/\d{2}\/\d{2} to \d{2}\/\d{2}\/\d{2}/);
    });

    it('should replace <<startLongDate>> and <<endLongDate>> with long format', () => {
      const text = '<<startLongDate>> to <<endLongDate>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      // Should contain full month names
      expect(result).toMatch(/(January|February|March|April|May|June|July|August|September|October|November|December)/);
      expect(result).toContain(' to ');
    });

    it('should handle complex mixed format', () => {
      const text = 'Event: <<startLongDate>> at <<startTime^>> until <<endLongDate>> at <<endTime^>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      // Should have long dates
      expect(result).toMatch(/(January|February|March|April|May|June|July|August|September|October|November|December)/);
      // Should have times without seconds
      expect(result).toMatch(/\d+:\d+ (AM|PM)/);
      // Should NOT have seconds
      expect(result).not.toMatch(/:\d+:\d+/);
    });

    it('should not replace granular placeholders without start/end times', () => {
      const text = '<<startTime>> <<endTime>> <<startDate>> <<endDate>>';

      const result = replacer.replacePlaceholders(text, now);

      expect(result).toBe('<<startTime>> <<endTime>> <<startDate>> <<endDate>>');
    });

    it('should keep backward compatibility with <<start>> and <<end>>', () => {
      const text = '<<start>> - <<end>>';

      const result = replacer.replacePlaceholders(text, now, startDateTime, endDateTime);

      // Should contain ISO date and time
      expect(result).toMatch(/\d{4}-\d{2}-\d{2} \d+:\d+:\d+ (AM|PM)/);
      expect(result).toContain(' - ');
      // Should not contain placeholder markers
      expect(result).not.toContain('<<');
      expect(result).not.toContain('>>');
    });
  });
});
