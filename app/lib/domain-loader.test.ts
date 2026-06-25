import { describe, it, expect } from 'vitest'
import { resolveDomains } from '@/lib/domain-loader'
import { DOMAINS } from '@/lib/generated/domains'

// Tests découplés des valeurs : on lit DOMAINS dynamiquement (le contenu évolue via les .md).

describe('resolveDomains', () => {
  it('retourne une entrée par domaine généré', () => {
    expect(resolveDomains(13)).toHaveLength(DOMAINS.length)
    expect(DOMAINS.length).toBeGreaterThan(0)
  })

  it("conserve l'id et le label de chaque domaine", () => {
    const resolved = resolveDomains(13)
    for (let i = 0; i < DOMAINS.length; i++) {
      expect(resolved[i].id).toBe(DOMAINS[i].id)
      expect(resolved[i].label).toBe(DOMAINS[i].label)
    }
  })

  it('la plage résolue couvre bien le jour demandé', () => {
    for (const { entry } of resolveDomains(8)) {
      if (!entry) continue
      expect(8).toBeGreaterThanOrEqual(entry.dayStart)
      expect(8).toBeLessThanOrEqual(entry.dayEnd)
    }
  })

  it('au-delà de la dernière plage, clampe sur la plus tardive (cycle > référence)', () => {
    for (const domain of DOMAINS) {
      const last = [...domain.entries].sort((a, b) => a.dayStart - b.dayStart).at(-1)!
      const resolved = resolveDomains(99).find((r) => r.id === domain.id)!
      expect(resolved.entry?.range).toBe(last.range)
    }
  })

  it('avant la première plage, clampe sur la plus précoce', () => {
    for (const domain of DOMAINS) {
      const first = [...domain.entries].sort((a, b) => a.dayStart - b.dayStart)[0]
      const resolved = resolveDomains(0).find((r) => r.id === domain.id)!
      expect(resolved.entry?.range).toBe(first.range)
    }
  })
})
