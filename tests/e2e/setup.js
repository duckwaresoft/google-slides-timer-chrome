/**
 * Shared E2E Test Setup
 * Common configuration for all E2E tests
 */

const puppeteer = require('puppeteer');
const path = require('path');

const EXTENSION_PATH = path.resolve(__dirname, '../../');

/**
 * Setup browser with extension loaded
 * @returns {Promise<{browser: Browser, extensionId: string}>}
 */
async function setupBrowser() {
  // Launch browser with extension
  const browser = await puppeteer.launch({
    headless: false,
    pipe: true,
    enableExtensions: [EXTENSION_PATH]
  });

  // Wait for service worker to load
  const workerTarget = await browser.waitForTarget(
    (target) =>
      target.type() === 'service_worker' &&
      target.url().endsWith('service-worker.js')
  );

  // Extract extension ID from service worker URL
  const serviceWorkerUrl = workerTarget.url();
  const match = serviceWorkerUrl.match(/chrome-extension:\/\/([a-z]+)\//);
  const extensionId = match[1];

  console.log('✓ Extension loaded with ID:', extensionId);

  return { browser, extensionId };
}

/**
 * Sleep helper
 * @param {number} ms - Milliseconds to wait
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  EXTENSION_PATH,
  setupBrowser,
  sleep,
};
