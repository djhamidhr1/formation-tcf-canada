// HomePage — Formation TCF Canada Premium Redesign
const { useState } = React;

function HomePage({ onNavigate }) {
  const [faqOpen, setFaqOpen] = useState(null);
  const [nclc, setNclc] = useState({ ce: '', co: '', ee: '', eo: '' });
  const [contactForm, setContactForm] = useState({ nom: '', email: '', message: '' });

  const getNclcCeCo = (s) => {
    if (s >= 549) return '10+'; if (s >= 499) return '9'; if (s >= 453) return '8';
    if (s >= 406) return '7'; if (s >= 375) return '6'; if (s >= 342) return '5';
    if (s >= 226) return '4'; return '3';
  };
  const getNclcEeEo = (s) => {
    if (s >= 18) return '10+'; if (s >= 16) return '10'; if (s >= 14) return '9';
    if (s >= 12) return '8'; if (s >= 10) return '7'; if (s >= 7) return '6';
    if (s >= 4) return '5'; return '4';
  };

  const nclcRes = {
    ce: nclc.ce ? getNclcCeCo(+nclc.ce) : null,
    co: nclc.co ? getNclcCeCo(+nclc.co) : null,
    ee: nclc.ee ? getNclcEeEo(+nclc.ee) : null,
    eo: nclc.eo ? getNclcEeEo(+nclc.eo) : null,
  };

  const EPREUVES = [
    { key: 'comprehension-orale', ekey: 'co', icon: '🎧', label: 'Compréhension Orale', desc: 'Écoutez des documents audio authentiques et répondez aux questions', details: '39 questions · 35 min', score: '699 pts max', free: true },
    { key: 'comprehension-ecrite', ekey: 'ce', icon: '📖', label: 'Compréhension Écrite', desc: 'Lisez des textes variés et authentiques de niveau A1 à C2', details: '39 questions · 60 min', score: '699 pts max', free: true },
    { key: 'expression-orale', ekey: 'eo', icon: '🎤', label: 'Expression Orale', desc: "Préparez-vous à l'oral avec des sujets d'actualité réels", details: '3 tâches · 12 min', score: '20 pts max', free: true },
    { key: 'expression-ecrite', ekey: 'ee', icon: '✍️', label: 'Expression Écrite', desc: 'Rédigez des textes structurés corrigés par IA (Claude Opus)', details: '3 tâches · 60 min', score: '20 pts max', free: false },
  ];

  const AVANTAGES = [
    { icon: '📈', title: 'Suivi de Progression', desc: 'Statistiques détaillées par série et par niveau NCLC.' },
    { icon: '🧠', title: 'Correction IA', desc: 'Claude Opus analyse vos textes selon les critères TCF officiels.' },
    { icon: '📅', title: 'Sujets 2026', desc: 'Contenus mis à jour chaque mois avec les derniers sujets d\'actualité.' },
    { icon: '👥', title: 'Accompagnement', desc: 'Formateurs certifiés FLE disponibles en Zoom privé.' },
    { icon: '🛡️', title: 'Conditions Réelles', desc: 'Simulateur exact du TCF officiel avec timer et mode correction.' },
    { icon: '🕐', title: 'Accès 24/7', desc: 'Révisez à tout moment, depuis n\'importe quel appareil.' },
  ];

  const FAQ = [
    { q: 'Les exercices sont-ils conformes au vrai TCF Canada ?', a: 'Oui, tous nos exercices suivent le format officiel du TCF Canada (CIEP/France Éducation International). Nos séries reproduisent la distribution exacte des niveaux (A1→C2) et le barème officiel.' },
    { q: 'Puis-je utiliser la plateforme sur mobile ?', a: 'Absolument. La plateforme est mobile-first, optimisée pour smartphone, tablette et ordinateur. Plus de 60% de nos utilisateurs révisent sur téléphone.' },
    { q: 'Puis-je changer de forfait ?', a: 'Oui, vous pouvez upgrader à tout moment. Contactez-nous sur WhatsApp et la différence est calculée au prorata des jours restants.' },
    { q: 'Comment fonctionne la correction IA de l\'Expression Écrite ?', a: 'Notre IA (Claude Opus d\'Anthropic) analyse vos textes selon les 4 critères officiels TCF : cohérence, lexique, grammaire, et pertinence. Vous recevez un score /20, des points forts, des axes d\'amélioration, et un texte modèle.' },
    { q: 'Y a-t-il une période d\'essai gratuite ?', a: 'Oui ! L\'accès aux séries CE et CO (39 questions chacune), et aux sujets EO est entièrement gratuit. Le simulateur IA pour l\'Expression Écrite nécessite un abonnement.' },
  ];

  const NCLC_TABLE = [
    ['549 – 699', '10+'], ['499 – 548', '9'], ['453 – 498', '8'],
    ['406 – 452', '7'], ['375 – 405', '6'], ['342 – 374', '5'],
    ['226 – 341', '4'], ['< 226', '3'],
  ];

  const epreuveColors = {
    co: { main: 'var(--co-main)', light: 'var(--co-light)', text: 'var(--co-text)' },
    ce: { main: 'var(--ce-main)', light: 'var(--ce-light)', text: 'var(--ce-text)' },
    eo: { main: 'var(--eo-main)', light: 'var(--eo-light)', text: 'var(--eo-text)' },
    ee: { main: 'var(--ee-main)', light: 'var(--ee-light)', text: 'var(--ee-text)' },
  };

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(145deg, var(--navy) 0%, oklch(36% 0.12 240) 60%, oklch(28% 0.09 260) 100%)',
        position: 'relative', overflow: 'hidden',
        padding: '96px 24px 80px',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 480, height: 480, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.03)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 80, right: 200, width: 200, height: 200, borderRadius: '50%', background: 'var(--co-main)', opacity: 0.07, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'oklch(52% 0.20 25 / 0.2)', border: '1px solid oklch(52% 0.20 25 / 0.4)',
            color: 'oklch(85% 0.12 55)', padding: '6px 16px', borderRadius: 'var(--radius-full)',
            fontSize: 13, fontWeight: 600, marginBottom: 28, letterSpacing: '0.01em',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'oklch(65% 0.18 55)', display: 'inline-block', boxShadow: '0 0 0 3px oklch(65% 0.18 55 / 0.3)', animation: 'pulse 2s infinite' }} />
            Sujets Récents d'Expression Écrite & Orale — Avril 2026
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20 }}>
            Se préparer au<br/>TCF Canada – TCF Québec
          </h1>
          <p style={{ fontSize: 18, color: 'oklch(80% 0.04 240)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
            Plateforme spécialisée dans la préparation au TCF Canada. Tests en conditions réelles avec correction IA.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <Btn size="xl" variant="white" onClick={() => onNavigate('pricing')}>
              Choisir un forfait →
            </Btn>
            <button onClick={() => onNavigate('comprehension-ecrite')} style={{
              padding: '17px 36px', fontSize: 16, fontWeight: 700,
              border: '1.5px solid oklch(100% 0 0 / 0.3)',
              color: 'white', background: 'oklch(100% 0 0 / 0.08)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              backdropFilter: 'blur(8px)', transition: 'all 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'oklch(100% 0 0 / 0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'oklch(100% 0 0 / 0.08)'}>
              Commencer gratuitement
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              ['3 081', 'Questions C. Orale + Écrite'],
              ['79', "Séries d'entraînement"],
              ['326', 'Combinaisons Expression Écrite'],
              ['2 886', 'Sujets Expression Orale'],
            ].map(([val, label]) => (
              <div key={label} style={{
                background: 'oklch(100% 0 0 / 0.08)', backdropFilter: 'blur(12px)',
                border: '1px solid oklch(100% 0 0 / 0.12)',
                borderRadius: 14, padding: '16px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ fontSize: 11, color: 'oklch(70% 0.04 240)', marginTop: 4, lineHeight: 1.3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4 ÉPREUVES ────────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle title="Les 4 Épreuves du TCF Canada" subtitle="Préparez-vous à chaque compétence avec des exercices authentiques et un simulateur en conditions réelles" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {EPREUVES.map(ep => {
            const c = epreuveColors[ep.ekey];
            return (
              <Card key={ep.key} hover style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }} onClick={() => onNavigate(ep.key)}>
                <div style={{ padding: '8px 16px 0', display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                  {ep.free && <Badge color={ep.ekey} size="sm">Accès gratuit</Badge>}
                  {!ep.free && <Badge color="gray" size="sm">Abonnement</Badge>}
                </div>
                <div style={{ padding: '12px 24px 24px' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: c.light,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, marginBottom: 16,
                  }}>{ep.icon}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: 'var(--text-1)', marginBottom: 8, letterSpacing: '-0.02em' }}>{ep.label}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 16, lineHeight: 1.6 }}>{ep.desc}</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ background: c.light, color: c.text, padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>{ep.details}</span>
                    <span style={{ background: 'var(--surface-2)', color: 'var(--text-3)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600 }}>{ep.score}</span>
                  </div>
                </div>
                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: c.text }}>S'entraîner →</span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: c.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: c.text }}>→</div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* ── AVANTAGES ──────────────────────────────────────────────────────── */}
      <Section bg="var(--surface-2)">
        <SectionTitle title="Pourquoi choisir Formation TCF Canada ?" subtitle="Tout ce dont vous avez besoin pour réussir votre TCF Canada au premier essai" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {AVANTAGES.map((a, i) => (
            <Card key={i} style={{ padding: '24px 20px' }}>
              <div style={{ fontSize: 28, marginBottom: 14, display: 'flex', width: 48, height: 48, background: 'var(--blue-pale)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>{a.icon}</div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', marginBottom: 6 }}>{a.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6 }}>{a.desc}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── FONDATEUR ──────────────────────────────────────────────────────── */}
      <Section>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
            borderRadius: 24, padding: '48px 40px', color: 'white', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 240, height: 240, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.04)' }} />
            <div style={{ position: 'absolute', bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'var(--co-main)', opacity: 0.08 }} />
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--co-main), var(--blue))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 30, margin: '0 auto 20px',
                boxShadow: '0 8px 24px oklch(0% 0 0 / 0.3)',
              }}>👨‍🏫</div>
              <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4, letterSpacing: '-0.03em' }}>Hamid — Fondateur</h3>
              <p style={{ color: 'oklch(75% 0.06 240)', marginBottom: 32, fontSize: 16 }}>Expert TCF Canada depuis 2019</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {[['5+', "Ans d'expérience"], ['25 000+', 'Candidats accompagnés'], ['95%', 'Taux de réussite']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.04em' }}>{v}</div>
                    <div style={{ fontSize: 13, color: 'oklch(68% 0.04 240)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── PRICING APERÇU ─────────────────────────────────────────────────── */}
      <Section bg="var(--surface-2)">
        <SectionTitle title="Nos Forfaits" subtitle="Choisissez le forfait adapté à votre objectif d'examen" />
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
                  boxShadow: '0 4px 12px oklch(62% 0.17 55 / 0.4)',
                }}>⭐ POPULAIRE</div>
              )}
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4, color: p.popular ? 'oklch(80% 0.04 240)' : 'var(--text-2)' }}>{p.name}</h3>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 2, color: p.popular ? 'white' : 'var(--navy)' }}>${p.price}</div>
              <div style={{ fontSize: 13, marginBottom: 24, color: p.popular ? 'oklch(65% 0.05 240)' : 'var(--text-3)' }}>/ {p.days} jours</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[`Accès toutes les épreuves`, `${p.credits} corrections IA Expression Écrite`, `Suivi de progression`].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 13, color: p.popular ? 'oklch(78% 0.04 240)' : 'var(--text-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ce-main)', flexShrink: 0, fontWeight: 700 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('pricing')} style={{
                width: '100%', padding: '12px', fontSize: 14, fontWeight: 700,
                background: p.popular ? 'white' : 'var(--navy)',
                color: p.popular ? 'var(--navy)' : 'white',
                border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'filter 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.filter='brightness(0.93)'}
              onMouseLeave={e => e.currentTarget.style.filter=''}>
                Choisir {p.name}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button onClick={() => onNavigate('pricing')} style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Voir toutes les offres →</button>
        </div>
      </Section>

      {/* ── CALCULATEUR NCLC ───────────────────────────────────────────────── */}
      <Section>
        <SectionTitle title="Calculateur NCLC" subtitle="Estimez votre niveau linguistique canadien (NCLC) selon vos scores TCF" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto' }}>
          <Card style={{ padding: 32 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)' }}>Entrez vos scores</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'ce', label: 'Compréhension Écrite', max: 699, placeholder: '0 – 699', ekey: 'ce' },
                { key: 'co', label: 'Compréhension Orale', max: 699, placeholder: '0 – 699', ekey: 'co' },
                { key: 'ee', label: 'Expression Écrite', max: 20, placeholder: '0 – 20', ekey: 'ee' },
                { key: 'eo', label: 'Expression Orale', max: 20, placeholder: '0 – 20', ekey: 'eo' },
              ].map(f => {
                const c = epreuveColors[f.ekey];
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
                      <div style={{ marginTop: 6, background: c.light, color: c.text, textAlign: 'center', borderRadius: 8, padding: '6px', fontSize: 15, fontWeight: 800 }}>
                        NCLC {nclcRes[f.key]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
          <Card style={{ padding: 32 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: 'var(--text-1)' }}>Référence CE / CO</h4>
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

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <Section bg="var(--surface-2)">
        <SectionTitle title="Questions fréquentes" />
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQ.map((item, i) => (
            <div key={i} style={{ background: 'var(--white)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{
                width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font)',
              }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', paddingRight: 16, lineHeight: 1.4 }}>{item.q}</span>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: faqOpen === i ? 'var(--navy)' : 'var(--surface-2)',
                  color: faqOpen === i ? 'white' : 'var(--text-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s',
                }}>{faqOpen === i ? '−' : '+'}</span>
              </button>
              {faqOpen === i && (
                <div style={{ padding: '0 22px 18px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
                  <div style={{ paddingTop: 14 }}>{item.a}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ── CONTACT ────────────────────────────────────────────────────────── */}
      <Section>
        <SectionTitle title="Contactez-nous" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 840, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'oklch(46% 0.14 145)', color: 'white', padding: '20px 24px',
              borderRadius: 16, textDecoration: 'none', transition: 'filter 0.15s',
              boxShadow: '0 4px 16px oklch(46% 0.14 145 / 0.35)',
            }}
            onMouseEnter={e => e.currentTarget.style.filter='brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter=''}>
              <div style={{ fontSize: 28 }}>💬</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>WhatsApp</div>
                <div style={{ fontSize: 14, opacity: 0.85 }}>+1 514 746 7431</div>
              </div>
            </a>
            <a href="mailto:hamid@formation-tcf.com" style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: 'var(--navy)', color: 'white', padding: '20px 24px',
              borderRadius: 16, textDecoration: 'none', transition: 'filter 0.15s',
              boxShadow: 'var(--shadow-md)',
            }}
            onMouseEnter={e => e.currentTarget.style.filter='brightness(1.15)'}
            onMouseLeave={e => e.currentTarget.style.filter=''}>
              <div style={{ fontSize: 28 }}>✉️</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Email</div>
                <div style={{ fontSize: 14, opacity: 0.75 }}>hamid@formation-tcf.com</div>
              </div>
            </a>
          </div>
          <Card style={{ padding: 28 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Envoyer un message</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input placeholder="Votre nom" value={contactForm.nom} onChange={e => setContactForm(p => ({ ...p, nom: e.target.value }))} icon="👤" />
              <Input type="email" placeholder="Votre email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} icon="✉️" />
              <div>
                <textarea placeholder="Votre message..." rows={4} value={contactForm.message}
                  onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  style={{
                    width: '100%', padding: '11px 14px', fontSize: 14, border: '1.5px solid var(--border-med)',
                    borderRadius: 'var(--radius-md)', resize: 'none', outline: 'none', fontFamily: 'var(--font)',
                    color: 'var(--text-1)', background: 'var(--white)',
                  }} />
              </div>
              <Btn variant="primary" onClick={() => {}}>Envoyer →</Btn>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}

window.HomePage = HomePage;
