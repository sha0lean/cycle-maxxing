# Recherche scientifique — Domaine SOMMEIL × cycle menstruel

| Ouverture | 2026-07-02 | ~08:20 |
| Clôture | 2026-07-02 | ~08:40 |

> Livrable de recherche produit via le harness `deep-research` (6 angles, 21 sources
> primaires fetchées, 101 claims extraits, 25 vérifiés par vote adversarial 3 votants).
> **Statut vérification : 21 confirmés · 4 réfutés · 0 non vérifié.**
> Population : femmes en **cycle naturel** (contraception hormonale exclue), sauf mention.
> À ingérer plus tard via `/ingest-source` (quantitatif → `phase-reference.md`,
> qualitatif → `data/domains/sommeil.md`).

Cycle de référence projet : 27 j, ovulation j13, règles 4 j.
Phases : règles (j1-4) · folliculaire (j5-11) · ovulation (j12-14) · lutéale (j15-20) · SPM (j21-27).

---

## Message central

Le sommeil varie **objectivement** au fil du cycle, mais le gros des *plaintes* se concentre
en prémenstruel — et chez les femmes **symptomatiques (SPM/TDPM)** la plainte est largement
**subjective** (dissociation avec la PSG). Moteur physiologique : **progestérone lutéale +
son métabolite allopregnanolone (ALLO)** via récepteur GABA-A et élévation thermique.

⚠️ **Aucune méta-analyse ni RCT** sur les *recommandations* de sommeil par phase. Le solide =
**descriptions + mécanismes**. Les conseils pratiques (rafraîchir la chambre, hygiène de sommeil)
sont des **extrapolations mécanistiques**, non testées par essai dédié.

---

## Tableau phase × sommeil

| Phase (jours) | Conseil fondé | À éviter / mécanisme | Source (PMCID/DOI) | Niveau de preuve |
|---|---|---|---|---|
| **Règles j1-4** | Ne pas dramatiser une mauvaise nuit : qualité subjective la plus basse autour des règles, efficacité PSG ~83 %. | Attribuer à l'hormonal : œstradiol + progestérone au plancher → coupable probable = douleur/crampes. | EPISONO 10.1007/s11325-024-02996-4 ; PMC2266284 | Observationnel (mono-étude pour les chiffres) |
| **Folliculaire j5-11** | **Meilleure fenêtre du cycle.** Efficacité ~89,9 %, endormissement ~7 min. Caler ici la récup de dette de sommeil. | Rien de spécifique. | EPISONO 10.1007/s11325-024-02996-4 ; PMID 39448073 | Observationnel — efficacité **vote 2-1, non répliqué** ⚠️ |
| **Ovulation j12-14** | *(pas de reco dédiée)* | — | Aucune donnée fine | ❌ **zone vide** |
| **Lutéale j15-20** (thermique) | **Rafraîchir la chambre.** Progestérone ↑ température centrale **+0,27 °C** et dépense énergétique nocturne **+6,9 %**. | Chambre trop chaude → nuit à la thermorégulation. *Conseil « rafraîchir » = extrapolation, pas testé.* | PMC6981303 (10.14814/phy2.14353) ; PMC7575238 | Observ./méca **solide** (n=9) ; conseil **extrapolé** |
| **Lutéale j15-20** (architecture) | Sommeil « différent » sans être pire : **N2/fuseaux ↑, REM ↓**. Pente rapide de progestérone → **fragmentation ↑ (WASO)**. | Mécanisme : **ALLO**, modulateur allostérique positif du **GABA-A** (sédatif type benzo). | PMC4098663 ; PMID 22749440 ; PMC4524984 ; PMC7231988 | Observ. PSG + **méca établi** (3-0) |
| **SPM j21-27** (dissociation) | Cibler **anxiété + hygiène de sommeil**, pas forcément l'architecture. Plainte subjective ↔ anxiété (**r = −0,64**). | **Dissociation subjectif/objectif** : en SPM sévère/TDPM la qualité *ressentie* chute sans dégradation PSG macro. | PMC3376683 ; PMC2266284 | Observ., petits n — **3-0** |
| **SPM j21-27** (effet de phase réel) | Attendre plus d'**éveils nocturnes (WASO)** en lutéale tardive — **chez tout le monde**, pas que les SPM. | Effet principal de phase, indépendant de la sévérité SPM. | PMC2266284 ; PMC10474748 (revue 35 études) | Observ. + **revue systématique** (3-0) |
| **SPM j21-27** (TDPM) | Piste : **mélatonine 2 mg libération prolongée** 1 h avant coucher en lutéale → latence objective réduite. Mélatonine nocturne **émoussée** en TDPM. | — | PMC8664575 ; PMC3526531 ; PMID 22749440 | ⚠️ **pilote open-label non contrôlé, n=5** — preuve **faible** |

---

## Findings détaillés (citations exactes)

### 1. Folliculaire mi/tardive = meilleur sommeil objectif — confiance MEDIUM
Efficacité 89,9 %±9,6 (vs menses 83,0 %±10,8, p=0,008 ; lutéale 83,7 %±12,7, p=0,02).
SOL 7,1±7,1 min (vs menses 22,3±32,4 ; lutéale 15,9±14,7).
> « Sleep efficiency was statistically higher in women in the mid/late follicular group
> (89.9% ± 9.6) compared to menstrual (83.0% ± 10.8) and luteal (83.7% ± 12.7) groups. »
- Sources : EPISONO, Sleep and Breathing 2024, **DOI 10.1007/s11325-024-02996-4** ; J Sleep Res 2025 **PMID 39448073**.
- PSG, 96 femmes. **Transversal** (groupes différents par phase, 1 nuit chacun), **non répliqué** — littérature Driver/Baker trouve souvent l'efficacité préservée. SD énorme sur menses (32,4) = outliers. Mono-étude, pas consensus. Vote : SOL 3-0 ; efficacité 2-1.

### 2. Lutéale : élévation thermique — confiance HIGH
> « a significant increase in average core body temperature (+0.27°C) and energy
> expenditure (+6.9%) » (lutéale vs folliculaire).
- Zhang et al. 2020, Physiological Reports, **PMC6981303 / DOI 10.14814/phy2.14353**, 9 femmes saines cycle naturel, chambre métabolique + PSG. Corroboré revue **PMC7575238** (temp lutéale 0,3-0,7 °C supérieure).
- Chiffres = observationnel/méca (n=9). **Conseil « rafraîchir la chambre » = extrapolation**, pas d'essai sur le sommeil. Vote 3-0.

### 3. Lutéale : remodelage d'architecture + fragmentation — confiance HIGH
> « A steeper increase in PROG leading up to the PSG was associated with higher WASO%
> (β=0.64, p=0.016) » ; N2 lutéal 51,3 % vs périovulatoire 45,5 % (p=0,045).
- Baker et al. 2014, **PMC4098663**, 27 femmes cycle naturel (contraceptifs exclus).
- Shechter/Baker 2012 **PMID 22749440** : Stage 2 ↑ mi-lutéal vs folliculaire précoce ; REM ↓ lutéale précoce (groupes TDPM + contrôles). N2/fuseaux corroborés JCEM 2015 **PMC4524984**.
- Observ. PSG + mécanistique établi. Petits n (27 ; 7+5). Vote : WASO 3-0 ; N2 3-0 ; REM 3-0 ; Stage2 3-0.

### 4. Mécanisme hormonal du prémenstruel : ALLO / GABA-A — confiance HIGH
> Progestérone « low during the follicular phase, rises across the luteal phase, and drops
> rapidly in the late luteal phase just prior to menses. Its levels are mirrored by its
> metabolite, ALLO » ; ALLO « a potent positive allosteric modulator of the GABAA-R…
> anxiolytic, anesthetic and sedative properties similar to barbiturates or benzodiazepines ».
- Revue Neurobiology of Stress 2020, **PMC7231988** ; **PMC8538505**.
- Pharmacologie neurostéroïde établie (base de la brexanolone/Zulresso, FDA). Nuance : « mirrors » ≠ suivi 1:1 (ratio ALLO/progestérone variable). Vote : trajectoire 3-0 ; méca GABA-A 3-0.

### 5. SPM/TDPM lutéale tardive : dissociation subjectif/objectif — confiance HIGH
> « women with PMS rated their sleep quality as being significantly poorer in the LLP
> compared with their FP (p = 0.02) » — sans différence d'architecture PSG attribuable au SPM.
Qualité subjective 54,3 vs 66,2 mm VAS (p=0,03) alors qu'efficacité 89,2 % (foll.) vs 89,9 % (lut.) ; corrélation anxiété d'état **r=−0,64, p=0,005**.
- Baker et al. 2012 **PMC3376683** (18 SPM sévères/TDPM + 18 contrôles) ; Baker et al. 2007 **PMC2266284** (9 SPM + 12 contrôles). Cycle naturel, contraception exclue.
- Conseil (hygiène + gestion anxiété) = extrapolé. Observ., petits n. Vote 3-0 / 3-0.

### 6. Effet de phase INDÉPENDANT du SPM (WASO) — confiance HIGH
> « Both groups of women had increased wakefulness after sleep onset (P=0.02) » en lutéale tardive.
- Baker 2007 **PMC2266284** : effet principal de phase, pas d'interaction avec sévérité SPM.
- Revue systématique Jeon & Baek 2023 **PMC10474748** (35 études, 21 sur SPM-sommeil) : SPM associé à pire qualité, plus de somnolence diurne, sévérité d'insomnie accrue, durée plus courte en TDPM. Constructs **subjectifs**. Vote 3-0 / 3-0.

### 7. Insomnie en TDPM — confiance HIGH
PIRS-20 lutéal tardif : TDPM 25,19±10,16 vs contrôles 10,81±7,19 (p<0,001) ; intra-TDPM lutéal vs folliculaire : insomnie t=4,12, fatigue t=5,83 (p<0,001).
- Lin/Ko/Yen 2021 **PMC8230179 / DOI 10.3390/ijerph18126192**, prospectif 3 cycles, 100 TDPM DSM-5 cycle naturel + 96 contrôles.
- Auto-rapporté (PIRS/FSS), pas PSG. Diagnostic via PMDDSQ hebdo (pas DRSP quotidien). Vote 3-0 / 3-0.

### 8. Mélatonine en TDPM + supplémentation — confiance MEDIUM
> « PMDD women had reduced area under the curve of melatonin during LP compared to FP (P = .03) ».
Supplémentation : 2 mg mélatonine libération prolongée 1 h avant coucher, lutéale, 3 cycles → latence objective réduite (p=0,01).
- Shechter et al. 2012 **PMC3526531** (pilote n=5) ; Moderie/Boivin 2021 **PMC8664575** ; **PMID 22749440**.
- ⚠️ Pilotes très petits (n=5), essai mélatonine **non contrôlé / non randomisé / open-label** → preuve faible, ne pas généraliser. Vote : AUC 2-1 ; émoussement 3-0 ; supplémentation 3-0.

---

## 🔴 4 claims RÉFUTÉS (à ne PAS reprendre)

- ❌ « L'architecture du sommeil **ne varie pas** folliculaire vs lutéale chez la femme saine » → **faux** (0-3). Elle varie (N2↑, REM↓).
- ❌ « La baisse de mélatonine lutéale est **spécifique au TDPM** » → réfuté (0-3) : les contrôles saines varient aussi.
- ❌ « **Toutes** les TDPM ont une insomnie lutéale » → réfuté (0-3, preuve n=5 trop faible).
- ❌ « Le TDPM = plasticité GABA-A altérée » → réfuté (1-2, spéculatif).

---

## Limites globales

- **Petits échantillons** partout (n<30, souvent n=5-9).
- **Contradiction non résolue** : l'ampleur des variations efficacité/latence par phase n'est pas répliquée (EPISONO gros effet ; Baker/Driver souvent non).
- **Mapping 27 j** : littérature = folliculaire/lutéale/lutéale-tardive, rarement plus fin. **Ovulation (j12-14) et règles (j1-4) peu documentées.**
- Toutes les sources retenues = cycle naturel (contraception exclue), vérifié pour PMC4098663, PMC6981303, PMC3376683, PMC2266284, PMC3526531, PMC8664575, PMC8230179. EPISONO + PMID 22749440 : exclusion non confirmée verbatim mais design implique cycleuses naturelles.

---

## Questions ouvertes

1. Existe-t-il un **RCT** (pas un pilote n=5 open-label) démontrant qu'une intervention ciblée par phase (mélatonine lutéale, refroidissement, timing) améliore objectivement le sommeil en cycle naturel ?
2. L'élévation +0,27 °C a-t-elle un effet **causal** démontré sur latence/fragmentation, ou reste-ce une inférence ? Un essai de refroidissement actif existe-t-il ?
3. Architecture/qualité du sommeil pendant l'**ovulation précise (j12-14)** et les **règles (j1-4)** ? Peu documenté.
4. Chez les femmes **sans SPM/TDPM**, la phase lutéale dégrade-t-elle réellement le sommeil vécu, ou l'essentiel des plaintes se concentre-t-il sur la sous-population symptomatique ? → calibrer les recos pour Julie selon présence/absence de symptômes prémenstruels.

---

## 🏆 5 sources prioritaires à ingérer

| # | Titre | ID | Pourquoi |
|---|---|---|---|
| 1 | Baker & Driver — Sleep quality & sleep EEG in severe PMS | **PMC3376683** | Cœur de la dissociation subjectif/objectif |
| 2 | Baker et al. — Nocturnal PSG across the cycle in PMDD (2012) | **PMID 22749440** / 10.1016/j.sleep.2012.03.016 | Architecture PSG par phase + mélatonine |
| 3 | Baker et al. — Sleep & progesterone | **PMC4098663** | Pente progestérone → WASO (lien humain quantifié) |
| 4 | Zhang et al. — Température & dépense énergétique lutéales (2020) | **PMC6981303** / 10.14814/phy2.14353 | Le mécanisme thermique chiffré |
| 5 | Jeon & Baek — Revue systématique 35 études (2023) | **PMC10474748** | Seul niveau « revue systématique » du lot |

Revue de référence complémentaire (secondaire, non citée dans les findings mais utile) :
Shechter & Boivin 2010, *Sleep, Hormones, and Circadian Rhythms throughout the Menstrual Cycle*,
**PMC2929506 / DOI 10.1155/2010/259345**.
