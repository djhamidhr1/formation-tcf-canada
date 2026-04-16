import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1A5276] text-blue-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍁</span>
              <span className="text-white font-bold text-lg">TCF Canada</span>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed">
              Plateforme spécialisée dans la préparation au TCF Canada et TCF Québec.
            </p>
            <div className="mt-3 text-sm space-y-1">
              <div>📍 Montréal, QC, Canada</div>
              <div>✉️ <a href="mailto:ayoub@tcfcanada.com" className="text-blue-300 hover:text-white no-underline">ayoub@tcfcanada.com</a></div>
              <div>📞 <a href="tel:+15062536067" className="text-blue-300 hover:text-white no-underline">+1 506 253 6067</a></div>
            </div>
          </div>

          {/* Épreuves */}
          <div>
            <h4 className="text-white font-semibold mb-3">Épreuves TCF</h4>
            <ul className="space-y-1.5 text-sm">
              {[
                ['/epreuve/comprehension-ecrite', '📖 Compréhension Écrite'],
                ['/epreuve/comprehension-orale', '🎧 Compréhension Orale'],
                ['/epreuve/expression-ecrite', '✍️ Expression Écrite'],
                ['/epreuve/expression-orale', '🎤 Expression Orale'],
              ].map(([path, label]) => (
                <li key={path}><Link to={path} className="text-blue-300 hover:text-white no-underline transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-white font-semibold mb-3">Liens rapides</h4>
            <ul className="space-y-1.5 text-sm">
              {[
                ['/tarifs', 'Tarification'],
                ['/formations', 'Formations Zoom'],
                ['/calculateur-nclc', 'Calculateur NCLC'],
                ['/connexion', 'Se connecter'],
                ['/inscription', 'S\'inscrire'],
              ].map(([path, label]) => (
                <li key={path}><Link to={path} className="text-blue-300 hover:text-white no-underline transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h4 className="text-white font-semibold mb-3">Nous suivre</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://wa.me/15062536067" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg no-underline transition-colors">
                💬 WhatsApp
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg no-underline transition-colors">
                ▶ YouTube
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-blue-400">
          <p>© 2026 Formation TCF Canada. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link to="#" className="text-blue-400 hover:text-white no-underline">Confidentialité</Link>
            <Link to="#" className="text-blue-400 hover:text-white no-underline">Conditions</Link>
            <Link to="#" className="text-blue-400 hover:text-white no-underline">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
