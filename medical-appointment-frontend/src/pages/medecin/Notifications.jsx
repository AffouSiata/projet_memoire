import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import MedecinLayout from '../../components/layout/MedecinLayout';
import medecinService from '../../services/medecinService';
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
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';

const MedecinNotifications = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterType, setFilterType] = useState('ALL');

  // Safe translation helper
  const safeT = (key, fallback = '') => {
    const result = t(key);
    return typeof result === 'string' ? result : fallback;
  };
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await medecinService.getNotifications();

        // Map backend notifications to frontend format
        const mappedNotifications = response.data.notifications.map(notif => ({
          id: notif.id,
          type: mapBackendTypeToFrontend(notif.type),
          title: notif.titre,
          message: notif.message,
          date: new Date(notif.createdAt),
          read: notif.lue,
          priority: mapNotificationPriority(notif.type),
        }));

        setNotifications(mappedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Map backend notification types to frontend types
  const mapBackendTypeToFrontend = (backendType) => {
    const typeMap = {
      'RAPPEL': 'RDV',
      'CONFIRMATION': 'RDV',
      'ANNULATION': 'ANNULATION',
      'CHANGEMENT_HORAIRE': 'INFO',
      'RECOMMANDATION': 'INFO',
    };
    return typeMap[backendType] || 'INFO';
  };

  // Map notification type to priority
  const mapNotificationPriority = (type) => {
    const priorityMap = {
      'ANNULATION': 'high',
      'RAPPEL': 'normal',
      'CONFIRMATION': 'normal',
      'CHANGEMENT_HORAIRE': 'normal',
      'RECOMMANDATION': 'low',
    };
    return priorityMap[type] || 'normal';
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'RDV':
        return {
          icon: CalendarIcon,
          gradient: 'from-secondary-500 to-secondary-600',
          bg: 'bg-secondary-100',
          darkBg: 'dark:bg-secondary-900/30',
          text: 'text-secondary-600',
          darkText: 'dark:text-secondary-400',
          border: 'border-secondary-200',
          darkBorder: 'dark:border-secondary-800',
          label: safeT('medecin.notifications.type.appointment', 'Rendez-vous')
        };
      case 'ANNULATION':
        return {
          icon: XCircleIcon,
          gradient: 'from-red-500 to-red-600',
          bg: 'bg-red-100',
          darkBg: 'dark:bg-red-900/30',
          text: 'text-red-600',
          darkText: 'dark:text-red-400',
          border: 'border-red-200',
          darkBorder: 'dark:border-red-800',
          label: safeT('medecin.notifications.type.cancellation', 'Annulation')
        };
      case 'ALERTE':
        return {
          icon: ExclamationTriangleIcon,
          gradient: 'from-orange-500 to-orange-600',
          bg: 'bg-orange-100',
          darkBg: 'dark:bg-orange-900/30',
          text: 'text-orange-600',
          darkText: 'dark:text-orange-400',
          border: 'border-orange-200',
          darkBorder: 'dark:border-orange-800',
          label: safeT('medecin.notifications.type.alert', 'Alerte')
        };
      case 'INFO':
        return {
          icon: InformationCircleIcon,
          gradient: 'from-blue-500 to-blue-600',
          bg: 'bg-blue-100',
          darkBg: 'dark:bg-blue-900/30',
          text: 'text-blue-600',
          darkText: 'dark:text-blue-400',
          border: 'border-blue-200',
          darkBorder: 'dark:border-blue-800',
          label: safeT('medecin.notifications.type.info', 'Information')
        };
      default:
        return {
          icon: BellIcon,
          gradient: 'from-gray-500 to-gray-600',
          bg: 'bg-gray-100',
          darkBg: 'dark:bg-gray-900/30',
          text: 'text-gray-600',
          darkText: 'dark:text-gray-400',
          border: 'border-gray-200',
          darkBorder: 'dark:border-gray-800',
          label: safeT('medecin.notifications.type.notification', 'Notification')
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
        return { bg: 'bg-red-500', text: 'text-red-500', label: safeT('medecin.notifications.priority.urgent', 'Urgent'), pulse: true };
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-500', label: safeT('medecin.notifications.priority.important', 'Important'), pulse: false };
      case 'normal':
        return { bg: 'bg-blue-500', text: 'text-blue-500', label: safeT('medecin.notifications.priority.normal', 'Normal'), pulse: false };
      case 'low':
        return { bg: 'bg-gray-500', text: 'text-gray-500', label: safeT('medecin.notifications.priority.low', 'Faible'), pulse: false };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-500', label: safeT('medecin.notifications.priority.normal', 'Normal'), pulse: false };
    }
  };

  const filterTypes = [
    { value: 'ALL', label: safeT('medecin.notifications.filter.all', 'Toutes'), icon: BellIcon, count: notifications.length },
    { value: 'RDV', label: safeT('medecin.notifications.filter.appointments', 'Rendez-vous'), icon: CalendarIcon, count: notifications.filter(n => n.type === 'RDV').length },
    { value: 'ANNULATION', label: safeT('medecin.notifications.filter.cancellations', 'Annulations'), icon: XCircleIcon, count: notifications.filter(n => n.type === 'ANNULATION').length },
    { value: 'ALERTE', label: safeT('medecin.notifications.filter.alerts', 'Alertes'), icon: ExclamationTriangleIcon, count: notifications.filter(n => n.type === 'ALERTE').length },
    { value: 'INFO', label: safeT('medecin.notifications.filter.info', 'Infos'), icon: InformationCircleIcon, count: notifications.filter(n => n.type === 'INFO').length },
  ];

  const filteredNotifications = filterType === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = async (id) => {
    try {
      // Mark as read in backend
      await medecinService.markNotificationsAsRead([id]);

      // Update local state
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: !n.read } : n
      ));
    } catch (error) {
      console.error('Error toggling notification read status:', error);
    }
  };

  const deleteNotification = (id) => {
    // TODO: Implement backend delete endpoint
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length > 0) {
        await medecinService.markNotificationsAsRead(unreadIds);
        setNotifications(notifications.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter(n => !n.read));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return safeT('time.justNow', 'À l\'instant');
    if (seconds < 3600) return safeT('time.minutesAgo', 'Il y a {{minutes}} min').replace('{{minutes}}', Math.floor(seconds / 60));
    if (seconds < 86400) return safeT('time.hoursAgo', 'Il y a {{hours}}h').replace('{{hours}}', Math.floor(seconds / 3600));
    if (seconds < 172800) return safeT('time.yesterday', 'Hier');
    return safeT('time.daysAgo', 'Il y a {{days}} jours').replace('{{days}}', Math.floor(seconds / 86400));
  };

  return (
    <MedecinLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-400/20 dark:bg-secondary-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-400/20 dark:bg-secondary-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative group animate-scale-in">
            <div className="absolute inset-0 bg-secondary-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-lg opacity-75 animate-pulse-soft"></div>
                    <div className="relative w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
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
                      <h1 className="text-4xl font-bold text-secondary-500 dark:text-secondary-400">
                        {safeT('medecin.notifications.title', 'Notifications')}
                      </h1>
                      <SparklesIcon className="w-6 h-6 text-secondary-500 animate-pulse" />
                    </div>
                    <p className="text-slate-600 dark:text-white font-medium">
                      {safeT('medecin.notifications.subtitle', 'Centre de notifications médecin')}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex gap-3">
                  <div className="group/card relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{safeT('common.date', 'Date')}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {formatDate(currentTime, dateFormats.short)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group/card relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl px-5 py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all hover:scale-105">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center gap-3">
                      <ClockIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{safeT('common.time', 'Heure')}</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white font-mono">
                          {currentTime.toLocaleTimeString(i18n.language === 'ar' ? 'ar-SA' : i18n.language === 'en' ? 'en-US' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
              <div className="grid grid-cols-5 gap-3">
                {filterTypes.map((filter) => {
                  const FilterIcon = filter.icon;
                  const isActive = filterType === filter.value;

                  return (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value)}
                      className={`relative p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                        isActive
                          ? 'bg-secondary-500 text-white shadow-xl'
                          : 'bg-white/60 dark:bg-gray-700/50 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-gray-700 shadow-md'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-secondary-500 rounded-xl blur-lg opacity-50 animate-pulse-soft"></div>
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
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="w-5 h-5" />
              {safeT('medecin.notifications.markAllRead', 'Tout marquer comme lu')}
            </button>
            <button
              onClick={deleteAllRead}
              disabled={notifications.filter(n => n.read).length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrashIcon className="w-5 h-5" />
              {safeT('medecin.notifications.deleteRead', 'Supprimer les lues')} ({notifications.filter(n => n.read).length})
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="relative animate-scale-in">
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/50 dark:border-gray-700/50">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary-500 border-t-transparent mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{safeT('common.loading', 'Chargement...')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{safeT('medecin.notifications.loadingNotifications', 'Chargement des notifications')}</p>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="relative animate-scale-in">
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/50 dark:border-gray-700/50">
                  <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{safeT('medecin.notifications.noNotifications', 'Aucune notification')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{safeT('medecin.notifications.noNotificationsMessage', 'Vous n\'avez aucune notification pour le moment')}</p>
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
                    <div className={`absolute inset-0 bg-gradient-to-br ${typeStyle.gradient} opacity-0 group-hover/notif:opacity-10 rounded-2xl blur-xl transition-opacity`}></div>
                    <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 ${typeStyle.border} ${typeStyle.darkBorder} overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02] ${
                      !notification.read ? 'border-l-8' : ''
                    }`}>
                      <div className="flex gap-4 p-5">
                        {/* Icon */}
                        <div className={`w-14 h-14 ${typeStyle.bg} ${typeStyle.darkBg} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${typeStyle.gradient} opacity-0 group-hover/notif:opacity-20 rounded-xl transition-opacity`}></div>
                          <TypeIcon className={`w-7 h-7 ${typeStyle.text} ${typeStyle.darkText} relative z-10`} />
                          {priorityStyle.pulse && (
                            <div className={`absolute -top-1 -right-1 w-3 h-3 ${priorityStyle.bg} rounded-full animate-pulse`}></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-bold text-gray-900 dark:text-white">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse"></div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 ${typeStyle.bg} ${typeStyle.darkBg} ${typeStyle.text} ${typeStyle.darkText} rounded-full text-xs font-bold`}>
                                {typeStyle.label}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                <ClockIcon className="w-4 h-4" />
                                <span className="font-medium">{getTimeAgo(notification.date)}</span>
                              </div>
                              <span className={`px-2 py-1 ${priorityStyle.bg} bg-opacity-10 ${priorityStyle.text} rounded-lg text-xs font-bold`}>
                                {priorityStyle.label}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleRead(notification.id)}
                                className={`p-2 rounded-lg transition-all hover:scale-110 ${
                                  notification.read
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-900/50'
                                }`}
                                title={notification.read ? safeT('medecin.notifications.markUnread', 'Marquer comme non lu') : safeT('medecin.notifications.markRead', 'Marquer comme lu')}
                              >
                                {notification.read ? (
                                  <EyeSlashIcon className="w-5 h-5" />
                                ) : (
                                  <EyeIcon className="w-5 h-5" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all hover:scale-110"
                                title={safeT('common.delete', 'Supprimer')}
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
              })
            )}
          </div>
        </div>
      </div>
    </MedecinLayout>
  );
};

export default MedecinNotifications;
