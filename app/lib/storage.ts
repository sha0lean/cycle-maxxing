// Persistance localStorage (v1). Sérialise les Date en ISO via JSON, les réhydrate au chargement.
// Guard SSR : côté serveur (pas de window), les lectures renvoient du vide et les écritures no-op.

import { JULIE_SEED_CYCLES } from '@/lib/seed'
import type { CycleEntry, DayLog, Metrics } from '@/lib/types'

const KEYS = {
  cycles: 'cm:cycles',
  dayLogs: 'cm:daylogs',
} as const

function hasStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage
}

// ── Cycles ──────────────────────────────────────────────────

type RawCycle = { id: string; j1: string; rulesEndDate?: string; cycleEndDate?: string }

function reviveCycle(r: RawCycle): CycleEntry {
  const cycle: CycleEntry = { id: r.id, j1: new Date(r.j1) }
  if (r.rulesEndDate) cycle.rulesEndDate = new Date(r.rulesEndDate)
  if (r.cycleEndDate) cycle.cycleEndDate = new Date(r.cycleEndDate)
  return cycle
}

export function loadCycles(): CycleEntry[] {
  if (!hasStorage()) return []
  const raw = window.localStorage.getItem(KEYS.cycles)
  if (!raw) return []
  try {
    return (JSON.parse(raw) as RawCycle[]).map(reviveCycle)
  } catch {
    return []
  }
}

export function saveCycles(cycles: CycleEntry[]): void {
  if (!hasStorage()) return
  window.localStorage.setItem(KEYS.cycles, JSON.stringify(cycles))
}

// ── Saisies quotidiennes ────────────────────────────────────

type RawDayLog = { cycleId: string; dayNumber: number; metrics: Partial<Metrics>; loggedAt: string }

function reviveDayLog(r: RawDayLog): DayLog {
  return { cycleId: r.cycleId, dayNumber: r.dayNumber, metrics: r.metrics, loggedAt: new Date(r.loggedAt) }
}

export function loadDayLogs(): DayLog[] {
  if (!hasStorage()) return []
  const raw = window.localStorage.getItem(KEYS.dayLogs)
  if (!raw) return []
  try {
    return (JSON.parse(raw) as RawDayLog[]).map(reviveDayLog)
  } catch {
    return []
  }
}

export function saveDayLogs(logs: DayLog[]): void {
  if (!hasStorage()) return
  window.localStorage.setItem(KEYS.dayLogs, JSON.stringify(logs))
}

// ── Amorçage ────────────────────────────────────────────────

// Initialise le store avec les cycles de Julie si aucun cycle n'est présent. Idempotent.
// Retourne les cycles effectivement disponibles après amorçage.
export function ensureSeeded(): CycleEntry[] {
  const existing = loadCycles()
  if (existing.length > 0) return existing
  saveCycles(JULIE_SEED_CYCLES)
  return JULIE_SEED_CYCLES
}
