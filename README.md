# Slides Timer for Google Slides

A Chrome extension that replaces placeholder text in Google Slides with real-time timer and session information during presentations. Add dynamic countdowns, session schedules, and live clocks to your presentations.

## Features

- **Countdown/Countup Timers**: Track elapsed time or count down from a specific duration
- **Current Time & Date**: Display current time with customizable formats and date variants
- **Session Date+Time Tracking**: Set full start/end date+times for multi-day events or future sessions
- **ISO 8601 Date Format**: Consistent, unambiguous date display (YYYY-MM-DD) for session timestamps
- **Granular Date/Time Control**: Separate placeholders for dates, times, with multiple format options
- **i18n Support**: Full internationalization - popup UI and slides content automatically translate based on Chrome language (English, Spanish)
- **Smart Status Messages**: Automatic "Not started yet", "In progress", and "Finished" messages (localized)
- **Real-time Updates**: All placeholders update every second during presentation
- **Persistent Storage**: Session date+times are saved across browser sessions
- **Multi-day Events**: Full support for sessions spanning multiple days

## Available Placeholders

### Current Time & Date Placeholders

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<time>>` | Current time (12-hour with seconds) | `2:30:45 PM` |
| `<<time^>>` | Current time (12-hour without seconds) | `2:30 PM` |
| `<<time&>>` | Current time (24-hour with seconds) | `14:30:45` |
| `<<time^&>>` or `<<time&^>>` | Current time (24-hour without seconds) | `14:30` |
| `<<date>>` | Current date (MM/DD/YYYY) | `02/18/2026` |
| `<<shortdate>>` | Short date (MM/DD/YY) | `02/18/26` |
| `<<longdate>>` | Long date (Month Day, Year) | `February 18, 2026` |

### Timer Placeholders (Countdown/Countup)

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<5:00->>` | Countdown from 5 minutes | `4:32` → `4:31` → ... → `0:00` |
| `<<2:00+>>` | Countup from 2 minutes | `2:00` → `2:01` → `2:02` → ... |
| `<<1:30:00->>` | Countdown from 1h 30m | `1:29:45` → `1:29:44` → ... |
| `<<0:00+>>` | Stopwatch from zero | `0:00` → `0:01` → `0:02` → ... |

**How timers work:**
- Use `-` to count DOWN from a time (e.g., `<<5:00->>` counts from 5:00 down to 0:00)
- Use `+` to count UP from a time (e.g., `<<2:00+>>` counts from 2:00 upward)
- Timers start when you enter presentation mode
- Format: `<<MM:SS+>>` or `<<H:MM:SS->>` or `<<HH:MM:SS+>>`

### Session Time-Range Placeholders

**Note:** These require setting start/end date+times in the extension popup first. Supports multi-day events and future scheduling.

#### Full Date+Time Display (ISO 8601 Date Format)

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<start>>` | Start date+time (ISO date format) | `2026-02-19 2:00:00 PM` |
| `<<start^>>` | Start date+time (no seconds) | `2026-02-19 2:00 PM` |
| `<<start&>>` | Start date+time (24-hour) | `2026-02-19 14:00:00` |
| `<<start^&>>` or `<<start&^>>` | Start date+time (24h, no seconds) | `2026-02-19 14:00` |
| `<<end>>` | End date+time (ISO date format) | `2026-02-20 4:30:00 PM` |
| `<<end^>>` | End date+time (no seconds) | `2026-02-20 4:30 PM` |
| `<<end&>>` | End date+time (24-hour) | `2026-02-20 16:30:00` |
| `<<end^&>>` or `<<end&^>>` | End date+time (24h, no seconds) | `2026-02-20 16:30` |

#### Granular Date/Time (Full Control)

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<startTime>>` | Start time only | `2:00:00 PM` |
| `<<startTime^>>` | Start time (no seconds) | `2:00 PM` |
| `<<startTime&>>` | Start time (24-hour) | `14:00:00` |
| `<<startTime^&>>` | Start time (24h, no seconds) | `14:00` |
| `<<endTime>>` | End time only | `4:30:00 PM` |
| `<<endTime^>>` | End time (no seconds) | `4:30 PM` |
| `<<endTime&>>` | End time (24-hour) | `16:30:00` |
| `<<endTime^&>>` | End time (24h, no seconds) | `16:30` |
| `<<startDate>>` | Start date (standard) | `02/18/2026` |
| `<<endDate>>` | End date (standard) | `02/20/2026` |
| `<<startShortDate>>` | Start date (short) | `02/18/26` |
| `<<endShortDate>>` | End date (short) | `02/20/26` |
| `<<startLongDate>>` | Start date (full, localized) | `February 18, 2026` (English) or `Febrero 18, 2026` (Spanish) |
| `<<endLongDate>>` | End date (full, localized) | `February 20, 2026` (English) or `Febrero 20, 2026` (Spanish) |

#### Session Info

| Placeholder | Description | Example Output |
|------------|-------------|----------------|
| `<<duration>>` | Total session duration | `2:30:00` |
| `<<elapsed>>` | Time elapsed since start | `1:15:30` |
| `<<remaining>>` | Time remaining until end | `1:14:30` |
| `<<status>>` | Session status (localized) | `In progress` (English) or `En progreso` (Spanish) |

---

## Format Modifiers (Comodines)

You can add special symbols after certain placeholders to customize how times are displayed. These symbols are called **format modifiers** or **comodines**.

### Available Modifiers

| Symbol | Name | Effect | Example |
|--------|------|--------|---------|
| `^` | No Seconds | Removes seconds from time display | `<<time^>>` → `2:30 PM` |
| `&` | 24-Hour Format | Uses 24-hour format, removes AM/PM | `<<time&>>` → `14:30:45` |
| `^&` or `&^` | Both Combined | 24-hour format without seconds | `<<time^&>>` → `14:30` |

### Compatible Placeholders

Format modifiers work with:
- ✅ `<<time>>` - Current time
- ✅ `<<start>>` - Smart session start
- ✅ `<<end>>` - Smart session end
- ✅ `<<startTime>>` - Session start time (time only)
- ✅ `<<endTime>>` - Session end time (time only)

### Examples Table

| Placeholder | Output | Description |
|------------|--------|-------------|
| `<<time>>` | `2:30:45 PM` | Default: 12-hour with seconds |
| `<<time^>>` | `2:30 PM` | 12-hour without seconds |
| `<<time&>>` | `14:30:45` | 24-hour with seconds |
| `<<time&^>>` | `14:30` | 24-hour without seconds (compact) |
| `<<time^&>>` | `14:30` | Same as above (order doesn't matter) |
| | | |
| `<<start>>` | `2:00:00 PM` | Default format |
| `<<start^>>` | `2:00 PM` | Shorter, easier to read |
| `<<start&>>` | `14:00:00` | Military/international time |
| `<<start&^>>` | `14:00` | Most compact format |
| | | |
| `<<end>>` | `4:30:00 PM` | Default format |
| `<<end^>>` | `4:30 PM` | Without seconds |
| `<<end&^>>` | `16:30` | 24-hour, no seconds |

### Real-World Usage Examples

#### Example 1: Workshop Header (Full Date+Time)
```
Workshop: <<start^>> - <<end^>>
Status: <<status>>
```
**Output:**
```
Workshop: 2026-02-19 2:00 PM - 2026-02-19 4:30 PM
Status: In progress
```

#### Example 2: International Format (24-hour, ISO dates)
```
Session: <<start&^>> - <<end&^>>
Current: <<time&^>>
```
**Output:**
```
Session: 2026-02-19 14:00 - 2026-02-19 16:30
Current: 15:23
```

#### Example 3: Detailed Display
```
Start Time: <<start>>
End Time: <<end>>
Current Time: <<time>>
Elapsed: <<elapsed>> | Remaining: <<remaining>>
```
**Output:**
```
Start Time: 2026-02-19 2:00:00 PM
End Time: 2026-02-19 4:30:00 PM
Current Time: 3:15:30 PM
Elapsed: 1:15:30 | Remaining: 1:14:30
```

#### Example 4: Mixed Formats
```
📅 Today: <<longdate>>
🕐 Now: <<time^>>
⏰ Session: <<start&^>> to <<end&^>>
📊 Status: <<status>>
```
**Output:**
```
📅 Today: February 18, 2026
🕐 Now: 3:15 PM
⏰ Session: 2026-02-19 14:00 to 2026-02-19 16:30
📊 Status: In progress
```

#### Example 5: Compact Footer (use time-only placeholders)
```
<<time^>> | <<startTime&^>>-<<endTime&^>> | <<status>>
```
**Output:**
```
3:15 PM | 14:00-16:30 | In progress
```

#### Example 6: Multiple Timers
```
Presentation: <<30:00->>
Q&A Starts: <<25:00->>
Clock: <<time^>>
Session: <<start^>> - <<end^>>
```
**Output:**
```
Presentation: 27:34
Q&A Starts: 22:34
Clock: 3:15 PM
Session: 2026-02-19 2:00 PM - 2026-02-19 4:30 PM
```

#### Example 7: Multi-Day Event
```
Event: <<startLongDate>> to <<endLongDate>>
Daily Schedule: <<startTime^>> - <<endTime^>>
Status: <<status>>
```
**Output:**
```
Event: February 18, 2026 to February 20, 2026
Daily Schedule: 9:00 AM - 5:00 PM
Status: In progress
```

#### Example 8: Granular Control
```
Date: <<startDate>>
Start: <<startTime&^>>
End: <<endTime&^>>
```
**Output:**
```
Date: 02/18/2026
Start: 14:00
End: 16:30
```

### Choosing the Right Format

| Use Case | Recommended Format | Example |
|----------|-------------------|---------|
| Tight space / footer | `<<startTime&^>>` - `<<endTime&^>>` | `14:00 - 16:30` (time only) |
| Full date+time display | `<<start^>>` - `<<end^>>` | `2026-02-19 2:00 PM - 2026-02-19 4:30 PM` |
| International / 24h with dates | `<<start&^>>` - `<<end&^>>` | `2026-02-19 14:00 - 2026-02-19 16:30` |
| Precise timing with dates | `<<start>>` - `<<end>>` | `2026-02-19 2:00:00 PM - 2026-02-19 4:30:00 PM` |
| Just time (no date) | `<<startTime^>>` - `<<endTime^>>` | `2:00 PM - 4:30 PM` |
| Current time display | `<<time^>>` | `3:15 PM` |
| Digital clock style | `<<time&^>>` | `15:15` |

**Status Messages:**
- `Not started yet` - when current time is before start time
- `In progress` - when current time is between start and end
- `Finished` - when current time is after end time

**Behavior based on session state:**

| Time State | `<<elapsed>>` | `<<remaining>>` |
|-----------|--------------|----------------|
| Before start | `0:00` | Full duration |
| During session | Time since start | Time until end |
| After end | Full duration | `0:00` |

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right corner)
3. Click "Load unpacked"
4. Select the "My extension" folder
5. The extension icon will appear in your toolbar

## Usage

### For Timer & Time Features (No Setup Required)

Just add timers and time placeholders to your slides and present:

```
Presentation Time: <<5:00->>
Break Timer: <<15:00->>
Current Time: <<time>>
Date: <<longdate>>
```

When you start presenting, timers automatically begin counting.

### For Session Time-Range Features

#### 1. Set Up Your Slides

Add time-range placeholders to your slides:

```
Session: <<start>> - <<end>>
Status: <<status>>
Elapsed: <<elapsed>> | Remaining: <<remaining>>
```

#### 2. Configure Date+Times

1. Click the extension icon in your Chrome toolbar
2. Set your **Start Date & Time** using the picker (supports future dates and multi-day events)
3. Set your **End Date & Time** using the picker
4. Click **Set Times**

**Tips:**
- Click the input to open the date+time picker
- Scroll values to adjust date/time quickly
- Supports scheduling sessions for future dates or multi-day events
- Your settings are saved automatically

#### 3. Present

Start your presentation and the placeholders will show live data based on the current time vs your configured times.

## Example Use Cases

### Simple Countdown Timer
```
⏰ Time Remaining: <<5:00->>
```

### Workshop with Schedule
```
Workshop Timer
Started: <<start>> | Ends: <<end>>
Status: <<status>>
Time Remaining: <<remaining>>
```

### Presentation Footer
```
<<time>> | <<date>> | Session: <<elapsed>> / <<duration>>
```

### Break Timer
```
Break ends in: <<10:00->>
```

### Multiple Timers
```
Presentation: <<30:00->>
Q&A Starts: <<25:00->>
Current Time: <<time>>
```

### Multi-Day Conference
```
Conference: <<startLongDate>> - <<endLongDate>>
Today's Sessions: <<startTime^>> - <<endTime^>>
Status: <<status>>
```

### Future Event Scheduled
```
Event Date: <<startLongDate>>
Starts at: <<startTime^>>
Status: <<status>>
```

## Tips

- **Test before presenting**: Add placeholders and enter presentation mode to verify they work
- **Font size matters**: Use large, readable fonts for timers
- **Mix features**: Combine countdown timers (`<<5:00->>`) with session tracking (`<<status>>`)
- **No configuration needed**: Timer features work without setting up start/end times
- **Timers reset**: When you exit and re-enter presentation mode, countdown/countup timers reset
- **Time-range persists**: Your start/end times are saved even after closing the browser
- **Center-aligned text**: For best results with dynamic content, use left-aligned text inside center-aligned text boxes (center-aligned text may not recalculate positioning after placeholder replacement)

## Format Reference

### Timer Formats
- `<<MM:SS+>>` - Minutes:Seconds countup
- `<<MM:SS->>` - Minutes:Seconds countdown
- `<<H:MM:SS+>>` - Hours:Minutes:Seconds countup
- `<<HH:MM:SS->>` - Hours:Minutes:Seconds countdown

Examples:
- `<<0:30->>` - 30 second countdown
- `<<5:00->>` - 5 minute countdown
- `<<1:30:00->>` - 1 hour 30 minute countdown
- `<<0:00+>>` - Stopwatch (counts up from zero)

### Date/Time Formats
- `<<time>>` - 12-hour format with AM/PM
- `<<date>>` - MM/DD/YYYY
- `<<shortdate>>` - MM/DD/YY
- `<<longdate>>` - Month Day, Year (localized)

### Time-Range Formats (Smart Display)
- `<<start>>` - Smart start (date+time or time only, based on date)
- `<<end>>` - Smart end (date+time or time only, based on date)

### Time-Range Formats (Granular)
- `<<startTime>>` / `<<endTime>>` - Time only (supports `^`, `&` modifiers)
- `<<startDate>>` / `<<endDate>>` - Date (MM/DD/YYYY)
- `<<startShortDate>>` / `<<endShortDate>>` - Short date (MM/DD/YY)
- `<<startLongDate>>` / `<<endLongDate>>` - Full date (localized month names)

### Session Info
- `<<duration>>` - Difference between end and start
- `<<elapsed>>` - Time since start (smart behavior)
- `<<remaining>>` - Time until end (smart behavior)
- `<<status>>` - Auto status message (localized)

## Troubleshooting

**Placeholders not being replaced?**
- Make sure you're in presentation mode (press Present or F5)
- Verify placeholder format exactly matches (including `<<` and `>>`)
- Check that there are no spaces inside the brackets

**Countdown/countup timers not working?**
- Timers work automatically in presentation mode (no configuration needed)
- Format must be exactly `<<MM:SS+>>` or `<<HH:MM:SS->>` with digits
- Example: `<<5:00->>` ✓ correct, `<<5min->>` ✗ incorrect

**Time-range placeholders showing nothing?**
- Click the extension icon and set both start and end date+times
- Use the date+time pickers to select your session schedule
- Click "Set Times" to save
- Supports future dates and multi-day events

**Timer shows unexpected time?**
- Duration timers (`<<5:00->>`) start counting when you enter presentation mode
- Session timers (`<<elapsed>>`) are based on actual clock time vs your configured times
- Make sure you're using the right type of placeholder for your needs

## Differences: Duration vs Session Timers

| Feature | Duration Timer (`<<5:00->>`) | Session Timer (`<<elapsed>>`) |
|---------|------------------------------|-------------------------------|
| Setup needed? | No | Yes (set start/end times) |
| Starts when? | Enter presentation mode | Based on actual clock time |
| Use case | Fixed duration activities | Scheduled sessions |
| Example | "5 minute presentation" | "2pm-3pm workshop" |

## Internationalization (i18n)

The extension automatically detects your Chrome language and displays localized content:

**Supported Languages:**
- **English (en)**: Default language
- **Spanish (es)**: Español

**What gets localized:**
- **Extension popup UI**: All labels, buttons, instructions, and descriptions
- **Month names** (abbreviated and full): `Feb` / `February` → `Feb` / `Febrero`
- **Status messages**: `In progress` → `En progreso`, `Not started yet` → `Aún no ha comenzado`, `Finished` → `Finalizado`

**How it works:**
- The extension detects Chrome's UI language automatically
- If your Chrome is in Spanish:
  - The popup interface appears in Spanish
  - Dates and status messages in slides appear in Spanish
- If your language is not supported yet, English is used as fallback
- No configuration needed - it just works!

**Examples:**
```
English Chrome: February 18, 2026 | In progress
Spanish Chrome: Febrero 18, 2026 | En progreso
```

## Development

### Version Management & Release Process

This project uses **semantic versioning** (`MAJOR.MINOR.PATCH`) and **git tags** to track releases.

#### Semantic Versioning Rules

- **PATCH** (1.7.0 → 1.7.1): Bug fixes, no new features
- **MINOR** (1.7.0 → 1.8.0): New features, backward compatible
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes

**Note:** Documentation-only changes typically don't require a version bump.

#### Release Workflow

When you're ready to release a new version (e.g., v1.8.0):

**1. Update version numbers in three files:**
```bash
# manifest.json
"version": "1.8.0"

# package.json
"version": "1.8.0"

# CLAUDE.md (version history section)
Add entry for v1.8.0
```

**2. Commit the version bump:**
```bash
git add manifest.json package.json CLAUDE.md
git commit -m "Bump version to 1.8.0"
git push
```

**3. Create and push git tag:**
```bash
git tag -a v1.8.0 -m "Release v1.8.0

New features:
- Feature 1
- Feature 2

Bug fixes:
- Fix 1

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

git push origin v1.8.0
```

**4. Create GitHub Release:**
1. Go to: https://github.com/elpatopedraza/google-slides-timer-chrome/releases/new
2. Select tag: `v1.8.0`
3. Auto-generate release notes or use tag message
4. Attach ZIP file for Chrome Web Store (see below)
5. Publish release

#### Creating Distribution Package for Chrome Web Store

Create a ZIP file with **only production files** (exclude dev/test files):

```bash
cd "/Users/apedrazainfante/Downloads/Slides Timer for Google Slides"

zip -r google-slides-timer-chrome-v1.8.0.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*coverage*" \
  -x "*tests*" \
  -x "*.md" \
  -x "jest.config.js" \
  -x "package*.json" \
  -x "icon.svg"
```

This creates a clean package containing only:
- `manifest.json`
- `content.js`
- `popup.html`, `popup.js`, `styles.css`
- `src/` directory (services, constants, utils)
- Icon files (`icon16.png`, `icon48.png`, `icon128.png`)

**Upload this ZIP to Chrome Web Store Developer Dashboard.**

#### View All Releases

- **Tags**: https://github.com/elpatopedraza/google-slides-timer-chrome/tags
- **Releases**: https://github.com/elpatopedraza/google-slides-timer-chrome/releases

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

**Test suite status:**
- ✅ 254 tests passing
- ✅ 99%+ coverage on all services
- ⏱️ ~2 seconds runtime

### Project Structure

```
google-slides-timer-chrome/
├── manifest.json              # Extension manifest
├── content.js                 # Entry point
├── popup.html/js              # Extension popup
├── src/
│   ├── constants/             # Enums (SessionStatus, Locale)
│   ├── services/              # 11 SOLID services
│   ├── utils/                 # Utilities (LanguageDetector)
│   └── SlidesTimerExtension.js # Main orchestrator
└── tests/                     # Test suite
```

See `CLAUDE.md` for complete technical documentation.
