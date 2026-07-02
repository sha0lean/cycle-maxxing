'use client'

// Panneau « du jour » à deux volets, coiffé d'une pilule à 2 icônes :
//   • Conseil du jour  → DomainTabs (conseils qualitatifs par domaine)
//   • Hormones du jour → HormonesDuJour (niveau / tendance / phrase par hormone)
// Le titre suit le volet actif.

import { useState } from 'react'
import { MessageCircle, Activity } from 'lucide-react'
import { DomainTabs } from '@/components/DomainTabs'
import { HormonesDuJour } from '@/components/HormonesDuJour'
import { cn } from '@/lib/utils'
import type { ResolvedDomain } from '@/lib/domain-loader'

type View = 'conseil' | 'hormones'

type AdvicePanelProps = {
  domains: ResolvedDomain[]
  dayNumber: number // jour de cycle pointé, transmis au volet Hormones
}

const PILL = [
  { view: 'conseil', label: 'Conseil', icon: MessageCircle },
  { view: 'hormones', label: 'Hormones', icon: Activity },
] as const

export function AdvicePanel({ domains, dayNumber }: AdvicePanelProps) {
  const [view, setView] = useState<View>('conseil')

  return (
    <section className="flex h-full flex-col animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* En-tête : titre (suit le volet) + pilule de bascule à 2 icônes. */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 px-1">
        <h2 className="font-display text-3xl leading-none text-foreground">
          {view === 'conseil' ? 'Conseil du jour' : 'Hormones du jour'}
        </h2>

        <div className="flex gap-1 rounded-full bg-secondary p-1 text-sm">
          {PILL.map(({ view: v, label, icon: Icon }) => {
            const isActive = view === v
            return (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={isActive}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition',
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
      </div>

      {view === 'conseil' ? (
        <DomainTabs domains={domains} />
      ) : (
        <HormonesDuJour dayNumber={dayNumber} />
      )}
    </section>
  )
}
