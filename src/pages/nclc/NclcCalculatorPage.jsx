import { useState } from 'react'

const eColors = {
  ce: { main: 'var(--ce-main)', light: 'var(--ce-light)', text: 'var(--ce-text)' },
  co: { main: 'var(--co-main)', light: 'var(--co-light)', text: 'var(--co-text)' },
  ee: { main: 'var(--ee-main)', light: 'var(--ee-light)', text: 'var(--ee-text)' },
  eo: { main: 'var(--eo-main)', light: 'var(--eo-light)', text: 'var(--eo-text)' },
}

const fields = [
  { key: 'ce', label: 'Comprehension Ecrite', max: 699, ekey: 'ce' },
  { key: 'co', label: 'Comprehension Orale', max: 699, ekey: 'co' },
  { key: 'ee', label: 'Expression Ecrite', max: 20, ekey: 'ee' },
  { key: 'eo', label: 'Expression Orale', max: 20, ekey: 'eo' },
]

const getNclcCeCo = s => { if (s >= 549) return '10+'; if (s >= 499) return '9'; if (s >= 453) return '8'; if (s >= 406) return '7'; if (s >= 375) return '6'; if (s >= 342) return '5'; if (s >= 226) return '4'; return '3' }
const getNclcEeEo = s => { if (s >= 18) return '10+'; if (s >= 16) return '10'; if (s >= 14) return '9'; if (s >= 12) return '8'; if (s >= 10) return '7'; if (s >= 7) return '6'; if (s >= 4) return '5'; return '4' }

export default function NclcCalculatorPage() {
  const [scores, setScores] = useState({ ce: '', co: '', ee: '', eo: '' })

  const results = {
    ce: scores.ce ? getNclcCeCo(+scores.ce) : null,
    co: scores.co ? getNclcCeCo(+scores.co) : null,
    ee: scores.ee ? getNclcEeEo(+scores.ee) : null,
    eo: scores.eo ? getNclcEeEo(+scores.eo) : null,
  }
  const mins = Object.values(results).filter(Boolean).map(v => v === '10+' ? 11 : +v)
  const minNclc = mins.length > 0 ? (Math.min(...mins) === 11 ? '10+' : String(Math.min(...mins))) : null

  return (
    <div>
      <div style={{ background: 'linear-gradient(145deg, var(--navy), var(--navy-mid))', padding: '64px 24px 48px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', marginBottom: 12, margin: '0 0 12px' }}>Calculateur NCLC</h1>
        <p style={{ fontSize: 17, color: 'oklch(72% 0.04 240)', maxWidth: 500, margin: '0 auto' }}>Estimez votre niveau linguistique canadien (NCLC) selon vos scores aux 4 epreuves TCF.</p>
      </div>

      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {minNclc && (
            <div style={{ background: 'var(--navy)', borderRadius: 20, padding: '28px 32px', textAlign: 'center', marginBottom: 32, color: 'white' }}>
              <div style={{ fontSize: 14, color: 'oklch(72% 0.04 240)', marginBottom: 6 }}>Votre niveau NCLC minimum</div>
              <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: '-0.04em' }}>NCLC {minNclc}</div>
              <div style={{ fontSize: 13, color: 'oklch(60% 0.04 240)', marginTop: 6 }}>Niveau le plus bas des 4 competences</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 32 }}>
            {fields.map(f => {
              const c = eColors[f.ekey]
              const result = results[f.key]
              return (
                <div key={f.key} style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: c.text, marginBottom: 4 }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Score sur {f.max}</div>
                    </div>
                    {result && (
                      <div style={{ background: c.main, color: 'white', fontWeight: 900, fontSize: 20, padding: '6px 14px', borderRadius: 10, letterSpacing: '-0.02em' }}>
                        NCLC {result}
                      </div>
                    )}
                  </div>
                  <input type="number" min="0" max={f.max} placeholder={`0 \u2013 ${f.max}`}
                    value={scores[f.key]} onChange={e => setScores(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      width: '100%', padding: 12, fontSize: 18, fontWeight: 800,
                      border: `2px solid ${result ? c.main : 'var(--border-med)'}`,
                      borderRadius: 10, outline: 'none', textAlign: 'center', fontFamily: 'var(--font)',
                      color: result ? c.text : 'var(--text-1)', background: result ? c.light : 'var(--white)',
                      transition: 'all 0.2s',
                    }} />
                  {result && (
                    <div style={{ background: 'var(--surface-2)', borderRadius: 999, height: 4, overflow: 'hidden', marginTop: 10 }}>
                      <div style={{ width: `${Math.min(100, (+scores[f.key] / f.max) * 100)}%`, height: '100%', background: c.main, borderRadius: 999, transition: 'width 0.4s' }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
              <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, margin: '0 0 16px' }}>CE / CO — Score /699</h4>
              {[['549\u2013699', '10+'], ['499\u2013548', '9'], ['453\u2013498', '8'], ['406\u2013452', '7'], ['375\u2013405', '6'], ['342\u2013374', '5'], ['226\u2013341', '4'], ['<226', '3']].map(([r, n]) => (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 6, background: 'var(--surface)', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{r} pts</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)' }}>NCLC {n}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', padding: 24 }}>
              <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, margin: '0 0 16px' }}>EE / EO — Score /20</h4>
              {[['18\u201320', '10+'], ['16\u201317', '10'], ['14\u201315', '9'], ['12\u201313', '8'], ['10\u201311', '7'], ['7\u20139', '6'], ['4\u20136', '5'], ['<4', '4']].map(([r, n]) => (
                <div key={r} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', borderRadius: 6, background: 'var(--surface)', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{r} pts</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--navy)' }}>NCLC {n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
