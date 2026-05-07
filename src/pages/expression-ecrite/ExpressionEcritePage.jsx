import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenTool } from 'lucide-react'
import { supabase } from '../../services/supabase'

const C = { bg: '#F5EEF8', border: '#164b6b', btn: '#0F3D58', text: '#0F3D58', light: '#EBD5F7' }

export default function ExpressionEcritePage() {
  const navigate = useNavigate()
  const [combinaisons, setCombinaisons] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [monthFilter, setMonthFilter] = useState('all')
  const [tache, setTache] = useState('t1')

  useEffect(() => {
    supabase.from('combinaisons_ee').select('*').order('id')
      .then(({ data }) => { setCombinaisons(data || []); setLoading(false) })
  }, [])

  const months = [...new Set(combinaisons.map(x => x.month_slug))].sort()
  const filtered = monthFilter === 'all' ? combinaisons : combinaisons.filter(x => x.month_slug === monthFilter)

  return (
    <div>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${C.btn} 0%, ${C.border} 100%)`, color: '#fff', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => selected ? setSelected(null) : navigate('/')}
            className="bg-white/20 text-white border-none rounded-lg px-4 py-1.5 cursor-pointer text-sm mb-4 block hover:bg-white/30 transition-colors">
            {selected ? '← Retour' : '← Accueil'}
          </button>
          <div className="flex items-center gap-4">
            <PenTool className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-extrabold m-0 mb-1.5 text-white">Expression Écrite</h1>
              <p className="m-0 text-[#e8f7f8]">
                {selected ? `Combinaison #${selected.id}` : `${combinaisons.length} combinaisons disponibles · 60 min · 20 pts`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-16 text-gray-400">Chargement...</div>
        ) : selected ? (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            {/* Tabs tâches */}
            <div className="flex border-b border-gray-200 px-2">
              {[['t1', 'Tâche 1'], ['t2', 'Tâche 2'], ['t3', 'Tâche 3']].map(([k, l]) => (
                <button key={k} onClick={() => setTache(k)}
                  className={`px-5 py-3 border-none cursor-pointer font-semibold text-sm transition-colors bg-transparent ${
                    tache === k ? `border-b-2 text-[${C.btn}]` : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ borderBottomColor: tache === k ? C.btn : 'transparent', borderBottomWidth: tache === k ? 3 : 0, color: tache === k ? C.btn : undefined }}>
                  {l}
                </button>
              ))}
            </div>

            <div className="p-7">
              {tache === 't1' && (
                <div>
                  <h3 className="font-bold mb-3" style={{ color: C.text }}>Tâche 1 — Sujet</h3>
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 leading-relaxed text-sm border border-gray-200">
                    {selected.tache1_sujet || 'Non disponible'}
                  </div>
                  {selected.tache1_correction && (
                    <>
                      <h3 className="font-bold mb-3" style={{ color: C.text }}>Correction</h3>
                      <div className="rounded-xl p-4 leading-relaxed text-sm whitespace-pre-wrap border-l-4"
                        style={{ background: C.bg, borderLeftColor: C.btn }}>
                        {selected.tache1_correction}
                      </div>
                    </>
                  )}
                </div>
              )}
              {tache === 't2' && (
                <div>
                  <h3 className="font-bold mb-3" style={{ color: C.text }}>Tâche 2 — Sujet</h3>
                  <div className="bg-gray-50 rounded-xl p-4 mb-5 leading-relaxed text-sm border border-gray-200">
                    {selected.tache2_sujet || 'Non disponible'}
                  </div>
                  {selected.tache2_correction && (
                    <>
                      <h3 className="font-bold mb-3" style={{ color: C.text }}>Correction</h3>
                      <div className="rounded-xl p-4 leading-relaxed text-sm whitespace-pre-wrap border-l-4"
                        style={{ background: C.bg, borderLeftColor: C.btn }}>
                        {selected.tache2_correction}
                      </div>
                    </>
                  )}
                </div>
              )}
              {tache === 't3' && (
                <div>
                  <h3 className="font-bold mb-3" style={{ color: C.text }}>Tâche 3 — {selected.tache3_titre}</h3>
                  {selected.tache3_document1 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200 text-sm">
                      <div className="font-semibold text-xs text-gray-500 mb-2">Document 1</div>
                      {selected.tache3_document1.contenu || JSON.stringify(selected.tache3_document1)}
                    </div>
                  )}
                  {selected.tache3_document2 && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200 text-sm">
                      <div className="font-semibold text-xs text-gray-500 mb-2">Document 2</div>
                      {selected.tache3_document2.contenu || JSON.stringify(selected.tache3_document2)}
                    </div>
                  )}
                  {selected.tache3_correction && (
                    <>
                      <h3 className="font-bold mb-3" style={{ color: C.text }}>Correction</h3>
                      <div className="rounded-xl p-4 leading-relaxed text-sm whitespace-pre-wrap border-l-4"
                        style={{ background: C.bg, borderLeftColor: C.btn }}>
                        {selected.tache3_correction}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <h2 className="font-bold text-xl m-0" style={{ color: C.text }}>Combinaisons</h2>
              <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
                className="ml-auto border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option value="all">Tous les mois</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="text-gray-400 text-sm">{filtered.length} combinaisons</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(combi => (
                <div key={combi.id}
                  onClick={() => { setSelected(combi); setTache('t1') }}
                  className="border-2 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all"
                  style={{ borderColor: C.border, background: C.bg }}>
                  <div className="flex justify-between mb-3">
                    <span className="text-white text-xs font-bold px-2 py-0.5 rounded" style={{ background: C.btn }}>
                      {combi.month_slug}
                    </span>
                    <span className="text-gray-400 text-xs">#{combi.id}</span>
                  </div>
                  {combi.tache1_sujet && (
                    <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">
                      <b style={{ color: C.text }}>T1 :</b> {combi.tache1_sujet.substring(0, 80)}...
                    </p>
                  )}
                  {combi.tache2_sujet && (
                    <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                      <b style={{ color: C.text }}>T2 :</b> {combi.tache2_sujet.substring(0, 80)}...
                    </p>
                  )}
                  <div className="flex gap-1.5">
                    {['T1', 'T2', 'T3'].map(t => (
                      <span key={t} className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: C.light, color: C.btn }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
