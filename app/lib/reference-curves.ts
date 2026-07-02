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
// `fullName`/`definition`/`role`/`peak`/`feel` alimentent les fiches hormones du guide déroulant.
export type CurveSeries = {
  key: keyof Omit<CurvePoint, 'day'>
  label: string // libellé court (légende, onglet)
  fullName: string // nom complet / ce que dit l'acronyme
  colorVar: string
  definition: string // en une phrase : c'est quoi
  role: string // à quoi ça sert dans le cycle
  peak: string // quand ça culmine
  feel: string // ce que Julie ressent concrètement / implications
}

export const CURVE_SERIES: CurveSeries[] = [
  {
    key: 'oestrogene',
    label: 'Œstrogène',
    fullName: 'Œstradiol — le principal œstrogène',
    colorVar: 'var(--hormone-oestrogene)',
    definition:
      "Hormone sexuelle féminine dominante de la première moitié du cycle, produite par les follicules ovariens en croissance.",
    role: "Épaissit l'endomètre et fluidifie la glaire cervicale ; en fin de phase folliculaire, tire vers le haut énergie, humeur et libido.",
    peak: "Pic marqué juste avant l'ovulation (~j12), puis un second dôme plus doux en phase lutéale.",
    feel: "Quand il monte : plus d'énergie, peau nette, humeur et libido en hausse, sociabilité au top. Son effondrement juste après l'ovulation peut donner un petit coup de moins bien.",
  },
  {
    key: 'progesterone',
    label: 'Progestérone',
    fullName: 'Progestérone — l’hormone du corps jaune',
    colorVar: 'var(--hormone-progesterone)',
    definition:
      "Hormone de la seconde moitié du cycle, sécrétée par le corps jaune (le follicule vidé) après l'ovulation.",
    role: "Prépare l'endomètre à la nidation, élève la température corporelle et apaise ; sa chute déclenche le SPM puis les règles.",
    peak: 'Culmine au milieu de la phase lutéale (~j21).',
    feel: "Effet calmant voire somnolent, hausse de la température, seins tendus. Sa chute en fin de cycle ouvre le SPM : irritabilité, fatigue, fringales.",
  },
  {
    key: 'lh',
    label: 'LH',
    fullName: 'LH — hormone lutéinisante',
    colorVar: 'var(--hormone-lh)',
    definition: "Hormone fabriquée par l'hypophyse (dans le cerveau), dont le pic déclenche l'ovulation.",
    role: "Le déclencheur de l'ovulation : son pic provoque la rupture du follicule et la libération de l'ovule.",
    peak: "Spike net et bref à ~j13 — le signal de l'ovulation.",
    feel: "Invisible au ressenti, mais c'est elle que détectent les tests d'ovulation. Les 24-36 h qui suivent son pic = fenêtre de fécondité maximale.",
  },
  {
    key: 'fsh',
    label: 'FSH',
    fullName: 'FSH — hormone folliculo-stimulante',
    colorVar: 'var(--hormone-fsh)',
    definition:
      "Hormone de l'hypophyse qui lance le cycle en stimulant la croissance des follicules ovariens.",
    role: "Recrute et fait mûrir les follicules ovariens en début de cycle ; prépare le follicule qui ovulera.",
    peak: 'Relief en début de phase folliculaire, avec une bosse péri-ovulatoire (~j13).',
    feel: "Peu de ressenti direct : c'est le chef d'orchestre discret qui démarre le cycle et sélectionne le follicule dominant.",
  },
  {
    key: 'bbt',
    label: 'BBT',
    fullName: 'BBT — température basale du corps',
    colorVar: 'var(--hormone-bbt)',
    definition:
      "La température du corps au repos, mesurée au réveil : un thermomètre indirect de l'ovulation.",
    role: 'Poussée par la progestérone une fois l’ovule libéré ; son décalage confirme a posteriori que l’ovulation a eu lieu.',
    peak: 'Plateau bas avant l’ovulation, saut de ~0,3–0,5 °C juste après, plateau haut toute la phase lutéale.',
    feel: "Basse avant l'ovulation, elle grimpe nettement après et reste haute jusqu'aux règles. En la notant chaque matin, on repère le moment de l'ovulation.",
  },
]
