import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
import {
  ClockIcon,
  PlusIcon,
  TrashIcon,
  CalendarIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const MedecinCreneaux = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [joursOuvres, setJoursOuvres] = useState(['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI']);
  const [formData, setFormData] = useState({
    jour: 'LUNDI',
    heureDebut: '09:00',
    heureFin: '09:30',
    isAvailable: true,
  });

  // Fonction helper pour s'assurer que t() retourne une chaîne
  const safeT = (key, fallback = '') => {
    const result = t(key);
    return typeof result === 'string' ? result : fallback;
  };

  // Tous les jours disponibles avec leurs labels
  const allJours = [
    { value: 'LUNDI', label: safeT('medecin.creneaux.days.monday', 'Lundi') },
    { value: 'MARDI', label: safeT('medecin.creneaux.days.tuesday', 'Mardi') },
    { value: 'MERCREDI', label: safeT('medecin.creneaux.days.wednesday', 'Mercredi') },
    { value: 'JEUDI', label: safeT('medecin.creneaux.days.thursday', 'Jeudi') },
    { value: 'VENDREDI', label: safeT('medecin.creneaux.days.friday', 'Vendredi') },
    { value: 'SAMEDI', label: safeT('medecin.creneaux.days.saturday', 'Samedi') },
    { value: 'DIMANCHE', label: safeT('medecin.creneaux.days.sunday', 'Dimanche') },
  ];

  // Filtrer pour n'afficher que les jours ouvrés sélectionnés dans les paramètres
  const jours = allJours.filter(jour => joursOuvres.includes(jour.value));

  useEffect(() => {
    loadSettings();
    loadTimeSlots();
  }, []);

  // Charger les jours ouvrés depuis localStorage
  const loadSettings = () => {
    try {
      const savedJoursOuvres = localStorage.getItem('joursOuvres');
      if (savedJoursOuvres) {
        const parsed = JSON.parse(savedJoursOuvres);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJoursOuvres(parsed);
          // Mettre à jour le jour par défaut du formulaire
          setFormData(prev => ({
            ...prev,
            jour: parsed[0] || 'LUNDI'
          }));
        }
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error);
      // Garder les jours par défaut en cas d'erreur
    }
  };

  const loadTimeSlots = async () => {
    try {
      console.log('🔄 Chargement des créneaux...');
      const response = await medecinService.getTimeSlots();
      console.log('📦 Réponse API:', response);
      console.log('📦 response.data:', response.data);

      const data = response.data?.data || response.data || [];
      console.log('📦 Data extraite:', data);

      // S'assurer que data est bien un tableau et pas un objet d'erreur
      let slotsArray = [];
      if (Array.isArray(data)) {
        // Filtrer pour ne garder que les objets valides avec id, jour, heureDebut, heureFin
        slotsArray = data.filter(item =>
          item &&
          typeof item === 'object' &&
          item.id &&
          typeof item.jour === 'string' &&
          typeof item.heureDebut === 'string' &&
          typeof item.heureFin === 'string' &&
          !item.error &&
          !item.statusCode
        );
      } else if (data && typeof data === 'object' && !data.error && !data.statusCode && !data.message) {
        // Si c'est un objet mais pas une erreur, c'est peut-être un format différent
        const values = Object.values(data).flat();
        slotsArray = values.filter(item =>
          item &&
          typeof item === 'object' &&
          item.id &&
          typeof item.jour === 'string' &&
          typeof item.heureDebut === 'string'
        );
      }
      console.log('✅ Créneaux chargés:', slotsArray.length, 'créneaux');
      setTimeSlots(slotsArray);
    } catch (error) {
      console.error('❌ Erreur chargement créneaux:', error);
      setTimeSlots([]); // Définir un tableau vide en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      console.log('🆕 Création du créneau:', formData);
      const response = await medecinService.createTimeSlot(formData);
      console.log('✅ Créneau créé:', response.data);

      // Vérifier si la réponse contient une erreur
      if (response.data?.error || response.data?.statusCode) {
        throw new Error(response.data?.message || 'Erreur lors de la création');
      }

      await loadTimeSlots();
      setShowCreateModal(false);
      setFormData({ jour: 'LUNDI', heureDebut: '09:00', heureFin: '09:30', isAvailable: true });
    } catch (error) {
      console.error('❌ Erreur création créneau:', error);

      // Déterminer le message d'erreur approprié
      let errorMsg = '';
      if (error.response?.data?.message) {
        errorMsg = Array.isArray(error.response.data.message)
          ? error.response.data.message.join(', ')
          : String(error.response.data.message);
      } else if (error.message) {
        errorMsg = String(error.message);
      }
      const errorMsgLower = errorMsg.toLowerCase();

      // S'assurer que le message d'erreur est une chaîne
      let finalErrorMessage = '';
      if (errorMsgLower.includes('unique') || errorMsgLower.includes('already exists') || errorMsgLower.includes('existe déjà')) {
        const translated = t('medecin.creneaux.errorModal.duplicate');
        finalErrorMessage = typeof translated === 'string' ? translated : 'Ce créneau existe déjà pour ce jour et cette heure.';
      } else if (errorMsgLower.includes('chevauche') || errorMsgLower.includes('overlap')) {
        const translated = t('medecin.creneaux.errorModal.overlap');
        finalErrorMessage = typeof translated === 'string' ? translated : 'Ce créneau chevauche un créneau existant.';
      } else {
        const translated = t('medecin.creneaux.errorModal.default');
        finalErrorMessage = typeof translated === 'string' ? translated : 'Une erreur est survenue lors de la création du créneau.';
      }

      setErrorMessage(finalErrorMessage);
      setShowErrorModal(true);
    }
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!slotToDelete) return;

    try {
      await medecinService.deleteTimeSlot(slotToDelete.id);
      await loadTimeSlots();
      setShowDeleteModal(false);
      setSlotToDelete(null);
    } catch (error) {
      console.error('Erreur suppression créneau:', error);
      setShowDeleteModal(false);
      setSlotToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSlotToDelete(null);
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await medecinService.updateTimeSlot(id, { isAvailable: !currentStatus });
      loadTimeSlots();
    } catch (error) {
      console.error('Erreur modification disponibilité:', error);
    }
  };

  // Grouper les créneaux par jour
  const timeSlotsByDay = jours.map(jour => ({
    jour: jour.value,
    label: jour.label,
    slots: timeSlots.filter(slot => slot.jour === jour.value).sort((a, b) => a.heureDebut.localeCompare(b.heureDebut)),
  }));

  // Statistiques
  const stats = {
    total: timeSlots.length,
    actifs: timeSlots.filter(s => s.isAvailable).length,
    inactifs: timeSlots.filter(s => !s.isAvailable).length,
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
        {/* Blobs animés */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-2xl mb-4">
                      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{t('medecin.creneaux.badge')}</span>
                    </div>

                    {/* Titre avec icône */}
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {t('medecin.creneaux.title')}
                      </h1>
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce-slow">
                        <ClockIcon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    <p className="text-base text-gray-600 dark:text-gray-400 font-medium">
                      {t('medecin.creneaux.subtitle')}
                    </p>
                  </div>

                  {/* Bouton créer */}
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <PlusIcon className="w-5 h-5" />
                    {t('medecin.creneaux.newSlot')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Cartes statistiques */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <ClockIcon className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.creneaux.stats.total')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.total}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.creneaux.stats.totalLabel')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:rotate-1 transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <CheckCircleIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.creneaux.stats.active')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.actifs}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.creneaux.stats.activeLabel')}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-105 hover:-rotate-1 transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4 animate-pulse-soft">
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('medecin.creneaux.stats.inactive')}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stats.inactifs}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{t('medecin.creneaux.stats.inactiveLabel')}</p>
            </div>
          </div>

          {/* Liste des créneaux par jour */}
          {timeSlots.length === 0 ? (
            /* État vide global - quand aucun créneau n'existe */
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-lg text-center animate-scale-in">
              <div className="max-w-md mx-auto">
                {/* Illustration */}
                <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce-slow">
                  <ClockIcon className="w-16 h-16 text-primary-500 dark:text-primary-400" />
                </div>

                {/* Message principal */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('medecin.creneaux.empty.title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                  {t('medecin.creneaux.empty.message')}
                </p>

                {/* Call to action */}
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <PlusIcon className="w-6 h-6" />
                  {t('medecin.creneaux.empty.button')}
                </button>

                {/* Aide */}
                <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-400 font-semibold mb-2">
                    💡 {t('medecin.creneaux.empty.tip')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {t('medecin.creneaux.empty.tipMessage')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Liste par jour - quand au moins un créneau existe */
            <div className="space-y-4">
              {timeSlotsByDay.map((dayData, index) => (
                <div
                  key={dayData.jour}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md animate-slide-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{dayData.label}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({dayData.slots.length} {dayData.slots.length > 1 ? t('medecin.creneaux.slotsList.dayLabelPlural') : t('medecin.creneaux.slotsList.dayLabel')})
                    </span>
                  </div>

                  {dayData.slots.length > 0 ? (
                    <div className="grid grid-cols-4 gap-3">
                      {dayData.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                            slot.isAvailable
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ClockIcon className={`w-4 h-4 ${slot.isAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                              <span className={`text-sm font-bold ${slot.isAvailable ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {typeof slot.heureDebut === 'string' ? slot.heureDebut : ''} - {typeof slot.heureFin === 'string' ? slot.heureFin : ''}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleAvailability(slot.id, slot.isAvailable)}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                slot.isAvailable
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-gray-400 hover:bg-gray-500 text-white'
                              }`}
                            >
                              {slot.isAvailable ? safeT('medecin.creneaux.buttons.active', 'Actif') : safeT('medecin.creneaux.buttons.inactive', 'Inactif')}
                            </button>
                            <button
                              onClick={() => handleDeleteClick(slot)}
                              className="p-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-all duration-300"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 dark:text-gray-500 text-sm italic py-4">{t('medecin.creneaux.slotsList.noSlots')}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Erreur */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setShowErrorModal(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in overflow-hidden">
            {/* Effet décoratif d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Contenu du modal */}
            <div className="relative z-10">
              {/* Icône d'erreur */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
                  <ExclamationTriangleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                {t('medecin.creneaux.errorModal.title')}
              </h2>

              {/* Message d'erreur */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 mb-6 border-2 border-red-200 dark:border-red-800">
                <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                  {typeof errorMessage === 'string' ? errorMessage : 'Une erreur est survenue'}
                </p>
              </div>

              {/* Suggestions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-bold text-blue-700 dark:text-blue-400 mb-2">
                  💡 {t('medecin.creneaux.errorModal.solutions')}
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• {t('medecin.creneaux.errorModal.solution1')}</li>
                  <li>• {t('medecin.creneaux.errorModal.solution2')}</li>
                  <li>• {t('medecin.creneaux.errorModal.solution3')}</li>
                </ul>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {t('medecin.creneaux.errorModal.understood')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmation Suppression */}
      {showDeleteModal && slotToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={cancelDelete}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in overflow-hidden">
            {/* Effet décoratif d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Contenu du modal */}
            <div className="relative z-10">
              {/* Icône d'avertissement */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center animate-pulse">
                  <TrashIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
              </div>

              {/* Titre */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                {t('medecin.creneaux.deleteModal.title')}
              </h2>

              {/* Message */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-center mb-4">
                  {t('medecin.creneaux.deleteModal.message')}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {typeof slotToDelete.jour === 'string' ? slotToDelete.jour : ''}
                      </p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {typeof slotToDelete.heureDebut === 'string' ? slotToDelete.heureDebut : ''} - {typeof slotToDelete.heureFin === 'string' ? slotToDelete.heureFin : ''}
                      </p>
                    </div>
                    <ClockIcon className="w-8 h-8 text-red-500" />
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 mb-6 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-400 text-center">
                  ⚠️ {t('medecin.creneaux.deleteModal.warning')}
                </p>
              </div>

              {/* Boutons */}
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {t('medecin.creneaux.deleteModal.cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {t('medecin.creneaux.deleteModal.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setShowCreateModal(false)}
          ></div>

          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <PlusIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {t('medecin.creneaux.createModal.title')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('medecin.creneaux.createModal.subtitle')}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreate} className="relative z-10 space-y-6">
              {/* Jour */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  <CalendarIcon className="w-5 h-5 text-primary-500" />
                  {t('medecin.creneaux.createModal.day')}
                </label>
                <select
                  required
                  value={formData.jour}
                  onChange={(e) => setFormData({ ...formData, jour: e.target.value })}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-white font-medium transition-all duration-300"
                >
                  {jours.map(jour => (
                    <option key={jour.value} value={jour.value}>{jour.label}</option>
                  ))}
                </select>
              </div>

              {/* Horaires */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    <ClockIcon className="w-5 h-5 text-secondary-500" />
                    {t('medecin.creneaux.createModal.startTime')}
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.heureDebut}
                    onChange={(e) => setFormData({ ...formData, heureDebut: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-white font-medium transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    <ClockIcon className="w-5 h-5 text-secondary-500" />
                    {t('medecin.creneaux.createModal.endTime')}
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.heureFin}
                    onChange={(e) => setFormData({ ...formData, heureFin: e.target.value })}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 text-gray-900 dark:text-white font-medium transition-all duration-300"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-8 py-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  {t('medecin.creneaux.createModal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-secondary-500 to-primary-500 hover:from-secondary-600 hover:to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  {t('medecin.creneaux.createModal.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MedecinLayout>
  );
};

export default MedecinCreneaux;
