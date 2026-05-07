import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic } from 'lucide-react'
import { supabase } from '../../services/supabase'

const C = { bg: '#FEF9E7', border: '#D4AC0D', btn: '#B7950B', text: '#9A7D0A', light: '#FCF3CF' }

const LABELS = {
  'avril': 'Avril 2026',
  'mars-2026': 'Mars 2026',
  'fvrier-2026': 'Février 2026',
  'httpsstaging-tcf-canada-nextbendevaiepreuveexpression-oralesujets-actualitesjanvier-2026': 'Janvier 2026',
}

function fmtSlug(slug) {
  if (LABELS[slug]) return LABELS[slug]
  const p = slug.split('-')
  if (p.length < 2) return slug
  const yr = p[p.length - 1]
  const mo = p.slice(0, -1).join(' ')
  const clean = mo.charAt(0).toUpperCase() + mo.slice(1)
  return `${clean} ${yr}`
}

export default function ExpressionOralePage() {
  const navigate = useNavigate()
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [sujets, setSujets] = useState([])
  const [selectedSujet, setSelectedSujet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingSujets, setLoadingSujets] = useState(false)
  const [tacheFilter, setTacheFilter] = useState('all')

  useEffect(() => {
    supabase.from('sujets_eo').select('month_slug').then(({ data }) => {
      setMonths([...new Set((data || []).map(r => r.month_slug))])
      setLoading(false)
    })
  }, [])

  const handleSelectMonth = async (slug) => {
    setSelectedMonth(slug); setSelectedSujet(null); setTacheFilter('all'); setLoadingSujets(true)
    const { data } = await supabase.from('sujets_eo').select('*').eq('month_slug', slug).order('id')
    setSujets(data || []); setLoadingSujets(false)
  }

  const byYear = {}
  months.forEach(slug => {
    const lbl = fmtSlug(slug)
    const yr = (lbl.match(/\d{4}/) || [''])[0]
    if (!byYear[yr]) byYear[yr] = []
    byYear[yr].push({ slug, label: lbl })
  })

  const filtered = tacheFilter === 'all' ? sujets : sujets.filter(s => s.tache === parseInt(tacheFilter))

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.btn} 0%, ${C.border} 100%)`, color: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button
            onClick={() => selectedSujet ? setSelectedSujet(null) : selectedMonth ? setSelectedMonth(null) : navigate('/')}
            className="bg-white/20 text-white border-none rounded-lg px-4 py-1.5 cursor-pointer text-sm mb-4 block hover:bg-white/30 transition-colors">
            ← Retour
          </button>
          <div className="flex items-center gap-4">
            <Mic className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-extrabold m-0 mb-1.5 text-white">Expression Orale</h1>
              <p className="m-0 text-yellow-200">
                {selectedSujet
                  ? (selectedSujet.title || '').substring(0, 60) + '...'
                  : selectedMonth
                  ? `${fmtSlug(selectedMonth)} — ${sujets.length} sujets`
                  : `${months.length} mois disponibles · 35 min · 20 pts`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : selectedSujet ? (
          <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 max-w-3xl mx-auto">
            <div className="flex gap-2 mb-4">
              <span className="text-white text-xs font-bold px-3 py-1 rounded-lg" style={{ background: C.btn }}>
                Tâche {selectedSujet.tache}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-5 leading-relaxed" style={{ color: C.text }}>
              {selectedSujet.title}
            </h2>
            {selectedSujet.correction_exemple ? (
              <>
                <h3 className="font-bold mb-3" style={{ color: C.text }}>Exemple de réponse</h3>
                <div className="rounded-xl p-5 leading-relaxed text-sm whitespace-pre-wrap border-l-4"
                  style={{ background: C.bg, borderLeftColor: C.btn }}>
                  {selectedSujet.correction_exemple}
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-sm">Correction non disponible.</div>
            )}
          </div>
        ) : !selectedMonth ? (
          <>
            <h2 className="font-bold text-xl mb-6" style={{ color: C.text }}>Choisissez un mois</h2>
            {Object.keys(byYear).sort().reverse().map(yr => (
              <div key={yr} className="mb-7">
                <h3 className="font-bold text-sm mb-3 pb-2 border-b-2" style={{ color: C.text, borderColor: C.border }}>
                  {yr}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {byYear[yr].map(({ slug, label }) => (
                    <button key={slug} onClick={() => handleSelectMonth(slug)}
                      className="border-2 rounded-xl px-4 py-2 cursor-pointer font-semibold text-sm hover:shadow-md transition-all"
                      style={{ background: C.bg, borderColor: C.border, color: C.text }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : loadingSujets ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="font-bold text-xl m-0" style={{ color: C.text }}>
                {fmtSlug(selectedMonth)}
              </h2>
              <div className="ml-auto flex gap-1.5">
                {['all', '2', '3'].map(t => (
                  <button key={t} onClick={() => setTacheFilter(t)}
                    className="px-3 py-1.5 border-none rounded-lg cursor-pointer font-semibold text-xs transition-colors"
                    style={{
                      background: tacheFilter === t ? C.btn : '#F0F0F0',
                      color: tacheFilter === t ? '#fff' : '#555',
                    }}>
                    {t === 'all' ? 'Toutes' : `Tâche ${t}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {filtered.map(s => (
                <div key={s.id} onClick={() => setSelectedSujet(s)}
                  className="border rounded-xl p-4 cursor-pointer flex items-start gap-3 hover:shadow-sm transition-all"
                  style={{ borderColor: C.border, background: C.bg }}>
                  <span className="text-white text-xs font-bold px-2 py-1 rounded shrink-0"
                    style={{ background: C.btn }}>
                    T{s.tache}
                  </span>
                  <div className="flex-1">
                    <p className="m-0 text-sm text-gray-700 leading-relaxed">{s.title}</p>
                    {s.correction_exemple && (
                      <span className="text-xs text-[#6b8a9a] font-semibold mt-1 block">Correction disponible</span>
                    )}
                  </div>
                  <span className="text-gray-300 text-base">→</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
