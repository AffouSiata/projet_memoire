import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateAddress,
  validatePassword,
  validatePasswordMatch,
  validateRequired
} from '../../utils/validators';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  PencilIcon,
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  HeartIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    specialite: '',
    adresse: '',
  });

  const [professionalSummary, setProfessionalSummary] = useState({
    nextAppointment: null,
    appointmentsThisMonth: 0,
    totalPatients: 0,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await medecinService.getProfile();
      const data = response.data?.data || response.data;

      setProfileData({
        prenom: data.prenom || '',
        nom: data.nom || '',
        email: data.email || '',
        telephone: data.telephone || '',
        specialite: data.specialite || '',
        adresse: data.adresse || '',
      });

      // Load professional summary
      await loadProfessionalSummary();
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError(t('medecin.profile.save_error'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfessionalSummary = async () => {
    try {
      const [appointmentsResponse, patientsResponse] = await Promise.all([
        medecinService.getAppointments(),
        medecinService.getPatients(),
      ]);

      const appointments = appointmentsResponse.data?.data || appointmentsResponse.data || [];
      const patients = patientsResponse.data?.data || patientsResponse.data || [];

      // Get next appointment
      const futureAppointments = appointments
        .filter(apt => new Date(apt.dateHeure) > new Date() && apt.statut === 'CONFIRME')
        .sort((a, b) => new Date(a.dateHeure) - new Date(b.dateHeure));

      // Count appointments this month
      const now = new Date();
      const thisMonthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.dateHeure);
        return aptDate.getMonth() === now.getMonth() &&
               aptDate.getFullYear() === now.getFullYear();
      });

      setProfessionalSummary({
        nextAppointment: futureAppointments[0] || null,
        appointmentsThisMonth: thisMonthAppointments.length,
        totalPatients: patients.length,
      });
    } catch (err) {
      console.error('Erreur lors du chargement du résumé professionnel:', err);
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    const prenomResult = validateName(profileData.prenom, 'Le prénom');
    if (!prenomResult.valid) errors.prenom = prenomResult.message;

    const nomResult = validateName(profileData.nom, 'Le nom');
    if (!nomResult.valid) errors.nom = nomResult.message;

    const emailResult = validateEmail(profileData.email);
    if (!emailResult.valid) errors.email = emailResult.message;

    const phoneResult = validatePhone(profileData.telephone);
    if (!phoneResult.valid) errors.telephone = phoneResult.message;

    const addressResult = validateAddress(profileData.adresse);
    if (!addressResult.valid) errors.adresse = addressResult.message;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: '' });
    }
  };

  const handleSave = async () => {
    if (!validateProfileForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      await medecinService.updateProfile(profileData);

      setSuccess(t('medecin.profile.save_success'));
      setIsEditing(false);
      setFieldErrors({});
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(t('medecin.profile.save_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    const currentResult = validateRequired(passwordData.currentPassword, 'Le mot de passe actuel');
    if (!currentResult.valid) errors.currentPassword = currentResult.message;

    const newResult = validatePassword(passwordData.newPassword);
    if (!newResult.valid) errors.newPassword = newResult.message;

    const confirmResult = validatePasswordMatch(passwordData.newPassword, passwordData.confirmPassword);
    if (!confirmResult.valid) errors.confirmPassword = confirmResult.message;

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
    if (passwordErrors[field]) {
      setPasswordErrors({ ...passwordErrors, [field]: '' });
    }
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      // Call password change API
      await medecinService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess(t('medecin.profile.password_change_success'));
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erreur lors du changement de mot de passe:', err);
      setError(err.response?.data?.message || t('medecin.profile.password_change_error'));
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <MedecinLayout>
        <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-secondary-500/30 border-t-secondary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-white font-medium">{t('medecin.profile.loading')}</p>
          </div>
        </div>
      </MedecinLayout>
    );
  }

  return (
    <MedecinLayout>
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 p-8 relative overflow-hidden">
        {/* Blobs animés en arrière-plan - couleurs LARANA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-8">
          {/* Header Ultra-Moderne - Style Dashboard exact */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs d'arrière-plan */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge "Profil" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-full mb-4">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">{t('medecin.profile.badge')}</span>
                    </div>

                    {/* Titre principal avec animation */}
                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('medecin.profile.greeting', { name: profileData.prenom })} {t('medecin.profile.greeting_emoji')}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-white mb-6 font-medium">
                      {t('medecin.profile.description')}
                    </p>

                    {/* Informations dans des mini-cartes */}
                    <div className="flex items-center gap-4">
                      {/* Carte Spécialité */}
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-xl flex items-center justify-center">
                          <AcademicCapIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.profile.specialty_label')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {profileData.specialite || t('medecin.profile.not_provided')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section droite - Bouton modifier */}
                  {!isEditing && (
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="relative group"
                      >
                        {/* Effet glow */}
                        <div className="absolute inset-0 bg-secondary-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                        {/* Bouton principal */}
                        <div className="relative flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 rounded-2xl border-2 border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-xl hover:border-secondary-200 dark:hover:border-secondary-600 transition-all duration-300 hover:scale-105">
                          <div className="relative">
                            <PencilIcon className="w-6 h-6 text-gray-600 dark:text-white group-hover:text-secondary-600 transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.profile.action_label')}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{t('medecin.profile.edit_button')}</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3 animate-scale-in">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 animate-scale-in">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Profile Card with Avatar */}
          <div className="relative animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-600 flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">
                      Dr. {profileData.nom?.charAt(0) || ''}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Dr. {profileData.prenom} {profileData.nom}
                  </h2>
                  <p className="text-secondary-600 dark:text-secondary-400 font-medium mt-1">
                    {profileData.specialite || t('medecin.profile.specialty')}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">{t('medecin.profile.online')}</span>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('medecin.profile.first_name')}
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={profileData.prenom}
                        onChange={(e) => handleFieldChange('prenom', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                          fieldErrors.prenom
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                        }`}
                      />
                      {fieldErrors.prenom && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                          {fieldErrors.prenom}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {profileData.prenom || t('medecin.profile.not_filled')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('medecin.profile.last_name')}
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={profileData.nom}
                        onChange={(e) => handleFieldChange('nom', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                          fieldErrors.nom
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                        }`}
                      />
                      {fieldErrors.nom && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                          {fieldErrors.nom}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {profileData.nom || t('medecin.profile.not_filled')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4" />
                    {t('medecin.profile.email')}
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                          fieldErrors.email
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                        }`}
                      />
                      {fieldErrors.email && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                          {fieldErrors.email}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {profileData.email || t('medecin.profile.not_filled')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" />
                    {t('medecin.profile.phone')}
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="tel"
                        value={profileData.telephone}
                        onChange={(e) => handleFieldChange('telephone', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                          fieldErrors.telephone
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                        }`}
                      />
                      {fieldErrors.telephone && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                          {fieldErrors.telephone}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {profileData.telephone || t('medecin.profile.not_filled')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <AcademicCapIcon className="w-4 h-4" />
                    {t('medecin.profile.specialty')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.specialite}
                      onChange={(e) => handleFieldChange('specialite', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {profileData.specialite || t('medecin.profile.not_filled')}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    {t('medecin.profile.office_address')}
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={profileData.adresse}
                        onChange={(e) => handleFieldChange('adresse', e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                          fieldErrors.adresse
                            ? 'border-red-500 focus:ring-red-500/20'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                        }`}
                      />
                      {fieldErrors.adresse && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                          {fieldErrors.adresse}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
                      {profileData.adresse || t('medecin.profile.not_filled')}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      loadProfile();
                    }}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    {t('medecin.profile.cancel_button')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        {t('medecin.profile.saving')}
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        {t('medecin.profile.save_button')}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="relative animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <LockClosedIcon className="w-6 h-6 text-secondary-500" />
                {t('medecin.profile.security_title')}
              </h3>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <LockClosedIcon className="w-5 h-5" />
                {t('medecin.profile.change_password_button')}
              </button>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="relative animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <HeartIcon className="w-6 h-6 text-secondary-500" />
                {t('medecin.profile.professional_summary')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Next Appointment */}
                <div className="bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <ClockIcon className="w-6 h-6 text-secondary-600 dark:text-secondary-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('medecin.profile.next_appointment')}</h4>
                  </div>
                  {professionalSummary.nextAppointment ? (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {professionalSummary.nextAppointment.patient?.prenom} {professionalSummary.nextAppointment.patient?.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(professionalSummary.nextAppointment.dateHeure)}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('medecin.profile.no_upcoming_appointment')}</p>
                  )}
                </div>

                {/* Appointments This Month */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <CalendarIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('medecin.profile.this_month')}</h4>
                  </div>
                  <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {professionalSummary.appointmentsThisMonth}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('medecin.profile.appointments_label')}</p>
                </div>

                {/* Total Patients */}
                <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t('medecin.profile.my_patients')}</h4>
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {professionalSummary.totalPatients}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('medecin.profile.patients_active')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <LockClosedIcon className="w-6 h-6 text-secondary-500" />
              {t('medecin.profile.password_modal_title')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('medecin.profile.current_password')}
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    passwordErrors.currentPassword
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                  }`}
                />
                {passwordErrors.currentPassword && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('medecin.profile.new_password')}
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    passwordErrors.newPassword
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                  }`}
                />
                {passwordErrors.newPassword && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {passwordErrors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('medecin.profile.confirm_new_password')}
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-transparent ${
                    passwordErrors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-secondary-500'
                  }`}
                />
                {passwordErrors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                {t('medecin.profile.cancel_button')}
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isSaving}
                className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {t('medecin.profile.saving')}
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    {t('medecin.profile.confirm_button')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </MedecinLayout>
  );
};

export default Profile;
