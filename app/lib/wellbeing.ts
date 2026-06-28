// Score de bien-être global du jour → pilote l'émotion de l'avatar (CharacterAvatar).
// Les 8 métriques ont des polarités opposées : on inverse les négatives avant la moyenne,
// sinon un jour douloureux (douleurs/stress hauts) sortirait un faux « bon score ».

import type { Metrics, MetricKey } from '@/lib/types'

// Métriques où « haut = mal-être » → comptées en (100 - valeur) dans le score.
const NEGATIVE_KEYS: ReadonlySet<MetricKey> = new Set([
  'fatigue',
  'sensibilite',
  'stress',
  'douleurs',
  'irritabilite',
])

// Identifiant stable d'humeur → sert aussi de suffixe de fichier pour les avatars
// (ex : julie-radiant.png). Du plus haut au plus bas bien-être.
export type MoodId = 'radiant' | 'serene' | 'neutral' | 'tender' | 'ache'

export type Mood = {
  id: MoodId
  label: string // libellé FR affiché sous l'avatar
  emoji: string // placeholder visuel tant que les vrais PNG ne sont pas branchés
}

// Moyenne des 8 jauges, négatives inversées → 0 (au plus bas) à 100 (au plus haut).
export function wellbeingScore(metrics: Metrics): number {
  const keys = Object.keys(metrics) as MetricKey[]
  const total = keys.reduce((sum, key) => {
    const v = metrics[key]
    return sum + (NEGATIVE_KEYS.has(key) ? 100 - v : v)
  }, 0)
  return Math.round(total / keys.length)
}

// 5 paliers d'humeur. Bornes larges au centre (la majorité des jours y atterrit),
// extrêmes resserrés pour que radieuse/douleur restent des états marquants.
const MOODS: ReadonlyArray<{ min: number; mood: Mood }> = [
  { min: 75, mood: { id: 'radiant', label: 'Radieuse', emoji: '✨' } },
  { min: 60, mood: { id: 'serene', label: 'Sereine', emoji: '🙂' } },
  { min: 45, mood: { id: 'neutral', label: 'Tranquille', emoji: '😐' } },
  { min: 30, mood: { id: 'tender', label: 'Sensible', emoji: '🥺' } },
  { min: 0, mood: { id: 'ache', label: 'Éprouvée', emoji: '😣' } },
]

export function scoreToMood(score: number): Mood {
  return (MOODS.find(({ min }) => score >= min) ?? MOODS[MOODS.length - 1]).mood
}
