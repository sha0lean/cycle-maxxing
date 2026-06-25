'use client'

// Conteneur d'état de la v1 : porte cycles + saisies, dérive le jour courant,
// persiste dans localStorage et distribue aux vues (Dashboard présentationnel + Settings).

import { useEffect, useState } from 'react'
import { ensureSeeded, loadDayLogs, saveCycles } from '@/lib/storage'
import { findActiveCycle, startNewCycle, markRulesEnded } from '@/lib/cycle-actions'
import { cycleDayFromDate, getDayInfo, averageDayLogs } from '@/lib/cycle'
import { resolveDomains } from '@/lib/domain-loader'
import { Dashboard } from '@/components/Dashboard'
import { Settings } from '@/components/Settings'
import type { CycleEntry, DayLog } from '@/lib/types'

export function CycleApp() {
  const [cycles, setCycles] = useState<CycleEntry[] | null>(null)
  const [logs, setLogs] = useState<DayLog[]>([])

  // Amorçage au montage (localStorage client-only).
  useEffect(() => {
    setCycles(ensureSeeded())
    setLogs(loadDayLogs())
  }, [])

  // Persiste à chaque changement de cycles (ignore l'état initial null).
  useEffect(() => {
    if (cycles) saveCycles(cycles)
  }, [cycles])

  if (!cycles) {
    return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>
  }

  const active = findActiveCycle(cycles) ?? cycles[cycles.length - 1]
  const dayNumber = cycleDayFromDate(active.j1)
  const personal = averageDayLogs(logs, dayNumber)
  const info = getDayInfo(dayNumber, personal)
  const domains = resolveDomains(dayNumber)

  // Mutations : un nouveau cycle / une fin de règles recalculent toute la vue.
  const handleStartNewCycle = () => setCycles((prev) => startNewCycle(prev!, new Date()))
  const handleMarkRulesEnded = () => setCycles((prev) => markRulesEnded(prev!, new Date()))

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <Dashboard info={info} hasPersonal={!!personal} domains={domains} />
      <Settings
        cycles={cycles}
        onStartNewCycle={handleStartNewCycle}
        onMarkRulesEnded={handleMarkRulesEnded}
      />
    </div>
  )
}
