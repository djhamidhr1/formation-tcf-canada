import { Link } from 'react-router-dom'
import { PenTool, Zap, BarChart2, FileText } from 'lucide-react'

const C = {
  icon: PenTool, label: 'Expression Écrite',
  tagline: 'Démontrez votre capacité à rédiger en français. Maîtrisez les 3 tâches du TCF.',
  stats: ['60 min', '3 tâches', '20 pts'],
  statLabels: ['Durée totale', 'Par série', 'Score max'],
  info: 'Format : 3 tâches de rédaction (message, narration, argumentation)',
  tips: ['Respectez le nombre de mots demandé', 'Structurez votre réponse clairement', 'Relisez pour corriger les fautes'],
  subjectsLink: '/epreuve/expression-ecrite/sujets-actualites',
  tipsLink: '/epreuve/expression-ecrite/astuces',
  dashLink: '/epreuve/expression-ecrite/tableau-de-bord',
}

export default function EEHomePage() {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, var(--navy), var(--navy-mid))', color: '#fff', padding: '64px 16px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', color: 'var(--orange)' }}><C.icon size={48} /></div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px' }}>{C.label}</h1>
          <p style={{ opacity: 0.85, fontSize: 17, margin: '0 0 28px' }}>{C.tagline}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 32 }}>
            {C.stats.map((v, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--orange)' }}>{v}</div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{C.statLabels[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Link to={C.subjectsLink} className="btn-hero-white">Voir les sujets</Link>
            <Link to={C.tipsLink} className="btn-hero-outline">Astuces &amp; Barème</Link>
          </div>
        </div>
      </div>

      {/* Info + Tips */}
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* About card */}
          <div style={{ background: 'var(--orange-light)', borderRadius: 16, padding: 24, border: '1px solid rgba(249,128,18,0.15)' }}>
            <div style={{ marginBottom: 6, color: 'var(--orange)' }}><C.icon size={20} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', margin: '0 0 10px' }}>À propos de l'épreuve</h2>
            <p style={{ fontSize: 14, color: 'var(--text-2)', margin: '0 0 16px', lineHeight: 1.6 }}>{C.info}</p>
            {['Niveaux : A1 à C2', 'Barème : 3 à 33 pts/question', 'NCLC : Scores 3 à 10+'].map(r => (
              <div key={r} style={{ fontSize: 13, color: 'var(--text-2)', padding: '6px 0', borderTop: '1px solid rgba(249,128,18,0.15)' }}>{r}</div>
            ))}
          </div>
          {/* Tips card */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
            <div style={{ marginBottom: 6, color: 'var(--orange)' }}><Zap size={20} /></div>
            <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 14px', color: 'var(--navy)' }}>Astuces rapides</h2>
            {C.tips.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: '#374151' }}>
                <span className="avatar-circle">{i + 1}</span>
                {t}
              </div>
            ))}
            <Link to={C.subjectsLink} className="btn-start-session">Commencer une session</Link>
          </div>
        </div>

        {/* Nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 36 }}>
          {[
            { to: C.dashLink, icon: BarChart2, title: 'Tableau de bord', desc: 'Consultez votre progression et vos corrections' },
            { to: C.subjectsLink, icon: FileText, title: "Sujets d'actualités", desc: '326 combinaisons de sujets réels du TCF' },
            { to: C.tipsLink, icon: Zap, title: 'Astuces & Barème', desc: 'Stratégies de rédaction et guide de notation' },
          ].map(c => (
            <Link key={c.to} to={c.to} className="nav-card">
              <div className="nav-card-icon" style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}><c.icon size={28} /></div>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-1)', margin: '0 0 4px' }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
