import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#1A5276] text-blue-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍁</span>
              <span className="text-white font-bold text-lg">TCF Canada</span>
            </div>
            <p className="text-sm text-blue-300 leading-relaxed">
              Plateforme spécialisée dans la préparation au TCF Canada et TCF Québec.
            </p>
            <div className="mt-3 text-sm space-y-1">
              <div>📍 Montréal, QC, Canada</div>
              <div>✉️ <a href="mailto:hamid@formation-tcf.com" className="text-blue-300 hover:text-white no-underline">hamid@formation-tcf.com</a></div>
              <div>📞 <a href="tel:+15147467431" className="text-blue-300 hover:text-white no-underline">+1 514 746 7431</a></div>
            </div>
          </div>

          {/* Épreuves */}
          <div className="md:col-span-1">
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
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-3">Liens rapides</h4>
            <ul className="space-y-1.5 text-sm">
              {[
                ['/tarifs', 'Tarification'],
                ['/formations', 'Formations Zoom'],
                ['/calculateur-nclc', 'Calculateur NCLC'],
                ['/connexion', 'Se connecter'],
                ['/inscription', "S'inscrire"],
              ].map(([path, label]) => (
                <li key={path}><Link to={path} className="text-blue-300 hover:text-white no-underline transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div className="md:col-span-1">
            <h4 className="text-white font-semibold mb-3">Nous suivre</h4>
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://wa.me/15147467431" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-lg no-underline transition-colors">
                💬 WhatsApp
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg no-underline transition-colors">
                ▶ YouTube
              </a>
            </div>
          </div>

          {/* Moyens de paiement */}
          <div className="md:col-span-1">
            <h4 className="text-white font-bold mb-3">Nous acceptons</h4>

            {/* Image logos paiement */}
            <div className="bg-white/10 rounded-xl overflow-hidden p-2">
              <img
                src={`${import.meta.env.BASE_URL}images/payment-logos.png`}
                alt="Western Union, Ria, Orange Money, MTN, Wave, PayPal"
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>

            {/* Bouton Cliquez ici */}
            <Link
              to="/tarifs"
              className="mt-3 flex items-center justify-center gap-2 w-full bg-white hover:bg-blue-50 text-[#1A5276] font-bold text-sm px-4 py-2.5 rounded-xl no-underline transition-colors shadow-sm"
            >
              Cliquez ici
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-blue-400">
          <p>© 2026 Formation TCF Canada. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link to="/confidentialite" className="text-blue-400 hover:text-white no-underline transition-colors">Confidentialité</Link>
            <Link to="/conditions" className="text-blue-400 hover:text-white no-underline transition-colors">Conditions</Link>
            <Link to="/faq" className="text-blue-400 hover:text-white no-underline transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
