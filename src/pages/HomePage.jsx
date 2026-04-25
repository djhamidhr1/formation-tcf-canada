import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../services/supabase'
import { TrendingUp, Brain, Calendar, Users, Clock, Shield } from 'lucide-react'
import HeroPremium from '../components/premium/HeroPremium'
import EpreuveCard3D from '../components/premium/EpreuveCard3D'
import AvantageCard from '../components/premium/AvantageCard'
import FounderSection from '../components/premium/FounderSection'
import PricingCardPremium from '../components/premium/PricingCardPremium'
import NclcCalculatorSection from '../components/premium/NclcCalculatorSection'
import FAQSection from '../components/premium/FAQSection'
import ContactSection from '../components/premium/ContactSection'

const EPREUVES = [
  { path: '/epreuve/comprehension-orale', icon: '🎧', label: 'Compréhension Orale', desc: 'Écoutez des documents audio variés', details: '39 questions · 35 min', color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50', border: 'border-blue-200' },
  { path: '/epreuve/comprehension-ecrite', icon: '📖', label: 'Compréhension Écrite', desc: 'Lisez des textes variés et authentiques', details: '39 questions · 60 min', color: 'from-green-600 to-green-400', bg: 'bg-green-50', border: 'border-green-200' },
  { path: '/epreuve/expression-orale', icon: '🎤', label: 'Expression Orale', desc: 'Exprimez-vous sur des sujets variés', details: '3 tâches · 12 min', color: 'from-yellow-600 to-yellow-400', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { path: '/epreuve/expression-ecrite', icon: '✍️', label: 'Expression Écrite', desc: 'Rédigez des textes structurés en 3 tâches', details: '3 tâches · 60 min', color: 'from-purple-600 to-purple-400', bg: 'bg-purple-50', border: 'border-purple-200' },
]

const AVANTAGES = [
  { icon: <TrendingUp size={28} />, title: 'Suivi de Progression', desc: 'Performances en temps réel' },
  { icon: <Brain size={28} />, title: 'Simulateur IA', desc: 'Correction automatique Expression Écrite' },
  { icon: <Calendar size={28} />, title: 'Version 2026', desc: 'Contenus mis à jour avec derniers sujets' },
  { icon: <Users size={28} />, title: 'Accompagnement', desc: 'Formateurs certifiés FLE' },
  { icon: <Shield size={28} />, title: 'Conditions Réelles', desc: 'Simulation exacte officielle TCF' },
  { icon: <Clock size={28} />, title: 'Accès 24/7', desc: 'Réviser à tout moment, partout' },
]

const PRICING = [
  { name: 'Bronze', price: 14.99, days: 5, credits: 3, popular: false },
  { name: 'Silver', price: 29.99, days: 30, credits: 8, popular: true },
  { name: 'Gold', price: 49.99, days: 60, credits: 15, popular: false },
]

export default function HomePage() {
  const [stats, setStats] = useState({ seriesCE: 39, seriesCO: 10, questionsCE: 1521, questionsCO: 390, combinaisonsEE: 326, sujetsEO: 2855 })

  useEffect(() => {
    Promise.all([
      supabase.from('series_ce').select('id', { count: 'exact', head: true }),
      supabase.from('series_co').select('id', { count: 'exact', head: true }),
      supabase.from('questions_ce').select('id', { count: 'exact', head: true }),
      supabase.from('questions_co').select('id', { count: 'exact', head: true }),
      supabase.from('combinaisons_ee').select('id', { count: 'exact', head: true }),
      supabase.from('sujets_eo').select('id', { count: 'exact', head: true }),
    ]).then(([sce, sco, qce, qco, ee, eo]) => {
      setStats({
        seriesCE: sce.count || 39,
        seriesCO: sco.count || 10,
        questionsCE: qce.count || 1521,
        questionsCO: qco.count || 390,
        combinaisonsEE: ee.count || 326,
        sujetsEO: eo.count || 2855,
      })
    })
  }, [])

  return (
    <div>
      {/* Hero Premium */}
      <HeroPremium stats={stats} />

      {/* 4 Épreuves Premium */}
      <section className="relative max-w-7xl mx-auto px-4 py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4 gradient-text">
            Les 4 Épreuves TCF
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Préparez-vous à chaque compétence avec des exercices authentiques et une correction IA instantanée
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
          {EPREUVES.map((ep, i) => (
            <EpreuveCard3D key={ep.path} epreuve={ep} index={i} />
          ))}
        </div>
      </section>

      {/* Avantages Premium */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background avec gradient mesh subtle */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(at 20% 30%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
              linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4 gradient-text">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme conçue par des experts pour maximiser vos chances de réussite
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVANTAGES.map((a, i) => (
              <AvantageCard key={i} icon={a.icon} title={a.title} desc={a.desc} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Fondateur Premium */}
      <FounderSection />

      {/* Pricing Premium */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(at 30% 20%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
              radial-gradient(at 70% 80%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
              linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)
            `,
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4 gradient-text">
              Nos Forfaits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le forfait adapté à vos objectifs et commencez votre préparation dès aujourd'hui
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {PRICING.map((p, i) => (
              <PricingCardPremium key={p.name} plan={p} index={i} />
            ))}
          </div>

          {/* CTA voir toutes les offres */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <Link
              to="/tarifs"
              className="inline-flex items-center gap-2 text-primary-electric font-bold text-lg hover:gap-3 transition-all"
            >
              Voir toutes les offres et détails
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Calculateur NCLC Premium */}
      <NclcCalculatorSection />

      {/* FAQ Premium */}
      <FAQSection />

      {/* Contact Premium */}
      <ContactSection />
    </div>
  )
}
