# Full Stack Blog App

Blog full-stack avec React, Express et PostgreSQL.

## Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## Configuration

Créer `backend/.env` :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_pass
DB_NAME=postgres
KEY_SECRET=votre_secret_jwt_min_32_chars
ALLOWED_ORIGINS=http://localhost:5173
```

## Démarrage

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev
```

## Déploiement

### Variables d'environnement (Render — backend)

| Variable | Description |
|----------|-------------|
| NODE_ENV | production |
| PORT | 3000 |
| DB_HOST | host Supabase |
| DB_USER | postgres |
| DB_PASSWORD | mot de passe Supabase |
| DB_NAME | postgres |
| DB_PORT | 5432 |
| KEY_SECRET | clé secrète JWT |
| ALLOWED_ORIGINS | URL du frontend |

### Variables d'environnement (Vercel/Render — frontend)

| Variable | Description |
|----------|-------------|
| VITE_API_URL | URL du backend |

### Initialiser la base de données

```bash
node backend/scripts/initDb.js
```