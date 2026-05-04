// Shared UI Components — Formation TCF Canada Premium Redesign v2
// Navbar (with mobile drawer), Footer, Badge, Button, Card, Input, ProgressBar

const { useState, useEffect, useRef } = React;

// ── COLOR MAP ─────────────────────────────────────────────────────────────────
const EPREUVE_COLORS = {
  ce: { main: 'var(--ce-main)', light: 'var(--ce-light)', text: 'var(--ce-text)', label: 'Compréhension Écrite', icon: '📖' },
  co: { main: 'var(--co-main)', light: 'var(--co-light)', text: 'var(--co-text)', label: 'Compréhension Orale', icon: '🎧' },
  ee: { main: 'var(--ee-main)', light: 'var(--ee-light)', text: 'var(--ee-text)', label: 'Expression Écrite', icon: '✍️' },
  eo: { main: 'var(--eo-main)', light: 'var(--eo-light)', text: 'var(--eo-text)', label: 'Expression Orale', icon: '🎤' },
};
window.EPREUVE_COLORS = EPREUVE_COLORS;

// ── BUTTON ────────────────────────────────────────────────────────────────────
function Btn({ children, variant = 'primary', size = 'md', onClick, style, disabled, href }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    fontFamily: 'var(--font)', fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
    borderRadius: 'var(--radius-md)',
    opacity: disabled ? 0.5 : 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none',
  };
  const sizes = {
    sm:  { padding: '7px 14px', fontSize: 13 },
    md:  { padding: '11px 22px', fontSize: 14 },
    lg:  { padding: '14px 28px', fontSize: 16 },
    xl:  { padding: '17px 36px', fontSize: 18 },
  };
  const variants = {
    primary:   { background: 'var(--navy)', color: '#fff', boxShadow: '0 2px 8px oklch(24% 0.08 240 / 0.35)' },
    secondary: { background: 'var(--white)', color: 'var(--navy)', border: '1.5px solid var(--border-med)', boxShadow: 'var(--shadow-xs)' },
    ghost:     { background: 'transparent', color: 'var(--navy)', border: '1.5px solid transparent' },
    success:   { background: 'var(--ce-main)', color: '#fff', boxShadow: '0 2px 8px oklch(46% 0.14 145 / 0.35)' },
    danger:    { background: 'var(--error)', color: '#fff' },
    white:     { background: '#fff', color: 'var(--navy)', boxShadow: 'var(--shadow-sm)' },
    outline:   { background: 'transparent', color: 'white', border: '1.5px solid oklch(100% 0 0 / 0.35)' },
  };
  const merged = { ...base, ...sizes[size || 'md'], ...variants[variant], ...style };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" style={merged}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; }}>
        {children}
      </a>
    );
  }
  return (
    <button disabled={disabled} onClick={onClick} style={merged}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.08)'; }}}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; }}>
      {children}
    </button>
  );
}
window.Btn = Btn;

// ── BADGE ─────────────────────────────────────────────────────────────────────
function Badge({ children, color = 'navy', size = 'sm' }) {
  const colors = {
    navy:  { bg: 'var(--blue-pale)',  color: 'var(--blue)' },
    ce:    { bg: 'var(--ce-light)',   color: 'var(--ce-text)' },
    co:    { bg: 'var(--co-light)',   color: 'var(--co-text)' },
    ee:    { bg: 'var(--ee-light)',   color: 'var(--ee-text)' },
    eo:    { bg: 'var(--eo-light)',   color: 'var(--eo-text)' },
    green: { bg: 'oklch(94% 0.05 145)', color: 'oklch(30% 0.14 145)' },
    red:   { bg: 'oklch(95% 0.04 25)',  color: 'oklch(42% 0.20 25)' },
    gray:  { bg: 'var(--surface-2)',  color: 'var(--text-2)' },
    amber: { bg: 'oklch(96% 0.06 55)', color: 'oklch(36% 0.14 55)' },
  };
  const c = colors[color] || colors.navy;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: c.bg, color: c.color,
      padding: size === 'sm' ? '3px 10px' : '5px 14px',
      borderRadius: 'var(--radius-full)',
      fontSize: size === 'sm' ? 12 : 13,
      fontWeight: 600, letterSpacing: '0.01em',
    }}>{children}</span>
  );
}
window.Badge = Badge;

// ── CARD ──────────────────────────────────────────────────────────────────────
function Card({ children, style, hover = false, onClick, padding = 24 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--white)', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: hovered && hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        padding, cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
        transform: hovered && hover ? 'translateY(-3px)' : 'none',
        ...style,
      }}>
      {children}
    </div>
  );
}
window.Card = Card;

// ── SECTION ───────────────────────────────────────────────────────────────────
function Section({ children, style, bg }) {
  return (
    <section style={{ background: bg || 'transparent', padding: '72px 24px', ...style }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        {children}
      </div>
    </section>
  );
}
window.Section = Section;

function SectionTitle({ title, subtitle, center = true }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 48 }}>
      <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', marginBottom: 8 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 17, color: 'var(--text-3)', maxWidth: 560, margin: center ? '0 auto' : undefined, lineHeight: 1.6 }}>{subtitle}</p>}
    </div>
  );
}
window.SectionTitle = SectionTitle;

// ── NAVBAR ────────────────────────────────────────────────────────────────────
function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const epreuves = [
    { key: 'comprehension-ecrite', label: 'Compréhension Écrite', color: 'var(--ce-main)', icon: '📖' },
    { key: 'comprehension-orale',  label: 'Compréhension Orale',  color: 'var(--co-main)', icon: '🎧' },
    { key: 'expression-ecrite',    label: 'Expression Écrite',    color: 'var(--ee-main)', icon: '✍️' },
    { key: 'expression-orale',     label: 'Expression Orale',     color: 'var(--eo-main)', icon: '🎤' },
  ];

  const nav = (page) => { onNavigate(page); setMobileOpen(false); };

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
        .nav-mobile-drawer.open {
          transform: translateX(0);
        }
        .epreuve-bar-btn:hover { color: white !important; }
      `}</style>

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: scrolled ? 'oklch(24% 0.08 240 / 0.97)' : 'var(--navy)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 1px 24px oklch(0% 0 0 / 0.18)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid oklch(100% 0 0 / 0.08)',
      }}>
        {/* Primary Bar */}
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <button onClick={() => nav('home')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #2E86C1, #1A5276)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 2px 8px oklch(0% 0 0 / 0.3)',
            }}>🍁</div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>Formation TCF Canada</span>
          </button>

          {/* Desktop Links */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {[['formations', 'Formations'], ['pricing', 'Tarifs'], ['nclc', 'Calculateur NCLC']].map(([page, label]) => (
              <button key={page} onClick={() => nav(page)} style={{
                color: currentPage === page ? 'white' : 'oklch(80% 0.04 240)',
                background: currentPage === page ? 'oklch(100% 0 0 / 0.12)' : 'none',
                border: 'none', cursor: 'pointer',
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'oklch(100% 0 0 / 0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = currentPage === page ? 'white' : 'oklch(80% 0.04 240)'; e.currentTarget.style.background = currentPage === page ? 'oklch(100% 0 0 / 0.12)' : 'none'; }}>
                {label}
              </button>
            ))}
            <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
              color: 'oklch(78% 0.18 145)', fontWeight: 700, fontSize: 14, padding: '8px 14px',
              borderRadius: 8, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'oklch(100% 0 0 / 0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
              💬 WhatsApp
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => nav('login')} style={{
              color: 'oklch(80% 0.04 240)', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600, padding: '8px 12px',
              borderRadius: 8, transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'white'}
            onMouseLeave={e => e.currentTarget.style.color = 'oklch(80% 0.04 240)'}>
              Connexion
            </button>
            <button onClick={() => nav('register')} style={{
              background: 'white', color: 'var(--navy)', border: 'none',
              padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', transition: 'filter 0.15s', boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.95)'}
            onMouseLeave={e => e.currentTarget.style.filter = ''}>
              Commencer gratuitement
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{
            display: 'flex', flexDirection: 'column', gap: 5, background: 'none', border: 'none',
            cursor: 'pointer', padding: 8, borderRadius: 8,
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: 22, height: 2, background: 'white', borderRadius: 2,
                transition: 'all 0.25s',
                transform: mobileOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'scaleX(0)') : 'none',
                opacity: mobileOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Épreuves Bar — desktop only */}
        <div className="nav-epreuves-bar" style={{ borderTop: '1px solid oklch(100% 0 0 / 0.07)', background: 'oklch(20% 0.07 240 / 0.5)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 2 }}>
            <button onClick={() => nav('home')} className="epreuve-bar-btn" style={{
              color: currentPage === 'home' ? 'white' : 'oklch(72% 0.04 240)',
              background: currentPage === 'home' ? 'oklch(100% 0 0 / 0.1)' : 'none',
              border: 'none', cursor: 'pointer', padding: '9px 14px', fontSize: 13, fontWeight: 600,
              borderRadius: 6, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
            }}>🏠 Accueil</button>
            <div style={{ width: 1, height: 18, background: 'oklch(100% 0 0 / 0.15)', margin: '0 4px' }}></div>
            {epreuves.map(ep => (
              <button key={ep.key} onClick={() => nav(ep.key)} className="epreuve-bar-btn" style={{
                color: currentPage === ep.key ? 'white' : 'oklch(72% 0.04 240)',
                background: currentPage === ep.key ? `${ep.color}30` : 'none',
                border: 'none', cursor: 'pointer', padding: '9px 14px', fontSize: 13, fontWeight: 600,
                borderRadius: 6, transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = `${ep.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.color = currentPage === ep.key ? 'white' : 'oklch(72% 0.04 240)'; e.currentTarget.style.background = currentPage === ep.key ? `${ep.color}30` : 'none'; }}>
                {ep.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-mobile-drawer${mobileOpen ? ' open' : ''}`}>
        {/* Drawer Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid oklch(100% 0 0 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg, #2E86C1, #1A5276)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍁</div>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>Formation TCF Canada</span>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ background: 'oklch(100% 0 0 / 0.12)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: 8, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* Épreuves Grid */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'oklch(55% 0.04 240)', textTransform: 'uppercase', marginBottom: 12 }}>Épreuves TCF</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
            {epreuves.map(ep => (
              <button key={ep.key} onClick={() => nav(ep.key)} style={{
                background: currentPage === ep.key ? `${ep.color}25` : 'oklch(100% 0 0 / 0.06)',
                border: `1px solid ${currentPage === ep.key ? ep.color + '50' : 'oklch(100% 0 0 / 0.1)'}`,
                borderRadius: 14, padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{ep.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', lineHeight: 1.3 }}>{ep.label}</div>
              </button>
            ))}
          </div>

          {/* Nav Links */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'oklch(55% 0.04 240)', textTransform: 'uppercase', marginBottom: 12 }}>Navigation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 28 }}>
            {[['home', '🏠', 'Accueil'], ['formations', '🎓', 'Formations Zoom'], ['pricing', '💰', 'Tarifs'], ['nclc', '🧮', 'Calculateur NCLC']].map(([page, icon, label]) => (
              <button key={page} onClick={() => nav(page)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: currentPage === page ? 'oklch(100% 0 0 / 0.1)' : 'none',
                border: 'none', cursor: 'pointer', padding: '12px 16px', borderRadius: 12,
                color: 'white', fontSize: 15, fontWeight: 600, textAlign: 'left',
              }}>
                <span style={{ fontSize: 18 }}>{icon}</span>{label}
              </button>
            ))}
          </div>

          {/* Auth */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => nav('login')} style={{
              background: 'oklch(100% 0 0 / 0.1)', border: '1px solid oklch(100% 0 0 / 0.2)',
              color: 'white', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>Se connecter</button>
            <button onClick={() => nav('register')} style={{
              background: 'white', color: 'var(--navy)', border: 'none',
              padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>Commencer gratuitement →</button>
            <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: 'oklch(46% 0.17 145)', color: 'white',
              padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}>💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </>
  );
}
window.Navbar = Navbar;

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  const nav = onNavigate;
  return (
    <footer style={{ background: 'var(--navy)', color: 'oklch(78% 0.04 240)', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: 'oklch(100% 0 0 / 0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍁</div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>TCF Canada</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 16, color: 'oklch(68% 0.04 240)' }}>
              Plateforme spécialisée dans la préparation au TCF Canada et TCF Québec.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'oklch(65% 0.04 240)' }}>
              <span>📍 Montréal, QC, Canada</span>
              <span>✉️ hamid@formation-tcf.com</span>
              <span>📞 +1 514 746 7431</span>
            </div>
          </div>

          {/* Épreuves */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Épreuves TCF</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['comprehension-ecrite', '📖 Compréhension Écrite'], ['comprehension-orale', '🎧 Compréhension Orale'], ['expression-ecrite', '✍️ Expression Écrite'], ['expression-orale', '🎤 Expression Orale']].map(([page, label]) => (
                <button key={page} onClick={() => nav(page)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'oklch(68% 0.04 240)', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'oklch(68% 0.04 240)'}>{label}</button>
              ))}
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Liens rapides</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['pricing', 'Tarification'], ['formations', 'Formations Zoom'], ['nclc', 'Calculateur NCLC'], ['login', 'Se connecter'], ['register', "S'inscrire"], ['faq', 'FAQ'], ['legal', 'Conditions']].map(([page, label]) => (
                <button key={page} onClick={() => nav(page)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'oklch(68% 0.04 240)', fontSize: 13, fontWeight: 500, transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'white'}
                  onMouseLeave={e => e.currentTarget.style.color = 'oklch(68% 0.04 240)'}>{label}</button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nous suivre</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'oklch(46% 0.17 145)', color: 'white', padding: '10px 14px',
                borderRadius: 10, fontSize: 13, fontWeight: 600, transition: 'filter 0.15s', textDecoration: 'none',
              }} onMouseEnter={e => e.currentTarget.style.filter='brightness(1.15)'}
                 onMouseLeave={e => e.currentTarget.style.filter=''}>
                💬 WhatsApp
              </a>
              <a href="#" style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'oklch(42% 0.20 25)', color: 'white', padding: '10px 14px',
                borderRadius: 10, fontSize: 13, fontWeight: 600, transition: 'filter 0.15s', textDecoration: 'none',
              }} onMouseEnter={e => e.currentTarget.style.filter='brightness(1.15)'}
                 onMouseLeave={e => e.currentTarget.style.filter=''}>
                ▶ YouTube
              </a>
            </div>
          </div>

          {/* Paiement */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 13, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nous acceptons</h4>
            <div style={{ background: 'oklch(100% 0 0 / 0.06)', border: '1px solid oklch(100% 0 0 / 0.1)', borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: 'oklch(65% 0.04 240)' }}>
                {['Western Union', 'Ria', 'Orange Money', 'MTN', 'Wave', 'PayPal'].map(m => (
                  <div key={m} style={{ background: 'oklch(100% 0 0 / 0.08)', borderRadius: 6, padding: '4px 8px', textAlign: 'center', fontWeight: 600 }}>{m}</div>
                ))}
              </div>
            </div>
            <button onClick={() => nav('pricing')} style={{
              width: '100%', background: 'white', color: 'var(--navy)', border: 'none',
              borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', transition: 'filter 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.filter='brightness(0.95)'}
            onMouseLeave={e => e.currentTarget.style.filter=''}>Voir les tarifs →</button>
          </div>
        </div>

        <div style={{ borderTop: '1px solid oklch(100% 0 0 / 0.1)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 13, color: 'oklch(55% 0.03 240)' }}>© 2026 Formation TCF Canada. Tous droits réservés.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[['legal', 'Confidentialité'], ['legal', 'Conditions'], ['faq', 'FAQ']].map(([page, label]) => (
              <button key={label} onClick={() => nav(page)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'oklch(55% 0.03 240)', fontSize: 13, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'oklch(55% 0.03 240)'}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
window.Footer = Footer;

// ── PROGRESS BAR ──────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = 'var(--blue)', height = 6, style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 999, height, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.4s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  );
}
window.ProgressBar = ProgressBar;

// ── INPUT ─────────────────────────────────────────────────────────────────────
function Input({ label, type = 'text', placeholder, value, onChange, icon, style }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>{icon}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: icon ? '11px 14px 11px 38px' : '11px 14px',
            fontSize: 14, border: `1.5px solid ${focused ? 'var(--blue)' : 'var(--border-med)'}`,
            borderRadius: 'var(--radius-md)', background: 'var(--white)',
            color: 'var(--text-1)', outline: 'none', transition: 'border-color 0.15s',
            boxShadow: focused ? '0 0 0 3px oklch(58% 0.14 240 / 0.12)' : 'none',
          }} />
      </div>
    </div>
  );
}
window.Input = Input;

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, color = 'white', bg = 'oklch(100% 0 0 / 0.08)', style }) {
  return (
    <div style={{
      background: bg, backdropFilter: 'blur(12px)',
      border: '1px solid oklch(100% 0 0 / 0.12)',
      borderRadius: 14, padding: '16px 12px', textAlign: 'center', ...style,
    }}>
      <div style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'oklch(70% 0.04 240)', marginTop: 6, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}
window.StatCard = StatCard;
