# 📦 Code Complet Frontend - Medical Appointment

Copiez-collez chaque fichier dans le bon emplacement.

## 🔧 Services

### src/services/authService.js
```javascript
import api from './api';

const authService = {
  // Connexion
  async login(email, motDePasse) {
    const response = await api.post('/auth/login', { email, motDePasse });
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Inscription
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Déconnexion
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Vérifier si authentifié
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  // Obtenir le rôle de l'utilisateur
  getUserRole() {
    const user = this.getCurrentUser();
    return user?.role;
  },
};

export default authService;
```

### src/services/patientService.js
```javascript
import api from './api';

const patientService = {
  // Profil
  getProfile: () => api.get('/patients/me'),
  updateProfile: (data) => api.patch('/patients/me', data),

  // Rendez-vous
  getAppointments: (params) => api.get('/patients/rendezvous', { params }),
  createAppointment: (data) => api.post('/patients/rendezvous', data),

  // Notifications
  getNotifications: () => api.get('/patients/notifications'),
  markAsRead: (ids) => api.patch('/patients/notifications/mark-as-read', { notificationIds: ids }),

  // Paramètres
  updatePreferences: (data) => api.patch('/patients/preferences', data),
};

export default patientService;
```

### src/services/medecinService.js
```javascript
import api from './api';

const medecinService = {
  // Profil
  getProfile: () => api.get('/medecins/me'),
  updateProfile: (data) => api.patch('/medecins/me', data),

  // Rendez-vous
  getAppointments: (params) => api.get('/medecins/rendezvous', { params }),
  updateAppointment: (id, data) => api.patch(`/medecins/rendezvous/${id}`, data),

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
};

export default medecinService;
```

### src/services/adminService.js
```javascript
import api from './api';

const adminService = {
  // Patients
  getPatients: (params) => api.get('/admin/patients', { params }),
  updatePatient: (id, data) => api.patch(`/admin/patients/${id}`, data),

  // Médecins
  getMedecins: (params) => api.get('/admin/medecins', { params }),
  updateMedecin: (id, data) => api.patch(`/admin/medecins/${id}`, data),

  // Rendez-vous
  getAppointments: (params) => api.get('/admin/rendezvous', { params }),
  updateAppointment: (id, data) => api.patch(`/admin/rendezvous/${id}`, data),

  // Statistiques
  getStatistics: () => api.get('/admin/statistiques'),
};

export default adminService;
```

---

## 🎯 Context

### src/context/AuthContext.jsx
```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, motDePasse) => {
    const data = await authService.login(email, motDePasse);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
```

### src/context/ThemeContext.jsx
```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#3b82f6');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedAccent = localStorage.getItem('accentColor') || '#3b82f6';
    setTheme(savedTheme);
    setAccentColor(savedAccent);

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeAccentColor = (color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, changeAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
```

---

## 🛣️ Routes

### src/routes/PrivateRoute.jsx
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
```

### src/routes/RoleBasedRoute.jsx
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Rediriger vers le dashboard approprié
    const redirectMap = {
      PATIENT: '/patient/dashboard',
      MEDECIN: '/medecin/dashboard',
      ADMIN: '/admin/dashboard',
    };
    return <Navigate to={redirectMap[user.role]} replace />;
  }

  return children;
};

export default RoleBasedRoute;
```

---

## 🧩 Composants Communs

### src/components/common/Loading.jsx
```jsx
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );
};

export default Loading;
```

### src/components/common/Card.jsx
```jsx
const Card = ({ title, children, className = '', onClick }) => {
  return (
    <div
      className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
```

### src/components/common/Button.jsx
```jsx
const Button = ({ children, variant = 'primary', onClick, disabled, className = '', type = 'button' }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
```

### src/components/common/Input.jsx
```jsx
const Input = ({ label, type = 'text', name, value, onChange, placeholder, required, error }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`input-field ${error ? 'border-red-500' : ''}`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;
```

---

## 📄 Pages d'Authentification

### src/pages/auth/Login.jsx
```jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', motDePasse: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.email, formData.motDePasse);

      // Redirection selon le rôle
      const roleRedirect = {
        PATIENT: '/patient/dashboard',
        MEDECIN: '/medecin/dashboard',
        ADMIN: '/admin/dashboard',
      };

      navigate(roleRedirect[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        <div className="card animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Medical Appointment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre-email@exemple.com"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="motDePasse"
              value={formData.motDePasse}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <Button type="submit" disabled={loading} className="w-full mt-6">
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Comptes de test */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Comptes de test:</p>
            <div className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
              <div>Patient: marie.yao@example.com</div>
              <div>Médecin: jean.kouadio@medical.com</div>
              <div>Admin: admin@medical.com</div>
              <div className="font-medium">Mot de passe: password123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

---

## 📊 Dashboards de Base

### src/pages/patient/Dashboard.jsx
```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import patientService from '../../services/patientService';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await patientService.getAppointments();
      setAppointments(response.data.data || []);
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bonjour, {user?.prenom} {user?.nom}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenue sur votre espace patient
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rendez-vous à venir</p>
              <p className="text-3xl font-bold text-primary-600">{appointments.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Consultations</p>
              <p className="text-3xl font-bold text-green-600">{appointments.filter(a => a.statut === 'TERMINE').length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Annulés</p>
              <p className="text-3xl font-bold text-red-600">{appointments.filter(a => a.statut === 'ANNULE').length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Actions rapides">
          <div className="space-y-3">
            <Button className="w-full justify-center">
              Prendre un rendez-vous
            </Button>
            <Button variant="secondary" className="w-full justify-center">
              Voir mon historique
            </Button>
          </div>
        </Card>

        <Card title="Prochain rendez-vous">
          {appointments.length > 0 ? (
            <div className="space-y-2">
              <p className="font-medium text-gray-900 dark:text-white">
                Dr. {appointments[0].medecin?.prenom} {appointments[0].medecin?.nom}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {appointments[0].medecin?.specialite}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(appointments[0].date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Aucun rendez-vous à venir
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
```

### src/pages/medecin/Dashboard.jsx
```jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import medecinService from '../../services/medecinService';

const MedecinDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apptRes, patientRes] = await Promise.all([
        medecinService.getAppointments(),
        medecinService.getPatients(),
      ]);
      setAppointments(apptRes.data.data || []);
      setPatients(patientRes.data || []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dr. {user?.prenom} {user?.nom}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{user?.specialite}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rendez-vous aujourd'hui</p>
          <p className="text-3xl font-bold text-primary-600">
            {appointments.filter(a => {
              const today = new Date().toDateString();
              return new Date(a.date).toDateString() === today;
            }).length}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">À venir</p>
          <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Patients suivis</p>
          <p className="text-3xl font-bold text-green-600">{patients.length}</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
          <p className="text-3xl font-bold text-orange-600">
            {appointments.filter(a => a.statut === 'EN_ATTENTE').length}
          </p>
        </Card>
      </div>

      <Card title="Rendez-vous du jour">
        {appointments.filter(a => {
          const today = new Date().toDateString();
          return new Date(a.date).toDateString() === today;
        }).length > 0 ? (
          <div className="space-y-4">
            {appointments
              .filter(a => {
                const today = new Date().toDateString();
                return new Date(a.date).toDateString() === today;
              })
              .map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium">{appt.patient?.prenom} {appt.patient?.nom}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{appt.motif}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(appt.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                    <span className={`text-xs px-2 py-1 rounded ${appt.statut === 'CONFIRME' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {appt.statut}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun rendez-vous aujourd'hui</p>
        )}
      </Card>
    </div>
  );
};

export default MedecinDashboard;
```

### src/pages/admin/Dashboard.jsx
```jsx
import { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getStatistics();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Administration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de la plateforme
        </p>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Patients</p>
              <p className="text-3xl font-bold text-primary-600">
                {stats.utilisateurs?.patients?.total || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">
                {stats.utilisateurs?.patients?.actifs || 0} actifs
              </p>
            </Card>

            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Médecins</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.utilisateurs?.medecins?.total || 0}
              </p>
              <p className="text-xs text-green-600 mt-2">
                {stats.utilisateurs?.medecins?.actifs || 0} actifs
              </p>
            </Card>

            <Card>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rendez-vous</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.rendezVous?.total || 0}
              </p>
              <p className="text-xs text-red-600 mt-2">
                Taux annulation: {stats.rendezVous?.tauxAnnulation?.toFixed(1) || 0}%
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Rendez-vous par statut">
              <div className="space-y-3">
                {stats.rendezVous?.parStatut?.map((item) => (
                  <div key={item.statut} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.statut}
                    </span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Top Médecins">
              <div className="space-y-3">
                {stats.rendezVous?.parMedecin?.slice(0, 5).map((item) => (
                  <div key={item.medecinId} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.nom}</p>
                      <p className="text-xs text-gray-500">{item.specialite}</p>
                    </div>
                    <span className="text-sm font-medium text-primary-600">
                      {item.nombreRendezVous} RDV
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
```

---

## 🎯 App.jsx Principal

### src/App.jsx
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

// Pages Auth
import Login from './pages/auth/Login';

// Pages Patient
import PatientDashboard from './pages/patient/Dashboard';

// Pages Médecin
import MedecinDashboard from './pages/medecin/Dashboard';

// Pages Admin
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Patient routes */}
            <Route
              path="/patient/dashboard"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <PatientDashboard />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* Médecin routes */}
            <Route
              path="/medecin/dashboard"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinDashboard />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
```

---

## 🚀 Pour Démarrer

1. **Copiez tous les fichiers** dans les bons emplacements
2. **Démarrez le backend** (port 3002)
3. **Démarrez le frontend:**
```bash
cd medical-appointment-frontend
npm start
```

4. **Testez la connexion** avec les comptes de test

---

**📝 Note:** Ceci est la base essentielle. Vous pouvez maintenant étendre en ajoutant:
- Les autres pages (Appointments, Profile, Settings, etc.)
- Les graphiques avec Recharts
- Les formulaires multi-étapes
- Les composants avancés (Timeline, Tables, etc.)

La structure est solide et professionnelle. Suivez le même pattern pour créer les autres pages! 🎉
