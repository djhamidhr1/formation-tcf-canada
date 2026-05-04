import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()
  const isSimulator = location.pathname.includes('/entrainement/') || location.pathname.includes('/simulateur')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font)' }}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Navbar />
      <main className="page-enter" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      {!isSimulator && <Footer />}
    </div>
  )
}
