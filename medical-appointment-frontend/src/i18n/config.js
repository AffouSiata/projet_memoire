import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationFR from '../locales/fr/translation.json';
import translationEN from '../locales/en/translation.json';

const resources = {
  fr: {
    translation: translationFR
  },
  en: {
    translation: translationEN
  }
};

// Récupérer la langue sauvegardée ou utiliser le français par défaut
const savedLanguage = localStorage.getItem('language') || 'fr';

i18n
  .use(initReactI18next) // Passe i18n à react-i18next
  .init({
    resources,
    lng: savedLanguage, // Langue choisie par l'utilisateur (persiste)
    fallbackLng: 'fr', // Langue de secours si la langue choisie n'existe pas
    debug: false,
    interpolation: {
      escapeValue: false // React échappe déjà par défaut
    },
    // Options pour forcer le re-render de tous les composants
    react: {
      useSuspense: false, // Désactiver Suspense pour un chargement plus rapide
      bindI18n: 'languageChanged', // Re-render quand la langue change
      bindI18nStore: 'added', // Re-render quand des traductions sont ajoutées
      transEmptyNodeValue: '', // Valeur par défaut pour les nodes vides
      transSupportBasicHtmlNodes: true, // Support HTML basique
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // Tags HTML autorisés
    }
  });

// Écouter les changements de langue pour sauvegarder dans localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  // Mettre à jour la langue du document
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = lng;

  // Forcer le re-render de tous les composants React
  // En déclenchant un événement personnalisé que les composants peuvent écouter
  window.dispatchEvent(new Event('languageChanged'));
});

export default i18n;
