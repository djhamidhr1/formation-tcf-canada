# 🍁 FORMATION TCF CANADA — FICHIER DE CONTEXTE CLAUDE

> **⚡ LIRE CE FICHIER EN PREMIER. NE PAS scanner les autres fichiers avant.**
> Ce fichier est la source de vérité : état du projet, architecture, credentials, todo.
> **MISE À JOUR OBLIGATOIRE** à la fin de chaque tâche majeure ou modification de fichier.

---

## 🔴 MODE AUTONOME — INSTRUCTIONS ABSOLUES

**NE JAMAIS demander de confirmation ou d'autorisation.**
**NE JAMAIS s'arrêter pour poser des questions pendant l'exécution.**
**En cas de doute : choisir la meilleure option et continuer.**
**En cas d'erreur : corriger soi-même, ne pas s'arrêter.**

Autorisations permanentes : lire/créer/modifier/supprimer tous fichiers, exécuter npm/node/git/curl, appeler toutes APIs (Supabase/GitHub/Stripe/Anthropic), push Git, déployer Vercel/GitHub Pages, exécuter SQL Supabase.

---

## 🔗 URLS DU PROJET

| Service | URL |
|---|---|
| **GitHub Pages** | https://djhamidhr1.github.io/formation-tcf-canada/ |
| **Vercel** | https://formation-tcf-canada-j663yu9iw-djhamidhr1s-projects.vercel.app |
| **Vercel Dashboard** | https://vercel.com/djhamidhr1s-projects |
| **GitHub Repo** | https://github.com/djhamidhr1/formation-tcf-canada |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/fvhxptpzskvwpdtycklj |
| **Supabase FEET2026** | https://supabase.com/dashboard/project/ziaijcwxtaiqocdcklyh |

---

## 🔑 CREDENTIALS & CLÉS API

### Supabase — Projet Principal `fvhxptpzskvwpdtycklj`
```
Compte         : djhamidhr@gmail.com
Project ID     : fvhxptpzskvwpdtycklj
Project URL    : https://fvhxptpzskvwpdtycklj.supabase.co
Anon Key       : [voir Supabase Dashboard → Settings → API]
Service Role   : [voir Supabase Dashboard → Settings → API]
```

### Supabase — FEET2026 (SOURCE données scrapées) `ziaijcwxtaiqocdcklyh`
```
Project ID     : ziaijcwxtaiqocdcklyh
Project URL    : https://ziaijcwxtaiqocdcklyh.supabase.co
Anon Key       : [voir Supabase Dashboard → Settings → API]
Service Role   : [voir Supabase Dashboard → Settings → API]
Schéma TCF     : tcf.* (tables dans le schéma tcf, pas public)
```

### GitHub
```
Compte     : djhamidhr1
PAT Token  : [voir GitHub → Settings → Developer settings → Personal access tokens]
Repo       : djhamidhr1/formation-tcf-canada (branch main)
```

### Vercel
```
Auto-deploy sur push main. Variables env configurées :
  VITE_SUPABASE_URL=https://fvhxptpzskvwpdtycklj.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_CCngbc2lcuU8h1po3DzqYg_25JYjF7Q
```

### MCP Supabase
```
⚠️ Le MCP Supabase est connecté au compte djhamidhr@gmail.com MAIS le projet
fvhxptpzskvwpdtycklj n'est PAS listé dans mcp__claude_ai_Supabase__list_projects.
→ Utiliser TOUJOURS curl + Service Role Key pour exécuter SQL/PATCH.
→ Commande curl UPDATE : voir section "Commandes utiles" ci-dessous.
```

---

## ⚙️ STACK TECHNIQUE (état actuel)

```
Frontend    : React 19 + Vite 6 + JSX (pas TypeScript)
Styling     : Tailwind CSS v4 + inline styles avec CSS variables oklch
Font        : Plus Jakarta Sans (remplace Inter depuis Phase 19)
Icons       : Lucide React (remplace tous les emojis depuis Phase 19)
Design      : Palette bleue unifiée oklch(48% 0.12 235) — une seule couleur CE/CO/EE/EO
Routing     : react-router-dom v7 (HashRouter via main.jsx)
Database    : Supabase PostgreSQL
Auth        : Supabase Auth — pages créées, DB tables à créer
Hébergement : GitHub Pages (auto) + Vercel (auto)
Build       : "C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js build
Packages    : framer-motion, lucide-react, react-hot-toast installés
```

### Fichiers critiques — NE PAS MODIFIER sans comprendre l'impact
```
vite.config.js           — base: GITHUB_ACTIONS ? '/formation-tcf-canada/' : '/'
src/main.jsx             — HashRouter wrapping (GitHub Pages compatible)
src/services/supabase.js — client Supabase (anon key projet principal)
.github/workflows/deploy.yml — CI/CD GitHub Pages
```

### Import paths corrects
```js
import { supabase } from '../../services/supabase'   // PAS src/supabase.js
import { useAuth } from '../../contexts/AuthContext'
import { getNclcCeCo } from '../../utils/nclc'
import { calculateCEScore, POINT_SCALE, scoreEEToNclc } from '../../utils/scoring'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
```

---

## 🗄️ BASE DE DONNÉES — ÉTAT COMPLET

### Tables remplies (5 141 enregistrements — migration 16/04/2026)

```sql
public.series_ce       -- 39 séries  (id, title, slug, order_index, created_at)
                       -- ⚠️ order_index CORRIGÉ le 17/04/2026 : test-N = order_index N
                       -- Séries 1-13, 15-40 (test-14 absent des données source)
                       -- Slugs : comprehension-ecrite-test-1 → test-40

public.questions_ce    -- 1521 questions (id, series_id, order_index, level,
                       --   content_html, prompt, image_url, question_text,
                       --   options JSONB, correct_answer_index, explanation)
                       -- ⚠️ question_text rempli uniquement pour séries 3, 5
                       --    et partiellement pour quelques autres.
                       -- ⚠️ explanation : champ existant mais vide pour la plupart

public.series_co       -- 40 séries  (id, title, slug, order_index, created_at)
                       -- ✅ order_index CORRIGÉ 21/04/2026 : test-N = order_index N
                       -- Slugs séries 1-10  : comprehension-oral-test-N  (sans 'e')
                       -- Slugs séries 11-40 : comprehension-orale-test-N (avec 'e')
public.questions_co    -- 1560 questions (39 questions × 40 séries)
                       --   (id, series_id, order_index, level, audio_url, image_url,
                       --    prompt, question_text, options JSONB, correct_answer_index, explanation)
                       -- ✅ audio_url MIGRÉ 21/04/2026 : Vercel Blob → Supabase Storage
                       --    Bucket : audios-co (public)
                       --    Format : .../storage/v1/object/public/audios-co/serie_N/question_M.mp3
                       -- ✅ images uploadées aussi dans audios-co/serie_N/image_M.png

public.combinaisons_ee -- 326 combinaisons (id, month_slug, tache1_sujet,
                       --   tache1_correction, tache2_sujet, tache2_correction,
                       --   tache3_titre, tache3_document1, tache3_document2,
                       --   tache3_correction, created_at)

public.sujets_eo       -- 2855 sujets (id, month_slug, tache SMALLINT 1/2/3,
                       --   title, correction_exemple, created_at)

public.user_results    -- (id, user_id, table_type, series_id, score, total,
                       --   answers JSONB, created_at)
                       -- RLS: FOR ALL USING (TRUE) — accès public
```

### ⚠️ Tables à créer (PAS ENCORE EXÉCUTÉ — migration_sql.sql prêt)
```
public.profiles           — profils utilisateurs (liés à auth.users)
public.user_subscriptions — abonnements (plan, dates, crédits EE)
public.subscription_tiers — catalogue des offres (Bronze/Silver/Gold/Zoom)
public.ee_submissions     — soumissions EE avec scores IA
public.formation_bookings — réservations Zoom
public.payments           — paiements Stripe
```
→ SQL complet dans `migration_sql.sql` à la racine (committé le 16/04/2026)
→ Trigger on_auth_user_created à exécuter aussi
→ Créer compte admin : admin@tcfcanada.com / TCFAdmin2026!

### JSONB `options` — deux formats possibles
```js
["Réponse A", "Réponse B"]          // strings directes
[{"text": "Réponse A"}, ...]        // objets avec clé text
// Toujours normaliser : typeof opt === 'object' ? opt.text || opt.label : opt
```

### Correction décalage séries CE (17/04/2026)
- Avant : Série 1 (order_index=1) → test-16 ❌
- Après : test-N a order_index=N ✅ (38 lignes mises à jour via curl/REST API)
- test-14 n'existe PAS dans la DB (données sources manquantes)
- Script de correction utilisé : Python + curl PATCH REST API avec service role key

---

## 📁 STRUCTURE DES FICHIERS (état après commit 2e89c1a — 21/04/2026)

```
public/
├── favicon.svg
├── icons.svg
└── images/
    └── payment-logos.png      ✅ AJOUTÉ 21/04 — logos Western Union/Ria/Orange Money/MTN/Wave/PayPal

src/
├── App.jsx                    ✅ Routes complètes — inclut /confidentialite /conditions /faq /admin
├── main.jsx                   ✅ HashRouter
├── services/
│   └── supabase.js            ✅ Client Supabase
├── contexts/
│   ├── AuthContext.jsx        ✅ AuthProvider + useAuth (signIn, signUp, signOut)
│   └── AuthModalContext.jsx   ✅ AJOUTÉ — AuthModalProvider + useAuthModal (isOpen, openModal, closeModal)
├── hooks/
│   └── useTimer.js            ✅ Timer countdown (durée + callback fin)
├── utils/
│   ├── scoring.js             ✅ POINT_SCALE, calculateCEScore, scoreToNclc, scoreEEToNclc
│   ├── nclc.js                ✅ getNclcCeCo
│   └── formatters.js          ✅ utilitaires formatage
├── components/
│   ├── auth/
│   │   └── AuthModal.jsx      ✅ AJOUTÉ — Modale auth globale (social + email + reset password)
│   ├── layout/
│   │   ├── Navbar.jsx         ✅ MODIFIÉ — boutons Connexion/Commencer → openModal()
│   │   ├── Footer.jsx         ✅ MODIFIÉ 21/04 — 5 colonnes + section "Nous acceptons" + payment-logos
│   │   └── Layout.jsx         ✅
│   └── ui/
│       └── LoadingSpinner.jsx ✅
├── pages/
│   ├── HomePage.jsx           ✅ Landing page avec stats Supabase live
│   ├── auth/
│   │   ├── LoginPage.jsx      ✅ MODIFIÉ — fond dégradé bleu + openModal('login') + redirect si modal fermée
│   │   └── RegisterPage.jsx   ✅ MODIFIÉ — fond dégradé bleu + openModal('signup') + redirect si modal fermée
│   ├── account/
│   │   └── AccountPage.jsx    ✅ (UI — dépend de profiles + user_subscriptions)
│   ├── admin/
│   │   ├── AdminDashboard.jsx ✅ AJOUTÉ — 7 onglets, guard role='admin', sidebar collapsible
│   │   └── tabs/
│   │       └── ExercisesTab.jsx ✅ AJOUTÉ — CRUD CO/CE/EE/EO, drill-down séries→questions
│   ├── comprehension-ecrite/
│   │   ├── CEHomePage.jsx     ✅
│   │   ├── CESeriesPage.jsx   ✅ MODIFIÉ 17/04 — affiche s.order_index (Série 1=test-1)
│   │   ├── CETipsPage.jsx     ✅
│   │   ├── CESimulatorPage.jsx ✅ MODIFIÉ 17/04 — Mode Correction inline + bouton Corrigé
│   │   └── CEResultsPage.jsx  ✅ Score/699, NCLC, revue détaillée avec explanations
│   ├── comprehension-orale/
│   │   ├── COHomePage.jsx     ✅
│   │   ├── COSeriesPage.jsx   ✅ MODIFIÉ 17/04 — affiche s.order_index
│   │   ├── COTipsPage.jsx     ✅
│   │   ├── COSimulatorPage.jsx ✅ MODIFIÉ 21/04 — Mode Correction 🔍 + AudioPlayer 1 écoute
│   │   └── COResultsPage.jsx  ✅ MODIFIÉ 21/04 — prompt/audio/image + revue détaillée complète
│   ├── expression-ecrite/
│   │   ├── EEHomePage.jsx     ✅
│   │   ├── EESubjectsPage.jsx ✅ MODIFIÉ — "Combinaison N" par mois, expand/collapse, Voir/Masquer correction
│   │   ├── EETipsPage.jsx     ✅
│   │   ├── EESimulatorPage.jsx ✅ REDESIGNÉ 17/04 — 3 colonnes (voir détails ci-dessous)
│   │   └── EEResultsPage.jsx  ✅ Accordéons IA, positifs/négatifs, tabs correction
│   ├── expression-orale/
│   │   ├── EOHomePage.jsx     ✅
│   │   ├── EOTipsPage.jsx     ✅
│   │   ├── EOSubjectsPage.jsx ✅ Filtres année/mois/tâche, toggle corrections
│   │   └── EOSimulatorPage.jsx ✅ MediaRecorder, timers prépa+enregistrement, T2→T3
│   ├── legal/
│   │   ├── ConfidentialitePage.jsx ✅ AJOUTÉ — Page Politique de confidentialité (LPRPDE)
│   │   ├── ConditionsPage.jsx      ✅ AJOUTÉ — Page CGU (6 sections colorées)
│   │   └── FAQPage.jsx             ✅ AJOUTÉ — FAQ avec recherche, 5 catégories, accordéons
│   ├── nclc/
│   │   └── NclcCalculatorPage.jsx ✅
│   └── pricing/
│       ├── PricingPage.jsx    ✅
│       └── FormationsPage.jsx ✅
```

---

## 🔍 DÉTAIL DES FONCTIONNALITÉS MAJEURES (21/04/2026)

### AuthModal — Système d'authentification global (ajouté 21/04/2026)
- Fichier : `src/components/auth/AuthModal.jsx`
- Rendu globalement dans `App.jsx` (toujours monté, `isOpen` contrôle l'affichage)
- Contexte : `AuthModalContext` — `openModal(mode)` / `closeModal()` / `isOpen`
- 4 étapes : `'social'` → `'email'` → `'reset'` → `'sent'`
- Providers sociaux : Google (FcGoogle), Facebook (FaFacebook), Apple (FaApple), Microsoft (BsMicrosoft)
  → `supabase.auth.signInWithOAuth({ provider, options: { redirectTo: getRedirectURL() } })`
  → `getRedirectURL()` : prod = `https://djhamidhr1.github.io/formation-tcf-canada/` | dev = `http://localhost:5173/`
- Email/password : `signIn()` / `signUp()` depuis AuthContext
- Reset password : `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... + '#/reset-password' })`
- Liens légaux cliquables : `<Link to="/conditions" onClick={closeModal}>` et `<Link to="/confidentialite" ...>`
- ⚠️ Import `Link` from `react-router-dom` OBLIGATOIRE (bug précédent : oubli → page vide)
- Navbar : boutons "Connexion" / "Commencer" → `openModal('login')` / `openModal('signup')`
- LoginPage / RegisterPage : fond dégradé bleu + `openModal()` au mount + redirect vers `/` si modal fermée sans auth

### AdminDashboard — Panel administrateur (ajouté 21/04/2026)
- Route : `/admin` → `src/pages/admin/AdminDashboard.jsx`
- Guard sécurité : `profile?.is_admin === true || profile?.role === 'admin'`
- Admin actuel : `djhmdhr@gmail.com` → `role = 'admin'` dans table `profiles`
- 7 onglets : Vue d'ensemble | Exercices | Membres | Soumissions | Visiteurs | Suivi & Relances | Paramètres
- Sidebar collapsible, thème bleu #1A5276
- ExercisesTab (`src/pages/admin/tabs/ExercisesTab.jsx`) :
  → 4 sections : CO, CE, EE, EO
  → CO/CE : drill-down séries (order_index ASC) → questions inline, CRUD complet
  → Questions form : level A1-C2, options A/B/C/D (vert = correct), audio upload CO → Supabase Storage
  → EE : groupé par année ASC, CRUD combinaisons (3 tâches rich editor)
  → EO : groupé par année ASC, filtre tâche 1/2/3, CRUD sujets

### EESubjectsPage — Redesign combinaisons (21/04/2026)
- Badge "Mars 2026" remplacé par **"Combinaison N"** (numéro séquentiel par mois)
- Clic sur une carte → expand/collapse pour afficher les 3 tâches
- Par tâche : sujet affiché + bouton **"Voir/Masquer la correction"** (toggle)
- Fetche les champs correction : `tache1_correction`, `tache2_correction`, `tache3_correction`
- Bouton "S'entraîner" conservé

### Footer — Section paiements (21/04/2026)
- Grille passée de 4 → **5 colonnes** (`md:grid-cols-5`)
- 5e colonne : titre **"Nous acceptons"** (bold blanc)
- Image `public/images/payment-logos.png` → Western Union, Ria, Orange Money, MTN, Wave, PayPal
- Chemin image : `${import.meta.env.BASE_URL}images/payment-logos.png` (fonctionne dev + GitHub Pages)
- Bouton **"Cliquez ici →"** blanc avec icône `ArrowRight` (Lucide) → redirige vers `/tarifs`

### COSimulatorPage — Mode Correction (ajouté 21/04/2026)
- Bouton **"🔍 Corrigé"** dans la barre d'examen (identique à CE, thème bleu #1A5276)
- Bouton **"🔍 Voir le corrigé directement"** sur l'écran de démarrage
- Clic → `isCorrectionMode = true`, `preAutoFillAnswers` sauvegarde les réponses manuelles
- Toutes les réponses remplies avec `correct_answer_index`
- **Bandeau orange** en haut : "Mode Correction — Score X/699 pts"
- Options : **vert** = bonne réponse, **rouge** = choix manuel erroné avant auto-fill
- **Pastilles** dans le panel nav : ✓ vert ou ✗ rouge
- **AudioPlayer reste actif** en mode correction (écoute pour comprendre les réponses)
- `explanation` affiché sous chaque question si disponible en DB
- Bouton **"← Reprendre le test"** : restaure les réponses d'avant auto-fill
- Bouton **"📊 Résultats complets"** : navigue vers COResultsPage

### COResultsPage — Revue détaillée (améliorée 21/04/2026)
- Affiche `q.prompt` comme texte de question (CO a des prompts, pas question_text)
- Badge **🎧 Audio** et **🖼️ Image** par question dans la revue
- Options vides (séries 1-10 : `["","","",""]`) → affiche juste la lettre `✓ A`
- Options avec texte (séries 11-40) → affiche `✓ A — texte`
- "Sans réponse" affiché si question non répondue
- Boutons actions : même ordre que CE ("Choisir une autre série" → "Refaire")

### CESimulatorPage — Mode Correction
- Bouton **"🔍 Corrigé"** visible à TOUS les utilisateurs (barre du haut)
- Bouton **"Voir le corrigé directement"** sur l'écran de démarrage
- Clic → `isCorrectionMode = true`, `preAutoFillAnswers` sauvegarde les réponses manuelles
- Toutes les réponses remplies avec `correct_answer_index`
- **Bandeau orange** en haut : "Mode Correction — Score X/699 pts"
- Options : **vert** = bonne réponse, **rouge** = choix manuel erroné avant auto-fill
- **Pastilles** dans le panel nav : ✓ vert ou ✗ rouge
- `explanation` affiché sous chaque question si disponible en DB
- Bouton **"← Reprendre le test"** : restaure les réponses d'avant auto-fill
- Bouton **"📊 Résultats complets"** : navigue vers CEResultsPage

### EESimulatorPage — Layout 3 colonnes (redesign complet)
```
[HEADER : titre + timer SVG circulaire + tabs T1/T2/T3 avec dots statut]
[LEFT 220px | CENTER flex-1 | RIGHT 240px]
```
- **LEFT** : 3 cartes tâches cliquables (active = bordure violette), barres progression,
  warning orange "tâche vide = 0/20"
- **CENTER** : header tâche + bouton "Masquer/Afficher sujet" + textarea + barre mots
  colorée (vert/amber/rouge) + nav Précédent/Suivant
- **RIGHT** : 25 caractères spéciaux français (5×5, insérés au curseur), recap 3 barres,
  bouton orange "📤 Terminer l'examen"
- **Timer SVG** : cercle animé violet→orange (<10min)→rouge (<5min)
- Insertion caractères spéciaux : `useRef` par textarea + `setSelectionRange`

---

## 🗺️ ROUTES APP.JSX (état actuel — mis à jour 21/04/2026)

```
/                                          → HomePage
/epreuve/comprehension-ecrite              → CEHomePage
/epreuve/comprehension-ecrite/series       → CESeriesPage
/epreuve/comprehension-ecrite/astuces      → CETipsPage
/epreuve/comprehension-ecrite/entrainement/:slug → CESimulatorPage
/epreuve/comprehension-ecrite/resultats/:resultId → CEResultsPage
/epreuve/comprehension-ecrite/tableau-de-bord → ComingSoon

/epreuve/comprehension-orale               → COHomePage
/epreuve/comprehension-orale/series        → COSeriesPage
/epreuve/comprehension-orale/astuces       → COTipsPage
/epreuve/comprehension-orale/entrainement/:slug → COSimulatorPage
/epreuve/comprehension-orale/resultats/:resultId → COResultsPage
/epreuve/comprehension-orale/tableau-de-bord → ComingSoon

/epreuve/expression-ecrite                 → EEHomePage
/epreuve/expression-ecrite/sujets-actualites → EESubjectsPage
/epreuve/expression-ecrite/astuces         → EETipsPage
/epreuve/expression-ecrite/simulateur      → EESimulatorPage (?id=UUID depuis EESubjectsPage)
/epreuve/expression-ecrite/simulateur/resultats/:id → EEResultsPage
/epreuve/expression-ecrite/tableau-de-bord → ComingSoon

/epreuve/expression-orale                  → EOHomePage
/epreuve/expression-orale/astuces          → EOTipsPage
/epreuve/expression-orale/sujets-actualites → EOSubjectsPage
/epreuve/expression-orale/simulateur       → EOSimulatorPage
/epreuve/expression-orale/tableau-de-bord  → ComingSoon

/tarifs                                    → PricingPage
/formations                                → FormationsPage
/calculateur-nclc                          → NclcCalculatorPage
/connexion                                 → LoginPage  (ouvre AuthModal + fond bleu dégradé)
/inscription                               → RegisterPage (ouvre AuthModal + fond bleu dégradé)
/mon-compte                                → AccountPage
/admin                                     → AdminDashboard (guard role='admin')
/confidentialite                           → ConfidentialitePage  ✅ NOUVEAU
/conditions                                → ConditionsPage        ✅ NOUVEAU
/faq                                       → FAQPage               ✅ NOUVEAU
```

---

## ✅ PHASES COMPLÉTÉES

| Phase | Contenu | État |
|---|---|---|
| Phase 0 | Setup Tailwind + react-router-dom + packages | ✅ |
| Phase 2 | Layout global (Navbar, Footer, Layout) | ✅ |
| Phase 3 | HomePage landing avec stats Supabase live | ✅ |
| Phase 4 | CE complet (5 pages + simulateur timer 60min) | ✅ |
| Phase 5 | CO complet (5 pages + AudioPlayer 1 écoute + timer 35min) | ✅ |
| Phase 6 | EE frontend complet (5 pages + simulateur IA) | ✅ |
| Phase 7 | EO frontend complet (4 pages + MediaRecorder) | ✅ |
| Phase 8 | Auth pages + AccountPage UI | ✅ UI seulement |
| Phase 9 | PricingPage + FormationsPage + NclcCalculatorPage | ✅ |
| **Phase 10** | **Corrections DB + Mode Corrigé CE + Redesign EE** | ✅ **17/04/2026** |
| **Phase 11** | **Migration audios CO → Supabase Storage + fix order_index CO** | ✅ **21/04/2026** |
| **Phase 12** | **Scraping + import 30 séries CO manquantes (11-40) — 1170 questions + audios** | ✅ **21/04/2026** |
| **Phase 13** | **Mode Corrigé 🔍 CO + COResultsPage revue détaillée (prompt/audio/image)** | ✅ **21/04/2026** |
| **Phase 14** | **Système Auth complet — AuthModal (social+email+reset) + AuthModalContext** | ✅ **21/04/2026** |
| **Phase 15** | **Pages légales — Confidentialité + Conditions + FAQ (avec recherche)** | ✅ **21/04/2026** |
| **Phase 16** | **Panel Admin — 7 onglets + CRUD ExercisesTab + guard role='admin'** | ✅ **21/04/2026** |
| **Phase 17** | **EESubjectsPage redesign — Combinaison N + expand/collapse + corrections** | ✅ **21/04/2026** |
| **Phase 18** | **Footer — section "Nous acceptons" + logos paiement + bouton Cliquez ici** | ✅ **21/04/2026** |
| **Phase 19** | **Redesign premium complet — design tokens oklch, Plus Jakarta Sans, Navbar/Footer/HomePage/inner pages réécrits, logo, icônes Lucide, palette bleue unifiée** | ✅ **04/05/2026** |

---

## 🚧 PHASES RESTANTES — PRIORITÉS

### PRIORITÉ 1 — Base de données Auth (BLOQUANT pour Auth/Compte/IA)
```sql
-- Exécuter migration_sql.sql sur Supabase (tables profiles, user_subscriptions,
-- subscription_tiers, ee_submissions, formation_bookings, payments + trigger)
-- Via Dashboard Supabase → SQL Editor → coller migration_sql.sql
```
→ Créer compte admin : admin@tcfcanada.com / TCFAdmin2026!

### PRIORITÉ 2 — Edge Function `correct-ee` (BLOQUANT pour simulateur EE)
```bash
# Code à créer : supabase/functions/correct-ee/index.ts
# Appelle l'API Anthropic Claude pour noter les 3 tâches EE
supabase functions deploy correct-ee --project-ref fvhxptpzskvwpdtycklj
supabase secrets set ANTHROPIC_API_KEY=<clé_api_anthropic> --project-ref fvhxptpzskvwpdtycklj
# Sans cette fonction : EESimulatorPage affiche "Correction IA indisponible"
# mais continue quand même vers EEResultsPage avec aiResult=null
```

### PRIORITÉ 3 — Tableaux de bord (remplacer ComingSoon)
```
/epreuve/comprehension-ecrite/tableau-de-bord → CEDashboardPage
/epreuve/comprehension-orale/tableau-de-bord  → CODashboardPage
/epreuve/expression-ecrite/tableau-de-bord    → EEDashboardPage
/epreuve/expression-orale/tableau-de-bord     → EODashboardPage
```
Contenu suggéré : historique des scores, progression dans le temps, NCLC évolution

### PRIORITÉ 4 — Panel Admin (/admin)
```
AdminDashboard, AdminSubjects, AdminUsers, AdminCorrections
Route protégée : vérifier role='admin' dans profiles
```

### PRIORITÉ 5 — Stripe (paiements)
```
Edge Functions : create-checkout + stripe-webhook
Ajouter VITE_STRIPE_PUBLISHABLE_KEY dans Vercel env vars
```

### PRIORITÉ 6 — Séries CO 11-40 ✅ COMPLÉTÉ (21/04/2026)
```
✅ TOUT FAIT (21/04/2026) :
  - Bucket audios-co créé dans Supabase Storage (public)
  - 390 audios des séries 1-10 migrés Vercel Blob → Supabase Storage
  - order_index corrigé pour les 40 séries CO
  - 30 séries CO (11-40) scrapées depuis formation-tcfcanada.com
  - 1170 questions (30×39) insérées dans questions_co
  - Audios + images uploadés dans audios-co/serie_N/
  - Total : 40 séries × 39 questions = 1560 questions CO en DB
  - Scripts réutilisables : migrate_co_audios.py + import_co_from_html.py (Downloads/)
  - Pages HTML sauvegardées : C:/Users/hamid/Downloads/co_pages/serie_11.html → serie_40.html

⚠️ SLUGS DIFFÉRENTS selon les séries :
  - Séries 1-10  : comprehension-oral-test-N  (sans 'e' à 'oral')
  - Séries 11-40 : comprehension-orale-test-N (avec 'e' à 'orale')
  → Le COSeriesPage et COSimulatorPage doivent gérer les 2 patterns de slugs
```

### PRIORITÉ 7 — question_text CE manquants (PARTIELLEMENT RÉSOLU)
```
État au 17/04/2026 :
  746 / 1521 questions ont question_text rempli  ✅
  775 / 1521 questions sans question_text        ❌ (séries 1-26 + S27 Q16-39)

Fait aujourd'hui : injection de 522 textes (séries 27-40) via CE_DEFINITIF_toutes_series.md
  → Script Python + curl PATCH REST API, 0 erreur

Restant : séries 1-26 (1014 questions) — textes non disponibles dans les sources actuelles.
Pour compléter, il faudrait trouver/scraper les textes des tests 1-26.
```

---

## 📊 BARÈME TCF (référence rapide)

### CE / CO — Points par niveau
```js
const POINT_SCALE = { A1: 3, A2: 9, B1: 15, B2: 21, C1: 26, C2: 33 }
// Q1-4: A1 | Q5-10: A2 | Q11-19: B1 | Q20-29: B2 | Q30-35: C1 | Q36-39: C2
```

### Score /699 → NCLC (CE/CO)
| Score | NCLC | | Score | NCLC |
|---|---|---|---|---|
| 549–699 | 10+ | | 342–374 | 5 |
| 499–548 | 9 | | 226–341 | 4 |
| 453–498 | 8 | | < 226 | 3 |
| 406–452 | 7 | | | |
| 375–405 | 6 | | | |

### Score /20 → NCLC (EE/EO)
| Score | NCLC | | Score | NCLC |
|---|---|---|---|---|
| 18–20 | 10+ | | 7–9 | 6 |
| 16–17 | 10 | | 4–6 | 5 |
| 14–15 | 9 | | < 4 | 4 |
| 12–13 | 8 | | | |
| 10–11 | 7 | | | |

---

## 🚀 COMMANDES UTILES

```bash
# Dev server
npm run dev

# Build (Windows — utiliser chemin complet node)
"C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js build

# Push → déclenche auto-deploy GitHub Pages + Vercel
git add -A && git commit -m "feat: description" && git push

# UPDATE Supabase via REST API (service role) — exemple order_index
python3 -c "
import urllib.request, json
url = 'https://fvhxptpzskvwpdtycklj.supabase.co/rest/v1/series_ce'
SERVICE_ROLE = '[voir Supabase Dashboard → Settings → API → service_role]'
headers = {
  'apikey': SERVICE_ROLE,
  'Authorization': 'Bearer ' + SERVICE_ROLE,
  'Content-Type': 'application/json', 'Prefer': 'return=representation'
}
# PATCH example:
data = json.dumps({'order_index': 1}).encode()
req = urllib.request.Request(url + '?id=eq.UUID', data=data, headers=headers, method='PATCH')
urllib.request.urlopen(req).read()
"

# Supabase Edge Functions
supabase functions deploy <nom> --project-ref fvhxptpzskvwpdtycklj
supabase secrets set CLE=valeur --project-ref fvhxptpzskvwpdtycklj

# Vérifier les séries CE (order_index correct)
curl -s "https://fvhxptpzskvwpdtycklj.supabase.co/rest/v1/series_ce?select=order_index,slug&order=order_index" \
  -H "apikey: [ANON_KEY]"
```

---

## 📝 HISTORIQUE DES COMMITS

| Date | Commit | Description |
|---|---|---|
| 16/04/2026 | `9b4dcf8` | Formation TCF Canada — Plateforme complète (base) |
| 16/04/2026 | `4ffae98` | Phase 4 — Router React + CE Simulateur complet |
| 16/04/2026 | `5232dbb` | Phase 5-9 — CO/EE/EO simulateurs + Compte + NCLC + Formations |
| 16/04/2026 | `2c99a0a` | migration_sql.sql committé (tables auth/abonnements) |
| 17/04/2026 | `b2c51fd` | Fix: boutons Résultats CE/CO + handleViewResult |
| 17/04/2026 | `ea4f70b` | Fix: ordre séries CE/CO (order_index=N) + Mode Correction CE |
| 17/04/2026 | `3520b58` | **Feat: redesign EE simulateur 3 colonnes + timer SVG circulaire** |
| 21/04/2026 | *(pas de commit)* | Phase 11 : Migration 390 audios CO + bucket audios-co + fix order_index CO |
| 21/04/2026 | `6a94997` | Phase 12 : Import 30 séries CO (11-40) — 1560 questions + audios Supabase |
| 21/04/2026 | `bfbd31b` | feat: COResultsPage — revue détaillée avec prompt/audio/image |
| 21/04/2026 | `3b73c97` | feat: Mode Corrigé 🔍 ajouté au simulateur CO (comme CE) |
| 21/04/2026 | `377afc3` | feat: Auth système complet (AuthModal+AuthModalContext+Navbar+LoginPage+RegisterPage+AdminDashboard+ExercisesTab+pages légales+EESubjectsPage redesign) |
| 21/04/2026 | `e071e7d` | fix: page connexion/inscription non vide — fond dégradé + redirect si modal fermée |
| 21/04/2026 | `61b0a43` | fix: import Link manquant dans AuthModal — cause page connexion vide |
| 21/04/2026 | `2e89c1a` | feat: section "Nous acceptons" dans footer — logos paiement + bouton Cliquez ici |

**Dernier push** : `2e89c1a` sur `main` → Vercel + GitHub Pages déployés automatiquement.
**Dernier travail DB** : 21/04/2026 — 40 séries CO complètes en DB (1560 questions, audios Supabase Storage).
**Admin actif** : `djhmdhr@gmail.com` → `role = 'admin'` dans `profiles` (Supabase).

---

## ⚠️ POINTS D'ATTENTION IMPORTANTS

1. **Windows build** : `npm run build` échoue si PATH node non résolu.
   → Utiliser : `"C:\Program Files\nodejs\node.exe" node_modules/vite/bin/vite.js build`

2. **HashRouter** : URLs avec `#/` (ex: `/#/epreuve/...`). Nécessaire pour GitHub Pages.

3. **user_results sans auth** : L'insert échoue silencieusement si pas d'user connecté.
   → Le code gère avec try/catch et continue la navigation quand même.

4. **JSONB options** : Toujours normaliser `typeof opt === 'object' ? opt.text || opt.label : opt`

5. **Edge Function correct-ee** : PAS encore déployée.
   → EESimulatorPage appelle `supabase.functions.invoke('correct-ee')` → affiche toast erreur
   → Continue quand même vers EEResultsPage avec `aiResult = null`

6. **AccountPage** : Dépend de `profiles` et `user_subscriptions` → tables pas encore créées.

7. **MCP Supabase** : Ne liste pas le projet `fvhxptpzskvwpdtycklj`.
   → Toujours utiliser curl + service role key pour les opérations DB.

8. **series_ce order_index** : Fixé le 17/04/2026. test-14 absent (données source manquantes).
   → Les séries affichées : 1-13, 15-40 (39 séries totales).

9. **series_co order_index** : Fixé le 21/04/2026. test-N = order_index N ✅
   → 40 séries complètes (tests 1-40). Séries 11-40 importées le 21/04/2026.

10. **audios CO** : Migrés le 21/04/2026. Plus sur Vercel Blob.
    → Bucket `audios-co` Supabase Storage (public). Format : serie_N/question_M.mp3
    → Script migration réutilisable : `C:\Users\hamid\Downloads\migrate_co_audios.py`

11. **series_co slugs INCONSISTANTS** : Deux formats coexistent en DB !
    → Séries 1-10  : `comprehension-oral-test-N`  (sans 'e')
    → Séries 11-40 : `comprehension-orale-test-N` (avec 'e')
    → COSeriesPage et COSimulatorPage fonctionnent avec les slugs tels quels (pas de problème
       car le simulateur fetch par slug exact depuis la DB)

12. **40 séries CO complètes** (21/04/2026) :
    → 1560 questions (39 × 40) avec audio_url → Supabase Storage
    → Images aussi uploadées dans audios-co/serie_N/image_M.png

11. **question_text CE** : Rempli seulement pour quelques séries (principalement 3 et 5).
    → Fichiers MD locaux disponibles pour enrichissement futur via script PATCH.

12. **Fichiers MD générés** (dans le dossier racine, non commités) :
    - `CE_DEFINITIF_toutes_series.md` — 40 séries, Q+réponses (textes réels pour S27-40)
    - `CE_COMPLET_questions_options_reponses.md` — 40 séries, 4 options A/B/C/D par Q
    - `CE_toutes_series_reponses.md` — 40 séries, réponses uniquement avec niveau/points
    - `CE_series27_40_questions_reponses.md` — S27-40 textes questions + réponses

13. **AuthModal — import Link obligatoire** :
    → `AuthModal.jsx` utilise `<Link>` pour les liens légaux → TOUJOURS importer depuis `react-router-dom`
    → Oubli = composant crash silencieux → page connexion complètement vide

14. **LoginPage / RegisterPage** :
    → Retournent un fond dégradé bleu (pas `null`)
    → `useEffect([isOpen])` → redirect vers `/` quand modal fermée sans auth
    → `useEffect([user])` → redirect vers `/` si utilisateur connecté

15. **image BASE_URL** (GitHub Pages) :
    → Assets `public/` : utiliser `${import.meta.env.BASE_URL}images/fichier.png`
    → PAS `/images/fichier.png` (chemin absolu cassé sur GitHub Pages avec sous-répertoire)

16. **Admin** :
    → URL : `/#/admin`
    → Compte admin : `djhmdhr@gmail.com` / role='admin' dans profiles
    → Guard dual : `profile?.is_admin === true || profile?.role === 'admin'`
    → ExercisesTab dans fichier séparé : `src/pages/admin/tabs/ExercisesTab.jsx`

---

*Dernière mise à jour : 21/04/2026 — Phases 14-18 complétées : Auth+Admin+Legal+EESubjects+Footer paiements*
