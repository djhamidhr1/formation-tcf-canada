import { useState } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { POINT_SCALE } from '../../utils/scoring'
import { getNclcCeCo } from '../../utils/nclc'

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-800',
  A2: 'bg-blue-100 text-blue-800',
  B1: 'bg-yellow-100 text-yellow-800',
  B2: 'bg-orange-100 text-orange-800',
  C1: 'bg-red-100 text-red-800',
  C2: 'bg-purple-100 text-purple-800',
}

const NCLC_COLORS = {
  10: 'bg-emerald-600',
  9: 'bg-green-500',
  8: 'bg-lime-500',
  7: 'bg-yellow-500',
  6: 'bg-orange-400',
  5: 'bg-orange-500',
  4: 'bg-red-500',
  3: 'bg-red-700',
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

export default function COResultsPage() {
  const { resultId } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const [openReview, setOpenReview] = useState(false)

  if (!state) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Résultats non disponibles</h2>
        <Link
          to="/epreuve/comprehension-orale/series"
          className="bg-[#1A5276] text-white px-6 py-3 rounded-xl font-bold no-underline"
        >
          ← Retour aux séries
        </Link>
      </div>
    )
  }

  const { score, total, questions, answers, seriesTitle, seriesSlug, timeUsed } = state
  const nclc = getNclcCeCo(score)
  const level = getLevel(score)
  const pct = Math.round((score / (total || 699)) * 100)
  const correctCount = questions.filter((q, i) => answers[i] === q.correct_answer_index).length

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
      <div className="bg-gradient-to-br from-[#1A5276] to-[#2E86C1] rounded-3xl p-8 text-white mb-6 text-center">
        <div className="text-sm font-medium text-blue-200 mb-2">{seriesTitle}</div>
        <h1 className="text-2xl font-extrabold mb-6">Résultats — Compréhension Orale</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: `${score}`, sub: '/ 699 pts', label: 'Score' },
            { val: `${pct}%`, sub: 'de réussite', label: 'Taux' },
            { val: level, sub: 'Niveau estimé', label: 'Niveau' },
            { val: `NCLC ${nclc}`, sub: 'Correspondance', label: 'NCLC' },
          ].map(item => (
            <div key={item.label} className="bg-white/20 rounded-2xl p-4">
              <div className="text-2xl font-extrabold">{item.val}</div>
              <div className="text-blue-200 text-xs">{item.sub}</div>
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
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1A5276" strokeWidth="3"
                  strokeDasharray={`${pct} ${100 - pct}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-extrabold text-gray-900">{pct}%</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900">
                {score} <span className="text-lg font-normal text-gray-400">/ 699</span>
              </div>
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
                {nclc >= 7
                  ? '✅ Niveau requis pour la plupart des programmes d\'immigration'
                  : '💪 Continuez à vous entraîner pour atteindre NCLC 7+'}
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
                  className={`h-2.5 rounded-full transition-all ${
                    b.correct === b.count ? 'bg-green-500' : b.correct === 0 ? 'bg-red-400' : 'bg-yellow-400'
                  }`}
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
          <h3 className="font-bold text-gray-900">📋 Revue détaillée des questions</h3>
          <span className="text-[#1A5276] text-xl">{openReview ? '−' : '+'}</span>
        </button>

        {openReview && (
          <div className="border-t border-gray-100 divide-y divide-gray-100">
            {questions.map((q, i) => {
              const userAnswer = answers[i]
              const isCorrect = userAnswer === q.correct_answer_index
              const options = q.options || []
              const getOptText = (opt) => {
                if (!opt) return ''
                if (typeof opt === 'object') return opt.text || opt.label || ''
                return String(opt).trim()
              }
              const correctText = getOptText(options[q.correct_answer_index])
              const correctLetter = String.fromCharCode(65 + q.correct_answer_index)
              const userOpt = userAnswer != null ? options[userAnswer] : null
              const userText = userAnswer != null ? getOptText(userOpt) : null
              const userLetter = userAnswer != null ? String.fromCharCode(65 + userAnswer) : null
              const displayText = q.prompt || q.question_text || ''

              return (
                <div key={i} className={`flex items-start gap-3 px-4 py-3 ${isCorrect ? 'bg-green-50/40' : 'bg-red-50/40'}`}>
                  {/* Badge ✓/✗ */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    {/* Ligne 1 : numéro + niveau + points + audio */}
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-bold text-gray-500">Q{i + 1}</span>
                      {q.level && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${LEVEL_COLORS[q.level]}`}>
                          {q.level}
                        </span>
                      )}
                      <span className={`text-xs font-semibold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                        {isCorrect ? `+${POINT_SCALE[q.level] || 0} pts` : '0 pt'}
                      </span>
                      {q.audio_url && (
                        <span className="text-xs text-blue-500 font-medium">🎧 Audio</span>
                      )}
                      {q.image_url && (
                        <span className="text-xs text-purple-500 font-medium">🖼️ Image</span>
                      )}
                    </div>

                    {/* Prompt / question text */}
                    {displayText && (
                      <p className="text-sm text-gray-800 font-medium mb-1">{displayText}</p>
                    )}

                    {/* Bonne réponse + réponse utilisateur */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-md">
                        ✓ {correctLetter}{correctText ? ` — ${correctText}` : ''}
                      </span>
                      {!isCorrect && userAnswer != null && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-md">
                          ✗ {userLetter}{userText ? ` — ${userText}` : ''}
                        </span>
                      )}
                      {userAnswer == null && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md">
                          — Sans réponse
                        </span>
                      )}
                    </div>

                    {/* Explication si dispo */}
                    {q.explanation && (
                      <div className="mt-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                        💡 {q.explanation}
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
          to="/epreuve/comprehension-orale/series"
          className="flex-1 bg-[#1A5276] hover:bg-[#154360] text-white text-center py-3.5 rounded-xl font-bold no-underline transition-colors"
        >
          Choisir une autre série
        </Link>
        <Link
          to={`/epreuve/comprehension-orale/entrainement/${seriesSlug || ''}`}
          className="flex-1 bg-white border-2 border-[#1A5276] text-[#1A5276] hover:bg-blue-50 text-center py-3.5 rounded-xl font-bold no-underline transition-colors"
        >
          Refaire cette série
        </Link>
      </div>
    </div>
  )
}
