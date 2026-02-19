const StorageService = require('../../src/services/StorageService');

describe('StorageService', () => {
  let storageService;
  let mockStorage;

  beforeEach(() => {
    // Create mock storage implementation
    mockStorage = {
      data: {},
      get: jest.fn((keys, callback) => {
        const result = {};
        keys.forEach(key => {
          if (mockStorage.data[key]) {
            result[key] = mockStorage.data[key];
          }
        });
        callback(result);
      }),
      set: jest.fn((items, callback) => {
        Object.assign(mockStorage.data, items);
        if (callback) callback();
      }),
      remove: jest.fn((keys, callback) => {
        keys.forEach(key => {
          delete mockStorage.data[key];
        });
        if (callback) callback();
      })
    };

    storageService = new StorageService(mockStorage);
  });

  describe('getTimes', () => {
    it('should retrieve stored times', async () => {
      mockStorage.data = {
        startTime: '14:00',
        endTime: '16:00'
      };

      const times = await storageService.getTimes();

      expect(times).toEqual({
        startTime: '14:00',
        endTime: '16:00'
      });
      expect(mockStorage.get).toHaveBeenCalledWith(['startTime', 'endTime'], expect.any(Function));
    });

    it('should return null for missing times', async () => {
      mockStorage.data = {};

      const times = await storageService.getTimes();

      expect(times).toEqual({
        startTime: null,
        endTime: null
      });
    });

    it('should return partial times if only one is set', async () => {
      mockStorage.data = {
        startTime: '14:00'
      };

      const times = await storageService.getTimes();

      expect(times).toEqual({
        startTime: '14:00',
        endTime: null
      });
    });
  });

  describe('saveTimes', () => {
    it('should save both times', async () => {
      await storageService.saveTimes('14:00', '16:00');

      expect(mockStorage.set).toHaveBeenCalledWith({
        startTime: '14:00',
        endTime: '16:00'
      }, expect.any(Function));

      expect(mockStorage.data).toEqual({
        startTime: '14:00',
        endTime: '16:00'
      });
    });

    it('should work when callback is provided to set', async () => {
      mockStorage.set = jest.fn((items, callback) => {
        Object.assign(mockStorage.data, items);
        if (callback) callback();
      });

      await storageService.saveTimes('14:00', '16:00');

      expect(mockStorage.data).toEqual({
        startTime: '14:00',
        endTime: '16:00'
      });
    });

    it('should overwrite existing times', async () => {
      mockStorage.data = {
        startTime: '10:00',
        endTime: '12:00'
      };

      await storageService.saveTimes('14:00', '16:00');

      expect(mockStorage.data).toEqual({
        startTime: '14:00',
        endTime: '16:00'
      });
    });
  });

  describe('clearTimes', () => {
    it('should remove both times', async () => {
      mockStorage.data = {
        startTime: '14:00',
        endTime: '16:00',
        otherData: 'should remain'
      };

      await storageService.clearTimes();

      expect(mockStorage.remove).toHaveBeenCalledWith(['startTime', 'endTime'], expect.any(Function));

      expect(mockStorage.data).toEqual({
        otherData: 'should remain'
      });
    });

    it('should work even if times not set', async () => {
      mockStorage.data = {};

      await storageService.clearTimes();

      expect(mockStorage.data).toEqual({});
    });
  });

  describe('getLanguage', () => {
    it('should retrieve stored language preference', async () => {
      mockStorage.data = {
        language: 'es'
      };

      const language = await storageService.getLanguage();

      expect(language).toBe('es');
      expect(mockStorage.get).toHaveBeenCalledWith(['language'], expect.any(Function));
    });

    it('should return null if no language preference is set', async () => {
      mockStorage.data = {};

      const language = await storageService.getLanguage();

      expect(language).toBeNull();
    });

    it('should return auto if set to auto', async () => {
      mockStorage.data = {
        language: 'auto'
      };

      const language = await storageService.getLanguage();

      expect(language).toBe('auto');
    });
  });

  describe('saveLanguage', () => {
    it('should save language preference', async () => {
      await storageService.saveLanguage('es');

      expect(mockStorage.set).toHaveBeenCalledWith({ language: 'es' }, expect.any(Function));
      expect(mockStorage.data).toEqual({
        language: 'es'
      });
    });

    it('should save auto preference', async () => {
      await storageService.saveLanguage('auto');

      expect(mockStorage.data).toEqual({
        language: 'auto'
      });
    });

    it('should overwrite existing language preference', async () => {
      mockStorage.data = {
        language: 'en'
      };

      await storageService.saveLanguage('es');

      expect(mockStorage.data).toEqual({
        language: 'es'
      });
    });
  });
});
