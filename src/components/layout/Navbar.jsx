import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Menu, X, BookOpen, Headphones, PenTool, Mic, Crown, LogOut, User } from 'lucide-react'

const epreuves = [
  { path: '/epreuve/comprehension-ecrite', label: 'Comp. Écrite', icon: <BookOpen size={16} /> },
  { path: '/epreuve/comprehension-orale', label: 'Comp. Orale', icon: <Headphones size={16} /> },
  { path: '/epreuve/expression-ecrite', label: 'Expr. Écrite', icon: <PenTool size={16} /> },
  { path: '/epreuve/expression-orale', label: 'Expr. Orale', icon: <Mic size={16} /> },
]

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-[#1A5276] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🍁</span>
          <span className="text-white font-bold text-lg hidden sm:block">Formation TCF Canada</span>
          <span className="text-white font-bold text-lg sm:hidden">TCF Canada</span>
        </Link>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/formations" className="text-blue-200 hover:text-white px-3 py-2 text-sm font-medium no-underline transition-colors">Formations</Link>
          <Link to="/tarifs" className="text-blue-200 hover:text-white px-3 py-2 text-sm font-medium no-underline transition-colors">Tarifs</Link>
          <Link to="/calculateur-nclc" className="text-blue-200 hover:text-white px-3 py-2 text-sm font-medium no-underline transition-colors">Calculateur NCLC</Link>
          <a href="https://wa.me/15062536067" target="_blank" rel="noreferrer"
            className="text-green-300 hover:text-green-100 px-3 py-2 text-sm font-medium no-underline transition-colors">
            WhatsApp
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold no-underline transition-colors hidden md:flex items-center gap-1">
              <Crown size={14} /> Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/mon-compte" className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors hidden md:flex items-center gap-1">
                <User size={14} /> {profile?.full_name?.split(' ')[0] || 'Mon Compte'}
              </Link>
              <button onClick={handleSignOut} className="text-blue-200 hover:text-white p-2 rounded-lg transition-colors hidden md:block" title="Déconnexion">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/connexion" className="text-blue-200 hover:text-white px-3 py-1.5 text-sm font-medium no-underline transition-colors">Connexion</Link>
              <Link to="/inscription" className="bg-white text-[#1A5276] hover:bg-blue-50 px-4 py-1.5 rounded-lg text-sm font-bold no-underline transition-colors">
                Commencer
              </Link>
            </div>
          )}
          {/* Hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="md:hidden bg-[#154360] border-t border-[#2E86C1] px-4 py-3">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {epreuves.map(e => (
              <Link key={e.path} to={e.path} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-medium no-underline hover:bg-white/20 transition-colors">
                {e.icon} {e.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-white/20 pt-3 flex flex-col gap-2">
            <Link to="/tarifs" onClick={() => setMobileOpen(false)} className="text-blue-200 text-sm no-underline">Tarifs</Link>
            <Link to="/formations" onClick={() => setMobileOpen(false)} className="text-blue-200 text-sm no-underline">Formations</Link>
            {user ? (
              <>
                <Link to="/mon-compte" onClick={() => setMobileOpen(false)} className="text-blue-200 text-sm no-underline">Mon Compte</Link>
                <button onClick={handleSignOut} className="text-red-300 text-sm text-left">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/connexion" onClick={() => setMobileOpen(false)} className="text-blue-200 text-sm no-underline">Connexion</Link>
                <Link to="/inscription" onClick={() => setMobileOpen(false)} className="bg-white text-[#1A5276] px-4 py-2 rounded-lg text-sm font-bold no-underline text-center">
                  Commencer gratuitement
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
