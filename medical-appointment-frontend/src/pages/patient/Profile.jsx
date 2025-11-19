import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/layout/PatientLayout';
import patientService from '../../services/patientService';
import { getErrorMessage } from '../../utils/errorHandler';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckCircleIcon,
  PencilIcon,
  LockClosedIcon,
  ClockIcon,
  ChartBarIcon,
  HeartIcon,
  BellIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  BeakerIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  ClipboardDocumentCheckIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  UserCircleIcon,
  CameraIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showHealthCardModal, setShowHealthCardModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    groupeSanguin: '',
  });

  const [editData, setEditData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    dateNaissance: '',
    adresse: '',
    groupeSanguin: '',
  });

  // Données du carnet santé (stockées localement pour demo)
  const [healthCard, setHealthCard] = useState({
    allergies: ['Pénicilline', 'Arachides'],
    antecedents: ['Hypertension (2020)', 'Diabète type 2 (2022)'],
    vaccins: [
      { nom: 'COVID-19', date: '2024-01-15', statut: 'À jour' },
      { nom: 'Grippe', date: '2023-10-10', statut: 'À jour' },
      { nom: 'Tétanos', date: '2021-03-20', statut: 'À renouveler' },
    ],
    medicamentsActuels: ['Metformine 500mg', 'Lisinopril 10mg'],
    contactUrgence: {
      nom: 'Marie Yao',
      relation: 'Épouse',
      telephone: '+225 07 00 00 00 99',
    },
  });

  const [healthSummary, setHealthSummary] = useState({
    nextAppointment: null,
    appointmentsThisMonth: 0,
    mostConsultedSpeciality: '',
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await patientService.getProfile();
      const data = response.data;

      const profile = {
        prenom: data.prenom || '',
        nom: data.nom || '',
        email: data.email || '',
        telephone: data.telephone || '',
        dateNaissance: data.dateNaissance || '',
        adresse: data.adresse || '',
        groupeSanguin: data.groupeSanguin || '',
      };

      setProfileData(profile);
      setEditData(profile);

      await loadHealthSummary();
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError(getErrorMessage(err, 'Impossible de charger le profil'));
    } finally {
      setIsLoading(false);
    }
  };

  const loadHealthSummary = async () => {
    try {
      const [appointmentsResponse] = await Promise.all([
        patientService.getAppointments(),
      ]);

      const appointments = appointmentsResponse.data?.data || appointmentsResponse.data || [];

      const futureAppointments = appointments
        .filter(apt => new Date(apt.dateHeure) > new Date() && apt.statut === 'CONFIRME')
        .sort((a, b) => new Date(a.dateHeure) - new Date(b.dateHeure));

      const now = new Date();
      const thisMonthAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.dateHeure);
        return aptDate.getMonth() === now.getMonth() &&
               aptDate.getFullYear() === now.getFullYear();
      });

      const completed = appointments.filter(apt =>
        new Date(apt.dateHeure) < new Date() && apt.statut === 'CONFIRME'
      ).length;

      const cancelled = appointments.filter(apt => apt.statut === 'ANNULE').length;

      const specialityCounts = {};
      appointments.forEach(apt => {
        const spec = apt.medecin?.specialite || 'Général';
        specialityCounts[spec] = (specialityCounts[spec] || 0) + 1;
      });

      const mostConsulted = Object.entries(specialityCounts)
        .sort((a, b) => b[1] - a[1])[0];

      setHealthSummary({
        nextAppointment: futureAppointments[0] || null,
        appointmentsThisMonth: thisMonthAppointments.length,
        mostConsultedSpeciality: mostConsulted ? mostConsulted[0] : 'Aucune',
        totalAppointments: appointments.length,
        completedAppointments: completed,
        cancelledAppointments: cancelled,
      });
    } catch (err) {
      console.error('Erreur lors du chargement du résumé santé:', err);
    }
  };

  const handleEditProfile = async () => {
    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      await patientService.updateProfile(editData);

      setProfileData(editData);
      setSuccess('Profil mis à jour avec succès !');
      setShowEditModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(getErrorMessage(err, 'Impossible de sauvegarder le profil'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }

      setIsSaving(true);
      setError('');
      setSuccess('');

      await patientService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess('Mot de passe modifié avec succès !');
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Erreur lors du changement de mot de passe:', err);
      setError(getErrorMessage(err, 'Impossible de changer le mot de passe'));
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateAge = (dateNaissance) => {
    if (!dateNaissance) return null;
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getHealthScore = () => {
    const total = healthSummary.totalAppointments;
    const completed = healthSummary.completedAppointments;
    const cancelled = healthSummary.cancelledAppointments;

    if (total === 0) return 50;

    const completionRate = (completed / total) * 100;
    const cancellationPenalty = (cancelled / total) * 20;
    const regularityBonus = healthSummary.appointmentsThisMonth > 0 ? 10 : 0;

    return Math.min(100, Math.round(completionRate - cancellationPenalty + regularityBonus));
  };

  if (isLoading) {
    return (
      <PatientLayout>
        <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 dark:text-white font-semibold text-lg">Chargement de votre profil...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  const healthScore = getHealthScore();
  const age = calculateAge(profileData.dateNaissance);

  return (
    <PatientLayout>
      <div className="min-h-screen bg-[#F7F9FC] dark:bg-gray-900 p-4 md:p-8 relative overflow-hidden">
        {/* Blobs animés en arrière-plan - couleurs LARANA (identiques au Dashboard) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Header - Style Dashboard */}
          <div className="mb-8 animate-slide-up">
            <div className="relative bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
              {/* Effets décoratifs d'arrière-plan */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              {/* Contenu principal */}
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  {/* Section gauche */}
                  <div className="flex-1">
                    {/* Badge "Profil" */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-full mb-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider">Mon Profil</span>
                    </div>

                    {/* Titre principal */}
                    <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white leading-tight">
                      Bonjour {profileData.prenom} 👋
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-white mb-2 font-medium">
                      Gérez vos informations personnelles et votre santé
                    </p>
                  </div>

                  {/* Section droite - Notifications */}
                  <div className="flex flex-col items-end gap-3">
                    <button className="relative group">
                      {/* Effet glow */}
                      <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>

                      {/* Bouton principal */}
                      <div className="relative flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-700 rounded-2xl border-2 border-gray-100 dark:border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 hover:scale-105">
                        <div className="relative">
                          <BellIcon className="w-6 h-6 text-gray-600 dark:text-white group-hover:text-blue-700 transition-colors" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
                          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                            3
                          </span>
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500 dark:text-white font-medium">Notifications</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">3 nouvelles</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-3 animate-slide-down backdrop-blur-sm">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-blue-800 dark:text-blue-200 font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3 animate-slide-down backdrop-blur-sm">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card & Score */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden animate-scale-in">
                {/* Cover Image - Couleur LARANA */}
                <div className="h-32 bg-blue-500 relative">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all">
                    <CameraIcon className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="relative px-6 pb-6">
                  {/* Avatar */}
                  <div className="relative -mt-16 mb-4">
                    <div className="w-32 h-32 rounded-3xl bg-blue-700 flex items-center justify-center shadow-2xl ring-4 ring-white dark:ring-gray-800 mx-auto">
                      <span className="text-5xl font-bold text-white">
                        {profileData.prenom?.charAt(0)}{profileData.nom?.charAt(0)}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-1/2 translate-x-12 w-8 h-8 bg-blue-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <button className="absolute bottom-0 right-1/2 translate-x-16 p-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-110">
                      <CameraIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Name & Status */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {profileData.prenom} {profileData.nom}
                    </h2>
                    <p className="text-blue-700 dark:text-blue-400 font-medium">
                      Patient {age ? `• ${age} ans` : ''}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Compte actif</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                        <CalendarDaysIcon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{healthSummary.totalAppointments}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total RDV</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                        <CheckCircleIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{healthSummary.completedAppointments}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Honorés</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-2xl flex items-center justify-center">
                        <XMarkIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{healthSummary.cancelledAppointments}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Annulés</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Score Card - Couleur LARANA comme Dashboard */}
              <div className="bg-blue-500 rounded-3xl shadow-2xl p-6 text-white animate-scale-in overflow-hidden relative" style={{ animationDelay: '100ms' }}>
                {/* Particules flottantes comme Dashboard */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-10 left-20 w-2 h-2 bg-white/40 rounded-full animate-float"></div>
                  <div className="absolute top-32 left-40 w-1.5 h-1.5 bg-white/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-20 right-32 w-2 h-2 bg-white/50 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <SparklesIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">Score Santé</h3>
                        <p className="text-xs text-white/80">Votre suivi médical</p>
                      </div>
                    </div>
                    <TrophyIcon className="w-10 h-10 text-yellow-300" />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-6xl font-bold">{healthScore}</span>
                      <span className="text-3xl font-bold mb-2">%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                      <div
                        className="bg-gradient-to-r from-yellow-300 via-white to-yellow-300 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ width: `${healthScore}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <StarIcon className="w-5 h-5 text-yellow-300" />
                      <p className="font-semibold">
                        {healthScore >= 80 ? 'Excellent suivi !' : healthScore >= 60 ? 'Bon suivi' : 'Continuez vos efforts'}
                      </p>
                    </div>
                    <p className="text-xs text-white/80">
                      {healthScore >= 80
                        ? 'Vous prenez soin de votre santé de manière exemplaire !'
                        : healthScore >= 60
                        ? 'Vous suivez régulièrement vos consultations médicales.'
                        : 'Pensez à prendre régulièrement vos rendez-vous médicaux.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 animate-scale-in" style={{ animationDelay: '200ms' }}>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full group"
                >
                  <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all border border-white/20 dark:border-gray-700/50 hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <PencilIcon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">Modifier le profil</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Mettre à jour vos informations</p>
                        </div>
                      </div>
                      <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full group"
                >
                  <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all border border-white/20 dark:border-gray-700/50 hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <LockClosedIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">Sécurité</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Changer le mot de passe</p>
                        </div>
                      </div>
                      <ShieldCheckIcon className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setShowHealthCardModal(true)}
                  className="w-full group"
                >
                  <div className="bg-blue-500 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ClipboardDocumentCheckIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-white">Mon Carnet Santé</p>
                          <p className="text-xs text-white/80">Allergies, vaccins, antécédents</p>
                        </div>
                      </div>
                      <HeartIconSolid className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Middle Column - Personal Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Info Card */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <IdentificationIcon className="w-6 h-6 text-blue-700 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations personnelles</h3>
                </div>

                <div className="space-y-3">
                  <InfoItem
                    icon={<EnvelopeIcon className="w-5 h-5" />}
                    label="Email"
                    value={profileData.email || '-'}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-700 dark:text-blue-400"
                  />
                  <InfoItem
                    icon={<PhoneIcon className="w-5 h-5" />}
                    label="Téléphone"
                    value={profileData.telephone || '-'}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-700 dark:text-blue-400"
                  />
                  <InfoItem
                    icon={<CalendarIcon className="w-5 h-5" />}
                    label="Date de naissance"
                    value={formatDate(profileData.dateNaissance)}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                  />
                  <InfoItem
                    icon={<MapPinIcon className="w-5 h-5" />}
                    label="Adresse"
                    value={profileData.adresse || '-'}
                    iconBg="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                  />
                </div>
              </div>

              {/* Medical Info Card */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center">
                    <BeakerIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Informations médicales</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                        <HeartIcon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Groupe sanguin</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {profileData.groupeSanguin || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Âge</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">
                      {age || '-'} {age && <span className="text-lg">ans</span>}
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-gradient-to-r from-orange-50 via-yellow-50 to-amber-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FireIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        💡 Conseil santé du jour
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        Pensez à boire au moins 1.5L d'eau par jour et à marcher 30 minutes pour rester en forme !
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Alerts */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alertes Santé</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Vaccin Tétanos à renouveler</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Dernière dose: Mars 2021</p>
                    </div>
                  </div>

                  {healthSummary.appointmentsThisMonth === 0 && (
                    <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Aucun RDV ce mois-ci</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Pensez à planifier un suivi médical</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Health Summary & Next Appointment */}
            <div className="lg:col-span-1 space-y-6">
              {/* Next Appointment */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
                    <ClockIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Prochain Rendez-vous</h3>
                </div>

                {healthSummary.nextAppointment ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <span className="text-white font-bold text-xl">
                          Dr. {healthSummary.nextAppointment.medecin?.nom?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          Dr. {healthSummary.nextAppointment.medecin?.prenom} {healthSummary.nextAppointment.medecin?.nom}
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                          {healthSummary.nextAppointment.medecin?.specialite}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <CalendarIcon className="w-5 h-5 text-blue-500" />
                        <p className="text-sm font-medium">
                          {formatDateTime(healthSummary.nextAppointment.dateHeure)}
                        </p>
                      </div>
                    </div>

                    <button className="w-full bg-blue-700 text-white rounded-xl py-3 font-medium hover:shadow-lg transition-all hover:scale-[1.02]">
                      Voir les détails
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-3xl flex items-center justify-center">
                      <CalendarIcon className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">Aucun rendez-vous prévu</p>
                    <button className="px-6 py-2 bg-blue-700 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                      Prendre un RDV
                    </button>
                  </div>
                )}
              </div>

              {/* This Month Stats */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center">
                    <CalendarDaysIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Ce mois-ci</h3>
                </div>

                <div className="text-center py-4">
                  <p className="text-7xl font-bold text-blue-700 dark:text-blue-500 mb-2">
                    {healthSummary.appointmentsThisMonth}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">Rendez-vous programmés</p>
                </div>
              </div>

              {/* Favorite Speciality */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Spécialité préférée</h3>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {healthSummary.mostConsultedSpeciality}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">La plus consultée</p>
                </div>
              </div>

              {/* Achievement Badge */}
              <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-white/20 dark:border-gray-700/50 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
                    <TrophyIcon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Badge Santé</h3>
                  <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent mb-2">
                    {healthScore >= 80 ? '🏆 Patient Exemplaire' : healthScore >= 60 ? '⭐ Patient Actif' : '💪 En Progression'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {healthScore >= 80
                      ? 'Vous êtes un modèle de suivi médical !'
                      : healthScore >= 60
                      ? 'Vous prenez soin de votre santé régulièrement.'
                      : 'Continuez vos efforts pour une meilleure santé !'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-3xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <PencilIcon className="w-6 h-6 text-white" />
                </div>
                Modifier mes informations
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditData(profileData);
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Prénom"
                value={editData.prenom}
                onChange={(e) => setEditData({ ...editData, prenom: e.target.value })}
                icon={<UserIcon className="w-5 h-5 text-gray-400" />}
              />
              <FormInput
                label="Nom"
                value={editData.nom}
                onChange={(e) => setEditData({ ...editData, nom: e.target.value })}
                icon={<UserIcon className="w-5 h-5 text-gray-400" />}
              />
              <FormInput
                label="Email"
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                icon={<EnvelopeIcon className="w-5 h-5 text-gray-400" />}
              />
              <FormInput
                label="Téléphone"
                type="tel"
                value={editData.telephone}
                onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
                icon={<PhoneIcon className="w-5 h-5 text-gray-400" />}
              />
              <FormInput
                label="Date de naissance"
                type="date"
                value={editData.dateNaissance}
                onChange={(e) => setEditData({ ...editData, dateNaissance: e.target.value })}
                icon={<CalendarIcon className="w-5 h-5 text-gray-400" />}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Groupe sanguin
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={editData.groupeSanguin}
                    onChange={(e) => setEditData({ ...editData, groupeSanguin: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Sélectionner</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div className="md:col-span-2">
                <FormInput
                  label="Adresse"
                  value={editData.adresse}
                  onChange={(e) => setEditData({ ...editData, adresse: e.target.value })}
                  icon={<MapPinIcon className="w-5 h-5 text-gray-400" />}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditData(profileData);
                  setError('');
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleEditProfile}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <LockClosedIcon className="w-6 h-6 text-white" />
                </div>
                Changer le mot de passe
              </h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-5">
              <FormInput
                label="Mot de passe actuel"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
              />
              <FormInput
                label="Nouveau mot de passe"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
              />
              <FormInput
                label="Confirmer le nouveau mot de passe"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                icon={<LockClosedIcon className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setError('');
                }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isSaving}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Modification...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-5 h-5" />
                    Confirmer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Health Card Modal */}
      {showHealthCardModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full p-8 animate-scale-in max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                  <ClipboardDocumentCheckIcon className="w-7 h-7 text-white" />
                </div>
                Mon Carnet Santé
              </h3>
              <button
                onClick={() => setShowHealthCardModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Groupe Sanguin & Info de base */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <HeartIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Groupe Sanguin</h4>
                </div>
                <p className="text-5xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {profileData.groupeSanguin || 'Non renseigné'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Âge: {age} ans • Né(e) le {formatDate(profileData.dateNaissance)}
                </p>
              </div>

              {/* Contact d'urgence */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <PhoneIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Contact d'urgence</h4>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {healthCard.contactUrgence.nom}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {healthCard.contactUrgence.relation}
                </p>
                <p className="text-sm font-mono font-semibold text-orange-600 dark:text-orange-400">
                  {healthCard.contactUrgence.telephone}
                </p>
              </div>

              {/* Allergies */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Allergies</h4>
                </div>
                <div className="space-y-2">
                  {healthCard.allergies.map((allergie, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{allergie}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Antécédents */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <DocumentTextIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Antécédents</h4>
                </div>
                <div className="space-y-2">
                  {healthCard.antecedents.map((antecedent, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{antecedent}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Médicaments actuels */}
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-900">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <BeakerIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Médicaments actuels</h4>
                </div>
                <div className="space-y-2">
                  {healthCard.medicamentsActuels.map((medicament, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{medicament}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vaccins */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <ShieldCheckIcon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Vaccinations</h4>
                </div>
                <div className="space-y-2">
                  {healthCard.vaccins.map((vaccin, index) => (
                    <div key={index} className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{vaccin.nom}</p>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          vaccin.statut === 'À jour'
                            ? 'bg-blue-500 text-white'
                            : 'bg-amber-500 text-white'
                        }`}>
                          {vaccin.statut}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Dernière dose: {formatDate(vaccin.date)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
              <button
                onClick={() => setShowHealthCardModal(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
              >
                Fermer
              </button>
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <PencilIcon className="w-5 h-5" />
                Modifier le carnet
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
};

// Helper Components
const InfoItem = ({ icon, label, value, iconBg, iconColor }) => (
  <div className="group flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-[1.02] cursor-pointer">
    <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
      <div className={iconColor}>{icon}</div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{value}</p>
    </div>
  </div>
);

const FormInput = ({ label, type = 'text', value, onChange, icon, placeholder }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      />
    </div>
  </div>
);

export default Profile;
