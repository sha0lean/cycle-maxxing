# 07 — DECISIONS LOG

> **rôle** : archive des décisions architecturales difficiles à reverser.
> **contient** : entrées D_XXX avec contexte, alternatives rejetées, conséquences.
> **vital parce que** : sans ce log, les futures sessions répètent les mêmes débats.
> **critères D_XXX** : difficile à reverser + surprenant sans contexte + issu d'un vrai trade-off. Si un critère manque → pas d'entrée.

---

## Index

- [D_001](#d_001) — Architecture domaines : fichiers .md parsables (2026-06-24)
- [D_002](#d_002) — Séparation quantitatif / qualitatif (2026-06-24)
- [D_003](#d_003) — Deux événements trackés par cycle : j1 + fin des règles (2026-06-25)
- [D_004](#d_004) — Métriques hybrides : référence scientifique + couche personnelle optionnelle (2026-06-25)
- [D_005](#d_005) — Coefficients signal→capteur phase-dépendants à raffinement progressif (2026-06-25)
- [D_006](#d_006) — Données data/*.md consommées via codegen au build (2026-06-25)
- [D_007](#d_007) — Provenance par fichier source ; vue inverse différée au Wiki (2026-06-25)
- [D_008](#d_008) — Avatars : génération hors-repo, source compilée en un seul setup.md (2026-06-29)

---

### D_001
**Architecture domaines : fichiers .md parsables par l'app**

*24 juin 2026 — 11:00*

| | |
|---|---|
| **décision** | Un fichier `.md` par domaine qualitatif dans `data/domains/`, avec frontmatter YAML + sections par plage de jours libres. Parsé par `lib/domain-loader.ts` au runtime via `gray-matter`. |
| **justification** | Permet d'enrichir le contenu sans toucher au code — éditer un `.md` suffit, l'app se met à jour. Chaque domaine définit sa propre granularité (j13 seul possible, j5-j13 si identique). |
| **alternatives** | Objets TypeScript statiques — enrichissement = modification de code à chaque ajout. Un seul `phase-reference.md` monolithique — granularité forcée, non scalable. |
| **conséquences** | Dépendance `gray-matter` justifiée. Nécessite un loader robuste gérant les plages de jours et les chevauchements. Les domaines peuvent avoir des couvertures partielles (`status: draft`). |

---

### D_002
**Séparation données quantitatives / qualitatives**

*24 juin 2026 — 11:00*

| | |
|---|---|
| **décision** | `phase-reference.md` = source exclusive des 8 métriques chiffrées (stable, ne pas enrichir). `data/domains/*.md` = source exclusive des conseils qualitatifs (enrichissable librement). |
| **justification** | Métriques et conseils ont des rythmes d'évolution différents. Mélanger les deux crée un risque de régression sur les calculs numériques à chaque enrichissement de contenu. |
| **alternatives** | Tout dans `phase-reference.md` — situation initiale, validée comme insuffisante pour la granularité et le volume de conseils qualitatifs attendus. |
| **conséquences** | Deux loaders distincts. Nutrition et sport présents dans `phase-reference.md` sont à migrer vers `domains/nutrition.md` et `domains/sport.md` — ne pas dupliquer. |

---

### D_003
**Deux événements trackés par cycle : début et fin des règles**

*25 juin 2026 — 11:00*

| | |
|---|---|
| **décision** | Chaque cycle stocke deux dates confirmées confirmées par Remy : `j1` (début des règles) et `rulesEndDate` (fin des règles). Le `cycleEndDate` est rempli automatiquement au j1 suivant. |
| **justification** | Tracker seulement j1 = durée des règles figée sur la moyenne historique. Tracker aussi la fin des règles permet de calculer deux moyennes indépendantes (durée cycle + durée règles) et d'affiner les prédictions progressivement. |
| **alternatives** | Tracker uniquement j1 — simple mais insuffisant : si les règles durent 6j au lieu de 4j, la folliculaire prédit démarre 2 jours trop tôt. Tracker davantage (ovulation confirmée…) — possible en v2, pas justifié en v1. |
| **conséquences** | Settings expose deux boutons. Statistiques affichent deux moyennes + écart-type. Cible : 6 cycles avec les deux dates confirmées pour atteindre la fiabilité maximale. |

---

### D_004
**Métriques hybrides : référence scientifique + couche personnelle optionnelle**

*25 juin 2026 — 11:00*

| | |
|---|---|
| **décision** | Chaque métrique a deux couches indépendantes : valeur de référence (phase-reference.md, statique) + valeur personnelle (DayLog optionnel). L'affichage montre la moyenne personnelle comme barre principale + la référence comme marqueur fixe. Sans saisie : la référence est la valeur affichée. Vue collaborative unique en v1 — pas de distinction auteur. |
| **justification** | L'app est utile dès le premier jour sans aucune saisie (référence scientifique). Elle s'améliore progressivement au fil des cycles loggés. Le marqueur de référence préserve toujours la base scientifique même quand Julie s'en écarte. |
| **alternatives** | Valeurs 100% statiques — patterns inutiles, pas d'apprentissage. Valeurs 100% loggées — app inutilisable sans saisie quotidienne, friction trop haute. |
| **conséquences** | Deux types de données à gérer (phase-reference + DayLog). Vue Patterns devient utile dès 2 cycles loggés. La distinction Remy/Julie dans les logs est ignorée en v1 — à reconsidérer en v2 si Mode Julie est implémenté. |

---

### D_005
**Coefficients signal→capteur phase-dépendants à raffinement progressif**

*25 juin 2026 — en session*

| | |
|---|---|
| **décision** | L'impact d'un signal sur un capteur n'est pas un coefficient fixe — il dépend de la phase et se raffine au fil des articles ingérés. Chaque claim a une **portée** (cycle entier / phase / sous-phase). Quand deux claims couvrent le même signal+capteur, le plus précis prend la priorité sur sa sous-phase, le plus large couvre les sous-phases non encore adressées. |
| **justification** | Un même signal (ex. cortisol élevé) a un impact mesuré différent en SPM début vs SPM critique. Figer un coefficient unique efface cette nuance. Le raffinement progressif permet de partir de données grossières et de les préciser à mesure que des articles plus granulaires sont intégrés. |
| **alternatives** | Coefficient fixe par signal — simple mais inexact : ignore que le seuil de tolérance au stress est différent en j21 vs j25. Coefficient fixe par phase défini manuellement — possible mais statique, ne bénéficie pas des nouvelles sources. |
| **conséquences** | Les claims stockent leur portée temporelle (phase ou sous-phase). Le moteur d'agrégation résout les conflits de portée par priorité décroissante (sous-phase > phase > cycle). Les valeurs dans phase-reference.md deviennent progressivement plus précises à chaque article ingéré. |

---

### D_006
**Données `data/*.md` consommées via codegen au build**

*25 juin 2026 — en session*

| | |
|---|---|
| **décision** | Les `.md` de `data/` (racine) restent la source éditoriale unique. Un script `scripts/gen-data.mts` les parse et génère `app/lib/generated/*.ts` typés, importés statiquement par l'app. La génération est branchée sur `predev` + `prebuild` (automatique, transparente). |
| **justification** | La Vue Frise a besoin des données côté client (scrub interactif). `data/` vit hors de `app/` (avec `docs/`) donc inaccessible en lecture runtime sur Vercel. Le codegen produit un artefact déployable, typé, importable côté client, sans lecture fichier au runtime. La source unique reste les `.md` édités par `ingest-source`. |
| **alternatives** | Lecture serveur runtime (`fs` + props) — impose de déplacer `data/` dans `app/` et de parser à chaque requête, plus fragile. Données TS statiques écrites à la main — désync garantie avec `ingest-source` qui édite les `.md`. |
| **conséquences** | `app/lib/generated/` est committé mais ne s'édite jamais à la main (régénéré). `phase-reference.md` a un format custom (sections `##`/`###` + blocs chiffrés) parsé sans `gray-matter` ; les `domains/*.md` à frontmatter utiliseront `gray-matter`. Toute évolution du format `.md` impose d'adapter le parser. |

---

### D_007
**Provenance par fichier source ; vue inverse différée au Wiki**

*25 juin 2026 — en session*

| | |
|---|---|
| **décision** | Chaque source ingérée = **un fichier indépendant** dans `data/sources/`, portant ses propres claims et l'impact (avant→après) sur chaque capteur. `signal-mapping.md` (recettes signal→capteurs partagées) et `pending-claims.md` (journal des claims capés/refusés) complètent. `phase-reference.md` ne stocke que les **valeurs courantes**, sans historique inline. La traçabilité inverse **capteur → sources** est reconstructible (grep) mais **non matérialisée** : elle sera fournie par le Wiki. |
| **justification** | La provenance par fichier source rend chaque article auditable et réactivable isolément, et constitue la **brique de backlink du futur Wiki**. Matérialiser un index inverse par capteur dès maintenant (2 sources) serait de la sur-ingénierie et un second endroit à garder synchrone. |
| **alternatives** | Index central de provenance par capteur — utile à grande échelle mais redondant et fragile (double source de vérité) tant que le volume est faible. Historique inline dans `phase-reference.md` — pollue la couche quantitative et casse le codegen/parsing. Fusionner plusieurs articles par fichier — détruit les backlinks et l'auditabilité par source. |
| **conséquences** | L'audit d'une valeur de capteur passe aujourd'hui par un grep des fichiers sources ; le Wiki (backlog `[?]`) portera la vue inverse. Les dumps de recherche groupés (`data/sources/_research-*.md`, préfixe `_`) sont tolérés comme matière qualitative **hors-système**, à éclater en fichiers individuels au moment de l'ingestion. |

---

### D_008
**Avatars : génération hors-repo, source compilée en un seul `setup.md`**

*29 juin 2026 — 05:51*

| | |
|---|---|
| **décision** | La génération d'images d'avatar se fait **hors-repo** (ChatGPT/Projets), pas dans Claude Code. Le repo (`prompts/avatar/`) stocke **2 fichiers par perso** : `bible.json` (identité structurée, surface d'édition de Claude) + `setup.md` (sortie compilée : master prompt + negative + identité figée + alignement sprite + table des états). Un `_system/kit.json` partagé porte style + cadrage + negatives. Les **états sont des deltas** (expression/posture/props/lumière) — ils ne répètent jamais l'identité, portée par l'**image master** générée une fois et servant de gabarit fixe. Frontière : un tweak **éphémère** (pose d'un shot) se fait direct dans ChatGPT et n'est jamais persisté ; un changement **canonique** passe par `bible.json` → recompile `setup.md` → re-upload. |
| **justification** | L'outil de génération vit en ligne et n'accepte pas de pipeline ; le seul levier est « setup une fois, puis prompts courts ». Un fichier compilé unique par perso supprime la répétition (ré-uploader une seule carte d'identité), et le JSON-source garde les overrides traçables (cf. saga cheveux/poitrine). Les états-deltas évitent la duplication d'identité qui rendait les anciens fichiers d'état périmés et contradictoires. |
| **alternatives** | **6 prompts-extracteurs** (`extract-style`, `extract-bible`…) — sur-ingénierie : l'extraction se fait en conversation, ces fichiers étaient de la doc d'un process déjà naturel. **Markdown unique éditable à la main** — perd la rigueur des overrides/negatives (3 endroits à synchroniser). **10 fichiers d'état autonomes** répétant l'identité — duplication + dérive (chaque fichier re-décrivait cheveux/tenue, et tous étaient périmés). **Sorties éclatées** (`master-prompt.txt` + `negative.txt` séparés) — multipliait les fichiers à uploader. |
| **conséquences** | Claude édite `bible.json` et **recompile** `setup.md` à la demande ; l'utilisateur n'ouvre jamais le JSON ni `kit.json`. Tout nouveau perso = copie de `_template/bible.template.json`. Le kit est **portable** : copier `prompts/avatar/` dans un autre projet, n'adapter que `kit.json`. Pas de codegen automatisé (compilation manuelle par Claude, YAGNI tant qu'il n'y a que 1-2 persos). |
