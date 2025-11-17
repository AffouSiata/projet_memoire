# Scripts Prisma Utiles

## Scripts disponibles

### 1. `seed.ts` - Remplir la base avec des données de test
Crée des comptes de test complets (admin, médecins, patients, rendez-vous, etc.)

```bash
npx prisma db seed
```

⚠️ **Attention** : Ce script supprime d'abord toutes les données existantes !

---

### 2. `clear-data.ts` - Vider la base de données
Supprime toutes les données SAUF le compte admin.

```bash
npx ts-node prisma/clear-data.ts
```

✅ **Préserve** : Le compte admin (admin@medical.com)
🗑️ **Supprime** : Tous les autres utilisateurs et leurs données associées

---

### 3. `create-admin.ts` - Créer/vérifier le compte admin
Crée le compte administrateur s'il n'existe pas déjà.

```bash
npx ts-node prisma/create-admin.ts
```

**Identifiants admin** :
- Email : `admin@medical.com`
- Mot de passe : `password123`

---

## Workflow recommandé pour les tests

### Première configuration
```bash
# 1. Créer la base de données
createdb medical_appointment_db

# 2. Appliquer les migrations
npx prisma migrate dev

# 3. Créer le compte admin
npx ts-node prisma/create-admin.ts
```

### Pour réinitialiser les données de test
```bash
# Option 1 : Vider et garder seulement l'admin
npx ts-node prisma/clear-data.ts

# Option 2 : Remplir avec des données de test complètes
npx prisma db seed
```

### Pour voir les données (interface graphique)
```bash
npx prisma studio
```
Ouvre l'interface sur http://localhost:5555

---

## Notes importantes

- Le compte admin est toujours préservé lors des nettoyages
- Les relations en cascade suppriment automatiquement les données liées
- `seed.ts` remplace TOUTES les données (y compris l'admin)
- `clear-data.ts` garde l'admin intact
