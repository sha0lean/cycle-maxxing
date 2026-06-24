// Modèle de données central de Cycle Maxxing.
// Source de vérité : docs/05-data-model.md · data/phase-reference.md
// Architecture deux couches : quantitatif (phase-reference) / qualitatif (domains).

// ─────────────────────────────────────────────────────────────
// Métriques — les 8 jauges, toutes sur 100
// ─────────────────────────────────────────────────────────────

export type Metrics = {
  energie: number
  humeur: number
  libido: number
  fatigue: number
  sensibilite: number
  stress: number
  douleurs: number
  irritabilite: number
}

// Clé de métrique — utile pour itérer sur les 8 jauges sans répéter les noms.
export type MetricKey = keyof Metrics

// Ordre d'affichage canonique des jauges dans le panel.
export const METRIC_KEYS: readonly MetricKey[] = [
  'energie',
  'humeur',
  'libido',
  'fatigue',
  'sensibilite',
  'stress',
  'douleurs',
  'irritabilite',
] as const

// ─────────────────────────────────────────────────────────────
// Phases du cycle
// ─────────────────────────────────────────────────────────────

// 5 phases logiques. Lutéale et SPM séparées car le ressenti diffère radicalement.
export type PhaseId = 'regles' | 'folliculaire' | 'ovulation' | 'luteale' | 'spm'

// Niveau de vigilance affiché — pilote le code couleur et les flags de la Frise.
export type UrgenceLevel = 'normal' | 'attention' | 'critique'

// ─────────────────────────────────────────────────────────────
// Couche 1 — Référentiel quantitatif (phase-reference.md parsé)
// ─────────────────────────────────────────────────────────────

// Une sous-phase du référentiel scientifique (ex : "j1-j2", "j13").
// Valeurs stables, identiques pour tous les cycles — jamais modifiées par la saisie.
export type PhaseReferenceEntry = {
  id: string // identifiant de sous-phase, ex : "j1-j2" | "j13"
  label: string // libellé affiché, ex : "Début" | "Pic absolu"
  phase: PhaseId
  dayStart: number // borne basse incluse, sur le cycle de référence (27j)
  dayEnd: number // borne haute incluse
  urgence: UrgenceLevel
  metrics: Metrics
  keywords: string[] // mots-clés d'ambiance affichés dans le panel
  resume: string // une phrase de synthèse de la sous-phase
}

// ─────────────────────────────────────────────────────────────
// Données trackées — saisies utilisateur persistées (localStorage v1)
// ─────────────────────────────────────────────────────────────

export type CycleEntry = {
  id: string
  j1: Date // début des règles — obligatoire, déclenche le recalcul
  rulesEndDate: Date // fin des règles — marquée manuellement, affine la durée moyenne
  cycleEndDate?: Date // rempli automatiquement au j1 du cycle suivant
}

// Saisie personnelle d'un jour donné. Un seul dashboard collaboratif en v1 :
// pas de distinction d'auteur (Remy/Julie). metrics partielles = seules les jauges ajustées.
export type DayLog = {
  cycleId: string
  dayNumber: number // j(N) dans le cycle
  metrics: Partial<Metrics>
  loggedAt: Date
}

// ─────────────────────────────────────────────────────────────
// Sortie calculée — ce que l'UI consomme pour un jour donné
// ─────────────────────────────────────────────────────────────

export type DayInfo = {
  dayNumber: number
  phase: PhaseId
  subPhase: string // id de la sous-phase de référence, ex : "j1-j2"
  urgence: UrgenceLevel
  referenceMetrics: Metrics // couche scientifique, toujours présente
  personalMetrics?: Partial<Metrics> // moyenne des DayLogs pour ce j(N), si saisie
  displayMetrics: Metrics // personnel si dispo, sinon référence
}
