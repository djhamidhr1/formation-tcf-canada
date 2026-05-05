import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import ExercisesTab from './tabs/ExercisesTab'
import {
  LayoutDashboard, Users, BookOpen, Mic, FileText, MessageSquare,
  Globe, Search, Plus, Edit2, Trash2, Eye, EyeOff, Upload, Save,
  X, ChevronDown, ChevronUp, Filter, Download, Bell, Settings,
  Shield, Crown, Award, Clock, TrendingUp, CheckCircle, XCircle,
  AlertCircle, Calendar, Mail, RefreshCw, LogOut, BarChart2,
  Volume2, Bold, Italic, List, Send, Star, MapPin, Monitor,
  Smartphone, Tablet, ChevronLeft, ChevronRight, MoreVertical,
  UserCheck, UserX, Zap, Database, Activity, Flag, Copy, Check,
  ArrowUp, ArrowDown, Minus, Hash, AlignLeft, Type, Heading,
} from 'lucide-react'

/* ─────────────── CONSTANTES ─────────────── */
const TABS = [
  { id: 'overview',    label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'exercises',   label: 'Exercices',        icon: BookOpen },
  { id: 'members',     label: 'Membres',          icon: Users },
  { id: 'submissions', label: 'Soumissions',      icon: MessageSquare },
  { id: 'visitors',    label: 'Visiteurs',        icon: Globe },
  { id: 'followup',    label: 'Suivi & Relances', icon: Bell },
  { id: 'settings',    label: 'Paramètres',       icon: Settings },
]

const PLANS = { free: { label: 'Gratuit', color: 'gray' }, silver: { label: 'Silver', color: 'blue' }, gold: { label: 'Gold', color: 'yellow' }, zoom: { label: 'Zoom', color: 'green' } }

const PLAN_BADGE = {
  free:   'bg-gray-100 text-gray-600',
  silver: 'bg-orange-100 text-[#F98012]',
  gold:   'bg-yellow-100 text-yellow-700',
  zoom:   'bg-green-100 text-green-700',
}

/* ─────────────── HELPERS ─────────────── */
function fmt(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'short', day: 'numeric' })
}
function fmtTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString('fr-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function ago(date) {
  if (!date) return '—'
  const d = Math.floor((Date.now() - new Date(date)) / 86400000)
  if (d === 0) return "Aujourd'hui"
  if (d === 1) return 'Hier'
  if (d < 30) return `Il y a ${d}j`
  if (d < 365) return `Il y a ${Math.floor(d / 30)}m`
  return `Il y a ${Math.floor(d / 365)}a`
}

/* ─────────────── MINI RICH TEXT EDITOR ─────────────── */
function RichEditor({ value, onChange, placeholder = 'Saisissez le texte...' }) {
  const ref = useRef(null)

  const insert = (before, after = '') => {
    const el = ref.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const sel = value.slice(start, end)
    const next = value.slice(0, start) + before + (sel || 'texte') + after + value.slice(end)
    onChange(next)
    setTimeout(() => {
      el.selectionStart = start + before.length
      el.selectionEnd = start + before.length + (sel || 'texte').length
      el.focus()
    }, 0)
  }

  const tools = [
    { icon: Bold,      label: 'Gras',        fn: () => insert('**', '**') },
    { icon: Italic,    label: 'Italique',    fn: () => insert('_', '_') },
    { icon: Heading,   label: 'Titre',       fn: () => insert('\n## ', '') },
    { icon: List,      label: 'Liste',       fn: () => insert('\n- ', '') },
    { icon: Hash,      label: 'Numéro',      fn: () => insert('\n1. ', '') },
    { icon: AlignLeft, label: 'Citation',    fn: () => insert('\n> ', '') },
    { icon: Type,      label: 'Souligné',    fn: () => insert('<u>', '</u>') },
  ]

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#F98012] focus-within:border-transparent">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 border-b border-gray-200 flex-wrap">
        {tools.map(({ icon: Icon, label, fn }) => (
          <button key={label} type="button" title={label} onClick={fn}
            className="p-1.5 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors">
            <Icon size={13} />
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">Markdown</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-3 py-2.5 text-sm text-gray-700 resize-y focus:outline-none bg-white"
      />
    </div>
  )
}

/* ─────────────── STAT CARD ─────────────── */
function StatCard({ icon: Icon, label, value, sub, color = 'purple', trend }) {
  const colors = {
    purple: 'bg-orange-50 text-[#F98012]',
    blue:   'bg-orange-50 text-[#F98012]',
    green:  'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red:    'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${colors[color]}`}>
          <Icon size={20} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm font-semibold text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

/* ─────────────── BADGE ─────────────── */
function PlanBadge({ plan }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[plan] || PLAN_BADGE.free}`}>
      {PLANS[plan]?.label || plan || 'Gratuit'}
    </span>
  )
}

function StatusDot({ active }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${active ? 'bg-green-500' : 'bg-gray-300'}`} />
  )
}

/* ─────────────── SEARCH INPUT ─────────────── */
function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder || 'Rechercher...'}
        className="pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    </div>
  )
}

/* ─────────────── MODAL ─────────────── */
function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const esc = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={16} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

/* ─────────────── CONFIRM DIALOG ─────────────── */
function Confirm({ message, onConfirm, onCancel }) {
  return (
    <Modal title="Confirmation" onClose={onCancel}>
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onCancel} className="px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
        <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold">Supprimer</button>
      </div>
    </Modal>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 1 — VUE D'ENSEMBLE
═══════════════════════════════════════════════════════════ */
function OverviewTab() {
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [recentResults, setRecentResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [
        { count: users },
        { count: profiles },
        { count: subs },
        { count: results },
        { count: submissions },
        { count: ce },
        { count: co },
        { data: latestUsers },
        { data: latestResults },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_admin', false),
        supabase.from('user_subscriptions').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('user_results').select('*', { count: 'exact', head: true }),
        supabase.from('ee_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('series_ce').select('*', { count: 'exact', head: true }),
        supabase.from('series_co').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('id, full_name, email, created_at, plan').order('created_at', { ascending: false }).limit(5),
        supabase.from('user_results').select('id, table_type, score, total, created_at').order('created_at', { ascending: false }).limit(8),
      ])
      setStats({ users, subs, results, submissions, ce, co })
      setRecentUsers(latestUsers || [])
      setRecentResults(latestResults || [])
      setLoading(false)
    }
    load()
  }, [])

  const STAT_CARDS = stats ? [
    { icon: Users,       label: 'Membres inscrits',   value: stats.users,       color: 'purple', trend: 12 },
    { icon: Crown,       label: 'Abonnements actifs', value: stats.subs,        color: 'yellow', trend: 5  },
    { icon: Activity,    label: 'Exercices complétés', value: stats.results,    color: 'blue',   trend: 23 },
    { icon: MessageSquare, label: 'Soumissions EE',   value: stats.submissions, color: 'green',  trend: -3 },
    { icon: BookOpen,    label: 'Séries CE',          value: stats.ce,          color: 'orange' },
    { icon: Mic,         label: 'Séries CO',          value: stats.co,          color: 'red' },
  ] : []

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"/></div>

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAT_CARDS.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers inscrits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-sm">Derniers inscrits</h3>
            <span className="text-xs text-gray-400">{recentUsers.length} affichés</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.length === 0 && <p className="px-5 py-4 text-sm text-gray-400">Aucun utilisateur</p>}
            {recentUsers.map(u => (
              <div key={u.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {(u.full_name || u.email || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{u.full_name || '—'}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <PlanBadge plan={u.plan} />
                  <p className="text-xs text-gray-400 mt-0.5">{ago(u.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900 text-sm">Activité récente</h3>
            <span className="text-xs text-gray-400">Exercices complétés</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentResults.length === 0 && <p className="px-5 py-4 text-sm text-gray-400">Aucune activité</p>}
            {recentResults.map(r => {
              const pct = r.total ? Math.round((r.score / r.total) * 100) : 0
              return (
                <div key={r.id} className="px-5 py-3 flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700">{r.table_type?.toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{fmtTime(r.created_at)}</p>
                  </div>
                  <span className={`text-sm font-bold ${pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                    {r.score}/{r.total}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h3 className="font-extrabold text-lg mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Ajouter exercice CE', icon: BookOpen },
            { label: 'Nouveau membre',       icon: Users },
            { label: 'Voir soumissions',     icon: MessageSquare },
            { label: 'Exporter données',     icon: Download },
          ].map(({ label, icon: Icon }) => (
            <button key={label} className="bg-white/15 hover:bg-[#F98012]/30 rounded-xl p-3 text-left transition-colors">
              <Icon size={18} className="mb-2 opacity-80" />
              <p className="text-xs font-semibold">{label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 2 — EXERCICES (remplacé par ExercisesTab importé)
═══════════════════════════════════════════════════════════ */
// ExercisesTab est importé depuis ./tabs/ExercisesTab
// Ce bloc vide évite le conflit de nom
function _ExercisesTabOLD() {
  const [section, setSection] = useState('ee')

  return null
}

/* ═══════════════════════════════════════════════════════════
   TAB 3 — MEMBRES
═══════════════════════════════════════════════════════════ */
function MembersTab() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState('created_at')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*, user_subscriptions(plan, is_active, expires_at, created_at)')
      .order('created_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const getActiveSub = (m) => m.user_subscriptions?.find(s => s.is_active) || null
  const getPlan = (m) => getActiveSub(m)?.plan || m.plan || 'free'

  const filtered = members.filter(m => {
    const s = search.toLowerCase()
    const matchSearch = !s || m.full_name?.toLowerCase().includes(s) || m.email?.toLowerCase().includes(s)
    const matchPlan = planFilter === 'all' || getPlan(m) === planFilter
    const matchStatus = statusFilter === 'all'
      || (statusFilter === 'active' && getActiveSub(m))
      || (statusFilter === 'inactive' && !getActiveSub(m))
    return matchSearch && matchPlan && matchStatus
  }).sort((a, b) => {
    const va = a[sortField] || ''
    const vb = b[sortField] || ''
    return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
  })

  const paginated = filtered.slice(0, page * PER_PAGE)
  const hasMore = filtered.length > page * PER_PAGE

  const toggleSort = (field) => {
    if (sortField === field) setSortAsc(a => !a)
    else { setSortField(field); setSortAsc(false) }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Minus size={11} className="text-gray-300" />
    return sortAsc ? <ArrowUp size={11} className="text-[#0F3D58]" /> : <ArrowDown size={11} className="text-[#0F3D58]" />
  }

  const handleUpdateMember = async () => {
    const { error } = await supabase.from('profiles').update(editForm).eq('id', selected.id)
    if (error) { toast.error(error.message); return }
    toast.success('Membre mis à jour ✓')
    setModal(null)
    load()
  }

  const handleToggleAdmin = async (m) => {
    const { error } = await supabase.from('profiles').update({ is_admin: !m.is_admin }).eq('id', m.id)
    if (error) { toast.error(error.message); return }
    toast.success(m.is_admin ? 'Admin retiré' : 'Admin accordé')
    load()
  }

  const handleToggleBlock = async (m) => {
    const { error } = await supabase.from('profiles').update({ is_blocked: !m.is_blocked }).eq('id', m.id)
    if (error) { toast.error(error.message); return }
    toast.success(m.is_blocked ? 'Compte débloqué' : 'Compte bloqué')
    load()
  }

  const exportCSV = () => {
    const rows = [['Nom', 'Email', 'Plan', 'Admin', 'Abonnement expire', 'Inscrit le']]
    filtered.forEach(m => {
      const sub = getActiveSub(m)
      rows.push([m.full_name || '', m.email || '', getPlan(m), m.is_admin ? 'Oui' : 'Non', fmt(sub?.expires_at), fmt(m.created_at)])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `membres_${Date.now()}.csv`
    a.click()
    toast.success('CSV exporté ✓')
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Nom, email..." />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="all">Tous les plans</option>
          <option value="free">Gratuit</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="zoom">Zoom</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="all">Tous statuts</option>
          <option value="active">Abonnés actifs</option>
          <option value="inactive">Sans abonnement</option>
        </select>
        <button onClick={() => load()} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500"><RefreshCw size={15} /></button>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
          <Download size={14} /> CSV
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total membres', value: members.length, icon: Users, color: 'purple' },
          { label: 'Abonnés actifs', value: members.filter(m => getActiveSub(m)).length, icon: Crown, color: 'yellow' },
          { label: 'Gold', value: members.filter(m => getPlan(m) === 'gold').length, icon: Star, color: 'orange' },
          { label: 'Silver', value: members.filter(m => getPlan(m) === 'silver').length, icon: Award, color: 'blue' },
        ].map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} membre{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">
                  <button onClick={() => toggleSort('full_name')} className="flex items-center gap-1">Nom <SortIcon field="full_name" /></button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Expiration</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">
                  <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1">Inscrit <SortIcon field="created_at" /></button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-extrabold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={7} className="py-10 text-center">
                  <div className="flex justify-center"><div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/></div>
                </td></tr>
              )}
              {!loading && paginated.map(m => {
                const sub = getActiveSub(m)
                const plan = getPlan(m)
                const expiring = sub?.expires_at && new Date(sub.expires_at) < new Date(Date.now() + 7 * 86400000)
                return (
                  <tr key={m.id} className={`hover:bg-gray-50 transition-colors ${m.is_blocked ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(m.full_name || m.email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{m.full_name || '—'}</p>
                          {m.is_admin && <span className="text-xs text-red-500 font-bold">ADMIN</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{m.email || '—'}</td>
                    <td className="px-4 py-3"><PlanBadge plan={plan} /></td>
                    <td className="px-4 py-3">
                      {sub?.expires_at ? (
                        <span className={`text-xs font-semibold ${expiring ? 'text-orange-500' : 'text-gray-600'}`}>
                          {expiring && 'Attention: '}{fmt(sub.expires_at)}
                        </span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusDot active={!!sub} />
                        <span className="text-xs text-gray-600">{m.is_blocked ? 'Bloqué' : sub ? 'Actif' : 'Libre'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{fmt(m.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { setSelected(m); setEditForm({ full_name: m.full_name, email: m.email, plan: plan }); setModal('edit') }}
                          title="Modifier" className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#F98012]"><Edit2 size={13} /></button>
                        <button onClick={() => handleToggleAdmin(m)}
                          title={m.is_admin ? 'Retirer admin' : 'Rendre admin'}
                          className={`p-1.5 rounded-lg ${m.is_admin ? 'text-red-400 hover:bg-red-50' : 'text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}>
                          <Shield size={13} />
                        </button>
                        <button onClick={() => handleToggleBlock(m)}
                          title={m.is_blocked ? 'Débloquer' : 'Bloquer'}
                          className={`p-1.5 rounded-lg ${m.is_blocked ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-red-50 hover:text-red-500'}`}>
                          {m.is_blocked ? <UserCheck size={13} /> : <UserX size={13} />}
                        </button>
                        <a href={`mailto:${m.email}`} title="Envoyer email"
                          className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-[#F98012]">
                          <Mail size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <button onClick={() => setPage(p => p + 1)} className="text-sm text-[#F98012] font-semibold hover:underline hover:text-[#71C9CE]">
              Afficher plus ({filtered.length - page * PER_PAGE} restants)
            </button>
          </div>
        )}
      </div>

      {/* Edit member modal */}
      {modal === 'edit' && selected && (
        <Modal title={`Modifier — ${selected.full_name || selected.email}`} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nom complet</label>
              <input type="text" value={editForm.full_name || ''} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Plan</label>
              <select value={editForm.plan || 'free'} onChange={e => setEditForm(f => ({ ...f, plan: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option value="free">Gratuit</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="zoom">Zoom</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setModal(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={handleUpdateMember} className="flex items-center gap-2 px-5 py-2 text-sm bg-[#0F3D58] text-white rounded-xl font-bold hover:bg-[#F98012] hover:text-white">
                <Save size={14} /> Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 4 — SOUMISSIONS (Modération EE)
═══════════════════════════════════════════════════════════ */
function SubmissionsTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('ee_submissions')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = items.filter(it => {
    const s = search.toLowerCase()
    const matchSearch = !s || it.profiles?.full_name?.toLowerCase().includes(s) || it.profiles?.email?.toLowerCase().includes(s)
    const matchStatus = statusFilter === 'all' || it.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    const { error } = await supabase.from('ee_submissions').update({ admin_feedback: reply, status: 'reviewed', reviewed_at: new Date().toISOString() }).eq('id', selected.id)
    if (error) { toast.error(error.message) }
    else { toast.success('Réponse envoyée ✓'); setReply(''); setSelected(null); load() }
    setSending(false)
  }

  const handleStatusChange = async (id, status) => {
    await supabase.from('ee_submissions').update({ status }).eq('id', id)
    load()
  }

  const STATUS_STYLES = {
    pending:  'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-600',
  }
  const STATUS_LABELS = { pending: 'En attente', reviewed: 'Corrigé', rejected: 'Rejeté' }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[220px]">
          <SearchInput value={search} onChange={setSearch} placeholder="Chercher par membre..." />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="reviewed">Corrigés</option>
          <option value="rejected">Rejetés</option>
        </select>
        <button onClick={load} className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500"><RefreshCw size={15} /></button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'En attente', value: items.filter(i => i.status === 'pending').length, color: 'orange', icon: Clock },
          { label: 'Corrigées', value: items.filter(i => i.status === 'reviewed').length, color: 'green', icon: CheckCircle },
          { label: 'Total', value: items.length, color: 'purple', icon: MessageSquare },
        ].map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} soumission{filtered.length !== 1 ? 's' : ''}</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Membre</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Score IA</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-right text-xs font-extrabold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && (
                <tr><td colSpan={5} className="py-10 text-center">
                  <div className="flex justify-center"><div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/></div>
                </td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-sm text-gray-400">Aucune soumission</td></tr>
              )}
              {!loading && filtered.map(it => (
                <tr key={it.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-800">{it.profiles?.full_name || '—'}</p>
                    <p className="text-xs text-gray-400">{it.profiles?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {it.ai_score != null
                      ? <span className={`font-bold text-sm ${it.ai_score >= 14 ? 'text-green-600' : it.ai_score >= 10 ? 'text-yellow-600' : 'text-red-500'}`}>{it.ai_score}/20</span>
                      : <span className="text-gray-300 text-xs">Non noté</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[it.status] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABELS[it.status] || it.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{fmtTime(it.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => { setSelected(it); setReply(it.admin_feedback || '') }}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-[#F98012] rounded-lg text-xs font-semibold hover:bg-orange-100">
                        <Eye size={12} /> Voir
                      </button>
                      <select value={it.status || 'pending'} onChange={e => handleStatusChange(it.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none">
                        <option value="pending">En attente</option>
                        <option value="reviewed">Corrigé</option>
                        <option value="rejected">Rejeté</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <Modal title="Soumission — Modération" onClose={() => setSelected(null)} wide>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[#0F3D58] flex items-center justify-center text-white text-sm font-bold">
                {(selected.profiles?.full_name || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-800">{selected.profiles?.full_name}</p>
                <p className="text-xs text-gray-500">{selected.profiles?.email} · {fmtTime(selected.created_at)}</p>
              </div>
              {selected.ai_score != null && (
                <span className={`ml-auto text-lg font-extrabold ${selected.ai_score >= 14 ? 'text-green-600' : selected.ai_score >= 10 ? 'text-yellow-600' : 'text-red-500'}`}>
                  {selected.ai_score}/20
                </span>
              )}
            </div>

            {/* Submitted texts */}
            {['tache1_text', 'tache2_text', 'tache3_text'].map((field, i) => selected[field] && (
              <div key={field} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600">Tâche {i + 1} — Texte soumis</div>
                <p className="px-4 py-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">{selected[field]}</p>
              </div>
            ))}

            {/* AI feedback */}
            {selected.ai_feedback && (
              <div className="border border-green-200 rounded-xl overflow-hidden">
                <div className="bg-green-50 px-4 py-2 text-xs font-bold text-green-700">Retour IA</div>
                <p className="px-4 py-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">{selected.ai_feedback}</p>
              </div>
            )}

            {/* Admin reply */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Votre feedback (envoyé au membre)</label>
              <RichEditor value={reply} onChange={setReply} placeholder="Rédigez votre feedback personnalisé..." />
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setSelected(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Fermer</button>
              <button onClick={handleReply} disabled={sending || !reply.trim()}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-600 text-white rounded-xl font-bold hover:bg-[#F98012] disabled:opacity-50">
                <Send size={14} /> {sending ? 'Envoi...' : 'Envoyer le feedback'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 5 — VISITEURS & ANALYTICS
═══════════════════════════════════════════════════════════ */
const MOCK_COUNTRIES = [
  { country: 'Canada', code: 'CA', visits: 1842, pct: 44 },
  { country: 'France', code: 'FR', visits: 976, pct: 23 },
  { country: 'Maroc', code: 'MA', visits: 614, pct: 15 },
  { country: 'Algérie', code: 'DZ', visits: 421, pct: 10 },
  { country: 'Tunisie', code: 'TN', visits: 187, pct: 5 },
  { country: 'Belgique', code: 'BE', visits: 98, pct: 2 },
  { country: 'Autres', code: '—', visits: 42, pct: 1 },
]
const MOCK_DEVICES = [
  { type: 'Mobile', icon: Smartphone, pct: 58, color: 'bg-[#0F3D58]' },
  { type: 'Desktop', icon: Monitor, pct: 34, color: 'bg-[#0F3D58]' },
  { type: 'Tablette', icon: Tablet, pct: 8, color: 'bg-green-500' },
]
const MOCK_PAGES = [
  { page: '/epreuve/comprehension-ecrite', views: 3241, label: 'CE — Compréhension Écrite' },
  { page: '/epreuve/comprehension-orale', views: 2876, label: 'CO — Compréhension Orale' },
  { page: '/epreuve/expression-ecrite', views: 1954, label: 'EE — Expression Écrite' },
  { page: '/', views: 1432, label: 'Accueil' },
  { page: '/calculateur-nclc', views: 987, label: 'Calculateur NCLC' },
  { page: '/tarifs', views: 654, label: 'Tarifs' },
]

function VisitorsTab() {
  const [period, setPeriod] = useState('7d')

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex gap-2 flex-wrap">
        {[{ id: '24h', label: '24 heures' }, { id: '7d', label: '7 jours' }, { id: '30d', label: '30 jours' }, { id: '90d', label: '3 mois' }].map(p => (
          <button key={p.id} onClick={() => setPeriod(p.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${period === p.id ? 'bg-[#0F3D58] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {p.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center italic">Données simulées — intégrez votre outil analytics (Plausible, GA4…)</span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Globe,     label: 'Visites uniques',  value: '4 180',  color: 'purple', trend: 14 },
          { icon: Activity,  label: 'Pages vues',       value: '11 240', color: 'blue',   trend: 8  },
          { icon: Clock,     label: 'Durée moyenne',    value: '4m 32s', color: 'green',  trend: 3  },
          { icon: TrendingUp,label: 'Taux de rebond',   value: '38%',    color: 'orange', trend: -5 },
        ].map(c => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pays */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <MapPin size={16} className="text-[#0F3D58]" />
            <h3 className="font-extrabold text-gray-900 text-sm">Visiteurs par pays</h3>
          </div>
          <div className="p-5 space-y-3">
            {MOCK_COUNTRIES.map(c => (
              <div key={c.country}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400">{c.code}</span>
                    <span className="text-sm font-semibold text-gray-700">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{c.visits.toLocaleString()}</span>
                    <span className="text-xs font-bold text-blue-600 w-8 text-right">{c.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Appareils + Pages populaires */}
        <div className="space-y-4">
          {/* Appareils */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Monitor size={16} className="text-[#0F3D58]" />
              <h3 className="font-extrabold text-gray-900 text-sm">Appareils</h3>
            </div>
            <div className="p-5 space-y-3">
              {MOCK_DEVICES.map(d => (
                <div key={d.type} className="flex items-center gap-3">
                  <d.icon size={15} className="text-gray-400 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700">{d.type}</span>
                      <span className="text-xs font-bold text-gray-500">{d.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pages populaires */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <BarChart2 size={16} className="text-green-500" />
              <h3 className="font-extrabold text-gray-900 text-sm">Pages les plus visitées</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_PAGES.map((p, i) => (
                <div key={p.page} className="px-5 py-2.5 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{p.label}</p>
                    <p className="text-xs text-gray-400 truncate">{p.page}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-600">{p.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-[#0F3D58] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#0F3D58]">Données simulées</p>
          <p className="text-xs text-[#0F3D58] mt-0.5">
            Pour des données réelles, intégrez <strong>Plausible Analytics</strong> ou <strong>Google Analytics 4</strong>.
            Ajoutez la table <code className="bg-orange-100 px-1 rounded">page_views</code> dans Supabase pour tracker les visites natives.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 6 — SUIVI & RELANCES
═══════════════════════════════════════════════════════════ */
function FollowUpTab() {
  const [data, setData] = useState({ expiring: [], inactive: [], noSub: [], completed: [] })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeList, setActiveList] = useState('expiring')
  const [noteModal, setNoteModal] = useState(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const now = new Date().toISOString()
      const in7 = new Date(Date.now() + 7 * 86400000).toISOString()
      const [
        { data: expiring },
        { data: noSub },
        { data: results },
      ] = await Promise.all([
        supabase.from('user_subscriptions').select('*, profiles(full_name, email)').eq('is_active', true).lt('expires_at', in7).gt('expires_at', now),
        supabase.from('profiles').select('id, full_name, email, created_at, plan').eq('plan', 'free').order('created_at', { ascending: false }).limit(50),
        supabase.from('user_results').select('user_id, created_at, table_type, score, total').order('created_at', { ascending: false }).limit(100),
      ])
      setData({ expiring: expiring || [], noSub: noSub || [], results: results || [] })
      setLoading(false)
    }
    load()
  }, [])

  const LISTS = [
    { id: 'expiring', label: 'Expiration imminente', icon: Clock, color: 'orange', items: data.expiring },
    { id: 'noSub', label: 'Sans abonnement', icon: UserX, color: 'red', items: data.noSub },
    { id: 'results', label: 'Activité récente', icon: Activity, color: 'blue', items: data.results || [] },
  ]

  const currentList = LISTS.find(l => l.id === activeList)?.items || []
  const filteredList = currentList.filter(it => {
    const s = search.toLowerCase()
    const name = it.profiles?.full_name || it.full_name || ''
    const email = it.profiles?.email || it.email || ''
    return !s || name.toLowerCase().includes(s) || email.toLowerCase().includes(s)
  })

  const addNote = async () => {
    if (!note.trim()) return
    const { error } = await supabase.from('admin_notes').insert([{ user_id: noteModal.id, content: note, created_at: new Date().toISOString() }])
    if (error) toast.error('Table admin_notes inexistante — créez-la d\'abord')
    else { toast.success('Note ajoutée ✓'); setNote(''); setNoteModal(null) }
  }

  return (
    <div className="space-y-5">
      {/* List tabs */}
      <div className="flex gap-3 flex-wrap">
        {LISTS.map(({ id, label, icon: Icon, color, items }) => (
          <button key={id} onClick={() => setActiveList(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeList === id ? 'bg-[#0F3D58] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Icon size={14} /> {label}
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${activeList === id ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {items.length}
            </span>
          </button>
        ))}
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un membre..." />

      {loading ? (
        <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"/></div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Membre</th>
                  {activeList === 'expiring' && <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Expire le</th>}
                  {activeList === 'noSub' && <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Inscrit le</th>}
                  {activeList === 'results' && (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Épreuve</th>
                      <th className="px-4 py-3 text-left text-xs font-extrabold text-gray-500 uppercase">Score</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-extrabold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredList.length === 0 && (
                  <tr><td colSpan={4} className="py-10 text-center text-sm text-gray-400">Aucune donnée</td></tr>
                )}
                {filteredList.map((it, i) => {
                  const name = it.profiles?.full_name || it.full_name || '—'
                  const email = it.profiles?.email || it.email || '—'
                  return (
                    <tr key={it.id || i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[#0F3D58] text-xs font-bold">
                            {name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{name}</p>
                            <p className="text-xs text-gray-400">{email}</p>
                          </div>
                        </div>
                      </td>
                      {activeList === 'expiring' && (
                        <td className="px-4 py-3">
                          <span className="text-orange-600 font-bold text-xs flex items-center gap-1"><AlertCircle size={11} className="shrink-0" /> {fmt(it.expires_at)}</span>
                        </td>
                      )}
                      {activeList === 'noSub' && (
                        <td className="px-4 py-3 text-xs text-gray-500">{fmt(it.created_at)}</td>
                      )}
                      {activeList === 'results' && (
                        <>
                          <td className="px-4 py-3"><span className="text-xs font-bold text-[#F98012] uppercase">{it.table_type}</span></td>
                          <td className="px-4 py-3 text-xs font-bold text-gray-700">{it.score}/{it.total}</td>
                        </>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <a href={`mailto:${email}?subject=Formation TCF Canada&body=Bonjour ${name},`}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-orange-100">
                            <Mail size={11} /> Email
                          </a>
                          <button onClick={() => { setNoteModal(it); setNote('') }}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-50 text-[#F98012] rounded-lg text-xs font-semibold hover:bg-orange-100">
                            <Edit2 size={11} /> Note
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Note modal */}
      {noteModal && (
        <Modal title={`Note — ${noteModal.profiles?.full_name || noteModal.full_name}`} onClose={() => setNoteModal(null)}>
          <div className="space-y-4">
            <RichEditor value={note} onChange={setNote} placeholder="Rédigez votre note de suivi..." />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setNoteModal(null)} className="px-5 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={addNote} className="flex items-center gap-2 px-5 py-2 text-sm bg-[#0F3D58] text-white rounded-xl font-bold hover:bg-[#F98012] hover:text-white">
                <Save size={14} /> Sauvegarder
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAB 7 — PARAMÈTRES
═══════════════════════════════════════════════════════════ */
function SettingsTab() {
  const { user } = useAuth()
  const [dbStats, setDbStats] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [
        { count: ce }, { count: co }, { count: ee }, { count: eo }, { count: users }, { count: results },
      ] = await Promise.all([
        supabase.from('questions_ce').select('*', { count: 'exact', head: true }),
        supabase.from('questions_co').select('*', { count: 'exact', head: true }),
        supabase.from('combinaisons_ee').select('*', { count: 'exact', head: true }),
        supabase.from('sujets_eo').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('user_results').select('*', { count: 'exact', head: true }),
      ])
      setDbStats({ ce, co, ee, eo, users, results })
    }
    load()
  }, [])

  const DB_ROWS = dbStats ? [
    { label: 'Questions CE', value: dbStats.ce, icon: BookOpen, color: 'purple' },
    { label: 'Questions CO', value: dbStats.co, icon: Mic, color: 'blue' },
    { label: 'Combinaisons EE', value: dbStats.ee, icon: FileText, color: 'green' },
    { label: 'Sujets EO', value: dbStats.eo, icon: Volume2, color: 'orange' },
    { label: 'Profils membres', value: dbStats.users, icon: Users, color: 'yellow' },
    { label: 'Résultats enregistrés', value: dbStats.results, icon: Activity, color: 'red' },
  ] : []

  return (
    <div className="space-y-6">
      {/* Admin info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2"><Shield size={16} className="text-[#0F3D58]" /> Compte administrateur</h3>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xl font-extrabold">
            {(user?.email || 'A')[0].toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-800">{user?.email}</p>
            <p className="text-xs text-gray-500">Administrateur · Accès complet</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-red-500 mt-1"><Shield size={11} /> ADMIN</span>
          </div>
        </div>
      </div>

      {/* DB Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2"><Database size={16} className="text-[#0F3D58]" /> Base de données — État</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {DB_ROWS.map(r => <StatCard key={r.label} {...r} />)}
        </div>
      </div>

      {/* Supabase links */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-extrabold text-gray-900 mb-4 flex items-center gap-2"><Zap size={16} className="text-yellow-500" /> Accès rapide Supabase</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Dashboard Supabase', url: 'https://supabase.com/dashboard/project/fvhxptpzskvwpdtycklj' },
            { label: 'SQL Editor', url: 'https://supabase.com/dashboard/project/fvhxptpzskvwpdtycklj/editor' },
            { label: 'Storage (audios-co)', url: 'https://supabase.com/dashboard/project/fvhxptpzskvwpdtycklj/storage/buckets/audios-co' },
            { label: 'Auth — Utilisateurs', url: 'https://supabase.com/dashboard/project/fvhxptpzskvwpdtycklj/auth/users' },
          ].map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 border border-gray-200 hover:border-[#F98012] transition-colors group">
              <Database size={14} className="text-gray-400 group-hover:text-[#F98012]" />
              <span className="text-sm font-semibold text-gray-700 group-hover:text-[#F98012]">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN DASHBOARD
═══════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Auth guard
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Shield size={48} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-gray-700 mb-2">Accès restreint</h2>
        <p className="text-gray-500 mb-6">Vous devez être connecté pour accéder à l'administration.</p>
        <Link to="/connexion" className="bg-[#0F3D58] text-white px-6 py-3 rounded-xl font-bold no-underline hover:bg-[#F98012] hover:text-white">
          Se connecter
        </Link>
      </div>
    )
  }

  const isAdmin = profile?.is_admin === true || profile?.role === 'admin'

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Shield size={48} className="text-red-300 mb-4" />
        <h2 className="text-2xl font-extrabold text-gray-700 mb-2">Accès interdit</h2>
        <p className="text-gray-500 mb-2">Votre compte ne possède pas les droits administrateur.</p>
        <p className="text-xs text-gray-400 mb-6">Connecté en tant que : <strong>{user.email}</strong></p>
        <Link to="/" className="bg-[#0F3D58] text-white px-6 py-3 rounded-xl font-bold no-underline hover:bg-[#F98012] hover:text-white">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const TAB_CONTENT = {
    overview:    <OverviewTab />,
    exercises:   <ExercisesTab />,
    members:     <MembersTab />,
    submissions: <SubmissionsTab />,
    visitors:    <VisitorsTab />,
    followup:    <FollowUpTab />,
    settings:    <SettingsTab />,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-200 sticky top-0 h-screen`}>
        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
            <Shield size={15} className="text-white" />
          </div>
          {sidebarOpen && <span className="font-extrabold text-gray-800 text-sm truncate">Admin TCF</span>}
          <button onClick={() => setSidebarOpen(o => !o)} className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-400 shrink-0">
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${activeTab === id ? 'bg-orange-50 text-[#F98012] border-r-2 border-[#F98012]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}>
              <Icon size={16} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-3 border-t border-gray-100">
          <div className={`flex items-center ${sidebarOpen ? 'gap-2' : 'justify-center'}`}>
            <div className="w-7 h-7 rounded-full bg-[#0F3D58] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {(user.email || 'A')[0].toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-700 truncate">{user.email}</p>
                <p className="text-xs text-[#F98012] font-semibold">Administrateur</p>
              </div>
            )}
            <button onClick={() => { signOut(); navigate('/') }}
              title="Déconnexion" className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 shrink-0">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-gray-900">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-gray-400">Tableau de bord administrateur · TCF Canada</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> En ligne
            </span>
            <Link to="/" className="text-xs text-gray-500 hover:text-[#F98012] font-semibold no-underline">
              ← Site
            </Link>
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {TAB_CONTENT[activeTab]}
        </div>
      </main>
    </div>
  )
}
