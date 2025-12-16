import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PatientLayout from '../../components/layout/PatientLayout';
import {
  BellIcon,
  CalendarIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  TrashIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckBadgeIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';
import { useNotifications } from '../../context/NotificationContext';
import patientService from '../../services/patientService';

const PatientNotifications = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterType, setFilterType] = useState('ALL');
  const { notifications: contextNotifications, loadNotifications } = useNotifications();
  const [notifications, setNotifications] = useState([]);

  // Charger les notifications depuis le contexte
  useEffect(() => {
    setNotifications(contextNotifications || []);
  }, [contextNotifications]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTypeStyle = (type) => {
    switch (type) {
      case 'CONFIRMATION':
        return {
          icon: CheckCircleIcon,
          gradient: 'bg-blue-600',
          bg: 'bg-blue-100',
          darkBg: 'dark:bg-blue-900/30',
          text: 'text-blue-600',
          darkText: 'dark:text-blue-400',
          border: 'border-blue-200',
          darkBorder: 'dark:border-blue-800',
          label: 'Confirmation'
        };
      case 'ANNULATION':
        return {
          icon: XCircleIcon,
          gradient: 'bg-red-600',
          bg: 'bg-red-100',
          darkBg: 'dark:bg-red-900/30',
          text: 'text-red-600',
          darkText: 'dark:text-red-400',
          border: 'border-red-200',
          darkBorder: 'dark:border-red-800',
          label: 'Annulation'
        };
      case 'RAPPEL':
        return {
          icon: ExclamationTriangleIcon,
          gradient: 'bg-orange-600',
          bg: 'bg-orange-100',
          darkBg: 'dark:bg-orange-900/30',
          text: 'text-orange-600',
          darkText: 'dark:text-orange-400',
          border: 'border-orange-200',
          darkBorder: 'dark:border-orange-800',
          label: 'Rappel'
        };
      case 'CHANGEMENT_HORAIRE':
        return {
          icon: ClockIcon,
          gradient: 'bg-amber-600',
          bg: 'bg-amber-100',
          darkBg: 'dark:bg-amber-900/30',
          text: 'text-amber-600',
          darkText: 'dark:text-amber-400',
          border: 'border-amber-200',
          darkBorder: 'dark:border-amber-800',
          label: 'Changement'
        };
      case 'RECOMMANDATION':
        return {
          icon: InformationCircleIcon,
          gradient: 'bg-blue-600',
          bg: 'bg-blue-100',
          darkBg: 'dark:bg-blue-950/30',
          text: 'text-blue-700',
          darkText: 'dark:text-blue-400',
          border: 'border-blue-200',
          darkBorder: 'dark:border-blue-900',
          label: 'Information'
        };
      default:
        return {
          icon: BellIcon,
          gradient: 'bg-gray-600',
          bg: 'bg-gray-100',
          darkBg: 'dark:bg-gray-900/30',
          text: 'text-gray-600',
          darkText: 'dark:text-gray-400',
          border: 'border-gray-200',
          darkBorder: 'dark:border-gray-800',
          label: 'Notification'
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
        return { bg: 'bg-red-500', text: 'text-red-500', label: 'Urgent', pulse: true };
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-500', label: 'Important', pulse: false };
      case 'normal':
        return { bg: 'bg-blue-500', text: 'text-blue-500', label: 'Normal', pulse: false };
      case 'low':
        return { bg: 'bg-gray-500', text: 'text-gray-500', label: 'Faible', pulse: false };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-500', label: 'Normal', pulse: false };
    }
  };

  const filterTypes = [
    { value: 'ALL', label: 'Toutes', icon: BellIcon, count: notifications.length },
    { value: 'CONFIRMATION', label: 'Confirmations', icon: CheckCircleIcon, count: notifications.filter(n => n.type === 'CONFIRMATION').length },
    { value: 'ANNULATION', label: 'Annulations', icon: XCircleIcon, count: notifications.filter(n => n.type === 'ANNULATION').length },
    { value: 'RAPPEL', label: 'Rappels', icon: ExclamationTriangleIcon, count: notifications.filter(n => n.type === 'RAPPEL').length },
    { value: 'RECOMMANDATION', label: 'Infos', icon: InformationCircleIcon, count: notifications.filter(n => n.type === 'RECOMMANDATION').length },
  ];

  const filteredNotifications = filterType === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.lue).length;

  const toggleRead = async (id) => {
    try {
      await patientService.markAsRead([id]);
      await loadNotifications();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const deleteNotification = async (id) => {
    // Note: L'API ne supporte pas la suppression pour l'instant
    // On pourrait l'ajouter plus tard si nécessaire
    console.log('Suppression non implémentée dans l\'API');
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.lue).map(n => n.id);
      if (unreadIds.length > 0) {
        await patientService.markAsRead(unreadIds);
        await loadNotifications();
      }
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
    }
  };

  const deleteAllRead = () => {
    // Note: L'API ne supporte pas la suppression pour l'instant
    console.log('Suppression non implémentée dans l\'API');
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    if (seconds < 172800) return 'Hier';
    return `Il y a ${Math.floor(seconds / 86400)} jours`;
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-8">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative group animate-scale-in">
            <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-75 animate-pulse-soft"></div>
                    <div className="relative w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <BellIcon className="w-8 h-8 text-white" />
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 animate-pulse">
                          <span className="text-xs font-bold text-white">{unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-4xl font-bold text-blue-500 dark:text-blue-400">
                        Notifications
                      </h1>
                      <SparklesIcon className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-slate-600 dark:text-white font-medium">
                      Vos notifications personnelles
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex gap-3">
                  <div className="group/card relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105">
                    <div className="absolute inset-0 bg-blue-700/10 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Date</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatDate(currentTime, dateFormats.short)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group/card relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105">
                    <div className="absolute inset-0 bg-blue-700/10 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Heure</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                          {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="relative animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-4 border border-white/50 dark:border-gray-700/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {filterTypes.map((filter) => {
                  const FilterIcon = filter.icon;
                  const isActive = filterType === filter.value;

                  return (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value)}
                      className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-xl'
                          : 'bg-white/60 dark:bg-gray-700/50 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-gray-700 shadow-md'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-50 animate-pulse-soft"></div>
                      )}
                      <div className="relative flex flex-col items-center gap-2">
                        <FilterIcon className="w-6 h-6" />
                        <span className="text-sm font-bold">{filter.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
                        }`}>
                          {filter.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="relative animate-slide-up flex gap-3" style={{ animationDelay: '200ms' }}>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="w-5 h-5" />
              Tout marquer comme lu
            </button>
            <button
              onClick={deleteAllRead}
              disabled={notifications.filter(n => n.lue).length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="w-5 h-5" />
              Supprimer les lues ({notifications.filter(n => n.lue).length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="relative animate-scale-in">
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/50 dark:border-gray-700/50">
                  <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune notification</h3>
                  <p className="text-gray-600 dark:text-gray-400">Vous n'avez aucune notification pour le moment</p>
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => {
                const typeStyle = getTypeStyle(notification.type);
                const TypeIcon = typeStyle.icon;
                const priorityStyle = getPriorityStyle(notification.priority);

                return (
                  <div
                    key={notification.id}
                    className="relative group/notif animate-scale-in"
                    style={{ animationDelay: `${(index + 3) * 50}ms` }}
                  >
                    <div className={`absolute inset-0 ${typeStyle.gradient} opacity-0 group-hover/notif:opacity-10 rounded-2xl blur-xl transition-opacity`}></div>
                    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 ${typeStyle.border} ${typeStyle.darkBorder} overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
                      !notification.lue ? 'border-l-8' : ''
                    }`}>
                      <div className="flex gap-4 p-5">
                        {/* Icon */}
                        <div className={`w-14 h-14 ${typeStyle.bg} ${typeStyle.darkBg} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
                          <div className={`absolute inset-0 ${typeStyle.gradient} opacity-0 group-hover/notif:opacity-20 rounded-xl transition-opacity`}></div>
                          <TypeIcon className={`w-7 h-7 ${typeStyle.text} ${typeStyle.darkText} relative z-10`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900 dark:text-white">{notification.titre}</h3>
                              {!notification.lue && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 ${typeStyle.bg} ${typeStyle.darkBg} ${typeStyle.text} ${typeStyle.darkText} rounded-full text-xs font-bold`}>
                                {typeStyle.label}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {notification.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <ClockIcon className="w-4 h-4" />
                                <span className="font-medium">{getTimeAgo(new Date(notification.createdAt))}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleRead(notification.id)}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                                  notification.lue
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    : 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-950/50'
                                }`}
                                title={notification.lue ? 'Marquer comme non lu' : 'Marquer comme lu'}
                              >
                                {notification.lue ? (
                                  <CheckCircleIcon className="w-5 h-5" />
                                ) : (
                                  <EyeIcon className="w-5 h-5" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientNotifications;
