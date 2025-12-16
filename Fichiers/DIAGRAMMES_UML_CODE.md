# CODE PLANTUML POUR GÉNÉRER LES DIAGRAMMES

Ce fichier contient le code PlantUML pour générer tous les diagrammes UML du projet.
Vous pouvez utiliser ces codes dans les outils listés à la fin de ce document.

---

## 1. DIAGRAMME DE CAS D'UTILISATION GLOBAL

```plantuml
@startuml Diagramme_Cas_Utilisation_Global

left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle
skinparam backgroundColor #FEFEFE

title Diagramme de Cas d'Utilisation Global\nSystème de Gestion de Rendez-vous Médicaux

' Définition des acteurs
actor "Patient" as Patient #LightBlue
actor "Médecin" as Medecin #LightGreen
actor "Administrateur" as Admin #LightCoral
actor "Système de\nNotification" as SysNotif #LightGray

' Package Authentification
rectangle "Authentification" #E8E8E8 {
  usecase "S'inscrire" as UC_AUTH1
  usecase "Se connecter" as UC_AUTH2
  usecase "Se déconnecter" as UC_AUTH3
  usecase "Rafraîchir le token" as UC_AUTH4
}

' Package Patient
rectangle "Espace Patient" #E3F2FD {
  usecase "Gérer son profil" as UC_PAT1
  usecase "Rechercher un médecin" as UC_PAT2
  usecase "Consulter les\ndisponibilités" as UC_PAT3
  usecase "Prendre un\nrendez-vous" as UC_PAT4
  usecase "Consulter ses\nrendez-vous" as UC_PAT5
  usecase "Annuler un\nrendez-vous" as UC_PAT6
  usecase "Gérer ses\nnotifications" as UC_PAT7
  usecase "Configurer ses\npréférences" as UC_PAT8
}

' Package Médecin
rectangle "Espace Médecin" #E8F5E9 {
  usecase "Gérer son profil\nprofessionnel" as UC_MED1
  usecase "Gérer ses créneaux\nde disponibilité" as UC_MED2
  usecase "Déclarer une\nindisponibilité" as UC_MED3
  usecase "Consulter ses\nrendez-vous" as UC_MED4
  usecase "Confirmer un\nrendez-vous" as UC_MED5 #90EE90
  usecase "Annuler un\nrendez-vous" as UC_MED6
  usecase "Consulter ses\npatients" as UC_MED7
  usecase "Gérer les notes\nmédicales" as UC_MED8
}

' Package Admin
rectangle "Espace Administration" #FFEBEE {
  usecase "Gérer les patients" as UC_ADM1
  usecase "Gérer les médecins" as UC_ADM2
  usecase "Valider les\ninscriptions médecins" as UC_ADM3
  usecase "Consulter tous\nles rendez-vous" as UC_ADM4
  usecase "Consulter les\nstatistiques" as UC_ADM5
}

' Relations Patient
Patient --> UC_AUTH1
Patient --> UC_AUTH2
Patient --> UC_AUTH3
Patient --> UC_PAT1
Patient --> UC_PAT2
Patient --> UC_PAT3
Patient --> UC_PAT4
Patient --> UC_PAT5
Patient --> UC_PAT6
Patient --> UC_PAT7
Patient --> UC_PAT8

' Relations Médecin
Medecin --> UC_AUTH1
Medecin --> UC_AUTH2
Medecin --> UC_AUTH3
Medecin --> UC_MED1
Medecin --> UC_MED2
Medecin --> UC_MED3
Medecin --> UC_MED4
Medecin --> UC_MED5
Medecin --> UC_MED6
Medecin --> UC_MED7
Medecin --> UC_MED8

' Relations Admin
Admin --> UC_AUTH2
Admin --> UC_AUTH3
Admin --> UC_ADM1
Admin --> UC_ADM2
Admin --> UC_ADM3
Admin --> UC_ADM4
Admin --> UC_ADM5

' Relations Système Notification
UC_PAT4 ..> SysNotif : <<déclenche>>
UC_PAT6 ..> SysNotif : <<déclenche>>
UC_MED5 ..> SysNotif : <<déclenche>>
UC_MED6 ..> SysNotif : <<déclenche>>

' Include/Extend
UC_PAT4 ..> UC_PAT3 : <<include>>
UC_PAT3 ..> UC_PAT2 : <<include>>

note right of UC_MED5
  **IMPORTANT**
  Seul le médecin peut
  confirmer un RDV
end note

note left of UC_PAT6
  Le patient peut
  **uniquement annuler**
  (pas confirmer)
end note

@enduml
```

---

## 2. DIAGRAMME DE CAS D'UTILISATION - PATIENT

```plantuml
@startuml Diagramme_Cas_Utilisation_Patient

left to right direction
skinparam actorStyle awesome
skinparam backgroundColor #FEFEFE

title Diagramme de Cas d'Utilisation - Espace Patient

actor "Patient" as Patient #LightBlue
actor "Système de\nNotification" as SysNotif #LightGray

rectangle "Système de Gestion de Rendez-vous Médicaux" {

  package "Authentification" {
    usecase "S'inscrire" as UC1
    usecase "Se connecter" as UC2
    usecase "Se déconnecter" as UC3
    usecase "Modifier son\nmot de passe" as UC4
  }

  package "Gestion du Profil" {
    usecase "Consulter son profil" as UC5
    usecase "Modifier son profil" as UC6
    usecase "Configurer les\npréférences de\nnotification" as UC7
    usecase "Changer le thème" as UC8
    usecase "Changer la langue" as UC9
  }

  package "Gestion des Rendez-vous" {
    usecase "Rechercher un médecin" as UC10
    usecase "Consulter les\ndisponibilités" as UC11
    usecase "Prendre un\nrendez-vous" as UC12
    usecase "Consulter ses\nrendez-vous à venir" as UC13
    usecase "Consulter l'historique\ndes rendez-vous" as UC14
    usecase "Annuler un\nrendez-vous" as UC15 #FFB6C1
  }

  package "Notifications" {
    usecase "Consulter ses\nnotifications" as UC16
    usecase "Marquer comme lue" as UC17
  }
}

' Associations Patient
Patient --> UC1
Patient --> UC2
Patient --> UC3
Patient --> UC4
Patient --> UC5
Patient --> UC6
Patient --> UC7
Patient --> UC8
Patient --> UC9
Patient --> UC10
Patient --> UC11
Patient --> UC12
Patient --> UC13
Patient --> UC14
Patient --> UC15
Patient --> UC16
Patient --> UC17

' Déclenchement notifications
UC12 ..> SysNotif : <<déclenche>>
UC15 ..> SysNotif : <<déclenche>>

' Relations include
UC12 ..> UC11 : <<include>>
UC11 ..> UC10 : <<include>>

note bottom of UC15
  **CONTRAINTE MÉTIER**
  Le patient peut UNIQUEMENT
  annuler ses rendez-vous.
  Il ne peut PAS les confirmer.
end note

@enduml
```

---

## 3. DIAGRAMME DE CAS D'UTILISATION - MÉDECIN

```plantuml
@startuml Diagramme_Cas_Utilisation_Medecin

left to right direction
skinparam actorStyle awesome
skinparam backgroundColor #FEFEFE

title Diagramme de Cas d'Utilisation - Espace Médecin

actor "Médecin" as Medecin #LightGreen
actor "Système de\nNotification" as SysNotif #LightGray

rectangle "Système de Gestion de Rendez-vous Médicaux" {

  package "Authentification" {
    usecase "S'inscrire\n(avec numéro d'ordre)" as UC1
    usecase "Se connecter" as UC2
    usecase "Se déconnecter" as UC3
  }

  package "Gestion du Profil" {
    usecase "Consulter son profil" as UC4
    usecase "Modifier son profil\nprofessionnel" as UC5
    usecase "Configurer les\npréférences" as UC6
  }

  package "Gestion des Créneaux" {
    usecase "Consulter ses créneaux" as UC7
    usecase "Créer un créneau" as UC8
    usecase "Modifier un créneau" as UC9
    usecase "Supprimer un créneau" as UC10
    usecase "Activer/Désactiver\nun créneau" as UC11
    usecase "Générer des créneaux\nautomatiquement" as UC12
  }

  package "Gestion des Indisponibilités" {
    usecase "Consulter ses\nindisponibilités" as UC13
    usecase "Déclarer une\nindisponibilité" as UC14
    usecase "Supprimer une\nindisponibilité" as UC15
  }

  package "Gestion des Rendez-vous" {
    usecase "Consulter ses\nrendez-vous" as UC16
    usecase "Filtrer les RDV\n(par statut, date)" as UC17
    usecase "Confirmer un\nrendez-vous" as UC18 #90EE90
    usecase "Annuler un\nrendez-vous" as UC19
  }

  package "Gestion des Patients" {
    usecase "Consulter la liste\nde ses patients" as UC20
    usecase "Voir le dossier\nd'un patient" as UC21
  }

  package "Notes Médicales" {
    usecase "Consulter les notes" as UC22
    usecase "Créer une note" as UC23
    usecase "Modifier une note" as UC24
    usecase "Archiver une note" as UC25
    usecase "Ajouter une\npièce jointe" as UC26
  }
}

' Associations Médecin
Medecin --> UC1
Medecin --> UC2
Medecin --> UC3
Medecin --> UC4
Medecin --> UC5
Medecin --> UC6
Medecin --> UC7
Medecin --> UC8
Medecin --> UC9
Medecin --> UC10
Medecin --> UC11
Medecin --> UC12
Medecin --> UC13
Medecin --> UC14
Medecin --> UC15
Medecin --> UC16
Medecin --> UC17
Medecin --> UC18
Medecin --> UC19
Medecin --> UC20
Medecin --> UC21
Medecin --> UC22
Medecin --> UC23
Medecin --> UC24
Medecin --> UC25
Medecin --> UC26

' Déclenchement notifications
UC18 ..> SysNotif : <<déclenche>>
UC19 ..> SysNotif : <<déclenche>>

note right of UC18
  **IMPORTANT**
  Le médecin est le SEUL
  à pouvoir confirmer
  les rendez-vous
  (EN_ATTENTE → CONFIRME)
end note

@enduml
```

---

## 4. DIAGRAMME DE CAS D'UTILISATION - ADMINISTRATEUR

```plantuml
@startuml Diagramme_Cas_Utilisation_Admin

left to right direction
skinparam actorStyle awesome
skinparam backgroundColor #FEFEFE

title Diagramme de Cas d'Utilisation - Espace Administrateur

actor "Administrateur" as Admin #LightCoral

rectangle "Système de Gestion de Rendez-vous Médicaux" {

  package "Authentification" {
    usecase "Se connecter" as UC1
    usecase "Se déconnecter" as UC2
    usecase "Modifier son profil" as UC3
  }

  package "Gestion des Patients" {
    usecase "Consulter la liste\ndes patients" as UC4
    usecase "Rechercher un patient" as UC5
    usecase "Consulter le détail\nd'un patient" as UC6
    usecase "Activer un compte\npatient" as UC7
    usecase "Désactiver un compte\npatient" as UC8
  }

  package "Gestion des Médecins" {
    usecase "Consulter la liste\ndes médecins" as UC9
    usecase "Rechercher un médecin" as UC10
    usecase "Consulter le détail\nd'un médecin" as UC11
    usecase "Valider un compte\nmédecin" as UC12 #90EE90
    usecase "Rejeter un compte\nmédecin" as UC13 #FFB6C1
    usecase "Activer/Désactiver\nun médecin" as UC14
  }

  package "Supervision des Rendez-vous" {
    usecase "Consulter tous\nles rendez-vous" as UC15
    usecase "Filtrer les RDV" as UC16
    usecase "Annuler un RDV" as UC17
  }

  package "Statistiques" {
    usecase "Consulter le\ntableau de bord" as UC18
    usecase "Voir les statistiques\nglobales" as UC19
    usecase "Voir les statistiques\npar période" as UC20
  }

  package "Audit" {
    usecase "Consulter les logs" as UC21
    usecase "Filtrer les logs" as UC22
  }
}

' Associations Admin
Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin --> UC13
Admin --> UC14
Admin --> UC15
Admin --> UC16
Admin --> UC17
Admin --> UC18
Admin --> UC19
Admin --> UC20
Admin --> UC21
Admin --> UC22

note right of UC12
  **Workflow de validation**
  1. Médecin s'inscrit (PENDING)
  2. Admin vérifie les infos
  3. Admin valide (APPROVED)
     ou rejette (REJECTED)
end note

@enduml
```

---

## 5. DIAGRAMME DE CLASSES

```plantuml
@startuml Diagramme_Classes

skinparam classAttributeIconSize 0
skinparam backgroundColor #FEFEFE

title Diagramme de Classes\nSystème de Gestion de Rendez-vous Médicaux

' Énumérations
enum Role {
  PATIENT
  MEDECIN
  ADMIN
}

enum StatutRendezVous {
  EN_ATTENTE
  CONFIRME
  ANNULE
}

enum StatutValidation {
  PENDING
  APPROVED
  REJECTED
}

enum JourSemaine {
  LUNDI
  MARDI
  MERCREDI
  JEUDI
  VENDREDI
  SAMEDI
  DIMANCHE
}

enum TypeNotification {
  RAPPEL
  CONFIRMATION
  ANNULATION
  CHANGEMENT_HORAIRE
}

enum StatutNote {
  ACTIF
  ARCHIVE
}

enum Theme {
  CLAIR
  SOMBRE
}

' Classes
class Utilisateur {
  - id: UUID
  - nom: String
  - prenom: String
  - email: String
  - motDePasse: String
  - role: Role
  - telephone: String
  - dateNaissance: Date
  - adresse: String
  - isActive: Boolean
  - theme: Theme
  - langue: String
  - preferencesNotifEmail: Boolean
  - preferencesNotifSms: Boolean
  - createdAt: DateTime
  - updatedAt: DateTime
  --
  + seConnecter(): Token
  + seDeconnecter(): void
  + modifierProfil(): void
  + changerMotDePasse(): void
}

class Medecin {
  - specialite: String
  - numeroOrdre: String
  - statutValidation: StatutValidation
  --
  + gererCreneaux(): void
  + confirmerRendezVous(): void
  + annulerRendezVous(): void
  + creerNote(): void
  + declarerIndisponibilite(): void
}

class RendezVous {
  - id: UUID
  - date: DateTime
  - motif: String
  - statut: StatutRendezVous
  - createdAt: DateTime
  - updatedAt: DateTime
  --
  + confirmer(): void
  + annuler(): void
}

class CreneauHoraire {
  - id: UUID
  - jour: JourSemaine
  - heureDebut: String
  - heureFin: String
  - isAvailable: Boolean
  - createdAt: DateTime
  --
  + activer(): void
  + desactiver(): void
}

class Indisponibilite {
  - id: UUID
  - date: Date
  - raison: String
  - createdAt: DateTime
  --
  + supprimer(): void
}

class NoteMedicale {
  - id: UUID
  - contenu: String
  - statut: StatutNote
  - piecesJointes: String[]
  - createdAt: DateTime
  - updatedAt: DateTime
  --
  + modifier(): void
  + archiver(): void
  + ajouterPieceJointe(): void
}

class Notification {
  - id: UUID
  - type: TypeNotification
  - titre: String
  - description: String
  - lue: Boolean
  - createdAt: DateTime
  --
  + marquerCommeLue(): void
}

' Relations
Utilisateur <|-- Medecin : extends

Utilisateur "1" -- "*" RendezVous : prend (patient)
Medecin "1" -- "*" RendezVous : assure

Medecin "1" -- "*" CreneauHoraire : définit
Medecin "1" -- "*" Indisponibilite : déclare

Medecin "1" -- "*" NoteMedicale : rédige
Utilisateur "1" -- "*" NoteMedicale : concerne (patient)

Utilisateur "1" -- "*" Notification : reçoit

' Notes
note right of RendezVous
  **Règle métier importante**
  - Patient: peut SEULEMENT annuler
  - Médecin: peut confirmer ET annuler
end note

note bottom of Medecin
  Un médecin doit être validé
  (statutValidation = APPROVED)
  pour recevoir des RDV
end note

@enduml
```

---

## 6. DIAGRAMME DE SÉQUENCE - PRISE DE RENDEZ-VOUS

```plantuml
@startuml Sequence_Prise_RDV

skinparam backgroundColor #FEFEFE
skinparam sequenceArrowThickness 2

title Diagramme de Séquence\nPrise de Rendez-vous par un Patient

actor "Patient" as Patient #LightBlue
participant "Frontend\n(React)" as Frontend #E3F2FD
participant "Backend\n(NestJS)" as Backend #E8F5E9
database "Base de données\n(PostgreSQL)" as DB #FFF9C4
participant "Service\nNotification" as Notif #FFEBEE

Patient -> Frontend : 1. Clic "Prendre RDV"
activate Frontend

Frontend -> Frontend : 2. Affiche liste médecins

Patient -> Frontend : 3. Sélectionne un médecin
Frontend -> Backend : 4. GET /api/timeslots/{medecinId}
activate Backend

Backend -> DB : 5. SELECT créneaux WHERE medecinId
activate DB
DB --> Backend : 6. Liste des créneaux
deactivate DB

Backend -> DB : 7. SELECT indisponibilités
activate DB
DB --> Backend : 8. Liste indisponibilités
deactivate DB

Backend --> Frontend : 9. Créneaux disponibles (JSON)
deactivate Backend

Frontend -> Frontend : 10. Affiche calendrier\navec créneaux

Patient -> Frontend : 11. Sélectionne créneau\n+ saisit motif

Patient -> Frontend : 12. Clic "Confirmer"
Frontend -> Backend : 13. POST /api/patients/rendezvous\n{medecinId, date, motif}
activate Backend

Backend -> Backend : 14. Valide les données\n(JwtAuthGuard)

Backend -> DB : 15. Vérifie créneau disponible
activate DB
DB --> Backend : 16. OK
deactivate DB

Backend -> DB : 17. INSERT RendezVous\n(statut: EN_ATTENTE)
activate DB
DB --> Backend : 18. RDV créé
deactivate DB

Backend -> Notif : 19. Notifier médecin
activate Notif
Notif --> Backend : 20. OK
deactivate Notif

Backend --> Frontend : 21. {success: true, rdv: {...}}
deactivate Backend

Frontend --> Patient : 22. "Rendez-vous créé !\nEn attente de confirmation"
deactivate Frontend

note right of Backend
  Le RDV est créé avec
  le statut **EN_ATTENTE**

  Seul le médecin pourra
  le confirmer ensuite
end note

@enduml
```

---

## 7. DIAGRAMME DE SÉQUENCE - CONFIRMATION PAR MÉDECIN

```plantuml
@startuml Sequence_Confirmation_RDV

skinparam backgroundColor #FEFEFE
skinparam sequenceArrowThickness 2

title Diagramme de Séquence\nConfirmation de Rendez-vous par le Médecin

actor "Médecin" as Medecin #LightGreen
participant "Frontend\n(React)" as Frontend #E3F2FD
participant "Backend\n(NestJS)" as Backend #E8F5E9
database "Base de données\n(PostgreSQL)" as DB #FFF9C4
participant "Service\nNotification" as Notif #FFEBEE

Medecin -> Frontend : 1. Ouvre la page RDV
activate Frontend

Frontend -> Backend : 2. GET /api/medecins/rendezvous\n?statut=EN_ATTENTE
activate Backend

Backend -> Backend : 3. Vérifie JWT\n+ Rôle MEDECIN

Backend -> DB : 4. SELECT rdv\nWHERE medecinId AND statut
activate DB
DB --> Backend : 5. Liste des RDV en attente
deactivate DB

Backend --> Frontend : 6. RDV en attente (JSON)
deactivate Backend

Frontend --> Medecin : 7. Affiche liste RDV

Medecin -> Frontend : 8. Clic "Confirmer" sur un RDV

Frontend -> Backend : 9. PATCH /api/medecins/rendezvous/{id}\n{statut: "CONFIRME"}
activate Backend

Backend -> Backend : 10. Vérifie autorisation\n(propriétaire du RDV)

Backend -> DB : 11. UPDATE RendezVous\nSET statut = 'CONFIRME'
activate DB
DB --> Backend : 12. OK
deactivate DB

Backend -> Notif : 13. Notifier patient\n(email/SMS selon prefs)
activate Notif
Notif --> Backend : 14. OK
deactivate Notif

Backend --> Frontend : 15. {success: true}
deactivate Backend

Frontend --> Medecin : 16. "RDV confirmé"
Frontend -> Frontend : 17. Met à jour la liste
deactivate Frontend

note right of Backend
  **Seul le médecin** peut
  confirmer un rendez-vous

  Si un patient essaie,
  erreur 400 sera retournée
end note

@enduml
```

---

## 8. DIAGRAMME DE SÉQUENCE - AUTHENTIFICATION

```plantuml
@startuml Sequence_Authentification

skinparam backgroundColor #FEFEFE
skinparam sequenceArrowThickness 2

title Diagramme de Séquence\nAuthentification (Login)

actor "Utilisateur" as User
participant "Frontend\n(React)" as Frontend #E3F2FD
participant "Backend\n(NestJS)" as Backend #E8F5E9
participant "AuthService" as Auth #E8F5E9
database "Base de données\n(PostgreSQL)" as DB #FFF9C4

User -> Frontend : 1. Saisit email + mot de passe
activate Frontend

Frontend -> Frontend : 2. Validation locale\n(format email, etc.)

Frontend -> Backend : 3. POST /api/auth/login\n{email, motDePasse}
activate Backend

Backend -> Auth : 4. validateUser(email, mdp)
activate Auth

Auth -> DB : 5. SELECT user\nWHERE email
activate DB
DB --> Auth : 6. User data
deactivate DB

alt Utilisateur non trouvé
  Auth --> Backend : 7a. throw UnauthorizedException
  Backend --> Frontend : 8a. 401 Unauthorized
  Frontend --> User : 9a. "Email ou mot de passe incorrect"
else Utilisateur trouvé
  Auth -> Auth : 7b. bcrypt.compare(mdp, hash)

  alt Mot de passe incorrect
    Auth --> Backend : 8b. throw UnauthorizedException
    Backend --> Frontend : 9b. 401 Unauthorized
    Frontend --> User : 10b. "Email ou mot de passe incorrect"
  else Mot de passe correct
    Auth -> Auth : 8c. Vérifier isActive

    alt Compte désactivé
      Auth --> Backend : 9c. throw ForbiddenException
      Backend --> Frontend : 10c. 403 Forbidden
      Frontend --> User : 11c. "Compte désactivé"
    else Compte actif
      Auth -> Auth : 9d. Générer JWT\n(accessToken 15min)
      Auth -> Auth : 10d. Générer refreshToken\n(7 jours)

      Auth -> DB : 11d. UPDATE user\nSET refreshToken
      activate DB
      DB --> Auth : 12d. OK
      deactivate DB

      Auth --> Backend : 13d. {user, accessToken, refreshToken}
      deactivate Auth

      Backend --> Frontend : 14d. 200 OK\n{user, accessToken, refreshToken}
      deactivate Backend

      Frontend -> Frontend : 15d. localStorage.setItem\n(tokens)

      Frontend -> Frontend : 16d. Redirection selon rôle\n- PATIENT → /patient\n- MEDECIN → /medecin\n- ADMIN → /admin

      Frontend --> User : 17d. Dashboard affiché
      deactivate Frontend
    end
  end
end

note right of Auth
  **Tokens JWT**
  - accessToken: 15 minutes
  - refreshToken: 7 jours

  Le refreshToken permet
  de renouveler l'accessToken
  sans se reconnecter
end note

@enduml
```

---

## 9. MODÈLE CONCEPTUEL DE DONNÉES (MCD) - MERISE

```plantuml
@startuml MCD_Merise

skinparam backgroundColor #FEFEFE
skinparam classBorderThickness 2

title Modèle Conceptuel de Données (MCD)\nSystème de Gestion de Rendez-vous Médicaux

' Entités
entity "UTILISATEUR" as User {
  * **id** : UUID <<PK>>
  --
  email : VARCHAR(255)
  motDePasse : VARCHAR(255)
  nom : VARCHAR(100)
  prenom : VARCHAR(100)
  telephone : VARCHAR(20)
  dateNaissance : DATE
  adresse : TEXT
  role : ENUM
  isActive : BOOLEAN
  theme : ENUM
  langue : VARCHAR(10)
  prefsNotifEmail : BOOLEAN
  prefsNotifSms : BOOLEAN
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "MEDECIN" as Medecin {
  specialite : VARCHAR(100)
  numeroOrdre : VARCHAR(50)
  statutValidation : ENUM
}

entity "RENDEZ_VOUS" as RDV {
  * **id** : UUID <<PK>>
  --
  dateHeure : TIMESTAMP
  motif : TEXT
  statut : ENUM
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "CRENEAU_HORAIRE" as Creneau {
  * **id** : UUID <<PK>>
  --
  jour : ENUM
  heureDebut : VARCHAR(5)
  heureFin : VARCHAR(5)
  isAvailable : BOOLEAN
  createdAt : TIMESTAMP
}

entity "INDISPONIBILITE" as Indispo {
  * **id** : UUID <<PK>>
  --
  date : DATE
  raison : VARCHAR(255)
  createdAt : TIMESTAMP
}

entity "NOTE_MEDICALE" as Note {
  * **id** : UUID <<PK>>
  --
  contenu : TEXT
  statut : ENUM
  piecesJointes : TEXT[]
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "NOTIFICATION" as Notif {
  * **id** : UUID <<PK>>
  --
  type : ENUM
  titre : VARCHAR(255)
  description : TEXT
  lue : BOOLEAN
  createdAt : TIMESTAMP
}

' Relations
User ||--o| Medecin : "DF (1,1)"

User }|--|| RDV : "PRENDRE\n(patient)\n1,n - 1,1"
Medecin }|--|| RDV : "ASSURER\n1,n - 1,1"

Medecin }|--|| Creneau : "DEFINIR\n1,n - 1,1"
Medecin }|--|| Indispo : "DECLARER\n1,n - 1,1"

Medecin }|--|| Note : "REDIGER\n1,n - 1,1"
User }|--|| Note : "CONCERNER\n(patient)\n1,n - 1,1"

User }|--|| Notif : "RECEVOIR\n1,n - 1,1"

note bottom of RDV
  **Statuts possibles:**
  - EN_ATTENTE
  - CONFIRME
  - ANNULE
end note

note bottom of Medecin
  **Statuts validation:**
  - PENDING
  - APPROVED
  - REJECTED
end note

@enduml
```

---

## 10. DIAGRAMME ENTITÉ-RELATION (ERD)

```plantuml
@startuml ERD

skinparam backgroundColor #FEFEFE
skinparam linetype ortho

title Diagramme Entité-Relation (ERD)\nBase de données PostgreSQL

entity "User" as user {
  * id : UUID <<PK>>
  --
  email : VARCHAR(255) <<UNIQUE>>
  motDePasse : VARCHAR(255)
  nom : VARCHAR(100)
  prenom : VARCHAR(100)
  telephone : VARCHAR(20)
  dateNaissance : DATE
  adresse : TEXT
  role : Role <<ENUM>>
  isActive : BOOLEAN
  theme : Theme <<ENUM>>
  langue : VARCHAR(10)
  preferencesNotifEmail : BOOLEAN
  preferencesNotifSms : BOOLEAN
  -- Champs médecin --
  specialite : VARCHAR(100) <<NULL>>
  numeroOrdre : VARCHAR(50) <<NULL>>
  statutValidation : StatutValidation <<NULL>>
  -- Timestamps --
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "RendezVous" as rdv {
  * id : UUID <<PK>>
  --
  * patientId : UUID <<FK>>
  * medecinId : UUID <<FK>>
  date : TIMESTAMP
  motif : TEXT
  statut : StatutRendezVous <<ENUM>>
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "TimeSlot" as timeslot {
  * id : UUID <<PK>>
  --
  * medecinId : UUID <<FK>>
  jour : JourSemaine <<ENUM>>
  heureDebut : VARCHAR(5)
  heureFin : VARCHAR(5)
  isAvailable : BOOLEAN
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
  --
  <<UNIQUE>> (medecinId, jour, heureDebut)
}

entity "MedecinIndisponibilite" as indispo {
  * id : UUID <<PK>>
  --
  * medecinId : UUID <<FK>>
  date : DATE
  raison : VARCHAR(255)
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
  --
  <<UNIQUE>> (medecinId, date)
}

entity "NoteMedicale" as note {
  * id : UUID <<PK>>
  --
  * medecinId : UUID <<FK>>
  * patientId : UUID <<FK>>
  contenu : TEXT
  statut : StatutNote <<ENUM>>
  piecesJointes : TEXT[]
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "Notification" as notif {
  * id : UUID <<PK>>
  --
  * userId : UUID <<FK>>
  type : TypeNotification <<ENUM>>
  titre : VARCHAR(255)
  description : TEXT
  lue : BOOLEAN
  createdAt : TIMESTAMP
  updatedAt : TIMESTAMP
}

entity "AuditLog" as audit {
  * id : UUID <<PK>>
  --
  userId : UUID <<FK, NULL>>
  userName : VARCHAR(255)
  userRole : VARCHAR(50)
  action : VARCHAR(100)
  entity : VARCHAR(100)
  entityId : UUID
  ip : VARCHAR(45)
  userAgent : TEXT
  status : VARCHAR(20)
  metadata : JSONB
  createdAt : TIMESTAMP
}

' Relations
user ||--o{ rdv : "patientId"
user ||--o{ rdv : "medecinId"
user ||--o{ timeslot : "medecinId"
user ||--o{ indispo : "medecinId"
user ||--o{ note : "medecinId"
user ||--o{ note : "patientId"
user ||--o{ notif : "userId"
user ||--o{ audit : "userId"

@enduml
```

---

## 11. ARCHITECTURE TECHNIQUE

```plantuml
@startuml Architecture_Technique

skinparam backgroundColor #FEFEFE
skinparam componentStyle rectangle

title Architecture Technique du Système

package "Client (Navigateur Web)" {
  [Application React\nPort 3000] as React

  package "Frontend Components" {
    [Pages] as Pages
    [Components] as Comp
    [Context\n(Auth, Theme)] as Context
    [Services API] as Services
  }

  React --> Pages
  React --> Comp
  React --> Context
  React --> Services
}

cloud "HTTP/HTTPS" as HTTP

package "Serveur (Backend)" {
  [API NestJS\nPort 3002] as API

  package "Modules" {
    [Auth] as AuthMod
    [Patients] as PatMod
    [Médecins] as MedMod
    [Admin] as AdmMod
    [TimeSlots] as TSMod
    [Notifications] as NotifMod
  }

  package "Common" {
    [Guards\n(JWT, Roles)] as Guards
    [Filters\n(Exceptions)] as Filters
    [Interceptors\n(Logging)] as Inter
  }

  [Prisma Service] as Prisma

  API --> AuthMod
  API --> PatMod
  API --> MedMod
  API --> AdmMod
  API --> TSMod
  API --> NotifMod

  AuthMod --> Guards
  PatMod --> Guards
  MedMod --> Guards
  AdmMod --> Guards

  AuthMod --> Prisma
  PatMod --> Prisma
  MedMod --> Prisma
  AdmMod --> Prisma
  TSMod --> Prisma
}

database "PostgreSQL\nPort 5432" as DB {
  [User]
  [RendezVous]
  [TimeSlot]
  [Notification]
  [NoteMedicale]
  [AuditLog]
}

package "Services Externes" {
  [Nodemailer\n(Email)] as Email
  [Twilio\n(SMS)] as SMS
}

Services --> HTTP
HTTP --> API
Prisma --> DB
NotifMod --> Email
NotifMod --> SMS

note right of Guards
  **Guards NestJS**
  - JwtAuthGuard: Vérifie le token
  - RolesGuard: Vérifie le rôle
end note

note bottom of DB
  **Index de performance**
  - User.email
  - User.role
  - RendezVous.patientId
  - RendezVous.medecinId
  - RendezVous.date
end note

@enduml
```

---

# OUTILS RECOMMANDÉS POUR CRÉER LES DIAGRAMMES

## 1. Outils en ligne (GRATUITS)

### PlantUML Online
- **URL**: https://www.plantuml.com/plantuml/uml
- **Utilisation**: Copier-coller le code PlantUML ci-dessus
- **Export**: PNG, SVG, PDF

### Draw.io (Diagrams.net)
- **URL**: https://app.diagrams.net/
- **Utilisation**: Glisser-déposer pour créer des diagrammes
- **Export**: PNG, SVG, PDF, JPEG
- **Avantage**: Très facile à utiliser, templates UML disponibles

### Lucidchart (version gratuite limitée)
- **URL**: https://www.lucidchart.com/
- **Export**: PNG, PDF
- **Avantage**: Interface professionnelle

### Creately
- **URL**: https://creately.com/
- **Export**: PNG, PDF
- **Avantage**: Bon pour les diagrammes de cas d'utilisation

## 2. Logiciels de bureau (GRATUITS)

### StarUML
- **Téléchargement**: https://staruml.io/
- **Plateformes**: Windows, macOS, Linux
- **Avantage**: Très complet pour UML

### Dia
- **Téléchargement**: http://dia-installer.de/
- **Plateformes**: Windows, macOS, Linux
- **Avantage**: Simple et léger

### ArgoUML
- **Téléchargement**: https://argouml.en.softonic.com/
- **Plateformes**: Windows, macOS, Linux (Java)
- **Avantage**: Open source, standard UML

## 3. Outils spécifiques MCD/Merise

### Looping (RECOMMANDÉ pour MCD)
- **Téléchargement**: https://www.looping-mcd.fr/
- **Plateforme**: Windows
- **Avantage**: Spécialement conçu pour MCD/MLD Merise
- **Note**: LE MEILLEUR pour les schémas Merise français

### JMerise
- **Téléchargement**: https://www.jfreesoft.com/JMerise/
- **Plateformes**: Windows, macOS, Linux (Java)
- **Avantage**: Gratuit, pensé pour Merise

### DBDesigner 4
- **Téléchargement**: Rechercher "DBDesigner 4"
- **Plateforme**: Windows
- **Avantage**: Ancien mais efficace

## 4. Extensions VS Code

### PlantUML Extension
- **ID**: jebbs.plantuml
- **Utilisation**: Prévisualiser le code PlantUML directement dans VS Code
- **Raccourci**: Alt+D pour prévisualiser

### Draw.io Integration
- **ID**: hediet.vscode-drawio
- **Utilisation**: Créer des diagrammes Draw.io dans VS Code

## 5. Export et qualité d'image

Pour un mémoire professionnel, utilisez ces paramètres:
- **Format**: PNG ou PDF
- **Résolution**: 300 DPI minimum
- **Taille**: Adapter pour impression A4
- **Police**: Lisible (12pt minimum)

## PROCÉDURE RECOMMANDÉE

1. **Pour les diagrammes UML** (cas d'utilisation, séquence, classes):
   - Utiliser https://www.plantuml.com/plantuml/uml
   - Copier le code PlantUML de ce fichier
   - Télécharger en PNG (haute résolution)

2. **Pour le MCD/MLD**:
   - Télécharger Looping (Windows) ou JMerise
   - Créer le schéma visuellement
   - Exporter en image

3. **Pour l'architecture**:
   - Utiliser Draw.io
   - Créer le schéma manuellement
   - Exporter en PNG/PDF

---

*Document généré pour faciliter la création des diagrammes du mémoire*
