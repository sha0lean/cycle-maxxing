# 04 — DESIGN SYSTEM

> **rôle** : référentiel visuel du projet.
> **contient** : palette lilas/sunset, tokens couleur, composants, règles d'usage.
> **vital parce que** : cohérence visuelle = app qui inspire confiance dans un sujet délicat.
> **à lire avant de** : créer un composant, choisir une couleur, toucher au thème.

---

# Design System — Pastel Lilas / Sunset

## Philosophie

Deux thèmes switchables : dark (défaut) et light.
Palette pastel lilas + accents sunset (rose pêche, corail, lavande).
Lisibilité absolue — WCAG AA minimum partout.
Données en monospace. Interface aérée mais dense.

## Couleurs de phase

| Phase | Label | Dark | Light |
|---|---|---|---|
| ph1 | Règles | #F4A7B9 | #D4607A |
| ph2 | Folliculaire | #B8D4F0 | #5B8AC4 |
| ph3 | Ovulation | #C5B3F5 | #8B6FD4 |
| ph4a | Lutéale | #F5C8A0 | #C47A30 |
| ph4b | SPM | #F0908A | #C44B42 |

## Palette dark

```css
--bg-primary:     #0F0D1A
--bg-surface:     #1A1625
--bg-surface-alt: #221E30
--text-primary:   #F0EDF8
--text-secondary: #9B95B0
--text-muted:     #5C5570
--border:         #2E2845
```

## Palette light

```css
--bg-primary:     #FAF8FF
--bg-surface:     #FFFFFF
--bg-surface-alt: #F2EEF8
--text-primary:   #1A1628
--text-secondary: #5C4F7A
--text-muted:     #9B8DB0
--border:         #E2DAEF
```

## Typographie

```
Titres  : Inter 500-600
Stats   : JetBrains Mono / Geist Mono
Corps   : Inter 400
Scale   : 11 / 13 / 14 / 16 / 20 / 24 / 32 / 48px
```

## Tokens

```
border-radius : 12px cartes · 8px éléments · 999px badges/pills
transitions   : 200ms ease-out
barres        : 6px height · radius full · fill 0→val en 600ms
spacing       : base 4px · rhythm 8/12/16/24/32/48px
```

## Niveaux qualitatifs (jauges)

```
≥ 70%  → "Élevé"  — couleur de phase
30-69% → "Modéré" — text-secondary
< 30%  → "Faible" — text-muted
```

## Badge urgence

```
normal    → vert  #1D9E75
attention → ambre #EF9F27
critique  → rouge #E24B4A
```
