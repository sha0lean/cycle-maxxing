// Vue principale — présentationnelle : tout vient des props, l'état vit dans CycleApp.
// Layout « character sheet » : avatar PNJ de Julie à gauche, stats au centre, conseils à droite.
// Les infos jour/phase/sous-phase sont portées par la navbar (CycleNav), pas ici.

import { MetricsPanel } from '@/components/MetricsPanel'
import { CharacterAvatar } from '@/components/CharacterAvatar'
import { DomainTabs } from '@/components/DomainTabs'
import type { DayInfo, Metrics } from '@/lib/types'
import type { ResolvedDomain } from '@/lib/domain-loader'

type DashboardProps = {
  info: DayInfo
  hasPersonal: boolean
  domains: ResolvedDomain[]
  onSaveMetrics: (partial: Partial<Metrics>) => void
}

export function Dashboard({ info, hasPersonal, domains, onSaveMetrics }: DashboardProps) {
  return (
    // 3 colonnes en desktop (avatar / stats / conseils). lg:items-stretch → toutes les colonnes
    // adoptent la hauteur de la rangée ; le panneau Conseils descend ainsi jusqu'en bas.
    // En mobile : empilé, avatar en tête (order naturel du DOM).
    <div className="grid items-start gap-6 lg:grid-cols-[3fr_4fr_5fr] lg:items-stretch">
      {/* Avatar : 1er dans le DOM (→ haut en mobile), placé à gauche et recentré en hauteur sur desktop. */}
      <div className="lg:order-1 lg:self-center">
        <CharacterAvatar metrics={info.displayMetrics} phase={info.phase} day={info.dayNumber} />
      </div>

      {/* Stats : hauteur naturelle (self-start) → pas étirée inutilement par la rangée. */}
      <div className="lg:order-2 lg:self-start">
        <MetricsPanel
          display={info.displayMetrics}
          reference={info.referenceMetrics}
          hasPersonal={hasPersonal}
          onSaveMetrics={onSaveMetrics}
        />
      </div>

      <div className="lg:order-3">
        <DomainTabs domains={domains} />
      </div>
    </div>
  )
}
