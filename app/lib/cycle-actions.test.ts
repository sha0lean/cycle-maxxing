import { describe, it, expect } from 'vitest'
import {
  findActiveCycle,
  startNewCycle,
  markRulesEnded,
  upsertDayLog,
} from '@/lib/cycle-actions'
import type { CycleEntry, DayLog } from '@/lib/types'

function baseCycles(): CycleEntry[] {
  return [
    { id: 'c1', j1: new Date(2026, 4, 7), rulesEndDate: new Date(2026, 4, 10), cycleEndDate: new Date(2026, 4, 31) },
    { id: 'c2', j1: new Date(2026, 4, 31), rulesEndDate: new Date(2026, 5, 3) }, // actif
  ]
}

describe('findActiveCycle', () => {
  it('retourne le cycle sans cycleEndDate', () => {
    expect(findActiveCycle(baseCycles())?.id).toBe('c2')
  })

  it('retourne undefined si tous les cycles sont clos', () => {
    const closed = baseCycles().map((c) => ({ ...c, cycleEndDate: c.cycleEndDate ?? new Date() }))
    expect(findActiveCycle(closed)).toBeUndefined()
  })
})

describe('startNewCycle', () => {
  it('clôture le cycle actif au nouveau j1 et en ouvre un nouveau', () => {
    const j1 = new Date(2026, 5, 27)
    const next = startNewCycle(baseCycles(), j1)

    expect(next).toHaveLength(3)
    const closed = next.find((c) => c.id === 'c2')
    expect(closed?.cycleEndDate).toEqual(j1)

    const fresh = next[next.length - 1]
    expect(fresh.j1).toEqual(j1)
    expect(fresh.cycleEndDate).toBeUndefined()
    expect(fresh.rulesEndDate).toBeUndefined()
    expect(fresh.id).toBeTruthy()
  })

  it('ne modifie pas le tableau source (immutable)', () => {
    const cycles = baseCycles()
    startNewCycle(cycles, new Date(2026, 5, 27))
    expect(cycles).toHaveLength(2)
  })
})

describe('markRulesEnded', () => {
  it('renseigne rulesEndDate du cycle actif uniquement', () => {
    const active: CycleEntry[] = [{ id: 'c3', j1: new Date(2026, 5, 27) }]
    const date = new Date(2026, 5, 30)
    const next = markRulesEnded(active, date)
    expect(next[0].rulesEndDate).toEqual(date)
  })

  it('retourne l’historique inchangé sans cycle actif', () => {
    const closed: CycleEntry[] = [
      { id: 'c1', j1: new Date(2026, 4, 7), cycleEndDate: new Date(2026, 4, 31) },
    ]
    expect(markRulesEnded(closed, new Date())).toBe(closed)
  })
})

describe('upsertDayLog', () => {
  const log = (dayNumber: number, energie: number): DayLog => ({
    cycleId: 'c2',
    dayNumber,
    metrics: { energie },
    loggedAt: new Date(),
  })

  it('ajoute une saisie inexistante', () => {
    const next = upsertDayLog([], log(5, 50))
    expect(next).toHaveLength(1)
  })

  it('remplace la saisie du même cycle + même jour', () => {
    const next = upsertDayLog([log(5, 50)], log(5, 80))
    expect(next).toHaveLength(1)
    expect(next[0].metrics.energie).toBe(80)
  })

  it('distingue les jours différents', () => {
    const next = upsertDayLog([log(5, 50)], log(6, 60))
    expect(next).toHaveLength(2)
  })
})
