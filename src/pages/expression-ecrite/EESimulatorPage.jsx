import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useTimer } from '../../hooks/useTimer'
import { PenTool, FileText, MessageSquare, Clock, AlertTriangle, ChevronUp, ChevronDown, Upload, Check, BarChart2 } from 'lucide-react'
import toast from 'react-hot-toast'

const EE_DURATION = 60 * 60 // 3600s

const TASKS = [
  { num: 1, label: 'Tâche 1', sublabel: 'Message court', min: 60, max: 120, guide: '60–120 mots', Icon: FileText, color: 'blue' },
  { num: 2, label: 'Tâche 2', sublabel: 'Narration / Blog', min: 120, max: 150, guide: '120–150 mots', Icon: FileText, color: 'blue' },
  { num: 3, label: 'Tâche 3', sublabel: 'Argumentation', min: 120, max: 180, guide: '120–180 mots', Icon: MessageSquare, color: 'indigo' },
]

const SPECIAL_CHARS = [
  ['é', 'è', 'ê', 'ë', 'À'],
  ['à', 'â', 'ä', 'î', 'ï'],
  ['ô', 'ö', 'ù', 'û', 'ü'],
  ['ç', 'œ', 'æ', '«', '»'],
  ['É', 'È', 'Ê', 'Ç', '…'],
]

function countWords(text) {
  if (!text?.trim()) return 0
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function formatMonthSlug(slug) {
  if (!slug) return ''
  const iso = slug.match(/^(\d{4})-(\d{2})$/)
  if (iso) {
    const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
    return `${months[parseInt(iso[2]) - 1]} ${iso[1]}`
  }
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// Circular SVG countdown timer
function CircularTimer({ seconds, total }) {
  const r = 38
  const circ = 2 * Math.PI * r
  const progress = seconds / total
  const offset = circ * (1 - progress)
  const urgent = seconds < 300
  const warning = seconds < 600

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={urgent ? '#ef4444' : warning ? '#f97316' : '#0F3D58'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-sm font-extrabold font-mono ${urgent ? 'text-red-600' : warning ? 'text-orange-500' : 'text-blue-700'}`}>
          {formatTime(seconds)}
        </span>
      </div>
    </div>
  )
}

// Word progress bar
function WordBar({ count, min, max }) {
  const pct = Math.min(100, Math.round((count / max) * 100))
  const inRange = count >= min && count <= max
  const over = count > max
  const barColor = count === 0 ? 'bg-gray-200' : inRange ? 'bg-[#0F3D58]' : over ? 'bg-red-500' : 'bg-[#F98012]'

  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-xs">
        <span className={`font-bold ${count === 0 ? 'text-gray-400' : inRange ? 'text-[#0F3D58]' : over ? 'text-red-600' : 'text-[#F98012]'}`}>
          {count} mots {count > 0 && (inRange ? <Check size={12} className="inline" /> : over ? '(trop long)' : '(trop court)')}
        </span>
        <span className="text-gray-400">{min}–{max} mots</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
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
  const [showSubject, setShowSubject] = useState(true)

  // Refs for textarea cursor position
  const taRef1 = useRef(null)
  const taRef2 = useRef(null)
  const taRef3 = useRef(null)
  const taRefs = { 1: taRef1, 2: taRef2, 3: taRef3 }

  const handleExpire = useCallback(() => {
    if (!submitting) handleSubmit()
  }, [submitting]) // eslint-disable-line

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
    } catch {
      toast.error('Correction IA indisponible — vos textes sont sauvegardés.')
    }

    let submissionId = 'local'
    try {
      const { data: sub } = await supabase
        .from('ee_submissions')
        .insert({ combinaison_id: combinaison?.id, text1: texts[1], text2: texts[2], text3: texts[3], ai_result: aiResult })
        .select('id')
        .single()
      if (sub) submissionId = sub.id
    } catch { /* no auth */ }

    navigate(`/epreuve/expression-ecrite/simulateur/resultats/${submissionId}`, {
      state: { aiResult, texts: [texts[1], texts[2], texts[3]], combinaison },
    })
  }, [submitting, combinaison, texts, navigate])

  // Insert special character at cursor position
  const insertChar = (char) => {
    const ta = taRefs[activeTask].current
    if (!ta) {
      setTexts(prev => ({ ...prev, [activeTask]: prev[activeTask] + char }))
      return
    }
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const current = texts[activeTask]
    const newText = current.slice(0, start) + char + current.slice(end)
    setTexts(prev => ({ ...prev, [activeTask]: newText }))
    requestAnimationFrame(() => {
      ta.setSelectionRange(start + char.length, start + char.length)
      ta.focus()
    })
  }

  const taskSubjects = {
    1: combinaison?.tache1_sujet || '',
    2: combinaison?.tache2_sujet || '',
    3: [combinaison?.tache3_titre, combinaison?.tache3_document1, combinaison?.tache3_document2]
      .filter(Boolean).join('\n\n'),
  }

  // ── No subject selected ──────────────────────────────────────────────────
  if (!id) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4"><PenTool size={48} className="text-[#0F3D58] mx-auto" /></div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">Aucun sujet sélectionné</h2>
        <p className="text-gray-500 mb-6">Choisissez un sujet dans la liste pour commencer.</p>
        <Link to="/epreuve/expression-ecrite/sujets-actualites"
          className="bg-[#0F3D58] hover:bg-[#F98012] hover:text-white text-white px-6 py-3 rounded-xl font-bold no-underline">
          Voir les sujets →
        </Link>
      </div>
    )
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#0F3D58] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ── Start screen ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4"><PenTool size={48} className="text-[#0F3D58] mx-auto" /></div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Simulateur Expression Écrite</h1>
        <p className="text-[#0F3D58] font-semibold text-lg mb-6">{formatMonthSlug(combinaison?.month_slug)}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[['clock', '60 min', 'Durée'], ['filetext', '3 tâches', 'À rédiger'], ['bot', 'Correction IA', 'Résultat']].map(([iconKey, val, label]) => (
            <div key={label} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-2xl mb-1">{iconKey === 'clock' ? <Clock size={24} className="text-[#0F3D58]" /> : iconKey === 'filetext' ? <FileText size={24} className="text-[#0F3D58]" /> : <BarChart2 size={24} className="text-[#0F3D58]" />}</div>
              <div className="text-lg font-extrabold text-gray-900">{val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 text-left space-y-2">
          {TASKS.map(t => (
            <div key={t.num} className="flex items-center gap-3 text-sm">
              <span className="text-lg w-7"><t.Icon size={18} /></span>
              <div>
                <span className="font-bold text-gray-800">{t.label} — {t.sublabel}</span>
                <span className="text-gray-400 ml-2">{t.guide}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-800 text-left">
          <AlertTriangle size={16} className="inline mr-1" /> <strong>Attention :</strong> toute tâche laissée vide entraîne une note éliminatoire (0/20) pour cette tâche.
        </div>

        <button
          onClick={() => { setStarted(true); start() }}
          className="bg-[#0F3D58] hover:bg-[#F98012] hover:text-white text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg transition-colors"
        >
          Commencer (60 min) →
        </button>
        <Link to="/epreuve/expression-ecrite/sujets-actualites"
          className="block mt-4 text-gray-500 hover:text-gray-700 text-sm no-underline">
          ← Choisir un autre sujet
        </Link>
      </div>
    )
  }

  // ── Main simulator ───────────────────────────────────────────────────────
  const currentTask = TASKS[activeTask - 1]
  const wordCounts = { 1: countWords(texts[1]), 2: countWords(texts[2]), 3: countWords(texts[3]) }

  const taskStatus = (n) => {
    const c = wordCounts[n]
    const t = TASKS[n - 1]
    if (c === 0) return 'empty'
    if (c >= t.min && c <= t.max) return 'ok'
    return 'warn'
  }

  const statusColor = { ok: 'text-[#0F3D58]', warn: 'text-[#F98012]', empty: 'text-gray-300' }
  const statusDot = { ok: 'bg-[#0F3D58]', warn: 'bg-[#F98012]', empty: 'bg-gray-200' }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── TOP HEADER ────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Left: title */}
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-gray-900 truncate">
              Expression Écrite — {formatMonthSlug(combinaison?.month_slug)}
            </h1>
            <p className="text-xs text-gray-400">Tâche active : {currentTask.label} · {currentTask.sublabel}</p>
          </div>

          {/* Center: circular timer */}
          <CircularTimer seconds={seconds} total={EE_DURATION} />

          {/* Right: task tabs (compact) */}
          <div className="flex items-center gap-2">
            {TASKS.map(t => {
              const st = taskStatus(t.num)
              return (
                <button key={t.num} onClick={() => setActiveTask(t.num)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    activeTask === t.num ? 'bg-[#0F3D58] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${statusDot[st]}`} />
                  T{t.num}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* ── 3-COLUMN LAYOUT ───────────────────────────────────────────────── */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full px-3 py-4 grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-4 items-start">

        {/* ── LEFT SIDEBAR: Task navigation ─────────────────────────────── */}
        <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:sticky lg:top-[72px]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Navigation</p>

          <div className="space-y-2">
            {TASKS.map(t => {
              const count = wordCounts[t.num]
              const st = taskStatus(t.num)
              const pct = Math.min(100, Math.round((count / t.max) * 100))
              const isActive = activeTask === t.num

              return (
                <button key={t.num} onClick={() => setActiveTask(t.num)}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-[#0F3D58] bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-gray-800">
                      <span><t.Icon size={16} /></span> {t.label}
                    </span>
                    <span className={`text-xs font-bold ${statusColor[st]}`}>
                      {st === 'ok' ? <Check size={12} /> : st === 'warn' ? '!' : '○'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{t.sublabel} · {t.guide}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        st === 'ok' ? 'bg-[#0F3D58]' : st === 'warn' ? 'bg-[#F98012]' : 'bg-gray-200'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${statusColor[st]}`}>
                    {count} / {t.max} mots
                  </p>
                </button>
              )
            })}
          </div>

          {/* Warning box */}
          <div className="mt-4 bg-orange-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs font-bold text-blue-700 mb-1"><AlertTriangle size={14} className="inline mr-1" /> Rappel important</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Toute tâche laissée vide entraîne une note <strong>éliminatoire (0/20)</strong> pour cette partie.
            </p>
          </div>
        </aside>

        {/* ── CENTER: Editor ─────────────────────────────────────────────── */}
        <main className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">

          {/* Task header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-2">
              <span className="text-lg"><currentTask.Icon size={18} /></span>
              <div>
                <h2 className="font-extrabold text-gray-900 text-sm">{currentTask.label} — {currentTask.sublabel}</h2>
                <p className="text-xs text-gray-400">{currentTask.guide} recommandés</p>
              </div>
            </div>
            <button
              onClick={() => setShowSubject(v => !v)}
              className="text-xs text-[#0F3D58] font-semibold hover:underline flex-shrink-0"
            >
              {showSubject ? <><ChevronUp size={14} className="inline mr-1" /> Masquer sujet</> : <><ChevronDown size={14} className="inline mr-1" /> Afficher sujet</>}
            </button>
          </div>

          {/* Subject (collapsible) */}
          {showSubject && (
            <div className="px-5 py-4 border-b border-gray-100 bg-blue-50/40">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Consigne</p>
              <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {taskSubjects[activeTask] || <span className="text-gray-400 italic">Aucun sujet disponible pour cette tâche.</span>}
              </div>
            </div>
          )}

          {/* Textarea */}
          <div className="flex-1 p-5">
            <textarea
              ref={taRefs[activeTask]}
              className="w-full min-h-[320px] h-full border border-gray-200 rounded-xl p-4 text-sm text-gray-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#0F3D58] focus:border-transparent font-sans"
              placeholder={`Rédigez votre texte ici… (${currentTask.guide})`}
              value={texts[activeTask]}
              onChange={e => setTexts(prev => ({ ...prev, [activeTask]: e.target.value }))}
            />

            {/* Word counter bar */}
            <div className="mt-3">
              <WordBar count={wordCounts[activeTask]} min={currentTask.min} max={currentTask.max} />
            </div>
          </div>

          {/* Prev / Next navigation */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/60">
            <button
              onClick={() => setActiveTask(n => Math.max(1, n - 1))}
              disabled={activeTask === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              ← Précédent
            </button>
            <span className="text-xs text-gray-400">Tâche {activeTask} / 3</span>
            <button
              onClick={() => setActiveTask(n => Math.min(3, n + 1))}
              disabled={activeTask === 3}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Suivant →
            </button>
          </div>
        </main>

        {/* ── RIGHT SIDEBAR: Tools ───────────────────────────────────────── */}
        <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:sticky lg:top-[72px] space-y-5">

          {/* Special characters */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Caractères spéciaux</p>
            <div className="space-y-1">
              {SPECIAL_CHARS.map((row, ri) => (
                <div key={ri} className="flex gap-1">
                  {row.map(char => (
                    <button
                      key={char}
                      onClick={() => insertChar(char)}
                      title={char}
                      className="flex-1 py-1.5 bg-gray-50 hover:bg-[#0F3D58] hover:text-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-center">Cliquez pour insérer au curseur</p>
          </div>

          {/* Progress recap */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Progression</p>
            <div className="space-y-3">
              {TASKS.map(t => {
                const count = wordCounts[t.num]
                const st = taskStatus(t.num)
                const pct = Math.min(100, Math.round((count / t.max) * 100))
                return (
                  <div key={t.num}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-gray-700">{t.label}</span>
                      <span className={`font-bold ${statusColor[st]}`}>{count} / {t.max}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          st === 'ok' ? 'bg-[#0F3D58]' : st === 'warn' ? 'bg-[#F98012]' : 'bg-gray-200'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status summary */}
            <div className="mt-3 p-2 bg-gray-50 rounded-lg text-xs text-center text-gray-500">
              {[1,2,3].filter(n => taskStatus(n) === 'ok').length} / 3 tâches dans la plage
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-extrabold py-3.5 rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Correction IA…
              </>
            ) : (
              <>
                <Upload size={16} /> Terminer l'examen
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 text-center -mt-3">
            Vos réponses seront analysées par l'IA
          </p>
        </aside>

      </div>
    </div>
  )
}
