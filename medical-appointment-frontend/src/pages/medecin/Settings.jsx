import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
import {
  CogIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, setTheme } = useTheme();
  const { updateUser } = useAuth();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    rappelAvant24h: true,
    notifierNouveauxRdv: true,
    notifierAnnulations: true,
    darkMode: false,
    language: i18n.language || 'fr',
    dureeConsultation: 30,
    pauseEntreConsultations: 5,
    joursOuvres: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await medecinService.getProfile();
      const user = response.data?.data || response.data;

      const isDark = user.theme === 'SOMBRE';

      const userLanguage = user.langue || 'fr';

      setSettings({
        emailNotifications: user.preferencesNotifEmail ?? true,
        smsNotifications: user.preferencesNotifSms ?? false,
        rappelAvant24h: true,
        notifierNouveauxRdv: true,
        notifierAnnulations: true,
        darkMode: isDark,
        language: userLanguage,
        dureeConsultation: 30,
        pauseEntreConsultations: 5,
        joursOuvres: ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'],
      });

      // Appliquer la langue immédiatement dans toute l'application
      if (userLanguage !== i18n.language) {
        i18n.changeLanguage(userLanguage);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des paramètres:', err);
      setError('Impossible de charger les paramètres');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [key]: !prev[key]
      };

      if (key === 'darkMode') {
        setTheme(newSettings.darkMode);
        localStorage.setItem('theme', newSettings.darkMode ? 'dark' : 'light');
      }

      return newSettings;
    });
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleLanguageChange = async (lang) => {
    try {
      // Changer la langue immédiatement dans i18n
      await i18n.changeLanguage(lang);

      // Sauvegarder dans localStorage
      localStorage.setItem('language', lang);

      // Mettre à jour la direction du texte pour l'arabe
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;

      // Mettre à jour l'état local
      setSettings(prev => ({
        ...prev,
        language: lang
      }));

      // IMPORTANT: Sauvegarder immédiatement dans la base de données
      await medecinService.updateProfile({ langue: lang });

      // Mettre à jour l'utilisateur dans le contexte
      updateUser({ langue: lang });

      console.log('✅ Langue changée et sauvegardée:', lang);
    } catch (error) {
      console.error('❌ Erreur lors du changement de langue:', error);
    }
  };

  const handleDayToggle = (day) => {
    setSettings(prev => ({
      ...prev,
      joursOuvres: prev.joursOuvres.includes(day)
        ? prev.joursOuvres.filter(d => d !== day)
        : [...prev.joursOuvres, day]
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      setError(null);

      const updateData = {
        preferencesNotifEmail: settings.emailNotifications,
        preferencesNotifSms: settings.smsNotifications,
        theme: settings.darkMode ? 'SOMBRE' : 'CLAIR',
        langue: settings.language,
      };

      await medecinService.updateProfile(updateData);

      // Mettre à jour l'utilisateur dans le contexte et localStorage
      updateUser({
        preferencesNotifEmail: settings.emailNotifications,
        preferencesNotifSms: settings.smsNotifications,
        theme: settings.darkMode ? 'SOMBRE' : 'CLAIR',
        langue: settings.language,
      });

      // S'assurer que la langue est bien appliquée partout
      await i18n.changeLanguage(settings.language);
      localStorage.setItem('language', settings.language);
      document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = settings.language;

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde des paramètres:', err);
      setError(err.response?.data?.message || 'Impossible de sauvegarder les paramètres');
      setIsSaving(false);
    }
  };

  const getGradientClasses = (gradient) => {
    const classes = {
      'secondary-500': {
        bg: 'bg-secondary-500',
        bgOpacity: 'bg-secondary-500',
        text: 'text-secondary-500'
      },
      'primary-400': {
        bg: 'bg-primary-400',
        bgOpacity: 'bg-primary-400',
        text: 'text-primary-400'
      }
    };
    return classes[gradient] || classes['secondary-500'];
  };

  const settingSections = [
    {
      id: 'notifications',
      title: t('settings.notifications.title'),
      icon: BellIcon,
      gradient: 'secondary-500',
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
          id: 'rappelAvant24h',
          label: t('settings.notifications.reminders'),
          description: t('settings.notifications.remindersDesc'),
          icon: BellIcon,
        },
        {
          id: 'notifierNouveauxRdv',
          label: t('settings.notifications.newAppointments'),
          description: t('settings.notifications.newAppointmentsDesc'),
          icon: CalendarIcon,
        },
        {
          id: 'notifierAnnulations',
          label: t('settings.notifications.cancellations'),
          description: t('settings.notifications.cancellationsDesc'),
          icon: ExclamationCircleIcon,
        },
      ],
    },
    {
      id: 'appearance',
      title: t('settings.appearance.title'),
      icon: settings.darkMode ? MoonIcon : SunIcon,
      gradient: 'primary-400',
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
      id: 'availability',
      title: t('settings.availability.title'),
      icon: ClockIcon,
      gradient: 'secondary-500',
      description: t('settings.availability.description'),
      type: 'availability',
    },
  ];

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' },
  ];

  const jours = [
    { id: 'LUNDI', label: t('days.monday') },
    { id: 'MARDI', label: t('days.tuesday') },
    { id: 'MERCREDI', label: t('days.wednesday') },
    { id: 'JEUDI', label: t('days.thursday') },
    { id: 'VENDREDI', label: t('days.friday') },
    { id: 'SAMEDI', label: t('days.saturday') },
    { id: 'DIMANCHE', label: t('days.sunday') },
  ];

  if (isLoading) {
    return (
      <MedecinLayout>
        <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-secondary-500/30 border-t-secondary-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-white font-medium">{t('common.loading')}</p>
          </div>
        </div>
      </MedecinLayout>
    );
  }

  return (
    <MedecinLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-400/20 dark:bg-secondary-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
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
            <div className="absolute inset-0 bg-secondary-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-lg opacity-75 animate-pulse-soft"></div>
                  <div className="relative w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <CogIcon className="w-8 h-8 text-white animate-rotate-slow" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-secondary-500 dark:text-secondary-400">
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
              <div className="absolute inset-0 bg-primary-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-400 rounded-xl flex items-center justify-center shadow-lg">
                    <GlobeAltIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{t('settings.language.title')}</h3>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{t('settings.language.description')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {languages.map((lang, index) => {
                    const currentLang = i18n.language || settings.language;
                    const isActive = currentLang === lang.code || currentLang?.startsWith(lang.code);

                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 animate-scale-in ${
                          isActive
                            ? 'bg-primary-400 text-white shadow-xl'
                            : 'bg-white/60 dark:bg-gray-700 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 shadow-md'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-primary-400 rounded-xl blur-lg opacity-50 animate-pulse-soft"></div>
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


                    {section.type === 'availability' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                              {t('settings.availability.consultationDuration')}
                            </label>
                            <select
                              value={settings.dureeConsultation}
                              onChange={(e) => handleInputChange('dureeConsultation', parseInt(e.target.value))}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                            >
                              <option value="15">{t('settings.availability.duration.15min')}</option>
                              <option value="20">{t('settings.availability.duration.20min')}</option>
                              <option value="30">{t('settings.availability.duration.30min')}</option>
                              <option value="45">{t('settings.availability.duration.45min')}</option>
                              <option value="60">{t('settings.availability.duration.1hour')}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                              {t('settings.availability.pauseBetween')}
                            </label>
                            <select
                              value={settings.pauseEntreConsultations}
                              onChange={(e) => handleInputChange('pauseEntreConsultations', parseInt(e.target.value))}
                              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                            >
                              <option value="0">{t('settings.availability.pause.none')}</option>
                              <option value="5">{t('settings.availability.pause.5min')}</option>
                              <option value="10">{t('settings.availability.pause.10min')}</option>
                              <option value="15">{t('settings.availability.pause.15min')}</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-3">
                            {t('settings.availability.workingDays')}
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {jours.map((jour) => {
                              const isSelected = settings.joursOuvres.includes(jour.id);
                              return (
                                <button
                                  key={jour.id}
                                  type="button"
                                  onClick={() => handleDayToggle(jour.id)}
                                  className={`p-3 rounded-xl border-2 transition-all duration-300 font-medium ${
                                    isSelected
                                      ? 'border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300'
                                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-secondary-300'
                                  }`}
                                >
                                  {jour.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 backdrop-blur-xl rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50">
                          <div className="flex items-start gap-3">
                            <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              <p className="font-medium mb-1">{t('settings.availability.noteTitle')}</p>
                              <p>{t('settings.availability.noteMessage')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {section.settings && (
                      <div className="space-y-4">
                        {section.settings.map((setting) => (
                          <div key={setting.id} className="relative group/item">
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
                  <div className="flex items-center gap-2 text-green-600 font-semibold animate-scale-in">
                    <CheckCircleIcon className="w-6 h-6" />
                    {t('settings.saveSuccess')}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="relative group/btn px-8 py-4 rounded-2xl overflow-hidden bg-secondary-500 text-white font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-secondary-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('settings.saving')}
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-6 h-6" />
                      {t('settings.saveButton')}
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="relative bg-secondary-500/10 dark:bg-secondary-900/20 backdrop-blur-xl rounded-2xl p-6 border border-secondary-200/50 dark:border-secondary-800/50 shadow-lg animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white mb-1">{t('settings.professionalTip')}</h4>
                <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                  {t('settings.professionalTipMessage')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MedecinLayout>
  );
};

export default Settings;
