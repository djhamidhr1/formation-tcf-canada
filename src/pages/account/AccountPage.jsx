import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const PLAN_LABELS = {
  free: 'Gratuit',
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinium: 'Platinium',
}

const PLAN_COLORS = {
  free: 'bg-gray-100 text-gray-600',
  bronze: 'bg-amber-100 text-amber-700',
  silver: 'bg-slate-100 text-slate-600',
  gold: 'bg-yellow-100 text-yellow-700',
  platinium: 'bg-purple-100 text-purple-700',
}

function DaysProgress({ used, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{used} jours utilisés</span>
        <span>{Math.max(0, total - used)} jours restants</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-2.5 rounded-full bg-blue-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function AccountPage() {
  const { user, profile, subscription, loading } = useAuth()
  const navigate = useNavigate()
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', email: '' })
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/connexion')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (user && profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: user.email || '',
      })
    }
  }, [user, profile])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profileForm.full_name, phone: profileForm.phone })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      toast.error('Erreur lors de la sauvegarde')
    } else {
      toast.success('Profil mis à jour')
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.password !== pwForm.confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }
    if (pwForm.password.length < 8) {
      toast.error('Mot de passe trop court (min. 8 caractères)')
      return
    }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.password })
    setSavingPw(false)
    if (error) {
      toast.error('Erreur : ' + error.message)
    } else {
      toast.success('Mot de passe mis à jour')
      setPwForm({ password: '', confirm: '' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const initials = (profile?.full_name || user.email || '?')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const planKey = subscription?.plan || 'free'
  const planLabel = PLAN_LABELS[planKey] || planKey
  const planColor = PLAN_COLORS[planKey] || 'bg-gray-100 text-gray-600'

  // Days calculation
  let daysUsed = 0
  let daysTotal = 0
  let daysLeft = 0
  if (subscription?.start_date && subscription?.end_date) {
    const start = new Date(subscription.start_date)
    const end = new Date(subscription.end_date)
    const now = new Date()
    daysTotal = Math.round((end - start) / (1000 * 60 * 60 * 24))
    daysUsed = Math.max(0, Math.round((now - start) / (1000 * 60 * 60 * 24)))
    daysLeft = Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)))
  }

  const eeCreditsUsed = subscription?.credits_used || 0
  const eeCreditsTotal = subscription?.credits_total || 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl p-8 text-white mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-extrabold shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-lg font-bold">{profile?.full_name || 'Utilisateur'}</div>
            <div className="text-slate-300 text-sm">{user.email}</div>
            <span className={`mt-2 inline-block text-xs font-bold px-3 py-1 rounded-full ${planColor}`}>
              Plan {planLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Subscription widget */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Mon abonnement</h2>
          <Link
            to="/tarifs"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium no-underline"
          >
            Améliorer mon plan →
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-lg text-sm font-bold ${planColor}`}>
            {planLabel}
          </span>
          {subscription?.is_active && (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">● Actif</span>
          )}
          {!subscription?.is_active && (
            <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-lg">Inactif</span>
          )}
        </div>
        {daysTotal > 0 && (
          <>
            <DaysProgress used={daysUsed} total={daysTotal} />
            <div className="text-xs text-gray-500 mt-2">
              {subscription?.end_date && `Expire le ${new Date(subscription.end_date).toLocaleDateString('fr-CA')}`}
              {daysLeft > 0 && ` · ${daysLeft} jour${daysLeft !== 1 ? 's' : ''} restant${daysLeft !== 1 ? 's' : ''}`}
            </div>
          </>
        )}
        {daysTotal === 0 && (
          <p className="text-sm text-gray-400">Aucun abonnement actif. <Link to="/tarifs" className="text-blue-600 no-underline">Voir les offres</Link></p>
        )}
      </div>

      {/* Access grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'CE Séries', val: '39 séries', link: '/epreuve/comprehension-ecrite/series', color: 'bg-green-50 border-green-200', text: 'text-green-700' },
          { label: 'CO Séries', val: '10 séries', link: '/epreuve/comprehension-orale/series', color: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
          { label: 'EE IA', val: `${eeCreditsUsed}/${eeCreditsTotal} crédits`, link: '/epreuve/expression-ecrite/sujets-actualites', color: 'bg-purple-50 border-purple-200', text: 'text-purple-700' },
          { label: 'EO Sujets', val: 'Accès libre', link: '/epreuve/expression-orale/sujets-actualites', color: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
        ].map(item => (
          <Link
            key={item.label}
            to={item.link}
            className={`${item.color} border rounded-xl p-4 text-center no-underline hover:shadow-sm transition-shadow`}
          >
            <div className={`text-xs font-bold ${item.text} mb-1`}>{item.label}</div>
            <div className="text-sm font-semibold text-gray-800">{item.val}</div>
          </Link>
        ))}
      </div>

      {/* Profile form */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">Modifier mon profil</h2>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input
              type="text"
              value={profileForm.full_name}
              onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profileForm.email}
              disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 514 000 0000"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              value={pwForm.password}
              onChange={e => setPwForm(p => ({ ...p, password: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min. 8 caractères"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Répéter le mot de passe"
            />
          </div>
          <button
            type="submit"
            disabled={savingPw}
            className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
          >
            {savingPw ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </form>
      </div>

      {/* Support */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">Support</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://wa.me/15147467431"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm no-underline transition-colors"
          >
            <span>💬</span> WhatsApp +1 514 746-7431
          </a>
          <a
            href="mailto:hamid@formation-tcf.com"
            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-5 py-2.5 rounded-xl text-sm no-underline transition-colors"
          >
            <span>✉️</span> hamid@formation-tcf.com
          </a>
        </div>
      </div>
    </div>
  )
}
