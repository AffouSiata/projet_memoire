import api from './api';

const patientService = {
  // Profil
  getProfile: () => api.get('/patients/me'),
  updateProfile: (data) => api.patch('/patients/me', data),
  changePassword: (data) => api.patch('/patients/me/password', data),

  // Rendez-vous
  getAppointments: (params) => api.get('/patients/rendezvous', { params }),
  createAppointment: (data) => api.post('/patients/rendezvous', data),
  // NOTE: confirmAppointment supprimé - seuls les médecins peuvent confirmer les rendez-vous
  cancelAppointment: (id) => api.patch(`/patients/rendezvous/${id}`, { statut: 'ANNULE' }),

  // Notifications
  getNotifications: () => api.get('/patients/notifications'),
  markAsRead: (ids) => api.patch('/patients/notifications/mark-as-read', { notificationIds: ids }),

  // Paramètres
  updatePreferences: (data) => api.patch('/patients/preferences', data),

  // Créneaux horaires
  getDoctorTimeSlots: (medecinId, jour) => {
    const params = jour ? { jour } : {};
    return api.get(`/timeslots/${medecinId}`, { params });
  },

  // Médecins
  getDoctors: (specialite) => {
    const params = specialite ? { specialite } : {};
    return api.get('/patients/medecins', { params });
  },
};

export default patientService;
