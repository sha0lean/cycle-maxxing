'use client'

// Navbar sticky. Rangée 1 : marque + infos du jour pointé (jour · phase · sous-phase · forme).
// Rangée 2 : navigation principale pleine largeur (Cycle · Patterns · Hormones), space-around.
// Le jour suit le curseur de la frise ; le badge urgence a été retiré (phase seule).

import { CalendarDays, TrendingUp, FlaskConical, type LucideIcon } from 'lucide-react'
import { PHASE_LABELS, PHASE_COLOR_VAR } from '@/lib/labels'
import { ViewToggle, type MainView } from '@/components/ViewToggle'
import { cn } from '@/lib/utils'
import type { PhaseReferenceEntry } from '@/lib/types'

export type CycleTab = 'cycle' | 'patterns' | 'hormones'

type CycleNavProps = {
  dayNumber: number
  entry: PhaseReferenceEntry
  tab: CycleTab
  onTabChange: (t: CycleTab) => void
  mainView: MainView // sous-vue du Cycle : Frise ou Calendrier
  onMainViewChange: (v: MainView) => void
  forme: number // score de bien-être du jour pointé (badge parqué ici, sorti de la fiche avatar)
  formeEmoji: string // emoji de l'état du jour, en écho au score
}

const TABS: { id: CycleTab; label: string; icon: LucideIcon }[] = [
  { id: 'cycle', label: 'Cycle', icon: CalendarDays },
  { id: 'patterns', label: 'Patterns', icon: TrendingUp },
  { id: 'hormones', label: 'Hormones', icon: FlaskConical },
]

// "j24-j27" → "j24 → j27" (et "j12" inchangé).
function formatSubPhase(id: string): string {
  return id.replace('-', ' → ')
}

export function CycleNav({ dayNumber, entry, tab, onTabChange, mainView, onMainViewChange, forme, formeEmoji }: CycleNavProps) {
  return (
    <nav className="sticky top-0 z-30 -mx-6 border-b border-border bg-background/80 px-6 py-3 backdrop-blur">
      {/* Rangée 1 : marque + infos du jour, avec la sous-vue Frise/Calendrier à droite (Cycle only). */}
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
          {/* Wordmark : la signature typographique de l'app (Instrument Serif). */}
          <span className="font-display text-2xl leading-none text-foreground">Cycle Maxxing</span>
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" aria-hidden />
          <span className="text-lg font-semibold tabular-nums">Jour {dayNumber}</span>
          <span
            className="rounded-full px-3 py-0.5 text-sm font-medium text-background"
            style={{ backgroundColor: PHASE_COLOR_VAR[entry.phase] }}
          >
            {PHASE_LABELS[entry.phase]}
          </span>
          <span className="text-sm text-muted-foreground">
            {formatSubPhase(entry.id)} · <span className="text-foreground">{entry.label}</span>
          </span>
          {/* Badge « Forme » (score de bien-être) — parqué ici en attendant sa place définitive. */}
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-0.5"
            style={{
              background: `color-mix(in srgb, ${PHASE_COLOR_VAR[entry.phase]} 18%, var(--card))`,
              border: `1px solid color-mix(in srgb, ${PHASE_COLOR_VAR[entry.phase]} 35%, transparent)`,
            }}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Forme</span>
            <span className="font-mono text-sm font-bold tabular-nums text-foreground">{forme}</span>
            <span className="text-sm leading-none">{formeEmoji}</span>
          </span>
        </div>

        {/* Sous-vue du Cycle : Frise ↔ Calendrier (visible seulement en onglet Cycle). */}
        {tab === 'cycle' && <ViewToggle view={mainView} onChange={onMainViewChange} />}
      </div>

      {/* Rangée 2 : navigation principale pleine largeur, segments répartis en space-around. */}
      <div className="mt-3 flex w-full items-stretch justify-around gap-1 rounded-xl bg-secondary p-1">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = tab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              aria-pressed={isActive}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
                isActive
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
