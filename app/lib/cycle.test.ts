import { describe, it, expect } from 'vitest'
import {
  cycleDayFromDate,
  findReferenceEntry,
  toReferenceDay,
  averageDayLogs,
  getDayInfo,
  getCurrentPhase,
  getPhaseSpans,
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

describe('toReferenceDay (découpage adaptatif B-011)', () => {
  it('identité quand la durée vaut la référence (27j)', () => {
    expect(toReferenceDay(13, 27)).toBe(13)
    expect(toReferenceDay(1, 27)).toBe(1)
    expect(toReferenceDay(25, 27)).toBe(25)
  })

  it('cycle long (31j) : l’ovulation réelle (j17) mappe sur le pic de référence (j13)', () => {
    expect(toReferenceDay(17, 31)).toBe(13) // ovulation = 31 - 14 = j17
  })

  it('cycle long (31j) : la lutéale glisse d’un décalage fixe', () => {
    expect(toReferenceDay(20, 31)).toBe(16) // 20 - (17-13) = 16 (lutéale début)
    expect(toReferenceDay(25, 31)).toBe(21) // 25 - 4 = 21 (SPM début)
  })

  it('cycle court (24j) : l’ovulation réelle (j10) mappe sur j13', () => {
    expect(toReferenceDay(10, 24)).toBe(13) // ovulation = 24 - 14 = j10
  })
})

describe('findReferenceEntry adaptatif (B-011)', () => {
  it('cycle 31j : j17 est l’ovulation (pas j13 comme en fixe)', () => {
    const e = findReferenceEntry(17, 31)
    expect(e.phase).toBe('ovulation')
    expect(e.id).toBe('j13')
  })

  it('cycle 31j : j13 est encore folliculaire (décalé vs le fixe où j13 = ovulation)', () => {
    expect(findReferenceEntry(13, 31).phase).toBe('folliculaire')
  })

  it('cycle 31j : j25 est en SPM', () => {
    expect(findReferenceEntry(25, 31).phase).toBe('spm')
  })

  it('sans durée fournie, comportement identique au découpage fixe', () => {
    expect(findReferenceEntry(13).id).toBe(findReferenceEntry(13, 27).id)
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
  })

  it('avec saisie partielle, fusionne sans écraser les métriques non saisies', () => {
    // Valeurs de référence lues dynamiquement : les données évoluent via ingest-source.
    const ref13 = findReferenceEntry(13)
    const info = getDayInfo(13, { energie: 40 })
    expect(info.personalMetrics).toEqual({ energie: 40 })
    expect(info.displayMetrics.energie).toBe(40) // saisie : écrase la référence
    expect(info.displayMetrics.humeur).toBe(ref13.metrics.humeur) // non saisie : référence préservée
    expect(info.referenceMetrics.energie).toBe(ref13.metrics.energie) // référence intacte
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

describe('getPhaseSpans', () => {
  const spans = getPhaseSpans()

  it('couvre le cycle de référence en continu, sans trou ni chevauchement', () => {
    expect(spans[0].start).toBe(1)
    for (let i = 1; i < spans.length; i++) {
      expect(spans[i].start).toBe(spans[i - 1].end + 1) // contiguïté
    }
  })

  it('fusionne les sous-phases en une seule plage par phase (5 phases)', () => {
    expect(spans.map((s) => s.phase)).toEqual([
      'regles',
      'folliculaire',
      'ovulation',
      'luteale',
      'spm',
    ])
  })
})
