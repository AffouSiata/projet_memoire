import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, BellIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const NotificationToast = ({ notification, onDismiss }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Auto-dismiss après 5 secondes
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'CONFIRMATION':
        return <CheckCircleIcon className="w-6 h-6 text-blue-500" />;
      case 'ANNULATION':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      case 'CHANGEMENT_HORAIRE':
        return <ExclamationTriangleIcon className="w-6 h-6 text-orange-500" />;
      default:
        return <BellIcon className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'CONFIRMATION':
        return 'blue-600';
      case 'ANNULATION':
        return 'red-500';
      case 'CHANGEMENT_HORAIRE':
        return 'orange-500';
      default:
        return 'blue-700';
    }
  };

  const handleClick = () => {
    const notificationPath = {
      ADMIN: '/admin/notifications',
      MEDECIN: '/medecin/notifications',
      PATIENT: '/patient/notifications',
    };

    const path = notificationPath[user?.role] || '/';
    navigate(path);
    onDismiss();
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div className="relative group">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-${getBgColor(notification.type)} rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity`}></div>

        {/* Toast content */}
        <div
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-md cursor-pointer hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-700"
          onClick={handleClick}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 bg-${getBgColor(notification.type)} rounded-xl flex items-center justify-center`}>
              {getIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {notification.titre}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {notification.description}
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-400 mt-1 font-semibold">
                Cliquez pour voir →
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-2xl overflow-hidden">
            <div className={`h-full bg-${getBgColor(notification.type)} animate-progress-bar`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
