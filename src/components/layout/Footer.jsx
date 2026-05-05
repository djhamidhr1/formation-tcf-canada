import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, BookOpen, Headphones, PenTool, Mic, MessageCircle, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(200, 215, 225, 0.9)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ background: 'white', borderRadius: 8, padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="TCF Canada" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
              </div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>TCF Canada</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16, color: 'rgba(160, 190, 210, 0.8)' }}>
              Plateforme specialisee dans la preparation au TCF Canada et TCF Quebec.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'rgba(140, 175, 200, 0.8)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={13} /> Montreal, QC, Canada</span>
              <a href="mailto:hamid@formation-tcf.com" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}>
                <Mail size={13} style={{ flexShrink: 0 }} /> hamid@formation-tcf.com
              </a>
              <a href="tel:+15147467431" style={{ color: 'white', textDecoration: 'none', transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}
                onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}>
                <Phone size={13} style={{ flexShrink: 0 }} /> +1 514 746 7431
              </a>
            </div>
          </div>

          {/* Epreuves */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Epreuves TCF</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['/epreuve/comprehension-ecrite', BookOpen, 'Comprehension Ecrite'],
                ['/epreuve/comprehension-orale', Headphones, 'Comprehension Orale'],
                ['/epreuve/expression-ecrite', PenTool, 'Expression Ecrite'],
                ['/epreuve/expression-orale', Mic, 'Expression Orale'],
              ].map(([path, Icon, label]) => (
                <Link key={path} to={path} style={{ color: 'white', fontSize: 13, fontWeight: 500, transition: 'color 0.15s', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                  onMouseLeave={e => e.currentTarget.style.color = 'white'}><Icon size={13} /> {label}</Link>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Liens rapides</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                ['/tarifs', 'Tarification'],
                ['/formations', 'Formations Zoom'],
                ['/calculateur-nclc', 'Calculateur NCLC'],
                ['/connexion', 'Se connecter'],
                ['/inscription', "S'inscrire"],
                ['/faq', 'FAQ'],
                ['/conditions', 'Conditions'],
              ].map(([path, label]) => (
                <Link key={path} to={path} style={{ color: 'white', fontSize: 13, fontWeight: 500, transition: 'color 0.15s', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                  onMouseLeave={e => e.currentTarget.style.color = 'white'}>{label}</Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nous suivre</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#25a56a', color: 'white', padding: '10px 14px',
                borderRadius: 10, fontSize: 13, fontWeight: 600, transition: 'filter 0.15s', textDecoration: 'none',
              }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                 onMouseLeave={e => e.currentTarget.style.filter = ''}>
                <MessageCircle size={14} /> WhatsApp
              </a>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#dc2626', color: 'white', padding: '10px 14px',
                borderRadius: 10, fontSize: 13, fontWeight: 600, transition: 'filter 0.15s', textDecoration: 'none',
              }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.15)'}
                 onMouseLeave={e => e.currentTarget.style.filter = ''}>
                <Play size={14} /> YouTube
              </a>
            </div>
          </div>

          {/* Paiement */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nous acceptons</h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'rgba(140, 175, 200, 0.8)' }}>
                {['Western Union', 'Ria', 'Orange Money', 'MTN', 'Wave', 'PayPal'].map(m => (
                  <div key={m} style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: 6, padding: '4px 8px', textAlign: 'center', fontWeight: 600 }}>{m}</div>
                ))}
              </div>
            </div>
            <Link to="/tarifs" style={{
              display: 'block', width: '100%', background: 'white', color: 'var(--navy)',
              borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700,
              textAlign: 'center', textDecoration: 'none', transition: 'filter 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
            onMouseLeave={e => e.currentTarget.style.filter = ''}>Voir les tarifs &rarr;</Link>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'rgba(113, 201, 206, 0.7)' }}>&copy; 2026 Formation TCF Canada. Tous droits reserves.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              ['/confidentialite', 'Confidentialite'],
              ['/conditions', 'Conditions'],
              ['/faq', 'FAQ'],
            ].map(([path, label]) => (
              <Link key={label} to={path} style={{ color: 'white', fontSize: 13, transition: 'color 0.15s', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = '#F98012'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
