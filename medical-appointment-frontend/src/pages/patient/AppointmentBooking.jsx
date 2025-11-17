import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/layout/PatientLayout';
import patientService from '../../services/patientService';
import axios from 'axios';
import {
  CalendarIcon,
  ClockIcon,
  UserIcon,
  HeartIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import AlertModal from '../../components/modals/AlertModal';

const AppointmentBooking = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // Will store full Date object
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const specialties = [
    { id: 1, nameKey: 'booking.specialties.cardiology', icon: '🫀', color: 'secondary-500', popular: true },
    { id: 2, nameKey: 'booking.specialties.pediatrics', icon: '👶', color: 'primary-400', popular: true },
    { id: 3, nameKey: 'booking.specialties.dermatology', icon: '🩺', color: 'secondary-500', popular: false },
    { id: 4, nameKey: 'booking.specialties.neurology', icon: '🧠', color: 'primary-400', popular: false },
    { id: 5, nameKey: 'booking.specialties.ophthalmology', icon: '👁️', color: 'secondary-500', popular: true },
    { id: 6, nameKey: 'booking.specialties.dentistry', icon: '🦷', color: 'primary-400', popular: false },
  ];

  // Récupérer les médecins depuis l'API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3002/api/patients/medecins', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transformer les données pour correspondre au format attendu
        const transformedDoctors = response.data.map(doc => ({
          id: doc.id,
          name: `Dr. ${doc.prenom} ${doc.nom}`,
          specialty: doc.specialite,
          specialtyName: doc.specialite,
          rating: 4.8, // Valeur par défaut
          experience: `10 ${t('booking.years')}`, // Valeur par défaut
          avatar: `${doc.prenom[0]}${doc.nom[0]}`
        }));

        setDoctors(transformedDoctors);
        setIsLoadingDoctors(false);
      } catch (error) {
        console.error('Erreur lors du chargement des médecins:', error);
        setIsLoadingDoctors(false);

        if (error.response?.status === 401) {
          logout();
          navigate('/login');
        }
      }
    };

    fetchDoctors();
  }, [logout, navigate]);

  // Convertir une date en jour de la semaine (format backend)
  const getDayOfWeek = (date) => {
    if (!date) return null;
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    // date is already a Date object from the calendar selection
    const dateObj = date instanceof Date ? date : new Date(date);
    const dayIndex = dateObj.getDay();
    const dayName = days[dayIndex];

    console.log('🗓️ Conversion date → jour:', {
      dateInput: date,
      dateObject: dateObj,
      dayIndex,
      dayName,
      fullDate: dateObj.toLocaleDateString('fr-FR')
    });

    return dayName;
  };

  // Générer les créneaux horaires disponibles à partir des TimeSlots
  const generateTimeSlots = (timeSlotRanges) => {
    const slots = [];
    const slotDuration = 30; // Créneaux de 30 minutes pour correspondre aux TimeSlots de la BDD

    console.log('🕐 Génération de créneaux depuis:', timeSlotRanges);

    timeSlotRanges.forEach(range => {
      const [startHour, startMin] = range.heureDebut.split(':').map(Number);
      const [endHour, endMin] = range.heureFin.split(':').map(Number);

      // Convertir en minutes totales pour faciliter le calcul
      let currentMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      while (currentMinutes < endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const mins = currentMinutes % 60;
        const timeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        slots.push(timeString);

        currentMinutes += slotDuration;
      }
    });

    console.log('✅ Créneaux générés:', slots);

    return slots;
  };

  // Récupérer les créneaux horaires quand le médecin et la date sont sélectionnés
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }

      try {
        setIsLoadingTimeSlots(true);
        const dayOfWeek = getDayOfWeek(selectedDate);

        console.log('📋 Récupération des créneaux pour:', {
          doctorId: selectedDoctor, // selectedDoctor est déjà l'ID
          selectedDate,
          dayOfWeek
        });

        // Récupérer les timeSlots du médecin pour ce jour
        const response = await patientService.getDoctorTimeSlots(selectedDoctor, dayOfWeek);

        console.log('✅ Réponse API:', {
          responseData: response.data,
          keys: Object.keys(response.data),
          dayOfWeekData: response.data[dayOfWeek]
        });

        const timeSlotsForDay = response.data[dayOfWeek] || [];

        console.log('🕐 Créneaux pour ce jour:', {
          count: timeSlotsForDay.length,
          samples: timeSlotsForDay.slice(0, 3)
        });

        if (timeSlotsForDay.length === 0) {
          console.warn('⚠️ Aucun créneau trouvé pour le jour:', dayOfWeek);
          setAvailableTimeSlots([]);
          setIsLoadingTimeSlots(false);
          return;
        }

        // Générer les créneaux horaires
        const generatedSlots = generateTimeSlots(timeSlotsForDay);

        // Récupérer les rendez-vous déjà pris pour ce médecin à cette date
        try {
          const appointmentsResponse = await axios.get(
            'http://localhost:3002/api/patients/rendezvous',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
              }
            }
          );

          const allAppointments = appointmentsResponse.data.data || [];

          // Filtrer les rendez-vous du médecin sélectionné à la date sélectionnée
          // qui sont confirmés ou en attente (pas annulés)
          const bookedTimes = allAppointments
            .filter(apt => {
              const aptDate = new Date(apt.date);
              const selDate = new Date(selectedDate);

              return apt.medecinId === selectedDoctor && // selectedDoctor est déjà l'ID
                     aptDate.toDateString() === selDate.toDateString() &&
                     (apt.statut === 'CONFIRME' || apt.statut === 'EN_ATTENTE');
            })
            .map(apt => {
              const aptDate = new Date(apt.date);
              const hours = String(aptDate.getHours()).padStart(2, '0');
              const minutes = String(aptDate.getMinutes()).padStart(2, '0');
              return `${hours}:${minutes}`;
            });

          setBookedSlots(bookedTimes);

          // Optionnel : filtrer complètement les créneaux réservés au lieu de les désactiver
          // const availableSlots = generatedSlots.filter(slot => !bookedTimes.includes(slot));
          // setAvailableTimeSlots(availableSlots);

          setAvailableTimeSlots(generatedSlots);
        } catch (err) {
          console.error('Erreur lors de la récupération des rendez-vous:', err);
          // En cas d'erreur, afficher quand même tous les créneaux
          setAvailableTimeSlots(generatedSlots);
          setBookedSlots([]);
        }

        setIsLoadingTimeSlots(false);
      } catch (error) {
        console.error('Erreur lors du chargement des créneaux:', error);
        setAvailableTimeSlots([]);
        setIsLoadingTimeSlots(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDoctor, selectedDate]);

  const steps = [
    { number: 1, titleKey: 'booking.steps.specialty', icon: HeartIcon },
    { number: 2, titleKey: 'booking.steps.doctor', icon: UserIcon },
    { number: 3, titleKey: 'booking.steps.dateTime', icon: CalendarIcon },
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);
      const selectedSpecialtyData = specialties.find(s => s.id === selectedSpecialty);

      // Créer une date complète pour le rendez-vous
      // selectedDate is already a Date object with the correct day/month/year
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(
        parseInt(selectedTime.split(':')[0]),
        parseInt(selectedTime.split(':')[1]),
        0,
        0
      );

      console.log('📅 Création du rendez-vous:', {
        selectedDate,
        selectedTime,
        appointmentDate: appointmentDate.toISOString(),
        medecinId: selectedDoctor
      });

      const response = await axios.post(
        'http://localhost:3002/api/patients/rendezvous',
        {
          medecinId: selectedDoctor,
          date: appointmentDate.toISOString(),
          motif: 'Consultation'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setIsSubmitting(false);

      // Afficher le modal de succès
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      setIsSubmitting(false);

      // Si erreur 401, le token a expiré - rediriger vers login
      if (error.response?.status === 401) {
        setErrorMessage(t('booking.errors.sessionExpired') || 'Votre session a expiré. Veuillez vous reconnecter.');
        setShowErrorModal(true);
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        setErrorMessage(t('booking.errors.createError') || 'Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer.');
        setShowErrorModal(true);
      }
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedSpecialty !== null;
      case 2: return selectedDoctor !== null;
      case 3: return selectedDate !== null && selectedTime !== null;
      default: return false;
    }
  };

  // Filtrer les médecins par spécialité sélectionnée
  const filteredDoctors = selectedSpecialty
    ? doctors.filter(doc => {
        const selectedSpec = specialties.find(s => s.id === selectedSpecialty);
        return doc.specialty === t(selectedSpec?.nameKey);
      })
    : doctors;

  return (
    <PatientLayout>
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Patterns de fond animés ultra-modernes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blobs animés avec plus d'effets */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-secondary-300/15 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

        {/* Particules flottantes */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-secondary-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary-400 rounded-full animate-float opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-secondary-500 rounded-full animate-float opacity-60 animation-delay-4000"></div>
        <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-primary-400 rounded-full animate-float opacity-50"></div>
        <div className="absolute bottom-1/3 left-2/3 w-3 h-3 bg-secondary-400 rounded-full animate-float opacity-60 animation-delay-2000"></div>

        {/* Grille de points animée */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, #14B8A6 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-8">
        {/* Header ultra-moderne */}
        <div className="mb-12 animate-scale-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-secondary-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-soft"></div>
              <div className="relative w-16 h-16 bg-secondary-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <CalendarIcon className="w-8 h-8 text-white animate-pulse-soft" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-black text-secondary-500 mb-2">
                {t('booking.title')}
              </h1>
              <p className="text-gray-600 dark:text-white text-lg font-medium">
                ✨ {t('booking.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps - Ultra moderne */}
        <div className="mb-12">
          <div className="relative">
            {/* Progress Line Background */}
            <div className="absolute top-8 left-0 w-full h-2 bg-gray-200 rounded-full"></div>

            {/* Progress Line Active avec effet glow */}
            <div
              className="absolute top-8 left-0 h-2 rounded-full transition-all duration-500 bg-secondary-500 shadow-lg"
              style={{
                width: `${((currentStep - 1) / 2) * 100}%`,
                boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)'
              }}
            ></div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep >= step.number;
                const isCurrent = currentStep === step.number;

                return (
                  <div key={step.number} className="flex flex-col items-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="relative group">
                      {/* Glow effect pour l'étape active */}
                      {isActive && (
                        <div className="absolute inset-0 bg-secondary-500 rounded-full blur-xl opacity-60 animate-pulse-soft"></div>
                      )}

                      {/* Step circle */}
                      <div
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                          isActive
                            ? 'bg-secondary-500 shadow-2xl scale-110'
                            : 'bg-white dark:bg-gray-800 border-3 border-gray-300 dark:border-gray-700 hover:border-secondary-300 hover:scale-105'
                        } ${isCurrent ? 'ring-4 ring-secondary-300 ring-opacity-50 animate-pulse-soft' : ''}`}
                      >
                        <Icon className={`w-9 h-9 transition-all duration-300 ${isActive ? 'text-white animate-pulse-soft' : 'text-gray-400 dark:text-gray-300 group-hover:text-secondary-500'}`} />

                        {/* Checkmark pour les étapes complétées */}
                        {isActive && !isCurrent && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                            <CheckIcon className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step title */}
                    <p className={`mt-4 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? 'text-secondary-600'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {t(step.titleKey)}
                    </p>

                    {/* Step number */}
                    {isCurrent && (
                      <div className="mt-1 px-3 py-1 bg-secondary-500 rounded-full text-white text-xs font-bold animate-pulse-soft">
                        {t('booking.steps.step')} {step.number}/3
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 min-h-[500px]">
          {/* Step 1: Specialty Selection */}
          {currentStep === 1 && (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('booking.specialties.title')}
              </h2>
              <p className="text-gray-600 dark:text-white mb-8">
                {t('booking.specialties.description')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialties.map((specialty, index) => (
                  <div
                    key={specialty.id}
                    onClick={() => setSelectedSpecialty(specialty.id)}
                    className={`relative cursor-pointer group animate-slide-up`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glow effect pour la carte sélectionnée */}
                    {selectedSpecialty === specialty.id && (
                      <div className={`absolute inset-0 bg-${specialty.color} rounded-3xl blur-2xl opacity-40 animate-pulse-soft`}></div>
                    )}

                    <div className={`relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                      selectedSpecialty === specialty.id
                        ? `border-transparent shadow-2xl scale-105 bg-${specialty.color}/10`
                        : `border-gray-200 dark:border-gray-700 hover:border-${specialty.color} hover:-translate-y-2`
                    }`}>
                      {/* Badge "Populaire" avec shimmer effect */}
                      {specialty.popular && (
                        <div className="absolute -top-3 -right-3 bg-primary-400 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-xl animate-pulse-soft">
                          <StarIcon className="w-3 h-3 animate-pulse" />
                          {t('booking.specialties.popular')}
                        </div>
                      )}

                      {/* Icône de spécialité avec glow */}
                      <div className="relative mb-4">
                        {selectedSpecialty === specialty.id && (
                          <div className={`absolute inset-0 bg-${specialty.color} rounded-2xl blur-xl opacity-60`}></div>
                        )}
                        <div className={`relative w-20 h-20 bg-${specialty.color} rounded-2xl flex items-center justify-center text-4xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                          {specialty.icon}
                        </div>
                      </div>

                      {/* Nom de la spécialité */}
                      <h3 className={`text-xl font-black mb-2 transition-all duration-300 ${
                        selectedSpecialty === specialty.id
                          ? `text-${specialty.color}`
                          : `text-gray-900 dark:text-white group-hover:text-${specialty.color}`
                      }`}>
                        {t(specialty.nameKey)}
                      </h3>

                      {/* Checkmark pour la sélection */}
                      {selectedSpecialty === specialty.id && (
                        <div className="mt-4 flex items-center gap-2 animate-scale-in">
                          <div className="relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-50"></div>
                            <div className="relative bg-green-500 rounded-full p-1">
                              <CheckCircleIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <span className="text-sm font-bold text-green-600">{t('booking.specialties.selected')}</span>
                        </div>
                      )}

                      {/* Effet shimmer au hover */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Doctor Selection */}
          {currentStep === 2 && (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('booking.doctors.title')}
              </h2>
              <p className="text-gray-600 dark:text-white mb-8">
                {filteredDoctors.length} {t('booking.doctors.available')} {t(specialties.find(s => s.id === selectedSpecialty)?.nameKey)}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`cursor-pointer group ${
                      selectedDoctor === doctor.id
                        ? 'ring-4 ring-secondary-500'
                        : ''
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-secondary-500 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {doctor.avatar}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white dark:bg-gray-800 rounded-full"></div>
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-white mb-2">
                            {doctor.specialty}
                          </p>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium">{doctor.rating}</span>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400">
                              {doctor.experience} {t('booking.doctors.experience')}
                            </div>
                          </div>

                          {selectedDoctor === doctor.id && (
                            <div className="mt-3 flex items-center gap-2 text-secondary-600">
                              <CheckCircleIcon className="w-5 h-5" />
                              <span className="text-sm font-medium">{t('booking.doctors.selected')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <div className="animate-scale-in">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('booking.dateTime.title')}
              </h2>
              <p className="text-gray-600 dark:text-white mb-8">
                {t('booking.dateTime.description')}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {t('booking.dateTime.selectDate')}
                  </h3>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
                    <div className="grid grid-cols-7 gap-2">
                      {[
                        t('booking.dateTime.days.sun'),
                        t('booking.dateTime.days.mon'),
                        t('booking.dateTime.days.tue'),
                        t('booking.dateTime.days.wed'),
                        t('booking.dateTime.days.thu'),
                        t('booking.dateTime.days.fri'),
                        t('booking.dateTime.days.sat')
                      ].map(day => (
                        <div key={day} className="text-center text-sm font-bold text-gray-600 dark:text-white py-2">
                          {day}
                        </div>
                      ))}
                      {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        // Create a proper Date object for this day
                        const today = new Date();
                        const dateObj = new Date(today.getFullYear(), today.getMonth(), day);
                        const isSelected = selectedDate &&
                          selectedDate.getDate() === day &&
                          selectedDate.getMonth() === today.getMonth() &&
                          selectedDate.getFullYear() === today.getFullYear();
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(dateObj)}
                            className={`aspect-square rounded-xl text-sm font-medium transition-all duration-300 ${
                              isSelected
                                ? 'bg-primary-400 text-white scale-110 shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white hover:bg-primary-50 dark:hover:bg-gray-700 hover:scale-105'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    {t('booking.dateTime.availableSlots')}
                  </h3>

                  {isLoadingTimeSlots ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-500"></div>
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
                      <ClockIcon className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                      <p className="text-amber-700 dark:text-amber-300 font-medium">
                        {selectedDate
                          ? "Aucun créneau disponible pour ce jour. Le médecin ne consulte pas ce jour-là."
                          : "Sélectionnez une date pour voir les créneaux disponibles"}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {availableTimeSlots.map((time) => {
                        const isSelected = selectedTime === time;
                        const isBooked = bookedSlots.includes(time);

                        return (
                          <button
                            key={time}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            disabled={isBooked}
                            className={`p-4 rounded-xl font-medium transition-all duration-300 ${
                              isBooked
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                                : isSelected
                                ? 'bg-secondary-500 text-white scale-105 shadow-lg'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-2 border-gray-200 dark:border-gray-700 hover:border-secondary-500 hover:scale-105'
                            }`}
                          >
                            <ClockIcon className="w-5 h-5 mx-auto mb-1" />
                            {time}
                            {isBooked && <span className="block text-xs mt-1">Réservé</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-2 border-gray-300 dark:border-gray-700 hover:scale-105 hover:shadow-lg'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
              {t('booking.navigation.previous')}
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                  canProceed()
                    ? 'bg-secondary-500 text-white hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('booking.navigation.next')}
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                  canProceed() && !isSubmitting
                    ? 'bg-green-500 text-white hover:scale-105 hover:shadow-2xl'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <CheckCircleIcon className="w-5 h-5" />
                {isSubmitting ? t('booking.navigation.creating') : t('booking.navigation.confirm')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Modal de succès */}
    {showSuccessModal && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center animate-scale-in">
        {/* Overlay sombre */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => {
            setShowSuccessModal(false);
            navigate('/patient/dashboard');
          }}
        ></div>

        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-slide-up">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 animate-pulse-soft"></div>
              <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircleIcon className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Titre */}
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-4">
            {t('booking.successModal.title')}
          </h2>

          {/* Message */}
          <p className="text-center text-slate-600 dark:text-white mb-8 leading-relaxed">
            {t('booking.successModal.message')}
          </p>

          {/* Bouton d'action */}
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/patient/dashboard');
            }}
            className="w-full relative group/btn px-6 py-3 rounded-2xl overflow-hidden bg-green-500 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-green-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-2">
              {t('booking.successModal.button')}
            </div>
          </button>
        </div>
      </div>
    )}

    {/* Modal Erreur */}
    <AlertModal
      isOpen={showErrorModal}
      onClose={() => setShowErrorModal(false)}
      title={t('common.error')}
      message={errorMessage}
      buttonText={t('common.close')}
      type="error"
    />
    </PatientLayout>
  );
};

export default AppointmentBooking;
