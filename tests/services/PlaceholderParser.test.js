const PlaceholderParser = require('../../src/services/PlaceholderParser');

describe('PlaceholderParser Service', () => {
  let parser;

  beforeEach(() => {
    parser = new PlaceholderParser();
  });

  describe('hasPlaceholders', () => {
    it('should detect placeholders', () => {
      expect(parser.hasPlaceholders('Current time: <<time>>')).toBe(true);
      expect(parser.hasPlaceholders('Timer: <<5:00->>')).toBe(true);
      expect(parser.hasPlaceholders('No placeholders here')).toBe(false);
    });
  });

  describe('extractPlaceholders', () => {
    it('should extract time placeholders with modifiers', () => {
      const text = 'Time: <<time^>>';
      const placeholders = parser.extractPlaceholders(text);

      expect(placeholders).toHaveLength(1);
      expect(placeholders[0].type).toBe('time');
      expect(placeholders[0].match).toBe('<<time^>>');
      expect(placeholders[0].modifiers).toBe('^');
    });

    it('should extract start/end placeholders', () => {
      const text = 'Session: <<start>> - <<end>>';
      const placeholders = parser.extractPlaceholders(text);

      expect(placeholders).toHaveLength(2);
      expect(placeholders[0].type).toBe('start');
      expect(placeholders[1].type).toBe('end');
    });

    it('should extract timer placeholders (short format)', () => {
      const text = 'Timer: <<5:00->>';
      const placeholders = parser.extractPlaceholders(text);

      expect(placeholders).toHaveLength(1);
      expect(placeholders[0].type).toBe('timer');
      expect(placeholders[0].values.hours).toBe(0);
      expect(placeholders[0].values.minutes).toBe(5);
      expect(placeholders[0].values.seconds).toBe(0);
      expect(placeholders[0].values.direction).toBe('-');
    });

    it('should extract timer placeholders (long format)', () => {
      const text = 'Timer: <<1:30:00+>>';
      const placeholders = parser.extractPlaceholders(text);

      expect(placeholders).toHaveLength(1);
      expect(placeholders[0].type).toBe('timer');
      expect(placeholders[0].values.hours).toBe(1);
      expect(placeholders[0].values.minutes).toBe(30);
      expect(placeholders[0].values.seconds).toBe(0);
      expect(placeholders[0].values.direction).toBe('+');
    });

    it('should extract date placeholders', () => {
      const text = 'Date: <<date>> Another: <<date>>';
      const placeholders = parser.extractPlaceholders(text);

      const dateCount = placeholders.filter(p => p.type === 'date').length;
      expect(dateCount).toBe(2);
    });

    it('should extract all placeholder types', () => {
      const text = `
        <<time>>
        <<start>> <<end>>
        <<status>> <<elapsed>> <<remaining>> <<duration>>
        <<5:00->>
        <<date>>
      `;
      const placeholders = parser.extractPlaceholders(text);

      expect(placeholders.length).toBeGreaterThan(5);
    });

    it('should extract multiple modifiers', () => {
      const text = '<<time^&>>';
      const placeholders = parser.extractPlaceholders(text);

      expect(placeholders[0].modifiers).toBe('^&');
    });
  });

  describe('analyzePlaceholders', () => {
    it('should categorize placeholders', () => {
      const text = `
        <<time>>
        <<start>> <<end>> <<status>>
        <<5:00->> <<10:00+>>
        <<date>> <<longdate>>
      `;
      const analysis = parser.analyzePlaceholders(text);

      expect(analysis.total).toBeGreaterThan(5);
      expect(analysis.categories.time).toBe(1);
      expect(analysis.categories.timeRange).toBe(3); // start, end, status
      expect(analysis.categories.timer).toBe(2); // 2 timers
      expect(analysis.categories.date).toBe(2); // 2 date formats
    });

    it('should count all placeholders', () => {
      const text = '<<time>> <<date>> <<start>>';
      const analysis = parser.analyzePlaceholders(text);

      expect(analysis.total).toBe(3);
    });

    it('should handle empty text', () => {
      const analysis = parser.analyzePlaceholders('No placeholders');

      expect(analysis.total).toBe(0);
      expect(analysis.categories.time).toBe(0);
      expect(analysis.categories.timeRange).toBe(0);
      expect(analysis.categories.timer).toBe(0);
      expect(analysis.categories.date).toBe(0);
    });

    it('should include detailed placeholder list', () => {
      const text = '<<time^>> <<5:00->>';
      const analysis = parser.analyzePlaceholders(text);

      expect(analysis.placeholders).toHaveLength(2);
      expect(analysis.placeholders[0]).toHaveProperty('type');
      expect(analysis.placeholders[0]).toHaveProperty('match');
    });
  });
});
