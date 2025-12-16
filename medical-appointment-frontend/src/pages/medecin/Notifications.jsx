import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MedecinLayout from '../../components/layout/MedecinLayout';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';
import {
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  HeartIcon,
  FunnelIcon,
  CheckIcon,
  TrashIcon,
  BellAlertIcon,
  SparklesIcon,
  FireIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';

const MedecinNotifications = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();

  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('TOUS');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      // Pour l'instant, créons des notifications fictives car l'API n'est pas encore connectée
      const mockNotifications = [
        {
          id: 1,
          type: 'CONFIRMATION',
          titre: 'Nouveau rendez-vous confirmé',
          message: 'Marie Yao a confirmé son rendez-vous du 18 nov. à 14:00',
          lue: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'RAPPEL',
          titre: 'Rappel de rendez-vous',
          message: 'Rendez-vous avec Kouassi Bamba demain à 10:00',
          lue: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 3,
          type: 'ANNULATION',
          titre: 'Rendez-vous annulé',
          message: 'Fatou Diallo a annulé son rendez-vous du 20 nov.',
          lue: true,
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 4,
          type: 'CHANGEMENT_HORAIRE',
          titre: 'Demande de modification',
          message: 'Jean Kouadio souhaite modifier son rendez-vous',
          lue: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 5,
          type: 'RECOMMANDATION',
          titre: 'Suivi patient recommandé',
          message: 'Il est temps de contacter vos patients inactifs',
          lue: true,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 6,
          type: 'CONFIRMATION',
          titre: 'Rendez-vous confirmé',
          message: 'Sophie Kone a confirmé son rendez-vous du 19 nov. à 09:30',
          lue: false,
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
        {
          id: 7,
          type: 'RAPPEL',
          titre: 'Consultation de suivi',
          message: 'N\'oubliez pas la consultation de suivi avec Michel Traore aujourd\'hui',
          lue: true,
          createdAt: new Date(Date.now() - 345600000).toISOString(),
        },
        {
          id: 8,
          type: 'CHANGEMENT_HORAIRE',
          titre: 'Changement d\'horaire demandé',
          message: 'Aminata Diop souhaite décaler son rendez-vous à 15h',
          lue: false,
          createdAt: new Date(Date.now() - 432000000).toISOString(),
        },
        {
          id: 9,
          type: 'ANNULATION',
          titre: 'Annulation de dernière minute',
          message: 'Yao Kofi a annulé son rendez-vous prévu pour demain',
          lue: true,
          createdAt: new Date(Date.now() - 518400000).toISOString(),
        },
        {
          id: 10,
          type: 'CONFIRMATION',
          titre: 'Nouveau patient inscrit',
          message: 'Ibrahim Touré a pris rendez-vous pour le 22 nov. à 11:00',
          lue: false,
          createdAt: new Date(Date.now() - 604800000).toISOString(),
        },
        {
          id: 11,
          type: 'RECOMMANDATION',
          titre: 'Résultats d\'examens disponibles',
          message: 'Les résultats d\'examens de 3 patients sont maintenant disponibles',
          lue: true,
          createdAt: new Date(Date.now() - 691200000).toISOString(),
        },
        {
          id: 12,
          type: 'RAPPEL',
          titre: 'Rendez-vous cette semaine',
          message: 'Vous avez 8 rendez-vous programmés cette semaine',
          lue: true,
          createdAt: new Date(Date.now() - 777600000).toISOString(),
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'TOUS') return true;
    if (filter === 'NON_LUES') return !notif.lue;
    return notif.type === filter;
  });

  // Statistiques
  const stats = {
    total: notifications.length,
    nonLues: notifications.filter(n => !n.lue).length,
    rappels: notifications.filter(n => n.type === 'RAPPEL').length,
    confirmations: notifications.filter(n => n.type === 'CONFIRMATION').length,
    annulations: notifications.filter(n => n.type === 'ANNULATION').length,
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcul des notifications aujourd'hui
  const todayCount = notifications.filter(n => {
    const notifDate = new Date(n.createdAt);
    const today = new Date();
    return notifDate.toDateString() === today.toDateString();
  }).length;

  // Marquer comme lu
  const handleMarkAsRead = (notifId) => {
    setNotifications(notifications.map(n =>
      n.id === notifId ? { ...n, lue: true } : n
    ));
  };

  // Marquer tout comme lu
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, lue: true })));
  };

  // Supprimer une notification
  const handleDelete = (notifId) => {
    setNotifications(notifications.filter(n => n.id !== notifId));
  };

  // Icône par type avec gradient pour version patient
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'RAPPEL':
        return { icon: CalendarIcon, gradient: 'primary-500' };
      case 'CONFIRMATION':
        return { icon: CheckCircleIcon, gradient: 'secondary-500' };
      case 'ANNULATION':
        return { icon: XCircleIcon, gradient: 'red-500' };
      case 'CHANGEMENT_HORAIRE':
        return { icon: ExclamationTriangleIcon, gradient: 'primary-500' };
      case 'RECOMMANDATION':
        return { icon: HeartIcon, gradient: 'secondary-500' };
      default:
        return { icon: BellIcon, gradient: 'secondary-500' };
    }
  };

  // Fonction de formatage de date (comme dans version patient)
  const formatDateNotif = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return t('medecin.notifications.timeAgo.justNow');
    if (diffInHours < 24) return t('medecin.notifications.timeAgo.hoursAgo', { hours: diffInHours });
    if (diffInHours < 48) return t('medecin.notifications.timeAgo.yesterday');
    return formatDate(date, dateFormats.short);
  };

  // Calcul de la pagination (comme dans version patient)
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  // Reset de la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (isLoading) {
    return (
      <MedecinLayout>
        <div className="flex items-center justify-center min-h-screen bg-[#F7F9FC] dark:bg-gray-900">
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
          {/* Header Ultra-Moderne - Style Dashboard exact */}
          <div className="mb-8 animate-slide-up">
            {/* Carte principale du header avec glassmorphism */}
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs d'arrière-plan */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge "Notifications" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-50 rounded-full mb-4">
                      <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-secondary-700 uppercase tracking-wider">{t('medecin.notifications.badge')}</span>
                    </div>

                    {/* Titre principal avec animation */}
                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      {t('medecin.notifications.title')} {t('medecin.notifications.emoji')}
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-white mb-6 font-medium">
                      {t('medecin.notifications.subtitle')}
                    </p>

                    {/* Informations dans des mini-cartes - Style Dashboard */}
                    <div className="flex items-center gap-4">
                      {/* Carte Total */}
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-xl flex items-center justify-center">
                          <BellIconSolid className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.notifications.stats.totalLabel')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {stats.total} {stats.total > 1 ? t('medecin.notifications.stats.totalPlural') : t('medecin.notifications.stats.totalSingular')}
                          </p>
                        </div>
                      </div>

                      {/* Carte Non lues */}
                      <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                          <BellAlertIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.notifications.stats.unreadLabel')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {stats.nonLues} {stats.nonLues > 1 ? t('medecin.notifications.stats.unreadPlural') : t('medecin.notifications.stats.unreadSingular')}
                          </p>
                        </div>
                      </div>

                      {/* Carte Aujourd'hui */}
                      {todayCount > 0 && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-700/60 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
                            <ClockIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.notifications.stats.todayLabel')}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {todayCount} {todayCount > 1 ? t('medecin.notifications.stats.totalPlural') : t('medecin.notifications.stats.totalSingular')}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section droite - Bouton Tout marquer comme lu */}
                  {stats.nonLues > 0 && (
                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={handleMarkAllAsRead}
                        className="relative group"
                      >
                        {/* Effet glow */}
                        <div className="absolute inset-0 bg-secondary-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                        {/* Bouton principal */}
                        <div className="relative flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 rounded-2xl border-2 border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-xl hover:border-secondary-200 dark:hover:border-secondary-600 transition-all duration-300 hover:scale-105">
                          <div className="relative">
                            <EnvelopeOpenIcon className="w-6 h-6 text-gray-600 dark:text-white group-hover:text-secondary-600 transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.notifications.quickAction')}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{t('medecin.notifications.markAllAsRead')}</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filtres Ultra-Modernes */}
          <div className="mb-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            {/* Carte conteneur avec glassmorphism */}
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50">
              {/* Effet décoratif d'arrière-plan */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 opacity-50"></div>

              {/* Contenu */}
              <div className="relative z-10">
                {/* Titre avec icône et gradient */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FunnelIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {t('medecin.notifications.filterTitle')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('medecin.notifications.filterSubtitle')}
                    </p>
                  </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3">
                  {/* Filtre TOUS */}
                  <button
                    onClick={() => setFilter('TOUS')}
                    className="relative group flex-shrink-0"
                    style={{ animationDelay: '0.1s' }}
                  >
                    {/* Effet glow au survol */}
                    {filter === 'TOUS' && (
                      <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    )}

                    {/* Bouton principal */}
                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-105 flex items-center gap-2.5 ${
                      filter === 'TOUS'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}>
                      {/* Icône avec animation */}
                      <div className={`${filter === 'TOUS' ? 'animate-pulse' : ''}`}>
                        <BellIcon className={`w-5 h-5 transition-all duration-300 ${
                          filter === 'TOUS'
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-secondary-600 group-hover:scale-110'
                        }`} />
                      </div>

                      {/* Label */}
                      <span className="whitespace-nowrap">{t('medecin.notifications.filters.all')}</span>

                      {/* Badge compteur avec animation */}
                      <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === 'TOUS'
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 group-hover:scale-110'
                      }`}>
                        {stats.total}
                        {/* Point animé pour les filtres actifs */}
                        {filter === 'TOUS' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>

                      {/* Shine effect au survol */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    </div>
                  </button>

                  {/* Filtre NON_LUES */}
                  <button
                    onClick={() => setFilter('NON_LUES')}
                    className="relative group flex-shrink-0"
                    style={{ animationDelay: '0.15s' }}
                  >
                    {filter === 'NON_LUES' && (
                      <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    )}
                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-105 flex items-center gap-2.5 ${
                      filter === 'NON_LUES'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}>
                      <div className={`${filter === 'NON_LUES' ? 'animate-pulse' : ''}`}>
                        <BellAlertIcon className={`w-5 h-5 transition-all duration-300 ${
                          filter === 'NON_LUES'
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-secondary-600 group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="whitespace-nowrap">{t('medecin.notifications.filters.unread')}</span>
                      <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === 'NON_LUES'
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 group-hover:scale-110'
                      }`}>
                        {stats.nonLues}
                        {filter === 'NON_LUES' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    </div>
                  </button>

                  {/* Filtre RAPPEL */}
                  <button
                    onClick={() => setFilter('RAPPEL')}
                    className="relative group flex-shrink-0"
                    style={{ animationDelay: '0.2s' }}
                  >
                    {filter === 'RAPPEL' && (
                      <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    )}
                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-105 flex items-center gap-2.5 ${
                      filter === 'RAPPEL'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}>
                      <div className={`${filter === 'RAPPEL' ? 'animate-pulse' : ''}`}>
                        <CalendarIcon className={`w-5 h-5 transition-all duration-300 ${
                          filter === 'RAPPEL'
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-secondary-600 group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="whitespace-nowrap">{t('medecin.notifications.filters.reminder')}</span>
                      <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === 'RAPPEL'
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 group-hover:scale-110'
                      }`}>
                        {stats.rappels}
                        {filter === 'RAPPEL' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    </div>
                  </button>

                  {/* Filtre CONFIRMATION */}
                  <button
                    onClick={() => setFilter('CONFIRMATION')}
                    className="relative group flex-shrink-0"
                    style={{ animationDelay: '0.25s' }}
                  >
                    {filter === 'CONFIRMATION' && (
                      <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    )}
                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-105 flex items-center gap-2.5 ${
                      filter === 'CONFIRMATION'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}>
                      <div className={`${filter === 'CONFIRMATION' ? 'animate-pulse' : ''}`}>
                        <CheckCircleIcon className={`w-5 h-5 transition-all duration-300 ${
                          filter === 'CONFIRMATION'
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-secondary-600 group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="whitespace-nowrap">{t('medecin.notifications.filters.confirmation')}</span>
                      <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === 'CONFIRMATION'
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 group-hover:scale-110'
                      }`}>
                        {stats.confirmations}
                        {filter === 'CONFIRMATION' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    </div>
                  </button>

                  {/* Filtre ANNULATION */}
                  <button
                    onClick={() => setFilter('ANNULATION')}
                    className="relative group flex-shrink-0"
                    style={{ animationDelay: '0.3s' }}
                  >
                    {filter === 'ANNULATION' && (
                      <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    )}
                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-105 flex items-center gap-2.5 ${
                      filter === 'ANNULATION'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}>
                      <div className={`${filter === 'ANNULATION' ? 'animate-pulse' : ''}`}>
                        <XCircleIcon className={`w-5 h-5 transition-all duration-300 ${
                          filter === 'ANNULATION'
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-secondary-600 group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="whitespace-nowrap">{t('medecin.notifications.filters.cancellation')}</span>
                      <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === 'ANNULATION'
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 group-hover:scale-110'
                      }`}>
                        {stats.annulations}
                        {filter === 'ANNULATION' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    </div>
                  </button>

                  {/* Filtre RECOMMANDATION */}
                  <button
                    onClick={() => setFilter('RECOMMANDATION')}
                    className="relative group flex-shrink-0"
                    style={{ animationDelay: '0.35s' }}
                  >
                    {filter === 'RECOMMANDATION' && (
                      <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    )}
                    <div className={`relative px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group-hover:scale-105 flex items-center gap-2.5 ${
                      filter === 'RECOMMANDATION'
                        ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                        : 'bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white hover:shadow-md border border-gray-200 dark:border-gray-600 hover:border-secondary-300 dark:hover:border-secondary-600'
                    }`}>
                      <div className={`${filter === 'RECOMMANDATION' ? 'animate-pulse' : ''}`}>
                        <HeartIcon className={`w-5 h-5 transition-all duration-300 ${
                          filter === 'RECOMMANDATION'
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-secondary-600 group-hover:scale-110'
                        }`} />
                      </div>
                      <span className="whitespace-nowrap">{t('medecin.notifications.filters.recommendation')}</span>
                      <div className={`relative px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                        filter === 'RECOMMANDATION'
                          ? 'bg-white/20 text-white'
                          : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-400 group-hover:scale-110'
                      }`}>
                        {notifications.filter(n => n.type === 'RECOMMANDATION').length}
                        {filter === 'RECOMMANDATION' && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-2xl"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Compteur */}
          <div className="mb-4 flex items-center gap-2 text-gray-600 dark:text-white animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <FireIcon className="w-5 h-5 text-secondary-500" />
            <span className="font-semibold">
              {filteredNotifications.length} {filteredNotifications.length > 1 ? t('medecin.notifications.resultsPlural') : t('medecin.notifications.resultsSingular')}
            </span>
          </div>

          {/* Liste des Notifications - Style Dashboard avec pagination */}
          {filteredNotifications.length === 0 ? (
            <div className="space-y-4">
              <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-16 text-center border border-white/20 dark:border-gray-700/50 shadow-xl animate-scale-in">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-secondary-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full flex items-center justify-center shadow-xl">
                    <BellIcon className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('medecin.notifications.empty.title')}
                </h3>
                <p className="text-gray-600 dark:text-white">
                  {t('medecin.notifications.empty.message')}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedNotifications.map((notif, index) => {
                  const iconData = getNotificationIcon(notif.type);
                  const NotificationIcon = iconData.icon;
                  return (
                    <div
                      key={notif.id}
                      className="relative group animate-slide-up"
                      style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                    >
                      <div className={`relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border ${
                        !notif.lue
                          ? 'border-l-4 border-l-secondary-500 border-t border-r border-b border-white/20 dark:border-gray-700/50'
                          : 'border border-white/20 dark:border-gray-700/50'
                      }`}>
                        <div className="flex items-start gap-5">
                          {/* Icon */}
                          <div className="relative flex-shrink-0">
                            <div className={`w-14 h-14 bg-${iconData.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <NotificationIcon className="w-7 h-7 text-white" />
                            </div>
                            {!notif.lue && (
                              <div className={`absolute inset-0 bg-${iconData.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {notif.titre}
                                  </h3>
                                  {!notif.lue && (
                                    <span className="px-2.5 py-1 bg-secondary-100 dark:bg-secondary-900/30 rounded-full text-xs font-bold text-secondary-700 dark:text-secondary-400">
                                      {t('medecin.notifications.notification.new')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <ClockIcon className="w-4 h-4" />
                                  <span className="font-medium">{formatDateNotif(notif.createdAt)}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                {!notif.lue && (
                                  <button
                                    onClick={() => handleMarkAsRead(notif.id)}
                                    className="p-2.5 rounded-xl bg-secondary-500 text-white hover:bg-secondary-600 hover:scale-110 transition-all shadow-md"
                                    title={t('medecin.notifications.notification.markAsRead')}
                                  >
                                    <CheckIcon className="w-5 h-5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(notif.id)}
                                  className="p-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 hover:scale-110 transition-all shadow-md"
                                  title={t('medecin.notifications.notification.delete')}
                                >
                                  <TrashIcon className="w-5 h-5" />
                                </button>
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
                    {t('medecin.notifications.pagination.showing')} <span className="font-bold">{startIndex + 1}</span> {t('medecin.notifications.pagination.to')} <span className="font-bold">{Math.min(endIndex, filteredNotifications.length)}</span> {t('medecin.notifications.pagination.of')} <span className="font-bold">{filteredNotifications.length}</span>
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
                      {t('medecin.notifications.pagination.previous')}
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
                      {t('medecin.notifications.pagination.next')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer Stats - Style Dashboard */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-5 border border-white/20 dark:border-gray-700/50 shadow-lg animate-slide-up">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/50 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.notifications.stats_display')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {filteredNotifications.length} {filteredNotifications.length > 1 ? t('medecin.notifications.stats.totalPlural') : t('medecin.notifications.stats.totalSingular')}
                    </p>
                  </div>
                </div>
                {stats.nonLues > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                      <BellAlertIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-white font-medium">{t('medecin.notifications.stats.unreadLabel')}</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {stats.nonLues} {stats.nonLues > 1 ? t('medecin.notifications.stats_remainingPlural') : t('medecin.notifications.stats_remaining')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MedecinLayout>
  );
};

export default MedecinNotifications;
