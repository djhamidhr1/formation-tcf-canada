import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'
import toast from 'react-hot-toast'
import { X, Mail, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, Leaf } from 'lucide-react'
/* Inline SVG icons to avoid react-icons dependency */
const FcGoogle = () => <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
const FaFacebook = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
const FaApple = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
const BsMicrosoft = () => <svg viewBox="0 0 16 16" width="20" height="20"><rect x="1" y="1" width="6.5" height="6.5" fill="#F25022"/><rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00"/><rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF"/><rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900"/></svg>

/* ─── Redirect URL helper ─── */
function getRedirectURL() {
  const base = window.location.origin
  if (base.includes('localhost')) return `${base}/`
  if (base.includes('github.io')) return `${base}/formation-tcf-canada/`
  return `${base}/`
}

/* ─── Social Provider Config ─── */
const PROVIDERS = [
  {
    id: 'google',
    label: 'Continuer avec Google',
    Icon: FcGoogle,
    iconColor: '',
    border: 'border-gray-200 hover:border-gray-300',
    bg: 'hover:bg-gray-50',
  },
  {
    id: 'facebook',
    label: 'Continuer avec Facebook',
    Icon: FaFacebook,
    iconColor: 'text-[#1877F2]',
    border: 'border-gray-200 hover:border-[#1877F2]/40',
    bg: 'hover:bg-[#FDF2E9]',
  },
  {
    id: 'apple',
    label: 'Continuer avec Apple',
    Icon: FaApple,
    iconColor: 'text-gray-900',
    border: 'border-gray-200 hover:border-gray-400',
    bg: 'hover:bg-gray-50',
  },
  {
    id: 'azure',
    label: 'Continuer avec Microsoft',
    Icon: BsMicrosoft,
    iconColor: 'text-[#00A4EF]',
    border: 'border-gray-200 hover:border-[#00A4EF]/40',
    bg: 'hover:bg-sky-50',
  },
]

/* ─── STEP TYPES ─── */
// 'social' → social buttons screen
// 'email'  → email/password form
// 'reset'  → forgot password
// 'sent'   → email sent confirmation

export default function AuthModal() {
  const { isOpen, closeModal, defaultMode } = useAuthModal()
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('social')
  const [mode, setMode] = useState(defaultMode) // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })

  /* Reset when modal opens/closes */
  useEffect(() => {
    if (isOpen) {
      setStep('social')
      setMode(defaultMode)
      setForm({ fullName: '', email: '', password: '', confirm: '' })
      setShowPwd(false)
      setShowConfirm(false)
    }
  }, [isOpen, defaultMode])

  /* Close on ESC */
  useEffect(() => {
    if (!isOpen) return
    const h = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, closeModal])

  if (!isOpen) return null

  /* ── Social sign-in ── */
  const handleSocial = async (provider) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getRedirectURL() },
    })
    if (error) {
      toast.error(`Erreur ${provider} : ${error.message}`)
    }
    setLoading(false)
  }

  /* ── Email sign-in / sign-up ── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'signup') {
      if (form.password !== form.confirm) { toast.error('Les mots de passe ne correspondent pas'); return }
      if (form.password.length < 6) { toast.error('Mot de passe trop court (6 car. min.)'); return }
    }
    setLoading(true)
    if (mode === 'login') {
      const { error } = await signIn(form.email, form.password)
      if (error) {
        toast.error(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message)
      } else {
        toast.success('Connexion réussie !')
        closeModal()
        navigate('/')
      }
    } else {
      const { error } = await signUp(form.email, form.password, form.fullName)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Compte créé ! Vérifiez votre email.')
        setStep('sent')
      }
    }
    setLoading(false)
  }

  /* ── Forgot password ── */
  const handleReset = async (e) => {
    e.preventDefault()
    if (!form.email) { toast.error('Entrez votre email'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: getRedirectURL() + '#/reset-password',
    })
    if (error) { toast.error(error.message) }
    else { setStep('sent') }
    setLoading(false)
  }

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-4 px-8 border-b border-gray-100">
          <p className="text-base font-extrabold text-gray-900">
            {step === 'social' && 'S\'inscrire ou se connecter'}
            {step === 'email' && (mode === 'login' ? 'Se connecter' : 'Créer un compte')}
            {step === 'reset' && 'Réinitialiser le mot de passe'}
            {step === 'sent' && 'Email envoyé'}
          </p>
        </div>

        <div className="px-6 py-6 space-y-3">

          {/* ── STEP: SOCIAL ── */}
          {step === 'social' && (
            <>
              {/* Logo */}
              <div className="flex flex-col items-center mb-3">
                <Leaf size={36} className="text-[#F98012] mb-2" />
                <p className="text-xs text-gray-400 font-medium">Formation TCF Canada</p>
              </div>

              {/* Google button only */}
              <button
                onClick={() => handleSocial('google')}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-[#F98012] hover:shadow-md rounded-xl text-sm font-semibold text-gray-700 transition-all disabled:opacity-50 shadow-sm"
              >
                <span className="shrink-0"><FcGoogle /></span>
                <span className="flex-1 text-center">Continuer avec Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou par email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Email button */}
              <button
                onClick={() => setStep('email')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-[#F98012] hover:shadow-md rounded-xl text-sm font-semibold text-gray-700 transition-all shadow-sm"
              >
                <Mail size={20} className="text-gray-500 shrink-0" />
                <span className="flex-1 text-center">Continuer avec Email</span>
              </button>

              {/* Legal */}
              <p className="text-center text-xs text-gray-400 pt-2 leading-relaxed">
                En continuant, vous acceptez nos{' '}
                <Link to="/conditions" onClick={closeModal} className="text-gray-500 hover:text-gray-800 transition-colors" style={{textDecoration:'underline'}}>Conditions</Link>
                {' '}et notre{' '}
                <Link to="/confidentialite" onClick={closeModal} className="text-gray-500 hover:text-gray-800 transition-colors" style={{textDecoration:'underline'}}>Politique de confidentialité</Link>.
              </p>
            </>
          )}

          {/* ── STEP: EMAIL FORM ── */}
          {step === 'email' && (
            <>
              {/* Back */}
              <button
                onClick={() => setStep('social')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 -mt-1 mb-2"
              >
                <ArrowLeft size={15} /> Retour
              </button>

              {/* Mode tabs */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                {[{ id: 'login', label: 'Se connecter' }, { id: 'signup', label: 'S\'inscrire' }].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setMode(t.id)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === t.id ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {/* Full name (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Nom complet</label>
                    <input
                      type="text" required value={form.fullName} onChange={update('fullName')}
                      placeholder="Prénom Nom"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98012] focus:border-transparent transition"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
                  <input
                    type="email" required value={form.email} onChange={update('email')}
                    placeholder="votre@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98012] focus:border-transparent transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'} required value={form.password} onChange={update('password')}
                      placeholder={mode === 'signup' ? '6 caractères minimum' : '••••••••'}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98012] focus:border-transparent transition"
                    />
                    <button type="button" onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password (signup only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'} required value={form.confirm} onChange={update('confirm')}
                        placeholder="••••••••"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98012] focus:border-transparent transition"
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Forgot password */}
                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" onClick={() => setStep('reset')}
                      className="text-xs text-[#0F3D58] hover:underline font-medium">
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-[#0F3D58] hover:bg-[#F98012] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  {!loading && ' →'}
                </button>
              </form>

              {/* Google shortcut */}
              <div className="pt-3 border-t border-gray-100">
                <button onClick={() => handleSocial('google')} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-[#F98012] hover:shadow-sm transition-all disabled:opacity-50">
                  <FcGoogle size={18} />
                  <span>Connexion rapide avec Google</span>
                </button>
              </div>
            </>
          )}

          {/* ── STEP: FORGOT PASSWORD ── */}
          {step === 'reset' && (
            <>
              <button onClick={() => setStep('email')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 -mt-1 mb-3">
                <ArrowLeft size={15} /> Retour
              </button>
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-[#e8f7f8] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={22} className="text-[#0F3D58]" />
                </div>
                <p className="text-sm text-gray-600">Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>
              </div>
              <form onSubmit={handleReset} className="space-y-3">
                <input
                  type="email" required value={form.email} onChange={update('email')}
                  placeholder="votre@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F98012]"
                />
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0F3D58] hover:bg-[#F98012] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Envoyer le lien
                </button>
              </form>
            </>
          )}

          {/* ── STEP: EMAIL SENT ── */}
          {step === 'sent' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2">Email envoyé !</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Vérifiez votre boîte mail et cliquez sur le lien pour {step === 'sent' && mode === 'signup' ? 'confirmer votre compte.' : 'réinitialiser votre mot de passe.'}
              </p>
              <button onClick={closeModal}
                className="bg-[#0F3D58] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#F98012]">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
