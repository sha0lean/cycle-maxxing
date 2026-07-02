// « Hormone du jour » — dérive, pour un jour de cycle donné, l'état de chaque hormone
// (niveau + tendance) à partir des COURBES DE RÉFÉRENCE universelles (reference-curves.ts).
// Ce ne sont PAS les mesures de Julie : on lit « où en est une hormone-type à ce stade ».
//
// Niveau : relatif au max de CHAQUE série (les échelles diffèrent — LH pique à 95, FSH à ~45).
// Tendance : pente locale j-1 → j+1 (le cycle boucle via wrapCycleDay).

import { REFERENCE_CURVES, type CurvePoint } from '@/lib/reference-curves'
import { wrapCycleDay } from '@/lib/cycle'

export type HormoneLevel = 'bas' | 'moyen' | 'haut' | 'pic'
export type HormoneTrend = 'montee' | 'chute' | 'plateau'

export type HormoneDayState = {
  value: number // valeur normalisée 0-100 du jour
  ratio: number // value / max de la série (0-1) → niveau comparable entre hormones
  level: HormoneLevel
  trend: HormoneTrend
}

export type SeriesKey = keyof Omit<CurvePoint, 'day'>

// Max de chaque série sur le cycle de référence (calculé une fois).
const SERIES_MAX: Record<SeriesKey, number> = (() => {
  const keys: SeriesKey[] = ['oestrogene', 'progesterone', 'lh', 'fsh', 'bbt']
  const max = {} as Record<SeriesKey, number>
  for (const k of keys) max[k] = Math.max(...REFERENCE_CURVES.map((p) => p[k]))
  return max
})()

// Seuils de niveau, en fraction du max de la série.
const PIC = 0.85
const HAUT = 0.6
const MOYEN = 0.35
// Seuil de pente (en fraction du max) au-delà duquel on parle de montée/chute, sinon plateau.
const SLOPE = 0.08

function point(cycleDay: number): CurvePoint {
  return REFERENCE_CURVES[wrapCycleDay(cycleDay) - 1]
}

function levelFromRatio(ratio: number): HormoneLevel {
  if (ratio >= PIC) return 'pic'
  if (ratio >= HAUT) return 'haut'
  if (ratio >= MOYEN) return 'moyen'
  return 'bas'
}

function trendFromSlope(key: SeriesKey, cycleDay: number): HormoneTrend {
  const prev = point(cycleDay - 1)[key]
  const next = point(cycleDay + 1)[key]
  const slope = (next - prev) / SERIES_MAX[key]
  if (slope > SLOPE) return 'montee'
  if (slope < -SLOPE) return 'chute'
  return 'plateau'
}

// État d'une hormone au jour donné (jour de cycle absolu ou 1→27 : wrap géré).
export function getHormoneState(key: SeriesKey, cycleDay: number): HormoneDayState {
  const value = point(cycleDay)[key]
  const ratio = value / SERIES_MAX[key]
  return { value, ratio, level: levelFromRatio(ratio), trend: trendFromSlope(key, cycleDay) }
}
