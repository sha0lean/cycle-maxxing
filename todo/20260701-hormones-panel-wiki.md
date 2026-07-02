# Panneau Hormones du jour + Wiki hormones + couleurs centralisées

| Ouverture | 2026-07-01 | 15:30 |
| Clôture | | |

Section conseil → pilule niveau-1 « Conseil ⇄ Hormones ». Volet Hormones = niveau/tendance/phrase
du jour, dérivés de REFERENCE_CURVES. Wiki hormones sur 3e onglet navbar. Couleurs hormones
centralisées (1 point d'édition, propagé partout, indépendantes). Navbar refondue (space-around,
retrait badge urgence).

## Progression

- [ ] Phase 1 — Tokens couleurs hormones centralisés (hormone-theme.ts + globals.css + CURVE_SERIES + Timeline)
- [ ] Phase 2 — Logique hormone du jour (hormones.ts : level + trend par jour)
- [ ] Phase 3 — Contenu éditorial phrases contextuelles (par état : montée/pic/chute/bas)
- [ ] Phase 4 — Composant HormonesDuJour (onglets colorés + badge/flèche/phrase)
- [ ] Phase 5 — Pilule niveau-1 Conseil ⇄ Hormones (DayPanel)
- [ ] Phase 6 — Wiki hormones (HormoneWiki, suppr. HormoneGuide déroulant)
- [ ] Phase 7 — Navbar refondue (space-around, onglet Hormones, retrait urgence)
- [ ] Phase 8 — typecheck + /run + /verify + commit

## Décisions

- Icônes pilule : MessageCircle (Conseil) + Activity (Hormones)
- Couleurs de départ = valeurs dark actuelles (turquoise/rose/or/vert-doux/mauve)
- Runtime color-picker = hors scope (archi CSS-var le permettra plus tard)
