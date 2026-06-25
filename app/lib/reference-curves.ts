// Courbes hormonales + BBT de RÉFÉRENCE — formes scientifiques universelles, normalisées 0-100
// pour l'affichage. Ce ne sont PAS les données mesurées de Julie (règle projet CLAUDE.md) :
// elles servent de toile de fond pédagogique à la Frise, étirées sur le cycle de référence (27 j).
//
// Allures encodées :
//   œstrogène    : pic pré-ovulatoire (~j12), chute, second dôme lutéal
//   progestérone : plat folliculaire, montée lutéale, pic ~j21, chute prémenstruelle
//   LH           : spike net à l'ovulation (j13)
//   FSH          : léger relief folliculaire + bosse péri-ovulatoire
//   BBT          : plateau bas folliculaire, nadir ovulatoire, plateau haut lutéal

export type CurvePoint = {
  day: number
  oestrogene: number
  progesterone: number
  lh: number
  fsh: number
  bbt: number
}

export const REFERENCE_CURVES: CurvePoint[] = [
  { day: 1, oestrogene: 15, progesterone: 6, lh: 10, fsh: 35, bbt: 30 },
  { day: 2, oestrogene: 15, progesterone: 6, lh: 10, fsh: 38, bbt: 29 },
  { day: 3, oestrogene: 18, progesterone: 6, lh: 11, fsh: 36, bbt: 30 },
  { day: 4, oestrogene: 20, progesterone: 7, lh: 11, fsh: 32, bbt: 30 },
  { day: 5, oestrogene: 25, progesterone: 7, lh: 11, fsh: 28, bbt: 31 },
  { day: 6, oestrogene: 30, progesterone: 7, lh: 12, fsh: 24, bbt: 30 },
  { day: 7, oestrogene: 38, progesterone: 7, lh: 12, fsh: 22, bbt: 31 },
  { day: 8, oestrogene: 48, progesterone: 8, lh: 13, fsh: 20, bbt: 30 },
  { day: 9, oestrogene: 60, progesterone: 8, lh: 13, fsh: 20, bbt: 31 },
  { day: 10, oestrogene: 72, progesterone: 8, lh: 15, fsh: 22, bbt: 30 },
  { day: 11, oestrogene: 85, progesterone: 8, lh: 18, fsh: 26, bbt: 30 },
  { day: 12, oestrogene: 95, progesterone: 8, lh: 25, fsh: 34, bbt: 28 },
  { day: 13, oestrogene: 88, progesterone: 9, lh: 95, fsh: 45, bbt: 25 },
  { day: 14, oestrogene: 55, progesterone: 15, lh: 35, fsh: 30, bbt: 55 },
  { day: 15, oestrogene: 48, progesterone: 25, lh: 15, fsh: 20, bbt: 68 },
  { day: 16, oestrogene: 50, progesterone: 38, lh: 12, fsh: 16, bbt: 72 },
  { day: 17, oestrogene: 55, progesterone: 52, lh: 11, fsh: 15, bbt: 74 },
  { day: 18, oestrogene: 60, progesterone: 65, lh: 10, fsh: 14, bbt: 75 },
  { day: 19, oestrogene: 62, progesterone: 76, lh: 10, fsh: 14, bbt: 75 },
  { day: 20, oestrogene: 60, progesterone: 85, lh: 10, fsh: 15, bbt: 76 },
  { day: 21, oestrogene: 55, progesterone: 90, lh: 10, fsh: 16, bbt: 76 },
  { day: 22, oestrogene: 48, progesterone: 88, lh: 10, fsh: 18, bbt: 75 },
  { day: 23, oestrogene: 40, progesterone: 80, lh: 10, fsh: 20, bbt: 74 },
  { day: 24, oestrogene: 32, progesterone: 65, lh: 10, fsh: 22, bbt: 72 },
  { day: 25, oestrogene: 25, progesterone: 45, lh: 10, fsh: 24, bbt: 68 },
  { day: 26, oestrogene: 20, progesterone: 28, lh: 10, fsh: 27, bbt: 60 },
  { day: 27, oestrogene: 16, progesterone: 15, lh: 10, fsh: 30, bbt: 50 },
]

// Métadonnées d'affichage des séries (clé, libellé, couleur via token de thème).
export type CurveSeries = { key: keyof Omit<CurvePoint, 'day'>; label: string; colorVar: string }

export const CURVE_SERIES: CurveSeries[] = [
  { key: 'oestrogene', label: 'Œstrogène', colorVar: 'var(--chart-1)' },
  { key: 'progesterone', label: 'Progestérone', colorVar: 'var(--chart-2)' },
  { key: 'lh', label: 'LH', colorVar: 'var(--chart-3)' },
  { key: 'fsh', label: 'FSH', colorVar: 'var(--chart-4)' },
  { key: 'bbt', label: 'BBT', colorVar: 'var(--chart-5)' },
]
