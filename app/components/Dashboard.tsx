// Vue principale — présentationnelle : tout vient des props, l'état vit dans CycleApp.

import { MetricsPanel } from '@/components/MetricsPanel'
import { DomainTabs } from '@/components/DomainTabs'
import {
  PHASE_LABELS,
  URGENCE_LABELS,
  PHASE_COLOR_VAR,
  URGENCE_COLOR_VAR,
} from '@/lib/labels'
import type { DayInfo } from '@/lib/types'
import type { ResolvedDomain } from '@/lib/domain-loader'

type DashboardProps = {
  info: DayInfo
  hasPersonal: boolean
  domains: ResolvedDomain[]
}

export function Dashboard({ info, hasPersonal, domains }: DashboardProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">Jour {info.dayNumber}</h1>
          <span
            className="rounded-full px-3 py-0.5 text-sm font-medium text-background"
            style={{ backgroundColor: PHASE_COLOR_VAR[info.phase] }}
          >
            {PHASE_LABELS[info.phase]}
          </span>
          <span
            className="rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: URGENCE_COLOR_VAR[info.urgence] }}
          >
            {URGENCE_LABELS[info.urgence]}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Sous-phase {info.subPhase}</p>
      </header>

      <MetricsPanel
        phase={info.phase}
        display={info.displayMetrics}
        reference={info.referenceMetrics}
        hasPersonal={hasPersonal}
      />

      <DomainTabs domains={domains} />
    </div>
  )
}
