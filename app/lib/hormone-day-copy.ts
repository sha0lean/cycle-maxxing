// Contenu éditorial de « l'hormone du jour » — une phrase courte selon le MOMENT de
// l'hormone (montée / pic / chute / plancher / plateau) au jour pointé. 1er jet scientifique,
// pensé pour être relu/ajusté librement. Voix : concrète, tournée vers le ressenti de Julie.
//
// Le moment est dérivé de l'état (niveau + tendance) calculé dans hormones.ts.

import type { SeriesKey, HormoneDayState, HormoneLevel, HormoneTrend } from '@/lib/hormones'

// 5 moments narratifs, plus lisibles que la matrice complète niveau×tendance.
type Moment = 'montee' | 'pic' | 'chute' | 'bas' | 'plateau'

function momentOf({ level, trend }: HormoneDayState): Moment {
  if (level === 'pic') return 'pic'
  if (trend === 'montee') return 'montee'
  if (trend === 'chute') return 'chute'
  if (level === 'bas') return 'bas'
  return 'plateau'
}

const COPY: Record<SeriesKey, Record<Moment, string>> = {
  oestrogene: {
    montee: 'En pleine montée : énergie, humeur et libido grimpent avec lui, peau plus nette.',
    pic: "À son sommet, juste avant l'ovulation — pic d'énergie, de confiance et de désir.",
    chute: "Il s'effondre juste après l'ovulation : possible petit coup de moins bien passager.",
    bas: 'Au plancher pendant les règles : énergie et moral en veille, rien d’anormal.',
    plateau: 'Second dôme lutéal, plus doux : présence discrète, sans les montagnes russes du pic.',
  },
  progesterone: {
    montee: "Elle grimpe après l'ovulation : effet apaisant qui s'installe, température qui monte.",
    pic: 'À son maximum en milieu de phase lutéale — calme, léger coup de mou, seins tendus.',
    chute: 'Sa chute ouvre le SPM : irritabilité, fatigue et fringales possibles avant les règles.',
    bas: 'Quasi absente en phase folliculaire : elle ne joue pas encore de rôle ici.',
    plateau: "Elle se maintient haut, soutient l'endomètre et garde son effet apaisant.",
  },
  lh: {
    montee: "Elle grimpe vers son pic : l'ovulation approche, la fenêtre de fécondité s'ouvre.",
    pic: "Pic de LH — LE déclencheur de l'ovulation, fécondité maximale sur 24-36 h.",
    chute: "Retombée après le pic : l'ovulation vient d'avoir lieu.",
    bas: 'Niveau de fond, silencieuse : rien à signaler côté ovulation.',
    plateau: 'Stable et basse, en attente : le pic ovulatoire n’est pas pour maintenant.',
  },
  fsh: {
    montee: 'En hausse : elle recrute les follicules et lance la mécanique du cycle.',
    pic: 'Petite bosse péri-ovulatoire — elle épaule le pic de LH.',
    chute: 'Elle redescend, son travail de recrutement est fait.',
    bas: 'Discrète : le follicule dominant est déjà sélectionné.',
    plateau: 'Niveau de fond, chef d’orchestre silencieux du cycle.',
  },
  bbt: {
    montee: 'Elle grimpe (~0,3-0,5 °C) : signe que l’ovulation vient de se produire.',
    pic: "Plateau haut, poussée par la progestérone : l'ovulation est confirmée.",
    chute: 'Elle redescend en fin de cycle : les règles approchent.',
    bas: 'Plateau bas d’avant-ovulation : température de base, au repos.',
    plateau: 'Stable et haute toute la phase lutéale, tenue par la progestérone.',
  },
}

export function hormoneDayPhrase(key: SeriesKey, state: HormoneDayState): string {
  return COPY[key][momentOf(state)]
}

// Libellés d'affichage du badge niveau et de la tendance (glyphe + mot).
export const LEVEL_LABEL: Record<HormoneLevel, string> = {
  bas: 'Bas',
  moyen: 'Moyen',
  haut: 'Haut',
  pic: 'Pic',
}

export const TREND_LABEL: Record<HormoneTrend, string> = {
  montee: 'En hausse',
  chute: 'En baisse',
  plateau: 'Stable',
}

export const TREND_ARROW: Record<HormoneTrend, string> = {
  montee: '↗',
  chute: '↘',
  plateau: '→',
}
