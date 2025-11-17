import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const Login = () => {
  const { t } = useTranslation();
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

      const roleRedirect = {
        PATIENT: '/patient/dashboard',
        MEDECIN: '/medecin/dashboard',
        ADMIN: '/admin/dashboard',
      };

      navigate(roleRedirect[data.user.role] || '/');
    } catch (err) {
      setError(getErrorMessage(err, t('login.errorConnection')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in border border-white/50 dark:border-gray-700/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <SparklesIcon className="w-8 h-8 text-primary-600 dark:text-primary-400 animate-pulse" />
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent">
                {t('login.title')}
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
              {t('login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-5 py-4 rounded-2xl mb-6 flex items-center gap-3 animate-shake">
              <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 font-bold">!</span>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4" />
                {t('login.email')}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('login.emailPlaceholder')}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500"
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4" />
                {t('login.password')}
              </label>
              <input
                type="password"
                name="motDePasse"
                value={formData.motDePasse}
                onChange={handleChange}
                placeholder={t('login.passwordPlaceholder')}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-600 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-8 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-primary-600 hover:to-secondary-700 hover:shadow-2xl hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t('login.loggingIn')}
                </>
              ) : (
                <>
                  {t('login.loginButton')}
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              {t('login.noAccount')}{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-bold transition-colors">
                {t('login.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
