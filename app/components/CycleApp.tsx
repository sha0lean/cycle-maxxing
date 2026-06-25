'use client'

// Conteneur d'état de la v1 : porte cycles + saisies, dérive le jour courant,
// persiste dans localStorage et distribue aux vues (Dashboard présentationnel + Settings).

import { useEffect, useState } from 'react'
import { ensureSeeded, loadDayLogs, saveCycles, saveDayLogs } from '@/lib/storage'
import { findActiveCycle, startNewCycle, markRulesEnded, upsertDayLog } from '@/lib/cycle-actions'
import { cycleDayFromDate } from '@/lib/cycle'
import { Frise } from '@/components/Frise'
import { Settings } from '@/components/Settings'
import type { CycleEntry, DayLog, Metrics } from '@/lib/types'

export function CycleApp() {
  const [cycles, setCycles] = useState<CycleEntry[] | null>(null)
  const [logs, setLogs] = useState<DayLog[]>([])

  // Amorçage au montage (localStorage client-only).
  useEffect(() => {
    setCycles(ensureSeeded())
    setLogs(loadDayLogs())
  }, [])

  if (!cycles) {
    return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>
  }

  const active = findActiveCycle(cycles) ?? cycles[cycles.length - 1]
  const todayDay = cycleDayFromDate(active.j1)

  // Mutations : on persiste explicitement après chaque action (pas d'effet → pas de save au montage).
  const handleStartNewCycle = () => {
    const next = startNewCycle(cycles, new Date())
    setCycles(next)
    saveCycles(next)
  }
  const handleMarkRulesEnded = () => {
    const next = markRulesEnded(cycles, new Date())
    setCycles(next)
    saveCycles(next)
  }
  // Saisie : ne garde que les métriques ajustées, fusionnées avec la saisie existante du jour (D_004).
  // La Frise indique le jour ciblé (celui fixé sous le curseur).
  const handleSaveMetrics = (day: number, partial: Partial<Metrics>) => {
    const existing = logs.find((l) => l.cycleId === active.id && l.dayNumber === day)
    const merged = { ...existing?.metrics, ...partial }
    const next = upsertDayLog(logs, {
      cycleId: active.id,
      dayNumber: day,
      metrics: merged,
      loggedAt: new Date(),
    })
    setLogs(next)
    saveDayLogs(next)
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <Frise logs={logs} todayDay={todayDay} onSaveMetrics={handleSaveMetrics} />
      <Settings
        cycles={cycles}
        onStartNewCycle={handleStartNewCycle}
        onMarkRulesEnded={handleMarkRulesEnded}
      />
    </div>
  )
}
