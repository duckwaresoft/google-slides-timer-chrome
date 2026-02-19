# Privacy Policy for Slides Timer for Google Slides

**Last Updated:** February 19, 2026

## Overview

Slides Timer for Google Slides ("the Extension") is committed to protecting your privacy. This privacy policy explains how the Extension handles data.

## Data Collection

**The Extension does NOT collect, transmit, or share any personal data.**

### What Data is Stored Locally

The Extension stores the following data **locally on your device only** using Chrome's local storage API:

- **Session start and end times**: Date and time values you configure in the extension popup for session tracking features
- **Language preference**: Your selected language setting (Auto, English, or Spanish)

### Data Storage Location

All data is stored locally in your browser using `chrome.storage.local`. This data:
- ✅ Never leaves your device
- ✅ Is not transmitted to any external servers
- ✅ Is not shared with the extension developer or any third parties
- ✅ Can be deleted by uninstalling the extension

## Permissions Used

### Storage Permission
- **Purpose**: Store your configured session times and language preference locally
- **Scope**: Local to your browser only

### Host Permission (docs.google.com/presentation/*)
- **Purpose**: Access Google Slides presentations to detect presentation mode and replace placeholder text with live timers
- **Scope**: Only active on Google Slides presentation pages
- **Data Access**: The Extension reads text content in your slides to find placeholders (like `<<5:00->>`) and replaces them with live timers. No slide content is stored, transmitted, or shared.

## What We DON'T Do

- ❌ We do NOT collect personal information
- ❌ We do NOT use analytics or tracking
- ❌ We do NOT transmit data to external servers
- ❌ We do NOT share data with third parties
- ❌ We do NOT use cookies
- ❌ We do NOT display ads
- ❌ We do NOT access your Google account information

## Third-Party Services

The Extension does NOT use any third-party services, APIs, or analytics tools.

## Children's Privacy

The Extension does not knowingly collect any information from children. The Extension is safe for all ages.

## Changes to This Policy

We may update this privacy policy from time to time. The "Last Updated" date at the top of this policy indicates when it was last revised.

## Open Source

This Extension is open source. You can review the complete source code at:
https://github.com/elpatopedraza/google-slides-timer-chrome

## Contact

If you have questions about this privacy policy, please open an issue on GitHub:
https://github.com/elpatopedraza/google-slides-timer-chrome/issues

---

**Summary**: This Extension stores your session times locally and does not collect, transmit, or share any personal data.
