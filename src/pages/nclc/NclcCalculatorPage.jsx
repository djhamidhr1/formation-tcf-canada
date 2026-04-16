import { useState } from 'react'
import { scoreToNclc, scoreEEToNclc } from '../../utils/scoring'
import { NCLC_TABLE_CE_CO } from '../../utils/nclc'

const NCLC_COLORS = {
  10: 'bg-emerald-500 text-white',
  9: 'bg-green-500 text-white',
  8: 'bg-lime-500 text-white',
  7: 'bg-yellow-400 text-yellow-900',
  6: 'bg-amber-400 text-amber-900',
  5: 'bg-orange-400 text-white',
  4: 'bg-red-400 text-white',
  3: 'bg-red-600 text-white',
}

const COMPETENCES = [
  { key: 'ce', label: 'Compréhension Écrite', short: 'CE', max: 699, type: 'ceco', icon: '📖' },
  { key: 'co', label: 'Compréhension Orale', short: 'CO', max: 699, type: 'ceco', icon: '🎧' },
  { key: 'ee', label: 'Expression Écrite', short: 'EE', max: 20, type: 'ee', icon: '✍️' },
  { key: 'eo', label: 'Expression Orale', short: 'EO', max: 20, type: 'ee', icon: '🎤' },
]

const NCLC_CE_CO_TABLE = [
  { range: '549–699', nclc: '10+' },
  { range: '499–548', nclc: '9' },
  { range: '453–498', nclc: '8' },
  { range: '406–452', nclc: '7' },
  { range: '375–405', nclc: '6' },
  { range: '342–374', nclc: '5' },
  { range: '226–341', nclc: '4' },
  { range: '< 226', nclc: '3' },
]

const NCLC_EE_EO_TABLE = [
  { range: '18–20', nclc: '10' },
  { range: '16–17', nclc: '10' },
  { range: '14–15', nclc: '9' },
  { range: '12–13', nclc: '8' },
  { range: '10–11', nclc: '7' },
  { range: '7–9', nclc: '6' },
  { range: '4–6', nclc: '5' },
  { range: '< 4', nclc: '4' },
]

function getNclc(score, type) {
  if (score === '' || score === null) return null
  const n = Number(score)
  if (isNaN(n)) return null
  return type === 'ceco' ? scoreToNclc(n) : scoreEEToNclc(n)
}

export default function NclcCalculatorPage() {
  const [scores, setScores] = useState({ ce: '', co: '', ee: '', eo: '' })

  const nclcs = {}
  COMPETENCES.forEach(c => {
    nclcs[c.key] = getNclc(scores[c.key], c.type)
  })

  const allNclcs = Object.values(nclcs).filter(n => n !== null)
  const avgNclc = allNclcs.length > 0 ? Math.round(allNclcs.reduce((a, b) => a + b, 0) / allNclcs.length) : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Calculateur NCLC</h1>
        <p className="text-gray-500">Entrez vos scores TCF Canada pour connaître votre niveau NCLC</p>
      </div>

      {/* Score inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {COMPETENCES.map(comp => {
          const nclc = nclcs[comp.key]
          return (
            <div key={comp.key} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{comp.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{comp.label}</div>
                    <div className="text-xs text-gray-400">0 – {comp.max} pts</div>
                  </div>
                </div>
                {nclc !== null && (
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-extrabold ${NCLC_COLORS[nclc] || 'bg-gray-200'}`}>
                    NCLC {nclc}
                  </div>
                )}
              </div>
              <input
                type="number"
                min={0}
                max={comp.max}
                value={scores[comp.key]}
                onChange={e => setScores(prev => ({ ...prev, [comp.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Score ${comp.short} (/  ${comp.max})`}
              />
            </div>
          )
        })}
      </div>

      {/* Average NCLC */}
      {avgNclc !== null && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white text-center mb-8">
          <div className="text-sm text-slate-300 mb-1">NCLC moyen (sur {allNclcs.length} compétence{allNclcs.length !== 1 ? 's' : ''})</div>
          <div className={`text-5xl font-extrabold mb-2`}>NCLC {avgNclc}</div>
          <div className="text-slate-400 text-sm">
            {avgNclc >= 7 ? '✅ Niveau requis pour la plupart des programmes d\'immigration' : '💪 Continuez à vous entraîner pour atteindre NCLC 7+'}
          </div>

          {/* Per-competence badges */}
          <div className="grid grid-cols-4 gap-3 mt-5">
            {COMPETENCES.map(comp => (
              <div key={comp.key} className="bg-white/10 rounded-xl py-2.5">
                <div className="text-xs text-slate-400">{comp.short}</div>
                <div className="text-lg font-extrabold">
                  {nclcs[comp.key] !== null ? nclcs[comp.key] : '—'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reference tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CE/CO table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">📖🎧 Barème CE / CO (/699)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-1.5 px-2 text-gray-500 font-medium text-xs">Score</th>
                <th className="text-right py-1.5 px-2 text-gray-500 font-medium text-xs">NCLC</th>
              </tr>
            </thead>
            <tbody>
              {NCLC_CE_CO_TABLE.map(row => (
                <tr key={row.range} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-2 text-gray-700">{row.range}</td>
                  <td className="py-2 px-2 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${NCLC_COLORS[parseInt(row.nclc)] || 'bg-gray-100 text-gray-600'}`}>
                      NCLC {row.nclc}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EE/EO table */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 text-sm">✍️🎤 Barème EE / EO (/20)</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-1.5 px-2 text-gray-500 font-medium text-xs">Score</th>
                <th className="text-right py-1.5 px-2 text-gray-500 font-medium text-xs">NCLC</th>
              </tr>
            </thead>
            <tbody>
              {NCLC_EE_EO_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-2 text-gray-700">{row.range}</td>
                  <td className="py-2 px-2 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${NCLC_COLORS[parseInt(row.nclc)] || 'bg-gray-100 text-gray-600'}`}>
                      NCLC {row.nclc}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ À savoir</p>
        <p>Pour la plupart des programmes d'immigration canadienne (ex. Entrée Express, PEQ), un <strong>NCLC 7</strong> est requis pour les 4 compétences. Le NCLC est calculé séparément pour chaque compétence.</p>
      </div>
    </div>
  )
}
