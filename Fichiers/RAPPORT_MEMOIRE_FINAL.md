# RAPPORT DE MÉMOIRE

## CONCEPTION ET RÉALISATION D'UNE APPLICATION WEB DE GESTION DE RENDEZ-VOUS MÉDICAUX

---

**Présenté par :** [Votre Nom]

**Sous la direction de :** [Nom du Directeur de Mémoire]

**Année académique :** [2024-2025]

---

# SOMMAIRE

- [REMERCIEMENTS](#remerciements)
- [SIGLES ET ABRÉVIATIONS](#sigles-et-abréviations)
- [LISTE DES FIGURES](#liste-des-figures)
- [LISTE DES TABLEAUX](#liste-des-tableaux)
- [INTRODUCTION GÉNÉRALE](#introduction-générale)
- [CHAPITRE 1 : PRÉSENTATION DU CADRE D'ÉTUDE](#chapitre-1--présentation-du-cadre-détude)
- [CHAPITRE 2 : ANALYSE ET SPÉCIFICATION DES BESOINS](#chapitre-2--analyse-et-spécification-des-besoins)
- [CHAPITRE 3 : CONCEPTION DU SYSTÈME](#chapitre-3--conception-du-système)
- [CHAPITRE 4 : RÉALISATION DE L'APPLICATION](#chapitre-4--réalisation-de-lapplication)
- [CHAPITRE 5 : TESTS, DÉPLOIEMENT ET PERSPECTIVES](#chapitre-5--tests-déploiement-et-perspectives)
- [CONCLUSION GÉNÉRALE](#conclusion-générale)
- [BIBLIOGRAPHIE ET WEBOGRAPHIE](#bibliographie-et-webographie)
- [ANNEXES](#annexes)

---

# REMERCIEMENTS

*[À compléter avec vos remerciements personnels]*

Nous tenons à exprimer notre profonde gratitude à toutes les personnes qui ont contribué à la réalisation de ce travail.

Nous remercions particulièrement :

- Notre directeur de mémoire, **[Nom]**, pour son encadrement, ses conseils avisés et sa disponibilité tout au long de ce projet ;
- L'ensemble du corps enseignant de **[Nom de l'établissement]** pour la qualité de la formation reçue ;
- La structure d'accueil **[Nom de la structure]** pour nous avoir permis de réaliser ce stage ;
- Nos familles et amis pour leur soutien indéfectible.

---

# SIGLES ET ABRÉVIATIONS

| Sigle | Signification |
|-------|---------------|
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| DTO | Data Transfer Object |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MCD | Modèle Conceptuel de Données |
| MLD | Modèle Logique de Données |
| MPD | Modèle Physique de Données |
| ORM | Object-Relational Mapping |
| REST | Representational State Transfer |
| RDV | Rendez-vous |
| SGBD | Système de Gestion de Base de Données |
| SMS | Short Message Service |
| SQL | Structured Query Language |
| UML | Unified Modeling Language |
| UUID | Universally Unique Identifier |

---

# LISTE DES FIGURES

| N° | Titre de la figure | Page |
|----|-------------------|------|
| Figure 1 | Organigramme de la structure d'accueil | |
| Figure 2 | Architecture globale du système | |
| Figure 3 | Diagramme de cas d'utilisation global | |
| Figure 4 | Diagramme de cas d'utilisation - Patient | |
| Figure 5 | Diagramme de cas d'utilisation - Médecin | |
| Figure 6 | Diagramme de cas d'utilisation - Administrateur | |
| Figure 7 | Modèle Conceptuel de Données (MCD) | |
| Figure 8 | Modèle Logique de Données (MLD) | |
| Figure 9 | Diagramme de classes UML | |
| Figure 10 | Diagramme de séquence - Prise de rendez-vous | |
| Figure 11 | Diagramme de séquence - Confirmation de rendez-vous | |
| Figure 12 | Diagramme de séquence - Authentification | |
| Figure 13 | Architecture technique du projet | |
| Figure 14 | Structure du projet backend | |
| Figure 15 | Structure du projet frontend | |
| Figure 16 | Capture d'écran - Page de connexion | |
| Figure 17 | Capture d'écran - Page d'inscription | |
| Figure 18 | Capture d'écran - Dashboard Patient | |
| Figure 19 | Capture d'écran - Prise de rendez-vous | |
| Figure 20 | Capture d'écran - Dashboard Médecin | |
| Figure 21 | Capture d'écran - Gestion des créneaux | |
| Figure 22 | Capture d'écran - Dashboard Administrateur | |
| Figure 23 | Capture d'écran - Statistiques | |

---

# LISTE DES TABLEAUX

| N° | Titre du tableau | Page |
|----|-----------------|------|
| Tableau 1 | Comparaison des solutions existantes | |
| Tableau 2 | Besoins fonctionnels par acteur | |
| Tableau 3 | Besoins non fonctionnels | |
| Tableau 4 | Description des cas d'utilisation - Patient | |
| Tableau 5 | Description des cas d'utilisation - Médecin | |
| Tableau 6 | Description des cas d'utilisation - Administrateur | |
| Tableau 7 | Dictionnaire de données | |
| Tableau 8 | Technologies utilisées - Backend | |
| Tableau 9 | Technologies utilisées - Frontend | |
| Tableau 10 | Endpoints de l'API REST | |
| Tableau 11 | Résultats des tests fonctionnels | |

---

# INTRODUCTION GÉNÉRALE

## 1. Contexte général

Aujourd'hui, le numérique transforme profondément notre façon de vivre et de travailler. Le secteur de la santé n'échappe pas à cette révolution. En Côte d'Ivoire, on constate que beaucoup de structures médicales fonctionnent encore avec des méthodes traditionnelles pour gérer leurs rendez-vous : appels téléphoniques, cahiers de réservation, files d'attente interminables.

Cette situation crée des frustrations aussi bien pour les patients que pour le personnel médical. Les patients perdent du temps, parfois une demi-journée, juste pour obtenir un rendez-vous. De leur côté, les médecins et leurs secrétaires passent un temps considérable à gérer des plannings sur papier.

C'est dans ce contexte que s'inscrit notre travail. Nous avons souhaité proposer une solution informatique simple et efficace pour faciliter la gestion des rendez-vous médicaux.

## 2. Problématique

L'observation du fonctionnement actuel de la plupart des cabinets médicaux révèle plusieurs problèmes majeurs :

**Accessibilité limitée** : Pour obtenir un rendez-vous, le patient doit généralement appeler ou se déplacer. Or, la ligne téléphonique est souvent occupée, et le déplacement peut s'avérer inutile si le médecin n'est pas disponible.

**Oublis fréquents** : L'absence de système de rappel automatique entraîne de nombreux rendez-vous manqués, ce qui désorganise le planning du médecin et représente une perte de temps et de ressources.

**Gestion chronophage** : La gestion manuelle des dossiers et des plannings mobilise énormément de temps du personnel médical, qui doit jongler entre le cahier de rendez-vous, les fiches patients et les rappels téléphoniques.

Face à ces constats, la question suivante se pose : **Comment utiliser les outils informatiques modernes pour simplifier la gestion des rendez-vous médicaux et améliorer l'expérience de tous les acteurs impliqués ?**

## 3. Justification du choix du thème

Plusieurs raisons ont motivé le choix de ce sujet :

**Un besoin concret et universel** : La difficulté à obtenir un rendez-vous médical est une expérience partagée par tous. En proposant une solution, nous répondons à un besoin réel de la société.

**Une application pratique des connaissances** : Ce projet nous permet de mettre en pratique l'ensemble des compétences acquises durant notre formation : développement web, bases de données, sécurité informatique, ergonomie des interfaces.

**Un projet à valeur ajoutée** : Ce n'est pas un simple exercice théorique. À l'issue de ce travail, nous disposerons d'une application fonctionnelle pouvant être déployée dans un vrai cabinet médical.

## 4. Objectifs de l'étude

### 4.1. Objectif général

L'objectif principal est de concevoir et réaliser une application web permettant de gérer les rendez-vous médicaux de manière simple et efficace. Cette application doit permettre aux patients de prendre rendez-vous en ligne, aux médecins de gérer leur planning facilement, et à un administrateur de superviser l'ensemble du système.

### 4.2. Objectifs spécifiques

Pour atteindre cet objectif général, nous nous sommes fixé les objectifs spécifiques suivants :

- Analyser et comprendre les besoins de chaque type d'utilisateur (patient, médecin, administrateur)
- Concevoir une base de données structurée et optimisée pour stocker les informations
- Développer une API REST sécurisée pour la communication entre le frontend et le backend
- Créer une interface utilisateur moderne, intuitive et responsive
- Mettre en place un système de notifications pour les rappels de rendez-vous
- Sécuriser l'application avec un système d'authentification robuste et une gestion des droits d'accès

## 5. Méthodologie adoptée

Pour mener à bien ce projet, nous avons procédé par étapes :

**Phase d'analyse** : Étude de l'existant, identification des besoins et des contraintes, rédaction du cahier des charges.

**Phase de conception** : Modélisation UML (cas d'utilisation, diagrammes de classes, diagrammes de séquence), conception de la base de données (MCD, MLD, MPD), maquettage des interfaces.

**Phase de développement** : Implémentation du backend avec NestJS, développement du frontend avec React, tests unitaires et d'intégration.

**Phase de documentation** : Rédaction du présent mémoire et de la documentation technique.

## 6. Organisation du mémoire

Ce document est organisé en cinq chapitres :

**Chapitre 1** : Présentation du cadre d'étude - Structure d'accueil et contexte du projet

**Chapitre 2** : Analyse et spécification des besoins - Étude de l'existant, identification des acteurs et de leurs besoins

**Chapitre 3** : Conception du système - Architecture, modélisation UML, conception de la base de données

**Chapitre 4** : Réalisation de l'application - Technologies utilisées, développement backend et frontend

**Chapitre 5** : Tests, déploiement et perspectives - Validation, mise en production et évolutions futures

---

# CHAPITRE 1 : PRÉSENTATION DU CADRE D'ÉTUDE

## 1.1. Présentation de la structure d'accueil

### 1.1.1. Historique

*[À compléter avec les informations sur votre structure d'accueil : date de création, fondateurs, évolution au fil des années]*

### 1.1.2. Mission et activités

*[À compléter avec les missions principales de la structure et ses domaines d'activité]*

### 1.1.3. Organisation interne

*[À compléter avec l'organigramme ou la description de l'organisation]*

> **[IMAGE 1 : ORGANIGRAMME]**
> *Insérer ici l'organigramme de la structure d'accueil*
> Format recommandé : PNG ou PDF, résolution 300 DPI minimum

## 1.2. Présentation du projet

### 1.2.1. Contexte du projet

Ce projet est né d'un constat simple : la gestion des rendez-vous médicaux, telle qu'elle se pratique actuellement dans de nombreux établissements, n'est pas optimale. Les pertes de temps, les erreurs et les oublis sont fréquents.

L'idée est de créer une plateforme en ligne centralisant l'ensemble des opérations. Le patient se connecte, visualise les médecins disponibles, sélectionne un créneau, et la réservation est effectuée. De son côté, le médecin voit son planning se remplir automatiquement, peut confirmer ou reporter les rendez-vous, et accède aux informations de ses patients.

Un espace administrateur permet de gérer les comptes utilisateurs, valider les inscriptions des médecins, et avoir une vue d'ensemble sur l'activité de la plateforme.

### 1.2.2. Cahier des charges

#### Fonctionnalités pour les patients

- Créer un compte et se connecter de manière sécurisée
- Rechercher un médecin selon sa spécialité
- Consulter les créneaux disponibles
- Prendre un rendez-vous en ligne
- Annuler un rendez-vous si nécessaire
- Consulter l'historique des rendez-vous
- Recevoir des rappels par email ou SMS
- Modifier son profil et ses préférences

#### Fonctionnalités pour les médecins

- S'inscrire en fournissant ses informations professionnelles
- Définir ses horaires de disponibilité
- Consulter la liste des rendez-vous
- Confirmer ou annuler des rendez-vous
- Accéder aux informations de ses patients
- Rédiger des notes médicales
- Signaler ses absences (congés, formations)

#### Fonctionnalités pour l'administrateur

- Valider les comptes des nouveaux médecins
- Gérer tous les utilisateurs (activation, désactivation)
- Consulter les statistiques de la plateforme
- Superviser l'ensemble des rendez-vous

#### Contraintes techniques

- Application responsive (ordinateur, tablette, smartphone)
- Sécurité renforcée (données médicales sensibles)
- Interface disponible en français et en anglais
- Temps de chargement optimisés

### 1.2.3. Objectifs du projet

Les objectifs concrets de ce projet sont :

1. Permettre aux patients de prendre rendez-vous à tout moment, depuis n'importe où
2. Réduire la charge administrative des médecins
3. Diminuer le nombre de rendez-vous manqués grâce aux rappels automatiques
4. Centraliser toutes les informations pour une meilleure traçabilité
5. Offrir une interface simple et accessible à tous les utilisateurs

---

# CHAPITRE 2 : ANALYSE ET SPÉCIFICATION DES BESOINS

## 2.1. Étude de l'existant

### 2.1.1. Méthodes actuelles de prise de rendez-vous

Avant de développer notre solution, nous avons analysé les méthodes actuellement utilisées :

**Par téléphone** : Méthode la plus courante. Le patient appelle le cabinet, la secrétaire vérifie le planning et propose un créneau. Inconvénients : ligne souvent occupée, disponible uniquement aux heures d'ouverture.

**En présentiel** : Certains patients préfèrent se déplacer directement au cabinet. Inconvénient : déplacement parfois inutile si le médecin n'est pas disponible.

**Par email** : Quelques cabinets acceptent les demandes par email. Inconvénient : réponse différée, pas de confirmation immédiate.

**Cahier de rendez-vous** : Méthode traditionnelle utilisant un support papier. Inconvénients : pas de rappels automatiques, risque d'erreurs.

### 2.1.2. Analyse critique du système existant

| Critère | Méthode traditionnelle | Notre solution |
|---------|------------------------|----------------|
| Disponibilité | Heures de bureau | 24h/24, 7j/7 |
| Temps d'attente | Variable (file d'attente, ligne occupée) | Instantané |
| Rappels | Manuel ou inexistant | Automatique |
| Historique | Difficile à retrouver | Accessible en un clic |
| Gestion des annulations | Complexe | Simple et traçable |
| Statistiques | Inexistantes | Automatiques |

> **[TABLEAU 1 : COMPARAISON DES SOLUTIONS EXISTANTES]**
> *Ce tableau peut être enrichi avec d'autres critères pertinents*

### 2.1.3. Limites et insuffisances identifiées

**Disponibilité limitée** : Impossibilité de prendre rendez-vous en dehors des heures de travail du secrétariat.

**Manque de visibilité** : Le patient ne connaît pas les créneaux disponibles avant de contacter le cabinet.

**Taux d'absentéisme élevé** : Sans système de rappel automatique, de nombreux patients oublient leur rendez-vous.

**Gestion complexe** : Reporter ou annuler un rendez-vous nécessite des manipulations fastidieuses.

**Absence d'historique structuré** : Retrouver les anciens rendez-vous d'un patient demande de feuilleter de nombreuses pages.

## 2.2. Analyse des besoins

### 2.2.1. Identification des acteurs

Notre système identifie trois acteurs principaux :

> **[IMAGE 2 : DIAGRAMME DES ACTEURS]**
> *Insérer ici un schéma montrant les trois acteurs et leurs interactions avec le système*

**Le Patient** : Personne souhaitant consulter un médecin. Il a besoin de trouver facilement un praticien, consulter ses disponibilités et réserver un créneau.

**Le Médecin** : Professionnel de santé recevant les patients. Il doit pouvoir définir ses disponibilités, gérer ses rendez-vous et accéder aux informations de ses patients.

**L'Administrateur** : Gestionnaire de la plateforme. Il supervise les utilisateurs, valide les inscriptions des médecins et surveille le bon fonctionnement du système.

### 2.2.2. Besoins fonctionnels

#### Besoins du Patient

| Code | Besoin fonctionnel | Priorité |
|------|-------------------|----------|
| BF-P01 | S'inscrire avec email, nom, prénom et mot de passe | Haute |
| BF-P02 | Se connecter à son compte | Haute |
| BF-P03 | Modifier ses informations personnelles | Moyenne |
| BF-P04 | Rechercher des médecins par nom ou spécialité | Haute |
| BF-P05 | Visualiser les créneaux disponibles d'un médecin | Haute |
| BF-P06 | Réserver un créneau | Haute |
| BF-P07 | Consulter ses rendez-vous (passés et à venir) | Haute |
| BF-P08 | Annuler un rendez-vous | Haute |
| BF-P09 | Recevoir des notifications (email/SMS) | Moyenne |
| BF-P10 | Configurer ses préférences (langue, thème) | Basse |

#### Besoins du Médecin

| Code | Besoin fonctionnel | Priorité |
|------|-------------------|----------|
| BF-M01 | S'inscrire avec spécialité et numéro d'ordre | Haute |
| BF-M02 | Attendre la validation de son compte | Haute |
| BF-M03 | Créer ses créneaux de disponibilité | Haute |
| BF-M04 | Modifier ou supprimer ses créneaux | Haute |
| BF-M05 | Déclarer une période d'indisponibilité | Moyenne |
| BF-M06 | Consulter ses rendez-vous | Haute |
| BF-M07 | Confirmer un rendez-vous en attente | Haute |
| BF-M08 | Annuler un rendez-vous | Haute |
| BF-M09 | Consulter la liste de ses patients | Haute |
| BF-M10 | Créer et gérer des notes médicales | Moyenne |
| BF-M11 | Joindre des fichiers aux notes | Basse |

#### Besoins de l'Administrateur

| Code | Besoin fonctionnel | Priorité |
|------|-------------------|----------|
| BF-A01 | Se connecter avec un compte administrateur | Haute |
| BF-A02 | Consulter la liste des utilisateurs | Haute |
| BF-A03 | Activer ou désactiver un compte | Haute |
| BF-A04 | Valider ou refuser l'inscription d'un médecin | Haute |
| BF-A05 | Consulter les statistiques globales | Moyenne |
| BF-A06 | Superviser tous les rendez-vous | Moyenne |

> **[TABLEAU 2 : BESOINS FONCTIONNELS PAR ACTEUR]**
> *Les tableaux ci-dessus constituent le Tableau 2*

### 2.2.3. Besoins non fonctionnels

| Code | Besoin non fonctionnel | Description |
|------|------------------------|-------------|
| BNF-01 | Performance | Temps de chargement < 3 secondes |
| BNF-02 | Sécurité | Mots de passe hashés, connexions sécurisées |
| BNF-03 | Disponibilité | Application accessible 24h/24 |
| BNF-04 | Ergonomie | Interface intuitive, pas de formation nécessaire |
| BNF-05 | Responsive | Compatible ordinateur, tablette, smartphone |
| BNF-06 | Évolutivité | Code modulaire permettant des ajouts futurs |
| BNF-07 | Maintenabilité | Code documenté et structuré |

> **[TABLEAU 3 : BESOINS NON FONCTIONNELS]**

## 2.3. Spécifications fonctionnelles

### 2.3.1. Diagrammes de cas d'utilisation

#### Diagramme de cas d'utilisation global

> **[IMAGE 3 : DIAGRAMME DE CAS D'UTILISATION GLOBAL]**
> *Insérer ici le diagramme montrant les trois acteurs et leurs cas d'utilisation principaux*
>
> **Code PlantUML disponible dans le fichier : Fichiers/diagramme_cas_utilisation.md**

#### Cas d'utilisation du Patient

> **[IMAGE 4 : DIAGRAMME DE CAS D'UTILISATION - PATIENT]**

```
┌─────────────────────────────────────────────────────────────┐
│                     ESPACE PATIENT                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌───────────────┐                                        │
│    │   PATIENT     │                                        │
│    └───────┬───────┘                                        │
│            │                                                │
│            ├──── S'inscrire                                 │
│            ├──── Se connecter                               │
│            ├──── Gérer son profil                           │
│            ├──── Rechercher un médecin                      │
│            ├──── Consulter les disponibilités               │
│            ├──── Prendre un rendez-vous                     │
│            ├──── Consulter ses rendez-vous                  │
│            ├──── ANNULER un rendez-vous (seule action)      │
│            ├──── Recevoir des notifications                 │
│            └──── Configurer ses préférences                 │
│                                                             │
│    ⚠️  IMPORTANT : Le patient ne peut PAS confirmer         │
│       ses rendez-vous. Seul le médecin peut confirmer.      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Cas d'utilisation du Médecin

> **[IMAGE 5 : DIAGRAMME DE CAS D'UTILISATION - MÉDECIN]**

```
┌─────────────────────────────────────────────────────────────┐
│                     ESPACE MÉDECIN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌───────────────┐                                        │
│    │   MÉDECIN     │                                        │
│    └───────┬───────┘                                        │
│            │                                                │
│            ├──── S'inscrire (avec numéro d'ordre)           │
│            ├──── Se connecter (après validation)            │
│            ├──── Gérer son profil professionnel             │
│            ├──── Gérer ses créneaux de disponibilité        │
│            ├──── Déclarer ses indisponibilités              │
│            ├──── Consulter ses rendez-vous                  │
│            ├──── CONFIRMER les rendez-vous ✓                │
│            ├──── Annuler les rendez-vous                    │
│            ├──── Consulter ses patients                     │
│            ├──── Gérer les notes médicales                  │
│            └──── Consulter ses statistiques                 │
│                                                             │
│    ✓ Le médecin est le SEUL à pouvoir confirmer            │
│      un rendez-vous (EN_ATTENTE → CONFIRMÉ)                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### Cas d'utilisation de l'Administrateur

> **[IMAGE 6 : DIAGRAMME DE CAS D'UTILISATION - ADMINISTRATEUR]**

```
┌─────────────────────────────────────────────────────────────┐
│                  ESPACE ADMINISTRATEUR                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌───────────────┐                                        │
│    │     ADMIN     │                                        │
│    └───────┬───────┘                                        │
│            │                                                │
│            ├──── Se connecter                               │
│            ├──── Gérer les patients                         │
│            │     ├── Lister les patients                    │
│            │     ├── Activer/Désactiver un compte           │
│            │     └── Consulter les détails                  │
│            ├──── Gérer les médecins                         │
│            │     ├── Lister les médecins                    │
│            │     ├── VALIDER les inscriptions               │
│            │     ├── Rejeter les inscriptions               │
│            │     └── Activer/Désactiver un compte           │
│            ├──── Superviser les rendez-vous                 │
│            ├──── Consulter les statistiques                 │
│            └──── Consulter les logs d'audit                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.3.2. Description détaillée des cas d'utilisation

#### Scénario : Prise de rendez-vous par un patient

| Élément | Description |
|---------|-------------|
| **Nom** | Prendre un rendez-vous |
| **Acteur** | Patient |
| **Préconditions** | Le patient est connecté à son compte |
| **Scénario nominal** | 1. Le patient accède à la page de recherche de médecins<br>2. Il saisit le nom ou la spécialité recherchée<br>3. Le système affiche la liste des médecins correspondants<br>4. Le patient sélectionne un médecin<br>5. Le système affiche les créneaux disponibles<br>6. Le patient sélectionne un créneau<br>7. Le patient renseigne le motif (optionnel) et valide<br>8. Le système crée le rendez-vous avec le statut "EN_ATTENTE"<br>9. Une notification est envoyée au médecin<br>10. Le patient reçoit une confirmation |
| **Postconditions** | Un rendez-vous est créé en base de données |
| **Exceptions** | E1: Aucun médecin trouvé<br>E2: Aucun créneau disponible<br>E3: Erreur technique |

> **[TABLEAU 4 : DESCRIPTION DES CAS D'UTILISATION]**

#### Scénario : Confirmation d'un rendez-vous par le médecin

| Élément | Description |
|---------|-------------|
| **Nom** | Confirmer un rendez-vous |
| **Acteur** | Médecin |
| **Préconditions** | Le médecin est connecté et a des rendez-vous en attente |
| **Scénario nominal** | 1. Le médecin accède à sa liste de rendez-vous<br>2. Il filtre par statut "EN_ATTENTE"<br>3. Il sélectionne un rendez-vous<br>4. Il clique sur "Confirmer"<br>5. Le système modifie le statut en "CONFIRMÉ"<br>6. Une notification est envoyée au patient |
| **Postconditions** | Le rendez-vous passe au statut "CONFIRMÉ" |
| **Exceptions** | E1: Le rendez-vous a déjà été modifié |

## 2.4. Contraintes du projet

### 2.4.1. Contraintes techniques

Les technologies suivantes ont été retenues :

- **Backend** : NestJS (framework Node.js/TypeScript)
- **Frontend** : React (bibliothèque JavaScript)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Communication** : API REST (JSON via HTTP)

### 2.4.2. Contraintes organisationnelles

Le projet a été réalisé sur une période limitée, par une équipe réduite. Des choix de priorisation ont été nécessaires.

### 2.4.3. Contraintes de sécurité

La manipulation de données de santé impose des mesures de sécurité strictes :

- Hashage des mots de passe avec BCrypt
- Authentification par tokens JWT (expiration : 15 minutes)
- Contrôle d'accès basé sur les rôles (RBAC)
- Validation des entrées utilisateur
- Vérification des fichiers uploadés (type et taille)

---

# CHAPITRE 3 : CONCEPTION DU SYSTÈME

## 3.1. Architecture du système

### 3.1.1. Architecture globale

Notre application suit une architecture **client-serveur** avec trois composants principaux :

> **[IMAGE 7 : ARCHITECTURE GLOBALE DU SYSTÈME]**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ARCHITECTURE GLOBALE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌─────────────┐         ┌─────────────┐         ┌─────────────┐          │
│   │   CLIENT    │         │   SERVEUR   │         │    BASE     │          │
│   │  (Frontend) │  HTTP   │  (Backend)  │   SQL   │  DE DONNÉES │          │
│   │             │ ◄─────► │             │ ◄─────► │             │          │
│   │   React     │  JSON   │   NestJS    │         │ PostgreSQL  │          │
│   │  Port 3000  │         │  Port 3002  │         │  Port 5432  │          │
│   └─────────────┘         └─────────────┘         └─────────────┘          │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │                      FLUX DE DONNÉES                        │          │
│   │                                                             │          │
│   │  1. L'utilisateur interagit avec l'interface (React)        │          │
│   │  2. Le frontend envoie une requête HTTP au backend          │          │
│   │  3. Le backend valide la requête et les droits d'accès      │          │
│   │  4. Le backend interroge la base de données via Prisma      │          │
│   │  5. La base de données retourne les résultats               │          │
│   │  6. Le backend formate et renvoie la réponse JSON           │          │
│   │  7. Le frontend met à jour l'affichage                      │          │
│   │                                                             │          │
│   └─────────────────────────────────────────────────────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1.2. Justification des choix technologiques

| Technologie | Justification |
|-------------|---------------|
| **NestJS** | Framework structuré basé sur des modules, utilisation de TypeScript pour la robustesse du code |
| **React** | Bibliothèque populaire avec une grande communauté, permet des interfaces réactives |
| **PostgreSQL** | SGBD relationnel fiable, performant et open source |
| **Prisma** | ORM moderne simplifiant les requêtes et assurant la sécurité des données |
| **Tailwind CSS** | Framework CSS utilitaire permettant un développement rapide |
| **JWT** | Standard d'authentification stateless, adapté aux API REST |

> **[TABLEAU 8 : TECHNOLOGIES UTILISÉES - BACKEND]**
> **[TABLEAU 9 : TECHNOLOGIES UTILISÉES - FRONTEND]**

## 3.2. Modélisation UML

### 3.2.1. Diagramme de cas d'utilisation

Les diagrammes de cas d'utilisation ont été présentés dans le chapitre précédent.

### 3.2.2. Diagramme de classes

> **[IMAGE 8 : DIAGRAMME DE CLASSES UML]**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DIAGRAMME DE CLASSES                                  │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────┐                                             │
│  │        UTILISATEUR          │                                             │
│  ├─────────────────────────────┤                                             │
│  │ - id: UUID                  │                                             │
│  │ - nom: String               │                                             │
│  │ - prenom: String            │                                             │
│  │ - email: String (unique)    │                                             │
│  │ - motDePasse: String        │                                             │
│  │ - role: Role                │                                             │
│  │ - telephone: String         │                                             │
│  │ - dateNaissance: Date       │                                             │
│  │ - adresse: String           │                                             │
│  │ - isActive: Boolean         │                                             │
│  │ - theme: Theme              │                                             │
│  │ - langue: String            │                                             │
│  │ - preferencesNotifEmail: Boolean │                                        │
│  │ - preferencesNotifSms: Boolean   │                                        │
│  │ - createdAt: DateTime       │                                             │
│  │ - updatedAt: DateTime       │                                             │
│  ├─────────────────────────────┤                                             │
│  │ + seConnecter()             │                                             │
│  │ + modifierProfil()          │                                             │
│  └──────────────┬──────────────┘                                             │
│                 │                                                            │
│                 │ hérite                                                     │
│                 ▼                                                            │
│  ┌─────────────────────────────┐                                             │
│  │         MÉDECIN             │                                             │
│  ├─────────────────────────────┤                                             │
│  │ - specialite: String        │                                             │
│  │ - numeroOrdre: String       │                                             │
│  │ - statutValidation: StatutValidation │                                    │
│  ├─────────────────────────────┤                                             │
│  │ + gererCreneaux()           │                                             │
│  │ + confirmerRendezVous()     │                                             │
│  │ + creerNoteMedicale()       │                                             │
│  └─────────────────────────────┘                                             │
│                                                                              │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐         │
│  │       RENDEZ-VOUS           │     │       CRÉNEAU HORAIRE       │         │
│  ├─────────────────────────────┤     ├─────────────────────────────┤         │
│  │ - id: UUID                  │     │ - id: UUID                  │         │
│  │ - patientId: UUID           │     │ - medecinId: UUID           │         │
│  │ - medecinId: UUID           │     │ - jour: JourSemaine         │         │
│  │ - date: DateTime            │     │ - heureDebut: String        │         │
│  │ - motif: String             │     │ - heureFin: String          │         │
│  │ - statut: StatutRendezVous  │     │ - isAvailable: Boolean      │         │
│  │ - createdAt: DateTime       │     │ - createdAt: DateTime       │         │
│  ├─────────────────────────────┤     ├─────────────────────────────┤         │
│  │ + annuler()                 │     │ + activer()                 │         │
│  │ + confirmer()               │     │ + desactiver()              │         │
│  └─────────────────────────────┘     └─────────────────────────────┘         │
│                                                                              │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐         │
│  │      NOTE MÉDICALE          │     │       NOTIFICATION          │         │
│  ├─────────────────────────────┤     ├─────────────────────────────┤         │
│  │ - id: UUID                  │     │ - id: UUID                  │         │
│  │ - medecinId: UUID           │     │ - userId: UUID              │         │
│  │ - patientId: UUID           │     │ - type: TypeNotification    │         │
│  │ - contenu: String           │     │ - titre: String             │         │
│  │ - statut: StatutNote        │     │ - description: String       │         │
│  │ - piecesJointes: String[]   │     │ - lue: Boolean              │         │
│  │ - createdAt: DateTime       │     │ - createdAt: DateTime       │         │
│  ├─────────────────────────────┤     ├─────────────────────────────┤         │
│  │ + modifier()                │     │ + marquerCommeLue()         │         │
│  │ + archiver()                │     └─────────────────────────────┘         │
│  │ + ajouterPieceJointe()      │                                             │
│  └─────────────────────────────┘                                             │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2.3. Diagrammes de séquence

#### Séquence : Prise de rendez-vous

> **[IMAGE 9 : DIAGRAMME DE SÉQUENCE - PRISE DE RENDEZ-VOUS]**

```
┌─────────┐      ┌──────────┐      ┌──────────┐      ┌────────────┐      ┌──────────────┐
│ Patient │      │ Frontend │      │ Backend  │      │  Database  │      │ Notification │
└────┬────┘      └────┬─────┘      └────┬─────┘      └──────┬─────┘      └──────┬───────┘
     │                │                 │                   │                   │
     │ 1. Clic "Prendre RDV"            │                   │                   │
     │───────────────►│                 │                   │                   │
     │                │                 │                   │                   │
     │                │ 2. GET /api/timeslots/:medecinId    │                   │
     │                │────────────────►│                   │                   │
     │                │                 │                   │                   │
     │                │                 │ 3. SELECT créneaux│                   │
     │                │                 │──────────────────►│                   │
     │                │                 │                   │                   │
     │                │                 │ 4. Résultats      │                   │
     │                │                 │◄──────────────────│                   │
     │                │                 │                   │                   │
     │                │ 5. Créneaux disponibles             │                   │
     │                │◄────────────────│                   │                   │
     │                │                 │                   │                   │
     │ 6. Affiche calendrier            │                   │                   │
     │◄───────────────│                 │                   │                   │
     │                │                 │                   │                   │
     │ 7. Sélectionne créneau + valide  │                   │                   │
     │───────────────►│                 │                   │                   │
     │                │                 │                   │                   │
     │                │ 8. POST /api/patients/rendezvous    │                   │
     │                │────────────────►│                   │                   │
     │                │                 │                   │                   │
     │                │                 │ 9. INSERT rendez-vous (EN_ATTENTE)    │
     │                │                 │──────────────────►│                   │
     │                │                 │                   │                   │
     │                │                 │ 10. OK            │                   │
     │                │                 │◄──────────────────│                   │
     │                │                 │                   │                   │
     │                │                 │ 11. Notifier médecin                  │
     │                │                 │──────────────────────────────────────►│
     │                │                 │                   │                   │
     │                │ 12. Confirmation│                   │                   │
     │                │◄────────────────│                   │                   │
     │                │                 │                   │                   │
     │ 13. Message succès               │                   │                   │
     │◄───────────────│                 │                   │                   │
     │                │                 │                   │                   │
```

#### Séquence : Confirmation de rendez-vous par le médecin

> **[IMAGE 10 : DIAGRAMME DE SÉQUENCE - CONFIRMATION]**

```
┌─────────┐      ┌──────────┐      ┌──────────┐      ┌────────────┐      ┌──────────────┐
│ Médecin │      │ Frontend │      │ Backend  │      │  Database  │      │ Notification │
└────┬────┘      └────┬─────┘      └────┬─────┘      └──────┬─────┘      └──────┬───────┘
     │                │                 │                   │                   │
     │ 1. Ouvre liste RDV               │                   │                   │
     │───────────────►│                 │                   │                   │
     │                │                 │                   │                   │
     │                │ 2. GET /api/medecins/rendezvous     │                   │
     │                │────────────────►│                   │                   │
     │                │                 │                   │                   │
     │                │                 │ 3. SELECT         │                   │
     │                │                 │──────────────────►│                   │
     │                │                 │                   │                   │
     │                │                 │ 4. Liste RDV      │                   │
     │                │                 │◄──────────────────│                   │
     │                │                 │                   │                   │
     │                │ 5. Rendez-vous  │                   │                   │
     │                │◄────────────────│                   │                   │
     │                │                 │                   │                   │
     │ 6. Affiche liste                 │                   │                   │
     │◄───────────────│                 │                   │                   │
     │                │                 │                   │                   │
     │ 7. Clic "Confirmer" sur un RDV   │                   │                   │
     │───────────────►│                 │                   │                   │
     │                │                 │                   │                   │
     │                │ 8. PATCH /api/medecins/rendezvous/:id                   │
     │                │     { statut: "CONFIRME" }          │                   │
     │                │────────────────►│                   │                   │
     │                │                 │                   │                   │
     │                │                 │ 9. UPDATE statut = 'CONFIRME'         │
     │                │                 │──────────────────►│                   │
     │                │                 │                   │                   │
     │                │                 │ 10. OK            │                   │
     │                │                 │◄──────────────────│                   │
     │                │                 │                   │                   │
     │                │                 │ 11. Notifier patient                  │
     │                │                 │──────────────────────────────────────►│
     │                │                 │                   │                   │
     │                │ 12. Confirmation│                   │                   │
     │                │◄────────────────│                   │                   │
     │                │                 │                   │                   │
     │ 13. RDV confirmé                 │                   │                   │
     │◄───────────────│                 │                   │                   │
     │                │                 │                   │                   │
```

#### Séquence : Authentification

> **[IMAGE 11 : DIAGRAMME DE SÉQUENCE - AUTHENTIFICATION]**

```
┌─────────────┐    ┌──────────┐    ┌──────────┐    ┌────────────┐
│ Utilisateur │    │ Frontend │    │ Backend  │    │  Database  │
└──────┬──────┘    └────┬─────┘    └────┬─────┘    └──────┬─────┘
       │                │               │                 │
       │ 1. Saisit email + mot de passe │                 │
       │───────────────►│               │                 │
       │                │               │                 │
       │                │ 2. POST /api/auth/login         │
       │                │──────────────►│                 │
       │                │               │                 │
       │                │               │ 3. SELECT user WHERE email
       │                │               │────────────────►│
       │                │               │                 │
       │                │               │ 4. User data    │
       │                │               │◄────────────────│
       │                │               │                 │
       │                │               │ 5. Vérifier mot de passe (BCrypt)
       │                │               │─────┐           │
       │                │               │     │           │
       │                │               │◄────┘           │
       │                │               │                 │
       │                │               │ 6. Générer JWT (accessToken + refreshToken)
       │                │               │─────┐           │
       │                │               │     │           │
       │                │               │◄────┘           │
       │                │               │                 │
       │                │ 7. { user, accessToken, refreshToken }
       │                │◄──────────────│                 │
       │                │               │                 │
       │                │ 8. Stocker tokens dans localStorage
       │                │─────┐         │                 │
       │                │     │         │                 │
       │                │◄────┘         │                 │
       │                │               │                 │
       │ 9. Redirection vers dashboard  │                 │
       │◄───────────────│               │                 │
       │                │               │                 │
```

## 3.3. Conception de la base de données

### 3.3.1. Modèle Conceptuel de Données (MCD)

> **[IMAGE 12 : MODÈLE CONCEPTUEL DE DONNÉES (MCD)]**
>
> *Utiliser un outil comme Looping, JMerise, ou Draw.io pour créer ce schéma*

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        MODÈLE CONCEPTUEL DE DONNÉES                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                                                                                  │
│    ┌─────────────────┐                           ┌─────────────────┐             │
│    │   UTILISATEUR   │                           │    MÉDECIN      │             │
│    ├─────────────────┤                           ├─────────────────┤             │
│    │ _id             │       DF                  │ specialite      │             │
│    │ email           │◄──────────────────────────│ numeroOrdre     │             │
│    │ motDePasse      │       (1,1)               │ statutValidation│             │
│    │ nom             │                           └─────────────────┘             │
│    │ prenom          │                                                           │
│    │ telephone       │                                                           │
│    │ dateNaissance   │                                                           │
│    │ adresse         │                                                           │
│    │ role            │                                                           │
│    │ isActive        │                                                           │
│    │ theme           │                                                           │
│    │ langue          │                                                           │
│    │ prefsNotifEmail │                                                           │
│    │ prefsNotifSms   │                                                           │
│    │ createdAt       │                                                           │
│    │ updatedAt       │                                                           │
│    └────────┬────────┘                                                           │
│             │                                                                    │
│    ┌────────┴────────┬─────────────────┬─────────────────┐                      │
│    │                 │                 │                 │                      │
│    ▼                 ▼                 ▼                 ▼                      │
│ ┌──────┐         ┌──────┐         ┌──────┐         ┌──────┐                    │
│ │PRENDRE│         │ASSURER│        │DÉFINIR│        │RECEVOIR│                   │
│ │(1,n) │         │(1,n) │         │(1,n) │         │(1,n) │                    │
│ └──┬───┘         └──┬───┘         └──┬───┘         └──┬───┘                    │
│    │                │                │                │                         │
│    │    ┌───────────┘                │                │                         │
│    │    │                            │                │                         │
│    ▼    ▼                            ▼                ▼                         │
│ ┌─────────────────┐          ┌─────────────────┐  ┌─────────────────┐          │
│ │   RENDEZ-VOUS   │          │ CRÉNEAU HORAIRE │  │  NOTIFICATION   │          │
│ ├─────────────────┤          ├─────────────────┤  ├─────────────────┤          │
│ │ _id             │          │ _id             │  │ _id             │          │
│ │ dateHeure       │          │ jour            │  │ type            │          │
│ │ motif           │          │ heureDebut      │  │ titre           │          │
│ │ statut          │          │ heureFin        │  │ description     │          │
│ │ createdAt       │          │ isAvailable     │  │ lue             │          │
│ │ updatedAt       │          │ createdAt       │  │ createdAt       │          │
│ └─────────────────┘          └─────────────────┘  └─────────────────┘          │
│                                                                                  │
│                                                                                  │
│   Autres entités : NOTE_MEDICALE, INDISPONIBILITE, AUDIT_LOG                    │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Format Merise :**

```
UTILISATEUR: _id, email, motDePasse, nom, prenom, telephone, dateNaissance,
             adresse, role, isActive, theme, langue, prefsNotifEmail,
             prefsNotifSms, createdAt, updatedAt

MEDECIN: specialite, numeroOrdre, statutValidation
DF, _11 MEDECIN, 11 UTILISATEUR

PRENDRE, 1N [patient] UTILISATEUR, 11 RENDEZVOUS
ASSURER, 1N [medecin] UTILISATEUR, 11 RENDEZVOUS
RENDEZVOUS: _id, dateHeure, motif, statut, createdAt, updatedAt

DEFINIR, 1N [medecin] UTILISATEUR, 11 CRENEAU_HORAIRE
CRENEAU_HORAIRE: _id, jour, heureDebut, heureFin, isAvailable, createdAt

DECLARER, 1N [medecin] UTILISATEUR, 11 INDISPONIBILITE
INDISPONIBILITE: _id, date, raison, createdAt

REDIGER, 1N [medecin] UTILISATEUR, 11 NOTE_MEDICALE
CONCERNER, 1N [patient] UTILISATEUR, 11 NOTE_MEDICALE
NOTE_MEDICALE: _id, contenu, statut, piecesJointes, createdAt, updatedAt

RECEVOIR, 1N UTILISATEUR, 11 NOTIFICATION
NOTIFICATION: _id, type, titre, description, lue, createdAt
```

### 3.3.2. Modèle Logique de Données (MLD)

> **[IMAGE 13 : MODÈLE LOGIQUE DE DONNÉES (MLD)]**

La transformation du MCD en MLD donne les tables suivantes :

**Table User (Utilisateur)**
```
User (
    id: UUID [PK],
    email: VARCHAR(255) [UNIQUE, NOT NULL],
    motDePasse: VARCHAR(255) [NOT NULL],
    nom: VARCHAR(100) [NOT NULL],
    prenom: VARCHAR(100) [NOT NULL],
    telephone: VARCHAR(20),
    dateNaissance: DATE,
    adresse: TEXT,
    role: ENUM('PATIENT', 'MEDECIN', 'ADMIN') [NOT NULL],
    isActive: BOOLEAN [DEFAULT TRUE],
    theme: ENUM('CLAIR', 'SOMBRE') [DEFAULT 'CLAIR'],
    langue: VARCHAR(10) [DEFAULT 'fr'],
    preferencesNotifEmail: BOOLEAN [DEFAULT TRUE],
    preferencesNotifSms: BOOLEAN [DEFAULT TRUE],
    specialite: VARCHAR(100) [NULL], -- Pour les médecins
    numeroOrdre: VARCHAR(50) [NULL], -- Pour les médecins
    statutValidation: ENUM('PENDING', 'APPROVED', 'REJECTED') [NULL], -- Pour les médecins
    createdAt: TIMESTAMP [DEFAULT NOW()],
    updatedAt: TIMESTAMP
)
```

**Table RendezVous**
```
RendezVous (
    id: UUID [PK],
    patientId: UUID [FK -> User.id, NOT NULL],
    medecinId: UUID [FK -> User.id, NOT NULL],
    date: TIMESTAMP [NOT NULL],
    motif: TEXT,
    statut: ENUM('EN_ATTENTE', 'CONFIRME', 'ANNULE') [DEFAULT 'EN_ATTENTE'],
    createdAt: TIMESTAMP [DEFAULT NOW()],
    updatedAt: TIMESTAMP
)
```

**Table TimeSlot (Créneau Horaire)**
```
TimeSlot (
    id: UUID [PK],
    medecinId: UUID [FK -> User.id, NOT NULL],
    jour: ENUM('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'),
    heureDebut: VARCHAR(5) [NOT NULL], -- Format "HH:mm"
    heureFin: VARCHAR(5) [NOT NULL], -- Format "HH:mm"
    isAvailable: BOOLEAN [DEFAULT TRUE],
    createdAt: TIMESTAMP [DEFAULT NOW()],
    updatedAt: TIMESTAMP,
    UNIQUE(medecinId, jour, heureDebut)
)
```

**Table Notification**
```
Notification (
    id: UUID [PK],
    userId: UUID [FK -> User.id, NOT NULL],
    type: ENUM('RAPPEL', 'CONFIRMATION', 'ANNULATION', 'CHANGEMENT_HORAIRE', 'RECOMMANDATION'),
    titre: VARCHAR(255) [NOT NULL],
    description: TEXT,
    lue: BOOLEAN [DEFAULT FALSE],
    createdAt: TIMESTAMP [DEFAULT NOW()],
    updatedAt: TIMESTAMP
)
```

**Table NoteMedicale**
```
NoteMedicale (
    id: UUID [PK],
    medecinId: UUID [FK -> User.id, NOT NULL],
    patientId: UUID [FK -> User.id, NOT NULL],
    contenu: TEXT [NOT NULL],
    statut: ENUM('ACTIF', 'ARCHIVE') [DEFAULT 'ACTIF'],
    piecesJointes: TEXT[], -- Array de chemins de fichiers
    createdAt: TIMESTAMP [DEFAULT NOW()],
    updatedAt: TIMESTAMP
)
```

**Table MedecinIndisponibilite**
```
MedecinIndisponibilite (
    id: UUID [PK],
    medecinId: UUID [FK -> User.id, NOT NULL],
    date: DATE [NOT NULL],
    raison: VARCHAR(255),
    createdAt: TIMESTAMP [DEFAULT NOW()],
    updatedAt: TIMESTAMP,
    UNIQUE(medecinId, date)
)
```

### 3.3.3. Dictionnaire de données

> **[TABLEAU 7 : DICTIONNAIRE DE DONNÉES]**

| Table | Attribut | Type | Taille | Contraintes | Description |
|-------|----------|------|--------|-------------|-------------|
| User | id | UUID | 36 | PK | Identifiant unique |
| User | email | VARCHAR | 255 | UNIQUE, NOT NULL | Adresse email |
| User | motDePasse | VARCHAR | 255 | NOT NULL | Mot de passe hashé |
| User | nom | VARCHAR | 100 | NOT NULL | Nom de famille |
| User | prenom | VARCHAR | 100 | NOT NULL | Prénom |
| User | role | ENUM | - | NOT NULL | PATIENT, MEDECIN, ADMIN |
| User | isActive | BOOLEAN | - | DEFAULT TRUE | Compte actif |
| User | specialite | VARCHAR | 100 | NULL | Spécialité médicale |
| User | statutValidation | ENUM | - | NULL | PENDING, APPROVED, REJECTED |
| RendezVous | id | UUID | 36 | PK | Identifiant unique |
| RendezVous | patientId | UUID | 36 | FK, NOT NULL | Référence patient |
| RendezVous | medecinId | UUID | 36 | FK, NOT NULL | Référence médecin |
| RendezVous | date | TIMESTAMP | - | NOT NULL | Date et heure du RDV |
| RendezVous | statut | ENUM | - | DEFAULT EN_ATTENTE | Statut du RDV |
| TimeSlot | jour | ENUM | - | NOT NULL | Jour de la semaine |
| TimeSlot | heureDebut | VARCHAR | 5 | NOT NULL | Heure de début (HH:mm) |
| TimeSlot | heureFin | VARCHAR | 5 | NOT NULL | Heure de fin (HH:mm) |

### 3.3.4. Règles de gestion

| Code | Règle de gestion |
|------|------------------|
| RG1 | Un utilisateur possède un rôle unique parmi PATIENT, MEDECIN ou ADMIN |
| RG2 | Seuls les médecins avec statut "APPROVED" peuvent recevoir des rendez-vous |
| RG3 | Un patient ne peut pas confirmer ses propres rendez-vous (seul le médecin peut) |
| RG4 | Un patient peut uniquement annuler ses rendez-vous |
| RG5 | Un créneau horaire est unique pour un médecin donné (jour + heure de début) |
| RG6 | Les notifications sont envoyées selon les préférences de l'utilisateur |
| RG7 | Un rendez-vous ne peut être pris que sur un créneau disponible du médecin |
| RG8 | Les indisponibilités du médecin bloquent la prise de rendez-vous |

## 3.4. Conception de l'interface utilisateur

### 3.4.1. Maquettes des écrans principaux

> **[IMAGE 14 : MAQUETTE - PAGE DE CONNEXION]**
> *Wireframe ou capture d'écran de la page de connexion*

> **[IMAGE 15 : MAQUETTE - DASHBOARD PATIENT]**
> *Wireframe ou capture d'écran du tableau de bord patient*

> **[IMAGE 16 : MAQUETTE - PRISE DE RENDEZ-VOUS]**
> *Wireframe ou capture d'écran du processus de prise de RDV*

> **[IMAGE 17 : MAQUETTE - DASHBOARD MÉDECIN]**
> *Wireframe ou capture d'écran du tableau de bord médecin*

> **[IMAGE 18 : MAQUETTE - DASHBOARD ADMINISTRATEUR]**
> *Wireframe ou capture d'écran du tableau de bord admin*

### 3.4.2. Charte graphique

| Élément | Valeur | Utilisation |
|---------|--------|-------------|
| Couleur primaire | #3B82F6 (Bleu) | Boutons principaux, liens |
| Couleur secondaire | #10B981 (Vert) | Confirmations, succès |
| Couleur d'alerte | #EF4444 (Rouge) | Erreurs, annulations |
| Couleur neutre | #6B7280 (Gris) | Textes secondaires |
| Police principale | Inter | Corps de texte |
| Police titres | Inter | Titres, sous-titres |

---

# CHAPITRE 4 : RÉALISATION DE L'APPLICATION

## 4.1. Environnement et outils de développement

### 4.1.1. Outils de développement

| Outil | Version | Utilisation |
|-------|---------|-------------|
| Visual Studio Code | 1.85+ | Éditeur de code |
| Node.js | 18.x+ | Environnement d'exécution |
| npm | 9.x+ | Gestionnaire de paquets |
| Git | 2.x+ | Versioning |
| Postman | - | Test des API |
| Prisma Studio | - | Visualisation base de données |
| PostgreSQL | 14+ | Base de données |

### 4.1.2. Technologies Backend

> **[TABLEAU 8 : TECHNOLOGIES BACKEND]**

| Technologie | Version | Rôle |
|-------------|---------|------|
| NestJS | 10.x | Framework backend |
| TypeScript | 5.x | Langage de programmation |
| Prisma | 5.x | ORM |
| PostgreSQL | 14+ | Base de données |
| JWT | - | Authentification |
| BCrypt | - | Hashage mots de passe |
| Nodemailer | - | Envoi d'emails |
| Multer | - | Upload de fichiers |
| class-validator | - | Validation des données |

### 4.1.3. Technologies Frontend

> **[TABLEAU 9 : TECHNOLOGIES FRONTEND]**

| Technologie | Version | Rôle |
|-------------|---------|------|
| React | 18.x | Bibliothèque UI |
| React Router | 6.x | Routage |
| Axios | - | Requêtes HTTP |
| Tailwind CSS | 3.x | Styles |
| Headless UI | - | Composants accessibles |
| i18next | - | Internationalisation |
| Recharts | - | Graphiques |

### 4.1.4. Architecture du projet

> **[IMAGE 19 : ARCHITECTURE TECHNIQUE DU PROJET]**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE TECHNIQUE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌───────────────────────────────────────────────────────────────┐        │
│    │                         FRONTEND                               │        │
│    │                     (React - Port 3000)                        │        │
│    ├───────────────────────────────────────────────────────────────┤        │
│    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │        │
│    │  │  Pages   │  │Components│  │ Context  │  │ Services │      │        │
│    │  │ Patient  │  │  Common  │  │   Auth   │  │   API    │      │        │
│    │  │ Médecin  │  │  Layout  │  │  Theme   │  │ Patient  │      │        │
│    │  │  Admin   │  │  Modals  │  │          │  │ Médecin  │      │        │
│    │  │  Auth    │  │          │  │          │  │  Admin   │      │        │
│    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │        │
│    └─────────────────────────────────┬─────────────────────────────┘        │
│                                      │ HTTP/REST                            │
│                                      ▼                                      │
│    ┌───────────────────────────────────────────────────────────────┐        │
│    │                          BACKEND                               │        │
│    │                    (NestJS - Port 3002)                        │        │
│    ├───────────────────────────────────────────────────────────────┤        │
│    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │        │
│    │  │   Auth   │  │ Patients │  │ Médecins │  │  Admin   │      │        │
│    │  │  Module  │  │  Module  │  │  Module  │  │  Module  │      │        │
│    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │        │
│    │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │        │
│    │  │TimeSlots │  │ Notifs   │  │  Common  │  │  Prisma  │      │        │
│    │  │  Module  │  │  Module  │  │ (Guards) │  │  Module  │      │        │
│    │  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │        │
│    └─────────────────────────────────┬─────────────────────────────┘        │
│                                      │ Prisma ORM                           │
│                                      ▼                                      │
│    ┌───────────────────────────────────────────────────────────────┐        │
│    │                       BASE DE DONNÉES                          │        │
│    │                   (PostgreSQL - Port 5432)                     │        │
│    ├───────────────────────────────────────────────────────────────┤        │
│    │  User | RendezVous | TimeSlot | Notification | NoteMedicale   │        │
│    └───────────────────────────────────────────────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

> **[IMAGE 20 : STRUCTURE DU PROJET BACKEND]**

```
medical-appointment-api/
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   ├── migrations/            # Historique des migrations
│   └── seed.ts                # Données de test
├── src/
│   ├── auth/                  # Module Authentification
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/               # Data Transfer Objects
│   │   └── strategies/        # Stratégies JWT
│   ├── patients/              # Module Patient
│   │   ├── patients.controller.ts
│   │   ├── patients.service.ts
│   │   ├── patients.module.ts
│   │   └── dto/
│   ├── medecins/              # Module Médecin
│   │   ├── medecins.controller.ts
│   │   ├── medecins.service.ts
│   │   ├── medecins.module.ts
│   │   └── dto/
│   ├── admin/                 # Module Administrateur
│   ├── timeslots/             # Module Créneaux
│   ├── notifications/         # Module Notifications
│   ├── common/                # Éléments partagés
│   │   ├── guards/            # Guards de sécurité
│   │   ├── decorators/        # Décorateurs personnalisés
│   │   └── filters/           # Filtres d'exception
│   ├── prisma/                # Service Prisma
│   ├── app.module.ts          # Module principal
│   └── main.ts                # Point d'entrée
├── uploads/                   # Fichiers uploadés
├── .env                       # Variables d'environnement
└── package.json
```

> **[IMAGE 21 : STRUCTURE DU PROJET FRONTEND]**

```
medical-appointment-frontend/
├── public/
│   ├── index.html
│   ├── logo.png
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/            # Composants réutilisables
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Loading.jsx
│   │   ├── layout/            # Layouts par rôle
│   │   │   ├── PatientLayout.jsx
│   │   │   ├── MedecinLayout.jsx
│   │   │   └── AdminLayout.jsx
│   │   └── modals/            # Modales
│   ├── pages/
│   │   ├── auth/              # Pages d'authentification
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── patient/           # Pages Patient
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AppointmentBooking.jsx
│   │   │   ├── AppointmentHistory.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   ├── medecin/           # Pages Médecin
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Appointments.jsx
│   │   │   ├── Patients.jsx
│   │   │   ├── Notes.jsx
│   │   │   ├── Creneaux.jsx
│   │   │   └── Profile.jsx
│   │   └── admin/             # Pages Admin
│   │       ├── Dashboard.jsx
│   │       ├── Medecins.jsx
│   │       ├── Patients.jsx
│   │       ├── RendezVous.jsx
│   │       └── Statistiques.jsx
│   ├── context/
│   │   ├── AuthContext.jsx    # Gestion authentification
│   │   └── ThemeContext.js    # Gestion thème
│   ├── services/
│   │   ├── api.js             # Configuration Axios
│   │   ├── authService.js
│   │   ├── patientService.js
│   │   ├── medecinService.js
│   │   └── adminService.js
│   ├── locales/               # Traductions
│   │   ├── fr/translation.json
│   │   └── en/translation.json
│   ├── routes/
│   │   ├── PrivateRoute.jsx
│   │   └── RoleBasedRoute.jsx
│   ├── App.js
│   └── index.js
├── tailwind.config.js
└── package.json
```

## 4.2. Développement du backend

### 4.2.1. Implémentation de l'API REST

> **[TABLEAU 10 : ENDPOINTS DE L'API REST]**

#### Authentification

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| POST | /api/auth/register | Inscription | Non |
| POST | /api/auth/login | Connexion | Non |
| POST | /api/auth/refresh | Rafraîchir token | Non |
| POST | /api/auth/logout | Déconnexion | Oui |

#### Espace Patient

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | /api/patients/profile | Récupérer profil | PATIENT |
| PATCH | /api/patients/profile | Modifier profil | PATIENT |
| GET | /api/patients/rendezvous | Liste RDV | PATIENT |
| POST | /api/patients/rendezvous | Créer RDV | PATIENT |
| PATCH | /api/patients/rendezvous/:id/status | Annuler RDV | PATIENT |
| GET | /api/patients/notifications | Notifications | PATIENT |
| PATCH | /api/patients/preferences | Préférences | PATIENT |

#### Espace Médecin

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | /api/medecins/profile | Récupérer profil | MEDECIN |
| PATCH | /api/medecins/profile | Modifier profil | MEDECIN |
| GET | /api/medecins/rendezvous | Liste RDV | MEDECIN |
| PATCH | /api/medecins/rendezvous/:id | Confirmer/Annuler | MEDECIN |
| GET | /api/medecins/patients | Liste patients | MEDECIN |
| GET | /api/medecins/timeslots | Liste créneaux | MEDECIN |
| POST | /api/medecins/timeslots | Créer créneau | MEDECIN |
| DELETE | /api/medecins/timeslots/:id | Supprimer créneau | MEDECIN |
| POST | /api/medecins/notes | Créer note | MEDECIN |

#### Espace Admin

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | /api/admin/patients | Liste patients | ADMIN |
| PATCH | /api/admin/patients/:id | Activer/Désactiver | ADMIN |
| GET | /api/admin/medecins | Liste médecins | ADMIN |
| PATCH | /api/admin/medecins/:id/validate | Valider médecin | ADMIN |
| GET | /api/admin/statistiques | Statistiques | ADMIN |

#### Public

| Méthode | Endpoint | Description | Authentification |
|---------|----------|-------------|------------------|
| GET | /api/timeslots/:medecinId | Créneaux d'un médecin | Non |

### 4.2.2. Gestion de l'authentification

Le système d'authentification utilise JWT avec deux types de tokens :

- **Access Token** : Durée de vie 15 minutes, utilisé pour authentifier les requêtes
- **Refresh Token** : Durée de vie 7 jours, utilisé pour renouveler l'access token

```typescript
// Exemple de génération de token
const payload = { sub: user.id, email: user.email, role: user.role };
const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
const refreshToken = this.jwtService.sign(payload, {
  secret: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d'
});
```

### 4.2.3. Gestion des rôles et permissions

Les endpoints sont protégés par des guards :

```typescript
// Exemple de protection d'un endpoint
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEDECIN)
@Get('patients')
async getMyPatients(@CurrentUser() user) {
  return this.medecinsService.getMyPatients(user.id);
}
```

### 4.2.4. Règle métier importante : Confirmation des rendez-vous

```typescript
// Dans patients.service.ts
async updateRendezVousStatus(userId: string, id: string, status: StatutRendezVous) {
  // Vérifier que le patient ne peut QUE annuler
  if (status === StatutRendezVous.CONFIRME) {
    throw new BadRequestException(
      'Les patients ne peuvent qu\'annuler leurs rendez-vous. ' +
      'Seul le médecin peut confirmer un rendez-vous.'
    );
  }
  // ... suite du code
}
```

## 4.3. Développement du frontend

### 4.3.1. Captures d'écran des interfaces

> **[IMAGE 22 : CAPTURE D'ÉCRAN - PAGE DE CONNEXION]**
> *Insérer capture d'écran de la page Login*

> **[IMAGE 23 : CAPTURE D'ÉCRAN - PAGE D'INSCRIPTION]**
> *Insérer capture d'écran de la page Register*

> **[IMAGE 24 : CAPTURE D'ÉCRAN - DASHBOARD PATIENT]**
> *Insérer capture d'écran du tableau de bord patient*

> **[IMAGE 25 : CAPTURE D'ÉCRAN - PRISE DE RENDEZ-VOUS]**
> *Insérer capture d'écran de la page de réservation*

> **[IMAGE 26 : CAPTURE D'ÉCRAN - DASHBOARD MÉDECIN]**
> *Insérer capture d'écran du tableau de bord médecin*

> **[IMAGE 27 : CAPTURE D'ÉCRAN - GESTION DES CRÉNEAUX]**
> *Insérer capture d'écran de la page Créneaux*

> **[IMAGE 28 : CAPTURE D'ÉCRAN - DASHBOARD ADMINISTRATEUR]**
> *Insérer capture d'écran du tableau de bord admin*

> **[IMAGE 29 : CAPTURE D'ÉCRAN - STATISTIQUES]**
> *Insérer capture d'écran de la page Statistiques*

### 4.3.2. Gestion de l'état global

L'authentification est gérée via React Context :

```javascript
// AuthContext.jsx (simplifié)
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const response = await authService.login({ email, motDePasse: password });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4.3.3. Internationalisation

L'application supporte plusieurs langues grâce à i18next :

```javascript
// Utilisation dans un composant
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <h1>{t('dashboard.welcome')}</h1>
  );
};
```

## 4.4. Sécurité de l'application

### 4.4.1. Mesures de sécurité implémentées

| Mesure | Description |
|--------|-------------|
| Hashage | Mots de passe hashés avec BCrypt (10 rounds) |
| JWT | Tokens signés avec secret, expiration courte |
| RBAC | Contrôle d'accès basé sur les rôles |
| Validation | Toutes les entrées validées avec class-validator |
| CORS | Configuration des origines autorisées |
| Whitelist | Seuls les champs déclarés sont acceptés dans les DTOs |

### 4.4.2. Protection contre les attaques courantes

- **Injection SQL** : Prisma utilise des requêtes paramétrées
- **XSS** : React échappe automatiquement les données
- **CSRF** : Tokens JWT stockés côté client
- **Brute force** : Possibilité d'ajouter un rate limiting

---

# CHAPITRE 5 : TESTS, DÉPLOIEMENT ET PERSPECTIVES

## 5.1. Tests du système

### 5.1.1. Stratégie de test

Les tests ont été réalisés à plusieurs niveaux :

- **Tests unitaires** : Validation des fonctions individuelles
- **Tests fonctionnels** : Validation des scénarios utilisateurs
- **Tests d'intégration** : Validation de la communication entre composants

### 5.1.2. Résultats des tests fonctionnels

> **[TABLEAU 11 : RÉSULTATS DES TESTS FONCTIONNELS]**

| N° | Scénario testé | Résultat | Observations |
|----|----------------|----------|--------------|
| TF-01 | Inscription d'un patient | ✅ Succès | Compte créé, email unique validé |
| TF-02 | Connexion patient | ✅ Succès | Tokens générés, redirection OK |
| TF-03 | Inscription d'un médecin | ✅ Succès | Statut PENDING correct |
| TF-04 | Validation médecin par admin | ✅ Succès | Statut passe à APPROVED |
| TF-05 | Prise de rendez-vous | ✅ Succès | RDV créé avec statut EN_ATTENTE |
| TF-06 | Confirmation par médecin | ✅ Succès | Statut passe à CONFIRME |
| TF-07 | Tentative confirmation par patient | ✅ Succès | Erreur correctement renvoyée |
| TF-08 | Annulation par patient | ✅ Succès | Statut passe à ANNULE |
| TF-09 | Création de créneaux | ✅ Succès | Créneaux enregistrés |
| TF-10 | Statistiques admin | ✅ Succès | Données agrégées correctes |

## 5.2. Déploiement

### 5.2.1. Prérequis pour le déploiement

- Serveur Node.js (v18+)
- Base de données PostgreSQL
- Variables d'environnement configurées
- Certificat SSL pour HTTPS

### 5.2.2. Options de déploiement

| Option | Avantages | Inconvénients |
|--------|-----------|---------------|
| Docker | Portable, reproductible | Courbe d'apprentissage |
| Render | Simple, gratuit pour débuter | Limitations version gratuite |
| VPS | Contrôle total | Configuration manuelle |
| Vercel (frontend) | Déploiement automatique | Uniquement pour le frontend |

### 5.2.3. Configuration Docker

```dockerfile
# Dockerfile (Backend)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3002
CMD ["npm", "run", "start:prod"]
```

## 5.3. Discussion des résultats

### 5.3.1. Points forts

- ✅ Toutes les fonctionnalités prévues ont été implémentées
- ✅ Interface moderne et responsive
- ✅ Sécurité robuste (JWT, RBAC, hashage)
- ✅ Code modulaire et maintenable
- ✅ Support multilingue (FR/EN)
- ✅ Mode sombre intégré

### 5.3.2. Limites

- ❌ Pas de paiement en ligne intégré
- ❌ Pas de téléconsultation (visioconférence)
- ❌ Rappels automatiques non programmés (nécessite un cron job)
- ❌ Pas d'application mobile native
- ❌ Tests unitaires partiels

## 5.4. Perspectives d'amélioration

### Court terme

- Mettre en place les rappels automatiques (node-cron)
- Ajouter l'export des données en PDF/Excel
- Améliorer la couverture de tests

### Moyen terme

- Intégrer un système de paiement (Stripe, Mobile Money)
- Ajouter la téléconsultation (WebRTC)
- Développer une application mobile (React Native)

### Long terme

- Support multi-établissements
- Dossier médical électronique complet
- Intelligence artificielle pour la suggestion de créneaux
- Intégration avec les systèmes de santé nationaux

---

# CONCLUSION GÉNÉRALE

Au terme de ce travail, les objectifs fixés initialement ont été atteints. Nous avons conçu et réalisé une application web fonctionnelle permettant de gérer les rendez-vous médicaux de manière efficace.

**Les patients** peuvent désormais prendre rendez-vous en ligne, à tout moment, sans avoir à téléphoner ou se déplacer. Ils peuvent consulter leur historique et recevoir des notifications.

**Les médecins** peuvent gérer leur planning de manière centralisée, confirmer ou annuler des rendez-vous, et accéder aux informations de leurs patients. La gestion des créneaux de disponibilité est simplifiée.

**L'administrateur** dispose d'une vue d'ensemble sur le système, peut valider les inscriptions des médecins et consulter les statistiques d'utilisation.

L'application respecte les bonnes pratiques de développement web moderne :
- Architecture modulaire et maintenable
- Sécurité renforcée pour protéger les données de santé
- Interface responsive et accessible
- Support multilingue

Des améliorations sont envisageables pour enrichir la solution : intégration du paiement en ligne, téléconsultation, application mobile, rappels automatiques par SMS.

Ce projet nous a permis de mettre en pratique l'ensemble des connaissances acquises durant notre formation et de nous préparer à notre future carrière professionnelle dans le domaine du développement logiciel.

---

# BIBLIOGRAPHIE ET WEBOGRAPHIE

## Documentation technique

- NestJS Documentation : https://docs.nestjs.com
- React Documentation : https://react.dev
- Prisma Documentation : https://www.prisma.io/docs
- PostgreSQL Documentation : https://www.postgresql.org/docs
- Tailwind CSS Documentation : https://tailwindcss.com/docs
- JWT.io : https://jwt.io

## Ressources sur la sécurité

- OWASP Top 10 : https://owasp.org/Top10
- BCrypt : https://www.npmjs.com/package/bcrypt

## Articles et tutoriels

- Building REST APIs with NestJS
- React Authentication Best Practices
- Prisma Schema Design Patterns

---

# ANNEXES

## Annexe A : Guide d'installation

### Backend

```bash
cd medical-appointment-api
npm install
cp .env.example .env
# Éditer .env avec vos paramètres
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npm run start:dev
```

### Frontend

```bash
cd medical-appointment-frontend
npm install
npm start
```

## Annexe B : Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@medical.com | password123 |
| Médecin | jean.kouadio@medical.com | password123 |
| Médecin | sophie.kone@medical.com | password123 |
| Patient | marie.yao@example.com | password123 |
| Patient | kouassi.bamba@example.com | password123 |

## Annexe C : Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://user:password@localhost:5432/medical_db"

# JWT
JWT_SECRET="votre-secret-jwt"
JWT_REFRESH_SECRET="votre-secret-refresh"
JWT_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASSWORD="votre-mot-de-passe-app"

# Application
PORT=3002
NODE_ENV="development"
```

## Annexe D : Code source des principaux composants

*[Inclure ici des extraits de code importants si nécessaire]*

---

# RÉSUMÉ

Ce mémoire présente la conception et le développement d'une application web de gestion de rendez-vous médicaux. Face aux difficultés rencontrées dans les méthodes traditionnelles de prise de rendez-vous (téléphone, déplacement, cahier papier), nous avons développé une solution permettant aux patients de réserver en ligne, aux médecins de gérer leur planning, et aux administrateurs de superviser le système.

L'application utilise des technologies modernes : NestJS pour le backend, React pour le frontend, et PostgreSQL pour la base de données. La sécurité est assurée par l'authentification JWT et le contrôle d'accès basé sur les rôles.

Le résultat est une application fonctionnelle, responsive et multilingue, respectant les bonnes pratiques de développement. Des évolutions sont prévues : paiement en ligne, téléconsultation, application mobile.

**Mots-clés** : Application web, rendez-vous médicaux, NestJS, React, PostgreSQL, JWT, API REST

---

**Abstract**

This thesis presents the design and development of a web application for managing medical appointments. Facing the difficulties encountered with traditional appointment methods (phone calls, physical visits, paper notebooks), we developed a solution allowing patients to book online, doctors to manage their schedules, and administrators to oversee the system.

The application uses modern technologies: NestJS for the backend, React for the frontend, and PostgreSQL for the database. Security is ensured through JWT authentication and role-based access control.

The result is a functional, responsive, and multilingual application following development best practices. Future improvements are planned: online payment, teleconsultation, mobile application.

**Keywords**: Web application, medical appointments, NestJS, React, PostgreSQL, JWT, REST API

---

*Mémoire présenté et soutenu par [Votre Nom] le [Date]*
*Pour l'obtention du diplôme de [Nom du diplôme]*
