import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'
import toast from 'react-hot-toast'
import { X, Mail, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaApple } from 'react-icons/fa'
import { BsMicrosoft } from 'react-icons/bs'

/* ─── Redirect URL helper ─── */
function getRedirectURL() {
  const base = window.location.origin
  const isProd = !base.includes('localhost')
  return isProd ? `${base}/formation-tcf-canada/` : `${base}/`
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
    bg: 'hover:bg-blue-50',
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
              <div className="flex flex-col items-center mb-2">
                <span className="text-5xl mb-2">🍁</span>
                <p className="text-xs text-gray-400 font-medium">Formation TCF Canada</p>
              </div>

              {/* Social buttons */}
              <div className="space-y-2.5">
                {PROVIDERS.map(({ id, label, Icon, iconColor, border, bg }) => (
                  <button
                    key={id}
                    onClick={() => handleSocial(id)}
                    disabled={loading}
                    className={`w-full flex items-center gap-3 px-4 py-3 bg-white border rounded-xl text-sm font-semibold text-gray-700 transition-all ${border} ${bg} disabled:opacity-50 shadow-sm hover:shadow-md`}
                  >
                    <Icon size={20} className={`shrink-0 ${iconColor}`} />
                    <span className="flex-1 text-center">{label}</span>
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">ou</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Email button */}
              <button
                onClick={() => setStep('email')}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-all"
              >
                <Mail size={20} className="text-gray-500 shrink-0" />
                <span className="flex-1 text-center">Continuer avec Email</span>
              </button>

              {/* Legal */}
              <p className="text-center text-xs text-gray-400 pt-2 leading-relaxed">
                En continuant, vous acceptez nos{' '}
                <Link to="/conditions" onClick={closeModal} className="underline text-gray-500 hover:text-gray-800 transition-colors no-underline" style={{textDecoration:'underline'}}>Conditions d'utilisation</Link>
                {' '}et notre{' '}
                <Link to="/confidentialite" onClick={closeModal} className="underline text-gray-500 hover:text-gray-800 transition-colors no-underline" style={{textDecoration:'underline'}}>Politique de confidentialité</Link>.
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
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276] focus:border-transparent transition"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Email</label>
                  <input
                    type="email" required value={form.email} onChange={update('email')}
                    placeholder="votre@email.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276] focus:border-transparent transition"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'} required value={form.password} onChange={update('password')}
                      placeholder={mode === 'signup' ? '6 caractères minimum' : '••••••••'}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276] focus:border-transparent transition"
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
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276] focus:border-transparent transition"
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
                      className="text-xs text-[#1A5276] hover:underline font-medium">
                      Mot de passe oublié ?
                    </button>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-[#1A5276] hover:bg-[#154360] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-1"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  {!loading && ' →'}
                </button>
              </form>

              {/* Social mini links */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-2">Ou connectez-vous via</p>
                <div className="flex justify-center gap-3">
                  {PROVIDERS.slice(0,4).map(({ id, Icon, iconColor }) => (
                    <button key={id} onClick={() => handleSocial(id)} disabled={loading}
                      className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all disabled:opacity-50">
                      <Icon size={18} className={iconColor} />
                    </button>
                  ))}
                </div>
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
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail size={22} className="text-[#1A5276]" />
                </div>
                <p className="text-sm text-gray-600">Entrez votre email et nous vous enverrons un lien de réinitialisation.</p>
              </div>
              <form onSubmit={handleReset} className="space-y-3">
                <input
                  type="email" required value={form.email} onChange={update('email')}
                  placeholder="votre@email.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276]"
                />
                <button type="submit" disabled={loading}
                  className="w-full bg-[#1A5276] hover:bg-[#154360] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
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
                className="bg-[#1A5276] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#154360]">
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
