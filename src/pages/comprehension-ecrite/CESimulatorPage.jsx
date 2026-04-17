import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { calculateCEScore, POINT_SCALE } from '../../utils/scoring'
import { useTimer } from '../../hooks/useTimer'
import toast from 'react-hot-toast'

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-800 border-green-200',
  A2: 'bg-blue-100 text-blue-800 border-blue-200',
  B1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  B2: 'bg-orange-100 text-orange-800 border-orange-200',
  C1: 'bg-red-100 text-red-800 border-red-200',
  C2: 'bg-purple-100 text-purple-800 border-purple-200',
}

export default function CESimulatorPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [series, setSeries] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  // Correction mode
  const [isCorrectionMode, setIsCorrectionMode] = useState(false)
  const [preAutoFillAnswers, setPreAutoFillAnswers] = useState(null)

  const submitRef = useRef(null)
  const { seconds, start, pause } = useTimer(60 * 60, () => submitRef.current?.())

  useEffect(() => {
    const fetchData = async () => {
      const { data: s, error } = await supabase
        .from('series_ce')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !s) {
        toast.error('Série introuvable')
        navigate('/epreuve/comprehension-ecrite/series')
        return
      }

      setSeries(s)

      const { data: q } = await supabase
        .from('questions_ce')
        .select('*')
        .eq('series_id', s.id)
        .order('order_index')

      setQuestions(q || [])
      setAnswers(new Array((q || []).length).fill(null))
      setLoading(false)
    }
    fetchData()
  }, [slug, navigate])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    pause()
    setSubmitting(true)

    const score = calculateCEScore(questions, answers)

    let resultId = 'local'
    try {
      const { data: result } = await supabase
        .from('user_results')
        .insert({
          table_type: 'ce',
          series_id: series?.id,
          score,
          total: 699,
          answers,
        })
        .select('id')
        .single()
      if (result) resultId = result.id
    } catch {
      // Sans auth, continue anyway
    }

    navigate(`/epreuve/comprehension-ecrite/resultats/${resultId}`, {
      state: {
        score,
        total: 699,
        questions,
        answers,
        seriesTitle: series?.title || slug,
        seriesSlug: series?.slug,
        timeUsed: 3600 - seconds,
      },
    })
  }, [submitting, questions, answers, series, seconds, pause, navigate, slug])

  useEffect(() => {
    submitRef.current = handleSubmit
  }, [handleSubmit])

  const handleAnswer = (optionIdx) => {
    if (isCorrectionMode) return
    setAnswers(prev => {
      const next = [...prev]
      next[qIdx] = optionIdx
      return next
    })
    const nextUnanswered = answers.findIndex((a, i) => i > qIdx && a === null)
    if (nextUnanswered !== -1) {
      setTimeout(() => setQIdx(nextUnanswered), 300)
    }
  }

  // Auto-fill with correct answers → enters correction mode
  const handleAutoFillAndCorrect = () => {
    setPreAutoFillAnswers([...answers])
    const correctAnswers = questions.map(q => q.correct_answer_index)
    setAnswers(correctAnswers)
    setIsCorrectionMode(true)
    pause()
    toast.success('Mode correction activé — toutes les bonnes réponses affichées')
  }

  const exitCorrectionMode = () => {
    setIsCorrectionMode(false)
    if (preAutoFillAnswers) {
      setAnswers(preAutoFillAnswers)
      setPreAutoFillAnswers(null)
    }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const answeredCount = answers.filter(a => a !== null).length
  const question = questions[qIdx]
  const options = question?.options || []

  // Correction mode score
  const correctionScore = isCorrectionMode ? calculateCEScore(questions, answers) : null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1E8449] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement de la série...</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">📖</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{series?.title}</h1>
        <p className="text-gray-500 mb-8">Compréhension Écrite — Entraînement</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            ['⏱️', '60 min', 'Durée'],
            ['❓', questions.length, 'Questions'],
            ['🏆', '699 pts', 'Score max'],
          ].map(([icon, val, label]) => (
            <div key={label} className="bg-green-50 border border-green-200 rounded-xl p-5">
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-2xl font-extrabold text-gray-900">{val}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left text-sm text-blue-800">
          <p className="font-semibold mb-1">💡 Conseils avant de commencer :</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-700">
            <li>Le timer démarrera dès que vous cliquerez sur "Commencer"</li>
            <li>Lisez d'abord la question, puis repérez la réponse dans le texte</li>
            <li>Les questions C2 (Q36-39) valent 33 pts — commencez par elles si vous manquez de temps</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setStarted(true); start() }}
            className="bg-[#1E8449] hover:bg-[#196A3A] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            Commencer l'entraînement →
          </button>
          <button
            onClick={() => {
              setStarted(true)
              handleAutoFillAndCorrect()
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            🔍 Voir le corrigé directement
          </button>
        </div>
        <button
          onClick={() => navigate('/epreuve/comprehension-ecrite/series')}
          className="block mx-auto mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Retour aux séries
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">

      {/* Bandeau correction mode */}
      {isCorrectionMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔍</span>
            <div>
              <p className="font-extrabold text-lg">Mode Correction</p>
              <p className="text-amber-100 text-xs">Les bonnes réponses sont affichées en vert · Navigation libre entre les questions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <div className="text-xl font-extrabold">{correctionScore} <span className="text-sm font-normal opacity-80">/ 699 pts</span></div>
              <div className="text-xs opacity-80">{questions.length}/{questions.length} réponses</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exitCorrectionMode}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
              >
                ← Reprendre le test
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-white text-orange-600 hover:bg-amber-50 px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
              >
                {submitting ? '⏳' : '📊 Résultats complets'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header barre d'examen */}
      {!isCorrectionMode && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap items-center justify-between gap-3 sticky top-[64px] z-40">
          <div>
            <h2 className="font-bold text-gray-900 text-sm">{series?.title}</h2>
            <div className="flex items-center gap-3 mt-0.5">
              <div className="w-32 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-[#1E8449] h-1.5 rounded-full transition-all"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{answeredCount}/{questions.length} réponses</span>
            </div>
          </div>

          <div className={`text-xl font-bold font-mono px-4 py-2 rounded-xl ${seconds < 300 ? 'bg-red-100 text-red-700 animate-pulse' : seconds < 600 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-800'}`}>
            ⏱ {formatTime(seconds)}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillAndCorrect}
              className="px-3 py-1.5 bg-amber-100 text-amber-700 border border-amber-300 rounded-lg text-xs font-bold hover:bg-amber-200 transition-colors"
            >
              🔍 Corrigé
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
                answeredCount === questions.length
                  ? 'bg-[#1E8449] text-white hover:bg-[#196A3A]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {submitting ? '⏳ Envoi...' : answeredCount === questions.length ? '✓ Terminer' : `Terminer (${answeredCount}/${questions.length})`}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
        {/* Navigation pastilles */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-[140px]">
          <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Questions</p>
          <div className="grid grid-cols-7 lg:grid-cols-5 gap-1">
            {questions.map((q, i) => {
              const isCorrect = isCorrectionMode && answers[i] === q.correct_answer_index
              const wasWrong = isCorrectionMode && preAutoFillAnswers && preAutoFillAnswers[i] !== null && preAutoFillAnswers[i] !== q.correct_answer_index
              return (
                <button
                  key={i}
                  onClick={() => setQIdx(i)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    i === qIdx
                      ? 'bg-[#1E8449] text-white shadow-md scale-110'
                      : isCorrectionMode
                      ? wasWrong
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-green-100 text-green-700 border border-green-300'
                      : answers[i] !== null
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {isCorrectionMode ? (wasWrong ? '✗' : '✓') : i + 1}
                </button>
              )
            })}
          </div>
          {!isCorrectionMode && (
            <div className="mt-3 space-y-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#1E8449]"></div>
                <span>Actuelle</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                <span>Répondu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-100"></div>
                <span>Non répondu</span>
              </div>
            </div>
          )}
          {isCorrectionMode && (
            <div className="mt-3 space-y-1.5 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-300 flex items-center justify-center text-green-700 font-bold text-[10px]">✓</div>
                <span>Correct</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-300 flex items-center justify-center text-red-700 font-bold text-[10px]">✗</div>
                <span>Erreur avant corrigé</span>
              </div>
            </div>
          )}
        </div>

        {/* Zone de question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-500 text-sm">
              Question {qIdx + 1} / {questions.length}
            </span>
            {question?.level && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${LEVEL_COLORS[question.level]}`}>
                {question.level} · {POINT_SCALE[question.level] || '?'} pts
              </span>
            )}
          </div>

          {question?.image_url && (
            <img
              src={question.image_url}
              alt=""
              className="w-full max-h-72 object-contain rounded-xl mb-4 border border-gray-100"
            />
          )}

          {question?.content_html && (
            <div
              className="bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 mb-4 text-sm leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: question.content_html }}
            />
          )}

          {question?.prompt && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 text-sm text-blue-800 font-medium">
              {question.prompt}
            </div>
          )}

          {question?.question_text && (
            <p className="font-bold text-gray-900 text-base mb-5">{question.question_text}</p>
          )}

          {/* Options */}
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              const optText = typeof opt === 'object' ? (opt.text || opt.label || JSON.stringify(opt)) : opt
              const isCorrectOpt = i === question?.correct_answer_index
              const wasUserWrong = preAutoFillAnswers && preAutoFillAnswers[qIdx] !== null && preAutoFillAnswers[qIdx] !== question?.correct_answer_index && preAutoFillAnswers[qIdx] === i

              if (isCorrectionMode) {
                return (
                  <div
                    key={i}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium ${
                      isCorrectOpt
                        ? 'border-green-500 bg-green-50 text-green-900'
                        : wasUserWrong
                        ? 'border-red-300 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-500'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${
                      isCorrectOpt ? 'bg-green-500 text-white'
                      : wasUserWrong ? 'bg-red-400 text-white'
                      : 'bg-gray-100 text-gray-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {optText}
                    {isCorrectOpt && <span className="ml-2 text-green-600 font-bold">✓ Bonne réponse</span>}
                    {wasUserWrong && <span className="ml-2 text-red-500 font-bold">✗ Votre choix</span>}
                  </div>
                )
              }

              const chosen = answers[qIdx] === i
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all hover:shadow-sm ${
                    chosen
                      ? 'border-[#1E8449] bg-green-50 text-green-900 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${
                    chosen ? 'bg-[#1E8449] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {optText}
                </button>
              )
            })}
          </div>

          {/* Explication en mode correction */}
          {isCorrectionMode && question?.explanation && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">💡 Explication</p>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setQIdx(i => Math.max(0, i - 1))}
              disabled={qIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Précédente
            </button>

            <span className="text-xs text-gray-400 self-center">
              {isCorrectionMode ? `Mode Correction · Q${qIdx + 1}/${questions.length}` : `${answeredCount} / ${questions.length} répondues`}
            </span>

            <button
              onClick={() => setQIdx(i => Math.min(questions.length - 1, i + 1))}
              disabled={qIdx === questions.length - 1}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Suivante →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
