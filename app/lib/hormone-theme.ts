// SOURCE DE VÉRITÉ UNIQUE des couleurs d'hormones.
// Éditer une valeur ici = propagé PARTOUT (frise/graphe, onglets du panneau, wiki) et
// chaque hormone est réglable INDÉPENDAMMENT. Les couleurs sont exposées en tokens CSS
// `--hormone-<clé>` générés depuis cet objet (cf. hormoneThemeCss → <HormoneThemeStyle>),
// rendus côté serveur → aucun flash de couleur au chargement.
//
// Pour changer une couleur : modifier `light`/`dark` de l'hormone voulue. C'est tout.

export type HormoneKey = 'oestrogene' | 'progesterone' | 'lh' | 'fsh' | 'bbt'

// Une couleur par thème (clair / sombre — sombre = défaut de l'app).
export type HormoneColor = { light: string; dark: string }

export const HORMONE_THEME: Record<HormoneKey, HormoneColor> = {
  oestrogene: { light: '#0891b2', dark: '#5ac8d8' }, // cyan → turquoise
  progesterone: { light: '#e11d48', dark: '#fb7185' }, // rose
  lh: { light: '#ca8a04', dark: '#f0c04b' }, // ambre → or
  fsh: { light: '#16a34a', dark: '#7fd18a' }, // vert → vert doux
  bbt: { light: '#9333ea', dark: '#cf9be0' }, // violet → mauve
}

// Ordre d'affichage canonique (légende, onglets).
export const HORMONE_KEYS = Object.keys(HORMONE_THEME) as HormoneKey[]

// Token CSS d'une hormone, à consommer en style inline : { color: hormoneVar('lh') }.
export function hormoneVar(key: HormoneKey): string {
  return `var(--hormone-${key})`
}

// CSS des tokens généré depuis la source de vérité — injecté une fois par <HormoneThemeStyle>.
export function hormoneThemeCss(): string {
  const decls = (theme: 'light' | 'dark') =>
    HORMONE_KEYS.map((k) => `--hormone-${k}:${HORMONE_THEME[k][theme]};`).join('')
  return `:root{${decls('light')}}.dark{${decls('dark')}}`
}
