/**
 * Popup E2E Tests
 * @jest-environment node
 */

const { setupBrowser, sleep } = require('./setup');

let browser;
let extensionId;

beforeEach(async () => {
  const setup = await setupBrowser();
  browser = setup.browser;
  extensionId = setup.extensionId;

  // Clear extension storage before each test
  const popup = await browser.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await popup.evaluate(() => {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  });
  await popup.close();
}, 30000);

afterEach(async () => {
  // Close all pages
  const pages = await browser.pages();
  await Promise.all(pages.map(page => page.close()));

  await browser.close();
  browser = undefined;
});

test('popup renders correctly', async () => {
  // Navigate directly to the extension popup
  const popup = await browser.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);

  // Wait for popup to load
  await popup.waitForSelector('body');

  // Check for key UI elements
  const bodyElement = await popup.$('body');
  const languageSelect = await popup.$('#languageSelect');
  const startTimeInput = await popup.$('#startTime');
  const endTimeInput = await popup.$('#endTime');
  const setTimesBtn = await popup.$('#setTimes');
  const clearTimesBtn = await popup.$('#clearTimes');

  expect(bodyElement).not.toBeNull();
  expect(languageSelect).not.toBeNull();
  expect(startTimeInput).not.toBeNull();
  expect(endTimeInput).not.toBeNull();
  expect(setTimesBtn).not.toBeNull();
  expect(clearTimesBtn).not.toBeNull();
});

test('should change language to Spanish', async () => {
  // Navigate to popup
  const popup = await browser.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);

  // Wait for language selector
  await popup.waitForSelector('#languageSelect');

  // Select Spanish
  await popup.select('#languageSelect', 'es');

  // Wait for storage to update (increased wait for reliability)
  await sleep(2000);

  // Verify language was saved in storage
  const storage = await popup.evaluate(() => {
    return new Promise((resolve) => {
      chrome.storage.local.get('language', resolve);
    });
  });

  expect(storage.language).toBe('es');
});

test('should set start and end times', async () => {
  // Navigate to popup
  const popup = await browser.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);

  // Wait for time inputs
  await popup.waitForSelector('#startTime');
  await popup.waitForSelector('#endTime');

  // Fill in times (use evaluate to set value directly, avoiding type() bug with datetime inputs)
  await popup.evaluate(() => {
    document.getElementById('startTime').value = '2026-02-20T14:00';
    document.getElementById('endTime').value = '2026-02-20T16:00';
  });

  // Click set times button
  await popup.click('#setTimes');

  // Wait longer for storage to update
  await sleep(2000);

  // Verify times were saved
  const storage = await popup.evaluate(() => {
    return new Promise((resolve) => {
      chrome.storage.local.get(['startTime', 'endTime'], resolve);
    });
  });

  expect(storage.startTime).toBe('2026-02-20T14:00:00');
  expect(storage.endTime).toBe('2026-02-20T16:00:00');
});
