const Locale = require('../../src/constants/Locale');
const LanguageDetector = require('../../src/utils/LanguageDetector');
const TranslationService = require('../../src/services/TranslationService');

describe('LanguageDetector', () => {
  let detector;
  let translationService;
  let mockChromeI18n;

  beforeEach(() => {
    translationService = new TranslationService(Locale.EN);
    mockChromeI18n = {
      getUILanguage: jest.fn()
    };
    detector = new LanguageDetector(mockChromeI18n, translationService);
  });

  describe('constructor', () => {
    it('should initialize with chrome i18n and translation service', () => {
      expect(detector.chromeI18n).toBe(mockChromeI18n);
      expect(detector.translationService).toBe(translationService);
    });

    it('should set default locale to en', () => {
      expect(detector.getDefaultLocale()).toBe(Locale.EN);
    });
  });

  describe('detectLocale', () => {
    it('should detect and return supported locale (en-US)', () => {
      mockChromeI18n.getUILanguage.mockReturnValue('en-US');
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should detect and return supported locale (es-ES)', () => {
      mockChromeI18n.getUILanguage.mockReturnValue('es-ES');
      expect(detector.detectLocale()).toBe(Locale.ES);
    });

    it('should detect and return supported locale (en-GB)', () => {
      mockChromeI18n.getUILanguage.mockReturnValue('en-GB');
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default for unsupported locale (fr-FR)', () => {
      mockChromeI18n.getUILanguage.mockReturnValue('fr-FR');
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default for unsupported locale (de-DE)', () => {
      mockChromeI18n.getUILanguage.mockReturnValue('de-DE');
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when chrome.i18n is null', () => {
      detector = new LanguageDetector(null, translationService);
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when chrome.i18n is undefined', () => {
      detector = new LanguageDetector(undefined, translationService);
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when getUILanguage is not a function', () => {
      detector = new LanguageDetector({}, translationService);
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when getUILanguage returns null', () => {
      mockChromeI18n.getUILanguage.mockReturnValue(null);
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when getUILanguage returns undefined', () => {
      mockChromeI18n.getUILanguage.mockReturnValue(undefined);
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when getUILanguage returns empty string', () => {
      mockChromeI18n.getUILanguage.mockReturnValue('');
      expect(detector.detectLocale()).toBe(Locale.EN);
    });

    it('should fallback to default when getUILanguage throws error', () => {
      mockChromeI18n.getUILanguage.mockImplementation(() => {
        throw new Error('Chrome API error');
      });
      expect(detector.detectLocale()).toBe(Locale.EN);
    });
  });

  describe('parseLanguageCode', () => {
    it('should parse en-US to en', () => {
      expect(detector.parseLanguageCode('en-US')).toBe(Locale.EN);
    });

    it('should parse es-ES to es', () => {
      expect(detector.parseLanguageCode('es-ES')).toBe(Locale.ES);
    });

    it('should return default locale for unsupported language (pt-BR)', () => {
      expect(detector.parseLanguageCode('pt-BR')).toBe(Locale.EN);
    });

    it('should return default locale for unsupported language (fr-FR)', () => {
      expect(detector.parseLanguageCode('fr-FR')).toBe(Locale.EN);
    });

    it('should parse en_US (underscore) to en', () => {
      expect(detector.parseLanguageCode('en_US')).toBe(Locale.EN);
    });

    it('should parse EN-US (uppercase) to en', () => {
      expect(detector.parseLanguageCode('EN-US')).toBe(Locale.EN);
    });

    it('should parse en (no region) to en', () => {
      expect(detector.parseLanguageCode('en')).toBe(Locale.EN);
    });

    it('should return default for null', () => {
      expect(detector.parseLanguageCode(null)).toBe(Locale.EN);
    });

    it('should return default for undefined', () => {
      expect(detector.parseLanguageCode(undefined)).toBe(Locale.EN);
    });

    it('should return default for empty string', () => {
      expect(detector.parseLanguageCode('')).toBe(Locale.EN);
    });

    it('should return default for non-string input (number)', () => {
      expect(detector.parseLanguageCode(123)).toBe(Locale.EN);
    });

    it('should return default for non-string input (object)', () => {
      expect(detector.parseLanguageCode({})).toBe(Locale.EN);
    });

    it('should return default for invalid format', () => {
      expect(detector.parseLanguageCode('invalid')).toBe(Locale.EN);
    });

    it('should return default for single character', () => {
      expect(detector.parseLanguageCode('x')).toBe(Locale.EN);
    });
  });

  describe('getDefaultLocale', () => {
    it('should return en as default locale', () => {
      expect(detector.getDefaultLocale()).toBe(Locale.EN);
    });
  });
});
