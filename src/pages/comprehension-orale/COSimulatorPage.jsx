import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { calculateCEScore, POINT_SCALE } from '../../utils/scoring'
import { useTimer } from '../../hooks/useTimer'
import toast from 'react-hot-toast'

const CO_DURATION = 35 * 60 // 2100 seconds

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-800 border-green-200',
  A2: 'bg-blue-100 text-blue-800 border-blue-200',
  B1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  B2: 'bg-orange-100 text-orange-800 border-orange-200',
  C1: 'bg-red-100 text-red-800 border-red-200',
  C2: 'bg-purple-100 text-purple-800 border-purple-200',
}

function AudioPlayer({ audioUrl, questionIndex }) {
  const audioRef = useRef(null)
  const [played, setPlayed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setPlayed(false)
    setPlaying(false)
    setFinished(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [questionIndex, audioUrl])

  const handlePlay = () => {
    if (!audioRef.current) return
    audioRef.current.play()
    setPlayed(true)
    setPlaying(true)
  }

  const handleEnded = () => {
    setPlaying(false)
    setFinished(true)
  }

  const handlePause = () => {
    setPlaying(false)
  }

  // Prevent seeking backwards (one listen only — no seeking back)
  const handleSeeking = () => {
    if (!audioRef.current || finished) return
    // If the user tries to seek while audio has not finished, block it
    if (!finished && played) {
      // Don't allow seeking back at all
      const currentTime = audioRef.current.currentTime
      const duration = audioRef.current.duration || 0
      // Only allow seeking forward (towards the end), not backwards
      // To keep it simple: reset to 0 if seeked before finish
      if (duration > 0 && currentTime < duration - 0.5) {
        audioRef.current.currentTime = 0
      }
    }
  }

  if (!audioUrl) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-center text-gray-400 text-sm">
        Aucun fichier audio pour cette question.
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            playing
              ? 'bg-[#2E86C1] text-white animate-pulse'
              : finished
              ? 'bg-green-500 text-white'
              : played
              ? 'bg-orange-400 text-white'
              : 'bg-[#1A5276] text-white'
          }`}
        >
          {finished ? '✓' : playing ? '▶' : '🎧'}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-900">
            {finished
              ? 'Audio terminé'
              : played && !playing
              ? 'Audio en pause'
              : playing
              ? 'Lecture en cours...'
              : 'Document sonore'}
          </p>
          <p className="text-xs text-blue-600">
            {finished
              ? 'Une seule écoute autorisée.'
              : 'Une seule écoute — pas de retour arrière possible.'}
          </p>
        </div>
        {!played && (
          <button
            onClick={handlePlay}
            className="bg-[#1A5276] hover:bg-[#154360] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            ▶ Écouter
          </button>
        )}
        {played && playing && (
          <div className="text-xs font-medium text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">
            En cours...
          </div>
        )}
        {played && !playing && !finished && (
          <div className="text-xs font-medium text-orange-700 bg-orange-100 px-3 py-1.5 rounded-lg">
            Déjà écouté
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        src={audioUrl}
        onPlay={() => setPlaying(true)}
        onPause={handlePause}
        onEnded={handleEnded}
        onSeeking={handleSeeking}
        className="hidden"
      />

      {/* Visual progress indicator (no controls exposed) */}
      {played && (
        <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-1.5 rounded-full transition-all duration-500 ${
              finished ? 'bg-green-500 w-full' : 'bg-[#2E86C1] w-1/2'
            }`}
          />
        </div>
      )}
    </div>
  )
}

export default function COSimulatorPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const [series, setSeries] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  const submitRef = useRef(null)
  const { seconds, start, pause } = useTimer(CO_DURATION, () => submitRef.current?.())

  useEffect(() => {
    const fetchData = async () => {
      const { data: s, error } = await supabase
        .from('series_co')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error || !s) {
        toast.error('Série introuvable')
        navigate('/epreuve/comprehension-orale/series')
        return
      }

      setSeries(s)

      const { data: q } = await supabase
        .from('questions_co')
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
          table_type: 'co',
          series_id: series?.id,
          score,
          total: 699,
          answers,
        })
        .select('id')
        .single()
      if (result) resultId = result.id
    } catch {
      // Sans auth, l'insert peut échouer — on continue quand même
    }

    navigate(`/epreuve/comprehension-orale/resultats/${resultId}`, {
      state: {
        score,
        total: 699,
        questions,
        answers,
        seriesTitle: series?.title || slug,
        seriesSlug: slug,
        timeUsed: CO_DURATION - seconds,
      },
    })
  }, [submitting, questions, answers, series, seconds, pause, navigate, slug])

  useEffect(() => {
    submitRef.current = handleSubmit
  }, [handleSubmit])

  const handleAnswer = (optionIdx) => {
    setAnswers(prev => {
      const next = [...prev]
      next[qIdx] = optionIdx
      return next
    })
    // Auto-advance to next unanswered question
    const nextUnanswered = answers.findIndex((a, i) => i > qIdx && a === null)
    if (nextUnanswered !== -1) {
      setTimeout(() => setQIdx(nextUnanswered), 300)
    }
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleAutoFill = () => {
    setAnswers(questions.map(q => q.correct_answer_index))
  }

  const answeredCount = answers.filter(a => a !== null).length
  const question = questions[qIdx]
  const options = question?.options || []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1A5276] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement de la série...</p>
        </div>
      </div>
    )
  }

  // Écran de démarrage
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎧</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{series?.title}</h1>
        <p className="text-gray-500 mb-8">Compréhension Orale — Entraînement</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            ['⏱️', '35 min', 'Durée'],
            ['❓', questions.length, 'Questions'],
            ['🏆', '699 pts', 'Score max'],
          ].map(([icon, val, label]) => (
            <div key={label} className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-2xl font-extrabold text-gray-900">{val}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left text-sm text-amber-800">
          <p className="font-semibold mb-1">🔊 Règle d'or — Audio unique :</p>
          <ul className="list-disc pl-4 space-y-1 text-amber-700">
            <li>Chaque document audio ne peut être écouté <strong>qu'une seule fois</strong></li>
            <li>Aucun retour arrière possible — concentrez-vous dès le premier passage</li>
            <li>Lisez la question AVANT de lancer l'audio pour anticiper les informations clés</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left text-sm text-blue-800">
          <p className="font-semibold mb-1">💡 Conseils avant de commencer :</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-700">
            <li>Le timer (35 min) démarrera dès que vous cliquerez sur "Commencer"</li>
            <li>Prenez des notes pendant l'écoute (noms, chiffres, actions)</li>
            <li>Les questions C2 (Q36-39) valent 33 pts — concentrez-vous bien sur ces extraits</li>
          </ul>
        </div>

        <button
          onClick={() => { setStarted(true); start() }}
          className="bg-[#1A5276] hover:bg-[#154360] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
        >
          Commencer l'entraînement →
        </button>
        <button
          onClick={() => navigate('/epreuve/comprehension-orale/series')}
          className="block mx-auto mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Retour aux séries
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header barre d'examen */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap items-center justify-between gap-3 sticky top-[64px] z-40">
        <div>
          <h2 className="font-bold text-gray-900 text-sm">{series?.title}</h2>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="w-32 bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-[#1A5276] h-1.5 rounded-full transition-all"
                style={{ width: `${(answeredCount / questions.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">{answeredCount}/{questions.length} réponses</span>
          </div>
        </div>

        <div
          className={`text-xl font-bold font-mono px-4 py-2 rounded-xl ${
            seconds < 180
              ? 'bg-red-100 text-red-700 animate-pulse'
              : seconds < 300
              ? 'bg-orange-100 text-orange-700'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          ⏱ {formatTime(seconds)}
        </div>

        <div className="flex items-center gap-2">
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={handleAutoFill}
              className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
            >
              Dev: Remplir
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-colors ${
              answeredCount === questions.length
                ? 'bg-[#1A5276] text-white hover:bg-[#154360]'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {submitting
              ? '⏳ Envoi...'
              : answeredCount === questions.length
              ? '✓ Terminer'
              : `Terminer (${answeredCount}/${questions.length})`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
        {/* Navigation pastilles */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-[140px]">
          <p className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">Questions</p>
          <div className="grid grid-cols-7 lg:grid-cols-5 gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setQIdx(i)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  i === qIdx
                    ? 'bg-[#1A5276] text-white shadow-md scale-110'
                    : answers[i] !== null
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-1.5 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-[#1A5276]" />
              <span>Actuelle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200" />
              <span>Répondu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100" />
              <span>Non répondu</span>
            </div>
          </div>
        </div>

        {/* Zone de question */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-gray-500 text-sm">
              Question {qIdx + 1} / {questions.length}
            </span>
            {question?.level && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${LEVEL_COLORS[question.level]}`}
              >
                {question.level} · {POINT_SCALE[question.level] || '?'} pts
              </span>
            )}
          </div>

          {/* Audio player */}
          <AudioPlayer audioUrl={question?.audio_url} questionIndex={qIdx} />

          {/* Image optionnelle */}
          {question?.image_url && (
            <img
              src={question.image_url}
              alt=""
              className="w-full max-h-64 object-contain rounded-xl mb-4 border border-gray-100"
            />
          )}

          {/* Prompt */}
          {question?.prompt && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 text-sm text-blue-800 font-medium">
              {question.prompt}
            </div>
          )}

          {/* Texte de la question */}
          {question?.question_text && (
            <p className="font-bold text-gray-900 text-base mb-5">{question.question_text}</p>
          )}

          {/* Options A/B/C/D */}
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              const chosen = answers[qIdx] === i
              const optText =
                typeof opt === 'object' ? opt.text || opt.label || JSON.stringify(opt) : opt
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all hover:shadow-sm ${
                    chosen
                      ? 'border-[#1A5276] bg-blue-50 text-blue-900 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-2 ${
                      chosen ? 'bg-[#1A5276] text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {optText}
                </button>
              )
            })}
          </div>

          {/* Navigation précédente / suivante */}
          <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={() => setQIdx(i => Math.max(0, i - 1))}
              disabled={qIdx === 0}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Précédente
            </button>

            <span className="text-xs text-gray-400 self-center">
              {answeredCount} / {questions.length} répondues
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
