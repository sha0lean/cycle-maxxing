'use client'

// Avatar PNJ de Julie au centre du dashboard (style « character sheet »).
// L'état affiché suit le JOUR du cycle (10 états, cf. lib/avatar.ts) ; l'aura suit la phase ;
// le score de bien-être module le badge « Forme » (et, plus tard, l'intensité des micro-anims).
// Chaque état charge public/avatars/julie-<id>.webp ; tant que le fichier n'existe pas, on retombe
// sur l'emoji de l'état (aucun broken-image, et le vrai sprite apparaît dès qu'on dépose le fichier).

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { wellbeingScore } from '@/lib/wellbeing'
import { dayToAvatarState, type AvatarState } from '@/lib/avatar'
import { PHASE_COLOR_VAR, PHASE_LABELS } from '@/lib/labels'
import type { Metrics, PhaseId } from '@/lib/types'

type CharacterAvatarProps = {
  metrics: Metrics
  phase: PhaseId
  day: number // jour du cycle → choisit l'état (1 des 10)
}

export function CharacterAvatar({ metrics, phase, day }: CharacterAvatarProps) {
  const score = wellbeingScore(metrics)
  const state = dayToAvatarState(day)
  const auraColor = PHASE_COLOR_VAR[phase]

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-2">
      {/* Nom de la sujette, façon header de fiche de perso. */}
      <h2 className="font-display text-center text-3xl font-black uppercase tracking-tight text-foreground">
        Julie
      </h2>

      {/* Scène de l'avatar : aura de phase (derrière) + personnage (devant). */}
      <div className="relative flex h-72 w-full items-center justify-center">
        {/* Aura : halo radial coloré par la phase, pulse lent → impression de vie. */}
        <div
          aria-hidden
          className="avatar-aura absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, ${auraColor} 70%, transparent), transparent 70%)`,
          }}
        />

        {/* key={state.id} → remonte la figure au changement d'état : crossfade + nouvelle tentative de chargement PNG. */}
        <AvatarFigure key={state.id} state={state} auraColor={auraColor} />
      </div>

      {/* Bandeau d'état : forme du jour (score) + libellé d'état + phase. */}
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
          <span className="text-lg leading-none">{state.emoji}</span>
        </div>
        <p className={cn('text-sm font-medium', 'text-foreground/80')}>
          {state.label} · <span className="text-muted-foreground">{PHASE_LABELS[phase]}</span>
        </p>
      </div>
    </div>
  )
}

// Le sprite de l'état. PNG détouré en pied si présent, sinon repli emoji dans un médaillon.
function AvatarFigure({ state, auraColor }: { state: AvatarState; auraColor: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="avatar-float animate-in fade-in zoom-in-95 relative flex size-40 items-center justify-center rounded-full duration-500"
        style={{
          background: `color-mix(in srgb, ${auraColor} 16%, var(--card))`,
          boxShadow: `inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent), 0 18px 40px -20px ${auraColor}`,
        }}
      >
        <span className="text-7xl leading-none" role="img" aria-label={state.label}>
          {state.emoji}
        </span>
      </div>
    )
  }

  return (
    // <img> natif (pas next/image) : sprite qui change souvent, fond transparent, repli onError.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/avatars/julie-${state.id}.webp`}
      alt={state.label}
      onError={() => setFailed(true)}
      className="avatar-float animate-in fade-in zoom-in-95 relative h-full w-auto object-contain duration-500"
      style={{ filter: `drop-shadow(0 18px 30px color-mix(in srgb, ${auraColor} 45%, transparent))` }}
    />
  )
}
