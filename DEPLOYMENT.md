# Guide de Déploiement sur Render

Ce guide explique comment déployer votre application Medical Appointment (API + Frontend) sur Render gratuitement.

## Architecture du Déploiement

- **Une seule application Docker** qui contient :
  - L'API NestJS (backend)
  - Le frontend React servi en statique par l'API
- **Une base de données PostgreSQL** gratuite sur Render

## Prérequis

1. Un compte GitHub avec votre code pushé
2. Un compte Render (gratuit) : https://render.com

## Étapes de Déploiement

### Option 1 : Déploiement Automatique avec render.yaml (Recommandé)

1. **Pushez votre code sur GitHub** avec tous les nouveaux fichiers :
   ```bash
   git add .
   git commit -m "Add Docker configuration for Render deployment"
   git push origin main
   ```

2. **Connectez-vous à Render** : https://dashboard.render.com

3. **Créez un nouveau Blueprint** :
   - Cliquez sur "New +" → "Blueprint"
   - Connectez votre repository GitHub
   - Render détectera automatiquement le fichier `render.yaml`
   - Cliquez sur "Apply"

4. **Configurez les variables d'environnement sensibles** :
   - Allez dans votre service web créé
   - Dans "Environment", ajoutez :
     - `EMAIL_HOST` (ex: smtp.gmail.com)
     - `EMAIL_USER` (votre email)
     - `EMAIL_PASSWORD` (mot de passe d'application Gmail)
     - `TWILIO_ACCOUNT_SID` (optionnel)
     - `TWILIO_AUTH_TOKEN` (optionnel)
     - `TWILIO_PHONE_NUMBER` (optionnel)

5. **Attendez le déploiement** (peut prendre 5-10 minutes la première fois)

### Option 2 : Déploiement Manuel

#### Étape 1 : Créer la Base de Données

1. Dans le dashboard Render, cliquez sur "New +" → "PostgreSQL"
2. Configurez :
   - Name: `medical-appointment-db`
   - Database: `medical_appointment_db`
   - User: `medical_user`
   - Region: Choisissez le plus proche de vous
   - Plan: **Free**
3. Cliquez sur "Create Database"
4. **Copiez l'Internal Database URL** (format: `postgresql://...`)

#### Étape 2 : Créer le Service Web

1. Cliquez sur "New +" → "Web Service"
2. Connectez votre repository GitHub
3. Configurez :
   - Name: `medical-appointment-app`
   - Environment: **Docker**
   - Region: Même région que la base de données
   - Branch: `main`
   - Plan: **Free**

4. **Variables d'environnement** (cliquez sur "Advanced") :
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<collez l'Internal Database URL de l'étape 1>
   JWT_SECRET=<générez une clé secrète aléatoire>
   JWT_REFRESH_SECRET=<générez une autre clé secrète aléatoire>
   JWT_EXPIRATION=15m
   JWT_REFRESH_EXPIRATION=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=<votre-email@gmail.com>
   EMAIL_PASSWORD=<mot-de-passe-application-gmail>
   EMAIL_FROM=Medical Appointment <noreply@medical-appointment.com>
   UPLOAD_DIR=./uploads
   MAX_FILE_SIZE=5242880
   ```

5. Cliquez sur "Create Web Service"

## Configuration Gmail pour les Emails

Pour utiliser Gmail pour envoyer des emails :

1. Allez sur votre compte Google
2. Activez la **validation en deux étapes**
3. Générez un **mot de passe d'application** :
   - https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et "Autre (nom personnalisé)"
   - Nommez-le "Medical Appointment"
   - Copiez le mot de passe généré
4. Utilisez ce mot de passe pour `EMAIL_PASSWORD`

## Après le Déploiement

1. **Vérifiez les logs** dans le dashboard Render pour voir si le déploiement est réussi

2. **Testez l'application** :
   - URL de votre application : `https://medical-appointment-app.onrender.com`
   - API : `https://medical-appointment-app.onrender.com/api`

3. **Seed la base de données** (première fois seulement) :
   - Dans le dashboard Render, allez dans votre service web
   - Cliquez sur "Shell" (en haut à droite)
   - Exécutez : `npx prisma db seed`

4. **Testez avec un compte** (utilisez les comptes de seed) :
   - Email: `admin@medical.com`
   - Mot de passe: `password123`

## Limitations du Plan Gratuit Render

- **Instance qui dort** : Après 15 minutes d'inactivité, l'application s'endort et prend 30-60 secondes pour redémarrer au prochain accès
- **750 heures/mois** : Suffisant pour un projet personnel ou de démonstration
- **Base de données** :
  - 1 GB de stockage
  - Expire après 90 jours (pensez à recréer)
  - Pas de backups automatiques

## Dépannage

### L'application ne démarre pas
- Vérifiez les logs dans le dashboard Render
- Assurez-vous que `DATABASE_URL` est correctement configuré
- Vérifiez que tous les secrets JWT sont définis

### Erreur de connexion à la base de données
- Utilisez l'**Internal Database URL** (pas l'External)
- Vérifiez que la base de données est dans la même région

### Frontend ne charge pas
- Vérifiez que le build du frontend s'est bien passé dans les logs
- Assurez-vous que le fichier `public/index.html` existe après le build

### Les migrations Prisma échouent
- Connectez-vous au Shell de Render
- Exécutez manuellement : `npx prisma migrate deploy`

## Commandes Utiles (Shell Render)

```bash
# Voir les migrations
npx prisma migrate status

# Appliquer les migrations
npx prisma migrate deploy

# Seed la base de données
npx prisma db seed

# Ouvrir Prisma Studio (ne fonctionne pas en production)
# Utilisez plutôt le Shell PostgreSQL dans Render
```

## Mise à Jour de l'Application

1. Pushez vos changements sur GitHub :
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. Render détecte automatiquement les changements et redéploie

## URLs Importantes

- **Dashboard Render** : https://dashboard.render.com
- **Documentation Render** : https://render.com/docs
- **Votre Application** : https://medical-appointment-app.onrender.com (remplacez par votre URL)
