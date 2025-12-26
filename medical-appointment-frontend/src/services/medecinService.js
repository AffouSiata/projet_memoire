import api from './api';

const medecinService = {
  // Profil
  getProfile: () => api.get('/medecins/me'),
  updateProfile: (data) => api.patch('/medecins/me', data),

  // Rendez-vous
  getAppointments: (params) => api.get('/medecins/rendezvous', { params }),
  updateAppointment: (id, data) => api.patch(`/medecins/rendezvous/${id}`, data),
  updateAppointmentStatus: (id, statut) => api.patch(`/medecins/rendezvous/${id}`, { statut }),

  // Patients
  getPatients: () => api.get('/medecins/patients'),

  // Notes
  getNotes: () => api.get('/medecins/notes'),
  createNote: (data) => api.post('/medecins/notes', data),
  updateNote: (id, data) => api.patch(`/medecins/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/medecins/notes/${id}`),

  // TimeSlots
  getTimeSlots: () => api.get('/medecins/timeslots'),
  createTimeSlot: (data) => api.post('/medecins/timeslots', data),
  updateTimeSlot: (id, data) => api.patch(`/medecins/timeslots/${id}`, data),
  deleteTimeSlot: (id) => api.delete(`/medecins/timeslots/${id}`),

  // Notifications
  getNotifications: (params) => api.get('/medecins/notifications', { params }),
  markNotificationAsRead: (notificationId) => api.patch('/medecins/notifications/mark-as-read', { notificationIds: [notificationId] }),
  markAllNotificationsAsRead: () => api.patch('/medecins/notifications/mark-as-read', {}),
  markNotificationsAsRead: (notificationIds) => api.patch('/medecins/notifications/mark-as-read', { notificationIds }),

  // Indisponibilités
  getIndisponibilites: (params) => api.get('/medecins/indisponibilites', { params }),
  createIndisponibilite: (data) => api.post('/medecins/indisponibilites', data),
  deleteIndisponibilite: (id) => api.delete(`/medecins/indisponibilites/${id}`),
};

export default medecinService;
