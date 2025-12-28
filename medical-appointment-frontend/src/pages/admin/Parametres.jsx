import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  Cog6ToothIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UsersIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentPlusIcon,
  ClockIcon,
  ComputerDesktopIcon,
  BeakerIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const AdminParametres = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, setTheme } = useTheme();
  const { updateUser } = useAuth();

  // Get locale code based on current language
  const getLocaleCode = () => {
    const localeMap = {
      'fr': 'fr-FR',
      'en': 'en-US'
    };
    return localeMap[i18n.language] || 'fr-FR';
  };

  // Get translated action message
  const getActionMessage = (log) => {
    const translationKey = `admin.parametres.audit.actions.${log.actionKey}`;
    const translated = t(translationKey, log.actionParams || {});
    // Si la traduction retourne la clé elle-même, utiliser l'action brute
    if (translated === translationKey) {
      return log.action || log.actionKey || 'Action inconnue';
    }
    return translated;
  };

  // Get translated user name
  const getUserName = (userKey) => {
    // If it's a translation key (mainAdmin, unknownUser), translate it
    if (userKey === 'mainAdmin' || userKey === 'unknownUser') {
      return t(`admin.parametres.audit.users.${userKey}`);
    }
    // Otherwise, return the name as is (e.g., "Dr. Kouadio")
    return userKey;
  };

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,

    // Appearance
    darkMode: false,
    language: i18n.language || 'fr',

    // System
    autoBackup: true,
    backupFrequency: 'daily',
  });

  // Spécialités médicales state - using translation keys
  const defaultSpecialties = [
    'cardiology',
    'pediatrics',
    'dermatology',
    'neurology',
    'ophthalmology',
    'psychiatry',
    'gynecology',
    'generalMedicine',
  ];

  // Migration map from old French names to translation keys
  const specialtyMigrationMap = {
    'Cardiologie': 'cardiology',
    'Pédiatrie': 'pediatrics',
    'Dermatologie': 'dermatology',
    'Neurologie': 'neurology',
    'Ophtalmologie': 'ophthalmology',
    'Psychiatrie': 'psychiatry',
    'Gynécologie': 'gynecology',
    'Médecine générale': 'generalMedicine',
    'Orthopédie': 'orthopedics',
    'Dentisterie': 'dentistry',
    'Autre': 'other',
  };

  const [specialties, setSpecialties] = useState(() => {
    const saved = localStorage.getItem('medicalSpecialties');
    if (saved) {
      try {
        const parsedSpecialties = JSON.parse(saved);
        // Migrate old French names to translation keys
        const migratedSpecialties = parsedSpecialties.map(spec =>
          specialtyMigrationMap[spec] || spec
        );
        // Save migrated data back to localStorage
        localStorage.setItem('medicalSpecialties', JSON.stringify(migratedSpecialties));
        return migratedSpecialties;
      } catch (e) {
        console.error('Error parsing specialties:', e);
        return defaultSpecialties;
      }
    }
    return defaultSpecialties;
  });
  const [newSpecialty, setNewSpecialty] = useState('');

  // Audit logs state - using translation keys
  const [auditLogs, setAuditLogs] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllLogsModal, setShowAllLogsModal] = useState(false);
  const [allAuditLogs, setAllAuditLogs] = useState([]);
  const [isLoadingAllLogs, setIsLoadingAllLogs] = useState(false);

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings();
    loadAuditLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchroniser avec le ThemeContext
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  // Synchroniser la langue avec i18n (pour garder le bouton actif)
  useEffect(() => {
    const updateLanguage = () => {
      const currentLanguage = i18n.language;
      setSettings(prev => ({
        ...prev,
        language: currentLanguage
      }));
    };

    // Mettre à jour au montage
    updateLanguage();

    // Écouter les changements de langue
    i18n.on('languageChanged', updateLanguage);

    return () => {
      i18n.off('languageChanged', updateLanguage);
    };
  }, [i18n]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Charger le profil depuis l'API
      const response = await adminService.getProfile();
      const userData = response.data;

      const isDark = userData.theme === 'SOMBRE' || isDarkMode;
      const userLanguage = userData.langue || localStorage.getItem('language') || 'fr';

      setSettings(prev => ({
        ...prev,
        emailNotifications: userData.preferencesNotifEmail ?? true,
        smsNotifications: userData.preferencesNotifSms ?? false,
        darkMode: isDark,
        language: i18n.language, // Utiliser i18n comme source de vérité
      }));

      // NE PAS forcer la synchronisation depuis la DB
      // On fait confiance à i18n et localStorage comme sources de vérité
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError('Impossible de charger les paramètres');

      // Fallback vers localStorage si l'API échoue
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const isDark = userData.theme === 'SOMBRE' || isDarkMode;
      const userLanguage = userData.langue || localStorage.getItem('language') || 'fr';

      setSettings(prev => ({
        ...prev,
        emailNotifications: userData.preferencesNotifEmail ?? true,
        smsNotifications: userData.preferencesNotifSms ?? false,
        darkMode: isDark,
        language: userLanguage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour mapper les actions du backend vers les clés de traduction
  const mapActionToKey = (action) => {
    const actionMap = {
      'LOGIN_SUCCESS': 'loginSuccess',
      'LOGIN_FAILED': 'loginFailed',
      'LOGOUT': 'logout',
      'REGISTER_SUCCESS': 'registerSuccess',
      'REGISTER_MEDECIN_PENDING': 'medecinRegistrationPending',
    };
    return actionMap[action] || action.toLowerCase().replace(/_/g, '');
  };

  const loadAuditLogs = async () => {
    try {
      console.log('🔍 Chargement des audit logs...');
      const response = await adminService.getAuditLogs({ limit: 5 });
      console.log('📊 Response reçue:', response);
      console.log('📊 Response.data:', response.data);
      console.log('📊 Response.data.data:', response.data?.data);

      if (response.data?.data && Array.isArray(response.data.data)) {
        const mappedLogs = response.data.data.map(log => ({
          id: log.id,
          user: log.user,
          actionKey: mapActionToKey(log.action),
          action: log.action, // Garder l'action originale aussi
          ip: log.ip || 'N/A',
          date: new Date(log.date || log.createdAt),
          status: log.status
        }));
        console.log('✅ Logs mappés:', mappedLogs);
        setAuditLogs(mappedLogs);
      } else {
        console.warn('⚠️ Pas de données ou format incorrect:', response);
      }
    } catch (err) {
      console.error('❌ Erreur lors du chargement des logs:', err);
      // Ne pas afficher d'erreur si les logs ne sont pas disponibles
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: !prev[key]
      };

      // Appliquer le dark mode immédiatement
      if (key === 'darkMode') {
        setTheme(newSettings.darkMode);
        localStorage.setItem('theme', newSettings.darkMode ? 'dark' : 'light');
      }

      return newSettings;
    });
  };

  const handleLanguageChange = async (lang) => {
    try {
      // Changer la langue immédiatement dans i18n
      await i18n.changeLanguage(lang);

      // Sauvegarder dans localStorage
      localStorage.setItem('language', lang);

      // Mettre à jour la langue du document
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;

      // Mettre à jour l'état local
      setSettings(prev => ({
        ...prev,
        language: lang
      }));

      // IMPORTANT: Sauvegarder immédiatement dans la base de données
      await adminService.updateProfile({ langue: lang });

      // Mettre à jour l'utilisateur dans le contexte
      updateUser({ langue: lang });

      console.log('✅ Langue changée et sauvegardée:', lang);

      // La langue change automatiquement partout grâce à i18n - pas besoin de reload!
    } catch (error) {
      console.error('❌ Erreur lors du changement de langue:', error);
    }
  };

  // Gestion des spécialités médicales
  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      const updated = [...specialties, newSpecialty.trim()];
      setSpecialties(updated);
      localStorage.setItem('medicalSpecialties', JSON.stringify(updated));
      setNewSpecialty('');
    }
  };

  const handleDeleteSpecialty = (specialty) => {
    const updated = specialties.filter(s => s !== specialty);
    setSpecialties(updated);
    localStorage.setItem('medicalSpecialties', JSON.stringify(updated));
  };

  const handleResetSpecialties = () => {
    setSpecialties(defaultSpecialties);
    localStorage.setItem('medicalSpecialties', JSON.stringify(defaultSpecialties));
  };

  const loadAllAuditLogs = async () => {
    try {
      setIsLoadingAllLogs(true);
      const response = await adminService.getAuditLogs({ limit: 50 });
      if (response.data?.data && Array.isArray(response.data.data)) {
        setAllAuditLogs(response.data.data.map(log => ({
          id: log.id,
          user: log.user,
          actionKey: mapActionToKey(log.action),
          action: log.action,
          ip: log.ip || 'N/A',
          date: new Date(log.date || log.createdAt),
          status: log.status
        })));
      }
      setShowAllLogsModal(true);
    } catch (err) {
      console.error('Erreur lors du chargement de tous les logs:', err);
    } finally {
      setIsLoadingAllLogs(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Préparer les données à sauvegarder
      const updateData = {
        preferencesNotifEmail: settings.emailNotifications,
        preferencesNotifSms: settings.smsNotifications,
        theme: settings.darkMode ? 'SOMBRE' : 'CLAIR',
        langue: settings.language,
      };

      // Sauvegarder via l'API
      const response = await adminService.updateProfile(updateData);
      const updatedUser = response.data;

      // Mettre à jour localStorage pour synchroniser
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const mergedUser = { ...userData, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(mergedUser));

      // Mettre à jour le contexte utilisateur
      updateUser(updatedUser);

      // Appliquer le thème
      setTheme(settings.darkMode);

      // S'assurer que la langue est bien appliquée
      await i18n.changeLanguage(settings.language);
      localStorage.setItem('language', settings.language);
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = settings.language;

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des paramètres:', err);
      setError(getErrorMessage(err, 'Impossible de sauvegarder les paramètres'));
      setIsSaving(false);
    }
  };

  const settingSections = [
    {
      id: 'notifications',
      title: t('admin.parametres.notifications.title'),
      icon: BellIcon,
      gradient: 'blue-400',
      description: t('admin.parametres.notifications.description'),
      settings: [
        {
          id: 'emailNotifications',
          label: t('admin.parametres.notifications.email'),
          description: t('admin.parametres.notifications.emailDesc'),
          icon: EnvelopeIcon,
        },
        {
          id: 'smsNotifications',
          label: t('admin.parametres.notifications.sms'),
          description: t('admin.parametres.notifications.smsDesc'),
          icon: DevicePhoneMobileIcon,
        },
      ],
    },
    {
      id: 'appearance',
      title: t('admin.parametres.appearance.title'),
      icon: settings.darkMode ? MoonIcon : SunIcon,
      gradient: 'blue-400',
      description: t('admin.parametres.appearance.description'),
      settings: [
        {
          id: 'darkMode',
          label: t('admin.parametres.appearance.darkMode'),
          description: t('admin.parametres.appearance.darkModeDesc'),
          icon: MoonIcon,
        },
      ],
    },
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col items-center">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Error Message */}
          {error && (
            <div className="relative bg-red-500/10 dark:bg-red-900/30 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-red-200/50 dark:border-red-800/50 shadow-lg animate-scale-in">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <ExclamationCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-white mb-1">{t('admin.parametres.error')}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-8 sm:p-12 lg:p-16 border border-white/50 dark:border-gray-700/50">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-300">{t('admin.parametres.loading')}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative group animate-scale-in">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-blue-500 rounded-xl sm:rounded-2xl blur-lg opacity-75 animate-pulse-soft"></div>
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                        <Cog6ToothIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-rotate-slow" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500 dark:text-blue-400 truncate">
                        {t('admin.parametres.title')}
                      </h1>
                      <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-white mt-1 font-medium truncate">
                        {t('admin.parametres.subtitle')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="relative animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">{t('admin.parametres.language.title')}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">{t('admin.parametres.language.description')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {languages.map((lang, index) => {
                        const currentLang = i18n.language || settings.language;
                        const isActive = currentLang === lang.code || currentLang?.startsWith(lang.code);

                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`relative p-2 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 animate-scale-in ${
                              isActive
                                ? 'bg-blue-400 text-white shadow-xl'
                                : 'bg-white/60 dark:bg-gray-700 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-md'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                          >
                            {isActive && (
                              <div className="absolute inset-0 bg-blue-400 rounded-lg sm:rounded-xl blur-lg opacity-50 animate-pulse-soft"></div>
                            )}
                            <div className="relative text-center">
                              <div className="text-xl sm:text-3xl mb-1 sm:mb-2">{lang.flag}</div>
                              <div className="font-semibold text-xs sm:text-base">{lang.name}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings Sections */}
              {settingSections.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="relative animate-slide-up"
                  style={{ animationDelay: `${(sectionIndex + 2) * 100}ms` }}
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-blue-400/10 opacity-10 rounded-xl sm:rounded-2xl blur-xl group-hover:opacity-20 transition-opacity"></div>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <section.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{section.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 truncate">{section.description}</p>
                    </div>
                  </div>

                  {section.settings && (
                    <div className="space-y-3 sm:space-y-4">
                      {section.settings.map((setting) => (
                        <div key={setting.id} className="relative group/item">
                          <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/60 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md gap-3">
                            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <setting.icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-white" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-white">{setting.label}</h4>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 line-clamp-2">{setting.description}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggle(setting.id)}
                              className={`relative w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all duration-300 flex-shrink-0 ${
                                settings[setting.id]
                                  ? 'bg-blue-400'
                                  : 'bg-slate-200 dark:bg-gray-600'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                                  settings[setting.id] ? 'left-6 sm:left-8' : 'left-1'
                                }`}
                              ></div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Audit Logs */}
          <div className="relative animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400/10 opacity-10 rounded-xl sm:rounded-2xl blur-xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/50 dark:border-gray-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <ClipboardDocumentListIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{t('admin.parametres.audit.title')}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">{t('admin.parametres.audit.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 dark:bg-gray-700 rounded-lg sm:rounded-xl self-start sm:self-auto">
                    <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300">{t('admin.parametres.audit.last24h')}</span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                      <ClipboardDocumentListIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                      <p className="text-sm sm:text-base">{t('admin.parametres.audit.noLogs')}</p>
                    </div>
                  ) : auditLogs.map((log, index) => {
                    const getActionIcon = () => {
                      if (log.actionKey.includes('login')) return ArrowRightOnRectangleIcon;
                      if (log.actionKey.includes('Modified') || log.actionKey.includes('Updated')) return PencilSquareIcon;
                      if (log.actionKey.includes('Deleted')) return TrashIcon;
                      if (log.actionKey.includes('Added') || log.actionKey.includes('Created')) return DocumentPlusIcon;
                      return ClipboardDocumentListIcon;
                    };

                    const getStatusStyle = () => {
                      switch (log.status) {
                        case 'success':
                          return {
                            bg: 'bg-blue-500',
                            border: 'border-blue-200',
                            darkBorder: 'dark:border-blue-800',
                            textBg: 'bg-blue-100',
                            darkTextBg: 'dark:bg-blue-900/30',
                            text: 'text-blue-600',
                            darkText: 'dark:text-blue-400',
                            label: t('admin.parametres.audit.status.success'),
                            iconBg: 'bg-blue-100',
                            darkIconBg: 'dark:bg-blue-900/30'
                          };
                        case 'failed':
                          return {
                            bg: 'bg-red-500',
                            border: 'border-red-200',
                            darkBorder: 'dark:border-red-800',
                            textBg: 'bg-red-100',
                            darkTextBg: 'dark:bg-red-900/30',
                            text: 'text-red-600',
                            darkText: 'dark:text-red-400',
                            label: t('admin.parametres.audit.status.failed'),
                            iconBg: 'bg-red-100',
                            darkIconBg: 'dark:bg-red-900/30'
                          };
                        case 'warning':
                          return {
                            bg: 'bg-orange-500',
                            border: 'border-orange-200',
                            darkBorder: 'dark:border-orange-800',
                            textBg: 'bg-orange-100',
                            darkTextBg: 'dark:bg-orange-900/30',
                            text: 'text-orange-600',
                            darkText: 'dark:text-orange-400',
                            label: t('admin.parametres.audit.status.warning'),
                            iconBg: 'bg-orange-100',
                            darkIconBg: 'dark:bg-orange-900/30'
                          };
                        default:
                          return {
                            bg: 'bg-gray-500',
                            border: 'border-gray-200',
                            darkBorder: 'dark:border-gray-700',
                            textBg: 'bg-gray-100',
                            darkTextBg: 'dark:bg-gray-700',
                            text: 'text-gray-600',
                            darkText: 'dark:text-gray-400',
                            label: t('admin.parametres.audit.status.info'),
                            iconBg: 'bg-gray-100',
                            darkIconBg: 'dark:bg-gray-700'
                          };
                      }
                    };

                    const ActionIcon = getActionIcon();
                    const statusStyle = getStatusStyle();

                    return (
                      <div
                        key={log.id}
                        className="relative group/log animate-scale-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Timeline line - hidden on mobile */}
                        {index !== auditLogs.length - 1 && (
                          <div className="hidden sm:block absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"></div>
                        )}

                        <div className={`relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border-2 ${statusStyle.border} ${statusStyle.darkBorder} hover:shadow-lg transition-all group-hover/log:scale-[1.01] sm:group-hover/log:scale-[1.02]`}>
                          {/* Status indicator & Icon */}
                          <div className="hidden sm:flex flex-col items-center gap-2 flex-shrink-0">
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${statusStyle.iconBg} ${statusStyle.darkIconBg} rounded-lg sm:rounded-xl flex items-center justify-center relative`}>
                              <div className={`absolute inset-0 ${statusStyle.bg} opacity-0 group-hover/log:opacity-20 rounded-lg sm:rounded-xl transition-opacity`}></div>
                              <ActionIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${statusStyle.text} ${statusStyle.darkText} relative z-10`} />
                            </div>
                            <div className={`w-2 h-2 ${statusStyle.bg} rounded-full animate-pulse`}></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <div className={`sm:hidden w-6 h-6 ${statusStyle.iconBg} ${statusStyle.darkIconBg} rounded flex items-center justify-center`}>
                                  <ActionIcon className={`w-3.5 h-3.5 ${statusStyle.text} ${statusStyle.darkText}`} />
                                </div>
                                <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{getUserName(log.user)}</h4>
                                <span className={`px-2 py-0.5 sm:px-3 sm:py-1 ${statusStyle.textBg} ${statusStyle.darkTextBg} ${statusStyle.text} ${statusStyle.darkText} rounded-full text-xs font-bold`}>
                                  {statusStyle.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-8 sm:ml-0">
                                <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="font-medium">{log.date.toLocaleTimeString(getLocaleCode(), { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 font-medium">
                              {getActionMessage(log)}
                            </p>

                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                              <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <ComputerDesktopIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs font-mono font-semibold text-gray-600 dark:text-gray-300">
                                  {log.ip}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                  {log.date.toLocaleDateString(getLocaleCode())}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary footer */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {t('admin.parametres.audit.summary.success', { count: auditLogs.filter(l => l.status === 'success').length })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {t('admin.parametres.audit.summary.failed', { count: auditLogs.filter(l => l.status === 'failed').length })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {t('admin.parametres.audit.summary.warnings', { count: auditLogs.filter(l => l.status === 'warning').length })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={loadAllAuditLogs}
                    disabled={isLoadingAllLogs}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all disabled:opacity-50 self-start sm:self-auto"
                  >
                    {isLoadingAllLogs ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
                        {t('common.loading')}
                      </div>
                    ) : (
                      t('admin.parametres.audit.viewAll')
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Spécialités Médicales */}
          <div className="relative animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400/10 opacity-10 rounded-xl sm:rounded-2xl blur-xl group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-white/50 dark:border-gray-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-400 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <BeakerIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{t('admin.parametres.medicalSpecialties.title')}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400">{t('admin.parametres.medicalSpecialties.description')}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResetSpecialties}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto"
                    title={t('admin.parametres.medicalSpecialties.resetTitle')}
                  >
                    <ArrowPathIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    {t('admin.parametres.medicalSpecialties.reset')}
                  </button>
                </div>

                {/* Ajouter une spécialité */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSpecialty()}
                      placeholder={t('admin.parametres.medicalSpecialties.newPlaceholder')}
                      className="flex-1 px-3 py-2 sm:px-4 text-sm sm:text-base border-2 border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      onClick={handleAddSpecialty}
                      disabled={!newSpecialty.trim()}
                      className="px-3 py-2 sm:px-4 bg-blue-500 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t('admin.parametres.medicalSpecialties.add')}
                    </button>
                  </div>
                </div>

                {/* Liste des spécialités */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {specialties.map((specialty, index) => {
                    // Translate specialty if it's a key, otherwise show as is
                    const translatedSpecialty = t(`specialties.${specialty}`, { defaultValue: specialty });

                    return (
                      <div
                        key={index}
                        className="group/item relative bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl p-2.5 sm:p-3 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <BeakerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">{translatedSpecialty}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSpecialty(specialty)}
                            className="opacity-100 sm:opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all flex-shrink-0"
                            title={t('admin.parametres.medicalSpecialties.delete')}
                          >
                            <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {specialties.length === 0 && (
                  <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                    {t('admin.parametres.medicalSpecialties.noSpecialties')}
                  </div>
                )}

                <div className="mt-3 sm:mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 sm:gap-2">
                  <BeakerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  {t('admin.parametres.medicalSpecialties.count', { count: specialties.length })}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="relative animate-slide-up" style={{ animationDelay: '700ms' }}>
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="w-full sm:w-auto text-center sm:text-left">
                {saveSuccess && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-600 font-semibold animate-scale-in text-sm sm:text-base">
                    <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    {t('admin.parametres.saved')}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto relative group/btn px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl overflow-hidden bg-blue-500 text-white font-bold shadow-xl sm:shadow-2xl hover:shadow-2xl sm:hover:shadow-3xl hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2 text-sm sm:text-base">
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('admin.parametres.saving')}
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      {t('admin.parametres.save')}
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
            </>
          )}
        </div>

        {/* Modal pour tous les logs d'audit */}
        {showAllLogsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] bg-white dark:bg-gray-800 rounded-xl sm:rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-blue-700 p-3 sm:p-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-xl rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClipboardDocumentListIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base sm:text-2xl font-bold text-white truncate">{t('admin.parametres.audit.modalTitle')}</h2>
                      <p className="text-white/80 text-xs sm:text-sm hidden sm:block">{t('admin.parametres.audit.modalSubtitle')}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllLogsModal(false)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-lg sm:rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-120px)] custom-scrollbar">
                {allAuditLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 sm:py-16">
                    <ClipboardDocumentListIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('admin.parametres.audit.noLogs')}</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {allAuditLogs.map((log, index) => {
                      const getActionIcon = () => {
                        if (log.actionKey.includes('login')) return ArrowRightOnRectangleIcon;
                        if (log.actionKey.includes('Modified') || log.actionKey.includes('Updated')) return PencilSquareIcon;
                        if (log.actionKey.includes('Deleted')) return TrashIcon;
                        if (log.actionKey.includes('Added') || log.actionKey.includes('Created')) return DocumentPlusIcon;
                        return ClipboardDocumentListIcon;
                      };

                      const getStatusStyle = () => {
                        switch (log.status) {
                          case 'success':
                            return {
                              bg: 'bg-blue-500',
                              border: 'border-blue-200',
                              darkBorder: 'dark:border-blue-800',
                              textBg: 'bg-blue-100',
                              darkTextBg: 'dark:bg-blue-900/30',
                              text: 'text-blue-600',
                              darkText: 'dark:text-blue-400',
                              label: t('admin.parametres.audit.status.success'),
                              iconBg: 'bg-blue-100',
                              darkIconBg: 'dark:bg-blue-900/30'
                            };
                          case 'failed':
                            return {
                              bg: 'bg-red-500',
                              border: 'border-red-200',
                              darkBorder: 'dark:border-red-800',
                              textBg: 'bg-red-100',
                              darkTextBg: 'dark:bg-red-900/30',
                              text: 'text-red-600',
                              darkText: 'dark:text-red-400',
                              label: t('admin.parametres.audit.status.failed'),
                              iconBg: 'bg-red-100',
                              darkIconBg: 'dark:bg-red-900/30'
                            };
                          case 'warning':
                            return {
                              bg: 'bg-orange-500',
                              border: 'border-orange-200',
                              darkBorder: 'dark:border-orange-800',
                              textBg: 'bg-orange-100',
                              darkTextBg: 'dark:bg-orange-900/30',
                              text: 'text-orange-600',
                              darkText: 'dark:text-orange-400',
                              label: t('admin.parametres.audit.status.warning'),
                              iconBg: 'bg-orange-100',
                              darkIconBg: 'dark:bg-orange-900/30'
                            };
                          default:
                            return {
                              bg: 'bg-gray-500',
                              border: 'border-gray-200',
                              darkBorder: 'dark:border-gray-700',
                              textBg: 'bg-gray-100',
                              darkTextBg: 'dark:bg-gray-700',
                              text: 'text-gray-600',
                              darkText: 'dark:text-gray-400',
                              label: t('admin.parametres.audit.status.info'),
                              iconBg: 'bg-gray-100',
                              darkIconBg: 'dark:bg-gray-700'
                            };
                        }
                      };

                      const ActionIcon = getActionIcon();
                      const statusStyle = getStatusStyle();

                      return (
                        <div
                          key={log.id}
                          className="relative group/log animate-scale-in"
                          style={{ animationDelay: `${index * 20}ms` }}
                        >
                          <div className={`relative flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border-2 ${statusStyle.border} ${statusStyle.darkBorder} hover:shadow-lg transition-all group-hover/log:scale-[1.01] sm:group-hover/log:scale-[1.02]`}>
                            {/* Status indicator & Icon - hidden on mobile */}
                            <div className="hidden sm:flex flex-col items-center gap-2 flex-shrink-0">
                              <div className={`w-12 h-12 sm:w-16 sm:h-16 ${statusStyle.iconBg} ${statusStyle.darkIconBg} rounded-lg sm:rounded-xl flex items-center justify-center relative`}>
                                <div className={`absolute inset-0 ${statusStyle.bg} opacity-0 group-hover/log:opacity-20 rounded-lg sm:rounded-xl transition-opacity`}></div>
                                <ActionIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${statusStyle.text} ${statusStyle.darkText} relative z-10`} />
                              </div>
                              <div className={`w-2 h-2 ${statusStyle.bg} rounded-full animate-pulse`}></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className={`sm:hidden w-6 h-6 ${statusStyle.iconBg} ${statusStyle.darkIconBg} rounded flex items-center justify-center`}>
                                    <ActionIcon className={`w-3.5 h-3.5 ${statusStyle.text} ${statusStyle.darkText}`} />
                                  </div>
                                  <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">{getUserName(log.user)}</h4>
                                  <span className={`px-2 py-0.5 sm:px-3 sm:py-1 ${statusStyle.textBg} ${statusStyle.darkTextBg} ${statusStyle.text} ${statusStyle.darkText} rounded-full text-xs font-bold`}>
                                    {statusStyle.label}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-8 sm:ml-0">
                                  <ClockIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                  <span className="font-medium">{log.date.toLocaleTimeString(getLocaleCode(), { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>

                              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 font-medium">
                                {getActionMessage(log)}
                              </p>

                              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                  <ComputerDesktopIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                  <span className="text-xs font-mono font-semibold text-gray-600 dark:text-gray-300">
                                    {log.ip}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                    {log.date.toLocaleDateString(getLocaleCode())}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminParametres;
