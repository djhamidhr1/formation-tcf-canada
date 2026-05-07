import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { FileText, Filter, ChevronDown, ChevronUp, Search, Loader2, Eye, EyeOff, PenTool, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const PAGE_SIZE = 20

function extractYear(monthSlug) {
  if (!monthSlug) return null
  const match = monthSlug.match(/(\d{4})/)
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
    const monthIdx = parseInt(isoMatch[2], 10) - 1
    return `${months[monthIdx] || isoMatch[2]} ${isoMatch[1]}`
  }
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

const TACHE_META = [
  { label: 'Tâche 1', type: 'Message court', detail: '60–120 mots · 10 min', color: 'blue' },
  { label: 'Tâche 2', type: 'Narration', detail: '120–150 mots · 20 min', color: 'green' },
  { label: 'Tâche 3', type: 'Synthèse / Rapport', detail: '150–200 mots · 30 min', color: 'orange' },
]

const COLOR_MAP = {
  blue: {
    badge: 'bg-[#e8f7f8] text-[#3a5a6e]',
    border: 'border-[#71C9CE]',
    header: 'bg-[#FDF2E9]',
    corrBtn: 'text-[#6b8a9a] border-[#71C9CE] hover:bg-[#FDF2E9]',
    corrBox: 'bg-[#FDF2E9] border-[#e8e0d8]',
  },
  green: {
    badge: 'bg-[#e8f7f8] text-[#3a5a6e]',
    border: 'border-[#71C9CE]',
    header: 'bg-[#FDF2E9]',
    corrBtn: 'text-[#6b8a9a] border-[#71C9CE] hover:bg-[#FDF2E9]',
    corrBox: 'bg-[#FDF2E9] border-[#e8e0d8]',
  },
  orange: {
    badge: 'bg-[#e8f7f8] text-[#3a5a6e]',
    border: 'border-orange-300',
    header: 'bg-orange-50',
    corrBtn: 'text-[#6b8a9a] border-orange-300 hover:bg-orange-50',
    corrBox: 'bg-orange-50 border-[#e8e0d8]',
  },
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
        .select('id, month_slug, tache1_sujet, tache1_correction, tache2_sujet, tache2_correction, tache3_titre, tache3_document1, tache3_document2, tache3_correction')
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

  const allItems = filtered.slice(0, page * PAGE_SIZE)
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
  const hasMore = filtered.length > page * PAGE_SIZE

  const handleYearChange = (year) => { setYearFilter(year); setPage(1) }
  const handleSearch = (e) => { setSearchQuery(e.target.value); setPage(1) }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0F3D58] to-[#164b6b] text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/epreuve/expression-ecrite"
            className="inline-flex items-center gap-1.5 text-[#e8f7f8] hover:text-white text-sm mb-4 no-underline transition-colors"
          >
            ← Expression Écrite
          </Link>
          <div className="flex items-center gap-4">
            <FileText size={40} className="shrink-0 opacity-90" />
            <div>
              <h1 className="text-3xl font-extrabold mb-1">Sujets d'actualités</h1>
              <p className="text-[#e8f7f8] text-sm">
                {loading ? 'Chargement...' : `${combinaisons.length} combinaisons disponibles · 60 min · 3 tâches`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un sujet..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleYearChange('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${yearFilter === 'all' ? 'bg-[#0F3D58] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Toutes années
              </button>
              {years.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${yearFilter === year ? 'bg-[#0F3D58] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
            <Loader2 size={40} className="animate-spin mb-4 text-[#0F3D58]" />
            <p className="text-sm">Chargement des sujets...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4"><Search size={48} className="text-gray-400 mx-auto" /></div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun résultat</h3>
            <p className="text-gray-500 text-sm mb-4">
              Essayez d'autres termes de recherche ou changez le filtre d'année
            </p>
            <button
              onClick={() => { setSearchQuery(''); setYearFilter('all') }}
              className="bg-[#0F3D58] text-white px-5 py-2 rounded-xl text-sm font-semibold"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            {visibleMonths.map(monthSlug => (
              <div key={monthSlug} className="mb-10">
                {/* Month header */}
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    {formatMonthSlug(monthSlug)}
                  </h2>
                  <span className="bg-[#e8f7f8] text-[#0F3D58] text-xs font-bold px-2.5 py-1 rounded-full">
                    {groupedVisible[monthSlug].length} combinaison{groupedVisible[monthSlug].length !== 1 ? 's' : ''}
                  </span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedVisible[monthSlug].map((combi, idx) => (
                    <CombiCard key={combi.id} combi={combi} number={idx + 1} monthLabel={formatMonthSlug(monthSlug)} />
                  ))}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="inline-flex items-center gap-2 bg-white border-2 border-[#0F3D58] text-[#0F3D58] hover:bg-[#FDF2E9] font-bold px-8 py-3 rounded-xl text-sm transition-colors"
                >
                  <ChevronDown size={16} />
                  Charger plus ({filtered.length - page * PAGE_SIZE} restants)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CombiCard({ combi, number, monthLabel }) {
  const [expanded, setExpanded] = useState(false)
  const [showCorr, setShowCorr] = useState([false, false, false])

  const toggleCorr = (idx) => {
    setShowCorr(prev => prev.map((v, i) => i === idx ? !v : v))
  }

  const taches = [
    { sujet: combi.tache1_sujet, correction: combi.tache1_correction },
    { sujet: combi.tache2_sujet, correction: combi.tache2_correction },
    {
      sujet: combi.tache3_titre,
      correction: combi.tache3_correction,
      doc1: combi.tache3_document1,
      doc2: combi.tache3_document2,
    },
  ]

  return (
    <div className="bg-white rounded-2xl border border-[#e8e0d8] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Card header — click to expand/collapse */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-left focus:outline-none"
      >
        <div className="bg-gradient-to-r from-[#0F3D58] to-[#164b6b] px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-white font-extrabold text-base">Combinaison {number}</span>
            <span className="text-[#e8f7f8] text-xs ml-2 block sm:inline">{monthLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {['T1', 'T2', 'T3'].map(t => (
              <span key={t} className="bg-white/25 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
            {expanded
              ? <ChevronUp size={16} className="text-white ml-1" />
              : <ChevronDown size={16} className="text-white ml-1" />
            }
          </div>
        </div>
      </button>

      {/* Collapsed preview */}
      {!expanded && (
        <div className="px-4 py-4 flex flex-col gap-3 flex-1">
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
            <span className="font-semibold text-[#3a5a6e]">T1 : </span>
            {combi.tache1_sujet
              ? combi.tache1_sujet.substring(0, 130) + (combi.tache1_sujet.length > 130 ? '…' : '')
              : 'Sujet non disponible'}
          </p>
          <Link
            to={`/epreuve/expression-ecrite/simulateur?id=${combi.id}`}
            className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-[#0F3D58] text-[#0F3D58] hover:bg-[#F98012] hover:border-[#F98012] hover:text-white font-bold py-2.5 rounded-xl text-sm no-underline transition-all"
          >
            <PenTool size={14} className="inline mr-1" /> S'entraîner
          </Link>
        </div>
      )}

      {/* Expanded — full tasks */}
      {expanded && (
        <div className="flex flex-col flex-1">
          <div className="divide-y divide-gray-100">
            {taches.map((tache, idx) => {
              const meta = TACHE_META[idx]
              const c = COLOR_MAP[meta.color]
              return (
                <div key={idx} className={`border-l-4 ${c.border}`}>
                  {/* Task header */}
                  <div className={`${c.header} px-4 py-2 flex flex-wrap items-center gap-2`}>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.badge}`}>
                      {meta.label}
                    </span>
                    <span className="text-gray-600 text-xs font-semibold">{meta.type}</span>
                    <span className="text-gray-400 text-xs ml-auto">{meta.detail}</span>
                  </div>

                  {/* Task body */}
                  <div className="px-4 py-3">
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {tache.sujet || 'Sujet non disponible'}
                    </p>

                    {/* Documents for T3 */}
                    {idx === 2 && tache.doc1 && (
                      <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-gray-800">Document 1 :</span>
                        <br />{tache.doc1}
                      </div>
                    )}
                    {idx === 2 && tache.doc2 && (
                      <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                        <span className="font-semibold text-gray-800">Document 2 :</span>
                        <br />{tache.doc2}
                      </div>
                    )}

                    {/* Correction toggle */}
                    {tache.correction && (
                      <button
                        onClick={() => toggleCorr(idx)}
                        className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold border rounded-lg px-3 py-1.5 transition-colors ${c.corrBtn}`}
                      >
                        {showCorr[idx] ? <EyeOff size={12} /> : <Eye size={12} />}
                        {showCorr[idx] ? 'Masquer la correction' : 'Voir la correction'}
                      </button>
                    )}

                    {showCorr[idx] && tache.correction && (
                      <div className={`mt-2 p-3 rounded-xl border text-xs text-gray-700 leading-relaxed whitespace-pre-line ${c.corrBox}`}>
                        <span className="font-bold text-[#3a5a6e] block mb-1"><Check size={14} className="inline mr-1" /> Correction :</span>
                        {tache.correction}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* S'entraîner button */}
          <div className="px-4 py-4 mt-auto">
            <Link
              to={`/epreuve/expression-ecrite/simulateur?id=${combi.id}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-[#0F3D58] text-[#0F3D58] hover:bg-[#F98012] hover:border-[#F98012] hover:text-white font-bold py-2.5 rounded-xl text-sm no-underline transition-all"
            >
              <PenTool size={14} className="inline mr-1" /> S'entraîner
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
