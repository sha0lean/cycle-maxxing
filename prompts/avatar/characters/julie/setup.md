# SETUP — Julie  ·  avatar anime (compilé depuis bible.json + _system/kit.json)

> **Uploade ce fichier UNE fois dans un Projet ChatGPT.** Puis : 1 prompt master → l'image de base,
> ensuite 1 prompt court par état. Ne re-uploade que si le CANON change.

---

## 🛠️ Mode d'emploi (pour le modèle)

Tu génères des **variantes-sprites alignées** d'un même personnage anime.

1. D'abord, génère l'**image MASTER** à partir du *MASTER PROMPT* ci-dessous.
2. Ensuite, chaque variante = l'image master en **référence stricte** + **seulement le delta de l'état**.
3. Garde figés : canvas, centrage, baseline des pieds, échelle, cadrage full-body, tenue, coiffure, fond, lumière.
   Ne change QUE : expression, sourcils, yeux, bouche, blush/larmes, posture/mains subtiles, petits props.
   Ne déplace pas le perso sur le canvas, ne recadre pas, ne redimensionne pas.

---

## 🎨 MASTER PROMPT  ·  (génère l'image de base)

```
2D anime illustration, soft cel-shading, clean delicate line art, muted pastel lilac palette, cozy wholesome wellness app aesthetic, soft warm lighting.

Create a clean master reference image of Julie, a young adult woman, standing in a relaxed neutral pose, facing the viewer with a slight natural three-quarter body angle.

Her face is fully visible. No phone, no object, no hand covering the face. Soft square-oval face, slightly square jaw softened in anime style, short rounded chin, soft full cheeks, warm brown almond eyes, natural softly arched eyebrows, small natural anime nose, soft closed-mouth neutral smile. Several thin small ear piercings (delicate hoops and studs), discreet.

Very long silky wavy hair flowing past the waist, warm champagne blonde to soft beige blonde, loose natural S-shaped waves, clearly wavy and voluminous, not straight, not ringlets. Wide pastel lilac headband, clearly visible.

Body: soft feminine pear-hourglass silhouette, gently wide rounded hips, full soft thighs, naturally defined waist, shoulders slightly narrower than hips. Small natural bust only, modest projection under the sweater, not medium-full, not large, not emphasized, no cleavage, no pin-up anatomy. Lower body slightly fuller than upper body. Clean bare skin on legs and thighs, no tattoos, no marks.

Outfit: fitted pastel lilac ribbed knit mock-neck top (close-fitting on torso/waist/arms, lightly following the bust without emphasizing it, short standing mock-neck collar, not a bulky turtleneck). Short white pleated skirt with clean anime folds. White cotton knee-high socks, tight and smooth. White high-top Converse-style canvas sneakers. Shoes and socks entirely white.

Composition: centered character, full body framing from head to shoes, full head visible, no crop, plain uniform light-gray studio background, app-ready reusable avatar reference.
```

## 🚫 NEGATIVE

```
photorealism, 3d render, low quality, blurry, text, watermark, cropped head, cropped shoes, cropped body, cropped legs, camera tilt, deformed hands, nudity, revealing outfit, transparent fabric, latex, tattoos, body art, brown hair, dark chestnut hair, black hair, orange blonde hair, platinum white hair, straight hair, flat hair, tight ringlet curls, frizzy curls, blue eyes, green eyes, oversized breasts, huge chest, large bust, medium-full bust, cleavage, boob-focused anatomy, pin-up anatomy, exaggerated curves, tiny waist, hyper-wide hips, thin V-shaped face, narrow jaw, beige leg warmers, colored socks, colored shoes, boots, phone, glasses, different outfit
```

---

## 🔒 IDENTITÉ FIGÉE  ·  (ne bouge JAMAIS entre les sprites)

- Visage : square-oval doux, joues pleines, menton rond court
- Yeux : brun chaud, amande douce
- Cheveux : champagne blonde ondulés très longs + bandeau lilas
- Corps : petite poitrine modeste, taille définie, hanches douces (pear-hourglass)
- Tenue : top mock-neck lilas côtelé + jupe plissée blanche + chaussettes hautes blanches + sneakers montantes blanches
- Cadrage : plein pied, tête aux pieds, légèrement de 3/4

## 📐 ALIGNEMENT SPRITE

Canvas portrait **2:3 · 1024×1536**. Perso centré, **même baseline des pieds**, **même échelle**,
même marge en haut des cheveux, même angle caméra sur TOUTES les variantes. → animation fluide.

---

## 🎭 ÉTATS  ·  (tape juste le nom — ChatGPT applique le delta sur l'image master)

| # | État | Expression | Posture / mains | Props | Lumière |
|---|---|---|---|---|---|
| 01 | Endolorie (j1-2) | épuisée, yeux mi-clos, sourcils froncés, bouche tombante | voûtée, main sur le bas-ventre | une larme discrète | froide désaturée |
| 02 | Encore tendre (j3-4) | demi-sourire timide, regard qui s'adoucit | se déplie, épaules relâchées | — | douce, un peu froide |
| 03 | Éveil (j5-7) | regard qui s'allume, sourcils détendus | dos qui se redresse | — | qui se réchauffe |
| 04 | Pétillante (j8-11) | sourire ouvert, clin d'œil | vive, léger rebond | glow / sparkles | lumineuse chaude |
| 05 | Confiante (j12) | assurée, clin d'œil | début de cambrure | nipples faibles sous le pull (subtil) | chaude |
| 06 | Séductrice (j13-14) ⚠️ | rougie, regard intense presque agressif | bien cambrée, léger sway | cœurs flottants ; nipples marqués sous le pull | chaude qui pulse |
| 07 | Apaisée (j15-17) | rêveuse, paisible | détendue | chocolat / mug en main | douce chaude |
| 08 | Mélancolique (j18-20) | regard qui s'éteint | molle, épaules basses | léger gonflement seins/ventre | douce qui s'éteint |
| 09 | À cran (j21-23) | irritée, sourcils tendus | poing serré sur la hanche | pop-veins de colère ; corps gonflé | dense |
| 10 | À fleur de peau (j24-27) | larmes + colère | repliée, bouillotte au ventre | bouillotte + mouchoir + pop-veins ; gonflement max | faible tremblante |

> ⚠️ État 06 : cambrure suggestive autorisée, mais **toujours habillée** — pas de nudité, pas de seins exposés, pas de cleavage.
