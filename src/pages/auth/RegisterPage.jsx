import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'

export default function RegisterPage() {
  const { user } = useAuth()
  const { openModal, isOpen } = useAuthModal()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) { navigate('/'); return }
    openModal('signup')
  }, [])

  // If user registers/logs in, go home
  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  // If modal is closed without signing up, go home
  useEffect(() => {
    if (!isOpen && !user) navigate('/')
  }, [isOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A5276] to-[#2E86C1] flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-5xl mb-4">🍁</div>
        <p className="text-blue-200 text-sm">Inscription en cours…</p>
      </div>
    </div>
  )
}
