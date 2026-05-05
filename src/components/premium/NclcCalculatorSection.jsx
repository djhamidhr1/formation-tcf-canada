import { useState } from 'react'
import { motion } from 'framer-motion'
import { getNclcCeCo, getNclcEeEo } from '../../utils/nclc'
import { Calculator, TrendingUp } from 'lucide-react'

/**
 * 🧮 CALCULATEUR NCLC PREMIUM
 * Interface interactive avec animations et feedback visuel
 */

const NCLC_TABLE = [
  { range: '549 – 699', nclc: '10+', color: 'from-[#0F3D58] to-[#164b6b]' },
  { range: '499 – 548', nclc: '9', color: 'from-[#0F3D58] to-[#1a5a7a]' },
  { range: '453 – 498', nclc: '8', color: 'from-[#F98012] to-[#e06800]' },
  { range: '406 – 452', nclc: '7', color: 'from-[#F98012] to-[#faa040]' },
  { range: '375 – 405', nclc: '6', color: 'from-[#71C9CE] to-[#5ab5ba]' },
  { range: '342 – 374', nclc: '5', color: 'from-[#71C9CE] to-[#9bb0bc]' },
  { range: '226 – 341', nclc: '4', color: 'from-[#9bb0bc] to-[#7a95a0]' },
  { range: '< 226', nclc: '3', color: 'from-red-500 to-red-600' },
]

export default function NclcCalculatorSection() {
  const [nclcScores, setNclcScores] = useState({ ce: '', co: '', ee: '', eo: '' })

  const nclcResults = {
    ce: nclcScores.ce ? getNclcCeCo(Number(nclcScores.ce)) : null,
    co: nclcScores.co ? getNclcCeCo(Number(nclcScores.co)) : null,
    ee: nclcScores.ee ? getNclcEeEo(Number(nclcScores.ee)) : null,
    eo: nclcScores.eo ? getNclcEeEo(Number(nclcScores.eo)) : null,
  }

  const fields = [
    { key: 'ce', label: 'Compréhension Écrite', max: 699, placeholder: '0 – 699', icon: '📖' },
    { key: 'co', label: 'Compréhension Orale', max: 699, placeholder: '0 – 699', icon: '🎧' },
    { key: 'ee', label: 'Expression Écrite', max: 20, placeholder: '0 – 20', icon: '✍️' },
    { key: 'eo', label: 'Expression Orale', max: 20, placeholder: '0 – 20', icon: '🎤' },
  ]

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
          Calculateur NCLC
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Entrez vos scores TCF pour connaître instantanément votre niveau NCLC
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulaire de saisie */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-electric to-primary-royal flex items-center justify-center text-white">
              <Calculator size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Vos scores</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                  <span className="text-xl">{f.icon}</span>
                  {f.label}
                </label>
                <input
                  type="number"
                  min="0"
                  max={f.max}
                  placeholder={f.placeholder}
                  value={nclcScores[f.key]}
                  onChange={e => setNclcScores(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-electric focus:border-transparent transition-all"
                />
                {nclcResults[f.key] && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-center rounded-xl py-3"
                  >
                    <div className="text-xs font-bold text-green-700 mb-1">Résultat</div>
                    <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      NCLC {nclcResults[f.key]}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Score moyen */}
          {Object.values(nclcResults).some(v => v !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-600 text-white"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={24} />
                <span className="font-bold">Moyenne NCLC</span>
              </div>
              <div className="text-4xl font-black">
                {(
                  Object.values(nclcResults).filter(v => v !== null).reduce((a, b) => a + Number(b), 0) /
                  Object.values(nclcResults).filter(v => v !== null).length
                ).toFixed(1)}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Table NCLC */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200"
        >
          <h4 className="text-2xl font-bold text-gray-900 mb-6">
            Barème NCLC (CE / CO)
          </h4>
          <div className="space-y-3">
            {NCLC_TABLE.map((r, i) => (
              <motion.div
                key={r.range}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="group relative overflow-hidden rounded-xl"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${r.color} opacity-10 group-hover:opacity-20 transition-opacity`} />

                {/* Content */}
                <div className="relative flex justify-between items-center px-5 py-4 border-2 border-gray-200 group-hover:border-gray-300 rounded-xl transition-all">
                  <span className="text-gray-700 font-semibold">{r.range} pts</span>
                  <div className={`bg-gradient-to-r ${r.color} text-white font-black px-4 py-1.5 rounded-lg text-lg shadow-md`}>
                    NCLC {r.nclc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info supplémentaire */}
          <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <p className="text-sm text-blue-800 leading-relaxed">
              <strong>💡 Bon à savoir :</strong> Pour l'Expression Écrite et Orale, le barème est différent (sur /20). Le calculateur ajuste automatiquement.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
