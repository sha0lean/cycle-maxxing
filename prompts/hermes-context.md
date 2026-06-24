# Contexte Hermes — Cycle Maxxing
# À injecter comme contexte système dans Hermes Agent

## Projet

Application web Cycle Maxxing — dashboard interactif de suivi du cycle menstruel.
Stack : Next.js 15 · TypeScript strict · Tailwind · shadcn/ui · Vercel · pnpm

## Données cycle actives

```
derniere_regle   : 2026-05-31
duree_cycle      : 27
duree_regles     : 4
```

## Formules de calcul

```
ovulation        = duree_cycle - 14  → j13
phase_1          = j1  → j(duree_regles)          → Règles
phase_2          = j(duree_regles+1) → j(ovul-2)  → Folliculaire
phase_3          = j(ovul-1) → j(ovul+1)           → Ovulation
phase_4a         = j(ovul+2) → j(duree_cycle-6)    → Lutéale
phase_4b         = j(duree_cycle-5) → j(duree_cycle) → SPM
```

## Sous-phases

Découper chaque phase en 3 tiers : début / milieu / fin
Les stats varient à chaque sous-phase (voir /data/phase-reference.md)

## Paramètres à afficher par jour

Au clic sur un jour du calendrier, afficher :
1. Numéro du jour (j1...j27)
2. Nom de la phase + sous-phase
3. 8 jauges : energie · humeur · libido · fatigue · sensibilite · stress · douleurs · irritabilite
4. Résumé émotionnel + keywords tags
5. Niveau urgence : normal / attention / critique
6. Toi — faire (liste verte)
7. Toi — éviter (liste rouge)
8. Conseil du jour
9. Nutrition : priorités · recommandé · éviter
10. Sport : intensité · recommandé · éviter

## Design

Thème pastel lilas / sunset — dark par défaut · light switchable

Couleurs de phase :
- ph1 Règles      : #F4A7B9 (dark) · #D4607A (light)
- ph2 Folliculaire : #B8D4F0 (dark) · #5B8AC4 (light)
- ph3 Ovulation   : #C5B3F5 (dark) · #8B6FD4 (light)
- ph4a Lutéale    : #F5C8A0 (dark) · #C47A30 (light)
- ph4b SPM        : #F0908A (dark) · #C44B42 (light)

## Vues à implémenter

1. Vue Calendrier — grille mensuelle interactive avec phases colorées
2. Vue Gantt — timeline horizontale du cycle complet
3. Panel stats du jour — slide-in au clic sur un jour
4. Settings — saisie j1 + gestion historique

## Ordre d'implémentation

lib/types.ts → lib/phase-data.ts → lib/cycle.ts → lib/storage.ts →
hooks/useCycleData.ts → composants UI → pages

## Référence données complètes

Voir /data/phase-reference.md pour toutes les valeurs par sous-phase.
