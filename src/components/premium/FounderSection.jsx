import { motion } from 'framer-motion'

/**
 * 👨‍🏫 SECTION FONDATEUR PREMIUM
 * Design élégant avec gradient mesh et stats animées
 */

export default function FounderSection() {
  const stats = [
    { value: '5+', label: 'Ans d\'expérience' },
    { value: '25 000+', label: 'Candidats aidés' },
    { value: '95%', label: 'Taux de réussite' },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Gradient Mesh Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(at 15% 20%, rgba(59, 130, 246, 0.7) 0px, transparent 50%),
              radial-gradient(at 85% 80%, rgba(139, 92, 246, 0.6) 0px, transparent 50%),
              linear-gradient(135deg, #0A1128 0%, #1E3A8A 100%)
            `,
          }}
        />

        {/* Grain Overlay */}
        <div
          className="absolute inset-0 opacity-5 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-12 md:p-16 text-center text-white">
          {/* Avatar avec glow pulsant */}
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(59, 130, 246, 0.4)',
                '0 0 50px rgba(59, 130, 246, 0.6)',
                '0 0 30px rgba(59, 130, 246, 0.4)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-5xl mx-auto mb-6 border-4 border-white/30"
          >
            👨‍🏫
          </motion.div>

          {/* Name & Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-black mb-2 tracking-tight"
          >
            Hamid
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-blue-200 text-xl mb-10 font-medium"
          >
            Fondateur & Expert TCF Canada depuis 2019
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="text-5xl font-black mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quote ou Mission */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-10 text-blue-100 text-lg max-w-2xl mx-auto italic"
          >
            "Notre mission : démocratiser l'accès à une préparation TCF de qualité pour tous les candidats francophones."
          </motion.p>
        </div>

        {/* Decorative circles */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 -top-20 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      </motion.div>
    </section>
  )
}
