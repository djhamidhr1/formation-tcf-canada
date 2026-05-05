import { Link } from 'react-router-dom'
import { FileText, CheckCircle, XCircle, CreditCard, BookOpen, AlertTriangle, Scale } from 'lucide-react'

const SECTIONS = [
  {
    icon: CheckCircle,
    title: 'Acceptation des conditions',
    color: 'green',
    content: `En créant un compte ou en utilisant la plateforme Formation TCF Canada, vous acceptez sans réserve les présentes conditions d'utilisation.

Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
Ces conditions peuvent être mises à jour à tout moment. Vous serez notifié par email en cas de modifications importantes.`,
  },
  {
    icon: BookOpen,
    title: 'Description du service',
    color: 'blue',
    content: `Formation TCF Canada propose :
• Des exercices de préparation au TCF Canada et TCF Québec (CE, CO, EE, EO)
• Des simulations d'examens avec correction automatisée par IA
• Un calculateur de scores NCLC
• Des formations personnalisées en visioconférence (Zoom)
• Des ressources pédagogiques actualisées régulièrement

Le service est disponible en version gratuite (accès limité) et en abonnement payant (Silver, Gold, Zoom).`,
  },
  {
    icon: CreditCard,
    title: 'Abonnements & paiements',
    color: 'purple',
    content: `• Les paiements sont traités de manière sécurisée via Stripe
• Les abonnements sont renouvelés automatiquement sauf résiliation
• Vous pouvez annuler à tout moment depuis votre espace "Mon Compte"
• Aucun remboursement n'est accordé après utilisation du service
• Les prix sont affichés en dollars canadiens (CAD) et incluent les taxes applicables
• En cas de problème de paiement, votre accès sera suspendu temporairement`,
  },
  {
    icon: XCircle,
    title: 'Utilisation interdite',
    color: 'red',
    content: `Il est strictement interdit de :
• Partager vos identifiants de connexion avec d'autres personnes
• Reproduire, copier ou distribuer nos contenus sans autorisation écrite
• Utiliser des robots ou scripts pour accéder automatiquement à la plateforme
• Tenter de contourner les mesures de sécurité
• Soumettre des contenus illicites, offensants ou trompeurs
• Créer plusieurs comptes pour bénéficier frauduleusement de la période d'essai`,
  },
  {
    icon: AlertTriangle,
    title: 'Limitation de responsabilité',
    color: 'orange',
    content: `Formation TCF Canada s'engage à fournir un service de qualité, cependant :
• Les scores obtenus sur notre plateforme sont indicatifs et ne garantissent pas les résultats à l'examen officiel
• Nous ne sommes pas affiliés à France Éducation International (FEI), organisateur officiel du TCF
• En cas d'interruption temporaire du service (maintenance), aucun remboursement ne sera accordé pour des périodes inférieures à 48h
• Notre responsabilité est limitée au montant de l'abonnement en cours`,
  },
  {
    icon: Scale,
    title: 'Droit applicable',
    color: 'gray',
    content: `Ces conditions sont régies par les lois de la province de Québec et les lois fédérales du Canada.
Tout litige sera soumis à la juridiction exclusive des tribunaux de Montréal, Québec.

Pour toute question : hamid@formation-tcf.com
Formation TCF Canada · Montréal, Québec, Canada`,
  },
]

const COLOR = {
  green:  'bg-green-50 text-green-600 border-green-200',
  blue:   'bg-blue-50 text-blue-600 border-blue-200',
  purple: 'bg-blue-50 text-blue-600 border-blue-200',
  red:    'bg-red-50 text-red-600 border-red-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  gray:   'bg-gray-50 text-gray-600 border-gray-200',
}

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D58] to-[#164b6b] text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold mb-2">Conditions d'utilisation</h1>
          <p className="text-blue-200 text-sm">Dernière mise à jour : Avril 2026 · Formation TCF Canada</p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-3xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
          <Scale size={20} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 leading-relaxed">
            Veuillez lire attentivement ces conditions avant d'utiliser la plateforme.
            En vous inscrivant, vous acceptez d'être lié par ces conditions.
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

        {/* Back */}
        <div className="flex items-center justify-center gap-4 py-2 text-sm text-gray-400">
          <Link to="/" className="hover:text-blue-600 no-underline transition-colors">← Accueil</Link>
          <span>·</span>
          <Link to="/confidentialite" className="hover:text-blue-600 no-underline transition-colors">Confidentialité</Link>
          <span>·</span>
          <Link to="/faq" className="hover:text-blue-600 no-underline transition-colors">FAQ</Link>
        </div>
      </div>
    </div>
  )
}
