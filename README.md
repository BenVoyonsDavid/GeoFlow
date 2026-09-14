# GeoFlow

GeoFlow est une plateforme de généalogie collaborative centrée sur les **sources**, les **preuves**, les **hypothèses**, les **enquêtes** et la **visualisation de l’histoire familiale dans le temps et l’espace**.

## Vision

GeoFlow ne considère pas une donnée généalogique comme vraie simplement parce qu’elle apparaît dans un arbre. Chaque fait peut être soutenu, contredit ou nuancé par plusieurs sources.

Principes de base :

- une information proposée n’est pas automatiquement un fait confirmé ;
- une source reste distincte de l’interprétation qu’on en fait ;
- l’IA peut transcrire, extraire, comparer et suggérer, mais elle n’est jamais une source ;
- les modifications collaboratives doivent être traçables ;
- l’utilisateur doit pouvoir exporter ses données et ses médias ;
- GeoFlow doit fonctionner sans dépendre d’un fournisseur externe unique.

## v0.1.0 — Fondation

Le premier flux fonctionnel permet maintenant de :

- créer un espace familial ;
- ajouter des personnes ;
- créer des liens père, mère, conjoint(e) et enfant ;
- consulter une fiche individuelle ;
- ajouter et associer des sources à une personne.

Le modèle de données couvre également :

- événements et lieux ;
- affirmations et preuves ;
- médias ;
- enquêtes et hypothèses ;
- collaboration.

## Architecture initiale

- Next.js 16
- React 19
- TypeScript
- PostgreSQL 18
- Prisma 7

## Démarrage local

### Prérequis

- Node.js 24 ou plus récent
- Docker Desktop, ou une installation locale de PostgreSQL 18

### 1. Démarrer PostgreSQL avec Docker

```bash
docker compose up -d
```

Le fichier `docker-compose.yml` crée une base locale `geoflow` sur le port `5432`.

### 2. Configurer l’environnement

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

Sous macOS/Linux :

```bash
cp .env.example .env
```

### 3. Installer les dépendances

```bash
npm install
```

Le client Prisma est généré automatiquement après l’installation.

### 4. Créer la première migration

```bash
npm run prisma:migrate -- --name init
```

### 5. Démarrer GeoFlow

```bash
npm run dev
```

Ouvrir ensuite `http://localhost:3000`.

## Intégrations

Les fournisseurs externes seront ajoutés derrière une couche de connecteurs. GeoFlow ne dépendra pas de FamilySearch pour fonctionner.

Voir `docs/integrations/familysearch.md` pour la stratégie FamilySearch.

## Validation continue

GitHub Actions valide automatiquement le schéma Prisma et compile l’application à chaque changement envoyé sur `main`.

## Statut

Projet en développement — v0.1.0.
