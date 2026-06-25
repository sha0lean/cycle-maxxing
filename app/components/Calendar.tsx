'use client'

// Vue Calendrier (B-001) : grille mensuelle colorée par phase, navigation mois,
// clic sur un jour → panneau stats de ce j(N). Les jours futurs sont projetés (atténués + dashed).

import { useEffect, useState } from 'react'
import { monthMatrix } from '@/lib/calendar'
import { DayPanel } from '@/components/DayPanel'
import { ViewToggle, type MainView } from '@/components/ViewToggle'
import { PHASE_COLOR_VAR } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { wrapCycleDay } from '@/lib/cycle'
import type { CycleEntry, DayLog, Metrics } from '@/lib/types'

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

type CalendarProps = {
  cycles: CycleEntry[]
  todayDay: number
  logs: DayLog[]
  view: MainView
  onViewChange: (v: MainView) => void
  onDayChange: (day: number) => void // remonte le jour sélectionné vers la navbar
  onSaveMetrics: (day: number, partial: Partial<Metrics>) => void
}

export function Calendar({ cycles, todayDay, logs, view, onViewChange, onDayChange, onSaveMetrics }: CalendarProps) {
  const today = new Date()
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selectedDay, setSelectedDay] = useState(wrapCycleDay(todayDay))

  // Remonte le jour sélectionné vers la navbar.
  useEffect(() => {
    onDayChange(selectedDay)
  }, [selectedDay, onDayChange])

  const weeks = monthMatrix(cycles, cursor.year, cursor.month, today)

  // Décale le mois affiché, en gérant le passage d'année.
  const shiftMonth = (delta: number) =>
    setCursor((c) => {
      const m = c.month + delta
      return { year: c.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 }
    })

  return (
    <div className="space-y-6">
      <DayPanel displayDay={selectedDay} logs={logs} onSaveMetrics={onSaveMetrics} />

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Frise du cycle
          </h2>
          <ViewToggle view={view} onChange={onViewChange} />
        </div>

        <header className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:bg-secondary"
            aria-label="Mois précédent"
          >
            ‹
          </button>
          <h2 className="text-sm font-semibold capitalize">
            {MONTHS[cursor.month]} {cursor.year}
          </h2>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-md px-2 py-1 text-sm text-muted-foreground transition hover:bg-secondary"
            aria-label="Mois suivant"
          >
            ›
          </button>
        </header>

        <div className="mb-1 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d, i) => (
            <div key={i} className="text-center text-xs font-medium text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1">
              {week.map((cell) => {
                const selectable = cell.dayNumber !== null
                const isSelected =
                  selectable && cell.inMonth && cell.dayNumber === selectedDay
                const bg = cell.phase
                  ? `color-mix(in srgb, ${PHASE_COLOR_VAR[cell.phase]} 18%, transparent)`
                  : 'transparent'

                return (
                  <button
                    key={cell.date.toISOString()}
                    type="button"
                    disabled={!selectable}
                    onClick={() => selectable && setSelectedDay(cell.dayNumber!)}
                    style={{ backgroundColor: bg }}
                    className={cn(
                      'relative flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition',
                      !cell.inMonth ? 'opacity-30' : cell.predicted ? 'opacity-60' : '',
                      cell.predicted ? 'border-dashed border-border' : 'border-transparent',
                      cell.isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-card' : '',
                      isSelected ? '!border-solid !border-primary' : '',
                      selectable ? 'hover:brightness-95' : 'cursor-default',
                    )}
                  >
                    <span className="font-medium">{cell.date.getDate()}</span>
                    {cell.dayNumber !== null && (
                      <span className="text-[10px] leading-none text-muted-foreground">
                        j{cell.dayNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
