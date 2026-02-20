# E2E Tests for Google Slides Timer Chrome Extension

End-to-end tests using Puppeteer to validate the extension in a real Chrome browser.

## Overview

**What These Tests Do:**
- ✅ Test extension popup functionality (Phase 1)
- ✅ Test placeholder replacement on mock HTML (Phase 2)
- ❌ Do NOT increase code coverage (E2E tests run in browser, not Node)
- ❌ Do NOT run in CI/CD (require GUI browser)

**Purpose:**
- Integration validation
- User flow testing
- Catch browser-specific bugs

## Running Tests

### Run All E2E Tests
```bash
npm run test:e2e
```

### Run E2E Tests with Debug Mode (Slow Motion)
```bash
npm run test:e2e:debug
```

### Run Specific Test File
```bash
npm run test:e2e -- tests/e2e/popup.test.js
```

### Run All Tests (Unit + E2E)
```bash
npm run test:all
```

## Test Structure

```
tests/
├── e2e/
│   ├── README.md              # This file
│   ├── setup.js               # Puppeteer utilities
│   ├── popup.test.js          # Phase 1: Popup tests
│   └── placeholders.test.js   # Phase 2: Placeholder tests
└── fixtures/
    └── mock-slides.html       # Mock presentation for testing
```

## Phase 1: Popup Tests (`popup.test.js`)

Tests the extension popup UI:

**Language Selection:**
- Change language to Spanish
- Change language to English
- Persist language across reloads

**Session Time Setting:**
- Set start and end times
- Load existing times from storage
- Clear times

**UI Elements:**
- Verify all required elements are present

## Phase 2: Placeholder Tests (`placeholders.test.js`)

Tests placeholder replacement on mock HTML:

**Timer Placeholders:**
- Countdown timer replacement
- Countup timer replacement
- Timer decrements over time

**Time Placeholders:**
- Current time
- Time with format modifiers (^, &)

**Date Placeholders:**
- Date, short date, long date

**Session Placeholders:**
- Start, end, status (basic validation)

## How It Works

### 1. Browser Setup
```javascript
const browser = await setupBrowser();
```
- Launches Chrome with extension loaded
- Extension path: project root directory
- Runs in non-headless mode (required for extensions)

### 2. Extension ID Detection
```javascript
const extensionId = await getExtensionId(browser);
```
- Finds extension ID from service worker
- Used to navigate to extension pages

### 3. Popup Navigation
```javascript
await navigateToPopup(page, extensionId);
```
- Opens popup: `chrome-extension://{id}/popup.html`

### 4. Storage Interaction
```javascript
await setStorageData(page, { language: 'es' });
const data = await getStorageData(page, 'language');
```
- Read/write chrome.storage.local
- Test storage persistence

## Limitations

### ❌ Not Tested:
- Real Google Slides (requires authentication)
- Multiple tabs/windows
- Extension background scripts
- Cross-browser compatibility

### ✅ What We Test:
- Popup UI functionality
- Storage persistence
- Placeholder replacement logic
- Timer behavior on mock HTML

## Debugging

### Visual Debugging
```bash
# Slow down for visibility
SLOWMO=100 npm run test:e2e

# Or edit setup.js and set slowMo manually
```

### Screenshot on Failure
Add to test:
```javascript
test('should work', async () => {
  try {
    // test code
  } catch (error) {
    await page.screenshot({ path: 'error.png' });
    throw error;
  }
});
```

### Console Logs
```javascript
page.on('console', msg => console.log('PAGE LOG:', msg.text()));
```

## CI/CD Integration

**Current Status:** E2E tests run locally only.

**Why not in CI/CD:**
- ✅ Unit tests run in GitHub Actions (fast, reliable)
- ❌ E2E tests require GUI browser (not available in CI)
- ❌ Would need Xvfb setup (complex)
- ❌ Slower and more flaky

**If you want to add E2E to CI/CD:**
1. Create separate workflow file
2. Use Xvfb for headless display
3. Make it optional (don't block merges)
4. Run on-demand only

## Tips

1. **Keep tests fast**: E2E tests are slow, avoid unnecessary waits
2. **Clean state**: Clear storage between tests
3. **Stable selectors**: Use IDs over class names
4. **Timeouts**: Increase for slow operations
5. **Isolation**: Each test should be independent

## Troubleshooting

### Extension Not Loading
```
Error: Extension not found
```
**Fix:** Make sure manifest.json is valid and extension path is correct

### Tests Timing Out
```
Timeout - Async callback was not invoked within the 30000 ms timeout
```
**Fix:** Increase timeout in `jest.config.e2e.js` or specific test

### Element Not Found
```
Error: waiting for selector failed: timeout 30000ms exceeded
```
**Fix:**
- Check selector is correct
- Add longer wait time
- Verify element exists in popup.html

### Storage Not Persisting
**Fix:**
- Make sure to await storage operations
- Add `waitForTimeout` after storage calls
- Clear storage before each test

## Future Enhancements

**Potential additions:**
- [ ] Test with real Google Slides (requires auth solution)
- [ ] Multi-language UI verification
- [ ] Format modifier combinations
- [ ] Edge cases (invalid times, etc.)
- [ ] Performance benchmarks
- [ ] Cross-browser testing (if extension supports Firefox/Edge)

## Resources

- [Puppeteer Documentation](https://pptr.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Chrome Extension Testing](https://developer.chrome.com/docs/extensions/mv3/tut_testing/)
