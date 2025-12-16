import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import i18n from 'i18next';

const AuthContext = createContext(null);

// Helper function to safely extract error message
const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.message && typeof error.message === 'string') return error.message;
  if (error?.message && typeof error.message === 'object' && error.message.message) {
    return error.message.message;
  }
  return 'An error occurred';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Charger la langue de l'utilisateur si disponible (priorité à la base de données)
      if (currentUser.langue) {
        i18n.changeLanguage(currentUser.langue);
        // Synchroniser localStorage avec la base de données
        localStorage.setItem('language', currentUser.langue);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, motDePasse) => {
    const data = await authService.login(email, motDePasse);
    setUser(data.user);
    // Charger la langue de l'utilisateur au login (priorité à la base de données)
    if (data.user && data.user.langue) {
      i18n.changeLanguage(data.user.langue);
      // Synchroniser localStorage avec la base de données
      localStorage.setItem('language', data.user.langue);
    }
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

  const updateUser = (userData) => {
    const updatedUser = authService.updateUser(userData);
    setUser(updatedUser);
    // Mettre à jour la langue si elle a changé
    if (userData.langue) {
      i18n.changeLanguage(userData.langue);
      // Synchroniser localStorage avec la base de données
      localStorage.setItem('language', userData.langue);
    }
    return updatedUser;
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
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
