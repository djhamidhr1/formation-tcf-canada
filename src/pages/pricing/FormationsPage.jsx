import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Standard',
    price: 149.99,
    duration: '15 jours',
    seances: 6,
    credits: 20,
    popular: false,
    features: [
      '6 séances Zoom en direct',
      '20 crédits correction IA Expression Écrite',
      'Accès plateforme 15 jours',
      'Support WhatsApp',
    ],
  },
  {
    name: 'Premium',
    price: 199.99,
    duration: '30 jours',
    seances: 8,
    credits: 20,
    popular: true,
    features: [
      '8 séances Zoom en direct',
      '20 crédits correction IA Expression Écrite',
      'Accès plateforme 30 jours',
      'Support WhatsApp prioritaire',
      'Matériel pédagogique inclus',
    ],
  },
  {
    name: 'Platinium',
    price: 249.99,
    duration: '60 jours',
    seances: 10,
    credits: 30,
    popular: false,
    features: [
      '10 séances Zoom en direct',
      '30 crédits correction IA Expression Écrite',
      'Accès plateforme 60 jours',
      'Support WhatsApp illimité',
      'Matériel pédagogique premium',
      'Séance individuelle de bilan',
    ],
  },
]

const STEPS = [
  { n: 1, title: 'Choisissez votre formule', desc: 'Sélectionnez le plan adapté à vos besoins et votre date d\'examen.' },
  { n: 2, title: 'Effectuez le paiement', desc: 'Paiement sécurisé via WhatsApp ou virement bancaire.' },
  { n: 3, title: 'Nous vous contactons sous 24h', desc: 'Notre équipe vous confirme votre inscription par message.' },
  { n: 4, title: 'Planifiez vos séances Zoom', desc: 'Choisissez vos créneaux parmi les disponibilités proposées.' },
  { n: 5, title: 'Préparez-vous avec confiance', desc: 'Progressez rapidement avec un formateur expérimenté.' },
]

function getWhatsAppUrl(plan) {
  const text = encodeURIComponent(`Bonjour, je souhaite m'inscrire à la formation ${plan} TCF Canada`)
  return `https://wa.me/15147467431?text=${text}`
}

export default function FormationsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
          🎥 Formations en Direct sur Zoom
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Atteignez votre objectif TCF Canada
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Des formations personnalisées en direct sur Zoom avec des formateurs experts, adaptées à votre niveau et à votre calendrier.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col ${
              plan.popular ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200 shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  BEST SELLER
                </span>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-xl font-extrabold text-gray-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-extrabold text-gray-900">{plan.price}$</span>
                <span className="text-gray-500 text-sm">/ {plan.duration}</span>
              </div>
            </div>

            <div className="flex gap-4 mb-5 text-center">
              <div className="flex-1 bg-blue-50 rounded-xl py-3">
                <div className="text-2xl font-extrabold text-blue-700">{plan.seances}</div>
                <div className="text-xs text-blue-600">séances Zoom</div>
              </div>
              <div className="flex-1 bg-purple-50 rounded-xl py-3">
                <div className="text-2xl font-extrabold text-purple-700">{plan.credits}</div>
                <div className="text-xs text-purple-600">crédits IA</div>
              </div>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <a
              href={getWhatsAppUrl(plan.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={`block text-center font-bold py-3.5 rounded-xl text-sm no-underline transition-colors ${
                plan.popular
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              S'inscrire via WhatsApp →
            </a>
          </div>
        ))}
      </div>

      {/* Workflow stepper */}
      <div className="mb-16">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">Comment ça marche ?</h2>
        <div className="relative">
          {/* Line */}
          <div className="hidden md:block absolute top-6 left-6 right-6 h-0.5 bg-blue-100" />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STEPS.map(step => (
              <div key={step.n} className="relative flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-extrabold mb-3 shrink-0 relative z-10 shadow-md">
                  {step.n}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor profile */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shrink-0 font-bold">
          H
        </div>
        <div>
          <h3 className="text-xl font-extrabold mb-1">Hamid</h3>
          <p className="text-slate-300 text-sm mb-4">Formateur certifié TCF Canada</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { val: '5 ans', label: "d'expérience" },
              { val: '25 000+', label: 'candidats formés' },
              { val: '95%', label: 'de réussite' },
            ].map(stat => (
              <div key={stat.label} className="text-center bg-white/10 rounded-xl py-3">
                <div className="text-xl font-extrabold">{stat.val}</div>
                <div className="text-xs text-slate-300 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-green-50 border border-green-200 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Une question ? Contactez-nous directement</h2>
        <p className="text-gray-500 text-sm mb-5">Réponse garantie sous 24h</p>
        <a
          href="https://wa.me/15147467431?text=Bonjour%2C+j%27ai+une+question+sur+les+formations+TCF+Canada"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3.5 rounded-xl no-underline transition-colors shadow-md"
        >
          💬 WhatsApp — +1 514 746-7431
        </a>
      </div>
    </div>
  )
}
