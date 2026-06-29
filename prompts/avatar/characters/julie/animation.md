# Animations — PARQUÉ (à traiter après les images statiques)

> Décidé pendant le grill : on génère d'abord les **10 images statiques** (un prompt par état dans `states/`).
> Les comportements d'animation ci-dessous se posent **par-dessus** plus tard (CSS/JS), **sans regénérer de PNG**.

## Principe

- Survol de la frise = on parcourt les jours du cycle → l'avatar **crossfade** entre keyframes voisines.
- Keyframes rapprochées (~2-3 jours) → le fondu lit comme un *morph d'attitude*, pas un swap.
- Boucle : état 10 → état 1 (larmes → douleur, deux états bas et proches) = scrub fluide dans les deux sens.

## Modèle hybride (phase × score)

- **Phase** choisit la keyframe (l'archétype).
- **Score de bien-être / métrique dominante** module *dans* la keyframe, en pur CSS/JS :
  - **intensité** : mauvais jour d'ovulation → glow/cambré atténués ; excellent jour → poussés.
  - **arbitrage sous-nuance** en zone SPM : irritabilité dominante → tire vers *À cran (09)* ; sensibilité dominante → tire vers *À fleur de peau (10)*.

## Micro-anims par état (paramètres CSS à moduler : float, tilt, scale, aura, opacité)

| État | Micro-anim |
|---|---|
| 01 Endolorie | flottement lent et bas, aura faible |
| 02 Encore tendre | flottement lent, aura douce qui remonte |
| 03 Éveil | flottement qui s'accélère |
| 04 Pétillante | flottement vif + léger rebond, aura lumineuse, sparkles qui scintillent |
| 05 Confiante | léger redressement, aura qui se réchauffe |
| 06 Séductrice | léger balancement (sway), aura chaude qui pulse plus fort, cœurs qui flottent |
| 07 Apaisée | flottement lent régulier, aura douce |
| 08 Mélancolique | flottement minimal, aura qui s'éteint |
| 09 À cran | aura dense, micro-tension très subtile (PAS un shake comique) |
| 10 À fleur de peau | flottement minimal, aura faible et tremblante |

## Reste à décider plus tard

- Durée du crossfade au survol (≈300-500 ms ?).
- Respect `prefers-reduced-motion` (déjà la pratique du projet).
- Les veines/cœurs : statiques sur le PNG, ou calques animés séparés ?
