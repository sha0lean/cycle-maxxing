'use client'

// Onglets des conseils qualitatifs par domaine pour le jour courant (couche 2).
// Présentation pure : la résolution jour → entrée est faite en amont par domain-loader.

import { useState } from 'react'
import type { ResolvedDomain } from '@/lib/domain-loader'

type DomainTabsProps = {
  domains: ResolvedDomain[]
}

export function DomainTabs({ domains }: DomainTabsProps) {
  // Premier domaine ayant du contenu pour ce jour, sinon le premier tout court.
  const initial = domains.find((d) => d.entry)?.id ?? domains[0]?.id
  const [active, setActive] = useState(initial)

  if (domains.length === 0) return null

  const current = domains.find((d) => d.id === active) ?? domains[0]
  const entry = current.entry

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Conseils du jour
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {domains.map((d) => {
          const isActive = d.id === current.id
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActive(d.id)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {d.label}
            </button>
          )
        })}
      </div>

      {entry ? (
        <div className="space-y-4">
          <p className="text-sm text-foreground">{entry.conseil}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {entry.faire.length > 0 && (
              <AdviceList title="À privilégier" tone="positive" items={entry.faire} />
            )}
            {entry.eviter.length > 0 && (
              <AdviceList title="À éviter" tone="negative" items={entry.eviter} />
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Pas encore de conseils renseignés pour ce domaine ce jour-là.
        </p>
      )}
    </section>
  )
}

function AdviceList({
  title,
  tone,
  items,
}: {
  title: string
  tone: 'positive' | 'negative'
  items: string[]
}) {
  const dot = tone === 'positive' ? 'var(--urgence-normal)' : 'var(--urgence-critique)'
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground">
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: dot }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
