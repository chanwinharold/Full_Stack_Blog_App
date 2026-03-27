# Guide de mise en production

Ce projet a été préparé pour la mise en production. Voici les étapes à suivre :

## 1. Backend

### Variables d'environnement
Créez un fichier `.env` dans le dossier `backend/` en vous basant sur `backend/.env.example`.
Assurez-vous de remplir les informations de connexion à la base de données et de définir une `KEY_SECRET` sécurisée pour JWT.

### Installation et démarrage
```bash
cd backend
npm install
npm run start # Mode production
# ou
npm run dev # Mode développement avec nodemon
```

## 2. Frontend

### Configuration
Créez un fichier `.env` dans le dossier `frontend/` en vous basant sur `frontend/.env.example`.
- `VITE_API_URL` : L'URL de votre API (ex: `http://votre-domaine.com/api` ou `/api` si proxy/même domaine).
- `VITE_UPLOAD_URL` : L'URL pour accéder aux images (ex: `http://votre-domaine.com/uploads` ou `/uploads`).

### Build
```bash
cd frontend
npm install
npm run build
```

## 3. Déploiement groupé (Optionnel)

Si vous souhaitez que le backend serve le frontend (tout sur le même port) :
1. Construisez le frontend (`npm run build` dans le dossier frontend).
2. Configurez `NODE_ENV=production` dans le `.env` du backend.
3. Démarrez le backend (`npm run start` dans le dossier backend).
Le frontend sera accessible sur le port du serveur backend.

## 4. Base de données
Utilisez le script `backend/sql_queries/queries.sql` pour initialiser votre base de données MySQL.
Assurez-vous que les variables `DB_*` dans votre `.env` correspondent à votre configuration.
