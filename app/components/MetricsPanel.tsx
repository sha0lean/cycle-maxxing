// Panel des 8 jauges « style jeu vidéo » — barre principale + marqueur de référence (D_004).
// Présentation pure : aucune logique, tout vient des props.

import { METRIC_KEYS } from '@/lib/types'
import type { Metrics, PhaseId } from '@/lib/types'
import { METRIC_LABELS, PHASE_COLOR_VAR } from '@/lib/labels'

type MetricsPanelProps = {
  phase: PhaseId
  display: Metrics // barre principale (réalité de Julie si saisie, sinon référence)
  reference: Metrics // valeurs scientifiques de référence
  hasPersonal: boolean // affiche le marqueur de référence dès qu'une saisie personnelle existe
}

export function MetricsPanel({ phase, display, reference, hasPersonal }: MetricsPanelProps) {
  const color = PHASE_COLOR_VAR[phase]

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Stats du jour
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {METRIC_KEYS.map((key) => {
          const value = display[key]
          const ref = reference[key]
          const showMarker = hasPersonal && value !== ref
          return (
            <div key={key} className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-foreground">{METRIC_LABELS[key]}</span>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">{value}</span>
              </div>
              <div className="relative h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${value}%`, backgroundColor: color }}
                />
                {showMarker && (
                  <div
                    className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded bg-foreground/70"
                    style={{ left: `${ref}%` }}
                    title={`Référence : ${ref}`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
