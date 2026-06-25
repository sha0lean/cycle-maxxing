import { describe, expect, it } from 'vitest'
import { resolveCalendarDay, monthMatrix } from '@/lib/calendar'
import type { CycleEntry } from '@/lib/types'

// Deux cycles : un terminé (durée 24j → moyenne = 24), un actif depuis le 31 mai.
const cycles: CycleEntry[] = [
  { id: 'c1', j1: new Date(2026, 4, 7), cycleEndDate: new Date(2026, 4, 31) },
  { id: 'c2', j1: new Date(2026, 4, 31) },
]
const today = new Date(2026, 5, 25) // 25 juin 2026 → cycle actif j26

describe('resolveCalendarDay', () => {
  it('mappe une date du cycle actif vers son j(N)', () => {
    const r = resolveCalendarDay(cycles, today, today)
    expect(r.dayNumber).toBe(26)
    expect(r.predicted).toBe(false)
  })

  it('mappe une date d’un cycle passé sans projection', () => {
    const r = resolveCalendarDay(cycles, new Date(2026, 4, 7), today) // j1 du cycle 1
    expect(r.dayNumber).toBe(1)
    expect(r.phase).toBe('regles')
    expect(r.predicted).toBe(false)
  })

  it('garde le j(N) brut pour un jour réel au-delà de la durée moyenne', () => {
    // 24 juin = 24 jours après le j1 actif (31 mai) → j25 réel, pas de reboot (passé).
    const r = resolveCalendarDay(cycles, new Date(2026, 5, 24), today)
    expect(r.dayNumber).toBe(25)
    expect(r.predicted).toBe(false)
  })

  it('projette les jours futurs en repartant à j1 (cycle suivant fictif)', () => {
    // moyenne = 24j. 26 juin = 26 jours après le 31 mai → raw=27 → (27-1)%24+1 = 3.
    const r = resolveCalendarDay(cycles, new Date(2026, 5, 26), today)
    expect(r.dayNumber).toBe(3)
    expect(r.predicted).toBe(true)
  })

  it('retourne null avant le tout premier cycle connu', () => {
    const r = resolveCalendarDay(cycles, new Date(2026, 3, 1), today) // 1 avril, avant le 7 mai
    expect(r.dayNumber).toBeNull()
    expect(r.phase).toBeNull()
  })
})

describe('monthMatrix', () => {
  it('produit 6 semaines de 7 jours', () => {
    const grid = monthMatrix(cycles, 2026, 5, today)
    expect(grid).toHaveLength(6)
    for (const week of grid) expect(week).toHaveLength(7)
  })

  it('commence la semaine au lundi', () => {
    // 1er juin 2026 est un lundi → première cellule = 1er juin, inMonth.
    const grid = monthMatrix(cycles, 2026, 5, today)
    const firstCell = grid[0][0]
    expect(firstCell.date.getDate()).toBe(1)
    expect(firstCell.date.getMonth()).toBe(5)
    expect(firstCell.inMonth).toBe(true)
  })

  it('marque aujourd’hui', () => {
    const grid = monthMatrix(cycles, 2026, 5, today)
    const flat = grid.flat()
    const todayCell = flat.find((c) => c.isToday)
    expect(todayCell?.date.getDate()).toBe(25)
    expect(todayCell?.dayNumber).toBe(26)
  })
})
