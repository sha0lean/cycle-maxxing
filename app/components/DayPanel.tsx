'use client'

// Panneau stats + conseils d'un jour de cycle, partagé par la Frise et le Calendrier.
// `displayDay` = jour affiché (peut suivre un survol) · `editDay` = jour ciblé par la saisie.
// Dans le Calendrier les deux coïncident ; dans la Frise le survol prime sur la sélection.

import type { ReactNode } from 'react'
import { getDayInfo, averageDayLogs } from '@/lib/cycle'
import { resolveDomains } from '@/lib/domain-loader'
import { Dashboard } from '@/components/Dashboard'
import type { DayLog, Metrics } from '@/lib/types'

type DayPanelProps = {
  displayDay: number
  logs: DayLog[]
  onSaveMetrics: (day: number, partial: Partial<Metrics>) => void
  editDay?: number // défaut : displayDay
  aside: ReactNode // compagnon haute-droite : frise (Frise) ou grille mensuelle (Calendrier)
}

export function DayPanel({ displayDay, logs, onSaveMetrics, editDay = displayDay, aside }: DayPanelProps) {
  const personal = averageDayLogs(logs, displayDay)
  const info = getDayInfo(displayDay, personal)
  const domains = resolveDomains(displayDay)

  return (
    <Dashboard
      info={info}
      hasPersonal={!!personal}
      domains={domains}
      aside={aside}
      onSaveMetrics={(partial) => onSaveMetrics(editDay, partial)}
    />
  )
}
