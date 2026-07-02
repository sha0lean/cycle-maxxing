'use client'

// Avatar PNJ de Julie, colonne gauche du dashboard (« character sheet »).
// L'état affiché suit le JOUR du cycle (10 états, cf. lib/avatar.ts) ; l'aura suit la phase.
// Chaque état charge public/avatars/julie-<id>.webp ; tant que le fichier n'existe pas, on retombe
// sur l'emoji de l'état (aucun broken-image, le vrai sprite apparaît dès qu'on dépose le fichier).
//
// Cadrage libre : molette = zoom, glisser = recadrer, double-clic = réinitialiser. Le cadrage
// (zoom + position) est persisté en localStorage et vit AU-DESSUS du crossfade d'état → il est
// conservé quand on change de sprite (et entre les sessions).

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { dayToAvatarState, type AvatarState } from '@/lib/avatar'
import { PHASE_COLOR_VAR } from '@/lib/labels'
import type { PhaseId } from '@/lib/types'

type CharacterAvatarProps = {
  phase: PhaseId
  day: number // jour du cycle → choisit l'état (1 des 10)
}

// Cadrage de l'avatar : niveau de zoom + translation (px) du recadrage.
type Framing = { zoom: number; x: number; y: number }

const DEFAULT_FRAMING: Framing = { zoom: 1, x: 0, y: 0 }
const FRAMING_KEY = 'avatar-framing'
const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ZOOM_STEP = 1.12 // facteur multiplicatif par cran de molette

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

// Borne le pan pour que l'avatar ne puisse pas sortir entièrement du cadre : à zoom z, l'image
// (qui remplit le cadre à z=1) déborde de (z-1)·dim/2 de chaque côté. À z=1 → pan forcé à 0.
function clampPan(f: Framing, w: number, h: number): Framing {
  const maxX = ((f.zoom - 1) * w) / 2
  const maxY = ((f.zoom - 1) * h) / 2
  return { zoom: f.zoom, x: clamp(f.x, -maxX, maxX), y: clamp(f.y, -maxY, maxY) }
}

function loadFraming(): Framing {
  if (typeof window === 'undefined') return DEFAULT_FRAMING
  try {
    const raw = localStorage.getItem(FRAMING_KEY)
    if (!raw) return DEFAULT_FRAMING
    const f = JSON.parse(raw) as Partial<Framing>
    return { zoom: clamp(f.zoom ?? 1, ZOOM_MIN, ZOOM_MAX), x: f.x ?? 0, y: f.y ?? 0 }
  } catch {
    return DEFAULT_FRAMING
  }
}

export function CharacterAvatar({ phase, day }: CharacterAvatarProps) {
  const state = dayToAvatarState(day)
  const auraColor = PHASE_COLOR_VAR[phase]

  const viewportRef = useRef<HTMLDivElement>(null)
  const [framing, setFraming] = useState<Framing>(DEFAULT_FRAMING)
  // Point de départ d'un glissement en cours (null = pas de drag).
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)

  // Restaure le cadrage persistant au montage (client-only → pas de mismatch SSR).
  useEffect(() => {
    setFraming(loadFraming())
  }, [])

  // Persiste à chaque changement de cadrage.
  useEffect(() => {
    try {
      localStorage.setItem(FRAMING_KEY, JSON.stringify(framing))
    } catch {
      /* quota / mode privé : on ignore */
    }
  }, [framing])

  // Molette = zoom, centré sur le curseur. Listener natif non-passif : React pose wheel en
  // passif → preventDefault() y serait ignoré et la page défilerait.
  useEffect(() => {
    const vp = viewportRef.current
    if (!vp) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = vp.getBoundingClientRect()
      const cx = e.clientX - rect.left - rect.width / 2 // curseur relatif au centre du cadre
      const cy = e.clientY - rect.top - rect.height / 2
      setFraming((f) => {
        const nz = clamp(f.zoom * (e.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP), ZOOM_MIN, ZOOM_MAX)
        const ratio = nz / f.zoom
        // Garde le point sous le curseur fixe pendant le zoom.
        return clampPan({ zoom: nz, x: cx - (cx - f.x) * ratio, y: cy - (cy - f.y) * ratio }, rect.width, rect.height)
      })
    }
    vp.addEventListener('wheel', onWheel, { passive: false })
    return () => vp.removeEventListener('wheel', onWheel)
  }, [])

  // Glisser = recadrer (pan). Écoute sur window pour ne pas perdre le drag hors du cadre.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current
      const vp = viewportRef.current
      if (!d || !vp) return
      const rect = vp.getBoundingClientRect()
      setFraming((f) =>
        clampPan({ zoom: f.zoom, x: d.baseX + (e.clientX - d.startX), y: d.baseY + (e.clientY - d.startY) }, rect.width, rect.height),
      )
    }
    const onUp = () => {
      dragRef.current = null
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault() // pas de sélection ni de drag natif de l'image
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: framing.x, baseY: framing.y }
  }

  return (
    // Colonne pleine hauteur : prénom compact en tête, avatar qui prend tout le reste.
    <div className="flex h-full flex-col items-center gap-1">
      {/* En-tête de fiche : prénom en display haute-tension + état du jour en eyebrow mono. */}
      <div className="text-center">
        <h2 className="font-display text-5xl leading-none text-foreground">Julie</h2>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {state.label}
        </p>
      </div>

      {/* Scène : aura de phase (glow libre, derrière) + fenêtre de cadrage (avatar zoomable). */}
      <div className="relative w-full flex-1">
        {/* Aura : halo radial coloré par la phase, pulse lent → impression de vie. Hors clip. */}
        <div
          aria-hidden
          className="avatar-aura absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, ${auraColor} 70%, transparent), transparent 70%)`,
          }}
        />

        {/* Fenêtre de cadrage : clippe l'avatar zoomé. Molette/glisser/double-clic pilotent le cadrage. */}
        <div
          ref={viewportRef}
          onMouseDown={onMouseDown}
          onDoubleClick={() => setFraming(DEFAULT_FRAMING)}
          title="Molette : zoomer · glisser : recadrer · double-clic : réinitialiser"
          className={cn(
            'absolute inset-0 select-none overflow-hidden',
            framing.zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
          )}
        >
          {/* Couche zoomée : transform persistant, vit hors du key d'état → conservé au crossfade.
              flex center → l'image (calée sur la hauteur) déborde horizontalement, clippée par le cadre. */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              transform: `translate(${framing.x}px, ${framing.y}px) scale(${framing.zoom})`,
              transformOrigin: 'center center',
              willChange: 'transform',
            }}
          >
            {/* key={state.id} → remonte la figure au changement d'état (crossfade + nouveau chargement). */}
            <AvatarFigure key={state.id} state={state} auraColor={auraColor} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Le sprite de l'état. WebP détouré en pied si présent, sinon repli emoji dans un médaillon.
function AvatarFigure({ state, auraColor }: { state: AvatarState; auraColor: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="flex h-full w-full items-end justify-center">
        <div
          className="avatar-float animate-in fade-in zoom-in-95 relative mb-6 flex size-40 items-center justify-center rounded-full duration-500"
          style={{
            background: `color-mix(in srgb, ${auraColor} 16%, var(--card))`,
            boxShadow: `inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent), 0 18px 40px -20px ${auraColor}`,
          }}
        >
          <span className="text-7xl leading-none" role="img" aria-label={state.label}>
            {state.emoji}
          </span>
        </div>
      </div>
    )
  }

  return (
    // <img> natif (pas next/image) : sprite qui change souvent, fond transparent, repli onError.
    // draggable=false → le glissement recadre au lieu de déclencher le drag natif de l'image.
    // h-full w-auto max-w-none : calé sur la hauteur → haut et bas de la photo touchent les bords
    // du cadre ; la largeur déborde (portrait 2:3) et se fait clipper par overflow-hidden.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/avatars/julie-${state.id}.webp`}
      alt={state.label}
      draggable={false}
      onError={() => setFailed(true)}
      className="avatar-float animate-in fade-in zoom-in-95 h-full w-auto max-w-none duration-500"
      style={{ filter: `drop-shadow(0 18px 30px color-mix(in srgb, ${auraColor} 45%, transparent))` }}
    />
  )
}
