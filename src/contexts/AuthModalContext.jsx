import { createContext, useContext, useState } from 'react'

const AuthModalContext = createContext(null)

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [defaultMode, setDefaultMode] = useState('login') // 'login' | 'signup'

  const openModal = (mode = 'login') => { setDefaultMode(mode); setIsOpen(true) }
  const closeModal = () => setIsOpen(false)

  return (
    <AuthModalContext.Provider value={{ isOpen, openModal, closeModal, defaultMode }}>
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext)
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider')
  return ctx
}
