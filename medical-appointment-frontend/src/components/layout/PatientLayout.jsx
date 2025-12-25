import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationToast from '../common/NotificationToast';
import {
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  BellIcon,
  CogIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const PatientLayout = ({ children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { newNotification, dismissToast, unreadCount } = useNotifications();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default on mobile
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      name: t('nav.dashboard'),
      path: '/patient/dashboard',
      icon: HomeIcon,
      color: 'blue-500',
    },
    {
      name: t('nav.newAppointment'),
      path: '/patient/appointment',
      icon: CalendarIcon,
      color: 'blue-500',
    },
    {
      name: t('nav.history'),
      path: '/patient/history',
      icon: ClockIcon,
      color: 'blue-500',
    },
    {
      name: t('nav.notifications'),
      path: '/patient/notifications',
      icon: BellIcon,
      color: 'blue-500',
    },
    {
      name: t('nav.settings'),
      path: '/patient/settings',
      icon: CogIcon,
      color: 'blue-500',
    },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
      {/* Animated background - couleurs Nexus Health */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300/15 dark:bg-blue-700/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl shadow-lg z-40 flex items-center justify-between px-4 md:hidden border-b border-white/20 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <img
            src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"}
            alt="Nexus Health"
            className="h-10 w-auto object-contain"
          />
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
        >
          <Bars3Icon className="w-6 h-6 text-slate-600 dark:text-white" />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-2xl shadow-2xl transition-all duration-500 ease-in-out z-50 border-r border-white/20 dark:border-gray-700/50
          ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-20'}
        `}
      >
        {/* Overlay léger */}
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-800/30 pointer-events-none"></div>

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-gray-700/50">
          <div className={`flex items-center gap-3 animate-slide-in-left ${!isSidebarOpen && 'md:hidden'}`}>
            <div className="relative group">
              <img
                src={isDarkMode ? "/logo-dark.png" : "/logo-light.png"}
                alt="Nexus Health"
                className="h-12 w-auto object-contain transform group-hover:scale-105 transition-all duration-300"
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-white font-medium">{t('layout.patientSpace')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="relative p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 group"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="relative w-6 h-6 text-slate-600 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
            ) : (
              <Bars3Icon className="relative w-6 h-6 text-slate-600 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors" />
            )}
          </button>
        </div>

        {/* User Info - Clickable to Profile */}
        {user && (
          <div className={`relative p-6 border-b border-slate-200/50 dark:border-gray-700/50 animate-slide-in-left ${!isSidebarOpen && 'md:p-4'}`} style={{ animationDelay: '100ms' }}>
            <button
              onClick={() => {
                navigate('/patient/profile');
                setIsSidebarOpen(false);
              }}
              className="relative group w-full"
            >
              <div className={`relative flex items-center gap-4 p-4 bg-white/60 dark:bg-gray-700/60 rounded-2xl backdrop-blur-sm border border-white/50 dark:border-gray-600/50 shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-300 cursor-pointer ${!isSidebarOpen && 'md:p-2 md:justify-center'}`}>
                <div className="relative">
                  <div className={`relative bg-blue-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-xl ${isSidebarOpen ? 'w-14 h-14 text-lg' : 'w-14 h-14 text-lg md:w-10 md:h-10 md:text-sm'}`}>
                    {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                  </div>
                </div>
                <div className={`flex-1 min-w-0 text-left ${!isSidebarOpen && 'md:hidden'}`}>
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {user.prenom} {user.nom}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-white truncate">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-blue-600 font-medium">{t('layout.online')}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`relative p-4 space-y-2 overflow-y-auto scrollbar-hide ${!isSidebarOpen && 'md:p-2'}`} style={{ maxHeight: 'calc(100vh - 340px)' }}>
          {menuItems.map((item, index) => {
            const isItemActive = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsSidebarOpen(false);
                }}
                className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group animate-slide-in-left ${!isSidebarOpen && 'md:justify-center md:px-2'} ${
                  isItemActive
                    ? 'bg-blue-500 text-white shadow-xl scale-105'
                    : 'text-slate-600 dark:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-lg hover:scale-105'
                }`}
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
              >
                {/* Glow effect for active item */}
                {isItemActive && (
                  <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-xl opacity-50 animate-pulse-soft"></div>
                )}

                {/* Icon */}
                <div className="relative">
                  <item.icon
                    className={`w-6 h-6 transition-all duration-300 ${
                      isItemActive
                        ? 'text-white scale-110 animate-pulse-soft'
                        : 'text-slate-400 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 group-hover:scale-110'
                    }`}
                  />
                  {/* Notification Badge */}
                  {item.path === '/patient/notifications' && unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-white dark:border-gray-800 animate-pulse">
                      <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* Text */}
                <span className={`relative text-sm font-semibold ${!isSidebarOpen && 'md:hidden'}`}>
                  {item.name}
                </span>

                {/* Active indicator */}
                {isItemActive && isSidebarOpen && (
                  <div className="ml-auto flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}

              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${!isSidebarOpen && 'md:p-2'}`}>
          <button
            onClick={handleLogout}
            className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-300 group hover:scale-105 hover:shadow-lg ${!isSidebarOpen && 'md:justify-center md:px-2'}`}
          >
            <ArrowLeftOnRectangleIcon className="relative w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className={`relative text-sm font-semibold ${!isSidebarOpen && 'md:hidden'}`}>{t('common.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-500 ease-in-out pt-16 md:pt-0 ml-0 ${
          isSidebarOpen ? 'md:ml-72' : 'md:ml-20'
        }`}
      >
        {children}
      </main>

      {/* Logout Confirmation Modal - Style Dashboard */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Overlay avec blur fort */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={cancelLogout}
          ></div>

          {/* Modal ultra-moderne */}
          <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in border border-white/20 dark:border-gray-700/50 overflow-hidden">
            {/* Effets décoratifs d'arrière-plan */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            {/* Contenu */}
            <div className="relative z-10">
              {/* Icône d'alerte animée */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Glow animé */}
                  <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>

                  {/* Cercle principal */}
                  <div className="relative w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                    <ExclamationTriangleIcon className="w-12 h-12 text-white animate-pulse" />
                  </div>

                  {/* Cercles de pulsation */}
                  <div className="absolute inset-0 border-4 border-red-400 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>

              {/* Titre avec style moderne */}
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('common.confirmLogout') || 'Confirmer la déconnexion'}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-700 to-transparent rounded-full"></div>
                </div>
              </div>

              {/* Message */}
              <p className="text-center text-gray-700 dark:text-gray-200 mb-8 leading-relaxed text-lg">
                {t('common.logoutMessage') || 'Êtes-vous sûr de vouloir vous déconnecter ?'}
              </p>

              {/* Carte d'information */}
              <div className="mb-8 bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 dark:text-red-100 mb-1">
                      {t('layout.sessionEnded')}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {t('layout.redirectMessage')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                {/* Bouton Annuler */}
                <button
                  onClick={cancelLogout}
                  className="relative flex-1 group"
                >
                  <div className="absolute inset-0 bg-gray-300 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  <div className="relative px-6 py-4 rounded-2xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm text-gray-700 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600">
                    {t('common.cancel') || 'Annuler'}
                  </div>
                </button>

                {/* Bouton Se déconnecter */}
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                  <span>{t('common.logoutButton') || 'Se déconnecter'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {newNotification && (
        <NotificationToast notification={newNotification} onDismiss={dismissToast} />
      )}
    </div>
  );
};

export default PatientLayout;
