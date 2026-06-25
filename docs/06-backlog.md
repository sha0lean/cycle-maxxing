# 06 — BACKLOG

> **rôle** : recense les features confirmées (B-NNN) et les idées non qualifiées ([?]).
> **contient** : backlog priorisé v1/v2/v3 + section idées émergentes non encore arbitrées.
> **à lire avant de** : décider quoi faire ensuite.

---

## Features confirmées

### v1 — MVP

- [x] **B-001** Calendrier mensuel interactif avec phases colorées
- [x] **B-002** Vue Gantt du cycle complet avec curseur aujourd'hui
- [x] **B-003** Panel stats au clic sur un jour (métriques + conseils multi-domaines)
- [x] **B-004** Saisie j1 + durée règles + historique cycles (Settings)
- [x] **B-005** Vue récap hebdo et cycle entier (même données, angles temporels différents)
- [x] **B-006** Fiches domaines complètes (8 domaines × 8 sous-phases) — granularité selon le niveau de preuve ; gaps folliculaire-milieu→ovulation assumés (cf. data/sources/_research-2026-06)

### v2

- [ ] **B-007** Mode Julie — vue partagée lecture, mobile-first, pédagogique
- [ ] **B-008** Notifications push SPM / ovulation (web push ou Pushover / Ntfy)
- [ ] **B-009** Supabase + auth — sync multi-device, accès Julie

### v3

- [ ] **B-010** Modèle adaptatif — Julie saisit ses propres observations, les stats s'ajustent

---

## Idées non qualifiées

- [?] **Wiki intégré** — encyclopédie de fiches capteur / signal / source reliées par backlinks bidirectionnels. Fiche capteur : définition + signaux influents + provenance. Fiche signal : définition biologique + capteurs impactés + sources. Fiche source : métadonnées + claims extraits. Émergé session 25 juin 2026.
- [?] **Système de sources scientifiques** — pipeline d'ingestion d'articles : extraction de claims, mapping signal→capteur, agrégation pondérée par niveau de preuve, mise à jour de phase-reference.md avec provenance complète. Skill d'audit à créer. Émergé session 25 juin 2026. Dépend de : table de mapping signal→capteur, définition du niveau de preuve par type d'étude.
- [?] **Bot Hermes scraping** — agent qui scrape le web pour croiser les infos tendance sur la science du cycle et enrichir les domaines automatiquement. Émergé session 24 juin 2026. Blockers : légalité, fiabilité des sources médicales, architecture séparée.
- [?] **Gamification Julie (v2+)** — mécanismes côté Julie (streaks self-care, achievements) une fois qu'elle est onboardée. Scope v1 = dashboard riche sans game mechanics.
