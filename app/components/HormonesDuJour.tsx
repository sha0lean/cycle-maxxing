'use client'

// « Hormones du jour » — miroir de DomainTabs, mais les onglets portent la COULEUR de chaque
// hormone (tokens --hormone-*, source de vérité hormone-theme.ts). Corps = niveau + tendance
// + phrase contextuelle au jour pointé, dérivés des courbes de référence (hormones.ts).

import { useState } from 'react'
import { CURVE_SERIES } from '@/lib/reference-curves'
import { getHormoneState, type SeriesKey } from '@/lib/hormones'
import {
  hormoneDayPhrase,
  LEVEL_LABEL,
  TREND_LABEL,
  TREND_ARROW,
} from '@/lib/hormone-day-copy'
import { cn } from '@/lib/utils'

type HormonesDuJourProps = {
  dayNumber: number // jour de cycle pointé (alimente niveau/tendance/phrase)
}

export function HormonesDuJour({ dayNumber }: HormonesDuJourProps) {
  const [active, setActive] = useState<SeriesKey>(CURVE_SERIES[0].key)
  const current = CURVE_SERIES.find((s) => s.key === active) ?? CURVE_SERIES[0]
  const state = getHormoneState(current.key, dayNumber)

  // Le corps se teinte de la couleur de l'hormone active → raccord avec son onglet.
  const bodyFill = `color-mix(in srgb, ${current.colorVar} 14%, var(--card))`

  return (
    <div className="relative flex flex-col">
      {/* Onglets : chacun teinté de SA couleur d'hormone. L'actif partage la teinte du corps. */}
      <div className="flex items-end justify-start gap-1.5 overflow-x-auto overflow-y-hidden pt-1 -mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CURVE_SERIES.map((s) => {
          const isActive = s.key === current.key
          const tabFill = isActive
            ? `color-mix(in srgb, ${s.colorVar} 14%, var(--card))` // = corps → fusion
            : `color-mix(in srgb, ${s.colorVar} 30%, var(--card))` // sa teinte, plus saturée
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(s.key)}
              style={{ backgroundColor: tabFill }}
              className={cn(
                'relative flex items-center gap-1.5 transform-gpu origin-bottom whitespace-nowrap rounded-t-2xl px-4 pt-3 pb-7 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none',
                isActive
                  ? 'text-foreground'
                  : 'text-foreground/60 hover:-translate-y-1 hover:text-foreground hover:brightness-110 hover:shadow-[0_10px_24px_-10px_rgb(0_0_0/0.6)]',
              )}
            >
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.colorVar }} />
              {s.label}
            </button>
          )
        })}
      </div>

      {/* Corps du dossier : teinte de l'hormone active. Hauteur fixe (anti-saut) comme DomainTabs. */}
      <div
        style={{ backgroundColor: bodyFill }}
        className="relative rounded-3xl p-5 shadow-[0_22px_50px_-26px_rgb(0_0_0/0.7)] lg:h-80 lg:overflow-y-auto"
      >
        {/* key → la fiche fond en entrée à chaque changement d'hormone. */}
        <div key={current.key} className="animate-in fade-in slide-in-from-bottom-1 duration-300 space-y-4">
          {/* En-tête : nom + badge niveau + tendance, tous teintés de la couleur de l'hormone. */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="size-3.5 shrink-0 rounded-full" style={{ backgroundColor: current.colorVar }} />
            <h3 className="text-lg font-semibold text-foreground">{current.fullName}</h3>

            <span
              className="ml-auto rounded-full px-3 py-0.5 text-xs font-semibold"
              style={{
                color: current.colorVar,
                backgroundColor: `color-mix(in srgb, ${current.colorVar} 16%, transparent)`,
                border: `1px solid color-mix(in srgb, ${current.colorVar} 34%, transparent)`,
              }}
            >
              {LEVEL_LABEL[state.level]}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <span className="text-base leading-none" style={{ color: current.colorVar }}>
                {TREND_ARROW[state.trend]}
              </span>
              {TREND_LABEL[state.trend]}
            </span>
          </div>

          {/* Phrase contextuelle du jour, en callout inset. */}
          <p className="rounded-xl bg-card/60 px-4 py-3 text-sm leading-relaxed text-foreground">
            {hormoneDayPhrase(current.key, state)}
          </p>
        </div>
      </div>
    </div>
  )
}
