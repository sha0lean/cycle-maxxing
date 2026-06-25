'use client'

// Frise interactive (B-002) : bandes de phases + flags + courbes hormones/BBT de référence,
// avec curseur vertical et scrub. Émet le jour survolé/sélectionné vers le parent (Frise).
//
// Tout est en jours ABSOLUS (depuis j1, sans plafond) : la fenêtre affichée glisse et
// les motifs (phases, flags, courbes) se répètent d'un cycle au suivant via wrapCycleDay,
// d'où une frise qui boucle sans rupture. Deux modes : « centré » (jour J au milieu) et
// « cycle » (le cycle 1→27 contenant J, aligné).
//
// Les couleurs viennent des tokens de thème : recharts pose stroke/fill en attributs SVG,
// or var() n'y est pas résolu → on lit les variables calculées au montage.

import { useEffect, useMemo, useState } from 'react'
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { REFERENCE_CURVES, CURVE_SERIES } from '@/lib/reference-curves'
import { getPhaseSpans, wrapCycleDay, CYCLE_REF_LENGTH } from '@/lib/cycle'
import { PHASE_LABELS } from '@/lib/labels'
import { ViewToggle, type MainView } from '@/components/ViewToggle'
import { cn } from '@/lib/utils'
import type { PhaseId } from '@/lib/types'

const PHASE_SPANS = getPhaseSpans()
const OVULATION_PEAK_DAY = 13 // jour-événement ponctuel (pic d'ovulation), distinct des bandes-durée
const TICK_DAYS = [1, 5, 12, 15, 21, 27] // jours-de-cycle gradués sur l'axe (fenêtre serrée)
const TICK_DAYS_SPARSE = [1, 13, 21] // graduations allégées quand la portée est large
const L = CYCLE_REF_LENGTH
const SPAN_MIN = Math.round(L / 2) // portée minimale (~½ cycle)
const SPAN_MAX = L * 4 // portée maximale (~4 cycles)

type ViewMode = 'centered' | 'cycle'

type TimelineProps = {
  cursorDay: number // jour absolu sous le curseur (hover ou sélection)
  todayDay: number // jour absolu courant
  view: MainView // pour la bascule Frise/Calendrier dans l'en-tête
  onViewChange: (v: MainView) => void
  onScrub: (day: number | null) => void
  onSelect: (day: number) => void
}

// État minimal de recharts qu'on consomme sur les events souris.
type ChartMouseState = { activeLabel?: string | number }

function readVar(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function Timeline({ cursorDay, todayDay, view, onViewChange, onScrub, onSelect }: TimelineProps) {
  const [mode, setMode] = useState<ViewMode>('centered')
  const [spanDays, setSpanDays] = useState(L) // portée visible en mode centré (un cycle par défaut)
  const [selected, setSelected] = useState<Set<string>>(new Set()) // focus (vide = tout afficher)
  const [hovered, setHovered] = useState<string | null>(null) // série survolée dans la légende
  const [colors, setColors] = useState<Record<string, string>>({})

  // Fenêtre affichée (bornes en jours absolus) selon le mode.
  const [xMin, xMax] =
    mode === 'centered'
      ? [todayDay - spanDays / 2, todayDay + spanDays / 2] // jour J au centre, portée réglable
      : (() => {
          const base = Math.floor((todayDay - 1) / L) * L // début du cycle contenant J
          return [base + 0.5, base + L + 0.5]
        })()

  // Données de la fenêtre : un point par jour absolu, valeurs repliées sur le référentiel.
  const data = useMemo(() => {
    const pts: Array<{ absDay: number } & Omit<(typeof REFERENCE_CURVES)[number], 'day'>> = []
    for (let d = Math.ceil(xMin); d <= Math.floor(xMax); d++) {
      const { day: _day, ...vals } = REFERENCE_CURVES[wrapCycleDay(d) - 1]
      pts.push({ absDay: d, ...vals })
    }
    return pts
  }, [xMin, xMax])

  // Motifs répétés sur chaque cycle qui intersecte la fenêtre.
  const kStart = Math.floor((xMin - 1) / L)
  const kEnd = Math.floor((xMax - 1) / L)
  const bands = useMemo(() => {
    const out: Array<{ key: string; phase: PhaseId; x1: number; x2: number }> = []
    for (let k = kStart; k <= kEnd; k++) {
      for (const s of PHASE_SPANS) {
        out.push({ key: `${k}-${s.phase}`, phase: s.phase, x1: s.start + k * L - 0.5, x2: s.end + k * L + 0.5 })
      }
    }
    return out
  }, [kStart, kEnd])
  // Pics d'ovulation (jours-événements ponctuels), un par cycle visible.
  const peaks = useMemo(() => {
    const out: Array<{ key: string; x: number }> = []
    for (let k = kStart; k <= kEnd; k++) {
      const x = OVULATION_PEAK_DAY + k * L
      if (x >= xMin && x <= xMax) out.push({ key: `ov-${k}`, x })
    }
    return out
  }, [kStart, kEnd, xMin, xMax])

  // Bande de phase contenant le curseur (instance précise dans la fenêtre) → mise en avant.
  const cursorBandKey = (() => {
    const cycleDay = wrapCycleDay(cursorDay)
    const k = Math.floor((cursorDay - 1) / L)
    const span = PHASE_SPANS.find((s) => cycleDay >= s.start && cycleDay <= s.end)
    return span ? `${k}-${span.phase}` : null
  })()
  const ticks = useMemo(() => {
    // Graduations allégées dès que la fenêtre dépasse ~1,5 cycle, sinon ça se chevauche.
    const tickDays = xMax - xMin > L * 1.5 ? TICK_DAYS_SPARSE : TICK_DAYS
    const out: number[] = []
    for (let k = kStart; k <= kEnd; k++) {
      for (const t of tickDays) {
        const x = t + k * L
        if (x >= xMin && x <= xMax) out.push(x)
      }
    }
    return out.sort((a, b) => a - b)
  }, [kStart, kEnd, xMin, xMax])

  // Résout toutes les CSS-vars utilisées en couleurs concrètes (une fois, au montage).
  useEffect(() => {
    const vars = [
      ...CURVE_SERIES.map((s) => s.colorVar),
      ...PHASE_SPANS.map((s) => `var(--phase-${s.phase})`),
      'var(--primary)',
      'var(--foreground)',
      'var(--background)',
      'var(--border)',
      'var(--muted-foreground)',
    ]
    const resolved: Record<string, string> = {}
    for (const v of vars) resolved[v] = readVar(v.slice(4, -1)) // retire "var(" et ")"
    setColors(resolved)
  }, [])

  const col = (v: string) => colors[v] ?? 'transparent'

  // Clic : ajoute/retire la série du focus. Focus vide ⇒ toutes les courbes affichées.
  const toggleSelect = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  const clearSelection = () => setSelected(new Set())
  const hasSelection = selected.size > 0

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Frise du cycle
          </h2>
          <ViewToggle view={view} onChange={onViewChange} />
        </div>
        <div className="flex items-center gap-3">
          {/* Portée : largeur de fenêtre centrée sur le jour J (mode Centré uniquement) */}
          {mode === 'centered' && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="tabular-nums">
                Portée {spanDays} j (~{(spanDays / L).toFixed(1)} cycles)
              </span>
              <input
                type="range"
                min={SPAN_MIN}
                max={SPAN_MAX}
                step={1}
                value={spanDays}
                onChange={(e) => setSpanDays(Number(e.target.value))}
                className="h-1.5 w-28 cursor-pointer"
                style={{ accentColor: col('var(--primary)') }}
              />
              {spanDays !== L && (
                <button
                  type="button"
                  onClick={() => setSpanDays(L)}
                  className="rounded-full border border-border px-2 py-0.5 font-medium transition hover:text-foreground"
                >
                  1 cycle
                </button>
              )}
            </div>
          )}
          {/* Bascule centrage : jour J au milieu ou cycle 1→27 aligné */}
          <div className="flex gap-1 rounded-lg bg-secondary p-0.5 text-xs">
            {(['centered', 'cycle'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition',
                  mode === m ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground',
                )}
              >
                {m === 'centered' ? 'Centré' : 'Cycle'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Légende : survol = mise en avant temporaire · clic = focus (cumulable pour comparer).
          Sans focus, tout est affiché ; « Tout afficher » remet à zéro. */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {CURVE_SERIES.map((s) => {
          const isSelected = selected.has(s.key)
          const excluded = hasSelection && !isSelected // hors focus ⇒ non tracée
          const isHovered = hovered === s.key
          const dimmed = excluded || (hovered !== null && !isHovered)
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => toggleSelect(s.key)}
              onMouseEnter={() => setHovered(s.key)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground transition',
                dimmed && 'opacity-40',
                isSelected && 'ring-2 ring-foreground/30',
              )}
            >
              <span
                className="size-2 rounded-full border"
                style={{
                  backgroundColor: excluded ? 'transparent' : col(s.colorVar),
                  borderColor: col(s.colorVar),
                }}
              />
              {s.label}
            </button>
          )
        })}
        {hasSelection && (
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:text-foreground"
          >
            Tout afficher
          </button>
        )}
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 8, bottom: 0, left: 8 }}
          onMouseMove={(s: ChartMouseState) => {
            if (s?.activeLabel != null) onScrub(Number(s.activeLabel))
          }}
          onMouseLeave={() => onScrub(null)}
          onClick={(s: ChartMouseState) => {
            if (s?.activeLabel != null) onSelect(Number(s.activeLabel))
          }}
        >
          {/* Couche 1 — bandes de phases (répétées par cycle), nommées.
              La bande sous le curseur ressort. */}
          {bands.map((b) => {
            const highlighted = b.key === cursorBandKey
            return (
              <ReferenceArea
                key={b.key}
                x1={b.x1}
                x2={b.x2}
                fill={col(`var(--phase-${b.phase})`)}
                fillOpacity={highlighted ? 0.34 : 0.18}
                stroke="none"
                label={{
                  value: PHASE_LABELS[b.phase],
                  position: 'insideTop',
                  fontSize: 10,
                  fontWeight: highlighted ? 700 : 500,
                  fill: col(`var(--phase-${b.phase})`),
                }}
              />
            )
          })}

          <XAxis
            dataKey="absDay"
            type="number"
            domain={[xMin, xMax]}
            ticks={ticks}
            tickFormatter={(v) => String(wrapCycleDay(Number(v)))}
            tick={{ fontSize: 11, fill: col('var(--muted-foreground)') }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis domain={[0, 100]} hide />

          {/* Jours-événements ponctuels : pic d'ovulation (pastille en haut, distincte des bandes) */}
          {peaks.map((p) => (
            <ReferenceDot
              key={p.key}
              x={p.x}
              y={94}
              r={4}
              fill={col('var(--phase-ovulation)')}
              stroke={col('var(--background)')}
              strokeWidth={1.5}
              label={{
                value: 'Ovulation',
                position: 'top',
                fontSize: 10,
                fontWeight: 600,
                fill: col('var(--phase-ovulation)'),
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

          {/* Couches 2 & 3 — courbes hormones + BBT en aires translucides.
              Focus vide ⇒ tout ; sinon seules les séries du focus. Ligne fine et contrastée
              par défaut ; la série survolée s'épaissit, les autres s'estompent. Pas de point. */}
          {CURVE_SERIES.filter((s) => !hasSelection || selected.has(s.key)).map((s) => {
            const isActive = hovered === s.key
            const dimmed = hovered !== null && !isActive
            return (
              <Area
                key={s.key}
                type="monotone"
                dataKey={s.key}
                stroke={col(s.colorVar)}
                strokeWidth={isActive ? 3 : 1.5}
                strokeOpacity={dimmed ? 0.15 : 1}
                fill={col(s.colorVar)}
                fillOpacity={dimmed ? 0.05 : isActive ? 0.38 : 0.22}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            )
          })}

          {/* Tooltip neutralisé : on ne veut que le suivi du jour actif pour le scrub */}
          <Tooltip cursor={false} content={() => null} />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  )
}
