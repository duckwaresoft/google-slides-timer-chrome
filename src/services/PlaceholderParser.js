/**
 * Placeholder Parser Service
 *
 * Responsibility: Parse and extract placeholders from text
 * Single Responsibility Principle: Only handles placeholder parsing
 * Open/Closed Principle: Can be extended with new placeholder types
 */
class PlaceholderParser {
  constructor() {
    // Define placeholder patterns
    this.patterns = {
      time: /<<time([&^]*)>>/gi,
      start: /<<start([&^]*)>>/gi,
      end: /<<end([&^]*)>>/gi,
      startTime: /<<startTime([&^]*)>>/gi,
      endTime: /<<endTime([&^]*)>>/gi,
      startDate: /<<startDate>>/gi,
      endDate: /<<endDate>>/gi,
      startShortDate: /<<startShortDate>>/gi,
      endShortDate: /<<endShortDate>>/gi,
      startLongDate: /<<startLongDate>>/gi,
      endLongDate: /<<endLongDate>>/gi,
      status: /<<status>>/gi,
      elapsed: /<<elapsed>>/gi,
      remaining: /<<remaining>>/gi,
      duration: /<<duration>>/gi,
      date: /<<date>>/gi,
      shortDate: /<<shortdate>>/gi,
      longDate: /<<longdate>>/gi,
      timerLong: /<<(\d+):(\d+):(\d+)([-+])>>/g,
      timerShort: /<<(\d+):(\d+)([-+])>>/g
    };
  }

  /**
   * Check if text contains any placeholders
   * @param {string} text - Text to check
   * @returns {boolean}
   */
  hasPlaceholders(text) {
    return /<<[^>]+>>/.test(text);
  }

  /**
   * Extract all placeholders from text
   * @param {string} text - Text to parse
   * @returns {Array<{type: string, match: string, modifiers?: string, values?: Object}>}
   */
  extractPlaceholders(text) {
    const placeholders = [];

    // Time placeholders with modifiers
    let match;
    this.patterns.time.lastIndex = 0;
    while ((match = this.patterns.time.exec(text)) !== null) {
      placeholders.push({
        type: 'time',
        match: match[0],
        modifiers: match[1]
      });
    }

    // Start/End with modifiers
    this.patterns.start.lastIndex = 0;
    while ((match = this.patterns.start.exec(text)) !== null) {
      placeholders.push({
        type: 'start',
        match: match[0],
        modifiers: match[1]
      });
    }

    this.patterns.end.lastIndex = 0;
    while ((match = this.patterns.end.exec(text)) !== null) {
      placeholders.push({
        type: 'end',
        match: match[0],
        modifiers: match[1]
      });
    }

    // Start/End Time with modifiers
    this.patterns.startTime.lastIndex = 0;
    while ((match = this.patterns.startTime.exec(text)) !== null) {
      placeholders.push({
        type: 'startTime',
        match: match[0],
        modifiers: match[1]
      });
    }

    this.patterns.endTime.lastIndex = 0;
    while ((match = this.patterns.endTime.exec(text)) !== null) {
      placeholders.push({
        type: 'endTime',
        match: match[0],
        modifiers: match[1]
      });
    }

    // Timer placeholders (long format HH:MM:SS)
    this.patterns.timerLong.lastIndex = 0;
    while ((match = this.patterns.timerLong.exec(text)) !== null) {
      placeholders.push({
        type: 'timer',
        match: match[0],
        values: {
          hours: parseInt(match[1]),
          minutes: parseInt(match[2]),
          seconds: parseInt(match[3]),
          direction: match[4]
        }
      });
    }

    // Timer placeholders (short format MM:SS)
    this.patterns.timerShort.lastIndex = 0;
    while ((match = this.patterns.timerShort.exec(text)) !== null) {
      placeholders.push({
        type: 'timer',
        match: match[0],
        values: {
          hours: 0,
          minutes: parseInt(match[1]),
          seconds: parseInt(match[2]),
          direction: match[3]
        }
      });
    }

    // Simple placeholders
    const simplePlaceholders = [
      { key: 'status', type: 'status' },
      { key: 'elapsed', type: 'elapsed' },
      { key: 'remaining', type: 'remaining' },
      { key: 'duration', type: 'duration' },
      { key: 'date', type: 'date' },
      { key: 'shortDate', type: 'shortDate' },
      { key: 'longDate', type: 'longDate' },
      { key: 'startDate', type: 'startDate' },
      { key: 'endDate', type: 'endDate' },
      { key: 'startShortDate', type: 'startShortDate' },
      { key: 'endShortDate', type: 'endShortDate' },
      { key: 'startLongDate', type: 'startLongDate' },
      { key: 'endLongDate', type: 'endLongDate' }
    ];

    simplePlaceholders.forEach(({ key, type }) => {
      this.patterns[key].lastIndex = 0;
      while ((match = this.patterns[key].exec(text)) !== null) {
        placeholders.push({
          type,
          match: match[0]
        });
      }
    });

    return placeholders;
  }

  /**
   * Get placeholder categories
   * @param {string} text - Text to analyze
   * @returns {Object} Categories with counts
   */
  analyzePlaceholders(text) {
    const placeholders = this.extractPlaceholders(text);

    const categories = {
      time: 0,
      timeRange: 0,
      timer: 0,
      date: 0
    };

    placeholders.forEach(ph => {
      if (ph.type === 'time') categories.time++;
      if (['start', 'end', 'startTime', 'endTime', 'status', 'elapsed', 'remaining', 'duration'].includes(ph.type)) {
        categories.timeRange++;
      }
      if (ph.type === 'timer') categories.timer++;
      if (['date', 'shortDate', 'longDate', 'startDate', 'endDate', 'startShortDate', 'endShortDate', 'startLongDate', 'endLongDate'].includes(ph.type)) {
        categories.date++;
      }
    });

    return {
      total: placeholders.length,
      categories,
      placeholders
    };
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlaceholderParser;
}
