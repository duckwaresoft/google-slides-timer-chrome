// Content script entry point - uses SOLID architecture
// This file wires up all the services using dependency injection

// Import all services (in browser, these are loaded via script tags in manifest)
// For now, we'll assume they're available globally

/**
 * Initialize the extension with dependency injection
 */
async function initializeExtension() {
  // Check if extension context is valid
  if (!chrome.runtime?.id) {
    console.log('[Slides Timer for GS] Extension context invalid');
    return;
  }

  // Instantiate all services (Dependency Injection)
  const presentationModeDetector = new PresentationModeDetector();
  const storageService = new StorageService(chrome.storage.local);
  const placeholderParser = new PlaceholderParser();
  const timerManager = new TimerManager();
  const sessionCalculator = new SessionStatusCalculator();
  const domNodeTracker = new DOMNodeTracker();

  // Create i18n services
  const translationService = new TranslationService(Locale.EN);  // Initialize with default
  const languageDetector = new LanguageDetector(chrome.i18n, translationService);
  const autoDetectedLocale = languageDetector.detectLocale();

  // Debug: Log what was detected
  console.debug('[Slides Timer for GS] Chrome UI Language:', chrome.i18n?.getUILanguage?.());
  console.debug('[Slides Timer for GS] Auto-detected locale:', autoDetectedLocale);
  console.debug('[Slides Timer for GS] Supported locales:', translationService.getSupportedLocales());

  // Load saved language preference (respects user override)
  const savedLanguage = await storageService.getLanguage();
  console.debug('[Slides Timer for GS] Saved language preference:', savedLanguage);

  // Determine active locale (user preference overrides auto-detection)
  let activeLocale;
  if (!savedLanguage || savedLanguage === 'auto') {
    activeLocale = autoDetectedLocale;
  } else {
    // Map language code to Locale enum
    activeLocale = savedLanguage === 'en' ? Locale.EN : savedLanguage === 'es' ? Locale.ES : autoDetectedLocale;
  }

  console.debug('[Slides Timer for GS] Active locale:', activeLocale);

  translationService.setLocale(activeLocale);  // Set active locale

  // Create TimeFormatter with TranslationService for i18n month names
  const timeFormatter = new TimeFormatter(translationService);

  const statusFormatter = new StatusFormatter(translationService);

  // Create placeholder replacer with its dependencies
  const placeholderReplacer = new PlaceholderReplacer(
    timeFormatter,
    timerManager,
    sessionCalculator,
    statusFormatter  // NEW parameter
  );

  // Create main extension instance with all services
  const extension = new SlidesTimerExtension({
    presentationModeDetector,
    storageService,
    placeholderParser,
    timeFormatter,
    timerManager,
    sessionCalculator,
    placeholderReplacer,
    domNodeTracker,
    translationService,
    statusFormatter
  });

  // Initialize
  extension.init();

  // Expose for debugging
  window.slidesTimerExtension = extension;

  // Cleanup on page unload
  window.addEventListener('unload', () => {
    extension.destroy();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeExtension);
} else {
  initializeExtension();
}
