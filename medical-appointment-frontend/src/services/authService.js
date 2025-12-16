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
    // Only save tokens if they exist (patients get tokens immediately, doctors don't if pending approval)
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    // For doctors pending approval, no tokens are provided
    return response;
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

  // Mettre à jour l'utilisateur dans localStorage
  updateUser(userData) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  },
};

export default authService;
