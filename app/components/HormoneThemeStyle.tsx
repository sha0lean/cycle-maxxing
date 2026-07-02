// Injecte les tokens CSS des couleurs d'hormones (--hormone-*) depuis la source de vérité
// unique (hormone-theme.ts). Composant serveur → le <style> part dans le HTML initial,
// donc aucun flash de couleur (FOUC) au chargement. Un futur color-picker n'aurait qu'à
// surcharger ces mêmes variables sur :root via setProperty.

import { hormoneThemeCss } from '@/lib/hormone-theme'

export function HormoneThemeStyle() {
  return <style id="hormone-theme">{hormoneThemeCss()}</style>
}
