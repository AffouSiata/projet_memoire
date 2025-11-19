import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AlertModal = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  type = 'info', // 'success', 'error', 'warning', 'info'
  icon: CustomIcon,
}) => {
  if (!isOpen) return null;

  const iconConfig = {
    success: {
      Icon: CheckCircleIcon,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      effectColor: 'bg-blue-200/30',
    },
    error: {
      Icon: XCircleIcon,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      btnColor: 'bg-red-600 hover:bg-red-700',
      effectColor: 'bg-red-200/30',
    },
    warning: {
      Icon: ExclamationTriangleIcon,
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      btnColor: 'bg-orange-600 hover:bg-orange-700',
      effectColor: 'bg-orange-200/30',
    },
    info: {
      Icon: InformationCircleIcon,
      bgColor: 'bg-blue-100 dark:bg-blue-950/30',
      iconColor: 'text-blue-700 dark:text-blue-400',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      effectColor: 'bg-blue-200/30',
    },
  };

  const config = iconConfig[type] || iconConfig.info;
  const Icon = CustomIcon || config.Icon;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in overflow-hidden">
        {/* Effet décoratif */}
        <div className={`absolute top-0 right-0 w-64 h-64 ${config.effectColor} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>

        {/* Contenu */}
        <div className="relative z-10">
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Icône */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center animate-pulse`}>
              <Icon className={`w-10 h-10 ${config.iconColor}`} />
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
            {title}
          </h2>

          {/* Message */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-6">
            <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
              {message}
            </p>
          </div>

          {/* Bouton */}
          <button
            onClick={onClose}
            className={`w-full px-8 py-4 ${config.btnColor} text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
