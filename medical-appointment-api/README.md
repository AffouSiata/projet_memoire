# API REST - Gestion de Rendez-vous Médicaux

API complète développée avec **NestJS**, **Prisma** et **PostgreSQL** pour la gestion de rendez-vous médicaux avec 3 espaces utilisateurs distincts : Patient, Médecin et Admin.

## 🚀 Technologies

- **Backend**: NestJS (Node.js)
- **ORM**: Prisma
- **Base de données**: PostgreSQL
- **Authentification**: JWT (Access Token + Refresh Token)
- **Validation**: class-validator / class-transformer
- **Upload de fichiers**: Multer
- **Email**: Nodemailer
- **SMS**: Twilio

## 📋 Prérequis

- Node.js (v18+)
- PostgreSQL (v14+)
- npm ou yarn

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd medical-appointment-api
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Modifier le fichier `.env` avec vos informations :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/medical_appointment_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Email (Nodemailer)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="Medical Appointment <noreply@medical-appointment.com>"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# App Config
PORT=3000
NODE_ENV="development"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

### 4. Créer la base de données

```bash
# Exécuter les migrations Prisma
npx prisma migrate dev --name init

# Générer le client Prisma
npx prisma generate
```

### 5. Lancer l'application

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000/api`

## 📚 Documentation de l'API

### Base URL

```
http://localhost:3000/api
```

### Authentification

Tous les endpoints (sauf `/auth/register` et `/auth/login`) nécessitent un token JWT dans le header :

```
Authorization: Bearer <access_token>
```

---

## 🔐 Authentification

### Inscription

```http
POST /api/auth/register
```

**Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean.dupont@example.com",
  "motDePasse": "password123",
  "role": "PATIENT",
  "telephone": "+33612345678",
  "dateNaissance": "1990-01-15",
  "adresse": "10 rue de la Paix, Paris",
  "specialite": "Cardiologue" // Seulement pour MEDECIN
}
```

### Connexion

```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "jean.dupont@example.com",
  "motDePasse": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "jean.dupont@example.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "role": "PATIENT"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Rafraîchir le token

```http
POST /api/auth/refresh
```

**Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### Déconnexion

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

---

## 👤 Espace Patient

### Profil

#### Récupérer son profil

```http
GET /api/patients/me
Authorization: Bearer <access_token>
```

#### Modifier son profil

```http
PATCH /api/patients/me
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+33612345678",
  "dateNaissance": "1990-01-15",
  "adresse": "10 rue de la Paix, Paris"
}
```

#### Changer de mot de passe

```http
PATCH /api/patients/me/password
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "ancienMotDePasse": "oldpassword",
  "nouveauMotDePasse": "newpassword123"
}
```

### Rendez-vous

#### Lister ses rendez-vous

```http
GET /api/patients/rendezvous?type=futur&page=1&limit=10
Authorization: Bearer <access_token>
```

**Query params:**
- `statut`: CONFIRME | EN_ATTENTE | ANNULE
- `medecinId`: UUID du médecin
- `type`: passe | futur | all
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre par page (défaut: 10)

#### Prendre rendez-vous

```http
POST /api/patients/rendezvous
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "medecinId": "uuid-medecin",
  "date": "2025-12-15T10:00:00Z",
  "motif": "Consultation générale"
}
```

### Notifications

#### Lister ses notifications

```http
GET /api/patients/notifications?lue=false&page=1&limit=20
Authorization: Bearer <access_token>
```

#### Marquer comme lues

```http
PATCH /api/patients/notifications/mark-as-read
Authorization: Bearer <access_token>
```

**Body (optionnel):**
```json
{
  "notificationIds": ["uuid1", "uuid2"]
}
```

### Préférences

#### Mettre à jour ses préférences

```http
PATCH /api/patients/preferences
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "preferencesNotifEmail": true,
  "preferencesNotifSms": true,
  "preferencesNotifPush": false,
  "theme": "SOMBRE",
  "couleurAccent": "#ff5733"
}
```

---

## 👨‍⚕️ Espace Médecin

### Profil

#### Récupérer son profil

```http
GET /api/medecins/me
Authorization: Bearer <access_token>
```

#### Modifier son profil

```http
PATCH /api/medecins/me
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "nom": "Martin",
  "prenom": "Sophie",
  "telephone": "+33612345678",
  "specialite": "Cardiologue"
}
```

### Rendez-vous

#### Lister ses rendez-vous

```http
GET /api/medecins/rendezvous?type=futur&statut=CONFIRME&page=1
Authorization: Bearer <access_token>
```

#### Modifier un rendez-vous

```http
PATCH /api/medecins/rendezvous/:id
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "statut": "ANNULE",
  "date": "2025-12-16T14:00:00Z"
}
```

### Patients

#### Lister ses patients

```http
GET /api/medecins/patients?page=1&limit=20
Authorization: Bearer <access_token>
```

### Notes médicales

#### Lister les notes

```http
GET /api/medecins/notes?patientId=uuid&statut=ACTIF
Authorization: Bearer <access_token>
```

#### Créer une note

```http
POST /api/medecins/notes
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "patientId": "uuid-patient",
  "contenu": "Patient en bonne santé générale..."
}
```

#### Modifier une note

```http
PATCH /api/medecins/notes/:id
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "contenu": "Mise à jour de la note...",
  "statut": "ARCHIVE"
}
```

#### Supprimer une note

```http
DELETE /api/medecins/notes/:id
Authorization: Bearer <access_token>
```

#### Ajouter une pièce jointe

```http
POST /api/medecins/notes/:id/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- `file`: Fichier (PDF, JPEG, PNG, DOC, DOCX - max 5MB)

### Créneaux disponibles (TimeSlots)

#### Lister ses créneaux

```http
GET /api/medecins/timeslots?jour=LUNDI
Authorization: Bearer <access_token>
```

#### Créer un créneau

```http
POST /api/medecins/timeslots
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "jour": "LUNDI",
  "heureDebut": "09:00",
  "heureFin": "09:30",
  "isAvailable": true
}
```

#### Créer plusieurs créneaux

```http
POST /api/medecins/timeslots/bulk
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "timeslots": [
    { "jour": "LUNDI", "heureDebut": "09:00", "heureFin": "09:30" },
    { "jour": "LUNDI", "heureDebut": "09:30", "heureFin": "10:00" }
  ]
}
```

#### Générer créneaux automatiquement

```http
POST /api/medecins/timeslots/generate
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "jours": ["LUNDI", "MARDI", "MERCREDI"],
  "heureDebut": "09:00",
  "heureFin": "18:00",
  "dureeSlot": 30
}
```

#### Modifier un créneau

```http
PATCH /api/medecins/timeslots/:id
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "isAvailable": false
}
```

#### Supprimer un créneau

```http
DELETE /api/medecins/timeslots/:id
Authorization: Bearer <access_token>
```

---

## 🔧 Espace Admin

### Patients

#### Lister les patients

```http
GET /api/admin/patients?search=dupont&isActive=true&page=1
Authorization: Bearer <access_token>
```

#### Activer/désactiver un patient

```http
PATCH /api/admin/patients/:id
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "isActive": false
}
```

### Médecins

#### Lister les médecins

```http
GET /api/admin/medecins?specialite=Cardiologue&isActive=true
Authorization: Bearer <access_token>
```

#### Activer/désactiver un médecin

```http
PATCH /api/admin/medecins/:id
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "isActive": false
}
```

### Rendez-vous

#### Lister tous les rendez-vous

```http
GET /api/admin/rendezvous?statut=EN_ATTENTE&page=1
Authorization: Bearer <access_token>
```

#### Modifier un rendez-vous

```http
PATCH /api/admin/rendezvous/:id
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "statut": "CONFIRME"
}
```

### Statistiques

#### Récupérer les statistiques

```http
GET /api/admin/statistiques
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "utilisateurs": {
    "patients": { "total": 150, "actifs": 120 },
    "medecins": { "total": 20, "actifs": 18 }
  },
  "rendezVous": {
    "total": 500,
    "parStatut": [
      { "statut": "CONFIRME", "count": 300 },
      { "statut": "EN_ATTENTE", "count": 150 },
      { "statut": "ANNULE", "count": 50 }
    ],
    "tauxAnnulation": 10.00,
    "parMedecin": [...],
    "parSpecialite": [...]
  }
}
```

---

## 🕒 Créneaux publics

### Voir les créneaux disponibles d'un médecin

```http
GET /api/timeslots/:medecinId?jour=LUNDI
```

Pas besoin d'authentification pour cet endpoint.

---

## 📂 Structure du projet

```
medical-appointment-api/
├── prisma/
│   ├── schema.prisma          # Schéma Prisma
│   └── migrations/            # Migrations
├── src/
│   ├── admin/                 # Module Admin
│   ├── auth/                  # Module Authentification
│   ├── common/                # Guards, Filters, Decorators
│   ├── medecins/              # Module Médecin
│   ├── notifications/         # Module Notifications
│   ├── patients/              # Module Patient
│   ├── prisma/                # Module Prisma
│   ├── timeslots/             # Module TimeSlots
│   ├── upload/                # Configuration Multer
│   └── main.ts                # Point d'entrée
├── uploads/                   # Dossier uploads
├── .env                       # Variables d'environnement
└── README.md
```

## 🔒 Sécurité

- Tous les mots de passe sont hashés avec bcrypt
- JWT tokens avec expiration
- Refresh tokens pour session longue durée
- Guards NestJS pour protection des routes
- Validation des données avec class-validator
- Gestion centralisée des erreurs

## 📧 Notifications

L'API envoie automatiquement des notifications par **email** et **SMS** selon les préférences utilisateur :

- Confirmation de rendez-vous
- Annulation de rendez-vous
- Rappel de rendez-vous
- Changement d'horaire

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture
npm run test:cov
```

## 📝 License

MIT

## 👥 Auteur

Projet créé pour la gestion de rendez-vous médicaux
