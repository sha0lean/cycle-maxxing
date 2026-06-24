# Pending Claims — Claims en suspens
# Claims capés, modifiés ou refusés lors de l'ingestion.
# Réactivables si une future source corrobore le claim avec un poids combiné suffisant.
# Vérifié automatiquement par /ingest-source à chaque nouvelle ingestion.

---

## Index

- [pmc4625231-parasympathique-energie-j10j11](#pmc4625231-parasympathique-energie-j10j11) — capé 2026-06-25
- [verywellfit-oestrogene-folliculaire-ovulation](#verywellfit-oestrogene-folliculaire-ovulation) — suspendu 2026-06-25
- [verywellfit-progesterone-luteale](#verywellfit-progesterone-luteale) — suspendu 2026-06-25

---

### pmc4625231-parasympathique-energie-j10j11
**dominance parasympathique → énergie j10-j11**

- date_suspension : 2026-06-25
- signal : dominance parasympathique
- capteur : énergie
- sous-phase : j10-j11
- delta_proposé : +10 (résultat : 82 → 92)
- delta_appliqué : +6 (capé à 88)
- delta_suspendu : +4
- raison : Cohérence de progression — j10-j11 énergie à 92 dépasserait j12 pré-ovulation (88). La montée vers l'ovulation doit être strictement croissante. Le cap préserve la forme de courbe attendue.
- poids_source : 0.4
- corroboration_requise : 0.6 (une source niveau 2, ou deux sources niveau 3 distinctes)
- action_si_corroboré : lever le cap sur j10-j11 énergie (+4 supplémentaires) ET reconsidérer si j12 doit aussi monter pour maintenir la progression

---

### verywellfit-oestrogene-folliculaire-ovulation
**pic d'œstrogène → énergie/humeur/libido (folliculaire + ovulation, j5-j14)**

- date_suspension : 2026-06-25
- signal : pic d'œstrogène (non encore mappé dans signal-mapping.md)
- portée : j5-j14
- mapping_proposé : énergie +8, humeur +5, libido +5, fatigue -6, sensibilité -3, stress -3, irritabilité -3, douleurs 0
- delta_appliqué : refusé (signal non seedé)
- raison : source niveau 5 (poids effectif 0.05). Refus de figer la recette canonique de l'œstrogène depuis un article de fitness. Claim consigné pour corroboration.
- poids_source : 0.1 (×0.5 inférence = 0.05)
- corroboration_requise : 0.7 (une source niveau 1-2 mesurant œstrogène → symptômes)
- action_si_corroboré : seed le signal « pic d'œstrogène » dans signal-mapping.md avec les coefficients de la source forte (pas ceux-ci), puis appliquer sur folliculaire/ovulation

### verywellfit-progesterone-luteale
**progestérone élevée → fatigue/énergie (lutéale, j15-j27)**

- date_suspension : 2026-06-25
- signal : progestérone élevée (non encore mappé dans signal-mapping.md)
- portée : j15-j27
- mapping_proposé : énergie -6, humeur -3, libido -3, fatigue +6, sensibilité +4, stress +3, irritabilité +4, douleurs 0
- delta_appliqué : refusé (signal non seedé)
- raison : source niveau 5 (poids effectif 0.05). Refus de figer la recette canonique de la progestérone depuis un article de fitness. Claim consigné pour corroboration. NB : chevauche partiellement « dominance sympathique » (PMC4625231) déjà appliqué en lutéale — vérifier le double-comptage avant toute application future.
- poids_source : 0.1 (×0.5 inférence = 0.05)
- corroboration_requise : 0.7 (une source niveau 1-2 mesurant progestérone → symptômes)
- action_si_corroboré : seed le signal « progestérone élevée » dans signal-mapping.md avec les coefficients de la source forte (pas ceux-ci), puis appliquer sur lutéale en contrôlant le recouvrement avec dominance sympathique
