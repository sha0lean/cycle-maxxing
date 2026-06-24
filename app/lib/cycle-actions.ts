// Mutations pures sur l'historique des cycles et les saisies — sans effet de bord (pas de localStorage).
// Pilotées par les deux boutons de l'app (D_003) et la saisie de métriques (D_004).

import type { CycleEntry, DayLog } from '@/lib/types'

// Le cycle actif = celui qui n'a pas encore de cycleEndDate (au plus un).
export function findActiveCycle(cycles: CycleEntry[]): CycleEntry | undefined {
  return cycles.find((c) => !c.cycleEndDate)
}

// Bouton « les règles ont commencé aujourd'hui » : clôture le cycle actif au nouveau j1,
// puis ouvre un nouveau cycle. Retourne un nouveau tableau (immutable).
export function startNewCycle(cycles: CycleEntry[], j1: Date): CycleEntry[] {
  const closed = cycles.map((c) => (c.cycleEndDate ? c : { ...c, cycleEndDate: j1 }))
  const next: CycleEntry = { id: crypto.randomUUID(), j1 }
  return [...closed, next]
}

// Bouton « les règles sont terminées aujourd'hui » : renseigne rulesEndDate du cycle actif.
// Sans cycle actif, retourne l'historique inchangé.
export function markRulesEnded(cycles: CycleEntry[], date: Date): CycleEntry[] {
  const active = findActiveCycle(cycles)
  if (!active) return cycles
  return cycles.map((c) => (c.id === active.id ? { ...c, rulesEndDate: date } : c))
}

// Saisie d'un jour : remplace la saisie existante (même cycle + même j(N)) ou l'ajoute.
export function upsertDayLog(logs: DayLog[], log: DayLog): DayLog[] {
  const index = logs.findIndex((l) => l.cycleId === log.cycleId && l.dayNumber === log.dayNumber)
  if (index === -1) return [...logs, log]
  const next = [...logs]
  next[index] = log
  return next
}
