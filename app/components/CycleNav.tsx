'use client'

// Navbar sticky : porte en direct les infos du jour pointé (jour · phase · urgence ·
// sous-phase · libellé) et la bascule Cycle ↔ Patterns. Le jour suit le curseur de la frise.

import { PHASE_LABELS, URGENCE_LABELS, PHASE_COLOR_VAR, URGENCE_COLOR_VAR } from '@/lib/labels'
import { cn } from '@/lib/utils'
import { FontToggle } from '@/components/FontToggle'
import type { PhaseReferenceEntry } from '@/lib/types'

export type CycleTab = 'cycle' | 'patterns'

type CycleNavProps = {
  dayNumber: number
  entry: PhaseReferenceEntry
  tab: CycleTab
  onTabChange: (t: CycleTab) => void
}

// "j24-j27" → "j24 → j27" (et "j12" inchangé).
function formatSubPhase(id: string): string {
  return id.replace('-', ' → ')
}

export function CycleNav({ dayNumber, entry, tab, onTabChange }: CycleNavProps) {
  return (
    <nav className="sticky top-0 z-30 -mx-6 border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {/* Marque : croissant de lune sur pastille dégradée (lilas → ovulation) */}
          <span
            className="grid size-8 shrink-0 place-items-center rounded-xl text-background shadow-md"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--primary), var(--phase-ovulation))',
            }}
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          </span>
          <span className="text-lg font-semibold tabular-nums">Jour {dayNumber}</span>
          <span
            className="rounded-full px-3 py-0.5 text-sm font-medium text-background"
            style={{ backgroundColor: PHASE_COLOR_VAR[entry.phase] }}
          >
            {PHASE_LABELS[entry.phase]}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: URGENCE_COLOR_VAR[entry.urgence] }}
          >
            {URGENCE_LABELS[entry.urgence]}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatSubPhase(entry.id)} · <span className="text-foreground">{entry.label}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle de police (Aa) — change toutes les fontes du site */}
          <FontToggle />

          {/* Bascule Cycle (frise/calendrier) ↔ Patterns */}
          <div className="flex gap-1 rounded-lg bg-secondary p-0.5 text-sm">
            {(['cycle', 'patterns'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTabChange(t)}
                className={cn(
                  'rounded-md px-3 py-1 font-medium transition',
                  tab === t ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                {t === 'cycle' ? 'Cycle' : 'Patterns'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
