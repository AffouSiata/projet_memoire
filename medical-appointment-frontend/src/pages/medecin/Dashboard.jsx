import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
import { useDateFormatter, dateFormats, timeFormats } from '../../hooks/useDateFormatter';
import {
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowRightIcon,
  LightBulbIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MedecinDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatDate, formatTime } = useDateFormatter();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadData();

    // Mettre à jour l'heure chaque seconde
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      const [apptRes, patientRes] = await Promise.all([
        medecinService.getAppointments(),
        medecinService.getPatients(),
      ]);
      setAppointments(apptRes.data.data || []);
      // S'assurer que patients est un tableau
      const patientsData = patientRes.data?.data || patientRes.data || [];
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error(t('medecin.dashboard.loadError'), error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtres pour les statistiques
  const todayAppointments = appointments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.date).toDateString() === today;
  });

  const pendingAppointments = appointments.filter(a => a.statut === 'EN_ATTENTE');

  // Données pour graphique en barres - 6 derniers mois
  const getMonthlyData = () => {
    const months = [
      t('months.short.jan'), t('months.short.feb'), t('months.short.mar'),
      t('months.short.apr'), t('months.short.may'), t('months.short.jun'),
      t('months.short.jul'), t('months.short.aug'), t('months.short.sep'),
      t('months.short.oct'), t('months.short.nov'), t('months.short.dec')
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

  // Données pour graphique donut - Répartition par statut
  const getStatusData = () => {
    const statuses = {
      [t('medecin.dashboard.statusConfirmed')]: appointments.filter(a => a.statut === 'CONFIRME').length,
      [t('medecin.dashboard.statusPending')]: appointments.filter(a => a.statut === 'EN_ATTENTE').length,
      [t('medecin.dashboard.statusCancelled')]: appointments.filter(a => a.statut === 'ANNULE').length,
    };

    const colors = ['#10B981', '#F59E0B', '#EF4444'];
    return Object.entries(statuses)
      .filter(([_, value]) => value > 0)
      .map(([name, value], idx) => ({
        name,
        value,
        color: colors[idx % colors.length]
      }));
  };

  // Calendrier du mois avec code couleur
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: '', isCurrentMonth: false, appointments: [] });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(year, month, i);
      const dayAppointments = appointments.filter(a => {
        const apptDate = new Date(a.date);
        return apptDate.getDate() === i &&
               apptDate.getMonth() === month &&
               apptDate.getFullYear() === year;
      });
      days.push({ day: i, isCurrentMonth: true, appointments: dayAppointments });
    }
    return days;
  };

  // Timeline - Rendez-vous du mois
  const getMonthTimeline = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return appointments.filter(a => {
      const apptDate = new Date(a.date);
      return apptDate >= monthStart && apptDate <= monthEnd;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Suggestions AI
  const getAISuggestions = () => {
    // Vérifier que patients est bien un tableau
    if (!Array.isArray(patients)) {
      return [
        {
          text: `${pendingAppointments.length} rendez-vous en attente de confirmation`,
          icon: '⏳',
          color: 'blue'
        },
        {
          text: 'Prévoir rappels pour consultations de suivi',
          icon: '🩺',
          color: 'green'
        },
        {
          text: 'Optimisez votre planning pour une meilleure efficacité',
          icon: '📅',
          color: 'orange'
        }
      ];
    }

    const now = new Date();
    const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));

    const inactivePatients = patients.filter(patient => {
      const lastVisit = appointments
        .filter(a => a.patientId === patient.id && a.statut === 'CONFIRME')
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      return !lastVisit || new Date(lastVisit.date) < threeMonthsAgo;
    });

    return [
      {
        text: t('medecin.dashboard.inactivePatientsMsg', { count: inactivePatients.length }),
        icon: '👥',
        color: 'orange'
      },
      {
        text: t('medecin.dashboard.pendingConfirmation', { count: pendingAppointments.length }),
        icon: '⏳',
        color: 'blue'
      },
      {
        text: t('medecin.dashboard.followUpReminder'),
        icon: '🩺',
        color: 'green'
      }
    ];
  };

  const monthlyData = getMonthlyData();
  const statusData = getStatusData();
  const monthDays = getDaysInMonth(new Date());
  const monthTimeline = getMonthTimeline();
  const aiSuggestions = getAISuggestions();

  const monthNames = [
    t('months.full.jan'), t('months.full.feb'), t('months.full.mar'),
    t('months.full.apr'), t('months.full.may'), t('months.full.jun'),
    t('months.full.jul'), t('months.full.aug'), t('months.full.sep'),
    t('months.full.oct'), t('months.full.nov'), t('months.full.dec')
  ];

  if (isLoading) {
    return (
      <MedecinLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC] dark:bg-gray-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-secondary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-white">{t('common.loading')}</p>
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

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Ultra-Moderne avec effet Glassmorphism */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs d'arrière-plan */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  {/* Section gauche - Message de bienvenue */}
                  <div className="flex-1">
                    {/* Badge "Espace Médecin" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-secondary-700 dark:text-secondary-400 uppercase tracking-wider">Espace Médecin</span>
                    </div>

                    {/* Titre principal avec animation */}
                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('common.welcome')} Dr. {user?.prenom} {user?.nom} 👨‍⚕️
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                      {user?.specialite}
                    </p>

                    {/* Informations date/heure dans des mini-cartes */}
                    <div className="flex items-center gap-4">
                      {/* Carte Date */}
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.date')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(currentTime, dateFormats.medium)}
                          </p>
                        </div>
                      </div>

                      {/* Carte Heure en temps réel */}
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
                          <ClockIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.time')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                            {formatTime(currentTime, timeFormats.full)}
                          </p>
                        </div>
                      </div>

                      {/* Carte Jour de la semaine */}
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-xl flex items-center justify-center">
                          <SparklesIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.day')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                            {formatDate(currentTime, dateFormats.weekday)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section droite - Widget conseil santé */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="px-6 py-4 bg-gradient-to-r from-secondary-50 to-primary-50 dark:from-secondary-900/30 dark:to-primary-900/30 rounded-2xl border border-secondary-100 dark:border-secondary-800 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center">
                          <LightBulbIcon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xs font-bold text-secondary-700 dark:text-secondary-400 uppercase tracking-wider">Conseil du jour</p>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                        💡 Vérifiez régulièrement vos créneaux horaires pour optimiser vos consultations
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
              {/* Grande carte hero - couleur LARANA */}
              <div
                className="bg-secondary-500 rounded-3xl p-8 text-white shadow-md relative overflow-hidden animate-scale-in"
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

                {/* Illustration médicale SVG */}
                <div className="absolute right-8 bottom-0 opacity-20">
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Stéthoscope */}
                    <circle cx="60" cy="50" r="15" fill="white" opacity="0.8"/>
                    <circle cx="140" cy="50" r="15" fill="white" opacity="0.8"/>
                    <path d="M60 65 Q60 120, 100 150 T140 65" stroke="white" strokeWidth="8" fill="none" opacity="0.8"/>
                    <circle cx="100" cy="160" r="20" fill="white" opacity="0.9"/>
                    {/* Croix médicale */}
                    <rect x="95" y="85" width="10" height="30" rx="3" fill="white" opacity="0.9"/>
                    <rect x="85" y="95" width="30" height="10" rx="3" fill="white" opacity="0.9"/>
                  </svg>
                </div>

                {/* Effet shimmer */}
                <div className="absolute inset-0 animate-shimmer"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-6 h-6 animate-pulse-soft" />
                    <h2 className="text-2xl font-bold">{t('medecin.dashboard.activityOverview')}</h2>
                  </div>
                  <p className="text-white/90 mb-6 text-lg">
                    {t('medecin.dashboard.activityDescription')}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate('/medecin/appointments')}
                      className="bg-white text-secondary-600 px-6 py-3 rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                      {t('medecin.dashboard.viewAppointments')}
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => navigate('/medecin/patients')}
                      className="glass-strong text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300"
                    >
                      {t('medecin.dashboard.myPatients')}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 cartes stats horizontales */}
              <div className="grid grid-cols-4 gap-4">
                {/* Rendez-vous aujourd'hui */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.2s' }}
                >
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                    <CalendarIcon className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.dashboard.todayAppointments')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {todayAppointments.length}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.dashboard.today')}</p>
                </div>

                {/* RDV à venir */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                    <ClockIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.dashboard.upcoming')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {appointments.length}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.dashboard.upcomingLabel')}</p>
                </div>

                {/* Patients suivis */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.4s' }}
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                    <UsersIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.dashboard.patientsFollowed')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {patients.length}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.dashboard.patientsLabel')}</p>
                </div>

                {/* En attente */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                    <ExclamationCircleIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.dashboard.pending')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {pendingAppointments.length}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.dashboard.pendingLabel')}</p>
                </div>
              </div>

              {/* Graphiques statistiques */}
              <div className="grid grid-cols-2 gap-6">
                {/* Graphique en BARRES - Rendez-vous par mois */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                  style={{ animationDelay: '0.6s' }}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                    {t('medecin.dashboard.appointmentsByMonth')}
                  </h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlyData}>
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
                        fill="#14B8A6"
                        radius={[12, 12, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Graphique DONUT - Répartition par statut */}
                <div
                  className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                  style={{ animationDelay: '0.7s' }}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Répartition par statut</h3>
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1500}
                        >
                          {statusData.map((entry, index) => (
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
                      <p className="text-gray-400 dark:text-gray-500">{t('medecin.dashboard.noData')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline horizontale - Rendez-vous du mois REDESIGN */}
              <div
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-scale-in relative overflow-hidden"
                style={{ animationDelay: '0.8s' }}
              >
                {/* Effet décoratif d'arrière-plan */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100/30 dark:bg-secondary-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                {/* Header de la section */}
                <div className="relative z-10 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <CalendarIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {t('medecin.dashboard.monthPlanning')}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {monthNames[new Date().getMonth()]} {new Date().getFullYear()} • {monthTimeline.length} {t('medecin.dashboard.appointmentsCount')}
                        </p>
                      </div>
                    </div>

                    {/* Badge du nombre de rendez-vous */}
                    <div className="px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                      <p className="text-sm font-bold text-secondary-700 dark:text-secondary-400">
                        {monthTimeline.slice(0, 10).length} {t('medecin.dashboard.displayed')}
                      </p>
                    </div>
                  </div>
                </div>

                {monthTimeline.length > 0 ? (
                  <div className="relative">
                    {/* Ligne de timeline moderne avec dégradé */}
                    <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary-300 dark:via-secondary-700 to-transparent"></div>

                    {/* Rendez-vous sur la timeline */}
                    <div className="relative flex overflow-x-auto pb-6 gap-6 scrollbar-thin scrollbar-thumb-secondary-300 scrollbar-track-gray-100 dark:scrollbar-thumb-secondary-700 dark:scrollbar-track-gray-800">
                      {monthTimeline.slice(0, 10).map((appt, index) => {
                        const isConfirmed = appt.statut === 'CONFIRME';
                        const isPending = appt.statut === 'EN_ATTENTE';
                        const isCancelled = appt.statut === 'ANNULE';

                        return (
                          <div
                            key={appt.id}
                            className="flex-shrink-0 w-64 animate-slide-up"
                            style={{ animationDelay: `${0.9 + index * 0.05}s` }}
                          >
                            <div className="relative group">
                              {/* Point sur la timeline avec animation pulse */}
                              <div className="flex justify-center mb-4">
                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                                  isConfirmed ? 'bg-green-500' :
                                  isPending ? 'bg-orange-500' :
                                  'bg-red-500'
                                } ring-4 ring-white dark:ring-gray-800 group-hover:scale-110 transition-transform duration-300`}>
                                  {isConfirmed && <CheckCircleIcon className="w-5 h-5 text-white" />}
                                  {isPending && <ClockIcon className="w-5 h-5 text-white" />}
                                  {isCancelled && <ExclamationCircleIcon className="w-5 h-5 text-white" />}

                                  {/* Effet pulse pour les rendez-vous en attente */}
                                  {isPending && (
                                    <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-75"></div>
                                  )}
                                </div>
                              </div>

                              {/* Connecteur au point */}
                              <div className={`absolute top-10 left-1/2 w-0.5 h-4 -translate-x-1/2 ${
                                isConfirmed ? 'bg-green-500' :
                                isPending ? 'bg-orange-500' :
                                'bg-red-500'
                              }`}></div>

                              {/* Carte rendez-vous modernisée */}
                              <div className={`relative p-5 rounded-2xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                                isConfirmed
                                  ? 'bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 border-green-300 dark:border-green-800'
                                  : isPending
                                  ? 'bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-900/10 border-orange-300 dark:border-orange-800'
                                  : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-900/10 border-red-300 dark:border-red-800'
                              }`}>
                                {/* Badge de statut */}
                                <div className="absolute -top-2 -right-2">
                                  <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-md ${
                                    isConfirmed ? 'bg-green-500 text-white' :
                                    isPending ? 'bg-orange-500 text-white' :
                                    'bg-red-500 text-white'
                                  }`}>
                                    {isConfirmed ? '✓' : isPending ? '⏳' : '✕'}
                                  </span>
                                </div>

                                {/* Informations du rendez-vous */}
                                <div className="space-y-3">
                                  {/* Date */}
                                  <div className="flex items-center gap-2">
                                    <CalendarIcon className={`w-4 h-4 ${
                                      isConfirmed ? 'text-green-600 dark:text-green-400' :
                                      isPending ? 'text-orange-600 dark:text-orange-400' :
                                      'text-red-600 dark:text-red-400'
                                    }`} />
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                      {formatDate(new Date(appt.date), dateFormats.short)}
                                    </p>
                                  </div>

                                  {/* Heure */}
                                  <div className="flex items-center gap-2">
                                    <ClockIcon className={`w-4 h-4 ${
                                      isConfirmed ? 'text-green-600 dark:text-green-400' :
                                      isPending ? 'text-orange-600 dark:text-orange-400' :
                                      'text-red-600 dark:text-red-400'
                                    }`} />
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      {formatTime(new Date(appt.date), timeFormats.short)}
                                    </p>
                                  </div>

                                  {/* Séparateur */}
                                  <div className={`h-px ${
                                    isConfirmed ? 'bg-green-200 dark:bg-green-800' :
                                    isPending ? 'bg-orange-200 dark:bg-orange-800' :
                                    'bg-red-200 dark:bg-red-800'
                                  }`}></div>

                                  {/* Patient */}
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                                      isConfirmed ? 'bg-green-500 text-white' :
                                      isPending ? 'bg-orange-500 text-white' :
                                      'bg-red-500 text-white'
                                    }`}>
                                      {appt.patient?.prenom?.charAt(0)}{appt.patient?.nom?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                        {appt.patient?.prenom} {appt.patient?.nom}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {appt.motif || 'Consultation'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Indicateur de scroll si plus de 10 rendez-vous */}
                    {monthTimeline.length > 10 && (
                      <div className="absolute bottom-0 right-0 px-4 py-2 bg-secondary-500 text-white text-xs font-semibold rounded-tl-2xl rounded-br-2xl shadow-lg">
                        +{monthTimeline.length - 10} {t('medecin.dashboard.moreAppointments')} →
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">{t('medecin.dashboard.noAppointmentsThisMonth')}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">{t('medecin.dashboard.planningFree')}</p>
                  </div>
                )}
              </div>

              {/* Planning du jour */}
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                style={{ animationDelay: '0.9s' }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ClockIcon className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
                    {t('medecin.dashboard.todaySchedule')}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {todayAppointments.length} {t('medecin.dashboard.appointmentsCount')}
                  </span>
                </div>

                {todayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {todayAppointments.map((appt, index) => (
                      <div
                        key={appt.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-secondary-50 dark:hover:bg-secondary-900/30 hover:translate-x-2 hover:shadow-md transition-all duration-300 animate-slide-up"
                        style={{ animationDelay: `${1.0 + index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-full flex items-center justify-center font-bold text-secondary-600 dark:text-secondary-400">
                            {appt.patient?.prenom?.charAt(0)}{appt.patient?.nom?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {appt.patient?.prenom} {appt.patient?.nom}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {appt.motif}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {formatTime(new Date(appt.date), timeFormats.short)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(new Date(appt.date), dateFormats.short)}
                            </p>
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-xl font-semibold ${
                            appt.statut === 'CONFIRME'
                              ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                              : 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400'
                          }`}>
                            {appt.statut === 'CONFIRME' ? 'Confirmé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{t('medecin.dashboard.noAppointmentsToday')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Colonne droite - 1/3 */}
            <div className="space-y-6">
              {/* Mini-calendrier avec code couleur */}
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                style={{ animationDelay: '0.2s' }}
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                  {t('medecin.dashboard.calendar')} - {monthNames[new Date().getMonth()]}
                </h3>

                <div className="mb-4">
                  <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {monthNames[new Date().getMonth()]} {new Date().getFullYear()}
                  </p>
                </div>

                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                    <div key={index} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Jours du mois avec code couleur */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((dayInfo, index) => {
                    const isToday = dayInfo.day === new Date().getDate() &&
                      new Date().getMonth() === new Date().getMonth();

                    // Code couleur basé sur le statut des rendez-vous
                    let bgColor = 'bg-gray-50 dark:bg-gray-700';
                    let textColor = 'text-gray-700 dark:text-gray-300';

                    if (dayInfo.isCurrentMonth && dayInfo.appointments.length > 0) {
                      const hasConfirmed = dayInfo.appointments.some(a => a.statut === 'CONFIRME');
                      const hasPending = dayInfo.appointments.some(a => a.statut === 'EN_ATTENTE');
                      const hasCancelled = dayInfo.appointments.some(a => a.statut === 'ANNULE');

                      if (hasCancelled) {
                        bgColor = 'bg-red-100 dark:bg-red-900/30';
                        textColor = 'text-red-700 dark:text-red-400';
                      } else if (dayInfo.appointments.length >= 5) {
                        bgColor = 'bg-orange-100 dark:bg-orange-900/30';
                        textColor = 'text-orange-700 dark:text-orange-400';
                      } else if (hasConfirmed) {
                        bgColor = 'bg-green-100 dark:bg-green-900/30';
                        textColor = 'text-green-700 dark:text-green-400';
                      } else if (hasPending) {
                        bgColor = 'bg-blue-100 dark:bg-blue-900/30';
                        textColor = 'text-blue-700 dark:text-blue-400';
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-300 ${
                          dayInfo.isCurrentMonth
                            ? isToday
                              ? 'bg-secondary-500 text-white font-bold shadow-md scale-110'
                              : `${bgColor} ${textColor} hover:scale-105`
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        {dayInfo.day}
                      </div>
                    );
                  })}
                </div>

                {/* Légende du code couleur */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Confirmé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">En attente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-100 dark:bg-orange-900/30 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Presque complet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded"></div>
                      <span className="text-gray-600 dark:text-gray-400">Annulé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bloc Assistant AI avec suggestions */}
              <div
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 shadow-md animate-scale-in border-2 border-purple-100 dark:border-purple-800"
                style={{ animationDelay: '0.3s' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <SparklesIcon className="w-6 h-6 text-white animate-pulse-soft" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('medecin.dashboard.aiAssistant')}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('medecin.dashboard.smartSuggestions')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border-2 ${
                        suggestion.color === 'orange'
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                          : suggestion.color === 'blue'
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                          : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      } hover:scale-105 transition-all duration-300`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium flex-1">
                          {suggestion.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mini score santé visuel */}
                <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Score activité</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-secondary-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((appointments.length / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-secondary-600 dark:text-secondary-400">
                        {Math.min(Math.round((appointments.length / 50) * 100), 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accès rapides */}
              <div
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md animate-scale-in"
                style={{ animationDelay: '0.4s' }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                  Accès rapides
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/medecin/appointments')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-secondary-900/30 dark:to-secondary-900/50 rounded-2xl hover:scale-105 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">Rendez-vous</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Gérer le planning</p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/medecin/patients')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/50 rounded-2xl hover:scale-105 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">Mes Patients</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Liste et dossiers</p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/medecin/notes')}
                    className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-900/50 rounded-2xl hover:scale-105 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">Notes Médicales</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Consulter et créer</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MedecinLayout>
  );
};

export default MedecinDashboard;
