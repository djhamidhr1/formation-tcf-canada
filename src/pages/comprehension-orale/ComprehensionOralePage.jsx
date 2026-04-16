import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'

const C = { bg: '#EBF5FB', border: '#2E86C1', btn: '#1A5276', text: '#1A5276', light: '#D6EAF8' }

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-800',
  A2: 'bg-blue-100 text-blue-800',
  B1: 'bg-yellow-100 text-yellow-800',
  B2: 'bg-orange-100 text-orange-800',
  C1: 'bg-red-100 text-red-800',
  C2: 'bg-purple-100 text-purple-800',
}

function QuestionViewer({ question, idx, total, onPrev, onNext }) {
  const [chosen, setChosen] = useState(null)
  const [revealed, setRevealed] = useState(false)
  useEffect(() => { setChosen(null); setRevealed(false) }, [question?.id])
  if (!question) return null
  const options = question.options || []
  const correct = question.correct_answer_index

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="bg-blue-50 text-[#1A5276] rounded-lg px-3 py-1 font-bold text-sm">
          Question {idx + 1} / {total}
        </span>
        {question.level && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${LEVEL_COLORS[question.level] || ''}`}>
            {question.level}
          </span>
        )}
      </div>

      {question.audio_url && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="text-sm text-[#1A5276] font-bold mb-2">🎧 Enregistrement audio</div>
          <audio controls className="w-full h-9" src={question.audio_url}>
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      )}

      {question.image_url && (
        <img src={question.image_url} alt="" className="w-full max-h-72 object-contain rounded-xl mb-4" />
      )}

      {question.content_html && (
        <div
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: question.content_html }}
        />
      )}

      {question.prompt && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-3 text-sm text-[#1A5276] font-medium">
          {question.prompt}
        </div>
      )}

      {question.question_text && (
        <p className="font-bold text-gray-900 text-base mb-5">{question.question_text}</p>
      )}

      <div className="space-y-2.5">
        {options.map((opt, i) => {
          let cls = 'border-gray-200 bg-white text-gray-800 hover:border-gray-300'
          if (revealed) {
            if (i === correct) cls = 'border-green-500 bg-green-50 text-green-900'
            else if (i === chosen) cls = 'border-red-400 bg-red-50 text-red-800'
          } else if (i === chosen) {
            cls = 'border-[#2E86C1] bg-blue-50 text-[#1A5276]'
          }
          const optText = typeof opt === 'object' ? (opt.text || opt.label || JSON.stringify(opt)) : opt
          return (
            <button key={i} onClick={() => !revealed && setChosen(i)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors ${cls}`}>
              <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>
              {optText}
              {revealed && i === correct && ' ✓'}
              {revealed && i === chosen && i !== correct && ' ✗'}
            </button>
          )
        })}
      </div>

      <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
        <button onClick={onPrev} disabled={idx === 0}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors">
          ← Précédente
        </button>

        {!revealed && chosen !== null && (
          <button onClick={() => setRevealed(true)}
            className="flex-1 py-2.5 bg-[#1A5276] text-white rounded-lg font-bold text-sm hover:bg-[#154360] transition-colors">
            Vérifier ma réponse
          </button>
        )}

        {revealed && question.explanation && (
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
            {question.explanation}
          </div>
        )}

        <button onClick={onNext} disabled={idx === total - 1}
          className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold disabled:opacity-40 hover:bg-gray-50 transition-colors">
          Suivante →
        </button>
      </div>
    </div>
  )
}

export default function ComprehensionOralePage() {
  const navigate = useNavigate()
  const [series, setSeries] = useState([])
  const [selectedSeries, setSelectedSeries] = useState(null)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingQ, setLoadingQ] = useState(false)

  useEffect(() => {
    supabase.from('series_co').select('*').order('order_index')
      .then(({ data }) => { setSeries(data || []); setLoading(false) })
  }, [])

  const handleSelectSeries = useCallback(async (s) => {
    setSelectedSeries(s); setQIdx(0); setLoadingQ(true)
    const { data } = await supabase.from('questions_co').select('*').eq('series_id', s.id).order('order_index')
    setQuestions(data || []); setLoadingQ(false)
  }, [])

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.btn} 0%, ${C.border} 100%)`, color: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button
            onClick={() => selectedSeries ? setSelectedSeries(null) : navigate('/')}
            className="bg-white/20 text-white border-none rounded-lg px-4 py-1.5 cursor-pointer text-sm mb-4 block hover:bg-white/30 transition-colors"
          >
            {selectedSeries ? '← Toutes les séries' : '← Accueil'}
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">🎧</span>
            <div>
              <h1 className="text-3xl font-extrabold m-0 mb-1.5 text-white">Compréhension Orale</h1>
              <p className="m-0 text-blue-200">
                {selectedSeries
                  ? `Série ${selectedSeries.title || selectedSeries.slug} — ${questions.length} questions`
                  : `${series.length} séries disponibles · 35 minutes · 699 pts`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : !selectedSeries ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A5276]">Choisissez une série</h2>
              <Link to="/epreuve/comprehension-orale/astuces"
                className="text-sm text-[#1A5276] font-medium no-underline hover:underline">
                💡 Astuces →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {series.map((s, i) => (
                <div key={s.id} onClick={() => handleSelectSeries(s)}
                  className="border-2 rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                  style={{ borderColor: C.border, background: C.bg }}>
                  <div className="font-bold text-sm mb-1" style={{ color: C.text }}>Série {i + 1}</div>
                  <div className="text-xs text-gray-500 mb-3 truncate">{s.title || s.slug}</div>
                  <button className="w-full text-white border-none rounded-lg py-1.5 font-semibold cursor-pointer text-xs"
                    style={{ background: C.btn }}>
                    S'entraîner →
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : loadingQ ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
            {/* Navigation */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-20">
              <div className="text-xs font-bold text-gray-500 uppercase mb-3">Questions</div>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((_, i) => (
                  <button key={i} onClick={() => setQIdx(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                      i === qIdx ? 'bg-[#1A5276] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <QuestionViewer
              question={questions[qIdx]}
              idx={qIdx}
              total={questions.length}
              onPrev={() => setQIdx(i => Math.max(0, i - 1))}
              onNext={() => setQIdx(i => Math.min(questions.length - 1, i + 1))}
            />
          </div>
        )}
      </div>
    </div>
  )
}
