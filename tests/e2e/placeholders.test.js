/**
 * Placeholder E2E Tests
 * @jest-environment node
 */

const path = require('path');
const { setupBrowser, sleep } = require('./setup');

let browser;
let extensionId;

beforeEach(async () => {
  const setup = await setupBrowser();
  browser = setup.browser;
  extensionId = setup.extensionId;
}, 30000);

afterEach(async () => {
  // Close all pages
  const pages = await browser.pages();
  await Promise.all(pages.map(page => page.close()));

  await browser.close();
  browser = undefined;
});

test('should load mock slides page with correct structure', async () => {
  // Navigate to mock slides HTML
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const page = await browser.newPage();

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Check that Google Slides presentation mode structure exists
  const hasPresentMode = await page.evaluate(() => {
    return document.body.classList.contains('punch-present-mode');
  });

  const hasViewerContent = await page.evaluate(() => {
    return !!document.querySelector('.punch-viewer-content');
  });

  expect(hasPresentMode).toBe(true);
  expect(hasViewerContent).toBe(true);
});

test('should replace countdown timer placeholder', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Mock Chrome APIs and URL before loading the page
  await page.evaluateOnNewDocument(() => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => { callback({}); },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    // Mock location to look like Google Slides presentation mode
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add countdown timer placeholder dynamically
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-countdown';
    div.textContent = 'Countdown: <<5:00->>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Listen to console messages for debugging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  // Get initial text (should have placeholder)
  const initialText = await page.evaluate(() => document.body.textContent);
  expect(initialText).toContain('<<5:00->>');

  // Inject extension scripts (in order, matching manifest.json)
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension (bypass presentation mode check for testing)
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      // Extension exists but stopped - force it to start
      window.slidesTimerExtension.startReplacements();
    }
  });

  // Wait for extension to process placeholders
  await sleep(2000);

  // Get updated text from our specific div
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-countdown').textContent;
  });

  // Original placeholder should be gone
  expect(updatedText).not.toContain('<<5:00->>');

  // Should contain a time format (M:SS or MM:SS)
  expect(updatedText).toMatch(/\d+:\d{2}/);
});

test('should replace countup timer placeholder', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Mock Chrome APIs and URL
  await page.evaluateOnNewDocument(() => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => { callback({}); },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add countup timer placeholder dynamically
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-countup';
    div.textContent = 'Countup: <<2:00+>>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Get initial text
  const initialText = await page.evaluate(() => document.body.textContent);
  expect(initialText).toContain('<<2:00+>>');

  // Inject extension scripts
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      window.slidesTimerExtension.startReplacements();
    }
  });

  await sleep(2000);

  // Get updated text from our specific div
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-countup').textContent;
  });

  // Original placeholder should be gone
  expect(updatedText).not.toContain('<<2:00+>>');

  // Should contain a time format
  expect(updatedText).toMatch(/\d+:\d{2}/);
});

test('countdown timer should decrement over time', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Mock Chrome APIs and URL
  await page.evaluateOnNewDocument(() => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => { callback({}); },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add countdown timer placeholder dynamically
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-timer-decrement';
    div.textContent = 'Timer: <<5:00->>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Inject extension scripts
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      window.slidesTimerExtension.startReplacements();
    }
  });

  await sleep(1000);

  // Get initial timer value from our specific div
  const initialText = await page.evaluate(() => {
    return document.querySelector('.test-timer-decrement').textContent;
  });
  const initialMatch = initialText.match(/(\d+):(\d{2})/);
  const initialMinutes = parseInt(initialMatch[1]);
  const initialSeconds = parseInt(initialMatch[2]);
  const initialTotal = initialMinutes * 60 + initialSeconds;

  // Wait 3 seconds
  await sleep(3000);

  // Get updated timer value from our specific div
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-timer-decrement').textContent;
  });
  const updatedMatch = updatedText.match(/(\d+):(\d{2})/);
  const updatedMinutes = parseInt(updatedMatch[1]);
  const updatedSeconds = parseInt(updatedMatch[2]);
  const updatedTotal = updatedMinutes * 60 + updatedSeconds;

  // Timer should have decreased by approximately 3 seconds
  expect(updatedTotal).toBeLessThan(initialTotal);
  expect(initialTotal - updatedTotal).toBeGreaterThanOrEqual(2); // At least 2 seconds (allowing for timing variations)
});

test('should replace time placeholders', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Mock Chrome APIs and URL
  await page.evaluateOnNewDocument(() => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => { callback({}); },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  // Add time placeholder to page
  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add time placeholder dynamically
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-time';
    div.textContent = 'Time: <<time>>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Inject extension scripts
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      window.slidesTimerExtension.startReplacements();
    }
  });

  await sleep(2000);

  // Get updated text
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-time').textContent;
  });

  // Original placeholder should be gone
  expect(updatedText).not.toContain('<<time>>');

  // Should contain time format with AM/PM (e.g., "2:30:45 PM")
  expect(updatedText).toMatch(/\d{1,2}:\d{2}:\d{2} (AM|PM)/);
});

test('should replace date placeholders', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Mock Chrome APIs and URL
  await page.evaluateOnNewDocument(() => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => { callback({}); },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add date placeholders dynamically
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-dates';
    div.textContent = 'Date: <<date>> | Short: <<shortdate>> | Long: <<longdate>>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Inject extension scripts
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      window.slidesTimerExtension.startReplacements();
    }
  });

  await sleep(2000);

  // Get updated text
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-dates').textContent;
  });

  // Original placeholders should be gone
  expect(updatedText).not.toContain('<<date>>');
  expect(updatedText).not.toContain('<<shortdate>>');
  expect(updatedText).not.toContain('<<longdate>>');

  // Should contain date formats
  // Date: MM/DD/YYYY
  expect(updatedText).toMatch(/Date: \d{2}\/\d{2}\/\d{4}/);
  // Short: MM/DD/YY
  expect(updatedText).toMatch(/Short: \d{2}\/\d{2}\/\d{2}/);
  // Long: Month DD, YYYY
  expect(updatedText).toMatch(/Long: \w+ \d{1,2}, \d{4}/);
});

test('should apply format modifiers to time placeholders', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Mock Chrome APIs and URL
  await page.evaluateOnNewDocument(() => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => { callback({}); },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  });

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add time placeholders with modifiers
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-modifiers';
    div.textContent = 'NoSec: <<time^>> | 24h: <<time&>> | Both: <<time^&>>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Inject extension scripts
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      window.slidesTimerExtension.startReplacements();
    }
  });

  await sleep(2000);

  // Get updated text
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-modifiers').textContent;
  });

  // Original placeholders should be gone
  expect(updatedText).not.toContain('<<time^>>');
  expect(updatedText).not.toContain('<<time&>>');
  expect(updatedText).not.toContain('<<time^&>>');

  // NoSec: Should have time without seconds (H:MM AM/PM)
  expect(updatedText).toMatch(/NoSec: \d{1,2}:\d{2} (AM|PM)/);

  // 24h: Should have 24-hour format with seconds (HH:MM:SS)
  expect(updatedText).toMatch(/24h: \d{2}:\d{2}:\d{2}/);

  // Both: Should have 24-hour without seconds (HH:MM)
  expect(updatedText).toMatch(/Both: \d{2}:\d{2}(?!\d)/);
});

test('should replace session tracking placeholders', async () => {
  const mockSlidesPath = `file://${path.resolve(__dirname, '../fixtures/mock-slides.html')}`;
  const extensionPath = path.resolve(__dirname, '../../');
  const page = await browser.newPage();

  // Set up session times (2 hours from now to 4 hours from now)
  const now = new Date();
  const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);   // 4 hours from now

  // Mock Chrome APIs with session times
  await page.evaluateOnNewDocument((start, end) => {
    window.chrome = {
      runtime: { id: 'test-extension-id' },
      storage: {
        local: {
          get: (keys, callback) => {
            callback({
              startTime: start,
              endTime: end
            });
          },
          set: (items, callback) => { if (callback) callback(); }
        }
      },
      i18n: { getUILanguage: () => 'en' }
    };

    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://docs.google.com/presentation/d/test123/present',
        hostname: 'docs.google.com',
        pathname: '/presentation/d/test123/present',
        search: '',
        hash: ''
      },
      writable: true
    });
  }, startTime.toISOString().slice(0, 19), endTime.toISOString().slice(0, 19));

  await page.goto(mockSlidesPath);
  await page.waitForSelector('body');

  // Add session placeholders
  await page.evaluate(() => {
    const div = document.createElement('div');
    div.className = 'test-session';
    div.textContent = 'Status: <<status>> | Duration: <<duration>> | Remaining: <<remaining>>';
    document.querySelector('.punch-viewer-content').appendChild(div);
  });

  // Inject extension scripts
  const scriptsToInject = [
    'src/constants/SessionStatus.js',
    'src/constants/Locale.js',
    'src/services/PresentationModeDetector.js',
    'src/services/StorageService.js',
    'src/services/PlaceholderParser.js',
    'src/services/TimeFormatter.js',
    'src/services/TimerManager.js',
    'src/services/SessionStatusCalculator.js',
    'src/services/TranslationService.js',
    'src/services/StatusFormatter.js',
    'src/services/PlaceholderReplacer.js',
    'src/services/DOMNodeTracker.js',
    'src/utils/LanguageDetector.js',
    'src/SlidesTimerExtension.js',
    'content.js'
  ];

  for (const script of scriptsToInject) {
    await page.addScriptTag({ path: path.join(extensionPath, script) });
  }

  // Manually start the extension
  await page.evaluate(() => {
    if (window.slidesTimerExtension) {
      window.slidesTimerExtension.startReplacements();
    }
  });

  await sleep(2000);

  // Get updated text
  const updatedText = await page.evaluate(() => {
    return document.querySelector('.test-session').textContent;
  });

  // Original placeholders should be gone
  expect(updatedText).not.toContain('<<status>>');
  expect(updatedText).not.toContain('<<duration>>');
  expect(updatedText).not.toContain('<<remaining>>');

  // Should show "Not started yet" (since session is in the future)
  expect(updatedText).toContain('Not started yet');

  // Should show duration (2 hours = 2:00:00)
  expect(updatedText).toContain('2:00:00');

  // Should show remaining time (approximately 2 hours)
  expect(updatedText).toMatch(/Remaining: 1:\d{2}:\d{2}|2:00:00/);
});
