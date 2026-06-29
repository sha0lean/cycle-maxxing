# ▶️ REPRENDRE — création d'avatar

> Note de reprise. Le système est posé et commité (`6da8967`). Playbook complet : [README.md](README.md).

## Où on en est

- ✅ Système épuré en place : `_system/kit.json` (style/cadrage/negatives partagés) + 2 fichiers par perso.
- ✅ **Julie** : `bible.json` à jour + `setup.md` compilé, prêt à uploader. Aucune image encore générée.
- 🟡 **Remy** : `bible.json` en placeholders (`TODO`), `setup.md` pas encore compilé.
- ❌ Aucun sprite généré, aucune intégration app.

## Reprendre — 3 entrées possibles

| Tu veux… | Tu me dis… | Ce que je fais |
|---|---|---|
| **Générer Julie** | « on génère Julie » | Je te rappelle les 3 prompts à coller dans ChatGPT (master → valider → états) |
| **Créer ton avatar** | « remplis Remy : [ta description] » | J'édite `characters/remy/bible.json` puis je compile son `setup.md` |
| **Changer un détail canonique** | « Julie : [le changement] » | J'édite `bible.json` + recompile `setup.md`, tu re-uploades |

## Le geste concret dans ChatGPT (rappel)

1. Nouveau Projet → uploade `characters/julie/setup.md`.
2. *« génère l'image master »* → valide le cadrage (pieds visibles ?) → régénère si besoin. = **gabarit fixe**.
3. *« état endolorie »*, *« état à cran »*… → 1 ligne par sprite.
4. Pose ratée ? → corrige **direct dans ChatGPT** (ne touche pas au repo).

## Règle d'or à ne pas oublier

> **Éphémère** (pose d'un shot) = ChatGPT direct, jamais le repo.
> **Canonique** (identité constante) = tu me parles, je recompile `setup.md`.

## Fichiers clés

- [README.md](README.md) — playbook complet
- [characters/julie/setup.md](characters/julie/setup.md) — à uploader
- [characters/julie/bible.json](characters/julie/bible.json) — surface d'édition (la mienne)
- [characters/julie/animation.md](characters/julie/animation.md) — anims CSS (étape app, plus tard)
- `docs/07-decisions-log.md` → **D_008** — pourquoi ce système
