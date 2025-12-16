/**
 * Map i18n language codes to locale codes for date formatting
 */
const getLocaleCode = () => {
  // Récupérer la langue depuis localStorage (synchronisé avec i18next)
  const language = localStorage.getItem('language') || 'fr';
  const localeMap = {
    'fr': 'fr-FR',
    'en': 'en-US'
  };
  return localeMap[language] || 'fr-FR';
};

/**
 * Format date using the current application language
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getLocaleCode();
  return dateObj.toLocaleDateString(locale, options);
};

/**
 * Format time using the current application language
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted time string
 */
export const formatTime = (date, options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getLocaleCode();
  return dateObj.toLocaleTimeString(locale, options);
};

/**
 * Format date and time using the current application language
 * @param {Date|string} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date-time string
 */
export const formatDateTime = (date, options = {}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = getLocaleCode();
  return dateObj.toLocaleString(locale, options);
};

// Common format presets
export const dateFormats = {
  short: { day: 'numeric', month: 'short' },
  medium: { day: 'numeric', month: 'short', year: 'numeric' },
  long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  monthLong: { day: 'numeric', month: 'long' },
  weekday: { weekday: 'long' }
};

export const timeFormats = {
  short: { hour: '2-digit', minute: '2-digit' },
  full: { hour: '2-digit', minute: '2-digit', second: '2-digit' }
};
