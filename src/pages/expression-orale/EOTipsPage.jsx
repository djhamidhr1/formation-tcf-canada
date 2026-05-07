import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Clock, Star, Target, BookOpen, Lightbulb, MessageSquare } from 'lucide-react'

const bareme = [
  { num: 'T1', label: 'Entretien dirigé', pts: '3/20 pts', pct: 15, color: 'bg-[#71C9CE]', desc: "Présentation personnelle, parler de soi, de sa famille, de ses habitudes." },
  { num: 'T2', label: 'Exercice d\'interaction', pts: '7/20 pts', pct: 35, color: 'bg-[#0F3D58]', desc: "Résoudre une situation concrète avec l'examinateur. Simuler un dialogue (achat, demande d'info, etc.)." },
  { num: 'T3', label: 'Point de vue', pts: '10/20 pts', pct: 50, color: 'bg-[#F98012]', desc: "Défendre une position sur un sujet d'actualité. Présenter des arguments, nuancer, conclure." },
]

const nclcTable = [
  { score: '18–20', nclc: '10+' },
  { score: '16–17', nclc: '10' },
  { score: '14–15', nclc: '9' },
  { score: '12–13', nclc: '8' },
  { score: '10–11', nclc: '7' },
  { score: '7–9', nclc: '6' },
  { score: '4–6', nclc: '5' },
  { score: '< 4', nclc: '4' },
]

const taskGuides = [
  {
    id: 't1',
    title: 'Tâche 1 — Entretien dirigé (1–2 min)',
    badge: 'T1 · 3 pts',
    badgeColor: 'bg-[#e8f7f8] text-[#0F3D58]',
    color: 'border-[#71C9CE]',
    strategies: [
      "Préparez une présentation de 90 secondes : nom, ville d'origine, situation familiale, études/métier.",
      "Employez des temps variés : présent, passé composé, imparfait.",
      "Utilisez des connecteurs simples : d'abord, ensuite, enfin, actuellement.",
      "Parlez de vos loisirs, projets au Canada (immigration) si pertinent.",
      "Soyez précis : donnez des exemples concrets.",
    ],
    formulas: [
      "Je m'appelle… et j'habite à… depuis…",
      "En ce qui concerne ma famille, j'ai…",
      "Sur le plan professionnel, je travaille comme…",
      "Je suis passionné(e) par…, ce qui m'a amené(e) à…",
    ],
  },
  {
    id: 't2',
    title: 'Tâche 2 — Interaction (3 min 30 s)',
    badge: 'T2 · 7 pts',
    badgeColor: 'bg-[#e8f7f8] text-[#0F3D58]',
    color: 'border-[#0F3D58]',
    strategies: [
      "Lisez attentivement le sujet durant la préparation de 2 minutes.",
      "Identifiez votre rôle et celui de l'examinateur dans le scénario.",
      "Initiez l'échange : ne restez pas passif — posez des questions, relancez.",
      "Gérez les imprévus : si l'examinateur ajoute une contrainte, adaptez-vous.",
      "Concluez l'interaction : proposez une solution ou un accord.",
    ],
    formulas: [
      "Excusez-moi, pourriez-vous m'aider avec… ?",
      "En fait, j'aurais besoin de… parce que…",
      "Est-ce qu'il serait possible de… ?",
      "Je comprends votre position, mais peut-être que…",
      "D'accord, donc on convient que…",
    ],
  },
  {
    id: 't3',
    title: 'Tâche 3 — Point de vue (4 min 30 s)',
    badge: 'T3 · 10 pts',
    badgeColor: 'bg-orange-100 text-orange-800',
    color: 'border-[#F98012]',
    strategies: [
      "Pas de préparation : réagissez immédiatement au document (image, titre, graphique).",
      "Structure en 3 parties : description → analyse → opinion personnelle.",
      "Donnez TOUJOURS votre avis : 'Selon moi…', 'Je pense que…', 'Il me semble que…'.",
      "Utilisez des arguments pro ET contra avant de conclure sur votre position.",
      "Gérez le temps : 90s description, 90s analyse, 90s opinion — soit 4min30s.",
    ],
    formulas: [
      "Ce document traite de / aborde le thème de…",
      "On peut observer que… / Il est notable que…",
      "D'un côté… D'un autre côté…",
      "Personnellement, je suis convaincu(e) que…",
      "En conclusion, il apparaît que…",
    ],
  },
]

const generalTips = [
  {
    icon: Clock,
    title: 'Gestion du temps',
    tips: [
      "T1 : 90 secondes, ne dépassez pas 2 minutes.",
      "T2 : Utilisez les 2 min de préparation pour noter 3–4 mots clés.",
      "T3 : Commencez à parler immédiatement, structurez en marchant.",
    ],
  },
  {
    icon: Target,
    title: 'Préparation efficace',
    tips: [
      "Entraînez-vous à voix haute tous les jours, même 10 minutes.",
      "Enregistrez-vous et réécoutez pour corriger vos erreurs.",
      "Lisez des articles en français pour enrichir votre vocabulaire thématique.",
    ],
  },
  {
    icon: Lightbulb,
    title: 'Vocabulaire stratégique',
    tips: [
      "Apprenez les champs lexicaux des thèmes fréquents : environnement, technologie, santé, éducation.",
      "Variez les verbes : penser → estimer, considérer, affirmer, soutenir.",
      "Évitez les répétitions : synonymes, pronoms, reformulations.",
    ],
  },
  {
    icon: MessageSquare,
    title: 'Communication non-verbale',
    tips: [
      "Maintenez un contact visuel avec l'examinateur.",
      "Parlez à un volume audible et articulez clairement.",
      "Si vous ne comprenez pas : 'Pourriez-vous répéter s\'il vous plaît ?'",
    ],
  },
]

function AccordionCard({ item, open, onToggle }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${item.color} overflow-hidden`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>{item.badge}</span>
          <h3 className="font-bold text-gray-800">{item.title}</h3>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Stratégies</h4>
                <ul className="space-y-2">
                  {item.strategies.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-[#e8f7f8] text-[#0F3D58] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Formules utiles</h4>
                <div className="space-y-1.5">
                  {item.formulas.map((f, i) => (
                    <div key={i} className="bg-[#FDF2E9] border border-[#e8e0d8] rounded-lg px-3 py-2 text-sm text-[#0F3D58] italic">
                      « {f} »
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function EOTipsPage() {
  const [openTask, setOpenTask] = useState('t1')

  const toggle = (id) => setOpenTask(openTask === id ? null : id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F3D58] to-[#164b6b] text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BookOpen size={36} className="mx-auto mb-3 opacity-90" />
            <h1 className="text-3xl font-extrabold mb-2">Méthodologie — Expression Orale</h1>
            <p className="text-[#e8f7f8]">Stratégies éprouvées pour chaque tâche de l'épreuve</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {/* Barème */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Barème de l'épreuve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {bareme.map((t) => (
              <div key={t.num} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{t.num}</span>
                  <span className="text-2xl font-extrabold text-gray-800">{t.pts}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{t.label}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{t.desc}</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${t.color}`} style={{ width: `${t.pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1 text-right">{t.pct}% de la note</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Task guides */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Guide par tâche</h2>
          <div className="space-y-4">
            {taskGuides.map((item) => (
              <AccordionCard
                key={item.id}
                item={item}
                open={openTask === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </section>

        {/* General tips */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Conseils généraux</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {generalTips.map((tip, i) => {
              const Icon = tip.icon
              return (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#FDF2E9] rounded-xl">
                      <Icon size={20} className="text-[#0F3D58]" />
                    </div>
                    <h3 className="font-bold text-gray-800">{tip.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {tip.tips.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F98012] flex-shrink-0 mt-1.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* NCLC Table */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Correspondance Score → NCLC</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F3D58] to-[#164b6b] px-6 py-4">
              <div className="grid grid-cols-3 text-white text-sm font-bold">
                <span>Score / 20</span>
                <span className="text-center">Niveau NCLC</span>
                <span className="text-right">Appréciation</span>
              </div>
            </div>
            {nclcTable.map((row, i) => {
              const nclcNum = parseInt(row.nclc)
              let appreciation = 'Insuffisant'
              let aprColor = 'text-red-500'
              if (nclcNum >= 10) { appreciation = 'Excellent'; aprColor = 'text-green-600' }
              else if (nclcNum >= 8) { appreciation = 'Très bon'; aprColor = 'text-[#6b8a9a]' }
              else if (nclcNum >= 6) { appreciation = 'Bon'; aprColor = 'text-[#F98012]' }
              else if (nclcNum >= 5) { appreciation = 'Passable'; aprColor = 'text-orange-500' }
              return (
                <div key={i} className={`grid grid-cols-3 px-6 py-3.5 text-sm border-b border-gray-50 ${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <span className="font-semibold text-gray-800">{row.score} pts</span>
                  <span className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#e8f7f8] text-[#0F3D58] font-bold text-sm">
                      {row.nclc}
                    </span>
                  </span>
                  <span className={`text-right font-medium ${aprColor}`}>{appreciation}</span>
                </div>
              )
            })}
          </div>
          <p className="text-sm text-gray-500 mt-3 text-center">
            * Un score NCLC 7 ou plus est généralement requis pour l'immigration.
          </p>
        </motion.section>

        {/* Quick tips box */}
        <div className="bg-gradient-to-r from-[#FDF2E9] to-[#e8f7f8] border border-[#e8e0d8] rounded-2xl p-6">
          <h3 className="font-bold text-[#0F3D58] text-lg mb-3 flex items-center gap-2">
            <Star size={18} className="text-[#0F3D58]" /> Le jour J — Checklist rapide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Dormir 8h la nuit précédente",
              "Réviser vos formules de connecteurs",
              "Arriver 15 min en avance au centre",
              "Respirer profondément avant de commencer",
              "Parler lentement et clairement",
              "Utiliser des exemples concrets",
              "Ne pas paniquer si vous faites une erreur",
              "Sourire et montrer de l'enthousiasme",
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-[#0F3D58]">
                <span className="w-4 h-4 rounded border-2 border-[#F98012] flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
