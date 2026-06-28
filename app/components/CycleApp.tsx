'use client'

// Conteneur d'état de la v1 : porte cycles + saisies, dérive le jour courant,
// persiste dans localStorage et distribue aux vues (Dashboard présentationnel + Settings).

import { useEffect, useState } from 'react'
import { ensureSeeded, loadDayLogs, saveCycles, saveDayLogs } from '@/lib/storage'
import { findActiveCycle, startNewCycle, markRulesEnded, upsertDayLog } from '@/lib/cycle-actions'
import { cycleDayFromDate, findReferenceEntry, wrapCycleDay } from '@/lib/cycle'
import { Frise } from '@/components/Frise'
import { Calendar } from '@/components/Calendar'
import { Patterns } from '@/components/Patterns'
import { Settings } from '@/components/Settings'
import { CycleNav, type CycleTab } from '@/components/CycleNav'
import type { MainView } from '@/components/ViewToggle'
import type { CycleEntry, DayLog, Metrics } from '@/lib/types'

export function CycleApp() {
  const [cycles, setCycles] = useState<CycleEntry[] | null>(null)
  const [logs, setLogs] = useState<DayLog[]>([])
  const [tab, setTab] = useState<CycleTab>('cycle') // navbar : Cycle (frise/cal) ↔ Patterns
  const [mainView, setMainView] = useState<MainView>('frise') // sous-vue du Cycle
  const [displayDay, setDisplayDay] = useState(1) // jour-de-cycle pointé (1→27), alimente la navbar

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

  // La navbar suit le jour pointé en vue Cycle ; en Patterns, elle retombe sur aujourd'hui.
  const navDay = tab === 'patterns' ? wrapCycleDay(todayDay) : displayDay
  const navEntry = findReferenceEntry(navDay)

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
    <div className="mx-auto w-full max-w-[1800px] space-y-6 p-6">
      <CycleNav dayNumber={navDay} entry={navEntry} tab={tab} onTabChange={setTab} />

      {tab === 'patterns' ? (
        <Patterns activeCycle={active} todayDay={todayDay} logs={logs} />
      ) : mainView === 'frise' ? (
        <Frise
          logs={logs}
          todayDay={todayDay}
          view={mainView}
          onViewChange={setMainView}
          onDayChange={setDisplayDay}
          onSaveMetrics={handleSaveMetrics}
        />
      ) : (
        <Calendar
          cycles={cycles}
          todayDay={todayDay}
          logs={logs}
          view={mainView}
          onViewChange={setMainView}
          onDayChange={setDisplayDay}
          onSaveMetrics={handleSaveMetrics}
        />
      )}

      <Settings
        cycles={cycles}
        onStartNewCycle={handleStartNewCycle}
        onMarkRulesEnded={handleMarkRulesEnded}
      />
    </div>
  )
}
