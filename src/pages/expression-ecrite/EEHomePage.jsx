import { Link } from 'react-router-dom'
import { BarChart2, FileText, Lightbulb, Play, Clock, ListChecks, Trophy } from 'lucide-react'

const PURPLE = '#7D3C98'
const PURPLE_DARK = '#6C3483'
const PURPLE_LIGHT = '#A569BD'

export default function EEHomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#7D3C98] to-[#8E44AD] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">✍️</div>
          <h1 className="text-4xl font-extrabold mb-3">Expression Écrite</h1>
          <p className="text-purple-200 text-lg mb-8">
            Démontrez votre capacité à rédiger en français. Maîtrisez les 3 tâches du TCF Canada.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { value: '60 min', label: 'Durée totale', icon: <Clock size={18} /> },
              { value: '3 tâches', label: 'À rédiger', icon: <ListChecks size={18} /> },
              { value: '20 pts', label: 'Score maximum', icon: <Trophy size={18} /> },
            ].map(({ value, label, icon }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-purple-200 mb-1">
                  {icon}
                  <span className="text-xs uppercase tracking-wide">{label}</span>
                </div>
                <div className="text-3xl font-extrabold">{value}</div>
              </div>
            ))}
          </div>

          <Link
            to="/epreuve/expression-ecrite/sujets-actualites"
            className="inline-flex items-center gap-2 bg-white text-[#7D3C98] hover:bg-purple-50 font-bold px-8 py-3.5 rounded-xl text-lg no-underline transition-colors shadow-lg"
          >
            <Play size={20} /> Voir les sujets d'actualités
          </Link>
        </div>
      </div>

      {/* Info box — 3 tâches */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-bold text-[#7D3C98] mb-4">📋 Les 3 tâches de l'Expression Écrite</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: 1,
                time: '~10 min',
                pts: '6 pts',
                level: 'A2–B1',
                title: 'Message personnel',
                desc: 'Rédigez un message ou une lettre informelle (60–120 mots). Style convivial, ton amical.',
                color: 'bg-purple-100 text-purple-800',
              },
              {
                num: 2,
                time: '~20 min',
                pts: '7 pts',
                level: 'B1–B2',
                title: 'Narration passée',
                desc: 'Racontez un événement passé (120–150 mots). Utilisez le passé composé, l\'imparfait.',
                color: 'bg-violet-100 text-violet-800',
              },
              {
                num: 3,
                time: '~30 min',
                pts: '7 pts',
                level: 'C1–C2',
                title: 'Comparaison de documents',
                desc: 'Analysez et comparez deux documents (120–180 mots). Argumentez avec précision.',
                color: 'bg-fuchsia-100 text-fuchsia-800',
              },
            ].map(({ num, time, pts, level, title, desc, color }) => (
              <div key={num} className="bg-white rounded-xl border border-purple-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#7D3C98] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                    {num}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{title}</div>
                    <div className="flex gap-1.5 mt-0.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{level}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-3">{desc}</p>
                <div className="flex justify-between text-xs font-semibold text-gray-500">
                  <span>⏱ {time}</span>
                  <span className="text-[#7D3C98]">🏆 {pts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation cards */}
        <h2 className="text-xl font-bold text-gray-900 mb-5">Accès rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            {
              to: '/epreuve/expression-ecrite/tableau-de-bord',
              icon: <BarChart2 size={32} />,
              title: 'Tableau de bord',
              desc: 'Consultez votre progression et vos corrections passées',
              badge: null,
            },
            {
              to: '/epreuve/expression-ecrite/sujets-actualites',
              icon: <FileText size={32} />,
              title: 'Sujets d\'actualités',
              desc: '326 combinaisons de sujets réels du TCF Canada',
              badge: '326',
            },
            {
              to: '/epreuve/expression-ecrite/astuces',
              icon: <Lightbulb size={32} />,
              title: 'Astuces & Barème',
              desc: 'Stratégies de rédaction et guide de notation officiel',
              badge: null,
            },
          ].map(({ to, icon, title, desc, badge }) => (
            <Link
              key={to}
              to={to}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all no-underline text-center group"
            >
              {badge && (
                <span className="absolute top-3 right-3 bg-[#7D3C98] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              <div className="text-[#7D3C98] mx-auto mb-3 flex justify-center group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>

        {/* CTA section */}
        <div className="bg-gradient-to-r from-[#7D3C98] to-[#8E44AD] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Prêt à vous entraîner ?</h2>
          <p className="text-purple-200 mb-6 text-sm">
            Accédez à 326 combinaisons de sujets tirés des vrais examens TCF Canada
          </p>
          <Link
            to="/epreuve/expression-ecrite/sujets-actualites"
            className="inline-flex items-center gap-2 bg-white text-[#7D3C98] hover:bg-purple-50 font-bold px-8 py-3.5 rounded-xl text-base no-underline transition-colors shadow-lg"
          >
            <FileText size={18} /> Voir les sujets d'actualités
          </Link>
        </div>
      </div>
    </div>
  )
}
