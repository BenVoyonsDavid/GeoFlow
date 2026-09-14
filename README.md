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

La première version pose le modèle de données pour :

- utilisateurs et familles ;
- personnes ;
- relations ;
- événements ;
- lieux ;
- sources ;
- affirmations et preuves ;
- médias ;
- enquêtes et hypothèses ;
- collaboration.

## Architecture initiale

- Next.js 16
- React 19
- TypeScript
- PostgreSQL
- Prisma 7

## Intégrations

Les fournisseurs externes seront ajoutés derrière une couche de connecteurs. GeoFlow ne dépendra pas de FamilySearch pour fonctionner.

Voir `docs/integrations/familysearch.md` pour la stratégie FamilySearch.

## Statut

Projet en développement — v0.1.0.
