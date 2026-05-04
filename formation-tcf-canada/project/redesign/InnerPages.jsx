// Inner Pages: EpreuvePage, SeriesPage, SimulatorPage, PricingPage, AccountPage, LoginPage
const { useState, useEffect, useRef } = React;

// ── EPREUVE HOME PAGE ─────────────────────────────────────────────────────────
function EpreuvePage({ epreuve, onNavigate }) {
  const configs = {
    'comprehension-ecrite': {
      key: 'ce', icon: '📖', label: 'Compréhension Écrite',
      tagline: 'Lisez des textes variés et authentiques. Maîtrisez la lecture en français.',
      stats: ['60 min', '39 questions', '699 pts'],
      statLabels: ['Durée totale', 'Par série', 'Score max'],
      mainColor: 'var(--ce-main)', lightColor: 'var(--ce-light)', textColor: 'var(--ce-text)',
      heroGrad: 'linear-gradient(145deg, oklch(35% 0.14 145), oklch(45% 0.14 145))',
      quickLinks: [{ label: 'Voir les séries', page: 'ce-series' }, { label: 'Astuces & Barème', page: null }],
      info: 'Format : Textes variés (dialogues, emails, articles, publicités)',
      tips: ['Lisez la question avant le texte', 'Repérez les mots-clés dans le texte', 'Éliminez les mauvaises réponses'],
    },
    'comprehension-orale': {
      key: 'co', icon: '🎧', label: 'Compréhension Orale',
      tagline: 'Écoutez des documents sonores authentiques. Maîtrisez la compréhension auditive.',
      stats: ['35 min', '39 questions', '699 pts'],
      statLabels: ['Durée totale', 'Par série', 'Score max'],
      mainColor: 'var(--co-main)', lightColor: 'var(--co-light)', textColor: 'var(--co-text)',
      heroGrad: 'linear-gradient(145deg, oklch(38% 0.15 220), oklch(50% 0.16 220))',
      quickLinks: [{ label: 'Voir les séries', page: 'co-series' }, { label: 'Astuces & Barème', page: null }],
      info: 'Format : Documents sonores variés (dialogues, annonces, émissions)',
      tips: ['1 seule écoute par document', 'Lisez les options avant d\'écouter', 'Repérez les mots-clés à l\'oral'],
    },
    'expression-ecrite': {
      key: 'ee', icon: '✍️', label: 'Expression Écrite',
      tagline: 'Démontrez votre capacité à rédiger en français. Maîtrisez les 3 tâches du TCF.',
      stats: ['60 min', '3 tâches', '20 pts'],
      statLabels: ['Durée totale', 'À rédiger', 'Score max'],
      mainColor: 'var(--ee-main)', lightColor: 'var(--ee-light)', textColor: 'var(--ee-text)',
      heroGrad: 'linear-gradient(145deg, oklch(34% 0.16 290), oklch(46% 0.16 290))',
      quickLinks: [{ label: 'Voir les sujets', page: null }, { label: 'Astuces & Barème', page: null }],
      info: 'Format : 3 tâches de rédaction (message, narration, argumentation)',
      tips: ['Respectez le nombre de mots demandé', 'Structurez votre réponse clairement', 'Relisez pour corriger les fautes'],
    },
    'expression-orale': {
      key: 'eo', icon: '🎤', label: 'Expression Orale',
      tagline: "Maîtrisez l'épreuve orale du TCF Canada avec nos simulateurs et sujets d'actualité.",
      stats: ['12 min', '3 tâches', '20 pts'],
      statLabels: ['Durée totale', 'Tâches', 'Score max'],
      mainColor: 'var(--eo-main)', lightColor: 'var(--eo-light)', textColor: 'var(--eo-text)',
      heroGrad: 'linear-gradient(145deg, oklch(48% 0.17 55), oklch(62% 0.17 55))',
      quickLinks: [{ label: 'Voir les sujets', page: null }, { label: 'Astuces & Barème', page: null }],
      info: 'Format : 3 tâches (entretien dirigé, interaction, point de vue)',
      tips: ['Préparez-vous 1 minute avant chaque tâche', 'Parlez clairement et distinctement', 'Développez vos arguments avec des exemples'],
    },
  };

  const cfg = configs[epreuve] || configs['comprehension-ecrite'];

  return (
    <div>
      {/* Hero */}
      <div style={{ background: cfg.heroGrad, padding: '72px 24px 56px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'oklch(100% 0 0 / 0.07)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{cfg.icon}</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: 12 }}>{cfg.label}</h1>
          <p style={{ fontSize: 17, color: 'oklch(90% 0.04 240)', marginBottom: 32, lineHeight: 1.6 }}>{cfg.tagline}</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 40 }}>
            {cfg.stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', background: 'oklch(100% 0 0 / 0.12)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 24px' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>{s}</div>
                <div style={{ fontSize: 11, color: 'oklch(80% 0.04 240)', marginTop: 2 }}>{cfg.statLabels[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {cfg.quickLinks.map((ql, i) => (
              <button key={i} onClick={() => ql.page && onNavigate(ql.page)} style={{
                padding: '12px 24px', fontSize: 14, fontWeight: 700,
                background: i === 0 ? 'white' : 'oklch(100% 0 0 / 0.12)',
                color: i === 0 ? cfg.mainColor : 'white',
                border: i === 0 ? 'none' : '1.5px solid oklch(100% 0 0 / 0.3)',
                borderRadius: 10, cursor: 'pointer', backdropFilter: 'blur(8px)',
              }}>{ql.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Card + Tips */}
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Card style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: cfg.lightColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{cfg.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>À propos de l'épreuve</h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 16, lineHeight: 1.7 }}>{cfg.info}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['Niveaux', 'A1 à C2'], ['Barème', '3 à 33 pts / question'], ['NCLC', 'Scores 3 à 10+']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface)', borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: cfg.textColor }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'oklch(96% 0.05 55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💡</div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Astuces rapides</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cfg.tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: cfg.lightColor, color: cfg.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.5 }}>{t}</p>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate(cfg.key === 'ce' ? 'ce-series' : cfg.key === 'co' ? 'co-series' : null)} style={{
              marginTop: 24, width: '100%', background: cfg.mainColor, color: 'white',
              border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 16px ${cfg.mainColor}55`,
            }}>Commencer une session →</button>
          </Card>
        </div>
      </Section>
    </div>
  );
}
window.EpreuvePage = EpreuvePage;

// ── SERIES PAGE ───────────────────────────────────────────────────────────────
function SeriesPage({ type, onNavigate }) {
  const [filter, setFilter] = useState('all');
  const count = type === 'ce' ? 39 : 40;
  const series = Array.from({ length: count }, (_, i) => ({
    n: i + 1,
    questions: type === 'ce' ? 39 : 39,
    done: i < 3, score: i === 0 ? 82 : i === 1 ? 74 : i === 2 ? 91 : null,
  }));

  const cfg = {
    ce: { label: 'Compréhension Écrite', icon: '📖', mainColor: 'var(--ce-main)', lightColor: 'var(--ce-light)', textColor: 'var(--ce-text)', heroGrad: 'linear-gradient(145deg, oklch(35% 0.14 145), oklch(45% 0.14 145))' },
    co: { label: 'Compréhension Orale', icon: '🎧', mainColor: 'var(--co-main)', lightColor: 'var(--co-light)', textColor: 'var(--co-text)', heroGrad: 'linear-gradient(145deg, oklch(38% 0.15 220), oklch(50% 0.16 220))' },
  }[type] || {};

  const shown = filter === 'done' ? series.filter(s => s.done) : filter === 'todo' ? series.filter(s => !s.done) : series;

  return (
    <div>
      <div style={{ background: cfg.heroGrad, padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <button onClick={() => onNavigate(type === 'ce' ? 'comprehension-ecrite' : 'comprehension-orale')} style={{ background: 'oklch(100% 0 0 / 0.15)', color: 'white', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>← Retour</button>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: 'white', letterSpacing: '-0.03em', marginBottom: 6 }}>Séries {cfg.label}</h1>
          <p style={{ color: 'oklch(85% 0.04 240)', fontSize: 15 }}>{count} séries disponibles · 39 questions par série</p>
        </div>
      </div>

      <Section>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'Toutes'], ['todo', 'Non faites'], ['done', 'Terminées']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)} style={{
                padding: '8px 18px', fontSize: 13, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: filter === val ? cfg.mainColor : 'var(--white)',
                color: filter === val ? 'white' : 'var(--text-2)',
                border: filter === val ? 'none' : '1px solid var(--border-med)',
                transition: 'all 0.15s',
              }}>{label}</button>
            ))}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-3)' }}>{shown.length} séries</p>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {shown.map(s => (
            <Card key={s.n} hover style={{ padding: 20, cursor: 'pointer' }} onClick={() => onNavigate('ce-simulator')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Série {s.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{cfg.icon} {cfg.label} test {s.n}</div>
                </div>
                {s.done && (
                  <div style={{ background: s.score >= 80 ? 'oklch(94% 0.05 145)' : 'oklch(95% 0.04 55)', color: s.score >= 80 ? 'oklch(30% 0.14 145)' : 'oklch(36% 0.14 55)', fontWeight: 800, fontSize: 13, padding: '4px 10px', borderRadius: 8 }}>{s.score}%</div>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{s.questions} questions</span>
                {s.done && <span style={{ fontSize: 12, color: 'var(--ce-text)', fontWeight: 600 }}>✓ Terminé</span>}
              </div>
              {s.done && <ProgressBar value={s.score} max={100} color={s.score >= 80 ? 'var(--ce-main)' : 'var(--eo-main)'} height={4} style={{ marginBottom: 14 }} />}
              <button style={{
                width: '100%', background: s.done ? 'var(--surface-2)' : cfg.mainColor,
                color: s.done ? 'var(--text-2)' : 'white',
                border: 'none', borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>{s.done ? 'Recommencer' : 'Commencer →'}</button>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}
window.SeriesPage = SeriesPage;

// ── SIMULATOR PAGE ─────────────────────────────────────────────────────────────
function SimulatorPage({ onNavigate }) {
  const [state, setState] = useState('start'); // start | running | done
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mode, setMode] = useState('test'); // test | correction
  const [timeLeft, setTimeLeft] = useState(3600);
  const timerRef = useRef(null);

  const QUESTIONS = [
    { id: 1, level: 'A1', pts: 3, text: "Vous lisez ce message :\n\n« Maman,\nJe fais mes devoirs de mathématiques chez Louise.\nJe rentre à 21 heures.\nBises et à ce soir.\nPatrick »\n\nQu'est-ce que Patrick fait chez Louise ?", options: ['Il dort', 'Il travaille', 'Il joue', 'Il mange'], correct: 1 },
    { id: 2, level: 'A1', pts: 3, text: 'Vous recevez cet email :\n\n« Bonjour,\nNous confirmons votre réservation pour le dîner du samedi 15 mars à 20h.\nTable pour 4 personnes au nom de Dupont.\nAu plaisir de vous accueillir. »\n\nPour combien de personnes est la réservation ?', options: ['2 personnes', '3 personnes', '4 personnes', '5 personnes'], correct: 2 },
    { id: 3, level: 'A2', pts: 9, text: 'Vous lisez cette annonce :\n\n« Appartement F3 à louer\n75m², 3ème étage, ascenseur\n2 chambres, cuisine équipée\nParking inclus – 950€/mois\nDisponible le 1er avril »\n\nQuel est le prix mensuel de cet appartement ?', options: ['850€/mois', '900€/mois', '950€/mois', '1 000€/mois'], correct: 2 },
    { id: 4, level: 'B1', pts: 15, text: 'Dans cet article, l\'auteur explique que les changements climatiques...\n\n« De nombreuses études scientifiques démontrent que les effets du réchauffement planétaire se font ressentir de manière de plus en plus marquée. Les températures moyennes ont augmenté d\'1,2°C depuis l\'ère préindustrielle. »\n\nSelon l\'article, quelle est l\'augmentation de température enregistrée ?', options: ['0,8°C', '1,0°C', '1,2°C', '1,5°C'], correct: 2 },
    { id: 5, level: 'B2', pts: 21, text: 'Vous lisez ce texte sur l\'intelligence artificielle :\n\n« Si l\'IA offre des perspectives révolutionnaires, elle soulève également des questions éthiques fondamentales concernant la vie privée, l\'emploi et la prise de décision automatisée. Les sociétés devront trouver un équilibre délicat. »\n\nQuelle est la position de l\'auteur sur l\'intelligence artificielle ?', options: ['Entièrement positive', 'Nuancée et critique', 'Totalement négative', 'Sans opinion'], correct: 1 },
  ];

  useEffect(() => {
    if (state === 'running' && mode === 'test') {
      timerRef.current = setInterval(() => setTimeLeft(t => t > 0 ? t - 1 : 0), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [state, mode]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const q = QUESTIONS[current];
  const answered = Object.keys(answers).length;
  const timerPct = (timeLeft / 3600) * 100;
  const timerColor = timeLeft < 300 ? 'var(--error)' : timeLeft < 600 ? 'var(--eo-main)' : 'var(--ce-main)';

  if (state === 'start') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>compréhension écrite test 1</h1>
          <div style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 32 }}>Compréhension Écrite — Entraînement</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            {[['⏱️', '60 min', 'Durée'], ['❓', '39', 'Questions'], ['🏆', '699 pts', 'Score max']].map(([icon, val, label]) => (
              <Card key={label} style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-1)' }}>{val}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{label}</div>
              </Card>
            ))}
          </div>
          <div style={{ background: 'oklch(96% 0.05 55)', border: '1px solid oklch(88% 0.08 55)', borderRadius: 14, padding: 20, marginBottom: 28, textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'oklch(36% 0.14 55)', marginBottom: 10 }}>💡 Conseils avant de commencer</div>
            <ul style={{ fontSize: 13, color: 'oklch(36% 0.14 55)', lineHeight: 1.8, paddingLeft: 16 }}>
              <li>Le timer démarrera dès que vous cliquerez sur "Commencer"</li>
              <li>Lisez d'abord la question, puis repérez la réponse dans le texte</li>
              <li>Les questions C2 (Q36-39) valent 33 pts — commencez par elles si vous manquez de temps</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" variant="success" onClick={() => setState('running')}>▶ Commencer l'entraînement</Btn>
            <button onClick={() => { setMode('correction'); setState('running'); }} style={{
              padding: '14px 28px', fontSize: 15, fontWeight: 700,
              background: 'oklch(96% 0.05 55)', color: 'oklch(40% 0.16 55)',
              border: '1.5px solid oklch(84% 0.10 55)', borderRadius: 12, cursor: 'pointer',
            }}>🔍 Voir le corrigé directement</button>
          </div>
          <button onClick={() => onNavigate('ce-series')} style={{ marginTop: 16, background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 13 }}>← Retour aux séries</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 108px)', overflow: 'hidden' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>compréhension écrite test 1</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: timeLeft < 300 ? 'oklch(95% 0.04 25)' : 'var(--surface)', padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${timerColor}40` }}>
          <span style={{ fontSize: 16 }}>⏱️</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: timerColor, letterSpacing: '0.05em' }}>{formatTime(timeLeft)}</span>
        </div>
        {mode === 'correction' && (
          <div style={{ background: 'oklch(96% 0.05 55)', border: '1px solid oklch(84% 0.10 55)', padding: '4px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, color: 'oklch(40% 0.16 55)' }}>
            🔍 Mode Correction
          </div>
        )}
        <button onClick={() => { setMode('correction'); }} style={{ background: 'oklch(96% 0.05 55)', border: '1px solid oklch(84% 0.10 55)', color: 'oklch(40% 0.16 55)', padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>🔍 Corrigé</button>
        <button onClick={() => setState('done')} style={{ background: 'var(--navy)', color: 'white', border: 'none', padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          Terminer ({answered}/39)
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: 'var(--white)', borderRight: '1px solid var(--border)', padding: 16, overflowY: 'auto', flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Questions</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
            {QUESTIONS.map((_, i) => {
              const isCurrent = current === i;
              const isAnswered = answers[i] !== undefined;
              const isCorrect = mode === 'correction' && isAnswered && answers[i] === QUESTIONS[i].correct;
              const isWrong = mode === 'correction' && isAnswered && answers[i] !== QUESTIONS[i].correct;
              return (
                <button key={i} onClick={() => setCurrent(i)} style={{
                  width: '100%', aspectRatio: '1', borderRadius: 6, border: 'none', cursor: 'pointer',
                  fontSize: 11, fontWeight: 700,
                  background: isCurrent ? 'var(--navy)' : isCorrect ? 'var(--ce-main)' : isWrong ? 'var(--error)' : isAnswered ? 'var(--co-main)' : 'var(--surface-2)',
                  color: isCurrent || isAnswered ? 'white' : 'var(--text-3)',
                  outline: isCurrent ? '2px solid var(--blue-light)' : 'none', outlineOffset: 1,
                }}>{i + 1}</button>
              );
            })}
            {/* Remaining placeholders */}
            {Array.from({ length: 34 }, (_, i) => (
              <button key={`rest-${i}`} style={{ width: '100%', aspectRatio: '1', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: 'var(--surface-2)', color: 'var(--text-4)' }}>{i + 6}</button>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[['var(--navy)', 'Actuelle'], ['var(--co-main)', 'Répondu'], ['var(--surface-2)', 'Non répondu']].map(([bg, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: bg }} />
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Progress + meta */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--text-3)' }}>Question {current + 1} / 39</span>
                <Badge color="ce" size="sm">{q.level} · {q.pts} pts</Badge>
              </div>
              <ProgressBar value={answered} max={39} color="var(--ce-main)" style={{ width: 120 }} height={6} />
            </div>

            {/* Question text */}
            <Card style={{ padding: 24, marginBottom: 20, borderLeft: '4px solid var(--ce-main)' }}>
              <pre style={{ fontFamily: 'var(--font)', fontSize: 15, color: 'var(--text-1)', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{q.text}</pre>
            </Card>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {q.options.map((opt, oi) => {
                const isSelected = answers[current] === oi;
                const isCorrect = mode === 'correction' && oi === q.correct;
                const isWrong = mode === 'correction' && isSelected && oi !== q.correct;
                const letter = ['A', 'B', 'C', 'D'][oi];

                let bg = 'var(--white)', border = 'var(--border-med)', textCol = 'var(--text-1)', badgeBg = 'var(--surface-2)', badgeCol = 'var(--text-3)';
                if (isCorrect) { bg = 'oklch(94% 0.06 145)'; border = 'var(--ce-main)'; textCol = 'var(--ce-text)'; badgeBg = 'var(--ce-main)'; badgeCol = 'white'; }
                else if (isWrong) { bg = 'oklch(95% 0.04 25)'; border = 'var(--error)'; textCol = 'oklch(42% 0.20 25)'; badgeBg = 'var(--error)'; badgeCol = 'white'; }
                else if (isSelected) { bg = 'var(--blue-pale)'; border = 'var(--blue)'; textCol = 'var(--navy)'; badgeBg = 'var(--blue)'; badgeCol = 'white'; }

                return (
                  <button key={oi} onClick={() => mode === 'test' && setAnswers(p => ({ ...p, [current]: oi }))} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
                    cursor: mode === 'test' ? 'pointer' : 'default', textAlign: 'left', width: '100%',
                    fontFamily: 'var(--font)', transition: 'all 0.15s',
                  }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: badgeBg, color: badgeCol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{letter}</div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: textCol }}>{opt}</span>
                    {isCorrect && <span style={{ marginLeft: 'auto', fontSize: 14 }}>✓</span>}
                    {isWrong && <span style={{ marginLeft: 'auto', fontSize: 14 }}>✗</span>}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} style={{ padding: '10px 20px', background: 'var(--white)', border: '1px solid var(--border-med)', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: current === 0 ? 'not-allowed' : 'pointer', opacity: current === 0 ? 0.4 : 1, color: 'var(--text-2)', fontFamily: 'var(--font)' }}>← Précédente</button>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>{answered} / 39 répondues</span>
              <button onClick={() => setCurrent(c => Math.min(QUESTIONS.length - 1, c + 1))} disabled={current === QUESTIONS.length - 1} style={{ padding: '10px 20px', background: 'var(--navy)', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: current === QUESTIONS.length - 1 ? 'not-allowed' : 'pointer', opacity: current === QUESTIONS.length - 1 ? 0.4 : 1, color: 'white', fontFamily: 'var(--font)' }}>Suivante →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
window.SimulatorPage = SimulatorPage;

// ── PRICING PAGE ──────────────────────────────────────────────────────────────
function PricingPage({ onNavigate }) {
  const [tab, setTab] = useState('plans');
  const PLANS = [
    { name: 'Bronze', price: '14,99', period: '5 jours', credits: 3, popular: false, color: 'oklch(62% 0.13 55)', features: ["Accès CE, CO, EE, EO", "3 corrections IA Expression Écrite", "Suivi de progression", "Sujets d'actualité 2026"] },
    { name: 'Silver', price: '29,99', period: '30 jours', credits: 8, popular: true, color: 'var(--co-main)', features: ["Accès CE, CO, EE, EO", "8 corrections IA Expression Écrite", "Suivi de progression avancé", "Sujets d'actualité 2026", "Support prioritaire WhatsApp"] },
    { name: 'Gold', price: '49,99', period: '60 jours', credits: 15, popular: false, color: 'oklch(62% 0.17 55)', features: ["Accès CE, CO, EE, EO", "15 corrections IA Expression Écrite", "Suivi de progression avancé", "Sujets d'actualité 2026", "Support prioritaire WhatsApp", "Accès nouvelles séries en avant-première"] },
  ];
  const ZOOM = [
    { name: 'Standard Zoom', price: '149,99', period: '15 jours', sessions: 6, credits: 20, popular: false },
    { name: 'Premium Zoom', price: '199,99', period: '30 jours', sessions: 8, credits: 20, popular: true },
    { name: 'VIP Zoom', price: '249,99', period: '60 jours', sessions: 12, credits: 30, popular: false },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(145deg, var(--navy), var(--navy-mid))', padding: '64px 24px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: 12 }}>Choisissez votre forfait</h1>
        <p style={{ fontSize: 17, color: 'oklch(72% 0.04 240)', maxWidth: 480, margin: '0 auto 32px' }}>Tous les forfaits incluent l'accès aux 4 épreuves TCF Canada en conditions réelles.</p>
        {/* Tab toggle */}
        <div style={{ display: 'inline-flex', background: 'oklch(100% 0 0 / 0.1)', borderRadius: 12, padding: 4, gap: 4 }}>
          {[['plans', 'Révision autonome'], ['zoom', 'Formations Zoom']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              padding: '10px 24px', fontSize: 14, fontWeight: 700, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === key ? 'white' : 'transparent',
              color: tab === key ? 'var(--navy)' : 'oklch(75% 0.04 240)',
              transition: 'all 0.2s', fontFamily: 'var(--font)',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 960, margin: '0 auto' }}>
          {(tab === 'plans' ? PLANS : ZOOM).map(p => (
            <div key={p.name} style={{
              background: p.popular ? 'var(--navy)' : 'var(--white)',
              borderRadius: 24, padding: '32px 28px',
              border: p.popular ? 'none' : '1px solid var(--border)',
              boxShadow: p.popular ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
              position: 'relative', transform: p.popular ? 'scale(1.03)' : 'none',
              color: p.popular ? 'white' : 'var(--text-1)',
            }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--eo-main)', color: 'white', padding: '6px 18px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', boxShadow: '0 4px 12px oklch(62% 0.17 55 / 0.4)' }}>⭐ POPULAIRE</div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: p.popular ? 'oklch(72% 0.04 240)' : 'var(--text-3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{p.name}</div>
              <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', color: p.popular ? 'white' : 'var(--navy)' }}>
                ${p.price}
              </div>
              <div style={{ fontSize: 13, color: p.popular ? 'oklch(65% 0.04 240)' : 'var(--text-3)', marginBottom: 28 }}>/ {p.period}</div>
              {tab === 'zoom' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
                  {[['🎓', `${p.sessions} séances Zoom`, ''], ['🧠', `${p.credits} corrections IA`, '']].map(([icon, val]) => (
                    <div key={val} style={{ background: p.popular ? 'oklch(100% 0 0 / 0.1)' : 'var(--surface)', borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ fontSize: 18, marginBottom: 2 }}>{icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: p.popular ? 'white' : 'var(--text-1)' }}>{val}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                {(p.features || [`Accès CE, CO, EE, EO`, `${p.credits} corrections IA EE`, `Suivi de progression`, `${p.sessions} séances Zoom avec formateur`]).map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, fontSize: 14, color: p.popular ? 'oklch(82% 0.04 240)' : 'var(--text-2)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--ce-main)', flexShrink: 0, fontWeight: 800, fontSize: 15 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{
                display: 'block', textAlign: 'center', padding: '13px', fontSize: 15, fontWeight: 700,
                background: p.popular ? 'white' : 'var(--navy)',
                color: p.popular ? 'var(--navy)' : 'white',
                borderRadius: 12, textDecoration: 'none', transition: 'filter 0.15s',
                boxShadow: p.popular ? 'var(--shadow-md)' : 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.filter='brightness(0.93)'}
              onMouseLeave={e => e.currentTarget.style.filter=''}>
                Choisir {p.name}
              </a>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div style={{ maxWidth: 700, margin: '56px auto 0', textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Moyens de paiement acceptés</h3>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Western Union', 'Ria', 'Orange Money', 'MTN', 'Wave', 'PayPal'].map(m => (
              <div key={m} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, color: 'var(--text-2)', boxShadow: 'var(--shadow-xs)' }}>{m}</div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-3)', marginTop: 16 }}>Pour procéder au paiement, <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer" style={{ color: 'var(--ce-main)', fontWeight: 700 }}>contactez-nous sur WhatsApp</a></p>
        </div>
      </Section>
    </div>
  );
}
window.PricingPage = PricingPage;

// ── ACCOUNT PAGE ──────────────────────────────────────────────────────────────
function AccountPage({ onNavigate }) {
  return (
    <div>
      <div style={{ background: 'var(--navy)', padding: '48px 24px 0' }}>
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, paddingBottom: 0 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, var(--co-main), var(--ee-main))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: 'white', flexShrink: 0, boxShadow: 'var(--shadow-lg)' }}>H</div>
            <div style={{ paddingBottom: 16, flex: 1 }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: 'white', marginBottom: 4, letterSpacing: '-0.03em' }}>Hamid Haroun</h1>
              <div style={{ color: 'oklch(70% 0.04 240)', fontSize: 14 }}>hamidharoun5888@gmail.com</div>
            </div>
            <div style={{ paddingBottom: 16 }}>
              <Badge color="gray">Plan Gratuit</Badge>
            </div>
          </div>
        </div>
      </div>

      <Section style={{ paddingTop: 32 }}>
        <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Abonnement */}
          <Card style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>Mon abonnement</h3>
              <button onClick={() => onNavigate('pricing')} style={{ color: 'var(--co-main)', fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>Améliorer mon plan →</button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <Badge color="gray">Gratuit</Badge>
              <Badge color="ce">● Actif</Badge>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>4 jours utilisés</span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>56 jours restants</span>
            </div>
            <ProgressBar value={4} max={60} color="var(--co-main)" />
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 8 }}>Expire le 2026-06-19 · 56 jours restants</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 20 }}>
              {[
                { label: 'CE Séries', value: '39 séries', color: 'var(--ce-light)', text: 'var(--ce-text)' },
                { label: 'CO Séries', value: '10 séries', color: 'var(--co-light)', text: 'var(--co-text)' },
                { label: 'EE IA', value: '0/0 crédits', color: 'var(--ee-light)', text: 'var(--ee-text)' },
                { label: 'EO Sujets', value: 'Accès libre', color: 'var(--eo-light)', text: 'var(--eo-text)' },
              ].map(item => (
                <div key={item.label} style={{ background: item.color, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: item.text, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: item.text }}>{item.value}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Profil */}
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Modifier mon profil</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Input label="Nom complet" value="Hamid Haroun" onChange={() => {}} />
              <Input label="Email" value="hamidharoun5888@gmail.com" onChange={() => {}} />
              <Input label="Téléphone" placeholder="+1 514 000 0000" onChange={() => {}} />
            </div>
            <div style={{ marginTop: 20 }}>
              <Btn>Sauvegarder</Btn>
            </div>
          </Card>

          {/* Résultats récents */}
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Résultats récents</h3>
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-4)', fontSize: 14 }}>
              Aucun résultat enregistré. <button onClick={() => onNavigate('ce-series')} style={{ color: 'var(--co-main)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>Commencer une série →</button>
            </div>
          </Card>

          {/* Mot de passe */}
          <Card style={{ padding: 28 }}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Changer le mot de passe</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 360 }}>
              <Input type="password" label="Nouveau mot de passe" placeholder="Min. 8 caractères" onChange={() => {}} />
              <Input type="password" label="Confirmer le mot de passe" placeholder="Répétez le mot de passe" onChange={() => {}} />
              <Btn>Mettre à jour</Btn>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
}
window.AccountPage = AccountPage;

// ── LOGIN PAGE ─────────────────────────────────────────────────────────────────
function LoginPage({ onNavigate, mode = 'login' }) {
  const [step, setStep] = useState('social');
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [form, setForm] = useState({ email: '', password: '', name: '', confirm: '' });

  const oauthBtns = [
    { icon: '🔵', label: 'Continuer avec Google', bg: '#fff', border: '#dadce0', color: '#3c4043' },
    { icon: '🔷', label: 'Continuer avec Facebook', bg: '#1877f2', border: '#1877f2', color: '#fff' },
    { icon: '⬛', label: 'Continuer avec Apple', bg: '#000', border: '#000', color: '#fff' },
    { icon: '🟦', label: 'Continuer avec Microsoft', bg: '#fff', border: '#dadce0', color: '#3c4043' },
  ];

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(145deg, var(--navy) 0%, var(--navy-mid) 50%, oklch(97% 0.02 240) 100%)' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-xl)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>🍁</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>{isLogin ? 'Bon retour !' : 'Créer un compte'}</h2>
          <p style={{ fontSize: 14, color: 'var(--text-3)' }}>Formation TCF Canada</p>
        </div>

        {step === 'social' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {oauthBtns.map(b => (
                <button key={b.label} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                  background: b.bg, border: `1px solid ${b.border}`, color: b.color,
                  borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  fontFamily: 'var(--font)', transition: 'filter 0.15s', width: '100%',
                }}
                onMouseEnter={e => e.currentTarget.style.filter='brightness(0.96)'}
                onMouseLeave={e => e.currentTarget.style.filter=''}>
                  <span style={{ fontSize: 18 }}>{b.icon}</span> {b.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-4)', fontWeight: 600 }}>ou</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <button onClick={() => setStep('email')} style={{
              width: '100%', padding: '12px', background: 'var(--surface)', border: '1.5px solid var(--border-med)',
              borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)',
              color: 'var(--text-1)', transition: 'background 0.15s',
            }}>✉️ Continuer avec l'email</button>
          </>
        )}

        {step === 'email' && (
          <>
            <button onClick={() => setStep('social')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font)' }}>← Retour</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              {!isLogin && <Input label="Nom complet" placeholder="Prénom Nom" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} icon="👤" />}
              <Input label="Email" type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} icon="✉️" />
              <div>
                <Input label="Mot de passe" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} icon="🔒" />
                {isLogin && <button onClick={() => setStep('reset')} style={{ marginTop: 6, background: 'none', border: 'none', color: 'var(--blue)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 600 }}>Mot de passe oublié ?</button>}
              </div>
              {!isLogin && <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} icon="🔒" />}
            </div>
            <Btn style={{ width: '100%', justifyContent: 'center' }} onClick={() => onNavigate('home')}>
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </Btn>
          </>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-3)' }}>
          {isLogin ? "Pas de compte ? " : "Déjà un compte ? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ color: 'var(--co-main)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', fontSize: 13 }}>
            {isLogin ? "S'inscrire" : 'Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}
window.LoginPage = LoginPage;
