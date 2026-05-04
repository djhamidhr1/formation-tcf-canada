import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../services/supabase'
import { Mic, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const YEARS = ['2026', '2025', '2024', '2023']

const TASK_DURATIONS = {
  1: '1–2 min',
  2: '3 min 30',
  3: '4 min 30',
}

const TASK_COLORS = {
  1: 'bg-blue-50 text-blue-800 border-blue-200',
  2: 'bg-blue-100 text-blue-800 border-blue-200',
  3: 'bg-blue-50 text-blue-800 border-blue-200',
}

function extractYear(slug) {
  if (!slug) return null
  const match = slug.match(/(\d{4})/)
  return match ? match[1] : null
}

function formatMonthSlug(slug) {
  if (!slug) return slug
  const isoMatch = slug.match(/^(\d{4})-(\d{2})$/)
  if (isoMatch) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ]
    const idx = parseInt(isoMatch[2], 10) - 1
    return `${months[idx] || isoMatch[2]} ${isoMatch[1]}`
  }
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function SubjectCard({ sujet }) {
  const [showCorrection, setShowCorrection] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm text-gray-800 leading-relaxed flex-1">{sujet.title}</p>
        <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg border ${TASK_COLORS[sujet.tache] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
          T{sujet.tache} · {TASK_DURATIONS[sujet.tache] || '—'}
        </span>
      </div>

      {sujet.correction_exemple && (
        <div>
          <button
            onClick={() => setShowCorrection(!showCorrection)}
            className="text-xs font-medium text-blue-700 hover:text-amber-900 underline transition-colors"
          >
            {showCorrection ? 'Masquer la correction' : 'Voir la correction →'}
          </button>
          {showCorrection && (
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-amber-900 leading-relaxed">
              {sujet.correction_exemple}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function EOSubjectsPage() {
  const [sujets, setSujets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState('2026')
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [activeTask, setActiveTask] = useState(2)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('sujets_eo')
        .select('id, month_slug, tache, title, correction_exemple')
        .order('month_slug', { ascending: false })

      if (error) {
        toast.error('Erreur lors du chargement des sujets')
        setLoading(false)
        return
      }
      setSujets(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  // Group months by year
  const monthsByYear = useMemo(() => {
    const map = {}
    const seen = new Set()
    sujets.forEach(s => {
      const year = extractYear(s.month_slug)
      if (!year) return
      if (!map[year]) map[year] = []
      if (!seen.has(s.month_slug)) {
        map[year].push(s.month_slug)
        seen.add(s.month_slug)
      }
    })
    return map
  }, [sujets])

  const monthsForYear = monthsByYear[selectedYear] || []

  // Auto-select first month when year changes
  useEffect(() => {
    if (monthsForYear.length > 0) {
      setSelectedMonth(monthsForYear[0])
    } else {
      setSelectedMonth(null)
    }
  }, [selectedYear, monthsForYear.join(',')])

  const filteredSujets = useMemo(() => {
    if (!selectedMonth) return []
    return sujets.filter(s => s.month_slug === selectedMonth && s.tache === activeTask)
  }, [sujets, selectedMonth, activeTask])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement des sujets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-blue-400 rounded-3xl p-8 text-white text-center mb-8">
        <div className="text-4xl mb-2"><Mic size={40} className="mx-auto" /></div>
        <h1 className="text-3xl font-extrabold mb-2">Sujets Expression Orale</h1>
        <p className="text-blue-100 text-sm">{sujets.length} sujets disponibles · 2023–2026</p>
      </div>

      {/* Year selector */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-sm font-semibold text-gray-600">Année :</span>
        {YEARS.map(year => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
              selectedYear === year
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Month cards */}
      {monthsForYear.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3"><Calendar size={40} className="text-gray-400 mx-auto" /></div>
          <p>Aucun sujet disponible pour {selectedYear}.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {monthsForYear.map(slug => (
              <button
                key={slug}
                onClick={() => setSelectedMonth(slug)}
                className={`py-3 px-3 rounded-xl text-sm font-semibold text-center transition-all ${
                  selectedMonth === slug
                    ? 'bg-blue-500 text-white shadow-md scale-105'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {formatMonthSlug(slug)}
              </button>
            ))}
          </div>

          {selectedMonth && (
            <>
              {/* Task tabs */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm font-semibold text-gray-600 mr-1">Tâche :</span>
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => setActiveTask(n)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      activeTask === n
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tâche {n}
                    <span className="ml-1 text-xs opacity-75">({TASK_DURATIONS[n]})</span>
                  </button>
                ))}
              </div>

              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">
                  {formatMonthSlug(selectedMonth)} — Tâche {activeTask}
                </h2>
                <span className="text-xs text-gray-400">{filteredSujets.length} sujet{filteredSujets.length !== 1 ? 's' : ''}</span>
              </div>

              {filteredSujets.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl">
                  <p className="text-sm">Aucun sujet pour cette tâche en {formatMonthSlug(selectedMonth)}.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSujets.map(s => (
                    <SubjectCard key={s.id} sujet={s} />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
