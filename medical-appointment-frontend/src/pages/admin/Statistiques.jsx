import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  ChartBarIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
  Area, AreaChart, ComposedChart
} from 'recharts';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';

const AdminStatistiques = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Safe translation helper to ensure strings only
  const safeT = (key, fallback = '') => {
    const result = t(key);
    return typeof result === 'string' ? result : fallback;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fonction pour traduire les spécialités
  const translateSpecialty = useCallback((specialty) => {
    if (!specialty || i18n.language === 'fr') return specialty || '';

    const specialtyMap = {
      'cardiologie': 'cardiology',
      'pédiatrie': 'pediatrics',
      'dermatologie': 'dermatology',
      'neurologie': 'neurology',
      'autres': 'other',
      'autre': 'other'
    };

    const key = specialtyMap[specialty.toLowerCase()];
    if (!key) return specialty;

    return safeT(`specialties.${key}`, specialty);
  }, [i18n.language]);

  // Fonction pour traduire les mois
  const translateMonth = useCallback((month) => {
    if (i18n.language === 'fr') return month;

    const monthMap = {
      'jan': 'Jan',
      'fév': 'Feb',
      'mar': 'Mar',
      'avr': 'Apr',
      'mai': 'May',
      'juin': 'Jun',
      'juil': 'Jul',
      'août': 'Aug',
      'sep': 'Sep',
      'oct': 'Oct',
      'nov': 'Nov',
      'déc': 'Dec'
    };

    return monthMap[month.toLowerCase()] || month;
  }, [i18n.language]);

  // Statistiques KPI
  const stats = useMemo(() => [
    {
      title: safeT('admin.statistiques.kpi.totalAppointments', 'Total Rendez-vous'),
      value: '1,248',
      change: '+13.9%',
      trend: 'up',
      icon: CalendarIcon,
      gradient: 'bg-blue-700',
      bgGradient: 'bg-blue-700',
    },
    {
      title: safeT('admin.statistiques.kpi.activePatients', 'Patients Actifs'),
      value: '847',
      change: '+6.9%',
      trend: 'up',
      icon: UsersIcon,
      gradient: 'bg-blue-600',
      bgGradient: 'bg-blue-600',
    },
    {
      title: safeT('admin.statistiques.kpi.successRate', 'Taux de Succès'),
      value: '87.3%',
      change: '+3.2%',
      trend: 'up',
      icon: CheckCircleIcon,
      gradient: 'bg-blue-700',
      bgGradient: 'bg-blue-700',
    },
    {
      title: safeT('admin.statistiques.kpi.totalRevenue', 'Revenus Totaux'),
      value: '124,560 €',
      change: '+10.9%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-500 to-orange-600',
    },
  ], []);

  // Données évolution mensuelle
  const monthlyData = useMemo(() => [
    { month: 'Jan', rdv: 320, revenus: 27200, patients: 180 },
    { month: 'Fév', rdv: 350, revenus: 29750, patients: 195 },
    { month: 'Mar', rdv: 380, revenus: 32300, patients: 210 },
    { month: 'Avr', rdv: 420, revenus: 35700, patients: 234 },
    { month: 'Mai', rdv: 450, revenus: 38250, patients: 250 },
    { month: 'Juin', rdv: 480, revenus: 40800, patients: 279 },
  ].map(item => ({ ...item, month: translateMonth(item.month) })), [translateMonth]);

  // Distribution par spécialité
  const specialtyData = useMemo(() => [
    { name: 'Cardiologie', value: 145, color: '#14B8A6' },
    { name: 'Pédiatrie', value: 128, color: '#10B981' },
    { name: 'Dermatologie', value: 98, color: '#8B5CF6' },
    { name: 'Neurologie', value: 52, color: '#F59E0B' },
    { name: 'Autres', value: 27, color: '#6B7280' },
  ].map(item => ({ ...item, name: translateSpecialty(item.name) })), [translateSpecialty]);

  // Top médecins
  const topMedecins = useMemo(() => [
    { name: 'Dr. Kouadio', specialty: 'Cardiologie', rdv: 87, revenus: 7395, satisfaction: 4.9, trend: 12 },
    { name: 'Dr. Kone', specialty: 'Pédiatrie', rdv: 76, revenus: 4940, satisfaction: 4.8, trend: 8 },
    { name: 'Dr. Traore', specialty: 'Dermatologie', rdv: 65, revenus: 4875, satisfaction: 4.7, trend: -3 },
    { name: 'Dr. Diaby', specialty: 'Neurologie', rdv: 58, revenus: 4930, satisfaction: 4.6, trend: 5 },
  ].map(medecin => ({ ...medecin, specialty: translateSpecialty(medecin.specialty) })), [translateSpecialty]);

  // Statistiques horaires
  const hourlyStats = [
    { hour: '08h', rdv: 12 },
    { hour: '09h', rdv: 28 },
    { hour: '10h', rdv: 35 },
    { hour: '11h', rdv: 42 },
    { hour: '12h', rdv: 18 },
    { hour: '14h', rdv: 38 },
    { hour: '15h', rdv: 45 },
    { hour: '16h', rdv: 40 },
    { hour: '17h', rdv: 32 },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 py-8 px-4 relative overflow-hidden">
        {/* Blobs animés en arrière-plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Ultra-Moderne avec effet Waouh */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs d'arrière-plan */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        {safeT('admin.statistics.analytics', 'Analytics')}
                      </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {safeT('admin.statistics.title', 'Statistiques')}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                      {safeT('admin.statistics.subtitle', 'Vue d\'ensemble')}
                    </p>

                    {/* Mini-cartes date/heure */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{safeT('dashboard.date', 'Date')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(currentTime, dateFormats.medium)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                          <ClockIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{safeT('dashboard.time', 'Heure')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                            {currentTime.toLocaleTimeString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section droite - Stats */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative px-6 py-4 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                          <ChartBarIcon className="w-6 h-6 text-white" />
                          <div className="text-left">
                            <p className="text-xs text-white/80 font-medium">Total Rendez-vous</p>
                            <p className="text-2xl font-bold text-white">1,248</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal - Rétréci et centré */}
          <div className="max-w-[97%] mx-auto">

          {/* Period Selector */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex gap-2">
                {['today', 'week', 'month', 'year'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedPeriod === period
                        ? 'bg-blue-700 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {period === 'today' && "Aujourd'hui"}
                    {period === 'week' && 'Cette Semaine'}
                    {period === 'month' && 'Ce Mois'}
                    {period === 'year' && 'Cette Année'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top Médecins & Statistiques Horaires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Médecins */}
            <div className="group relative animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg">
                    <TrophyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Top Médecins
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Performance du mois
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {topMedecins.map((medecin, index) => (
                    <div
                      key={index}
                      className="relative group/item bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg transition-all hover:scale-105"
                    >
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <FireIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold">#{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">{medecin.name}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{medecin.specialty}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <StarIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{medecin.satisfaction}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${medecin.trend > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            {medecin.trend > 0 ? (
                              <ArrowTrendingUpIcon className="w-3 h-3" />
                            ) : (
                              <ArrowTrendingDownIcon className="w-3 h-3" />
                            )}
                            <span className="text-xs font-bold">{Math.abs(medecin.trend)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">RDV</p>
                          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{medecin.rdv}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Revenus</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{medecin.revenus}€</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Statistiques Horaires */}
            <div className="group relative animate-scale-in" style={{ animationDelay: '300ms' }}>
              <div className="absolute -inset-0.5 bg-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-700 rounded-xl shadow-lg">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Affluence Horaire
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Distribution des RDV
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={hourlyStats}>
                    <defs>
                      <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rdv"
                      stroke="#14B8A6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#hourlyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStatistiques;
