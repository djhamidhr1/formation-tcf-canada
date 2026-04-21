import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'

export default function RegisterPage() {
  const { user } = useAuth()
  const { openModal } = useAuthModal()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) { navigate('/'); return }
    openModal('signup')
  }, [])

  if (user) return null

  return null
}
