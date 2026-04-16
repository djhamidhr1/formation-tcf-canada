import { Link } from 'react-router-dom'

const BAREME = [
  { range: 'Q1–4', level: 'A1', pts: 3, count: 4, color: 'bg-green-100 text-green-800' },
  { range: 'Q5–10', level: 'A2', pts: 9, count: 6, color: 'bg-blue-100 text-blue-800' },
  { range: 'Q11–19', level: 'B1', pts: 15, count: 9, color: 'bg-yellow-100 text-yellow-800' },
  { range: 'Q20–29', level: 'B2', pts: 21, count: 10, color: 'bg-orange-100 text-orange-800' },
  { range: 'Q30–35', level: 'C1', pts: 26, count: 6, color: 'bg-red-100 text-red-800' },
  { range: 'Q36–39', level: 'C2', pts: 33, count: 4, color: 'bg-purple-100 text-purple-800' },
]

const NCLC_TABLE = [
  { range: '549–699', nclc: '10+', color: 'bg-emerald-100 text-emerald-800' },
  { range: '499–548', nclc: '9', color: 'bg-green-100 text-green-800' },
  { range: '453–498', nclc: '8', color: 'bg-lime-100 text-lime-800' },
  { range: '406–452', nclc: '7', color: 'bg-yellow-100 text-yellow-800' },
  { range: '375–405', nclc: '6', color: 'bg-amber-100 text-amber-800' },
  { range: '342–374', nclc: '5', color: 'bg-orange-100 text-orange-800' },
  { range: '226–341', nclc: '4', color: 'bg-red-100 text-red-800' },
  { range: '< 226', nclc: '3', color: 'bg-red-200 text-red-900' },
]

const TECHNIQUES = [
  {
    num: 1,
    title: 'Anticipation',
    desc: 'Lisez attentivement la question AVANT de lancer l\'audio. Identifiez les mots-clés pour savoir quelles informations chercher. Une fraction de seconde de préparation fait toute la différence.',
    icon: '👁️',
  },
  {
    num: 2,
    title: 'Prise de notes',
    desc: 'Durant l\'écoute, notez rapidement les noms de personnes, les chiffres, les lieux et les actions clés. Ces notes vous aideront à répondre avec précision même si vous avez oublié certains détails.',
    icon: '📝',
  },
  {
    num: 3,
    title: 'Indices sonores',
    desc: 'Soyez attentif à l\'intonation, aux pauses et aux emphases. Un locuteur qui insiste sur un mot ou change de ton signale souvent une information importante. Les connecteurs (cependant, donc, alors...) révèlent la structure logique.',
    icon: '🔊',
  },
  {
    num: 4,
    title: 'Accents variés',
    desc: 'Les documents sonores du TCF Canada incluent des accents québécois, africains (français), belges et hexagonaux. Entraînez-vous à ces variantes pour ne pas être surpris le jour de l\'examen.',
    icon: '🌍',
  },
  {
    num: 5,
    title: 'Élimination',
    desc: 'Si vous n\'êtes pas sûr, éliminez d\'abord les réponses manifestement fausses. Souvent, deux options semblent plausibles : relisez la question avec précision pour identifier le piège. Ne restez jamais sans réponse.',
    icon: '❌',
  },
]

export default function COTipsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1A5276] to-[#2E86C1] rounded-3xl p-8 text-white text-center mb-10">
        <div className="text-5xl mb-3">🎧</div>
        <h1 className="text-3xl font-extrabold mb-2">Astuces & Barème — Compréhension Orale</h1>
        <p className="text-blue-200 text-sm">Maîtrisez l'écoute unique pour maximiser votre score</p>
      </div>

      {/* Règle d'Or */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">⚠️</span>
          <div>
            <h2 className="text-lg font-bold text-amber-800 mb-2">Règle d'Or — Écoute Unique</h2>
            <p className="text-amber-700 text-sm leading-relaxed mb-3">
              Contrairement à l'écrit, <strong>chaque document audio ne peut être écouté qu'une seule fois</strong>.
              Il n'y a aucun retour arrière possible. Cette règle est strictement appliquée à l'examen réel.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-amber-700 text-sm">
              <li>Lisez la question <strong>avant</strong> de lancer l'audio</li>
              <li>Concentrez-vous pleinement dès le début — chaque seconde compte</li>
              <li>Prenez des notes pendant l'écoute, pas après</li>
              <li>En cas de doute, choisissez et passez — ne restez pas bloqué</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barème */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Barème officiel — Compréhension Orale</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-gray-600">Questions</th>
                <th className="text-left py-2 px-3 text-gray-600">Niveau</th>
                <th className="text-left py-2 px-3 text-gray-600">Points / bonne réponse</th>
                <th className="text-right py-2 px-3 text-gray-600">Total possible</th>
              </tr>
            </thead>
            <tbody>
              {BAREME.map(b => (
                <tr key={b.range} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 font-semibold">{b.range}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${b.color}`}>{b.level}</span>
                  </td>
                  <td className="py-3 px-3 font-bold text-[#1A5276]">{b.pts} pts</td>
                  <td className="py-3 px-3 text-right text-gray-500">{b.pts * b.count} pts</td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td className="py-3 px-3" colSpan={3}>TOTAL MAXIMUM</td>
                <td className="py-3 px-3 text-right text-[#1A5276]">699 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* NCLC Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏅 Correspondance Score → NCLC</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NCLC_TABLE.map(row => (
            <div key={row.range} className={`${row.color} rounded-xl p-3 text-center`}>
              <div className="text-lg font-extrabold">NCLC {row.nclc}</div>
              <div className="text-xs font-medium mt-0.5">{row.range} pts</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          💡 Pour la plupart des programmes d'immigration canadienne, un NCLC 7+ est requis.
        </p>
      </div>

      {/* 5 Techniques */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">💡 5 Techniques Essentielles</h2>
        <div className="space-y-4">
          {TECHNIQUES.map(t => (
            <div key={t.num} className="bg-blue-50 border border-blue-100 rounded-xl p-5 flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 bg-[#1A5276] rounded-xl flex items-center justify-center text-white font-extrabold text-lg">
                  {t.num}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{t.icon}</span>
                  <h3 className="font-bold text-gray-900">{t.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/epreuve/comprehension-orale/series"
          className="inline-block bg-[#1A5276] hover:bg-[#154360] text-white font-bold px-8 py-4 rounded-xl text-base no-underline transition-colors shadow-md"
        >
          🎧 Commencer l'entraînement →
        </Link>
        <p className="text-gray-400 text-sm mt-3">10 séries disponibles · 390 questions</p>
      </div>
    </div>
  )
}
