# MEMOIRE DE FIN D'ETUDES

## Conception et Realisation d'une Application Web de Gestion des Rendez-vous Medicaux

---

# SOMMAIRE

1. [Introduction Generale](#introduction-generale)
2. [Contexte et Problematique](#contexte-et-problematique)
3. [Objectifs du Projet](#objectifs-du-projet)
4. [Analyse des Besoins](#analyse-des-besoins)
5. [Architecture du Systeme](#architecture-du-systeme)
6. [Technologies Utilisees](#technologies-utilisees)
7. [Conception de la Base de Donnees](#conception-de-la-base-de-donnees)
8. [Implementation](#implementation)
9. [Fonctionnalites Realisees](#fonctionnalites-realisees)
10. [Interface Utilisateur](#interface-utilisateur)
11. [Securite](#securite)
12. [Tests et Validation](#tests-et-validation)
13. [Deploiement](#deploiement)
14. [Conclusion et Perspectives](#conclusion-et-perspectives)
15. [Annexes](#annexes)

---

# CHAPITRE 1 : INTRODUCTION GENERALE

## 1.1 Presentation du Sujet

Dans le contexte actuel de la digitalisation des services de sante, la gestion efficace des rendez-vous medicaux constitue un enjeu majeur pour les etablissements de soins. Ce memoire presente la conception et la realisation d'une application web moderne permettant de gerer les rendez-vous entre patients et medecins, avec une supervision administrative complete.

## 1.2 Motivation du Choix

Le choix de ce sujet est motive par :
- La necessite d'optimiser la gestion du temps dans les cabinets medicaux
- La reduction des rendez-vous manques grace aux notifications automatiques
- L'amelioration de l'experience patient dans le parcours de soins
- La centralisation des informations medicales pour un meilleur suivi

## 1.3 Structure du Memoire

Ce memoire est structure en plusieurs chapitres couvrant l'ensemble du cycle de developpement : de l'analyse des besoins jusqu'au deploiement en production.

---

# CHAPITRE 2 : CONTEXTE ET PROBLEMATIQUE

## 2.1 Contexte General

La gestion des rendez-vous medicaux traditionnelle presente plusieurs limites :
- Prise de rendez-vous par telephone, souvent chronophage
- Gestion manuelle des plannings entrainant des erreurs
- Manque de rappels automatises aux patients
- Difficulte de suivi de l'historique des consultations

## 2.2 Problematique

**Comment concevoir et realiser une application web permettant d'automatiser et d'optimiser la gestion des rendez-vous medicaux tout en offrant une experience utilisateur moderne et intuitive ?**

## 2.3 Enjeux

### Enjeux Techniques
- Performance et scalabilite de l'application
- Securite des donnees medicales sensibles
- Compatibilite multi-plateformes (responsive design)

### Enjeux Fonctionnels
- Facilite d'utilisation pour tous les profils d'utilisateurs
- Fiabilite du systeme de notifications
- Gestion efficace des creneaux horaires

### Enjeux Organisationnels
- Reduction du temps de gestion administrative
- Amelioration de la communication medecin-patient
- Traçabilite des operations

---

# CHAPITRE 3 : OBJECTIFS DU PROJET

## 3.1 Objectif General

Developper une application web complete de gestion des rendez-vous medicaux integrant trois espaces distincts : Patient, Medecin et Administrateur.

## 3.2 Objectifs Specifiques

### Pour les Patients
- Permettre la prise de rendez-vous en ligne 24h/24
- Consulter l'historique des rendez-vous
- Recevoir des notifications de rappel (email/SMS)
- Gerer son profil et ses preferences

### Pour les Medecins
- Gerer les creneaux de disponibilite
- Consulter et valider les demandes de rendez-vous
- Acceder aux dossiers patients
- Rediger des notes medicales

### Pour les Administrateurs
- Superviser l'ensemble des utilisateurs
- Gerer les comptes patients et medecins
- Consulter les statistiques globales
- Parametrer le systeme

---

# CHAPITRE 4 : ANALYSE DES BESOINS

## 4.1 Identification des Acteurs

| Acteur | Description |
|--------|-------------|
| Patient | Utilisateur souhaitant prendre et gerer ses rendez-vous |
| Medecin | Professionnel de sante gerant ses consultations |
| Administrateur | Gestionnaire du systeme avec tous les droits |

## 4.2 Besoins Fonctionnels

### Espace Patient
- Inscription et connexion securisee
- Tableau de bord personnalise
- Prise de rendez-vous avec selection du medecin
- Historique des rendez-vous
- Gestion des notifications
- Modification du profil

### Espace Medecin
- Connexion securisee
- Tableau de bord avec vue planning
- Gestion des rendez-vous (confirmation, annulation)
- Liste des patients
- Notes et observations medicales
- Gestion des disponibilites

### Espace Administrateur
- Gestion complete des utilisateurs
- Statistiques et rapports
- Parametrage du systeme
- Journalisation des actions (audit logs)

## 4.3 Besoins Non Fonctionnels

- **Performance** : Temps de reponse < 2 secondes
- **Securite** : Authentification JWT, chiffrement des donnees
- **Disponibilite** : Application accessible 24h/24
- **Ergonomie** : Interface responsive et intuitive
- **Maintenabilite** : Code structure et documente

## 4.4 Diagramme des Cas d'Utilisation

```
                    +------------------+
                    |     Systeme      |
                    +------------------+
                           |
        +------------------+------------------+
        |                  |                  |
   +--------+         +--------+         +--------+
   | Patient|         | Medecin|         |  Admin |
   +--------+         +--------+         +--------+
        |                  |                  |
   - S'inscrire       - Se connecter     - Gerer patients
   - Se connecter     - Voir planning    - Gerer medecins
   - Prendre RDV      - Confirmer RDV    - Voir statistiques
   - Voir historique  - Annuler RDV      - Parametrer
   - Annuler RDV      - Notes medicales  - Audit logs
   - Notifications    - Disponibilites
```

---

# CHAPITRE 5 : ARCHITECTURE DU SYSTEME

## 5.1 Architecture Globale

L'application suit une architecture **Client-Serveur** avec separation claire entre le frontend et le backend :

```
+-------------------+          +-------------------+          +------------------+
|    Frontend       |  <--->   |     Backend       |  <--->   |   Base de        |
|    (React)        |   API    |    (NestJS)       |   ORM    |   Donnees        |
|    Port 3000      |   REST   |    Port 3002      |  Prisma  |   PostgreSQL     |
+-------------------+          +-------------------+          +------------------+
```

## 5.2 Architecture Backend (NestJS)

### Structure Modulaire

```
medical-appointment-api/
├── src/
│   ├── auth/           # Authentification JWT
│   ├── patients/       # Module patients
│   ├── medecins/       # Module medecins
│   ├── admin/          # Module administration
│   ├── notifications/  # Service email/SMS
│   ├── timeslots/      # Gestion des creneaux
│   ├── common/         # Guards, decorators, filters
│   └── prisma/         # Service base de donnees
├── prisma/
│   └── schema.prisma   # Schema de la base
└── uploads/            # Fichiers joints
```

### Flux d'Authentification

```
Client --> Login --> AuthController --> AuthService --> JWT
                                            |
                                      Validation mot de passe
                                            |
                                      Generation tokens
                                            |
                                      accessToken + refreshToken
```

## 5.3 Architecture Frontend (React)

### Structure des Composants

```
medical-appointment-frontend/
├── src/
│   ├── components/
│   │   ├── layout/     # Layouts par role
│   │   └── common/     # Composants reutilisables
│   ├── pages/
│   │   ├── patient/    # Pages espace patient
│   │   ├── medecin/    # Pages espace medecin
│   │   └── admin/      # Pages espace admin
│   ├── context/        # Contextes React
│   ├── services/       # Appels API
│   └── locales/        # Traductions i18n
```

---

# CHAPITRE 6 : TECHNOLOGIES UTILISEES

## 6.1 Stack Technique

### Backend

| Technologie | Version | Usage |
|-------------|---------|-------|
| Node.js | 18+ | Runtime JavaScript |
| NestJS | 10.x | Framework backend |
| TypeScript | 5.x | Typage statique |
| Prisma | 5.22 | ORM base de donnees |
| PostgreSQL | 14+ | Base de donnees relationnelle |
| JWT | - | Authentification |
| Nodemailer | - | Envoi d'emails |
| Twilio | - | Envoi de SMS |
| Multer | - | Upload de fichiers |

### Frontend

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 19.x | Framework UI |
| React Router | 6.x | Routage SPA |
| Tailwind CSS | 3.x | Framework CSS utility-first |
| Headless UI | - | Composants accessibles |
| i18next | - | Internationalisation |
| Recharts | - | Graphiques et statistiques |
| Axios | - | Client HTTP |
| Heroicons | - | Icones SVG |

## 6.2 Justification des Choix

### Pourquoi NestJS ?
- Architecture modulaire et scalable
- Support natif de TypeScript
- Injection de dependances integree
- Documentation complete
- Ecosysteme riche (guards, interceptors, pipes)

### Pourquoi React ?
- Performance avec Virtual DOM
- Large communaute et ecosysteme
- Composants reutilisables
- Hooks pour gestion d'etat simplifiee
- Support excellent pour SPA

### Pourquoi PostgreSQL ?
- Base de donnees relationnelle robuste
- Support des transactions ACID
- Excellentes performances
- Open source et gratuit
- Compatibilite avec Prisma ORM

### Pourquoi Tailwind CSS ?
- Developement rapide avec classes utilitaires
- Design system coherent
- Support natif du dark mode
- Responsive design facilite
- Optimisation automatique en production

---

# CHAPITRE 7 : CONCEPTION DE LA BASE DE DONNEES

## 7.1 Modele Conceptuel de Donnees (MCD)

### Entites Principales

1. **User** : Modele unifie pour tous les utilisateurs
2. **RendezVous** : Rendez-vous medicaux
3. **NoteMedicale** : Notes du medecin
4. **TimeSlot** : Creneaux de disponibilite
5. **Notification** : Notifications utilisateurs
6. **AuditLog** : Journalisation des actions

## 7.2 Schema de la Base de Donnees

### Table User
```sql
User {
  id            UUID PRIMARY KEY
  email         VARCHAR UNIQUE NOT NULL
  password      VARCHAR NOT NULL
  nom           VARCHAR NOT NULL
  prenom        VARCHAR NOT NULL
  telephone     VARCHAR
  role          ENUM('PATIENT', 'MEDECIN', 'ADMIN')
  specialite    VARCHAR  -- Pour les medecins
  adresse       VARCHAR
  dateNaissance DATE
  theme         ENUM('CLAIR', 'SOMBRE')
  langue        VARCHAR DEFAULT 'fr'
  isActive      BOOLEAN DEFAULT true
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
}
```

### Table RendezVous
```sql
RendezVous {
  id          UUID PRIMARY KEY
  date        TIMESTAMP NOT NULL
  motif       TEXT
  statut      ENUM('EN_ATTENTE', 'CONFIRME', 'ANNULE')
  patientId   UUID FOREIGN KEY -> User
  medecinId   UUID FOREIGN KEY -> User
  createdAt   TIMESTAMP
  updatedAt   TIMESTAMP
}
```

### Table TimeSlot
```sql
TimeSlot {
  id          UUID PRIMARY KEY
  jour        ENUM('LUNDI'...'DIMANCHE')
  heureDebut  TIME NOT NULL
  heureFin    TIME NOT NULL
  medecinId   UUID FOREIGN KEY -> User
  UNIQUE(medecinId, jour, heureDebut)
}
```

### Table NoteMedicale
```sql
NoteMedicale {
  id            UUID PRIMARY KEY
  contenu       TEXT NOT NULL
  statut        ENUM('ACTIF', 'ARCHIVE')
  piecesJointes VARCHAR[]
  patientId     UUID FOREIGN KEY -> User
  medecinId     UUID FOREIGN KEY -> User
  createdAt     TIMESTAMP
  updatedAt     TIMESTAMP
}
```

### Table Notification
```sql
Notification {
  id        UUID PRIMARY KEY
  type      ENUM('RAPPEL', 'CONFIRMATION', 'ANNULATION', ...)
  titre     VARCHAR NOT NULL
  message   TEXT NOT NULL
  lue       BOOLEAN DEFAULT false
  userId    UUID FOREIGN KEY -> User
  createdAt TIMESTAMP
}
```

## 7.3 Relations

```
User (1) ----< (N) RendezVous (patient)
User (1) ----< (N) RendezVous (medecin)
User (1) ----< (N) TimeSlot
User (1) ----< (N) NoteMedicale (patient)
User (1) ----< (N) NoteMedicale (medecin)
User (1) ----< (N) Notification
```

---

# CHAPITRE 8 : IMPLEMENTATION

## 8.1 Configuration du Projet

### Backend (NestJS)
```bash
# Installation
npm install

# Configuration
cp .env.example .env

# Migration base de donnees
npx prisma migrate dev

# Demarrage
npm run start:dev
```

### Frontend (React)
```bash
# Installation
npm install

# Demarrage
npm start
```

## 8.2 Authentification JWT

### Processus de Connexion
1. L'utilisateur soumet ses identifiants
2. Le backend valide le mot de passe avec bcrypt
3. Generation d'un access token (15 min) et refresh token (7 jours)
4. Stockage cote client dans localStorage
5. Inclusion du token dans les headers des requetes

### Protection des Routes
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEDECIN)
@Get('patients')
async getMyPatients(@CurrentUser() user) {
  // Accessible uniquement aux medecins
}
```

## 8.3 Gestion des Rendez-vous

### Workflow des Statuts
```
Patient cree RDV --> EN_ATTENTE
Medecin confirme --> CONFIRME
Patient/Medecin annule --> ANNULE
```

### Regles Metier
- Seul le medecin peut confirmer un rendez-vous
- Patient et medecin peuvent annuler
- Notification automatique a chaque changement de statut

## 8.4 Systeme de Notifications

### Types de Notifications
- **RAPPEL** : Rappel avant rendez-vous
- **CONFIRMATION** : Confirmation de rendez-vous
- **ANNULATION** : Annulation de rendez-vous
- **CHANGEMENT_HORAIRE** : Modification de l'horaire

### Canaux de Communication
- Email (via Nodemailer + Gmail SMTP)
- SMS (via Twilio)
- Notifications in-app

---

# CHAPITRE 9 : FONCTIONNALITES REALISEES

## 9.1 Espace Patient

### Tableau de Bord
- Affichage du prochain rendez-vous
- Statistiques personnelles (rendez-vous a venir, passes, annules)
- Mini-calendrier avec code couleur
- Graphiques de suivi des consultations
- Recommandations de sante basees sur l'historique

### Prise de Rendez-vous
- Selection de la specialite medicale
- Choix du medecin avec affichage des disponibilites
- Calendrier interactif pour selectionner le creneau
- Confirmation avec recapitulatif

### Historique des Rendez-vous
- Liste complete avec filtres (statut, date, medecin)
- Timeline chronologique
- Details de chaque consultation

### Notifications
- Liste des notifications recues
- Marquage comme lu
- Filtrage par type

### Profil et Parametres
- Modification des informations personnelles
- Preferences de notifications (email/SMS)
- Choix du theme (clair/sombre)
- Selection de la langue

## 9.2 Espace Medecin

### Tableau de Bord
- Vue des rendez-vous du jour
- Statistiques de l'activite
- Calendrier mensuel
- Alertes et rappels

### Gestion des Rendez-vous
- Liste des demandes en attente
- Confirmation/annulation des rendez-vous
- Calendrier interactif
- Historique complet

### Gestion des Patients
- Liste des patients suivis
- Fiche patient detaillee
- Historique des consultations par patient

### Notes Medicales
- Creation de notes avec pieces jointes
- Archivage des notes
- Recherche et filtrage

### Disponibilites
- Definition des creneaux par jour de la semaine
- Gestion des indisponibilites exceptionnelles

## 9.3 Espace Administrateur

### Tableau de Bord
- Vue globale de l'activite
- Statistiques cles (patients, medecins, rendez-vous)
- Graphiques d'evolution
- Alertes systeme

### Gestion des Utilisateurs
- Liste des patients avec actions (activer/desactiver)
- Liste des medecins avec validation
- Recherche et filtres avances

### Gestion des Rendez-vous
- Vue globale de tous les rendez-vous
- Interventions si necessaire
- Export des donnees

### Statistiques
- Rapports detailles
- Graphiques interactifs
- KPI de performance

### Parametres Systeme
- Configuration des notifications
- Gestion des specialites medicales
- Journaux d'audit (audit logs)
- Parametres de securite

---

# CHAPITRE 10 : INTERFACE UTILISATEUR

## 10.1 Principes de Design

### Design System
- Couleurs primaires : Bleu (#3B82F6)
- Couleurs secondaires : Cyan (#06B6D4)
- Mode clair et mode sombre
- Typographie moderne et lisible

### Responsive Design
- Mobile-first approach
- Breakpoints : sm (640px), md (768px), lg (1024px), xl (1280px)
- Navigation adaptative (sidebar/bottom nav)

### Accessibilite
- Contraste des couleurs conforme WCAG
- Focus visible sur les elements interactifs
- Labels ARIA pour les composants complexes

## 10.2 Composants Principaux

### Layouts
- PatientLayout : Navigation patient avec sidebar
- MedecinLayout : Navigation medecin avec menu professionnel
- AdminLayout : Navigation admin avec acces complet

### Composants Communs
- Cartes statistiques avec animations
- Tableaux avec pagination et tri
- Modales de confirmation
- Formulaires avec validation
- Boutons et toggles modernes

## 10.3 Internationalisation

L'application supporte plusieurs langues :
- Francais (par defaut)
- Anglais

Utilisation de i18next pour la gestion des traductions.

---

# CHAPITRE 11 : SECURITE

## 11.1 Authentification

### JSON Web Tokens (JWT)
- Access token : 15 minutes de validite
- Refresh token : 7 jours de validite
- Rotation automatique des tokens

### Hashage des Mots de Passe
- Utilisation de bcrypt avec salt
- Minimum 10 rounds de hashage

## 11.2 Autorisation

### Role-Based Access Control (RBAC)
- Trois roles : PATIENT, MEDECIN, ADMIN
- Guards personnalises pour chaque role
- Decorateurs pour proteger les routes

### Validation des Donnees
- DTOs avec class-validator
- Sanitization des entrees utilisateur
- Protection contre les injections SQL (via Prisma)

## 11.3 Protection des Donnees

### Donnees Sensibles
- Chiffrement des mots de passe
- Tokens non exposes dans les logs
- Variables d'environnement pour les secrets

### Conformite RGPD
- Consentement explicite a l'inscription
- Droit a l'oubli (suppression de compte)
- Export des donnees personnelles

## 11.4 Securite Reseau

### CORS
- Configuration stricte des origines autorisees
- Headers de securite

### HTTPS
- Chiffrement des communications en production
- Certificat SSL/TLS

---

# CHAPITRE 12 : TESTS ET VALIDATION

## 12.1 Types de Tests

### Tests Unitaires
- Services NestJS avec Jest
- Composants React avec React Testing Library

### Tests d'Integration
- API endpoints avec Supertest
- Flux complets utilisateur

### Tests Manuels
- Validation des parcours utilisateur
- Tests de compatibilite navigateurs
- Tests responsive sur differents appareils

## 12.2 Couverture de Tests

```bash
# Lancer les tests backend
npm run test

# Couverture de code
npm run test:cov
```

## 12.3 Validation Fonctionnelle

Checklist de validation :
- [ ] Inscription patient fonctionnelle
- [ ] Connexion avec tokens valides
- [ ] Prise de rendez-vous complete
- [ ] Notifications email envoyees
- [ ] Confirmation medecin fonctionnelle
- [ ] Tableau de bord admin operationnel

---

# CHAPITRE 13 : DEPLOIEMENT

## 13.1 Environnement de Production

### Plateforme : Render
- Service web pour l'application
- Base de donnees PostgreSQL
- Variables d'environnement securisees

### Configuration Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
# Build backend et frontend
# ...

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/frontend/build ./frontend/build
CMD ["node", "dist/main.js"]
```

## 13.2 Variables d'Environnement

```env
DATABASE_URL=postgresql://...
JWT_SECRET=secret_securise
JWT_REFRESH_SECRET=refresh_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=...
EMAIL_PASSWORD=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

## 13.3 Pipeline de Deploiement

1. Push sur branche main
2. Build automatique sur Render
3. Execution des migrations Prisma
4. Demarrage de l'application
5. Verification du health check

---

# CHAPITRE 14 : CONCLUSION ET PERSPECTIVES

## 14.1 Bilan du Projet

Ce projet a permis de developper une application web complete de gestion des rendez-vous medicaux, repondant aux besoins identifies :

### Objectifs Atteints
- Application fonctionnelle avec trois espaces utilisateurs
- Interface moderne et responsive
- Systeme de notifications operationnel
- Securite renforcee avec JWT
- Deploiement en production reussi

### Competences Acquises
- Maitrise de NestJS et React
- Conception de bases de donnees relationnelles
- Implementation de l'authentification JWT
- Deploiement cloud avec Docker

## 14.2 Difficultes Rencontrees

- Configuration des notifications email en production
- Gestion des fuseaux horaires pour les rendez-vous
- Optimisation des performances des requetes
- Responsive design pour tous les ecrans

## 14.3 Perspectives d'Amelioration

### Fonctionnalites Futures
- Teleconsultation video integree
- Application mobile native (React Native)
- Intelligence artificielle pour suggestions de creneaux
- Synchronisation avec calendriers externes (Google, Outlook)
- Paiement en ligne des consultations

### Ameliorations Techniques
- Cache Redis pour les performances
- Websockets pour notifications temps reel
- Microservices pour scalabilite
- Tests automatises plus complets

---

# CHAPITRE 15 : ANNEXES

## Annexe A : Guide d'Installation

### Prerequis
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### Installation Backend
```bash
cd medical-appointment-api
npm install
cp .env.example .env
# Configurer les variables d'environnement
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

### Installation Frontend
```bash
cd medical-appointment-frontend
npm install
npm start
```

## Annexe B : Comptes de Test

| Role | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@medical.com | password123 |
| Medecin | jean.kouadio@medical.com | password123 |
| Patient | marie.yao@example.com | password123 |

## Annexe C : Endpoints API Principaux

### Authentification
- POST /api/auth/register - Inscription
- POST /api/auth/login - Connexion
- POST /api/auth/refresh - Rafraichir token

### Patients
- GET /api/patients/profile - Profil patient
- GET /api/patients/rendezvous - Mes rendez-vous
- POST /api/patients/rendezvous - Creer rendez-vous

### Medecins
- GET /api/medecins/rendezvous - Mes rendez-vous
- PATCH /api/medecins/rendezvous/:id - Modifier statut
- GET /api/medecins/patients - Mes patients

### Admin
- GET /api/admin/patients - Liste patients
- GET /api/admin/medecins - Liste medecins
- GET /api/admin/statistiques - Statistiques

## Annexe D : Diagramme de Classes

```
+------------------+       +------------------+
|      User        |       |    RendezVous    |
+------------------+       +------------------+
| - id: UUID       |       | - id: UUID       |
| - email: String  |       | - date: DateTime |
| - password: String|      | - motif: String  |
| - nom: String    |       | - statut: Enum   |
| - prenom: String |       | - patientId: UUID|
| - role: Enum     |       | - medecinId: UUID|
| - specialite: String|    +------------------+
+------------------+              |
        |                         |
        +-------------------------+
```

## Annexe E : Captures d'Ecran

Les captures d'ecran de l'application sont disponibles dans le dossier `/screenshots` :
- Tableau de bord patient
- Page de prise de rendez-vous
- Interface medecin
- Dashboard administrateur

---

# REFERENCES BIBLIOGRAPHIQUES

1. Documentation NestJS - https://docs.nestjs.com/
2. Documentation React - https://react.dev/
3. Prisma ORM Documentation - https://www.prisma.io/docs/
4. Tailwind CSS - https://tailwindcss.com/docs
5. JWT Authentication Best Practices - https://jwt.io/introduction

---

**Memoire realise par :**
Etudiant(e) en Informatique

**Annee academique :** 2024-2025

**Encadrant :** [Nom de l'encadrant]

**Etablissement :** [Nom de l'etablissement]
