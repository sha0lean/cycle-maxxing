# 05 — DATA MODEL

> **rôle** : définit comment les données du cycle et les conseils sont structurés et consommés par l'app.
> **contient** : architecture deux couches (quantitatif / qualitatif), schéma des fichiers domaine, rôle du domain loader.
> **vital parce que** : toute feature qui affiche du contenu par phase dépend de cette architecture — la comprendre évite de dupliquer ou casser les données.
> **à lire avant de** : ajouter un domaine, modifier phase-reference.md, coder le panel stats.
>
> Décisions architecturales : [D_001](07-decisions-log.md#d_001) · [D_002](07-decisions-log.md#d_002) · [D_003](07-decisions-log.md#d_003)

---

## Architecture en deux couches

```
Couche 1 — Quantitatif          Couche 2 — Qualitatif
data/phase-reference.md         data/domains/*.md
────────────────────────        ──────────────────────
8 métriques sur 100             Conseils par domaine
Données stables                 Enrichissables librement
Parsées par lib/cycle.ts        Parsées par lib/domain-loader.ts
```

Les deux couches sont indépendantes. Ne pas mélanger les responsabilités.

---

## Modèle cycle — données trackées

```typescript
type CycleEntry = {
  id: string
  j1: Date              // début des règles — obligatoire, déclenche le recalcul
  rulesEndDate?: Date   // fin des règles — optionnelle jusqu'au marquage manuel (D_003)
  cycleEndDate?: Date   // rempli automatiquement au j1 suivant
}
```

---

## Métriques — modèle hybride référence + personnel

Les 8 métriques fonctionnent sur deux couches indépendantes.

**Couche référence (toujours présente)**
Valeurs issues de `phase-reference.md` — base scientifique, même pour tous les cycles. Jamais modifiée par la saisie utilisateur.

**Couche personnelle (optionnelle)**
Saisies manuelles sur un jour donné. Un seul dashboard collaboratif en v1 — pas de distinction auteur (Remy/Julie).

```typescript
type DayLog = {
  cycleId: string
  dayNumber: number          // j(N) dans le cycle
  metrics: Partial<Metrics>  // seulement les métriques ajustées
  loggedAt: Date
}

type Metrics = {
  energie: number      // 0-100
  humeur: number
  libido: number
  fatigue: number
  sensibilite: number
  stress: number
  douleurs: number
  irritabilite: number
}
```

**Calcul affiché pour chaque métrique :**

```
Si DayLog existe pour ce j(N) sur plusieurs cycles :
  → afficher moyenne(valeurs loggées) comme barre principale
  → afficher valeur phase-reference.md comme marqueur fixe

Si aucun DayLog :
  → afficher valeur phase-reference.md comme barre principale
  → pas de marqueur (référence = valeur affichée)
```

**Sur les jauges :** barre principale (réalité de Julie) + marqueur visuel discret (référence scientifique). Toujours les deux dès qu'une valeur personnelle existe.

**Deux boutons dans l'app :**
- "Les règles ont commencé aujourd'hui" → crée un nouveau CycleEntry, clôture le précédent
- "Les règles sont terminées aujourd'hui" → rempli rulesEndDate du cycle en cours

**Statistiques calculées depuis l'historique :**

| Stat | Calcul | Usage |
|---|---|---|
| Durée moyenne du cycle | moyenne(j1→j1 suivant) sur 6 derniers | Prédire la prochaine ovulation et SPM |
| Durée moyenne des règles | moyenne(j1→rulesEndDate) sur 6 derniers | Prédire quand la folliculaire commence |
| Écart-type cycle | std(durées) | Indicateur de fiabilité affiché |
| Outliers | durée > moyenne ± 2σ | Sous-pondérés (coefficient 0.5) |

Cible : 6 cycles avec j1 + rulesEndDate confirmés pour atteindre la fiabilité maximale.

---

## Couche 1 — phase-reference.md

Contient les 8 métriques numériques par sous-phase :

```
energie · humeur · libido · fatigue · sensibilite · stress · douleurs · irritabilite
```

Ces valeurs alimentent les jauges et graphiques de l'app. **Ne pas y ajouter du contenu qualitatif.**

---

## Couche 2 — Fichiers domaine

Un fichier par domaine dans `data/domains/`. Chaque fichier suit ce schéma strict :

```yaml
---
domain: sommeil          # identifiant kebab-case
label: Sommeil           # nom affiché dans l'app
status: draft            # draft | reviewed | maîtrisé
coverage: 3/8            # sous-phases documentées / total sous-phases
sources: faibles         # aucune | faibles | solides
enrichir: oui            # oui | non — indique si besoin de recherche supplémentaire
---

## j1-j4 — Règles
conseil: Elle dort beaucoup — ne pas la déranger le matin.
faire: [laisser dormir, blackout curtains, tisane verveine]
éviter: [réveils tôt, bruits, activité tardive]

## j5-j13 — Folliculaire + Ovulation
conseil: Sommeil de qualité, endormissement facile.
faire: [activité physique le soir possible, routine normale]
éviter: []

## j21-j27 — SPM
conseil: Sommeil perturbé, réveils nocturnes possibles.
faire: [magnésium le soir, chambre fraîche, pas d'écrans après 21h]
éviter: [alcool, caféine après 14h, discussions stressantes le soir]
```

**Granularité libre** : j13 seul si besoin, j5-j13 si identique sur toute la plage.
Le loader résout les chevauchements en prenant la règle la plus spécifique (plage la plus courte).

---

## Domain loader

`lib/domain-loader.ts` — couche de séparation entre les fichiers markdown et l'app.

**Responsabilité** : lire un `.md`, extraire les entrées correspondant au j(N) courant, retourner un objet TypeScript consommable par les composants.

**Dépendance** : `gray-matter` (~2KB, zéro dépendance transitive) — parse le frontmatter YAML.

---

## Domaines à créer

| Domaine | Fichier cible | Status | Enrichir |
|---|---|---|---|
| Sport | `domains/sport.md` | À migrer depuis phase-reference | Non |
| Nutrition | `domains/nutrition.md` | À migrer depuis phase-reference | Non |
| Intimité | `domains/intimite.md` | À créer | Oui |
| Communication couple | `domains/communication.md` | À créer | Oui |
| Activités ensemble | `domains/activites.md` | À créer | Oui |
| Sommeil | `domains/sommeil.md` | À créer | Oui |
| Santé pratique | `domains/sante.md` | À créer | Oui |
| Mental / cognitif | `domains/mental.md` | À créer | Oui |
