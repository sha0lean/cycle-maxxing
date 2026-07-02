# Refonte dashboard — « Éphéméride corporelle »

| Ouverture | 2026-07-01 | 14:00 |
| Clôture | | |

Direction validée : nuit chaude + Instrument Serif, grille en L (avatar plein pied à
gauche, stats sans fond + frise à droite, conseils pleine largeur dessous). Bandeau en haut.
Desktop-first (mobile buste, traité plus tard).

## Progression

- [x] Phase 1 — Fondation : tokens nuit chaude + typo Instrument Serif/Geist (globals.css, layout.tsx)
- [x] Phase 2 — Purge multi-typo : retirer FontToggle (fichier + CycleNav)
- [x] Phase 3 — Layout en L : Dashboard (slot aside) + Frise/DayPanel/Calendar
- [x] Phase 4 — Avatar plein pied full-height (CharacterAvatar)
- [x] Phase 5 — Stats sans fond, compactes (MetricsPanel)
- [x] Phase 6 — Bandeau (wordmark Instrument Serif) + titres + typecheck vert
- [x] Phase 6b — /run confirmé + harmonisation METRIC_COLOR sur la nuit chaude
- [ ] Phase 7 — /verify + commit (en attente validation Remy)

## Reste / hors scope layout

- Responsive mobile (avatar en buste) — desktop-first assumé, à traiter ensuite
- Frise : double label « Ovulation Ovulation » (préexistant, non introduit par la refonte)

## Notes

Fichiers touchés : globals.css, layout.tsx, labels.ts, CycleNav, Dashboard, DayPanel,
Frise, Calendar, CharacterAvatar, MetricsPanel, DomainTabs. FontToggle.tsx supprimé.

Palette nuit chaude (.dark) :
- ink #1B0E15 · surface #271620 · bone #F5E9EC · muted #A48D97
- ember (primary) #E8506B · border #3A2430
- phases : rose #F0577E · turquoise #5AC8D8 · or #E8B84B · cuivre #E58A4E · braise #DB5A67

Typo : Instrument Serif (display) + Geist (sans) + Geist Mono (mono).
