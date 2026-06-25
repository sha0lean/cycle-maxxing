'use client'

// Vue principale (B-002) : la frise pilote un jour sélectionné/survolé, et les panneaux
// du dessus (stats + conseils, via Dashboard) reflètent ce jour en live.

import { useState } from 'react'
import { DayPanel } from '@/components/DayPanel'
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

  return (
    <div className="space-y-6">
      <DayPanel
        displayDay={effectiveDay}
        editDay={selectedDay}
        logs={logs}
        onSaveMetrics={onSaveMetrics}
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
