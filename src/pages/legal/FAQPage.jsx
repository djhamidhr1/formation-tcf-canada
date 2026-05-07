import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle, Leaf, Monitor, CreditCard, Bot, Settings, Mail } from 'lucide-react'

const CATEGORIES = [
  {
    label: 'Le TCF Canada',
    Icon: Leaf,
    color: 'red',
    questions: [
      {
        q: 'Qu\'est-ce que le TCF Canada ?',
        a: 'Le TCF Canada (Test de Connaissance du Français) est un examen de langue française reconnu par Immigration, Réfugiés et Citoyenneté Canada (IRCC). Il évalue votre niveau de français sur 4 compétences : Compréhension Écrite (CE), Compréhension Orale (CO), Expression Écrite (EE) et Expression Orale (EO).',
      },
      {
        q: 'Quelle est la différence entre le TCF Canada et le TCF Québec ?',
        a: 'Le TCF Canada est utilisé pour les demandes d\'immigration fédérale (Express Entry, etc.). Le TCF Québec est spécifique au Programme des Travailleurs Qualifiés du Québec (PTQQ). Notre plateforme couvre les deux examens, car ils partagent le même format.',
      },
      {
        q: 'Quels scores NCLC sont exigés pour immigrer ?',
        a: 'Pour Express Entry (catégorie Expérience Canadienne ou TQF), il faut généralement NCLC 7 ou 9 selon la profession. Pour le PNP québécois, les exigences varient selon le programme. Notre calculateur NCLC vous aide à connaître votre niveau en temps réel.',
      },
      {
        q: 'Combien de temps dure le TCF Canada ?',
        a: 'Compréhension Écrite : 60 minutes (39 questions)\nCompréhension Orale : 35 minutes (39 questions)\nExpression Écrite : 60 minutes (3 tâches)\nExpression Orale : 12 minutes (3 tâches)\n\nTotal approximatif : 2h45 à 3h selon les centres.',
      },
    ],
  },
  {
    label: 'Notre plateforme',
    Icon: Monitor,
    color: 'blue',
    questions: [
      {
        q: 'Comment fonctionne la plateforme Formation TCF Canada ?',
        a: 'Notre plateforme propose des simulations complètes des 4 épreuves du TCF Canada. Vous pouvez vous entraîner sur 39 à 40 séries de questions authentiques, écouter des audios réels pour le CO, rédiger des textes corrigés par IA pour l\'EE, et simuler l\'EO avec enregistrement audio.',
      },
      {
        q: 'Le contenu est-il à jour avec le format officiel du TCF ?',
        a: 'Oui. Nos exercices sont régulièrement mis à jour pour correspondre au format officiel du TCF Canada. Les questions sont classées par niveau CECRL (A1 à C2) avec le barème officiel en points.',
      },
      {
        q: 'Puis-je utiliser la plateforme sur mobile ?',
        a: 'Oui, la plateforme est entièrement responsive. Cependant, pour les épreuves d\'Expression Écrite et Orale, nous recommandons un ordinateur pour une meilleure expérience de saisie et d\'enregistrement.',
      },
      {
        q: 'Mes résultats sont-ils sauvegardés ?',
        a: 'Oui, si vous êtes connecté à votre compte, tous vos résultats (scores, réponses, progression) sont automatiquement sauvegardés dans votre tableau de bord personnel.',
      },
    ],
  },
  {
    label: 'Abonnements & paiements',
    Icon: CreditCard,
    color: 'purple',
    questions: [
      {
        q: 'Quelle est la différence entre les plans Silver, Gold et Zoom ?',
        a: 'Plan Gratuit : accès limité aux premières séries de chaque épreuve.\nPlan Silver : accès complet CE + CO (40 séries chacune).\nPlan Gold : accès complet à toutes les épreuves + corrections IA pour l\'EE.\nPlan Zoom : tout Gold + séances de coaching personnalisées en visioconférence avec Hamid.',
      },
      {
        q: 'Comment annuler mon abonnement ?',
        a: 'Vous pouvez annuler à tout moment depuis votre espace "Mon Compte" → section Abonnement. L\'annulation prend effet à la fin de la période en cours. Vous conservez l\'accès jusqu\'à l\'expiration.',
      },
      {
        q: 'Les paiements sont-ils sécurisés ?',
        a: 'Oui. Tous les paiements sont traités par Stripe, leader mondial du paiement en ligne, certifié PCI DSS niveau 1. Nous ne stockons jamais vos données bancaires sur nos serveurs.',
      },
      {
        q: 'Y a-t-il une période d\'essai gratuite ?',
        a: 'Oui. Le plan gratuit vous donne accès aux premières séries de chaque épreuve sans limite de temps. Aucune carte bancaire requise pour commencer.',
      },
    ],
  },
  {
    label: 'Expression Écrite (IA)',
    Icon: Bot,
    color: 'green',
    questions: [
      {
        q: 'Comment fonctionne la correction IA de l\'Expression Écrite ?',
        a: 'Après avoir soumis votre rédaction pour les 3 tâches EE, notre système envoie votre texte à un modèle IA (Claude d\'Anthropic) qui l\'évalue selon les critères officiels du TCF : cohérence, lexique, grammaire, capacité à accomplir la tâche. Vous recevez un score /20 et des commentaires détaillés.',
      },
      {
        q: 'La correction IA est-elle fiable ?',
        a: 'Notre IA est calibrée sur les critères officiels du TCF Canada. Les résultats sont très proches des évaluateurs humains pour des textes standards. Cependant, comme tout outil automatisé, elle n\'est pas infaillible. Pour une préparation optimale, nous recommandons de combiner la correction IA avec les formations Zoom.',
      },
    ],
  },
  {
    label: 'Compte & technique',
    Icon: Settings,
    color: 'gray',
    questions: [
      {
        q: 'J\'ai oublié mon mot de passe, que faire ?',
        a: 'Cliquez sur "Connexion" dans la barre de navigation, puis sur "Mot de passe oublié ?". Entrez votre email et vous recevrez un lien de réinitialisation dans les 5 minutes. Vérifiez vos spams si vous ne le trouvez pas.',
      },
      {
        q: 'Comment supprimer mon compte ?',
        a: 'Envoyez un email à hamid@formation-tcf.com avec votre demande de suppression. Nous traiterons votre demande dans les 48 heures et supprimerons toutes vos données conformément à la LPRPDE.',
      },
      {
        q: 'La plateforme ne fonctionne pas, que faire ?',
        a: 'Essayez dans cet ordre :\n1. Videz le cache de votre navigateur (Ctrl+Shift+R)\n2. Utilisez un navigateur récent (Chrome, Firefox, Edge)\n3. Désactivez les extensions de navigateur\n4. Contactez-nous via WhatsApp si le problème persiste',
      },
    ],
  },
]

const COLOR_STYLES = {
  red:    { badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  blue:   { badge: 'bg-[#FDF2E9] text-[#0F3D58]', dot: 'bg-[#0F3D58]' },
  purple: { badge: 'bg-[#FDF2E9] text-[#0F3D58]', dot: 'bg-[#F98012]' },
  green:  { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  gray:   { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border border-gray-100 rounded-xl overflow-hidden transition-all ${open ? 'shadow-sm' : ''}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors gap-3">
        <span className="text-sm font-semibold text-gray-800 leading-snug">{q}</span>
        {open ? <ChevronUp size={16} className="text-[#FDF2E9]0 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const allQuestions = CATEGORIES.flatMap(c => c.questions.map(q => ({ ...q, cat: c.label })))
  const filtered = search
    ? allQuestions.filter(q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase()))
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D58] to-[#164b6b] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Foire aux questions</h1>
          <p className="text-[#e8f7f8] text-sm mb-6">Toutes les réponses à vos questions sur le TCF Canada et notre plateforme</p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Chercher une question..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Search results */}
        {search && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 font-semibold">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour "{search}"</p>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <p className="text-gray-400 text-sm">Aucune question trouvée.</p>
                <button onClick={() => setSearch('')} className="mt-3 text-sm text-[#0F3D58] font-semibold hover:underline">Effacer la recherche</button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                {filtered.map((item, i) => <FAQItem key={i} {...item} />)}
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        {!search && CATEGORIES.map(({ label, Icon: CatIcon, color, questions }) => {
          const styles = COLOR_STYLES[color]
          return (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Category header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <CatIcon size={20} className="text-gray-600 shrink-0" />
                <h2 className="font-extrabold text-gray-900">{label}</h2>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${styles.badge}`}>
                  {questions.length} question{questions.length !== 1 ? 's' : ''}
                </span>
              </div>
              {/* Questions */}
              <div className="divide-y divide-gray-50 px-2 py-2 space-y-1">
                {questions.map((item, i) => <FAQItem key={i} {...item} />)}
              </div>
            </div>
          )
        })}

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#0F3D58] to-[#164b6b] rounded-2xl p-6 text-white text-center">
          <MessageCircle size={28} className="mx-auto mb-3 opacity-80" />
          <h3 className="font-extrabold text-lg mb-1">Vous n'avez pas trouvé votre réponse ?</h3>
          <p className="text-[#e8f7f8] text-sm mb-4">Notre équipe répond en moins de 24h</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/15147467431?text=Bonjour, j'ai une question sur la formation TCF Canada"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm no-underline transition-colors">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href="mailto:hamid@formation-tcf.com?subject=Question sur la plateforme TCF Canada"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0F3D58] font-bold px-5 py-2.5 rounded-xl text-sm no-underline hover:bg-[#FDF2E9] transition-colors">
              <Mail size={16} /> Email
            </a>
          </div>
        </div>

        {/* Back */}
        <div className="flex items-center justify-center gap-4 py-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-[#0F3D58] no-underline transition-colors">← Accueil</Link>
          <span>·</span>
          <Link to="/confidentialite" className="hover:text-[#0F3D58] no-underline transition-colors">Confidentialité</Link>
          <span>·</span>
          <Link to="/conditions" className="hover:text-[#0F3D58] no-underline transition-colors">Conditions</Link>
        </div>
      </div>
    </div>
  )
}
