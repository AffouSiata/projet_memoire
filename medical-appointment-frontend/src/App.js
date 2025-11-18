import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './routes/PrivateRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';

// Pages Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages Patient
import PatientDashboard from './pages/patient/Dashboard';
import AppointmentBooking from './pages/patient/AppointmentBooking';
import AppointmentHistory from './pages/patient/AppointmentHistory';
import Notifications from './pages/patient/Notifications';
import Settings from './pages/patient/Settings';
import TestSettings from './pages/patient/TestSettings';
import Profile from './pages/patient/Profile';

// Pages Médecin
import MedecinDashboard from './pages/medecin/Dashboard';
import MedecinAppointments from './pages/medecin/Appointments';
import MedecinPatients from './pages/medecin/Patients';
import MedecinNotes from './pages/medecin/Notes';
import MedecinCreneaux from './pages/medecin/Creneaux';
import MedecinNotifications from './pages/medecin/Notifications';
import MedecinSettings from './pages/medecin/Settings';
import MedecinProfile from './pages/medecin/Profile';

// Pages Admin
import AdminDashboard from './pages/admin/Dashboard';
import AdminPatients from './pages/admin/Patients';
import AdminMedecins from './pages/admin/Medecins';
import AdminRendezVous from './pages/admin/RendezVous';
import AdminNotifications from './pages/admin/Notifications';
import AdminParametres from './pages/admin/Parametres';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

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
            <Route
              path="/patient/appointment"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <AppointmentBooking />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/history"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <AppointmentHistory />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/notifications"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <Notifications />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/settings"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <Settings />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <Profile />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/patient/test-settings"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['PATIENT']}>
                    <TestSettings />
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
            <Route
              path="/medecin/appointments"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinAppointments />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/patients"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinPatients />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/notes"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinNotes />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/creneaux"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinCreneaux />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/notifications"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinNotifications />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/settings"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinSettings />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/medecin/profile"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['MEDECIN']}>
                    <MedecinProfile />
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
            <Route
              path="/admin/patients"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminPatients />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/medecins"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminMedecins />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/rendezvous"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminRendezVous />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminNotifications />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminParametres />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />

            {/* Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
