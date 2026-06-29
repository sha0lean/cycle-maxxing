# Handoff — Cycle Maxxing · Character-sheet, avatar PNJ & toggle de polices

| Ouverture | 2026-06-28 | (suite session UI) |
| Handoff   | 2026-06-29 | |
| Clôture   | | |

> Suite directe de [`todo/20260628-ui-polish-conseils-dossier.md`](20260628-ui-polish-conseils-dossier.md).
> Session **front/UI** : onglets Conseils, layout « character sheet », avatar émotionnel, toggle de polices global.
> Mémoires liées : `[[cyclemaxxing-ui-character-sheet]]`, `[[tailwind4-next16-font-vars]]` (dans `~/.claude/projects/.../memory/`).

---

## 🆕 Maj 2026-06-29 (soir) — Système de génération d'avatar (COMMITÉ)

> **Pivot d'approche.** L'ancienne piste « génération via API Gemini » (bloquée, free tier quota 0) est
> **abandonnée** au profit d'une génération **hors-repo dans ChatGPT**. Décision figée : **D_008** (`docs/07-decisions-log.md`).

- ✅ Système épuré commité (`6da8967`) dans `prompts/avatar/` : kit partagé + 2 fichiers/perso (`bible.json` source → `setup.md` compilé, le seul fichier uploadé dans ChatGPT). États = deltas.
- ✅ **Julie** prête : `characters/julie/setup.md` compilé, prêt à uploader. Aucune image générée encore.
- 🟡 **Remy** (Easter egg) : `bible.json` en `TODO`, `setup.md` non compilé.
- 📖 **Pour reprendre → lire [prompts/avatar/README.md](../prompts/avatar/README.md)** (playbook complet).

**Reprendre en une phrase à me dire :** « on génère Julie » · « remplis Remy : [desc] » · « Julie : [changement canonique] ».

**Règle d'or :** éphémère (pose d'un shot) = ChatGPT direct ; canonique (identité) = je recompile `setup.md`.

> ⚠️ La clé Gemini mentionnée plus bas (« Contexte non évident ») reste **à révoquer**. L'outillage `gen_avatar.py` du scratchpad n'est plus la voie active.

---

## État actuel

**Tout est codé, `tsc --noEmit` exit 0, vérifié au navigateur (Chrome MCP). RIEN n'est committé** — ni cette session, ni la passe UI précédente (cf. avertissement fins de ligne du handoff 20260628 : exclure `app/lib/generated/`).

### Fait cette session
1. **Onglets Conseils** (`app/components/DomainTabs.tsx`) — inactifs moins visibles (fill 40 %→28 %, texte /70→/55) ; **animation hover** (lift `-translate-y-1` + brightness + ombre, `origin-bottom`) ; **animation clic** (`active:scale-[0.96]`) ; `motion-reduce` safe.
2. **Layout character-sheet** (`app/components/Dashboard.tsx`) — 3 colonnes `lg:grid-cols-[4fr_5fr_3fr]` = Stats │ Conseils │ **Avatar** (à droite, demandé). `lg:items-stretch` → Conseils descend pleine hauteur (dossier en `flex-1`). Avatar 1er dans le DOM → en tête sur mobile.
3. **Avatar PNJ** (`app/components/CharacterAvatar.tsx`, NEW) — placeholder emoji, émotion ← bien-être du jour, aura ← couleur de phase. Animations `avatar-float`/`avatar-aura` dans `globals.css`.
4. **Score bien-être** (`app/lib/wellbeing.ts`, NEW) — `wellbeingScore` (négatives inversées : fatigue/sensibilite/stress/douleurs/irritabilite) + `scoreToMood` (5 paliers : radiant/serene/neutral/tender/ache).
5. **Toggle de polices** (`app/components/FontToggle.tsx`, NEW + branché dans `CycleNav.tsx`) — 3 thèmes (Éditorial Inter/Fraunces · Grotesk · Doux Nunito/Quicksand). 5 fontes chargées dans `app/app/layout.tsx`. **Persisté localStorage**, restauré sans flash par script inline. Validé par clic réel sur les 3.
6. **Jolis titres** — « Stats du jour », « Conseils du jour », « JULIE » en `font-display`.

### Reste à faire
- **Avatar : génération bloquée** (voir ci-dessous). Prompt + déclinaisons 5 émotions déjà fournis à l'utilisateur dans le chat ; specs aussi dans la mémoire `[[cyclemaxxing-ui-character-sheet]]`.
- Brancher les PNG quand dispo : remplacer le bloc emoji de `CharacterAvatar.tsx` par `<img src={`/avatars/julie-${mood.id}.png`} />`, fichiers dans `app/public/avatars/`.
- **Commit** (rien n'est committé — 2 sessions de travail en attente).
- Option utilisateur en suspens : avatar **SVG vectoriel maison** en attendant les PNG (proposé, pas tranché).
- Décider si on fait aussi une **variante 3D** plus tard (« full 2D d'abord » décidé).

---

## Décisions de session (non documentées ailleurs)

- **Avatar** : style 2D illustré inspiré d'une réf fournie (image-cache `...5.png`) MAIS Julie = **blonde, yeux bruns**, mêmes formes. Cadrage **trois-quarts** (cuisses→visage), **visage visible** (pas la pose selfie-téléphone, nécessaire pour porter l'émotion), **pas de tatouages**, **full 2D** d'abord.
- **Émotion ← bien-être du jour** (pas la phase) ; **aura ← phase**.
- **Contournement Tailwind v4 / Lightning CSS** (Next 16) pour le toggle de polices — détaillé dans `[[tailwind4-next16-font-vars]]`. Résumé : sélecteurs `[data-typo]` purgés du CSS + `--font-sans: var(--font-sans)` auto-référent. Solution = **variables inline** `--active-body`/`--active-title` posées sur `<html>` par FontToggle + script inline ; règles hors `@layer` avec fallback ; `suppressHydrationWarning` sur `<html>`.

---

## Contexte non évident

- **Serveur dev** : un ancien (session précédente) servait du CSS périmé → **tué (PID) et relancé** ; tourne en background sur **http://localhost:3000** (Turbopack). HMR du CSS demande parfois un hard reload (`ctrl+shift+r`) pour les changements de variables/`@theme`.
- **Génération avatar bloquée** : clé Gemini fournie par l'utilisateur en session (stockée hors-repo dans le scratchpad, **à révoquer** — passée en clair dans le chat, ne PAS la committer). Le compte est en **free tier → quota 0 sur TOUS les modèles image** (flash, pro, 3.1, imagen). La génération via l'API Gemini **exige le billing activé**. L'utilisateur va tester d'autres IA de son côté.
- **Outillage prêt** (scratchpad, hors-repo, réutilisable dès billing actif) : `gen_avatar.py` (google-genai installé), `prompt_master.txt`. Modèle visé : `gemini-2.5-flash-image` (≈0,04 $/img). `python` (pas `python3`) sur ce poste ; venv hermes-agent.

---

## Skills suggérés pour reprendre

- Reprise génération avatar : dès que billing actif → relancer `gen_avatar.py` (master puis 5 émotions avec le master en image de référence). Sinon `/design` pour réoutiller.
- Détourage PNG (fond uni → transparent) puis branchement dans `CharacterAvatar`.
- `/run` puis `/verify` pour valider le rendu.
- **Finir par un commit** (cf. avertissement fins de ligne du handoff 20260628 — `git checkout -- app/lib/generated/` avant de stager).
