// Couche 2 — résolution des conseils qualitatifs pour le jour courant.
// Consomme le référentiel domaines généré (D_006), sans lecture fichier runtime.

import { DOMAINS } from '@/lib/generated/domains'
import type { Domain, DomainEntry } from '@/lib/types'

// Conseils d'un domaine résolus pour un j(N) — entry à null si le domaine ne couvre pas ce jour.
export type ResolvedDomain = {
  id: string
  label: string
  entry: DomainEntry | null
}

// Plage la plus spécifique couvrant ce jour (la plus courte l'emporte : jour précis > sous-phase > phase).
// Hors couverture, on clampe comme la couche quantitative : avant la première plage → première,
// au-delà de la dernière → dernière (Julie peut dépasser j27 jusqu'aux prochaines règles).
function resolveEntry(domain: Domain, dayNumber: number): DomainEntry | null {
  if (domain.entries.length === 0) return null

  const matching = domain.entries.filter((e) => dayNumber >= e.dayStart && dayNumber <= e.dayEnd)
  if (matching.length > 0) {
    return matching.reduce((best, e) =>
      e.dayEnd - e.dayStart < best.dayEnd - best.dayStart ? e : best,
    )
  }

  const sorted = [...domain.entries].sort((a, b) => a.dayStart - b.dayStart)
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  return dayNumber < first.dayStart ? first : last
}

// Tous les domaines résolus pour un j(N) donné, dans l'ordre des fichiers.
export function resolveDomains(dayNumber: number): ResolvedDomain[] {
  return DOMAINS.map((d) => ({ id: d.id, label: d.label, entry: resolveEntry(d, dayNumber) }))
}
