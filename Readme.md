# Projet Web : Gestion de Courses & Cuisine

Voici le rendu de notre projet dev web. C'est une application web qui permet de gérer ses listes de courses, ses recettes de cuisine et cree ses ingrédients.

Tout est conteneurisé avec Docker pour que ce soit facile à lancer sur n'importe quelle machine.

## Répartition des tâches

* **Personne A - Théo - Architecte et Listes :**
    * Mise en place du serveur (Node.js) et de la base de données.
    * Système d'inscription et de connexion (Sécurité, Tokens JWT).
    * Gestion des **Listes de courses** (Ajout, suppression, "cocher" les items).
    * Structure du Frontend (React + Vite).

* **Personne B - Mathis - Les Recettes :**
    * Création des fiches recettes (Titre, étapes, description).
    * Gestion de la visibilité : Recettes privées (pour soi) ou publiques (visibles par tous).
    * Liaison entre les recettes et les utilisateurs.
    * Structure du Frontend (React + Vite).

* **Personne C - Yassine - Ingrédients & Catégories :**
    * Gestion des **ingrédients**.
    * Classement par **Catégories**.
    * Permet de savoir de quels aliments on dispose.

On est parti sur du **JavaScript Fullstack** :
* **Backend :** Node.js avec Express (API) + Sequelize.
* **Frontend :** React pour l'interface avec html et css.
* **Base de données :** PostgreSQL.
* **Outils :** Docker pour tout lancer d'un coup, et Git pour le versionning.

---

## Comment lancer le projet ?

Il suffit d'avoir Docker installé. Vous n'avez pas besoin d'installer Node ou Postgres sur votre machine.

### 1. Démarrer le serveurs (dans le dossier "src")
**Ouvre ton terminal à la racine du dossier et lance :**

docker compose up --build

### Dans un autre terminal (dans le meme dossier)
docker compose exec backend node migrator.js

### Clear la bdd (si besoin)
**stoper le serveur :**
docker compose down -v

**Relancer le projet :**
docker compose up --build

**Recree les tables (dans un autre terminal) :**
docker compose exec backend node migrator.js

### 2. Accéder à l'application
Site Web : http://localhost:5173

API Backend : http://localhost:3000