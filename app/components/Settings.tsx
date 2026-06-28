'use client'

// Réglages des cycles (B-004) : marquer début/fin des règles + historique et moyennes.
// Section repliable en bas du dashboard. Les mutations remontent à CycleApp via callbacks.

import { useState } from 'react'
import { findActiveCycle } from '@/lib/cycle-actions'
import { cycleDuration, rulesDuration, averageCycleLength, averageRulesLength } from '@/lib/cycle-stats'
import type { CycleEntry } from '@/lib/types'

type SettingsProps = {
  cycles: CycleEntry[]
  onStartNewCycle: () => void
  onMarkRulesEnded: () => void
}

const dateFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const formatDate = (d: Date) => dateFmt.format(d)
const formatDays = (n: number | undefined) => (n === undefined ? '—' : `${n} j`)

export function Settings({ cycles, onStartNewCycle, onMarkRulesEnded }: SettingsProps) {
  const [open, setOpen] = useState(false)

  const active = findActiveCycle(cycles)
  const rulesAlreadyEnded = !!active?.rulesEndDate

  const handleStart = () => {
    if (window.confirm('Marquer le début des règles aujourd’hui ? Le cycle en cours sera clôturé.')) {
      onStartNewCycle()
    }
  }
  const handleEnd = () => {
    if (window.confirm('Marquer la fin des règles aujourd’hui ?')) onMarkRulesEnded()
  }

  // Historique le plus récent en haut.
  const history = [...cycles].sort((a, b) => b.j1.getTime() - a.j1.getTime())
  const avgCycle = averageCycleLength(cycles)
  const avgRules = averageRulesLength(cycles)

  return (
    <section className="panel">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Réglages
        <span className="text-base leading-none">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-5 space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleStart}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Les règles ont commencé aujourd’hui
            </button>
            <button
              type="button"
              onClick={handleEnd}
              disabled={!active || rulesAlreadyEnded}
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {rulesAlreadyEnded ? 'Fin des règles déjà marquée' : 'Les règles sont terminées aujourd’hui'}
            </button>
          </div>

          {/* Moyennes */}
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Durée moyenne du cycle" value={formatDays(avgCycle)} />
            <Stat label="Durée moyenne des règles" value={formatDays(avgRules)} />
          </div>

          {/* Historique */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Historique des cycles
            </h3>
            <ul className="divide-y divide-border">
              {history.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between py-2 text-sm">
                  <span className="text-foreground">
                    {formatDate(c.j1)}
                    {!c.cycleEndDate && (
                      <span className="ml-2 text-xs font-medium text-primary">en cours</span>
                    )}
                  </span>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    cycle {formatDays(cycleDuration(c))} · règles {formatDays(rulesDuration(c))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/50 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono text-lg tabular-nums text-foreground">{value}</div>
    </div>
  )
}
