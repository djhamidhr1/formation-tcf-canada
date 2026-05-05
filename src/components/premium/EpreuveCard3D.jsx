import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/**
 * 🎴 CARTE ÉPREUVE 3D — Design Premium 50 000$
 * Effet tilt 3D au hover, gradient animé, glassmorphism
 */

export default function EpreuveCard3D({ epreuve, index }) {
  const gradients = {
    co: 'from-blue-600 via-blue-500 to-blue-400',
    ce: 'from-green-600 via-green-500 to-green-400',
    eo: 'from-amber-600 via-yellow-500 to-yellow-400',
    ee: 'from-blue-600 via-blue-500 to-blue-400',
  }

  const glowColors = {
    co: '0 20px 60px rgba(59, 130, 246, 0.4)',
    ce: '0 20px 60px rgba(16, 185, 129, 0.4)',
    eo: '0 20px 60px rgba(245, 158, 11, 0.4)',
    ee: '0 20px 60px rgba(139, 92, 246, 0.4)',
  }

  // Détecter le type d'épreuve depuis le path
  const type = epreuve.path.includes('orale') ? 'co'
    : epreuve.path.includes('ecrite') && epreuve.path.includes('comprehension') ? 'ce'
    : epreuve.path.includes('expression-orale') ? 'eo'
    : 'ee'

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={epreuve.path}
        className="group relative block no-underline"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: glowColors[type],
          }}
        >
          {/* Gradient Background animé */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradients[type]} opacity-90`}
            style={{
              backgroundSize: '200% 200%',
              animation: 'gradientShift 6s ease infinite',
            }}
          />

          {/* Grain Overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Content */}
          <div className="relative p-8 text-white">
            {/* Icon avec glow pulsant */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-4 drop-shadow-2xl"
            >
              {epreuve.icon}
            </motion.div>

            {/* Title */}
            <h3 className="text-2xl font-black mb-3 leading-tight tracking-tight">
              {epreuve.label}
            </h3>

            {/* Description */}
            <p className="text-white/90 text-base mb-4 leading-relaxed">
              {epreuve.desc}
            </p>

            {/* Badge détails */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 text-sm font-bold mb-6">
              {epreuve.details}
            </div>

            {/* CTA avec arrow animée */}
            <div className="flex items-center gap-2 text-white font-bold group-hover:gap-3 transition-all">
              <span>Commencer l'entraînement</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Decorative circles (background pattern) */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </motion.div>
      </Link>
    </motion.div>
  )
}
