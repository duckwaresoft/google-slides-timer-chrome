# Slides Timer for Google Slides

**Complete Project Documentation for Claude AI**

## Project Overview

**What it is:** A Chrome extension that replaces placeholder text in Google Slides with real-time timer and time information during presentations.

**Inspiration:** Inspired by the "Slides Timer" Chrome extension.

**Key features:** Duration timers (`<<5:00->>`), session date+time tracking with multi-day support (`<<start>>`, `<<end>>`, `<<startDate>>`, `<<startTime>>`, etc.), ISO 8601 date format for timestamps, i18n support (English/Spanish), and format modifiers (`^` for no seconds, `&` for 24-hour format).

## Current Status

- ✅ Full functionality implemented with SOLID architecture
- ✅ All code follows SOLID principles (11 independent services)
- ✅ Comprehensive test suite: **254 tests passing**
- ✅ Test coverage: 99%+ on all services
- ✅ Format modifiers working (`^` and `&`)
- ✅ Full date+time support with ISO 8601 storage
- ✅ i18n support with auto-detected Chrome language (English, Spanish)
- ✅ Manual language selector in popup (overrides Chrome auto-detection)
- ✅ Granular date/time placeholders (<<startTime>>, <<startDate>>, etc.)
- ✅ ISO 8601 date format (YYYY-MM-DD) for consistent, unambiguous timestamps
- ✅ Clean codebase - monolithic code removed
- ✅ SOLID architecture active and wired to manifest

## Features

### 1. Duration Timer Placeholders (No setup required)

These work automatically when you enter presentation mode:

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<5:00->>` | Countdown from 5 minutes | `4:32` → `4:31` → ... → `0:00` |
| `<<2:00+>>` | Countup from 2 minutes | `2:00` → `2:01` → `2:02` → ... |
| `<<1:30:00->>` | Countdown from 1h 30m | `1:29:45` → `1:29:44` → ... |
| `<<time>>` | Current time (AM/PM) | `2:30:45 PM` |
| `<<date>>` | Current date | `02/18/2026` |
| `<<shortdate>>` | Short date | `02/18/26` |
| `<<longdate>>` | Long date | `February 18, 2026` |

### 2. Session Time Placeholders (Require setup)

User must set start/end date+times in extension popup (supports multi-day events):

#### Full Date+Time Display (ISO 8601 Date Format)
| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<start>>` | Start date+time (ISO format) | `2026-02-19 2:00:00 PM` |
| `<<end>>` | End date+time (ISO format) | `2026-02-20 4:00:00 PM` |
| `<<start^>>` | Start date+time, no seconds | `2026-02-19 2:00 PM` |
| `<<start&>>` | Start date+time, 24-hour | `2026-02-19 14:00:00` |

#### Granular Date/Time (full control)
| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<startTime>>` | Start time only | `2:00:00 PM` |
| `<<endTime>>` | End time only | `4:00:00 PM` |
| `<<startTime^>>` | Start time, no seconds | `2:00 PM` |
| `<<startTime&>>` | Start time, 24-hour | `14:00:00` |
| `<<startTime^&>>` | Start time, 24-hour, no seconds | `14:00` |
| `<<startDate>>` | Start date (standard) | `02/18/2026` |
| `<<endDate>>` | End date (standard) | `02/20/2026` |
| `<<startShortDate>>` | Start date (short) | `02/18/26` |
| `<<endShortDate>>` | End date (short) | `02/20/26` |
| `<<startLongDate>>` | Start date (full, localized) | `February 18, 2026` (EN) or `Febrero 18, 2026` (ES) |
| `<<endLongDate>>` | End date (full, localized) | `February 20, 2026` (EN) or `Febrero 20, 2026` (ES) |

#### Session Info
| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<duration>>` | Total session duration | `2:00:00` |
| `<<elapsed>>` | Time since start | `0:30:45` |
| `<<remaining>>` | Time until end | `1:29:15` |
| `<<status>>` | Session status (localized) | `In progress` (EN) or `En progreso` (ES) |

**Status values (i18n):**
- `Not started yet` / `Aún no ha comenzado` - current time < start time
- `In progress` / `En progreso` - start time ≤ current time ≤ end time
- `Finished` / `Finalizado` - current time > end time

**Smart behavior:**
- Before start: `<<elapsed>>` = `0:00`, `<<remaining>>` = full duration
- During: `<<elapsed>>` = time since start, `<<remaining>>` = time until end
- After: `<<elapsed>>` = full duration, `<<remaining>>` = `0:00`

**Multi-day event example:**
```
Event Dates: <<startLongDate>> to <<endLongDate>>
Full Schedule: <<start^>> - <<end^>>
Daily Hours: <<startTime^>> - <<endTime^>>
Status: <<status>>
```
Output:
```
Event Dates: February 18, 2026 to February 20, 2026
Full Schedule: 2026-02-18 9:00 AM - 2026-02-20 5:00 PM
Daily Hours: 9:00 AM - 5:00 PM
Status: In progress
```

### 3. Format Modifiers

Add symbols after time placeholders to control format:

| Modifier | Effect | Example |
|----------|--------|---------|
| `^` | Remove seconds | `<<time^>>` → `2:30 PM` |
| `&` | 24-hour format | `<<time&>>` → `14:30:45` |
| `^&` or `&^` | Both (order doesn't matter) | `<<time^&>>` → `14:30` |

**Works with:** `<<time>>`, `<<start>>`, `<<end>>`, `<<startTime>>`, `<<endTime>>`

**Examples:**
```
<<time>>          → 2:30:45 PM
<<time^>>         → 2:30 PM
<<time&>>         → 14:30:45
<<time^&>>        → 14:30

<<start>>         → 2026-02-19 2:00:00 PM
<<start^>>        → 2026-02-19 2:00 PM
<<start&>>        → 2026-02-19 14:00:00
<<start&^>>       → 2026-02-19 14:00

<<startTime>>     → 2:00:00 PM (time only, no date)
<<startTime^>>    → 2:00 PM
<<startTime&>>    → 14:00:00
<<startTime^&>>   → 14:00

<<endTime^>>      → 4:00 PM
```

## File Structure

```
My extension/
├── manifest.json                    # Extension manifest (loads SOLID services)
├── content.js                       # ✅ ACTIVE: Entry point with dependency injection
├── service-worker.js                # Minimal service worker for extension lifecycle
├── popup.html                       # Extension popup UI
├── popup.js                         # Popup logic
├── styles.css                       # Popup styles
├── icon.svg                         # Icon source (vector)
├── icon16.png, icon48.png, icon128.png  # Extension icons (generated from SVG)
│
├── src/                             # ✅ SOLID architecture (ACTIVE)
│   ├── constants/                   # Constants and enums
│   │   ├── SessionStatus.js             # Session status enum (NOT_STARTED, IN_PROGRESS, FINISHED)
│   │   └── Locale.js                    # Locale enum (EN, ES)
│   ├── SlidesTimerExtension.js      # Main orchestrator class
│   └── services/
│       ├── PresentationModeDetector.js   # Detects presentation mode
│       ├── StorageService.js             # Chrome storage abstraction
│       ├── PlaceholderParser.js          # Parses placeholders from text
│       ├── TimeFormatter.js              # Formats times/dates
│       ├── TimerManager.js               # Manages countdown/countup timers
│       ├── SessionStatusCalculator.js    # Calculates session metrics (returns enums)
│       ├── TranslationService.js         # i18n translation service
│       ├── StatusFormatter.js            # Formats status enums to display text
│       ├── PlaceholderReplacer.js        # Replaces placeholders with values
│       └── DOMNodeTracker.js             # Tracks DOM nodes with placeholders
│   └── utils/
│       └── LanguageDetector.js          # Detects Chrome UI language for auto i18n
│
├── tests/                       # Test suite (265 tests: 254 unit + 11 E2E)
│   ├── constants/                   # Unit: Constant tests
│   │   ├── SessionStatus.test.js            # 5 tests
│   │   └── Locale.test.js                   # 4 tests
│   ├── SlidesTimerExtension.test.js         # 14 tests (main orchestrator)
│   ├── services/                    # Unit: Service tests
│   │   ├── DOMNodeTracker.test.js           # 13 tests
│   │   ├── PlaceholderParser.test.js        # 10 tests
│   │   ├── PlaceholderReplacer.test.js      # 31 tests
│   │   ├── PresentationModeDetector.test.js # 5 tests
│   │   ├── SessionStatusCalculator.test.js  # 20 tests
│   │   ├── StorageService.test.js           # 15 tests
│   │   ├── TimeFormatter.test.js            # 23 tests
│   │   ├── TimerManager.test.js             # 17 tests
│   │   ├── TranslationService.test.js       # 16 tests
│   │   └── StatusFormatter.test.js          # 8 tests
│   ├── utils/                       # Unit: Utility tests
│   │   └── LanguageDetector.test.js         # 29 tests
│   ├── e2e/                         # E2E: Browser tests
│   │   ├── setup.js                         # Shared Puppeteer configuration
│   │   ├── popup.test.js                    # 3 tests (popup functionality)
│   │   └── placeholders.test.js             # 8 tests (placeholder replacement)
│   └── fixtures/                    # Test fixtures
│       └── mock-slides.html                 # Minimal Google Slides structure
│
├── package.json                     # npm dependencies
├── jest.config.js                   # Jest configuration (unit tests)
├── jest.config.e2e.js               # Jest configuration (E2E tests)
├── node_modules/                    # Dependencies (gitignored)
├── coverage/                        # Test coverage reports (gitignored)
│
└── Documentation/
    ├── README.md                    # User-facing documentation
    ├── TESTING.md                   # Testing guide
    └── CLAUDE.md                    # This file
```

## Architecture

### SOLID Architecture (ACTIVE)

**Entry Point:** `content.js`
**Services:** `src/` directory

**11 independent services** following SOLID principles:

1. **PresentationModeDetector** - Detects if in presentation mode
2. **StorageService** - Abstracts Chrome storage
3. **PlaceholderParser** - Finds placeholders in text
4. **TimeFormatter** - Formats times and dates
5. **TimerManager** - Tracks timer states
6. **SessionStatusCalculator** - Calculates session info (returns enum values)
7. **PlaceholderReplacer** - Replaces placeholders with formatted values
8. **DOMNodeTracker** - Tracks DOM nodes
9. **TranslationService** - Handles i18n translations
10. **StatusFormatter** - Formats status enums to display text
11. **LanguageDetector** - Auto-detects Chrome UI language
12. **SlidesTimerExtension** - Orchestrates all services (main class)

**SOLID Principles:**
- **S**ingle Responsibility: Each class has one job
- **O**pen/Closed: Can extend without modifying
- **L**iskov Substitution: Services can be mocked/replaced
- **I**nterface Segregation: Clients use only what they need
- **D**ependency Inversion: Depends on abstractions, uses injection

**Benefits:**
- ✅ Each service independently testable
- ✅ Easy to mock for tests
- ✅ Clear separation of concerns
- ✅ Easy to extend (add new placeholder types, formats, languages, etc.)
- ✅ 99%+ test coverage on all services
- ✅ Clean, maintainable codebase
- ✅ Type-safe enum constants prevent typos
- ✅ i18n infrastructure ready for multiple languages

### Dual Environment Support (Browser & Node.js)

**Challenge:** Services and constants need to work in both environments:
- **Browser:** Loaded via `<script>` tags in HTML (globals available)
- **Node.js:** Loaded via `require()` for Jest testing

**❌ WRONG PATTERN (causes variable hoisting issues):**

```javascript
// ❌ BAD: This causes "ReferenceError: Locale is not defined" in browser
if (typeof Locale === 'undefined' && typeof require !== 'undefined') {
  var Locale = require('../constants/Locale');  // 'var' gets hoisted!
}
```

**Problem:** JavaScript hoists the `var Locale` declaration to the top of the file scope, which creates a local variable that shadows the global `Locale` object loaded via script tag in the browser. This causes "undefined" errors even though the global exists.

**✅ CORRECT PATTERN (avoids hoisting):**

```javascript
// ✅ GOOD: Check Node.js environment first, no 'var' keyword
if (typeof module !== 'undefined' && module.exports && typeof Locale === 'undefined') {
  Locale = require('../constants/Locale');  // Direct assignment, no hoisting
}
```

**Why this works:**
1. **Check Node.js first**: `typeof module !== 'undefined' && module.exports` is only true in Node.js
2. **No `var` keyword**: Without `var`, there's no local variable declaration to hoist
3. **Direct assignment**: In Node.js, this assigns to the global scope (or creates it)
4. **Browser safe**: In browser, the condition is false, so the global `Locale` remains untouched

**When to use this pattern:**
- ✅ **All enum/constant files** that are loaded globally in browser via `<script>` tags
- ✅ **All service files** that reference enums/constants
- ✅ Files in these locations:
  - `src/constants/*.js` (SessionStatus, Locale)
  - `src/services/*.js` (when they use enums)
  - `src/utils/*.js` (when they use enums)

**Example files using this pattern:**
```javascript
// src/constants/Locale.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EN: 'en', ES: 'es' };
}

// src/services/TranslationService.js
if (typeof module !== 'undefined' && module.exports && typeof Locale === 'undefined') {
  Locale = require('../constants/Locale');
}

// src/utils/LanguageDetector.js
if (typeof module !== 'undefined' && module.exports && typeof Locale === 'undefined') {
  Locale = require('../constants/Locale');
}
```

**Testing this pattern:**
```bash
# 1. Tests must pass (Node.js environment)
npm test  # All 248 tests should pass

# 2. Popup must load (Browser environment)
# - Open chrome://extensions/
# - Reload extension
# - Click extension icon
# - Check console for errors (should be none)
# - Verify text is populated (not empty)
```

**Historical context:**
This pattern was established in v1.6 (February 2026) when we encountered variable hoisting issues during popup loading. The error was: `Uncaught ReferenceError: Locale is not defined` even though `Locale` was loaded via script tag in popup.html. Removing the `var` keyword and checking for Node.js environment first resolved the issue.

## Testing

### Test Suite Status

```
✅ 265 tests passing (254 unit + 11 E2E)
✅ 16 test suites (14 unit + 2 E2E)
⏱️  Unit tests: ~2 seconds | E2E tests: ~30 seconds
✅ 99%+ coverage on all services
```

### Test Organization

Tests mirror the source structure (`src/` → `tests/`):

```
tests/ (265 tests total)
├── constants/                        # Unit tests
│   ├── SessionStatus.test.js (5 tests)
│   └── Locale.test.js (4 tests)
├── SlidesTimerExtension.test.js (14 tests)
├── services/                         # Unit tests
│   ├── DOMNodeTracker.test.js (13 tests)
│   ├── PlaceholderParser.test.js (10 tests)
│   ├── PlaceholderReplacer.test.js (31 tests)
│   ├── PresentationModeDetector.test.js (5 tests)
│   ├── SessionStatusCalculator.test.js (20 tests)
│   ├── StorageService.test.js (15 tests)
│   ├── TimeFormatter.test.js (23 tests)
│   ├── TimerManager.test.js (17 tests)
│   ├── TranslationService.test.js (16 tests)
│   └── StatusFormatter.test.js (8 tests)
├── utils/                            # Unit tests
│   └── LanguageDetector.test.js (29 tests)
├── e2e/                              # E2E tests
│   ├── setup.js                      # Shared Puppeteer setup
│   ├── popup.test.js (3 tests)       # Popup functionality
│   └── placeholders.test.js (8 tests) # Placeholder replacement
└── fixtures/                         # Test fixtures
    └── mock-slides.html              # Minimal Google Slides structure
```

### Running Tests

```bash
cd "/Users/apedrazainfante/Downloads/My extension"

# Run all tests (unit + E2E)
npm run test:all

# Run only unit tests (fast)
npm run test:unit

# Run only E2E tests (slower, opens browser)
npm run test:e2e

# Run with coverage report (unit tests only)
npm run test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html

# Watch mode (auto-run on file changes)
npm run test:watch

# Default (runs all tests)
npm test
```

### E2E Tests

**Purpose:** End-to-end tests using Puppeteer to verify the extension works in a real browser environment.

**What's tested:**
- **Popup functionality** (`popup.test.js`):
  - UI renders correctly
  - Language selection works
  - Session time configuration saves to storage
- **Placeholder replacement** (`placeholders.test.js`):
  - Mock Google Slides page structure
  - Countdown/countup timers (`<<5:00->>`, `<<2:00+>>`)
  - Time placeholders (`<<time>>`, `<<time^>>`, `<<time&>>`)
  - Date placeholders (`<<date>>`, `<<shortdate>>`, `<<longdate>>`)
  - Format modifiers work correctly
  - Session tracking (`<<status>>`, `<<remaining>>`, `<<duration>>`)
  - Timers decrement/increment over time

**Key patterns:**
- Uses Puppeteer with `enableExtensions` parameter
- Extracts extension ID from service worker URL
- Navigates directly to `chrome-extension://{id}/popup.html`
- Mocks Chrome APIs for local file testing
- Dynamically injects placeholders for testing
- Bypasses presentation mode detection via `startReplacements()`

**Configuration:**
- `jest.config.e2e.js` - Separate config for E2E tests
- Node environment (not JSDOM)
- 30-second timeout per test
- No coverage collection (tests run in browser)

**Note:** E2E tests are slower (~30s) because they launch a real Chrome instance. Run `npm run test:unit` for faster feedback during development.

### Test Coverage

**Latest Coverage:**
```
✅ 99.43% statement coverage
✅ 90.82% branch coverage
✅ 98.86% function coverage
✅ 99.71% line coverage
```

**Why not 100%?**
- Export checks for Node.js/Browser compatibility (~0.5%)
- Browser API limitations in JSDOM (~8% of branches)
- Logical operator short-circuits (~2-3% of branches)

**For new code:** ⚠️ **AIM FOR 100% coverage** - existing gaps are due to testing infrastructure only

## i18n Infrastructure

**Status:** Infrastructure implemented with type-safe Locale enum

The extension uses a fully enum-based architecture for internationalization with no string literals:

### Key Principle: Locale Enum for Type Safety

**Before (string-based, error-prone):**
```javascript
const service = new TranslationService('en');  // ❌ Could typo: 'eng', 'english'
service.setLocale('es');                        // ❌ Could typo: 'spanish', 'sp'
if (locale === 'en') { ... }                    // ❌ No autocomplete, error-prone
```

**After (enum-based, type-safe):**
```javascript
const service = new TranslationService(Locale.EN);  // ✅ IDE autocomplete
service.setLocale(Locale.ES);                       // ✅ Only valid values
if (locale === Locale.EN) { ... }                   // ✅ Compile-time safety
```

**Benefits:**
- ✅ **Prevents typos**: Can't use invalid locale strings
- ✅ **IDE autocomplete**: Developers get code completion for `Locale.`
- ✅ **Refactoring safety**: Rename enum values updates all references
- ✅ **Validation**: TranslationService validates against Locale enum
- ✅ **Consistent**: All code uses same enum values, no string variance



### 1. SessionStatus Enum (`src/constants/SessionStatus.js`)
- `NOT_STARTED` - Before session start
- `IN_PROGRESS` - During session
- `FINISHED` - After session end

**Purpose:** Type-safe constants that prevent typos and enable IDE autocomplete.

### 2. Locale Enum (`src/constants/Locale.js`)
- `EN` - English
- `ES` - Spanish (infrastructure ready, not used yet)

**Purpose:** Define supported languages using ISO 639-1 codes.

### 3. TranslationService (`src/services/TranslationService.js`)
- Manages translations for all text in the extension
- Currently supports: English (en), Spanish (es)
- Defaults to English (Option A)
- Fallback to English for missing translations
- Easy to add new languages (just update translations dictionary)

**Key Methods:**
- `translate(key)` - Translate enum value to display text
- `setLocale(locale)` - Change current language
- `hasLocale(locale)` - Check if language is supported
- `getSupportedLocales()` - Get list of available languages

### 4. StatusFormatter (`src/services/StatusFormatter.js`)
- Formats status enums to human-readable text
- Uses TranslationService for i18n
- Returns empty string for null status (safe behavior)
- Single responsibility: formatting only

### 5. LanguageDetector (`src/utils/LanguageDetector.js`)
- Detects browser language from Chrome's UI language setting
- Parses BCP 47 language codes (e.g., `en-US` → `en`)
- Checks if detected language is supported
- Falls back to English if language not supported or detection fails
- Handles all edge cases (null, undefined, errors)

**Key Methods:**
- `detectLocale()` - Returns best locale to use based on Chrome settings
- `parseLanguageCode(code)` - Extracts base language from BCP 47 format
- `getDefaultLocale()` - Returns default locale ('en')

**Error Handling:**
- Returns 'en' if Chrome i18n API is unavailable
- Returns 'en' if browser language is unsupported (e.g., French, German)
- Returns 'en' if any error occurs during detection
- Logs all fallback decisions to console for debugging

**Architecture Benefits:**
- ✅ Type-safe enum constants prevent typos
- ✅ Separation of concerns: logic (enums) vs display (translations)
- ✅ **Single source of truth**: TranslationService is the ONLY place with translatable text
- ✅ No duplication: All hardcoded fallback text removed from TimeFormatter and other services
- ✅ **No hardcoded UI text**: popup.html has no English text, only `data-i18n` attributes
- ✅ **Zero content before JS loads**: Clean separation of structure (HTML) and content (TranslationService)
- ✅ Easy to add languages (just add to TranslationService dictionary)
- ✅ **Manual language selector implemented** (v1.7) - users can override auto-detection
- ✅ Better testability (tests use enums, not hardcoded strings)
- ✅ Clear data flow: SessionStatusCalculator → enum → StatusFormatter → display text

**Current Usage:**
- LanguageDetector auto-detects Chrome's UI language on startup
- If user has Chrome in Spanish → Extension automatically shows Spanish text
- If user has Chrome in English → Extension shows English text
- If user has Chrome in unsupported language (French, German, etc.) → Falls back to English
- SessionStatusCalculator returns enum values (`SessionStatus.IN_PROGRESS`)
- StatusFormatter translates enums to display text based on detected locale
- PlaceholderReplacer uses StatusFormatter to show status to user

**Examples:**
- Chrome UI language: `en-US` → Extension uses `en` → Status shows `"In progress"`, popup in English
- Chrome UI language: `es-ES` → Extension uses `es` → Status shows `"En progreso"`, popup in Spanish
- Chrome UI language: `fr-FR` → Unsupported, fallback to `en` → Status shows `"In progress"`, popup in English

**What gets translated:**
- **In slides**: Status messages, month names (abbreviated and full)
- **In popup**: All UI text, labels, buttons, placeholders descriptions, instructions, status messages

### 6. Manual Language Selector (StorageService + UI)

**Status:** ✅ Implemented (v1.7)

The extension includes a manual language selector in the popup that allows users to override the auto-detected Chrome language. This is useful for:
- Users with organization-managed Chrome where language cannot be changed
- Users who prefer extension in different language than browser
- Testing and development

**Features:**
- **Auto mode (default)**: Uses Chrome's UI language via LanguageDetector
- **Manual override**: User can select English or Spanish explicitly
- **Persistent preference**: Choice saved in chrome.storage.local
- **Applies everywhere**: Both popup UI and slide placeholders use selected language

**Storage:**
```javascript
// StorageService methods
await storageService.getLanguage();           // Returns: 'auto', 'en', 'es', or null
await storageService.saveLanguage('es');      // Saves user preference
```

**UI Location:** Popup → Language dropdown (top of popup, before "How it works")

**Options:**
- `Auto (Chrome language)` - Default, uses LanguageDetector
- `English` - Force English regardless of Chrome setting
- `Español` - Force Spanish regardless of Chrome setting

**Implementation:**
1. **popup.html**: Language selector dropdown with 3 options
2. **StorageService**: `getLanguage()` and `saveLanguage()` methods
3. **popup.js**: Loads preference, sets dropdown, handles change events, reloads translations
4. **content.js**: Loads preference on init, overrides auto-detection if set
5. **TranslationService**: Language selector labels in both languages

**User Flow:**
1. User opens popup
2. By default, dropdown shows "Auto (Chrome language)"
3. User changes to "Español"
4. Popup immediately re-translates to Spanish
5. Preference saved to storage
6. Next time slides are opened, placeholders show Spanish text
7. Preference persists across browser sessions

**Example:**
```javascript
// popup.js initialization
const savedLanguage = await storageService.getLanguage();  // 'es'
let activeLocale;
if (savedLanguage === 'auto' || !savedLanguage) {
  activeLocale = languageDetector.detectLocale();  // Use Chrome language
} else {
  activeLocale = savedLanguage === 'en' ? Locale.EN : Locale.ES;  // Use preference
}
translationService.setLocale(activeLocale);
```

**Testing:**
- StorageService: 6 new tests for language methods (254 tests total)
- Manual testing: Change language in popup, verify UI updates, reload extension, verify persistence

## Installation & Usage

### Install Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (toggle top-right)
3. Click "Load unpacked"
4. Select: `/Users/apedrazainfante/Downloads/My extension`
5. Extension icon appears in toolbar

### Configure (for time-range features)

1. Click extension icon
2. Set **Start Time**: e.g., `14:00` (2 PM)
3. Set **End Time**: e.g., `16:00` (4 PM)
4. Click "Set Times"
5. Times saved in Chrome storage

### Use in Google Slides

1. **Edit mode:** Add placeholders to text boxes
   ```
   Current: <<time^>>
   Session: <<start^>> - <<end^>>
   Status: <<status>>
   Timer: <<5:00->>
   ```

2. **Present:** Press F5 or click "Present"
   - Placeholders automatically replaced
   - Updates every second
   - Only works in presentation mode (not edit mode)

3. **Exit:** Press ESC
   - Replacements stop
   - Slides return to edit mode

## Key Design Decisions

### 1. Presentation Mode Only

**Decision:** Placeholders only replaced in presentation mode, not edit mode.

**Rationale:**
- Users need to see/edit placeholders while building slides
- Running timers in edit mode would be confusing
- Prevents accidental interference while editing

**Implementation:**
```javascript
// Strict detection
if (url.includes('/edit')) return false;  // Never in edit mode
if (url.includes('/present')) return true; // Always in present mode
```

### 2. Format Modifiers (`^` and `&`)

**Decision:** Use symbols instead of separate placeholders.

**Rejected alternative:** `<<timeNoSeconds>>`, `<<time24h>>`, `<<timeShort>>`, etc.

**Rationale:**
- More flexible (combine modifiers: `^&`)
- Fewer placeholder types to remember
- Order doesn't matter (`^&` = `&^`)
- Concise syntax

**User feedback:** Initially tried checkboxes in popup for format preferences, but removed as unnecessarily complex. Modifiers give full control where it matters (in slides).

### 3. Dual Architecture

**Decision:** Keep both monolithic and SOLID architectures.

**Rationale:**
- Monolithic works and is tested
- SOLID is better but not yet integrated
- Gradual migration path
- Can A/B test both

**Next step:** Wire up SOLID architecture to manifest and test in production.

### 4. Timer Start Time

**Decision:** Duration timers (`<<5:00->>`) start when entering presentation mode, not at clock time.

**Rationale:**
- Intuitive behavior for fixed-duration activities
- Use case: "This section takes 5 minutes"
- Different from session placeholders which use actual clock time

### 5. Storage Persistence

**Decision:** Start/end times persist across browser sessions.

**Rationale:**
- User sets times once for recurring presentations
- Convenience > security (no sensitive data)
- Can clear manually if needed


## Common Use Cases

### Use Case 1: Workshop Timer

```
Workshop Schedule
Started: <<start^>> | Ends: <<end^>>
Status: <<status>>
Time Remaining: <<remaining>>
```

**Output during session:**
```
Workshop Schedule
Started: 2026-02-19 2:00 PM | Ends: 2026-02-19 4:00 PM
Status: In progress
Time Remaining: 1:23:45
```

### Use Case 2: Timed Presentation

```
Presentation Timer: <<30:00->>
Q&A Starts in: <<25:00->>
Current Time: <<time^>>
```

**Output:**
```
Presentation Timer: 27:34
Q&A Starts in: 22:34
Current Time: 3:15 PM
```

### Use Case 3: Break Countdown

```
☕ Break ends in: <<15:00->>
Resume at: <<endTime^>>
```

**Output:**
```
☕ Break ends in: 12:47
Resume at: 3:30 PM
```

### Use Case 4: Compact Footer

```
<<time&^>> | <<startTime&^>>-<<endTime&^>> | <<status>>
```

**Output:**
```
15:23 | 14:00-16:00 | In progress
```

## Technical Details

### Placeholder Detection Regex

```javascript
// Time with modifiers
/<<time([&^]*)>>/gi

// Start/End with modifiers
/<<start([&^]*)>>/gi
/<<end([&^]*)>>/gi

// Timers (short format MM:SS)
/<<(\d+):(\d+)([-+])>>/g

// Timers (long format HH:MM:SS)
/<<(\d+):(\d+):(\d+)([-+])>>/g

// Simple placeholders
/<<status>>/gi
/<<elapsed>>/gi
/<<remaining>>/gi
/<<duration>>/gi
/<<date>>/gi
/<<shortdate>>/gi
/<<longdate>>/gi

// Any placeholder (for detection)
/<<[^>]+>>/
```

### DOM Node Tracking

**Challenge:** After replacing text once, can't find nodes anymore (no `<<...>>` in DOM).

**Solution:** Track nodes with placeholders:
```javascript
const originalTexts = new Map();  // Store original text
const trackedNodes = new Set();   // Track nodes

// First time: find and track
const nodes = findNodesWithPlaceholders();
nodes.forEach(node => {
  originalTexts.set(node, node.textContent);
  trackedNodes.add(node);
});

// Every second: use tracked nodes
trackedNodes.forEach(node => {
  const original = originalTexts.get(node);
  const replaced = replacePlaceholders(original);
  node.textContent = replaced;
});
```

### Storage Format

Chrome storage stores ISO 8601 timestamps:

```javascript
{
  startTime: "2026-02-18T14:00:00",  // ISO 8601 format (date + time)
  endTime: "2026-02-20T16:00:00"     // ISO 8601 format (date + time)
}
```

**Benefits:**
- Full date+time support (not just time-only)
- Multi-day event support
- Future date scheduling
- Standard ISO 8601 format

**Backward compatibility:**
- Old format ("14:00") automatically migrates to today's date on first load
- Migration happens transparently in popup.js
- TimeFormatter.parseTimeString() supports both formats

**Note:** Timestamps are strings, not Date objects. Must parse to Date for calculations.

### Presentation Mode Detection

Google Slides URLs:
- Edit mode: `https://docs.google.com/presentation/d/{id}/edit`
- Present mode: `https://docs.google.com/presentation/d/{id}/present`

**Strict detection:**
```javascript
if (url.includes('/edit')) return false;    // Never
if (url.includes('/present')) return true;  // Always
```

Also checks:
- Iframe context (presentation runs in iframe)
- DOM classes (`punch-present-mode`)

### Update Frequency

**1 second interval:**
- Timers update smoothly
- Low performance impact
- Acceptable latency for status changes

**Implementation:**
```javascript
setInterval(replacePlaceholders, 1000);
```

## Known Issues & Limitations

### 1. Timezone Not Configurable

**Issue:** Uses browser's local timezone.

**Impact:** Can't set times for different timezone.

### 2. Timer Reset on Mode Change

**Issue:** Exiting and re-entering presentation resets countdown/countup timers.

**Rationale:** Expected behavior (fresh start), but could be configurable.

### 3. No Pause/Resume for Timers

**Issue:** Timers run continuously, can't pause.

**Workaround:** Exit presentation mode to pause (but loses progress).

### 4. Placeholders Must Be Plain Text

**Issue:** Placeholders in text boxes only, not in images, shapes, or formatted text.

**Limitation:** Google Slides text rendering.

### 5. No Notification When Timer Ends

**Issue:** `<<5:00->>` reaches `0:00` silently.

**Enhancement idea:** Flash or color change at zero.

### 6. Date/Time Picker Language

**Issue:** The datetime picker (`<input type="datetime-local">`) always displays in Chrome's language, not the extension's selected language.

**Reason:** Native browser controls use the browser's UI language. Extensions cannot override this.

**Impact:** Users with organization-managed Chrome cannot change the picker's language.

**Example:** Extension UI in Spanish, but date/time picker shows "Month/Day/Year" in English.

**Workarounds:**
- **Accept limitation:** Native controls provide better UX (familiar, accessible, mobile-friendly)
- **Custom picker:** Could build a JavaScript date/time picker, but adds complexity and code
- **Not recommended:** Trading native browser controls for full i18n is usually not worth it

**Note:** All other extension text (labels, buttons, status messages, placeholders) respects the language setting. Only the native browser datetime picker uses the browser's language.

### 7. Center-Aligned Text May Not Stay Centered

**Issue:** When placeholders are replaced with actual values, center-aligned text may appear slightly off-center.

**Root cause:** The extension only changes text content (`<<start>>` → `6:00 PM`), but Google Slides doesn't automatically recalculate text centering. Different character widths in proportional fonts mean the visual width changes.

**Example:**
```
Original (centered):  "Iniciamos: <<start>>"
After replacement:    "Iniciamos: 6:00 PM"
                      ↑ Visual centering not recalculated
```

**Why we can't fix it:**
- Google Slides uses complex canvas/SVG rendering in presentation mode
- No access to Google Slides' layout engine to trigger re-centering
- Extension can only change text content, not text box alignment properties
- No public API to recalculate text positioning after content changes

**Workarounds:**
- ✅ **Recommended:** Use left-aligned text inside center-aligned text boxes
- ⚠️ Use monospace fonts (like Courier) for consistent character widths
- ⚠️ Design placeholders with similar length to output values
- ✅ Accept as expected behavior for dynamic content

**Note:** This is a fundamental limitation of how browser extensions interact with Google Slides' rendering system. The original "Slides Timer" extension has the same limitation.

## Future Enhancements

### Potential Features

1. **Timer end notifications**
   - Visual flash when countdown reaches zero
   - Color change (green → yellow → red)
   - Audio alert (opt-in)

2. **Pause/resume timers**
   - Remember timer state when exiting presentation
   - Resume from where left off

3. **Multiple time zones**
   - Show time in different zones
   - `<<time:UTC>>`, `<<time:PST>>`

4. **Date ranges**
   - Support multi-day events
   - `<<start:2026-02-18>>`

5. **Custom formats**
   - `<<time:HH:mm:ss>>` template syntax
   - More flexible than `^` and `&`

6. **Conditional text**
   - `<<if:status=finished>>Show this<</if>>`
   - Display different content based on status

7. **Progress bar placeholder**
   - `<<progressbar>>` renders visual bar
   - Shows session progress graphically

8. **Lap timer**
   - `<<lap>>` shows time since last slide change
   - Useful for timing individual slides

## Troubleshooting

### Placeholders Not Replacing

**Symptoms:** See `<<time>>` instead of actual time

**Checklist:**
1. Are you in presentation mode? (press F5)
2. Check browser console (F12) for errors
3. Is extension enabled? (`chrome://extensions/`)
4. For time-range placeholders: Are start/end times set?

**Console logs to look for:**
```
[Slides Timer for GS] Mode changed: PRESENTATION MODE
[Slides Timer for GS] ✓ Starting timer replacements
[Slides Timer for GS] Tracking new node: <<time>>
```

### Timers Not Counting

**Symptoms:** `<<5:00->>` shows `5:00` but doesn't change

**Checklist:**
1. Format correct? Must be `<<MM:SS->>` or `<<HH:MM:SS->>` with digits
2. Direction included? Must end with `+` or `-`
3. Check console for errors

### Time-Range Placeholders Empty

**Symptoms:** `<<start>>` shows nothing

**Solution:** Click extension icon, set start/end times, click "Set Times"

**Verify:** Open console, should see:
```
[Slides Timer for GS Popup] Times saved successfully
[Slides Timer for GS Popup] Verified storage: {startTime: "14:00", endTime: "16:00"}
```

### Extension Not Loading

**Symptoms:** Extension icon missing or grayed out

**Solutions:**
1. Reload extension: `chrome://extensions/` → click reload icon
2. Check for errors in extension details
3. Verify manifest.json is valid JSON

### Tests Failing

**Symptoms:** `npm test` shows failures

**Solutions:**
```bash
# Clear cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check specific test
npm test -- TimeFormatter.test.js
```

## Development Workflow

### ⚠️ PERMISSION PROTOCOL FOR CLAUDE CODE SESSIONS

**Always ask for explicit permission before:**
- ✅ Making any file edits (Edit, Write tools)
- ✅ Committing changes to git
- ✅ Pushing to remote repository
- ✅ Deleting or moving files
- ✅ Running destructive commands (rm, git reset, etc.)

**How to ask:**
1. Explain what changes you plan to make
2. Show the changes if possible
3. Ask: "Should I proceed with these changes?"
4. Wait for explicit approval ("yes", "ok", "do it", "proceed")

**Never assume permission** - even for "obvious" fixes or improvements.

**Exception:** Read-only operations (Read, Grep, Glob, Bash with read-only commands) don't require permission.

**User can interrupt:** If a tool call starts without permission, user will stop it - wait for instructions.

### ⚠️ CRITICAL RULES FOR ANY CODE CHANGES

**ALL changes to this codebase MUST follow these rules:**

1. **SOLID Principles**: All code changes MUST adhere to SOLID principles
   - Single Responsibility: Each class/service has ONE clear purpose
   - Open/Closed: Extend functionality without modifying existing code
   - Liskov Substitution: Services must be replaceable with mocks/alternatives
   - Interface Segregation: Keep interfaces minimal and focused
   - Dependency Inversion: Depend on abstractions, inject dependencies

2. **Tests MUST Pass**: After ANY change:
   ```bash
   npm test  # All tests must pass (245 tests)
   ```
   - If tests fail, the change is NOT acceptable
   - Fix the code or update tests accordingly
   - Do NOT commit broken tests

3. **Test Coverage**: AIM FOR 100% on ALL new code
   ```bash
   npm run test:coverage  # Check coverage report
   ```
   - **TARGET: 100% coverage on all new code you write**
   - Current thresholds (99% statements, 92% branches) account for testing infrastructure limitations
   - When adding new features/services: Cover ALL branches, statements, functions, and lines
   - Missing coverage is only acceptable for:
     - Module export checks (`if (typeof module !== 'undefined')`)
     - Browser API limitations (e.g., `window.location` mocking in JSDOM)
   - Add tests for any new functionality
   - Never commit code that lowers coverage percentages

4. **Test Structure**: Tests MUST mirror source structure
   ```
   src/ServiceName.js → tests/ServiceName.test.js
   src/services/X.js  → tests/services/X.test.js
   ```

5. **Documentation Synchronization**: ⚠️ **CRITICAL - Keep documentation in sync**

   **When you make ANY of these changes, you MUST update BOTH files:**

   | Change Type | Update Required |
   |-------------|----------------|
   | Add/modify placeholder | Update **README.md** (user-facing) AND **CLAUDE.md** (technical) |
   | Change feature behavior | Update **README.md** examples AND **CLAUDE.md** details |
   | Add i18n translations | Update **README.md** i18n section AND **CLAUDE.md** i18n infrastructure |
   | Update storage format | Update **README.md** troubleshooting AND **CLAUDE.md** storage section |
   | Add/remove limitation | Update **README.md** tips AND **CLAUDE.md** Known Issues |
   | Change test counts | Update **CLAUDE.md** Test Suite Status |

   **Files that MUST stay synchronized:**
   - **README.md** - User-facing documentation (features, examples, troubleshooting)
   - **CLAUDE.md** - Technical documentation (architecture, testing, implementation details)

   **Quick checklist before committing:**
   - [ ] Does README.md reflect user-visible changes?
   - [ ] Does CLAUDE.md document technical implementation?
   - [ ] Are placeholder examples consistent in both files?
   - [ ] Are version histories updated in CLAUDE.md?
   - [ ] Are test counts accurate in CLAUDE.md?

   **Example scenario:**
   ```
   You add a new placeholder <<foo>>:

   ✅ DO:
   1. Add pattern to PlaceholderParser
   2. Add replacement logic to PlaceholderReplacer
   3. Add tests (100% coverage)
   4. Update README.md with <<foo>> in placeholder tables
   5. Add example usage in README.md
   6. Update CLAUDE.md features section
   7. Update CLAUDE.md quick reference
   8. Update test counts in CLAUDE.md

   ❌ DON'T:
   - Add feature without updating documentation
   - Update only one documentation file
   - Leave outdated examples in either file
   ```

### Making Changes

1. **Edit code** in appropriate file
2. **Run tests:** `npm test` ⚠️ MUST PASS
3. **Check coverage:** `npm run test:coverage`
4. **Reload extension:** `chrome://extensions/` → reload
5. **Test in Google Slides**
6. **Verify console output** (F12)

### Adding New Placeholder

**SOLID approach** (current):

1. **PlaceholderParser:** Add pattern to `patterns` object
2. **PlaceholderParser:** Add extraction logic in `extractPlaceholders()`
3. **PlaceholderReplacer:** Add replacement logic in `replacePlaceholders()`
4. **Tests:** Add test cases for new placeholder - ⚠️ **MUST achieve 100% coverage on new code**
5. **Run tests:** Verify all tests pass and coverage hasn't decreased
   ```bash
   npm test  # All tests must pass
   npm run test:coverage  # Verify no coverage regression
   ```

### Adding New Format Modifier

Example: Add `!` for uppercase

1. **TimeFormatter:** Update `formatTime()` to check for `!` in modifiers
2. **Tests:** Add comprehensive test cases - ⚠️ **MUST cover all branches**
   - Test with `!` alone
   - Test with `!` combined with `^`
   - Test with `!` combined with `&`
   - Test with all modifiers combined: `!^&`
3. **Run coverage:** Ensure 100% coverage on modified code
   ```bash
   npm run test:coverage  # Check TimeFormatter coverage = 100%
   ```
4. **README:** Document new modifier
5. **This file:** Update modifier table

### Running in Development

```bash
# Terminal 1: Watch tests
npm run test:watch

# Terminal 2: Run any build/development commands
# (none needed currently, extension runs directly)

# Chrome: Reload extension after changes
chrome://extensions/ → Click reload icon
```

## Version History

### v1.8 - Current (February 2026)
- ✅ **E2E test suite implemented** - comprehensive browser-based testing with Puppeteer
- ✅ **11 E2E tests** covering popup functionality and placeholder replacement
- ✅ **Popup tests**: UI rendering, language selection, session time configuration
- ✅ **Placeholder tests**: all timer types, time/date formats, modifiers, session tracking
- ✅ **Simplified mock HTML** - minimal fixture with dynamic placeholder injection
- ✅ Service worker added for E2E test support
- ✅ Separate Jest config for E2E tests (Node environment, 30s timeout)
- ✅ Test commands: `npm run test:all` (unit + E2E), `npm run test:unit`, `npm run test:e2e`
- ✅ 265 tests passing total (254 unit + 11 E2E) with 99%+ coverage

### v1.7 - (February 2026)
- ✅ **Manual language selector in popup** - users can override Chrome's auto-detected language
- ✅ **Three options**: Auto (Chrome language), English, Español
- ✅ **Persistent preference** - choice saved in chrome.storage.local and applies everywhere
- ✅ **Solves organization-managed Chrome issue** - users can now choose language even if Chrome is locked
- ✅ StorageService extended with `getLanguage()` and `saveLanguage()` methods
- ✅ Both popup and slide placeholders respect language preference
- ✅ Gradient background reversed (dark to light) for better button contrast
- ✅ Fixed variable hoisting issue with enum imports (removed `var` keyword)
- ✅ 254 unit tests passing with 99%+ coverage (added 6 new tests for language storage)

### v1.6 - (February 2026)
- ✅ **Locale enum for type safety** - all locale handling uses `Locale.EN`, `Locale.ES` instead of strings
- ✅ **Prevents typos** - can't accidentally use 'eng' or 'spanish', only valid enum values work
- ✅ **IDE autocomplete** - developers get code completion for available locales
- ✅ Full popup UI internationalization (i18n)
- ✅ **No hardcoded text in HTML** - popup.html only has `data-i18n` attributes, all text from TranslationService
- ✅ **Pure separation**: Structure (HTML) vs Content (TranslationService) - zero duplication
- ✅ All text in popup auto-translates based on Chrome language (English/Spanish)
- ✅ **TranslationService is now the single source of truth** - removed all hardcoded fallback text
- ✅ TimeFormatter now requires TranslationService (no more optional, enforces DRY principle)
- ✅ Professional icon design with Google blue colors and transparent background
- ✅ Popup styling updated to match icon colors
- ✅ "How it works" section added to popup for better UX
- ✅ 248 tests passing with 99%+ coverage (added validation tests for enum)

### v1.5 - (February 2026)
- ✅ ISO 8601 date format (YYYY-MM-DD) for <<start>>/<<end>> timestamps
- ✅ Consistent, predictable date+time display (always shows date)
- ✅ Clear distinction: <<start>>/<<end>> (full datetime), <<startTime>>/<<endTime>> (time only)
- ✅ Updated documentation with ISO format examples
- ✅ 247 tests passing with 99%+ coverage

### v1.4 - (February 2026)
- ✅ Full date+time support with ISO 8601 storage format
- ✅ Granular date/time placeholders (<<startTime>>, <<startDate>>, <<startLongDate>>, etc.)
- ✅ i18n month names (abbreviated and full) in English and Spanish
- ✅ Backward compatible migration from old "HH:MM" format to ISO 8601
- ✅ Native datetime-local pickers in popup with helpful hints
- ✅ Multi-day event support
- ✅ Future date scheduling
- ✅ 245 tests passing with 99%+ coverage
- ✅ Resolved: "Times are for Today Only" limitation removed

### v1.3 - (February 2026)
- ✅ Chrome language auto-detection implemented
- ✅ LanguageDetector utility auto-detects browser UI language
- ✅ Automatic Spanish translation for Spanish Chrome users
- ✅ Graceful fallback to English for unsupported languages
- ✅ 209 tests passing with 99%+ coverage
- ✅ Zero configuration required for i18n

### v1.2 - (February 2026)
- ✅ i18n infrastructure implemented (Option A)
- ✅ Enum-based status values (type-safe)
- ✅ TranslationService and StatusFormatter added
- ✅ SessionStatus and Locale constants
- ✅ 180 tests passing with 99%+ coverage
- ✅ Ready for future multi-language support

### v1.1 - (February 2026)
- ✅ SOLID architecture fully activated
- ✅ All monolithic code removed
- ✅ 150 tests passing with 99%+ coverage
- ✅ Clean, maintainable codebase
- ✅ Duration timers and session tracking
- ✅ Format modifiers (`^`, `&`)
- ✅ English-only placeholders

### v1.0 - Initial (February 2026)
- ✅ Timer and time placeholders
- ✅ Session time-range tracking
- ✅ Format modifiers
- ✅ Monolithic implementation
- ✅ Basic test suite

### Future Versions

**v1.8.0 - Chrome i18n API Refactoring (Planned)**
- Migrate from custom i18n to official Chrome i18n API
- Create `_locales/en/messages.json` and `_locales/es/messages.json`
- Replace TranslationService with `chrome.i18n.getMessage()`
- Simplify/remove: TranslationService, LanguageDetector, StatusFormatter
- Update manifest.json with `"default_locale": "en"`
- More standard Chrome extension architecture
- Update all affected tests

**v2.0 - Enhanced Features**
- Timer end notifications
- Pause/resume
- Multiple timezones
- Custom formats

## Dependencies

```json
{
  "devDependencies": {
    "@types/chrome": "^0.1.36",
    "@types/jest": "^30.0.0",
    "jest": "^30.2.0",
    "jest-environment-jsdom": "^30.2.0",
    "puppeteer": "^24.37.4"
  }
}
```

**Runtime:** None (pure vanilla JavaScript, uses browser APIs)

**Development:** Jest for testing, Puppeteer available for E2E tests (not used yet)

## Performance Considerations

### Update Loop

**1 second interval** is acceptable:
- Low CPU usage (< 1%)
- Smooth timer updates
- No noticeable lag

**Optimization:** Could use `requestAnimationFrame` for smoother updates, but overkill for 1-second precision.

### DOM Operations

**Efficient:**
- Tracks nodes, doesn't re-search DOM every second
- Only updates text content if changed
- Cleans up stale nodes periodically

**Could optimize:** Use `MutationObserver` to detect new placeholders dynamically.

### Memory

**Small footprint:**
- `Map` and `Set` for node tracking
- Strings only (no heavy objects)
- Clears on presentation mode exit

**No memory leaks:** Proper cleanup in `stopReplacements()`

## Security Considerations

### No Security Issues

**Why safe:**
- No external API calls
- No user data collection
- No network requests
- No eval or dynamic code execution
- Local storage only (no remote sync)

**Permissions:** Only needs `storage` permission (Chrome local storage)

**Content script scope:** Runs only on `docs.google.com/presentation/*`

## Browser Compatibility

### Supported

- ✅ Chrome (primary target)
- ✅ Edge (Chromium-based)
- ⚠️ Brave (should work, not tested)

### Not Supported

- ❌ Firefox (manifest v3 differences)
- ❌ Safari (different extension API)

**To support Firefox:**
- Convert manifest v3 → v2
- Replace `chrome` with `browser` API
- Test presentation mode detection

## Icon Design

**Design concept:**
- Blue gradient circular background (Google blue #4285f4 → #1967d2)
- White clock face with Google-style markers
- Clock hands showing 2:10 (representing timing/presentation)
- Red second hand for accent
- Small yellow slide icon in corner (Google Slides brand color #fbbc04)
- Transparent background (RGBA format for Chrome toolbar)

**Files:**
- `icon.svg` - Source vector file (2.7KB)
- `icon16.png` - Toolbar icon (16×16, 698 bytes, transparent)
- `icon48.png` - Extension management icon (48×48, 2.3KB, transparent)
- `icon128.png` - Chrome Web Store icon (128×128, 7.5KB, transparent)

**To regenerate icons:**
If you need to modify the icon, edit `icon.svg` and use an online converter (e.g., CloudConvert, Convertio) or create a temporary Node.js script with Puppeteer to generate the PNG files at the required sizes.

⚠️ **IMPORTANT**: If using a Node.js script for generation, **DO NOT commit it to the repo**. Delete the script after generating the icons. Only commit the SVG source and the PNG files.

## Contact & Resources

**Project location:** `/Users/apedrazainfante/Downloads/My extension`

**Inspired by:** [Slides Timer Chrome Extension](https://chromewebstore.google.com/detail/slides-timer/nfhjdkmpebifdelclimjfaackjhiglpc)

**Key files for future reference:**
- This file (`CLAUDE.md`) - Complete project context
- `README.md` - User-facing documentation
- `TESTING.md` - Testing guide
- `content.js` - Entry point with dependency injection
- `src/` - SOLID architecture (all services)

## Quick Reference

### Placeholders Cheat Sheet

```
TIMER & TIME (no setup needed):
<<5:00->>              Countdown timer
<<2:00+>>              Countup timer
<<time>>               Current time
<<date>>               Today's date (02/18/2026)
<<shortdate>>          Short date (02/18/26)
<<longdate>>           Long date (February 18, 2026)

SESSION TRACKING (needs date+time setup):
Full date+time (ISO 8601 date format):
<<start>>              Start (2026-02-19 2:00:00 PM)
<<end>>                End (2026-02-20 4:00:00 PM)

Granular (full control):
<<startTime>>          Start time only (2:00:00 PM)
<<endTime>>            End time only (4:00:00 PM)
<<startDate>>          Start date (02/18/2026)
<<endDate>>            End date (02/20/2026)
<<startShortDate>>     Start short date (02/18/26)
<<endShortDate>>       End short date (02/20/26)
<<startLongDate>>      Start long date (February 18, 2026)
<<endLongDate>>        End long date (February 20, 2026)

Session info:
<<status>>             Session status (In progress)
<<elapsed>>            Time since start
<<remaining>>          Time until end
<<duration>>           Total duration

MODIFIERS (for time placeholders):
^                      No seconds
&                      24-hour format

EXAMPLES:
<<time^>>              2:30 PM
<<time&>>              14:30:45
<<time^&>>             14:30
<<start^>>             2:00 PM (or Feb 19 2:00 PM)
<<startTime&^>>        14:00
<<startLongDate>>      February 18, 2026
```

### Commands Cheat Sheet

```bash
# Install dependencies
npm install

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Open coverage
open coverage/lcov-report/index.html

# Chrome extension
chrome://extensions/
# Enable Developer mode → Load unpacked → Select folder
```

### Important Code Locations

```
Entry point:             content.js:10-63
Main orchestrator:       src/SlidesTimerExtension.js
Presentation detection:  src/services/PresentationModeDetector.js:12-29
Placeholder replacement: src/services/PlaceholderReplacer.js:28-117
Timer logic:             src/services/TimerManager.js:40-69
Storage operations:      src/services/StorageService.js:20-54 (and popup.js:43-93)
Time formatting:         src/services/TimeFormatter.js
Format modifiers:        src/services/TimeFormatter.js:15-40
```

---

**Last Updated:** February 18, 2026

**For Claude:** This file contains complete project context. When working on this project in the future, read this file first to understand the architecture, features, and current status. All key decisions and rationales are documented here.
