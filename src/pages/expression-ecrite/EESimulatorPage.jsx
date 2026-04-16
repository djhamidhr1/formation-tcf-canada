import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useTimer } from '../../hooks/useTimer'
import toast from 'react-hot-toast'

const EE_DURATION = 60 * 60 // 3600 seconds

const WORD_LIMITS = {
  1: { min: 60, max: 120, label: '60–120 mots' },
  2: { min: 120, max: 150, label: '120–150 mots' },
  3: { min: 120, max: 180, label: '120–180 mots' },
}

function countWords(text) {
  if (!text || !text.trim()) return 0
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function formatTime(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function WordCounter({ text, taskNum }) {
  const count = countWords(text)
  const limits = WORD_LIMITS[taskNum]
  const inRange = count >= limits.min && count <= limits.max
  const tooFew = count < limits.min
  const tooMany = count > limits.max
  return (
    <div className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
      count === 0 ? 'bg-gray-100 text-gray-500'
      : inRange ? 'bg-green-100 text-green-700'
      : tooMany ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700'
    }`}>
      {count} mot{count !== 1 ? 's' : ''} · Consigne : {limits.label}
      {count > 0 && (
        <span className="ml-1">
          {inRange ? ' ✓' : tooMany ? ' (trop long)' : ' (trop court)'}
        </span>
      )}
    </div>
  )
}

export default function EESimulatorPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [combinaison, setCombinaison] = useState(null)
  const [loading, setLoading] = useState(!!id)
  const [activeTask, setActiveTask] = useState(1)
  const [texts, setTexts] = useState({ 1: '', 2: '', 3: '' })
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  const handleExpire = useCallback(() => {
    if (!submitting) handleSubmit()
  }, [submitting]) // eslint-disable-line react-hooks/exhaustive-deps

  const { seconds, start } = useTimer(EE_DURATION, handleExpire)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('combinaisons_ee')
        .select('*')
        .eq('id', id)
        .single()
      if (error || !data) {
        toast.error('Sujet introuvable')
        navigate('/epreuve/expression-ecrite/sujets-actualites')
        return
      }
      setCombinaison(data)
      setLoading(false)
    }
    fetchData()
  }, [id, navigate])

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)

    let aiResult = null
    try {
      const { data, error } = await supabase.functions.invoke('correct-ee', {
        body: {
          task1_subject: combinaison?.tache1_sujet || '',
          task1_text: texts[1],
          task2_subject: combinaison?.tache2_sujet || '',
          task2_text: texts[2],
          task3_subject: combinaison?.tache3_titre || '',
          task3_text: texts[3],
        },
      })
      if (error) throw error
      aiResult = data
    } catch (err) {
      toast.error('Erreur lors de la correction IA. Vos textes sont sauvegardés.')
    }

    // Save submission (best effort)
    let submissionId = 'local'
    try {
      const { data: sub } = await supabase
        .from('ee_submissions')
        .insert({
          combinaison_id: combinaison?.id,
          text1: texts[1],
          text2: texts[2],
          text3: texts[3],
          ai_result: aiResult,
        })
        .select('id')
        .single()
      if (sub) submissionId = sub.id
    } catch {
      // No auth or table not set up — continue
    }

    navigate(`/epreuve/expression-ecrite/simulateur/resultats/${submissionId}`, {
      state: {
        aiResult,
        texts: [texts[1], texts[2], texts[3]],
        combinaison,
      },
    })
  }, [submitting, combinaison, texts, navigate])

  if (!id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">✍️</div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Aucun sujet sélectionné</h2>
        <p className="text-gray-500 mb-6">Choisissez un sujet dans la liste pour commencer le simulateur.</p>
        <Link
          to="/epreuve/expression-ecrite/sujets-actualites"
          className="bg-[#7D3C98] hover:bg-[#6C3483] text-white px-6 py-3 rounded-xl font-bold no-underline transition-colors"
        >
          Voir les sujets →
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7D3C98] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement du sujet...</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">✍️</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Simulateur Expression Écrite</h1>
        <p className="text-gray-500 mb-2">{combinaison?.month_slug}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            ['⏱️', '60 min', 'Durée'],
            ['📝', '3 tâches', 'À rédiger'],
            ['🤖', 'Correction IA', 'Résultat'],
          ].map(([icon, val, label]) => (
            <div key={label} className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-xl font-extrabold text-gray-900">{val}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left text-sm text-amber-800">
          <p className="font-semibold mb-2">📋 Consignes de longueur :</p>
          <ul className="space-y-1 text-amber-700">
            <li>• <strong>Tâche 1</strong> : 60–120 mots (message/courriel)</li>
            <li>• <strong>Tâche 2</strong> : 120–150 mots (réponse courte)</li>
            <li>• <strong>Tâche 3</strong> : 120–180 mots (synthèse/argumentation)</li>
          </ul>
        </div>

        <button
          onClick={() => { setStarted(true); start() }}
          className="bg-[#7D3C98] hover:bg-[#6C3483] text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
        >
          Commencer (60 minutes) →
        </button>
        <Link
          to="/epreuve/expression-ecrite/sujets-actualites"
          className="block mt-4 text-gray-500 hover:text-gray-700 text-sm no-underline"
        >
          ← Choisir un autre sujet
        </Link>
      </div>
    )
  }

  const taskSubjects = {
    1: combinaison?.tache1_sujet,
    2: combinaison?.tache2_sujet,
    3: [combinaison?.tache3_titre, combinaison?.tache3_document1, combinaison?.tache3_document2]
      .filter(Boolean).join('\n\n'),
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => setActiveTask(n)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTask === n
                    ? 'bg-[#7D3C98] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tâche {n}
                {texts[n] && (
                  <span className={`ml-1.5 text-xs ${
                    (() => {
                      const c = countWords(texts[n])
                      const l = WORD_LIMITS[n]
                      return c >= l.min && c <= l.max ? 'text-green-400' : 'text-red-300'
                    })()
                  }`}>●</span>
                )}
              </button>
            ))}
          </div>

          <div className={`text-xl font-bold font-mono px-4 py-2 rounded-xl ${
            seconds < 300 ? 'bg-red-100 text-red-700 animate-pulse'
            : seconds < 600 ? 'bg-orange-100 text-orange-700'
            : 'bg-gray-100 text-gray-800'
          }`}>
            ⏱ {formatTime(seconds)}
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#7D3C98] hover:bg-[#6C3483] disabled:opacity-60 text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
          >
            {submitting ? '🤖 Correction IA en cours...' : '✓ Soumettre'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* LEFT — Sujet */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 overflow-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#7D3C98] text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                Tâche {activeTask}
              </span>
              <span className="text-xs text-gray-500">{WORD_LIMITS[activeTask].label}</span>
            </div>
            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
              {taskSubjects[activeTask] || (
                <span className="text-gray-400 italic">Aucun sujet pour cette tâche.</span>
              )}
            </div>
          </div>

          {/* RIGHT — Réponse */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">Votre réponse — Tâche {activeTask}</h3>
              <WordCounter text={texts[activeTask]} taskNum={activeTask} />
            </div>
            <textarea
              className="flex-1 min-h-[300px] lg:min-h-[400px] w-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#7D3C98] focus:border-transparent"
              placeholder={`Rédigez votre réponse ici (${WORD_LIMITS[activeTask].label})...`}
              value={texts[activeTask]}
              onChange={e => setTexts(prev => ({ ...prev, [activeTask]: e.target.value }))}
            />
            <div className="mt-3 flex justify-between text-xs text-gray-400">
              <span>{countWords(texts[activeTask])} mots</span>
              <span>Consigne : {WORD_LIMITS[activeTask].label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
