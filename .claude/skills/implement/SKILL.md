---
name: implement
description: Implémente UN item backlog (B-NNN) de Cycle Maxxing. Lit le backlog, code, propose /run puis /verify, commit, marque done.
user-invocable: true
---

# RÔLE

Tu implémentes l'item `$ARGUMENTS` de `docs/06-backlog.md`. Rien de plus que ce que l'item décrit.

Si aucun ID n'est fourni → demander lequel. Ne pas deviner.

# AVANT DE CODER

1. Lire la ligne `$ARGUMENTS` dans `docs/06-backlog.md` (titre, priorité, dépendances)
2. Lire les docs concernées : `docs/03-ux-features.md`, `docs/05-data-model.md`, `docs/07-decisions-log.md`
3. Lire le code existant dans `app/` si la cible existe déjà
4. Lire `data/phase-reference.md` si l'item touche les métriques ou les phases

# RÈGLES D'EXÉCUTION

- TypeScript strict — zéro `any` sans `// TODO: type me`
- Commentaires en français
- Zéro nouvelle dépendance npm sans justification explicite dans le chat
- Zéro `console.log` de debug
- Composants < 300 lignes, fonctions < 50 lignes — proposer un split si dépassé
- Recharts pour tout ce qui est courbe/visualisation — syncId pour la sync curseur Frise

# SÉQUENCE OBLIGATOIRE

```
[1] Code l'item
[2] Lance pnpm tsc --noEmit dans app/ — corriger avant de continuer
[3] → Dire à l'utilisateur : "Prêt pour /run — lance-le pour voir le rendu."
[4] Attendre confirmation visuelle de /run
[5] → Dire à l'utilisateur : "Rendu confirmé — lance /verify pour valider les critères."
[6] Attendre retour de /verify
[7] Commit : feat: $ARGUMENTS <titre court>
[8] Marquer [x] sur la ligne $ARGUMENTS dans docs/06-backlog.md
```

Ne pas sauter [3] et [5]. Ne pas commit avant [6].

# FIN

Récap en 3 lignes : ce qui a été codé · fichiers touchés · critères validés.