import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/layout/PatientLayout';
import patientService from '../../services/patientService';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  MoonIcon,
  SunIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  LockClosedIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, setTheme } = useTheme();
  const { updateUser } = useAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    promotionalEmails: false,
    darkMode: false,
    language: i18n.language || 'fr',
    twoFactorAuth: false,
    biometricAuth: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  // Synchroniser l'état du toggle avec le thème réel du ThemeContext au chargement
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
      const response = await patientService.getProfile();
      const user = response.data;

      const isDark = user.theme === 'SOMBRE';

      const userLanguage = user.langue || 'fr';

      setSettings({
        emailNotifications: user.preferencesNotifEmail,
        smsNotifications: user.preferencesNotifSms,
        appointmentReminders: user.preferencesRappels,
        promotionalEmails: user.preferencesPromotions,
        darkMode: isDark,
        language: i18n.language, // Utiliser i18n comme source de vérité, pas la DB
        twoFactorAuth: user.twoFactorAuth,
        biometricAuth: user.biometricAuth,
      });

      // NE PAS forcer la synchronisation depuis la DB
      // La langue est gérée par i18n et localStorage
      // On fait confiance à ces sources plutôt qu'à la DB qui peut être en retard

      // NE PAS appliquer le thème automatiquement depuis l'API
      // Le thème vient de localStorage (ThemeContext)
      // On synchronise seulement l'état pour afficher le bon toggle
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError(getErrorMessage(err, 'Impossible de charger les paramètres'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key) => {
    console.log('🔘 TOGGLE CLICKED:', key);
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: !prev[key]
      };
      console.log('🔄 New settings:', newSettings);

      // Si c'est le darkMode, appliquer le thème immédiatement ET le sauvegarder dans localStorage
      if (key === 'darkMode') {
        setTheme(newSettings.darkMode);
        // Sauvegarder immédiatement dans localStorage pour persistance
        localStorage.setItem('theme', newSettings.darkMode ? 'dark' : 'light');
      }

      return newSettings;
    });
  };

  const handleLanguageChange = async (lang) => {
    console.log('🌍 LANGUAGE CLICKED:', lang);
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
      await patientService.updatePreferences({ langue: lang });

      // Mettre à jour l'utilisateur dans le contexte
      updateUser({ langue: lang });

      console.log('✅ Langue changée et sauvegardée:', lang);

      // La langue change automatiquement partout grâce à i18n - pas besoin de reload!
    } catch (error) {
      console.error('❌ Erreur lors du changement de langue:', error);
    }
  };

  const handleSave = async () => {
    console.log('💾 SAVE BUTTON CLICKED!');
    console.log('Current settings:', settings);
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);

      // Sauvegarder la langue actuelle avant de faire les changements
      const previousLanguage = i18n.language;

      const updateData = {
        preferencesNotifEmail: settings.emailNotifications,
        preferencesNotifSms: settings.smsNotifications,
        preferencesRappels: settings.appointmentReminders,
        preferencesPromotions: settings.promotionalEmails,
        theme: settings.darkMode ? 'SOMBRE' : 'CLAIR',
        langue: settings.language,
        twoFactorAuth: settings.twoFactorAuth,
        biometricAuth: settings.biometricAuth,
      };

      console.log('📤 Sending to API:', updateData);
      const response = await patientService.updatePreferences(updateData);
      console.log('✅ API Response:', response.data);

      // SEULEMENT APRÈS que l'API confirme, mettre à jour i18n et localStorage
      const languageChanged = settings.language !== previousLanguage;
      if (languageChanged) {
        console.log('🔄 Updating language from', previousLanguage, 'to', settings.language);
        i18n.changeLanguage(settings.language);
        localStorage.setItem('language', settings.language);
      }

      // Mettre à jour l'utilisateur dans le contexte
      updateUser({
        preferencesNotifEmail: settings.emailNotifications,
        preferencesNotifSms: settings.smsNotifications,
        preferencesRappels: settings.appointmentReminders,
        preferencesPromotions: settings.promotionalEmails,
        theme: settings.darkMode ? 'SOMBRE' : 'CLAIR',
        langue: settings.language,
        twoFactorAuth: settings.twoFactorAuth,
        biometricAuth: settings.biometricAuth,
      });

      setIsSaving(false);
      setSaveSuccess(true);

      // La langue change automatiquement partout grâce à i18n
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('❌ Erreur lors de la sauvegarde des paramètres:', err);
      setError(getErrorMessage(err, 'Impossible de sauvegarder les paramètres'));

      // Si la sauvegarde échoue, revert la langue
      const currentLang = i18n.language;
      if (settings.language !== currentLang) {
        console.log('⚠️ Reverting language to', currentLang);
        setSettings(prev => ({ ...prev, language: currentLang }));
      }

      setIsSaving(false);
    }
  };

  // Helper pour obtenir les vraies classes CSS (Tailwind ne supporte pas les classes dynamiques)
  const getGradientClasses = (gradient) => {
    const classes = {
      'blue-500': {
        bg: 'bg-blue-500',
        bgOpacity: 'bg-blue-500',
        text: 'text-blue-500'
      },
      'blue-400': {
        bg: 'bg-blue-400',
        bgOpacity: 'bg-blue-400',
        text: 'text-blue-400'
      }
    };
    return classes[gradient] || classes['blue-500'];
  };

  const settingSections = [
    {
      id: 'notifications',
      title: t('settings.notifications.title'),
      icon: BellIcon,
      gradient: 'blue-500',
      description: t('settings.notifications.description'),
      settings: [
        {
          id: 'emailNotifications',
          label: t('settings.notifications.email'),
          description: t('settings.notifications.emailDesc'),
          icon: EnvelopeIcon,
        },
        {
          id: 'smsNotifications',
          label: t('settings.notifications.sms'),
          description: t('settings.notifications.smsDesc'),
          icon: DevicePhoneMobileIcon,
        },
        {
          id: 'appointmentReminders',
          label: t('settings.notifications.reminders'),
          description: t('settings.notifications.remindersDesc'),
          icon: BellIcon,
        },
        {
          id: 'promotionalEmails',
          label: t('settings.notifications.promotional'),
          description: t('settings.notifications.promotionalDesc'),
          icon: EnvelopeIcon,
        },
      ],
    },
    {
      id: 'appearance',
      title: t('settings.appearance.title'),
      icon: settings.darkMode ? MoonIcon : SunIcon,
      gradient: 'blue-400',
      description: t('settings.appearance.description'),
      settings: [
        {
          id: 'darkMode',
          label: t('settings.appearance.darkMode'),
          description: t('settings.appearance.darkModeDesc'),
          icon: MoonIcon,
        },
      ],
    },
    {
      id: 'security',
      title: t('settings.security.title'),
      icon: ShieldCheckIcon,
      gradient: 'blue-500',
      description: t('settings.security.description'),
      settings: [
        {
          id: 'twoFactorAuth',
          label: t('settings.security.twoFactor'),
          description: t('settings.security.twoFactorDesc'),
          icon: KeyIcon,
        },
        {
          id: 'biometricAuth',
          label: t('settings.security.biometric'),
          description: t('settings.security.biometricDesc'),
          icon: LockClosedIcon,
        },
      ],
    },
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-white font-medium">{t('common.loading')}</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8">
          {error && (
            <div className="relative bg-red-500/10 dark:bg-red-900/30 backdrop-blur-xl rounded-2xl p-6 border border-red-200/50 dark:border-red-800/50 shadow-lg animate-scale-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <ExclamationCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-1">{t('settings.error')}</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="relative group animate-scale-in">
            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-75 animate-pulse-soft"></div>
                  <div className="relative w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <CogIcon className="w-8 h-8 text-white animate-rotate-slow" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-blue-500 dark:text-blue-400">
                    {t('settings.title')}
                  </h1>
                  <p className="text-slate-600 dark:text-white mt-1 font-medium">
                    {t('settings.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                    <GlobeAltIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('settings.language.title')}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{t('settings.language.description')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {languages.map((lang, index) => {
                    // Vérifier si la langue est active en se basant sur i18n.language (la vraie langue active)
                    // Cela garantit que le bouton reste actif même après navigation
                    const currentLang = i18n.language || settings.language;
                    const isActive = currentLang === lang.code || currentLang?.startsWith(lang.code);

                    return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 animate-scale-in ${
                        isActive
                          ? 'bg-blue-400 text-white shadow-xl'
                          : 'bg-white/60 dark:bg-gray-700 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-md'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-blue-400 rounded-xl blur-lg opacity-50 animate-pulse-soft"></div>
                      )}
                      <div className="relative text-center">
                        <div className="text-3xl mb-2">{lang.flag}</div>
                        <div className="font-semibold">{lang.name}</div>
                      </div>
                    </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {settingSections.map((section, sectionIndex) => {
            const gradientClasses = getGradientClasses(section.gradient);
            return (
            <div
              key={section.id}
              className="relative animate-slide-up"
              style={{ animationDelay: `${(sectionIndex + 2) * 100}ms` }}
            >
              <div className="relative group">
                <div className={`absolute inset-0 ${gradientClasses.bgOpacity} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 ${gradientClasses.bg} rounded-xl flex items-center justify-center shadow-lg`}>
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">{section.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-gray-400">{section.description}</p>
                    </div>
                  </div>

                  {section.settings && (
                    <div className="space-y-4">
                      {section.settings.map((setting) => (
                        <div
                          key={setting.id}
                          className="relative group/item"
                        >
                          <div className="flex items-center justify-between p-4 rounded-xl bg-white/60 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-md">
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`w-10 h-10 ${gradientClasses.bgOpacity} opacity-20 rounded-lg flex items-center justify-center`}>
                                <setting.icon className="w-5 h-5 text-slate-600 dark:text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 dark:text-white">{setting.label}</h4>
                                <p className="text-sm text-slate-500 dark:text-gray-400">{setting.description}</p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleToggle(setting.id)}
                              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                                settings[setting.id]
                                  ? gradientClasses.bg
                                  : 'bg-slate-200 dark:bg-gray-600'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                                  settings[setting.id] ? 'left-8' : 'left-1'
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
            );
          })}

          <div className="relative animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between">
              <div>
                {saveSuccess && (
                  <div className="flex items-center gap-2 text-blue-600 font-semibold animate-scale-in">
                    <CheckCircleIcon className="w-6 h-6" />
                    {t('settings.saved')}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="relative group/btn px-8 py-4 rounded-2xl overflow-hidden bg-blue-500 text-white font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('settings.saving')}
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-6 h-6" />
                      {t('settings.saveChanges')}
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="relative bg-blue-500/10 dark:bg-blue-950/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/50 dark:border-blue-900/50 shadow-lg animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">{t('settings.security.tip')}</h4>
                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {t('settings.security.tipDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Settings;
