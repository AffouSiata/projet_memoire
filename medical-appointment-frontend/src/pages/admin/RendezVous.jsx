import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  UserGroupIcon,
  SparklesIcon,
  EyeIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';

const AdminRendezVous = () => {
  const { t } = useTranslation();
  const { formatDate, formatTime } = useDateFormatter();
  const [rendezvous, setRendezVous] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRendezVous, setTotalRendezVous] = useState(0);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRendezVous, setSelectedRendezVous] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const limit = 10;

  useEffect(() => {
    loadRendezVous();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage, filterStatus]);

  const loadRendezVous = async () => {
    setIsLoading(true);
    try {
      const params = { page: currentPage, limit: limit };
      if (filterStatus) params.statut = filterStatus;

      const response = await adminService.getAppointments(params);
      setRendezVous(response.data.data || []);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotalRendezVous(response.data.meta?.total || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowDetails = (rdv) => {
    setSelectedRendezVous(rdv);
    setShowDetailsModal(true);
  };

  const handleChangeStatus = (rdv) => {
    setSelectedRendezVous(rdv);
    setNewStatus(rdv.statut);
    setShowStatusModal(true);
  };

  const confirmChangeStatus = async () => {
    if (!selectedRendezVous || !newStatus) return;
    try {
      await adminService.updateAppointment(selectedRendezVous.id, {
        statut: newStatus,
      });
      setShowStatusModal(false);
      setSelectedRendezVous(null);
      setNewStatus('');
      loadRendezVous();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Fonction pour traduire les spécialités médicales
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

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'CONFIRME':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <CheckCircleIcon className="w-4 h-4" />
            {t('admin.rendezvous.status.confirmed')}
          </span>
        );
      case 'EN_ATTENTE':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <ClockIcon className="w-4 h-4" />
            {t('admin.rendezvous.status.pending')}
          </span>
        );
      case 'ANNULE':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircleIcon className="w-4 h-4" />
            {t('admin.rendezvous.status.cancelled')}
          </span>
        );
      default:
        return null;
    }
  };

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
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        {t('admin.rendezvous.title')}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('admin.rendezvous.title')}
                    </h1>

                    <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                      {t('admin.rendezvous.subtitle', { count: totalRendezVous })}
                    </p>

                    {/* Mini-cartes date/heure */}
                    <div className="flex flex-wrap items-center gap-3">
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

                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-white/60 dark:bg-gray-700/60 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-950/50 rounded-lg sm:rounded-xl flex items-center justify-center">
                          <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{t('dashboard.time')}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-mono">
                            {currentTime.toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section droite - Stats */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative px-4 sm:px-6 py-3 sm:py-4 bg-blue-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center gap-3">
                          <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          <div className="text-left">
                            <p className="text-xs text-white/80 font-medium">{t('admin.rendezvous.totalAppointments')}</p>
                            <p className="text-xl sm:text-2xl font-bold text-white">{totalRendezVous}</p>
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
          {/* Filters */}
          <div className="mb-6 sm:mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={() => { setFilterStatus(''); setCurrentPage(1); }}
                  className={`flex-1 min-w-[70px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    filterStatus === ''
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {t('admin.rendezvous.filters.all')}
                </button>
                <button
                  onClick={() => { setFilterStatus('CONFIRME'); setCurrentPage(1); }}
                  className={`flex-1 min-w-[70px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    filterStatus === 'CONFIRME'
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">{t('admin.rendezvous.filters.confirmed')}</span>
                  <span className="sm:hidden">Conf.</span>
                </button>
                <button
                  onClick={() => { setFilterStatus('EN_ATTENTE'); setCurrentPage(1); }}
                  className={`flex-1 min-w-[70px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    filterStatus === 'EN_ATTENTE'
                      ? 'bg-yellow-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">{t('admin.rendezvous.filters.pending')}</span>
                  <span className="sm:hidden">Att.</span>
                </button>
                <button
                  onClick={() => { setFilterStatus('ANNULE'); setCurrentPage(1); }}
                  className={`flex-1 min-w-[70px] px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-xl font-semibold transition-all text-sm sm:text-base ${
                    filterStatus === 'ANNULE'
                      ? 'bg-red-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">{t('admin.rendezvous.filters.cancelled')}</span>
                  <span className="sm:hidden">Ann.</span>
                </button>
              </div>
            </div>
          </div>

          {/* RendezVous Cards */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            {rendezvous.length === 0 ? (
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 p-12">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto">
                      <CalendarIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.rendezvous.noRendezVous')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t('admin.rendezvous.noResults')}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {rendezvous.map((rdv, index) => (
                    <div
                      key={rdv.id}
                      className="group relative animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="absolute -inset-0.5 bg-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                      <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                        {/* Status Badge en haut */}
                        <div className="absolute top-4 right-4 z-10">
                          {getStatusBadge(rdv.statut)}
                        </div>

                        {/* Date et Heure - Header de la carte */}
                        <div className="mb-5 pt-2">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-blue-700 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition"></div>
                              <div className="relative w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <CalendarIcon className="w-8 h-8 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {formatDate(rdv.date)}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {formatTime(rdv.date)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Patient Info */}
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">
                            {t('admin.rendezvous.table.patient')}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                              {rdv.patient?.prenom?.charAt(0)}{rdv.patient?.nom?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white truncate">
                                {rdv.patient?.prenom} {rdv.patient?.nom}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {rdv.patient?.telephone}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Médecin Info */}
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                          <p className="text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">
                            {t('admin.rendezvous.table.doctor')}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md">
                              {t('common.dr')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white truncate">
                                {t('common.dr')}. {rdv.medecin?.prenom} {rdv.medecin?.nom}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {translateSpecialty(rdv.medecin?.specialite)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Motif */}
                        {rdv.motif && (
                          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                              {t('admin.rendezvous.table.reason')}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                              {translateMotif(rdv.motif)}
                            </p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleShowDetails(rdv)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-105 whitespace-nowrap border-2 border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                          >
                            <EyeIcon className="w-3.5 h-3.5" />
                            <span>{t('admin.rendezvous.details')}</span>
                          </button>

                          <button
                            onClick={() => handleChangeStatus(rdv)}
                            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all hover:scale-105 shadow-md whitespace-nowrap"
                          >
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>{t('admin.rendezvous.changeStatus')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
                    {t('admin.rendezvous.showing', {
                      start: (currentPage - 1) * limit + 1,
                      end: Math.min(currentPage * limit, totalRendezVous),
                      total: totalRendezVous,
                    })}
                  </p>

                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                              currentPage === page
                                ? 'bg-blue-700 text-white shadow-lg scale-110'
                                : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return <span key={page} className="px-1 sm:px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                )}
              </>
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRendezVous && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 max-w-lg w-full animate-scale-in border border-white/20 dark:border-gray-700/50 overflow-hidden">
            {/* En-tête avec icône */}
            <div className="relative mb-5">
              {/* Fond décoratif */}
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

              <div className="relative flex items-center gap-3">
                {/* Icône */}
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center shadow-lg">
                  <InformationCircleIcon className="w-6 h-6 text-white" />
                </div>

                {/* Titre */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('admin.rendezvous.detailsTitle')}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t('admin.rendezvous.detailsSubtitle')}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Date et Statut */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CalendarIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                      {t('admin.rendezvous.table.date')}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900 dark:text-white text-base">
                    {formatDate(selectedRendezVous.date)}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    {formatTime(selectedRendezVous.date)}
                  </p>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-900">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircleIcon className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                      {t('admin.rendezvous.table.status')}
                    </p>
                  </div>
                  <div className="mt-1.5">
                    {getStatusBadge(selectedRendezVous.statut)}
                  </div>
                </div>
              </div>

              {/* Patient */}
              <div className="p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-blue-200 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.rendezvous.table.patient')}
                  </p>
                </div>
                <p className="font-bold text-base text-gray-900 dark:text-white mb-0.5">
                  {selectedRendezVous.patient?.prenom} {selectedRendezVous.patient?.nom}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {selectedRendezVous.patient?.telephone}
                </p>
              </div>

              {/* Médecin */}
              <div className="p-4 bg-white dark:bg-gray-700/50 rounded-xl border border-blue-200 dark:border-blue-900 hover:border-blue-300 dark:hover:border-blue-800 transition-colors">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center shadow-md">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    {t('admin.rendezvous.table.doctor')}
                  </p>
                </div>
                <p className="font-bold text-base text-gray-900 dark:text-white mb-0.5">
                  {t('common.dr')}. {selectedRendezVous.medecin?.prenom} {selectedRendezVous.medecin?.nom}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {translateSpecialty(selectedRendezVous.medecin?.specialite)}
                </p>
              </div>

              {/* Motif */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  {t('admin.rendezvous.table.reason')}
                </p>
                <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                  {translateMotif(selectedRendezVous.motif) || '-'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 border-2 border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <XCircleIcon className="w-4 h-4" />
                <span>{t('common.close')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {showStatusModal && selectedRendezVous && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowStatusModal(false)}
          ></div>

          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in border border-white/20 dark:border-gray-700/50">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('admin.rendezvous.changeStatusTitle')}
            </h3>

            <div className="space-y-4 mb-6">
              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${newStatus === 'CONFIRME' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <input
                  type="radio"
                  name="status"
                  value="CONFIRME"
                  checked={newStatus === 'CONFIRME'}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t('admin.rendezvous.status.confirmed')}
                  </span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${newStatus === 'EN_ATTENTE' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <input
                  type="radio"
                  name="status"
                  value="EN_ATTENTE"
                  checked={newStatus === 'EN_ATTENTE'}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-5 h-5 text-yellow-600"
                />
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t('admin.rendezvous.status.pending')}
                  </span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 ${newStatus === 'ANNULE' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <input
                  type="radio"
                  name="status"
                  value="ANNULE"
                  checked={newStatus === 'ANNULE'}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-5 h-5 text-red-600"
                />
                <div className="flex items-center gap-2">
                  <XCircleIcon className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t('admin.rendezvous.status.cancelled')}
                  </span>
                </div>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-6 py-3 bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-600"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={confirmChangeStatus}
                className="flex-1 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {t('common.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRendezVous;
