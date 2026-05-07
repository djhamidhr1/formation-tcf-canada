import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { scoreEEToNclc } from '../../utils/scoring'
import { FileText, Check, AlertTriangle, ClipboardList, Trophy, ChevronUp, ChevronDown } from 'lucide-react'

const NCLC_COLORS = {
  10: 'bg-[#0F3D58]',
  9: 'bg-[#0F3D58]',
  8: 'bg-[#F98012]',
  7: 'bg-[#F98012]',
  6: 'bg-[#71C9CE]',
  5: 'bg-[#71C9CE]',
  4: 'bg-[#9bb0bc]',
  3: 'bg-[#9bb0bc]',
}

function getLevel(nclc) {
  if (nclc >= 9) return 'C1/C2'
  if (nclc >= 7) return 'B2'
  if (nclc >= 5) return 'B1'
  return 'A2'
}

function TaskAccordion({ task, text, index }) {
  const [open, setOpen] = useState(index === 0)
  const [activeTab, setActiveTab] = useState('response')

  if (!task) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="bg-[#0F3D58] text-white text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            {task.task_number}
          </span>
          <div className="text-left">
            <div className="font-bold text-gray-900">Tâche {task.task_number}</div>
            <div className="text-xs text-gray-500">
              Score : {task.score}/7 · {task.word_count} mots · Niveau {task.level || '—'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-extrabold text-[#0F3D58]">{task.score}<span className="text-sm font-normal text-gray-400">/7</span></div>
          </div>
          <span className="text-gray-400 text-lg">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {/* Positives */}
          {task.positives && task.positives.length > 0 && (
            <div className="px-5 pt-4">
              <div className="bg-[#FDF2E9] border border-[#e8e0d8] rounded-xl p-4">
                <h4 className="text-sm font-bold text-[#0F3D58] mb-2"><Check size={16} className="inline mr-1" /> Points positifs</h4>
                <ul className="space-y-1">
                  {task.positives.map((p, i) => (
                    <li key={i} className="text-sm text-[#3a5a6e] flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Negatives */}
          {task.negatives && task.negatives.length > 0 && (
            <div className="px-5 pt-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-red-800 mb-2"><AlertTriangle size={16} className="inline mr-1" /> Axes d'amélioration</h4>
                <ul className="space-y-1">
                  {task.negatives.map((n, i) => (
                    <li key={i} className="text-sm text-red-700 flex gap-2">
                      <span className="shrink-0">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="px-5 pt-4 pb-5">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('response')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'response' ? 'bg-[#0F3D58] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Votre réponse
              </button>
              {task.correction && (
                <button
                  onClick={() => setActiveTab('correction')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'correction' ? 'bg-[#0F3D58] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Correction proposée
                </button>
              )}
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-64 overflow-auto">
              {activeTab === 'response'
                ? (text || <span className="text-gray-400 italic">Aucune réponse saisie.</span>)
                : (task.correction || <span className="text-gray-400 italic">Aucune correction disponible.</span>)
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function EEResultsPage() {
  const { state } = useLocation()

  if (!state || !state.aiResult) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4"><FileText size={48} className="text-[#0F3D58] mx-auto" /></div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Résultats non disponibles</h2>
        <Link
          to="/epreuve/expression-ecrite/sujets-actualites"
          className="bg-[#0F3D58] text-white px-6 py-3 rounded-xl font-bold no-underline"
        >
          ← Retour aux sujets
        </Link>
      </div>
    )
  }

  const { aiResult, texts, combinaison } = state
  const nclc = aiResult.nclc || scoreEEToNclc(aiResult.score_global || 0)
  const level = getLevel(nclc)
  const score = aiResult.score_global || 0
  const pct = Math.round((score / 20) * 100)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D58] to-[#71C9CE] rounded-3xl p-8 text-white mb-6 text-center">
        {combinaison?.month_slug && (
          <div className="text-sm font-medium text-[#e8f7f8] mb-2">{combinaison.month_slug}</div>
        )}
        <h1 className="text-2xl font-extrabold mb-6">Résultats — Expression Écrite</h1>

        <div className="grid grid-cols-3 gap-4">
          {[
            { val: `${score}/20`, sub: 'Score global', label: 'Score' },
            { val: `NCLC ${nclc}`, sub: 'Correspondance', label: 'NCLC' },
            { val: level, sub: 'Niveau estimé', label: 'Niveau' },
          ].map(item => (
            <div key={item.label} className="bg-white/20 rounded-2xl p-4">
              <div className="text-2xl font-extrabold">{item.val}</div>
              <div className="text-[#e8f7f8] text-xs mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score + NCLC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Score détaillé</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0F3D58" strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold text-gray-900">{pct}%</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900">
                {score} <span className="text-lg font-normal text-gray-400">/ 20</span>
              </div>
              {aiResult.tasks && (
                <div className="text-sm text-gray-500 mt-1">
                  T1: {aiResult.tasks[0]?.score || 0} · T2: {aiResult.tasks[1]?.score || 0} · T3: {aiResult.tasks[2]?.score || 0}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Niveau NCLC</h3>
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-2xl ${NCLC_COLORS[nclc] || 'bg-gray-400'} flex items-center justify-center shrink-0`}>
              <span className="text-white text-2xl font-extrabold">{nclc}</span>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">NCLC {nclc}</div>
              <div className="text-sm text-gray-500">Niveau {level}</div>
              <div className="text-xs text-gray-400 mt-1">
                {nclc >= 7
                  ? <><Check size={14} className="inline mr-1" /> Excellent niveau — objectif immigration atteint</>
                  : <><Trophy size={14} className="inline mr-1" /> Continuez à pratiquer pour atteindre NCLC 7+</>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks accordion */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4"><ClipboardList size={20} className="inline mr-1" /> Détail par tâche</h2>
        {(aiResult.tasks || []).map((task, i) => (
          <TaskAccordion
            key={task.task_number || i}
            task={task}
            text={texts?.[i] || ''}
            index={i}
          />
        ))}
        {(!aiResult.tasks || aiResult.tasks.length === 0) && (
          <div className="bg-[#FDF2E9] border border-[#e8e0d8] rounded-xl p-4 text-[#0F3D58] text-sm">
            Le détail par tâche n'est pas disponible. Score global : {score}/20.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/epreuve/expression-ecrite/sujets-actualites"
          className="flex-1 bg-[#0F3D58] hover:bg-[#F98012] hover:text-white text-white text-center py-3.5 rounded-xl font-bold no-underline transition-colors"
        >
          Nouveau sujet
        </Link>
        <Link
          to="/epreuve/expression-ecrite/sujets-actualites"
          className="flex-1 bg-white border-2 border-[#0F3D58] text-[#0F3D58] hover:bg-[#FDF2E9] text-center py-3.5 rounded-xl font-bold no-underline transition-colors"
        >
          Voir les sujets
        </Link>
      </div>
    </div>
  )
}
