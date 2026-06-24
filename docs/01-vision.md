# 01 — VISION & OBJECTIFS

> **rôle** : vision et mission du produit — pourquoi cette app existe.
> **contient** : problème résolu, solution, personas, roadmap, principe de mise à jour.
> **vital parce que** : toute décision de scope doit être alignée avec cette vision.
> **à lire avant de** : spécifier une nouvelle fonctionnalité ou remettre en cause le périmètre.

## Problème

Le cycle menstruel a 4 phases aux comportements émotionnels et physiques très distincts.
Sans information, le partenaire subit les variations sans contexte.
La femme manque souvent de support adapté à chaque moment de son cycle.

## Solution

Un dashboard web personnel qui :
- Calcule la phase actuelle depuis la dernière date de règles
- Affiche les stats du jour (8 métriques)
- Donne des conseils concrets au partenaire pour chaque jour
- Fournit des recommandations alimentation et sport par phase
- Permet de cliquer sur n'importe quel jour pour voir ses stats

## Personas

### Remy — partenaire (v1)
- Veut comprendre sans avoir à demander
- Veut anticiper les périodes difficiles (SPM, règles)
- Veut des conseils actionnables quotidiens
- Usage : dashboard Vercel, consultation quotidienne matin

### Julie — la femme suivie (v2)
- Paysagiste, région PACA / Méditerranée
- Utilise Flo pour tracker son cycle
- Veut comprendre ce qui se passe dans son corps
- Accès : vue partagée en lecture, mobile-first

## Roadmap

| Étape | Durée estimée | Livrable |
|---|---|---|
| 1. Prototype HTML | 3-4h | Validation UX calendrier + fiche |
| 2. MVP Next.js | 1 weekend | App Vercel déployée |
| 3. Fiches complètes | 1 weekend | Toutes données par phase |
| 4. Notifications push | 1 soir | Alertes SPM / ovulation |
| 5. Mode Julie | 1 weekend | Interface pédagogique |
| 6. Supabase + auth | 1 weekend | Sync multi-device |
| 7. Contenus v3 | Ongoing | Modules professionnels |

## Principe de mise à jour

- Saisir le j1 de chaque nouveau cycle → recalcul automatique
- Modèle glissant sur les 6 derniers cycles
- Fiabilité affichée en temps réel (écart-type)
- Outliers détectés et sous-pondérés (coefficient 0.5)
