import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  BeakerIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  AcademicCapIcon,
  PencilSquareIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
  InformationCircleIcon,
  UserIcon,
  MapPinIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';
import AlertModal from '../../components/modals/AlertModal';

const AdminMedecins = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [medecins, setMedecins] = useState([]);
  const [pendingMedecins, setPendingMedecins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMedecins, setTotalMedecins] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedecin, setSelectedMedecin] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    avgAppointments: 0,
  });
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });
  const limit = 9;

  // Fonction pour traduire les spécialités
  const translateSpecialty = (specialty) => {
    if (!specialty || i18n.language === 'fr') return specialty;

    const specialtyMap = {
      'cardiologie': 'cardiology',
      'cardiologique': 'cardiology',
      'cardiaque': 'cardiology',
      'pédiatrie': 'pediatrics',
      'pédiatrique': 'pediatrics',
      'dermatologie': 'dermatology',
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
      'gynécologique': 'gynecology',
      'médecine générale': 'generalMedicine',
      'autre': 'other'
    };

    const key = specialtyMap[specialty.toLowerCase()];
    return key ? t(`specialties.${key}`) : specialty;
  };

  useEffect(() => {
    loadMedecins();
    loadPendingMedecins();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage, filterStatus, filterSpecialty, activeTab]);

  const loadMedecins = async () => {
    setIsLoading(true);
    try {
      const params = { page: currentPage, limit: limit };
      if (filterStatus !== 'ALL') params.isActive = filterStatus === 'ACTIVE';
      if (filterSpecialty) params.specialite = filterSpecialty;
      if (searchTerm) params.search = searchTerm;

      const response = await adminService.getMedecins(params);
      const medecinsList = response.data.data || [];
      setMedecins(medecinsList);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotalMedecins(response.data.meta?.total || 0);

      // Extract unique specialties
      const uniqueSpecialties = [...new Set(medecinsList.map(m => m.specialite).filter(Boolean))];
      setSpecialties(uniqueSpecialties);

      // Calculate stats
      const active = medecinsList.filter(m => m.isActive).length;
      const totalAppointments = medecinsList.reduce((sum, m) => sum + (m._count?.rendezvousMedecin || 0), 0);

      // Update stats including pending count
      setStats(prev => ({
        ...prev,
        total: response.data.meta?.total || 0,
        active: active,
        inactive: medecinsList.length - active,
        avgAppointments: medecinsList.length > 0 ? (totalAppointments / medecinsList.length).toFixed(1) : 0,
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des médecins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingMedecins = async () => {
    try {
      // Fetch all medecins and filter for PENDING status
      const response = await adminService.getMedecins({ limit: 100 });
      const allMedecins = response.data.data || [];
      const pending = allMedecins.filter(m => m.statutValidation === 'PENDING');
      setPendingMedecins(pending);
      setStats(prev => ({ ...prev, pending: pending.length }));
    } catch (error) {
      console.error('Erreur lors du chargement des demandes en attente:', error);
    }
  };

  const handleApproveMedecin = async (medecinId) => {
    try {
      const response = await adminService.approveMedecin(medecinId);
      loadMedecins();
      loadPendingMedecins();

      // Afficher notification de succès
      setAlertModal({
        isOpen: true,
        type: 'success',
        title: t('admin.medecins.approvalSuccess') || 'Médecin approuvé',
        message: response.data?.message || t('admin.medecins.approvalMessageSuccess'),
      });
    } catch (error) {
      console.error('Erreur lors de l\'approbation du médecin:', {
        status: error.response?.status,
        data: error.response?.data
      });

      // Extraire le message d'erreur proprement
      const responseData = error.response?.data;
      let errorMsg = t('admin.medecins.approvalMessageError');

      if (responseData?.message) {
        errorMsg = typeof responseData.message === 'string'
          ? responseData.message
          : t('admin.medecins.approvalMessageError');
      }

      // Afficher notification d'erreur
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: t('admin.medecins.approvalError') || 'Erreur',
        message: errorMsg,
      });
    }
  };

  const handleRejectMedecin = async (medecinId) => {
    try {
      const response = await adminService.rejectMedecin(medecinId);
      loadMedecins();
      loadPendingMedecins();

      // Afficher notification de succès
      setAlertModal({
        isOpen: true,
        type: 'success',
        title: t('admin.medecins.rejectionSuccess') || 'Médecin rejeté',
        message: response.data?.message || t('admin.medecins.rejectionMessageSuccess'),
      });
    } catch (error) {
      console.error('Erreur lors du rejet du médecin:', error);

      // Afficher notification d'erreur
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: t('admin.medecins.rejectionError') || 'Erreur',
        message: error.response?.data?.message || t('admin.medecins.rejectionMessageError'),
      });
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadMedecins();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleToggleStatus = (medecin) => {
    setSelectedMedecin(medecin);
    setShowConfirmModal(true);
  };

  const handleShowDetails = (medecin) => {
    setSelectedMedecin(medecin);
    setShowDetailsModal(true);
  };

  const handleDeleteMedecin = (medecin) => {
    setSelectedMedecin(medecin);
    setShowDeleteModal(true);
  };

  const confirmDeleteMedecin = async () => {
    if (!selectedMedecin) return;
    setIsDeleting(true);
    try {
      await adminService.deleteMedecin(selectedMedecin.id);
      setShowDeleteModal(false);
      setSelectedMedecin(null);
      loadMedecins();
      loadPendingMedecins();

      setAlertModal({
        isOpen: true,
        type: 'success',
        title: 'Médecin supprimé',
        message: 'Le médecin a été supprimé avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du médecin:', error);
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.response?.data?.message || 'Erreur lors de la suppression du médecin.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmToggleStatus = async () => {
    if (!selectedMedecin) return;
    try {
      await adminService.updateMedecin(selectedMedecin.id, {
        isActive: !selectedMedecin.isActive,
      });
      setShowConfirmModal(false);
      const wasActive = selectedMedecin.isActive;
      setSelectedMedecin(null);
      loadMedecins();

      // Afficher notification de succès
      setAlertModal({
        isOpen: true,
        type: 'success',
        title: wasActive
          ? (t('admin.medecins.deactivateSuccess') || 'Médecin désactivé')
          : (t('admin.medecins.activateSuccess') || 'Médecin activé'),
        message: wasActive
          ? (t('admin.medecins.deactivateMessage') || 'Le médecin a été désactivé avec succès.')
          : (t('admin.medecins.activateMessage') || 'Le médecin a été activé avec succès.'),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setShowConfirmModal(false);

      // Afficher notification d'erreur
      setAlertModal({
        isOpen: true,
        type: 'error',
        title: t('admin.medecins.statusUpdateError') || 'Erreur',
        message: error.response?.data?.message || t('admin.medecins.statusUpdateMessageError'),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F7F9FC] via-[#EEF2FF] to-[#F0F9FF] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700 dark:text-white">{t('common.loading')}</p>
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
                <div className="flex items-start justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
                        {t('admin.medecins.management')}
                      </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('admin.medecins.title')}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                      {t('admin.medecins.subtitle', { count: stats.total })}
                    </p>

                    {/* Mini-cartes date/heure */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.date')}</p>
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
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('dashboard.time')}</p>
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
                          <UserGroupIcon className="w-6 h-6 text-white" />
                          <div className="text-left">
                            <p className="text-xs text-white/80 font-medium">{t('admin.medecins.stats.totalDoctors')}</p>
                            <p className="text-2xl font-bold text-white">{stats.total}</p>
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
          {/* Tabs */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'all'
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/90'
                }`}
              >
                <UserGroupIcon className="w-5 h-5" />
                {t('admin.medecins.tabs.all')}
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all relative ${
                  activeTab === 'pending'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-lg'
                    : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/90'
                }`}
              >
                <ClockIcon className="w-5 h-5" />
                {t('admin.medecins.tabs.pending')}
                {stats.pending > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {stats.pending}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search & Filters - Only show on "all" tab */}
          {activeTab === 'all' && (
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search */}
                <div className="lg:col-span-5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('admin.medecins.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Specialty Filter */}
                <div className="lg:col-span-3">
                  <select
                    value={filterSpecialty}
                    onChange={(e) => { setFilterSpecialty(e.target.value); setCurrentPage(1); }}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="">{t('admin.medecins.allSpecialties')}</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filters */}
                <div className="lg:col-span-4 flex gap-2">
                  <button
                    onClick={() => { setFilterStatus('ALL'); setCurrentPage(1); }}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'ALL'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('admin.medecins.all')}
                  </button>
                  <button
                    onClick={() => { setFilterStatus('ACTIVE'); setCurrentPage(1); }}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'ACTIVE'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('admin.medecins.active')}
                  </button>
                  <button
                    onClick={() => { setFilterStatus('INACTIVE'); setCurrentPage(1); }}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'INACTIVE'
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('admin.medecins.inactive')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Medecins Cards Grid - "All" tab */}
          {activeTab === 'all' && (
            medecins.length === 0 ? (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-16 text-center shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto">
                    <UserGroupIcon className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.medecins.noMedecins')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t('admin.medecins.noResults')}</p>
              </div>
            ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {medecins.map((medecin, index) => (
                  <div
                    key={medecin.id}
                    className="group relative animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute -inset-0.5 bg-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        {medecin.isActive ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 backdrop-blur-sm rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{t('admin.medecins.table.activeStatus')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 backdrop-blur-sm rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-bold text-red-700 dark:text-red-300">{t('admin.medecins.table.inactiveStatus')}</span>
                          </div>
                        )}
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-blue-700 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition"></div>
                          <div className="relative w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-2xl font-bold text-white">Dr</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md">
                            <AcademicCapIcon className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            Dr. {medecin.prenom} {medecin.nom}
                          </h3>
                          <div className="flex items-center gap-2">
                            <BeakerIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">
                              {translateSpecialty(medecin.specialite) || t('admin.medecins.table.unspecified')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 group/item hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-950/30 transition-colors">
                            <EnvelopeIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate font-medium">{medecin.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 group/item hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-950/30 transition-colors">
                            <PhoneIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium">{medecin.telephone}</span>
                        </div>
                      </div>

                      {/* Stats Bar */}
                      <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-2 flex-1">
                          <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('admin.medecins.table.appointments')}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {medecin._count?.rendezvousMedecin || 0}
                            </p>
                          </div>
                        </div>
                        <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">{t('admin.medecins.table.registered')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(medecin.createdAt, dateFormats.short)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleToggleStatus(medecin)}
                          className={`flex items-center justify-center gap-1 px-3 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg text-sm ${
                            medecin.isActive
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-blue-700 hover:bg-blue-800 text-white'
                          }`}
                        >
                          {medecin.isActive ? (
                            <>
                              <XCircleIcon className="w-4 h-4" />
                              <span className="hidden sm:inline">{t('admin.medecins.deactivate')}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4" />
                              <span className="hidden sm:inline">{t('admin.medecins.activate')}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleShowDetails(medecin)}
                          className="flex items-center justify-center gap-1 px-3 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2 border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">{t('admin.medecins.details')}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteMedecin(medecin)}
                          className="flex items-center justify-center gap-1 px-3 py-3 rounded-xl font-bold transition-all hover:scale-105 bg-red-500 hover:bg-red-600 text-white shadow-lg text-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">{t('common.delete')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 animate-slide-up">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    {t('admin.medecins.pagination.previous')}
                  </button>

                  <div className="flex gap-2">
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
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${
                              currentPage === page
                                ? 'bg-blue-700 text-white shadow-lg scale-110'
                                : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        (page === currentPage - 2 && currentPage > 3) ||
                        (page === currentPage + 2 && currentPage < totalPages - 2)
                      ) {
                        return <span key={page} className="flex items-center px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                  >
                    {t('admin.medecins.pagination.next')}
                  </button>
                </div>
              )}
            </>
            )
          )}

          {/* Pending Medecins - "Pending" tab */}
          {activeTab === 'pending' && (
            pendingMedecins.length === 0 ? (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-16 text-center shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircleIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.medecins.noPending')}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t('admin.medecins.noPendingDesc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pendingMedecins.map((medecin, index) => (
                  <div
                    key={medecin.id}
                    className="group relative animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-400 to-yellow-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-orange-200 dark:border-orange-800/50 hover:shadow-2xl transition-all duration-300">
                      {/* Pending Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/40 backdrop-blur-sm rounded-full shadow-sm">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{t('admin.medecins.pendingStatus')}</span>
                        </div>
                      </div>

                      {/* Doctor Info */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-br from-orange-400 to-yellow-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition"></div>
                          <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-2xl font-bold text-white">Dr</span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md">
                            <ClockIcon className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                            Dr. {medecin.prenom} {medecin.nom}
                          </h3>
                          <div className="flex items-center gap-2">
                            <BeakerIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 truncate">
                              {translateSpecialty(medecin.specialite) || t('admin.medecins.table.unspecified')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <EnvelopeIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate font-medium">{medecin.email}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <PhoneIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium">{medecin.telephone}</span>
                        </div>
                      </div>

                      {/* Registration Date */}
                      <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl border border-orange-200/50 dark:border-orange-600/50 mb-5">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{t('admin.medecins.registeredOn')}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatDate(medecin.createdAt, dateFormats.long)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleApproveMedecin(medecin.id)}
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all hover:scale-105 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                          {t('admin.medecins.approve')}
                        </button>
                        <button
                          onClick={() => handleRejectMedecin(medecin.id)}
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all hover:scale-105 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                        >
                          <XCircleIcon className="w-4 h-4" />
                          {t('admin.medecins.reject')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedMedecin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            onClick={() => setShowConfirmModal(false)}
          ></div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-1 bg-blue-700 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-200/50 dark:border-gray-700/50">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <div className={`absolute -inset-2 rounded-2xl blur-xl ${
                    selectedMedecin.isActive ? 'bg-red-500' : 'bg-blue-500'
                  } opacity-50`}></div>
                  <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${
                    selectedMedecin.isActive
                      ? 'bg-red-500'
                      : 'bg-blue-700'
                  }`}>
                    {selectedMedecin.isActive ? (
                      <XCircleIcon className="w-10 h-10 text-white" />
                    ) : (
                      <CheckCircleIcon className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedMedecin.isActive ? t('admin.medecins.confirmDeactivateTitle') : t('admin.medecins.confirmActivateTitle')}
                </h3>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Dr. {selectedMedecin.prenom} {selectedMedecin.nom}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {translateSpecialty(selectedMedecin.specialite)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirmToggleStatus}
                  className={`flex-1 px-6 py-3.5 font-bold rounded-xl text-white shadow-xl transition-all hover:scale-105 ${
                    selectedMedecin.isActive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-blue-700 hover:bg-blue-800'
                  }`}
                >
                  {t('common.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedMedecin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-3xl w-full animate-scale-in border border-white/20 dark:border-gray-700/50 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* En-tête avec dégradé et icône */}
            <div className="relative mb-6">
              {/* Fond dégradé décoratif */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

              <div className="relative flex items-center gap-4">
                {/* Avatar du médecin */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-700 rounded-2xl blur-md opacity-75"></div>
                  <div className="relative w-20 h-20 bg-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-xl font-bold text-white">Dr</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                    <AcademicCapIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Titre et statut */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Dr. {selectedMedecin.prenom} {selectedMedecin.nom}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                      <BeakerIcon className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                      <span className="text-xs font-bold text-blue-800 dark:text-blue-300">{translateSpecialty(selectedMedecin.specialite)}</span>
                    </div>
                    {selectedMedecin.isActive ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{t('admin.medecins.detailsModal.active')}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/40 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-bold text-red-700 dark:text-red-300">{t('admin.medecins.detailsModal.inactive')}</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedMedecin.id.slice(0, 8)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Informations de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <EnvelopeIcon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.medecins.detailsModal.email')}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white break-all">
                    {selectedMedecin.email}
                  </p>
                </div>

                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <PhoneIcon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.medecins.detailsModal.phone')}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedMedecin.telephone}
                  </p>
                </div>
              </div>

              {/* Adresse et Date de naissance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedMedecin.adresse && (
                  <div className="p-5 bg-white dark:bg-gray-700/50 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPinIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.medecins.detailsModal.medicalOffice')}
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {selectedMedecin.adresse}
                    </p>
                  </div>
                )}

                {selectedMedecin.dateNaissance && (
                  <div className="p-5 bg-white dark:bg-gray-700/50 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-3">
                      <UserIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        {t('admin.medecins.detailsModal.dateOfBirth')}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(selectedMedecin.dateNaissance, dateFormats.long)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date().getFullYear() - new Date(selectedMedecin.dateNaissance).getFullYear()} {t('admin.medecins.detailsModal.yearsOld')}
                    </p>
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-700 rounded-2xl text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-6 h-6" />
                    <p className="text-xs font-bold uppercase tracking-wider opacity-90">
                      {t('admin.medecins.detailsModal.appointments')}
                    </p>
                  </div>
                  <p className="text-4xl font-bold">
                    {selectedMedecin._count?.rendezvousMedecin || 0}
                  </p>
                  <p className="text-sm opacity-75 mt-1">{t('admin.medecins.detailsModal.totalConsultations')}</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {t('admin.medecins.detailsModal.registeredSince')}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatDate(selectedMedecin.createdAt, dateFormats.short)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t('admin.medecins.detailsModal.memberSince', { days: Math.floor((new Date() - new Date(selectedMedecin.createdAt)) / (1000 * 60 * 60 * 24)) })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2 border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <XCircleIcon className="w-5 h-5" />
                <span>{t('common.close')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMedecin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            onClick={() => !isDeleting && setShowDeleteModal(false)}
          ></div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-1 bg-red-500 rounded-3xl blur-xl opacity-75"></div>
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-gray-200/50 dark:border-gray-700/50">
              <div className="text-center mb-8">
                <div className="relative inline-block mb-6">
                  <div className="absolute -inset-2 bg-red-500 rounded-2xl blur-xl opacity-50"></div>
                  <div className="relative w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <ExclamationTriangleIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Supprimer le médecin ?
                </h3>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Dr. {selectedMedecin.prenom} {selectedMedecin.nom}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {selectedMedecin.specialite} - {selectedMedecin.email}
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    ⚠️ Cette action est irréversible. Toutes les données du médecin (rendez-vous, créneaux horaires, notes médicales) seront définitivement supprimées.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105 disabled:opacity-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={confirmDeleteMedecin}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3.5 font-bold rounded-xl text-white shadow-xl transition-all hover:scale-105 bg-red-500 hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Suppression...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-5 h-5" />
                      {t('common.delete')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal for Success/Error Messages */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
      />
    </AdminLayout>
  );
};

export default AdminMedecins;
