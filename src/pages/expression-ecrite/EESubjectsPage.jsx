import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { FileText, Filter, ChevronDown, Search, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const PAGE_SIZE = 20

// Extract year from month_slug like "2024-01" or "janvier-2025"
function extractYear(monthSlug) {
  if (!monthSlug) return null
  const match = monthSlug.match(/(\d{4})/)
  return match ? match[1] : null
}

// Format month slug for display
function formatMonthSlug(slug) {
  if (!slug) return slug
  // If it looks like "2024-03" format
  const isoMatch = slug.match(/^(\d{4})-(\d{2})$/)
  if (isoMatch) {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
    ]
    const monthIdx = parseInt(isoMatch[2], 10) - 1
    return `${months[monthIdx] || isoMatch[2]} ${isoMatch[1]}`
  }
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export default function EESubjectsPage() {
  const [combinaisons, setCombinaisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [yearFilter, setYearFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('combinaisons_ee')
        .select('id, month_slug, tache1_sujet, tache2_sujet, tache3_titre')
        .order('month_slug', { ascending: false })

      if (error) {
        toast.error('Erreur lors du chargement des sujets')
        setLoading(false)
        return
      }
      setCombinaisons(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const years = useMemo(() => {
    const ySet = new Set(combinaisons.map(c => extractYear(c.month_slug)).filter(Boolean))
    return Array.from(ySet).sort((a, b) => b - a)
  }, [combinaisons])

  const filtered = useMemo(() => {
    let result = combinaisons

    if (yearFilter !== 'all') {
      result = result.filter(c => extractYear(c.month_slug) === yearFilter)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c =>
        c.tache1_sujet?.toLowerCase().includes(q) ||
        c.tache2_sujet?.toLowerCase().includes(q) ||
        c.tache3_titre?.toLowerCase().includes(q) ||
        c.month_slug?.toLowerCase().includes(q)
      )
    }

    return result
  }, [combinaisons, yearFilter, searchQuery])

  // Group by month
  const grouped = useMemo(() => {
    const groups = {}
    filtered.forEach(c => {
      const key = c.month_slug || 'Inconnu'
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    })
    return groups
  }, [filtered])

  const allMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
  const visibleCount = page * PAGE_SIZE

  // Flatten to paginate while grouping
  const allItems = filtered.slice(0, visibleCount)
  const groupedVisible = useMemo(() => {
    const groups = {}
    allItems.forEach(c => {
      const key = c.month_slug || 'Inconnu'
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    })
    return groups
  }, [allItems])

  const visibleMonths = Object.keys(groupedVisible).sort((a, b) => b.localeCompare(a))
  const hasMore = filtered.length > visibleCount

  const handleYearChange = (year) => {
    setYearFilter(year)
    setPage(1)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setPage(1)
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7D3C98] to-[#8E44AD] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/epreuve/expression-ecrite"
            className="inline-flex items-center gap-1.5 text-purple-200 hover:text-white text-sm mb-4 no-underline transition-colors"
          >
            ← Expression Écrite
          </Link>
          <div className="flex items-center gap-4">
            <FileText size={40} className="shrink-0 opacity-90" />
            <div>
              <h1 className="text-3xl font-extrabold mb-1">Sujets d'actualités</h1>
              <p className="text-purple-200 text-sm">
                {loading ? 'Chargement...' : `${combinaisons.length} combinaisons disponibles · 60 min · 3 tâches`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un sujet..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
            />
          </div>

          {/* Year filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleYearChange('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  yearFilter === 'all'
                    ? 'bg-[#7D3C98] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Toutes années
              </button>
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    yearFilter === year
                      ? 'bg-[#7D3C98] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <span className="text-gray-400 text-sm ml-auto shrink-0">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 size={40} className="animate-spin mb-4 text-[#7D3C98]" />
            <p className="text-sm">Chargement des sujets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun résultat</h3>
            <p className="text-gray-500 text-sm mb-4">
              Essayez d'autres termes de recherche ou changez le filtre d'année
            </p>
            <button
              onClick={() => { setSearchQuery(''); setYearFilter('all') }}
              className="bg-[#7D3C98] text-white px-5 py-2 rounded-xl text-sm font-semibold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {visibleMonths.map(monthSlug => (
              <div key={monthSlug} className="mb-8">
                {/* Month header */}
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    {formatMonthSlug(monthSlug)}
                  </h2>
                  <span className="bg-purple-100 text-[#7D3C98] text-xs font-bold px-2.5 py-1 rounded-full">
                    {groupedVisible[monthSlug].length} sujet{groupedVisible[monthSlug].length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedVisible[monthSlug].map(combi => (
                    <CombiCard key={combi.id} combi={combi} />
                  ))}
                </div>
              </div>
            ))}

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="inline-flex items-center gap-2 bg-white border-2 border-[#7D3C98] text-[#7D3C98] hover:bg-purple-50 font-bold px-8 py-3 rounded-xl text-sm transition-colors"
                >
                  <ChevronDown size={16} />
                  Charger plus ({filtered.length - visibleCount} restants)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CombiCard({ combi }) {
  const preview = combi.tache1_sujet
    ? combi.tache1_sujet.substring(0, 100) + (combi.tache1_sujet.length > 100 ? '...' : '')
    : 'Sujet non disponible'

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden group">
      {/* Card header */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 px-4 pt-4 pb-3 border-b border-purple-100">
        <div className="flex items-center justify-between">
          <span className="bg-[#7D3C98] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {formatMonthSlug(combi.month_slug)}
          </span>
          <div className="flex gap-1">
            {['T1', 'T2', 'T3'].map(t => (
              <span
                key={t}
                className="bg-purple-100 text-[#7D3C98] text-xs font-bold px-1.5 py-0.5 rounded"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-4">
        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3">
          <span className="font-semibold text-[#7D3C98]">T1 : </span>
          {preview}
        </p>

        {combi.tache3_titre && (
          <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">
            <span className="font-semibold text-purple-500">T3 : </span>
            {combi.tache3_titre}
          </p>
        )}
      </div>

      {/* Card footer */}
      <div className="px-4 pb-4">
        <Link
          to={`/epreuve/expression-ecrite/simulateur?id=${combi.id}`}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#7D3C98] hover:bg-[#6C3483] text-white font-bold py-2.5 rounded-xl text-sm no-underline transition-colors group-hover:shadow-md"
        >
          ✍️ S'entraîner
        </Link>
      </div>
    </div>
  )
}
