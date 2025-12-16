#!/bin/bash

echo "🔐 Connexion..."
TOKEN=$(curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jean.kouadio@medical.com","motDePasse":"password123"}' \
  | grep -o '"accessToken":"[^"]*"' \
  | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erreur de connexion"
  exit 1
fi

echo "✅ Connecté avec succès"
echo ""
echo "📋 Récupération des créneaux horaires..."
echo ""

curl -s -X GET http://localhost:3002/api/medecins/timeslots \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool

echo ""
echo "✅ Terminé"
