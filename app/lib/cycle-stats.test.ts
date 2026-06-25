import { describe, it, expect } from 'vitest'
import {
  cycleDuration,
  rulesDuration,
  averageCycleLength,
  averageRulesLength,
} from '@/lib/cycle-stats'
import type { CycleEntry } from '@/lib/types'

// Deux cycles type seed Julie + un cycle actif sans fin de règles.
const cycles: CycleEntry[] = [
  {
    id: 'c1',
    j1: new Date(2026, 4, 7), // 7 mai
    rulesEndDate: new Date(2026, 4, 10), // 10 mai → 4 jours de règles
    cycleEndDate: new Date(2026, 4, 31), // → durée 24 jours
  },
  {
    id: 'c2',
    j1: new Date(2026, 4, 31), // 31 mai
    rulesEndDate: new Date(2026, 5, 3), // 3 juin → 4 jours
    // cycle actif : pas de cycleEndDate
  },
]

describe('cycleDuration', () => {
  it('compte j1 → j1 suivant pour un cycle terminé', () => {
    expect(cycleDuration(cycles[0])).toBe(24)
  })

  it('undefined tant que le cycle est en cours', () => {
    expect(cycleDuration(cycles[1])).toBeUndefined()
  })
})

describe('rulesDuration', () => {
  it('compte les bornes incluses (j1 → rulesEndDate)', () => {
    expect(rulesDuration(cycles[0])).toBe(4) // 7,8,9,10 mai
  })

  it('undefined sans fin de règles marquée', () => {
    const sansFin: CycleEntry = { id: 'x', j1: new Date(2026, 5, 25) }
    expect(rulesDuration(sansFin)).toBeUndefined()
  })
})

describe('averageCycleLength', () => {
  it('moyenne uniquement les cycles terminés', () => {
    expect(averageCycleLength(cycles)).toBe(24) // seul c1 est terminé
  })

  it('undefined si aucun cycle terminé', () => {
    expect(averageCycleLength([cycles[1]])).toBeUndefined()
  })
})

describe('averageRulesLength', () => {
  it('moyenne toutes les fins de règles confirmées', () => {
    expect(averageRulesLength(cycles)).toBe(4) // (4 + 4) / 2
  })
})
