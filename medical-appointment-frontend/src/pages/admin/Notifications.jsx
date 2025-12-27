import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';
import AdminLayout from '../../components/layout/AdminLayout';
import adminService from '../../services/adminService';
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
} from '@heroicons/react/24/outline';
import { useDateFormatter, dateFormats } from '../../hooks/useDateFormatter';

const AdminNotifications = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormatter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filterType, setFilterType] = useState('ALL');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les notifications depuis l'API
  useEffect(() => {
    loadNotifications();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getNotifications();
      if (response.data?.data && Array.isArray(response.data.data)) {
        const mappedNotifications = response.data.data.map(notif => ({
          id: notif.id,
          type: mapNotificationType(notif.type),
          title: notif.titre,
          message: notif.description,
          date: new Date(notif.createdAt),
          read: notif.lue,
          priority: 'normal', // Le backend n'a pas de champ priority pour l'instant
        }));
        setNotifications(mappedNotifications);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mapper les types de notifications du backend vers les types du frontend
  const mapNotificationType = (backendType) => {
    const typeMap = {
      'CONFIRMATION': 'RDV',
      'ANNULATION': 'ANNULATION',
      'RAPPEL': 'INFO',
      'CHANGEMENT_HORAIRE': 'ALERTE',
      'RECOMMANDATION': 'INFO',
    };
    return typeMap[backendType] || 'INFO';
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'RDV':
        return {
          icon: CalendarIcon,
          gradient: 'bg-blue-700',
          bg: 'bg-blue-100',
          darkBg: 'dark:bg-blue-950/30',
          text: 'text-blue-700',
          darkText: 'dark:text-blue-400',
          border: 'border-blue-200',
          darkBorder: 'dark:border-blue-900',
          label: t('admin.notifications.types.appointment')
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
          label: t('admin.notifications.types.cancellation')
        };
      case 'ALERTE':
        return {
          icon: ExclamationTriangleIcon,
          gradient: 'bg-orange-600',
          bg: 'bg-orange-100',
          darkBg: 'dark:bg-orange-900/30',
          text: 'text-orange-600',
          darkText: 'dark:text-orange-400',
          border: 'border-orange-200',
          darkBorder: 'dark:border-orange-800',
          label: t('admin.notifications.types.alert')
        };
      case 'INFO':
        return {
          icon: InformationCircleIcon,
          gradient: 'bg-blue-700',
          bg: 'bg-blue-100',
          darkBg: 'dark:bg-blue-950/30',
          text: 'text-blue-700',
          darkText: 'dark:text-blue-400',
          border: 'border-blue-200',
          darkBorder: 'dark:border-blue-900',
          label: t('admin.notifications.types.info')
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
          label: t('admin.notifications.types.notification')
        };
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
        return { bg: 'bg-red-500', text: 'text-red-500', label: t('admin.notifications.priority.urgent'), pulse: true };
      case 'high':
        return { bg: 'bg-orange-500', text: 'text-orange-500', label: t('admin.notifications.priority.high'), pulse: false };
      case 'normal':
        return { bg: 'bg-blue-500', text: 'text-blue-500', label: t('admin.notifications.priority.normal'), pulse: false };
      case 'low':
        return { bg: 'bg-gray-500', text: 'text-gray-500', label: t('admin.notifications.priority.low'), pulse: false };
      default:
        return { bg: 'bg-gray-500', text: 'text-gray-500', label: t('admin.notifications.priority.normal'), pulse: false };
    }
  };

  const filterTypes = [
    { value: 'ALL', label: t('admin.notifications.filters.all'), icon: BellIcon, count: notifications.length },
    { value: 'RDV', label: t('admin.notifications.filters.appointments'), icon: CalendarIcon, count: notifications.filter(n => n.type === 'RDV').length },
    { value: 'ANNULATION', label: t('admin.notifications.filters.cancellations'), icon: XCircleIcon, count: notifications.filter(n => n.type === 'ANNULATION').length },
    { value: 'ALERTE', label: t('admin.notifications.filters.alerts'), icon: ExclamationTriangleIcon, count: notifications.filter(n => n.type === 'ALERTE').length },
    { value: 'INFO', label: t('admin.notifications.filters.info'), icon: InformationCircleIcon, count: notifications.filter(n => n.type === 'INFO').length },
  ];

  const filteredNotifications = filterType === 'ALL'
    ? notifications
    : notifications.filter(n => n.type === filterType);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = async (id) => {
    try {
      // Marquer comme lu/non lu dans l'API
      await adminService.markNotificationsAsRead([id]);
      // Mettre à jour l'état local
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: !n.read } : n
      ));
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const deleteNotification = (id) => {
    // Suppression locale uniquement (pas d'endpoint DELETE dans le backend)
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      if (unreadIds.length > 0) {
        await adminService.markNotificationsAsRead(unreadIds);
      }
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
    }
  };

  const deleteAllRead = () => {
    setNotifications(notifications.filter(n => !n.read));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return t('admin.notifications.timeAgo.justNow');
    if (seconds < 3600) return t('admin.notifications.timeAgo.minutesAgo', { minutes: Math.floor(seconds / 60) });
    if (seconds < 86400) return t('admin.notifications.timeAgo.hoursAgo', { hours: Math.floor(seconds / 3600) });
    if (seconds < 172800) return t('admin.notifications.timeAgo.yesterday');
    return t('admin.notifications.timeAgo.daysAgo', { days: Math.floor(seconds / 86400) });
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-4 md:p-8">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="relative group animate-scale-in">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/50 dark:border-gray-700/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-xl sm:rounded-2xl blur-lg opacity-75 animate-pulse-soft"></div>
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                      <BellIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 animate-pulse">
                          <span className="text-xs font-bold text-white">{unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 dark:text-blue-400">
                        {t('admin.notifications.title')}
                      </h1>
                      <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-white font-medium">
                      {t('admin.notifications.subtitle')}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="group/card relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="relative flex items-center gap-2 sm:gap-3">
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{t('dashboard.date')}</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                          {formatDate(currentTime, dateFormats.short)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="group/card relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl sm:rounded-2xl px-3 sm:px-5 py-2 sm:py-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="relative flex items-center gap-2 sm:gap-3">
                      <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 dark:text-blue-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:block">{t('dashboard.time')}</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white font-mono">
                          {currentTime.toLocaleTimeString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
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
          <div className="relative animate-slide-up flex flex-wrap gap-2 sm:gap-3" style={{ animationDelay: '200ms' }}>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('admin.notifications.actions.markAllRead')}</span>
              <span className="sm:hidden">Tout lu</span>
            </button>
            <button
              onClick={deleteAllRead}
              disabled={notifications.filter(n => n.read).length === 0}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t('admin.notifications.actions.deleteRead')}</span>
              <span className="sm:hidden">Suppr. lues</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="relative animate-scale-in">
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/50 dark:border-gray-700/50">
                  <BellIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('admin.notifications.noNotifications')}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t('admin.notifications.noNotificationsMessage')}</p>
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
                      !notification.read ? 'border-l-8' : ''
                    }`}>
                      <div className="flex gap-4 p-5">
                        {/* Icon */}
                        <div className={`w-14 h-14 ${typeStyle.bg} ${typeStyle.darkBg} rounded-xl flex items-center justify-center flex-shrink-0 relative`}>
                          <div className={`absolute inset-0 ${typeStyle.gradient} opacity-0 group-hover/notif:opacity-20 rounded-xl transition-opacity`}></div>
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
                                    : 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-950/50'
                                }`}
                                title={notification.read ? t('admin.notifications.actions.markAsUnread') : t('admin.notifications.actions.markAsRead')}
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
                                title={t('common.delete')}
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
    </AdminLayout>
  );
};

export default AdminNotifications;
