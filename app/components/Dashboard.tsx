// Vue principale — présentationnelle : tout vient des props, l'état vit dans CycleApp.
// Grille en L (« Éphéméride corporelle ») : Julie plein pied à gauche (pleine hauteur),
// zone droite = rangée haute (stats sans fond | compagnon frise/calendrier) puis conseils
// pleine largeur dessous. Les infos jour/phase sont portées par le bandeau (CycleNav).

import type { ReactNode } from 'react'
import { MetricsPanel } from '@/components/MetricsPanel'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { AdvicePanel } from '@/components/AdvicePanel'
import type { DayInfo, Metrics } from '@/lib/types'
import type { ResolvedDomain } from '@/lib/domain-loader'

type DashboardProps = {
  info: DayInfo
  hasPersonal: boolean
  domains: ResolvedDomain[]
  onSaveMetrics: (partial: Partial<Metrics>) => void
  // Compagnon de la rangée haute-droite : la frise (vue Cycle) ou la grille (Calendrier).
  aside: ReactNode
}

export function Dashboard({ info, hasPersonal, domains, onSaveMetrics, aside }: DashboardProps) {
  return (
    // items-stretch → la colonne avatar adopte la hauteur totale de la zone droite (plein pied).
    // En mobile : empilé, avatar en tête (order naturel du DOM).
    <div className="grid gap-6 lg:grid-cols-[minmax(260px,23rem)_1fr] lg:items-stretch">
      {/* Avatar : 1er dans le DOM (→ haut en mobile), colonne gauche pleine hauteur en desktop. */}
      <div className="min-w-0">
        <CharacterAvatar phase={info.phase} day={info.dayNumber} />
      </div>

      {/* Zone droite : rangée haute (stats | compagnon), rangée basse (conseils pleine largeur). */}
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,3.3fr)] lg:grid-rows-[auto_minmax(0,1fr)]">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <MetricsPanel
            display={info.displayMetrics}
            reference={info.referenceMetrics}
            hasPersonal={hasPersonal}
            onSaveMetrics={onSaveMetrics}
          />
        </div>
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">{aside}</div>
        <div className="min-w-0 lg:col-span-2 lg:row-start-2">
          <AdvicePanel domains={domains} dayNumber={info.dayNumber} />
        </div>
      </div>
    </div>
  )
}
