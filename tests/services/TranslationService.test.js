const TranslationService = require('../../src/services/TranslationService');
const Locale = require('../../src/constants/Locale');

describe('TranslationService', () => {
  let service;

  beforeEach(() => {
    service = new TranslationService();
  });

  describe('constructor', () => {
    it('should default to English locale', () => {
      expect(service.getLocale()).toBe(Locale.EN);
    });

    it('should accept custom locale', () => {
      const spanishService = new TranslationService(Locale.ES);
      expect(spanishService.getLocale()).toBe(Locale.ES);
    });

    it('should fallback to English for unsupported locale', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const unsupportedService = new TranslationService('fr');
      expect(unsupportedService.getLocale()).toBe(Locale.EN);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getLocale', () => {
    it('should return current locale', () => {
      expect(service.getLocale()).toBe(Locale.EN);
    });
  });

  describe('setLocale', () => {
    it('should change locale', () => {
      service.setLocale(Locale.ES);
      expect(service.getLocale()).toBe(Locale.ES);
    });

    it('should validate and fallback for unsupported locale', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      service.setLocale('fr');
      expect(service.getLocale()).toBe(Locale.EN);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('translate', () => {
    it('should translate valid key in English', () => {
      expect(service.translate('NOT_STARTED')).toBe('Not started yet');
      expect(service.translate('IN_PROGRESS')).toBe('In progress');
      expect(service.translate('FINISHED')).toBe('Finished');
    });

    it('should translate valid key in Spanish', () => {
      service.setLocale(Locale.ES);
      expect(service.translate('NOT_STARTED')).toBe('Aún no ha comenzado');
      expect(service.translate('IN_PROGRESS')).toBe('En progreso');
      expect(service.translate('FINISHED')).toBe('Finalizado');
    });

    it('should return key when translation not found', () => {
      expect(service.translate('UNKNOWN_KEY')).toBe('UNKNOWN_KEY');
    });

    it('should return empty string for null key', () => {
      expect(service.translate(null)).toBe('');
    });

    it('should return empty string for empty key', () => {
      expect(service.translate('')).toBe('');
    });

    it('should fallback to English for missing translation', () => {
      service.setLocale(Locale.ES);
      // Add a key that exists in English but not Spanish
      service.translations[Locale.EN].NEW_KEY = 'New English Text';
      expect(service.translate('NEW_KEY')).toBe('New English Text');
    });

    it('should translate month names in English', () => {
      expect(service.translate('MONTH_JAN')).toBe('Jan');
      expect(service.translate('MONTH_FEB')).toBe('Feb');
      expect(service.translate('MONTH_DEC')).toBe('Dec');
    });

    it('should translate month names in Spanish', () => {
      service.setLocale(Locale.ES);
      expect(service.translate('MONTH_JAN')).toBe('Ene');
      expect(service.translate('MONTH_APR')).toBe('Abr');
      expect(service.translate('MONTH_AUG')).toBe('Ago');
      expect(service.translate('MONTH_DEC')).toBe('Dic');
    });

    it('should translate full month names in English', () => {
      expect(service.translate('MONTH_LONG_JAN')).toBe('January');
      expect(service.translate('MONTH_LONG_FEB')).toBe('February');
      expect(service.translate('MONTH_LONG_DEC')).toBe('December');
    });

    it('should translate full month names in Spanish', () => {
      service.setLocale(Locale.ES);
      expect(service.translate('MONTH_LONG_JAN')).toBe('Enero');
      expect(service.translate('MONTH_LONG_APR')).toBe('Abril');
      expect(service.translate('MONTH_LONG_AUG')).toBe('Agosto');
      expect(service.translate('MONTH_LONG_DEC')).toBe('Diciembre');
    });
  });

  describe('hasLocale', () => {
    it('should return true for supported locales', () => {
      expect(service.hasLocale(Locale.EN)).toBe(true);
      expect(service.hasLocale(Locale.ES)).toBe(true);
    });

    it('should return false for unsupported locales', () => {
      expect(service.hasLocale('fr')).toBe(false);
      expect(service.hasLocale('de')).toBe(false);
    });
  });

  describe('getSupportedLocales', () => {
    it('should return array of supported locales', () => {
      const locales = service.getSupportedLocales();
      expect(locales).toContain(Locale.EN);
      expect(locales).toContain(Locale.ES);
      expect(locales.length).toBe(2);
    });
  });
});
