'use client'

// Avatar PNJ de Julie au centre du dashboard (style « character sheet »).
// L'émotion suit le bien-être du jour (wellbeingScore), l'aura suit la phase du cycle.
// v1 = PLACEHOLDER : grand emoji + halo. Les vrais PNG détourés se branchent ici
//   en remplaçant le bloc emoji par <img src={`/avatars/julie-${mood.id}.png`} />.

import { cn } from '@/lib/utils'
import { wellbeingScore, scoreToMood } from '@/lib/wellbeing'
import { PHASE_COLOR_VAR, PHASE_LABELS } from '@/lib/labels'
import type { Metrics, PhaseId } from '@/lib/types'

type CharacterAvatarProps = {
  metrics: Metrics
  phase: PhaseId
}

export function CharacterAvatar({ metrics, phase }: CharacterAvatarProps) {
  const score = wellbeingScore(metrics)
  const mood = scoreToMood(score)
  const auraColor = PHASE_COLOR_VAR[phase]

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-2">
      {/* Nom de la sujette, façon header de fiche de perso. */}
      <h2 className="font-display text-center text-3xl font-black uppercase tracking-tight text-foreground">
        Julie
      </h2>

      {/* Scène de l'avatar : aura de phase (derrière) + personnage (devant). */}
      <div className="relative flex h-56 w-56 items-center justify-center">
        {/* Aura : halo radial coloré par la phase, pulse lent → impression de vie. */}
        <div
          aria-hidden
          className="avatar-aura absolute inset-0 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, ${auraColor} 70%, transparent), transparent 70%)`,
          }}
        />

        {/* Placeholder émotion : grand emoji flottant. key={mood.id} → crossfade au changement
            de jour/score. Remplacer ce bloc par l'<img> du PNG détouré le moment venu. */}
        <div
          key={mood.id}
          className="avatar-float animate-in fade-in zoom-in-95 relative flex size-40 items-center justify-center rounded-full duration-500"
          style={{
            background: `color-mix(in srgb, ${auraColor} 16%, var(--card))`,
            boxShadow: `inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent), 0 18px 40px -20px ${auraColor}`,
          }}
        >
          <span className="text-7xl leading-none" role="img" aria-label={mood.label}>
            {mood.emoji}
          </span>
        </div>
      </div>

      {/* Bandeau d'état : forme du jour (score) + libellé d'humeur + phase. */}
      <div className="flex flex-col items-center gap-1">
        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: `color-mix(in srgb, ${auraColor} 18%, var(--card))`,
            border: `1px solid color-mix(in srgb, ${auraColor} 35%, transparent)`,
          }}
        >
          <span className="text-sm font-medium text-muted-foreground">Forme</span>
          <span className="font-mono text-lg font-bold tabular-nums text-foreground">{score}</span>
          <span className="text-lg leading-none">{mood.emoji}</span>
        </div>
        <p className={cn('text-sm font-medium', 'text-foreground/80')}>
          {mood.label} · <span className="text-muted-foreground">{PHASE_LABELS[phase]}</span>
        </p>
      </div>
    </div>
  )
}
