# 🍁 CAHIER DES CHARGES — REDESIGN COMPLET FORMATION TCF CANADA
## Document pour Claude Design / Designer UI

> **Date** : 22 avril 2026
> **Version** : 1.0
> **Objectif** : Refaire l'ensemble de l'onboarding et de l'interface utilisateur de la plateforme Formation TCF Canada — toutes pages, tous composants, toutes fonctionnalités.

---

## 📌 TABLE DES MATIÈRES

1. [Vue d'ensemble du projet](#1-vue-densemble)
2. [Stack technique](#2-stack-technique)
3. [Identité visuelle actuelle](#3-identité-visuelle-actuelle)
4. [Architecture des pages](#4-architecture-des-pages)
5. [Composants globaux](#5-composants-globaux)
6. [Pages — détail complet](#6-pages--détail-complet)
   - 6.1 HomePage (Landing)
   - 6.2 Pages CE (Compréhension Écrite)
   - 6.3 Pages CO (Compréhension Orale)
   - 6.4 Pages EE (Expression Écrite)
   - 6.5 Pages EO (Expression Orale)
   - 6.6 Pages Auth (Connexion / Inscription)
   - 6.7 Page Compte
   - 6.8 Pages Tarifs & Formations
   - 6.9 Calculateur NCLC
   - 6.10 Pages Légales (Confidentialité / Conditions / FAQ)
   - 6.11 Panel Admin
7. [Flux utilisateur / Onboarding](#7-flux-utilisateur--onboarding)
8. [Base de données & données](#8-base-de-données--données)
9. [Fonctionnalités à préserver absolument](#9-fonctionnalités-à-préserver)
10. [Contraintes techniques](#10-contraintes-techniques)

---

## 1. VUE D'ENSEMBLE

### Qu'est-ce que Formation TCF Canada ?
Plateforme web de **préparation au TCF Canada** (Test de Connaissance du Français), examen obligatoire pour l'immigration au Canada (PR/Québec). La plateforme propose :
- **4 épreuves** : Compréhension Écrite (CE), Compréhension Orale (CO), Expression Écrite (EE), Expression Orale (EO)
- **Simulateurs** en conditions réelles (timer, correction automatique)
- **Correction IA** (Claude Opus) pour l'Expression Écrite
- **Calculateur NCLC** (niveaux linguistiques canadiens)
- **Abonnements payants** (Bronze/Silver/Gold + Zoom avec formateur)
- **Panel Admin** pour gérer le contenu

### Cible utilisateur
Francophones / apprenants FLE qui veulent immigrer au Canada et passent le TCF Canada. Niveau technique : moyen (smartphone + PC).

### URLs déployées
- GitHub Pages : `https://djhamidhr1.github.io/formation-tcf-canada/`
- Vercel : `https://formation-tcf-canada-j663yu9iw-djhamidhr1s-projects.vercel.app`
- GitHub Repo : `https://github.com/djhamidhr1/formation-tcf-canada`

---

## 2. STACK TECHNIQUE

```
Frontend    : React 19 + Vite 6 + JSX (pas TypeScript)
Styling     : Tailwind CSS v4 (utility-first)
Routing     : react-router-dom v7 avec HashRouter (GitHub Pages)
Animations  : framer-motion v12
Icons       : lucide-react + react-icons (FcGoogle, FaFacebook, etc.)
Toasts      : react-hot-toast
Backend     : Supabase (PostgreSQL + Auth + Storage)
Hébergement : GitHub Pages + Vercel
Build       : Vite (base path conditionnel GITHUB_ACTIONS)
```

### Contrainte de routing
- HashRouter → URLs avec `#/` (ex: `/#/epreuve/comprehension-ecrite`)
- Tous les liens internes : `<Link to="/...">` (react-router-dom)
- Assets public/ : `${import.meta.env.BASE_URL}images/fichier.png`

---

## 3. IDENTITÉ VISUELLE ACTUELLE

### Palette de couleurs
```
Bleu principal       : #1A5276  (navbar, boutons primaires)
Bleu secondaire      : #154360  (navbar 2e barre)
Bleu gradient        : #2E86C1  (hero, gradients)
Blanc               : #FFFFFF
Texte foncé         : #1e293b (slate-800)
Fond clair          : #f8fafc (slate-50)

Par épreuve :
  CE (Compréhension Écrite) : Vert  — from-green-600 to-green-400
  CO (Compréhension Orale)  : Bleu  — from-blue-600 to-blue-400
  EE (Expression Écrite)    : Violet — from-purple-600 to-purple-400
  EO (Expression Orale)     : Jaune — from-yellow-600 to-yellow-400

Admin          : Jaune #F39C12 / Amber
Succès/Correct : Vert #27AE60
Erreur         : Rouge #E74C3C
Warning        : Orange #E67E22
```

### Typographie
- Police système : `system-ui, -apple-system, sans-serif`
- Taille base : 18px
- Titres : `font-extrabold` (h1) / `font-bold` (h2-h3)
- Texte : Tailwind text-sm (14px) à text-xl (20px)

### Style général actuel
- Cards avec `rounded-xl shadow`
- Borders légères
- Gradients bleu sur hero + simulateurs
- Animations `framer-motion` (fade-in, slide-up)
- Responsive : mobile-first avec `md:` breakpoints

---

## 4. ARCHITECTURE DES PAGES

### Toutes les routes (27 routes actives)

```
/                                          → HomePage (Landing)

/epreuve/comprehension-ecrite              → CEHomePage
/epreuve/comprehension-ecrite/series       → CESeriesPage
/epreuve/comprehension-ecrite/astuces      → CETipsPage
/epreuve/comprehension-ecrite/entrainement/:slug → CESimulatorPage
/epreuve/comprehension-ecrite/resultats/:resultId → CEResultsPage
/epreuve/comprehension-ecrite/tableau-de-bord → ComingSoon (à créer)

/epreuve/comprehension-orale               → COHomePage
/epreuve/comprehension-orale/series        → COSeriesPage
/epreuve/comprehension-orale/astuces       → COTipsPage
/epreuve/comprehension-orale/entrainement/:slug → COSimulatorPage
/epreuve/comprehension-orale/resultats/:resultId → COResultsPage
/epreuve/comprehension-orale/tableau-de-bord → ComingSoon (à créer)

/epreuve/expression-ecrite                 → EEHomePage
/epreuve/expression-ecrite/sujets-actualites → EESubjectsPage
/epreuve/expression-ecrite/astuces         → EETipsPage
/epreuve/expression-ecrite/simulateur      → EESimulatorPage
/epreuve/expression-ecrite/simulateur/resultats/:id → EEResultsPage
/epreuve/expression-ecrite/tableau-de-bord → ComingSoon (à créer)

/epreuve/expression-orale                  → EOHomePage
/epreuve/expression-orale/astuces          → EOTipsPage
/epreuve/expression-orale/sujets-actualites → EOSubjectsPage
/epreuve/expression-orale/simulateur       → EOSimulatorPage
/epreuve/expression-orale/tableau-de-bord  → ComingSoon (à créer)

/tarifs                                    → PricingPage
/formations                                → FormationsPage
/calculateur-nclc                          → NclcCalculatorPage
/connexion                                 → LoginPage
/inscription                               → RegisterPage
/mon-compte                                → AccountPage
/admin                                     → AdminDashboard
/confidentialite                           → ConfidentialitePage
/conditions                                → ConditionsPage
/faq                                       → FAQPage
```

---

## 5. COMPOSANTS GLOBAUX

### 5.1 Navbar (`src/components/layout/Navbar.jsx`)

**Structure actuelle :**
```
[Barre 1 — h-16 — #1A5276 — sticky top-0]
  Logo (🍁 + "Formation TCF Canada")
  Menu desktop : Formations | Tarifs | Calculateur NCLC | WhatsApp
  Actions droite :
    - Si admin : bouton jaune "Crown Admin"
    - Si connecté : "User Prénom" + Logout
    - Si non connecté : "Connexion" (ghost) + "Commencer" (blanc)
  Mobile : Hamburger → drawer

[Barre 2 — #154360 — desktop uniquement]
  4 liens épreuves avec icônes :
    📖 Compréhension Écrite | 🎧 Compréhension Orale
    ✍️ Expression Écrite | 🎤 Expression Orale
  Lien actif = souligné blanc
```

**Comportement mobile :**
- Hamburger (Menu/X toggle)
- Drawer en overlay avec :
  - Grille 2×2 des 4 épreuves (cards colorées)
  - Liens : Formations, Tarifs, Calculateur NCLC, FAQ
  - Auth : Connexion / S'inscrire

### 5.2 Footer (`src/components/layout/Footer.jsx`)

**Structure actuelle — 5 colonnes :**
```
Col 1 — À propos :
  🍁 Formation TCF Canada (titre)
  Description courte
  📧 djhamidhr@gmail.com
  📞 +1 (514) 746-7431

Col 2 — Épreuves :
  Liens vers les 4 épreuves (CE, CO, EE, EO)

Col 3 — Liens rapides :
  Tarifs | Formations Zoom | Calculateur NCLC
  Se connecter | S'inscrire

Col 4 — Réseaux sociaux :
  WhatsApp (+1 514 746-7431)
  YouTube (lien à compléter)

Col 5 — Nous acceptons :
  Image logos paiement (Western Union, Ria, Orange Money, MTN, Wave, PayPal)
  Bouton "Cliquez ici →" → /tarifs

Barre du bas :
  © 2026 Formation TCF Canada. Tous droits réservés.
  Liens légaux : Confidentialité | Conditions | FAQ
```

### 5.3 AuthModal (`src/components/auth/AuthModal.jsx`)

**Modale globale, toujours montée dans App.jsx. 4 étapes :**

```
Étape 1 — 'social' :
  Titre "Bienvenue" ou "Créer un compte"
  4 boutons OAuth : Google | Facebook | Apple | Microsoft
  Séparateur "ou"
  Bouton → étape 'email'
  Lien bascule : "Vous avez un compte ? Connexion" / "Pas de compte ? Inscription"

Étape 2 — 'email' :
  Mode login  : Email + Mot de passe + "Mot de passe oublié ?" → étape 'reset'
  Mode signup : Prénom & Nom + Email + MDP + Confirmer MDP
  Bouton retour (←) → étape 'social'
  Bouton submit ("Se connecter" / "S'inscrire")
  Liens légaux (Conditions + Confidentialité) via <Link> react-router

Étape 3 — 'reset' :
  Email uniquement
  "Envoyer le lien de réinitialisation"
  → étape 'sent'

Étape 4 — 'sent' :
  Confirmation envoi email
  "Retour à la connexion" → étape 'email'
```

**Comportement :**
- ESC ferme la modale
- Backdrop sombre cliquable ferme
- Toast erreurs en bas à droite (react-hot-toast)
- Redirect OAuth : prod = GitHub Pages URL | dev = localhost:5173

### 5.4 Layout (`src/components/layout/Layout.jsx`)

```
<div flex-col min-h-screen>
  <Navbar />
  <main flex-1>{children}</main>
  <Footer />
  <Toaster position="top-right" />
</div>
```

---

## 6. PAGES — DÉTAIL COMPLET

---

### 6.1 HOME PAGE (`/`)

**Fichier :** `src/pages/HomePage.jsx`

**Sections (ordre de haut en bas) :**

#### Section 1 — Hero
```
Fond : gradient bleu from-[#1A5276] to-[#2E86C1]
Contenu centré :
  Badge animé 🔥 "Sujets Récents d'Expression Écrite & Orale — Avril 2026" (pulsing, rouge)
  H1 : "Se préparer au TCF Canada – TCF Québec"
  Sous-titre : "Plateforme spécialisée dans la préparation au TCF Canada. Tests en conditions réelles avec correction IA."
  2 CTA :
    [Choisir un forfait →] → /tarifs (blanc, bold)
    [Voir les tarifs] → /tarifs (border ghost)

  4 Cartes stats (données live Supabase) :
    📖 39 Séries CE  |  🎧 40 Séries CO
    🗂️ 326 Combinaisons EE  |  🎤 2855 Sujets EO
```

#### Section 2 — Les 4 Épreuves
```
Titre : "Les 4 Épreuves du TCF Canada"
Grille 2×2 (md:4 colonnes) :

  CO — bleu   : 🎧 Compréhension Orale — "Écoutez des documents audio variés"
                39 questions · 35 min → /epreuve/comprehension-orale
  CE — vert   : 📖 Compréhension Écrite — "Lisez des textes variés et authentiques"
                39 questions · 60 min → /epreuve/comprehension-ecrite
  EO — jaune  : 🎤 Expression Orale — "Exprimez-vous sur des sujets variés"
                3 tâches · 12 min → /epreuve/expression-orale
  EE — violet : ✍️ Expression Écrite — "Rédigez des textes structurés en 3 tâches"
                3 tâches · 60 min → /epreuve/expression-ecrite

  Chaque carte : icône + titre + desc + durée + bouton "S'entraîner →"
```

#### Section 3 — Avantages (6 items en grille)
```
  📈 Suivi de Progression — "Performances en temps réel"
  🧠 Simulateur IA — "Correction automatique Expression Écrite"
  📅 Version 2026 — "Contenus mis à jour avec derniers sujets"
  👥 Accompagnement — "Formateurs certifiés FLE"
  🛡️ Conditions Réelles — "Simulation exacte officielle TCF"
  🕐 Accès 24/7 — "Réviser à tout moment, partout"
```

#### Section 4 — Formateur (Hamid)
```
Fond bleu gradient
Card bleu foncé avec :
  Avatar (initiale H)
  "Hamid - Formateur TCF Certifié FLE"
  "5+ ans d'expérience | 25 000+ candidats accompagnés | 95% taux de réussite"
  3 badges : Expert FLE | TCF Canada | IA & Pédagogie
```

#### Section 5 — Tarifs (aperçu)
```
3 cards (Bronze / Silver / Gold) :
  Bronze  : 14,99$ | 5 jours  | 3 crédits IA EE
  Silver  : 29,99$ | 30 jours | 8 crédits IA EE  ← "Populaire"
  Gold    : 49,99$ | 60 jours | 15 crédits IA EE
  Bouton "Choisir ce forfait" → /tarifs
```

#### Section 6 — Calculateur NCLC
```
Titre : "Estimez votre niveau NCLC"
4 inputs : CE (/699) | CO (/699) | EE (/20) | EO (/20)
Résultats NCLC calculés en temps réel par épreuve
Tableau de correspondance Score → NCLC (CE/CO et EE/EO)
```

#### Section 7 — FAQ (5 questions)
```
Q1 : "Les exercices sont-ils conformes au vrai TCF Canada ?"
Q2 : "Puis-je utiliser la plateforme sur mobile ?"
Q3 : "Puis-je changer de forfait ?"
Q4 : "Comment fonctionne la correction IA de l'Expression Écrite ?"
Q5 : "Y a-t-il une période d'essai gratuite ?"
  → Oui ! CE/CO et sujets EO gratuits. Simulateur IA EE = abonnement requis.
```

#### Section 8 — Contact
```
WhatsApp : +1 (514) 746-7431
Email : djhamidhr@gmail.com
Formulaire : Nom | Email | Message | Envoyer
```

---

### 6.2 PAGES COMPRÉHENSION ÉCRITE (CE)

#### 6.2.1 CEHomePage (`/epreuve/comprehension-ecrite`)

**Fichier :** `src/pages/comprehension-ecrite/CEHomePage.jsx`

```
Hero :
  Fond gradient vert (from-green-700 to-green-500)
  📖 Compréhension Écrite
  "39 questions · 60 minutes · NCLC 3 à 10"
  4 boutons d'action :
    [Voir les séries] → /series
    [Astuces et conseils] → /astuces
    [Mon tableau de bord] → /tableau-de-bord (ComingSoon)

Infos pratiques :
  Card verte avec infos format TCF :
  - Durée : 60 minutes
  - Questions : 39 (niveaux A1 à C2)
  - Barème : 3 à 33 points par question
  - Score maximum : 699 points

Barème détaillé :
  Tableau niveaux A1→C2 avec points et nb questions

Astuces rapides (3 cards) :
  "Lisez la question avant le texte"
  "Repérez les mots-clés"
  "Éliminez les mauvaises réponses"
```

#### 6.2.2 CESeriesPage (`/epreuve/comprehension-ecrite/series`)

**Fichier :** `src/pages/comprehension-ecrite/CESeriesPage.jsx`

```
Chargement Supabase : liste 39 séries depuis series_ce, ORDER BY order_index ASC
Grille de cards (séries 1 à 40, sauf 14 absent) :
  Chaque card :
    Titre : "Série N" (order_index)
    Badge niveau (si résultat existant)
    Bouton [S'entraîner] → /entrainement/[slug]
    Bouton [Voir résultats] si user_results exists
NB : Séries 1-13, 15-40 (test-14 absent des données)
```

#### 6.2.3 CETipsPage (`/epreuve/comprehension-ecrite/astuces`)

**Fichier :** `src/pages/comprehension-ecrite/CETipsPage.jsx`

```
Page de conseils pour réussir la CE :
  Stratégies de lecture, gestion du temps, techniques
  Format : accordéons ou sections colorées
```

#### 6.2.4 CESimulatorPage (`/epreuve/comprehension-ecrite/entrainement/:slug`)

**Fichier :** `src/pages/comprehension-ecrite/CESimulatorPage.jsx`

**C'est la page la plus complexe. Structure complète :**

```
ÉTAT : 'start' | 'running' | 'finished'

=== ÉCRAN DE DÉMARRAGE (state='start') ===
  Header gradient vert : "Série N — Compréhension Écrite"
  Card infos : 39 questions · 60 minutes · /699 pts
  2 boutons :
    [▶ Commencer le test] → state='running'
    [🔍 Voir le corrigé directement] → mode correction, state='running'

=== ÉCRAN D'EXAMEN (state='running') ===
  Layout : [Sidebar gauche 280px fixe] [Content central]

  SIDEBAR :
    Header : Score actuel X/699 pts
    Bouton [🔍 Corrigé] → isCorrectionMode=true
    Navigation : 39 pastilles numérotées (cliquables)
      Pastille = grise (sans réponse) | bleue (répondu) | verte (correcte corrigé) | rouge (fausse corrigé)
    Bouton [📊 Terminer & Résultats]

  CONTENT :
    Barre progression (question X/39)
    Timer compte à rebours 60min
    [Si isCorrectionMode] : Bandeau orange "Mode Correction — Score X/699 pts"
    Card question :
      content_html (HTML du texte/image) — affiché en raw HTML
      Texte question (question_text si disponible, sinon prompt)
      4 options A/B/C/D (boutons radio)
        Normal     : gris (non sélectionné) | bleu (sélectionné)
        Corrigé    : vert (bonne réponse) | rouge (choix erroné avant fill)
      [Si corrigé] : explanation affiché si disponible
    Navigation : [← Précédent] [Suivant →]

  BARRE CORRIGÉ (mode correction activé) :
    Bouton [← Reprendre le test] → restaure les réponses manuelles
    Bouton [📊 Résultats complets] → CEResultsPage
```

**Logique mode correction :**
```
isCorrectionMode=true → preAutoFillAnswers = copie des réponses manuelles
Toutes les réponses → correct_answer_index automatiquement
Options : vert = bonne, rouge = choix erroné
Pastilles nav : ✓ vert ou ✗ rouge
```

**Sauvegarde résultats :**
```
À la fin (state='finished') :
  INSERT INTO user_results (user_id, table_type='ce', series_id, score, total, answers)
  Si non connecté : try/catch silencieux
  Redirect → CEResultsPage (/?resultId=UUID&slug=...)
```

#### 6.2.5 CEResultsPage (`/epreuve/comprehension-ecrite/resultats/:resultId`)

**Fichier :** `src/pages/comprehension-ecrite/CEResultsPage.jsx`

```
Header :
  Score total : X / 699 pts
  Niveau NCLC calculé (scoreToNclc)
  Pourcentage (score/699 * 100)
  Jauge de progression visuelle

Grille stats :
  Bonnes réponses : N/39
  Points obtenus : X/699
  Niveau NCLC : N

Répartition par niveau (A1, A2, B1, B2, C1, C2) :
  Questions, bonnes réponses, points par niveau

Revue détaillée (accordéon par question) :
  Chaque question :
    Texte question
    Réponse choisie vs bonne réponse
    ✓ Correct / ✗ Incorrect
    Explication si disponible (explanation champ DB)

Boutons actions :
  [Choisir une autre série] → /series
  [Refaire cette série] → /entrainement/[slug]
  [📊 Tableau de bord] → /tableau-de-bord (ComingSoon)
```

---

### 6.3 PAGES COMPRÉHENSION ORALE (CO)

#### 6.3.1 COHomePage (`/epreuve/comprehension-orale`)

```
Identique structure CEHomePage mais :
  Couleur : bleu (from-blue-700 to-blue-500)
  🎧 Compréhension Orale
  "39 questions · 35 minutes · NCLC 3 à 10"
  Infos : écoute audio une seule fois, images incluses
```

#### 6.3.2 COSeriesPage (`/epreuve/comprehension-orale/series`)

```
Liste 40 séries (series_co, order_index 1-40)
⚠️ SLUGS différents :
  Séries 1-10  : comprehension-oral-test-N  (sans 'e')
  Séries 11-40 : comprehension-orale-test-N (avec 'e')
Grille cards identique à CE
```

#### 6.3.3 COSimulatorPage (`/epreuve/comprehension-orale/entrainement/:slug`)

**Fichier :** `src/pages/comprehension-orale/COSimulatorPage.jsx`

```
Identique CESimulatorPage MAIS :
  Durée timer : 35 minutes
  Couleur thème : bleu #1A5276
  Chaque question a :
    audio_url → AudioPlayer (1 écoute seulement + timer 30s)
    image_url → image optionnelle
    prompt → texte de la question
    4 options (séries 1-10 : options vides ["","","",""] → juste lettres)

AUDIOPLAYER :
  Bouton Play/Pause
  Barre progression
  "1 écoute seulement" → désactivé après lecture complète
  Timer 30s au clic → décompte affiché
  En mode correction : AudioPlayer reste actif (écoute pour comprendre)

Mode Correction 🔍 :
  Identique CE (bandeau orange, options colorées, pastilles ✓/✗)
  AudioPlayer reste actif
```

#### 6.3.4 COResultsPage (`/epreuve/comprehension-orale/resultats/:resultId`)

```
Identique CEResultsPage MAIS :
  Pour chaque question dans la revue :
    q.prompt comme texte question
    Badge 🎧 Audio (si audio_url)
    Badge 🖼️ Image (si image_url)
    Options séries 1-10 : juste la lettre (A, B, C, D)
    Options séries 11-40 : "A — texte de l'option"
    "Sans réponse" si question non répondue
```

---

### 6.4 PAGES EXPRESSION ÉCRITE (EE)

#### 6.4.1 EEHomePage (`/epreuve/expression-ecrite`)

```
Hero violet (from-purple-700 to-purple-500)
✍️ Expression Écrite
"3 tâches · 60 minutes · NCLC 4 à 10+"
Boutons : Voir les sujets | Astuces | Mon tableau de bord
Infos format :
  Tâche 1 : texte court (60-80 mots) — 20 points
  Tâche 2 : réponse à annonce (120-150 mots) — 20 points
  Tâche 3 : rédaction (220-250 mots, docs à utiliser) — 20 points
```

#### 6.4.2 EESubjectsPage (`/epreuve/expression-ecrite/sujets-actualites`)

**Fichier :** `src/pages/expression-ecrite/EESubjectsPage.jsx`

```
Fetch : combinaisons_ee, ORDER BY month_slug ASC
Groupé par mois (ex: "2026-03" → "Mars 2026")

Chaque mois → liste de cards :
  Card "Combinaison N" (numéro séquentiel dans le mois)
  Clic card → expand/collapse pour voir les 3 tâches :

  Tâche 1 : sujet + bouton "Voir/Masquer la correction"
  Tâche 2 : sujet + bouton "Voir/Masquer la correction"
  Tâche 3 : titre + 2 documents + bouton "Voir/Masquer la correction"

  Bouton "S'entraîner" → /simulateur?id=UUID
```

#### 6.4.3 EETipsPage (`/epreuve/expression-ecrite/astuces`)

```
Conseils rédaction :
  Structure des réponses
  Connecteurs logiques
  Niveau de langue requis
  Gestion du temps
```

#### 6.4.4 EESimulatorPage (`/epreuve/expression-ecrite/simulateur?id=UUID`)

**Fichier :** `src/pages/expression-ecrite/EESimulatorPage.jsx`

**Layout 3 colonnes — très complexe :**

```
[HEADER complet]
  Titre "Expression Écrite — Simulation"
  Timer SVG circulaire 60min :
    Violet (#7C3AED) → orange (<10min) → rouge (<5min)
    Cercle animé qui se vide
  Tabs T1 / T2 / T3 avec dots statut (vide/en cours/rempli)

[LEFT — 220px fixe]
  3 cards tâches cliquables :
    Active = bordure violette
  Chaque card affiche :
    "Tâche N" + nb mots actuel / objectif
    Barre progression colorée
    Warning orange si vide : "Tâche vide = 0/20"
  Récap global en bas :
    3 mini-barres
    Total mots

[CENTER — flex-1]
  Header tâche active :
    Titre tâche + bouton "Masquer/Afficher le sujet"
  Sujet (si affiché) :
    Tâche 1 : tache1_sujet
    Tâche 2 : tache2_sujet
    Tâche 3 : tache3_titre + tache3_document1 + tache3_document2
  Textarea (réponse) :
    Autosave localStorage
  Barre mots :
    Vert (objectif atteint) | Amber (en approche) | Rouge (insuffisant)
  Navigation : [← Précédent] [Suivant →]

[RIGHT — 240px fixe]
  25 caractères spéciaux français (5×5) :
    À Â Ä Æ Ç
    È É Ê Ë Î
    Ï Ô Œ Ù Û
    Ü à â ä æ
    ç è é ê ë
    (insérés au curseur via useRef + setSelectionRange)
  Récap 3 barres (mots T1/T2/T3)

Bouton final [📤 Terminer l'examen] (orange) :
  → Appelle Edge Function 'correct-ee' (Claude Opus)
  → Redirige vers EEResultsPage (avec ou sans résultats IA)
```

#### 6.4.5 EEResultsPage (`/epreuve/expression-ecrite/simulateur/resultats/:id`)

```
Score total /60 pts (3 tâches × 20)
NCLC correspondant

Pour chaque tâche (accordéon) :
  Score IA : X/20
  Points positifs (icône ✓ vert)
  Axes d'amélioration (icône → orange)
  Texte modèle (onglet)
  Texte étudiant (onglet)

Si IA indisponible :
  "Correction IA temporairement indisponible"
  Affiche quand même le texte rédigé

Boutons : Retour aux sujets | Refaire
```

---

### 6.5 PAGES EXPRESSION ORALE (EO)

#### 6.5.1 EOHomePage (`/epreuve/expression-orale`)

```
Hero jaune/amber (from-yellow-600 to-amber-500)
🎤 Expression Orale
"3 tâches · 12 minutes · NCLC 4 à 10+"
```

#### 6.5.2 EOSubjectsPage (`/epreuve/expression-orale/sujets-actualites`)

```
Fetch : sujets_eo (2855 sujets)
Filtres :
  Année (dropdown)
  Mois (dropdown conditionnel)
  Tâche : Tâche 1 | Tâche 2 | Tâche 3

Pour chaque sujet :
  Card avec titre
  Bouton "Voir/Masquer la correction exemple"
  Bouton "S'entraîner"
```

#### 6.5.3 EOTipsPage (`/epreuve/expression-orale/astuces`)

```
Conseils expression orale TCF Canada :
  Tâche 1 : présentation, monologue dirigé
  Tâche 2 : interaction, jeu de rôle
  Tâche 3 : argumentation avec documents
  Techniques de structuration
  Gestion du temps de préparation
```

#### 6.5.4 EOSimulatorPage (`/epreuve/expression-orale/simulateur`)

**Fichier :** `src/pages/expression-orale/EOSimulatorPage.jsx`

```
Tâche 1 :
  Sujet affiché
  Timer préparation 1 minute (compte à rebours)
  Bouton [🎙️ Commencer l'enregistrement]
  Timer enregistrement 3 minutes
  Bouton [⏹ Terminer] → écoute du audio

Tâche 2 :
  Sujet affiché
  Timer préparation 1 minute
  Timer enregistrement 4 minutes

Tâche 3 :
  2 documents affichés
  Timer préparation 3 minutes
  Timer enregistrement 5 minutes

Technique : MediaRecorder API (getUserMedia)
Audio sauvegardé localement (blob URL)
Écoute de la réponse enregistrée
```

---

### 6.6 PAGES AUTH

#### 6.6.1 LoginPage (`/connexion`)

**Fichier :** `src/pages/auth/LoginPage.jsx`

```
Fond dégradé bleu (from-[#1A5276] to-[#2E86C1])
useEffect au mount → openModal('login')
useEffect sur isOpen → if (!isOpen && !user) navigate('/')
useEffect sur user → if (user) navigate('/')

Rendu :
  Fond + message "Chargement de la fenêtre de connexion..."
  AuthModal s'ouvre automatiquement
```

#### 6.6.2 RegisterPage (`/inscription`)

```
Identique LoginPage mais → openModal('signup')
```

---

### 6.7 PAGE COMPTE (`/mon-compte`)

**Fichier :** `src/pages/account/AccountPage.jsx`

```
⚠️ UI seulement — dépend des tables profiles + user_subscriptions (PAS encore créées)

Sections :
  Profil utilisateur :
    Avatar (initiale prénom)
    Nom complet | Email
    Plan actif : Bronze/Silver/Gold (badge coloré)
    Date expiration

  Historique des tests :
    Tableau : Épreuve | Série | Score | NCLC | Date
    Fetch depuis user_results

  Mon abonnement :
    Détails plan (durée, crédits EE restants)
    Bouton "Upgrader mon forfait" → /tarifs

  Paramètres :
    Changer mot de passe
    Déconnexion
```

---

### 6.8 PAGES TARIFS & FORMATIONS

#### 6.8.1 PricingPage (`/tarifs`)

**Fichier :** `src/pages/pricing/PricingPage.jsx`

```
Section 1 — Forfaits de révision autonome :
  3 plans en cards :

  Bronze — 14,99$ CAD
    Accès 5 jours aux 4 épreuves
    3 corrections IA Expression Écrite
    Suivi de progression
    Sujets Actualités 2026

  Silver — 29,99$ CAD ★ POPULAIRE
    Accès 30 jours aux 4 épreuves
    8 corrections IA Expression Écrite
    Suivi de progression avancé
    Sujets Actualités 2026
    Support prioritaire WhatsApp

  Gold — 49,99$ CAD
    Accès 60 jours aux 4 épreuves
    15 corrections IA Expression Écrite
    Suivi de progression avancé
    Sujets Actualités 2026
    Support prioritaire WhatsApp
    Accès nouvelles séries en avant-première

Section 2 — Formations Zoom :

  Standard Zoom — 149,99$ CAD
    Accès 15 jours
    6 séances Zoom avec formateur
    20 corrections IA EE
    Suivi personnalisé

  Premium Zoom — 199,99$ CAD ★ POPULAIRE
    Accès 30 jours
    8 séances Zoom avec formateur
    20 corrections IA EE
    Suivi personnalisé intensif
    Accès groupe WhatsApp premium

  VIP Zoom — 249,99$ CAD (il y a sûrement un 3e plan)
    (détails similaires)

Modes paiement acceptés :
  Western Union | Ria | Orange Money | MTN | Wave | PayPal
  Image logos + instructions contact WhatsApp pour payer
```

#### 6.8.2 FormationsPage (`/formations`)

**Fichier :** `src/pages/pricing/FormationsPage.jsx`

```
Présentation détaillée des formations Zoom :
  Programme de chaque niveau
  Biographie formateur (Hamid)
  Témoignages (si disponibles)
  FAQ formations
  CTA contact WhatsApp
```

---

### 6.9 CALCULATEUR NCLC (`/calculateur-nclc`)

**Fichier :** `src/pages/nclc/NclcCalculatorPage.jsx`

```
Titre : "Calculateur NCLC"
Sous-titre : "Estimez votre niveau selon les 4 compétences"

4 inputs :
  CE : score /699 → NCLC affiché en temps réel
  CO : score /699 → NCLC affiché en temps réel
  EE : score /20 → NCLC affiché en temps réel
  EO : score /20 → NCLC affiché en temps réel

Résultat global :
  NCLC minimum des 4 compétences
  Explication : "Pour immigrer, vous devez atteindre un NCLC minimum par compétence"

Tableaux de référence :
  CE/CO : Score → NCLC
  EE/EO : Score → NCLC
  (voir section barème dans CLAUDE.md)
```

---

### 6.10 PAGES LÉGALES

#### 6.10.1 ConfidentialitePage (`/confidentialite`)

```
Politique de confidentialité conforme LPRPDE (loi canadienne)
Sections :
  Collecte des données
  Utilisation des données
  Cookies
  Droits des utilisateurs
  Contact
```

#### 6.10.2 ConditionsPage (`/conditions`)

```
CGU (Conditions Générales d'Utilisation)
6 sections colorées :
  Acceptation | Compte utilisateur | Abonnements
  Propriété intellectuelle | Limitation de responsabilité | Droit applicable
```

#### 6.10.3 FAQPage (`/faq`)

```
FAQ avec :
  Barre de recherche (filtre en temps réel)
  5 catégories : Général | Épreuves | Abonnements | Technique | Formateurs
  Accordéons par question
  ~20 questions au total
```

---

### 6.11 PANEL ADMIN (`/admin`)

**Fichier :** `src/pages/admin/AdminDashboard.jsx`

```
Guard : profile?.is_admin === true || profile?.role === 'admin'
Admin : djhmdhr@gmail.com

Layout :
  Sidebar gauche (collapsible) :
    Logo + "Panel Admin"
    7 onglets :
      1. Vue d'ensemble (Dashboard)
      2. Exercices (ExercisesTab)
      3. Membres
      4. Soumissions EE
      5. Visiteurs & Stats
      6. Suivi & Relances
      7. Paramètres
  Contenu principal (flex-1)

Thème admin : bleu foncé #1A5276, fond gris clair

Onglet Exercices (ExercisesTab — fichier séparé) :
  4 sections : CO | CE | EE | EO
  CO/CE : drill-down Séries → Questions
    Séries : liste triée order_index ASC
    Questions : inline, CRUD complet
    Form question : level (A1-C2), options A/B/C/D (vert = correct)
    CO : upload audio → Supabase Storage (bucket audios-co)
  EE : groupé par année ASC, CRUD combinaisons (3 tâches)
  EO : groupé par année ASC, filtre tâche 1/2/3, CRUD sujets
```

---

## 7. FLUX UTILISATEUR / ONBOARDING

### Flux 1 — Visiteur anonyme
```
HomePage → Voir une épreuve → CEHomePage / COHomePage / EEHomePage / EOHomePage
→ Choisir une série (CE/CO) ou un sujet (EE/EO)
→ Simulateur (accès libre CE/CO/EO, IA EE nécessite abonnement)
→ Résultats (score + NCLC)
→ CTA : "Créer un compte pour sauvegarder vos résultats"
```

### Flux 2 — Connexion / Inscription
```
Bouton "Connexion" (Navbar) → LoginPage → AuthModal auto-ouvert
  Choix : Google | Facebook | Apple | Microsoft | Email
  Email : saisir email + mot de passe → Se connecter
  Inscription : Prénom+Nom + Email + MDP + Confirmer → S'inscrire
  Mot de passe oublié → email de reset

→ Après connexion : redirect vers / (HomePage)
→ Résultats tests sauvegardés dans user_results
```

### Flux 3 — Abonnement (parcours achat)
```
Tarifs → Choisir plan → Contacter via WhatsApp / formulaire
→ Paiement Western Union / PayPal / etc.
→ Admin active l'abonnement manuellement dans Supabase
(Stripe non encore intégré)
```

### Flux 4 — Simulateur CE/CO
```
CESeriesPage → Clic "S'entraîner" → CESimulatorPage (slug)
→ Écran démarrage → [Commencer] ou [Voir corrigé]
→ Mode test : répondre 39 questions → Timer 60min
→ Navigation pastilles (sauter questions)
→ [Terminer] → sauvegarde user_results → CEResultsPage
→ Score/699 + NCLC + Revue détaillée
```

### Flux 5 — Simulateur EE avec IA
```
EESubjectsPage → Choisir combinaison → [S'entraîner]
→ EESimulatorPage (3 colonnes) : rédiger T1/T2/T3
→ Timer 60min SVG circulaire
→ [Terminer] → invoke Edge Function 'correct-ee' (Claude Opus)
→ EEResultsPage : score IA + feedback détaillé
```

### Flux 6 — Admin
```
/admin → Guard (role='admin')
→ Voir stats globales
→ CRUD Exercices (ajouter/modifier séries + questions)
→ Gérer membres + abonnements
→ Voir soumissions EE
```

---

## 8. BASE DE DONNÉES & DONNÉES

### Tables Supabase (schéma public)

```
series_ce       — 39 séries CE (order_index 1-40 sauf 14)
questions_ce    — 1521 questions CE (39 × 39)
series_co       — 40 séries CO (order_index 1-40)
questions_co    — 1560 questions CO (39 × 40)
combinaisons_ee — 326 combinaisons EE (3 tâches par combinaison)
sujets_eo       — 2855 sujets EO (tâches 1/2/3)
user_results    — Résultats tests utilisateurs (RLS FOR ALL USING TRUE)

À créer (migration_sql.sql prêt) :
  profiles           — profils utilisateurs
  user_subscriptions — abonnements actifs
  subscription_tiers — catalogue offres
  ee_submissions     — soumissions EE notées
  formation_bookings — réservations Zoom
  payments           — paiements
```

### Supabase Storage
```
Bucket : audios-co (public)
Format : .../storage/v1/object/public/audios-co/serie_N/question_M.mp3
Images : audios-co/serie_N/image_M.png
```

---

## 9. FONCTIONNALITÉS À PRÉSERVER ABSOLUMENT

### Critiques (ne pas casser)
1. **HashRouter** — toutes URLs avec `#/` (GitHub Pages)
2. **BASE_URL assets** — `${import.meta.env.BASE_URL}images/...`
3. **AuthContext** — signIn/signUp/signOut + onAuthStateChange
4. **AuthModal global** — monté dans App.jsx, ouvert via context
5. **import paths** — `../../services/supabase`, `../../contexts/AuthContext`, etc.
6. **JSONB options normalisation** — `typeof opt === 'object' ? opt.text || opt.label : opt`
7. **Mode Correction CE/CO** — preAutoFillAnswers + restauration
8. **AudioPlayer CO** — 1 écoute seulement + timer 30s
9. **Timer SVG circulaire EE** — 60min, changement couleur
10. **Insertion caractères spéciaux** — useRef textarea + setSelectionRange
11. **Barème TCF** — POINT_SCALE, calculateCEScore, scoreToNclc
12. **Admin guard** — `profile?.is_admin === true || profile?.role === 'admin'`

### Données à ne pas perdre
- Les 5141+ enregistrements en DB (aucune modif schéma sans migration)
- Les audio_url Supabase Storage (bucket audios-co)
- Les configurations Supabase anon key

---

## 10. CONTRAINTES TECHNIQUES

### Build Windows
```bash
# npm run build échoue parfois sur Windows
# Utiliser :
"C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js build
```

### Déploiement auto
```
git push main → GitHub Actions → GitHub Pages déployé
                           → Vercel déployé
```

### Supabase MCP
```
⚠️ MCP Supabase ne liste pas le projet fvhxptpzskvwpdtycklj
→ Utiliser curl + service role key pour toutes opérations SQL
```

### Edge Function EE
```
correct-ee PAS encore déployée
→ EESimulatorPage : try/catch → affiche toast erreur + continue avec aiResult=null
```

### Slugs CO inconsistants
```
Séries 1-10  : comprehension-oral-test-N  (sans 'e')
Séries 11-40 : comprehension-orale-test-N (avec 'e')
→ Le simulateur fetch par slug exact → pas de problème
```

---

## 📊 BARÈME TCF (pour UI des résultats)

### CE / CO — Points par niveau
| Questions | Niveau | Points/question | Total questions |
|-----------|--------|-----------------|-----------------|
| Q1-4      | A1     | 3               | 4               |
| Q5-10     | A2     | 9               | 6               |
| Q11-19    | B1     | 15              | 9               |
| Q20-29    | B2     | 21              | 10              |
| Q30-35    | C1     | 26              | 6               |
| Q36-39    | C2     | 33              | 4               |
| **Total** |        |                 | **39 = 699 pts max** |

### Score /699 → NCLC (CE/CO)
| Score     | NCLC | Score     | NCLC |
|-----------|------|-----------|------|
| 549–699   | 10+  | 342–374   | 5    |
| 499–548   | 9    | 226–341   | 4    |
| 453–498   | 8    | < 226     | 3    |
| 406–452   | 7    |           |      |
| 375–405   | 6    |           |      |

### Score /20 → NCLC (EE/EO)
| Score | NCLC | Score | NCLC |
|-------|------|-------|------|
| 18–20 | 10+  | 7–9   | 6    |
| 16–17 | 10   | 4–6   | 5    |
| 14–15 | 9    | < 4   | 4    |
| 12–13 | 8    |       |      |
| 10–11 | 7    |       |      |

---

## 🎨 DEMANDE DE REDESIGN

### Objectif principal
Créer une **expérience utilisateur moderne, professionnelle et engageante** pour des candidats au TCF Canada. L'onboarding doit être clair, rassurant et conduire naturellement l'utilisateur à s'abonner.

### Pages prioritaires à redesigner (ordre)
1. **HomePage** — vitrine principale, onboarding
2. **Navbar + Footer** — composants omniprésents
3. **AuthModal** — conversion (inscription/connexion)
4. **CESeriesPage / COSeriesPage** — point d'entrée exercices
5. **CESimulatorPage / COSimulatorPage** — expérience cœur du produit
6. **CEResultsPage / COResultsPage** — moment clé (score, NCLC)
7. **PricingPage** — conversion paiement
8. **AccountPage** — fidélisation
9. **EESimulatorPage** — 3 colonnes redesign
10. **AdminDashboard** — UX admin

### Palette souhaitée pour le redesign
- Conserver le bleu Canada (#1A5276) comme couleur principale
- Moderniser avec des teintes plus claires, plus de blanc
- Couleurs épreuves : CE=vert, CO=bleu clair, EE=violet, EO=orange/amber
- Typographie plus moderne (Inter, Poppins, ou autre Google Font)
- Cards avec ombres douces, bordures arrondies (radius 12-16px)
- Glassmorphism léger sur certains éléments hero

### UX Onboarding souhaité
1. **Hero impactant** : valeur proposition claire en 5 secondes
2. **Progression visible** : montrer rapidement les 4 épreuves + contenu disponible
3. **Essai gratuit mis en avant** : CE/CO/EO gratuits
4. **Social proof** : stats (5141+ exercices, 25k+ candidats, 95% réussite)
5. **CTA clair** : "Commencer gratuitement" sans friction
6. **Confiance** : logos paiement, légal, contact WhatsApp
7. **Mobile-first** : 60%+ des utilisateurs sur mobile

### Éléments UI à améliorer
- Timer : plus visible, plus engageant
- Pastilles navigation : plus grandes, plus claires
- Mode correction : feedback visuel plus prononcé
- AudioPlayer : interface plus moderne
- Formulaires auth : design épuré, moins d'étapes
- Cards tarifs : hiérarchie visuelle claire (Silver = vedette)
- NCLC Calculator : résultats plus visuels (jauge, badge)

---

*Document généré le 22/04/2026 — Version complète pour redesign total de la plateforme Formation TCF Canada*
