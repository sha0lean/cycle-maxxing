'use client'

// Bascule Frise ↔ Calendrier — deux façons de voir la même frise du cycle.
// Vit dans l'en-tête de la vue (à côté du titre), pas dans la navbar.

import { cn } from '@/lib/utils'

export type MainView = 'frise' | 'calendar'

const LABELS: Record<MainView, string> = { frise: 'Frise', calendar: 'Calendrier' }

export function ViewToggle({ view, onChange }: { view: MainView; onChange: (v: MainView) => void }) {
  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-0.5 text-xs">
      {(['frise', 'calendar'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            'rounded-md px-2.5 py-1 font-medium transition',
            view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
          )}
        >
          {LABELS[v]}
        </button>
      ))}
    </div>
  )
}
