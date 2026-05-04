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
          <Link to="/epreuve/comprehension-orale" style={{ background: 'oklch(100% 0 0 / 0.15)', color: 'white', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, display: 'inline-block', marginBottom: 16, textDecoration: 'none' }}>&larr; Retour</Link>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 6, margin: '0 0 6px' }}>Series Comprehension Orale</h1>
          <p style={{ color: 'oklch(85% 0.04 240)', fontSize: 15, margin: 0 }}>{series.length} series disponibles &middot; 39 questions par serie</p>
        </div>
      </div>

      <section style={{ padding: '48px 24px 72px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['all', 'Toutes'], ['todo', 'Non faites'], ['done', 'Terminees']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)} style={{
                  padding: '8px 18px', fontSize: 13, fontWeight: 700, borderRadius: 8,
                  background: filter === val ? 'var(--co-main)' : 'var(--white)',
                  color: filter === val ? 'white' : 'var(--text-2)',
                  border: filter === val ? 'none' : '1px solid var(--border-med)',
                  transition: 'all 0.15s', cursor: 'pointer',
                }}>{label}</button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{filtered.length} series</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {filtered.map(s => {
              const res = getResult(s.id)
              const scorePct = res ? Math.round((res.score / (res.total || 699)) * 100) : 0
              return (
                <div key={s.id} style={{
                  background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)', padding: 20, transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Serie {s.order_index}</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 6 }}><Headphones size={14} style={{ display: 'inline', flexShrink: 0 }} /> CO test {s.order_index}</div>
                    </div>
                    {res && (
                      <div style={{ background: scorePct >= 80 ? 'var(--co-light)' : 'var(--eo-light)', color: scorePct >= 80 ? 'var(--co-text)' : 'var(--eo-text)', fontWeight: 800, fontSize: 13, padding: '4px 10px', borderRadius: 8 }}>{scorePct}%</div>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>39 questions</span>
                    {res && <span style={{ fontSize: 12, color: 'var(--co-text)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Check size={12} /> {res.score}/{res.total || 699} pts</span>}
                  </div>
                  {res && (
                    <div style={{ background: 'var(--surface-2)', borderRadius: 999, height: 4, overflow: 'hidden', marginBottom: 14 }}>
                      <div style={{ width: `${scorePct}%`, height: '100%', background: scorePct >= 80 ? 'var(--co-main)' : 'var(--eo-main)', borderRadius: 999 }} />
                    </div>
                  )}
                  {res ? (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleViewResult(s, res)} disabled={loadingResult === s.id} style={{
                        flex: 1, background: 'var(--surface-2)', color: 'var(--text-2)', border: 'none', borderRadius: 8, padding: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: loadingResult === s.id ? 0.6 : 1,
                      }}>{loadingResult === s.id ? '...' : 'Resultats'}</button>
                      <Link to={`/epreuve/comprehension-orale/entrainement/${s.slug}`} style={{
                        flex: 1, background: 'var(--co-main)', color: 'white', border: 'none', borderRadius: 8, padding: 9, fontSize: 13, fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                      }}>Recommencer</Link>
                    </div>
                  ) : (
                    <Link to={`/epreuve/comprehension-orale/entrainement/${s.slug}`} style={{
                      display: 'block', width: '100%', background: 'var(--co-main)', color: 'white', borderRadius: 8, padding: 9, fontSize: 13, fontWeight: 700, textAlign: 'center', textDecoration: 'none',
                    }}>Commencer &rarr;</Link>
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
