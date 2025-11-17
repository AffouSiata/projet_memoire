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
