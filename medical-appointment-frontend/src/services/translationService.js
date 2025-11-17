/**
 * Service de traduction pour le contenu dynamique (notes médicales, etc.)
 * Utilise l'API MyMemory (gratuite, 1000 requêtes/jour)
 */

// Cache pour éviter de refaire les mêmes traductions
const translationCache = new Map();

/**
 * Traduit un texte d'une langue source vers une langue cible
 * @param {string} text - Texte à traduire
 * @param {string} targetLang - Langue cible (en, fr, ar)
 * @param {string} sourceLang - Langue source (par défaut: fr)
 * @returns {Promise<string>} - Texte traduit
 */
export const translateText = async (text, targetLang, sourceLang = 'fr') => {
  // Si la langue cible est la même que la langue source, retourner le texte original
  if (targetLang === sourceLang) {
    return text;
  }

  // Si le texte est vide, retourner tel quel
  if (!text || text.trim() === '') {
    return text;
  }

  // Créer une clé de cache unique
  const cacheKey = `${text}_${sourceLang}_${targetLang}`;

  // Vérifier si la traduction est déjà en cache
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    // Appel à l'API MyMemory
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData) {
      const translatedText = data.responseData.translatedText;

      // Mettre en cache la traduction
      translationCache.set(cacheKey, translatedText);

      return translatedText;
    } else {
      // En cas d'erreur API, retourner le texte original
      console.warn('Translation API error:', data);
      return text;
    }
  } catch (error) {
    // En cas d'erreur réseau, retourner le texte original
    console.error('Translation error:', error);
    return text;
  }
};

/**
 * Traduit plusieurs textes en une seule fois
 * @param {string[]} texts - Tableau de textes à traduire
 * @param {string} targetLang - Langue cible
 * @param {string} sourceLang - Langue source
 * @returns {Promise<string[]>} - Tableau de textes traduits
 */
export const translateMultiple = async (texts, targetLang, sourceLang = 'fr') => {
  const promises = texts.map(text => translateText(text, targetLang, sourceLang));
  return Promise.all(promises);
};

/**
 * Nettoie le cache de traduction
 */
export const clearTranslationCache = () => {
  translationCache.clear();
};

export default {
  translateText,
  translateMultiple,
  clearTranslationCache
};
