import { Link } from 'react-router-dom'
import { BookOpen, Zap, BarChart2, Library } from 'lucide-react'

const C = {
  icon: BookOpen, label: 'Comprehension Ecrite',
  tagline: 'Lisez des textes varies et authentiques. Maitrisez la lecture en francais.',
  stats: ['60 min', '39 questions', '699 pts'],
  statLabels: ['Duree totale', 'Par serie', 'Score max'],
  main: 'var(--ce-main)', light: 'var(--ce-light)', text: 'var(--ce-text)',
  heroGrad: 'linear-gradient(145deg, var(--navy), var(--navy-mid))',
  info: 'Format : Textes varies (dialogues, emails, articles, publicites)',
  tips: ['Lisez la question avant le texte', 'Reperez les mots-cles dans le texte', 'Eliminez les mauvaises reponses'],
  seriesLink: '/epreuve/comprehension-ecrite/series',
  tipsLink: '/epreuve/comprehension-ecrite/astuces',
  dashLink: '/epreuve/comprehension-ecrite/tableau-de-bord',
}

export default function CEHomePage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: C.heroGrad, color: '#fff', padding: '64px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><C.icon size={48} /></div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px' }}>{C.label}</h1>
          <p style={{ opacity: 0.85, fontSize: 17, margin: '0 0 28px' }}>{C.tagline}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
            {C.stats.map((v, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{v}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{C.statLabels[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link to={C.seriesLink} style={{ background: '#fff', color: C.main, fontWeight: 700, padding: '12px 28px', borderRadius: 12, fontSize: 16, textDecoration: 'none' }}>
              Voir les series
            </Link>
            <Link to={C.tipsLink} style={{ border: '2px solid rgba(255,255,255,.5)', color: '#fff', fontWeight: 600, padding: '11px 24px', borderRadius: 12, fontSize: 15, textDecoration: 'none', background: 'transparent' }}>
              Astuces &amp; Bareme
            </Link>
          </div>
        </div>
      </div>

      {/* Info + Tips */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* About card */}
          <div style={{ background: C.light, borderRadius: 16, padding: 24 }}>
            <div style={{ marginBottom: 6 }}><C.icon size={20} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>A propos de l'epreuve</h2>
            <p style={{ fontSize: 14, color: C.text, margin: '0 0 16px', lineHeight: 1.6 }}>{C.info}</p>
            {['Niveaux : A1 a C2', 'Bareme : 3 a 33 pts/question', 'NCLC : Scores 3 a 10+'].map(r => (
              <div key={r} style={{ fontSize: 13, color: C.text, padding: '6px 0', borderTop: '1px solid rgba(0,0,0,.08)' }}>{r}</div>
            ))}
          </div>
          {/* Tips card */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
            <div style={{ marginBottom: 6 }}><Zap size={20} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 14px' }}>Astuces rapides</h2>
            {C.tips.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: '#374151' }}>
                <span style={{ background: C.main, color: '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                {t}
              </div>
            ))}
            <Link to={C.seriesLink} style={{ display: 'inline-block', marginTop: 12, background: C.main, color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: 10, fontSize: 14, textDecoration: 'none' }}>
              Commencer une session
            </Link>
          </div>
        </div>

        {/* Nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 36 }}>
          {[
            { to: C.dashLink, icon: BarChart2, title: 'Tableau de bord', desc: 'Suivez votre progression et vos statistiques' },
            { to: C.seriesLink, icon: Library, title: 'Grille des series', desc: '39 series completes a votre disposition' },
            { to: C.tipsLink, icon: Zap, title: 'Astuces & Bareme', desc: 'Strategies et guide de notation officiel' },
          ].map(c => (
            <Link key={c.to} to={c.to} style={{ background: 'var(--white)', borderRadius: 14, padding: 22, border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center', boxShadow: 'var(--shadow-sm)', transition: 'all 0.25s cubic-bezier(.4,0,.2,1)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px -4px oklch(55% 0.14 235 / 0.25), var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'oklch(58% 0.14 235 / 0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)' }}>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center', color: 'var(--blue)' }}><c.icon size={28} /></div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)', margin: '0 0 4px' }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
