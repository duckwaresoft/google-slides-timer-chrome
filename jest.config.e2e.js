/**
 * Jest configuration for E2E tests
 *
 * Differences from unit tests:
 * - Longer timeouts (browser operations take time)
 * - No coverage collection (E2E tests run in browser, not Node)
 * - Only runs tests in tests/e2e directory
 */

module.exports = {
  // Test environment
  testEnvironment: 'node', // E2E tests run Puppeteer in Node

  // Test pattern - only E2E tests
  testMatch: ['**/tests/e2e/**/*.test.js'],

  // Longer timeouts for browser operations
  testTimeout: 30000, // 30 seconds per test

  // No coverage collection for E2E tests
  collectCoverage: false,

  // Verbose output
  verbose: true,

  // Setup files
  // setupFilesAfterEnv: ['<rootDir>/tests/e2e/jest.setup.js'], // Optional

  // Bail on first failure (optional - speeds up feedback)
  // bail: true,
};
