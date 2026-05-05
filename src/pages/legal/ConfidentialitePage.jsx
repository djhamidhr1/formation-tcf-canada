import { Link } from 'react-router-dom'
import { Shield, Lock, Eye, Database, Mail, MapPin } from 'lucide-react'

const SECTIONS = [
  {
    icon: Database,
    title: 'Données collectées',
    color: 'blue',
    content: `Nous collectons uniquement les informations nécessaires au fonctionnement de la plateforme :
• Nom complet et adresse email (lors de l'inscription)
• Résultats de vos exercices et simulations (scores, réponses)
• Informations de paiement traitées par Stripe (nous ne stockons pas vos données bancaires)
• Données de navigation anonymisées (pages visitées, temps passé)`,
  },
  {
    icon: Eye,
    title: 'Utilisation des données',
    color: 'purple',
    content: `Vos données sont utilisées exclusivement pour :
• Vous fournir un accès personnalisé à la plateforme
• Calculer et afficher votre progression et vos scores
• Vous envoyer des notifications importantes (confirmation d'email, renouvellement d'abonnement)
• Améliorer la qualité de nos exercices et services
• Aucune donnée n'est vendue à des tiers`,
  },
  {
    icon: Lock,
    title: 'Sécurité & stockage',
    color: 'green',
    content: `Vos données sont protégées par :
• Chiffrement SSL/TLS en transit (HTTPS)
• Base de données Supabase hébergée sur des serveurs sécurisés (AWS Canada)
• Authentification sécurisée via Supabase Auth
• Accès restreint aux seuls administrateurs autorisés
• Mots de passe jamais stockés en clair (hachage bcrypt)`,
  },
  {
    icon: Shield,
    title: 'Vos droits (LPRPDE / RGPD)',
    color: 'orange',
    content: `Conformément aux lois canadiennes (LPRPDE) et européennes (RGPD), vous avez le droit de :
• Accéder à vos données personnelles (demande par email)
• Rectifier des informations inexactes
• Supprimer votre compte et toutes vos données
• Retirer votre consentement à tout moment
• Déposer une plainte auprès de l'autorité compétente

Pour exercer ces droits : hamid@formation-tcf.com`,
  },
  {
    icon: Mail,
    title: 'Cookies',
    color: 'red',
    content: `Nous utilisons des cookies essentiels uniquement :
• Session d'authentification (cookie de connexion)
• Préférences de langue et d'affichage
Nous n'utilisons pas de cookies publicitaires ou de tracking tiers.`,
  },
]

const COLOR = {
  blue:   'bg-blue-50 text-blue-600 border-blue-200',
  purple: 'bg-blue-50 text-blue-600 border-blue-200',
  green:  'bg-green-50 text-green-600 border-green-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  red:    'bg-red-50 text-red-600 border-red-200',
}

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D58] to-[#164b6b] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Politique de confidentialité</h1>
          <p className="text-blue-200 text-sm">Dernière mise à jour : Avril 2026 · Formation TCF Canada</p>
        </div>
      </div>

      {/* Intro banner */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
          <Lock size={20} className="text-[#0F3D58] shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Formation TCF Canada, basée à <strong>Montréal, Québec, Canada</strong>, s'engage à protéger vos données personnelles.
            Cette politique explique quelles données nous collectons, comment nous les utilisons et vos droits en tant qu'utilisateur.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        {SECTIONS.map(({ icon: Icon, title, color, content }, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 flex items-center gap-3 border-b border-gray-100">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${COLOR[color]}`}>
                <Icon size={18} />
              </div>
              <h2 className="font-extrabold text-gray-900">{title}</h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{content}</p>
            </div>
          </div>
        ))}

        {/* Contact */}
        <div className="bg-[#0F3D58] rounded-2xl p-6 text-white text-center">
          <MapPin size={24} className="mx-auto mb-2 opacity-80" />
          <p className="font-extrabold text-lg mb-1">Nous contacter</p>
          <p className="text-blue-200 text-sm mb-3">Pour toute question relative à vos données personnelles</p>
          <a href="mailto:hamid@formation-tcf.com"
            className="inline-block bg-white text-[#0F3D58] font-bold px-6 py-2.5 rounded-xl text-sm no-underline hover:bg-blue-50 transition-colors">
            hamid@formation-tcf.com
          </a>
        </div>

        {/* Back */}
        <div className="flex items-center justify-center gap-4 py-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-[#0F3D58] no-underline transition-colors">← Accueil</Link>
          <span>·</span>
          <Link to="/conditions" className="hover:text-[#0F3D58] no-underline transition-colors">Conditions d'utilisation</Link>
          <span>·</span>
          <Link to="/faq" className="hover:text-[#0F3D58] no-underline transition-colors">FAQ</Link>
        </div>
      </div>
    </div>
  )
}
