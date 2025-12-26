import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
import {
  UsersIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDateFormatter, dateFormats, timeFormats } from '../../hooks/useDateFormatter';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formatDate, formatTime } = useDateFormatter();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [, forceUpdate] = useState({});

  useEffect(() => {
    loadStats();

    // Mettre à jour l'heure chaque seconde
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Forcer le re-render quand la langue change
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getStatistics();
      const statsData = response.data;

      // Charger les prochains rendez-vous
      try {
        const appointmentsResponse = await adminService.getAppointments({
          limit: 50, // Charger plus pour filtrer ensuite
          page: 1
        });

        console.log('📅 Appointments response:', appointmentsResponse.data);

        // Filtrer pour ne garder que les rendez-vous futurs (confirmés ou en attente)
        const now = new Date();
        const allAppointments = appointmentsResponse.data.data || [];

        const upcomingAppointments = allAppointments
          .filter(rdv => {
            const rdvDate = new Date(rdv.date);
            const isFuture = rdvDate >= now;
            const isValidStatus = rdv.statut === 'CONFIRME' || rdv.statut === 'EN_ATTENTE';
            return isFuture && isValidStatus;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);

        console.log('✅ Upcoming appointments:', upcomingAppointments);

        statsData.rendezVous = {
          ...statsData.rendezVous,
          prochains: upcomingAppointments
        };
      } catch (error) {
        console.error('❌ Erreur chargement prochains RDV:', error);
        statsData.rendezVous = {
          ...statsData.rendezVous,
          prochains: []
        };
      }

      setStats(statsData);
    } catch (error) {
      console.error(t('admin.dashboard.loadError'), error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul du taux de satisfaction dynamique
  const calculateSatisfactionRate = () => {
    if (!stats) return 0;

    let score = 50; // Score de base

    // Facteur 1: Taux de rendez-vous non annulés (max +30 points)
    const totalRdv = stats.rendezVous?.total || 0;
    if (totalRdv > 0) {
      const tauxAnnulation = stats.rendezVous?.tauxAnnulation || 0;
      const tauxReussite = 100 - tauxAnnulation;
      score += (tauxReussite / 100) * 30;
    }

    // Facteur 2: Activité des utilisateurs (max +15 points)
    const totalPatients = stats.patients?.total || 0;
    const totalMedecins = stats.medecins?.total || 0;
    const activiteUsers = Math.min(totalPatients + totalMedecins, 20);
    score += (activiteUsers / 20) * 15;

    // Facteur 3: Rendez-vous confirmés (max +5 points)
    if (totalRdv > 0) {
      const rdvConfirmes = stats.rendezVous?.confirmes || 0;
      const ratioConfirmes = rdvConfirmes / totalRdv;
      score += ratioConfirmes * 5;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const satisfactionRate = calculateSatisfactionRate();

  // Données pour graphiques
  const getAppointmentsByStatus = () => {
    if (!stats?.rendezVous?.parStatut) return [];

    const statusColors = {
      'CONFIRME': '#10B981',
      'EN_ATTENTE': '#F59E0B',
      'ANNULE': '#EF4444'
    };

    const statusTranslations = {
      'CONFIRME': t('admin.dashboard.statusConfirmed'),
      'EN_ATTENTE': t('admin.dashboard.statusPending'),
      'ANNULE': t('admin.dashboard.statusCancelled')
    };

    return stats.rendezVous.parStatut.map(item => ({
      name: statusTranslations[item.statut] || item.statut,
      value: item.count,
      color: statusColors[item.statut] || '#5B9FFF'
    }));
  };

  const getMonthlyAppointments = () => {
    const months = [
      t('months.short.jan'), t('months.short.feb'), t('months.short.mar'),
      t('months.short.apr'), t('months.short.may'), t('months.short.jun')
    ];

    // Données simulées pour les 6 derniers mois
    return months.map((month, idx) => ({
      month,
      count: Math.floor(Math.random() * 50) + 20
    }));
  };

  // Fonction pour traduire les spécialités
  const translateSpecialty = (specialty) => {
    if (!specialty) return specialty;

    const specialtyMap = {
      'Cardiologie': 'cardiology',
      'Pédiatrie': 'pediatrics',
      'Dermatologie': 'dermatology',
      'Ophtalmologie': 'ophthalmology',
      'Orthopédie': 'orthopedics',
      'Psychiatrie': 'psychiatry',
      'Neurologie': 'neurology',
      'Gynécologie': 'gynecology',
      'Médecine générale': 'generalMedicine',
      'Autre': 'other'
    };

    const key = specialtyMap[specialty];
    return key ? t(`specialties.${key}`) : specialty;
  };

  // Fonction pour traduire les motifs de consultation
  const translateMotif = (motif) => {
    if (!motif) return motif;

    // Map des spécialités en français vers leurs clés de traduction
    const specialtyMap = {
      'cardiologie': 'cardiology',
      'cardiologique': 'cardiology',
      'cardiaque': 'cardiology',
      'pédiatrie': 'pediatrics',
      'pédiatrique': 'pediatrics',
      'pédiatrique': 'pediatrics',
      'dermatologie': 'dermatology',
      'dermatologique': 'dermatology',
      'dermatologique': 'dermatology',
      'cutané': 'dermatology',
      'ophtalmologie': 'ophthalmology',
      'ophtalmologique': 'ophthalmology',
      'oculaire': 'ophthalmology',
      'orthopédie': 'orthopedics',
      'orthopédique': 'orthopedics',
      'osseux': 'orthopedics',
      'psychiatrie': 'psychiatry',
      'psychiatrique': 'psychiatry',
      'psychologique': 'psychiatry',
      'neurologie': 'neurology',
      'neurologique': 'neurology',
      'nerveux': 'neurology',
      'gynécologie': 'gynecology',
      'gynécologique': 'gynecology'
    };

    // Normaliser le motif
    const motifLower = motif.toLowerCase();

    // Motifs spécifiques complets
    const specificMotifs = {
      'vaccination enfant': t('motifs.childVaccination'),
      'consultation de routine': t('motifs.routineConsultation'),
      'suivi': t('motifs.followUp'),
      'bilan de santé général': t('motifs.generalHealthCheckup'),
      'consultation': t('common.consultation'),
      'examen': t('motifs.examination'),
      'contrôle': t('motifs.checkup'),
      'urgence': t('motifs.emergency'),
      'douleur': t('motifs.pain'),
      'fièvre': t('motifs.fever'),
      'toux': t('motifs.cough'),
      'mal de tête': t('motifs.headache'),
      'migraine': t('motifs.migraine'),
      'allergie': t('motifs.allergy'),
      'infection': t('motifs.infection'),
      'blessure': t('motifs.injury'),
      'fracture': t('motifs.fracture'),
      'entorse': t('motifs.sprain')
    };

    // Vérifier les motifs spécifiques complets
    if (specificMotifs[motifLower]) {
      return specificMotifs[motifLower];
    }

    // Pattern: "Consultation de suivi [spécialité]"
    if (motifLower.includes('consultation de suivi')) {
      for (const [frSpecialty, enKey] of Object.entries(specialtyMap)) {
        if (motifLower.includes(frSpecialty)) {
          return `${t('specialties.' + enKey)} ${t('motifs.followUp')} ${t('common.consultation')}`;
        }
      }
    }

    // Pattern: "Suivi [spécialité]"
    if (motifLower.startsWith('suivi')) {
      for (const [frSpecialty, enKey] of Object.entries(specialtyMap)) {
        if (motifLower.includes(frSpecialty)) {
          return `${t('specialties.' + enKey)} ${t('motifs.followUp')}`;
        }
      }
    }

    // Pattern: "Consultation de routine [spécialité]"
    if (motifLower.includes('consultation de routine')) {
      for (const [frSpecialty, enKey] of Object.entries(specialtyMap)) {
        if (motifLower.includes(frSpecialty)) {
          return `${t('motifs.routineConsultation')} ${t('specialties.' + enKey)}`;
        }
      }
    }

    // Pattern: "Contrôle [spécialité]" ou "Examen [spécialité]"
    if (motifLower.includes('contrôle') || motifLower.includes('examen')) {
      for (const [frSpecialty, enKey] of Object.entries(specialtyMap)) {
        if (motifLower.includes(frSpecialty)) {
          const prefix = motifLower.includes('contrôle') ? t('motifs.checkup') : t('motifs.examination');
          return `${t('specialties.' + enKey)} ${prefix}`;
        }
      }
    }

    // Pattern: "Consultation [spécialité]" ou "Consultation [adjectif spécialité]"
    if (motifLower.includes('consultation')) {
      for (const [frSpecialty, enKey] of Object.entries(specialtyMap)) {
        if (motifLower.includes(frSpecialty)) {
          const parts = motif.split(' - ');
          if (parts.length > 1) {
            // Traduire la partie après le tiret
            let description = parts[1];

            if (i18n.language === 'en') {
              const descriptionTranslations = {
                'Suivi traitement': 'Treatment follow-up',
                'suivi traitement': 'treatment follow-up',
                'Suivi': 'Follow-up',
                'suivi': 'follow-up',
                'traitement': 'treatment',
                'Traitement': 'Treatment',
                'Contrôle': 'Check-up',
                'contrôle': 'check-up',
                'Examen': 'Examination',
                'examen': 'examination',
                'acné': 'acne',
                'Acné': 'Acne',
                'eczéma': 'eczema',
                'Eczéma': 'Eczema',
                'allergie': 'allergy',
                'Allergie': 'Allergy',
                'douleur': 'pain',
                'Douleur': 'Pain',
                'première consultation': 'first consultation',
                'Première consultation': 'First consultation',
                'rendez-vous de contrôle': 'follow-up appointment',
                'Rendez-vous de contrôle': 'Follow-up appointment'
              };

              // Remplacer chaque mot/phrase dans la description
              for (const [frWord, enWord] of Object.entries(descriptionTranslations)) {
                description = description.replace(new RegExp(frWord, 'g'), enWord);
              }
            }

            return `${t('specialties.' + enKey)} ${t('common.consultation')} - ${description}`;
          }
          return `${t('specialties.' + enKey)} ${t('common.consultation')}`;
        }
      }
    }

    // Traduction des mots-clés dans le motif
    let translatedMotif = motif;
    const keywordMap = {
      'Consultation': t('common.consultation'),
      'consultation': t('common.consultation'),
      'Suivi': t('motifs.followUp'),
      'suivi': t('motifs.followUp'),
      'traitement': i18n.language === 'en' ? 'treatment' : 'traitement',
      'de routine': i18n.language === 'en' ? 'routine' : 'de routine',
      'pour': i18n.language === 'en' ? 'for' : 'pour',
      'concernant': i18n.language === 'en' ? 'regarding' : 'concernant',
      'avec': i18n.language === 'en' ? 'with' : 'avec'
    };

    // Remplacer les mots-clés si la langue est anglaise
    if (i18n.language === 'en') {
      for (const [frWord, enWord] of Object.entries(keywordMap)) {
        translatedMotif = translatedMotif.replace(new RegExp(frWord, 'gi'), enWord);
      }

      // Traduire les spécialités dans le texte
      for (const [frSpecialty, enKey] of Object.entries(specialtyMap)) {
        const regex = new RegExp(frSpecialty, 'gi');
        translatedMotif = translatedMotif.replace(regex, t('specialties.' + enKey));
      }
    }

    return translatedMotif !== motif ? translatedMotif : motif;
  };

  const appointmentsByStatus = getAppointmentsByStatus();
  const monthlyAppointments = getMonthlyAppointments();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC] dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-white">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4 relative overflow-hidden">
        {/* Blobs animés en arrière-plan - couleurs turquoise */}
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

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Section gauche - Message de bienvenue */}
                  <div className="flex-1">
                    {/* Badge "Dashboard Admin" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        {t('admin.dashboard.title')}
                      </span>
                    </div>

                    {/* Titre principal avec animation */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('common.welcome')} {user?.prenom} 👋
                    </h1>

                    <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                      {t('admin.dashboard.subtitle')}
                    </p>

                    {/* Informations date/heure dans des mini-cartes */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Carte Date */}
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{t('dashboard.date')}</p>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{t('dashboard.time')}</p>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{t('dashboard.day')}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white capitalize">
                            {formatDate(currentTime, dateFormats.weekday)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section droite - Système de santé - masqué sur mobile */}
                  <div className="hidden lg:flex flex-col items-end gap-3">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative px-6 py-4 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                          <ChartBarIcon className="w-6 h-6 text-white" />
                          <div className="text-left">
                            <p className="text-xs text-white/80 font-medium">{t('admin.dashboard.systemStatus')}</p>
                            <p className="text-lg font-bold text-white">100% {t('admin.dashboard.operational')}</p>
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
          {/* Statistiques principales - 4 cartes */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              {/* Card Patients */}
              <div className="group animate-scale-in" style={{ animationDelay: '100ms' }}>
                <div className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <UsersIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {stats.utilisateurs?.patients?.actifs || 0}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                        {t('admin.dashboard.totalPatients')}
                      </p>
                      <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.utilisateurs?.patients?.total || 0}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        {stats.utilisateurs?.patients?.actifs || 0} {t('admin.dashboard.active')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Médecins */}
              <div className="group animate-scale-in" style={{ animationDelay: '200ms' }}>
                <div className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <UserGroupIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <ArrowTrendingUpIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {stats.utilisateurs?.medecins?.actifs || 0}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                        {t('admin.dashboard.totalDoctors')}
                      </p>
                      <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.utilisateurs?.medecins?.total || 0}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                        {stats.utilisateurs?.medecins?.actifs || 0} {t('admin.dashboard.active')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Rendez-vous */}
              <div className="group animate-scale-in" style={{ animationDelay: '300ms' }}>
                <div className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <CalendarIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div className="hidden sm:flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <CheckCircleIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">+12%</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                        {t('admin.dashboard.appointments')}
                      </p>
                      <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {stats.rendezVous?.total || 0}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                        {stats.rendezVous?.tauxAnnulation?.toFixed(1) || 0}% {t('admin.dashboard.cancelled')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Taux de satisfaction */}
              <div className="group animate-scale-in" style={{ animationDelay: '400ms' }}>
                <div className="relative h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                        <ChartBarIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1 sm:mb-2">
                        {t('admin.dashboard.satisfaction')}
                      </p>
                      <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {satisfactionRate}%
                      </p>
                      <p className={`text-xs font-semibold ${
                        satisfactionRate >= 80
                          ? 'text-blue-600 dark:text-blue-400'
                          : satisfactionRate >= 50
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {satisfactionRate >= 80
                          ? t('admin.dashboard.excellent')
                          : satisfactionRate >= 50
                          ? t('admin.dashboard.good')
                          : t('admin.dashboard.needsImprovement')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Graphiques - 2 colonnes */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Graphique en barres - Rendez-vous par mois */}
              <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.dashboard.appointmentsPerMonth')}
                      </h3>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                        <ChartBarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={monthlyAppointments}>
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Bar dataKey="count" fill="#14B8A6" radius={[12, 12, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Graphique donut - Rendez-vous par statut */}
              <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.dashboard.appointmentsByStatus')}
                      </h3>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={appointmentsByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {appointmentsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section inférieure - 2 colonnes */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Top Médecins */}
              <div className="animate-slide-up" style={{ animationDelay: '700ms' }}>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.dashboard.topDoctors')}
                      </h3>
                      <button
                        onClick={() => navigate('/admin/medecins')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                          {t('common.seeAll')}
                        </span>
                        <ArrowRightIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {stats.rendezVous?.parMedecin?.slice(0, 5).map((medecin, index) => (
                        <div
                          key={medecin.medecinId}
                          className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-700/60 rounded-2xl hover:shadow-md transition-all duration-300 hover:scale-105"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                              {index + 1}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {t('admin.dashboard.doctorPrefix')} {medecin.nom}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {translateSpecialty(medecin.specialite)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">
                              {medecin.nombreRendezVous}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {t('admin.dashboard.appointments')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calendrier des prochains rendez-vous */}
              <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
                <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.dashboard.upcomingAppointments')}
                      </h3>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {stats.rendezVous?.prochains && stats.rendezVous.prochains.length > 0 ? (
                        stats.rendezVous.prochains.slice(0, 5).map((rdv, index) => (
                          <div
                            key={rdv.id}
                            className="group p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-700/50 rounded-2xl hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-start gap-3">
                              {/* Date badge */}
                              <div className="flex-shrink-0 w-14 h-14 bg-blue-700 rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                                <span className="text-xs font-semibold uppercase">
                                  {new Date(rdv.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' })}
                                </span>
                                <span className="text-lg font-bold">
                                  {new Date(rdv.date).getDate()}
                                </span>
                              </div>

                              {/* Info rendez-vous */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <ClockIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formatTime(new Date(rdv.date), timeFormats.short)}
                                  </span>
                                  {rdv.statut === 'CONFIRME' && (
                                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">
                                      {t('admin.rendezvous.status.confirmed')}
                                    </span>
                                  )}
                                  {rdv.statut === 'EN_ATTENTE' && (
                                    <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded-full">
                                      {t('admin.rendezvous.status.pending')}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                  <span className="font-semibold">
                                    {rdv.patient?.prenom || t('common.patient')} {rdv.patient?.nom || ''}
                                  </span>
                                  <span>•</span>
                                  <span>
                                    {t('common.dr')}. {rdv.medecin?.prenom || t('common.doctor')} {rdv.medecin?.nom || ''}
                                  </span>
                                </div>
                                {rdv.medecin?.specialite && (
                                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {translateSpecialty(rdv.medecin.specialite)}
                                  </div>
                                )}
                                {rdv.motif && (
                                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                                    "{translateMotif(rdv.motif)}"
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CalendarIcon className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {t('admin.dashboard.noUpcomingAppointments')}
                          </p>
                        </div>
                      )}

                      {/* Bouton Voir tous les rendez-vous */}
                      <button
                        onClick={() => navigate('/admin/rendezvous')}
                        className="w-full mt-4 py-4 bg-blue-700 hover:bg-blue-800 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <CalendarIcon className="w-5 h-5" />
                        {t('admin.dashboard.viewAllAppointments')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
