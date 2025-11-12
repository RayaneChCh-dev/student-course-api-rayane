# Modèle de Pull Request

Merci pour votre contribution ! Remplissez ce modèle pour aider les relecteurs à comprendre rapidement le contenu et l'objectif de la PR.

## Type de changement

- [ ] Correction de bug
- [ ] Nouvelle fonctionnalité
- [ ] Refactor / nettoyage
- [ ] Tests
- [ ] Documentation

## Problème lié / ticket

Référencez l'issue ou le ticket si applicable (ex: #12)

## Description

Expliquez brièvement ce que change cette PR et pourquoi :

- Contexte / justification
- Comportement avant / après
- Points d'attention (migration, breaking changes, etc.)

## Comment tester localement

Indiquez les étapes claires pour reproduire ou vérifier les changements :

1. Installer les dépendances : `npm install`
2. Lancer la suite de tests : `npm test`
3. Lancer le serveur en mode dev : `npm run dev` et vérifier `/api-docs` si nécessaire

## Check-list avant merge

- [ ] J'ai lancé le linter : `npm run lint`
- [ ] J'ai lancé les tests : `npm test` (tous passent)
- [ ] J'ai mis à jour la documentation si nécessaire (README / Swagger)
- [ ] Mes commits sont bien expliqués et atomiques
- [ ] J'ai vérifié l'absence de secrets dans le diff

## Remarques / informations complémentaires

Ajoutez ici toute information utile : screenshots, payloads d'exemple, ou contraintes particulières.

--
Merci !
