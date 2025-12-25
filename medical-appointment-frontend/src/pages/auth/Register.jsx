import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import authService from '../../services/authService';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateName,
  validatePhone,
  validateNumeroOrdre,
  validateRequired
} from '../../utils/validators';
import {
  UserCircleIcon,
  UserGroupIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  BeakerIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  SparklesIcon,
  HeartIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [role, setRole] = useState('PATIENT');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    motDePasse: '',
    confirmPassword: '',
    telephone: '',
    specialite: '',
    numeroOrdre: '',
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Charger les spécialités depuis localStorage
  const defaultSpecialties = [
    'Cardiologie',
    'Pédiatrie',
    'Dermatologie',
    'Neurologie',
    'Ophtalmologie',
    'Psychiatrie',
    'Gynécologie',
    'Médecine générale',
  ];

  const [specialties] = useState(() => {
    const saved = localStorage.getItem('medicalSpecialties');
    return saved ? JSON.parse(saved) : defaultSpecialties;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const validateForm = () => {
    const errors = {};

    // Validation du nom
    const nomResult = validateName(formData.nom, 'Le nom');
    if (!nomResult.valid) errors.nom = nomResult.message;

    // Validation du prénom
    const prenomResult = validateName(formData.prenom, 'Le prénom');
    if (!prenomResult.valid) errors.prenom = prenomResult.message;

    // Validation de l'email
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) errors.email = emailResult.message;

    // Validation du téléphone
    const phoneResult = validatePhone(formData.telephone);
    if (!phoneResult.valid) errors.telephone = phoneResult.message;

    // Validation du mot de passe
    const passwordResult = validatePassword(formData.motDePasse);
    if (!passwordResult.valid) errors.motDePasse = passwordResult.message;

    // Validation de la confirmation du mot de passe
    const confirmResult = validatePasswordMatch(formData.motDePasse, formData.confirmPassword);
    if (!confirmResult.valid) errors.confirmPassword = confirmResult.message;

    // Validations spécifiques aux médecins
    if (role === 'MEDECIN') {
      const specialiteResult = validateRequired(formData.specialite, 'La spécialité');
      if (!specialiteResult.valid) errors.specialite = specialiteResult.message;

      const numeroOrdreResult = validateNumeroOrdre(formData.numeroOrdre);
      if (!numeroOrdreResult.valid) errors.numeroOrdre = numeroOrdreResult.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        ...formData,
        role: role,
      };
      delete registrationData.confirmPassword;

      await authService.register(registrationData);

      // Redirection immédiate vers la page de connexion
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, t('register.errorRegistration')));
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center animate-scale-in border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <div className="relative inline-block">
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl ${
                  role === 'MEDECIN'
                    ? 'bg-orange-600'
                    : 'bg-blue-700'
                }`}>
                  {role === 'MEDECIN' ? (
                    <ClockIcon className="w-12 h-12 text-white" />
                  ) : (
                    <CheckCircleIcon className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {role === 'MEDECIN' ? t('register.pendingApprovalTitle') : t('register.successTitle')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {successMessage}
            </p>
            {role === 'MEDECIN' && (
              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-6">
                <p className="text-sm text-orange-800 dark:text-orange-300 font-medium flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  {t('register.doctorPendingInfo')}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/login')}
              className="w-full px-8 py-4 bg-blue-700 text-white font-bold rounded-2xl hover:bg-blue-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {t('register.goToLogin')}
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <SparklesIcon className="w-10 h-10 text-blue-700 dark:text-blue-400 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-black text-blue-700 dark:text-blue-500">
                Nexus Health
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-medium">
              {t('register.welcomeSubtitle')}
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Patient Card */}
            <button
              onClick={() => handleRoleSelection('PATIENT')}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-200 dark:border-gray-700 animate-slide-up overflow-hidden"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-700 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-24 h-24 bg-blue-700 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <UserCircleIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('register.patientRole')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {t('register.patientDescription')}
                </p>

                {/* Features */}
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{t('register.patientFeature1')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{t('register.patientFeature2')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{t('register.patientFeature3')}</span>
                  </li>
                </ul>

                {/* Action */}
                <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400 font-bold group-hover:gap-4 transition-all">
                  <span>{t('register.submit')}</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Doctor Card */}
            <button
              onClick={() => handleRoleSelection('MEDECIN')}
              className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-200 dark:border-gray-700 animate-slide-up overflow-hidden"
              style={{ animationDelay: '150ms' }}
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-blue-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-blue-700 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="relative w-24 h-24 bg-blue-700 rounded-3xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                      <UserGroupIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('register.doctorRole')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {t('register.doctorDescription')}
                </p>

                {/* Features */}
                <ul className="space-y-3 text-left mb-6">
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{t('register.doctorFeature1')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{t('register.doctorFeature2')}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{t('register.doctorFeature3')}</span>
                  </li>
                </ul>

                {/* Verification notice */}
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-3 mb-4">
                  <p className="text-xs text-orange-800 dark:text-orange-300 font-medium flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4" />
                    {t('register.doctorVerificationNotice')}
                  </p>
                </div>

                {/* Action */}
                <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-400 font-bold group-hover:gap-4 transition-all">
                  <span>{t('register.submit')}</span>
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <p className="text-gray-600 dark:text-gray-400">
              {t('register.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                {t('register.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6 border border-blue-200 dark:border-blue-800">
              {role === 'PATIENT' ? (
                <UserCircleIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              ) : (
                <UserGroupIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              )}
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                {role === 'PATIENT' ? t('register.patientRole') : t('register.doctorRole')}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              {t('register.formTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {role === 'PATIENT' ? t('register.patientFormSubtitle') : t('register.doctorFormSubtitle')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3 animate-shake">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 font-bold">!</span>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom & Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.lastName')} *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                    fieldErrors.nom
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder={t('register.lastNamePlaceholder')}
                />
                {fieldErrors.nom && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.nom}
                  </p>
                )}
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t('register.firstName')} *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                    fieldErrors.prenom
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder={t('register.firstNamePlaceholder')}
                />
                {fieldErrors.prenom && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.prenom}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4" />
                {t('register.email')} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder={t('register.emailPlaceholder')}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Téléphone */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <PhoneIcon className="w-4 h-4" />
                {t('register.phone')} *
              </label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                  fieldErrors.telephone
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
                placeholder={t('register.phonePlaceholder')}
              />
              {fieldErrors.telephone && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {fieldErrors.telephone}
                </p>
              )}
            </div>

            {/* Champs médecin */}
            {role === 'MEDECIN' && (
              <>
                <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-6 mt-6">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('register.professionalInfo')}
                    </h3>
                  </div>

                  {/* Spécialité */}
                  <div className="group mb-5">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <BeakerIcon className="w-4 h-4" />
                      {t('register.specialty')} *
                    </label>
                    <select
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                        fieldErrors.specialite
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                    >
                      <option value="">{t('register.selectSpecialty')}</option>
                      {specialties.map((specialty, index) => (
                        <option key={index} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.specialite && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {fieldErrors.specialite}
                      </p>
                    )}
                  </div>

                  {/* Numéro d'ordre */}
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4" />
                      {t('register.registrationNumber')} *
                    </label>
                    <input
                      type="text"
                      name="numeroOrdre"
                      value={formData.numeroOrdre}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                        fieldErrors.numeroOrdre
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                          : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                      }`}
                      placeholder={t('register.registrationNumberPlaceholder')}
                    />
                    {fieldErrors.numeroOrdre ? (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {fieldErrors.numeroOrdre}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <DocumentTextIcon className="w-3 h-3" />
                        {t('register.registrationNumberHelp')}
                      </p>
                    )}
                  </div>

                  {/* Info box */}
                  <div className="mt-5 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <ClockIcon className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-1">
                          {t('register.verificationTitle')}
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-400">
                          {t('register.verificationMessage')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4" />
                  {t('register.password')} *
                </label>
                <input
                  type="password"
                  name="motDePasse"
                  value={formData.motDePasse}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                    fieldErrors.motDePasse
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="••••••••"
                />
                {fieldErrors.motDePasse && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.motDePasse}
                  </p>
                )}
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4" />
                  {t('register.confirmPassword')} *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                    fieldErrors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  placeholder="••••••••"
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 hover:gap-3"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                {t('register.back')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 px-8 py-4 font-bold rounded-2xl text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                  role === 'PATIENT'
                    ? 'bg-blue-700 hover:bg-blue-800'
                    : 'bg-blue-700 hover:bg-blue-800'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:scale-105'}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('register.submitting')}
                  </>
                ) : (
                  <>
                    {t('register.submit')}
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              {t('register.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
                {t('register.loginLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
