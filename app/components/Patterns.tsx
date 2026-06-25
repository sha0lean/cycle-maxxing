'use client'

import { METRIC_KEYS, type CycleEntry, type DayLog, type Metrics, type MetricKey } from '@/lib/types'
import { METRIC_LABELS } from '@/lib/labels'
import { averageCycleLength } from '@/lib/cycle-stats'

type PatternsProps = {
  activeCycle: CycleEntry
  todayDay: number
  logs: DayLog[]
}

function averageMetrics(logs: DayLog[]): Partial<Metrics> {
  const averages: Partial<Metrics> = {}
  if (logs.length === 0) return averages

  for (const key of METRIC_KEYS) {
    const values = logs
      .map((log) => log.metrics[key])
      .filter((value): value is number => typeof value === 'number')

    if (values.length > 0) {
      averages[key] = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    }
  }

  return averages
}

function humanizeCount(count: number, unit: string) {
  return `${count} ${unit}${count > 1 ? 's' : ''}`
}

export function Patterns({ activeCycle, todayDay, logs }: PatternsProps) {
  const cycleLogs = logs.filter((log) => log.cycleId === activeCycle.id)
  const weekSize = Math.min(7, todayDay)
  const weekStart = Math.max(1, todayDay - weekSize + 1)
  const weekDayNumbers = Array.from({ length: weekSize }, (_, index) => weekStart + index)
  const weekLogs = cycleLogs.filter((log) => weekDayNumbers.includes(log.dayNumber))

  const cycleAverage = averageMetrics(cycleLogs)
  const weekAverage = averageMetrics(weekLogs)
  const averageLength = averageCycleLength([activeCycle])

  const hasCycleData = cycleLogs.length > 0
  const hasWeekData = weekLogs.length > 0

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Vue Patterns
            </p>
            <h1 className="text-2xl font-semibold">Récap hebdo & cycle</h1>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <p className="text-muted-foreground">Jour courant</p>
              <p className="font-semibold">J{todayDay}</p>
            </div>
            <div className="rounded-2xl bg-secondary p-4 text-sm">
              <p className="text-muted-foreground">Jours loggés</p>
              <p className="font-semibold">{humanizeCount(cycleLogs.length, 'jour')}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Cycle actuel"
            value={hasCycleData ? `${cycleLogs.length} jours` : 'Aucune saisie'}
            detail={`Durée moyenne ${averageLength ? `${averageLength} j` : 'non calculée'}`}
          />
          <SummaryCard
            title="Semaine en cours"
            value={hasWeekData ? `${weekLogs.length} jours` : 'Aucune saisie'}
            detail={`J${weekStart} → J${todayDay}`}
          />
          <SummaryCard
            title="Métrique de référence"
            value="Toutes les métriques"
            detail="Variations sur 7 metrics selon le cycle"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Vue hebdomadaire</h2>
              <p className="text-sm text-muted-foreground">
                Moyenne des valeurs enregistrées sur les {weekSize} derniers jours du cycle.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              {hasWeekData ? `${humanizeCount(weekLogs.length, 'enregistrement')}` : 'Vide'}
            </span>
          </div>

          {hasWeekData ? (
            <MetricGrid metrics={weekAverage} />
          ) : (
            <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
              Aucune métrique saisie cette semaine. Clique sur un jour dans le calendrier ou la frise pour commencer.
            </p>
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Vue cycle</h2>
              <p className="text-sm text-muted-foreground">
                Moyenne des valeurs enregistrées sur le cycle en cours.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              {hasCycleData ? `${humanizeCount(cycleLogs.length, 'enregistrement')}` : 'Vide'}
            </span>
          </div>

          {hasCycleData ? (
            <MetricGrid metrics={cycleAverage} />
          ) : (
            <p className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
              Pas encore de données pour ce cycle. Enregistre des métriques avec les curseurs du panel stats.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function SummaryCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="rounded-3xl border border-border bg-background p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
    </div>
  )
}

function MetricGrid({ metrics }: { metrics: Partial<Metrics> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {METRIC_KEYS.map((key) => (
        <div key={key} className="rounded-2xl border border-border bg-secondary p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-foreground">{METRIC_LABELS[key]}</p>
            <p className="text-sm font-semibold text-muted-foreground">
              {metrics[key] ?? '-'}%
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${metrics[key] ?? 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
