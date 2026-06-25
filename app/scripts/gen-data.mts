// Générateur de données — parse data/phase-reference.md → app/lib/generated/phase-reference.ts
// Lancé automatiquement via predev / prebuild (cf. package.json). Ne pas appeler à la main en général.
// Décision : D_006 (codegen au build). NE PAS éditer le fichier généré.

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'

// app/scripts/ → racine du repo (deux niveaux au-dessus)
const REPO_ROOT = join(import.meta.dirname, '..', '..')
const SRC = join(REPO_ROOT, 'data', 'phase-reference.md')
const DOMAINS_DIR = join(REPO_ROOT, 'data', 'domains')
const OUT_DIR = join(import.meta.dirname, '..', 'lib', 'generated')
const OUT = join(OUT_DIR, 'phase-reference.ts')
const DOMAINS_OUT = join(OUT_DIR, 'domains.ts')

// ph1..ph4b dans le markdown → PhaseId du modèle
const PHASE_MAP: Record<string, string> = {
  ph1: 'regles',
  ph2: 'folliculaire',
  ph3: 'ovulation',
  ph4a: 'luteale',
  ph4b: 'spm',
}

const METRIC_KEYS = [
  'energie',
  'humeur',
  'libido',
  'fatigue',
  'sensibilite',
  'stress',
  'douleurs',
  'irritabilite',
] as const

type Entry = {
  id: string
  label: string
  phase: string
  dayStart: number
  dayEnd: number
  urgence: string
  metrics: Record<string, number>
  keywords: string[]
  resume: string
}

// Bornes de jours depuis un id de sous-phase : "j1-j2" → [1,2] · "j13" → [13,13]
function parseDayRange(id: string): [number, number] {
  const m = id.match(/j(\d+)(?:-j(\d+))?/)
  if (!m) throw new Error(`Sous-phase au format inattendu : "${id}"`)
  const start = Number(m[1])
  const end = m[2] ? Number(m[2]) : start
  return [start, end]
}

// Parse la ligne chiffrée "energie:30  humeur:35 ..." en objet métriques
function parseMetrics(line: string): Record<string, number> {
  const metrics: Record<string, number> = {}
  for (const token of line.trim().split(/\s+/)) {
    const [key, value] = token.split(':')
    if (key && value !== undefined) metrics[key] = Number(value)
  }
  return metrics
}

function parse(md: string): Entry[] {
  const entries: Entry[] = []
  let currentPhase: string | null = null
  let current: Entry | null = null
  let inFence = false

  const flush = () => {
    if (current) entries.push(current)
    current = null
  }

  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trimEnd()

    // Titre de phase : "## ph1 — Règles" (les ## non-phase clôturent le contexte)
    const phaseMatch = line.match(/^##\s+(ph\w+)\s*—/)
    if (line.startsWith('## ')) {
      flush()
      currentPhase = phaseMatch ? (PHASE_MAP[phaseMatch[1]] ?? null) : null
      continue
    }

    // Titre de sous-phase : "### j1-j2 — Début" (annotation "← ..." retirée du label)
    const subMatch = line.match(/^###\s+(j\d+(?:-j\d+)?)\s*—\s*(.+?)\s*$/)
    if (subMatch && currentPhase) {
      flush()
      const id = subMatch[1]
      const label = subMatch[2].split('←')[0].trim()
      const [dayStart, dayEnd] = parseDayRange(id)
      current = { id, label, phase: currentPhase, dayStart, dayEnd, urgence: 'normal', metrics: {}, keywords: [], resume: '' }
      continue
    }

    if (line.trim() === '```') {
      inFence = !inFence
      continue
    }

    // Bloc chiffré des 8 capteurs
    if (inFence && current && /energie\s*:/.test(line)) {
      current.metrics = parseMetrics(line)
      continue
    }

    // Champs "- clé: valeur" (on ne retient que la couche quantitative + méta d'affichage)
    const field = line.match(/^-\s+([^:]+):\s*(.+)$/)
    if (field && current) {
      const key = field[1].trim().toLowerCase()
      const value = field[2].trim()
      if (key === 'urgence') current.urgence = value
      else if (key === 'keywords') current.keywords = value.split('·').map((k) => k.trim()).filter(Boolean)
      else if (key === 'résumé' || key === 'resume') current.resume = value
    }
  }

  flush()
  return entries
}

// Validation : chaque entrée doit avoir ses 8 métriques et une urgence connue
function validate(entries: Entry[]): void {
  const urgences = new Set(['normal', 'attention', 'critique'])
  if (entries.length === 0) throw new Error('Aucune sous-phase parsée — format de phase-reference.md cassé ?')
  for (const e of entries) {
    for (const k of METRIC_KEYS) {
      if (typeof e.metrics[k] !== 'number' || Number.isNaN(e.metrics[k])) {
        throw new Error(`Métrique "${k}" manquante ou invalide pour la sous-phase ${e.id}`)
      }
    }
    if (!urgences.has(e.urgence)) throw new Error(`Urgence inconnue "${e.urgence}" pour ${e.id}`)
  }
}

function emit(entries: Entry[]): string {
  const body = entries
    .map((e) => {
      const m = METRIC_KEYS.map((k) => `${k}: ${e.metrics[k]}`).join(', ')
      return `  {
    id: ${JSON.stringify(e.id)},
    label: ${JSON.stringify(e.label)},
    phase: ${JSON.stringify(e.phase)},
    dayStart: ${e.dayStart},
    dayEnd: ${e.dayEnd},
    urgence: ${JSON.stringify(e.urgence)},
    metrics: { ${m} },
    keywords: ${JSON.stringify(e.keywords)},
    resume: ${JSON.stringify(e.resume)},
  },`
    })
    .join('\n')

  return `// AUTO-GÉNÉRÉ par scripts/gen-data.mts — NE PAS ÉDITER À LA MAIN.
// Source : data/phase-reference.md · Régénérer : pnpm gen:data
import type { PhaseReferenceEntry } from '@/lib/types'

export const PHASE_REFERENCE: PhaseReferenceEntry[] = [
${body}
]
`
}

// ─────────────────────────────────────────────────────────────
// Couche 2 — Domaines qualitatifs (data/domains/*.md, frontmatter via gray-matter)
// ─────────────────────────────────────────────────────────────

type DomainEntryGen = {
  range: string
  dayStart: number
  dayEnd: number
  conseil: string
  faire: string[]
  eviter: string[]
}

type DomainGen = {
  id: string
  label: string
  status: string
  enrichir: boolean
  entries: DomainEntryGen[]
}

// Parse une liste inline "[a, b, c]" → string[]. "[]" → [].
function parseList(value: string): string[] {
  const trimmed = value.trim()
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
    throw new Error(`Liste au format inattendu : "${value}"`)
  }
  const inner = trimmed.slice(1, -1).trim()
  if (inner === '') return []
  return inner.split(',').map((s) => s.trim()).filter(Boolean)
}

// Parse le corps d'un fichier domaine : sections "## jX-jY — Label" + champs conseil/faire/éviter.
function parseDomainBody(content: string, file: string): DomainEntryGen[] {
  const entries: DomainEntryGen[] = []
  let current: DomainEntryGen | null = null

  const flush = () => {
    if (current) entries.push(current)
    current = null
  }

  for (const raw of content.split(/\r?\n/)) {
    const line = raw.trim()

    const head = line.match(/^##\s+(j\d+(?:-j\d+)?)\s*—/)
    if (head) {
      flush()
      const range = head[1]
      const [dayStart, dayEnd] = parseDayRange(range)
      current = { range, dayStart, dayEnd, conseil: '', faire: [], eviter: [] }
      continue
    }

    if (!current) continue

    const field = line.match(/^(conseil|faire|éviter|eviter)\s*:\s*(.*)$/)
    if (field) {
      const [, key, value] = field
      if (key === 'conseil') current.conseil = value.trim()
      else if (key === 'faire') current.faire = parseList(value)
      else current.eviter = parseList(value)
    }
  }

  flush()
  if (entries.length === 0) throw new Error(`Aucune plage de jours parsée dans ${file}`)
  for (const e of entries) {
    if (!e.conseil) throw new Error(`Conseil manquant pour ${e.range} dans ${file}`)
  }
  return entries
}

function parseDomains(): DomainGen[] {
  const files = readdirSync(DOMAINS_DIR).filter((f) => f.endsWith('.md')).sort()
  if (files.length === 0) throw new Error(`Aucun domaine trouvé dans ${DOMAINS_DIR}`)

  return files.map((file) => {
    const { data, content } = matter(readFileSync(join(DOMAINS_DIR, file), 'utf8'))
    if (!data.domain || !data.label) {
      throw new Error(`Frontmatter incomplet dans ${file} (champs "domain" et "label" requis)`)
    }
    return {
      id: String(data.domain),
      label: String(data.label),
      status: String(data.status ?? 'draft'),
      // YAML rend "oui"/"non" en string ; on accepte aussi un vrai booléen.
      enrichir: data.enrichir === true || data.enrichir === 'oui',
      entries: parseDomainBody(content, file),
    }
  })
}

function emitDomains(domains: DomainGen[]): string {
  const body = domains
    .map((d) => {
      const entries = d.entries
        .map(
          (e) => `      {
        range: ${JSON.stringify(e.range)},
        dayStart: ${e.dayStart},
        dayEnd: ${e.dayEnd},
        conseil: ${JSON.stringify(e.conseil)},
        faire: ${JSON.stringify(e.faire)},
        eviter: ${JSON.stringify(e.eviter)},
      },`,
        )
        .join('\n')
      return `  {
    id: ${JSON.stringify(d.id)},
    label: ${JSON.stringify(d.label)},
    status: ${JSON.stringify(d.status)},
    enrichir: ${d.enrichir},
    entries: [
${entries}
    ],
  },`
    })
    .join('\n')

  return `// AUTO-GÉNÉRÉ par scripts/gen-data.mts — NE PAS ÉDITER À LA MAIN.
// Source : data/domains/*.md · Régénérer : pnpm gen:data
import type { Domain } from '@/lib/types'

export const DOMAINS: Domain[] = [
${body}
]
`
}

// ─────────────────────────────────────────────────────────────
// Exécution
// ─────────────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true })

const md = readFileSync(SRC, 'utf8')
const entries = parse(md)
validate(entries)
writeFileSync(OUT, emit(entries), 'utf8')
console.log(`✓ ${entries.length} sous-phases générées → lib/generated/phase-reference.ts`)

const domains = parseDomains()
writeFileSync(DOMAINS_OUT, emitDomains(domains), 'utf8')
console.log(`✓ ${domains.length} domaines générés → lib/generated/domains.ts`)
