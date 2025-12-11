# Projet Web : Gestion de Courses & Cuisine

Voici le rendu de notre projet dev web. C'est une application web complète qui permet de gérer ses listes de courses, ses recettes de cuisine et ses stocks d'ingrédients.

Tout est conteneurisé avec Docker pour que ce soit facile à lancer sur n'importe quelle machine.

## Répartition des tâches

* **Personne A - Architecte et Listes :**
    * Mise en place du serveur (Node.js) et de la base de données.
    * Système d'inscription et de connexion (Sécurité, Tokens JWT).
    * Gestion des **Listes de courses** (Ajout, suppression, "cocher" les items).
    * Structure du Frontend (React + Vite).

* **Personne B - Les Recettes :**
    * Création des fiches recettes (Titre, étapes, description).
    * Gestion de la visibilité : Recettes privées (pour soi) ou publiques (visibles par tous).
    * Liaison entre les recettes et les utilisateurs.

* **Personne C - Ingrédients & Catégories :**
    * Gestion des **ingrédients**.
    * Classement par **Catégories**.
    * Permet de savoir de quels aliments on dispose.

## Notre Stack Technique

On est parti sur du **JavaScript Fullstack** :
* **Backend :** Node.js avec Express (API) + Sequelize.
* **Frontend :** React pour l'interface.
* **Base de données :** PostgreSQL.
* **Outils :** Docker pour tout lancer d'un coup, et Git pour le versionning.

---

## Comment lancer le projet ?

C'est super simple, il suffit d'avoir **Docker** installé.

### 1. Démarrer le serveurs
Ouvre ton terminal à la racine du dossier et lance :

docker compose up --build