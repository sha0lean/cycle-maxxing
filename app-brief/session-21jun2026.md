# Session de travail — 21 juin 2026
# Sujet : Cycle Maxxing — brief complet + données Julie

## Contexte de la session

- Date : 21 juin 2026
- Initiée par : Remy (WebJourney / freelance web dev)
- Copine : Julie, paysagiste, région PACA
- App utilisée par Julie : Flo (tracking cycle)
- Position au moment de la session : j22 du cycle — début SPM

## Ce qui a été produit

| Fichier | Contenu |
|---|---|
| /data/julie-cycles.md | Historique cycles extraits des screenshots Flo |
| /data/phase-reference.md | Stats complètes par phase et sous-phase (8 métriques) |
| /docs/01-vision.md | Vision, personas, roadmap |
| /docs/02-cycle-science.md | Biologie du cycle, hormones, fonctionnement de Flo |
| /docs/03-ux-features.md | Fonctionnalités détaillées par vue |
| /docs/04-design-system.md | Palette lilas/sunset, tokens, composants |
| /prompts/hermes-context.md | Contexte Hermes prêt à injecter |
| /prompts/deepseek-main.md | Prompt complet pour génération app |

## Décisions prises

### Stack confirmée
Next.js 15 App Router · TypeScript strict · Tailwind · shadcn/ui · Vercel · pnpm
localStorage v1 → Supabase v2

### Design confirmé
Thème pastel lilas / sunset — dark par défaut + light switchable
Pas de thème WebJourney — projet 100% perso

### Données Julie
- 2 cycles réels confirmés (mai 2026)
- Cycle moyen : 27 jours
- Règles : 4 jours
- Fiabilité : variable (cible 6 cycles)
- Paramètre drop-down Hermes : 27 jours

### Fonctionnalités prioritaires v1
1. Calendrier mensuel interactif avec phases colorées
2. Vue Gantt du cycle complet
3. Panel stats au clic sur un jour (8 métriques + conseils + nutrition + sport)
4. Saisie j1 dans settings

### Granularité validée
Sous-phases : début / milieu / fin pour chaque phase
Stats différentes à chaque sous-phase (pas juste par phase)

## Screenshots Flo analysés

| Image | Mois | Données extraites |
|---|---|---|
| IMG_4575 | Juin 2026 (version 1) | Règles 31 mai-3 juin · ovulation 11 juin |
| IMG_4758 | Juin 2026 (version 2) | Confirmation + aujourd'hui = 21 juin |
| IMG_4764 | Juin 2026 (version 3) | Même données + zoom état actuel |
| IMG_4772 | Mai-Juin 2026 | Règles 7-10 mai (cycle 1) + 31 mai-3 juin (cycle 2) |
| IMG_4773 | Juil-Août 2026 | Prédictions Flo |
| IMG_4774 | Sept-Oct 2026 | Prédictions Flo |
| IMG_4775 | Nov-Déc 2026 | Prédictions Flo |
| IMG_4776 | Déc 2026-Fév 2027 | Prédictions Flo |
| IMG_4777 | Mars-Avr 2027 | Prédictions Flo |

## Prototype interactif généré en session

Un widget HTML interactif a été généré dans le chat avec :
- Calendrier mensuel cliquable avec couleurs de phase
- Vue Gantt avec curseur aujourd'hui
- Panel stats au clic (jauges + conseils + nutrition + sport)
- Données calées sur le cycle réel de Julie

## Prochaines actions

1. Pousser ce repo sur GitHub
2. Utiliser /prompts/hermes-context.md comme contexte Hermes
3. Lancer DeepSeek avec /prompts/deepseek-main.md
4. Commencer par lib/types.ts → lib/phase-data.ts → lib/cycle.ts
5. Mettre à jour /data/julie-cycles.md après chaque nouveau cycle confirmé

## Notes

- Les screenshots Flo montrent des données jusqu'en avril 2027 mais tout ce qui est après juin 2026 est une prédiction Flo, pas des données réelles
- Seuls les cycles avec cercles pleins roses = règles réelles
- Les cercles pointillés = prédictions (fenêtre fertile et ovulation estimées)
- Priorité : récupérer 4 cycles supplémentaires pour atteindre la fiabilité cible
