'use client'

// Vue principale v1 : calcule le jour courant de Julie depuis localStorage et l'affiche.
// localStorage est client-only → lecture dans un effet après hydratation.

import { useEffect, useState } from 'react'
import { ensureSeeded, loadDayLogs } from '@/lib/storage'
import { findActiveCycle } from '@/lib/cycle-actions'
import { cycleDayFromDate, getDayInfo, averageDayLogs } from '@/lib/cycle'
import { MetricsPanel } from '@/components/MetricsPanel'
import {
  PHASE_LABELS,
  URGENCE_LABELS,
  PHASE_COLOR_VAR,
  URGENCE_COLOR_VAR,
} from '@/lib/labels'
import type { DayInfo } from '@/lib/types'

export function Dashboard() {
  const [info, setInfo] = useState<DayInfo | null>(null)
  const [hasPersonal, setHasPersonal] = useState(false)

  useEffect(() => {
    const cycles = ensureSeeded()
    const logs = loadDayLogs()
    const active = findActiveCycle(cycles) ?? cycles[cycles.length - 1]
    const dayNumber = cycleDayFromDate(active.j1)
    const personal = averageDayLogs(logs, dayNumber)
    setHasPersonal(!!personal)
    setInfo(getDayInfo(dayNumber, personal))
  }, [])

  if (!info) {
    return <div className="p-8 text-sm text-muted-foreground">Chargement…</div>
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">Jour {info.dayNumber}</h1>
          <span
            className="rounded-full px-3 py-0.5 text-sm font-medium text-background"
            style={{ backgroundColor: PHASE_COLOR_VAR[info.phase] }}
          >
            {PHASE_LABELS[info.phase]}
          </span>
          <span
            className="rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: URGENCE_COLOR_VAR[info.urgence] }}
          >
            {URGENCE_LABELS[info.urgence]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Sous-phase {info.subPhase}</p>
      </header>

      <MetricsPanel
        phase={info.phase}
        display={info.displayMetrics}
        reference={info.referenceMetrics}
        hasPersonal={hasPersonal}
      />
    </div>
  )
}
