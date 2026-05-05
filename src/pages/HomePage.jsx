import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { BookOpen, Headphones, PenTool, Mic, TrendingUp, Brain, Calendar, Users, Shield, Clock, MessageCircle, Mail, GraduationCap, Zap, Check } from 'lucide-react'

const EPREUVES = [
  { path: '/epreuve/comprehension-orale', ekey: 'co', icon: Headphones, label: 'Comprehension Orale', desc: 'Ecoutez des documents audio authentiques et repondez aux questions', details: '39 questions \u00b7 35 min', score: '699 pts max', free: true },
  { path: '/epreuve/comprehension-ecrite', ekey: 'ce', icon: BookOpen, label: 'Comprehension Ecrite', desc: 'Lisez des textes varies et authentiques de niveau A1 a C2', details: '39 questions \u00b7 60 min', score: '699 pts max', free: true },
  { path: '/epreuve/expression-orale', ekey: 'eo', icon: Mic, label: 'Expression Orale', desc: "Preparez-vous a l'oral avec des sujets d'actualite reels", details: '3 taches \u00b7 12 min', score: '20 pts max', free: true },
  { path: '/epreuve/expression-ecrite', ekey: 'ee', icon: PenTool, label: 'Expression Ecrite', desc: 'Redigez des textes structures corriges par IA (Claude Opus)', details: '3 taches \u00b7 60 min', score: '20 pts max', free: false },
]

const AVANTAGES = [
  { icon: TrendingUp, title: 'Suivi de Progression', desc: 'Statistiques detaillees par serie et par niveau NCLC.' },
  { icon: Brain, title: 'Correction IA', desc: 'Claude Opus analyse vos textes selon les criteres TCF officiels.' },
  { icon: Calendar, title: 'Sujets 2026', desc: "Contenus mis a jour chaque mois avec les derniers sujets d'actualite." },
  { icon: Users, title: 'Accompagnement', desc: 'Formateurs certifies FLE disponibles en Zoom prive.' },
  { icon: Shield, title: 'Conditions Reelles', desc: 'Simulateur exact du TCF officiel avec timer et mode correction.' },
  { icon: Clock, title: 'Acces 24/7', desc: "Revisez a tout moment, depuis n'importe quel appareil." },
]

const FAQ = [
  { q: 'Les exercices sont-ils conformes au vrai TCF Canada ?', a: "Oui, tous nos exercices suivent le format officiel du TCF Canada (CIEP/France Education International). Nos series reproduisent la distribution exacte des niveaux (A1\u2192C2) et le bareme officiel." },
  { q: 'Puis-je utiliser la plateforme sur mobile ?', a: "Absolument. La plateforme est mobile-first, optimisee pour smartphone, tablette et ordinateur. Plus de 60% de nos utilisateurs revisent sur telephone." },
  { q: 'Puis-je changer de forfait ?', a: "Oui, vous pouvez upgrader a tout moment. Contactez-nous sur WhatsApp et la difference est calculee au prorata des jours restants." },
  { q: "Comment fonctionne la correction IA de l'Expression Ecrite ?", a: "Notre IA (Claude Opus d'Anthropic) analyse vos textes selon les 4 criteres officiels TCF : coherence, lexique, grammaire, et pertinence. Vous recevez un score /20, des points forts, des axes d'amelioration, et un texte modele." },
  { q: "Y a-t-il une periode d'essai gratuite ?", a: "Oui ! L'acces aux series CE et CO (39 questions chacune), et aux sujets EO est entierement gratuit. Le simulateur IA pour l'Expression Ecrite necessite un abonnement." },
]

const NCLC_TABLE = [
  ['549 \u2013 699', '10+'], ['499 \u2013 548', '9'], ['453 \u2013 498', '8'],
  ['406 \u2013 452', '7'], ['375 \u2013 405', '6'], ['342 \u2013 374', '5'],
  ['226 \u2013 341', '4'], ['< 226', '3'],
]

const epreuveColors = {
  co: { main: 'var(--co-main)', light: 'var(--co-light)', text: 'var(--co-text)' },
  ce: { main: 'var(--ce-main)', light: 'var(--ce-light)', text: 'var(--ce-text)' },
  eo: { main: 'var(--eo-main)', light: 'var(--eo-light)', text: 'var(--eo-text)' },
  ee: { main: 'var(--ee-main)', light: 'var(--ee-light)', text: 'var(--ee-text)' },
}

function Section({ children, style, bg }) {
  return (
    <section style={{ background: bg || 'transparent', padding: '72px 24px', ...style }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>{children}</div>
    </section>
  )
}

function SectionTitle({ title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 48 }}>
      <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: 8, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 17, color: 'var(--text-3)', maxWidth: 560, margin: center ? '8px auto 0' : '8px 0 0', lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  )
}

function Card({ children, style, hover, onClick }) {
  return (
    <div onClick={onClick}
      style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
        ...style,
      }}
      onMouseEnter={e => { if (hover) { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-3px)' } }}
      onMouseLeave={e => { if (hover) { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' } }}>
      {children}
    </div>
  )
}

function Badge({ children, color = 'navy' }) {
  const colors = {
    navy: { bg: 'var(--blue-pale)', color: 'var(--blue)' },
    ce: { bg: 'var(--ce-light)', color: 'var(--ce-text)' },
    co: { bg: 'var(--co-light)', color: 'var(--co-text)' },
    ee: { bg: 'var(--ee-light)', color: 'var(--ee-text)' },
    eo: { bg: 'var(--eo-light)', color: 'var(--eo-text)' },
    gray: { bg: 'var(--surface-2)', color: 'var(--text-2)' },
  }
  const c = colors[color] || colors.navy
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.color,
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      fontSize: 12, fontWeight: 600,
    }}>{children}</span>
  )
}

function ProgressBar({ value, max, color = 'var(--blue)', height = 6, style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 999, height, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.4s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  )
}

export default function HomePage() {
  const [stats, setStats] = useState({ questions: '3 081', series: '79', combinaisons: '326', sujets: '2 886' })
  const [faqOpen, setFaqOpen] = useState(null)
  const [nclc, setNclc] = useState({ ce: '', co: '', ee: '', eo: '' })
  const [contactForm, setContactForm] = useState({ nom: '', email: '', message: '' })

  useEffect(() => {
    Promise.all([
      supabase.from('questions_ce').select('id', { count: 'exact', head: true }),
      supabase.from('questions_co').select('id', { count: 'exact', head: true }),
      supabase.from('series_ce').select('id', { count: 'exact', head: true }),
      supabase.from('series_co').select('id', { count: 'exact', head: true }),
      supabase.from('combinaisons_ee').select('id', { count: 'exact', head: true }),
      supabase.from('sujets_eo').select('id', { count: 'exact', head: true }),
    ]).then(([qce, qco, sce, sco, ee, eo]) => {
      const totalQ = (qce.count || 1521) + (qco.count || 1560)
      const totalS = (sce.count || 39) + (sco.count || 40)
      setStats({
        questions: totalQ.toLocaleString('fr-FR'),
        series: String(totalS),
        combinaisons: String(ee.count || 326),
        sujets: (eo.count || 2855).toLocaleString('fr-FR'),
      })
    })
  }, [])

  const getNclcCeCo = s => { if (s >= 549) return '10+'; if (s >= 499) return '9'; if (s >= 453) return '8'; if (s >= 406) return '7'; if (s >= 375) return '6'; if (s >= 342) return '5'; if (s >= 226) return '4'; return '3' }
  const getNclcEeEo = s => { if (s >= 18) return '10+'; if (s >= 16) return '10'; if (s >= 14) return '9'; if (s >= 12) return '8'; if (s >= 10) return '7'; if (s >= 7) return '6'; if (s >= 4) return '5'; return '4' }
  const nclcRes = {
    ce: nclc.ce ? getNclcCeCo(+nclc.ce) : null,
    co: nclc.co ? getNclcCeCo(+nclc.co) : null,
    ee: nclc.ee ? getNclcEeEo(+nclc.ee) : null,
    eo: nclc.eo ? getNclcEeEo(+nclc.eo) : null,
  }

  return (
    <div>
      {/* HERO — Beige Sable + Formes organiques */}
      <div style={{
        background: '#FDF2E9',
        position: 'relative', overflow: 'hidden', padding: '96px 24px 80px',
      }}>
        {/* Organic circles */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 480, height: 480, borderRadius: '50%', background: 'rgba(113, 201, 206, 0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'rgba(249, 128, 18, 0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 80, right: 200, width: 200, height: 200, borderRadius: '50%', background: 'rgba(15, 61, 88, 0.05)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#F98012', color: 'white',
            padding: '6px 16px', borderRadius: 'var(--radius-full)',
            fontSize: 13, fontWeight: 600, marginBottom: 28,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', display: 'inline-block', boxShadow: '0 0 0 3px rgba(255,255,255,0.3)', animation: 'pulse 2s infinite' }} />
            Sujets Recents d'Expression Ecrite & Orale — Mai 2026
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 900, color: '#0F3D58', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20, margin: '0 0 20px' }}>
            Se preparer au<br />TCF Canada – TCF Quebec
          </h1>
          <p style={{ fontSize: 18, color: '#3a5a6e', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Plateforme specialisee dans la preparation au TCF Canada. Tests en conditions reelles avec correction IA.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            {/* Primary CTA — orange → turquoise on hover */}
            <Link to="/tarifs" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '17px 36px', fontSize: 16, fontWeight: 700,
              background: '#F98012', color: 'white', borderRadius: 999,
              boxShadow: '0 4px 12px rgba(249, 128, 18, 0.3)', transition: 'all 0.3s ease', textDecoration: 'none',
              border: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#71C9CE'; e.currentTarget.style.color = '#0F3D58'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(113, 201, 206, 0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249, 128, 18, 0.3)' }}>
              Choisir un forfait &rarr;
            </Link>
            {/* Ghost CTA — navy border → orange fill on hover */}
            <Link to="/epreuve/comprehension-ecrite" style={{
              padding: '17px 36px', fontSize: 16, fontWeight: 700,
              border: '1.5px solid #0F3D58', color: '#0F3D58',
              background: 'white', borderRadius: 999,
              transition: 'all 0.3s ease', textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.borderColor = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(249, 128, 18, 0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#0F3D58'; e.currentTarget.style.color = '#0F3D58'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none' }}>
              Commencer gratuitement
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              [stats.questions, 'Questions C. Orale + Ecrite'],
              [stats.series, "Series d'entrainement"],
              [stats.combinaisons, 'Combinaisons Expression Ecrite'],
              [stats.sujets, 'Sujets Expression Orale'],
            ].map(([val, label]) => (
              <div key={label} style={{
                background: 'white',
                border: '1px solid #e8e0d8',
                borderRadius: 14, padding: '16px 8px', textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#0F3D58', letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ fontSize: 11, color: '#6b8a9a', marginTop: 4, lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 EPREUVES */}
      <Section>
        <style>{`
          .epreuve-card {
            position: relative;
            border-radius: var(--radius-lg);
            background: var(--white);
            overflow: hidden;
            transition: all 0.35s cubic-bezier(.4,0,.2,1);
            border: 1px solid var(--border);
            box-shadow: var(--shadow-sm);
          }
          .epreuve-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: var(--radius-lg);
            padding: 2px;
            background: linear-gradient(135deg, rgba(249, 128, 18, 0.5), rgba(113, 201, 206, 0.3), rgba(15, 61, 88, 0.4));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0;
            transition: opacity 0.35s ease;
            pointer-events: none;
          }
          .epreuve-card:hover::before {
            opacity: 1;
          }
          .epreuve-card:hover {
            box-shadow: 0 0 24px -4px rgba(249, 128, 18, 0.2), 0 8px 32px -8px rgba(15, 61, 88, 0.12);
            transform: translateY(-4px);
            border-color: rgba(249, 128, 18, 0.3);
          }
          .btn-entrainer {
            display: block; width: 100%; text-align: center;
            background: #F98012; color: white;
            padding: 11px 0; border-radius: 10px;
            font-size: 14px; font-weight: 700;
            transition: all 0.3s ease;
            box-shadow: 0 3px 10px rgba(249,128,18,0.3);
          }
          .btn-entrainer:hover {
            background: #71C9CE; color: #0F3D58;
            box-shadow: 0 4px 14px rgba(113,201,206,0.4);
            transform: translateY(-1px);
          }
        `}</style>
        <SectionTitle title="Les 4 Epreuves du TCF Canada" subtitle="Preparez-vous a chaque competence avec des exercices authentiques et un simulateur en conditions reelles" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {EPREUVES.map(ep => {
            const c = epreuveColors[ep.ekey]
            return (
              <Link key={ep.path} to={ep.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="epreuve-card">
                  <div style={{ padding: '8px 16px 0', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                    {ep.free ? <Badge color={ep.ekey}>Acces gratuit</Badge> : <Badge color="gray">Abonnement</Badge>}
                  </div>
                  <div style={{ padding: '12px 24px 24px' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 14, background: c.light,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 16, color: c.text,
                    }}><ep.icon size={24} /></div>
                    <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>{ep.label}</h3>
                    <p style={{ fontSize: 14, color: 'var(--text-3)', lineHeight: 1.6, margin: '0 0 16px' }}>{ep.desc}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: c.light, color: c.text, padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>{ep.details}</span>
                      <span style={{ background: 'var(--surface-2)', color: 'var(--text-3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>{ep.score}</span>
                    </div>
                  </div>
                  <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <span className="btn-entrainer">S'entraîner →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </Section>

      {/* AVANTAGES */}
      <Section bg="var(--surface-2)" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Organic circles behind content */}
        <div style={{ position: 'absolute', top: -60, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(113, 201, 206, 0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(249, 128, 18, 0.06)', pointerEvents: 'none' }} />

        <SectionTitle title="Pourquoi choisir Formation TCF Canada ?" subtitle="Tout ce dont vous avez besoin pour reussir votre TCF Canada au premier essai" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, position: 'relative' }}>
          {AVANTAGES.map((a, i) => (
            <Card key={i} style={{ padding: '24px 20px' }} hover>
              <div style={{ marginBottom: 14, display: 'flex', width: 48, height: 48, background: i % 2 === 0 ? '#e8f7f8' : '#fef0e2', borderRadius: 12, alignItems: 'center', justifyContent: 'center', color: i % 2 === 0 ? '#0F3D58' : '#F98012' }}><a.icon size={24} /></div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6, margin: '0 0 6px' }}>{a.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6, margin: 0 }}>{a.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* FONDATEUR */}
      <Section>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
            borderRadius: 24, padding: '48px 40px', color: 'white', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'rgba(113, 201, 206, 0.12)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(249, 128, 18, 0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--co-main), var(--blue))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                color: 'white',
              }}><GraduationCap size={32} /></div>
              <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.03em', margin: '0 0 4px' }}>Hamid — Fondateur</h3>
              <p style={{ color: 'rgba(160, 190, 210, 0.8)', marginBottom: 32, fontSize: 16, margin: '0 0 32px' }}>Expert TCF Canada depuis 2019</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[['5+', "Ans d'experience"], ['25 000+', 'Candidats accompagnes'], ['95%', 'Taux de reussite']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em' }}>{v}</div>
                    <div style={{ fontSize: 13, color: 'rgba(140, 175, 200, 0.8)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* PRICING APERCU */}
      <Section bg="var(--surface-2)">
        <SectionTitle title="Nos Forfaits" subtitle="Choisissez le forfait adapte a votre objectif d'examen" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto' }}>
          {[
            { name: 'Bronze', price: '14,99', days: 5, credits: 3, popular: false },
            { name: 'Silver', price: '29,99', days: 30, credits: 8, popular: true },
            { name: 'Gold', price: '49,99', days: 60, credits: 15, popular: false },
          ].map(p => (
            <div key={p.name} style={{
              background: p.popular ? 'var(--navy)' : 'var(--white)',
              borderRadius: 20, padding: 28,
              border: p.popular ? 'none' : '1px solid var(--border)',
              boxShadow: p.popular ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
              position: 'relative', transform: p.popular ? 'scale(1.04)' : 'none',
              color: p.popular ? 'white' : 'var(--text-1)',
            }}>
              {p.popular && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--eo-main)', color: 'white',
                  padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(249, 128, 18, 0.35)',
                }}>POPULAIRE</div>
              )}
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, color: p.popular ? 'rgba(200, 215, 225, 0.9)' : 'var(--text-2)', margin: '0 0 4px' }}>{p.name}</h3>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 2, color: p.popular ? 'white' : 'var(--navy)' }}>${p.price}</div>
              <div style={{ fontSize: 13, marginBottom: 24, color: p.popular ? 'rgba(249, 128, 18, 0.7)' : 'var(--text-3)' }}>/ {p.days} jours</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[`Acces toutes les epreuves`, `${p.credits} corrections IA Expression Ecrite`, `Suivi de progression`].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: p.popular ? 'rgba(200, 215, 225, 0.85)' : 'var(--text-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ce-main)', flexShrink: 0, fontWeight: 700 }}>&check;</span>{f}
                  </div>
                ))}
              </div>
              <Link to="/tarifs" style={{
                display: 'block', width: '100%', padding: 12, fontSize: 14, fontWeight: 700,
                background: p.popular ? 'white' : 'var(--navy)',
                color: p.popular ? 'var(--navy)' : 'white',
                borderRadius: 12, textAlign: 'center', textDecoration: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(249,128,18,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.background = p.popular ? 'white' : 'var(--navy)'; e.currentTarget.style.color = p.popular ? 'var(--navy)' : 'white'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                Choisir {p.name}
              </Link>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/tarifs" style={{ color: 'var(--blue)', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Voir toutes les offres &rarr;</Link>
        </div>
      </Section>

      {/* CALCULATEUR NCLC */}
      <Section>
        <SectionTitle title="Calculateur NCLC" subtitle="Estimez votre niveau linguistique canadien (NCLC) selon vos scores TCF" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          <Card style={{ padding: 32 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)', margin: '0 0 20px' }}>Entrez vos scores</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'ce', label: 'Comprehension Ecrite', max: 699, placeholder: '0 \u2013 699', ekey: 'ce' },
                { key: 'co', label: 'Comprehension Orale', max: 699, placeholder: '0 \u2013 699', ekey: 'co' },
                { key: 'ee', label: 'Expression Ecrite', max: 20, placeholder: '0 \u2013 20', ekey: 'ee' },
                { key: 'eo', label: 'Expression Orale', max: 20, placeholder: '0 \u2013 20', ekey: 'eo' },
              ].map(f => {
                const c = epreuveColors[f.ekey]
                return (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <input type="number" min="0" max={f.max} placeholder={f.placeholder}
                      value={nclc[f.key]} onChange={e => setNclc(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{
                        width: '100%', padding: '10px 12px', fontSize: 15, fontWeight: 700,
                        border: `1.5px solid ${nclcRes[f.key] ? c.main : 'var(--border-med)'}`,
                        borderRadius: 10, background: 'var(--white)', color: 'var(--text-1)',
                        outline: 'none', transition: 'border-color 0.15s', fontFamily: 'var(--font)',
                      }} />
                    {nclcRes[f.key] && (
                      <div style={{ marginTop: 6, background: c.light, color: c.text, textAlign: 'center', borderRadius: 8, padding: 6, fontSize: 15, fontWeight: 800 }}>
                        NCLC {nclcRes[f.key]}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
          <Card style={{ padding: 32 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)', margin: '0 0 20px' }}>Reference CE / CO</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {NCLC_TABLE.map(([range, nclcVal]) => (
                <div key={range} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, background: 'var(--surface)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{range} pts</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)', background: 'var(--blue-pale)', padding: '2px 10px', borderRadius: 6 }}>NCLC {nclcVal}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      {/* FAQ — Moodle layout: titre serif gauche + questions droite */}
      <Section bg="var(--surface-2)" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Organic circles */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(113, 201, 206, 0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(249, 128, 18, 0.06)', pointerEvents: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 48, alignItems: 'flex-start', position: 'relative' }}>
          {/* Left — Title + CTA */}
          <div style={{ position: 'sticky', top: 120 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 900, color: '#0F3D58', lineHeight: 1.2, margin: '0 0 16px' }}>
              Questions frequemment posees
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-3)', lineHeight: 1.6, margin: '0 0 28px' }}>
              Trouvez les reponses aux questions les plus courantes sur notre plateforme.
            </p>
            <Link to="/faq" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', fontSize: 14, fontWeight: 700,
              border: '1.5px solid #0F3D58', color: '#0F3D58',
              background: 'white', borderRadius: 999,
              transition: 'all 0.3s ease', textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.borderColor = '#F98012'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#0F3D58'; e.currentTarget.style.color = '#0F3D58' }}>
              Voir toutes les FAQ &rarr;
            </Link>
          </div>

          {/* Right — Numbered questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FAQ.map((item, i) => (
              <div key={i} style={{ background: 'var(--white)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)', transition: 'box-shadow 0.3s' }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                  width: '100%', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16,
                  textAlign: 'left', fontFamily: 'var(--font)',
                }}>
                  {/* Orange number */}
                  <span style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: faqOpen === i ? '#F98012' : '#FDF2E9',
                    color: faqOpen === i ? 'white' : '#F98012',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 800, flexShrink: 0, transition: 'all 0.3s',
                  }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4 }}>{item.q}</span>
                  {/* Chevron */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={faqOpen === i ? '#F98012' : '#9bb0bc'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, transition: 'all 0.3s', transform: faqOpen === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 22px 18px 70px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
                    <div style={{ paddingTop: 14 }}>{item.a}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
      <Section>
        <SectionTitle title="Contactez-nous" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 840, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'white', color: '#0F3D58', padding: '20px 24px',
              borderRadius: 16, textDecoration: 'none', transition: 'all 0.3s ease',
              border: '2px solid #71C9CE', boxShadow: '0 2px 12px rgba(113,201,206,0.2)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#F98012'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,128,18,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0F3D58'; e.currentTarget.style.borderColor = '#71C9CE'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(113,201,206,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71C9CE' }}><MessageCircle size={28} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>WhatsApp</div>
                <div style={{ fontSize: 14, color: 'var(--text-3)' }}>+1 514 746 7431</div>
              </div>
            </a>
            <a href="mailto:hamid@formation-tcf.com" style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'white', color: '#0F3D58', padding: '20px 24px',
              borderRadius: 16, textDecoration: 'none', transition: 'all 0.3s ease',
              border: '2px solid #71C9CE', boxShadow: '0 2px 12px rgba(113,201,206,0.2)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#F98012'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(249,128,18,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0F3D58'; e.currentTarget.style.borderColor = '#71C9CE'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(113,201,206,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#71C9CE' }}><Mail size={28} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Email</div>
                <div style={{ fontSize: 14, color: 'var(--text-3)' }}>hamid@formation-tcf.com</div>
              </div>
            </a>
          </div>
          <Card style={{ padding: 28 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, margin: '0 0 20px' }}>Envoyer un message</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input placeholder="Votre nom" value={contactForm.nom} onChange={e => setContactForm(p => ({ ...p, nom: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid var(--border-med)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-1)', outline: 'none', fontFamily: 'var(--font)' }} />
              <input type="email" placeholder="Votre email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid var(--border-med)', borderRadius: 'var(--radius-md)', background: 'var(--white)', color: 'var(--text-1)', outline: 'none', fontFamily: 'var(--font)' }} />
              <textarea placeholder="Votre message..." rows={4} value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                style={{ width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid var(--border-med)', borderRadius: 'var(--radius-md)', resize: 'none', outline: 'none', fontFamily: 'var(--font)', color: 'var(--text-1)', background: 'var(--white)' }} />
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 22px', fontSize: 14, fontWeight: 700,
                background: '#F98012', color: 'white', borderRadius: 'var(--radius-md)',
                boxShadow: '0 3px 10px rgba(249,128,18,0.35)', transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#71C9CE'; e.currentTarget.style.color = '#0F3D58'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(113,201,206,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F98012'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 3px 10px rgba(249,128,18,0.35)' }}>
                Envoyer &rarr;
              </button>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  )
}
