'use client'

// Onglets des conseils qualitatifs par domaine pour le jour courant (couche 2).
// Présentation pure : la résolution jour → entrée est faite en amont par domain-loader.

import { useState } from 'react'
import {
  Users,
  MessageCircle,
  Heart,
  Brain,
  Apple,
  HeartPulse,
  Moon,
  Dumbbell,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResolvedDomain } from '@/lib/domain-loader'

type DomainTabsProps = {
  domains: ResolvedDomain[]
}

// Icône par domaine (id → glyphe lucide). Repli Sparkles si un id inconnu apparaît.
const DOMAIN_ICON: Record<string, LucideIcon> = {
  activites: Users,
  communication: MessageCircle,
  intimite: Heart,
  mental: Brain,
  nutrition: Apple,
  sante: HeartPulse,
  sommeil: Moon,
  sport: Dumbbell,
}

export function DomainTabs({ domains }: DomainTabsProps) {
  // Premier domaine ayant du contenu pour ce jour, sinon le premier tout court.
  const initial = domains.find((d) => d.entry)?.id ?? domains[0]?.id
  const [active, setActive] = useState(initial)

  if (domains.length === 0) return null

  const current = domains.find((d) => d.id === active) ?? domains[0]
  const entry = current.entry

  // Dossier plein (réf. « dossier rose ») : corps + onglet actif partagent la MÊME teinte
  // → l'actif fusionne avec le corps. Les inactifs sont un lilas plus saturé qui dépasse
  // du haut ; le corps recouvre leur base. Aucun trait fin, que des aplats remplis.
  const folderFill = 'color-mix(in srgb, var(--primary) 14%, var(--card))'
  // Inactifs : lilas plus discret (28% au lieu de 40%) → l'actif ressort davantage.
  const tabFill = 'color-mix(in srgb, var(--primary) 28%, var(--card))'

  return (
    // Bloc pur onglets + corps (le titre et la pilule Conseil/Hormones vivent dans DayPanel).
    // flex-col → onglets puis corps. Le corps porte une hauteur fixe (anti-saut, cf. plus bas).
    <div className="relative flex flex-col">
        {/* Rangée d'onglets : dépassent du haut (-mb-4 → corps recouvre leur base). justify-start
            + gap → chaque onglet prend sa largeur naturelle (icône + label), collés à gauche,
            plus d'étirement forcé sur toute la largeur. Scroll horizontal si ça déborde. */}
        <div className="flex items-end justify-start gap-1.5 overflow-x-auto overflow-y-hidden pt-1 -mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {domains.map((d) => {
            const isActive = d.id === current.id
            const Icon = DOMAIN_ICON[d.id] ?? Sparkles
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(d.id)}
                style={{ backgroundColor: isActive ? folderFill : tabFill }}
                className={cn(
                  // pt-3 (12px) au-dessus du texte ; pb-7 (28px) dont 16px recouverts par le corps
                  // (-mb-4) → 12px visibles en dessous = espace égal haut/bas autour du texte.
                  // transform-gpu + origin-bottom : le lift/press pivote depuis la base (ancrage dossier).
                  // active:scale → feedback de press au clic. ease-out duration-200 → départ vif, fin douce.
                  // motion-reduce : on neutralise translate/scale pour respecter prefers-reduced-motion.
                  'relative flex items-center gap-1.5 transform-gpu origin-bottom whitespace-nowrap rounded-t-2xl px-4 pt-3 pb-7 text-sm font-medium transition-all duration-200 ease-out active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none',
                  isActive
                    ? 'text-foreground' // même teinte que le corps → fusion
                    // Inactifs : texte plus discret, et au survol l'onglet se soulève (-translate-y-1),
                    // s'éclaircit et gagne une ombre portée → invite tactile à le saisir.
                    : 'text-foreground/55 hover:-translate-y-1 hover:text-foreground hover:brightness-110 hover:shadow-[0_10px_24px_-10px_rgb(0_0_0/0.6)]',
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {d.label}
              </button>
            )
          })}
        </div>

        {/* Corps du dossier : grande carte pleine, même teinte que l'onglet actif → raccord
            invisible. Hauteur FIXE en desktop (lg:h-80) + scroll interne → le dossier ne change
            plus de taille selon le contenu du domaine → la colonne Julie ne saute plus. */}
        <div
          style={{ backgroundColor: folderFill }}
          className="relative rounded-3xl p-5 shadow-[0_22px_50px_-26px_rgb(0_0_0/0.7)] lg:h-80 lg:overflow-y-auto"
        >
          {/* key par domaine → le contenu fond en entrée à chaque changement d'onglet. */}
          <div key={current.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
        {entry ? (
          <div className="space-y-4">
            {/* Conseil principal en callout inset (plus sombre que le fond lilas du dossier). */}
            <p className="rounded-xl bg-card/60 px-4 py-3 text-sm leading-relaxed text-foreground">
              {entry.conseil}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
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
          </div>
        </div>
      </div>
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
  const accent = tone === 'positive' ? 'var(--urgence-normal)' : 'var(--urgence-critique)'
  return (
    // Panneau tinté du ton (vert = à privilégier, rouge = à éviter) → lecture immédiate.
    <div
      className="space-y-2 rounded-xl p-3"
      style={{
        backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`,
        border: `1px solid color-mix(in srgb, ${accent} 22%, transparent)`,
      }}
    >
      <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground">
            <span
              className="mt-1.5 size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
