import { motion } from 'framer-motion'

/**
 * 💎 CARTE AVANTAGE PREMIUM
 * Glassmorphism, hover lift, animations subtiles
 */

export default function AvantageCard({ icon, title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      {/* Glass card */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="relative flex gap-4">
          {/* Icon avec fond gradient */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-primary-electric to-primary-sky flex items-center justify-center text-white shadow-md"
          >
            <div className="scale-75">
              {icon}
            </div>
          </motion.div>

          <div>
            <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary-electric transition-colors">
              {title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {desc}
            </p>
          </div>
        </div>

        {/* Border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300/30 transition-all duration-300" />
      </div>

      {/* Floating background circle */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -inset-4 bg-gradient-to-br from-blue-400/10 to-blue-400/10 rounded-full blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </motion.div>
  )
}
