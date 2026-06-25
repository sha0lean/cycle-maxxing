// Calculs de phase du cycle depuis le jour 1 des règles.
// Couche quantitative : consomme le référentiel généré (D_006) sans lecture fichier runtime.

import { PHASE_REFERENCE } from '@/lib/generated/phase-reference'
import { METRIC_KEYS } from '@/lib/types'
import type { DayInfo, DayLog, Metrics, PhaseId, PhaseReferenceEntry } from '@/lib/types'

const MS_PER_DAY = 86_400_000

// Numéro de jour dans le cycle (j1 = 1), basé sur la date calendaire — heures ignorées.
export function cycleDayFromDate(j1: Date, date: Date = new Date()): number {
  const start = Date.UTC(j1.getFullYear(), j1.getMonth(), j1.getDate())
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((now - start) / MS_PER_DAY) + 1
}

// Sous-phase de référence couvrant ce jour. Hors du cycle de référence (27j) :
// avant j1 → première sous-phase, au-delà de j27 → dernière (SPM critique) jusqu'aux prochaines règles.
export function findReferenceEntry(dayNumber: number): PhaseReferenceEntry {
  const entry = PHASE_REFERENCE.find((e) => dayNumber >= e.dayStart && dayNumber <= e.dayEnd)
  if (entry) return entry
  return dayNumber < PHASE_REFERENCE[0].dayStart
    ? PHASE_REFERENCE[0]
    : PHASE_REFERENCE[PHASE_REFERENCE.length - 1]
}

// Fusionne référence + saisie personnelle : chaque métrique saisie écrase sa référence.
function mergeMetrics(reference: Metrics, personal?: Partial<Metrics>): Metrics {
  if (!personal) return reference
  const merged = { ...reference }
  for (const key of METRIC_KEYS) {
    const value = personal[key]
    if (typeof value === 'number') merged[key] = value
  }
  return merged
}

// Moyenne des saisies personnelles pour un j(N) donné, à travers tous les cycles loggés.
// Retourne undefined si aucune saisie — l'app retombe alors sur la référence seule.
export function averageDayLogs(logs: DayLog[], dayNumber: number): Partial<Metrics> | undefined {
  const relevant = logs.filter((l) => l.dayNumber === dayNumber)
  if (relevant.length === 0) return undefined

  const avg: Partial<Metrics> = {}
  for (const key of METRIC_KEYS) {
    const values = relevant
      .map((l) => l.metrics[key])
      .filter((v): v is number => typeof v === 'number')
    if (values.length > 0) {
      avg[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    }
  }
  return Object.keys(avg).length > 0 ? avg : undefined
}

// Vue complète d'un jour, consommée par l'UI (jauges, panel, Frise).
export function getDayInfo(dayNumber: number, personalMetrics?: Partial<Metrics>): DayInfo {
  const ref = findReferenceEntry(dayNumber)
  const hasPersonal =
    !!personalMetrics && METRIC_KEYS.some((k) => typeof personalMetrics[k] === 'number')

  return {
    dayNumber,
    phase: ref.phase,
    subPhase: ref.id,
    urgence: ref.urgence,
    referenceMetrics: ref.metrics,
    personalMetrics: hasPersonal ? personalMetrics : undefined,
    displayMetrics: mergeMetrics(ref.metrics, personalMetrics),
  }
}

// Phase courante à une date donnée (raccourci pour le header / badges).
export function getCurrentPhase(j1: Date, date: Date = new Date()): PhaseId {
  return findReferenceEntry(cycleDayFromDate(j1, date)).phase
}

// Plages contiguës de chaque phase sur le cycle de référence (pour les bandes de la Frise).
// Fusionne les sous-phases successives d'une même phase. PHASE_REFERENCE est ordonné par jour.
export function getPhaseSpans(): { phase: PhaseId; start: number; end: number }[] {
  const spans: { phase: PhaseId; start: number; end: number }[] = []
  for (const e of PHASE_REFERENCE) {
    const last = spans[spans.length - 1]
    if (last && last.phase === e.phase) last.end = e.dayEnd
    else spans.push({ phase: e.phase, start: e.dayStart, end: e.dayEnd })
  }
  return spans
}
