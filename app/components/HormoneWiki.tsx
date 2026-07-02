'use client'

// Wiki hormones — page pleine largeur (onglet « Hormones » de la navbar). Contenu ENCYCLOPÉDIQUE
// et statique : la fiche complète de chaque hormone (nom, définition, rôle, pic, ressenti).
// Distinct du volet « Hormones du jour » (AdvicePanel), qui lui est contextuel au jour pointé.
// Onglets teintés de la couleur de chaque hormone (tokens --hormone-*, cf. hormone-theme.ts).

import { useState } from 'react'
import { CURVE_SERIES } from '@/lib/reference-curves'
import { cn } from '@/lib/utils'

export function HormoneWiki() {
  const [active, setActive] = useState(CURVE_SERIES[0].key)
  const current = CURVE_SERIES.find((s) => s.key === active) ?? CURVE_SERIES[0]
  const bodyFill = `color-mix(in srgb, ${current.colorVar} 14%, var(--card))`

  return (
    <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="mb-1 px-1 font-display text-4xl leading-none text-foreground">
        Comprendre les hormones
      </h2>
      <p className="mb-4 px-1 text-sm text-muted-foreground">
        Formes et rôles universels du cycle — pas les mesures de Julie.
      </p>

      <div className="relative flex flex-col">
        {/* Onglets teintés par hormone ; l'actif fusionne avec le corps. */}
        <div className="flex items-end justify-start gap-1.5 overflow-x-auto overflow-y-hidden pt-1 -mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CURVE_SERIES.map((s) => {
            const isActive = s.key === current.key
            const tabFill = isActive
              ? `color-mix(in srgb, ${s.colorVar} 14%, var(--card))`
              : `color-mix(in srgb, ${s.colorVar} 30%, var(--card))`
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

        {/* Corps : fiche complète de l'hormone, teinte de sa couleur. */}
        <div
          style={{ backgroundColor: bodyFill }}
          className="relative rounded-3xl p-6 shadow-[0_22px_50px_-26px_rgb(0_0_0/0.7)]"
        >
          <div key={current.key} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
            <div className="flex items-center gap-2.5">
              <span className="size-3.5 shrink-0 rounded-full" style={{ backgroundColor: current.colorVar }} />
              <h3 className="text-xl font-semibold text-foreground">{current.fullName}</h3>
            </div>

            <p className="mt-3 rounded-xl bg-card/60 px-4 py-3 text-sm leading-relaxed text-foreground">
              {current.definition}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <InfoBlock title="Son rôle" text={current.role} accent={current.colorVar} />
              <InfoBlock title="Quand ça culmine" text={current.peak} accent={current.colorVar} />
              <InfoBlock title="Ce que ça change pour Julie" text={current.feel} accent={current.colorVar} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Bloc d'info : titre coloré (teinte de l'hormone) + texte, sur un panneau légèrement tinté.
function InfoBlock({ title, text, accent }: { title: string; text: string; accent: string }) {
  return (
    <div
      className="space-y-1.5 rounded-xl p-3"
      style={{
        backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${accent} 22%, transparent)`,
      }}
    >
      <h4 className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  )
}
