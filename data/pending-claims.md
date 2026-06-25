# Pending Claims — Claims en suspens
# Claims capés, modifiés ou refusés lors de l'ingestion.
# Réactivables si une future source corrobore le claim avec un poids combiné suffisant.
# Vérifié automatiquement par /ingest-source à chaque nouvelle ingestion.

---

## Index

- [pmc4625231-parasympathique-energie-j10j11](#pmc4625231-parasympathique-energie-j10j11) — capé 2026-06-25
- [verywellfit-oestrogene-folliculaire-ovulation](#verywellfit-oestrogene-folliculaire-ovulation) — suspendu 2026-06-25
- [verywellfit-progesterone-luteale](#verywellfit-progesterone-luteale) — suspendu 2026-06-25 (corroboration partielle, cf. note)
- [nexha2024-melatonine-fatigue-j24j27](#nexha2024-melatonine-fatigue-j24j27) — capé 2026-06-25
- [granda2021-inflammation-j24j27](#granda2021-inflammation-j24j27) — capé 2026-06-25
- [mcnulty2020-performance-folliculaire](#mcnulty2020-performance-folliculaire) — refusé 2026-06-25
- [tan2020-douleur-experimentale](#tan2020-douleur-experimentale) — refusé 2026-06-25

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
- MAJ 2026-06-25 : corroboration **partielle**. Le signal « progestérone élevée » a été seedé depuis `doornweerd2025` (niveau 3, hormones mesurées), corroboré par hantsoo2020/li2020/nillni2021, avec des coefficients **conservateurs sur l'axe émotionnel** (stress/irritabilité/sensibilité), fatigue minimale (+1) pour éviter le double-comptage avec « dominance sympathique ». Le mapping verywellfit d'origine (fatigue +6 / énergie -6) **reste suspendu** : aucune source niveau 1-2 mesurant progestérone→fatigue n'a encore été ingérée.

---

### nexha2024-melatonine-fatigue-j24j27
**mélatonine basse → fatigue j24-j27 (SPM critique)**

- date_suspension : 2026-06-25
- signal : mélatonine basse
- capteur : fatigue
- sous-phase : j24-j27
- delta_proposé : +4 (98 → 102)
- delta_appliqué : +1 (capé à 99)
- delta_suspendu : +3
- raison : palier de cohérence à 99 (saturation SPM critique, valeurs issues du seed SPM marqué de Julie). La fatigue ne peut pas monter davantage sans casser l'échelle.
- poids_source : 1.0 (eff. 0.5, inféré)
- corroboration_requise : non applicable — cap structurel, pas un déficit de preuve. Le surplus ne sera levé que si l'échelle de fatigue est recalibrée.

---

### granda2021-inflammation-j24j27
**inflammation / stress oxydatif → sensibilité + fatigue j24-j27 (SPM critique)**

- date_suspension : 2026-06-25
- signal : inflammation / stress oxydatif
- capteurs : sensibilité, fatigue
- sous-phase : j24-j27
- delta_proposé : sensibilité +2, fatigue +2
- delta_appliqué : 0 (capés — slots déjà à 99)
- raison : saturation SPM critique. Seul douleurs (+2) a pu être appliqué (55 → 57).
- poids_source : 0.4 (niveau 1 déclassé pour hétérogénéité)
- corroboration_requise : non applicable — cap structurel.

---

### mcnulty2020-performance-folliculaire
**performance physique réduite → énergie j1-j7 (folliculaire précoce)**

- date_suspension : 2026-06-25
- signal : performance physique réduite
- capteur : énergie
- sous-phase : j1-j7
- delta_proposé : -1 (trivial)
- delta_appliqué : refusé
- raison : effet qualifié de « trivial » par une méta-analyse niveau 1. Appliquer un delta serait du bruit ; la source soutient au contraire un quasi-statu quo en folliculaire.
- poids_source : 1.0
- corroboration_requise : non — refus de principe (effet nul, pas effet incertain).

---

### tan2020-douleur-experimentale
**sensibilité à la douleur → toutes phases**

- date_suspension : 2026-06-25
- signal : sensibilité à la douleur (cycle)
- capteur : douleurs / sensibilité
- sous-phase : toutes (notamment j8-j14)
- delta_proposé : aucun
- delta_appliqué : refusé
- raison : résultats contradictoires reconnus par les auteurs eux-mêmes — pas de consensus sur l'effet du cycle sur la douleur expérimentale. Ne pas générer de pics de douleur en folliculaire/ovulation sans historique utilisateur.
- poids_source : 0.2
- corroboration_requise : 0.7 (source niveau 1-2 établissant une direction claire) pour reconsidérer.
