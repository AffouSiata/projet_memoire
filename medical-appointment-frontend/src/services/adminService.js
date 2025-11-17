import api from './api';

const adminService = {
  // Patients
  getPatients: (params) => api.get('/admin/patients', { params }),
  updatePatient: (id, data) => api.patch(`/admin/patients/${id}`, data),

  // Médecins
  getMedecins: (params) => api.get('/admin/medecins', { params }),
  updateMedecin: (id, data) => api.patch(`/admin/medecins/${id}`, data),
  approveMedecin: (id) => api.patch(`/admin/medecins/${id}/approve`),
  rejectMedecin: (id) => api.patch(`/admin/medecins/${id}/reject`),

  // Rendez-vous
  getAppointments: (params) => api.get('/admin/rendezvous', { params }),
  updateAppointment: (id, data) => api.patch(`/admin/rendezvous/${id}`, data),

  // Statistiques
  getStatistics: () => api.get('/admin/statistiques'),

  // Paramètres
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.patch('/admin/profile', data),

  // Logs d'audit
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),

  // Notifications
  getNotifications: (params) => api.get('/admin/notifications', { params }),
  markNotificationsAsRead: (notificationIds) => api.patch('/admin/notifications/mark-as-read', { notificationIds }),
};

export default adminService;
