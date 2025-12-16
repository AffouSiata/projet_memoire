# MÉMOIRE DE FIN D'ÉTUDES

---

## CONCEPTION ET RÉALISATION D'UNE APPLICATION WEB DE GESTION DE RENDEZ-VOUS MÉDICAUX

---

**Présenté par :** [Votre Nom Complet]

**Sous la direction de :** [Nom du Directeur de Mémoire]

**Structure d'accueil :** [Nom de la Structure]

**Année académique :** 2024-2025

---

# SOMMAIRE

- [REMERCIEMENTS](#remerciements)
- [SIGLES ET ABRÉVIATIONS](#sigles-et-abréviations)
- [LISTE DES FIGURES](#liste-des-figures)
- [LISTE DES TABLEAUX](#liste-des-tableaux)
- [INTRODUCTION GÉNÉRALE](#introduction-générale)
- [CHAPITRE 1 : CADRE DU PROJET ET ANALYSE DES BESOINS](#chapitre-1--cadre-du-projet-et-analyse-des-besoins)
- [CHAPITRE 2 : CONCEPTION DU SYSTÈME](#chapitre-2--conception-du-système)
- [CHAPITRE 3 : RÉALISATION DE L'APPLICATION](#chapitre-3--réalisation-de-lapplication)
- [CHAPITRE 4 : PRÉSENTATION DES RÉSULTATS ET PERSPECTIVES](#chapitre-4--présentation-des-résultats-et-perspectives)
- [CONCLUSION GÉNÉRALE](#conclusion-générale)
- [BIBLIOGRAPHIE ET WEBOGRAPHIE](#bibliographie-et-webographie)
- [ANNEXES](#annexes)

---

# REMERCIEMENTS

Nous tenons à exprimer notre profonde gratitude à toutes les personnes qui ont contribué à la réalisation de ce travail.

Nous remercions particulièrement :

- Notre directeur de mémoire, **[Nom]**, pour son encadrement rigoureux, ses conseils avisés et sa disponibilité tout au long de ce projet ;
- L'ensemble du corps enseignant de **[Nom de l'établissement]** pour la qualité de la formation reçue ;
- La structure d'accueil **[Nom de la structure]** pour nous avoir permis de réaliser ce stage dans les meilleures conditions ;
- Nos familles et amis pour leur soutien indéfectible.

---

# SIGLES ET ABRÉVIATIONS

| Sigle | Signification |
|-------|---------------|
| API | Application Programming Interface |
| CSS | Cascading Style Sheets |
| DTO | Data Transfer Object |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MCD | Modèle Conceptuel de Données |
| MLD | Modèle Logique de Données |
| MPD | Modèle Physique de Données |
| ORM | Object-Relational Mapping |
| REST | Representational State Transfer |
| SGBD | Système de Gestion de Base de Données |
| SQL | Structured Query Language |
| UML | Unified Modeling Language |

---

# LISTE DES FIGURES

| N° | Titre de la figure |
|----|-------------------|
| Figure 1 | Organigramme de la structure d'accueil |
| Figure 2 | Diagramme des acteurs du système |
| Figure 3 | Diagramme de cas d'utilisation global |
| Figure 4 | Diagramme de cas d'utilisation - Patient |
| Figure 5 | Diagramme de cas d'utilisation - Médecin |
| Figure 6 | Diagramme de cas d'utilisation - Administrateur |
| Figure 7 | Architecture globale du système |
| Figure 8 | Diagramme de classes |
| Figure 9 | Modèle Conceptuel de Données (MCD) |
| Figure 10 | Modèle Logique de Données (MLD) |
| Figure 11 | Diagramme de séquence - Authentification |
| Figure 12 | Diagramme de séquence - Prise de rendez-vous |
| Figure 13 | Diagramme de séquence - Confirmation de rendez-vous |
| Figure 14 | Architecture technique du projet |
| Figure 15 | Page de connexion |
| Figure 16 | Page d'inscription |
| Figure 17 | Dashboard Patient |
| Figure 18 | Prise de rendez-vous |
| Figure 19 | Dashboard Médecin |
| Figure 20 | Dashboard Administrateur |

---

# LISTE DES TABLEAUX

| N° | Titre du tableau |
|----|-----------------|
| Tableau 1 | Comparaison système actuel vs solution proposée |
| Tableau 2 | Besoins fonctionnels du Patient |
| Tableau 3 | Besoins fonctionnels du Médecin |
| Tableau 4 | Besoins fonctionnels de l'Administrateur |
| Tableau 5 | Besoins non fonctionnels |
| Tableau 6 | Technologies Backend |
| Tableau 7 | Technologies Frontend |
| Tableau 8 | Endpoints de l'API REST |
| Tableau 9 | Résultats des tests fonctionnels |

---

# INTRODUCTION GÉNÉRALE

## Contexte et problématique

La transformation numérique touche aujourd'hui tous les secteurs d'activité, y compris celui de la santé. Cependant, en Côte d'Ivoire comme dans de nombreux pays africains, la gestion des rendez-vous médicaux reste majoritairement manuelle : appels téléphoniques, cahiers de réservation, files d'attente interminables.

Cette situation engendre plusieurs problèmes :
- **Pour les patients** : difficulté à joindre le cabinet, perte de temps, oubli des rendez-vous
- **Pour les médecins** : gestion chronophage des plannings, taux d'absentéisme élevé
- **Pour le système de santé** : désorganisation, perte d'efficacité

Face à ces constats, la question centrale de ce mémoire est : **Comment concevoir et réaliser une application web permettant d'optimiser la gestion des rendez-vous médicaux pour tous les acteurs impliqués ?**

## Objectifs

**Objectif général :** Concevoir et réaliser une application web de gestion de rendez-vous médicaux multi-acteurs (patients, médecins, administrateurs).

**Objectifs spécifiques :**
1. Analyser les besoins de chaque type d'utilisateur
2. Concevoir une architecture logicielle robuste et sécurisée
3. Développer une API REST et une interface utilisateur moderne
4. Mettre en place un système d'authentification et de gestion des droits
5. Implémenter un système de notifications automatiques

## Méthodologie

Notre démarche a suivi les phases classiques du génie logiciel :
1. **Analyse** : Étude de l'existant, recueil des besoins
2. **Conception** : Modélisation UML, conception de la base de données
3. **Réalisation** : Développement backend (NestJS) et frontend (React)
4. **Tests** : Validation fonctionnelle et technique

## Plan du mémoire

Ce document s'articule autour de quatre chapitres :
- **Chapitre 1** : Cadre du projet et analyse des besoins
- **Chapitre 2** : Conception du système
- **Chapitre 3** : Réalisation de l'application
- **Chapitre 4** : Présentation des résultats et perspectives

---

# CHAPITRE 1 : CADRE DU PROJET ET ANALYSE DES BESOINS

## 1.1. Présentation de la structure d'accueil

### 1.1.1. Historique et missions

*[À compléter avec les informations sur votre structure d'accueil]*

### 1.1.2. Organisation

> **[FIGURE 1 : ORGANIGRAMME DE LA STRUCTURE D'ACCUEIL]**

## 1.2. Étude de l'existant

### 1.2.1. Analyse du système actuel

La gestion actuelle des rendez-vous médicaux présente plusieurs limites :

| Critère | Système actuel | Notre solution |
|---------|----------------|----------------|
| Disponibilité | Heures de bureau uniquement | 24h/24, 7j/7 |
| Temps d'attente | Variable (ligne occupée) | Instantané |
| Rappels | Manuel ou inexistant | Automatique |
| Historique | Difficile à retrouver | Accessible en un clic |
| Statistiques | Inexistantes | Automatiques |

> **[TABLEAU 1 : COMPARAISON SYSTÈME ACTUEL VS SOLUTION PROPOSÉE]**

### 1.2.2. Limites identifiées

- **Accessibilité limitée** : Prise de rendez-vous uniquement aux heures d'ouverture
- **Taux d'absentéisme élevé** : Absence de rappels automatiques
- **Gestion chronophage** : Manipulation manuelle des plannings
- **Absence de traçabilité** : Pas d'historique structuré

## 1.3. Identification des acteurs

Notre système identifie **trois acteurs principaux** :

> **[FIGURE 2 : DIAGRAMME DES ACTEURS]**

| Acteur | Description |
|--------|-------------|
| **Patient** | Personne souhaitant consulter un médecin. Recherche un praticien, consulte les disponibilités, réserve un créneau. |
| **Médecin** | Professionnel de santé. Définit ses disponibilités, gère ses rendez-vous, accède aux informations patients. |
| **Administrateur** | Gestionnaire de la plateforme. Supervise les utilisateurs, valide les médecins, consulte les statistiques. |

## 1.4. Analyse des besoins

### 1.4.1. Besoins fonctionnels du Patient

| Code | Besoin fonctionnel | Priorité |
|------|-------------------|----------|
| BF-P01 | S'inscrire et se connecter | Haute |
| BF-P02 | Rechercher un médecin par spécialité | Haute |
| BF-P03 | Consulter les créneaux disponibles | Haute |
| BF-P04 | Prendre un rendez-vous | Haute |
| BF-P05 | Consulter ses rendez-vous | Haute |
| BF-P06 | Annuler un rendez-vous | Haute |
| BF-P07 | Recevoir des notifications | Moyenne |
| BF-P08 | Configurer ses préférences | Basse |

> **[TABLEAU 2 : BESOINS FONCTIONNELS DU PATIENT]**

### 1.4.2. Besoins fonctionnels du Médecin

| Code | Besoin fonctionnel | Priorité |
|------|-------------------|----------|
| BF-M01 | S'inscrire avec informations professionnelles | Haute |
| BF-M02 | Créer ses créneaux de disponibilité | Haute |
| BF-M03 | Consulter ses rendez-vous | Haute |
| BF-M04 | Confirmer ou annuler un rendez-vous | Haute |
| BF-M05 | Consulter la liste de ses patients | Haute |
| BF-M06 | Gérer les notes médicales | Moyenne |
| BF-M07 | Déclarer ses indisponibilités | Moyenne |

> **[TABLEAU 3 : BESOINS FONCTIONNELS DU MÉDECIN]**

### 1.4.3. Besoins fonctionnels de l'Administrateur

| Code | Besoin fonctionnel | Priorité |
|------|-------------------|----------|
| BF-A01 | Consulter la liste des utilisateurs | Haute |
| BF-A02 | Activer ou désactiver un compte | Haute |
| BF-A03 | Valider l'inscription d'un médecin | Haute |
| BF-A04 | Consulter les statistiques | Moyenne |
| BF-A05 | Superviser les rendez-vous | Moyenne |

> **[TABLEAU 4 : BESOINS FONCTIONNELS DE L'ADMINISTRATEUR]**

### 1.4.4. Besoins non fonctionnels

| Code | Besoin | Description |
|------|--------|-------------|
| BNF-01 | Performance | Temps de chargement < 3 secondes |
| BNF-02 | Sécurité | Authentification JWT, mots de passe hashés |
| BNF-03 | Disponibilité | Application accessible 24h/24 |
| BNF-04 | Ergonomie | Interface intuitive et responsive |
| BNF-05 | Évolutivité | Architecture modulaire |

> **[TABLEAU 5 : BESOINS NON FONCTIONNELS]**

## 1.5. Spécifications fonctionnelles

### 1.5.1. Diagramme de cas d'utilisation global

> **[FIGURE 3 : DIAGRAMME DE CAS D'UTILISATION GLOBAL]**

```
@startuml UC_Global

left to right direction
skinparam backgroundColor #FFFFFF

title Diagramme de Cas d'Utilisation Global

actor "Patient" as P #90EE90
actor "Médecin" as M #87CEEB
actor "Administrateur" as A #FFB6C1

rectangle "Système de Gestion de Rendez-vous Médicaux" {
    usecase "S'authentifier" as UC0
    usecase "Rechercher un médecin" as UC1
    usecase "Prendre un rendez-vous" as UC2
    usecase "Annuler un rendez-vous" as UC3
    usecase "Gérer ses créneaux" as UC5
    usecase "Confirmer un rendez-vous" as UC6
    usecase "Gérer les notes médicales" as UC7
    usecase "Gérer les utilisateurs" as UC9
    usecase "Valider les médecins" as UC10
    usecase "Consulter les statistiques" as UC11
}

P --> UC0
P --> UC1
P --> UC2
P --> UC3

M --> UC0
M --> UC5
M --> UC6
M --> UC7

A --> UC0
A --> UC9
A --> UC10
A --> UC11

@enduml
```

### 1.5.2. Cas d'utilisation du Patient

> **[FIGURE 4 : DIAGRAMME DE CAS D'UTILISATION - PATIENT]**

```
@startuml UC_Patient

left to right direction
skinparam backgroundColor #FFFFFF

title Diagramme de Cas d'Utilisation - Patient

actor "Patient" as P #90EE90

rectangle "Système" {
    usecase "S'inscrire" as UC1
    usecase "Se connecter" as UC2
    usecase "Gérer son profil" as UC3
    usecase "Rechercher un médecin" as UC4
    usecase "Consulter les disponibilités" as UC5
    usecase "Prendre un rendez-vous" as UC6
    usecase "Consulter ses rendez-vous" as UC7
    usecase "Annuler un rendez-vous" as UC8
    usecase "Recevoir des notifications" as UC9
    usecase "Configurer ses préférences" as UC10
}

P --> UC1
P --> UC2
P --> UC3
P --> UC4
P --> UC5
P --> UC6
P --> UC7
P --> UC8
P --> UC9
P --> UC10

@enduml
```

### 1.5.3. Cas d'utilisation du Médecin

> **[FIGURE 5 : DIAGRAMME DE CAS D'UTILISATION - MÉDECIN]**

```
@startuml UC_Medecin

left to right direction
skinparam backgroundColor #FFFFFF

title Diagramme de Cas d'Utilisation - Médecin

actor "Médecin" as M #87CEEB

rectangle "Système" {
    usecase "S'inscrire" as UC1
    usecase "Se connecter" as UC2
    usecase "Gérer son profil" as UC3
    usecase "Gérer ses créneaux" as UC4
    usecase "Déclarer ses indisponibilités" as UC5
    usecase "Consulter ses rendez-vous" as UC6
    usecase "Confirmer un rendez-vous" as UC7
    usecase "Annuler un rendez-vous" as UC8
    usecase "Consulter ses patients" as UC9
    usecase "Gérer les notes médicales" as UC10
}

M --> UC1
M --> UC2
M --> UC3
M --> UC4
M --> UC5
M --> UC6
M --> UC7
M --> UC8
M --> UC9
M --> UC10

@enduml
```

### 1.5.4. Cas d'utilisation de l'Administrateur

> **[FIGURE 6 : DIAGRAMME DE CAS D'UTILISATION - ADMINISTRATEUR]**

```
@startuml UC_Admin

left to right direction
skinparam backgroundColor #FFFFFF

title Diagramme de Cas d'Utilisation - Administrateur

actor "Administrateur" as A #FFB6C1

rectangle "Système" {
    usecase "Se connecter" as UC1
    usecase "Lister les patients" as UC2
    usecase "Activer/Désactiver un patient" as UC3
    usecase "Lister les médecins" as UC4
    usecase "Valider une inscription médecin" as UC5
    usecase "Rejeter une inscription médecin" as UC6
    usecase "Activer/Désactiver un médecin" as UC7
    usecase "Superviser les rendez-vous" as UC8
    usecase "Consulter les statistiques" as UC9
}

A --> UC1
A --> UC2
A --> UC3
A --> UC4
A --> UC5
A --> UC6
A --> UC7
A --> UC8
A --> UC9

@enduml
```

### 1.5.5. Règle métier importante

> **IMPORTANT** : Dans notre système, **seul le médecin peut confirmer un rendez-vous**. Le patient peut uniquement annuler ses rendez-vous. Cette règle garantit que le médecin garde le contrôle de son planning.

---

# CHAPITRE 2 : CONCEPTION DU SYSTÈME

## 2.1. Architecture globale

Notre application suit une architecture **client-serveur** à trois niveaux :

> **[FIGURE 7 : ARCHITECTURE GLOBALE DU SYSTÈME]**

```
@startuml Architecture_Globale

left to right direction
skinparam backgroundColor #FFFFFF

title Architecture Globale du Système

actor "Utilisateurs" as Users #LightGray

rectangle "Frontend\nReact.js\nPort 3000" as Frontend #E8F5E9

rectangle "Backend\nNestJS\nPort 3002" as Backend #E3F2FD

database "Base de Données\nPostgreSQL\nPort 5432" as DB #FFF3E0

Users --> Frontend : HTTPS
Frontend <--> Backend : HTTP/JSON (API REST)
Backend <--> DB : SQL (Prisma ORM)

@enduml
```

| Couche | Technologie | Rôle |
|--------|-------------|------|
| **Frontend** | React.js | Interface utilisateur |
| **Backend** | NestJS | API REST, logique métier |
| **Base de données** | PostgreSQL | Stockage des données |

## 2.2. Diagramme de classes

> **[FIGURE 8 : DIAGRAMME DE CLASSES]**

```
@startuml Diagramme_Classes

skinparam backgroundColor #FFFFFF

title Diagramme de Classes

class User {
    +id: UUID
    +nom: String
    +prenom: String
    +email: String
    +motDePasse: String
    +role: Role
    +telephone: String
    +specialite: String
    +isActive: Boolean
}

class RendezVous {
    +id: UUID
    +patientId: UUID
    +medecinId: UUID
    +date: DateTime
    +statut: StatutRendezVous
    +motif: String
}

class TimeSlot {
    +id: UUID
    +medecinId: UUID
    +jour: JourSemaine
    +heureDebut: String
    +heureFin: String
    +isAvailable: Boolean
}

class NoteMedicale {
    +id: UUID
    +medecinId: UUID
    +patientId: UUID
    +contenu: String
    +piecesJointes: String[]
}

class Notification {
    +id: UUID
    +userId: UUID
    +type: TypeNotification
    +titre: String
    +description: String
    +lue: Boolean
}

User "1" -- "0..*" RendezVous : patient
User "1" -- "0..*" RendezVous : médecin
User "1" -- "0..*" TimeSlot : médecin
User "1" -- "0..*" NoteMedicale : médecin
User "1" -- "0..*" NoteMedicale : patient
User "1" -- "0..*" Notification

@enduml
```

## 2.3. Modèle Conceptuel de Données (MCD)

> **[FIGURE 9 : MODÈLE CONCEPTUEL DE DONNÉES]**

```
@startuml MCD

skinparam backgroundColor #FFFFFF

title Modèle Conceptuel de Données (MCD)

entity "UTILISATEUR" as User {
    * id : UUID <<PK>>
    --
    * nom : String
    * prenom : String
    * email : String <<unique>>
    * motDePasse : String
    * role : enum
    * telephone : String
}

entity "RENDEZ_VOUS" as RDV {
    * id : UUID <<PK>>
    --
    * date : DateTime
    * statut : enum
    * motif : String
}

entity "CRENEAU" as TimeSlot {
    * id : UUID <<PK>>
    --
    * jour : enum
    * heureDebut : String
    * heureFin : String
}

entity "NOTE_MEDICALE" as Note {
    * id : UUID <<PK>>
    --
    * contenu : String
}

entity "NOTIFICATION" as Notif {
    * id : UUID <<PK>>
    --
    * type : enum
    * titre : String
    * lue : Boolean
}

User ||--o{ RDV : "prend (patient)"
User ||--o{ RDV : "reçoit (médecin)"
User ||--o{ TimeSlot : "définit"
User ||--o{ Note : "rédige"
User ||--o{ Note : "concerne"
User ||--o{ Notif : "reçoit"

@enduml
```

## 2.4. Modèle Logique de Données (MLD)

> **[FIGURE 10 : MODÈLE LOGIQUE DE DONNÉES]**

```
USER (id, nom, prenom, email, motDePasse, role, telephone, specialite, isActive, createdAt, updatedAt)

RENDEZ_VOUS (id, #patientId, #medecinId, date, statut, motif, createdAt, updatedAt)

TIME_SLOT (id, #medecinId, jour, heureDebut, heureFin, isAvailable, createdAt)

NOTE_MEDICALE (id, #medecinId, #patientId, contenu, statut, piecesJointes, createdAt, updatedAt)

NOTIFICATION (id, #userId, type, titre, description, lue, createdAt)
```

## 2.5. Diagrammes de séquence

### 2.5.1. Séquence : Authentification

> **[FIGURE 11 : DIAGRAMME DE SÉQUENCE - AUTHENTIFICATION]**

```
@startuml Sequence_Auth

skinparam backgroundColor #FFFFFF

title Diagramme de Séquence - Authentification

actor "Utilisateur" as U
participant "Frontend" as F #E8F5E9
participant "Backend" as B #E3F2FD
database "Base de données" as DB #FFF3E0

U -> F : Saisir email + mot de passe
F -> B : POST /api/auth/login
B -> DB : SELECT user WHERE email
DB --> B : Données utilisateur
B -> B : Vérifier mot de passe (bcrypt)
B -> B : Générer tokens JWT
B --> F : {user, accessToken, refreshToken}
F -> F : Stocker tokens
F --> U : Redirection Dashboard

@enduml
```

### 2.5.2. Séquence : Prise de rendez-vous

> **[FIGURE 12 : DIAGRAMME DE SÉQUENCE - PRISE DE RENDEZ-VOUS]**

```
@startuml Sequence_RDV

skinparam backgroundColor #FFFFFF

title Diagramme de Séquence - Prise de Rendez-vous

actor "Patient" as P
participant "Frontend" as F #E8F5E9
participant "Backend" as B #E3F2FD
database "Base de données" as DB #FFF3E0

P -> F : Rechercher un médecin
F -> B : GET /api/medecins
B -> DB : SELECT médecins
DB --> B : Liste médecins
B --> F : JSON médecins
F --> P : Afficher liste

P -> F : Sélectionner médecin
F -> B : GET /api/timeslots/{medecinId}
B -> DB : SELECT créneaux
DB --> B : Créneaux disponibles
B --> F : JSON créneaux
F --> P : Afficher créneaux

P -> F : Choisir créneau + motif
F -> B : POST /api/patients/rendezvous
B -> DB : INSERT rendez-vous (EN_ATTENTE)
DB --> B : OK
B --> F : Rendez-vous créé
F --> P : Confirmation

@enduml
```

### 2.5.3. Séquence : Confirmation de rendez-vous

> **[FIGURE 13 : DIAGRAMME DE SÉQUENCE - CONFIRMATION]**

```
@startuml Sequence_Confirm

skinparam backgroundColor #FFFFFF

title Diagramme de Séquence - Confirmation de Rendez-vous

actor "Médecin" as M
participant "Frontend" as F #E8F5E9
participant "Backend" as B #E3F2FD
database "Base de données" as DB #FFF3E0
actor "Patient" as P

M -> F : Consulter RDV en attente
F -> B : GET /api/medecins/rendezvous?statut=EN_ATTENTE
B -> DB : SELECT rendez-vous
DB --> B : Liste RDV
B --> F : JSON RDV
F --> M : Afficher liste

M -> F : Cliquer "Confirmer"
F -> B : PATCH /api/medecins/rendezvous/{id}
B -> DB : UPDATE statut = CONFIRME
DB --> B : OK
B -> DB : INSERT notification
DB --> B : OK
B --> F : RDV confirmé
F --> M : Confirmation

B -> P : Notification (email/SMS)

@enduml
```

---

# CHAPITRE 3 : RÉALISATION DE L'APPLICATION

## 3.1. Environnement technique

### 3.1.1. Technologies Backend

| Technologie | Version | Rôle |
|-------------|---------|------|
| NestJS | 10.x | Framework backend |
| TypeScript | 5.x | Langage typé |
| Prisma | 5.x | ORM |
| PostgreSQL | 14+ | Base de données |
| JWT | - | Authentification |
| BCrypt | - | Hashage mots de passe |

> **[TABLEAU 6 : TECHNOLOGIES BACKEND]**

### 3.1.2. Technologies Frontend

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18.x | Bibliothèque UI |
| React Router | 6.x | Routage |
| Axios | - | Requêtes HTTP |
| Tailwind CSS | 3.x | Styles |
| i18next | - | Internationalisation |

> **[TABLEAU 7 : TECHNOLOGIES FRONTEND]**

## 3.2. Architecture technique

> **[FIGURE 14 : ARCHITECTURE TECHNIQUE DU PROJET]**

```
@startuml Architecture_Technique

skinparam backgroundColor #FFFFFF

title Architecture Technique du Projet

rectangle "FRONTEND (React)" #E8F5E9 {
    [Pages] - [Components]
    [Context] - [Services]
}

rectangle "BACKEND (NestJS)" #E3F2FD {
    [Controllers] - [Services]
    [Guards] - [DTOs]
}

rectangle "BASE DE DONNÉES" #FFF3E0 {
    database "PostgreSQL"
}

rectangle "SERVICES EXTERNES" #FCE4EC {
    [Nodemailer] - [Twilio]
}

[FRONTEND (React)] --> [BACKEND (NestJS)] : API REST
[BACKEND (NestJS)] --> [PostgreSQL] : Prisma ORM
[BACKEND (NestJS)] --> [SERVICES EXTERNES] : Notifications

@enduml
```

## 3.3. Implémentation de l'API REST

### 3.3.1. Endpoints principaux

> **[TABLEAU 8 : ENDPOINTS DE L'API REST]**

#### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| POST | /api/auth/refresh | Rafraîchir token |

#### Espace Patient

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/patients/profile | Récupérer profil |
| GET | /api/patients/rendezvous | Liste des RDV |
| POST | /api/patients/rendezvous | Créer un RDV |
| PATCH | /api/patients/rendezvous/:id/status | Annuler un RDV |

#### Espace Médecin

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/medecins/rendezvous | Liste des RDV |
| PATCH | /api/medecins/rendezvous/:id | Confirmer/Annuler |
| GET | /api/medecins/timeslots | Liste créneaux |
| POST | /api/medecins/timeslots | Créer créneau |

#### Espace Administrateur

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | /api/admin/patients | Liste patients |
| GET | /api/admin/medecins | Liste médecins |
| PATCH | /api/admin/medecins/:id/validate | Valider médecin |
| GET | /api/admin/statistiques | Statistiques |

### 3.3.2. Sécurité de l'API

| Mesure | Description |
|--------|-------------|
| **JWT** | Tokens d'accès (15min) et de rafraîchissement (7j) |
| **BCrypt** | Hashage des mots de passe (10 rounds) |
| **Guards** | Contrôle d'accès basé sur les rôles (RBAC) |
| **Validation** | Toutes les entrées validées via DTOs |

## 3.4. Présentation des interfaces

### 3.4.1. Page de connexion

> **[FIGURE 15 : PAGE DE CONNEXION]**
> *Capture d'écran de l'interface de connexion*

### 3.4.2. Page d'inscription

> **[FIGURE 16 : PAGE D'INSCRIPTION]**
> *Capture d'écran de l'interface d'inscription*

### 3.4.3. Dashboard Patient

> **[FIGURE 17 : DASHBOARD PATIENT]**
> *Capture d'écran du tableau de bord patient*

### 3.4.4. Prise de rendez-vous

> **[FIGURE 18 : PRISE DE RENDEZ-VOUS]**
> *Capture d'écran de l'interface de réservation*

### 3.4.5. Dashboard Médecin

> **[FIGURE 19 : DASHBOARD MÉDECIN]**
> *Capture d'écran du tableau de bord médecin*

### 3.4.6. Dashboard Administrateur

> **[FIGURE 20 : DASHBOARD ADMINISTRATEUR]**
> *Capture d'écran du tableau de bord administrateur*

---

# CHAPITRE 4 : PRÉSENTATION DES RÉSULTATS ET PERSPECTIVES

## 4.1. Tests et validation

### 4.1.1. Tests fonctionnels

| Fonctionnalité | Résultat |
|----------------|----------|
| Inscription Patient | OK |
| Inscription Médecin | OK |
| Connexion/Déconnexion | OK |
| Recherche de médecins | OK |
| Prise de rendez-vous | OK |
| Annulation par patient | OK |
| Confirmation par médecin | OK |
| Gestion des créneaux | OK |
| Validation médecin par admin | OK |
| Notifications | OK |

> **[TABLEAU 9 : RÉSULTATS DES TESTS FONCTIONNELS]**

### 4.1.2. Tests de sécurité

- **Authentification** : Tokens JWT fonctionnels avec expiration
- **Autorisation** : Guards de rôles opérationnels
- **Mots de passe** : Hashage BCrypt vérifié
- **Validation** : Rejet des données invalides

## 4.2. Résultats obtenus

### 4.2.1. Fonctionnalités implémentées

**Espace Patient :**
- Inscription et connexion sécurisées
- Recherche de médecins par spécialité
- Visualisation des créneaux disponibles
- Prise et annulation de rendez-vous
- Historique des consultations
- Gestion des préférences

**Espace Médecin :**
- Inscription avec validation administrative
- Gestion des créneaux de disponibilité
- Confirmation et annulation des rendez-vous
- Consultation de la liste des patients
- Rédaction de notes médicales

**Espace Administrateur :**
- Validation des comptes médecins
- Gestion des utilisateurs
- Tableau de bord statistique
- Supervision des rendez-vous

### 4.2.2. Points forts de la solution

1. **Architecture moderne** : Séparation claire frontend/backend
2. **Sécurité renforcée** : JWT, hashage, contrôle d'accès
3. **Interface intuitive** : Design responsive et accessible
4. **Multilingue** : Support français et anglais
5. **Notifications automatiques** : Email et SMS

## 4.3. Difficultés rencontrées

| Difficulté | Solution apportée |
|------------|-------------------|
| Gestion des fuseaux horaires | Utilisation de dates UTC |
| Refresh token expiré | Implémentation d'un intercepteur Axios |
| Conflits de créneaux | Contrainte unique en base de données |
| Validation des médecins | Workflow d'approbation administrative |

## 4.4. Perspectives d'amélioration

### 4.4.1. Améliorations à court terme

- Intégration d'un système de paiement en ligne
- Application mobile (React Native)
- Rappels par notification push

### 4.4.2. Améliorations à moyen terme

- Téléconsultation vidéo intégrée
- Dossier médical électronique complet
- Intelligence artificielle pour la suggestion de créneaux

### 4.4.3. Améliorations à long terme

- Intégration avec les systèmes hospitaliers existants
- Analyse prédictive des absences
- Extension à d'autres pays africains

---

# CONCLUSION GÉNÉRALE

Ce travail avait pour objectif de concevoir et réaliser une application web de gestion de rendez-vous médicaux. À l'issue de ce projet, nous avons développé une solution complète répondant aux besoins des trois acteurs identifiés : patients, médecins et administrateurs.

**Réalisations principales :**

1. **Analyse complète** des besoins et des processus existants
2. **Conception rigoureuse** avec modélisation UML et base de données
3. **Développement fonctionnel** d'une application web moderne et sécurisée
4. **Tests validés** confirmant le bon fonctionnement du système

**Apports du projet :**

- Pour les **patients** : accès simplifié à la prise de rendez-vous 24h/24
- Pour les **médecins** : gestion optimisée du planning et des patients
- Pour les **administrateurs** : supervision centralisée de la plateforme

Ce projet nous a permis de mettre en pratique les connaissances acquises durant notre formation, notamment en développement web, bases de données et sécurité informatique.

L'application, bien que fonctionnelle, offre de nombreuses perspectives d'évolution : application mobile, téléconsultation, intégration de paiements en ligne. Ces améliorations pourront faire l'objet de travaux futurs.

---

# BIBLIOGRAPHIE ET WEBOGRAPHIE

## Ouvrages

- GAMMA, E. et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.
- FOWLER, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley.

## Documentation technique

- NestJS Documentation : https://docs.nestjs.com/
- React Documentation : https://react.dev/
- Prisma Documentation : https://www.prisma.io/docs
- PostgreSQL Documentation : https://www.postgresql.org/docs/
- Tailwind CSS Documentation : https://tailwindcss.com/docs

## Articles et ressources en ligne

- JWT.io : https://jwt.io/introduction
- OWASP Security Guidelines : https://owasp.org/

---

# ANNEXES

## Annexe A : Schéma de la base de données (Prisma Schema)

```prisma
model User {
  id              String    @id @default(uuid())
  nom             String
  prenom          String
  email           String    @unique
  motDePasse      String
  role            Role
  telephone       String
  isActive        Boolean   @default(true)
  specialite      String?
  statutValidation StatutValidation?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model RendezVous {
  id          String            @id @default(uuid())
  patientId   String
  medecinId   String
  date        DateTime
  statut      StatutRendezVous  @default(EN_ATTENTE)
  motif       String
  createdAt   DateTime          @default(now())
}

model TimeSlot {
  id          String       @id @default(uuid())
  medecinId   String
  jour        JourSemaine
  heureDebut  String
  heureFin    String
  isAvailable Boolean      @default(true)
}
```

## Annexe B : Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@medical.com | password123 |
| Médecin | jean.kouadio@medical.com | password123 |
| Patient | marie.yao@example.com | password123 |

## Annexe C : Instructions de déploiement

```bash
# Backend
cd medical-appointment-api
npm install
npx prisma migrate dev
npm run start:dev

# Frontend
cd medical-appointment-frontend
npm install
npm start
```

---

*Mémoire présenté et soutenu par [Votre Nom] - Année académique 2024-2025*

---

# TABLE DES MATIÈRES

## PAGES LIMINAIRES
- Remerciements
- Sigles et abréviations
- Liste des figures
- Liste des tableaux

## INTRODUCTION GÉNÉRALE
- Contexte et problématique
- Objectifs
- Méthodologie
- Plan du mémoire

## CHAPITRE 1 : CADRE DU PROJET ET ANALYSE DES BESOINS
- 1.1. Présentation de la structure d'accueil
  - 1.1.1. Historique et missions
  - 1.1.2. Organisation
- 1.2. Étude de l'existant
  - 1.2.1. Analyse du système actuel
  - 1.2.2. Limites identifiées
- 1.3. Identification des acteurs
- 1.4. Analyse des besoins
  - 1.4.1. Besoins fonctionnels du Patient
  - 1.4.2. Besoins fonctionnels du Médecin
  - 1.4.3. Besoins fonctionnels de l'Administrateur
  - 1.4.4. Besoins non fonctionnels
- 1.5. Spécifications fonctionnelles
  - 1.5.1. Diagramme de cas d'utilisation global
  - 1.5.2. Cas d'utilisation du Patient
  - 1.5.3. Cas d'utilisation du Médecin
  - 1.5.4. Cas d'utilisation de l'Administrateur
  - 1.5.5. Règle métier importante

## CHAPITRE 2 : CONCEPTION DU SYSTÈME
- 2.1. Architecture globale
- 2.2. Diagramme de classes
- 2.3. Modèle Conceptuel de Données (MCD)
- 2.4. Modèle Logique de Données (MLD)
- 2.5. Diagrammes de séquence
  - 2.5.1. Séquence : Authentification
  - 2.5.2. Séquence : Prise de rendez-vous
  - 2.5.3. Séquence : Confirmation de rendez-vous

## CHAPITRE 3 : RÉALISATION DE L'APPLICATION
- 3.1. Environnement technique
  - 3.1.1. Technologies Backend
  - 3.1.2. Technologies Frontend
- 3.2. Architecture technique
- 3.3. Implémentation de l'API REST
  - 3.3.1. Endpoints principaux
  - 3.3.2. Sécurité de l'API
- 3.4. Présentation des interfaces
  - 3.4.1. Page de connexion
  - 3.4.2. Page d'inscription
  - 3.4.3. Dashboard Patient
  - 3.4.4. Prise de rendez-vous
  - 3.4.5. Dashboard Médecin
  - 3.4.6. Dashboard Administrateur

## CHAPITRE 4 : PRÉSENTATION DES RÉSULTATS ET PERSPECTIVES
- 4.1. Tests et validation
  - 4.1.1. Tests fonctionnels
  - 4.1.2. Tests de sécurité
- 4.2. Résultats obtenus
  - 4.2.1. Fonctionnalités implémentées
  - 4.2.2. Points forts de la solution
- 4.3. Difficultés rencontrées
- 4.4. Perspectives d'amélioration
  - 4.4.1. Améliorations à court terme
  - 4.4.2. Améliorations à moyen terme
  - 4.4.3. Améliorations à long terme

## CONCLUSION GÉNÉRALE

## BIBLIOGRAPHIE ET WEBOGRAPHIE

## ANNEXES
- Annexe A : Schéma de la base de données (Prisma Schema)
- Annexe B : Comptes de test
- Annexe C : Instructions de déploiement
