import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useAuthModal } from '../../contexts/AuthModalContext'
import { Crown, LogOut, User, BookOpen, Headphones, PenTool, Mic, Home, GraduationCap, DollarSign, Calculator, MessageCircle } from 'lucide-react'

const epreuves = [
  { path: '/epreuve/comprehension-ecrite', label: 'Comprehension Ecrite', color: 'var(--ce-main)', icon: BookOpen },
  { path: '/epreuve/comprehension-orale', label: 'Comprehension Orale', color: 'var(--co-main)', icon: Headphones },
  { path: '/epreuve/expression-ecrite', label: 'Expression Ecrite', color: 'var(--ee-main)', icon: PenTool },
  { path: '/epreuve/expression-orale', label: 'Expression Orale', color: 'var(--eo-main)', icon: Mic },
]

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const { openModal } = useAuthModal()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const nav = (path) => { navigate(path); setMobileOpen(false) }

  const currentPath = location.pathname

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
          .nav-epreuves-bar { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-toggle { display: none !important; }
        }
        .nav-mobile-drawer {
          position: fixed; inset: 0; z-index: 200;
          display: flex; flex-direction: column;
          background: var(--navy);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
        }
        .nav-mobile-drawer.open { transform: translateX(0); }
        .epreuve-bar-btn:hover { color: #F98012 !important; }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'rgba(15, 61, 88, 0.97)' : 'var(--navy)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 1px 24px rgba(0, 0, 0, 0.18)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        {/* Primary Bar */}
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ background: 'white', borderRadius: 10, padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)' }}>
              <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="TCF Canada" style={{ height: 44, width: 'auto', objectFit: 'contain' }} />
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Formation TCF Canada</span>
          </Link>

          {/* Desktop Links */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[
              ['/formations', 'Formations'],
              ['/tarifs', 'Tarifs'],
              ['/calculateur-nclc', 'Calculateur NCLC'],
            ].map(([path, label]) => (
              <Link key={path} to={path} style={{
                color: 'white',
                background: currentPath === path ? 'rgba(255, 255, 255, 0.12)' : 'none',
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                transition: 'all 0.15s', textDecoration: 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F98012'; e.currentTarget.style.background = 'rgba(249, 128, 18, 0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = currentPath === path ? 'rgba(255, 255, 255, 0.12)' : 'none' }}>
                {label}
              </Link>
            ))}
            <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
              color: 'white', fontWeight: 700, fontSize: 14, padding: '8px 14px',
              borderRadius: 8, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#F98012'; e.currentTarget.style.background = 'rgba(249, 128, 18, 0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'none' }}>
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {isAdmin && (
              <Link to="/admin" style={{
                background: 'var(--eo-main)', color: 'white', padding: '6px 12px',
                borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Crown size={13} /> Admin
              </Link>
            )}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to="/mon-compte" style={{
                  background: 'rgba(255, 255, 255, 0.12)', color: 'white', padding: '8px 14px',
                  borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}>
                  <User size={14} /> {profile?.full_name?.split(' ')[0] || 'Mon Compte'}
                </Link>
                <button onClick={handleSignOut} style={{
                  color: 'white', padding: 8, borderRadius: 8, transition: 'color 0.15s',
                }} onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                   onMouseLeave={e => e.currentTarget.style.color = 'white'}>
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => openModal('login')} style={{
                  color: 'white', fontSize: 14, fontWeight: 600, padding: '8px 12px',
                  borderRadius: 8, transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}>
                  Connexion
                </button>
                <button onClick={() => openModal('signup')} style={{
                  background: '#F98012', color: 'white', padding: '9px 18px',
                  borderRadius: 999, fontSize: 14, fontWeight: 700, transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(249, 128, 18, 0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#71C9CE'; e.currentTarget.style.color = '#0F3D58'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(113, 201, 206, 0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 128, 18, 0.3)' }}>
                  Commencer gratuitement
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: 'flex', flexDirection: 'column', gap: 5, padding: 8, borderRadius: 8,
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 22, height: 2, background: 'white', borderRadius: 2,
                transition: 'all 0.25s',
                transform: mobileOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'scaleX(0)') : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Epreuves Bar - desktop only */}
        <div className="nav-epreuves-bar" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(10, 48, 70, 0.6)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link to="/" className="epreuve-bar-btn" style={{
              color: 'white',
              background: currentPath === '/' ? 'rgba(255, 255, 255, 0.1)' : 'none',
              padding: '9px 14px', fontSize: 13, fontWeight: 600,
              borderRadius: 6, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
              textDecoration: 'none',
            }}><Home size={14} /> Accueil</Link>
            <div style={{ width: 1, height: 18, background: 'rgba(255, 255, 255, 0.15)', margin: '0 4px' }} />
            {epreuves.map(ep => {
              const active = currentPath.startsWith(ep.path)
              return (
                <Link key={ep.path} to={ep.path} className="epreuve-bar-btn" style={{
                  color: 'white',
                  background: active ? `color-mix(in srgb, ${ep.color} 20%, transparent)` : 'none',
                  padding: '9px 14px', fontSize: 13, fontWeight: 600,
                  borderRadius: 6, transition: 'all 0.15s', whiteSpace: 'nowrap',
                  textDecoration: 'none',
                }}>
                  {ep.label}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-mobile-drawer${mobileOpen ? ' open' : ''}`}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'white', borderRadius: 8, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="TCF Canada" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
            </div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>Formation TCF Canada</span>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'rgba(255, 255, 255, 0.12)', color: 'white', width: 36, height: 36, borderRadius: 8, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#x2715;</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(249, 128, 18, 0.7)', textTransform: 'uppercase', marginBottom: 12 }}>Epreuves TCF</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {epreuves.map(ep => (
              <button key={ep.path} onClick={() => nav(ep.path)} style={{
                background: currentPath.startsWith(ep.path) ? `color-mix(in srgb, ${ep.color} 15%, transparent)` : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${currentPath.startsWith(ep.path) ? `color-mix(in srgb, ${ep.color} 30%, transparent)` : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 14, padding: '14px 12px', textAlign: 'left',
              }}>
                <div style={{ marginBottom: 6 }}><ep.icon size={22} style={{ color: 'white' }} /></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>{ep.label}</div>
              </button>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(249, 128, 18, 0.7)', textTransform: 'uppercase', marginBottom: 12 }}>Navigation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
            {[['/', Home, 'Accueil'], ['/formations', GraduationCap, 'Formations Zoom'], ['/tarifs', DollarSign, 'Tarifs'], ['/calculateur-nclc', Calculator, 'Calculateur NCLC']].map(([path, Icon, label]) => (
              <button key={path} onClick={() => nav(path)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: currentPath === path ? 'rgba(255, 255, 255, 0.1)' : 'none',
                padding: '12px 16px', borderRadius: 12,
                color: 'white', fontSize: 15, fontWeight: 600, textAlign: 'left',
              }}>
                <Icon size={18} />{label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user ? (
              <>
                <button onClick={() => nav('/mon-compte')} style={{
                  background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700,
                }}>Mon Compte</button>
                <button onClick={() => { handleSignOut(); setMobileOpen(false) }} style={{
                  background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700,
                }}>Deconnexion</button>
              </>
            ) : (
              <>
                <button onClick={() => { openModal('login'); setMobileOpen(false) }} style={{
                  background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700,
                }}>Se connecter</button>
                <button onClick={() => { openModal('signup'); setMobileOpen(false) }} style={{
                  background: 'white', color: 'var(--navy)',
                  padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700,
                }}>Commencer gratuitement</button>
              </>
            )}
            <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#25a56a', color: 'white',
              padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}><MessageCircle size={16} /> WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  )
}
