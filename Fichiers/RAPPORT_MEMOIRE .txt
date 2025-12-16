# TABLE DES MATIÈRES

INTRODUCTION GÉNÉRALE

1. Contexte général
2. Problématique
3. Justification du choix du thème
4. Objectifs de l'étude
   - 4.1. Objectif général
   - 4.2. Objectifs spécifiques
5. Méthodologie adoptée
6. Organisation du mémoire

---

INTRODUCTION GÉNÉRALE

  1. Contexte général

Aujourd'hui, le numérique transforme profondément notre façon de vivre et de travailler. Le secteur de la santé n'échappe pas à cette révolution. En Côte d'Ivoire, on constate que beaucoup de structures médicales fonctionnent encore avec des méthodes traditionnelles pour gérer leurs rendez-vous : appels téléphoniques, cahiers de réservation, files d'attente interminables...

Cette situation crée des frustrations aussi bien pour les patients que pour le personnel médical. Les patients perdent du temps, parfois une demi-journée, juste pour obtenir un rendez-vous. De leur côté, les médecins et leurs secrétaires passent un temps fou à gérer des plannings sur papier.

C'est dans ce contexte que s'inscrit notre travail. On s'est dit qu'il était temps de proposer une solution informatique simple et efficace pour faciliter la gestion des rendez-vous médicaux.

## 2. Problématique

Quand on observe comment ça se passe dans la plupart des cabinets médicaux, on remarque plusieurs problèmes :

D'abord, pour avoir un rendez-vous, le patient doit généralement appeler ou se déplacer. Sauf que la ligne est souvent occupée, et quand on se déplace, on peut faire le trajet pour rien si le médecin n'est pas disponible.

Ensuite, il y a le problème des oublis. Combien de fois des patients oublient leur rendez-vous ? Ça arrive tout le temps, et ça désorganise complètement le planning du médecin.

Enfin, la gestion manuelle des dossiers et des plannings prend énormément de temps. Le médecin ou sa secrétaire doit jongler entre le cahier de rendez-vous, les fiches patients, les rappels à faire...

Du coup, on peut se poser la question suivante : comment peut-on utiliser les outils informatiques modernes pour simplifier tout ça et rendre la prise de rendez-vous plus facile pour tout le monde ?

## 3. Justification du choix du thème

Pourquoi avoir choisi ce sujet ? Plusieurs raisons nous ont motivés.

Premièrement, c'est un problème concret que tout le monde connaît. Qui n'a jamais galéré pour avoir un rendez-vous chez le médecin ? En proposant une solution, on répond à un vrai besoin.

Deuxièmement, ce projet nous permet de mettre en pratique ce qu'on a appris pendant notre formation. On touche à plein de domaines : le développement web, les bases de données, la sécurité informatique, l'ergonomie des interfaces...

Troisièmement, c'est un projet qui peut vraiment être utilisé. Ce n'est pas juste un exercice théorique. À la fin, on aura une application fonctionnelle qu'on pourrait déployer dans un vrai cabinet médical.

## 4. Objectifs de l'étude

### 4.1. Objectif général

L'idée principale, c'est de créer une application web qui permet de gérer les rendez-vous médicaux de manière simple et efficace. On veut que les patients puissent prendre rendez-vous depuis chez eux, que les médecins puissent gérer leur planning facilement, et qu'un administrateur puisse superviser le tout.

### 4.2. Objectifs spécifiques

Pour y arriver, on s'est fixé plusieurs objectifs :

- Bien comprendre les besoins de chaque utilisateur (patient, médecin, admin)
- Créer une base de données bien structurée pour stocker toutes les informations
- Développer une API sécurisée pour que le frontend et le backend communiquent
- Concevoir une interface agréable et facile à utiliser
- Mettre en place un système de notifications pour rappeler les rendez-vous
- Sécuriser l'application avec un système de connexion et de gestion des droits

## 5. Méthodologie adoptée

Pour mener à bien ce projet, on a procédé par étapes.

On a commencé par une phase de réflexion où on a listé tout ce que l'application devait faire. On s'est mis à la place des différents utilisateurs pour comprendre leurs besoins.

Après, on est passé à la conception. On a dessiné les schémas de la base de données, on a réfléchi à l'architecture de l'application, on a fait des maquettes des écrans.

Puis on a attaqué le développement. On a codé d'abord le backend (la partie serveur), puis le frontend (l'interface utilisateur). On a fait des tests au fur et à mesure pour vérifier que tout marchait bien.

Enfin, on a documenté notre travail pour que quelqu'un d'autre puisse reprendre le projet si besoin.

## 6. Organisation du mémoire

Ce document est organisé en cinq chapitres :

Le premier chapitre présente le cadre dans lequel on a travaillé et donne une vue d'ensemble du projet.

Le deuxième chapitre analyse en détail les besoins : qu'est-ce que l'application doit faire, pour qui, avec quelles contraintes.

Le troisième chapitre explique comment on a conçu le système : l'architecture, les modèles de données, les interfaces.

Le quatrième chapitre décrit la réalisation concrète : les technologies utilisées, le code développé, les fonctionnalités implémentées.

Le cinquième chapitre parle des tests, du déploiement et des pistes d'amélioration pour la suite.

---

# CHAPITRE 1 : PRÉSENTATION DU CADRE D'ÉTUDE

## 1.1. Présentation de la structure d'accueil

### 1.1.1. Historique

*[Cette partie est à compléter avec les informations sur votre structure d'accueil : date de création, évolution, etc.]*

### 1.1.2. Mission et activités

*[Décrire ici les missions principales de la structure et ses domaines d'activité]*

### 1.1.3. Organisation interne

*[Présenter l'organigramme ou l'organisation de la structure]*

## 1.2. Présentation du projet

### 1.2.1. Contexte du projet

Ce projet est né d'un constat simple : la gestion des rendez-vous médicaux, telle qu'elle se fait actuellement dans beaucoup d'endroits, n'est pas optimale. On perd du temps, on fait des erreurs, on oublie des rendez-vous...

L'idée c'est de créer une plateforme en ligne où tout est centralisé. Le patient se connecte, il voit les médecins disponibles, il choisit un créneau, et voilà. De son côté, le médecin voit son planning se remplir automatiquement, il peut confirmer ou reporter les rendez-vous, et il a accès aux informations de ses patients.

On a aussi prévu un espace pour l'administrateur, qui peut gérer les comptes utilisateurs, valider les inscriptions des nouveaux médecins, et avoir une vue d'ensemble sur l'activité de la plateforme.

### 1.2.2. Cahier des charges

Voici ce que l'application doit permettre de faire :

**Pour les patients :**
- Créer un compte et se connecter
- Chercher un médecin selon sa spécialité
- Voir les créneaux disponibles
- Prendre un rendez-vous
- Annuler un rendez-vous si besoin
- Consulter son historique de rendez-vous
- Recevoir des rappels par email ou SMS
- Modifier son profil et ses préférences

**Pour les médecins :**
- S'inscrire en fournissant ses informations professionnelles
- Définir ses horaires de disponibilité
- Voir la liste des rendez-vous
- Confirmer ou annuler des rendez-vous
- Consulter les informations de ses patients
- Rédiger des notes médicales
- Signaler ses absences (congés, formations...)

**Pour l'administrateur :**
- Valider les comptes des nouveaux médecins
- Gérer tous les utilisateurs (activer, désactiver)
- Voir les statistiques de la plateforme
- Superviser les rendez-vous

**Contraintes techniques qu'on s'est fixées :**
- L'application doit marcher sur ordinateur, tablette et téléphone
- Elle doit être sécurisée (données médicales sensibles)
- Elle doit être disponible en français et en anglais
- Les temps de chargement doivent être raisonnables

### 1.2.3. Objectifs du projet

Au final, ce qu'on veut c'est :

1. Que les patients gagnent du temps et puissent prendre rendez-vous à n'importe quelle heure
2. Que les médecins aient moins de travail administratif
3. Que les rendez-vous oubliés diminuent grâce aux rappels automatiques
4. Que toutes les informations soient centralisées et faciles à retrouver
5. Que l'interface soit simple à utiliser, même pour quelqu'un qui n'est pas à l'aise avec l'informatique

---

# CHAPITRE 2 : ANALYSE ET SPÉCIFICATION DES BESOINS

## 2.1. Étude de l'existant

### 2.1.1. Méthodes actuelles de prise de rendez-vous

Avant de développer notre solution, on a regardé comment les choses se passent actuellement. On a identifié plusieurs façons de prendre rendez-vous :

**Par téléphone** : C'est la méthode la plus courante. Le patient appelle le cabinet, la secrétaire vérifie le planning et propose un créneau. Le souci c'est que la ligne est souvent occupée, et puis ça ne marche que pendant les heures d'ouverture.

**En se déplaçant** : Certains patients préfèrent venir directement au cabinet. Mais ça veut dire faire le trajet, parfois pour rien si le médecin n'est pas disponible avant plusieurs jours.

**Par email** : Quelques cabinets acceptent les demandes par email. C'est pratique mais la réponse peut prendre du temps, et il n'y a pas de confirmation immédiate.

**Avec un cahier de rendez-vous** : Côté cabinet, beaucoup utilisent encore un simple cahier pour noter les rendez-vous. C'est basique mais ça marche, sauf qu'on ne peut pas envoyer de rappels automatiques et c'est facile de faire des erreurs.

### 2.1.2. Limites et insuffisances du système existant

Après avoir analysé ces méthodes, on a noté plusieurs problèmes :

**Disponibilité limitée** : On ne peut prendre rendez-vous que pendant les heures de travail du secrétariat. Pour quelqu'un qui travaille, c'est compliqué.

**Pas de vision globale** : Le patient ne sait pas quels créneaux sont disponibles avant d'appeler. Il peut appeler plusieurs fois avant de trouver un horaire qui lui convient.

**Oublis fréquents** : Sans système de rappel automatique, beaucoup de patients oublient leur rendez-vous. Ça fait perdre du temps et de l'argent au cabinet.

**Gestion compliquée** : Reporter un rendez-vous, c'est toute une affaire. Il faut rayer, réécrire, parfois rappeler le patient...

**Pas d'historique facile** : Retrouver les anciens rendez-vous d'un patient demande de feuilleter des pages et des pages de cahier.

## 2.2. Analyse des besoins

### 2.2.1. Identification des acteurs

Notre application va être utilisée par trois types de personnes :

**Le patient** : C'est la personne qui veut consulter un médecin. Il a besoin de trouver facilement un médecin, de voir ses disponibilités, et de réserver un créneau. Il veut aussi pouvoir gérer ses rendez-vous (annuler si empêché) et recevoir des rappels.

**Le médecin** : C'est le praticien qui reçoit les patients. Il doit pouvoir définir quand il est disponible, voir qui a pris rendez-vous, confirmer les rendez-vous, et accéder aux informations de ses patients. Il peut aussi vouloir prendre des notes après une consultation.

**L'administrateur** : C'est la personne qui gère la plateforme. Il doit pouvoir créer des comptes, valider les inscriptions des médecins (pour éviter les faux profils), et surveiller que tout fonctionne bien.

### 2.2.2. Besoins fonctionnels

On va détailler ce que chaque acteur doit pouvoir faire.

**Ce que le patient doit pouvoir faire :**

- S'inscrire avec son email, nom, prénom et mot de passe
- Se connecter à son compte
- Modifier ses informations personnelles
- Rechercher des médecins (par nom ou spécialité)
- Voir les créneaux libres d'un médecin
- Réserver un créneau
- Voir la liste de ses rendez-vous passés et à venir
- Annuler un rendez-vous (attention : il ne peut pas le confirmer lui-même, c'est le médecin qui fait ça)
- Recevoir des notifications par email ou SMS selon ses préférences
- Choisir la langue de l'interface (français ou anglais)
- Activer le mode sombre s'il préfère

**Ce que le médecin doit pouvoir faire :**

- S'inscrire en indiquant sa spécialité et son numéro d'ordre
- Attendre la validation de son compte par l'admin
- Se connecter une fois validé
- Créer ses créneaux de disponibilité (ex: lundi de 9h à 12h)
- Modifier ou supprimer ses créneaux
- Déclarer une période d'indisponibilité (vacances, formation...)
- Voir tous les rendez-vous pris avec lui
- Confirmer un rendez-vous en attente
- Annuler un rendez-vous si nécessaire
- Voir la liste des patients qu'il a déjà reçus
- Créer des notes médicales pour un patient
- Joindre des fichiers aux notes (ordonnances, résultats d'analyses...)
- Modifier son profil

**Ce que l'administrateur doit pouvoir faire :**

- Se connecter avec un compte admin
- Voir la liste de tous les utilisateurs
- Activer ou désactiver un compte
- Valider ou refuser l'inscription d'un médecin
- Voir des statistiques (nombre de rendez-vous, nombre d'utilisateurs...)
- Accéder à la liste de tous les rendez-vous

### 2.2.3. Besoins non fonctionnels

Au-delà des fonctionnalités, l'application doit respecter certaines exigences :

**Performance** : Les pages doivent se charger rapidement. On vise moins de 2-3 secondes pour afficher une page.

**Sécurité** : C'est très important vu qu'on manipule des données médicales. Les mots de passe doivent être cryptés, les connexions sécurisées, et chaque utilisateur ne doit voir que ce qu'il a le droit de voir.

**Disponibilité** : L'application doit être accessible tout le temps (ou presque). C'est le but d'une prise de rendez-vous en ligne.

**Facilité d'utilisation** : L'interface doit être intuitive. Pas besoin de lire un manuel pour savoir comment prendre un rendez-vous.

**Adaptabilité** : Ça doit marcher aussi bien sur un grand écran d'ordinateur que sur un téléphone portable.

**Évolutivité** : Le code doit être bien organisé pour qu'on puisse facilement ajouter des fonctionnalités plus tard.

## 2.3. Spécifications fonctionnelles

### 2.3.1. Diagrammes de cas d'utilisation

Pour représenter ce que chaque acteur peut faire, on utilise des diagrammes de cas d'utilisation. On va les décrire de manière simplifiée.

**Cas d'utilisation du Patient :**

Le patient interagit avec le système pour :
- S'inscrire / Se connecter
- Gérer son profil
- Rechercher un médecin
- Consulter les disponibilités
- Prendre un rendez-vous
- Annuler un rendez-vous
- Consulter son historique
- Gérer ses préférences de notification

**Cas d'utilisation du Médecin :**

Le médecin interagit avec le système pour :
- S'inscrire / Se connecter
- Gérer son profil professionnel
- Définir ses créneaux horaires
- Déclarer ses indisponibilités
- Consulter ses rendez-vous
- Confirmer ou annuler un rendez-vous
- Voir ses patients
- Rédiger des notes médicales

**Cas d'utilisation de l'Administrateur :**

L'administrateur interagit avec le système pour :
- Se connecter
- Gérer les utilisateurs
- Valider les médecins
- Consulter les statistiques
- Superviser les rendez-vous

### 2.3.2. Description détaillée des fonctionnalités

**Scénario : Un patient prend rendez-vous**

1. Le patient se connecte à son compte
2. Il va sur la page de recherche de médecins
3. Il tape le nom d'une spécialité (par exemple "cardiologie")
4. Le système affiche les médecins correspondants
5. Le patient clique sur un médecin pour voir ses disponibilités
6. Il voit un calendrier avec les créneaux libres
7. Il clique sur un créneau qui lui convient
8. Il peut ajouter un motif de consultation (optionnel)
9. Il confirme sa demande
10. Le système crée le rendez-vous avec le statut "en attente"
11. Le médecin reçoit une notification
12. Le patient reçoit une confirmation

**Scénario : Un médecin confirme un rendez-vous**

1. Le médecin se connecte à son compte
2. Il va sur la page de ses rendez-vous
3. Il voit la liste des rendez-vous en attente
4. Il clique sur un rendez-vous pour voir les détails
5. Il clique sur "Confirmer"
6. Le statut passe à "confirmé"
7. Le patient reçoit une notification de confirmation

**Scénario : L'admin valide un nouveau médecin**

1. L'admin se connecte
2. Il va sur la page de gestion des médecins
3. Il voit la liste des médecins en attente de validation
4. Il vérifie les informations (numéro d'ordre notamment)
5. Il clique sur "Valider" ou "Refuser"
6. Le médecin reçoit une notification du résultat

## 2.4. Contraintes du projet

### 2.4.1. Contraintes techniques

On a fait le choix d'utiliser certaines technologies :

- **Pour le serveur (backend)** : NestJS, un framework JavaScript/TypeScript. C'est moderne, bien structuré, et ça facilite le développement d'API.

- **Pour l'interface (frontend)** : React, une bibliothèque très populaire pour créer des interfaces web interactives.

- **Pour la base de données** : PostgreSQL, un système de gestion de base de données robuste et gratuit.

- **Pour la communication** : Une API REST, c'est-à-dire que le frontend et le backend échangent des données au format JSON via des requêtes HTTP.

### 2.4.2. Contraintes organisationnelles

Le projet a été réalisé sur une période limitée, par une équipe réduite. Il a fallu faire des choix et prioriser certaines fonctionnalités par rapport à d'autres.

### 2.4.3. Contraintes de sécurité

Vu qu'on manipule des données de santé, la sécurité est primordiale :

- Les mots de passe sont hashés avec BCrypt (on ne stocke jamais le mot de passe en clair)
- L'authentification utilise des tokens JWT qui expirent au bout de 15 minutes
- Chaque utilisateur ne peut accéder qu'aux données qui le concernent
- Les entrées utilisateur sont validées pour éviter les injections
- Les fichiers uploadés sont vérifiés (type et taille)

---

# CHAPITRE 3 : CONCEPTION DU SYSTÈME

## 3.1. Architecture du système

### 3.1.1. Architecture globale

Notre application suit ce qu'on appelle une architecture client-serveur. En gros, il y a deux parties qui communiquent :

**Le client (frontend)** : C'est ce que l'utilisateur voit dans son navigateur. C'est une application React qui tourne sur le port 3000. Elle affiche les interfaces et envoie des requêtes au serveur.

**Le serveur (backend)** : C'est le cerveau de l'application. C'est une API NestJS qui tourne sur le port 3002. Elle reçoit les requêtes du client, fait les traitements nécessaires, communique avec la base de données, et renvoie les résultats.

**La base de données** : C'est PostgreSQL qui stocke toutes les informations (utilisateurs, rendez-vous, créneaux, etc.). Elle tourne sur le port 5432.

Le flux est le suivant : l'utilisateur fait une action (ex: cliquer sur "Prendre RDV") → le frontend envoie une requête au backend → le backend vérifie les droits, fait les opérations en base → le backend renvoie une réponse → le frontend met à jour l'affichage.

### 3.1.2. Choix technologiques

Pourquoi ces technologies ? Voici nos raisons :

**NestJS** : On l'a choisi parce qu'il impose une bonne structure au code. C'est basé sur des modules, ce qui rend le projet organisé et maintenable. En plus, il utilise TypeScript, ce qui aide à éviter beaucoup d'erreurs.

**React** : C'est une des bibliothèques les plus utilisées au monde pour le frontend. Il y a une grosse communauté, plein de ressources, et ça permet de faire des interfaces réactives.

**PostgreSQL** : C'est un système de base de données relationnel fiable et performant. Il est gratuit et très utilisé en production.

**Prisma** : C'est un ORM (outil pour communiquer avec la base de données) qui simplifie beaucoup le travail. On écrit moins de code SQL, et les requêtes sont plus sûres.

**Tailwind CSS** : Pour le style, on a utilisé Tailwind qui permet d'aller vite. Au lieu d'écrire du CSS dans des fichiers séparés, on met les classes directement dans le HTML.

**JWT** : Pour l'authentification, on utilise des JSON Web Tokens. C'est un standard qui permet de vérifier l'identité d'un utilisateur sans avoir à stocker de session côté serveur.

## 3.2. Modélisation UML

### 3.2.1. Diagramme de cas d'utilisation

On a déjà décrit les cas d'utilisation en texte dans le chapitre précédent. En résumé :

- Le Patient peut s'inscrire, se connecter, chercher des médecins, prendre/annuler des RDV, voir son historique
- Le Médecin peut s'inscrire, gérer ses créneaux, confirmer/annuler des RDV, voir ses patients, écrire des notes
- L'Admin peut valider des médecins, gérer les utilisateurs, voir les stats

### 3.2.2. Diagramme de classes

Les principales classes (ou entités) de notre système sont :

**Utilisateur** : Représente toute personne qui a un compte. Contient les infos de base (id, email, mot de passe, nom, prénom, téléphone, etc.) et le rôle (patient, médecin ou admin).

**Médecin** : C'est une spécialisation de l'utilisateur. En plus des infos de base, il a une spécialité, un numéro d'ordre, et un statut de validation.

**RendezVous** : Représente un rendez-vous entre un patient et un médecin. Contient la date/heure, le motif, le statut (en attente, confirmé, annulé).

**CreneauHoraire** : Représente une plage de disponibilité d'un médecin. Contient le jour de la semaine, l'heure de début et de fin.

**Indisponibilite** : Représente une période où le médecin n'est pas disponible (vacances, etc.). Contient la date de début, la date de fin, et éventuellement un motif.

**NoteMedicale** : Représente une note écrite par un médecin sur un patient. Contient un titre, un contenu, et peut avoir des pièces jointes.

**Notification** : Représente un message envoyé à un utilisateur. Contient le type (rappel, confirmation...), le titre, le message, et si elle a été lue.

### 3.2.3. Diagrammes de séquence

**Séquence de prise de rendez-vous :**

1. Patient → Frontend : Clique sur "Prendre RDV"
2. Frontend → Backend : GET /api/timeslots/medecin/{id}
3. Backend → Base de données : Récupère les créneaux du médecin
4. Base de données → Backend : Retourne les créneaux
5. Backend → Frontend : Retourne les créneaux disponibles
6. Frontend → Patient : Affiche le calendrier
7. Patient → Frontend : Sélectionne un créneau et valide
8. Frontend → Backend : POST /api/patients/rendezvous
9. Backend → Base de données : Crée le rendez-vous
10. Backend → Service notification : Envoie notif au médecin
11. Backend → Frontend : Retourne confirmation
12. Frontend → Patient : Affiche message de succès

## 3.3. Conception de la base de données

### 3.3.1. Modèle conceptuel des données (MCD)

Voici le MCD au format standard :

```
UTILISATEUR: _id, email, mot de passe, nom, prenom, telephone, date naissance, adresse, role, est actif, date creation, date mise a jour, theme, langue, preferences notif email, preferences notif sms
PRENDRE, 1N [patient] UTILISATEUR, 11 RENDEZVOUS
ASSURER, 1N [medecin] UTILISATEUR, 11 RENDEZVOUS
RENDEZVOUS: _id, date heure, motif, statut, notes, date creation, date mise a jour
CRENEAU_HORAIRE: _id, jour, heure debut, heure fin, est actif, date creation
DEFINIR, 1N [medecin] UTILISATEUR, 11 CRENEAU_HORAIRE
INDISPONIBILITE: _id, date debut, date fin, motif, date creation
DECLARER, 1N [medecin] UTILISATEUR, 11 INDISPONIBILITE
NOTE_MEDICALE: _id, titre, contenu, statut, pieces jointes, date creation, date mise a jour
REDIGER, 1N [medecin] UTILISATEUR, 11 NOTE_MEDICALE
CONCERNER, 1N [patient] UTILISATEUR, 11 NOTE_MEDICALE
NOTIFICATION: _id, type, titre, message, est lue, date creation
RECEVOIR, 1N UTILISATEUR, 11 NOTIFICATION

MEDECIN: specialite, numero ordre, statut validation
DF, _11 MEDECIN, 11 UTILISATEUR
```

### 3.3.2. Modèle logique des données (MLD)

En transformant le MCD en MLD, on obtient les tables suivantes :

**Table UTILISATEUR**
- id (clé primaire)
- email (unique)
- mot_de_passe
- nom
- prenom
- telephone
- date_naissance
- adresse
- role (PATIENT, MEDECIN ou ADMIN)
- est_actif
- date_creation
- date_mise_a_jour
- theme
- langue
- preferences_notif_email
- preferences_notif_sms
- specialite (pour les médecins)
- numero_ordre (pour les médecins)
- statut_validation (pour les médecins)

**Table RENDEZVOUS**
- id (clé primaire)
- patient_id (clé étrangère vers UTILISATEUR)
- medecin_id (clé étrangère vers UTILISATEUR)
- date_heure
- motif
- statut
- notes
- date_creation
- date_mise_a_jour

**Table CRENEAU_HORAIRE**
- id (clé primaire)
- medecin_id (clé étrangère)
- jour
- heure_debut
- heure_fin
- est_actif
- date_creation

**Table INDISPONIBILITE**
- id (clé primaire)
- medecin_id (clé étrangère)
- date_debut
- date_fin
- motif
- date_creation

**Table NOTE_MEDICALE**
- id (clé primaire)
- medecin_id (clé étrangère)
- patient_id (clé étrangère)
- titre
- contenu
- statut
- pieces_jointes
- date_creation
- date_mise_a_jour

**Table NOTIFICATION**
- id (clé primaire)
- utilisateur_id (clé étrangère)
- type
- titre
- message
- est_lue
- date_creation

### 3.3.3. Modèle physique des données (MPD)

Le MPD correspond au code SQL réel. Voici un extrait :

```sql
-- Création des types énumérés
CREATE TYPE "Role" AS ENUM ('PATIENT', 'MEDECIN', 'ADMIN');
CREATE TYPE "StatutRendezVous" AS ENUM ('EN_ATTENTE', 'CONFIRME', 'ANNULE');
CREATE TYPE "JourSemaine" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE');

-- Table des utilisateurs
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "telephone" VARCHAR(20),
    "role" "Role" NOT NULL,
    "isActive" BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "specialite" VARCHAR(100),
    "statutValidation" VARCHAR(20) DEFAULT 'PENDING'
);

-- Table des rendez-vous
CREATE TABLE "RendezVous" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "patientId" UUID NOT NULL REFERENCES "User"("id"),
    "medecinId" UUID NOT NULL REFERENCES "User"("id"),
    "dateHeure" TIMESTAMP NOT NULL,
    "motif" TEXT,
    "statut" "StatutRendezVous" DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX "idx_rdv_patient" ON "RendezVous"("patientId");
CREATE INDEX "idx_rdv_medecin" ON "RendezVous"("medecinId");
CREATE INDEX "idx_rdv_date" ON "RendezVous"("dateHeure");
```

## 3.4. Conception de l'interface utilisateur

### 3.4.1. Wireframes

Avant de coder, on a dessiné des maquettes simples (wireframes) pour visualiser les écrans principaux.

**Écran de connexion** : Un formulaire simple avec deux champs (email et mot de passe), un bouton de connexion, et un lien vers l'inscription.

**Dashboard patient** : En haut, des cartes avec les statistiques (RDV à venir, RDV passés, RDV annulés). En dessous, la liste des prochains rendez-vous. Un gros bouton pour prendre un nouveau rendez-vous.

**Dashboard médecin** : Des statistiques sur les rendez-vous du jour, les rendez-vous en attente de confirmation, le nombre total de patients. La liste des rendez-vous du jour avec des boutons pour confirmer ou annuler.

**Page de prise de rendez-vous** : Une barre de recherche pour trouver un médecin. Une liste de médecins avec leur spécialité. Quand on clique sur un médecin, on voit un calendrier avec les créneaux disponibles.

### 3.4.2. Maquettes

Pour le design final, on a utilisé :

- Une palette de couleurs professionnelles (bleu pour l'aspect médical/confiance, vert pour les confirmations)
- Un mode sombre pour ceux qui préfèrent
- Des icônes claires pour faciliter la navigation
- Un design responsive qui s'adapte à toutes les tailles d'écran

---

# CHAPITRE 4 : RÉALISATION DE L'APPLICATION

## 4.1. Environnement et outils de développement

### 4.1.1. Technologies utilisées

Voici la liste des technologies qu'on a utilisées :

**Côté serveur :**
- Node.js : l'environnement d'exécution JavaScript
- NestJS : le framework pour structurer notre API
- TypeScript : le langage (JavaScript avec des types)
- Prisma : l'ORM pour communiquer avec la base de données
- PostgreSQL : le système de base de données
- JWT : pour l'authentification
- BCrypt : pour hasher les mots de passe
- Nodemailer : pour envoyer des emails
- Multer : pour gérer les uploads de fichiers

**Côté client :**
- React : la bibliothèque pour l'interface
- React Router : pour la navigation entre les pages
- Axios : pour faire les requêtes HTTP
- Tailwind CSS : pour le style
- i18next : pour le multilinguisme
- Recharts : pour les graphiques

**Outils de développement :**
- VS Code : l'éditeur de code
- Git : pour le versioning
- Postman : pour tester l'API
- Prisma Studio : pour visualiser la base de données

### 4.1.2. Architecture du projet

**Structure du backend :**

Le code du serveur est organisé en modules. Chaque module gère une fonctionnalité :

- Le module `auth` gère l'inscription, la connexion et les tokens
- Le module `patients` gère tout ce qui concerne les patients
- Le module `medecins` gère tout ce qui concerne les médecins
- Le module `admin` gère les fonctionnalités d'administration
- Le module `timeslots` gère les créneaux horaires
- Le module `notifications` gère l'envoi de notifications
- Le module `common` contient les éléments partagés (guards, filtres, etc.)
- Le module `prisma` encapsule le service de base de données

**Structure du frontend :**

Le code client est organisé ainsi :

- `components/` contient les composants réutilisables (boutons, cartes, inputs...)
- `pages/` contient les pages de l'application, organisées par rôle (patient/, medecin/, admin/)
- `context/` contient les contextes React (authentification, thème)
- `services/` contient les fonctions pour appeler l'API
- `locales/` contient les fichiers de traduction

## 4.2. Développement du backend

### 4.2.1. Implémentation de l'API

L'API expose plusieurs endpoints (points d'entrée). Voici les principaux :

**Authentification :**
- POST /api/auth/register : créer un compte
- POST /api/auth/login : se connecter
- POST /api/auth/refresh : renouveler son token

**Patients :**
- GET /api/patients/profile : récupérer son profil
- PATCH /api/patients/profile : modifier son profil
- GET /api/patients/rendezvous : voir ses rendez-vous
- POST /api/patients/rendezvous : prendre un rendez-vous
- PATCH /api/patients/rendezvous/:id/status : annuler un rendez-vous

**Médecins :**
- GET /api/medecins/rendezvous : voir ses rendez-vous
- PATCH /api/medecins/rendezvous/:id : confirmer/annuler un rendez-vous
- GET /api/medecins/patients : voir ses patients
- POST /api/medecins/notes : créer une note médicale
- GET /api/medecins/timeslots : voir ses créneaux
- POST /api/medecins/timeslots : créer un créneau

**Admin :**
- GET /api/admin/users : voir tous les utilisateurs
- PATCH /api/admin/medecins/:id/validate : valider un médecin
- GET /api/admin/statistics : voir les statistiques

### 4.2.2. Gestion des utilisateurs

Pour l'inscription, voici ce qui se passe :

1. L'utilisateur remplit le formulaire
2. Le serveur vérifie que l'email n'existe pas déjà
3. Le mot de passe est hashé avec BCrypt
4. L'utilisateur est créé en base de données
5. Si c'est un médecin, son statut est mis à "en attente"
6. Le serveur génère les tokens JWT et les renvoie

Pour la connexion :

1. L'utilisateur entre son email et mot de passe
2. Le serveur cherche l'utilisateur par email
3. Il vérifie le mot de passe avec BCrypt
4. Si tout est bon, il génère et renvoie les tokens
5. Le frontend stocke les tokens et redirige vers le bon dashboard

### 4.2.3. Gestion des rendez-vous

La création d'un rendez-vous suit cette logique :

1. Vérifier que le médecin existe et est validé
2. Vérifier que le créneau est dans les disponibilités du médecin
3. Vérifier qu'il n'y a pas d'indisponibilité à cette date
4. Vérifier qu'il n'y a pas déjà un rendez-vous à cette heure
5. Créer le rendez-vous avec le statut "en attente"
6. Envoyer une notification au médecin

Une règle importante : le patient peut seulement annuler ses rendez-vous, pas les confirmer. La confirmation est réservée au médecin. On a mis cette règle pour éviter qu'un patient ne confirme lui-même un créneau sans l'accord du médecin.

### 4.2.4. Système de notifications

On a mis en place deux types de notifications :

**Notifications internes** : Ce sont des messages stockés en base de données que l'utilisateur peut voir quand il se connecte. Par exemple "Nouveau rendez-vous avec M. Dupont le 15/01 à 10h".

**Notifications externes** : Ce sont des emails (et potentiellement des SMS) envoyés automatiquement. On utilise Nodemailer pour les emails et Twilio pour les SMS.

L'envoi dépend des préférences de l'utilisateur. Si quelqu'un a désactivé les notifications par email, on ne lui en envoie pas.

## 4.3. Développement du frontend

### 4.3.1. Interfaces utilisateurs développées

On a créé plusieurs pages pour chaque type d'utilisateur :

**Pages communes :**
- Login : page de connexion
- Register : page d'inscription

**Pages patient :**
- Dashboard : vue d'ensemble avec stats et prochains RDV
- AppointmentBooking : prise de rendez-vous
- AppointmentHistory : historique des rendez-vous
- Profile : gestion du profil
- Settings : paramètres (langue, thème, notifications)

**Pages médecin :**
- Dashboard : vue d'ensemble avec RDV du jour
- Appointments : gestion des rendez-vous
- Patients : liste des patients
- Notes : notes médicales
- Creneaux : gestion des disponibilités
- Profile : profil professionnel
- Settings : paramètres

**Pages admin :**
- Dashboard : statistiques générales
- Medecins : gestion des médecins (validation)
- Patients : liste des patients
- RendezVous : supervision des rendez-vous

### 4.3.2. Interaction client-serveur

Pour communiquer avec le backend, on utilise Axios. On a configuré un intercepteur qui ajoute automatiquement le token d'authentification à chaque requête.

On a aussi un mécanisme de "refresh token" : quand le token expire (après 15 minutes), au lieu de déconnecter l'utilisateur, on essaie de le renouveler automatiquement avec le refresh token (qui dure 7 jours). Si ça échoue, là on le déconnecte.

Pour chaque module (patient, médecin, admin), on a créé un fichier de service qui regroupe toutes les fonctions d'appel API. Par exemple, `patientService.js` contient les fonctions `getProfile()`, `getAppointments()`, `createAppointment()`, etc.

## 4.4. Sécurité et gestion des accès

### 4.4.1. Authentification

L'authentification repose sur JWT (JSON Web Token). Le principe :

1. Quand l'utilisateur se connecte, le serveur crée un token signé contenant l'id et le rôle de l'utilisateur
2. Ce token est renvoyé au frontend qui le stocke
3. À chaque requête, le frontend envoie le token dans le header
4. Le serveur vérifie la signature du token
5. Si le token est valide, la requête est traitée

Le token d'accès expire après 15 minutes pour limiter les risques si quelqu'un l'intercepte. Le token de rafraîchissement dure 7 jours et sert à obtenir un nouveau token d'accès sans se reconnecter.

### 4.4.2. Gestion des rôles

Chaque utilisateur a un rôle : PATIENT, MEDECIN ou ADMIN. Les endpoints de l'API sont protégés selon les rôles.

Par exemple, seul un médecin peut accéder à `/api/medecins/patients`. Si un patient essaie d'y accéder, il reçoit une erreur 403 (Forbidden).

On utilise des "guards" dans NestJS pour vérifier ça. Avant de traiter une requête, le guard vérifie :
1. Que l'utilisateur est connecté (token valide)
2. Que son rôle correspond à ce qui est requis pour cet endpoint

---

# CHAPITRE 5 : TESTS, DÉPLOIEMENT ET PERSPECTIVES

## 5.1. Tests du système

### 5.1.1. Tests unitaires

Les tests unitaires vérifient que chaque fonction marche correctement de manière isolée. Par exemple, on teste que la fonction de hashage de mot de passe fonctionne, que la validation des emails rejette les formats invalides, etc.

On n'a pas couvert 100% du code avec des tests unitaires par manque de temps, mais les parties critiques (authentification, création de rendez-vous) ont été testées.

### 5.1.2. Tests fonctionnels

Les tests fonctionnels vérifient que les scénarios utilisateurs marchent de bout en bout. On a testé manuellement :

- L'inscription d'un patient : ça marche, le compte est créé
- La connexion : ça marche, on est redirigé vers le bon dashboard
- La prise de rendez-vous : ça marche, le RDV apparaît chez le médecin
- La confirmation par le médecin : ça marche, le statut change
- L'annulation par le patient : ça marche
- La validation d'un médecin par l'admin : ça marche

### 5.1.3. Tests d'intégration

Les tests d'intégration vérifient que les différents composants fonctionnent bien ensemble. On a notamment testé :

- Que le frontend arrive bien à communiquer avec le backend
- Que les données sont correctement enregistrées en base
- Que les notifications sont bien envoyées

## 5.2. Déploiement de l'application

### 5.2.1. Environnement de production

Pour passer en production, il faut configurer plusieurs choses :

- Une base de données PostgreSQL accessible en ligne
- Les variables d'environnement (secrets JWT, config email, etc.)
- Un serveur pour héberger le backend
- Un hébergement pour le frontend (ou un serveur qui sert les deux)

### 5.2.2. Hébergement et mise en ligne

Plusieurs options sont possibles :

**Avec Docker** : On peut créer une image Docker qui contient tout le nécessaire pour faire tourner l'application. Ensuite, on peut déployer cette image sur n'importe quel serveur qui supporte Docker.

**Sur Render** : C'est un service d'hébergement qui facilite le déploiement. On connecte notre dépôt Git, on configure les variables d'environnement, et Render se charge du reste.

**Sur un VPS** : On peut louer un serveur virtuel et y installer manuellement Node.js, PostgreSQL, et notre application.

Pour l'instant, l'application tourne en local. Le déploiement en production est prévu comme prochaine étape.

## 5.3. Discussion des résultats

### 5.3.1. Points forts de la solution

Ce qui marche bien :

- **Fonctionnalités complètes** : On a réussi à implémenter toutes les fonctionnalités prévues au départ
- **Interface agréable** : Le design est moderne et l'application est facile à utiliser
- **Sécurité** : L'authentification et la gestion des rôles fonctionnent correctement
- **Code propre** : Le code est organisé et commenté, quelqu'un d'autre pourrait reprendre le projet
- **Multilingue** : L'application marche en français et en anglais

### 5.3.2. Limites de la solution

Ce qu'on n'a pas pu faire ou ce qui pourrait être amélioré :

- **Pas de paiement en ligne** : On n'a pas intégré de système de paiement
- **Pas de téléconsultation** : Il n'y a pas de visioconférence intégrée
- **Pas d'application mobile** : C'est uniquement une application web
- **Rappels manuels** : Les rappels automatiques (24h avant le RDV) ne sont pas encore programmés
- **Performance** : Avec beaucoup d'utilisateurs, il faudrait optimiser certaines requêtes

## 5.4. Perspectives d'amélioration

Pour la suite, on pourrait :

**À court terme :**
- Mettre en place les rappels automatiques avec un système de tâches planifiées
- Ajouter l'export des données en PDF ou Excel
- Améliorer les statistiques pour les admins

**À moyen terme :**
- Intégrer un système de paiement (Stripe ou autre)
- Ajouter la téléconsultation avec une API de visioconférence
- Développer une application mobile avec React Native

**À long terme :**
- Permettre la gestion de plusieurs établissements
- Intégrer un système de dossier médical plus complet
- Ajouter de l'intelligence artificielle pour suggérer les meilleurs créneaux

---

# CONCLUSION GÉNÉRALE

Au terme de ce travail, on peut dire que les objectifs qu'on s'était fixés ont été atteints. On a réussi à créer une application web fonctionnelle qui permet de gérer des rendez-vous médicaux.

Le patient peut désormais prendre rendez-vous depuis chez lui, à n'importe quelle heure, sans avoir à passer des coups de fil. Le médecin peut gérer son planning plus facilement et passer moins de temps sur les tâches administratives. L'administrateur a une vue d'ensemble sur l'activité de la plateforme.

Bien sûr, l'application n'est pas parfaite. Il reste des fonctionnalités à ajouter, des optimisations à faire, et un déploiement en production à réaliser. Mais la base est solide et le projet peut évoluer.

Ce projet nous a permis de mettre en pratique beaucoup de choses qu'on a apprises pendant notre formation : la conception de bases de données, le développement backend et frontend, la sécurité informatique, la gestion de projet... C'était un bon exercice pour préparer notre entrée dans le monde professionnel.

On espère que ce travail pourra être utile et peut-être même déployé dans un vrai contexte médical un jour.

---

# BIBLIOGRAPHIE

**Documentation technique consultée :**

- Documentation NestJS : https://docs.nestjs.com
- Documentation React : https://react.dev
- Documentation Prisma : https://www.prisma.io/docs
- Documentation PostgreSQL : https://www.postgresql.org/docs
- Documentation Tailwind CSS : https://tailwindcss.com/docs

**Ressources sur la sécurité :**

- Site JWT.io pour comprendre les JSON Web Tokens
- Documentation OWASP sur les bonnes pratiques de sécurité web

**Ouvrages de référence :**

- Documentation et tutoriels en ligne sur les architectures REST
- Articles sur les bonnes pratiques de développement d'API

---

# RÉSUMÉ

Ce mémoire présente le travail de conception et développement d'une application web pour gérer les rendez-vous médicaux.

Le constat de départ était simple : prendre rendez-vous chez le médecin, c'est souvent compliqué. Il faut appeler, attendre, rappeler... Et côté médecin, gérer un planning sur papier, c'est fastidieux.

Notre solution permet aux patients de voir les disponibilités des médecins et de réserver un créneau en ligne. Les médecins peuvent gérer leur planning, confirmer les rendez-vous, et accéder aux informations de leurs patients. Un administrateur supervise le tout.

On a utilisé des technologies modernes : NestJS pour le serveur, React pour l'interface, PostgreSQL pour la base de données. L'application est sécurisée avec une authentification par tokens JWT et une gestion des droits selon les rôles.

Le résultat est une application fonctionnelle qui répond aux besoins identifiés. Des améliorations sont possibles pour la suite, notamment l'ajout du paiement en ligne et de la téléconsultation.

**Mots-clés** : application web, rendez-vous médicaux, NestJS, React, gestion de planning

---

**Abstract**

This thesis presents the design and development of a web application for managing medical appointments.

The initial observation was simple: booking a doctor's appointment is often complicated. You have to call, wait, call back... And on the doctor's side, managing a paper schedule is tedious.

Our solution allows patients to see doctors' availability and book a slot online. Doctors can manage their schedule, confirm appointments, and access their patients' information. An administrator oversees everything.

We used modern technologies: NestJS for the server, React for the interface, PostgreSQL for the database. The application is secured with JWT token authentication and role-based access control.

The result is a functional application that meets the identified needs. Improvements are possible for the future, including adding online payment and teleconsultation.

**Keywords**: web application, medical appointments, NestJS, React, schedule management
