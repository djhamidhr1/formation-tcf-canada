import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle } from 'lucide-react'

/**
 * ❓ FAQ SECTION PREMIUM
 * Accordéons animés avec design élégant
 */

const FAQ = [
  {
    q: 'Les exercices sont-ils conformes au vrai TCF Canada ?',
    a: 'Oui, tous nos exercices sont créés selon le format officiel du TCF Canada (CIEP/France Éducation International). Chaque série respecte scrupuleusement la structure, le timing et les critères d\'évaluation officiels.',
  },
  {
    q: 'Puis-je utiliser la plateforme sur mobile ?',
    a: 'Absolument ! La plateforme est entièrement responsive et optimisée pour mobile, tablette et ordinateur. Vous pouvez vous entraîner partout, à tout moment.',
  },
  {
    q: 'Puis-je changer de forfait ?',
    a: 'Oui, vous pouvez upgrader votre forfait à tout moment. La différence de prix sera calculée au prorata de la durée restante.',
  },
  {
    q: 'Comment fonctionne la correction IA de l\'Expression Écrite ?',
    a: 'Notre IA (Claude Opus) analyse vos textes selon les critères officiels TCF : cohérence, syntaxe, vocabulaire, orthographe. Elle fournit une note sur 20, des points positifs, des axes d\'amélioration et un texte modèle corrigé.',
  },
  {
    q: 'Y a-t-il une période d\'essai gratuite ?',
    a: 'Oui ! L\'accès aux séries CE/CO et aux sujets EO est entièrement gratuit. Le simulateur IA EE nécessite un abonnement (3 corrections incluses dès le forfait Bronze).',
  },
  {
    q: 'Les sujets sont-ils régulièrement mis à jour ?',
    a: 'Oui, nous ajoutons chaque mois les nouveaux sujets d\'Expression Écrite et Orale. Les séries CE/CO sont complètes (39-40 séries disponibles).',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(at 30% 20%, rgba(59, 130, 246, 0.08) 0px, transparent 50%),
            radial-gradient(at 70% 80%, rgba(139, 92, 246, 0.08) 0px, transparent 50%),
            linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)
          `,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-electric to-primary-royal rounded-2xl mb-6 text-white shadow-lg">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-4 gradient-text">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir avant de commencer
          </p>
        </motion.div>

        <div className="space-y-4">
          {FAQ.map((item, i) => {
            const isOpen = openIndex === i

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <div
                  className={`
                    bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300
                    ${isOpen
                      ? 'border-primary-electric shadow-xl'
                      : 'border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300'
                    }
                  `}
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 transition-colors"
                  >
                    <span className="font-bold text-gray-900 text-lg pr-4">
                      {item.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`
                        shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                        ${isOpen
                          ? 'bg-primary-electric text-white'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                        }
                      `}
                    >
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </motion.div>
                  </button>

                  {/* Réponse */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2 border-t-2 border-gray-100">
                          <p className="text-gray-700 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* CTA vers page FAQ complète */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/#/faq"
            className="inline-flex items-center gap-2 text-primary-electric font-bold text-lg hover:gap-3 transition-all"
          >
            Voir toutes les questions
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
