# Exemples de Requêtes API

## Base URL
```
http://localhost:3002/api
```

## 1. Authentication

### Inscription (Register)
```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Dupont",
    "prenom": "Jean",
    "email": "jean.dupont@example.com",
    "motDePasse": "password123",
    "role": "PATIENT",
    "telephone": "+225 07 12 34 56 78",
    "dateNaissance": "1990-05-15",
    "adresse": "123 Rue de la Paix, Abidjan"
  }'
```

### Connexion (Login)
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.yao@example.com",
    "motDePasse": "password123"
  }'
```

**Réponse:**
```json
{
  "user": {
    "id": "uuid",
    "email": "marie.yao@example.com",
    "nom": "Yao",
    "prenom": "Marie",
    "role": "PATIENT"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Rafraîchir le token
```bash
curl -X POST http://localhost:3002/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Déconnexion
```bash
curl -X POST http://localhost:3002/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. Espace Patient

**Note:** Remplacez `YOUR_ACCESS_TOKEN` par le token reçu lors de la connexion.

### Voir son profil
```bash
curl -X GET http://localhost:3002/api/patients/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Modifier son profil
```bash
curl -X PATCH http://localhost:3002/api/patients/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "telephone": "+225 07 98 76 54 32",
    "adresse": "456 Avenue Charles de Gaulle, Abidjan"
  }'
```

### Changer son mot de passe
```bash
curl -X PATCH http://localhost:3002/api/patients/me/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword456"
  }'
```

### Voir les créneaux disponibles d'un médecin
```bash
# Remplacez MEDECIN_ID par l'ID d'un médecin
curl -X GET "http://localhost:3000/api/timeslots/MEDECIN_ID" \
  -H "Content-Type: application/json"
```

### Créer un rendez-vous
```bash
curl -X POST http://localhost:3002/api/patients/rendezvous \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medecinId": "MEDECIN_ID",
    "dateRendezVous": "2025-11-10T10:00:00Z",
    "motif": "Consultation de routine"
  }'
```

### Voir ses rendez-vous
```bash
curl -X GET http://localhost:3002/api/patients/rendezvous \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Voir ses notifications
```bash
curl -X GET http://localhost:3002/api/patients/notifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Marquer les notifications comme lues
```bash
curl -X PATCH http://localhost:3002/api/patients/notifications/mark-as-read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notificationIds": ["ID1", "ID2"]
  }'
```

### Modifier les préférences (thème)
```bash
curl -X PATCH http://localhost:3002/api/patients/preferences \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "SOMBRE",
    "couleurAccent": "#10b981"
  }'
```

---

## 3. Espace Médecin

### Voir son profil
```bash
curl -X GET http://localhost:3002/api/medecins/me \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

### Modifier son profil
```bash
curl -X PATCH http://localhost:3002/api/medecins/me \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialite": "Cardiologie",
    "telephone": "+225 07 11 22 33 44"
  }'
```

### Voir ses créneaux horaires
```bash
curl -X GET http://localhost:3002/api/medecins/timeslots \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

### Créer un créneau horaire
```bash
curl -X POST http://localhost:3002/api/medecins/timeslots \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jour": "LUNDI",
    "heureDebut": "09:00",
    "heureFin": "09:30",
    "isAvailable": true
  }'
```

### Créer plusieurs créneaux en une fois
```bash
curl -X POST http://localhost:3002/api/medecins/timeslots/bulk \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "jour": "LUNDI",
      "heureDebut": "09:00",
      "heureFin": "09:30",
      "isAvailable": true
    },
    {
      "jour": "LUNDI",
      "heureDebut": "09:30",
      "heureFin": "10:00",
      "isAvailable": true
    }
  ]'
```

### Générer automatiquement des créneaux pour la semaine
```bash
curl -X POST http://localhost:3002/api/medecins/timeslots/generate \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jours": ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"],
    "heureDebut": "08:00",
    "heureFin": "17:00",
    "dureeSlot": 30
  }'
```

### Modifier un créneau
```bash
curl -X PATCH http://localhost:3002/api/medecins/timeslots/TIMESLOT_ID \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": false
  }'
```

### Supprimer un créneau
```bash
curl -X DELETE http://localhost:3002/api/medecins/timeslots/TIMESLOT_ID \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

### Voir ses rendez-vous
```bash
curl -X GET http://localhost:3002/api/medecins/rendezvous \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

### Modifier le statut d'un rendez-vous
```bash
curl -X PATCH http://localhost:3002/api/medecins/rendezvous/RDV_ID \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "statut": "CONFIRME"
  }'
```

### Voir ses patients
```bash
curl -X GET http://localhost:3002/api/medecins/patients \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

### Créer une note médicale
```bash
curl -X POST http://localhost:3002/api/medecins/notes \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rendezvousId": "RDV_ID",
    "titre": "Consultation du 10/11/2025",
    "contenu": "Patient en bonne santé générale. Tension artérielle normale.",
    "statut": "BROUILLON"
  }'
```

### Voir ses notes médicales
```bash
curl -X GET http://localhost:3002/api/medecins/notes \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

### Modifier une note médicale
```bash
curl -X PATCH http://localhost:3002/api/medecins/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "statut": "PUBLIE"
  }'
```

### Uploader une pièce jointe à une note
```bash
curl -X POST http://localhost:3002/api/medecins/notes/NOTE_ID/upload \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

### Supprimer une note médicale
```bash
curl -X DELETE http://localhost:3002/api/medecins/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_MEDECIN_ACCESS_TOKEN"
```

---

## 4. Espace Admin

### Voir tous les patients
```bash
curl -X GET http://localhost:3002/api/admin/patients \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Modifier un patient
```bash
curl -X PATCH http://localhost:3002/api/admin/patients/PATIENT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }'
```

### Voir tous les médecins
```bash
curl -X GET http://localhost:3002/api/admin/medecins \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Modifier un médecin
```bash
curl -X PATCH http://localhost:3002/api/admin/medecins/MEDECIN_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": true
  }'
```

### Voir tous les rendez-vous
```bash
curl -X GET http://localhost:3002/api/admin/rendezvous \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Modifier un rendez-vous
```bash
curl -X PATCH http://localhost:3002/api/admin/rendezvous/RDV_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "statut": "ANNULE"
  }'
```

### Voir toutes les notifications
```bash
curl -X GET http://localhost:3002/api/admin/notifications \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

### Voir les statistiques
```bash
curl -X GET http://localhost:3002/api/admin/statistiques \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
```

**Réponse:**
```json
{
  "totalPatients": 50,
  "totalMedecins": 10,
  "totalRendezVous": 150,
  "rendezvousParStatut": {
    "EN_ATTENTE": 20,
    "CONFIRME": 80,
    "ANNULE": 30,
    "TERMINE": 20
  },
  "rendezvousParMois": {
    "2025-10": 40,
    "2025-11": 60,
    "2025-12": 50
  },
  "medecinsPlusActifs": [
    {
      "id": "uuid",
      "nom": "Kouadio",
      "prenom": "Jean",
      "specialite": "Cardiologie",
      "nombreRendezVous": 45
    }
  ]
}
```

---

## Comptes de Test

### Admin
- **Email:** `admin@medical.com`
- **Password:** `password123`

### Médecins
- **Email:** `jean.kouadio@medical.com` (Cardiologie)
- **Email:** `sophie.kone@medical.com` (Pédiatrie)
- **Email:** `michel.traore@medical.com` (Dermatologie)
- **Password:** `password123`

### Patients
- **Email:** `marie.yao@example.com`
- **Email:** `kouassi.bamba@example.com`
- **Email:** `fatou.diallo@example.com`
- **Password:** `password123`

---

## Script de Test Complet

Voici un script bash pour tester rapidement l'API:

```bash
#!/bin/bash

API_URL="http://localhost:3000/api"

# 1. Connexion en tant que patient
echo "=== Connexion Patient ==="
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.yao@example.com",
    "motDePasse": "password123"
  }')

echo $LOGIN_RESPONSE | jq '.'

# Extraire le token
PATIENT_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
echo "Token Patient: $PATIENT_TOKEN"

# 2. Voir le profil du patient
echo -e "\n=== Profil Patient ==="
curl -s -X GET $API_URL/patients/me \
  -H "Authorization: Bearer $PATIENT_TOKEN" | jq '.'

# 3. Voir les rendez-vous du patient
echo -e "\n=== Rendez-vous Patient ==="
curl -s -X GET $API_URL/patients/rendezvous \
  -H "Authorization: Bearer $PATIENT_TOKEN" | jq '.'

# 4. Connexion en tant que médecin
echo -e "\n=== Connexion Médecin ==="
MEDECIN_LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.kouadio@medical.com",
    "motDePasse": "password123"
  }')

MEDECIN_TOKEN=$(echo $MEDECIN_LOGIN_RESPONSE | jq -r '.accessToken')
echo "Token Médecin: $MEDECIN_TOKEN"

# 5. Voir les créneaux du médecin
echo -e "\n=== Créneaux Médecin ==="
curl -s -X GET $API_URL/medecins/timeslots \
  -H "Authorization: Bearer $MEDECIN_TOKEN" | jq '.'

# 6. Voir les rendez-vous du médecin
echo -e "\n=== Rendez-vous Médecin ==="
curl -s -X GET $API_URL/medecins/rendezvous \
  -H "Authorization: Bearer $MEDECIN_TOKEN" | jq '.'

# 7. Connexion en tant qu'admin
echo -e "\n=== Connexion Admin ==="
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medical.com",
    "motDePasse": "password123"
  }')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | jq -r '.accessToken')
echo "Token Admin: $ADMIN_TOKEN"

# 8. Voir les statistiques
echo -e "\n=== Statistiques ==="
curl -s -X GET $API_URL/admin/statistiques \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.'

echo -e "\n✅ Tests terminés!"
```

Sauvegardez ce script dans `test_api.sh` et exécutez:

```bash
chmod +x test_api.sh
./test_api.sh
```

**Note:** Ce script nécessite `jq` pour formater le JSON. Installez-le avec:
```bash
# macOS
brew install jq

# Linux
sudo apt install jq
```
