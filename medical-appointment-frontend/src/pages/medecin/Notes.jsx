import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
import { useDateFormatter, dateFormats, timeFormats } from '../../hooks/useDateFormatter';
import { validateRequired, validateNoteContent } from '../../utils/validators';
import {
  DocumentTextIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PaperClipIcon,
  XMarkIcon,
  UserCircleIcon,
  CalendarIcon,
  DocumentIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline';
import ConfirmModal from '../../components/modals/ConfirmModal';

const MedecinNotes = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { formatDate, formatTime } = useDateFormatter();

  const [notes, setNotes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    contenu: '',
    statut: 'ACTIF',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notesRes, patientsRes] = await Promise.all([
        medecinService.getNotes(),
        medecinService.getPatients(),
      ]);

      setNotes(notesRes.data?.data || notesRes.data || []);
      const patientsData = patientsRes.data?.data || patientsRes.data || [];
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (error) {
      console.error(t('medecin.notes.errors.loading'), error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des notes
  const filteredNotes = notes.filter(note => {
    // Filtre par recherche
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      note.contenu?.toLowerCase().includes(searchLower) ||
      note.patient?.nom?.toLowerCase().includes(searchLower) ||
      note.patient?.prenom?.toLowerCase().includes(searchLower);

    // Filtre par statut
    const matchesStatus = statusFilter === 'TOUS' || note.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Statistiques
  const stats = {
    total: notes.length,
    actives: notes.filter(n => n.statut === 'ACTIF').length,
    archivees: notes.filter(n => n.statut === 'ARCHIVE').length,
    avecPJ: notes.filter(n => n.piecesJointes && n.piecesJointes.length > 0).length,
  };

  const handleFormChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

    const patientResult = validateRequired(formData.patientId, 'Le patient');
    if (!patientResult.valid) errors.patientId = patientResult.message;

    const contentResult = validateNoteContent(formData.contenu);
    if (!contentResult.valid) errors.contenu = contentResult.message;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await medecinService.createNote(formData);
      loadData();
      setShowCreateModal(false);
      setFormData({ patientId: '', contenu: '', statut: 'ACTIF' });
      setFormErrors({});
    } catch (error) {
      console.error(t('medecin.notes.errors.creating'), error);
    }
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await medecinService.deleteNote(noteToDelete.id);
      await loadData();
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error(t('medecin.notes.errors.deleting'), error);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      await medecinService.updateNote(noteId, { statut: 'ARCHIVE' });
      loadData();
    } catch (error) {
      console.error(t('medecin.notes.errors.archiving'), error);
    }
  };

  const handleViewDetails = (note) => {
    setSelectedNote(note);
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
        {/* Blobs animés en arrière-plan - couleurs LARANA */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header - Style Patients */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg overflow-hidden">
              {/* Effets décoratifs subtils */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/40 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-100/40 dark:bg-secondary-900/20 rounded-full blur-3xl"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-secondary-50 dark:bg-secondary-900/30 rounded-2xl mb-4">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-secondary-600 dark:text-secondary-400 uppercase tracking-wider">{t('medecin.notes.badge')}</span>
                    </div>

                    {/* Titre avec icône */}
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {t('medecin.notes.title')}
                      </h1>
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <DocumentTextIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                      {t('medecin.notes.subtitle')}
                    </p>
                  </div>

                  {/* Bouton créer */}
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <PlusIcon className="w-5 h-5" />
                    {t('medecin.notes.newNote')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 cartes stats horizontales - Style Dashboard */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Total notes */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <DocumentTextIcon className="w-6 h-6 text-secondary-500 dark:text-secondary-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.notes.stats.total')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.total}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.notes.stats.totalLabel')}</p>
            </div>

            {/* Notes actives */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.notes.stats.active')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.actives}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.notes.stats.activeLabel')}</p>
            </div>

            {/* Notes archivées */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <ArchiveBoxIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.notes.stats.archived')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.archivees}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.notes.stats.archivedLabel')}</p>
            </div>

            {/* Avec pièces jointes */}
            <div
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <PaperClipIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.notes.stats.withAttachments')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.avecPJ}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.notes.stats.withAttachmentsLabel')}</p>
            </div>
          </div>

          {/* Filtres et recherche - Style moderne */}
          <div
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 mb-6 animate-scale-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="flex items-center gap-4">
              {/* Barre de recherche avec style amélioré */}
              <div className="flex-1 relative group">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 group-focus-within:text-secondary-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300" />
                <input
                  type="text"
                  placeholder={t('medecin.notes.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>

              {/* Filtre par statut avec icône */}
              <div className="flex items-center gap-3 px-4 py-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <FunnelIcon className="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent focus:outline-none text-gray-900 dark:text-white font-medium cursor-pointer"
                >
                  <option value="TOUS">{t('medecin.notes.filters.allStatuses')}</option>
                  <option value="ACTIF">{t('medecin.notes.filters.active')}</option>
                  <option value="ARCHIVE">{t('medecin.notes.filters.archived')}</option>
                </select>
              </div>
            </div>

            {/* Résultats de recherche avec badge */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl">
                  <p className="text-sm font-bold text-secondary-700 dark:text-secondary-400">
                    {t('medecin.notes.resultsFound', { count: filteredNotes.length })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Liste des notes - Design Card Simple */}
          <div className="space-y-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note, index) => {
                const isActive = note.statut === 'ACTIF';
                const hasAttachments = note.piecesJointes && note.piecesJointes.length > 0;

                return (
                  <div
                    key={note.id}
                    className="group animate-slide-up"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    {/* Carte simple et moderne */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">

                      <div className="flex items-start justify-between gap-4">
                        {/* Partie gauche - Contenu principal */}
                        <div className="flex-1">
                          {/* Header avec nom patient et statut */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isActive
                                ? 'bg-secondary-100 dark:bg-secondary-900/30'
                                : 'bg-orange-100 dark:bg-orange-900/30'
                            }`}>
                              <DocumentTextIcon className={`w-6 h-6 ${
                                isActive ? 'text-secondary-600 dark:text-secondary-400' : 'text-orange-600 dark:text-orange-400'
                              }`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                  {note.patient?.prenom} {note.patient?.nom}
                                </h3>
                                {!isActive && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold">
                                    <ArchiveBoxIcon className="w-3.5 h-3.5" />
                                    {t('medecin.notes.archivedBadge')}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(new Date(note.createdAt), dateFormats.medium)} • Dr. {user?.nom}
                              </p>
                            </div>
                          </div>

                          {/* Contenu de la note */}
                          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
                              {note.contenu}
                            </p>
                          </div>

                          {/* Pièces jointes si présentes */}
                          {hasAttachments && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <PaperClipIcon className="w-4 h-4" />
                              <span>{t('medecin.notes.attachments', { count: note.piecesJointes.length })}</span>
                            </div>
                          )}
                        </div>

                        {/* Partie droite - Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleViewDetails(note)}
                            className="px-5 py-2.5 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                          >
                            {t('medecin.notes.details')}
                          </button>

                          {isActive && (
                            <button
                              onClick={() => handleArchive(note.id)}
                              className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                            >
                              {t('medecin.notes.archive')}
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteClick(note)}
                            className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 whitespace-nowrap"
                          >
                            {t('medecin.notes.delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50 rounded-3xl p-16 text-center shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <DocumentTextIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('medecin.notes.noNotes')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {t('medecin.notes.createFirstNote')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Créer - Style moderne */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop avec effet blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setShowCreateModal(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-2xl w-full animate-scale-in overflow-hidden">
            {/* Effet décoratif d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Header du modal */}
            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <PlusIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('medecin.notes.createModal.title')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('medecin.notes.createModal.subtitle')}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreate} className="relative z-10 space-y-6">
              {/* Patient */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  <UserCircleIcon className="w-5 h-5 text-secondary-500" />
                  {t('medecin.notes.createModal.patient')}
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => handleFormChange('patientId', e.target.value)}
                  className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-secondary-500 text-gray-900 dark:text-white font-medium transition-all duration-300 ${
                    formErrors.patientId
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-secondary-500'
                  }`}
                >
                  <option value="">{t('medecin.notes.createModal.selectPatient')}</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.prenom} {patient.nom}
                    </option>
                  ))}
                </select>
                {formErrors.patientId && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.patientId}
                  </p>
                )}
              </div>

              {/* Contenu */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  <DocumentTextIcon className="w-5 h-5 text-secondary-500" />
                  {t('medecin.notes.createModal.observation')}
                </label>
                <textarea
                  rows={10}
                  value={formData.contenu}
                  onChange={(e) => handleFormChange('contenu', e.target.value)}
                  placeholder={t('medecin.notes.createModal.observationPlaceholder')}
                  className={`w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:border-secondary-500 text-gray-900 dark:text-white resize-none font-medium transition-all duration-300 ${
                    formErrors.contenu
                      ? 'border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-gray-600 focus:ring-secondary-500'
                  }`}
                ></textarea>
                {formErrors.contenu && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {formErrors.contenu}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {formData.contenu.length}/5000 caractères (minimum 10)
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {t('medecin.notes.createModal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {t('medecin.notes.createModal.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détails - Style compact */}
      {showDetailsModal && selectedNote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop avec effet blur */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setShowDetailsModal(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 max-w-2xl w-full animate-scale-in">
            {/* Effet décoratif d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Header du modal */}
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                  selectedNote.statut === 'ACTIF'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
                }`}>
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t('medecin.notes.detailsModal.title')}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('medecin.notes.detailsModal.subtitle')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 shadow-lg"
              >
                <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="relative z-10 space-y-4">
              {/* Badge de statut */}
              <div className="flex justify-center">
                <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                  selectedNote.statut === 'ACTIF'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {selectedNote.statut === 'ACTIF' ? t('medecin.notes.statusActive') : t('medecin.notes.statusArchived')}
                </span>
              </div>

              {/* Carte Patient */}
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-900/10 rounded-2xl p-5 border-2 border-secondary-200 dark:border-secondary-800 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-secondary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <UserCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-secondary-700 dark:text-secondary-400 uppercase tracking-wider">
                    {t('medecin.notes.detailsModal.patient')}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedNote.patient?.prenom} {selectedNote.patient?.nom}
                </p>
              </div>

              {/* Carte Contenu */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-900/10 rounded-2xl p-5 border-2 border-primary-200 dark:border-primary-800 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
                    <DocumentTextIcon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">
                    {t('medecin.notes.detailsModal.observation')}
                  </p>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-primary-200 dark:border-primary-800 max-h-60 overflow-y-auto">
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                    {selectedNote.contenu}
                  </p>
                </div>
              </div>

              {/* Métadonnées */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date de création */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="w-5 h-5 text-secondary-500" />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      {t('medecin.notes.detailsModal.date')}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatDate(new Date(selectedNote.createdAt), dateFormats.medium)}
                  </p>
                </div>

                {/* Médecin */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCircleIcon className="w-5 h-5 text-primary-500" />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                      {t('medecin.notes.detailsModal.doctor')}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Dr. {user?.nom}
                  </p>
                </div>
              </div>

              {/* Pièces jointes si présentes */}
              {selectedNote.piecesJointes && selectedNote.piecesJointes.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl p-4 border-2 border-blue-200 dark:border-blue-800 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <PaperClipIcon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                      {t('medecin.notes.detailsModal.attachments', { count: selectedNote.piecesJointes.length })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {selectedNote.piecesJointes.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                        <PaperClipIcon className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bouton Fermer */}
            <div className="relative z-10 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {t('medecin.notes.detailsModal.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title={t('medecin.notes.deleteModal.title')}
        message={noteToDelete ? t('medecin.notes.deleteModal.message', { patient: `${noteToDelete.patient?.prenom} ${noteToDelete.patient?.nom}` }) : ''}
        confirmText={t('medecin.notes.deleteModal.confirm')}
        cancelText={t('medecin.notes.deleteModal.cancel')}
        type="danger"
        icon={TrashIcon}
      />
    </MedecinLayout>
  );
};

export default MedecinNotes;
