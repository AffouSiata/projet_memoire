import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import { useAuth } from '../../context/AuthContext';
import patientService from '../../services/patientService';
import PatientLayout from '../../components/layout/PatientLayout';
import {
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  HeartIcon,
  ArrowRightIcon,
  SparklesIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDateFormatter, dateFormats, timeFormats } from '../../hooks/useDateFormatter';

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formatDate, formatTime } = useDateFormatter();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [, forceUpdate] = useState({});

  // Safe translation helper to ensure strings only
  const safeT = (key, fallback = '') => {
    const result = t(key);
    return typeof result === 'string' ? result : fallback;
  };

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    loadAppointments();
    loadNotifications();

    // Mettre à jour l'heure chaque seconde
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await patientService.getAppointments();
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await patientService.getNotifications();
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  // Filtres
  const upcomingAppointments = appointments.filter(a =>
    new Date(a.date) >= new Date() && a.statut !== 'ANNULE'
  );
  // Les consultations passées sont celles avec une date < maintenant et statut CONFIRME
  const completedAppointments = appointments.filter(a =>
    new Date(a.date) < new Date() && a.statut === 'CONFIRME'
  );

  // Données pour graphique en barres - 6 derniers mois
  const getMonthlyData = () => {
    const months = [
      safeT('months.short.jan', 'Jan'), safeT('months.short.feb', 'Feb'), safeT('months.short.mar', 'Mar'),
      safeT('months.short.apr', 'Apr'), safeT('months.short.may', 'May'), safeT('months.short.jun', 'Jun'),
      safeT('months.short.jul', 'Jul'), safeT('months.short.aug', 'Aug'), safeT('months.short.sep', 'Sep'),
      safeT('months.short.oct', 'Oct'), safeT('months.short.nov', 'Nov'), safeT('months.short.dec', 'Dec')
    ];
    const now = new Date();
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      const count = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate.getMonth() === date.getMonth() &&
               apptDate.getFullYear() === date.getFullYear();
      }).length;

      monthlyData.push({ month: monthName, count });
    }

    return monthlyData;
  };

  // Fonction pour traduire les spécialités
  const translateSpecialty = (specialty) => {
    if (!specialty) return '';
    if (typeof specialty !== 'string') return '';

    const specialtyMap = {
      'Cardiologie': 'cardiology',
      'Pédiatrie': 'pediatrics',
      'Dermatologie': 'dermatology',
      'Ophtalmologie': 'ophthalmology',
      'Orthopédie': 'orthopedics',
      'Psychiatrie': 'psychiatry',
      'Neurologie': 'neurology',
      'Autre': 'other'
    };

    const key = specialtyMap[specialty];
    return key ? safeT(`specialties.${key}`, specialty) : specialty;
  };

  // Données pour graphique donut - Répartition par spécialité - couleurs LARANA
  const getSpecialtyData = () => {
    const specialties = {};
    appointments.forEach(a => {
      const specialty = a.medecin?.specialite || 'Autre';
      const translatedSpecialty = translateSpecialty(specialty);
      specialties[translatedSpecialty] = (specialties[translatedSpecialty] || 0) + 1;
    });

    const colors = ['#1DD9B5', '#66E7D5', '#33DFC7', '#5B9FFF', '#92BEFF', '#4A8EFF'];
    return Object.entries(specialties).map(([name, value], idx) => ({
      name,
      value,
      color: colors[idx % colors.length]
    }));
  };

  const monthlyData = getMonthlyData();
  const specialtyData = getSpecialtyData();

  // 2 Conseils santé du jour (calculés une seule fois)
  const dailyHealthTips = (() => {
    const tips = t('dashboard.healthTips', { returnObjects: true });
    // Ensure tips is an array
    if (!Array.isArray(tips)) {
      return ['Buvez suffisamment d\'eau', 'Faites de l\'exercice régulièrement'];
    }
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    // Retourne 2 conseils différents
    const tip1 = tips[dayOfYear % tips.length];
    const tip2 = tips[(dayOfYear + 1) % tips.length];
    // Ensure tips are strings
    return [
      typeof tip1 === 'string' ? tip1 : 'Buvez suffisamment d\'eau',
      typeof tip2 === 'string' ? tip2 : 'Faites de l\'exercice régulièrement'
    ];
  })();

  // Score Santé
  const calculateHealthScore = () => {
    if (appointments.length === 0) return 50;

    const now = new Date();
    const lastSixMonths = new Date(now.setMonth(now.getMonth() - 6));
    const recentAppointments = appointments.filter(a => new Date(a.date) >= lastSixMonths);
    const cancelledCount = appointments.filter(a => a.statut === 'ANNULE').length;
    // Compte les rendez-vous passés et confirmés comme complétés
    const completedCount = appointments.filter(a =>
      new Date(a.date) < new Date() && a.statut === 'CONFIRME'
    ).length;

    let score = 50;
    score += Math.min(recentAppointments.length * 5, 30);
    score += Math.min(completedCount * 3, 15);
    score -= Math.min(cancelledCount * 5, 15);

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  // Animation du score
  useEffect(() => {
    if (!isLoading) {
      let start = 0;
      const duration = 2000;
      const increment = healthScore / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= healthScore) {
          setAnimatedScore(healthScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [healthScore, isLoading]);

  // Calendrier
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: '', isCurrentMonth: false, hasAppointment: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(year, month, i);
      const hasAppointment = appointments.some(a => {
        const apptDate = new Date(a.date);
        return apptDate.getDate() === i &&
               apptDate.getMonth() === month &&
               apptDate.getFullYear() === year;
      });
      days.push({ day: i, isCurrentMonth: true, hasAppointment });
    }
    return days;
  };

  const monthNames = [
    t('months.january'), t('months.february'), t('months.march'), t('months.april'),
    t('months.may'), t('months.june'), t('months.july'), t('months.august'),
    t('months.september'), t('months.october'), t('months.november'), t('months.december')
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC] dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-white">{safeT('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <PatientLayout>
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 p-4 md:p-8 relative overflow-hidden">
        {/* Blobs animés en arrière-plan - couleurs LARANA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Ultra-Moderne avec effet Waouh */}
          <div className="mb-8 animate-slide-up">
            {/* Carte principale du header avec glassmorphism */}
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs d'arrière-plan */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Section gauche - Message de bienvenue */}
                  <div className="flex-1">
                    {/* Badge "Dashboard" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">{safeT('dashboard.title')}</span>
                    </div>

                    {/* Titre principal avec animation */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {safeT('common.welcome')} {user?.prenom} 👋
                    </h1>

                    <p className="text-base lg:text-lg text-gray-600 dark:text-white mb-6 font-medium">
                      {safeT('dashboard.subtitle')}
                    </p>

                    {/* Informations date/heure dans des mini-cartes */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Carte Date */}
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-white font-medium hidden sm:block">{safeT('dashboard.date')}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(currentTime, dateFormats.medium)}
                          </p>
                        </div>
                      </div>

                      {/* Carte Heure en temps réel */}
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-white font-medium hidden sm:block">{safeT('dashboard.time')}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-mono">
                            {formatTime(currentTime, timeFormats.full)}
                          </p>
                        </div>
                      </div>

                      {/* Carte Jour de la semaine - masquée sur très petit écran */}
                      <div className="hidden sm:flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-white font-medium hidden sm:block">{safeT('dashboard.day')}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white capitalize">
                            {formatDate(currentTime, dateFormats.weekday)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section droite - Notifications stylisées */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3">
                    {/* Bouton notifications premium */}
                    <button
                      onClick={() => navigate('/patient/notifications')}
                      className="relative group flex-1 lg:flex-none"
                    >
                      {/* Effet glow en arrière-plan */}
                      <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                      {/* Bouton principal */}
                      <div className="relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-gray-700 rounded-xl sm:rounded-2xl border-2 border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300">
                        <div className="relative">
                          <BellIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-white group-hover:text-blue-700 transition-colors" />
                          {/* Badge rouge animé avec effet de pulsation */}
                          {notifications.filter(n => !n.lue).length > 0 && (
                            <>
                              <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
                              <span className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                                {notifications.filter(n => !n.lue).length}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500 dark:text-white font-medium hidden sm:block">{safeT('dashboard.notifications')}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                            {notifications.filter(n => !n.lue).length > 0
                              ? `${notifications.filter(n => !n.lue).length} ${notifications.filter(n => !n.lue).length > 1 ? safeT('dashboard.newNotificationsPlural', 'nouvelles') : safeT('dashboard.newNotifications', 'nouvelle')}`
                              : safeT('dashboard.noNewNotifications', 'Aucune notification')}
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Message d'encouragement dynamique - masqué sur mobile */}
                    <div className="hidden lg:block px-4 py-2 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                      <p className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                        ✨ {safeT('dashboard.excellentDay')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche - 2/3 */}
            <div className="lg:col-span-2 space-y-6">
              {/* Grande carte hero - Dégradé Bleu-Vert LARANA */}
              <div
                className="bg-blue-700 rounded-3xl p-8 text-white shadow-md relative overflow-hidden animate-scale-in"
                style={{ animationDelay: '0.1s' }}
              >
                {/* Particules flottantes */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-10 left-20 w-2 h-2 bg-white/40 rounded-full animate-float"></div>
                  <div className="absolute top-32 left-40 w-1.5 h-1.5 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-20 right-32 w-2 h-2 bg-white/50 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute bottom-20 left-60 w-1 h-1 bg-white/40 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-white/35 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                </div>

                {/* Illustration docteur SVG */}
                <div className="absolute right-8 bottom-0 opacity-20">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Tête */}
                    <circle cx="100" cy="60" r="25" fill="white" opacity="0.8"/>
                    {/* Corps */}
                    <rect x="85" y="85" width="30" height="50" rx="5" fill="white" opacity="0.8"/>
                    {/* Bras */}
                    <rect x="70" y="95" width="15" height="35" rx="7" fill="white" opacity="0.7"/>
                    <rect x="115" y="95" width="15" height="35" rx="7" fill="white" opacity="0.7"/>
                    {/* Stéthoscope */}
                    <path d="M90 100 Q90 110, 100 110 T110 100" stroke="white" strokeWidth="3" fill="none" opacity="0.9"/>
                    <circle cx="90" cy="100" r="5" fill="white" opacity="0.9"/>
                    <circle cx="110" cy="100" r="5" fill="white" opacity="0.9"/>
                    {/* Croix médicale - couleur LARANA Bleu */}
                    <rect x="97" y="90" width="6" height="15" rx="2" fill="#5B9FFF"/>
                    <rect x="92" y="95" width="16" height="6" rx="2" fill="#5B9FFF"/>
                  </svg>
                </div>

                {/* Effet shimmer */}
                <div className="absolute inset-0 animate-shimmer"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse-soft" />
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">{safeT('dashboard.appointmentQuestion')}</h2>
                  </div>
                  <p className="text-white/90 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                    {safeT('dashboard.healthMessage')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button
                      onClick={() => navigate('/patient/appointment')}
                      className="bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:shadow-lg hover:scale-105 hover:bg-blue-800 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      {safeT('dashboard.bookAppointment')}
                      <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => navigate('/patient/history')}
                      className="glass-strong text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                    >
                      {safeT('dashboard.viewHistory')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 cartes stats horizontales */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Prochain RDV */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft animate-glow">
                    <CalendarIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-500 dark:text-white text-sm mb-1">{safeT('dashboard.stats.nextAppointment')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {upcomingAppointments.length > 0
                      ? formatDate(new Date(upcomingAppointments[0].date), dateFormats.short)
                      : safeT('dashboard.none', 'Aucun')}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white">
                    {upcomingAppointments.length > 0
                      ? formatTime(new Date(upcomingAppointments[0].date), timeFormats.short)
                      : '-'}
                  </p>
                </div>

                {/* RDV à venir */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                    <ClockIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-500 dark:text-white text-sm mb-1">{safeT('dashboard.stats.upcoming')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {upcomingAppointments.length}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white">{safeT('dashboard.appointments')}</p>
                </div>

                {/* RDV complétés */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                    <CheckCircleIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  </div>
                  <p className="text-gray-500 dark:text-white text-sm mb-1">{safeT('dashboard.stats.completed')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {completedAppointments.length}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white">{safeT('dashboard.stats.finished')}</p>
                </div>
              </div>

              {/* Graphiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Graphique en BARRES */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                  style={{ animationDelay: '0.5s' }}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{safeT('dashboard.monthlyChart')}</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlyData}>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#5B9FFF" stopOpacity={1} />
                          <stop offset="100%" stopColor="#1DD9B5" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="url(#colorGradient)"
                        radius={[12, 12, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Graphique DONUT */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                  style={{ animationDelay: '0.6s' }}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{safeT('dashboard.specialtyChart')}</h3>
                  {specialtyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={specialtyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1500}
                        >
                          {specialtyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{ fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[240px]">
                      <p className="text-gray-400 dark:text-white">{safeT('dashboard.noData')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Vos Dernières Consultations */}
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                style={{ animationDelay: '0.7s' }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{safeT('dashboard.recentConsultations')}</h3>
                {completedAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {completedAppointments.slice(0, 3).map((apt, index) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:translate-x-2 hover:shadow-md transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-full flex items-center justify-center animate-pulse-soft">
                            <HeartIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              Dr. {apt.medecin?.prenom} {apt.medecin?.nom}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-white">
                              {apt.medecin?.specialite ? translateSpecialty(apt.medecin.specialite) : t('dashboard.generalPractitioner')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(new Date(apt.date), dateFormats.short)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-white">
                            {formatTime(new Date(apt.date), timeFormats.short)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 dark:text-white">{safeT('dashboard.noRecentConsultation')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Colonne droite - 1/3 */}
            <div className="space-y-6">
              {/* Calendrier Prochain Check-Up */}
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {safeT('dashboard.nextCheckup')}
                </h3>
                <div className="mb-4">
                  <p className="text-center text-sm font-semibold text-gray-700 dark:text-white mb-2">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </p>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {[
                    t('days.short.sun'), t('days.short.mon'), t('days.short.tue'),
                    t('days.short.wed'), t('days.short.thu'), t('days.short.fri'), t('days.short.sat')
                  ].map((day, index) => (
                    <div key={index} className="text-center text-xs font-semibold text-gray-500 dark:text-white">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((dayInfo, index) => (
                    <div
                      key={index}
                      className={`aspect-square flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-300
                        ${dayInfo.isCurrentMonth
                          ? dayInfo.day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear()
                            ? 'bg-blue-500 text-white font-bold shadow-md animate-pulse-soft scale-110'
                            : dayInfo.hasAppointment
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 hover:scale-110'
                            : 'text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105'
                          : 'text-gray-300 dark:text-white'
                        }`}
                    >
                      {dayInfo.day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Score Santé */}
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in relative overflow-hidden"
                style={{ animationDelay: '0.3s' }}
              >
                {/* Particules autour du score si > 80% */}
                {healthScore > 80 && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-float"></div>
                    <div className="absolute top-20 right-10 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-20 left-12 w-1 h-1 bg-blue-500 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute bottom-10 right-12 w-1.5 h-1.5 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                )}

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 text-blue-500 dark:text-blue-400 animate-pulse-soft" />
                  {safeT('dashboard.healthScore')}
                </h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      {/* Cercle de fond */}
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="10"
                        className="dark:stroke-gray-700"
                      />
                      {/* Cercle de progression avec animation - couleur LARANA Bleu-Vert */}
                      <defs>
                        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#5B9FFF" />
                          <stop offset="100%" stopColor="#1DD9B5" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="url(#healthGradient)"
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - animatedScore / 100)}`}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(91, 159, 255, 0.5))',
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-500 dark:text-blue-400">
                          {animatedScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <p className="text-sm text-gray-600 dark:text-white text-center">
                    {healthScore > 80
                      ? t('dashboard.healthMessages.excellent')
                      : healthScore > 50
                      ? t('dashboard.healthMessages.good')
                      : t('dashboard.healthMessages.improve')}
                  </p>
                </div>

                {/* Illustration coeur battant - couleur LARANA */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-soft">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#5B9FFF"/>
                  </svg>
                </div>
              </div>

              {/* Conseils santé du jour */}
              <div
                className="bg-blue-50 dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in relative overflow-hidden"
                style={{ animationDelay: '0.4s' }}
              >
                {/* Badge "Conseil du jour" */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <SparklesIcon className="w-5 h-5 text-white animate-pulse-soft" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{safeT('dashboard.healthTip')}</h3>
                    <p className="text-xs text-gray-500 dark:text-white">
                      {formatDate(new Date(), dateFormats.monthLong)}
                    </p>
                  </div>
                </div>

                {/* 2 Conseils de santé du jour */}
                <div className="space-y-3">
                  {dailyHealthTips.map((tip, index) => (
                    <div
                      key={index}
                      className="bg-white/70 dark:bg-gray-700/70 rounded-2xl p-4 backdrop-blur-sm border border-white/50 dark:border-gray-600/50 hover:bg-white/90 dark:hover:bg-gray-700/90 hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-white leading-relaxed flex-1">
                          {tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Icône décorative */}
                <div className="absolute bottom-4 right-4 opacity-10">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse-soft">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#5B9FFF"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;
