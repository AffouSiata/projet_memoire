#!/bin/bash

API_URL="http://localhost:3002/api"

# 1. Connexion en tant que patient
echo "=== Connexion Patient ==="
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.yao@example.com",
    "motDePasse": "password123"
  }')

echo $LOGIN_RESPONSE | python3 -m json.tool

# Extraire le token
PATIENT_TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)

if [ -z "$PATIENT_TOKEN" ]; then
  echo "Erreur: Impossible d'obtenir le token"
  exit 1
fi

echo "Token Patient obtenu: ${PATIENT_TOKEN:0:50}..."

# 2. Voir le profil du patient
echo -e "\n=== Profil Patient ==="
curl -s -X GET $API_URL/patients/me \
  -H "Authorization: Bearer $PATIENT_TOKEN" | python3 -m json.tool

# 3. Voir les rendez-vous du patient
echo -e "\n=== Rendez-vous Patient ==="
curl -s -X GET $API_URL/patients/rendezvous \
  -H "Authorization: Bearer $PATIENT_TOKEN" | python3 -m json.tool

# 4. Connexion en tant que médecin
echo -e "\n=== Connexion Médecin ==="
MEDECIN_LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.kouadio@medical.com",
    "motDePasse": "password123"
  }')

MEDECIN_TOKEN=$(echo $MEDECIN_LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)
echo "Token Médecin obtenu: ${MEDECIN_TOKEN:0:50}..."

# 5. Voir les créneaux du médecin
echo -e "\n=== Créneaux Médecin ==="
curl -s -X GET $API_URL/medecins/timeslots \
  -H "Authorization: Bearer $MEDECIN_TOKEN" | python3 -m json.tool

# 6. Voir les rendez-vous du médecin
echo -e "\n=== Rendez-vous Médecin ==="
curl -s -X GET $API_URL/medecins/rendezvous \
  -H "Authorization: Bearer $MEDECIN_TOKEN" | python3 -m json.tool

# 7. Connexion en tant qu'admin
echo -e "\n=== Connexion Admin ==="
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medical.com",
    "motDePasse": "password123"
  }')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['accessToken'])" 2>/dev/null)
echo "Token Admin obtenu: ${ADMIN_TOKEN:0:50}..."

# 8. Voir les statistiques
echo -e "\n=== Statistiques ==="
curl -s -X GET $API_URL/admin/statistiques \
  -H "Authorization: Bearer $ADMIN_TOKEN" | python3 -m json.tool

echo -e "\n✅ Tests terminés!"
