# Handoff — Cycle Maxxing · Couche domaines (D_002) + 4 features

| Ouverture | 2026-06-25 | ~02:00 |
| Clôture | 2026-06-25 | ~03:10 |

> Session qui a consommé `todo/20260625-impl-foundation.md`. Part de l'app fondation (jour courant +
> jauges) → migration complète de la couche qualitative + Frise interactive. **11 commits sur `master`**
> (de `14daf2e` à `23d8794`, cf. `git log`).

---

## État actuel

### Fait (voir `git log`, ne pas reparcourir le diff)
- **Migration D_002 terminée** : tout le qualitatif est sorti de `data/phase-reference.md` (désormais
  100% quantitatif : métriques chiffrées · keywords · résumé · urgence · `social:`). 6 domaines créés
  dans `data/domains/` : sport, nutrition, communication, activites, sante, intimite.
- **Infra domaines (B-006 partiel)** : `scripts/gen-data.mts` parse les `domains/*.md` via `gray-matter`
  → `app/lib/generated/domains.ts`. `lib/domain-loader.ts` résout le jour (plage la plus spécifique,
  clamp aux bords seulement, trou interne → null). `components/DomainTabs.tsx` affiche les onglets.
- **Settings (B-004 ✅)** : `components/Settings.tsx` (section repliable) — boutons début/fin règles,
  historique, moyennes. `lib/cycle-stats.ts` (durées + moyennes, testé).
- **Saisie métriques (B-003 partiel, D_004)** : mode édition sliders dans `MetricsPanel.tsx`, n'enregistre
  que les métriques touchées. `CycleApp.tsx` persiste les DayLogs (avant : jamais persistés).
- **Frise (B-002 ✅)** : `components/Timeline.tsx` (recharts) + `components/Frise.tsx` (orchestration
  scrub). `lib/reference-curves.ts` = courbes hormones/BBT de référence. `getPhaseSpans()` dans `cycle.ts`.
- **46 tests** passent. `tsc --noEmit` clean.

### Reste à faire (ordre de valeur)
1. **B-001 Calendrier** — grille mensuelle, clic sur un jour → panel. Débloque le « clic sur un jour »
   de B-003 (qui reste 🟡 sans lui).
2. **Nav haute** (Frise / Calendrier / Patterns) — cf. `docs/03-ux-features.md` §Navigation. Pas encore
   construite : la Frise est la vue unique pour l'instant.
3. **B-005 Récap hebdo** + **Vue Patterns** (`docs/03` détaille les 2 modes Moyenne/Comparaison).
4. **Polish UI Frise** : 6 onglets domaines + chart deviennent denses sur un `max-w-3xl`.
5. **Enrichir** : domaines `sante`/`intimite` en `status: draft` (à relire), `sommeil`/`mental` vides
   (aucune matière source → `ingest-source` ou input Remy).

Backlog : `docs/06-backlog.md` (B-002/B-004 cochés). Domaines : table à jour dans `docs/05-data-model.md`.

---

## Décisions de session (déjà reflétées dans le code/docs)
- **Démêlage du bloc relationnel** : les `faire/éviter/conseil` génériques de phase-reference n'étaient pas
  des champs propres (contrairement à sport/nutrition) → répartis à la main entre communication / activites /
  sante / intimite. `social:` laissé dans phase-reference (descripteur d'ambiance, pas un conseil — candidat
  future jauge « batterie sociale »).
- **Courbes hormones/BBT** : formes universelles encodées dans `lib/reference-curves.ts`, PAS les données de
  Julie (règle CLAUDE.md). Normalisées 0-100. À affiner si besoin scientifique.
- **État lifté** : `CycleApp` porte cycles+logs, persistance explicite dans les handlers (pas d'effet → pas
  de save parasite au montage). Frise/Settings reçoivent données + callbacks.
- **Édition métriques** cible le jour **fixé** (selectedDay), pas le hover.
- Pas de nouvelle entrée D_XXX jugée nécessaire (décisions réversibles / non surprenantes).

---

## Contexte non évident (critique pour le prochain agent)
- **recharts v3.9** : `var()` n'est PAS résolu dans les attributs SVG → `Timeline.tsx` lit les CSS-vars
  calculées au montage (`getComputedStyle`) et passe des couleurs concrètes. Tout nouveau usage de couleur
  de thème dans un graphe doit faire pareil. Le scrub marche via `onMouseMove/onClick` → `activeLabel`.
- **Tout est client-side** : `CycleApp` lit localStorage en effet → SSR montre « Chargement… ». `curl` ne
  verra jamais le rendu réel (Frise, jauges). Vérification visuelle = navigateur uniquement.
- **`chromium-cli` absent** sur cette machine → pas de pilotage headless du navigateur. `/run` se limite à
  un smoke HTTP + lecture des logs ; le `/verify` interactif (scrub, clics, sliders) est délégué à Remy.
- **Reset état Julie** : si les boutons Settings / l'édition ont modifié le localStorage, vider via DevTools
  → Application → Local Storage → clear → l'app re-seed (`ensureSeeded`) depuis `lib/seed.ts`.
- **pnpm / Next 16** : voir `CLAUDE.md` (shim PATH, flag `-C <abs>`, `allowBuilds:`, Next 16 async params).

### Fichiers non commités à l'ouverture (PAS de cette session)
- `CONTEXT.md` et `.claude/skills/ingest-source/SKILL.md` ont des modifs **antérieures, pas de moi** —
  laissées intactes tout du long. **À traiter par Remy** (commit, revert ou poursuite).
- `todo/20260625-impl-foundation.md` (handoff précédent, consommé par cette session) — peut être archivé.

---

## Commandes exactes
```powershell
$app = "C:\Users\shao\workspace\cycle_maxxing\app"
corepack pnpm -C $app dev                 # dev server (Turbopack, :3000) — relance gen:data
corepack pnpm -C $app exec tsc --noEmit   # typecheck
corepack pnpm -C $app run test            # 46 tests (relance gen:data via pretest)
corepack pnpm -C $app run gen:data        # régénère lib/generated/ depuis data/
```
> Dev server de la session **coupé** à la clôture. Le relancer au besoin.

---

## Étapes en attente — prochaine session (B-001 Calendrier suggéré)
1. `components/Calendar.tsx` — grille 7 colonnes (L→D), fond coloré par phase (réutiliser `PHASE_COLOR_VAR`
   + `findReferenceEntry`/`getCurrentPhase`), numéro j(N), ring sur aujourd'hui, opacity réduite + dashed
   sur les jours prédits. Cf. `docs/03-ux-features.md` §Vue Calendrier.
2. Clic sur un jour → ouvrir le panel stats de ce jour (réutiliser `Dashboard`/`MetricsPanel`+`DomainTabs`
   pilotés par un `selectedDay`, comme la Frise).
3. **Nav haute** pour basculer Frise ↔ Calendrier (puis Patterns) — `docs/03` §Navigation. Lifter `selectedDay`
   au niveau `CycleApp` si on veut le partager entre vues.
4. `corepack pnpm -C $app run test` + `/run` (smoke) + `/verify` (Remy, navigateur).

---

## Skills suggérés pour reprendre
- **`/implement B-001`** (Calendrier) — l'item le plus débloquant.
- **`/run`** après chaque composant UI assemblé (smoke HTTP, puis Remy valide visuellement).
- **`/verify`** pour les interactions (clic jour calendrier, nav).
- **`/ingest-source <url>`** pour enrichir phase-reference / créer matière `sommeil`/`mental`.
- **`/frontend-design`** pour le polish UI quand la Frise + onglets deviennent denses.
