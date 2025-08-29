
# 🎉 Full Stack Blog App

Une application de blog full‑stack, permettant de créer, mettre à jour et supprimer des articles de blog. Inspirée de structures standard avec React JS, Express, Node.js et MySQL ([GitHub][1]).

---

## Table des matières

* [Fonctionnalités](#fonctionnalités)
* [Technologies](#technologies)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Déploiement](#déploiement)
* [Contribution](#contribution)
* [Licence](#licence)
* [Contact](#contact)

---

## Fonctionnalités

* Interface pour consulter les articles (disponible uniquement sur Desktop pour le moment).
* Panneau d’administration web pour :

  * Créer, modifier et supprimer des articles.
* Authentification via JWT.
* Stockage des données dans MySQL.
* Upload d’images (avatars, illustrations, etc.).
* Pagination et filtres par catégorie.

---

## Technologies

* **Frontend** : React JS
* **Admin web** : React.js, React Router
* **Backend** : Node.js + Express.js
* **Base de données** : MySQL
* **Stockage médias** : local
* **Authentification** : JWT
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

Créer un fichier `.env` dans le dossier `backend` avec les variables essentielles :

```dotenv
# backend/.env
PORT=3000
DB_PASSWORD=votre_mot_de_passe
KEY_SECRET=une_chaine_secrete
```

Adapte ces valeurs selon ton environnement ou tes choix de déploiement.

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

