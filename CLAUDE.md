# CLAUDE.md — Cycle Maxxing

> Chargé automatiquement à chaque session. Complète le CLAUDE.md global.

## Projet

App Next.js 16 (App Router) de suivi de cycle menstruel pour Julie.
Dashboard collaboratif — Remy voit et gère, Julie est le sujet.

## Stack

```
Next.js 16 App Router · React 19 · TypeScript strict · Tailwind 4 · shadcn/ui · Recharts · pnpm
localStorage v1 → Supabase v2
gray-matter (parse frontmatter YAML des fichiers domaine)
```

⚠️ **Next 16, pas 15** : `create-next-app@latest` a installé Next 16. Breaking changes vs données
d'entraînement → lire `app/node_modules/next/dist/docs/` AVANT d'écrire du code Next (cf. `app/AGENTS.md`).

## Environnement pnpm (non évident)

- **pnpm est dans le PATH user** via un shim `C:\Users\shao\AppData\Local\pnpm-shim`
  (corepack ne pouvait pas écrire dans Program Files → EPERM). `pnpm` marche direct dans
  tout nouveau terminal. Fallback toujours valable : `corepack pnpm`.
- **Ne jamais `Set-Location app`** : le cwd PowerShell persiste et s'accumule entre appels.
  Utiliser le flag `-C C:\Users\shao\workspace\cycle_maxxing\app <cmd>`.
- **pnpm 11 build scripts** : approuver les deps natives via `allowBuilds:` (booléens) dans
  `app/pnpm-workspace.yaml`, PAS `onlyBuiltDependencies` (ancien format ignoré). Sinon `pnpm exec`
  échoue en exit 1 sur `ERR_PNPM_IGNORED_BUILDS`. sharp + unrs-resolver = `true`.

## Chemins clés

| Quoi | Où |
|---|---|
| App Next.js | `app/` |
| Types TypeScript | `app/lib/types.ts` |
| Calculs de phase | `app/lib/cycle.ts` |
| Données domaines | `data/domains/*.md` |
| Référentiel métriques | `data/phase-reference.md` |
| Données cycles Julie | `data/julie-cycles.md` |
| Backlog | `docs/06-backlog.md` |
| Décisions archi | `docs/07-decisions-log.md` |

## Boucle implement → run → verify

**Suivre cette séquence pour chaque item backlog :**

```
1. Lire l'item dans docs/06-backlog.md
2. Coder (TypeScript strict, zéro any, commentaires FR)
3. → Proposer /run   [après chaque composant ou vue assemblée]
4. → Proposer /verify [après que /run confirme le rendu visuel]
5. Commit feat: B-NNN titre-court
6. Marquer [x] dans docs/06-backlog.md
```

**Règle de déclenchement :**
- Après avoir codé un composant autonome ou assemblé une vue → proposer `/run` sans attendre que l'utilisateur le demande.
- Après que `/run` confirme que le rendu est correct → proposer `/verify` sans attendre.
- Ne pas enchaîner les deux sans confirmation visuelle intermédiaire.

## Règles projet

- **Pas de onboarding** : l'app démarre directement sur le dashboard, données Julie pré-chargées depuis `data/julie-cycles.md` en localStorage.
- **Courbes hormones/BBT** : formes statiques scientifiques universelles, PAS les données personnelles de Julie.
- **domain-loader** lit depuis `process.cwd()` (côté serveur Next.js uniquement).
- **phase-reference.md** = métriques quantitatives uniquement. Zéro conseil qualitatif dedans.
- Résolution domaine : jour précis > sous-phase > phase.

## Commandes utiles

Préfixe systématique `corepack pnpm -C <app-abs>` (cf. section pnpm plus haut) :

```powershell
$app = "C:\Users\shao\workspace\cycle_maxxing\app"
corepack pnpm -C $app dev           # dev server (Turbopack, :3000)
corepack pnpm -C $app exec tsc --noEmit  # typecheck
```

### Ajouter un composant shadcn

shadcn appelle `pnpm` EN DUR → il faut le shim dans le PATH de la commande
(corepack seul ne suffit pas). Pattern, tout en une commande :

```powershell
$shim="C:\Users\shao\AppData\Local\pnpm-shim"; $env:Path="$shim;$env:Path"
pnpm dlx shadcn@latest add button card dialog --cwd C:\Users\shao\workspace\cycle_maxxing\app
```

⚠️ shadcn 5.x : `-b` = système de couleurs (`radix|base`), PAS la grayscale.
Lancer en background + piper `y` si prompt d'overwrite. base UI = `@base-ui/react` (pas radix).
