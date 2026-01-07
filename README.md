# DockerNotes - Application Web Multi-conteneurs

Application simple de gestion de notes déployée avec Docker Compose. Elle comprend une API Node.js, une base de données PostgreSQL et un front-end React.

## Prérequis

- Docker version 20.10 ou supérieure
- Docker Compose version 2.0 ou supérieure
- Système d’exploitation : Windows, Linux ou macOS

Vérifier l’installation :

```bash
docker --version
docker compose version
```

## Installation et Lancement

### 1. Cloner le projet

```bash
cd DockerNotes
```

### 2. Configurer les variables d'environnement

Changer le `.env.example` en `.env` avec vos informations dedans

### 3. Démarrer l'application

```bash
docker compose up -d
```

### 4. Accéder à l'application

Ouvrir le navigateur sur : **http://localhost:8080**

### 5. Arrêter l'application

```bash
docker compose down
```

## Architecture

### Services déployés

| Service   | Description                | Port           | Image de base                      |
| --------- | -------------------------- | -------------- | ---------------------------------- |
| **front** | Interface React avec Nginx | 8080 (public)  | node:20-alpine + nginx:1.27-alpine |
| **api**   | API REST Node.js/Express   | 3000 (interne) | node:20-alpine                     |
| **db**    | Base de données PostgreSQL | 5432 (interne) | postgres:16-alpine                 |

### Réseau

- **app_net** : réseau interne pour la communication entre les services

### Volumes

- **db_data** : persistance des données PostgreSQL

## Variables d'environnement

### Service `db`

- `POSTGRES_DB` : nom de la base de données
- `POSTGRES_USER` : utilisateur PostgreSQL
- `POSTGRES_PASSWORD` : mot de passe PostgreSQL

### Service `api`

- `PORT` : port d'écoute de l'API (3000)
- `DATABASE_URL` : URL de connexion à la base de données

## Endpoints API

- `GET /health` : vérification du statut de l'API
- `GET /api/notes` : récupérer toutes les notes
- `POST /api/notes` : créer une nouvelle note (body JSON : `{"content": "texte"}`)
- `PUT /api/notes/:id` : mettre à jour une note (body JSON : `{"content": "texte"}`)
- `DELETE /api/notes/:id` : supprimer une note

## Choix techniques

### Conteneurisation

- **Images Alpine** : Images légères
- **Multi-stage build** : Pour le front-end, séparation build/production pour optimiser la taille du projet
- **npm ci** : Installation des dépendances

### Sécurité

- **Utilisateur non-root** : L'API tourne avec un utilisateur 'appuser' sans privilèges
- **Variables d'environnement** : Secrets dans `.env`
- **Exposition limitée** : Seul le front-end est accessible publiquement, l'API et la BDD restent inaccessible

### Architecture

- **Séparation des services** : Chaque composant est dans son propre conteneur
- **Healthchecks** : Vérification automatique de l'état des services
- **Dépendances** : Ordre de démarrage géré avec `depends_on` et conditions de santé
- **Persistance** : Volume Docker pour conserver les données de la base

### Choix des technologies

- **PostgreSQL** : BDD que j’ai le plus utilisée et que je préfère.
- **Node.js/Express** : API plus utilisée et préférée.
- **React/Vite** : Framework plus utilisé et préféré.
- **Nginx** : Serveur web pour les fichiers statiques.

## Structure du projet

```
DockerNotes/
├── docker-compose.yml
├── .env
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js
│       └── db.js
├── db/
│   └── init.sql
└── front/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── App.jsx
        └── main.jsx
```
