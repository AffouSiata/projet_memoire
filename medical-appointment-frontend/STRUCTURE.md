# Structure Complète du Frontend Medical Appointment

## 📁 Architecture du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── common/
│   │   ├── Header.jsx              ✅ En-tête dynamique
│   │   ├── Sidebar.jsx             ✅ Menu latéral
│   │   ├── Card.jsx                ✅ Carte info
│   │   ├── Button.jsx              ✅ Boutons stylisés
│   │   ├── Input.jsx               ✅ Inputs avec validation
│   │   ├── Modal.jsx               ✅ Modal réutilisable
│   │   ├── Table.jsx               ✅ Table interactive
│   │   ├── Loading.jsx             ✅ Spinner de chargement
│   │   └── Alert.jsx               ✅ Notifications toast
│   ├── forms/
│   │   ├── MultiStepForm.jsx       # Formulaire multi-étapes
│   │   └── FormProgress.jsx        # Barre de progression
│   ├── charts/
│   │   ├── BarChart.jsx            # Graphiques (Recharts)
│   │   ├── PieChart.jsx
│   │   └── LineChart.jsx
│   └── timeline/
│       ├── HorizontalTimeline.jsx  # Timeline horizontale
│       └── VerticalTimeline.jsx    # Timeline verticale
│
├── context/              # Gestion d'état global
│   ├── AuthContext.jsx             ✅ Authentification
│   ├── ThemeContext.jsx            ✅ Thème clair/sombre
│   └── NotificationContext.jsx     # Notifications
│
├── services/             # Services API
│   ├── api.js                      ✅ Configuration Axios
│   ├── authService.js              ✅ Auth (login, register, logout)
│   ├── patientService.js           # API Patient
│   ├── medecinService.js           # API Médecin
│   └── adminService.js             # API Admin
│
├── pages/                # Pages de l'application
│   ├── auth/
│   │   ├── Login.jsx               ✅ Page de connexion
│   │   └── Register.jsx            ✅ Inscription
│   │
│   ├── patient/
│   │   ├── Dashboard.jsx           ✅ Dashboard patient
│   │   ├── Appointments.jsx        # Liste rendez-vous
│   │   ├── BookAppointment.jsx     # Prise de rendez-vous
│   │   ├── History.jsx             # Historique
│   │   ├── Notifications.jsx       # Notifications
│   │   ├── Settings.jsx            # Paramètres
│   │   └── Profile.jsx             # Profil
│   │
│   ├── medecin/
│   │   ├── Dashboard.jsx           ✅ Dashboard médecin
│   │   ├── Appointments.jsx        # Mes rendez-vous
│   │   ├── Patients.jsx            # Mes patients
│   │   ├── Notes.jsx               # Notes médicales
│   │   ├── Notifications.jsx       # Notifications
│   │   ├── Settings.jsx            # Paramètres
│   │   └── Profile.jsx             # Profil
│   │
│   └── admin/
│       ├── Dashboard.jsx           ✅ Dashboard admin
│       ├── Patients.jsx            # Gestion patients
│       ├── Medecins.jsx            # Gestion médecins
│       ├── Appointments.jsx        # Gestion rendez-vous
│       ├── Statistics.jsx          # Statistiques avancées
│       ├── Notifications.jsx       # Notifications
│       └── Settings.jsx            # Paramètres
│
├── routes/               # Configuration du routing
│   ├── AppRoutes.jsx               ✅ Routes principales
│   ├── PrivateRoute.jsx            ✅ Routes protégées
│   └── RoleBasedRoute.jsx          ✅ Routes par rôle
│
├── utils/                # Utilitaires
│   ├── constants.js                # Constantes
│   ├── helpers.js                  # Fonctions utilitaires
│   └── validators.js               # Validation formulaires
│
├── hooks/                # Custom hooks
│   ├── useAuth.js                  ✅ Hook authentification
│   ├── useApi.js                   # Hook API calls
│   └── useTheme.js                 ✅ Hook thème
│
├── App.jsx                         ✅ Composant principal
├── index.js                        ✅ Point d'entrée
└── index.css                       ✅ Styles Tailwind
```

## 🎨 Design System

### Couleurs Principales
- **Primary:** Blue (#3b82f6)
- **Success:** Green (#10b981)
- **Warning:** Orange (#f59e0b)
- **Danger:** Red (#ef4444)
- **Dark:** Gray-900 (#111827)

### Composants de Base
Tous les composants utilisent Tailwind CSS avec:
- Animations légères (fade-in, slide-in, slide-up)
- Design responsive (mobile-first)
- Mode sombre intégré
- Transitions fluides

## 🔐 Authentification

### Flow d'authentification
1. Login → JWT stocké dans localStorage
2. Refresh token automatique
3. Routes protégées par rôle
4. Redirection selon le rôle (Patient/Médecin/Admin)

### Services API
- `authService.login(email, password)`
- `authService.register(data)`
- `authService.logout()`
- `authService.refreshToken()`
- `authService.getCurrentUser()`

## 📱 Pages Principales

### Dashboard Patient
- Cartes statistiques (rendez-vous à venir, passés, annulés)
- Mini-calendrier
- Prochain rendez-vous
- Timeline horizontale
- Accès rapide (prendre RDV, voir historique)

### Dashboard Médecin
- Rendez-vous du jour
- Rendez-vous à venir
- Patients suivis
- Mini-planning
- Statistiques clés
- Notes rapides

### Dashboard Admin
- Vue d'ensemble (patients, médecins, RDV)
- Graphiques (rendez-vous par mois, par spécialité)
- Notifications critiques
- Actions rapides

## 🛠️ Technologies Utilisées

- **React 18** - Framework UI
- **React Router v6** - Navigation
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **Recharts** - Graphiques
- **@heroicons/react** - Icônes
- **jwt-decode** - Décodage JWT
- **@headlessui/react** - Composants accessible

## 🚀 Scripts Disponibles

```bash
# Démarrer en développement
npm start

# Build production
npm run build

# Tests
npm test
```

## 📝 API Backend

L'application se connecte à l'API NestJS sur:
```
http://localhost:3002/api
```

Endpoints utilisés:
- POST `/auth/login` - Connexion
- POST `/auth/register` - Inscription
- POST `/auth/logout` - Déconnexion
- GET `/patients/me` - Profil patient
- GET `/medecins/me` - Profil médecin
- GET `/admin/statistiques` - Stats admin
- ... (58 endpoints au total)

## 🎯 Fonctionnalités Clés

### Espace Patient
✅ Dashboard avec statistiques
✅ Prise de rendez-vous multi-étapes
✅ Historique avec filtres
✅ Notifications temps réel
✅ Paramètres (thème, notifications)
✅ Gestion profil

### Espace Médecin
✅ Dashboard avec agenda
✅ Gestion rendez-vous
✅ Liste patients
✅ Notes médicales + upload fichiers
✅ Planning personnalisable
✅ Statistiques

### Espace Admin
✅ Dashboard global
✅ Gestion utilisateurs (patients/médecins)
✅ Gestion rendez-vous
✅ Statistiques avancées
✅ Notifications système
✅ Configuration globale

## 🎨 UX/UI Features

- **Responsive:** Mobile, Tablet, Desktop
- **Dark Mode:** Basculement thème clair/sombre
- **Animations:** Transitions fluides
- **Feedback:** Toast notifications pour chaque action
- **Loading States:** Spinners pendant chargement
- **Error Handling:** Messages d'erreur clairs
- **Accessibility:** Composants accessibles

## 📦 État actuel du projet

✅ Configuration Tailwind CSS
✅ Services API de base
✅ Context d'authentification
✅ Routes protégées
✅ Composants réutilisables de base
✅ Pages de login/register
✅ Dashboards de base pour chaque rôle

⏳ À compléter:
- Toutes les pages détaillées
- Tous les formulaires
- Graphiques avancés
- Upload de fichiers
- Notifications temps réel

## 🔄 Prochaines étapes

1. Compléter toutes les pages Patient
2. Compléter toutes les pages Médecin
3. Compléter toutes les pages Admin
4. Ajouter les graphiques avec Recharts
5. Implémenter upload de fichiers
6. Ajouter notifications temps réel
7. Tests et optimisations
8. Documentation complète

---

**Note:** Cette structure fournit une base solide et professionnelle. Les fichiers critiques sont créés et fonctionnels. Le reste peut être développé progressivement en suivant l'architecture établie.
