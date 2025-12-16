# 🚀 Guide d'Installation - API Medical Appointment

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** v18 ou supérieur
- **PostgreSQL** v14 ou supérieur
- **npm** ou **yarn**

## Étape 1 : Installation de PostgreSQL

### Sur macOS (avec Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Sur Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Sur Windows
Téléchargez et installez depuis : https://www.postgresql.org/download/windows/

## Étape 2 : Créer la base de données

```bash
# Se connecter à PostgreSQL
psql postgres

# Créer la base de données
CREATE DATABASE medical_appointment_db;

# Créer un utilisateur (optionnel)
CREATE USER medical_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE medical_appointment_db TO medical_user;

# Quitter
\q
```

## Étape 3 : Configurer les variables d'environnement

```bash
# Copier le fichier .env.example
cp .env.example .env

# Éditer le fichier .env avec vos informations
nano .env  # ou code .env
```

### Configuration minimale requise

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/medical_appointment_db?schema=public"
JWT_SECRET="votre-secret-jwt-super-securise"
JWT_REFRESH_SECRET="votre-secret-refresh-super-securise"
```

### Configuration complète (optionnel)

Pour activer les notifications email et SMS, configurez :

**Email (Gmail) :**
1. Activez la validation en 2 étapes sur votre compte Gmail
2. Générez un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Ajoutez dans `.env` :
```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="votre-email@gmail.com"
EMAIL_PASSWORD="mot-de-passe-application"
```

**SMS (Twilio) :**
1. Inscrivez-vous sur https://www.twilio.com/
2. Obtenez vos credentials du dashboard
3. Ajoutez dans `.env` :
```env
TWILIO_ACCOUNT_SID="votre-account-sid"
TWILIO_AUTH_TOKEN="votre-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

## Étape 4 : Installer les dépendances

```bash
npm install
```

## Étape 5 : Exécuter les migrations

```bash
# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate
```

## Étape 6 : Insérer les données de test

```bash
npx prisma db seed
```

### Comptes de test créés

**Admin :**
- Email : `admin@medical.com`
- Mot de passe : `password123`

**Médecins :**
- Email : `jean.kouadio@medical.com` (Cardiologie)
- Email : `sophie.kone@medical.com` (Pédiatrie)
- Email : `michel.traore@medical.com` (Dermatologie)
- Mot de passe : `password123`

**Patients :**
- Email : `marie.yao@example.com`
- Email : `kouassi.bamba@example.com`
- Email : `fatou.diallo@example.com`
- Mot de passe : `password123`

## Étape 7 : Lancer l'API

```bash
# Mode développement (avec hot reload)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera accessible sur : **http://localhost:3000/api**

## ✅ Vérifier l'installation

### Test simple avec curl

```bash
# Test de connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.yao@example.com",
    "motDePasse": "password123"
  }'
```

Vous devriez recevoir un `accessToken` et `refreshToken` en réponse.

### Tester avec un client REST

1. Installez **Postman** ou **Insomnia**
2. Importez les endpoints du README.md
3. Testez la connexion avec un compte de test

## 🛠️ Commandes utiles

```bash
# Voir les logs de la base de données
npm run start:dev

# Réinitialiser la base de données
npx prisma migrate reset

# Visualiser la base de données (Prisma Studio)
npx prisma studio

# Lancer les tests
npm run test

# Générer une nouvelle migration
npx prisma migrate dev --name nom_migration
```

## 🔍 Résolution des problèmes

### Erreur : "Connection refused" PostgreSQL

```bash
# Vérifier si PostgreSQL est démarré
brew services list  # macOS
sudo systemctl status postgresql  # Linux

# Démarrer PostgreSQL
brew services start postgresql@14  # macOS
sudo systemctl start postgresql  # Linux
```

### Erreur : "JWT_SECRET is not defined"

Assurez-vous que votre fichier `.env` est bien configuré et relancez l'application.

### Erreur : "Port 3000 already in use"

Changez le port dans le fichier `.env` :
```env
PORT=3001
```

## 📚 Prochaines étapes

1. Lisez le [README.md](./README.md) pour la documentation complète de l'API
2. Testez les endpoints avec Postman
3. Commencez le développement du frontend

## 🆘 Besoin d'aide ?

- Documentation Prisma : https://www.prisma.io/docs
- Documentation NestJS : https://docs.nestjs.com
- PostgreSQL : https://www.postgresql.org/docs

Bonne chance avec votre projet ! 🎉
