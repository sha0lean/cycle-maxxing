// Données d'amorçage — cycles réels de Julie au premier lancement (pas d'onboarding).
// Source : data/julie-cycles.md (2 cycles confirmés via export Flo, 25 juin 2026).
// Une fois l'app lancée, localStorage fait foi — ce seed ne sert qu'à initialiser un store vide.

import type { CycleEntry } from '@/lib/types'

// Dates en année/mois(0-indexé)/jour pour éviter toute ambiguïté de fuseau.
export const JULIE_SEED_CYCLES: CycleEntry[] = [
  {
    id: 'julie-cycle-1',
    j1: new Date(2026, 4, 7), // 7 mai 2026
    rulesEndDate: new Date(2026, 4, 10), // 10 mai 2026
    cycleEndDate: new Date(2026, 4, 31), // clôturé au j1 du cycle 2 (durée 24j)
  },
  {
    id: 'julie-cycle-2',
    j1: new Date(2026, 4, 31), // 31 mai 2026 — cycle en cours
    rulesEndDate: new Date(2026, 5, 3), // 3 juin 2026
    // pas de cycleEndDate : cycle actif jusqu'au prochain j1 (règles ~26-27 juin)
  },
]
