// Les 10 états d'avatar de Julie, un par moment du cycle (cf. prompts/avatar/characters/julie/bible.json).
// C'est le JOUR du cycle qui choisit l'état affiché (pas le bien-être) — modèle hybride :
// la phase/jour pose la keyframe, le score de bien-être module l'animation par-dessus (CharacterAvatar).
// Les bornes de jours sont la source de vérité côté code ; elles doivent rester alignées sur la bible.
// L'`id` est le suffixe de fichier PNG : public/avatars/julie-<id>.png.

export type AvatarStateId =
  | 'endolorie'
  | 'encore-tendre'
  | 'eveil'
  | 'petillante'
  | 'confiante'
  | 'seductrice'
  | 'apaisee'
  | 'melancolique'
  | 'a-cran'
  | 'a-fleur-de-peau'

export type AvatarState = {
  id: AvatarStateId
  label: string // libellé FR affiché sous l'avatar
  dayStart: number // borne basse du jour de cycle (incluse)
  dayEnd: number // borne haute (incluse)
  emoji: string // placeholder tant que le PNG détouré n'est pas déposé
}

// Ordonnés par jour croissant. Les plages couvrent j1→j27 sans trou ni recouvrement.
// Note : la bible fusionne j8-9+j10-11 → Pétillante, et j13+j14 → Séductrice.
export const AVATAR_STATES: readonly AvatarState[] = [
  { id: 'endolorie', label: 'Endolorie', dayStart: 1, dayEnd: 2, emoji: '😣' },
  { id: 'encore-tendre', label: 'Encore tendre', dayStart: 3, dayEnd: 4, emoji: '🥺' },
  { id: 'eveil', label: 'Éveil', dayStart: 5, dayEnd: 7, emoji: '🙂' },
  { id: 'petillante', label: 'Pétillante', dayStart: 8, dayEnd: 11, emoji: '😄' },
  { id: 'confiante', label: 'Confiante', dayStart: 12, dayEnd: 12, emoji: '😉' },
  { id: 'seductrice', label: 'Séductrice', dayStart: 13, dayEnd: 14, emoji: '😍' },
  { id: 'apaisee', label: 'Apaisée', dayStart: 15, dayEnd: 17, emoji: '😌' },
  { id: 'melancolique', label: 'Mélancolique', dayStart: 18, dayEnd: 20, emoji: '😔' },
  { id: 'a-cran', label: 'À cran', dayStart: 21, dayEnd: 23, emoji: '😠' },
  { id: 'a-fleur-de-peau', label: 'À fleur de peau', dayStart: 24, dayEnd: 27, emoji: '😢' },
] as const

// Jour du cycle → état. Clamp hors bornes : avant j1 → premier état, après la dernière borne → dernier.
export function dayToAvatarState(day: number): AvatarState {
  const match = AVATAR_STATES.find((s) => day >= s.dayStart && day <= s.dayEnd)
  if (match) return match
  return day < AVATAR_STATES[0].dayStart ? AVATAR_STATES[0] : AVATAR_STATES[AVATAR_STATES.length - 1]
}
