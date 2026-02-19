module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!node_modules/**',
    '!**/tests/**'
  ],
  coverageThreshold: {
    global: {
      branches: 92,
      functions: 98,
      lines: 99,
      statements: 99
    }
  }
};
