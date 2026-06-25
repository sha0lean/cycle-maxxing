'use client'

// Frise interactive (B-002) : bandes de phases + flags + courbes hormones/BBT de référence,
// avec curseur vertical et scrub. Émet le jour survolé/sélectionné vers le parent (Frise).
// Les couleurs viennent des tokens de thème : recharts pose stroke/fill en attributs SVG,
// or var() n'y est pas résolu → on lit les variables calculées au montage.

import { useEffect, useState } from 'react'
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { REFERENCE_CURVES, CURVE_SERIES } from '@/lib/reference-curves'
import { getPhaseSpans } from '@/lib/cycle'

const PHASE_SPANS = getPhaseSpans()
const FLAGS = [
  { day: 1, label: 'Règles' },
  { day: 13, label: 'Ovulation' },
  { day: 21, label: 'SPM' },
]

type TimelineProps = {
  cursorDay: number // jour effectif sous le curseur (hover ou sélection)
  todayDay: number
  onScrub: (day: number | null) => void
  onSelect: (day: number) => void
}

// État minimal de recharts qu'on consomme sur les events souris.
type ChartMouseState = { activeLabel?: string | number }

function readVar(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function Timeline({ cursorDay, todayDay, onScrub, onSelect }: TimelineProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [colors, setColors] = useState<Record<string, string>>({})

  // Résout toutes les CSS-vars utilisées en couleurs concrètes (une fois, au montage).
  useEffect(() => {
    const vars = [
      ...CURVE_SERIES.map((s) => s.colorVar),
      ...PHASE_SPANS.map((s) => `var(--phase-${s.phase})`),
      'var(--primary)',
      'var(--foreground)',
      'var(--border)',
      'var(--muted-foreground)',
    ]
    const resolved: Record<string, string> = {}
    for (const v of vars) resolved[v] = readVar(v.slice(4, -1)) // retire "var(" et ")"
    setColors(resolved)
  }, [])

  const col = (v: string) => colors[v] ?? 'transparent'

  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Frise du cycle
      </h2>

      {/* Légende cliquable : masque/affiche chaque courbe */}
      <div className="mb-3 flex flex-wrap gap-2">
        {CURVE_SERIES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => toggle(s.key)}
            className={`flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-opacity ${
              hidden.has(s.key) ? 'opacity-40' : ''
            }`}
          >
            <span className="size-2 rounded-full" style={{ backgroundColor: col(s.colorVar) }} />
            {s.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart
          data={REFERENCE_CURVES}
          margin={{ top: 12, right: 8, bottom: 0, left: 8 }}
          onMouseMove={(s: ChartMouseState) => {
            if (s?.activeLabel != null) onScrub(Number(s.activeLabel))
          }}
          onMouseLeave={() => onScrub(null)}
          onClick={(s: ChartMouseState) => {
            if (s?.activeLabel != null) onSelect(Number(s.activeLabel))
          }}
        >
          {/* Couche 1 — bandes de phases */}
          {PHASE_SPANS.map((span) => (
            <ReferenceArea
              key={span.phase}
              x1={span.start - 0.5}
              x2={span.end + 0.5}
              fill={col(`var(--phase-${span.phase})`)}
              fillOpacity={0.12}
              stroke="none"
            />
          ))}

          <XAxis
            dataKey="day"
            type="number"
            domain={[0.5, 27.5]}
            ticks={[1, 5, 12, 15, 21, 27]}
            tick={{ fontSize: 11, fill: col('var(--muted-foreground)') }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis domain={[0, 100]} hide />

          {/* Flags des moments clés */}
          {FLAGS.map((f) => (
            <ReferenceLine
              key={f.day}
              x={f.day}
              stroke={col('var(--border)')}
              strokeDasharray="2 2"
              label={{
                value: f.label,
                position: 'top',
                fontSize: 10,
                fill: col('var(--muted-foreground)'),
              }}
            />
          ))}

          {/* Aujourd'hui (discret) + curseur effectif (fort) */}
          <ReferenceLine
            x={todayDay}
            stroke={col('var(--foreground)')}
            strokeOpacity={0.35}
            strokeDasharray="4 3"
          />
          <ReferenceLine x={cursorDay} stroke={col('var(--primary)')} strokeWidth={2} />

          {/* Couches 2 & 3 — courbes hormones + BBT */}
          {CURVE_SERIES.filter((s) => !hidden.has(s.key)).map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={col(s.colorVar)}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}

          {/* Tooltip neutralisé : on ne veut que le suivi du jour actif pour le scrub */}
          <Tooltip cursor={false} content={() => null} />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  )
}
