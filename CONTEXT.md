# CONTEXT.md — Glossaire

> Glossaire pur. Termes métier uniquement.
> Pas de détail d'implémentation, pas de nom de fichier ou de colonne.
> Mise à jour inline au fil des sessions — jamais batcher.

---

- **Cycle** : séquence complète de 4 phases, de j1 (début des règles) au j1 suivant. Durée moyenne calculée sur les N derniers cycles.
- **j1** : premier jour des règles — point de référence absolu pour tous les calculs de phase.
- **j(N)** : numéro du jour dans le cycle en cours. j1 = règles démarrent. Pour un cycle de 27j, j13 = ovulation.
- **Phase** : une des 4 grandes périodes du cycle — Règles, Folliculaire, Ovulation, Lutéale (dont SPM).
- **Sous-phase** : subdivision d'une phase par tranche de jours (début / milieu / fin), chacune avec ses propres métriques et conseils.
- **SPM** : Syndrome Prémenstruel — dernière sous-phase de la phase Lutéale (j21-j27 environ). Pic de chute hormonale, émotions amplifiées. Urgence : critique.
- **Capteurs** : les 8 indicateurs quantitatifs sur 100 qui mesurent l'état physio-émotionnel de Julie à un instant du cycle — énergie, humeur, libido, fatigue, sensibilité, stress, douleurs, irritabilité. Anciennement appelés "Métriques".
- **Signaux** : variables biologiques ou physiologiques mesurées dans les sources scientifiques — ex. pic d'œstrogène, dominance parasympathique, FC au repos, cortisol. Les signaux influencent les capteurs (directement ou indirectement) et constituent le langage de traduction entre les articles et l'app.
- **Source** : article scientifique référencé dans le système — avec métadonnées (URL, type d'étude, niveau de preuve, domaines couverts) et claims extraits. Chaque source contribue à la provenance des capteurs.
- **Claim** : assertion précise extraite d'une source, exprimant l'impact d'un signal sur un ou plusieurs capteurs à une phase donnée.
- **Provenance** : historique traçable des contributions de chaque source à la valeur actuelle d'un capteur. Permet de savoir quelle source a fait passer un capteur de 50 à 70.
- **Claim en suspens** : claim qui n'a pas été appliqué (capé, modifié ou refusé) pour une raison documentée — incohérence de progression, pas assez de preuves, conflit avec une source de meilleur niveau. Stocké dans data/pending-claims.md. Réactivable si un futur article le corrobore avec un poids combiné suffisant.
- **Portée** : étendue temporelle couverte par un claim — cycle entier, phase, ou sous-phase. Quand deux claims couvrent le même signal+capteur, le plus précis (sous-phase) prend la priorité sur sa plage ; le moins précis couvre les plages non encore adressées.
- **Wiki** : encyclopédie intégrée à l'app composée de fiches capteur, fiches signal et fiches source, reliées par backlinks bidirectionnels.
- **Avatar** : représentation anime d'une personne (Julie, ou Remy en Easter egg) affichée dans l'app, déclinée en sprites selon l'état du cycle.
- **Image master** : image de référence figée d'un avatar, en pose neutre, dont dérivent tous les sprites — gabarit d'identité, d'échelle et de cadrage.
- **Sprite** : image d'un état de l'avatar, alignée sur l'image master (même baseline, même échelle) pour permettre l'animation par fondu entre états.
- **État (d'avatar)** : variante émotionnelle et posturale de l'avatar associée à un moment du cycle (ex. Endolorie, À cran). Ne change que l'expression, la posture, les props et la lumière — jamais l'identité.

---

## Notation des preuves

> Vocabulaire de pondération utilisé lors de l'ingestion d'une source. Source de vérité unique — le pipeline `ingest-source` s'y réfère.

- **Niveau de preuve** : qualité méthodologique d'une source, de 1 (meilleure) à 5 (plus faible) — 1=méta-analyse, 2=RCT, 3=cohorte, 4=cas-témoin, 5=opinion/blog.
- **Poids** : force de vote d'une source dans le calcul d'un capteur, de 0.1 à 1.0. Dérivé mécaniquement du niveau de preuve, puis ajusté selon la taille d'échantillon et le caractère inféré du claim.
- **Direct vs inféré** : un claim est *direct* si l'article a mesuré la variable, *inféré* s'il l'a déduite sans la mesurer. Un claim inféré voit son poids réduit de moitié.
- **Corroboration** : confirmation d'un claim faible par une seconde source indépendante. Les poids s'additionnent ; au-delà d'un seuil, un claim en suspens peut être réactivé.
- **Pondération** : combinaison de plusieurs sources sur un même capteur par moyenne pondérée par leurs poids. Une source fiable tire la valeur plus fort qu'une source faible.
- **Capping** (claim *capé*) : bridage volontaire d'un delta pour préserver la cohérence d'une courbe (ex. ne pas faire dépasser une sous-phase voisine). Le surplus est consigné, réactivable.
- **Double-comptage** : appliquer deux fois le même effet physiologique sous deux noms de signal différents. À détecter et refuser — sinon un capteur est biaisé deux fois pour une seule cause.
- **Source initiale** : première source à mapper un signal ; elle fige les coefficients de ce signal vers les capteurs. Réservée de préférence à une source de bon niveau.
- **Urgence** : niveau d'attention recommandé pour le partenaire à un jour donné — `normal`, `attention`, `critique`.
- **Domaine** : catégorie thématique de conseils qualitatifs — sport, nutrition, sommeil, intimité, communication, activités, santé, mental.
- **Fiabilité** : indicateur calculé depuis l'écart-type des cycles trackés. Augmente avec le nombre de cycles enregistrés. Cible : 6 cycles minimum.
- **Cycle moyen** : durée moyenne calculée sur les 6 derniers cycles, avec sous-pondération des outliers (coefficient 0.5).
- **Remy** : partenaire de Julie, utilisateur principal de l'app en v1. Consulte le dashboard quotidiennement le matin.
- **Julie** : femme suivie, paysagiste PACA, utilise Flo pour tracker son cycle. Utilisatrice potentielle en v2 (vue partagée lecture, mobile-first).
