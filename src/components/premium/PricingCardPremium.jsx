import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

/**
 * 💳 CARTE PRICING PREMIUM
 * Design 3D avec hover tilt, glow pulsant pour carte populaire
 */

export default function PricingCardPremium({ plan, index }) {
  const { name, price, days, credits, popular } = plan

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative group ${popular ? 'z-10' : ''}`}
      style={{ perspective: '1000px' }}
    >
      {/* Badge POPULAIRE */}
      {popular && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-1.5">
            <Sparkles size={12} className="animate-pulse" />
            POPULAIRE
          </div>
        </motion.div>
      )}

      {/* Card */}
      <div
        className={`
          relative rounded-3xl p-8 bg-white border-2 overflow-hidden
          transition-all duration-300
          ${popular
            ? 'border-primary-electric shadow-2xl'
            : 'border-gray-200 shadow-lg hover:shadow-xl'
          }
        `}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: popular ? '0 20px 60px rgba(59, 130, 246, 0.3)' : undefined,
        }}
      >
        {/* Background gradient pour carte populaire */}
        {popular && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/50 opacity-60" />
        )}

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Content */}
        <div className="relative z-10">
          {/* Plan name */}
          <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
            {name}
          </h3>

          {/* Price */}
          <div className="mb-1">
            <span className="text-5xl font-black bg-gradient-to-r from-primary-electric to-primary-royal bg-clip-text text-transparent">
              ${price}
            </span>
          </div>

          <div className="text-gray-500 text-sm font-medium mb-6">
            pour {days} jours d'accès complet
          </div>

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {[
              'Accès illimité toutes les épreuves',
              `${credits} corrections IA Expression Écrite`,
              'Suivi de progression en temps réel',
              'Tests en conditions réelles',
              'Sujets récents Avril 2026',
            ].map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + i * 0.05 }}
                className="flex items-start gap-3 text-sm text-gray-700"
              >
                <Check
                  size={18}
                  className={`shrink-0 mt-0.5 ${
                    popular ? 'text-primary-electric' : 'text-green-600'
                  }`}
                />
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <Link
            to="/tarifs"
            className={`
              block text-center py-4 rounded-xl font-bold text-lg no-underline
              transition-all duration-300 transform
              ${popular
                ? 'bg-gradient-to-r from-primary-electric to-primary-royal text-white shadow-lg hover:shadow-2xl hover:scale-105'
                : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
              }
            `}
          >
            Choisir {name}
          </Link>
        </div>

        {/* Decorative circles */}
        {popular && (
          <>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
          </>
        )}
      </div>

      {/* Glow pulsant pour carte populaire */}
      {popular && (
        <motion.div
          animate={{
            boxShadow: [
              '0 20px 60px rgba(59, 130, 246, 0.2)',
              '0 20px 80px rgba(59, 130, 246, 0.4)',
              '0 20px 60px rgba(59, 130, 246, 0.2)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-3xl -z-10"
        />
      )}
    </motion.div>
  )
}
