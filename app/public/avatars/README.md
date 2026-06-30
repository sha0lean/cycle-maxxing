# Avatars de Julie

Dépose ici les PNG détourés (fond transparent). Le code les branche automatiquement.

## Nommage (obligatoire)

Un fichier par état, exactement ces 10 noms (ids de `lib/avatar.ts`), en `.webp` (alpha) :

```
julie-endolorie.webp       j1-2    Endolorie
julie-encore-tendre.webp   j3-4    Encore tendre
julie-eveil.webp           j5-7    Éveil
julie-petillante.webp      j8-11   Pétillante
julie-confiante.webp       j12     Confiante
julie-seductrice.webp      j13-14  Séductrice
julie-apaisee.webp         j15-17  Apaisée
julie-melancolique.webp    j18-20  Mélancolique
julie-a-cran.webp          j21-23  À cran
julie-a-fleur-de-peau.webp j24-27  À fleur de peau
```

`julie-master.webp` (optionnel) = l'image de référence neutre, gardée pour traçabilité. Pas affichée par l'app.

## Comment ça s'affiche

- Le **jour du cycle** choisit l'état (`dayToAvatarState`).
- Tant qu'un PNG manque, l'avatar retombe sur l'**emoji** de l'état (aucune image cassée).
- Dépose le bon fichier → il apparaît au prochain rechargement, sans toucher au code.
