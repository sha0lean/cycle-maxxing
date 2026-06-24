# Contribuer au repo

## Mise à jour des cycles Julie

Après chaque nouveau cycle confirmé :
1. Ouvrir `/data/julie-cycles.md`
2. Remplir la prochaine ligne vide avec : j1 · durée règles · durée cycle calculée
3. Recalculer la moyenne glissante sur les 6 derniers cycles
4. Mettre à jour le champ `duree_cycle` dans tous les fichiers de paramètres
5. Committer : `git commit -m "data: cycle #N — j1 YYYY-MM-DD · durée Xj"`

## Convention de commits

```
data: mise à jour cycle #N
docs: [nom du doc] — [modification]
feat: [nouvelle fonctionnalité]
fix: [correction]
prompt: mise à jour prompt [hermes/deepseek]
```
