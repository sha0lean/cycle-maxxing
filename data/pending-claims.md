# Pending Claims — Claims en suspens
# Claims capés, modifiés ou refusés lors de l'ingestion.
# Réactivables si une future source corrobore le claim avec un poids combiné suffisant.
# Vérifié automatiquement par /ingest-source à chaque nouvelle ingestion.

---

## Index

- [pmc4625231-parasympathique-energie-j10j11](#pmc4625231-parasympathique-energie-j10j11) — capé 2026-06-25

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
