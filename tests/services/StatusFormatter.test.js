const Locale = require('../../src/constants/Locale');
const StatusFormatter = require('../../src/services/StatusFormatter');
const TranslationService = require('../../src/services/TranslationService');

describe('StatusFormatter', () => {
  let formatter;
  let translationService;

  beforeEach(() => {
    translationService = new TranslationService(Locale.EN);
    formatter = new StatusFormatter(translationService);
  });

  describe('formatStatus', () => {
    it('should format NOT_STARTED status', () => {
      expect(formatter.formatStatus('NOT_STARTED')).toBe('Not started yet');
    });

    it('should format IN_PROGRESS status', () => {
      expect(formatter.formatStatus('IN_PROGRESS')).toBe('In progress');
    });

    it('should format FINISHED status', () => {
      expect(formatter.formatStatus('FINISHED')).toBe('Finished');
    });

    it('should return empty string for null status', () => {
      expect(formatter.formatStatus(null)).toBe('');
    });

    it('should return empty string for undefined status', () => {
      expect(formatter.formatStatus(undefined)).toBe('');
    });

    it('should return empty string for empty string status', () => {
      expect(formatter.formatStatus('')).toBe('');
    });

    it('should use TranslationService for formatting', () => {
      const spy = jest.spyOn(translationService, 'translate');
      formatter.formatStatus('IN_PROGRESS');
      expect(spy).toHaveBeenCalledWith('IN_PROGRESS');
      spy.mockRestore();
    });

    it('should respect locale changes', () => {
      translationService.setLocale(Locale.ES);
      expect(formatter.formatStatus('NOT_STARTED')).toBe('Aún no ha comenzado');
      expect(formatter.formatStatus('IN_PROGRESS')).toBe('En progreso');
      expect(formatter.formatStatus('FINISHED')).toBe('Finalizado');
    });
  });
});
