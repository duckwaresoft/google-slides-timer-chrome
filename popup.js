// DOM elements
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const setTimesBtn = document.getElementById('setTimes');
const clearTimesBtn = document.getElementById('clearTimes');
const statusDiv = document.getElementById('status');
const currentTimeDiv = document.getElementById('currentTime');
const languageSelect = document.getElementById('languageSelect');

let updateInterval = null;

// Initialize i18n services
const translationService = new TranslationService(Locale.EN);
const languageDetector = new LanguageDetector(chrome.i18n, translationService);

// Auto-detected locale (will be used if no preference saved)
const autoDetectedLocale = languageDetector.detectLocale();

console.log('[Slides Timer for GS Popup] Auto-detected locale:', autoDetectedLocale);

/**
 * Initialize language from storage and set up listener
 */
async function initializeLanguage() {
  // Load saved language preference
  const savedLanguage = await new Promise((resolve) => {
    chrome.storage.local.get(['language'], (result) => {
      resolve(result.language || 'auto');
    });
  });

  console.log('[Slides Timer for GS Popup] Saved language preference:', savedLanguage);

  // Set dropdown value
  languageSelect.value = savedLanguage;

  // Determine active locale
  let activeLocale;
  if (savedLanguage === 'auto') {
    activeLocale = autoDetectedLocale;
  } else {
    // Map language code to Locale enum
    activeLocale = savedLanguage === 'en' ? Locale.EN : savedLanguage === 'es' ? Locale.ES : autoDetectedLocale;
  }

  console.log('[Slides Timer for GS Popup] Active locale:', activeLocale);

  // Set locale in translation service
  translationService.setLocale(activeLocale);

  // Translate UI
  translateUI();

  // Set up language change listener
  languageSelect.addEventListener('change', async (e) => {
    const newLanguage = e.target.value;
    console.log('[Slides Timer for GS Popup] Language changed to:', newLanguage);

    // Save preference
    await new Promise((resolve) => {
      chrome.storage.local.set({ language: newLanguage }, resolve);
    });

    // Update active locale
    let newLocale;
    if (newLanguage === 'auto') {
      newLocale = autoDetectedLocale;
    } else {
      newLocale = newLanguage === 'en' ? Locale.EN : newLanguage === 'es' ? Locale.ES : autoDetectedLocale;
    }

    console.log('[Slides Timer for GS Popup] New active locale:', newLocale);

    // Update translation service
    translationService.setLocale(newLocale);

    // Re-translate UI
    translateUI();

    // Re-update status to reflect new language
    updateStatus();

    // Show confirmation message
    statusDiv.textContent = translationService.translate('POPUP_STATUS_LANGUAGE_UPDATED');
    setTimeout(() => {
      updateStatus(); // Restore previous status message in new language
    }, 2000);
  });

  // Load saved times AFTER language is initialized
  loadSavedTimes();
}

/**
 * Translate all elements with data-i18n attributes
 */
function translateUI() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = translationService.translate(key);

    // Handle special cases where we need to preserve HTML structure
    if (key === 'POPUP_STEP_1') {
      element.innerHTML = translation.replace('<<time>>', '<code>&lt;&lt;time&gt;&gt;</code>');
    } else {
      element.textContent = translation;
    }
  });

  // Also set input titles
  const startTimeInput = document.getElementById('startTime');
  const endTimeInput = document.getElementById('endTime');
  const hint = translationService.translate('POPUP_HINT_DATETIME');
  if (startTimeInput) startTimeInput.title = hint;
  if (endTimeInput) endTimeInput.title = hint;
}

// Initialize language and translate UI on load
document.addEventListener('DOMContentLoaded', initializeLanguage);

/**
 * Check if time string is old format (HH:MM or HH:MM:SS)
 */
function isOldFormat(timeStr) {
  return /^\d{1,2}:\d{2}(:\d{2})?$/.test(timeStr);
}

/**
 * Migrate old time format to ISO 8601 (today's date)
 */
function migrateTimeToToday(timeStr) {
  const now = new Date();
  const [hours, minutes, seconds = 0] = timeStr.split(':').map(Number);
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds);

  // Return ISO 8601 format without milliseconds and timezone
  return date.toISOString().slice(0, 19);  // "2026-02-18T14:00:00"
}

/**
 * Format ISO string for datetime-local input
 * datetime-local expects "YYYY-MM-DDTHH:mm" (no seconds, no Z)
 */
function formatForDateTimeLocal(isoStr) {
  if (!isoStr) return '';

  // Handle full ISO 8601 or partial formats
  if (isoStr.includes('T')) {
    return isoStr.slice(0, 16);  // "2026-02-18T14:00"
  }

  return isoStr;
}

// Event listeners (set up immediately)
setTimesBtn.addEventListener('click', saveTimes);
clearTimesBtn.addEventListener('click', clearTimes);

// Load saved times from storage
function loadSavedTimes() {
  chrome.storage.local.get(['startTime', 'endTime'], (result) => {
    let startTime = result.startTime;
    let endTime = result.endTime;

    // Migrate old format to ISO 8601 if needed
    let migrated = false;

    if (startTime && isOldFormat(startTime)) {
      console.log('[Slides Timer for GS Popup] Migrating start time from old format:', startTime);
      startTime = migrateTimeToToday(startTime);
      migrated = true;
    }

    if (endTime && isOldFormat(endTime)) {
      console.log('[Slides Timer for GS Popup] Migrating end time from old format:', endTime);
      endTime = migrateTimeToToday(endTime);
      migrated = true;
    }

    // Save migrated times back to storage
    if (migrated) {
      chrome.storage.local.set({ startTime, endTime }, () => {
        console.log('[Slides Timer for GS Popup] Migration complete:', { startTime, endTime });
      });
    }

    // Set input values
    if (startTime) {
      startTimeInput.value = formatForDateTimeLocal(startTime);
    }
    if (endTime) {
      endTimeInput.value = formatForDateTimeLocal(endTime);
    }

    updateStatus();
    startUpdating();
  });
}

// Save times to storage
function saveTimes() {
  const startTime = startTimeInput.value;  // "2026-02-18T14:00"
  const endTime = endTimeInput.value;      // "2026-02-18T16:00"

  if (!startTime || !endTime) {
    alert(translationService.translate('POPUP_STATUS_ENTER_BOTH'));
    return;
  }

  // Convert to full ISO 8601 format with seconds
  const startISO = startTime.length === 16 ? startTime + ':00' : startTime;
  const endISO = endTime.length === 16 ? endTime + ':00' : endTime;

  console.log('[Slides Timer for GS Popup] Saving times:', {
    startTime: startISO,
    endTime: endISO
  });

  chrome.storage.local.set({
    startTime: startISO,
    endTime: endISO
  }, () => {
    console.log('[Slides Timer for GS Popup] Times saved successfully');
    statusDiv.textContent = translationService.translate('POPUP_STATUS_SAVED');

    // Verify storage
    chrome.storage.local.get(['startTime', 'endTime'], (result) => {
      console.log('[Slides Timer for GS Popup] Verified storage:', result);
    });

    updateStatus();
    startUpdating();
  });
}

// Clear saved times
function clearTimes() {
  chrome.storage.local.remove(['startTime', 'endTime'], () => {
    startTimeInput.value = '';
    endTimeInput.value = '';
    statusDiv.textContent = translationService.translate('POPUP_STATUS_CLEARED');
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });
}

// Start updating the display
function startUpdating() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateDisplay();
  updateInterval = setInterval(updateDisplay, 1000);
}

// Update the display with current information
function updateDisplay() {
  const now = new Date();

  // Get localized month name
  const monthKeys = [
    'MONTH_JAN', 'MONTH_FEB', 'MONTH_MAR', 'MONTH_APR', 'MONTH_MAY', 'MONTH_JUN',
    'MONTH_JUL', 'MONTH_AUG', 'MONTH_SEP', 'MONTH_OCT', 'MONTH_NOV', 'MONTH_DEC'
  ];
  const month = translationService.translate(monthKeys[now.getMonth()]);
  const day = now.getDate();
  const year = now.getFullYear();

  // Format time in 12-hour format with AM/PM
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutesStr = String(minutes).padStart(2, '0');
  const secondsStr = String(seconds).padStart(2, '0');

  // Show date and time (localized month)
  currentTimeDiv.textContent = `${month} ${day}, ${year} ${hours}:${minutesStr}:${secondsStr} ${ampm}`;
}

// Update status message
function updateStatus() {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (!startTime || !endTime) {
    statusDiv.textContent = translationService.translate('POPUP_STATUS_NOT_CONFIGURED');
    statusDiv.style.color = '#666';
    statusDiv.style.fontStyle = 'italic';
  } else {
    // Show confirmation that times are set
    statusDiv.textContent = translationService.translate('POPUP_STATUS_CONFIGURED');
    statusDiv.style.color = '#28a745';
    statusDiv.style.fontStyle = 'normal';
  }
}

// Clean up interval when popup closes
window.addEventListener('unload', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});
