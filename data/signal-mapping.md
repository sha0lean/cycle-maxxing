# Signal Mapping — Table de correspondance signal→capteurs
# Mise à jour automatique par /ingest-source à chaque nouveau signal validé
# Format : signal → liste de capteurs avec coefficient d'influence (-20 à +20)

---

## Signaux connus

### dominance parasympathique
> Système nerveux autonome en mode récupération — FC basse, RMSSD élevé
- énergie      : +10
- humeur       : +5
- fatigue      : -10
- stress       : -8
- irritabilité : -8
- libido       : +3
- sensibilité  : -5
- douleurs     : 0
- type : directe
- source_initiale : pmc4625231

### dominance sympathique
> Système nerveux autonome en mode vigilance/stress — FC élevée, LFnu élevé
- énergie      : -10
- humeur       : -5
- fatigue      : +10
- stress       : +8
- irritabilité : +8
- libido       : -3
- sensibilité  : +5
- douleurs     : +3
- type : directe
- source_initiale : pmc4625231

### FC repos élevée
> Fréquence cardiaque au repos anormalement haute pour la phase — indicateur de charge physiologique
- fatigue      : +6
- stress       : +5
- énergie      : -5
- type : directe
- source_initiale : pmc4625231

### SNA intermédiaire
> Légère dominance sympathique résiduelle — état de transition. LFnu > HFnu mais gradient inférieur au sympathique pur. Mesuré en phase menstruelle (j2).
- énergie      : -5
- humeur       : -3
- libido       : -2
- fatigue      : +5
- sensibilité  : +3
- stress       : +4
- irritabilité : +3
- douleurs     : 0  ← exclu : douleurs menstruelles d'origine mécanique, pas SNA
- type : inférée
- source_initiale : pmc4625231

### aldostérone élevée
> Minéralocorticoïde élevé en début lutéal — rétention hydrosodée, ballonnements, seins sensibles
- énergie      : -2
- humeur       : -2
- libido       : 0
- fatigue      : +3
- sensibilité  : +5
- stress       : 0
- douleurs     : +2
- irritabilité : 0
- type : inférée
- source_initiale : izakova2021

### mélatonine basse
> Sécrétion de mélatonine réduite en SPM → sommeil fragmenté, récupération moindre
- énergie      : -2
- humeur       : -3
- libido       : 0
- fatigue      : +4
- sensibilité  : 0
- stress       : +3
- douleurs     : 0
- irritabilité : +3
- type : inférée
- source_initiale : nexha2024

### température corporelle élevée
> Progestérone ↑ → température centrale +0,3-0,5°C → sommeil moins réparateur en phase lutéale
- énergie      : -3
- humeur       : 0
- libido       : 0
- fatigue      : +4
- sensibilité  : +2
- stress       : 0
- douleurs     : 0
- irritabilité : 0
- type : inférée
- source_initiale : nexha2024  ← corroboré par alzueta2023, baker2020, zhang2020

### chute d'œstrogène
> Chute prémenstruelle/menstruelle des œstrogènes → migraine cataméniale, vulnérabilité émotionnelle
- énergie      : 0
- humeur       : -2
- libido       : 0
- fatigue      : +2
- sensibilité  : +2
- stress       : 0
- douleurs     : +4
- irritabilité : 0
- type : inférée
- source_initiale : raffaelli2023  ← corroboré par handy2022

### sérotonine basse
> Activité sérotoninergique réduite en SPM (inférée de l'efficacité des ISRS) → humeur basse, irritabilité
- énergie      : 0
- humeur       : -3
- libido       : 0
- fatigue      : 0
- sensibilité  : 0
- stress       : +2
- douleurs     : 0
- irritabilité : +3
- type : inférée
- source_initiale : jespersen2024

### progestérone élevée
> Progestérone lutéale ↑ (via allopregnanolone, modulation GABA-A) → axe émotionnel : anxiété, irritabilité, sensibilité. Fatigue volontairement minimale (déjà portée par « dominance sympathique » en lutéale — anti double-comptage).
- énergie      : 0
- humeur       : -2
- libido       : 0
- fatigue      : +1
- sensibilité  : +2
- stress       : +3
- douleurs     : 0
- irritabilité : +3
- type : inférée
- source_initiale : doornweerd2025  ← corroboré par hantsoo2020, li2020, nillni2021

### inflammation / stress oxydatif
> Marqueurs inflammatoires ↑ / antioxydants ↓ possibles en SPM (preuve limitée, hétérogène)
- énergie      : 0
- humeur       : 0
- libido       : 0
- fatigue      : +2
- sensibilité  : +2
- stress       : 0
- douleurs     : +2
- irritabilité : 0
- type : inférée
- source_initiale : granda2021

---

## Signaux à documenter (identifiés, pas encore mappés)

- pic d'œstrogène
- pic de progestérone
- chute de progestérone
- pic de LH
- cortisol élevé
