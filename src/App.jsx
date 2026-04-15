import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import './App.css'

const COULEURS = {
  'comprehension-orale':  { bg: '#EBF5FB', border: '#2E86C1', btn: '#1A5276', text: '#1A5276' },
  'comprehension-ecrite': { bg: '#E9F7EF', border: '#27AE60', btn: '#1E8449', text: '#1E8449' },
  'expression-ecrite':    { bg: '#F5EEF8', border: '#8E44AD', btn: '#7D3C98', text: '#7D3C98' },
  'expression-orale':     { bg: '#FEF9E7', border: '#F1C40F', btn: '#B7950B', text: '#9A7D0A' },
}

function Navbar({ page, setPage }) {
  return (
    <nav style={{ background: '#1A5276', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,.3)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🍁</span>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: 'Inter' }}>TCF Canada</span>
        </button>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: '🎧 C. Orale',  key: 'comprehension-orale' },
            { label: '📖 C. Écrite', key: 'comprehension-ecrite' },
            { label: '✍️ E. Écrite',  key: 'expression-ecrite' },
            { label: '🎤 E. Orale',  key: 'expression-orale' },
          ].map(({ label, key }) => (
            <button key={key} onClick={() => setPage(key)}
              style={{ background: page === key ? '#fff' : 'transparent', color: page === key ? '#1A5276' : '#cde', border: '1px solid', borderColor: page === key ? '#fff' : 'rgba(255,255,255,.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'Inter' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function HomePage({ setPage, epreuves }) {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1A5276 0%, #2E86C1 100%)', color: '#fff', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🍁</div>
        <h1 style={{ fontSize: 42, fontWeight: 800, margin: '0 0 16px', fontFamily: 'Inter' }}>Formation TCF Canada</h1>
        <p style={{ fontSize: 20, opacity: .85, maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Maîtrisez les 4 épreuves du TCF Canada avec nos exercices interactifs et nos stratégies d'experts
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: '⏱', val: '35–60', label: 'min par épreuve' },
            { icon: '❓', val: '39',    label: 'questions/série' },
            { icon: '🏆', val: '699',   label: 'points max' },
            { icon: '📚', val: '4',     label: 'épreuves' },
          ].map(({ icon, val, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,.15)', borderRadius: 12, padding: '16px 24px', minWidth: 120 }}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{val}</div>
              <div style={{ fontSize: 13, opacity: .8 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#1A5276', marginBottom: 40 }}>Les 4 Épreuves</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {epreuves.map(ep => {
            const c = COULEURS[ep.slug] || COULEURS['comprehension-orale']
            return (
              <div key={ep.id} onClick={() => setPage(ep.slug)}
                style={{ background: c.bg, border: `2px solid ${c.border}`, borderRadius: 16, padding: 28, cursor: 'pointer', transition: 'transform .2s' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{ep.icone}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: c.text, margin: '0 0 8px' }}>{ep.nom}</h3>
                <p style={{ fontSize: 14, color: '#555', margin: '0 0 16px', lineHeight: 1.5 }}>{ep.description?.substring(0, 100)}…</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: c.btn, color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{ep.duree_min} min</span>
                  <span style={{ background: c.btn, color: '#fff', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{ep.points_max} pts</span>
                </div>
                <button style={{ marginTop: 16, width: '100%', background: c.btn, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
                  Commencer →
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ background: '#F8F9FA', padding: '48px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1A5276', marginBottom: 24 }}>Contenu disponible</h2>
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['54', "Séries d'entraînement"], ['2 106', 'Questions au total'], ['27', 'Séries C. Orale'], ['27', 'Séries C. Écrite'], ['12', 'Combinaisons E. Écrite']].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#1A5276' }}>{val}</div>
              <div style={{ fontSize: 14, color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ background: '#1A5276', color: '#9BB', padding: '32px 24px', textAlign: 'center', fontSize: 14 }}>
        <p style={{ margin: 0 }}>© 2026 Formation TCF Canada – Pack Ayoub &nbsp;|&nbsp;
          <a href="https://www.formation-tcfcanada.com" style={{ color: '#7FC' }} target="_blank" rel="noreferrer">formation-tcfcanada.com</a>
        </p>
      </footer>
    </div>
  )
}

function EpreuvePage({ slug, setPage }) {
  const [tab, setTab] = useState('series')
  const [series, setSeries] = useState([])
  const [astuces, setAstuces] = useState([])
  const [sujets, setSujets] = useState([])
  const [bareme, setBareme] = useState([])
  const [epreuve, setEpreuve] = useState(null)
  const [loading, setLoading] = useState(true)
  const c = COULEURS[slug] || COULEURS['comprehension-orale']

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: ep } = await supabase.from('epreuves').select('*').eq('slug', slug).single()
      setEpreuve(ep)
      if (ep) {
        const [s, a, sj, b] = await Promise.all([
          supabase.from('series').select('*').eq('epreuve_id', ep.id).order('numero'),
          supabase.from('astuces').select('*').eq('epreuve_id', ep.id).order('ordre'),
          supabase.from('sujets').select('*').eq('epreuve_id', ep.id).order('numero'),
          supabase.from('bareme').select('*').eq('epreuve_id', ep.id).order('q_debut'),
        ])
        setSeries(s.data || [])
        setAstuces(a.data || [])
        setSujets(sj.data || [])
        setBareme(b.data || [])
      }
      setLoading(false)
    }
    load()
    setTab(slug.includes('expression') ? 'sujets' : 'series')
  }, [slug])

  const tabStyle = (t) => ({
    padding: '10px 20px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
    borderBottom: tab === t ? `3px solid ${c.btn}` : '3px solid transparent',
    color: tab === t ? c.btn : '#666', background: 'transparent', fontFamily: 'Inter',
  })

  if (loading) return <div style={{ textAlign: 'center', padding: 80, fontSize: 18, color: '#666' }}>⏳ Chargement…</div>
  if (\!epreuve) return <div style={{ textAlign: 'center', padding: 80 }}>Épreuve non trouvée</div>

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${c.btn} 0%, ${c.border} 100%)`, color: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => setPage('home')} style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', marginBottom: 16, fontSize: 13 }}>← Retour</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 52 }}>{epreuve.icone}</span>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 8px', fontFamily: 'Inter' }}>{epreuve.nom}</h1>
              <p style={{ margin: 0, opacity: .85, maxWidth: 600, lineHeight: 1.5 }}>{epreuve.description}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            {[['Durée', `${epreuve.duree_min} min`], ['Questions', epreuve.nb_questions], ['Points max', epreuve.points_max]].map(([label, val]) => (
              <div key={label} style={{ background: 'rgba(255,255,255,.2)', borderRadius: 10, padding: '10px 18px' }}>
                <div style={{ fontSize: 11, opacity: .7, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 60, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', padding: '0 24px' }}>
          {series.length > 0 && <button style={tabStyle('series')} onClick={() => setTab('series')}>📋 Séries ({series.length})</button>}
          {sujets.length > 0 && <button style={tabStyle('sujets')} onClick={() => setTab('sujets')}>📝 Sujets ({sujets.length})</button>}
          <button style={tabStyle('astuces')} onClick={() => setTab('astuces')}>💡 Astuces ({astuces.length})</button>
          {bareme.length > 0 && <button style={tabStyle('bareme')} onClick={() => setTab('bareme')}>📊 Barème</button>}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {tab === 'series' && (
          <div>
            <h2 style={{ color: c.text, marginBottom: 24 }}>Séries d'entraînement</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {series.map(s => (
                <div key={s.id} style={{ border: `2px solid ${c.border}`, borderRadius: 12, padding: 20, background: c.bg }}>
                  <div style={{ fontWeight: 700, color: c.text, fontSize: 16, marginBottom: 8 }}>{s.titre}</div>
                  <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>{s.nb_questions} questions · {s.points_max} pts</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {['A1','A2','B1','B2','C1','C2'].map(n => (
                      <span key={n} style={{ background: c.btn, color: '#fff', borderRadius: 4, padding: '2px 5px', fontSize: 10, fontWeight: 600 }}>{n}</span>
                    ))}
                  </div>
                  <button style={{ marginTop: 14, width: '100%', background: c.btn, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                    Commencer →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'sujets' && (
          <div>
            <h2 style={{ color: c.text, marginBottom: 24 }}>Sujets disponibles</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {sujets.map(s => (
                <div key={s.id} style={{ border: `2px solid ${c.border}`, borderRadius: 12, padding: 20, background: c.bg }}>
                  <span style={{ background: '#27AE60', color: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>✓ DISPONIBLE</span>
                  <div style={{ fontWeight: 700, color: c.text, fontSize: 16, margin: '10px 0 4px' }}>{s.titre}</div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>{s.mois} {s.annee}</div>
                  <button style={{ width: '100%', background: c.btn, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 0', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
                    Voir le sujet →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'astuces' && (
          <div>
            <h2 style={{ color: c.text, marginBottom: 24 }}>Astuces et Techniques</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {astuces.map(a => (
                <div key={a.id} style={{
                  border: `1px solid ${a.categorie === 'erreur' ? '#E74C3C' : a.categorie === 'conseil' ? '#F39C12' : c.border}`,
                  borderLeft: `5px solid ${a.categorie === 'erreur' ? '#E74C3C' : a.categorie === 'conseil' ? '#F39C12' : c.btn}`,
                  borderRadius: 12, padding: 20,
                  background: a.categorie === 'erreur' ? '#FEF9F9' : a.categorie === 'conseil' ? '#FFFBF0' : c.bg
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 22 }}>{a.emoji}</span>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: a.categorie === 'erreur' ? '#E74C3C' : c.text }}>{a.titre}</h3>
                    <span style={{ marginLeft: 'auto', background: a.categorie === 'erreur' ? '#E74C3C' : a.categorie === 'conseil' ? '#F39C12' : c.btn, color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{a.categorie}</span>
                  </div>
                  <p style={{ margin: 0, color: '#444', lineHeight: 1.6, fontSize: 14 }}>{a.contenu}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'bareme' && (
          <div>
            <h2 style={{ color: c.text, marginBottom: 24 }}>Barème de notation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bareme.map(b => {
                const totalNiveau = b.points_par_question * (b.q_fin - b.q_debut + 1)
                const pct = totalNiveau / 699 * 100
                return (
                  <div key={b.id} style={{ border: `1px solid ${c.border}`, borderRadius: 12, padding: '16px 20px', background: c.bg, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ background: c.btn, color: '#fff', borderRadius: 8, padding: '4px 12px', fontWeight: 700, fontSize: 15, minWidth: 40, textAlign: 'center' }}>{b.niveau}</span>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontWeight: 600, color: c.text, marginBottom: 6, fontSize: 14 }}>Questions {b.q_debut}–{b.q_fin} · {b.description}</div>
                      <div style={{ background: '#ddd', borderRadius: 4, height: 10, overflow: 'hidden' }}>
                        <div style={{ background: c.btn, width: `${pct}%`, height: '100%', borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{pct.toFixed(1)}% du total</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: c.text, fontSize: 20 }}>{b.points_par_question} pts</div>
                      <div style={{ fontSize: 12, color: '#888' }}>/ question</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 18 }}>{totalNiveau} pts</div>
                      <div style={{ fontSize: 12, color: '#888' }}>total niveau</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 24, padding: 20, background: '#EBF5FB', borderRadius: 12, border: '1px solid #2E86C1' }}>
              <strong style={{ color: '#1A5276' }}>💡 Stratégie optimale :</strong>
              <span style={{ color: '#555' }}> Concentrez-vous en priorité sur les niveaux C1 et C2 (questions 30-39) — ils représentent les points les plus importants.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [epreuves, setEpreuves] = useState([])

  useEffect(() => {
    supabase.from('epreuves').select('*').order('ordre').then(({ data }) => setEpreuves(data || []))
  }, [])

  const isEpreuvePage = ['comprehension-orale','comprehension-ecrite','expression-ecrite','expression-orale'].includes(page)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#FAFAFA' }}>
      <Navbar page={page} setPage={setPage} />
      {page === 'home' && <HomePage setPage={setPage} epreuves={epreuves} />}
      {isEpreuvePage   && <EpreuvePage slug={page} setPage={setPage} />}
    </div>
  )
}
