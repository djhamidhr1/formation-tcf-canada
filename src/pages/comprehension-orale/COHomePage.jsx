import { Link } from 'react-router-dom'
import { BarChart2, Grid, Lightbulb, Play } from 'lucide-react'

export default function COHomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1A5276] to-[#2E86C1] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🎧</div>
          <h1 className="text-4xl font-extrabold mb-3">Compréhension Orale</h1>
          <p className="text-blue-100 text-lg mb-6">
            Écoutez des documents sonores authentiques. Maîtrisez la compréhension auditive en français.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            {[
              ['35 min', 'Durée'],
              ['39 questions', 'Par série'],
              ['699 pts', 'Score max'],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="text-2xl font-extrabold">{v}</div>
                <div className="text-blue-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
          <Link
            to="/epreuve/comprehension-orale/series"
            className="inline-flex items-center gap-2 bg-white text-[#1A5276] hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl text-lg no-underline transition-colors shadow-lg"
          >
            <Play size={20} /> Commencer une session
          </Link>
        </div>
      </div>

      {/* Navigation cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              to: '/epreuve/comprehension-orale/tableau-de-bord',
              icon: <BarChart2 size={32} />,
              title: 'Tableau de bord',
              desc: 'Suivez votre progression et vos statistiques',
            },
            {
              to: '/epreuve/comprehension-orale/series',
              icon: <Grid size={32} />,
              title: 'Grille des séries',
              desc: '10 séries complètes à votre disposition',
            },
            {
              to: '/epreuve/comprehension-orale/astuces',
              icon: <Lightbulb size={32} />,
              title: 'Astuces & Barème',
              desc: 'Stratégies et guide de notation officiel',
            },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all no-underline text-center"
            >
              <div className="text-[#1A5276] mx-auto mb-3 flex justify-center">{item.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* Info box */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="font-bold text-[#1A5276] text-lg mb-3">🎧 À propos de l'épreuve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Format :</span> Documents sonores variés (dialogues, annonces,
                émissions)
              </p>
              <p>
                <span className="font-semibold">Durée :</span> 35 minutes pour 39 questions
              </p>
              <p>
                <span className="font-semibold">Écoutes :</span> Une seule écoute par document — pas de retour arrière
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Niveaux :</span> A1 (3 pts) à C2 (33 pts) par bonne réponse
              </p>
              <p>
                <span className="font-semibold">Score maximal :</span> 699 points
              </p>
              <p>
                <span className="font-semibold">NCLC :</span> Score 549+ = NCLC 10 · Score 406+ = NCLC 7
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
