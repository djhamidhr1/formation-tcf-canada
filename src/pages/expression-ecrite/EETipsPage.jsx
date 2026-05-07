import { useState } from 'react'
import { Clock, Target, Award, ChevronDown, ChevronUp, PenTool, Trophy, FileText, Link2, MessageSquare, Crosshair, Check, Ruler } from 'lucide-react'

const NCLC_EE = [
  { score: '18–20', nclc: 10, color: 'bg-[#0F3D58]' },
  { score: '16–17', nclc: 10, color: 'bg-[#0F3D58]' },
  { score: '14–15', nclc: 9, color: 'bg-[#0F3D58]' },
  { score: '12–13', nclc: 8, color: 'bg-[#F98012]' },
  { score: '10–11', nclc: 7, color: 'bg-yellow-500' },
  { score: '7–9', nclc: 6, color: 'bg-orange-400' },
  { score: '4–6', nclc: 5, color: 'bg-orange-500' },
  { score: '< 4', nclc: 4, color: 'bg-red-500' },
]

const TASKS_INFO = [
  {
    num: 1,
    title: 'Tâche 1 — Message personnel',
    time: '10 minutes',
    pts: 6,
    mots: '60–120 mots',
    level: 'A2–B1',
    levelColor: 'bg-[#e8f7f8] text-[#0F3D58]',
    style: 'Style convivial, ton informel/amical',
    desc: 'Répondre à un message, rédiger une invitation, remercier, s\'excuser ou donner des informations à un proche.',
    tips: [
      'Utilisez une formule de salutation chaleureuse (Cher/Chère, Bonjour, Salut...)',
      'Restez dans le registre familier : vous pouvez utiliser "tu"',
      'Structurez : Introduction → Corps du message → Formule de politesse',
      'Exprimez clairement votre demande ou réponse dès le début',
      'Terminez avec une formule de clôture adaptée (Amicalement, À bientôt...)',
    ],
    connectors: ['De plus,', 'En effet,', 'Car', 'C\'est pourquoi', 'Par contre,', 'Cependant,'],
    phrases: [
      'Je t\'écris pour te dire que...',
      'Je serais ravi(e) de...',
      'N\'hésite pas à me contacter si...',
      'En espérant avoir de tes nouvelles...',
      'Je te remercie de m\'avoir informé(e) de...',
    ],
  },
  {
    num: 2,
    title: 'Tâche 2 — Narration au passé',
    time: '20 minutes',
    pts: 7,
    mots: '120–150 mots',
    level: 'B1–B2',
    levelColor: 'bg-[#e8f7f8] text-[#0F3D58]',
    style: 'NARRATION — temps du passé obligatoires',
    desc: 'Raconter un événement passé, une expérience vécue, une anecdote, une situation problématique et sa résolution.',
    tips: [
      'Utilisez le PASSÉ COMPOSÉ pour les actions ponctuelles (j\'ai vu, elle est venue)',
      'Utilisez l\'IMPARFAIT pour le cadre et les habitudes (il faisait beau, c\'était magnifique)',
      'Organisez chronologiquement : contexte → événement → conséquence',
      'Ajoutez des détails sensoriels pour enrichir la narration',
      'Intégrez des connecteurs temporels (d\'abord, ensuite, enfin, soudain...)',
    ],
    connectors: ['Tout d\'abord,', 'Ensuite,', 'Puis,', 'Soudain,', 'Finalement,', 'Par la suite,', 'À ce moment-là,'],
    phrases: [
      'C\'était une journée comme les autres lorsque...',
      'Je me souviens très bien de ce jour où...',
      'Après avoir + infinitif passé, j\'ai...',
      'Ce qui m\'a le plus surpris(e), c\'est que...',
      'Cette expérience m\'a appris que...',
    ],
  },
  {
    num: 3,
    title: 'Tâche 3 — Comparaison de documents',
    time: '30 minutes',
    pts: 7,
    mots: '120–180 mots',
    level: 'C1–C2',
    levelColor: 'bg-fuchsia-100 text-fuchsia-800',
    style: 'Analyse, comparaison, argumentation',
    desc: 'Analyser deux documents (textes, statistiques, graphiques) et rédiger un texte argumenté qui les compare et tire des conclusions.',
    tips: [
      'Commencez par une introduction présentant les deux documents et leur thème commun',
      'Identifiez les SIMILITUDES et les DIFFÉRENCES entre les deux documents',
      'Appuyez chaque argument sur des données concrètes tirées des documents',
      'Utilisez le vocabulaire de la comparaison (alors que, tandis que, contrairement à...)',
      'Concluez avec une synthèse ou votre opinion personnelle nuancée',
    ],
    connectors: ['En revanche,', 'Tandis que', 'Contrairement à', 'À l\'inverse,', 'De même,', 'Ainsi,', 'Or,', 'Néanmoins,'],
    phrases: [
      'Ces deux documents traitent de la question de...',
      'D\'une part... D\'autre part...',
      'On constate que... alors que...',
      'Selon le document 1,... En revanche, le document 2 indique que...',
      'En conclusion, il apparaît que...',
    ],
  },
]

function TaskAccordion({ task }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0F3D58] text-white flex items-center justify-center font-extrabold shrink-0">
            {task.num}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{task.title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${task.levelColor}`}>{task.level}</span>
              <span className="text-xs text-gray-500 flex items-center gap-0.5"><Clock size={12} /> {task.time}</span>
              <span className="text-xs font-semibold text-[#0F3D58] flex items-center gap-0.5"><Trophy size={12} /> {task.pts} pts</span>
              <span className="text-xs text-gray-500 flex items-center gap-0.5"><FileText size={12} /> {task.mots}</span>
            </div>
          </div>
        </div>
        <div className="text-[#0F3D58] shrink-0 ml-4">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 pb-6 pt-4">
          {/* Style */}
          <div className="bg-[#FDF2E9] border border-[#e8e0d8] rounded-xl px-4 py-3 mb-5 text-sm font-semibold text-[#0F3D58]">
            <PenTool size={14} className="inline mr-1" /> {task.style}
          </div>

          <p className="text-gray-600 text-sm mb-5 leading-relaxed">{task.desc}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conseils */}
            <div className="md:col-span-1">
              <h4 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <Target size={15} className="text-[#0F3D58]" /> Conseils clés
              </h4>
              <ul className="space-y-2">
                {task.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-[#0F3D58] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connecteurs */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3"><Link2 size={14} className="inline mr-1" /> Connecteurs logiques</h4>
              <div className="flex flex-wrap gap-1.5">
                {task.connectors.map(c => (
                  <span key={c} className="bg-[#FDF2E9] border border-[#e8e0d8] text-[#0F3D58] text-xs font-medium px-2.5 py-1 rounded-lg">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Phrases types */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-3"><MessageSquare size={14} className="inline mr-1" /> Phrases types</h4>
              <ul className="space-y-1.5">
                {task.phrases.map((p, i) => (
                  <li key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-700 italic leading-relaxed border border-gray-100">
                    "{p}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EETipsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
        Astuces — Expression Écrite
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Stratégies de rédaction, barème officiel et formules gagnantes
      </p>

      {/* Gestion du temps */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-[#0F3D58]" /> Gestion du temps (60 min total)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TASKS_INFO.map(t => (
            <div key={t.num} className="border-2 border-[#e8e0d8] rounded-xl p-4 hover:border-[#71C9CE] transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="w-7 h-7 rounded-full bg-[#0F3D58] text-white flex items-center justify-center font-bold text-sm">
                  {t.num}
                </span>
                <span className="text-[#0F3D58] font-extrabold text-lg">{t.pts} pts</span>
              </div>
              <div className="text-base font-extrabold text-gray-900 mb-1">{t.time}</div>
              <div className="text-xs text-gray-500 mb-1">{t.mots}</div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t.levelColor}`}>{t.level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Barème */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award size={20} className="text-[#0F3D58]" /> Barème officiel — Notation /20
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Score table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Tâche</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Niveau</th>
                  <th className="text-right py-2 px-3 text-gray-500 font-medium">Points</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { tache: 'Tâche 1', level: 'A2–B1', pts: 6 },
                  { tache: 'Tâche 2', level: 'B1–B2', pts: 7 },
                  { tache: 'Tâche 3', level: 'C1–C2', pts: 7 },
                ].map(row => (
                  <tr key={row.tache} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 font-semibold">{row.tache}</td>
                    <td className="py-3 px-3 text-gray-500 text-xs">{row.level}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#0F3D58]">{row.pts} / {row.pts}</td>
                  </tr>
                ))}
                <tr className="bg-[#FDF2E9] font-bold">
                  <td className="py-3 px-3" colSpan={2}>TOTAL MAXIMUM</td>
                  <td className="py-3 px-3 text-right text-[#0F3D58]">20 pts</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* NCLC table */}
          <div className="overflow-x-auto">
            <p className="text-sm font-bold text-gray-700 mb-2">Correspondance NCLC</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Score /20</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">NCLC</th>
                </tr>
              </thead>
              <tbody>
                {NCLC_EE.map(row => (
                  <tr key={row.score} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-semibold">{row.score}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-sm font-extrabold ${row.color}`}>
                        {row.nclc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Task accordions */}
      <h2 className="text-xl font-bold text-gray-900 mb-5">Stratégies par tâche</h2>
      <div className="space-y-4 mb-10">
        {TASKS_INFO.map(task => (
          <TaskAccordion key={task.num} task={task} />
        ))}
      </div>

      {/* Tips globaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            IconComp: Crosshair,
            title: 'Respectez les limites de mots',
            desc: 'Trop court (< min) ou trop long (> max+20%) sont pénalisés. Comptez régulièrement pendant que vous écrivez.',
          },
          {
            IconComp: Clock,
            title: 'Planifiez avant d\'écrire',
            desc: 'Consacrez 2 minutes par tâche à lister vos idées et votre plan. Cela évite les hors-sujet et les répétitions.',
          },
          {
            IconComp: Check,
            title: 'Relisez et corrigez',
            desc: 'Gardez 2 minutes par tâche pour la relecture : orthographe, accords, conjugaisons, ponctuation.',
          },
          {
            IconComp: Ruler,
            title: 'Structure claire = meilleure note',
            desc: 'Chaque tâche doit avoir une introduction, un développement et une conclusion. Sautez des lignes entre les paragraphes.',
          },
        ].map(tip => (
          <div key={tip.title} className="bg-[#FDF2E9] border border-[#e8e0d8] rounded-xl p-5">
            <div className="text-2xl mb-2"><tip.IconComp size={24} className="text-[#0F3D58]" /></div>
            <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
