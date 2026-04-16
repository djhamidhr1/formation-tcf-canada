import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const REVISION_PLANS = [
  {
    name: 'Bronze',
    price: 14.99,
    duration: '5 jours',
    credits: 3,
    popular: false,
    features: [
      'Accès 5 jours aux 4 épreuves',
      '3 corrections IA Expression Écrite',
      'Suivi de progression',
      'Sujets Actualités 2026',
    ],
  },
  {
    name: 'Silver',
    price: 29.99,
    duration: '30 jours',
    credits: 8,
    popular: true,
    features: [
      'Accès 30 jours aux 4 épreuves',
      '8 corrections IA Expression Écrite',
      'Suivi de progression avancé',
      'Sujets Actualités 2026',
      'Support prioritaire WhatsApp',
    ],
  },
  {
    name: 'Gold',
    price: 49.99,
    duration: '60 jours',
    credits: 15,
    popular: false,
    features: [
      'Accès 60 jours aux 4 épreuves',
      '15 corrections IA Expression Écrite',
      'Suivi de progression avancé',
      'Sujets Actualités 2026',
      'Support prioritaire WhatsApp',
      'Accès aux nouvelles séries en avant-première',
    ],
  },
]

const ZOOM_PLANS = [
  {
    name: 'Standard Zoom',
    price: 149.99,
    duration: '15 jours',
    sessions: 6,
    credits: 20,
    popular: false,
    features: [
      'Accès 15 jours à la plateforme',
      '6 séances Zoom avec formateur',
      '20 corrections IA Expression Écrite',
      'Suivi personnalisé',
    ],
  },
  {
    name: 'Premium Zoom',
    price: 199.99,
    duration: '30 jours',
    sessions: 8,
    credits: 20,
    popular: true,
    features: [
      'Accès 30 jours à la plateforme',
      '8 séances Zoom avec formateur',
      '20 corrections IA Expression Écrite',
      'Suivi personnalisé intensif',
      'Accès groupe WhatsApp premium',
    ],
  },
  {
    name: 'Platinium Zoom',
    price: 249.99,
    duration: '60 jours',
    sessions: 10,
    credits: 30,
    popular: false,
    features: [
      'Accès 60 jours à la plateforme',
      '10 séances Zoom avec formateur',
      '30 corrections IA Expression Écrite',
      'Suivi personnalisé complet',
      'Accès groupe WhatsApp premium',
      'Simulations d\'examen blanc',
    ],
  },
]

const EE_PLANS = [
  { name: 'EE Standard', price: 14.99, duration: '30 jours', credits: 5, popular: false },
  { name: 'EE Performance', price: 29.99, duration: '60 jours', credits: 15, popular: true },
  { name: 'EE Pro', price: 49.99, duration: '90 jours', credits: 30, popular: false },
]

const LOCAL_METHODS = [
  { country: '🇩🇿 Algérie', methods: 'Baridi Mob, CCP, BaridiMob', msg: 'Pack Silver via Baridi Mob' },
  { country: '🇲🇦 Maroc', methods: 'CashPlus, Inwi Money, M2T', msg: 'Pack Silver via CashPlus' },
  { country: '🌍 Afrique de l\'Ouest', methods: 'Orange Money, Wave, MTN', msg: 'Pack Silver via Orange Money' },
]

const FAQ = [
  { q: 'Les séances Zoom sont-elles en groupe ou individuelles ?', a: 'Les séances peuvent être organisées en petit groupe (2-3 personnes) ou en individuel selon votre préférence et disponibilité.' },
  { q: 'Puis-je changer de forfait en cours de route ?', a: 'Oui, vous pouvez upgrader à tout moment. La différence de prix sera calculée au prorata des jours restants.' },
  { q: 'Que se passe-t-il si je rate une séance Zoom ?', a: 'Chaque séance manquée peut être reprogrammée sous 48h. Au-delà, elle est considérée comme utilisée.' },
  { q: 'Comment fonctionnent les paiements locaux ?', a: 'Contactez-nous sur WhatsApp avec le nom du forfait souhaité. Nous vous communiquerons les coordonnées de paiement. L\'accès est activé dans les 30 minutes après confirmation.' },
  { q: 'Y a-t-il une garantie de remboursement ?', a: 'Oui, remboursement intégral sous 24h si vous n\'avez pas encore utilisé de correction IA et n\'avez pas participé à une séance Zoom.' },
]

function PlanCard({ plan, color = '#1A5276', showCredits = true }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm relative ${plan.popular ? 'ring-2 ring-[#1A5276] scale-105' : 'border border-gray-100'}`}>
      {plan.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1A5276] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
          ⭐ POPULAIRE
        </div>
      )}
      <h3 className="text-lg font-extrabold text-gray-900 mb-1">{plan.name}</h3>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-4xl font-extrabold" style={{ color }}>${plan.price}</span>
        <span className="text-gray-400 text-sm">USD</span>
      </div>
      <div className="text-gray-500 text-sm mb-4">Accès {plan.duration}</div>

      <ul className="space-y-2.5 mb-6">
        {(plan.features || [
          `Accès ${plan.duration} à la plateforme`,
          showCredits && plan.credits > 0 ? `${plan.credits} corrections IA Expression Écrite` : null,
          'Suivi de progression',
          'Sujets Actualités 2026',
        ].filter(Boolean)).map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
            <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <a
        href={`https://wa.me/15062536067?text=Bonjour%2C+je+souhaite+souscrire+au+Pack+${encodeURIComponent(plan.name)}`}
        target="_blank" rel="noreferrer"
        className="block w-full bg-[#1A5276] hover:bg-[#154360] text-white text-center py-3 rounded-xl font-bold text-sm no-underline transition-colors"
      >
        Choisir {plan.name} →
      </a>
    </div>
  )
}

export default function PricingPage() {
  const [tab, setTab] = useState('revision')
  const [faqOpen, setFaqOpen] = useState(null)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A5276] to-[#2E86C1] text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-3">Nos Forfaits</h1>
        <p className="text-blue-100 text-lg max-w-xl mx-auto">
          Commencez gratuitement. Upgradez quand vous le souhaitez. Annulez à tout moment.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-1.5 text-sm">
          ✅ Accès gratuit aux séries CE/CO et aux sujets EO
        </div>
      </section>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
            {[
              ['revision', '📚 Packs Révision'],
              ['zoom', '📹 Formations Zoom'],
              ['ee', '✍️ Simulateur IA uniquement'],
            ].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${tab === key ? 'bg-white shadow text-[#1A5276]' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {tab === 'revision' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {REVISION_PLANS.map(p => <PlanCard key={p.name} plan={p} />)}
          </div>
        )}

        {tab === 'zoom' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {ZOOM_PLANS.map(p => <PlanCard key={p.name} plan={p} color="#0e7490" />)}
          </div>
        )}

        {tab === 'ee' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-4xl mx-auto">
            {EE_PLANS.map(p => (
              <div key={p.name} className={`bg-white rounded-2xl p-6 shadow-sm relative ${p.popular ? 'ring-2 ring-purple-600 scale-105' : 'border border-gray-100'}`}>
                {p.popular && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">POPULAIRE</div>}
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">{p.name}</h3>
                <div className="text-3xl font-extrabold text-purple-700 mb-1">${p.price}</div>
                <div className="text-gray-500 text-sm mb-4">{p.duration} · {p.credits} corrections IA</div>
                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Check size={15} className="text-green-500" /> {p.credits} corrections IA Expression Écrite</li>
                  <li className="flex items-center gap-2"><Check size={15} className="text-green-500" /> Feedback détaillé par tâche</li>
                  <li className="flex items-center gap-2"><Check size={15} className="text-green-500" /> Note /20 + NCLC estimé</li>
                </ul>
                <a href={`https://wa.me/15062536067?text=Pack+${encodeURIComponent(p.name)}`} target="_blank" rel="noreferrer"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-xl font-bold text-sm no-underline transition-colors">
                  Choisir {p.name} →
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paiements locaux */}
      <section className="bg-amber-50 border-t border-b border-amber-200 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-2">💳 Paiements Locaux</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Payez depuis votre pays via mobile money ou virement local</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LOCAL_METHODS.map(m => (
              <div key={m.country} className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm">
                <div className="font-bold text-gray-900 mb-1">{m.country}</div>
                <div className="text-sm text-gray-500 mb-4">{m.methods}</div>
                <a
                  href={`https://wa.me/15062536067?text=Bonjour%2C+je+souhaite+payer+le+${encodeURIComponent(m.msg)}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm no-underline transition-colors"
                >
                  💬 Payer via WhatsApp
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">
            L'accès est activé dans les 30 minutes après confirmation du paiement — 7j/7 de 8h à 23h
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-8">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <button className="w-full px-5 py-4 text-left flex justify-between items-center text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                {item.q}
                <span className="text-[#1A5276] text-lg ml-3 shrink-0">{faqOpen === i ? '−' : '+'}</span>
              </button>
              {faqOpen === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[#1A5276] text-white py-14 px-4 text-center">
        <h2 className="text-2xl font-extrabold mb-3">Prêt à commencer ?</h2>
        <p className="text-blue-200 mb-6">L'accès aux séries CE/CO et sujets EO est totalement gratuit</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/inscription" className="bg-white text-[#1A5276] hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl no-underline transition-colors">
            Commencer gratuitement →
          </Link>
          <a href="https://wa.me/15062536067" target="_blank" rel="noreferrer"
            className="border-2 border-white/50 text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-xl no-underline transition-colors">
            💬 Contacter via WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
