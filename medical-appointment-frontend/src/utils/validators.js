/**
 * Utilitaires de validation pour les formulaires
 * Centralise toutes les règles de validation du frontend
 */

// Expressions régulières communes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+225|00225)?[0-9]{10}$/; // Format Côte d'Ivoire
const TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Valide un email
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, message: 'L\'email est requis' };
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return { valid: false, message: 'Format d\'email invalide' };
  }
  return { valid: true, message: '' };
};

/**
 * Valide un mot de passe
 * @param {string} password
 * @param {Object} options
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePassword = (password, options = { minLength: 6 }) => {
  if (!password) {
    return { valid: false, message: 'Le mot de passe est requis' };
  }
  if (password.length < options.minLength) {
    return { valid: false, message: `Le mot de passe doit contenir au moins ${options.minLength} caractères` };
  }
  return { valid: true, message: '' };
};

/**
 * Valide la confirmation du mot de passe
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, message: 'La confirmation du mot de passe est requise' };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: 'Les mots de passe ne correspondent pas' };
  }
  return { valid: true, message: '' };
};

/**
 * Valide un nom (prénom ou nom de famille)
 * @param {string} name
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateName = (name, fieldName = 'Ce champ') => {
  if (!name || name.trim() === '') {
    return { valid: false, message: `${fieldName} est requis` };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: `${fieldName} doit contenir au moins 2 caractères` };
  }
  if (name.trim().length > 50) {
    return { valid: false, message: `${fieldName} ne peut pas dépasser 50 caractères` };
  }
  return { valid: true, message: '' };
};

/**
 * Valide un numéro de téléphone
 * @param {string} phone
 * @returns {{ valid: boolean, message: string }}
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return { valid: false, message: 'Le numéro de téléphone est requis' };
  }
  // Nettoyer le numéro (supprimer espaces et tirets)
  const cleanPhone = phone.replace(/[\s-]/g, '');
  if (!PHONE_REGEX.test(cleanPhone)) {
    return { valid: false, message: 'Format de téléphone invalide (ex: 0701020304)' };
  }
  return { valid: true, message: '' };
};

/**
 * Valide une date de naissance
 * @param {string} date
 * @returns {{ valid: boolean, message: string }}
 */
export const validateDateOfBirth = (date) => {
  if (!date) {
    return { valid: true, message: '' }; // Optionnel
  }

  const birthDate = new Date(date);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return { valid: false, message: 'Date de naissance invalide' };
  }

  if (birthDate >= today) {
    return { valid: false, message: 'La date de naissance doit être dans le passé' };
  }

  // Vérifier que l'âge est raisonnable (0-120 ans)
  const age = today.getFullYear() - birthDate.getFullYear();
  if (age > 120) {
    return { valid: false, message: 'Date de naissance invalide' };
  }

  return { valid: true, message: '' };
};

/**
 * Valide un champ requis
 * @param {any} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  if (value === null || value === undefined || value === '' ||
      (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: `${fieldName} est requis` };
  }
  return { valid: true, message: '' };
};

/**
 * Valide un numéro d'ordre médecin
 * @param {string} numeroOrdre
 * @returns {{ valid: boolean, message: string }}
 */
export const validateNumeroOrdre = (numeroOrdre) => {
  if (!numeroOrdre || numeroOrdre.trim() === '') {
    return { valid: false, message: 'Le numéro d\'ordre est requis' };
  }
  if (numeroOrdre.trim().length < 5) {
    return { valid: false, message: 'Le numéro d\'ordre doit contenir au moins 5 caractères' };
  }
  return { valid: true, message: '' };
};

/**
 * Valide un créneau horaire
 * @param {string} heureDebut
 * @param {string} heureFin
 * @returns {{ valid: boolean, message: string }}
 */
export const validateTimeSlot = (heureDebut, heureFin) => {
  if (!heureDebut) {
    return { valid: false, message: 'L\'heure de début est requise' };
  }
  if (!heureFin) {
    return { valid: false, message: 'L\'heure de fin est requise' };
  }

  if (!TIME_REGEX.test(heureDebut)) {
    return { valid: false, message: 'Format d\'heure de début invalide (HH:MM)' };
  }
  if (!TIME_REGEX.test(heureFin)) {
    return { valid: false, message: 'Format d\'heure de fin invalide (HH:MM)' };
  }

  const [startHour, startMin] = heureDebut.split(':').map(Number);
  const [endHour, endMin] = heureFin.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes >= endMinutes) {
    return { valid: false, message: 'L\'heure de fin doit être après l\'heure de début' };
  }

  if (endMinutes - startMinutes < 30) {
    return { valid: false, message: 'Le créneau doit durer au moins 30 minutes' };
  }

  // Heures de travail raisonnables (6h - 22h)
  if (startHour < 6 || endHour > 22) {
    return { valid: false, message: 'Les créneaux doivent être entre 06:00 et 22:00' };
  }

  return { valid: true, message: '' };
};

/**
 * Valide le contenu d'une note médicale
 * @param {string} contenu
 * @returns {{ valid: boolean, message: string }}
 */
export const validateNoteContent = (contenu) => {
  if (!contenu || contenu.trim() === '') {
    return { valid: false, message: 'Le contenu de la note est requis' };
  }
  if (contenu.trim().length < 10) {
    return { valid: false, message: 'Le contenu doit contenir au moins 10 caractères' };
  }
  if (contenu.length > 5000) {
    return { valid: false, message: 'Le contenu ne peut pas dépasser 5000 caractères' };
  }
  return { valid: true, message: '' };
};

/**
 * Valide une date de rendez-vous
 * @param {string} date
 * @returns {{ valid: boolean, message: string }}
 */
export const validateAppointmentDate = (date) => {
  if (!date) {
    return { valid: false, message: 'La date est requise' };
  }

  const appointmentDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(appointmentDate.getTime())) {
    return { valid: false, message: 'Date invalide' };
  }

  if (appointmentDate < today) {
    return { valid: false, message: 'La date ne peut pas être dans le passé' };
  }

  // Maximum 3 mois dans le futur
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  if (appointmentDate > maxDate) {
    return { valid: false, message: 'La date ne peut pas être à plus de 3 mois' };
  }

  return { valid: true, message: '' };
};

/**
 * Valide un fichier uploadé
 * @param {File} file
 * @param {Object} options
 * @returns {{ valid: boolean, message: string }}
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  } = options;

  if (!file) {
    return { valid: true, message: '' }; // Fichier optionnel
  }

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { valid: false, message: `Le fichier ne peut pas dépasser ${maxSizeMB}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Type de fichier non autorisé (PDF, JPEG, PNG, DOC, DOCX)' };
  }

  return { valid: true, message: '' };
};

/**
 * Valide une adresse
 * @param {string} adresse
 * @returns {{ valid: boolean, message: string }}
 */
export const validateAddress = (adresse) => {
  if (!adresse || adresse.trim() === '') {
    return { valid: true, message: '' }; // Optionnel
  }
  if (adresse.trim().length < 5) {
    return { valid: false, message: 'L\'adresse doit contenir au moins 5 caractères' };
  }
  if (adresse.length > 200) {
    return { valid: false, message: 'L\'adresse ne peut pas dépasser 200 caractères' };
  }
  return { valid: true, message: '' };
};

/**
 * Valide un formulaire complet
 * @param {Object} data - Les données du formulaire
 * @param {Object} rules - Les règles de validation { field: validatorFunction }
 * @returns {{ valid: boolean, errors: Object }}
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let valid = true;

  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    if (!result.valid) {
      errors[field] = result.message;
      valid = false;
    }
  }

  return { valid, errors };
};

/**
 * Hook de validation pour les formulaires React
 * Retourne les erreurs et une fonction de validation
 */
export const createFormValidator = (rules) => {
  return (data) => validateForm(data, rules);
};

export default {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validatePhone,
  validateDateOfBirth,
  validateRequired,
  validateNumeroOrdre,
  validateTimeSlot,
  validateNoteContent,
  validateAppointmentDate,
  validateFile,
  validateAddress,
  validateForm,
  createFormValidator
};
