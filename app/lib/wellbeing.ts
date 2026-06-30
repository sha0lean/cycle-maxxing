// Score de bien-être global du jour → module l'avatar (intensité/badge), pas le choix de l'état.
// Le choix de l'état suit le JOUR du cycle (cf. lib/avatar.ts) ; le score s'applique par-dessus.
// Les 8 métriques ont des polarités opposées : on inverse les négatives avant la moyenne,
// sinon un jour douloureux (douleurs/stress hauts) sortirait un faux « bon score ».

import type { Metrics, MetricKey } from '@/lib/types'

// Métriques où « haut = mal-être » → comptées en (100 - valeur) dans le score.
const NEGATIVE_KEYS: ReadonlySet<MetricKey> = new Set([
  'fatigue',
  'sensibilite',
  'stress',
  'douleurs',
  'irritabilite',
])

// Moyenne des 8 jauges, négatives inversées → 0 (au plus bas) à 100 (au plus haut).
export function wellbeingScore(metrics: Metrics): number {
  const keys = Object.keys(metrics) as MetricKey[]
  const total = keys.reduce((sum, key) => {
    const v = metrics[key]
    return sum + (NEGATIVE_KEYS.has(key) ? 100 - v : v)
  }, 0)
  return Math.round(total / keys.length)
}
