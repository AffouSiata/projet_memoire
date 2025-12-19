import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PatientLayout from '../../components/layout/PatientLayout';
import patientService from '../../services/patientService';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  HeartIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  DocumentTextIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats, timeFormats } from '../../hooks/useDateFormatter';
import ConfirmModal from '../../components/modals/ConfirmModal';
import AlertModal from '../../components/modals/AlertModal';

const AppointmentHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formatDate, formatTime } = useDateFormatter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [specialties, setSpecialties] = useState(['all']);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await patientService.getAppointments();
      const appointmentsData = response.data.data || [];

      const transformedAppointments = appointmentsData.map(apt => {
        const appointmentDate = new Date(apt.date);
        const now = new Date();

        let status;
        if (apt.statut === 'ANNULE') {
          status = 'cancelled';
        } else if (appointmentDate < now && apt.statut === 'CONFIRME') {
          status = 'completed';
        } else if (appointmentDate >= now) {
          // Distinguer les rendez-vous confirmés des rendez-vous en attente
          status = apt.statut === 'CONFIRME' ? 'confirmed' : 'upcoming';
        } else {
          status = 'completed';
        }

        return {
          id: apt.id,
          date: apt.date,
          dateObj: appointmentDate,
          doctor: `Dr. ${apt.medecin?.prenom || ''} ${apt.medecin?.nom || ''}`,
          specialty: typeof apt.medecin?.specialite === 'string' ? apt.medecin.specialite : '',
          status: status,
          motif: typeof apt.motif === 'string' ? apt.motif : '',
          apiStatus: apt.statut,
          prescription: false,
          medecin: apt.medecin, // Garder l'objet médecin original pour les modales
        };
      });

      transformedAppointments.sort((a, b) => b.dateObj - a.dateObj);
      setAppointments(transformedAppointments);

      const uniqueSpecialties = [...new Set(transformedAppointments.map(apt => apt.specialty).filter(Boolean))];
      setSpecialties(['all', ...uniqueSpecialties]);

      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
      setIsLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = selectedFilter === 'all' || apt.status === selectedFilter;
    const matchesSearch =
      apt.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || apt.specialty === filterSpecialty;

    return matchesStatus && matchesSearch && matchesSpecialty;
  });

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchQuery, filterSpecialty]);

  const stats = {
    total: appointments.length,
    completed: appointments.filter(a => a.status === 'completed').length,
    upcoming: appointments.filter(a => a.status === 'upcoming' || a.status === 'confirmed').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Fonction pour traduire les motifs de consultation
  const translateMotif = (motif) => {
    if (!motif) return '';

    // S'assurer que motif est une chaîne
    if (typeof motif !== 'string') return '';

    // Map des spécialités en français vers leurs clés de traduction
    const specialtyMap = {
      'Cardiologie': 'cardiology',
      'Pédiatrie': 'pediatrics',
      'Dermatologie': 'dermatology',
      'Ophtalmologie': 'ophthalmology',
      'Orthopédie': 'orthopedics',
      'Psychiatrie': 'psychiatry',
      'Neurologie': 'neurology'
    };

    // Motifs spécifiques complets
    const specificMotifs = {
      'Vaccination enfant': t('motifs.childVaccination'),
      'Consultation de routine': t('motifs.routineConsultation'),
      'Suivi': t('motifs.followUp')
    };

    // Vérifier les motifs spécifiques complets
    if (specificMotifs[motif]) {
      const translated = specificMotifs[motif];
      return typeof translated === 'string' ? translated : motif;
    }

    // Vérifier les motifs avec spécialité
    if (motif.includes('Consultation') && motif.includes('cardiologie')) {
      const isRoutine = motif.includes('routine');
      const routine = t('motifs.routineConsultation');
      const consultation = t('common.consultation');
      const cardiology = t('specialties.cardiology');

      return isRoutine
        ? `${typeof routine === 'string' ? routine : 'Consultation'} ${typeof cardiology === 'string' ? cardiology : 'Cardiologie'}`
        : `${typeof consultation === 'string' ? consultation : 'Consultation'} ${typeof cardiology === 'string' ? cardiology : 'Cardiologie'}`;
    }

    if (motif.includes('Consultation') && motif.includes('pédiatrique')) {
      const consultation = t('common.consultation');
      const pediatrics = t('specialties.pediatrics');
      return `${typeof consultation === 'string' ? consultation : 'Consultation'} ${typeof pediatrics === 'string' ? pediatrics : 'Pédiatrie'}`;
    }

    if (motif.includes('Suivi') && motif.includes('cardiologique')) {
      const followUp = t('motifs.followUp');
      const cardiology = t('specialties.cardiology');
      return `${typeof followUp === 'string' ? followUp : 'Suivi'} ${typeof cardiology === 'string' ? cardiology : 'Cardiologie'}`;
    }

    if (motif.includes('dermatologie') || motif.includes('Dermatologie')) {
      const parts = motif.split(' - ');
      const consultation = t('common.consultation');
      const dermatology = t('specialties.dermatology');
      const consultationStr = typeof consultation === 'string' ? consultation : 'Consultation';
      const dermatologyStr = typeof dermatology === 'string' ? dermatology : 'Dermatologie';

      if (parts.length > 1) {
        return `${consultationStr} ${dermatologyStr} - ${parts[1]}`;
      }
      return `${consultationStr} ${dermatologyStr}`;
    }

    // Vérifier si le motif commence par "Consultation"
    if (motif.startsWith('Consultation ')) {
      const specialty = motif.replace('Consultation ', '');
      const specialtyKey = specialtyMap[specialty];

      if (specialtyKey) {
        const consultation = t('common.consultation');
        const specialtyTranslation = t(`specialties.${specialtyKey}`);
        const consultationStr = typeof consultation === 'string' ? consultation : 'Consultation';
        const specialtyStr = typeof specialtyTranslation === 'string' ? specialtyTranslation : specialty;
        return `${consultationStr} ${specialtyStr}`;
      }
    }

    return motif;
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'completed':
        return {
          label: t('history.status.completed') || 'Complété',
          icon: CheckCircleIcon,
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          bgLight: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
        };
      case 'confirmed':
        return {
          label: t('history.status.confirmed') || 'Confirmé',
          icon: CheckCircleIcon,
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          bgLight: 'bg-blue-50 dark:bg-blue-950/20',
          borderColor: 'border-blue-200 dark:border-blue-900',
        };
      case 'upcoming':
        return {
          label: t('history.status.upcoming') || 'En attente',
          icon: ClockIcon,
          color: 'bg-orange-500',
          textColor: 'text-orange-500',
          bgLight: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800',
        };
      case 'cancelled':
        return {
          label: t('history.status.cancelled') || 'Annulé',
          icon: XCircleIcon,
          color: 'bg-red-500',
          textColor: 'text-red-500',
          bgLight: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
        };
      default:
        return {
          label: 'Inconnu',
          icon: ExclamationCircleIcon,
          color: 'bg-gray-500',
          textColor: 'text-gray-500',
          bgLight: 'bg-gray-50 dark:bg-gray-900/20',
          borderColor: 'border-gray-200 dark:border-gray-800',
        };
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleDownloadPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDownloadModal(true);
  };

  // NOTE: La confirmation des rendez-vous est désormais réservée aux médecins uniquement.
  // Le patient ne peut qu'annuler ses rendez-vous.

  const handleCancelClick = (appointment) => {
    setAppointmentToCancel(appointment);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!appointmentToCancel) return;

    try {
      // Appel API pour annuler le rendez-vous
      await patientService.cancelAppointment(appointmentToCancel.id);

      setShowCancelModal(false);
      setAppointmentToCancel(null);
      setShowSuccessModal(true);

      // Recharger les rendez-vous pour mettre à jour l'affichage
      await loadAppointments();
    } catch (error) {
      console.error('Erreur annulation RDV:', error);
      setShowCancelModal(false);
      setAppointmentToCancel(null);
    }
  };

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC] dark:bg-gray-900">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 dark:text-white font-semibold">{t('common.loading')}</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 p-4 md:p-8 relative overflow-hidden">
        {/* Blobs animés - couleurs LARANA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Ultra-Moderne - Style Dashboard */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  {/* Section gauche */}
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        {t('history.title') || 'Historique des Rendez-vous'}
                      </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      📋 {t('history.yourAppointments') || 'Vos Consultations'}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-white mb-6 font-medium">
                      {t('history.subtitle') || 'Consultez l\'historique complet de vos rendez-vous médicaux'}
                    </p>
                  </div>

                  {/* Bouton Nouveau RDV */}
                  <div>
                    <button
                      onClick={() => navigate('/patient/appointment')}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative flex items-center gap-3 px-6 py-4 bg-blue-500 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <CalendarIcon className="w-6 h-6 text-white" />
                        <span className="text-white font-semibold">{t('booking.newAppointment') || 'Nouveau RDV'}</span>
                        <ArrowRightIcon className="w-5 h-5 text-white" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Statistiques Visuelles Améliorées */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Total */}
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <ChartBarIcon className="w-6 h-6 text-white" />
                      </div>
                      <TrophyIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('history.stats.total') || 'Total RDV'}</p>
                  </div>

                  {/* Complétés */}
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <CheckCircleIcon className="w-6 h-6 text-white" />
                      </div>
                      <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.completed}</p>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">{completionRate}%</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('history.stats.completed') || 'Complétés'}</p>
                  </div>

                  {/* À venir */}
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <ClockIcon className="w-6 h-6 text-white" />
                      </div>
                      <BoltIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-1">{stats.upcoming}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('history.stats.upcoming') || 'À venir'}</p>
                  </div>

                  {/* Annulés */}
                  <div className="bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-xl transition-all hover:scale-105 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <XCircleIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">{stats.cancelled}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('history.stats.cancelled') || 'Annulés'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="mb-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
                  <input
                    type="text"
                    placeholder={t('history.search.placeholder') || 'Rechercher par médecin ou spécialité...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-6 py-3 rounded-2xl flex items-center gap-2 transition-all hover:scale-105 ${
                    showAdvancedFilters
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FunnelIcon className="w-5 h-5" />
                  <span className="font-semibold">{t('history.search.filters') || 'Filtres'}</span>
                </button>
              </div>

              {showAdvancedFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-scale-in">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-3">
                    {t('history.search.specialtyLabel') || 'Filtrer par spécialité'}
                  </label>
                  <select
                    value={filterSpecialty}
                    onChange={(e) => setFilterSpecialty(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all text-gray-900 dark:text-white"
                  >
                    <option value="all">{t('history.search.allSpecialties') || 'Toutes les spécialités'}</option>
                    {specialties.filter(s => s !== 'all').map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Filtres par statut */}
          <div className="mb-6 flex flex-wrap gap-3 animate-scale-in" style={{ animationDelay: '0.2s' }}>
            {[
              { value: 'all', label: t('history.filters.all') || 'Tous', count: stats.total, icon: ChartBarIcon },
              { value: 'upcoming', label: t('history.filters.upcoming') || 'À venir', count: stats.upcoming, icon: ClockIcon },
              { value: 'completed', label: t('history.filters.completed') || 'Complétés', count: stats.completed, icon: CheckCircleIcon },
              { value: 'cancelled', label: t('history.filters.cancelled') || 'Annulés', count: stats.cancelled, icon: XCircleIcon },
            ].map((filter) => {
              const FilterIcon = filter.icon;
              return (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3 ${
                    selectedFilter === filter.value
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-white shadow-md hover:shadow-lg border border-white/20 dark:border-gray-700/50'
                  }`}
                >
                  <FilterIcon className={`w-5 h-5 ${selectedFilter === filter.value ? '' : 'text-gray-400 group-hover:text-blue-500 transition-colors'}`} />
                  {filter.label}
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedFilter === filter.value ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compteur */}
          <div className="mb-4 flex items-center gap-2 text-gray-600 dark:text-white animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <FireIcon className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">
              {filteredAppointments.length} {filteredAppointments.length > 1 ? t('history.results.plural') : t('history.results.singular')}
            </span>
          </div>

          {/* Liste des rendez-vous - Timeline Design */}
          {filteredAppointments.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedAppointments.map((appointment, index) => {
                  const statusInfo = getStatusInfo(appointment.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div
                      key={appointment.id}
                      className="relative group animate-slide-up"
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      {/* Timeline connector (sauf pour le dernier) */}
                      {index < paginatedAppointments.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-16 bg-blue-700 z-0"></div>
                      )}

                      <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-white/20 dark:border-gray-700/50">
                        <div className="flex items-start gap-6">
                          {/* Timeline point + Icon */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-16 h-16 ${statusInfo.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform relative z-10`}>
                              <StatusIcon className="w-8 h-8 text-white" />
                            </div>
                            {/* Glow effect */}
                            <div className={`absolute inset-0 ${statusInfo.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {appointment.doctor}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusInfo.color} text-white shadow-md`}>
                                    {statusInfo.label}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-3">
                                  <HeartIcon className="w-5 h-5" />
                                  <span className="font-semibold">{appointment.specialty}</span>
                                </div>

                                {/* Date Time Info */}
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                                    <span className="font-medium text-sm">{formatDate(appointment.dateObj, dateFormats.long)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <ClockIcon className="w-5 h-5 text-blue-500" />
                                    <span className="font-medium text-sm">{formatTime(appointment.dateObj, timeFormats.short)}</span>
                                  </div>
                                </div>

                                {/* Motif */}
                                {appointment.motif && (
                                  <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                                    <p className="text-sm text-gray-700 dark:text-gray-200">
                                      <span className="font-bold text-blue-700 dark:text-blue-400">{t('history.reason')}:</span> {appointment.motif}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-2 ml-4">
                                {appointment.prescription && (
                                  <button
                                    onClick={() => handleDownloadPrescription(appointment)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all hover:scale-105 shadow-lg text-sm font-medium"
                                  >
                                    <DocumentTextIcon className="w-5 h-5" />
                                    <span>Ordonnance</span>
                                  </button>
                                )}

                                {appointment.status === 'upcoming' && (
                                  <div className="flex flex-col gap-2">
                                    <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-300">
                                      ⏳ {t('history.waitingConfirmation')}
                                    </div>
                                    <button
                                      onClick={() => handleCancelClick(appointment)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-105 text-sm font-bold shadow-lg"
                                    >
                                      ✕ {t('history.actions.cancel')}
                                    </button>
                                  </div>
                                )}

                                {appointment.status === 'confirmed' && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleCancelClick(appointment)}
                                      className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-105 text-sm font-bold shadow-lg"
                                    >
                                      ✕ {t('history.actions.cancel')}
                                    </button>
                                  </div>
                                )}

                                {appointment.status === 'completed' && (
                                  <button
                                    onClick={() => handleViewDetails(appointment)}
                                    className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition-all hover:scale-105 font-bold shadow-lg"
                                  >
                                    {t('history.actions.details')} →
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in" style={{ animationDelay: '0.5s' }}>
                  <div className="text-sm text-gray-600 dark:text-white">
                    {t('history.pagination.showing')} <span className="font-bold">{startIndex + 1}</span> - <span className="font-bold">{Math.min(endIndex, filteredAppointments.length)}</span> {t('history.pagination.of')} <span className="font-bold">{filteredAppointments.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === 1
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg border border-white/20 dark:border-gray-700/50'
                      }`}
                    >
                      ← {t('history.pagination.previous')}
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                currentPage === page
                                  ? 'bg-blue-500 text-white shadow-lg scale-110'
                                  : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md border border-white/20 dark:border-gray-700/50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="text-gray-400 dark:text-gray-500 px-2">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        currentPage === totalPages
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                          : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-blue-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg border border-white/20 dark:border-gray-700/50'
                      }`}
                    >
                      {t('history.pagination.next')} →
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* État vide */
            <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 shadow-xl text-center animate-scale-in border border-white/20 dark:border-gray-700/50">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-blue-700 rounded-full flex items-center justify-center shadow-xl">
                  <CalendarIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('history.empty.title') || 'Aucun rendez-vous'}
              </h3>
              <p className="text-gray-600 dark:text-white mb-6 max-w-md mx-auto">
                {searchQuery || filterSpecialty !== 'all'
                  ? t('history.empty.noResults') || 'Aucun rendez-vous ne correspond à vos critères'
                  : selectedFilter === 'all'
                  ? t('history.empty.noAppointments') || 'Vous n\'avez pas encore de rendez-vous'
                  : t('history.empty.noFilterResults') || 'Aucun rendez-vous pour ce filtre'}
              </p>
              {(searchQuery || filterSpecialty !== 'all' || selectedFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterSpecialty('all');
                    setSelectedFilter('all');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:scale-105 hover:shadow-xl transition-all font-bold"
                >
                  {t('history.resetFilters')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de détails */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop avec effet blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedAppointment(null);
            }}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 max-w-lg w-full animate-scale-in">
            {/* Effet décoratif d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Header du modal */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('history.modal.title')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('history.modal.subtitle')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAppointment(null);
                }}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-lg"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="relative z-10 space-y-4">
              {/* Badge de statut */}
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg ${getStatusInfo(selectedAppointment.status).color} text-white`}>
                  {getStatusInfo(selectedAppointment.status).label}
                </span>
              </div>

              {/* Carte Médecin */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-900 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                    {t('history.modal.doctor')}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {selectedAppointment.doctor}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
                  {selectedAppointment.specialty}
                </p>
              </div>

              {/* Carte Date & Heure */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-900 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                    {t('history.modal.dateTime')}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    📅 {formatDate(selectedAppointment.dateObj, dateFormats.long)}
                  </p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    🕒 {formatTime(selectedAppointment.dateObj, timeFormats.short)}
                  </p>
                </div>
              </div>

              {/* Carte Motif */}
              {selectedAppointment.motif && (
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-900 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <DocumentTextIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider">
                      {t('history.consultationReason')}
                    </p>
                  </div>
                  <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200 dark:border-blue-900">
                    <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                      {translateMotif(selectedAppointment.motif)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton Fermer */}
            <div className="relative z-10 mt-6">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedAppointment(null);
                }}
                className="w-full px-6 py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {t('history.modal.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTE: Modal de confirmation supprimée - seuls les médecins peuvent confirmer les RDV */}

      {/* Modal Confirmation Annulation */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
        title={t('history.alerts.cancelConfirmTitle')}
        message={appointmentToCancel ? t('history.alerts.cancelConfirmMessage', {
          doctor: `${appointmentToCancel.medecin?.prenom} ${appointmentToCancel.medecin?.nom}`,
          date: formatDate(appointmentToCancel.dateObj, dateFormats.medium)
        }) : ''}
        confirmText={t('history.alerts.cancelButton')}
        cancelText={t('history.alerts.keepButton')}
        type="warning"
        icon={ExclamationCircleIcon}
      />

      {/* Modal Succès Annulation */}
      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('history.alerts.cancelSuccessTitle')}
        message={t('history.alerts.cancelSuccessMessage')}
        buttonText={t('common.understood')}
        type="success"
      />

      {/* Modal Téléchargement Ordonnance */}
      <AlertModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        title={t('history.alerts.downloadTitle')}
        message={selectedAppointment ? t('history.alerts.downloadingPrescription', {
          date: formatDate(selectedAppointment.dateObj, dateFormats.medium)
        }) : ''}
        buttonText={t('common.ok')}
        type="info"
        icon={DocumentTextIcon}
      />
    </PatientLayout>
  );
};

export default AppointmentHistory;
