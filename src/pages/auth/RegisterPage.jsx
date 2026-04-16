import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { toast.error('Les mots de passe ne correspondent pas'); return }
    if (form.password.length < 6) { toast.error('Mot de passe trop court (6 caractères minimum)'); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.fullName)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Compte créé ! Vérifiez votre email pour confirmer.')
      navigate('/connexion')
    }
    setLoading(false)
  }

  const update = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] to-[#2E86C1] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🍁</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-3 mb-1">Créer un compte</h1>
          <p className="text-gray-500 text-sm">Commencez votre préparation gratuite</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: 'fullName', label: 'Nom complet', type: 'text', placeholder: 'Prénom Nom' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
            { key: 'password', label: 'Mot de passe', type: 'password', placeholder: '6 caractères minimum' },
            { key: 'confirm', label: 'Confirmer le mot de passe', type: 'password', placeholder: '••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-sm font-semibold text-gray-700 block mb-1">{f.label}</label>
              <input type={f.type} required value={form[f.key]} onChange={update(f.key)}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276]" />
            </div>
          ))}
          <button type="submit" disabled={loading}
            className="w-full bg-[#1A5276] hover:bg-[#154360] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60 mt-2">
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-[#1A5276] font-semibold no-underline hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
