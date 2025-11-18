import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import adminService from '../services/adminService';
import patientService from '../services/patientService';
import medecinService from '../services/medecinService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotification, setNewNotification] = useState(null);
  const previousCountRef = useRef(0);
  const audioRef = useRef(null);

  // Obtenir le service approprié selon le rôle
  const getNotificationService = useCallback(() => {
    switch (user?.role) {
      case 'ADMIN':
        return adminService;
      case 'MEDECIN':
        return medecinService;
      case 'PATIENT':
        return patientService;
      default:
        return null;
    }
  }, [user?.role]);

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    if (!user) return;

    const service = getNotificationService();
    if (!service) return;

    try {
      const response = await service.getNotifications();
      const notifs = response.data?.data || [];
      setNotifications(notifs);

      const unread = notifs.filter(n => !n.lue).length;

      // Détecter une nouvelle notification
      if (unread > previousCountRef.current && previousCountRef.current > 0) {
        // Il y a une nouvelle notification !
        const latestUnread = notifs.find(n => !n.lue);
        if (latestUnread) {
          setNewNotification(latestUnread);
          playNotificationSound();

          // Effacer la notification toast après 5 secondes
          setTimeout(() => {
            setNewNotification(null);
          }, 5000);
        }
      }

      previousCountRef.current = unread;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  }, [user, getNotificationService]);

  // Jouer le son de notification
  const playNotificationSound = () => {
    try {
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.log('Could not play notification sound:', err);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  // Polling automatique toutes les 10 secondes
  useEffect(() => {
    if (!user) return;

    // Charger immédiatement
    loadNotifications();

    // Puis toutes les 10 secondes
    const intervalId = setInterval(() => {
      loadNotifications();
    }, 10000); // 10 secondes

    return () => clearInterval(intervalId);
  }, [user, loadNotifications]);

  // Créer l'élément audio pour le son de notification
  useEffect(() => {
    // Créer un son simple avec Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const audioContext = new AudioContext();

      // Fonction pour créer un son de notification
      const createNotificationSound = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      };

      audioRef.current = { play: () => Promise.resolve(createNotificationSound()) };
    }
  }, []);

  const markAsRead = async (notificationIds) => {
    const service = getNotificationService();
    if (!service) return;

    try {
      if (user.role === 'ADMIN') {
        await service.markNotificationsAsRead(notificationIds);
      } else if (user.role === 'MEDECIN') {
        await service.markNotificationsAsRead(notificationIds);
      } else if (user.role === 'PATIENT') {
        await service.markAsRead(notificationIds);
      }
      await loadNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const dismissToast = () => {
    setNewNotification(null);
  };

  const value = {
    notifications,
    unreadCount,
    newNotification,
    loadNotifications,
    markAsRead,
    dismissToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
