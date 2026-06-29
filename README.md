# Cycle Maxxing

---

Le **Data Fabric** est un squelette documentaire qui s'articule autour de 3 piliers :
le **backlog** (`docs/06-backlog.md`), le **journal des décisions**
(`docs/07-decisions-log.md`) et les **sessions** (`todo/`, `zarchives/`)

| Pilier | Chemin | Rôle |
|--------|--------|------|
| Backlog | `docs/06-backlog.md` | Ce qu'on va faire, priorisé et daté |
| Décisions | `docs/07-decisions-log.md` | Pourquoi on l'a fait (ADR) |
| Documentation | `docs/` | Vision, science du cycle, features UX, design system, modèle de données |
| Sessions | `todo/` · `zarchives/` | Travail en cours et passé |
| Règles d'exécution | `CLAUDE.md` | Instructions pour les agents |

---

Dashboard web personnel pour suivre et comprendre le cycle menstruel de Julie.

## Vision

| Version | Utilisateur | Objectif |
|---|---|---|
| v1 | Remy (partenaire) | Phase actuelle · stats du jour · conseils quotidiens |
| v2 | Julie | Interface partagée · pédagogie · alimentation · sport |
| v3 | Les deux | Contenus médicaux validés · profils spécifiques |

## Stack

```
Next.js 16 App Router · TypeScript strict · Tailwind CSS · shadcn/ui · Vercel
localStorage (v1) → Supabase (v2) · pnpm
```

## Structure

```
cycle-maxxing/
├── README.md
├── docs/
│   ├── 01-vision.md           vision, personas, roadmap
│   ├── 02-cycle-science.md    biologie des 4 phases, hormones
│   ├── 03-ux-features.md      fonctionnalités détaillées par vue
│   └── 04-design-system.md    palette lilas/sunset, tokens, composants
├── data/
│   ├── julie-cycles.md        historique cycles réels extraits de Flo
│   └── phase-reference.md     stats complètes par phase et sous-phase
├── prompts/
│   ├── deepseek-main.md       prompt complet pour génération app
│   └── hermes-context.md      contexte injecté dans Hermes Agent
└── app-brief/
    └── session-21jun2026.md   brief complet de la session de travail
```

## Données Julie (état au 21 juin 2026)

```
derniere_regle   : 2026-05-31
duree_cycle      : 27 jours  (moyenne 2 cycles confirmés)
duree_regles     : 4 jours
jour_actuel      : j22 — début SPM
fiabilite        : variable  (cible : 6 cycles)
```

## Prochaine étape

Lancer le prototype avec `/prompts/deepseek-main.md` dans Hermes.
Commencer par `lib/types.ts` → `lib/phase-data.ts` → `lib/cycle.ts`.
