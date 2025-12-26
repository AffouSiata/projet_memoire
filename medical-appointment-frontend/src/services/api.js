import axios from 'axios';

// Configuration de base de l'API
// En production (déployé), utilise l'URL relative
// En développement local, utilise localhost:3002
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : 'http://localhost:3002/api';

// Instance Axios avec configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 20000, // Timeout de 20 secondes (Render free tier peut être lent au démarrage)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs et refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si erreur 401 (Unauthorized) et pas déjà retryé, tenter de refresh le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } else {
          // Pas de refresh token, rediriger vers login
          throw new Error('No refresh token');
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Si pas de réponse (erreur réseau) ou si le token n'existe pas
    if (!error.response && !localStorage.getItem('accessToken')) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
