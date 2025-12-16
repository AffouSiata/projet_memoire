#!/bin/bash

# Script pour tester le build Docker localement avant le déploiement sur Render

echo "🐳 Test du build Docker pour Render"
echo "===================================="

# Arrêter et supprimer les anciens conteneurs
echo "📦 Nettoyage des anciens conteneurs..."
docker-compose down 2>/dev/null || true

# Build de l'image Docker
echo "🔨 Build de l'image Docker..."
docker build -t medical-appointment-app .

if [ $? -ne 0 ]; then
    echo "❌ Échec du build Docker"
    exit 1
fi

echo "✅ Build réussi !"

# Demander si on veut tester localement
read -p "Voulez-vous tester l'application localement ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Démarrage du conteneur..."
    echo ""
    echo "⚠️  IMPORTANT : Assurez-vous d'avoir une base PostgreSQL locale accessible"
    echo "   DATABASE_URL devrait pointer vers votre PostgreSQL local"
    echo ""

    # Créer un fichier .env.docker pour le test si il n'existe pas
    if [ ! -f .env.docker ]; then
        echo "📝 Création du fichier .env.docker..."
        cat > .env.docker << EOL
DATABASE_URL=postgresql://postgres:password@host.docker.internal:5432/medical_appointment_db
JWT_SECRET=test-secret-key-change-in-production
JWT_REFRESH_SECRET=test-refresh-secret-key-change-in-production
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=Medical Appointment <noreply@medical-appointment.com>
PORT=3000
NODE_ENV=production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
EOL
        echo "✅ Fichier .env.docker créé. Modifiez-le avec vos vraies valeurs !"
        echo ""
    fi

    # Démarrer le conteneur
    docker run --rm \
        --name medical-app-test \
        --env-file .env.docker \
        -p 3000:3000 \
        medical-appointment-app
else
    echo "✅ Test terminé. Vous pouvez maintenant déployer sur Render !"
fi
