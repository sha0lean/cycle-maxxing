'use client'

// Panel des 8 jauges « style jeu vidéo » — barre principale + marqueur de référence (D_004).
// Mode lecture par défaut ; mode édition (sliders) pour saisir la couche personnelle.

import { useState } from 'react'
import { METRIC_KEYS } from '@/lib/types'
import type { Metrics, MetricKey } from '@/lib/types'
import { METRIC_LABELS, METRIC_COLOR } from '@/lib/labels'

type MetricsPanelProps = {
  display: Metrics // barre principale (réalité de Julie si saisie, sinon référence)
  reference: Metrics // valeurs scientifiques de référence
  hasPersonal: boolean // affiche le marqueur de référence dès qu'une saisie personnelle existe
  onSaveMetrics: (partial: Partial<Metrics>) => void // enregistre les seules métriques ajustées
}

export function MetricsPanel({ display, reference, hasPersonal, onSaveMetrics }: MetricsPanelProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Partial<Metrics>>({}) // uniquement les métriques touchées

  const startEdit = () => {
    setDraft({})
    setEditing(true)
  }
  const cancel = () => {
    setDraft({})
    setEditing(false)
  }
  const save = () => {
    if (Object.keys(draft).length > 0) onSaveMetrics(draft)
    setDraft({})
    setEditing(false)
  }
  const setMetric = (key: MetricKey, value: number) => setDraft((d) => ({ ...d, [key]: value }))

  return (
    // « Sans fond » : pas de carte, les jauges respirent directement sur la nuit chaude.
    <section className="px-1">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Stats du jour
        </h2>
        {editing ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={cancel}
              className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Enregistrer
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:opacity-80"
          >
            Éditer
          </button>
        )}
      </div>

      <div className="grid gap-2">
        {METRIC_KEYS.map((key) => {
          const value = editing ? draft[key] ?? display[key] : display[key]
          const ref = reference[key]
          const color = METRIC_COLOR[key]
          const showMarker = !editing && hasPersonal && value !== ref
          return (
            <div key={key} className="space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">{METRIC_LABELS[key]}</span>
                <span
                  className="font-mono text-base font-semibold tabular-nums"
                  style={{ color }}
                >
                  {value}
                </span>
              </div>
              {editing ? (
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => setMetric(key, Number(e.target.value))}
                  className="h-2 w-full cursor-pointer"
                  style={{ accentColor: color }}
                />
              ) : (
                // Track « creusé » (ombre interne) + remplissage avec halo couleur → effet jauge.
                <div className="relative h-2.5 w-full rounded-full bg-muted/80 shadow-[inset_0_1px_2px_rgb(0_0_0/0.4)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${value}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}66`,
                    }}
                  />
                  {showMarker && (
                    <div
                      className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded bg-foreground/80"
                      style={{ left: `${ref}%` }}
                      title={`Référence : ${ref}`}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
