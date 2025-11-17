# Guide de Démarrage Rapide

## Scripts disponibles

### 🚀 Démarrer l'API

```bash
./start.sh
```

Ce script:
- Nettoie automatiquement tous les processus existants
- Libère les ports 3000-3010
- Démarre l'API sur le port configuré dans `.env`
- Évite les conflits de ports

### 🛑 Arrêter l'API

```bash
./stop.sh
```

Ce script:
- Arrête proprement tous les processus Node/Nest
- Libère tous les ports utilisés
- Nettoie complètement l'environnement

## Changer le port

1. Éditez le fichier `.env`
2. Changez la valeur de `PORT`
3. Relancez l'API avec `./start.sh`

**Exemple:**
```env
PORT=3005
```

Puis:
```bash
./stop.sh
./start.sh
```

## Dépannage

### Erreur "address already in use"

Si vous rencontrez cette erreur:

```bash
# Arrêtez l'API
./stop.sh

# Attendez 2 secondes
sleep 2

# Redémarrez
./start.sh
```

### Vérifier quel port est utilisé

```bash
# Voir le port configuré
grep "^PORT=" .env

# Vérifier si un processus utilise le port
lsof -i:3002
```

### Tuer manuellement un processus sur un port spécifique

```bash
# Par exemple pour le port 3002
lsof -ti:3002 | xargs kill -9
```

## Commandes classiques (sans scripts)

Si vous préférez les commandes classiques:

```bash
# Démarrer en mode développement
npm run start:dev

# Build
npm run build

# Démarrer en production
npm run start:prod

# Tests
npm run test
```

## Port actuel

L'API tourne actuellement sur: **http://localhost:3002/api**

## Comptes de test

- **Admin:** admin@medical.com / password123
- **Médecin:** jean.kouadio@medical.com / password123
- **Patient:** marie.yao@example.com / password123

## Tester l'API

```bash
# Test simple
curl http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"marie.yao@example.com","motDePasse":"password123"}'

# Ou utilisez le script de test complet
./test_api.sh
```

## Fichiers importants

- `.env` - Configuration (port, database, secrets)
- `start.sh` - Script de démarrage propre
- `stop.sh` - Script d'arrêt propre
- `test_api.sh` - Script de test des endpoints
- `API_EXAMPLES.md` - Documentation complète des endpoints
