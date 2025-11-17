#!/bin/bash

# Script pour démarrer l'API proprement sans conflits de ports

echo "🧹 Nettoyage des processus existants..."

# Arrêter tous les processus nest
pkill -f "nest start" 2>/dev/null

# Nettoyer les ports 3000-3010
for port in {3000..3010}; do
    lsof -ti:$port | xargs kill -9 2>/dev/null
done

echo "✅ Nettoyage terminé"

# Attendre un peu pour s'assurer que les ports sont libérés
sleep 2

# Lire le port depuis .env
PORT=$(grep "^PORT=" .env | cut -d '=' -f2)

echo "🚀 Démarrage de l'API sur le port $PORT..."
npm run start:dev
