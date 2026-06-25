// Statistiques dérivées de l'historique des cycles (durées + moyennes).
// Couche pure, sans effet de bord. Les prédictions (écart-type, outliers, ovulation) viendront plus tard.

import type { CycleEntry } from '@/lib/types'

const MS_PER_DAY = 86_400_000

// Nombre de jours calendaires entre deux dates (heures ignorées).
function daysBetween(a: Date, b: Date): number {
  const start = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const end = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((end - start) / MS_PER_DAY)
}

// Durée d'un cycle terminé (j1 → j1 suivant). undefined tant que le cycle est en cours.
export function cycleDuration(c: CycleEntry): number | undefined {
  return c.cycleEndDate ? daysBetween(c.j1, c.cycleEndDate) : undefined
}

// Durée des règles, bornes incluses (j1 → rulesEndDate). undefined tant que la fin n'est pas marquée.
export function rulesDuration(c: CycleEntry): number | undefined {
  return c.rulesEndDate ? daysBetween(c.j1, c.rulesEndDate) + 1 : undefined
}

// Moyenne arrondie d'une liste, undefined si vide.
function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
}

// Durée moyenne des cycles terminés. undefined tant qu'aucun cycle n'est clôturé.
export function averageCycleLength(cycles: CycleEntry[]): number | undefined {
  return average(cycles.map(cycleDuration).filter((d): d is number => d !== undefined))
}

// Durée moyenne des règles confirmées. undefined tant qu'aucune fin de règles n'est marquée.
export function averageRulesLength(cycles: CycleEntry[]): number | undefined {
  return average(cycles.map(rulesDuration).filter((d): d is number => d !== undefined))
}
