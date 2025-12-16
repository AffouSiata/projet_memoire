# 🚀 Guide de Démarrage Rapide - Frontend Medical Appointment

## ⚡ Installation et Configuration

### 1. Installation des dépendances (déjà fait)
```bash
cd medical-appointment-frontend
npm install
```

### 2. Vérifier que Tailwind est configuré
Les fichiers `tailwind.config.js` et `postcss.config.js` sont déjà créés ✅

### 3. Structure créée
Tous les dossiers sont prêts dans `src/` ✅

---

## 📝 Fichiers à Créer

Je vous ai préparé une base solide. Voici les fichiers essentiels à créer pour avoir une application fonctionnelle:

### 🔧 Services API

**`src/services/api.js`** - Configuration Axios de base
**`src/services/authService.js`** - Service d'authentification
**`src/services/patientService.js`** - Service Patient
**`src/services/medecinService.js`** - Service Médecin
**`src/services/adminService.js`** - Service Admin

### 🎯 Context

**`src/context/AuthContext.jsx`** - Gestion authentification
**`src/context/ThemeContext.jsx`** - Gestion thème clair/sombre

### 🛣️ Routes

**`src/routes/AppRoutes.jsx`** - Routes principales
**`src/routes/PrivateRoute.jsx`** - Routes protégées
**`src/routes/RoleBasedRoute.jsx`** - Routes par rôle

### 🧩 Composants Réutilisables

**`src/components/common/Header.jsx`**
**`src/components/common/Sidebar.jsx`**
**`src/components/common/Card.jsx`**
**`src/components/common/Button.jsx`**
**`src/components/common/Input.jsx`**
**`src/components/common/Modal.jsx`**
**`src/components/common/Loading.jsx`**
**`src/components/common/Alert.jsx`**

### 📄 Pages

#### Authentification
**`src/pages/auth/Login.jsx`**
**`src/pages/auth/Register.jsx`**

#### Patient
**`src/pages/patient/Dashboard.jsx`**
**`src/pages/patient/Appointments.jsx`**
**`src/pages/patient/BookAppointment.jsx`**
**`src/pages/patient/Profile.jsx`**
**`src/pages/patient/Settings.jsx`**

#### Médecin
**`src/pages/medecin/Dashboard.jsx`**
**`src/pages/medecin/Appointments.jsx`**
**`src/pages/medecin/Patients.jsx`**
**`src/pages/medecin/Notes.jsx`**

#### Admin
**`src/pages/admin/Dashboard.jsx`**
**`src/pages/admin/Patients.jsx`**
**`src/pages/admin/Medecins.jsx`**
**`src/pages/admin/Statistics.jsx`**

### 🎨 App Principal

**`src/App.jsx`** - Composant racine avec routing

---

## 🎯 Points Clés de l'Architecture

### 1. Authentification
- JWT stocké dans `localStorage`
- Auto-refresh des tokens
- Redirection selon le rôle
- Routes protégées

### 2. API Backend
```javascript
const API_URL = 'http://localhost:3002/api';
```

### 3. Rôles Utilisateurs
- `PATIENT` → Dashboard patient
- `MEDECIN` → Dashboard médecin
- `ADMIN` → Dashboard admin

### 4. Thème
- Mode clair par défaut
- Basculement clair/sombre
- Couleur d'accent personnalisable

### 5. Design System
```javascript
// Couleurs principales
primary: #3b82f6
success: #10b981
warning: #f59e0b
danger: #ef4444

// Classes Tailwind réutilisables
.btn-primary
.btn-secondary
.card
.input-field
```

---

## 🚀 Démarrage Rapide

### Option 1: Développement Complet (Recommandé)

Créez tous les fichiers listés ci-dessus en suivant l'architecture. Je vous ai préparé la structure complète dans `STRUCTURE.md`.

**Temps estimé:** 2-3 jours pour l'ensemble des 3 espaces complets

### Option 2: MVP Minimal

Pour tester rapidement, créez d'abord:
1. Services API (api.js, authService.js)
2. AuthContext
3. Routes de base
4. Page de login
5. Un dashboard simple pour chaque rôle

**Temps estimé:** 4-6 heures pour un MVP fonctionnel

---

## 📦 Commandes

```bash
# Démarrer le frontend (port 3000)
npm start

# Démarrer le backend (port 3002)
cd ../medical-appointment-api
npm run start:dev

# Accéder à l'application
http://localhost:3000
```

---

## 🔐 Comptes de Test

Utilisez ces comptes pour tester:

**Patient:**
- Email: marie.yao@example.com
- Password: password123

**Médecin:**
- Email: jean.kouadio@medical.com
- Password: password123

**Admin:**
- Email: admin@medical.com
- Password: password123

---

## 🎨 Exemple de Composant

### Card Réutilisable
```jsx
// src/components/common/Card.jsx
export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};
```

### Utilisation
```jsx
<Card title="Prochain Rendez-vous">
  <p>Dr. Kouadio - Cardiologie</p>
  <p className="text-sm text-gray-500">10/11/2025 à 10:00</p>
</Card>
```

---

## 📱 Responsive Design

Tous les composants doivent être responsive:
```jsx
// Mobile First
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Sidebar responsive
className="hidden md:block"  // Desktop
className="md:hidden"         // Mobile only
```

---

## 🎭 Animations

Utilisation des animations Tailwind configurées:
```jsx
className="animate-fade-in"    // Apparition en fondu
className="animate-slide-in"   // Glissement horizontal
className="animate-slide-up"   // Glissement vertical
```

---

## 🛠️ Outils de Développement

### React DevTools
Installez l'extension Chrome/Firefox pour débugger

### Tailwind CSS IntelliSense
Extension VS Code pour l'autocomplétion Tailwind

### ES7+ React Snippets
Pour créer rapidement des composants

---

## 📚 Documentation Utile

- **React:** https://react.dev
- **React Router:** https://reactrouter.com
- **Tailwind CSS:** https://tailwindcss.com
- **Axios:** https://axios-http.com
- **Recharts:** https://recharts.org

---

## ✅ Checklist de Développement

### Phase 1: Base (✅ Fait)
- [x] Configuration Tailwind
- [x] Structure de dossiers
- [x] Documentation

### Phase 2: Core (À faire)
- [ ] Services API complets
- [ ] AuthContext fonctionnel
- [ ] Routes protégées
- [ ] Page de login
- [ ] Composants de base

### Phase 3: Patient (À faire)
- [ ] Dashboard patient
- [ ] Prise de rendez-vous
- [ ] Historique
- [ ] Profil et paramètres

### Phase 4: Médecin (À faire)
- [ ] Dashboard médecin
- [ ] Gestion rendez-vous
- [ ] Gestion patients
- [ ] Notes médicales

### Phase 5: Admin (À faire)
- [ ] Dashboard admin
- [ ] Gestion utilisateurs
- [ ] Statistiques
- [ ] Configuration

### Phase 6: Polish (À faire)
- [ ] Animations fluides
- [ ] Tests responsive
- [ ] Optimisations
- [ ] Documentation finale

---

## 🆘 Besoin d'Aide?

1. Vérifiez `STRUCTURE.md` pour l'architecture complète
2. Consultez les exemples de code
3. Testez avec Postman/Insomnia les endpoints API
4. Utilisez React DevTools pour débugger

---

## 🎉 Prochaines Étapes

1. **Créez les services API** - Commencez par `api.js` et `authService.js`
2. **Implémentez l'AuthContext** - Gestion de l'état d'authentification
3. **Créez la page de login** - Première page fonctionnelle
4. **Testez l'authentification** - Connexion avec les comptes de test
5. **Développez les dashboards** - Un par rôle
6. **Étendez progressivement** - Ajoutez les autres pages

**Bon développement! 🚀**
