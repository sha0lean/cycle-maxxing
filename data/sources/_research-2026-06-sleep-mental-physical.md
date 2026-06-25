# Rapport de recherche — Sommeil / Mental / Santé physique × cycle

> Dump brut d'un agent de recherche (juin 2026). **Non ingéré** par le pipeline `ingest-source`
> (préfixe `_` = matière de référence, pas une source formatée pour le calcul des capteurs).
> A servi à rédiger les fiches qualitatives `data/domains/sommeil.md`, `mental.md`, `sante.md`.
> Décision : exploitation **qualitative uniquement**, capteurs `phase-reference.md` non modifiés.

## Hypothèses de mapping
- Cycle modèle 27 j ; les études raisonnent en folliculaire/ovulatoire/lutéale/prémenstruelle, pas en jours fixes.
- Confiance : 🟢 directe (effet mesuré) · 🟡 inférée (signal mesuré, impact app déduit) · 🔴 faible (preuve indirecte, petit n, contradictoire).
- **Preuves fortes pour SPM/PMDD/menstruation, faibles pour j8-j14 chez femmes asymptomatiques.**
- **Biais population** : ~9/15 sources sur populations cliniques (SPM/PMDD, anxiété/PTSD, migraine).
  Applicabilité renforcée pour Julie (SPM marqué) mais PMDD ≠ SPM → pondérer.

---

## 1. Sommeil × cycle
- **Nexha 2024** — *Biological rhythms in PMS/PMDD: a systematic review*, BMC Women's Health. Méta-analyse, 25 articles. DOI 10.1186/s12905-024-03395-3, PMID 39375682.
  SPM (j21-j27) : mélatonine ↓, température nocturne ↑, sommeil subjectif dégradé. 🟢
  « lower melatonin levels, elevated nighttime core body temperature, and worse subjective perception of sleep quality »
- **Alzueta & Baker 2023** — *The Menstrual Cycle and Sleep*, Sleep Medicine Clinics. Revue narrative. DOI 10.1016/j.jsmc.2023.06.003, PMID 38501513, PMC11562818.
  Sommeil pire en prémenstruel + règles ; architecture modifiée en lutéale. 🟢/🟡
  « Poorer sleep quality in the premenstrual phase and menstruation is common »
- **Baker 2020** — *Temperature regulation in women: Effects of the menstrual cycle*, Temperature. Revue. PMC7575238.
  Progestérone ↑ → température centrale +0,3 à 0,7°C en lutéale post-ovulatoire. 🟢
  « 0.3°C to 0.7°C higher in the post-ovulatory luteal phase »
- **Zhang 2020** — *Changes in sleeping energy metabolism and thermoregulation during menstrual cycle*, Physiological Reports. Observationnelle contrôlée, n=9. DOI 10.14814/phy2.14353, PMID 31981319, PMC6981303.
  Lutéale : température +0,27°C, dépense énergétique de sommeil +6,9%. Petit n. 🟢/🟡
  « core body temperature (+0.27°C) and energy expenditure (+6.9%) »

## 2. Santé mentale / émotionnel × cycle
- **Handy 2022** — *Psychiatric Symptoms Across the Menstrual Cycle in Adult Women*, Harvard Review of Psychiatry. Revue. DOI 10.1097/HRP.0000000000000329, PMID 35267252, PMC8906247.
  Exacerbation des symptômes psychiatriques en SPM + règles. 🟢/🟡
  « menstrual cycle–dependent fluctuations in psychiatric symptoms »
- **Hantsoo & Epperson 2020** — *Allopregnanolone in PMDD*, Neurobiology of Stress. Revue mécanistique. DOI 10.1016/j.ynstr.2020.100213, PMID 32435664, PMC7231988.
  Progestérone → allopregnanolone → modulation GABA-A ; sensibilité anormale en lutéale/SPM → stress, irritabilité. 🟢/🟡
  « dysregulated sensitivity to GABA-A receptor modulating neuroactive steroids »
- **Nillni 2021** — *The Impact of the Menstrual Cycle and Underlying Hormones in Anxiety and PTSD*, Current Psychiatry Reports. Revue. DOI 10.1007/s11920-020-01221-9, PMID 33404887, PMC8819663.
  Modulation anxiété/stress surtout en lutéale (j15-j27). 🟢/🟡
  « phase effects on outcomes relevant to anxiety and PTSD »
- **Jespersen 2024** — *SSRIs for PMS and PMDD*, Cochrane. Méta-analyse de 34 RCT, 4563 femmes. DOI 10.1002/14651858.CD001396.pub4, PMID 39140320, PMC11323276.
  Substrat sérotoninergique des symptômes prémenstruels ; ISRS réduisent les symptômes. 🟢
  « SSRIs probably reduce premenstrual symptoms »
- **Doornweerd 2025** — *28 days later: prospective daily study on psychological well-being across the menstrual cycle*, Psychological Medicine. Cohorte prospective, n=40 (22 naturels / 18 OC). DOI 10.1017/S003329172400357X, PMC12017372.
  Variations quotidiennes du bien-être ; plus gros effet = progestérone. n modeste. 🟢
  « largest effects for progesterone levels »

## 3. Santé physique pratique × cycle
- **McNulty 2020** — *Effects of Menstrual Cycle Phase on Exercise Performance in Eumenorrheic Women: SR & meta-analysis*, Sports Medicine. Méta-analyse. DOI 10.1007/s40279-020-01319-3, PMID 32661839.
  Performance triviale↓ en folliculaire précoce (j1-j7) ; reste assez stable. Preuve faible. 🟡
  « exercise performance might be trivially reduced during the early follicular »
- **Li 2020** — *Physical and mental fatigue across the menstrual cycle (with/without GAD)*, Hormones and Behavior. Observationnelle, n=38. DOI 10.1016/j.yhbeh.2019.104667, PMID 31899259.
  Fatigue mentale ↑ en lutéale (j18-j20) chez femmes non anxieuses. 🟢/🟡
  « increased mental fatigue in the luteal phase »
- **Raffaelli 2023** — *Menstrual migraine is caused by estrogen withdrawal*, J Headache Pain. Revue. DOI 10.1186/s10194-023-01664-4, PMID 37730536, PMC10512516.
  Chute prémenstruelle des œstrogènes → migraines (SPM j21-j27, règles début). 🟢/🟡
  « premenstrual drop in estrogen levels serves as a trigger of migraine attacks »
- **Izáková 2021** — *A rise in evening aldosterone in early luteal phase precedes PMS symptoms*, J Neuroendocrinology. Observationnelle. DOI 10.1111/jne.13043, PMID 34595778.
  Aldostérone salivaire du soir ↑ dès début lutéal (j15-j17) chez femmes SPM ; cortisol inchangé. 🟢/🟡
  « evening salivary aldosterone, but not cortisol concentrations, are increased »
- **Tan 2020** — *Pain Across the Menstrual Cycle: Considerations of Hydration*, Frontiers in Physiology. Revue. DOI 10.3389/fphys.2020.585667, PMID 33132918, PMC7578918.
  Douleur expérimentale : résultats contradictoires ; pas de signal solide j8-j14. 🔴
  « no agreement among researchers on whether the menstrual cycle does, or does not, affect experimental pain sensitivity »
- **Granda 2021** — *Is PMS Associated with Inflammation, Oxidative Stress and Antioxidant Status? SR*, Antioxidants. Revue systématique observationnelle. DOI 10.3390/antiox10040604, PMID 33919885, PMC8070917.
  Inflammation ↑ possible / antioxydants ↓ en SPM ; données hétérogènes. 🟡
  « Limited evidence indicates increased levels of inflammatory parameters »

---

## Gap de preuve assumé 🚨
Pour **j8-j9 (folliculaire milieu)**, **j10-j11 (folliculaire fin)** et **j12-j14 (ovulation)**, les preuves
fiables sur fatigue/douleurs/ballonnements/sommeil/humeur sont faibles chez femmes asymptomatiques.
→ Les fiches domaines **laissent ces plages vides** plutôt que d'inventer (résolution = null, l'UI affiche
« Pas encore de conseils »). Cohérent avec la règle projet « zéro conseil sorti du chapeau ».
