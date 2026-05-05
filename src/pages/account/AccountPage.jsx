import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, profile, subscription, loading } = useAuth()
  const navigate = useNavigate()
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '', email: '' })
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => { if (!loading && !user) navigate('/connexion') }, [user, loading, navigate])
  useEffect(() => {
    if (user && profile) setProfileForm({ full_name: profile.full_name || '', phone: profile.phone || '', email: user.email || '' })
  }, [user, profile])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: profileForm.full_name, phone: profileForm.phone }).eq('id', user.id)
    setSaving(false)
    error ? toast.error('Erreur lors de la sauvegarde') : toast.success('Profil mis a jour')
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.password !== pwForm.confirm) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (pwForm.password.length < 8) { toast.error('Mot de passe trop court (min. 8 caracteres)'); return }
    setSavingPw(true)
    const { error } = await supabase.auth.updateUser({ password: pwForm.password })
    setSavingPw(false)
    error ? toast.error('Erreur : ' + error.message) : (toast.success('Mot de passe mis a jour'), setPwForm({ password: '', confirm: '' }))
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, border: '4px solid var(--co-main)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!user) return null

  const initials = (profile?.full_name || user.email || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const planKey = subscription?.plan || 'free'
  let daysUsed = 0, daysTotal = 0, daysLeft = 0
  if (subscription?.start_date && subscription?.end_date) {
    const start = new Date(subscription.start_date), end = new Date(subscription.end_date), now = new Date()
    daysTotal = Math.round((end - start) / 864e5)
    daysUsed = Math.max(0, Math.round((now - start) / 864e5))
    daysLeft = Math.max(0, Math.round((end - now) / 864e5))
  }
  const eeUsed = subscription?.credits_used || 0, eeTotal = subscription?.credits_total || 0

  const cardStyle = { background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: 28, marginBottom: 24 }
  const inputStyle = { width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid var(--border-med)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-1)', outline: 'none', fontFamily: 'var(--font)' }
  const btnStyle = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 14, fontWeight: 700, background: 'var(--navy)', color: 'white', borderRadius: 'var(--radius-md)', transition: 'all 0.18s' }

  return (
    <div>
      {/* Header */}
      <div style={{ background: 'var(--navy)', padding: '48px 24px 0' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 0 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, var(--co-main), var(--ee-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: 'white', flexShrink: 0, boxShadow: 'var(--shadow-lg)' }}>{initials}</div>
          <div style={{ paddingBottom: 16, flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 4, letterSpacing: '-0.03em', margin: '0 0 4px' }}>{profile?.full_name || 'Utilisateur'}</h1>
            <div style={{ color: 'rgba(170, 150, 210, 0.8)', fontSize: 14 }}>{user.email}</div>
          </div>
          <div style={{ paddingBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--surface-2)', color: 'var(--text-2)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>
              Plan {planKey.charAt(0).toUpperCase() + planKey.slice(1)}
            </span>
          </div>
        </div>
      </div>

      <section style={{ padding: '32px 24px 72px' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column' }}>
          {/* Subscription */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Mon abonnement</h3>
              <Link to="/tarifs" style={{ color: 'var(--co-main)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Ameliorer mon plan &rarr;</Link>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <span style={{ background: 'var(--surface-2)', color: 'var(--text-2)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>{planKey.charAt(0).toUpperCase() + planKey.slice(1)}</span>
              <span style={{ background: 'var(--ce-light)', color: 'var(--ce-text)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>Actif</span>
            </div>
            {daysTotal > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{daysUsed} jours utilises</span>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{daysLeft} jours restants</span>
                </div>
                <div style={{ background: 'var(--surface-2)', borderRadius: 999, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (daysUsed / daysTotal) * 100)}%`, height: '100%', background: 'var(--co-main)', borderRadius: 999, transition: 'width 0.4s' }} />
                </div>
                {subscription?.end_date && <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>Expire le {new Date(subscription.end_date).toLocaleDateString('fr-CA')}</div>}
              </>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
              {[
                { label: 'CE Series', value: '39 series', light: 'var(--ce-light)', text: 'var(--ce-text)' },
                { label: 'CO Series', value: '40 series', light: 'var(--co-light)', text: 'var(--co-text)' },
                { label: 'EE IA', value: `${eeUsed}/${eeTotal} credits`, light: 'var(--ee-light)', text: 'var(--ee-text)' },
                { label: 'EO Sujets', value: 'Acces libre', light: 'var(--eo-light)', text: 'var(--eo-text)' },
              ].map(item => (
                <div key={item.label} style={{ background: item.light, borderRadius: 12, padding: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: item.text, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: item.text }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, margin: '0 0 20px' }}>Modifier mon profil</h3>
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Nom complet</label>
                  <input value={profileForm.full_name} onChange={e => setProfileForm(p => ({ ...p, full_name: e.target.value }))} style={inputStyle} placeholder="Votre nom" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Email</label>
                  <input value={profileForm.email} disabled style={{ ...inputStyle, background: 'var(--surface)', color: 'var(--text-3)', cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Telephone</label>
                  <input value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} style={inputStyle} placeholder="+1 514 000 0000" />
                </div>
              </div>
              <button type="submit" disabled={saving} style={{ ...btnStyle, opacity: saving ? 0.6 : 1 }}>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</button>
            </form>
          </div>

          {/* Results */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, margin: '0 0 20px' }}>Resultats recents</h3>
            <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-4)', fontSize: 14 }}>
              Aucun resultat enregistre. <Link to="/epreuve/comprehension-ecrite/series" style={{ color: 'var(--co-main)', fontWeight: 700, textDecoration: 'none' }}>Commencer une serie &rarr;</Link>
            </div>
          </div>

          {/* Password */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, margin: '0 0 20px' }}>Changer le mot de passe</h3>
            <form onSubmit={handleChangePassword} style={{ maxWidth: 360 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Nouveau mot de passe</label>
                  <input type="password" value={pwForm.password} onChange={e => setPwForm(p => ({ ...p, password: e.target.value }))} style={inputStyle} placeholder="Min. 8 caracteres" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>Confirmer le mot de passe</label>
                  <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} style={inputStyle} placeholder="Repeter le mot de passe" />
                </div>
              </div>
              <button type="submit" disabled={savingPw} style={{ ...btnStyle, opacity: savingPw ? 0.6 : 1 }}>{savingPw ? 'Modification...' : 'Mettre a jour'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
