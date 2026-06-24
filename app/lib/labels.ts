// Libellés d'affichage FR — couche présentation, séparée du modèle (types.ts).

import type { MetricKey, PhaseId, UrgenceLevel } from '@/lib/types'

export const METRIC_LABELS: Record<MetricKey, string> = {
  energie: 'Énergie',
  humeur: 'Humeur',
  libido: 'Libido',
  fatigue: 'Fatigue',
  sensibilite: 'Sensibilité',
  stress: 'Stress',
  douleurs: 'Douleurs',
  irritabilite: 'Irritabilité',
}

export const PHASE_LABELS: Record<PhaseId, string> = {
  regles: 'Règles',
  folliculaire: 'Folliculaire',
  ovulation: 'Ovulation',
  luteale: 'Lutéale',
  spm: 'SPM',
}

export const URGENCE_LABELS: Record<UrgenceLevel, string> = {
  normal: 'Normal',
  attention: 'Attention',
  critique: 'Critique',
}

// Classe Tailwind de la couleur de phase (tokens définis dans globals.css).
export const PHASE_COLOR_VAR: Record<PhaseId, string> = {
  regles: 'var(--phase-regles)',
  folliculaire: 'var(--phase-folliculaire)',
  ovulation: 'var(--phase-ovulation)',
  luteale: 'var(--phase-luteale)',
  spm: 'var(--phase-spm)',
}

export const URGENCE_COLOR_VAR: Record<UrgenceLevel, string> = {
  normal: 'var(--urgence-normal)',
  attention: 'var(--urgence-attention)',
  critique: 'var(--urgence-critique)',
}

// Niveau qualitatif d'une jauge (docs/04).
export function qualitativeLevel(value: number): 'Élevé' | 'Modéré' | 'Faible' {
  if (value >= 70) return 'Élevé'
  if (value >= 30) return 'Modéré'
  return 'Faible'
}
