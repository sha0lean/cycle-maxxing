# Julie — Historique cycles réels
# Source : export manuel Flo · Screenshots analysés le 25 juin 2026
# Légende Flo : cercles pleins roses = règles réelles · pointillés roses = prédictions · pointillés turquoise = ovulation estimée

---

## Cycles confirmés (données réelles)

| # | J1 début règles | Fin règles | Durée règles | J1 suivant | Durée cycle |
|---|---|---|---|---|---|
| 1 | 2026-05-07 | 2026-05-10 | 4 jours | 2026-05-31 | 24 jours |
| 2 | 2026-05-31 | 2026-06-03 | 4 jours | ~2026-06-27 (prédit) | ~27 jours |
| 3 | à confirmer | — | — | — | — |
| 4 | à confirmer | — | — | — | — |
| 5 | à confirmer | — | — | — | — |
| 6 | à confirmer | — | — | — | — |

> Aucune donnée réelle disponible avant mai 2026 — Flo ne remonte pas plus loin dans l'historique de Julie.

---

## Statistiques calculées

```
Cycles confirmés     : 2
Durée moyenne cycle  : 25.5 jours  (24 + 27 ÷ 2)
Durée règles moyenne : 4 jours
Écart-type           : élevé — 2 cycles insuffisants, fiabilité variable
Cible fiabilité      : 6 cycles minimum avec j1 + fin règles confirmés
```

---

## Paramètres app (v1)

```
derniere_regle   : 2026-05-31
fin_regles       : 2026-06-03
duree_cycle      : 27            ← arrondi Flo (référence initiale)
duree_regles     : 4
fiabilite        : variable
position_actuelle: j26 (2026-06-25) — SPM critique
```

---

## Position au 25 juin 2026

```
Jour du cycle  : j26
Phase          : SPM critique (ph4b)
Sous-phase     : j24-j27 — SPM critique
Jours restants : ~1-2 avant règles (~26-27 juin)
```

---

## Prédictions Flo extraites des screenshots (cercles pointillés — non confirmées)

| Cycle | J1 prédit | Fin règles prédite | Ovulation prédite | Source screenshot |
|---|---|---|---|---|
| 3 | ~26-27 juin 2026 | ~29 juin 2026 | ~7 juillet 2026 | Image 0 + Image 1 |
| 4 | ~22-25 juillet 2026 | ~25 juillet 2026 | ~2 août 2026 | Image 1 |
| 5 | ~17-20 août 2026 | ~20 août 2026 | ~28 août 2026 | Image 1 |
| 6 | ~12-15 sept 2026 | ~15 sept 2026 | ~23 sept 2026 | Image 2 |
| 7 | ~8-11 oct 2026 | ~11 oct 2026 | ~19 oct 2026 | Image 2 |
| 8 | ~3-6 nov 2026 | ~6 nov 2026 | ~14 nov 2026 | Image 3 |
| 9 | ~29 nov - 2 déc 2026 | ~2 déc 2026 | ~10 déc 2026 | Image 3 |
| 10 | ~25-28 déc 2026 | ~28 déc 2026 | ~5 jan 2027 | Image 4 |
| 11 | ~20-23 jan 2027 | ~23 jan 2027 | ~31 jan 2027 | Image 4 |
| 12 | ~15-18 fév 2027 | ~18 fév 2027 | ~26 fév 2027 | Image 5 |
| 13 | ~13-16 mars 2027 | ~16 mars 2027 | ~24 mars 2027 | Image 5+6 |
| 14 | ~8-11 avril 2027 | ~11 avril 2027 | ~19 avril 2027 | Image 6 |

> Toutes ces prédictions sont générées par Flo sur base de 2 cycles réels seulement.
> Fiabilité : variable → à corriger cycle par cycle dès que j1 réel est confirmé.

---

## Instructions de mise à jour

Après chaque nouveau cycle :
1. Confirmer le j1 réel dans le tableau "Cycles confirmés"
2. Confirmer la fin des règles (rulesEndDate)
3. Recalculer la durée du cycle (nouveau j1 - ancien j1)
4. Mettre à jour la moyenne glissante sur les 6 derniers cycles
5. Recalculer l'écart-type → mettre à jour le champ fiabilite
6. Cocher la ligne correspondante dans les prédictions Flo

---

## Règle de détection outlier

Si durée cycle > moyenne ± 2σ → pondération 0.5 (cycle exceptionnel : maladie, stress, voyage)
