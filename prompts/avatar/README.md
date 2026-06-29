# Système d'avatars

Générer des avatars anime **cohérents**, déclinés en sprites (états / émotions) qui s'empilent pour l'animation.
Système épuré : **2 fichiers par perso** + un kit partagé. La génération d'images se fait **hors-repo** (ChatGPT).

## Frontière (la règle qui évite l'usine à gaz)

| Type de changement | Exemple | Où ça se passe |
|---|---|---|
| **Éphémère** (un seul shot) | « cambre plus », « tourne la tête » | **Direct dans ChatGPT**. On ne touche pas au repo. |
| **Canonique** (constant partout) | casquette rouge, couleur de cheveux, tenue | Tu le dis à Claude → il édite `bible.json` + recompile `setup.md` → tu re-uploades |

## Arborescence

```
avatar/
├── _system/
│   └── kit.json            ← style + cadrage + negatives partagés (réglé une fois, jamais ouvert)
├── _template/
│   └── bible.template.json ← squelette pour un nouveau perso
├── characters/
│   ├── julie/
│   │   ├── bible.json      ← surface d'édition de Claude (identité + états en delta)
│   │   ├── setup.md        ← LE fichier que tu uploades dans ChatGPT (tout-en-un)
│   │   └── animation.md    ← comportements d'anim CSS (côté app, plus tard)
│   └── remy/               ← toi (Easter egg, à remplir)
│       ├── bible.json
│       └── setup.md
└── README.md
```

- `bible.json` = **source** structurée (Claude l'édite quand tu parles).
- `setup.md` = **sortie compilée** : master prompt + negative + identité figée + alignement + table des états.
  C'est le **seul** fichier qui part dans ChatGPT.
- Les **états sont des deltas** : ils ne répètent jamais l'identité (portée par l'image master).

## Playbook (de la photo stylée aux sprites)

**Claude Code (le système)** — tu parles, Claude édite + compile :
0. Tu montres une **photo stylée** à Claude → il en extrait le style dans `kit.json` (conversation, pas de rituel).
1. Tu décris **ta meuf** (ou une photo d'elle) → Claude écrit `bible.json` avec tes overrides → compile `setup.md`.

**ChatGPT (la génération)** — 1 upload + prompts courts :
2. Nouveau Projet ChatGPT, tu uploades `setup.md`.
3. *« génère l'image master »* → tu valides le cadrage à l'œil (pieds visibles ?), tu régénères si besoin.
   ✅ Cette image = ton **gabarit fixe**.
4. *« état endolorie »*, *« état à cran »*… → prompts d'une ligne, le master sert de référence.
5. Pose qui te déplaît ? → tu corriges **direct dans ChatGPT**. Le repo ne bouge pas.

**Ensuite (app)** :
6. Tu détoures (fond transparent), tu intègres dans l'app gamifiée.
7. Changement canonique plus tard → tu le dis à Claude → recompile → re-upload → régénère les sprites concernés.

## Démarrer un nouveau perso (toi, ou autre)

1. `cp _template/bible.template.json characters/<nom>/bible.json`
2. Décris l'identité à Claude → il remplit + compile `setup.md`.
3. Upload, master, sprites. Même boucle.

## Porter dans un autre projet

Copie tout `prompts/avatar/`. Adapte **seulement** `_system/kit.json` (le thème) et crée tes persos dans `characters/`.
