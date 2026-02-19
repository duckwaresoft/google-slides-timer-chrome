/**
 * Translation Service
 *
 * Responsibility: Centralized translation management for all text in the extension
 * Single Responsibility Principle: Only handles translations
 * Open/Closed Principle: Add new languages without modifying existing code
 *
 * Uses Locale enum for type safety and consistency
 */

// Import Locale enum (for Node.js testing only)
// Check for Node.js environment first to avoid hoisting issues in browser
if (typeof module !== 'undefined' && module.exports && typeof Locale === 'undefined') {
  Locale = require('../constants/Locale');
}

class TranslationService {
  constructor(locale = Locale.EN) {
    // Validate locale is a supported Locale enum value
    if (!Object.values(Locale).includes(locale)) {
      console.warn(`[Slides Timer for GS] Unsupported locale: ${locale}, falling back to ${Locale.EN}`);
      locale = Locale.EN;
    }
    this.locale = locale;

    // Translation dictionary: [Locale][key] = translated string
    this.translations = {
      [Locale.EN]: {
        // Status messages
        'NOT_STARTED': 'Not started yet',
        'IN_PROGRESS': 'In progress',
        'FINISHED': 'Finished',

        // Popup UI
        'POPUP_HOW_IT_WORKS': 'How it works:',
        'POPUP_STEP_1': 'Add placeholders to your Google Slides (e.g., <<time>>)',
        'POPUP_STEP_2': 'Enter presentation mode (press F5 or click Present)',
        'POPUP_STEP_3': 'Placeholders automatically update in real-time!',
        'POPUP_TIMER_TITLE': 'Timer & Time placeholders (no setup needed):',
        'POPUP_SESSION_TITLE': 'Session tracking placeholders:',
        'POPUP_SESSION_WARNING': '⚠️ First configure your session using "Start Date & Time" and "End Date & Time" fields below, then use these placeholders:',
        'POPUP_MODIFIERS_TITLE': 'Format Modifiers (optional):',
        'POPUP_MODIFIERS_DESC': 'Add these symbols to customize time format:',
        'POPUP_MODIFIER_NO_SECONDS': 'remove seconds',
        'POPUP_MODIFIER_24H': '24-hour format',
        'POPUP_EXAMPLES': 'Examples:',
        'POPUP_LABEL_START': 'Start Date & Time:',
        'POPUP_LABEL_END': 'End Date & Time:',
        'POPUP_HINT_DATETIME': 'Click to select date/time, scroll values to adjust',
        'POPUP_BTN_SET': 'Set Times',
        'POPUP_BTN_CLEAR': 'Clear',
        'POPUP_CURRENT_TIME': 'Current Date & Time:',

        // Status messages in popup
        'POPUP_STATUS_SAVED': '✓ Date & times saved! Placeholders in your slides will now update.',
        'POPUP_STATUS_CLEARED': 'Times cleared.',
        'POPUP_STATUS_ENTER_BOTH': 'Please enter both start and end date/times',
        'POPUP_STATUS_NOT_CONFIGURED': '💡 Select start and end date/times above, then click "Set Times" to activate session tracking.',
        'POPUP_STATUS_CONFIGURED': '✓ Session times are configured. Use <<start>>, <<end>>, <<status>> placeholders in your slides.',
        'POPUP_STATUS_LANGUAGE_UPDATED': '✓ Language updated',

        // Placeholder descriptions
        'POPUP_DESC_COUNTDOWN': 'Countdown from 5 min',
        'POPUP_DESC_COUNTUP': 'Countup from 2 min',
        'POPUP_DESC_TIME': 'Current time',
        'POPUP_DESC_DATE': 'Current date',
        'POPUP_DESC_START_END': 'Full date+time',
        'POPUP_DESC_TIME_ONLY': 'Time only',
        'POPUP_DESC_DATE_ONLY': 'Date only',
        'POPUP_DESC_DATE_FULL': 'Full date name',
        'POPUP_DESC_STATUS': '"In progress", "Finished", etc.',
        'POPUP_DESC_TRACKING': 'Time tracking',

        // Language selector
        'POPUP_LANGUAGE_LABEL': 'Language:',
        'POPUP_LANGUAGE_AUTO': 'Auto (Chrome language)',
        'POPUP_LANGUAGE_ENGLISH': 'English',
        'POPUP_LANGUAGE_SPANISH': 'Español',
        'POPUP_LANGUAGE_HINT': 'Override the automatically detected language',

        // Months (abbreviated)
        'MONTH_JAN': 'Jan',
        'MONTH_FEB': 'Feb',
        'MONTH_MAR': 'Mar',
        'MONTH_APR': 'Apr',
        'MONTH_MAY': 'May',
        'MONTH_JUN': 'Jun',
        'MONTH_JUL': 'Jul',
        'MONTH_AUG': 'Aug',
        'MONTH_SEP': 'Sep',
        'MONTH_OCT': 'Oct',
        'MONTH_NOV': 'Nov',
        'MONTH_DEC': 'Dec',
        'MONTH_LONG_JAN': 'January',
        'MONTH_LONG_FEB': 'February',
        'MONTH_LONG_MAR': 'March',
        'MONTH_LONG_APR': 'April',
        'MONTH_LONG_MAY': 'May',
        'MONTH_LONG_JUN': 'June',
        'MONTH_LONG_JUL': 'July',
        'MONTH_LONG_AUG': 'August',
        'MONTH_LONG_SEP': 'September',
        'MONTH_LONG_OCT': 'October',
        'MONTH_LONG_NOV': 'November',
        'MONTH_LONG_DEC': 'December'
      },
      [Locale.ES]: {
        // Status messages
        'NOT_STARTED': 'Aún no ha comenzado',
        'IN_PROGRESS': 'En progreso',
        'FINISHED': 'Finalizado',

        // Popup UI
        'POPUP_HOW_IT_WORKS': 'Cómo funciona:',
        'POPUP_STEP_1': 'Agrega marcadores a tus diapositivas de Google (ej: <<time>>)',
        'POPUP_STEP_2': 'Entra en modo presentación (presiona F5 o haz clic en Presentar)',
        'POPUP_STEP_3': '¡Los marcadores se actualizan automáticamente en tiempo real!',
        'POPUP_TIMER_TITLE': 'Marcadores de temporizador y hora (sin configuración):',
        'POPUP_SESSION_TITLE': 'Marcadores de seguimiento de sesión:',
        'POPUP_SESSION_WARNING': '⚠️ Primero configura tu sesión usando los campos "Fecha y Hora de Inicio" y "Fecha y Hora de Fin" a continuación, luego usa estos marcadores:',
        'POPUP_MODIFIERS_TITLE': 'Modificadores de formato (opcional):',
        'POPUP_MODIFIERS_DESC': 'Agrega estos símbolos para personalizar el formato de la hora:',
        'POPUP_MODIFIER_NO_SECONDS': 'sin segundos',
        'POPUP_MODIFIER_24H': 'formato 24 horas',
        'POPUP_EXAMPLES': 'Ejemplos:',
        'POPUP_LABEL_START': 'Fecha y Hora de Inicio:',
        'POPUP_LABEL_END': 'Fecha y Hora de Fin:',
        'POPUP_HINT_DATETIME': 'Haz clic para seleccionar fecha/hora, desplaza los valores para ajustar',
        'POPUP_BTN_SET': 'Establecer Horas',
        'POPUP_BTN_CLEAR': 'Limpiar',
        'POPUP_CURRENT_TIME': 'Fecha y Hora Actual:',

        // Status messages in popup
        'POPUP_STATUS_SAVED': '✓ ¡Fecha y horas guardadas! Los marcadores en tus diapositivas se actualizarán ahora.',
        'POPUP_STATUS_CLEARED': 'Horas eliminadas.',
        'POPUP_STATUS_ENTER_BOTH': 'Por favor ingresa fecha/hora de inicio y fin',
        'POPUP_STATUS_NOT_CONFIGURED': '💡 Selecciona fecha/hora de inicio y fin arriba, luego haz clic en "Establecer Horas" para activar el seguimiento de sesión.',
        'POPUP_STATUS_CONFIGURED': '✓ Horas de sesión configuradas. Usa los marcadores <<start>>, <<end>>, <<status>> en tus diapositivas.',
        'POPUP_STATUS_LANGUAGE_UPDATED': '✓ Idioma actualizado',

        // Placeholder descriptions
        'POPUP_DESC_COUNTDOWN': 'Cuenta regresiva desde 5 min',
        'POPUP_DESC_COUNTUP': 'Cuenta progresiva desde 2 min',
        'POPUP_DESC_TIME': 'Hora actual',
        'POPUP_DESC_DATE': 'Fecha actual',
        'POPUP_DESC_START_END': 'Fecha+hora completa',
        'POPUP_DESC_TIME_ONLY': 'Solo hora',
        'POPUP_DESC_DATE_ONLY': 'Solo fecha',
        'POPUP_DESC_DATE_FULL': 'Nombre completo de fecha',
        'POPUP_DESC_STATUS': '"En progreso", "Finalizado", etc.',
        'POPUP_DESC_TRACKING': 'Seguimiento de tiempo',

        // Language selector
        'POPUP_LANGUAGE_LABEL': 'Idioma:',
        'POPUP_LANGUAGE_AUTO': 'Automático (idioma de Chrome)',
        'POPUP_LANGUAGE_ENGLISH': 'English',
        'POPUP_LANGUAGE_SPANISH': 'Español',
        'POPUP_LANGUAGE_HINT': 'Anular el idioma detectado automáticamente',

        // Months (abbreviated)
        'MONTH_JAN': 'Ene',
        'MONTH_FEB': 'Feb',
        'MONTH_MAR': 'Mar',
        'MONTH_APR': 'Abr',
        'MONTH_MAY': 'May',
        'MONTH_JUN': 'Jun',
        'MONTH_JUL': 'Jul',
        'MONTH_AUG': 'Ago',
        'MONTH_SEP': 'Sep',
        'MONTH_OCT': 'Oct',
        'MONTH_NOV': 'Nov',
        'MONTH_DEC': 'Dic',
        'MONTH_LONG_JAN': 'Enero',
        'MONTH_LONG_FEB': 'Febrero',
        'MONTH_LONG_MAR': 'Marzo',
        'MONTH_LONG_APR': 'Abril',
        'MONTH_LONG_MAY': 'Mayo',
        'MONTH_LONG_JUN': 'Junio',
        'MONTH_LONG_JUL': 'Julio',
        'MONTH_LONG_AUG': 'Agosto',
        'MONTH_LONG_SEP': 'Septiembre',
        'MONTH_LONG_OCT': 'Octubre',
        'MONTH_LONG_NOV': 'Noviembre',
        'MONTH_LONG_DEC': 'Diciembre'
      }
      // Future: Add more languages here
    };
  }

  /**
   * Get current locale
   * @returns {string} Current locale enum value (e.g., Locale.EN)
   */
  getLocale() {
    return this.locale;
  }

  /**
   * Set locale for translations
   * @param {string} locale - Locale enum value (e.g., Locale.EN, Locale.ES)
   */
  setLocale(locale) {
    // Validate locale
    if (!Object.values(Locale).includes(locale)) {
      console.warn(`[Slides Timer for GS] Unsupported locale: ${locale}, falling back to ${Locale.EN}`);
      locale = Locale.EN;
    }
    this.locale = locale;
  }

  /**
   * Translate a key to the current locale
   * @param {string} key - Translation key (e.g., 'NOT_STARTED')
   * @returns {string} Translated string, or key if not found
   */
  translate(key) {
    if (!key) return '';

    // Get translation for current locale
    const translation = this.translations[this.locale]?.[key];

    // Fallback to English if translation missing
    if (!translation && this.locale !== Locale.EN) {
      return this.translations[Locale.EN]?.[key] || key;
    }

    return translation || key;
  }

  /**
   * Check if a locale is supported
   * @param {string} locale - Locale enum value to check (e.g., Locale.EN)
   * @returns {boolean} True if locale is supported
   */
  hasLocale(locale) {
    return this.translations.hasOwnProperty(locale);
  }

  /**
   * Get all supported locales
   * @returns {string[]} Array of locale enum values (e.g., [Locale.EN, Locale.ES])
   */
  getSupportedLocales() {
    return Object.keys(this.translations);
  }
}

// Export for Node.js (testing) and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TranslationService;
}
