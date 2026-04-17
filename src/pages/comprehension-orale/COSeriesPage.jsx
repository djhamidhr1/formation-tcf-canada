import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function COSeriesPage() {
  const [series, setSeries] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [loadingResult, setLoadingResult] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleViewResult = async (s, res) => {
    setLoadingResult(s.id)
    const { data: questions } = await supabase
      .from('questions_co')
      .select('*')
      .eq('series_id', s.id)
      .order('order_index')
    setLoadingResult(null)
    navigate(`/epreuve/comprehension-orale/resultats/${res.id}`, {
      state: {
        score: res.score,
        total: res.total ?? 699,
        questions: questions || [],
        answers: res.answers || [],
        seriesTitle: s.title || s.slug,
        seriesSlug: s.slug,
      },
    })
  }

  useEffect(() => {
    const fetchAll = async () => {
      const { data: s } = await supabase.from('series_co').select('*').order('order_index')
      setSeries(s || [])
      if (user) {
        const { data: r } = await supabase
          .from('user_results')
          .select('*')
          .eq('user_id', user.id)
          .eq('table_type', 'co')
        setResults(r || [])
      }
      setLoading(false)
    }
    fetchAll()
  }, [user])

  const getResult = (seriesId) => results.find(r => r.series_id === seriesId)

  const filtered =
    filter === 'done'
      ? series.filter(s => getResult(s.id))
      : filter === 'todo'
      ? series.filter(s => !getResult(s.id))
      : series

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Séries Compréhension Orale</h1>
          <p className="text-gray-500 text-sm">
            {series.length} séries disponibles · 39 questions par série
          </p>
        </div>
        <div className="flex gap-2">
          {[
            ['all', 'Toutes'],
            ['todo', 'Non faites'],
            ['done', 'Terminées'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilter(v)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === v
                  ? 'bg-[#1A5276] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎧</div>
          <p className="text-gray-500 text-lg">Aucune série dans cette catégorie.</p>
          <button
            onClick={() => setFilter('all')}
            className="mt-4 text-[#1A5276] font-semibold hover:underline text-sm"
          >
            Voir toutes les séries
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => {
            const res = getResult(s.id)
            return (
              <div
                key={s.id}
                className={`bg-white rounded-xl border-2 p-5 ${
                  res ? 'border-blue-300' : 'border-gray-200'
                } hover:shadow-md transition-all`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-gray-600">Série {s.order_index}</span>
                  {res ? (
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      ✓ {res.score}/{res.total}
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                      39 questions
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎧</span>
                  <h3 className="font-semibold text-gray-900 text-sm">{s.title || s.slug}</h3>
                </div>
                {res && (
                  <div className="flex gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Score: {res.score} pts
                    </span>
                  </div>
                )}
                {res ? (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleViewResult(s, res)}
                      disabled={loadingResult === s.id}
                      className="flex-1 bg-white border-2 border-[#1A5276] text-[#1A5276] hover:bg-blue-50 text-center py-2.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-60"
                    >
                      {loadingResult === s.id ? '⏳' : '📊 Résultats'}
                    </button>
                    <Link
                      to={`/epreuve/comprehension-orale/entrainement/${s.slug}`}
                      className="flex-1 bg-[#1A5276] hover:bg-[#154360] text-white text-center py-2.5 rounded-lg text-xs font-bold no-underline transition-colors"
                    >
                      🔄 Refaire
                    </Link>
                  </div>
                ) : (
                  <Link
                    to={`/epreuve/comprehension-orale/entrainement/${s.slug}`}
                    className="block w-full bg-[#1A5276] hover:bg-[#154360] text-white text-center py-2.5 rounded-lg text-sm font-bold no-underline transition-colors mt-3"
                  >
                    Commencer →
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
