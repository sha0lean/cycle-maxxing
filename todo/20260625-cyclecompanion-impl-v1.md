# Handoff — Cycle Maxxing · Implémentation v1

| Ouverture | 2026-06-25 | ~11:00 |
| Clôture | | |

---

## Ce qui a été fait en session

Session de grill + documentation complète. **Zéro code écrit** — tout est spécification.

### Docs créés / mis à jour

| Fichier | Statut | Contenu |
|---|---|---|
| `docs/00-index.md` | Nouveau | Index de navigation de toute la doc |
| `docs/01-vision.md` | Mis à jour | En-tête uniformisé |
| `docs/02-cycle-science.md` | Mis à jour | En-tête uniformisé |
| `docs/03-ux-features.md` | Mis à jour | Vue Frise spécifiée, Vue Patterns ajoutée, Navigation top bar, Settings enrichis |
| `docs/04-design-system.md` | Mis à jour | En-tête uniformisé |
| `docs/05-data-model.md` | Nouveau | Architecture deux couches, CycleEntry, DayLog, modèle hybride métriques |
| `docs/06-backlog.md` | Nouveau | B-001 à B-010 + idées [?] |
| `docs/07-decisions-log.md` | Nouveau | D_001 à D_004 |
| `CONTEXT.md` | Nouveau | Glossaire 14 termes |
| `data/julie-cycles.md` | Mis à jour | 2 cycles réels + 12 prédictions Flo extraites des screenshots |

### Décisions architecturales posées (D_001 à D_004)

Voir `docs/07-decisions-log.md` pour le détail complet.

- **D_001** : Fichiers `.md` par domaine dans `data/domains/`, parsés par `lib/domain-loader.ts`
- **D_002** : `phase-reference.md` = métriques quantitatives uniquement · `data/domains/` = conseils qualitatifs
- **D_003** : Deux boutons de saisie par cycle — "règles commencées" (j1) + "règles terminées" (rulesEndDate)
- **D_004** : Métriques hybrides — valeur référence (phase-reference.md) toujours présente + couche DayLog optionnelle

---

## État actuel du projet

### Stack confirmée
```
Next.js 15 App Router · TypeScript strict · Tailwind · shadcn/ui · Vercel · pnpm
localStorage v1 → Supabase v2
```

### Données Julie
- 2 cycles réels confirmés (mai-juin 2026), 4 jours de règles chacun
- Cycle moyen : ~25-27 jours (fiabilité variable — 2 cycles insuffisants)
- Aujourd'hui : j26 — SPM critique
- Prochaines règles prédites : ~26-27 juin 2026

### Ce qui n'existe pas encore
- L'app Next.js (zéro fichier de code)
- Les fichiers `data/domains/*.md` (8 domaines à créer)
- `lib/domain-loader.ts` (parser markdown → TypeScript)
- `lib/cycle.ts` (calculs de phase depuis j1)

---

## Architecture de données (résumé pour l'implémentation)

### Types TypeScript à créer en premier

```typescript
// lib/types.ts
type CycleEntry = {
  id: string
  j1: Date
  rulesEndDate: Date
  cycleEndDate?: Date
}

type DayLog = {
  cycleId: string
  dayNumber: number       // j(N) dans le cycle
  metrics: Partial<Metrics>
  loggedAt: Date
}

type Metrics = {
  energie: number         // 0-100
  humeur: number
  libido: number
  fatigue: number
  sensibilite: number
  stress: number
  douleurs: number
  irritabilite: number
}

type PhaseId = 'regles' | 'folliculaire' | 'ovulation' | 'luteale' | 'spm'
type UrgenceLevel = 'normal' | 'attention' | 'critique'

type DayInfo = {
  dayNumber: number
  phase: PhaseId
  subPhase: string        // ex: "j1-j2" | "j13"
  urgence: UrgenceLevel
  referenceMetrics: Metrics
  personalMetrics?: Partial<Metrics>  // moyenne des DayLogs pour ce j(N)
  displayMetrics: Metrics             // personal si dispo, sinon reference
}
```

### Schéma fichier domaine (data/domains/*.md)

```yaml
---
domain: intimite
label: Intimité
status: draft
coverage: 4/8
sources: faibles
enrichir: oui
---

## phase: spm  ← défaut phase entière
priorité: haute
conseil: Mode soutien. Aucune initiative non sollicitée.
faire: [être présent, câlins si demandés]
éviter: [initiatives physiques, discussions conflictuelles]

## j24-j27  ← override sous-phase
conseil: Soutien maximal. Aucune attente de retour.
faire: [+ bouillotte, + chocolat]
éviter: [+ tout sujet intime]
```

Résolution : jour précis > sous-phase > phase. `+` = ajout à la liste parent.

---

## Vues à implémenter (par priorité)

### Vue Frise (landing page — B-001 en partie)

```
┌─────────────────────────────────────────┐  2/5
│  8 métriques style jeu vidéo            │
│  Barre principale + marqueur référence  │
├─────────────────────────────────────────┤  3/5
│  Onglets domaines [Sport ●][Intimité ●] │
│  Contenu du domaine actif               │
├─────────────────────────────────────────┤
│  Frise phases (blocs colorés + flags)   │
│  Courbes hormones (LH/FSH/Œst/Progest)  │
│  Courbe BBT                             │
│  Curseur vertical synchronisé           │
└─────────────────────────────────────────┘
Nav top : [ Frise ] [ Calendrier ] [ Patterns ]
```

- Scrub horizontal → stats et conseils se mettent à jour en live
- Courbes hormones et BBT = formes statiques scientifiques, étirées à la durée du cycle
- Flags : j1, ovulation, j21 (SPM)

### Vue Calendrier (B-001)
Grille mensuelle, couleur par phase, clic → panel stats latéral. Voir `docs/03-ux-features.md`.

### Settings (B-004)
Deux boutons : "règles commencées aujourd'hui" + "règles terminées aujourd'hui". Voir D_003.

---

## Ordre d'implémentation recommandé

```
1. pnpm create next-app cycle-maxxing (Next.js 15, TypeScript, Tailwind, App Router)
2. lib/types.ts          → types TypeScript
3. lib/phase-data.ts     → import et parse de phase-reference.md
4. lib/cycle.ts          → calculs phase depuis j1 (getDayInfo, getCurrentPhase)
5. data/domains/*.md     → créer les 8 fichiers domaine (commencer par sport + intimité)
6. lib/domain-loader.ts  → parser les .md domaines (dépendance : gray-matter)
7. components/MetricsPanel → 8 jauges avec double indicateur (barre + marqueur ref)
8. components/DomainTabs  → onglets avec indicateur priorité
9. components/Frise       → timeline 3 couches + curseur scrub
10. app/page.tsx          → Vue Frise assemblée
11. app/calendrier/       → Vue Calendrier
12. components/Settings   → boutons j1 + rulesEndDate
```

---

## Commandes à lancer pour démarrer

```powershell
# Depuis c:\Users\shao\workspace\cycle_maxxing
pnpm create next-app app --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd app
pnpm add gray-matter
pnpm dlx shadcn@latest init
```

**Justification gray-matter** : seule dépendance non-native requise. Parse le frontmatter YAML des fichiers domaine. ~2KB, zéro dépendance transitive. (D_001)

---

## Context non évident pour le prochain agent

- **Les données Julie sont dans `data/` à la racine**, pas dans `app/`. Le domain-loader doit les lire depuis `process.cwd()` ou via `path.join`.
- **phase-reference.md est le référentiel quantitatif uniquement** — ne pas y ajouter des conseils qualitatifs (D_002).
- **Les courbes hormones/BBT sont statiques** — ce ne sont PAS les données personnelles de Julie. Ce sont des formes théoriques universelles étirées à la durée du cycle.
- **Dashboard collaboratif unique v1** — pas de distinction Remy/Julie dans les DayLogs (D_004). La distinction viendra en v2 avec le Mode Julie.
- **Cycles Julie** : 2 réels confirmés, cycle moyen ~27j utilisé comme référence, fiabilité variable.
- **Aujourd'hui** : j26 SPM critique — les règles du cycle 3 sont prévues dans ~1-2 jours.
- **Pas de onboarding** — l'app démarre directement sur le dashboard avec les données de julie-cycles.md pré-chargées en localStorage.

---

## Backlog de référence

Voir `docs/06-backlog.md` pour la liste complète B-001 à B-010.

**v1 scope :**
- B-001 Calendrier mensuel
- B-002 Vue Frise (ex-Gantt)
- B-003 Panel stats + domaines
- B-004 Settings (saisie j1 + fin règles)
- B-005 Vues récap hebdo/cycle
- B-006 Fiches domaines complètes (8 domaines)

---

## Skills suggérés pour la prochaine session

- Commencer par coder → lancer `/run` pour tester la Vue Frise dans le navigateur
- Pour les domaines : enrichir `data/domains/` manuellement (pas de skill dédié)
- Pour une review avant deploy : `/code-review`
- Pour tester visuellement : `/verify`
