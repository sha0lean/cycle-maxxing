// Calculs de phase du cycle depuis le jour 1 des règles.
// Couche quantitative : consomme le référentiel généré (D_006) sans lecture fichier runtime.

import { PHASE_REFERENCE } from '@/lib/generated/phase-reference'
import { METRIC_KEYS } from '@/lib/types'
import type { DayInfo, DayLog, Metrics, PhaseId, PhaseReferenceEntry } from '@/lib/types'

const MS_PER_DAY = 86_400_000

// Longueur du cycle de référence (dernier jour couvert par le référentiel de phases).
export const CYCLE_REF_LENGTH = PHASE_REFERENCE[PHASE_REFERENCE.length - 1].dayEnd

// Replie un jour absolu (jours depuis j1, sans plafond, éventuellement négatif) sur 1..len.
// Permet de boucler la frise d'un cycle au suivant sans rupture.
export function wrapCycleDay(day: number, len: number = CYCLE_REF_LENGTH): number {
  return (((day - 1) % len) + len) % len + 1
}

// Numéro de jour dans le cycle (j1 = 1), basé sur la date calendaire — heures ignorées.
export function cycleDayFromDate(j1: Date, date: Date = new Date()): number {
  const start = Date.UTC(j1.getFullYear(), j1.getMonth(), j1.getDate())
  const now = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((now - start) / MS_PER_DAY) + 1
}

// Ancrage de l'ovulation dans le référentiel (cf. en-tête phase-reference.md : « Ovulation : j13 »).
const REF_OVULATION_DAY = 13

// Convertit un jour réel (cycle de durée quelconque) en jour du référentiel 27j (B-011).
// La phase lutéale a une durée quasi constante (~14j) → elle glisse avec l'ovulation ;
// la première moitié (règles + folliculaire) s'étire ou se comprime. Défaut : identité (27j),
// donc comportement inchangé tant qu'aucune durée réelle n'est fournie.
export function toReferenceDay(realDay: number, cycleLength: number = CYCLE_REF_LENGTH): number {
  if (cycleLength === CYCLE_REF_LENGTH) return realDay
  const lutealLength = CYCLE_REF_LENGTH - REF_OVULATION_DAY // 14 jours, supposés constants
  const realOvulation = Math.max(1, Math.round(cycleLength - lutealLength))
  // Post-ovulation : glissement fixe (la lutéale conserve sa durée de référence).
  if (realDay > realOvulation) return realDay - (realOvulation - REF_OVULATION_DAY)
  // Pré-ovulation : étirement/compression linéaire de la première moitié vers [1..13].
  return Math.max(1, Math.round((realDay / realOvulation) * REF_OVULATION_DAY))
}

// Sous-phase de référence couvrant ce jour. `cycleLength` ajuste le découpage à la durée réelle
// du cycle de Julie (B-011). Hors du cycle de référence (27j) : avant j1 → première sous-phase,
// au-delà du dernier jour → dernière (SPM critique) jusqu'aux prochaines règles.
export function findReferenceEntry(
  dayNumber: number,
  cycleLength: number = CYCLE_REF_LENGTH,
): PhaseReferenceEntry {
  const refDay = toReferenceDay(dayNumber, cycleLength)
  const entry = PHASE_REFERENCE.find((e) => refDay >= e.dayStart && refDay <= e.dayEnd)
  if (entry) return entry
  return refDay < PHASE_REFERENCE[0].dayStart
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
export function getDayInfo(
  dayNumber: number,
  personalMetrics?: Partial<Metrics>,
  cycleLength: number = CYCLE_REF_LENGTH,
): DayInfo {
  const ref = findReferenceEntry(dayNumber, cycleLength)
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
export function getCurrentPhase(
  j1: Date,
  date: Date = new Date(),
  cycleLength: number = CYCLE_REF_LENGTH,
): PhaseId {
  return findReferenceEntry(cycleDayFromDate(j1, date), cycleLength).phase
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
