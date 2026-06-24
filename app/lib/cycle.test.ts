import { describe, it, expect } from 'vitest'
import {
  cycleDayFromDate,
  findReferenceEntry,
  averageDayLogs,
  getDayInfo,
  getCurrentPhase,
} from '@/lib/cycle'
import type { DayLog } from '@/lib/types'

describe('cycleDayFromDate', () => {
  it('le jour de j1 est le jour 1', () => {
    const j1 = new Date(2026, 4, 31) // 31 mai 2026
    expect(cycleDayFromDate(j1, new Date(2026, 4, 31))).toBe(1)
  })

  it('le lendemain de j1 est le jour 2', () => {
    const j1 = new Date(2026, 4, 31)
    expect(cycleDayFromDate(j1, new Date(2026, 5, 1))).toBe(2)
  })

  it('compte correctement à travers un changement de mois', () => {
    const j1 = new Date(2026, 4, 31) // 31 mai
    expect(cycleDayFromDate(j1, new Date(2026, 5, 26))).toBe(27) // 26 juin = j27
  })

  it("ignore l'heure de la journée", () => {
    const j1 = new Date(2026, 4, 31, 23, 0)
    expect(cycleDayFromDate(j1, new Date(2026, 5, 1, 1, 0))).toBe(2)
  })
})

describe('findReferenceEntry', () => {
  it('j1 tombe dans les règles (j1-j2)', () => {
    const e = findReferenceEntry(1)
    expect(e.phase).toBe('regles')
    expect(e.id).toBe('j1-j2')
  })

  it('j13 est le pic d’ovulation', () => {
    const e = findReferenceEntry(13)
    expect(e.phase).toBe('ovulation')
    expect(e.id).toBe('j13')
  })

  it('j25 tombe en SPM critique (j24-j27)', () => {
    const e = findReferenceEntry(25)
    expect(e.phase).toBe('spm')
    expect(e.id).toBe('j24-j27')
  })

  it('au-delà de j27, reste en SPM critique (cycle plus long que la référence)', () => {
    const e = findReferenceEntry(30)
    expect(e.phase).toBe('spm')
    expect(e.id).toBe('j24-j27')
  })

  it('avant j1, retombe sur la première sous-phase', () => {
    expect(findReferenceEntry(0).id).toBe('j1-j2')
  })
})

describe('averageDayLogs', () => {
  const logs: DayLog[] = [
    { cycleId: 'c1', dayNumber: 5, metrics: { energie: 50, humeur: 60 }, loggedAt: new Date() },
    { cycleId: 'c2', dayNumber: 5, metrics: { energie: 70 }, loggedAt: new Date() },
    { cycleId: 'c3', dayNumber: 9, metrics: { energie: 80 }, loggedAt: new Date() },
  ]

  it('retourne undefined sans saisie pour ce jour', () => {
    expect(averageDayLogs(logs, 21)).toBeUndefined()
  })

  it('moyenne les métriques saisies sur plusieurs cycles, arrondies', () => {
    const avg = averageDayLogs(logs, 5)
    expect(avg).toEqual({ energie: 60, humeur: 60 }) // energie (50+70)/2, humeur 60/1
  })

  it('ignore les logs des autres jours', () => {
    const avg = averageDayLogs(logs, 9)
    expect(avg).toEqual({ energie: 80 })
  })
})

describe('getDayInfo', () => {
  it('sans saisie, displayMetrics = référence et personalMetrics absent', () => {
    const info = getDayInfo(13)
    expect(info.personalMetrics).toBeUndefined()
    expect(info.displayMetrics).toEqual(info.referenceMetrics)
    expect(info.displayMetrics.energie).toBe(95) // j13 référence
  })

  it('avec saisie partielle, fusionne sans écraser les métriques non saisies', () => {
    const info = getDayInfo(13, { energie: 40 })
    expect(info.personalMetrics).toEqual({ energie: 40 })
    expect(info.displayMetrics.energie).toBe(40) // écrasé
    expect(info.displayMetrics.humeur).toBe(95) // référence préservée
    expect(info.referenceMetrics.energie).toBe(95) // référence intacte
  })

  it('un objet de saisie vide est traité comme aucune saisie', () => {
    const info = getDayInfo(13, {})
    expect(info.personalMetrics).toBeUndefined()
  })
})

describe('getCurrentPhase', () => {
  it('déduit la phase à partir de j1 et de la date', () => {
    const j1 = new Date(2026, 4, 31) // 31 mai
    expect(getCurrentPhase(j1, new Date(2026, 5, 12))).toBe('ovulation') // 12 juin = j13
  })
})
