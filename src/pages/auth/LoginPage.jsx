import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'

export default function LoginPage() {
  const { user } = useAuth()
  const { openModal, isOpen } = useAuthModal()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) { navigate('/'); return }
    openModal('login')
  }, [])

  // If user logs in, go home
  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  // If modal is closed without logging in, go home
  useEffect(() => {
    if (!isOpen && !user) navigate('/')
  }, [isOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] to-[#2E86C1] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-4"><Leaf size={40} /></div>
        <p className="text-blue-200 text-sm">Connexion en cours…</p>
      </div>
    </div>
  )
}
