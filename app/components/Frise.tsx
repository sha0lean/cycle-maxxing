'use client'

// Vue principale (B-002) : la frise pilote un jour sélectionné/survolé, les stats + conseils
// (Dashboard) et la navbar reflètent ce jour en live.

import { useEffect, useState } from 'react'
import { DayPanel } from '@/components/DayPanel'
import { Timeline } from '@/components/Timeline'
import { wrapCycleDay } from '@/lib/cycle'
import type { MainView } from '@/components/ViewToggle'
import type { DayLog, Metrics } from '@/lib/types'

type FriseProps = {
  logs: DayLog[]
  todayDay: number
  view: MainView
  onViewChange: (v: MainView) => void
  onDayChange: (day: number) => void // remonte le jour-de-cycle pointé vers la navbar
  onSaveMetrics: (day: number, partial: Partial<Metrics>) => void
}

export function Frise({ logs, todayDay, view, onViewChange, onDayChange, onSaveMetrics }: FriseProps) {
  // État en jours ABSOLUS (depuis j1, sans plafond) : permet de distinguer un même
  // jour-de-cycle d'un cycle à l'autre dans la fenêtre. On replie (wrap) seulement
  // pour lire les stats/conseils et cibler la saisie.
  const [selectedAbs, setSelectedAbs] = useState(todayDay)
  const [hoverAbs, setHoverAbs] = useState<number | null>(null)

  // Le survol prime sur la sélection pour l'affichage ; l'édition cible le jour fixé.
  const effectiveAbs = hoverAbs ?? selectedAbs
  const displayDay = wrapCycleDay(effectiveAbs)

  // Remonte le jour pointé (jour-de-cycle) vers la navbar.
  useEffect(() => {
    onDayChange(displayDay)
  }, [displayDay, onDayChange])

  return (
    <div className="space-y-6">
      <DayPanel
        displayDay={displayDay}
        editDay={wrapCycleDay(selectedAbs)}
        logs={logs}
        onSaveMetrics={onSaveMetrics}
      />
      <Timeline
        cursorDay={effectiveAbs}
        todayDay={todayDay}
        view={view}
        onViewChange={onViewChange}
        onScrub={setHoverAbs}
        onSelect={setSelectedAbs}
      />
    </div>
  )
}
