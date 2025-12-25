import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/errorHandler';
import { validateEmail, validatePassword } from '../../utils/validators';
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
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) {
      errors.email = emailResult.message;
    }

    const passwordResult = validatePassword(formData.motDePasse);
    if (!passwordResult.valid) {
      errors.motDePasse = passwordResult.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <SparklesIcon className="w-8 h-8 text-blue-700 dark:text-blue-400 animate-pulse" />
              <h1 className="text-4xl font-black text-blue-700 dark:text-blue-500">
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
                className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                  fieldErrors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {fieldErrors.email && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {fieldErrors.email}
                </p>
              )}
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
                className={`w-full px-4 py-3.5 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 transition-all placeholder-gray-400 group-hover:border-gray-300 dark:group-hover:border-gray-500 ${
                  fieldErrors.motDePasse
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {fieldErrors.motDePasse && (
                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {fieldErrors.motDePasse}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-8 py-4 bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-8 ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-800 hover:shadow-2xl hover:scale-105'
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
              <Link to="/register" className="text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold transition-colors">
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
