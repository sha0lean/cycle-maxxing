# 00 — INDEX

> **rôle** : point d'entrée unique de toute la documentation du projet.
> **contient** : carte de navigation, responsabilité de chaque doc, ordre de lecture recommandé.
> **vital parce que** : sans index, les docs deviennent un dépotoir. Cet index définit la structure vivante du projet.
> **à lire avant de** : créer un nouveau fichier, chercher une info, onboarder quelqu'un.

---

## Projet

**Cycle Maxxing** — dashboard personnel pour Remy, partenaire de Julie.

Suit le cycle menstruel de Julie pour que Remy soit présent, informé, et utile à chaque moment du cycle.

Stack : Next.js 16 · TypeScript strict · Tailwind · shadcn/ui · Vercel · pnpm
Données : localStorage v1 → Supabase v2

---

## Navigation

| # | Fichier | Rôle | Lire quand |
|---|---|---|---|
| 00 | [00-index.md](00-index.md) | Ce fichier — navigation globale | Toujours en premier |
| 01 | [01-vision.md](01-vision.md) | Vision, personas, roadmap | Avant toute décision de scope |
| 02 | [02-cycle-science.md](02-cycle-science.md) | Biologie du cycle, hormones, Flo | Avant d'enrichir le contenu |
| 03 | [03-ux-features.md](03-ux-features.md) | Fonctionnalités UX par vue | Avant de coder une vue |
| 04 | [04-design-system.md](04-design-system.md) | Palette, tokens, composants | Avant tout travail UI |
| 05 | [05-data-model.md](05-data-model.md) | Architecture des données (deux couches) | Avant d'ajouter un domaine ou de toucher aux données |
| 06 | [06-backlog.md](06-backlog.md) | Features confirmées + idées non qualifiées | Pour décider quoi faire ensuite |
| 07 | [07-decisions-log.md](07-decisions-log.md) | Log des décisions architecturales D_XXX | Quand on se demande "pourquoi on a fait ça ?" |

---

## Données

| Fichier | Contenu |
|---|---|
| [/data/phase-reference.md](../data/phase-reference.md) | Métriques quantitatives par sous-phase (8 indicateurs sur 100) — source stable |
| [/data/julie-cycles.md](../data/julie-cycles.md) | Historique cycles réels de Julie |
| [/data/domains/](../data/domains/) | Un `.md` par domaine qualitatif (sport, nutrition, sommeil, intimité…) |

---

## Glossaire

→ [CONTEXT.md](../CONTEXT.md)

---

## État du projet

| Phase | Statut |
|---|---|
| Documentation | En cours — session 24 juin 2026 |
| Prototype HTML | Généré en session 21 juin 2026 |
| MVP Next.js | Non démarré |
| Données domaines | À créer (8 domaines identifiés) |
| Supabase / auth | v2 |
