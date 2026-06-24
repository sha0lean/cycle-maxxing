# 03 — UX FEATURES

> **rôle** : spécification fonctionnelle de chaque vue de l'app.
> **contient** : calendrier, Vue Frise (ex-Gantt), panel stats, header, settings, notifications.
> **vital parce que** : définit le contrat entre le design et le code.
> **à lire avant de** : coder une nouvelle vue ou modifier un composant existant.

## Navigation

Barre de navigation **en haut** de l'app. 3 vues accessibles en permanence.

```
┌─────────────────────────────────────────────────────┐
│  Cycle Maxxing    [ Frise ]  [ Calendrier ]  [ Patterns ]  │
└─────────────────────────────────────────────────────┘
```

- Vue active : indicateur visuel (underline ou fond)
- Vue Frise = vue par défaut au lancement

---

## Vue Calendrier

- Grille 7 colonnes (L M M J V S D)
- Chaque jour : fond coloré selon la phase + numéro j(N) affiché
- Jour actuel : ring animé · jours prédits : opacity réduite + dashed border
- Clic → panel stats latéral
- Navigation mois précédent / suivant

## Vue Frise

Vue principale interactive. Trois couches superposées avec curseur vertical synchronisé.

### Layout vertical

```
┌─────────────────────────────────────────┐  ← 2/5 de l'écran
│  Panel stats live (8 métriques)         │
│  Jauges style jeu vidéo — se mettent    │
│  à jour en temps réel au scrub          │
├─────────────────────────────────────────┤  ← 3/5 de l'écran
│  Conseils / domaines / objectifs        │
│  Contenu du jour sous le curseur        │
│  (onglets domaines avec indicateur      │
│   priorité)                             │
├─────────────────────────────────────────┤
│  ┌── Frise des phases ──────────────┐   │
│  │  Blocs colorés j1→j27 + flags   │   │
│  ├── Courbes hormones ─────────────┤   │  ← trois couches
│  │  LH · FSH · Œstrogène · Progest.│   │     superposées ou
│  ├── Courbe BBT ──────────────────┤   │     empilées
│  │  Température basale de référence│   │
│  └──────────────────────────────────┘   │
│              │ curseur vertical         │
└─────────────────────────────────────────┘
```

### Couche 1 — Frise des phases

- Blocs colorés par phase proportionnels à la durée (27 jours pour Julie)
- Sous-phases en dégradé d'opacité (début / milieu / fin)
- **Flags** sur les moments clés : j1 (règles), j13 (ovulation), j21 (SPM début)
- Jour actuel : marqueur animé

### Couche 2 — Courbes hormones (référence statique)

- LH · FSH · Œstrogène · Progestérone
- Formes théoriques scientifiques, étirées proportionnellement à la durée du cycle
- Pas les données réelles de Julie — courbe de référence universelle
- Légende cliquable pour afficher / masquer chaque hormone

### Couche 3 — Courbe BBT (référence statique)

- Basal Body Temperature : température corporelle au repos
- Monte légèrement après l'ovulation (progestérone)
- Courbe de référence — non mesurée par Julie en v1

### Interaction scrub

- Hover gauche → droite : curseur vertical se déplace sur les 3 couches simultanément
- Le panel stats (2/5 haut) et les conseils (3/5 milieu) se mettent à jour en live
- Clic sur un jour → fixe le curseur sur ce jour
- Sans interaction : curseur positionné sur aujourd'hui par défaut

## Panel stats du jour

1. Header : date · phase · sous-phase · j(N) · badge urgence
2. 8 jauges animées : énergie · humeur · libido · fatigue · sensibilité · stress · douleurs · irritabilité
3. État émotionnel : résumé + keywords tags
4. Toi aujourd'hui : conseil en évidence · doList vert · avoidList rouge
5. Alimentation : nutriments · recommandé · éviter
6. Sport : intensité badge · recommandé · éviter

## Header dashboard

- Nom phase + badge couleur
- j(N) du cycle · durée moyenne
- Countdown prochain événement clé
- Barre progression du cycle
- Badge fiabilité

## Grille métriques (6 cards)

Énergie / Humeur / Libido / Fatigue / Sensibilité / Stress
Chaque card : icône · valeur % monospace · barre progression · niveau qualitatif · tendance vs hier

## Vue Patterns de cycle

Vue analytique pour identifier les tendances récurrentes et comparer les cycles entre eux.

### Objectif

Répondre à deux questions distinctes :
1. **"Qu'est-ce qui se passe typiquement à J14 ?"** → courbe moyenne sur tous les cycles
2. **"Comment le cycle 3 se compare au cycle 7 ?"** → superposition de cycles individuels

### Deux modes

#### Mode Moyenne (défaut)

```
Énergie (%)
100 ┤
 80 ┤        ╭────╮
 60 ┤   ╭────╯    ╰────╮
 40 ┤───╯              ╰────────╮
 20 ┤                           ╰────
    └──┬────┬────┬────┬────┬────┬──→ jour du cycle
       J1   J5  J10  J14  J20  J27
       │         │         │
     règles  ovulation   SPM
```

- Axe X : jour du cycle J1 → J_max (basé sur la durée moyenne des cycles)
- Axe Y : valeur % de la métrique sélectionnée
- Courbe principale : moyenne de toutes les valeurs loggées à ce Jk sur tous les cycles
- Zone de confiance : ruban ±1 écart-type autour de la moyenne (affiche la variabilité)
- Marqueurs verticaux fixes : J1 (règles), J_ovulation, J_SPM

#### Mode Comparaison

- Sélection manuelle de 2 à 4 cycles spécifiques à superposer
- Chaque cycle = une courbe de couleur distincte avec légende "Cycle N (mois YYYY)"
- Normalisation : cycles de longueurs différentes ramenés à un axe 0–100% du cycle (ex: J14 sur un cycle de 28j = 50%, J16 sur un cycle de 32j ≈ 50%)
- Permet de repérer les anomalies ("ce mois-là l'énergie était anormalement basse")

### Métriques disponibles

Les 8 métriques loggées dans le panel stats, sélectionnables via toggle chips :

`Énergie` `Humeur` `Libido` `Fatigue` `Sensibilité` `Stress` `Douleurs` `Irritabilité`

- Multi-sélection possible : superposer énergie + fatigue sur le même graphe
- Chaque métrique = couleur propre (cohérente avec les couleurs du panel stats)

### Données manquantes

Les jours non loggés ne sont pas interpolés par défaut — la courbe a des trous.
Option "interpolation linéaire" activable dans les settings pour lisser les trous.

### Conditions d'activation

- Disponible dès **2 cycles complets** enregistrés (sinon : état vide avec message "Reviens après 2 cycles pour voir tes patterns")
- Mode Comparaison : désactivé si moins de 2 cycles disponibles

### Navigation

- Accessible depuis le menu principal (icône graphe)
- Bouton bascule Mode Moyenne ↔ Mode Comparaison en haut de vue
- En Mode Comparaison : drawer ou bottom sheet pour sélectionner les cycles à afficher

## Settings

**Saisie cycle**
- Bouton "Les règles ont commencé aujourd'hui" → crée un nouveau cycle, recalcule tout
- Bouton "Les règles sont terminées aujourd'hui" → enregistre rulesEndDate du cycle en cours
- Notes optionnelles par cycle

**Historique**
- Liste des cycles avec j1 · durée · durée règles · suppression individuelle
- Stats : durée moyenne cycle · durée moyenne règles · écart-type · fiabilité · nb cycles

**Métriques**
- Ajustement manuel des valeurs du jour (curseurs 0-100 par métrique)
- Réinitialiser vers la référence scientifique

## Notifications (v2)

- "Dans 3 jours → SPM probable"
- "Ovulation demain"
- "Règles prévues dans 2 jours"
- Web Push ou webhook Pushover / Ntfy
