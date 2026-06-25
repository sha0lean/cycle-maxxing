// Vue principale — présentationnelle : tout vient des props, l'état vit dans CycleApp.
// Les infos jour/phase/sous-phase sont portées par la navbar (CycleNav), pas ici.

import { MetricsPanel } from '@/components/MetricsPanel'
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
    // Stats du jour à gauche (colonne), conseils à droite — tout visible d'un coup.
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <MetricsPanel
        display={info.displayMetrics}
        reference={info.referenceMetrics}
        hasPersonal={hasPersonal}
        onSaveMetrics={onSaveMetrics}
      />

      <DomainTabs domains={domains} />
    </div>
  )
}
