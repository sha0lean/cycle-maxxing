'use client'

// Bascule de thème typographique (corps + titres). Modifie data-typo sur <html>
// → globals.css réassigne --font-sans / --font-display. Persisté en localStorage
// (restauré sans flash par le script inline du layout). Chaque « Aa » est rendu
// dans sa propre police = aperçu direct du thème.

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Pour chaque thème : la police du bouton d'aperçu (font) + le couple corps/titre appliqué.
const THEMES = [
  { id: 'editorial', label: 'Fraunces', font: 'var(--font-fraunces)', body: 'var(--font-inter)', title: 'var(--font-fraunces)' },
  { id: 'grotesk', label: 'Space Grotesk', font: 'var(--font-space)', body: 'var(--font-space)', title: 'var(--font-space)' },
  { id: 'doux', label: 'Quicksand', font: 'var(--font-quicksand)', body: 'var(--font-nunito)', title: 'var(--font-quicksand)' },
] as const

type TypoId = (typeof THEMES)[number]['id']

export function FontToggle() {
  const [typo, setTypo] = useState<TypoId>('editorial')

  // Synchronise l'état React avec ce que le script inline a déjà appliqué au DOM.
  useEffect(() => {
    const current = (document.documentElement.dataset.typo as TypoId) ?? 'editorial'
    setTypo(current)
  }, [])

  const apply = (id: TypoId) => {
    setTypo(id)
    const theme = THEMES.find((t) => t.id === id) ?? THEMES[0]
    const el = document.documentElement
    // Variables inline → consommées par html / .font-display dans globals.css.
    el.style.setProperty('--active-body', theme.body)
    el.style.setProperty('--active-title', theme.title)
    el.dataset.typo = id
    try {
      localStorage.setItem('typo', id)
    } catch {
      // localStorage indisponible (mode privé) → on garde juste le changement en session.
    }
  }

  return (
    <div className="flex gap-0.5 rounded-lg bg-secondary p-0.5" role="group" aria-label="Police">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => apply(t.id)}
          title={`Police : ${t.label}`}
          aria-pressed={typo === t.id}
          style={{ fontFamily: t.font }}
          className={cn(
            'grid size-7 place-items-center rounded-md text-base leading-none transition',
            typo === t.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Aa
        </button>
      ))}
    </div>
  )
}
