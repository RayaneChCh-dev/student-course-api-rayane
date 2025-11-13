# StudentCourseAPI

[![CI Status](https://github.com/RayaneChCh-dev/student-course-api-rayane/workflows/CI/badge.svg)](https://github.com/RayaneChCh-dev/student-course-api-rayane/actions)
[![Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://github.com/RayaneChCh-dev/student-course-api-rayane)

> API REST de gestion d'étudiants et de cours pour le module Tests et Qualité à l'Efrei.

## 🚀 Démarrage rapide

```bash
# Installation
npm install

# Lancer les tests
npm test

# Démarrer le serveur
npm run dev
```

**API** : http://localhost:3000  
**Documentation Swagger** : http://localhost:3000/api-docs

## 📋 Prérequis

- Node.js >= 14.x (recommandé : 18.x ou 20.x)
- npm >= 6.x

## 📁 Structure du projet

```
StudentCourseAPI/
├── src/
│   ├── app.js                    # Point d'entrée
│   ├── controllers/              # Logique métier
│   ├── routes/                   # Définition des endpoints
│   └── services/storage.js       # Couche données (mémoire)
├── tests/
│   ├── integration/              # Tests API
│   └── unit/                     # Tests unitaires
├── swagger.json                  # Documentation OpenAPI
└── jest.config.js                # Config tests
```

## 🌐 Endpoints API

### Étudiants
- `GET /students` - Liste (pagination + filtres)
- `GET /students/:id` - Détails + cours
- `POST /students` - Créer
- `PUT /students/:id` - Modifier
- `DELETE /students/:id` - Supprimer

### Cours
- `GET /courses` - Liste (pagination + filtres)
- `GET /courses/:id` - Détails + étudiants
- `POST /courses` - Créer
- `PUT /courses/:id` - Modifier
- `DELETE /courses/:id` - Supprimer (cascade)

### Inscriptions
- `POST /courses/:courseId/students/:studentId` - Inscrire
- `DELETE /courses/:courseId/students/:studentId` - Désinscrire

**Paramètres de pagination** : `?page=1&limit=10`  
**Filtres** : `?name=Alice`, `?email=alice@`, `?title=Math`, `?teacher=Smith`

## 💡 Exemples

```bash
# Créer un étudiant
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'

# Lister avec pagination
curl "http://localhost:3000/students?page=1&limit=2"

# Inscrire à un cours
curl -X POST http://localhost:3000/courses/1/students/1
```

## 📐 Règles métier

- ✅ Email étudiant unique
- ✅ Titre de cours unique
- ✅ Maximum 3 étudiants par cours
- ✅ Suppression protégée des étudiants inscrits
- ✅ Suppression en cascade des cours

## 🧪 Tests

```bash
npm test                # Tous les tests
npm run test:coverage   # Avec couverture
npm run test:watch      # Mode watch
```

**Couverture actuelle** : 56 tests (20 unitaires + 32 intégration) - ~100%

## 🛠️ Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur avec rechargement auto |
| `npm start` | Serveur production |
| `npm test` | Lancer les tests |
| `npm run lint` | Vérifier le code |
| `npm run format` | Formater le code |

## 💾 Données de test

Au démarrage, 3 étudiants et 3 cours sont pré-chargés :

**Étudiants** : Alice, Bob, Charlie  
**Cours** : Math (Mr. Smith), Physics (Dr. Brown), History (Ms. Clark)

⚠️ **Stockage en mémoire** : Les données sont réinitialisées à chaque redémarrage.

## 🔧 Outils de qualité

- **ESLint** : Style Airbnb
- **Prettier** : Formatage automatique
- **Jest** : Tests et couverture
- **GitHub Actions** : CI/CD automatique
- **Codacy** : Analyse statique

## 🤝 Contribution

```bash
# 1. Créer une branche
git checkout -b feat/ma-fonctionnalite

# 2. Développer et tester
npm run lint
npm test

# 3. Commit (convention)
git commit -m "feat: description"

# 4. Push et PR
git push origin feat/ma-fonctionnalite
```

**Convention de commits** : `feat:`, `fix:`, `test:`, `docs:`, `refactor:`

## 🚨 Dépannage

**Port 3000 occupé** : `PORT=4000 npm run dev`  
**Module manquant** : `rm -rf node_modules && npm install`  
**Tests échouent** : `npm test -- --clearCache`

## 📚 Ressources

- [Express.js](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [Swagger](https://swagger.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)