import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  HeartIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
  UserIcon,
  CakeIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';

const AdminPatients = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgAppointments: 0,
  });
  const limit = 9;

  useEffect(() => {
    loadPatients();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage, filterStatus]);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const params = { page: currentPage, limit: limit };
      if (filterStatus !== 'ALL') params.isActive = filterStatus === 'ACTIVE';
      if (searchTerm) params.search = searchTerm;

      const response = await adminService.getPatients(params);
      const patientsList = response.data.data || [];
      setPatients(patientsList);
      setTotalPages(response.data.meta?.totalPages || 1);
      setTotalPatients(response.data.meta?.total || 0);

      // Calculate stats
      const active = patientsList.filter(p => p.isActive).length;
      const totalAppointments = patientsList.reduce((sum, p) => sum + (p._count?.rendezvousPatient || 0), 0);
      setStats({
        total: response.data.meta?.total || 0,
        active: active,
        inactive: patientsList.length - active,
        avgAppointments: patientsList.length > 0 ? (totalAppointments / patientsList.length).toFixed(1) : 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadPatients();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleToggleStatus = (patient) => {
    setSelectedPatient(patient);
    setShowConfirmModal(true);
  };

  const handleShowDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleDeletePatient = (patient) => {
    setSelectedPatient(patient);
    setShowDeleteModal(true);
  };

  const confirmDeletePatient = async () => {
    if (!selectedPatient) return;
    setIsDeleting(true);
    try {
      await adminService.deletePatient(selectedPatient.id);
      setShowDeleteModal(false);
      setSelectedPatient(null);
      loadPatients();
    } catch (error) {
      console.error('Erreur lors de la suppression du patient:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmToggleStatus = async () => {
    if (!selectedPatient) return;
    try {
      await adminService.updatePatient(selectedPatient.id, {
        isActive: !selectedPatient.isActive,
      });
      setShowConfirmModal(false);
      setSelectedPatient(null);
      loadPatients();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
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
                        {t('admin.patients.management')}
                      </span>
                    </div>

                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('admin.patients.title')}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 font-medium">
                      {t('admin.patients.subtitle', { count: stats.total })}
                    </p>

                    {/* Mini-cartes date/heure */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
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
                          <UsersIcon className="w-6 h-6 text-white" />
                          <div className="text-left">
                            <p className="text-xs text-white/80 font-medium">{t('admin.patients.stats.totalPatients')}</p>
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
          {/* Search & Filters */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Search */}
                <div className="lg:col-span-8">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t('admin.patients.searchPlaceholder2')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
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
                    {t('admin.patients.all')}
                  </button>
                  <button
                    onClick={() => { setFilterStatus('ACTIVE'); setCurrentPage(1); }}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'ACTIVE'
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('admin.patients.active')}
                  </button>
                  <button
                    onClick={() => { setFilterStatus('INACTIVE'); setCurrentPage(1); }}
                    className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                      filterStatus === 'INACTIVE'
                        ? 'bg-red-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {t('admin.patients.inactive')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Patients Cards Grid */}
          {patients.length === 0 ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-16 text-center shadow-xl border border-gray-200/50 dark:border-gray-700/50 animate-slide-up">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto">
                  <UsersIcon className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.patients.noPatients')}</h3>
              <p className="text-gray-600 dark:text-gray-400">{t('admin.patients.noResults')}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {patients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="group relative animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute -inset-0.5 bg-blue-700 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        {patient.isActive ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/40 backdrop-blur-sm rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{t('admin.patients.table.activeStatus')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 backdrop-blur-sm rounded-full shadow-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-bold text-red-700 dark:text-red-300">{t('admin.patients.table.inactiveStatus')}</span>
                          </div>
                        )}
                      </div>

                      {/* Patient Info */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-blue-700 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition"></div>
                          <div className="relative w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="text-xl font-bold text-white">
                              {patient.prenom?.charAt(0)}{patient.nom?.charAt(0)}
                            </span>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-md">
                            <HeartIcon className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                            {patient.prenom} {patient.nom}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{patient.email}</p>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 group/item hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                          <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-950/30 transition-colors">
                            <PhoneIcon className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-medium">{patient.telephone}</span>
                        </div>
                        {patient.adresse && (
                          <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-400 group/item hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                            <div className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover/item:bg-blue-100 dark:group-hover/item:bg-blue-950/30 transition-colors">
                              <MapPinIcon className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium truncate">{patient.adresse}</span>
                          </div>
                        )}
                      </div>

                      {/* Stats Bar */}
                      <div className="flex items-center gap-4 mb-5 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-2 flex-1">
                          <CalendarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('admin.patients.table.appointments')}</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {patient._count?.rendezvousPatient || 0}
                            </p>
                          </div>
                        </div>
                        <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5">{t('admin.patients.table.registeredOn')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatDate(patient.createdAt, dateFormats.short)}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleToggleStatus(patient)}
                          className={`flex items-center justify-center gap-1 px-3 py-3 rounded-xl font-bold transition-all hover:scale-105 shadow-lg text-sm ${
                            patient.isActive
                              ? 'bg-orange-500 hover:bg-orange-600 text-white'
                              : 'bg-blue-700 hover:bg-blue-800 text-white'
                          }`}
                        >
                          {patient.isActive ? (
                            <>
                              <XCircleIcon className="w-4 h-4" />
                              <span className="hidden sm:inline">{t('admin.patients.deactivate')}</span>
                            </>
                          ) : (
                            <>
                              <CheckCircleIcon className="w-4 h-4" />
                              <span className="hidden sm:inline">{t('admin.patients.activate')}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleShowDetails(patient)}
                          className="flex items-center justify-center gap-1 px-3 py-3 rounded-xl font-bold transition-all hover:scale-105 border-2 border-blue-500 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-sm"
                        >
                          <EyeIcon className="w-4 h-4" />
                          <span className="hidden sm:inline">{t('admin.patients.table.details')}</span>
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient)}
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
                    {t('admin.patients.pagination.previous')}
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
                    {t('admin.patients.pagination.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedPatient && (
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
                    selectedPatient.isActive ? 'bg-red-500' : 'bg-blue-500'
                  } opacity-50`}></div>
                  <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${
                    selectedPatient.isActive
                      ? 'bg-red-500'
                      : 'bg-blue-700'
                  }`}>
                    {selectedPatient.isActive ? (
                      <XCircleIcon className="w-10 h-10 text-white" />
                    ) : (
                      <CheckCircleIcon className="w-10 h-10 text-white" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedPatient.isActive ? t('admin.patients.confirmDeactivateTitle') : t('admin.patients.confirmActivateTitle')}
                </h3>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {selectedPatient.prenom} {selectedPatient.nom}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPatient.email}
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
                    selectedPatient.isActive
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
      {showDetailsModal && selectedPatient && (
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
                {/* Avatar du patient */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-blue-700 rounded-2xl blur-md opacity-75"></div>
                  <div className="relative w-20 h-20 bg-blue-700 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-3xl font-bold text-white">
                      {selectedPatient.prenom?.charAt(0)}{selectedPatient.nom?.charAt(0)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                    <HeartIcon className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Titre et statut */}
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedPatient.prenom} {selectedPatient.nom}
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedPatient.isActive ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Actif</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-100 dark:bg-red-900/40 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-bold text-red-700 dark:text-red-300">Inactif</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-400">ID: {selectedPatient.id.slice(0, 8)}</span>
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
                      Email
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white break-all">
                    {selectedPatient.email}
                  </p>
                </div>

                <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <PhoneIcon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Téléphone
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPatient.telephone}
                  </p>
                </div>
              </div>

              {/* Adresse et Date de naissance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPatient.adresse && (
                  <div className="p-5 bg-white dark:bg-gray-700/50 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPinIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Adresse
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-white leading-relaxed">
                      {selectedPatient.adresse}
                    </p>
                  </div>
                )}

                {selectedPatient.dateNaissance && (
                  <div className="p-5 bg-white dark:bg-gray-700/50 rounded-2xl border-2 border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-3">
                      <CakeIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Date de naissance
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(selectedPatient.dateNaissance, dateFormats.long)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {new Date().getFullYear() - new Date(selectedPatient.dateNaissance).getFullYear()} ans
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
                      Rendez-vous
                    </p>
                  </div>
                  <p className="text-4xl font-bold">
                    {selectedPatient._count?.rendezvousPatient || 0}
                  </p>
                  <p className="text-sm opacity-75 mt-1">Total des consultations</p>
                </div>

                <div className="p-5 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ClockIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Inscrit le
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatDate(selectedPatient.createdAt, dateFormats.short)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Membre depuis {Math.floor((new Date() - new Date(selectedPatient.createdAt)) / (1000 * 60 * 60 * 24))} jours
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
      {showDeleteModal && selectedPatient && (
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
                  Supprimer le patient ?
                </h3>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {selectedPatient.prenom} {selectedPatient.nom}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {selectedPatient.email}
                </p>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    ⚠️ Cette action est irréversible. Toutes les données du patient (rendez-vous, notifications, notes médicales) seront définitivement supprimées.
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
                  onClick={confirmDeletePatient}
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
    </AdminLayout>
  );
};

export default AdminPatients;
