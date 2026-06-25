'use client'

// Vue principale (B-002) : la frise pilote un jour sélectionné/survolé, et les panneaux
// du dessus (stats + conseils, via Dashboard) reflètent ce jour en live.

import { useState } from 'react'
import { getDayInfo, averageDayLogs } from '@/lib/cycle'
import { resolveDomains } from '@/lib/domain-loader'
import { Dashboard } from '@/components/Dashboard'
import { Timeline } from '@/components/Timeline'
import type { DayLog, Metrics } from '@/lib/types'

type FriseProps = {
  logs: DayLog[]
  todayDay: number
  onSaveMetrics: (day: number, partial: Partial<Metrics>) => void
}

export function Frise({ logs, todayDay, onSaveMetrics }: FriseProps) {
  const [selectedDay, setSelectedDay] = useState(todayDay)
  const [hoverDay, setHoverDay] = useState<number | null>(null)

  // Le survol prime sur la sélection pour l'affichage ; l'édition cible le jour fixé.
  const effectiveDay = hoverDay ?? selectedDay
  const personal = averageDayLogs(logs, effectiveDay)
  const info = getDayInfo(effectiveDay, personal)
  const domains = resolveDomains(effectiveDay)

  return (
    <div className="space-y-6">
      <Dashboard
        info={info}
        hasPersonal={!!personal}
        domains={domains}
        onSaveMetrics={(partial) => onSaveMetrics(selectedDay, partial)}
      />
      <Timeline
        cursorDay={effectiveDay}
        todayDay={todayDay}
        onScrub={setHoverDay}
        onSelect={setSelectedDay}
      />
    </div>
  )
}
