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
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const MedecinAppointments = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatDate, formatTime } = useDateFormatter();

  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const [dateFilter, setDateFilter] = useState('TOUS');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await medecinService.getAppointments();
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error(t('medecin.appointments.errors.loadingError'), error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des rendez-vous
  const filteredAppointments = appointments.filter(apt => {
    // Filtre par recherche
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      apt.patient?.nom?.toLowerCase().includes(searchLower) ||
      apt.patient?.prenom?.toLowerCase().includes(searchLower) ||
      apt.motif?.toLowerCase().includes(searchLower);

    // Filtre par statut
    const matchesStatus = statusFilter === 'TOUS' || apt.statut === statusFilter;

    // Filtre par date
    let matchesDate = true;
    const apptDate = new Date(apt.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateFilter === 'AUJOURDHUI') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = apptDate >= today && apptDate < tomorrow;
    } else if (dateFilter === 'SEMAINE') {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      matchesDate = apptDate >= today && apptDate < nextWeek;
    } else if (dateFilter === 'MOIS') {
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      matchesDate = apptDate >= today && apptDate < nextMonth;
    } else if (dateFilter === 'PASSES') {
      matchesDate = apptDate < today;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Statistiques
  const stats = {
    total: appointments.length,
    confirmes: appointments.filter(a => a.statut === 'CONFIRME').length,
    enAttente: appointments.filter(a => a.statut === 'EN_ATTENTE').length,
    annules: appointments.filter(a => a.statut === 'ANNULE').length,
    aujourdhui: appointments.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.date).toDateString() === today;
    }).length,
  };

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, endIndex);

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  // Actions sur les rendez-vous
  const handleConfirm = async (appointmentId) => {
    try {
      await medecinService.updateAppointmentStatus(appointmentId, 'CONFIRME');
      loadAppointments();
    } catch (error) {
      console.error(t('medecin.appointments.errors.confirmError'), error);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await medecinService.updateAppointmentStatus(appointmentId, 'ANNULE');
      loadAppointments();
    } catch (error) {
      console.error(t('medecin.appointments.errors.cancelError'), error);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <MedecinLayout>
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-900">
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
        {/* Blobs animés - couleurs LARANA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Redesigné - Plus épuré et moderne */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg overflow-hidden">
              {/* Effets décoratifs subtils */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100/40 dark:bg-secondary-900/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-100/40 dark:bg-primary-900/20 rounded-full blur-3xl"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge avec icône de calendrier */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-2xl mb-4">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">{t('medecin.appointments.badge')}</span>
                    </div>

                    {/* Titre avec icône intégrée */}
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {t('medecin.appointments.title')}
                      </h1>
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <CalendarIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                      {t('medecin.appointments.subtitle')}
                    </p>
                  </div>

                  {/* Actions rapides - Redesignées */}
                  <div className="flex items-center gap-3">
                    {/* Bouton Exporter - Style moderne */}
                    <button className="flex items-center gap-2.5 px-6 py-3.5 bg-white dark:bg-gray-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-gray-700 dark:text-white hover:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-blue-600 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      <span>{t('medecin.appointments.export')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 cartes stats horizontales - Style Dashboard */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Total */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <CalendarIcon className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.appointments.stats.total')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.appointments.stats.totalLabel')}</p>
            </div>

            {/* Confirmés */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.appointments.stats.confirmed')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.confirmes}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.appointments.stats.confirmedLabel')}</p>
            </div>

            {/* En attente */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <ClockIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.appointments.stats.pending')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.enAttente}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.appointments.stats.pendingLabel')}</p>
            </div>

            {/* Annulés */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <XCircleIcon className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.appointments.stats.cancelled')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.annules}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.appointments.stats.cancelledLabel')}</p>
            </div>
          </div>

          {/* Filtres et recherche avec glassmorphism */}
          <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 mb-6 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-4">
              {/* Barre de recherche */}
              <div className="flex-1 relative group">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-secondary-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t('medecin.appointments.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-white placeholder:text-gray-400 font-medium transition-all"
                />
              </div>

              {/* Filtre par statut */}
              <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl">
                <FunnelIcon className="w-5 h-5 text-secondary-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent focus:outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="TOUS">{t('medecin.appointments.filters.allStatuses')}</option>
                  <option value="CONFIRME">{t('medecin.appointments.filters.confirmed')}</option>
                  <option value="EN_ATTENTE">{t('medecin.appointments.filters.pending')}</option>
                  <option value="ANNULE">{t('medecin.appointments.filters.cancelled')}</option>
                </select>
              </div>

              {/* Filtre par date */}
              <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl">
                <CalendarIcon className="w-5 h-5 text-primary-500" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-transparent focus:outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="TOUS">{t('medecin.appointments.filters.allDates')}</option>
                  <option value="AUJOURDHUI">{t('medecin.appointments.filters.today')}</option>
                  <option value="SEMAINE">{t('medecin.appointments.filters.thisWeek')}</option>
                  <option value="MOIS">{t('medecin.appointments.filters.thisMonth')}</option>
                  <option value="PASSES">{t('medecin.appointments.filters.past')}</option>
                </select>
              </div>
            </div>

            {/* Résultats de recherche */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {filteredAppointments.length} {t('medecin.appointments.resultsFound', { count: filteredAppointments.length })}
                </span>
              </div>
              {totalPages > 1 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {t('medecin.appointments.page')} {currentPage} {t('medecin.appointments.of')} {totalPages}
                </span>
              )}
            </div>
          </div>

          {/* Liste des rendez-vous avec glassmorphism */}
          <div className="space-y-4">
            {paginatedAppointments.length > 0 ? (
              paginatedAppointments.map((apt, index) => (
                <div
                  key={apt.id}
                  className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-slide-up border border-white/20 dark:border-gray-700/50 group"
                  style={{ animationDelay: `${0.6 + index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    {/* Informations patient */}
                    <div className="flex items-center gap-4 flex-1">
                      {/* Avatar avec gradient */}
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity ${
                          apt.statut === 'CONFIRME' ? 'bg-green-500' :
                          apt.statut === 'EN_ATTENTE' ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}></div>
                        <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl group-hover:scale-110 transition-transform ${
                          apt.statut === 'CONFIRME' ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                          apt.statut === 'EN_ATTENTE' ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                          'bg-gradient-to-br from-red-400 to-red-600 text-white'
                        }`}>
                          {apt.patient?.prenom?.charAt(0)}{apt.patient?.nom?.charAt(0)}
                        </div>
                      </div>

                      {/* Détails */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {apt.patient?.prenom} {apt.patient?.nom}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                            apt.statut === 'CONFIRME' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            apt.statut === 'EN_ATTENTE' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {apt.statut === 'CONFIRME' ? `✓ ${t('medecin.appointments.statusConfirmed')}` :
                             apt.statut === 'EN_ATTENTE' ? `⏳ ${t('medecin.appointments.statusPending')}` :
                             `✕ ${t('medecin.appointments.statusCancelled')}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <CalendarIcon className="w-4 h-4 text-secondary-500" />
                            <span className="font-medium">{formatDate(new Date(apt.date), dateFormats.medium)}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <ClockIcon className="w-4 h-4 text-primary-500" />
                            <span className="font-medium">{formatTime(new Date(apt.date), timeFormats.short)}</span>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="font-medium">💬 {apt.motif || t('medecin.appointments.consultation')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {apt.statut === 'EN_ATTENTE' && (
                        <>
                          <button
                            onClick={() => handleConfirm(apt.id)}
                            className="relative group/btn overflow-hidden px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <span className="relative z-10">{t('medecin.appointments.confirm')}</span>
                          </button>
                          <button
                            onClick={() => handleCancel(apt.id)}
                            className="relative group/btn overflow-hidden px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <span className="relative z-10">{t('medecin.appointments.cancel')}</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewDetails(apt)}
                        className="relative group/btn overflow-hidden px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        <span className="relative z-10">{t('medecin.appointments.details')}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/20 dark:border-gray-700/50 shadow-xl animate-scale-in">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-secondary-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-xl">
                    <CalendarIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('medecin.appointments.noAppointments')}
                </h3>
                <p className="text-gray-600 dark:text-white">
                  {t('medecin.appointments.tryModifyFilters')}
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-sm text-gray-600 dark:text-white">
                {t('medecin.appointments.showing')} <span className="font-bold">{startIndex + 1}</span> - <span className="font-bold">{Math.min(endIndex, filteredAppointments.length)}</span> {t('medecin.appointments.outOf')} <span className="font-bold">{filteredAppointments.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    currentPage === 1
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-secondary-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg border border-white/20 dark:border-gray-700/50'
                  }`}
                >
                  ← {t('medecin.appointments.previous')}
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
                              ? 'bg-secondary-500 text-white shadow-lg scale-110'
                              : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-secondary-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md border border-white/20 dark:border-gray-700/50'
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
                      : 'bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm text-gray-700 dark:text-white hover:bg-secondary-50 dark:hover:bg-gray-700 hover:scale-105 shadow-md hover:shadow-lg border border-white/20 dark:border-gray-700/50'
                  }`}
                >
                  {t('medecin.appointments.next')} →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Détails Ultra-Moderne */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-scale-in">
          {/* Backdrop avec effet blur */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl animate-slide-up overflow-hidden">
            {/* Header avec gradient et effet décoratif */}
            <div className="relative bg-gradient-to-br from-secondary-500 via-secondary-600 to-primary-600 p-5 overflow-hidden">
              {/* Blobs décoratifs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              {/* Contenu header */}
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full mb-2 backdrop-blur-sm">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">{t('medecin.appointments.modal.badge')}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {t('medecin.appointments.modal.title')}
                  </h2>
                  <p className="text-white/80 text-xs">
                    {t('medecin.appointments.modal.subtitle')}
                  </p>
                </div>

                {/* Bouton fermer */}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenu du modal */}
            <div className="p-5 space-y-4">
              {/* Section Patient avec glassmorphism */}
              <div className="relative bg-white/60 dark:bg-gray-700/60 backdrop-blur-xl rounded-2xl p-4 border border-white/20 dark:border-gray-600/50 shadow-lg overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center">
                      <UserCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">{t('medecin.appointments.modal.patientInfo')}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Avatar avec gradient animé */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary-400 to-primary-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg group-hover:scale-110 transition-transform">
                        {selectedAppointment.patient?.prenom?.charAt(0)}{selectedAppointment.patient?.nom?.charAt(0)}
                      </div>
                    </div>

                    {/* Informations */}
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                        {selectedAppointment.patient?.prenom} {selectedAppointment.patient?.nom}
                      </h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-6 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                            <PhoneIcon className="w-3 h-3 text-secondary-600 dark:text-secondary-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {selectedAppointment.patient?.telephone || t('medecin.appointments.modal.notProvided')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="w-6 h-6 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                            <EnvelopeIcon className="w-3 h-3 text-secondary-600 dark:text-secondary-400" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {selectedAppointment.patient?.email || t('medecin.appointments.modal.notProvided')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Détails RDV */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">{t('medecin.appointments.modal.appointmentDetails')}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Date */}
                  <div className="group relative bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-700/80 dark:to-gray-700/60 backdrop-blur-xl rounded-xl p-3 border border-white/20 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/0 to-secondary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CalendarIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.appointments.modal.date')}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatDate(new Date(selectedAppointment.date), dateFormats.medium)}
                      </p>
                    </div>
                  </div>

                  {/* Heure */}
                  <div className="group relative bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-700/80 dark:to-gray-700/60 backdrop-blur-xl rounded-xl p-3 border border-white/20 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ClockIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.appointments.modal.time')}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatTime(new Date(selectedAppointment.date), timeFormats.short)}
                      </p>
                    </div>
                  </div>

                  {/* Statut */}
                  <div className="group relative bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-700/80 dark:to-gray-700/60 backdrop-blur-xl rounded-xl p-3 border border-white/20 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1">
                        {selectedAppointment.statut === 'CONFIRME' ? (
                          <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : selectedAppointment.statut === 'EN_ATTENTE' ? (
                          <ClockIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        ) : (
                          <XCircleIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                        )}
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.appointments.modal.status')}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold shadow-sm ${
                        selectedAppointment.statut === 'CONFIRME' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        selectedAppointment.statut === 'EN_ATTENTE' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {selectedAppointment.statut === 'CONFIRME' ? `✓ ${t('medecin.appointments.statusConfirmed')}` :
                         selectedAppointment.statut === 'EN_ATTENTE' ? `⏳ ${t('medecin.appointments.statusPending')}` :
                         `✕ ${t('medecin.appointments.statusCancelled')}`}
                      </span>
                    </div>
                  </div>

                  {/* Motif */}
                  <div className="group relative bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-700/80 dark:to-gray-700/60 backdrop-blur-xl rounded-xl p-3 border border-white/20 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/0 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ExclamationCircleIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.appointments.modal.reason')}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {selectedAppointment.motif || t('medecin.appointments.modal.generalConsultation')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer avec actions */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="relative group px-6 py-2.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 text-gray-700 dark:text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 text-sm">{t('medecin.appointments.modal.close')}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MedecinLayout>
  );
};

export default MedecinAppointments;
