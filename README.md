# Full Stack Blog App

Une application de blog full-stack, permettent de créer, mettre à jour et supprimer des articles de blog. Inspirée de structures standard avec React JS, Express, Node.js et PostgreSQL.

---

## Table des matières

* [Fonctionnalités](#fonctionnalités)
* [Technologies](#technologies)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Déploiement](#déploiement)
  * [PostgreSQL local](#postgresql-local)
  * [Render.com](#rendercom)
  * [Railway / Supabase](#railway--supabase)
* [Migration MySQL vers PostgreSQL](#migration-mysql-vers-postgresql)
* [Contribution](#contribution)
* [Licence](#licence)
* [Contact](#contact)

---

## Fonctionnalités

* Interface pour consulter les articles (disponible uniquement sur Desktop pour le moment).
* Panneau d'administration web pour :
  * Créer, modifier et supprimer des articles.
* Authentification via JWT (httpOnly cookies).
* Stockage des données dans PostgreSQL.
* Upload d'images (avatars, illustrations, etc.).
* Pagination et filtres par catégorie.
* Sécurité: Helmet, rate-limiting, input validation, XSS sanitization.

---

## Technologies

* **Frontend** : React JS
* **Admin web** : React.js, React Router
* **Backend** : Node.js + Express.js
* **Base de données** : PostgreSQL
* **Stockage médias** : local
* **Authentification** : JWT (httpOnly cookies)
* Outils de développement : ESLint, Prettier, Nodemon

---

## Installation

**Cloner le dépôt :**

```bash
git clone https://github.com/chanwinharold/Full_Stack_Blog_App.git
cd Full_Stack_Blog_App
```

Ensuite, installer les dépendances :

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

---

## Configuration

Créer un fichier `.env` dans le dossier `backend` :

```dotenv
# backend/.env
PORT=3000

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=blog_db

# Security (REQUIRED - minimum 32 characters)
KEY_SECRET=une_chaine_secrete_de_32_caracteres_minimum

# Allowed CORS origins
ALLOWED_ORIGINS=http://localhost:5173
```

---

## Usage

**Démarrage local :**

* **Backend**

  ```bash
  cd backend
  npm start
  ```

* **Frontend**

  ```bash
  cd frontend
  npm run dev
  ```

---

## Déploiement

### PostgreSQL local

1. Installer PostgreSQL :
   ```bash
   # macOS
   brew install postgresql@16
   brew services start postgresql@16

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

2. Créer la base de données et l'utilisateur :
   ```bash
   sudo -u postgres psql

   # Dans psql :
   CREATE USER blog_user WITH PASSWORD 'votre_mot_de_passe';
   CREATE DATABASE blog_db OWNER blog_user;
   GRANT ALL PRIVILEGES ON DATABASE blog_db TO blog_user;
   \q
   ```

3. Exécuter le schéma :
   ```bash
   psql -U blog_user -d blog_db -f schema.sql
   ```

4. Mettre à jour `.env` avec les credentials :
   ```dotenv
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=blog_user
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=blog_db
   ```

### Render.com

1. Créer un compte Render.com et se connecter au dashboard

2. Créer une base de données PostgreSQL :
   - Dashboard → New → PostgreSQL
   - Choisir une région et un plan (Free)
   - Noter l'Internal Database URL

3. Créer le fichier `.env` sur Render :
   ```
   PORT=3000
   DATABASE_URL=postgres://...@...:5432/...  (copier depuis Render)
   KEY_SECRET=votre_secret_jwt
   ALLOWED_ORIGINS=https://votre-site.onrender.com
   NODE_ENV=production
   ```

4. Créer un Web Service :
   - Dashboard → New → Web Service
   - Connecter le dépôt GitHub
   - Command: `npm start`
   - Publish directory: `backend`
   - Ajouter les variables d'environnement

### Railway / Supabase

1. **Railway** :
   - Créer un nouveau projet
   - Ajouter PostgreSQL plugin
   - Copier DATABASE_URL dans les variables d'environnement

2. **Supabase** :
   - Créer un projet depuis le dashboard Supabase
   - Aller dans Settings → Database
   - Utiliser l'URL de connection (port 6543 pour connection pooling en production)

3. Configuration identique à Render avec DATABASE_URL :

   ```dotenv
   DATABASE_URL=postgres://user:password@host:port/database
   DB_SSL=true
   NODE_ENV=production
   KEY_SECRET=votre_secret_jwt
   ```

---

## Migration MySQL vers PostgreSQL

Si vous avez des données existantes dans MySQL :

1. Configurer les variables pour les deux bases :

   ```dotenv
   # MySQL (source)
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=...
   MYSQL_DB=blog_db

   # PostgreSQL (target) - doit déjà être configuré
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=...
   DB_NAME=blog_db
   ```

2. Exécuter d'abord le schéma PostgreSQL :
   ```bash
   psql -U blog_user -d blog_db -f schema.sql
   ```

3. Lancer la migration :
   ```bash
   node migrate_data.js
   ```

4. Vérifier les données migrées

---

## Contribution

* Fork ce dépôt.
* Crée une branche pour ta fonctionnalité : `git checkout -b feature/ma-fonction`.
* Commit tes modifications : `git commit -m "Ajout : nouvelle fonctionnalité"`.
* Push sur ta branche : `git push origin feature/ma-fonction`.
* Ouvre une Pull Request.

---

## Licence

Ce projet est sous licence **MIT**. Consulte le fichier `LICENSE` pour davantage de détails.

---

## Contact

* **Auteur** : chanwinharold
* **Email** : [chanwinharold@gmail.com](chanwinharold@gmail.com)
* **LinkedIn** : [harold Chanwin](https://www.linkedin.com/in/harold-chanwin-profile)
* **GitHub** : [https://github.com/chanwinharold](https://github.com/chanwinharold)