const SessionStatus = require('../../src/constants/SessionStatus');

describe('SessionStatus Constants', () => {
  it('should have NOT_STARTED constant', () => {
    expect(SessionStatus.NOT_STARTED).toBe('NOT_STARTED');
  });

  it('should have IN_PROGRESS constant', () => {
    expect(SessionStatus.IN_PROGRESS).toBe('IN_PROGRESS');
  });

  it('should have FINISHED constant', () => {
    expect(SessionStatus.FINISHED).toBe('FINISHED');
  });

  it('should be frozen (immutable)', () => {
    expect(Object.isFrozen(SessionStatus)).toBe(true);
  });

  it('should not allow modifications', () => {
    expect(() => {
      SessionStatus.NEW_VALUE = 'NEW';
    }).not.toThrow();
    expect(SessionStatus.NEW_VALUE).toBeUndefined();
  });
});
