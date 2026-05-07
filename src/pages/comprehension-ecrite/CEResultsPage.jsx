import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { POINT_SCALE } from '../../utils/scoring'
import { getNclcCeCo } from '../../utils/nclc'
import { ClipboardList, Check, X, Zap } from 'lucide-react'

const LEVEL_COLORS = {
  A1: 'bg-[#e8f7f8] text-[#0F3D58]',
  A2: 'bg-[#e8f7f8] text-[#0F3D58]',
  B1: 'bg-[#FDF2E9] text-[#0F3D58]',
  B2: 'bg-[#e8f7f8] text-[#0F3D58]',
  C1: 'bg-red-100 text-red-800',
  C2: 'bg-[#e8f7f8] text-[#0F3D58]',
}

const NCLC_COLORS = {
  10: 'bg-[#0F3D58]',
  9: 'bg-[#F98012]',
  8: 'bg-[#F98012]',
  7: 'bg-[#71C9CE]',
  6: 'bg-[#71C9CE]',
  5: 'bg-[#71C9CE]',
  4: 'bg-[#9bb0bc]',
  3: 'bg-[#9bb0bc]',
}

const LEVEL_RANGES = [
  { level: 'A1', label: 'Q1–4', questions: [0, 1, 2, 3] },
  { level: 'A2', label: 'Q5–10', questions: [4, 5, 6, 7, 8, 9] },
  { level: 'B1', label: 'Q11–19', questions: [10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { level: 'B2', label: 'Q20–29', questions: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  { level: 'C1', label: 'Q30–35', questions: [29, 30, 31, 32, 33, 34] },
  { level: 'C2', label: 'Q36–39', questions: [35, 36, 37, 38] },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}min ${s}s`
}

function getLevel(score) {
  if (score >= 549) return 'C2'
  if (score >= 453) return 'C1'
  if (score >= 342) return 'B2'
  if (score >= 226) return 'B1'
  if (score >= 100) return 'A2'
  return 'A1'
}

export default function CEResultsPage() {
  const { resultId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [openReview, setOpenReview] = useState(false)

  if (!state) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="flex justify-center mb-4"><ClipboardList size={48} className="text-gray-400" /></div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Résultats non disponibles</h2>
        <Link to="/epreuve/comprehension-ecrite/series"
          className="bg-[#0F3D58] text-white px-6 py-3 rounded-xl font-bold no-underline">
          ← Retour aux séries
        </Link>
      </div>
    )
  }

  const { score, total, questions, answers, seriesTitle, timeUsed } = state
  const nclc = getNclcCeCo(score)
  const level = getLevel(score)
  const pct = Math.round((score / total) * 100)
  const correctCount = questions.filter((q, i) => answers[i] === q.correct_answer_index).length

  // Breakdown par niveau
  const breakdown = LEVEL_RANGES.map(range => {
    const qs = range.questions.map(i => questions[i]).filter(Boolean)
    const correct = qs.filter((q, qi) => {
      const globalIdx = range.questions[qi]
      return answers[globalIdx] === q.correct_answer_index
    }).length
    const pts = POINT_SCALE[range.level] || 0
    return {
      ...range,
      count: qs.length,
      correct,
      totalPts: correct * pts,
      maxPts: qs.length * pts,
    }
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* En-tête résultat */}
      <div className="bg-gradient-to-br from-[#0F3D58] to-[#0F3D58] rounded-3xl p-8 text-white mb-6 text-center">
        <div className="text-sm font-medium text-[#e8f7f8] mb-2">{seriesTitle}</div>
        <h1 className="text-2xl font-extrabold mb-6">Résultats — Compréhension Écrite</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: `${score}`, sub: '/ 699 pts', label: 'Score' },
            { val: `${pct}%`, sub: 'de réussite', label: 'Taux' },
            { val: level, sub: 'Niveau estimé', label: 'Niveau' },
            { val: `NCLC ${nclc}`, sub: 'Correspondance', label: 'NCLC' },
          ].map(item => (
            <div key={item.label} className="bg-white/20 rounded-2xl p-4">
              <div className="text-2xl font-extrabold">{item.val}</div>
              <div className="text-[#e8f7f8] text-xs">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score visuel + NCLC */}
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
              <div className="text-3xl font-extrabold text-gray-900">{score} <span className="text-lg font-normal text-gray-400">/ 699</span></div>
              <div className="text-sm text-gray-500 mt-1">{correctCount} / {questions.length} bonnes réponses</div>
              {timeUsed && <div className="text-xs text-gray-400 mt-1">Temps utilisé : {formatTime(timeUsed)}</div>}
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
                {nclc >= 7 ? <span className="inline-flex items-center gap-1"><Check size={12} /> Niveau requis pour la plupart des programmes d'immigration</span> : 'Continuez a vous entrainer pour atteindre NCLC 7+'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown par niveau */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Performance par niveau</h3>
        <div className="space-y-3">
          {breakdown.map(b => (
            <div key={b.level} className="flex items-center gap-3">
              <span className={`w-10 text-center px-1.5 py-0.5 rounded-full text-xs font-bold ${LEVEL_COLORS[b.level]}`}>
                {b.level}
              </span>
              <span className="text-xs text-gray-500 w-16 shrink-0">{b.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full transition-all ${b.correct === b.count ? 'bg-[#0F3D58]' : b.correct === 0 ? 'bg-red-400' : 'bg-[#F98012]'}`}
                  style={{ width: b.count > 0 ? `${(b.correct / b.count) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700 w-16 shrink-0 text-right">
                {b.correct}/{b.count} · {b.totalPts}pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Revue détaillée */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <button
          onClick={() => setOpenReview(!openReview)}
          className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
        >
          <h3 className="font-bold text-gray-900 flex items-center gap-2"><ClipboardList size={16} /> Revue detaillee des questions</h3>
          <span className="text-[#0F3D58] text-xl">{openReview ? '−' : '+'}</span>
        </button>

        {openReview && (
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {questions.map((q, i) => {
              const userAnswer = answers[i]
              const isCorrect = userAnswer === q.correct_answer_index
              const options = q.options || []
              const correctOpt = options[q.correct_answer_index]
              const correctText = correctOpt
                ? (typeof correctOpt === 'object' ? (correctOpt.text || correctOpt.label || '') : correctOpt)
                : ''
              const correctLetter = String.fromCharCode(65 + q.correct_answer_index)
              const userOpt = userAnswer != null ? options[userAnswer] : null
              const userText = userOpt
                ? (typeof userOpt === 'object' ? (userOpt.text || userOpt.label || '') : userOpt)
                : null
              const userLetter = userAnswer != null ? String.fromCharCode(65 + userAnswer) : null

              return (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 ${isCorrect ? 'bg-[#FDF2E9]/40' : 'bg-red-50/40'}`}>
                  {/* Badge Check/X */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isCorrect ? 'bg-[#e8f7f8] text-[#3a5a6e]' : 'bg-red-100 text-red-700'}`}>
                    {isCorrect ? <Check size={12} /> : <X size={12} />}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    {/* Ligne 1 : numéro + niveau + points + question */}
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-bold text-gray-500">Q{i + 1}</span>
                      {q.level && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${LEVEL_COLORS[q.level]}`}>
                          {q.level}
                        </span>
                      )}
                      <span className={`text-xs font-semibold ${isCorrect ? 'text-[#6b8a9a]' : 'text-red-500'}`}>
                        {isCorrect ? `+${POINT_SCALE[q.level] || 0} pts` : '0 pt'}
                      </span>
                    </div>
                    {q.question_text && (
                      <p className="text-sm text-gray-800 font-medium mb-1">{q.question_text}</p>
                    )}

                    {/* Ligne 2 : bonne réponse */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 bg-[#e8f7f8] text-[#0F3D58] font-semibold px-2 py-0.5 rounded-md">
                        <Check size={12} /> {correctLetter} — {correctText}
                      </span>
                      {!isCorrect && userText && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                          <X size={12} /> {userLetter} — {userText}
                        </span>
                      )}
                    </div>

                    {/* Explication si dispo */}
                    {q.explanation && (
                      <div className="mt-1.5 text-xs text-[#3a5a6e] bg-[#FDF2E9] border border-[#e8e0d8] rounded px-2 py-1">
                        <Zap size={12} className="inline -mt-0.5 shrink-0" /> {q.explanation}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/epreuve/comprehension-ecrite/series"
          className="flex-1 bg-[#0F3D58] hover:bg-[#0F3D58] text-white text-center py-3.5 rounded-xl font-bold no-underline transition-colors"
        >
          Choisir une autre série
        </Link>
        <Link
          to={`/epreuve/comprehension-ecrite/entrainement/${state.seriesSlug || ''}`}
          className="flex-1 bg-white border-2 border-[#0F3D58] text-[#0F3D58] hover:bg-[#FDF2E9] text-center py-3.5 rounded-xl font-bold no-underline transition-colors"
        >
          Refaire cette série
        </Link>
      </div>
    </div>
  )
}
