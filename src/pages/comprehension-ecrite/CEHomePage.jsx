import { Link } from 'react-router-dom'
import { BookOpen, BarChart2, Grid, Lightbulb, Play } from 'lucide-react'

export default function CEHomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1E8449] to-[#27AE60] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-4xl font-extrabold mb-3">Compréhension Écrite</h1>
          <p className="text-green-100 text-lg mb-6">Lisez des textes variés et authentiques. Maîtrisez la lecture en français.</p>
          <div className="flex justify-center gap-6 mb-8">
            {[['60 min', 'Durée'], ['39 questions', 'Par série'], ['699 pts', 'Score max']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-extrabold">{v}</div>
                <div className="text-green-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <Link to="/epreuve/comprehension-ecrite/series"
            className="inline-flex items-center gap-2 bg-white text-[#1E8449] hover:bg-green-50 font-bold px-8 py-3.5 rounded-xl text-lg no-underline transition-colors shadow-lg">
            <Play size={20} /> Commencer une session
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { to: '/epreuve/comprehension-ecrite/tableau-de-bord', icon: <BarChart2 size={32} />, title: 'Tableau de bord', desc: 'Suivez votre progression et vos statistiques' },
            { to: '/epreuve/comprehension-ecrite/series', icon: <Grid size={32} />, title: 'Grille des séries', desc: '39 séries complètes à votre disposition' },
            { to: '/epreuve/comprehension-ecrite/astuces', icon: <Lightbulb size={32} />, title: 'Astuces & Barème', desc: 'Stratégies et guide de notation officiel' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all no-underline text-center">
              <div className="text-[#1E8449] mx-auto mb-3 flex justify-center">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
