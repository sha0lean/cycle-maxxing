import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadCycles, saveCycles, loadDayLogs, saveDayLogs, ensureSeeded } from '@/lib/storage'
import { JULIE_SEED_CYCLES } from '@/lib/seed'
import type { CycleEntry, DayLog } from '@/lib/types'

// localStorage minimal en mémoire (env node : pas de window par défaut).
function makeLocalStorage() {
  const map = new Map<string, string>()
  return {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, v),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
  }
}

beforeEach(() => {
  vi.stubGlobal('window', { localStorage: makeLocalStorage() })
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('cycles — round-trip', () => {
  it('réhydrate les Date à la lecture', () => {
    const cycles: CycleEntry[] = [
      { id: 'c1', j1: new Date(2026, 4, 7), rulesEndDate: new Date(2026, 4, 10), cycleEndDate: new Date(2026, 4, 31) },
    ]
    saveCycles(cycles)
    const loaded = loadCycles()

    expect(loaded[0].j1).toBeInstanceOf(Date)
    expect(loaded[0].j1.getTime()).toBe(cycles[0].j1.getTime())
    expect(loaded[0].rulesEndDate?.getTime()).toBe(cycles[0].rulesEndDate!.getTime())
  })

  it('omet rulesEndDate quand absente', () => {
    saveCycles([{ id: 'c3', j1: new Date(2026, 5, 27) }])
    const loaded = loadCycles()
    expect(loaded[0].rulesEndDate).toBeUndefined()
    expect(loaded[0].cycleEndDate).toBeUndefined()
  })

  it('retourne [] sur store vide', () => {
    expect(loadCycles()).toEqual([])
  })
})

describe('dayLogs — round-trip', () => {
  it('réhydrate loggedAt et préserve les métriques', () => {
    const logs: DayLog[] = [
      { cycleId: 'c2', dayNumber: 5, metrics: { energie: 50, humeur: 60 }, loggedAt: new Date(2026, 5, 4) },
    ]
    saveDayLogs(logs)
    const loaded = loadDayLogs()

    expect(loaded[0].loggedAt).toBeInstanceOf(Date)
    expect(loaded[0].metrics).toEqual({ energie: 50, humeur: 60 })
  })
})

describe('ensureSeeded', () => {
  it('amorce avec les cycles de Julie quand le store est vide', () => {
    const seeded = ensureSeeded()
    expect(seeded).toHaveLength(JULIE_SEED_CYCLES.length)
    expect(loadCycles()).toHaveLength(JULIE_SEED_CYCLES.length)
  })

  it('ne réécrit pas un store déjà rempli', () => {
    saveCycles([{ id: 'custom', j1: new Date(2026, 0, 1) }])
    const result = ensureSeeded()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('custom')
  })
})
