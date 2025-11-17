#!/bin/bash

# Script pour arrêter l'API proprement

echo "🛑 Arrêt de l'API..."

# Arrêter tous les processus nest
pkill -f "nest start" 2>/dev/null

# Nettoyer les ports 3000-3010
for port in {3000..3010}; do
    if lsof -ti:$port >/dev/null 2>&1; then
        echo "   Libération du port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
    fi
done

echo "✅ API arrêtée et ports libérés"
