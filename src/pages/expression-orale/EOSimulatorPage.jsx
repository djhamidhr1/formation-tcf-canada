import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../../services/supabase'
import toast from 'react-hot-toast'

const TASK_CONFIG = {
  2: { prep: 2 * 60, record: 3 * 60 + 30, label: 'Tâche 2', desc: 'Interaction — Question & réponse' },
  3: { prep: 0, record: 4 * 60 + 30, label: 'Tâche 3', desc: 'Point de vue — Argumentation' },
}

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function EOSimulatorPage() {
  const [phase, setPhase] = useState('idle') // idle | loading | prep | recording | review | done
  const [currentTask, setCurrentTask] = useState(2)
  const [subjects, setSubjects] = useState({ 2: null, 3: null })
  const [timeLeft, setTimeLeft] = useState(0)
  const [recordings, setRecordings] = useState({ 2: null, 3: null })
  const [audioUrl, setAudioUrl] = useState(null)
  const [mediaSupported, setMediaSupported] = useState(true)

  const timerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)

  // Check MediaRecorder support
  useEffect(() => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setMediaSupported(false)
    }
  }, [])

  // Fetch random subjects
  const loadSubjects = useCallback(async () => {
    setPhase('loading')
    try {
      const results = {}
      for (const tache of [2, 3]) {
        const { data } = await supabase
          .from('sujets_eo')
          .select('id, title, tache')
          .eq('tache', tache)
          .limit(50)

        if (data && data.length > 0) {
          results[tache] = data[Math.floor(Math.random() * data.length)]
        }
      }
      setSubjects(results)
      setPhase('ready')
    } catch {
      toast.error('Erreur lors du chargement des sujets')
      setPhase('idle')
    }
  }, [])

  // Timer logic
  const startTimer = useCallback((duration, onDone) => {
    clearInterval(timerRef.current)
    setTimeLeft(duration)
    let remaining = duration
    timerRef.current = setInterval(() => {
      remaining -= 1
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current)
        onDone?.()
      }
    }, 1000)
  }, [])

  // Start prep phase for a task
  const startPrep = useCallback((taskNum) => {
    const config = TASK_CONFIG[taskNum]
    setCurrentTask(taskNum)
    if (config.prep > 0) {
      setPhase('prep')
      startTimer(config.prep, () => startRecording(taskNum))
    } else {
      startRecording(taskNum)
    }
  }, [startTimer]) // eslint-disable-line react-hooks/exhaustive-deps

  // Start recording
  const startRecording = useCallback(async (taskNum) => {
    if (!mediaSupported) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecordings(prev => ({ ...prev, [taskNum]: blob }))
        stream.getTracks().forEach(t => t.stop())
        setPhase('review')
      }

      recorder.start()
      setPhase('recording')
      setCurrentTask(taskNum)

      const config = TASK_CONFIG[taskNum]
      startTimer(config.record, () => {
        if (recorder.state === 'recording') recorder.stop()
      })
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        toast.error('Permission microphone refusée. Autorisez l\'accès dans votre navigateur.')
      } else {
        toast.error('Erreur microphone : ' + err.message)
      }
    }
  }, [mediaSupported, startTimer])

  const stopRecording = useCallback(() => {
    clearInterval(timerRef.current)
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const discardRecording = useCallback(() => {
    setAudioUrl(null)
    setRecordings(prev => ({ ...prev, [currentTask]: null }))
    setPhase('ready')
  }, [currentTask])

  const confirmRecording = useCallback(() => {
    if (currentTask === 2) {
      // Move to task 3
      setPhase('ready')
      setCurrentTask(3)
    } else {
      // Done
      setPhase('done')
    }
  }, [currentTask])

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  // No media support
  if (!mediaSupported) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">😕</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Navigateur non compatible</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm text-left">
          <p className="font-semibold mb-2">Votre navigateur ne supporte pas l'enregistrement audio (MediaRecorder API).</p>
          <p>Essayez avec <strong>Chrome</strong>, <strong>Firefox</strong> ou <strong>Edge</strong> à jour.</p>
        </div>
      </div>
    )
  }

  // Idle — welcome screen
  if (phase === 'idle') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎤</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Simulateur Expression Orale</h1>
        <p className="text-gray-500 mb-8">Tâches 2 & 3 avec enregistrement audio</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(TASK_CONFIG).map(([num, cfg]) => (
            <div key={num} className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="font-bold text-gray-900 mb-1">{cfg.label}</div>
              <div className="text-xs text-gray-500 mb-2">{cfg.desc}</div>
              {cfg.prep > 0 && (
                <div className="text-xs text-amber-700">⏱ Préparation : {formatTime(cfg.prep)}</div>
              )}
              <div className="text-xs text-amber-700">🎙 Enregistrement : {formatTime(cfg.record)}</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left text-sm text-blue-800">
          <p className="font-semibold mb-1">💡 Conseils :</p>
          <ul className="list-disc pl-4 space-y-1 text-blue-700">
            <li>Autorisez l'accès au microphone quand le navigateur vous le demande</li>
            <li>Parlez clairement et à un rythme naturel</li>
            <li>Pour la tâche 3 : structurez votre réponse (introduction, arguments, conclusion)</li>
          </ul>
        </div>

        <button
          onClick={loadSubjects}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
        >
          Tirer un sujet aléatoire →
        </button>
      </div>
    )
  }

  // Loading
  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement des sujets...</p>
        </div>
      </div>
    )
  }

  // Done
  if (phase === 'done') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Entraînement terminé !</h1>
        <p className="text-gray-500 mb-8">Vous avez complété les tâches 2 et 3. Continuez à pratiquer régulièrement.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[2, 3].map(n => (
            <div key={n} className={`rounded-xl p-4 border ${recordings[n] ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="font-semibold mb-1">Tâche {n}</div>
              {recordings[n] ? (
                <>
                  <p className="text-xs text-green-700 mb-2">Enregistrement sauvegardé</p>
                  <audio controls src={URL.createObjectURL(recordings[n])} className="w-full" />
                </>
              ) : (
                <p className="text-xs text-gray-500">Non enregistré</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => { setPhase('idle'); setRecordings({ 2: null, 3: null }); setAudioUrl(null) }}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Recommencer
        </button>
      </div>
    )
  }

  const taskNum = phase === 'review' ? currentTask : currentTask
  const config = TASK_CONFIG[taskNum]
  const subject = subjects[taskNum]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Task header */}
      <div className="bg-gradient-to-br from-amber-500 to-yellow-400 rounded-3xl p-6 text-white text-center mb-6">
        <div className="text-sm font-medium text-amber-100 mb-1">{config?.label}</div>
        <h2 className="text-xl font-bold mb-1">{config?.desc}</h2>
        <div className="text-amber-100 text-xs">
          {phase === 'prep' && `Temps de préparation : ${formatTime(timeLeft)}`}
          {phase === 'recording' && `Temps d'enregistrement : ${formatTime(timeLeft)}`}
          {phase === 'review' && 'Enregistrement terminé'}
          {phase === 'ready' && 'Prêt à commencer'}
        </div>
      </div>

      {/* Subject */}
      {subject && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
          <div className="text-xs font-bold text-gray-400 uppercase mb-2">Sujet — {config?.label}</div>
          <p className="text-gray-800 leading-relaxed">{subject.title}</p>
        </div>
      )}

      {/* Timer display */}
      {(phase === 'prep' || phase === 'recording') && (
        <div className={`rounded-2xl p-8 text-center mb-6 ${phase === 'recording' ? 'bg-red-50 border-2 border-red-300' : 'bg-amber-50 border-2 border-amber-300'}`}>
          <div className={`text-5xl font-mono font-bold mb-2 ${timeLeft < 30 ? 'text-red-600 animate-pulse' : phase === 'recording' ? 'text-red-700' : 'text-amber-700'}`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm font-medium text-gray-600">
            {phase === 'prep' ? '⏳ Temps de préparation — Enregistrement commence automatiquement' : '🎙 Enregistrement en cours...'}
          </p>
        </div>
      )}

      {/* Actions */}
      {phase === 'ready' && (
        <div className="text-center">
          <button
            onClick={() => startPrep(currentTask)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            {currentTask === 2 ? '▶ Commencer Tâche 2' : '▶ Commencer Tâche 3'}
          </button>
          {TASK_CONFIG[currentTask].prep > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              {formatTime(TASK_CONFIG[currentTask].prep)} de préparation, puis {formatTime(TASK_CONFIG[currentTask].record)} d'enregistrement
            </p>
          )}
        </div>
      )}

      {phase === 'recording' && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 font-semibold text-sm">Enregistrement en cours</span>
          </div>
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            ⬛ Arrêter l'enregistrement
          </button>
        </div>
      )}

      {phase === 'review' && audioUrl && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Réécouter votre enregistrement</h3>
          <audio controls src={audioUrl} className="w-full mb-4" />
          <div className="flex gap-3">
            <button
              onClick={discardRecording}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              🗑 Recommencer
            </button>
            <button
              onClick={confirmRecording}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              {currentTask === 2 ? 'Continuer → Tâche 3' : '✓ Terminer'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
