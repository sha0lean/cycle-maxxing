# Handoff — Cycle Maxxing · Implémentation fondation + première vue

| Ouverture | 2026-06-25 | ~01:00 |
| Clôture | 2026-06-25 | ~01:45 |

> Session d'implémentation qui a consommé le handoff de spec `todo/20260625-cyclecompanion-impl-v1.md`.
> Part de zéro code → app Next.js qui tourne avec première vue fonctionnelle. **10 commits sur `master`.**

---

## État actuel

### Fait (voir `git log`, ne pas reparcourir le diff)
- **Init complète** : Next 16.2.9, React 19, Tailwind 4, shadcn/ui, recharts, gray-matter, Vitest. Dans `app/`.
- **Couche logique testée (31 tests)** : `lib/types.ts`, `lib/cycle.ts`, `lib/cycle-actions.ts`, `lib/storage.ts`, `lib/seed.ts`.
- **Codegen** : `scripts/gen-data.mts` parse `data/phase-reference.md` → `app/lib/generated/phase-reference.ts` (12 sous-phases). Auto via `predev`/`prebuild`/`pretest`.
- **Première vue** : `components/Dashboard.tsx` (client) + `components/MetricsPanel.tsx` + thème lilas/sunset dans `app/app/globals.css` + `lib/labels.ts`. Affiche le jour courant de Julie (j26 SPM critique au 25 juin).
- **Décisions** : D_006 (codegen) ajoutée à `docs/07-decisions-log.md`. `rulesEndDate` rendu optionnel (code + `docs/05`).

### Reste à faire (ordre de valeur recommandé)
1. **Domaines + DomainTabs** (prochaine étape proposée) — conseils par phase, cœur utile de l'app.
2. **Settings** — boutons j1 / fin règles (branche `cycle-actions` déjà codé+testé) + saisie métriques.
3. **Frise** (pièce maîtresse) — recharts, 3 couches synchronisées, scrub.
4. **Vue Calendrier** + Vue Patterns.

Backlog complet : `docs/06-backlog.md` (B-001..B-010).

---

## Contexte NON évident (critique pour le prochain agent)

### Environnement pnpm (déjà dans `CLAUDE.md`, mais vital)
- **pnpm n'est PAS installable globalement** (EPERM Program Files). Un shim a été posé dans `C:\Users\shao\AppData\Local\pnpm-shim` et ajouté au **PATH user** → `pnpm` marche dans tout nouveau terminal. Fallback : `corepack pnpm`.
- **Toujours `-C <chemin absolu>`**, jamais `Set-Location app` (le cwd PowerShell s'accumule entre appels).
- **pnpm 11 build scripts** : `allowBuilds:` (booléens) dans `app/pnpm-workspace.yaml`, PAS `onlyBuiltDependencies`.

### Next 16 / outils (breaking changes vs données d'entraînement)
- `app/AGENTS.md` dit de lire `node_modules/next/dist/docs/` → **ce dossier n'existe pas** (template générique). Source de vérité = le code généré réel + web.
- Next 16 : `params`/`searchParams`/`cookies()`/`headers()` sont **async** (Promise). `middleware`→`proxy.ts`. Caching opt-in (`use cache`). Turbopack par défaut. Non bloquant tant qu'on ne fait pas de pages à params.
- **shadcn 5.x** : flag `-b` = système de couleurs (`radix|base`), pas la grayscale. Base UI = `@base-ui/react` (pas radix). Pattern `shadcn add` documenté dans `CLAUDE.md`.

### Architecture données (D_006)
- `data/*.md` = source éditoriale. `ingest-source` (skill de Remy) édite `phase-reference.md` en continu.
- `app/lib/generated/` est **committé mais jamais édité à la main**. **Risque vécu** : le generated peut être committé désync si on commit sans lancer dev/build/test entre-temps. Atténué par `predev`/`prebuild`/`pretest`. Si doute → `pnpm gen:data` avant commit.
- Tests **découplés des valeurs** de données (lisent `PHASE_REFERENCE` dynamiquement) car les chiffres bougent via ingestion.

### App
- **Dashboard est client-side** : lit localStorage en `useEffect` → le HTML SSR montre "Chargement…", le vrai rendu apparaît après hydratation. Une requête `curl` ne verra pas les stats.
- **Seed** : `lib/seed.ts` = 2 cycles réels de Julie. Injecté si store vide (`ensureSeeded`). Pas d'onboarding.
- **Courbes hormones/BBT** (à venir, Frise) = formes statiques universelles, PAS les données de Julie.

---

## Commandes exactes

```powershell
$app = "C:\Users\shao\workspace\cycle_maxxing\app"
corepack pnpm -C $app dev                 # dev server (Turbopack, :3000) — relance gen:data
corepack pnpm -C $app exec tsc --noEmit   # typecheck
corepack pnpm -C $app run test            # 31 tests (relance gen:data via pretest)
corepack pnpm -C $app run gen:data        # régénère lib/generated/ depuis data/

# Ajouter un composant shadcn (shadcn appelle pnpm en dur → shim requis dans le PATH) :
$shim="C:\Users\shao\AppData\Local\pnpm-shim"; $env:Path="$shim;$env:Path"
pnpm dlx shadcn@latest add card dialog --cwd C:\Users\shao\workspace\cycle_maxxing\app
```

> **Dev server en cours** : un `next dev` tourne en background (task `bkz9u96qw`) sur :3000. Le tuer/relancer si besoin.

---

## Étapes en attente — prochaine session (domaines + DomainTabs)

1. **Créer `data/domains/sport.md` et `data/domains/intimite.md`** — schéma frontmatter dans `docs/05-data-model.md` (section "Couche 2"). Migrer le qualitatif sport/intimité depuis `phase-reference.md` (D_002 : ne pas dupliquer, déplacer).
2. **Étendre le codegen** : ajouter le parsing des `domains/*.md` dans `scripts/gen-data.mts` (utiliser `gray-matter` pour le frontmatter, parser les sections `## jX-jY`). Générer `app/lib/generated/domains.ts`. Résolution : jour précis > sous-phase > phase.
3. **`lib/domain-loader.ts`** : résoudre les conseils du j(N) courant depuis les données générées.
4. **`components/DomainTabs.tsx`** : onglets par domaine + contenu (faire / éviter / conseil) du jour.
5. Brancher dans `Dashboard.tsx` sous le `MetricsPanel`.
6. `corepack pnpm -C $app run test` + `/run` pour valider visuellement.

---

## Skills suggérés pour reprendre
- **`/implement B-003`** (Panel stats + domaines) ou **`/implement B-006`** (fiches domaines) — vérifier l'ID exact dans `docs/06-backlog.md`.
- **`/run`** après chaque composant UI assemblé (confirmation visuelle dans le navigateur).
- **`/verify`** pour les vues interactives à venir (Settings, scrub Frise).
- **`/ingest-source <url>`** (skill de Remy) pour enrichir `phase-reference.md` — pensera à régénérer via `gen:data`.
- **`/frontend-design`** si passe esthétique sur les jauges / la Frise.
