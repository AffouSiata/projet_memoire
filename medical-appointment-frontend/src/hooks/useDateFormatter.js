import { useTranslation } from 'react-i18next';
import { useMemo, useCallback } from 'react';

/**
 * Hook personnalisé pour formater les dates en fonction de la langue actuelle
 * Ce hook se re-calcule automatiquement quand la langue change
 */
export const useDateFormatter = () => {
  const { i18n } = useTranslation();

  const localeCode = useMemo(() => {
    const language = i18n.language || 'fr';
    const localeMap = {
      'fr': 'fr-FR',
      'en': 'en-US'
    };
    return localeMap[language] || 'fr-FR';
  }, [i18n.language]);

  const formatDate = useCallback((date, options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(localeCode, options);
  }, [localeCode]);

  const formatTime = useCallback((date, options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(localeCode, options);
  }, [localeCode]);

  const formatDateTime = useCallback((date, options = {}) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(localeCode, options);
  }, [localeCode]);

  return {
    formatDate,
    formatTime,
    formatDateTime,
    locale: localeCode
  };
};

// Format presets
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
