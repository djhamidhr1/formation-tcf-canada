import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, Clock, FileText, Star, ArrowRight, BookOpen, Users, Volume2 } from 'lucide-react'

const features = [
  {
    icon: '💬',
    title: 'Prise de parole fluide',
    desc: 'Apprenez à structurer vos réponses orales de façon naturelle et cohérente.',
  },
  {
    icon: '🧠',
    title: 'Argumentation',
    desc: "Développez des arguments solides et défendez votre point de vue avec clarté.",
  },
  {
    icon: '🗣️',
    title: 'Prononciation',
    desc: 'Travaillez votre accent, intonation et clarté pour être parfaitement compris.',
  },
  {
    icon: '😌',
    title: 'Gestion du stress',
    desc: "Techniques pour rester calme et performant le jour de l'examen.",
  },
]

const navCards = [
  {
    icon: BookOpen,
    title: 'Méthodologie',
    desc: 'Stratégies et conseils pour chaque tâche de l\'épreuve',
    badge: 'Conseils',
    badgeColor: 'bg-yellow-100 text-yellow-800',
    path: '/epreuve/expression-orale/astuces',
    btnLabel: 'Voir la méthode',
    accent: 'border-yellow-400',
  },
  {
    icon: Users,
    title: "Sujets d'Actualités",
    desc: 'Entraînez-vous sur des sujets réels classés par mois et tâche',
    badge: '2 855 sujets',
    badgeColor: 'bg-amber-100 text-amber-800',
    path: '/epreuve/expression-orale/sujets-actualites',
    btnLabel: 'Voir les sujets',
    accent: 'border-amber-500',
  },
  {
    icon: Mic,
    title: 'Simulateur',
    desc: "Simulez l'épreuve complète avec enregistrement audio et timer",
    badge: 'Interactif',
    badgeColor: 'bg-orange-100 text-orange-800',
    path: '/epreuve/expression-orale/simulateur',
    btnLabel: 'Démarrer la simulation',
    accent: 'border-orange-500',
  },
]

const taskBreakdown = [
  { num: 'T1', label: 'Entretien dirigé', time: '1–2 min', pts: '3 pts', color: 'bg-yellow-100 text-yellow-800' },
  { num: 'T2', label: 'Interaction', time: '3 min 30 s', pts: '7 pts', color: 'bg-amber-100 text-amber-800' },
  { num: 'T3', label: 'Point de vue', time: '4 min 30 s', pts: '10 pts', color: 'bg-orange-100 text-orange-800' },
]

export default function EOHomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 text-4xl shadow-lg">
              🎤
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Expression Orale
            </h1>
            <p className="text-yellow-100 text-lg mb-6 max-w-xl mx-auto">
              Maîtrisez l'épreuve orale du TCF Canada avec nos simulateurs et sujets d'actualité
            </p>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Clock, label: '12 min' },
                { icon: FileText, label: '3 tâches' },
                { icon: Star, label: '20 pts' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold"
                >
                  <Icon size={15} />
                  {label}
                </span>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/epreuve/expression-orale/sujets-actualites')}
              className="inline-flex items-center gap-2 bg-white text-yellow-700 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              Voir les sujets <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        </div>

        {/* Wave */}
        <div className="relative h-12 overflow-hidden">
          <svg viewBox="0 0 1440 48" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,48 L0,24 Q360,0 720,24 Q1080,48 1440,24 L1440,48 Z" fill="#f9fafb" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">
        {/* Task breakdown */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Structure de l'épreuve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {taskBreakdown.map((t) => (
              <div key={t.num} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${t.color}`}>
                  {t.num}
                </span>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{t.label}</h3>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={13} />{t.time}</span>
                  <span className="flex items-center gap-1"><Star size={13} />{t.pts}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ce que vous allez travailler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Nav cards */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Commencer votre préparation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {navCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className={`bg-white rounded-2xl shadow-sm border-l-4 ${card.accent} p-6 hover:shadow-md transition-all group cursor-pointer`}
                  onClick={() => navigate(card.path)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-yellow-50 rounded-xl">
                      <Icon size={22} className="text-yellow-600" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{card.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{card.desc}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(card.path) }}
                    className="inline-flex items-center gap-2 text-yellow-700 font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    {card.btnLabel} <ArrowRight size={15} />
                  </button>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-3xl p-8 text-white text-center shadow-lg"
        >
          <Volume2 size={32} className="mx-auto mb-3 opacity-80" />
          <h3 className="text-2xl font-extrabold mb-2">Prêt à vous entraîner ?</h3>
          <p className="text-yellow-100 mb-6">
            Simulez l'épreuve complète avec timer et enregistrement audio.
          </p>
          <button
            onClick={() => navigate('/epreuve/expression-orale/simulateur')}
            className="inline-flex items-center gap-2 bg-white text-yellow-700 font-bold px-8 py-3 rounded-full shadow hover:shadow-lg transition-all hover:scale-105"
          >
            <Mic size={18} /> Démarrer le simulateur
          </button>
        </motion.div>
      </div>
    </div>
  )
}
