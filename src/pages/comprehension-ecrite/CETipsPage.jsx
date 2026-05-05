import { Target, Clock, MapPin, XCircle, BarChart2 } from 'lucide-react'

const BAREME = [
  { range: 'Q1–4', level: 'A1', pts: 3, color: 'bg-blue-100 text-blue-800' },
  { range: 'Q5–10', level: 'A2', pts: 9, color: 'bg-blue-100 text-blue-800' },
  { range: 'Q11–19', level: 'B1', pts: 15, color: 'bg-blue-50 text-blue-800' },
  { range: 'Q20–29', level: 'B2', pts: 21, color: 'bg-blue-100 text-blue-800' },
  { range: 'Q30–35', level: 'C1', pts: 26, color: 'bg-red-100 text-red-800' },
  { range: 'Q36–39', level: 'C2', pts: 33, color: 'bg-blue-100 text-blue-800' },
]

const TIPS = [
  { icon: <Target size={24} />, title: 'Stratégie Gagnante', desc: 'Commencez par les questions C2 (Q36-39, 33 pts chacune). Si vous en répondez correctement, vous gagnez 132 pts en seulement 4 questions !' },
  { icon: <Clock size={24} />, title: 'Gestion du Temps', desc: 'Allouez ~90 secondes par question. Lisez d\'abord la question, puis cherchez la réponse dans le texte — pas l\'inverse.' },
  { icon: <MapPin size={24} />, title: 'Repérage', desc: 'Soulignez les mots-clés de la question. Repérez les connecteurs logiques dans le texte (cependant, néanmoins, en revanche...).' },
  { icon: <XCircle size={24} />, title: 'Élimination', desc: 'Éliminez d\'abord les réponses clairement incorrectes. Entre 2 réponses plausibles, relisez le passage exact du texte source.' },
]

export default function CETipsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Astuces — Compréhension Écrite</h1>
      <p className="text-center text-gray-500 mb-10">Optimisez votre score avec ces stratégies éprouvées</p>

      {/* Barème */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><BarChart2 size={20} /> Bareme officiel</h2>
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
                  <td className="py-3 px-3 font-bold text-[#0F3D58]">{b.pts} pts</td>
                  <td className="py-3 px-3 text-right text-gray-500">{b.pts * (b.range === 'Q1–4' ? 4 : b.range === 'Q5–10' ? 6 : b.range === 'Q11–19' ? 9 : b.range === 'Q20–29' ? 10 : b.range === 'Q30–35' ? 6 : 4)} pts</td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-bold">
                <td className="py-3 px-3" colSpan={3}>TOTAL MAXIMUM</td>
                <td className="py-3 px-3 text-right text-[#0F3D58]">699 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Conseils */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TIPS.map(t => (
          <div key={t.title} className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <div className="mb-2 text-blue-700">{t.icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{t.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
