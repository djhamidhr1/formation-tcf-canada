# 🎨 Formation TCF Canada — Design System v6
> Guide de référence complet · Navy + Orange + Turquoise · Moodle Style

---

## 🎯 Philosophie

- **Navy** `#0F3D58` → autorité, confiance, structure
- **Orange** `#F98012` → énergie, action, CTA
- **Turquoise** `#71C9CE` → succès, hover secondaire, accents
- **Beige sable** `#FDF2E9` → fond hero, sections douces
- Transitions **0.3s ease** partout — jamais abruptes
- Border-radius **pill (999px)** pour les boutons principaux, **16-20px** pour les cartes

---

## 🎨 Tokens (CSS Variables)

```css
/* Couleurs principales */
--navy:         #0F3D58   /* texte, titres, fond navbar/footer */
--navy-mid:     #164b6b   /* dégradés navy */
--orange:       #F98012   /* CTA, badges, accents */
--orange-light: #fef0e2   /* fonds orange très clair */
--orange-dark:  #d96a00   /* orange foncé (rare) */
--accent:       #71C9CE   /* turquoise — hover secondaire */
--accent-light: #e0f5f6   /* turquoise très clair */

/* Neutrals */
--white:        #ffffff
--surface:      #fefcfa   /* fond body général */
--surface-2:    #FDF2E9   /* sections alternées */
--border:       #e8e0d8
--border-med:   #d4c8be
--text-1:       #0F3D58   /* titres */
--text-2:       #3a5a6e   /* corps */
--text-3:       #6b8a9a   /* descriptions */
--text-4:       #9bb0bc   /* placeholders */

/* Sémantique */
--success:      #27ae60
--warning:      #F98012
--error:        #e74c3c

/* Radius */
--radius-sm:    10px
--radius-md:    14px
--radius-lg:    20px
--radius-xl:    28px
--radius-full:  999px     /* pill shape */

/* Shadows (navy-tinted) */
--shadow-xs:    0 1px 2px rgba(15,61,88,0.04)
--shadow-sm:    0 2px 8px rgba(15,61,88,0.06)
--shadow-md:    0 4px 16px rgba(15,61,88,0.08)
--shadow-lg:    0 8px 32px rgba(15,61,88,0.10)
--shadow-xl:    0 16px 48px rgba(15,61,88,0.12)

/* Typographie */
--font:         'Inter', system-ui, sans-serif
--font-heading: 'Merriweather', Georgia, serif
```

---

## 🔤 Typographie

| Élément | Police | Poids | Usage |
|---|---|---|---|
| `h1` `h2` `h3` | Merriweather (serif) | 700–900 | Titres sections |
| Body, boutons | Inter (sans-serif) | 400–700 | Tout le reste |
| Labels, badges | Inter | 600–800 | Petits textes |

```css
h1, h2, h3 { font-family: var(--font-heading); }
body        { font-family: var(--font); }
```

---

## 🔘 Boutons — Règles Universelles

### Règle d'or des interactions

| Type | Défaut | Hover |
|---|---|---|
| **Primaire (orange)** | Fond orange, texte blanc | Fond turquoise `#71C9CE`, texte navy |
| **Ghost (outline navy)** | Fond blanc, bordure navy, texte navy | Fond orange, bordure orange, texte blanc |
| **Navy plein** | Fond navy, texte blanc | Fond orange, texte blanc |
| **Filtre non actif** | Fond blanc, bordure navy, texte navy | Fond orange, bordure orange, texte blanc |
| **Filtre actif** | Fond navy, texte blanc | Pas de hover (déjà sélectionné) |

---

### Classes CSS disponibles

#### `.btn-primary` — CTA orange → turquoise hover
```html
<button class="btn-primary">Choisir un forfait →</button>
```
```css
background: #F98012; color: white; border-radius: 999px; padding: 14px 28px;
/* hover → background: #71C9CE; color: #0F3D58; */
```

#### `.btn-ghost` — Outline navy → orange hover
```html
<a class="btn-ghost">Commencer gratuitement</a>
```
```css
background: white; border: 1.5px solid #0F3D58; color: #0F3D58; border-radius: 999px;
/* hover → background: #F98012; border-color: #F98012; color: white; */
```

#### `.btn-outline` — Outline navy → orange hover (compact)
```html
<button class="btn-outline"><PenTool /> S'entraîner</button>
```
```css
background: white; border: 2px solid #0F3D58; color: #0F3D58; border-radius: 14px;
/* hover → background: #F98012; border-color: #F98012; color: white; */
```

#### `.btn-navy` — Navy plein → orange hover (block)
```html
<a class="btn-navy">Voir les résultats</a>
```

#### `.btn-navy-flex` — Navy plein → orange hover (inline-flex)
```html
<button class="btn-navy-flex">Recommencer</button>
```

#### `.btn-filter` + `.active` — Boutons filtres Année/Mois/Tâche
```html
<button class="btn-filter active">2026</button>
<button class="btn-filter">2025</button>
```
```css
/* Non actif : blanc + border navy → orange hover */
/* Actif     : navy plein + blanc, pas de hover */
```

#### `.btn-start-session` — Navy → orange hover (tips pages)
```html
<a class="btn-start-session">Commencer l'entraînement →</a>
```

#### `.btn-hero-white` — Fond blanc → orange hover (hero)
```html
<a class="btn-hero-white">Choisir un forfait</a>
```

#### `.btn-hero-outline` — Outline blanc → orange hover (hero)
```html
<a class="btn-hero-outline">Commencer gratuitement</a>
```

#### `.btn-contact` — Blanc + bordure turquoise → orange hover
```html
<a class="btn-contact"><MessageCircle /> WhatsApp</a>
```

#### `.btn-back` — Bouton retour dans les hero navy
```html
<a class="btn-back">← Expression Écrite</a>
```

#### `.btn-secondary` — Gris → orange tint hover
```html
<button class="btn-secondary">Voir les résultats</button>
```

---

## 🃏 Cartes

#### `.serie-card` — Carte exercice/série
```css
/* hover → ombre + translateY(-3px) + border orange */
```

#### `.nav-card` + `.nav-card-icon` — Carte navigation (tips, home)
```css
/* hover → ombre orange + translateY(-3px) */
/* .nav-card-icon hover → color: #F98012 */
```

#### `.card-hover` — Utilitaire hover générique
```html
<div class="card-hover" style="border: 1px solid var(--border);">...</div>
```

---

## 🏷️ Badges

| Classe | Apparence | Usage |
|---|---|---|
| `.badge-pill` | Orange plein, texte blanc | Étiquettes CTA, "POPULAIRE" |
| `.badge-orange` | Orange plein | Scores, NCLC |
| `.badge-score-good` | Fond orange clair, texte orange | Scores corrects |
| `.filter-tab` | Gris → orange hover | Onglets filtres (non actif) |
| `.filter-tab.active` | Orange plein | Onglet actif |
| `.payment-badge` | Fond semi-blanc → orange hover | Logos paiement footer |

---

## 🔗 Liens

#### `.nav-link` — Liens navbar (fond navy)
```css
color: white; /* hover → color: #F98012; background: rgba(249,128,18,0.1) */
```
```html
<a class="nav-link active">Formations</a>
<a class="nav-link">Tarifs</a>
```

#### `.footer-link` — Liens footer (fond navy)
```css
color: white; /* hover → color: #F98012 */
```

#### Barre épreuves navbar
```css
.epreuve-bar-btn:hover { color: #F98012 !important; }
/* Barre centrée avec justifyContent: 'center' */
```

---

## 📊 Barres de progression

#### `.progress-track` / `.progress-fill` — Générique
```html
<div class="progress-track">
  <div class="progress-fill" style="width: 60%;"></div>
</div>
```

#### Interpolation couleur (JS — simulateurs)
Les barres de mots (EESimulatorPage) et le timer circulaire utilisent une **interpolation RGB** navy→orange :
```js
const t = 1 - progress  // 0 = début, 1 = fin
const r = Math.round(15 + (249 - 15) * t)   // navy.r → orange.r
const g = Math.round(61 + (128 - 61) * t)   // navy.g → orange.g
const b = Math.round(88 + (18  - 88) * t)   // navy.b → orange.b
const color = `rgb(${r},${g},${b})`
// Urgent (<5 min / dépassé) → '#ef4444' (rouge)
```

---

## 🔢 Éléments UI

#### `.avatar-circle` — Numéro circulaire navy
```html
<span class="avatar-circle">1</span>
```

#### `.gradient-text` — Dégradé navy→orange sur texte
```html
<h2 class="gradient-text">Calculateur NCLC</h2>
```

---

## 🧭 Navigation — Navbar

Structure à deux niveaux :
```
┌─────────────────────────────────────────────┐
│  Logo   │  Formations · Tarifs · NCLC · WA  │  Connexion · CTA  │  ← Barre principale
├─────────────────────────────────────────────┤
│    Accueil · CO · CE · EO · EE  (centré)   │  ← Barre épreuves
└─────────────────────────────────────────────┘
```

- Fond : `#0F3D58` (opaque) → `rgba(15,61,88,0.97)` + blur au scroll
- Liens : **blanc par défaut → orange au hover**
- Lien actif : `rgba(255,255,255,0.12)` background + blanc
- Barre épreuves : `rgba(10,48,70,0.6)` + **centrée**
- Bouton CTA "Commencer" : orange → turquoise hover

---

## 🦶 Footer

Structure 5 colonnes :
```
Brand + Contact | Épreuves TCF | Liens rapides | Nous suivre | Nous acceptons
```

- Fond : `var(--navy)` `#0F3D58`
- Tous les liens : **blanc par défaut → orange au hover**
- Badges paiement (Western Union, Ria…) : **hover orange**
- Copyright bas de page : turquoise `rgba(113,201,206,0.7)` → blanc hover

---

## 🎭 Animations

```css
@keyframes pulse   /* point clignotant orange (hero badge) */
@keyframes fadeUp  /* entrée page (opacity + translateY) */
.page-enter        /* animation fadeUp 0.3s */
```

---

## ⚠️ Règles importantes

1. **Ne jamais utiliser** `#1A5276`, `#2E86C1`, `#154360` — remplacés par `#0F3D58`
2. **Ne jamais utiliser** `bg-blue-500`, `amber-*`, `emerald-*` dans les nouveaux composants
3. **Tailwind hover arbitraire** (`hover:bg-[#F98012]`) est **peu fiable** en v4 — toujours préférer **inline styles + onMouseEnter/onMouseLeave** pour les effets hover complexes
4. **Transitions** : toujours `0.3s ease` (boutons) ou `0.2s ease` (filtres/liens)
5. **Border-radius** : `999px` pour les CTA principaux, `8-14px` pour les filtres, `16-20px` pour les cartes
6. **Implémentation hover** : utiliser les classes CSS pour les patterns simples, `onMouseEnter/onMouseLeave` pour les états qui dépendent d'une prop (ex: bouton actif vs inactif)

---

## 📁 Fichiers clés

| Fichier | Rôle |
|---|---|
| `src/styles/design-system.css` | Tokens CSS + toutes les classes utilitaires |
| `src/components/layout/Navbar.jsx` | Navigation principale + barre épreuves |
| `src/components/layout/Footer.jsx` | Pied de page 5 colonnes |
| `src/pages/HomePage.jsx` | Landing page — référence visuelle complète |

---

*Design System v6 · Formation TCF Canada · Mis à jour le 05/05/2026*
