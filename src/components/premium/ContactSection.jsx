import { motion } from 'framer-motion'
import { Mail, MessageCircle, Send } from 'lucide-react'

/**
 * 📞 SECTION CONTACT PREMIUM
 * Design moderne avec glassmorphism et animations
 */

export default function ContactSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl md:text-6xl font-black mb-4 gradient-text">
          Contactez-nous
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Une question ? Notre équipe est là pour vous aider
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact rapide - 2 colonnes */}
        <div className="lg:col-span-2 space-y-6">
          {/* WhatsApp */}
          <motion.a
            href="https://wa.me/15147467431"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative block no-underline overflow-hidden rounded-3xl"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-500" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Content */}
            <div className="relative p-8 text-white">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl border-2 border-white/30"
                >
                  <MessageCircle size={32} />
                </motion.div>
                <div className="flex-1">
                  <div className="font-black text-2xl mb-2">WhatsApp</div>
                  <div className="text-green-100 font-medium mb-4">
                    Réponse rapide 24/7
                  </div>
                  <div className="text-lg font-bold bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 inline-block">
                    +1 514 746 7431
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </motion.a>

          {/* Email */}
          <motion.a
            href="mailto:hamid@formation-tcf.com"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group relative block no-underline overflow-hidden rounded-3xl"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-electric to-primary-royal" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Content */}
            <div className="relative p-8 text-white">
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30"
                >
                  <Mail size={32} />
                </motion.div>
                <div className="flex-1">
                  <div className="font-black text-2xl mb-2">Email</div>
                  <div className="text-blue-100 font-medium mb-4">
                    Support professionnel
                  </div>
                  <div className="text-lg font-bold bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-4 py-2 inline-block">
                    hamid@formation-tcf.com
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </motion.a>
        </div>

        {/* Formulaire - 3 colonnes */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-electric to-primary-royal flex items-center justify-center text-white">
                <Send size={24} />
              </div>
              <h3 className="text-3xl font-black text-gray-900">Envoyez un message</h3>
            </div>

            <form className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-electric focus:border-transparent transition-all"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Votre email *
                  </label>
                  <input
                    type="email"
                    placeholder="jean@exemple.com"
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-electric focus:border-transparent transition-all"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Votre message *
                </label>
                <textarea
                  rows={6}
                  placeholder="Bonjour, j'aimerais en savoir plus sur..."
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-electric focus:border-transparent transition-all resize-none"
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-primary-electric to-primary-royal text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 text-lg"
              >
                <Send size={20} />
                Envoyer le message
              </motion.button>

              <p className="text-sm text-gray-500 text-center mt-4">
                Nous répondons généralement sous 24h
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
