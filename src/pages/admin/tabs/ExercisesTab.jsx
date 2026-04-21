import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../../../services/supabase'
import toast from 'react-hot-toast'
import {
  BookOpen, Mic, FileText, Volume2, Plus, Edit2, Trash2, ChevronRight,
  ChevronLeft, Save, X, Upload, CheckCircle, RefreshCw, Search,
  Bold, Italic, List, Hash, AlignLeft, Type, Heading,
  ArrowUpDown, Eye, ChevronDown, ChevronUp,
} from 'lucide-react'

/* ── helpers ── */
function extractYear(s) { const m = s?.match(/(\d{4})/); return m ? m[1] : '—' }
function fmtMonth(slug) {
  if (!slug) return slug
  const m = slug.match(/^(\d{4})-(\d{2})$/)
  if (m) {
    const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
    return `${MONTHS[parseInt(m[2])-1]} ${m[1]}`
  }
  return slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
}
function normalizeOptions(opts) {
  if (!Array.isArray(opts)) return ['','','','']
  return opts.map(o => (typeof o === 'object' ? o.text || o.label || '' : o))
}
const LEVELS = ['A1','A2','B1','B2','C1','C2']
const LETTER = ['A','B','C','D']

/* ── Rich Editor ── */
function RichEditor({ value, onChange, rows = 4, placeholder }) {
  const ref = useRef(null)
  const insert = (b, a='') => {
    const el = ref.current; if (!el) return
    const s = el.selectionStart, e = el.selectionEnd, sel = value.slice(s,e)
    onChange(value.slice(0,s) + b + (sel||'texte') + a + value.slice(e))
    setTimeout(() => { el.selectionStart=s+b.length; el.selectionEnd=s+b.length+(sel||'texte').length; el.focus() },0)
  }
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-300">
      <div className="flex gap-1 px-2 py-1 bg-gray-50 border-b border-gray-200">
        {[[Bold,'**','**'],[Italic,'_','_'],[Heading,'\n## ',''],[List,'\n- ',''],[Hash,'\n1. ',''],[AlignLeft,'\n> ',''],[Type,'<u>','</u>']].map(([Icon,b,a],i)=>(
          <button key={i} type="button" onClick={()=>insert(b,a)} className="p-1 rounded hover:bg-gray-200 text-gray-500"><Icon size={12}/></button>
        ))}
      </div>
      <textarea ref={ref} value={value||''} onChange={e=>onChange(e.target.value)} rows={rows}
        placeholder={placeholder} className="w-full px-3 py-2 text-sm text-gray-700 resize-y focus:outline-none bg-white"/>
    </div>
  )
}

/* ── Search ── */
function SearchBox({ value, onChange }) {
  return (
    <div className="relative">
      <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
      <input type="text" value={value} onChange={e=>onChange(e.target.value)}
        placeholder="Rechercher…" className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-300"/>
    </div>
  )
}

/* ── Modal ── */
function Modal({ title, onClose, children, wide }) {
  useEffect(()=>{ const h=e=>{ if(e.key==='Escape') onClose() }; window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h) },[onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide?'max-w-2xl':'max-w-lg'} max-h-[92vh] overflow-y-auto`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="font-extrabold text-gray-900 text-sm">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X size={15}/></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function Confirm({ msg, onOk, onCancel }) {
  return (
    <Modal title="Confirmation" onClose={onCancel}>
      <p className="text-sm text-gray-600 mb-5">{msg}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
        <button onClick={onOk} className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">Supprimer</button>
      </div>
    </Modal>
  )
}

/* ══════════════════════════════════════
   SECTION CE / CO — SERIES + QUESTIONS
══════════════════════════════════════ */
function SeriesSection({ type }) {
  const isCO = type === 'co'
  const seriesTable = isCO ? 'series_co' : 'series_ce'
  const questionsTable = isCO ? 'questions_co' : 'questions_ce'

  const [series, setSeries] = useState([])
  const [questions, setQuestions] = useState([])
  const [qCounts, setQCounts] = useState({})
  const [selectedSeries, setSelectedSeries] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qLoading, setQLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [qSearch, setQSearch] = useState('')
  const [modal, setModal] = useState(null) // 'addSeries'|'editSeries'|'delSeries'|'addQ'|'editQ'|'delQ'
  const [current, setCurrent] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Series form
  const [sf, setSf] = useState({ title:'', slug:'', order_index:'' })
  // Question form
  const [qf, setQf] = useState({ order_index:'', level:'A1', question_text:'', content_html:'', prompt:'', audio_url:'', image_url:'', options:['','','',''], correct_answer_index:0, explanation:'' })

  /* ── load series ── */
  const loadSeries = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from(seriesTable).select('*').order('order_index', { ascending: true })
    setSeries(data || [])
    // question counts
    const { data: qData } = await supabase.from(questionsTable).select('series_id')
    const counts = {}
    ;(qData||[]).forEach(q => { counts[q.series_id] = (counts[q.series_id]||0)+1 })
    setQCounts(counts)
    setLoading(false)
  }, [seriesTable, questionsTable])

  useEffect(() => { loadSeries() }, [loadSeries])

  /* ── load questions ── */
  const loadQuestions = useCallback(async (seriesId) => {
    setQLoading(true)
    const { data } = await supabase.from(questionsTable).select('*').eq('series_id', seriesId).order('order_index', { ascending: true })
    setQuestions(data || [])
    setQLoading(false)
  }, [questionsTable])

  useEffect(() => { if (selectedSeries) loadQuestions(selectedSeries.id) }, [selectedSeries, loadQuestions])

  /* ── audio/image upload ── */
  const uploadFile = async (file, field) => {
    setUploading(true)
    const path = `admin/${type}/${Date.now()}_${file.name}`
    const bucket = isCO ? 'audios-co' : 'audios-co'
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) { toast.error('Upload échoué'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    setQf(f => ({ ...f, [field]: publicUrl }))
    toast.success('Fichier uploadé ✓')
    setUploading(false)
  }

  /* ── save series ── */
  const saveSeries = async () => {
    const payload = { title: sf.title, slug: sf.slug, order_index: parseInt(sf.order_index)||0 }
    if (modal === 'addSeries') {
      const { error } = await supabase.from(seriesTable).insert([payload])
      if (error) { toast.error(error.message); return }
      toast.success('Série ajoutée ✓')
    } else {
      const { error } = await supabase.from(seriesTable).update(payload).eq('id', current.id)
      if (error) { toast.error(error.message); return }
      toast.success('Série mise à jour ✓')
    }
    setModal(null); loadSeries()
  }

  /* ── delete series ── */
  const deleteSeries = async () => {
    const { error } = await supabase.from(seriesTable).delete().eq('id', current.id)
    if (error) { toast.error(error.message); return }
    toast.success('Série supprimée')
    setModal(null)
    if (selectedSeries?.id === current.id) setSelectedSeries(null)
    loadSeries()
  }

  /* ── save question ── */
  const saveQuestion = async () => {
    const options = qf.options.map(o => o.trim())
    const payload = {
      series_id: selectedSeries.id,
      order_index: parseInt(qf.order_index)||0,
      level: qf.level,
      question_text: qf.question_text,
      content_html: qf.content_html,
      prompt: qf.prompt,
      audio_url: qf.audio_url,
      image_url: qf.image_url,
      options,
      correct_answer_index: parseInt(qf.correct_answer_index),
      explanation: qf.explanation,
    }
    if (modal === 'addQ') {
      const { error } = await supabase.from(questionsTable).insert([payload])
      if (error) { toast.error(error.message); return }
      toast.success('Question ajoutée ✓')
    } else {
      const { error } = await supabase.from(questionsTable).update(payload).eq('id', current.id)
      if (error) { toast.error(error.message); return }
      toast.success('Question mise à jour ✓')
    }
    setModal(null); loadQuestions(selectedSeries.id); loadSeries()
  }

  /* ── delete question ── */
  const deleteQuestion = async () => {
    const { error } = await supabase.from(questionsTable).delete().eq('id', current.id)
    if (error) { toast.error(error.message); return }
    toast.success('Question supprimée')
    setModal(null); loadQuestions(selectedSeries.id); loadSeries()
  }

  const openEditSeries = s => { setCurrent(s); setSf({ title: s.title||'', slug: s.slug||'', order_index: s.order_index||'' }); setModal('editSeries') }
  const openAddQ = () => { setCurrent(null); setQf({ order_index: (questions.length+1)+'', level:'A1', question_text:'', content_html:'', prompt:'', audio_url:'', image_url:'', options:['','','',''], correct_answer_index:0, explanation:'' }); setModal('addQ') }
  const openEditQ = q => {
    setCurrent(q)
    setQf({ order_index: q.order_index||'', level: q.level||'A1', question_text: q.question_text||'', content_html: q.content_html||'', prompt: q.prompt||'', audio_url: q.audio_url||'', image_url: q.image_url||'', options: normalizeOptions(q.options), correct_answer_index: q.correct_answer_index||0, explanation: q.explanation||'' })
    setModal('editQ')
  }

  const filteredSeries = series.filter(s => !search || s.title?.toLowerCase().includes(search.toLowerCase()) || s.slug?.toLowerCase().includes(search.toLowerCase()) || String(s.order_index).includes(search))
  const filteredQ = questions.filter(q => !qSearch || q.question_text?.toLowerCase().includes(qSearch.toLowerCase()) || q.prompt?.toLowerCase().includes(qSearch.toLowerCase()) || String(q.order_index).includes(qSearch))

  const LEVEL_COLORS = { A1:'bg-gray-100 text-gray-600', A2:'bg-blue-100 text-blue-600', B1:'bg-green-100 text-green-700', B2:'bg-yellow-100 text-yellow-700', C1:'bg-orange-100 text-orange-700', C2:'bg-red-100 text-red-700' }

  return (
    <div className="space-y-4">
      {/* ── Series panel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          <h3 className="font-extrabold text-gray-800 text-sm">
            {isCO ? '🎧 Compréhension Orale' : '📖 Compréhension Écrite'} — {series.length} séries
          </h3>
          <div className="flex-1 min-w-[180px]"><SearchBox value={search} onChange={setSearch}/></div>
          <button onClick={()=>loadSeries()} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400"><RefreshCw size={13}/></button>
          <button onClick={()=>{ setSf({ title:'', slug:'', order_index: (series.length+1)+'' }); setModal('addSeries') }}
            className="flex items-center gap-1.5 bg-[#7D3C98] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#6C3483]">
            <Plus size={13}/> Nouvelle série
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-extrabold text-gray-400 uppercase w-20">Test #</th>
                  <th className="px-4 py-2.5 text-left text-xs font-extrabold text-gray-400 uppercase">Titre</th>
                  <th className="px-4 py-2.5 text-left text-xs font-extrabold text-gray-400 uppercase">Slug</th>
                  <th className="px-4 py-2.5 text-center text-xs font-extrabold text-gray-400 uppercase w-24">Questions</th>
                  <th className="px-4 py-2.5 text-right text-xs font-extrabold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSeries.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-xs text-gray-400">Aucune série</td></tr>}
                {filteredSeries.map(s => (
                  <tr key={s.id} className={`hover:bg-purple-50/30 transition-colors cursor-pointer ${selectedSeries?.id===s.id?'bg-purple-50 border-l-2 border-purple-400':''}`}
                    onClick={()=>setSelectedSeries(selectedSeries?.id===s.id?null:s)}>
                    <td className="px-4 py-2.5">
                      <span className="bg-purple-100 text-purple-700 font-extrabold text-xs px-2 py-0.5 rounded-lg">Test {s.order_index}</span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-gray-800 max-w-[200px] truncate">{s.title||'—'}</td>
                    <td className="px-4 py-2.5 text-gray-400 text-xs font-mono max-w-[200px] truncate">{s.slug}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${(qCounts[s.id]||0)>0?'bg-green-100 text-green-700':'bg-gray-100 text-gray-400'}`}>
                        {qCounts[s.id]||0}
                      </span>
                    </td>
                    <td className="px-4 py-2.5" onClick={e=>e.stopPropagation()}>
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={()=>openEditSeries(s)} className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600" title="Modifier la série"><Edit2 size={13}/></button>
                        <button onClick={()=>{ setCurrent(s); setModal('delSeries') }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500" title="Supprimer la série"><Trash2 size={13}/></button>
                        <button onClick={()=>setSelectedSeries(selectedSeries?.id===s.id?null:s)}
                          className="flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-semibold hover:bg-purple-100">
                          Questions {selectedSeries?.id===s.id ? <ChevronUp size={11}/> : <ChevronRight size={11}/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Questions panel ── */}
      {selectedSeries && (
        <div className="bg-white rounded-2xl border border-purple-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-purple-100 bg-purple-50 flex items-center gap-3 flex-wrap">
            <button onClick={()=>setSelectedSeries(null)} className="p-1 rounded hover:bg-purple-100 text-purple-600"><ChevronLeft size={15}/></button>
            <div>
              <h3 className="font-extrabold text-purple-800 text-sm">Test {selectedSeries.order_index} — {selectedSeries.title}</h3>
              <p className="text-xs text-purple-500">{questions.length} question{questions.length!==1?'s':''} · {isCO?'39 attendues':'39 attendues'}</p>
            </div>
            <div className="flex-1 min-w-[160px]"><SearchBox value={qSearch} onChange={setQSearch}/></div>
            <button onClick={openAddQ} className="flex items-center gap-1.5 bg-purple-700 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-purple-800">
              <Plus size={13}/> Ajouter une question
            </button>
          </div>

          {qLoading ? (
            <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"/></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase w-16">Q #</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase w-16">Niveau</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Question / Prompt</th>
                    {isCO && <th className="px-4 py-2 text-center text-xs font-extrabold text-gray-400 uppercase w-16">Audio</th>}
                    <th className="px-4 py-2 text-center text-xs font-extrabold text-gray-400 uppercase w-20">Réponse</th>
                    <th className="px-4 py-2 text-right text-xs font-extrabold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredQ.length===0 && <tr><td colSpan={isCO?6:5} className="py-6 text-center text-xs text-gray-400">Aucune question — cliquez "Ajouter une question"</td></tr>}
                  {filteredQ.map(q => {
                    const opts = normalizeOptions(q.options)
                    const correct = opts[q.correct_answer_index]
                    return (
                      <tr key={q.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-xs font-bold text-gray-500">Q{q.order_index}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${LEVEL_COLORS[q.level]||'bg-gray-100 text-gray-500'}`}>{q.level}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-700 max-w-[300px]">
                          <p className="text-xs truncate">{q.prompt||q.question_text||q.content_html?.replace(/<[^>]+>/g,' ')||'—'}</p>
                        </td>
                        {isCO && <td className="px-4 py-2.5 text-center">{q.audio_url?<span className="text-green-500 text-xs font-bold">✓</span>:<span className="text-gray-300 text-xs">—</span>}</td>}
                        <td className="px-4 py-2.5 text-center">
                          <span className="bg-green-100 text-green-700 text-xs font-extrabold px-2 py-0.5 rounded-full">
                            {LETTER[q.correct_answer_index]||'?'}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={()=>openEditQ(q)} className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600"><Edit2 size={13}/></button>
                            <button onClick={()=>{ setCurrent(q); setModal('delQ') }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MODALS ── */}

      {/* Add/Edit Series */}
      {(modal==='addSeries'||modal==='editSeries') && (
        <Modal title={modal==='addSeries'?'Nouvelle série':'Modifier la série'} onClose={()=>setModal(null)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Numéro (order_index) <span className="text-red-400">*</span></label>
              <input type="number" value={sf.order_index} onChange={e=>setSf(f=>({...f,order_index:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="ex: 41"/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Titre</label>
              <input type="text" value={sf.title} onChange={e=>setSf(f=>({...f,title:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder={isCO?'Compréhension Orale Test 41':'Compréhension Écrite Test 41'}/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Slug (URL)</label>
              <input type="text" value={sf.slug} onChange={e=>setSf(f=>({...f,slug:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-300"
                placeholder={isCO?'comprehension-orale-test-41':'comprehension-ecrite-test-41'}/>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={()=>setModal(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveSeries} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#7D3C98] text-white rounded-xl font-bold hover:bg-[#6C3483]">
                <Save size={13}/> Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Series */}
      {modal==='delSeries' && <Confirm msg={`Supprimer la série "${current?.title}" et toutes ses questions ?`} onOk={deleteSeries} onCancel={()=>setModal(null)}/>}

      {/* Add/Edit Question */}
      {(modal==='addQ'||modal==='editQ') && (
        <Modal title={modal==='addQ'?'Nouvelle question':'Modifier la question'} onClose={()=>setModal(null)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">N° de question</label>
                <input type="number" value={qf.order_index} onChange={e=>setQf(f=>({...f,order_index:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Niveau</label>
                <select value={qf.level} onChange={e=>setQf(f=>({...f,level:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  {LEVELS.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {isCO ? (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Prompt (contexte audio)</label>
                  <input type="text" value={qf.prompt} onChange={e=>setQf(f=>({...f,prompt:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="Ex: Vous entendez une conversation entre..."/>
                </div>
                {/* Audio upload */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Audio (MP3)</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${uploading?'bg-gray-100 text-gray-400':'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}>
                      <Upload size={13}/>{uploading?'Upload…':'Choisir MP3'}
                      <input type="file" accept="audio/*" className="hidden" disabled={uploading} onChange={e=>{ if(e.target.files[0]) uploadFile(e.target.files[0],'audio_url') }}/>
                    </label>
                    <input type="text" value={qf.audio_url} onChange={e=>setQf(f=>({...f,audio_url:e.target.value}))}
                      className="flex-1 min-w-[180px] border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 font-mono" placeholder="URL audio…"/>
                    {qf.audio_url && <audio controls src={qf.audio_url} className="h-8 w-full mt-1"/>}
                  </div>
                </div>
                {/* Image upload */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Image (optionnel)</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100">
                      <Upload size={13}/>Image
                      <input type="file" accept="image/*" className="hidden" onChange={e=>{ if(e.target.files[0]) uploadFile(e.target.files[0],'image_url') }}/>
                    </label>
                    <input type="text" value={qf.image_url} onChange={e=>setQf(f=>({...f,image_url:e.target.value}))}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-300 font-mono" placeholder="URL image…"/>
                  </div>
                  {qf.image_url && <img src={qf.image_url} alt="" className="mt-2 max-h-24 rounded-lg border border-gray-200"/>}
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Texte de la question</label>
                  <input type="text" value={qf.question_text} onChange={e=>setQf(f=>({...f,question_text:e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Contenu HTML (passage de lecture)</label>
                  <RichEditor value={qf.content_html} onChange={v=>setQf(f=>({...f,content_html:v}))} rows={5} placeholder="Collez ou écrivez le texte source..."/>
                </div>
              </>
            )}

            {/* Options A/B/C/D */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">Options de réponse</label>
              <div className="space-y-2">
                {qf.options.map((opt,i)=>(
                  <div key={i} className="flex items-center gap-2">
                    <button type="button" onClick={()=>setQf(f=>({...f,correct_answer_index:i}))}
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${qf.correct_answer_index===i?'border-green-500 bg-green-500 text-white':'border-gray-200 text-gray-400 hover:border-green-400'}`}>
                      {LETTER[i]}
                    </button>
                    <input type="text" value={opt} onChange={e=>setQf(f=>{ const o=[...f.options]; o[i]=e.target.value; return {...f,options:o} })}
                      className={`flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 ${qf.correct_answer_index===i?'border-green-300 bg-green-50 focus:ring-green-300':'border-gray-200 focus:ring-purple-300'}`}
                      placeholder={`Option ${LETTER[i]}…`}/>
                    {qf.correct_answer_index===i && <CheckCircle size={15} className="text-green-500 shrink-0"/>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Cliquez sur la lettre pour marquer la bonne réponse (en vert)</p>
            </div>

            {/* Explanation */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Explication (optionnel)</label>
              <RichEditor value={qf.explanation} onChange={v=>setQf(f=>({...f,explanation:v}))} rows={3} placeholder="Pourquoi cette réponse est correcte…"/>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={()=>setModal(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={saveQuestion} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#7D3C98] text-white rounded-xl font-bold hover:bg-[#6C3483]">
                <Save size={13}/> Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Question */}
      {modal==='delQ' && <Confirm msg={`Supprimer la question Q${current?.order_index} ?`} onOk={deleteQuestion} onCancel={()=>setModal(null)}/>}
    </div>
  )
}

/* ══════════════════════════════════════
   SECTION EE — COMBINAISONS
══════════════════════════════════════ */
function EESection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [current, setCurrent] = useState(null)
  const [form, setForm] = useState({ month_slug:'', tache1_sujet:'', tache1_correction:'', tache2_sujet:'', tache2_correction:'', tache3_titre:'', tache3_document1:'', tache3_document2:'', tache3_correction:'' })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('combinaisons_ee').select('*').order('month_slug', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const years = [...new Set(items.map(i => extractYear(i.month_slug)).filter(Boolean))].sort()
  const filtered = items.filter(it => {
    const s = search.toLowerCase()
    return (yearFilter==='all'||extractYear(it.month_slug)===yearFilter) &&
      (!s || it.month_slug?.toLowerCase().includes(s) || it.tache1_sujet?.toLowerCase().includes(s) || it.tache3_titre?.toLowerCase().includes(s))
  })

  // Group by year
  const byYear = {}
  filtered.forEach(it => { const y = extractYear(it.month_slug)||'—'; if(!byYear[y]) byYear[y]=[]; byYear[y].push(it) })

  const openAdd = () => { setCurrent(null); setForm({ month_slug:'', tache1_sujet:'', tache1_correction:'', tache2_sujet:'', tache2_correction:'', tache3_titre:'', tache3_document1:'', tache3_document2:'', tache3_correction:'' }); setModal('form') }
  const openEdit = it => { setCurrent(it); setForm({ month_slug: it.month_slug||'', tache1_sujet: it.tache1_sujet||'', tache1_correction: it.tache1_correction||'', tache2_sujet: it.tache2_sujet||'', tache2_correction: it.tache2_correction||'', tache3_titre: it.tache3_titre||'', tache3_document1: it.tache3_document1||'', tache3_document2: it.tache3_document2||'', tache3_correction: it.tache3_correction||'' }); setModal('form') }

  const save = async () => {
    if (!modal==='form') return
    if (current) {
      const { error } = await supabase.from('combinaisons_ee').update(form).eq('id', current.id)
      if (error) { toast.error(error.message); return }
      toast.success('Combinaison mise à jour ✓')
    } else {
      const { error } = await supabase.from('combinaisons_ee').insert([form])
      if (error) { toast.error(error.message); return }
      toast.success('Combinaison ajoutée ✓')
    }
    setModal(null); load()
  }

  const del = async () => {
    const { error } = await supabase.from('combinaisons_ee').delete().eq('id', current.id)
    if (error) { toast.error(error.message); return }
    toast.success('Supprimé'); setModal(null); load()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <h3 className="font-extrabold text-gray-800 text-sm">✍️ Expression Écrite — {items.length} combinaisons</h3>
        <div className="flex-1 min-w-[180px]"><SearchBox value={search} onChange={setSearch}/></div>
        <select value={yearFilter} onChange={e=>setYearFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">Toutes années</option>
          {years.map(y=><option key={y}>{y}</option>)}
        </select>
        <button onClick={()=>load()} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400"><RefreshCw size={13}/></button>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-[#7D3C98] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#6C3483]">
          <Plus size={13}/> Ajouter
        </button>
      </div>

      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"/></div> : (
        Object.keys(byYear).sort().map(year => (
          <div key={year} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span className="font-extrabold text-gray-700 text-sm">📅 {year}</span>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{byYear[year].length} combinaison{byYear[year].length!==1?'s':''}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Mois</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Tâche 1</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Tâche 2</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Tâche 3</th>
                    <th className="px-4 py-2 text-right text-xs font-extrabold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {byYear[year].map((it,i) => (
                    <tr key={it.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5">
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-lg">{fmtMonth(it.month_slug)}</span>
                        <span className="text-xs text-gray-400 ml-1">#{i+1}</span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 max-w-[160px] truncate">{it.tache1_sujet?.substring(0,60)||'—'}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 max-w-[160px] truncate">{it.tache2_sujet?.substring(0,60)||'—'}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-600 max-w-[160px] truncate">{it.tache3_titre?.substring(0,60)||'—'}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={()=>openEdit(it)} className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600"><Edit2 size={13}/></button>
                          <button onClick={()=>{ setCurrent(it); setModal('del') }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Form modal */}
      {modal==='form' && (
        <Modal title={current?`Modifier — ${fmtMonth(current.month_slug)}`:'Nouvelle combinaison EE'} onClose={()=>setModal(null)} wide>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Mois (format YYYY-MM) <span className="text-red-400">*</span></label>
              <input type="text" value={form.month_slug} onChange={e=>setForm(f=>({...f,month_slug:e.target.value}))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="2026-06"/>
            </div>
            {[
              { label:'Tâche 1 — Sujet (Message court)', field:'tache1_sujet', color:'blue' },
              { label:'Tâche 1 — Correction', field:'tache1_correction', color:'blue' },
              { label:'Tâche 2 — Sujet (Narration)', field:'tache2_sujet', color:'green' },
              { label:'Tâche 2 — Correction', field:'tache2_correction', color:'green' },
              { label:'Tâche 3 — Titre / Contexte', field:'tache3_titre', color:'orange' },
              { label:'Tâche 3 — Document 1', field:'tache3_document1', color:'orange' },
              { label:'Tâche 3 — Document 2', field:'tache3_document2', color:'orange' },
              { label:'Tâche 3 — Correction', field:'tache3_correction', color:'orange' },
            ].map(({ label, field, color }) => (
              <div key={field} className={`border-l-4 ${color==='blue'?'border-blue-300':color==='green'?'border-green-300':'border-orange-300'} pl-3`}>
                <label className="text-xs font-bold text-gray-700 block mb-1">{label}</label>
                <RichEditor value={form[field]} onChange={v=>setForm(f=>({...f,[field]:v}))} rows={3}/>
              </div>
            ))}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={()=>setModal(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#7D3C98] text-white rounded-xl font-bold hover:bg-[#6C3483]">
                <Save size={13}/> Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal==='del' && <Confirm msg={`Supprimer la combinaison de ${fmtMonth(current?.month_slug)} ?`} onOk={del} onCancel={()=>setModal(null)}/>}
    </div>
  )
}

/* ══════════════════════════════════════
   SECTION EO — SUJETS
══════════════════════════════════════ */
function EOSection() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const [tacheFilter, setTacheFilter] = useState('all')
  const [modal, setModal] = useState(null)
  const [current, setCurrent] = useState(null)
  const [form, setForm] = useState({ month_slug:'', tache:1, title:'', correction_exemple:'' })

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('sujets_eo').select('*').order('month_slug', { ascending: true }).order('tache', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const years = [...new Set(items.map(i => extractYear(i.month_slug)).filter(Boolean))].sort()
  const filtered = items.filter(it => {
    const s = search.toLowerCase()
    return (yearFilter==='all'||extractYear(it.month_slug)===yearFilter) &&
      (tacheFilter==='all'||String(it.tache)===tacheFilter) &&
      (!s || it.title?.toLowerCase().includes(s) || it.month_slug?.toLowerCase().includes(s))
  })

  const byYear = {}
  filtered.forEach(it => { const y = extractYear(it.month_slug)||'—'; if(!byYear[y]) byYear[y]=[]; byYear[y].push(it) })

  const openAdd = () => { setCurrent(null); setForm({ month_slug:'', tache:1, title:'', correction_exemple:'' }); setModal('form') }
  const openEdit = it => { setCurrent(it); setForm({ month_slug: it.month_slug||'', tache: it.tache||1, title: it.title||'', correction_exemple: it.correction_exemple||'' }); setModal('form') }

  const save = async () => {
    const payload = { month_slug: form.month_slug, tache: parseInt(form.tache), title: form.title, correction_exemple: form.correction_exemple }
    if (current) {
      const { error } = await supabase.from('sujets_eo').update(payload).eq('id', current.id)
      if (error) { toast.error(error.message); return }
      toast.success('Sujet mis à jour ✓')
    } else {
      const { error } = await supabase.from('sujets_eo').insert([payload])
      if (error) { toast.error(error.message); return }
      toast.success('Sujet ajouté ✓')
    }
    setModal(null); load()
  }

  const del = async () => {
    await supabase.from('sujets_eo').delete().eq('id', current.id)
    toast.success('Supprimé'); setModal(null); load()
  }

  const TACHE_COLORS = { 1:'bg-blue-100 text-blue-700', 2:'bg-green-100 text-green-700', 3:'bg-orange-100 text-orange-700' }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <h3 className="font-extrabold text-gray-800 text-sm">🗣️ Expression Orale — {items.length} sujets</h3>
        <div className="flex-1 min-w-[160px]"><SearchBox value={search} onChange={setSearch}/></div>
        <select value={yearFilter} onChange={e=>setYearFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">Toutes années</option>
          {years.map(y=><option key={y}>{y}</option>)}
        </select>
        <select value={tacheFilter} onChange={e=>setTacheFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
          <option value="all">Toutes tâches</option>
          <option value="1">Tâche 1</option>
          <option value="2">Tâche 2</option>
          <option value="3">Tâche 3</option>
        </select>
        <button onClick={()=>load()} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400"><RefreshCw size={13}/></button>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-[#7D3C98] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#6C3483]">
          <Plus size={13}/> Ajouter
        </button>
      </div>

      {loading ? <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"/></div> : (
        Object.keys(byYear).sort().map(year => (
          <div key={year} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span className="font-extrabold text-gray-700 text-sm">📅 {year}</span>
              <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">{byYear[year].length} sujet{byYear[year].length!==1?'s':''}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Mois</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Tâche</th>
                    <th className="px-4 py-2 text-left text-xs font-extrabold text-gray-400 uppercase">Sujet</th>
                    <th className="px-4 py-2 text-center text-xs font-extrabold text-gray-400 uppercase w-20">Corr.</th>
                    <th className="px-4 py-2 text-right text-xs font-extrabold text-gray-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {byYear[year].map(it => (
                    <tr key={it.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5"><span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-lg">{fmtMonth(it.month_slug)}</span></td>
                      <td className="px-4 py-2.5"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TACHE_COLORS[it.tache]||'bg-gray-100 text-gray-500'}`}>T{it.tache}</span></td>
                      <td className="px-4 py-2.5 text-xs text-gray-700 max-w-[300px] truncate">{it.title||'—'}</td>
                      <td className="px-4 py-2.5 text-center">{it.correction_exemple?<span className="text-green-500 text-xs">✓</span>:<span className="text-gray-300 text-xs">—</span>}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={()=>openEdit(it)} className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600"><Edit2 size={13}/></button>
                          <button onClick={()=>{ setCurrent(it); setModal('del') }} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 size={13}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {modal==='form' && (
        <Modal title={current?'Modifier le sujet':'Nouveau sujet EO'} onClose={()=>setModal(null)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Mois (YYYY-MM)</label>
                <input type="text" value={form.month_slug} onChange={e=>setForm(f=>({...f,month_slug:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" placeholder="2026-06"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Tâche</label>
                <select value={form.tache} onChange={e=>setForm(f=>({...f,tache:e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300">
                  <option value={1}>Tâche 1</option>
                  <option value={2}>Tâche 2</option>
                  <option value={3}>Tâche 3</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Sujet / Titre</label>
              <RichEditor value={form.title} onChange={v=>setForm(f=>({...f,title:v}))} rows={4}/>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Exemple de correction</label>
              <RichEditor value={form.correction_exemple} onChange={v=>setForm(f=>({...f,correction_exemple:v}))} rows={5}/>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={()=>setModal(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#7D3C98] text-white rounded-xl font-bold hover:bg-[#6C3483]">
                <Save size={13}/> Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal==='del' && <Confirm msg={`Supprimer ce sujet EO (${fmtMonth(current?.month_slug)} — T${current?.tache}) ?`} onOk={del} onCancel={()=>setModal(null)}/>}
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
const SECTIONS = [
  { id:'co', label:'Compréhension Orale', icon: Mic,      sub:'40 séries · 39 questions/série', color:'blue'   },
  { id:'ce', label:'Compréhension Écrite', icon: BookOpen, sub:'39 séries · 39 questions/série', color:'purple' },
  { id:'ee', label:'Expression Écrite',    icon: FileText, sub:'326 combinaisons · 3 tâches',    color:'green'  },
  { id:'eo', label:'Expression Orale',     icon: Volume2,  sub:'2 855 sujets · Tâches 1/2/3',    color:'orange' },
]

export default function ExercisesTab() {
  const [section, setSection] = useState('co')

  const COLOR = {
    blue:   { active:'bg-blue-600 text-white',   inactive:'bg-white border border-blue-200 text-blue-600 hover:bg-blue-50' },
    purple: { active:'bg-[#7D3C98] text-white',  inactive:'bg-white border border-purple-200 text-purple-700 hover:bg-purple-50' },
    green:  { active:'bg-green-600 text-white',  inactive:'bg-white border border-green-200 text-green-700 hover:bg-green-50' },
    orange: { active:'bg-orange-500 text-white', inactive:'bg-white border border-orange-200 text-orange-600 hover:bg-orange-50' },
  }

  return (
    <div className="space-y-5">
      {/* Section selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SECTIONS.map(({ id, label, icon: Icon, sub, color }) => (
          <button key={id} onClick={()=>setSection(id)}
            className={`flex items-start gap-3 p-4 rounded-2xl text-left transition-all shadow-sm ${section===id ? COLOR[color].active : COLOR[color].inactive}`}>
            <Icon size={20} className="shrink-0 mt-0.5"/>
            <div>
              <p className="font-extrabold text-sm">{label}</p>
              <p className={`text-xs mt-0.5 ${section===id?'opacity-75':'opacity-60'}`}>{sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Section content */}
      {(section==='co'||section==='ce') && <SeriesSection type={section}/>}
      {section==='ee' && <EESection/>}
      {section==='eo' && <EOSection/>}
    </div>
  )
}
