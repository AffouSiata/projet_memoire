import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
import { useDateFormatter, dateFormats, timeFormats } from '../../hooks/useDateFormatter';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  XMarkIcon,
  ChartBarIcon,
  HeartIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const MedecinPatients = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatDate, formatTime } = useDateFormatter();

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('TOUS');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [patientsRes, appointmentsRes] = await Promise.all([
        medecinService.getPatients(),
        medecinService.getAppointments(),
      ]);

      const patientsData = patientsRes.data?.data || patientsRes.data || [];
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setAppointments(appointmentsRes.data.data || []);
    } catch (error) {
      console.error(t('medecin.patients.errors.loadingError'), error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des patients
  const filteredPatients = patients.filter(patient => {
    // Filtre par recherche
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      patient.nom?.toLowerCase().includes(searchLower) ||
      patient.prenom?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower);

    // Filtre par type
    let matchesFilter = true;
    if (filterType === 'RECENTS') {
      // Patients avec rendez-vous dans les 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      matchesFilter = appointments.some(apt =>
        apt.patientId === patient.id &&
        new Date(apt.date) >= thirtyDaysAgo
      );
    } else if (filterType === 'CHRONIQUES') {
      // Patients avec plus de 3 rendez-vous
      const patientAppointments = appointments.filter(apt => apt.patientId === patient.id);
      matchesFilter = patientAppointments.length >= 3;
    }

    return matchesSearch && matchesFilter;
  });

  // Obtenir les rendez-vous d'un patient
  const getPatientAppointments = (patientId) => {
    return appointments
      .filter(apt => apt.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Obtenir le dernier rendez-vous
  const getLastAppointment = (patientId) => {
    const patientAppts = getPatientAppointments(patientId);
    const pastAppts = patientAppts.filter(apt => new Date(apt.date) < new Date());
    return pastAppts[0];
  };

  // Obtenir le prochain rendez-vous
  const getNextAppointment = (patientId) => {
    const patientAppts = getPatientAppointments(patientId);
    const futureAppts = patientAppts.filter(apt => new Date(apt.date) >= new Date());
    return futureAppts[futureAppts.length - 1];
  };

  // Statistiques
  const stats = {
    total: patients.length,
    recents: patients.filter(p => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return appointments.some(apt =>
        apt.patientId === p.id &&
        new Date(apt.date) >= thirtyDaysAgo
      );
    }).length,
    chroniques: patients.filter(p => {
      const patientAppts = appointments.filter(apt => apt.patientId === p.id);
      return patientAppts.length >= 3;
    }).length,
    inactifs: patients.filter(p => {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const lastAppt = getLastAppointment(p.id);
      return !lastAppt || new Date(lastAppt.date) < ninetyDaysAgo;
    }).length,
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
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
        {/* Blobs animés - LARANA colors */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Redesigné */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg overflow-hidden">
              {/* Effets décoratifs subtils */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/40 dark:bg-green-900/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-100/40 dark:bg-secondary-900/20 rounded-full blur-3xl"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-2xl mb-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">{t('medecin.patients.badge')}</span>
                    </div>

                    {/* Titre avec icône */}
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {t('medecin.patients.title')}
                      </h1>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <UsersIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                      {t('medecin.patients.subtitle')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 cartes stats horizontales - Style Dashboard */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Total patients */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <UsersIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.patients.stats.total')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.patients.stats.totalLabel')}</p>
            </div>

            {/* Récents */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <ClockIcon className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.patients.stats.recents')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.recents}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.patients.stats.recentsLabel')}</p>
            </div>

            {/* Chroniques */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <HeartIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.patients.stats.chronic')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.chroniques}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.patients.stats.chronicLabel')}</p>
            </div>

            {/* Inactifs */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <ExclamationCircleIcon className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.patients.stats.inactive')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.inactifs}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.patients.stats.inactiveLabel')}</p>
            </div>
          </div>

          {/* Filtres et recherche - Style moderne */}
          <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/50 mb-6 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-4">
              {/* Barre de recherche */}
              <div className="flex-1 relative group">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t('medecin.patients.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white placeholder:text-gray-400 font-medium transition-all"
                />
              </div>

              {/* Filtre par type */}
              <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl">
                <FunnelIcon className="w-5 h-5 text-green-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent focus:outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="TOUS">{t('medecin.patients.filters.all')}</option>
                  <option value="RECENTS">{t('medecin.patients.filters.recent')}</option>
                  <option value="CHRONIQUES">{t('medecin.patients.filters.chronic')}</option>
                </select>
              </div>
            </div>

            {/* Résultats de recherche */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {t('medecin.patients.resultsFound', { count: filteredPatients.length })}
              </span>
            </div>
          </div>

          {/* Liste des patients - Design moderne */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => {
                const lastAppt = getLastAppointment(patient.id);
                const nextAppt = getNextAppointment(patient.id);
                const totalAppts = getPatientAppointments(patient.id).length;

                return (
                  <div
                    key={patient.id}
                    className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in border border-white/20 dark:border-gray-700/50 group"
                    style={{ animationDelay: `${0.7 + index * 0.05}s` }}
                  >
                    {/* Header de la carte */}
                    <div className="flex items-center gap-4 mb-5">
                      {/* Avatar avec glow */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-secondary-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-secondary-600 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-xl group-hover:scale-110 transition-transform">
                          {patient.prenom?.charAt(0)}{patient.nom?.charAt(0)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate mb-1">
                          {patient.prenom} {patient.nom}
                        </h3>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg w-fit">
                          <DocumentTextIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                            {t('medecin.patients.consultations', { count: totalAppts })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informations - Mini cartes */}
                    <div className="space-y-3 mb-5">
                      {/* Dernier suivi */}
                      <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CalendarIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('medecin.patients.lastVisit')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {lastAppt ? formatDate(new Date(lastAppt.date), dateFormats.short) : t('medecin.patients.never')}
                          </p>
                        </div>
                      </div>

                      {/* Prochain RDV */}
                      {nextAppt && (
                        <div className="flex items-center gap-3 px-3 py-2.5 bg-green-50 dark:bg-green-900/30 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ClockIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('medecin.patients.nextAppointment')}</p>
                            <p className="text-sm font-bold text-green-700 dark:text-green-400 truncate">
                              {formatDate(new Date(nextAppt.date), dateFormats.short)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Contact */}
                      <div className="pt-3 border-t border-gray-200/50 dark:border-gray-700/50 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <PhoneIcon className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 truncate font-medium">
                            {patient.telephone || t('medecin.patients.notProvided')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-7 h-7 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <EnvelopeIcon className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" />
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 truncate font-medium">
                            {patient.email || t('medecin.patients.notProvided')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bouton voir la fiche - Design moderne */}
                    <button
                      onClick={() => handleViewDetails(patient)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 via-green-600 to-secondary-600 hover:from-green-600 hover:via-green-700 hover:to-secondary-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      <UserCircleIcon className="w-5 h-5" />
                      <span>{t('medecin.patients.viewRecord')}</span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/20 dark:border-gray-700/50 shadow-xl animate-scale-in">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-secondary-600 rounded-full flex items-center justify-center shadow-xl">
                    <UsersIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('medecin.patients.noPatients')}
                </h3>
                <p className="text-gray-600 dark:text-white">
                  {t('medecin.patients.tryModifyFilters')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Fiche Patient - Redesign Ultra-Moderne */}
      {showDetailsModal && selectedPatient && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-scale-in">
          {/* Backdrop avec blur puissant */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-md"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          {/* Container du modal */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden animate-slide-up">

            {/* Header avec design moderne */}
            <div className="relative bg-gradient-to-br from-green-500 via-secondary-500 to-primary-600 p-6 overflow-hidden">
              {/* Effets décoratifs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {/* Avatar avec glow effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-30"></div>
                    <div className="relative w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-bold text-4xl text-white shadow-2xl border-2 border-white/30">
                      {selectedPatient.prenom?.charAt(0)}{selectedPatient.nom?.charAt(0)}
                    </div>
                  </div>

                  {/* Infos patient */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full mb-2 backdrop-blur-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{t('medecin.patients.modal.badge')}</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white mb-1">
                      {selectedPatient.prenom} {selectedPatient.nom}
                    </h2>
                    <p className="text-white/90 text-sm font-medium">
                      {t('medecin.patients.consultations', { count: getPatientAppointments(selectedPatient.id).length })} •
                      {t('medecin.patients.modal.patientSince')} {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).getFullYear() : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Bouton fermer */}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto max-h-[calc(92vh-140px)]">
              <div className="p-6 space-y-6">

                {/* Statistiques rapides */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Total consultations */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-400/20 to-primary-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-secondary-50 to-primary-50 dark:from-secondary-900/20 dark:to-primary-900/20 rounded-2xl p-5 border border-secondary-200/50 dark:border-secondary-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {getPatientAppointments(selectedPatient.id).length}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('medecin.patients.modal.totalConsultations')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RDV confirmés */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30 rounded-2xl p-5 border border-green-200/50 dark:border-green-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <ChartBarIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {getPatientAppointments(selectedPatient.id).filter(a => a.statut === 'CONFIRME').length}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('medecin.patients.modal.confirmed')}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dernier suivi */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-5 border border-blue-200/50 dark:border-blue-700/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <ClockIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {getLastAppointment(selectedPatient.id)
                              ? formatDate(new Date(getLastAppointment(selectedPatient.id).date), dateFormats.short)
                              : t('medecin.patients.never')}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('medecin.patients.modal.lastVisit')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de contact - Design moderne */}
                <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  {/* Titre avec icône gradient */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                      <UserCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {t('medecin.patients.modal.contactInfo')}
                    </h3>
                  </div>

                  {/* Grid d'informations */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Téléphone */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-secondary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                            <PhoneIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.patients.phone')}</p>
                        </div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          {selectedPatient.telephone || t('medecin.patients.notProvided')}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-primary-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                            <EnvelopeIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.patients.email')}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {selectedPatient.email || t('medecin.patients.notProvided')}
                        </p>
                      </div>
                    </div>

                    {/* Date de naissance */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <CalendarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.patients.modal.birthDate')}</p>
                        </div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          {selectedPatient.dateNaissance
                            ? formatDate(new Date(selectedPatient.dateNaissance), dateFormats.short)
                            : t('medecin.patients.notProvided')}
                        </p>
                      </div>
                    </div>

                    {/* Genre */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <UserCircleIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{t('medecin.patients.modal.gender')}</p>
                        </div>
                        <p className="text-base font-bold text-gray-900 dark:text-white">
                          {selectedPatient.sexe || t('medecin.patients.notProvided')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Historique des rendez-vous - Design amélioré */}
                <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  {/* Titre */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CalendarIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('medecin.patients.modal.appointmentHistory')}
                      </h3>
                    </div>
                    <div className="px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                      <p className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                        {getPatientAppointments(selectedPatient.id).length}
                      </p>
                    </div>
                  </div>

                  {/* Liste des RDV */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {getPatientAppointments(selectedPatient.id).length > 0 ? (
                      getPatientAppointments(selectedPatient.id).map((appt, index) => (
                        <div
                          key={appt.id}
                          className="group relative bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm rounded-xl p-4 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50 dark:border-gray-600/50"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Icône statut avec glow */}
                              <div className="relative">
                                <div className={`absolute inset-0 rounded-xl blur-lg opacity-50 ${
                                  appt.statut === 'CONFIRME' ? 'bg-green-500' :
                                  appt.statut === 'EN_ATTENTE' ? 'bg-orange-500' :
                                  'bg-red-500'
                                }`}></div>
                                <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                                  appt.statut === 'CONFIRME' ? 'bg-gradient-to-br from-green-400 to-green-600' :
                                  appt.statut === 'EN_ATTENTE' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                  'bg-gradient-to-br from-red-400 to-red-600'
                                }`}>
                                  <CalendarIcon className="w-6 h-6 text-white" />
                                </div>
                              </div>

                              {/* Détails */}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">
                                  {formatDate(new Date(appt.date), dateFormats.long)}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1.5">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>{formatTime(new Date(appt.date), timeFormats.short)}</span>
                                  </div>
                                  <span>•</span>
                                  <div className="flex items-center gap-1.5">
                                    <DocumentTextIcon className="w-4 h-4" />
                                    <span className="truncate">{appt.motif || t('medecin.patients.modal.consultation')}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Badge statut */}
                            <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md whitespace-nowrap ${
                              appt.statut === 'CONFIRME' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                              appt.statut === 'EN_ATTENTE' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
                              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            }`}>
                              {appt.statut === 'CONFIRME' ? `✓ ${t('medecin.patients.modal.statusConfirmed')}` :
                               appt.statut === 'EN_ATTENTE' ? `⏳ ${t('medecin.patients.modal.statusPending')}` :
                               `✕ ${t('medecin.patients.modal.statusCancelled')}`}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CalendarIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">{t('medecin.patients.modal.noAppointments')}</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('medecin.patients.modal.historyWillAppear')}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </MedecinLayout>
  );
};

export default MedecinPatients;
