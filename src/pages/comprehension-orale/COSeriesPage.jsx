import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Headphones, Check } from 'lucide-react'
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
    const { data: questions } = await supabase.from('questions_co').select('*').eq('series_id', s.id).order('order_index')
    setLoadingResult(null)
    navigate(`/epreuve/comprehension-orale/resultats/${res.id}`, {
      state: { score: res.score, total: res.total ?? 699, questions: questions || [], answers: res.answers || [], seriesTitle: s.title || s.slug, seriesSlug: s.slug },
    })
  }

  useEffect(() => {
    const fetchAll = async () => {
      const { data: s } = await supabase.from('series_co').select('*').order('order_index')
      setSeries(s || [])
      if (user) {
        const { data: r } = await supabase.from('user_results').select('*').eq('user_id', user.id).eq('table_type', 'co')
        setResults(r || [])
      }
      setLoading(false)
    }
    fetchAll()
  }, [user])

  const getResult = (seriesId) => results.find(r => r.series_id === seriesId)
  const filtered = filter === 'done' ? series.filter(s => getResult(s.id)) : filter === 'todo' ? series.filter(s => !getResult(s.id)) : series

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div style={{ background: 'linear-gradient(145deg, var(--navy), var(--navy-mid))', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <Link to="/epreuve/comprehension-orale" className="btn-back">&larr; Retour</Link>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', margin: '0 0 6px' }}>Séries Compréhension Orale</h1>
          <p style={{ color: '#FDF2E9', fontSize: 15, margin: 0 }}>{series.length} séries disponibles &middot; 39 questions par série</p>
        </div>
      </div>

      <section style={{ padding: '48px 24px 72px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all', 'Toutes'], ['todo', 'Non faites'], ['done', 'Terminées']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} className={`filter-tab${filter === val ? ' active' : ''}`}>{label}</button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{filtered.length} séries</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(s => {
              const res = getResult(s.id)
              const scorePct = res ? Math.round((res.score / (res.total || 699)) * 100) : 0
              return (
                <div key={s.id} className="serie-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Série {s.order_index}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Headphones size={14} style={{ color: 'var(--orange)', flexShrink: 0 }} /> CO test {s.order_index}
                      </div>
                    </div>
                    {res && (
                      <span className={scorePct >= 80 ? 'badge-score-good' : 'badge-orange'}>{scorePct}%</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>39 questions</span>
                    {res && <span style={{ fontSize: 12, color: 'var(--orange)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Check size={12} /> {res.score}/{res.total || 699} pts</span>}
                  </div>
                  {res && (
                    <div style={{ background: 'var(--surface-2)', borderRadius: 999, height: 4, overflow: 'hidden', marginBottom: 14 }}>
                      <div style={{ width: `${scorePct}%`, height: '100%', background: scorePct >= 80 ? 'var(--orange)' : 'var(--navy)', borderRadius: 999, transition: 'width 0.6s ease' }} />
                    </div>
                  )}
                  {res ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleViewResult(s, res)} disabled={loadingResult === s.id} className="btn-secondary" style={{ opacity: loadingResult === s.id ? 0.6 : 1 }}>
                        {loadingResult === s.id ? '…' : 'Résultats'}
                      </button>
                      <Link to={`/epreuve/comprehension-orale/entrainement/${s.slug}`} className="btn-navy-flex">Recommencer</Link>
                    </div>
                  ) : (
                    <Link to={`/epreuve/comprehension-orale/entrainement/${s.slug}`} className="btn-navy">
                      Commencer →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
