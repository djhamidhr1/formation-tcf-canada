import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast.error(error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : error.message)
    } else {
      toast.success('Connexion réussie !')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] to-[#2E86C1] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🍁</span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-3 mb-1">Connexion</h1>
          <p className="text-gray-500 text-sm">Accédez à votre espace de préparation</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276]" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Mot de passe</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5276]" />
          </div>
          <div className="text-right">
            <button type="button" className="text-xs text-[#1A5276] hover:underline">Mot de passe oublié ?</button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#1A5276] hover:bg-[#154360] text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-60">
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas de compte ?{' '}
          <Link to="/inscription" className="text-[#1A5276] font-semibold no-underline hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
