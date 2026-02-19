const Locale = require('../../src/constants/Locale');

describe('Locale Constants', () => {
  it('should have EN constant', () => {
    expect(Locale.EN).toBe('en');
  });

  it('should have ES constant', () => {
    expect(Locale.ES).toBe('es');
  });

  it('should be frozen (immutable)', () => {
    expect(Object.isFrozen(Locale)).toBe(true);
  });

  it('should not allow modifications', () => {
    expect(() => {
      Locale.NEW_LOCALE = 'fr';
    }).not.toThrow();
    expect(Locale.NEW_LOCALE).toBeUndefined();
  });
});
