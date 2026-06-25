// Résolution calendaire (B-001) : mappe une date vers son jour de cycle, sa phase et son statut.
// Les jours passés/présents s'appuient sur les cycles réels ; les jours futurs sont projetés
// à partir du cycle actif et de la durée moyenne observée — d'où le flag `predicted`.

import { cycleDayFromDate, findReferenceEntry } from '@/lib/cycle'
import { averageCycleLength } from '@/lib/cycle-stats'
import type { CycleEntry, PhaseId } from '@/lib/types'

// Durée de cycle de référence (Julie) quand aucune moyenne n'est disponible.
const FALLBACK_CYCLE_LENGTH = 27

export type CalendarDay = {
  date: Date
  inMonth: boolean // appartient au mois affiché (vs débordement des semaines)
  isToday: boolean
  dayNumber: number | null // j(N) de cycle, null avant le tout premier cycle connu
  phase: PhaseId | null
  predicted: boolean // jour futur (projeté) → à afficher atténué
}

// Index calendaire d'une date (jour entier, fuseau ignoré) pour comparer sans les heures.
function dayIndex(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
}

function sameDay(a: Date, b: Date): boolean {
  return dayIndex(a) === dayIndex(b)
}

// Cycle au plus grand j1 antérieur ou égal à la date. null si la date précède le premier cycle.
function cycleFor(sorted: CycleEntry[], date: Date): CycleEntry | null {
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (cycleDayFromDate(sorted[i].j1, date) >= 1) return sorted[i]
  }
  return null
}

// Résout une date isolée. `today` sépare le réel (passé/présent) du prédit (futur).
export function resolveCalendarDay(
  cycles: CycleEntry[],
  date: Date,
  today: Date = new Date(),
): Pick<CalendarDay, 'dayNumber' | 'phase' | 'predicted'> {
  const sorted = [...cycles].sort((a, b) => a.j1.getTime() - b.j1.getTime())
  const cycle = cycleFor(sorted, date)
  if (!cycle) return { dayNumber: null, phase: null, predicted: false }

  const raw = cycleDayFromDate(cycle.j1, date) // >= 1
  const predicted = dayIndex(date) > dayIndex(today)

  // Jours réels (passé/présent) : j(N) brut — le cycle actif peut dépasser la moyenne
  // (findReferenceEntry clampe alors en SPM). Jours futurs : on projette des cycles
  // successifs de durée moyenne, qui repartent à j1 → le mois à venir n'est pas tout en SPM.
  let dayNumber = raw
  if (predicted && cycle === sorted[sorted.length - 1]) {
    const len = averageCycleLength(cycles) ?? FALLBACK_CYCLE_LENGTH
    dayNumber = ((raw - 1) % len) + 1
  }

  return { dayNumber, phase: findReferenceEntry(dayNumber).phase, predicted }
}

// Grille d'un mois : 6 semaines × 7 jours (lundi → dimanche), débordement des mois adjacents inclus.
export function monthMatrix(
  cycles: CycleEntry[],
  year: number,
  month: number, // 0-11
  today: Date = new Date(),
): CalendarDay[][] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // lundi = 0 … dimanche = 6
  const start = new Date(year, month, 1 - offset)

  const weeks: CalendarDay[][] = []
  for (let w = 0; w < 6; w++) {
    const week: CalendarDay[] = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d)
      const { dayNumber, phase, predicted } = resolveCalendarDay(cycles, date, today)
      week.push({
        date,
        inMonth: date.getMonth() === month,
        isToday: sameDay(date, today),
        dayNumber,
        phase,
        predicted,
      })
    }
    weeks.push(week)
  }
  return weeks
}
