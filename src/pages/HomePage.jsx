import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../services/supabase'
import { getNclcCeCo, getNclcEeEo } from '../utils/nclc'
import { BookOpen, Headphones, PenTool, Mic, TrendingUp, Brain, Calendar, Users, Clock, Shield } from 'lucide-react'

const EPREUVES = [
  { path: '/epreuve/comprehension-orale', icon: '🎧', label: 'Compréhension Orale', desc: 'Écoutez des documents audio variés', details: '39 questions · 35 min', color: 'from-blue-600 to-blue-400', bg: 'bg-blue-50', border: 'border-blue-200' },
  { path: '/epreuve/comprehension-ecrite', icon: '📖', label: 'Compréhension Écrite', desc: 'Lisez des textes variés et authentiques', details: '39 questions · 60 min', color: 'from-green-600 to-green-400', bg: 'bg-green-50', border: 'border-green-200' },
  { path: '/epreuve/expression-orale', icon: '🎤', label: 'Expression Orale', desc: 'Exprimez-vous sur des sujets variés', details: '3 tâches · 12 min', color: 'from-yellow-600 to-yellow-400', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { path: '/epreuve/expression-ecrite', icon: '✍️', label: 'Expression Écrite', desc: 'Rédigez des textes structurés en 3 tâches', details: '3 tâches · 60 min', color: 'from-purple-600 to-purple-400', bg: 'bg-purple-50', border: 'border-purple-200' },
]

const AVANTAGES = [
  { icon: <TrendingUp size={28} />, title: 'Suivi de Progression', desc: 'Performances en temps réel' },
  { icon: <Brain size={28} />, title: 'Simulateur IA', desc: 'Correction automatique Expression Écrite' },
  { icon: <Calendar size={28} />, title: 'Version 2026', desc: 'Contenus mis à jour avec derniers sujets' },
  { icon: <Users size={28} />, title: 'Accompagnement', desc: 'Formateurs certifiés FLE' },
  { icon: <Shield size={28} />, title: 'Conditions Réelles', desc: 'Simulation exacte officielle TCF' },
  { icon: <Clock size={28} />, title: 'Accès 24/7', desc: 'Réviser à tout moment, partout' },
]

const PRICING = [
  { name: 'Bronze', price: 14.99, days: 5, credits: 3, popular: false },
  { name: 'Silver', price: 29.99, days: 30, credits: 8, popular: true },
  { name: 'Gold', price: 49.99, days: 60, credits: 15, popular: false },
]

const NCLC_TABLE = [
  { range: '549 – 699', nclc: '10+' }, { range: '499 – 548', nclc: '9' },
  { range: '453 – 498', nclc: '8' }, { range: '406 – 452', nclc: '7' },
  { range: '375 – 405', nclc: '6' }, { range: '342 – 374', nclc: '5' },
  { range: '226 – 341', nclc: '4' }, { range: '< 226', nclc: '3' },
]

const FAQ = [
  { q: 'Les exercices sont-ils conformes au vrai TCF Canada ?', a: 'Oui, tous nos exercices sont créés selon le format officiel du TCF Canada (CIEP/France Éducation International).' },
  { q: 'Puis-je utiliser la plateforme sur mobile ?', a: 'Absolument ! La plateforme est entièrement responsive et optimisée pour mobile, tablette et ordinateur.' },
  { q: 'Puis-je changer de forfait ?', a: 'Oui, vous pouvez upgrader votre forfait à tout moment. La différence de prix sera calculée au prorata.' },
  { q: 'Comment fonctionne la correction IA de l\'Expression Écrite ?', a: 'Notre IA (Claude Opus) analyse vos textes selon les critères officiels TCF et fournit une note, des points positifs, des axes d\'amélioration et un texte modèle.' },
  { q: 'Y a-t-il une période d\'essai gratuite ?', a: 'Oui ! L\'accès aux séries CE/CO et aux sujets EO est entièrement gratuit. Le simulateur IA EE nécessite un abonnement.' },
]

export default function HomePage() {
  const [stats, setStats] = useState({ seriesCE: 39, seriesCO: 10, questionsCE: 1521, questionsCO: 390, combinaisonsEE: 326, sujetsEO: 2855 })
  const [nclcScores, setNclcScores] = useState({ ce: '', co: '', ee: '', eo: '' })
  const [faqOpen, setFaqOpen] = useState(null)

  useEffect(() => {
    Promise.all([
      supabase.from('series_ce').select('id', { count: 'exact', head: true }),
      supabase.from('series_co').select('id', { count: 'exact', head: true }),
      supabase.from('questions_ce').select('id', { count: 'exact', head: true }),
      supabase.from('questions_co').select('id', { count: 'exact', head: true }),
      supabase.from('combinaisons_ee').select('id', { count: 'exact', head: true }),
      supabase.from('sujets_eo').select('id', { count: 'exact', head: true }),
    ]).then(([sce, sco, qce, qco, ee, eo]) => {
      setStats({
        seriesCE: sce.count || 39,
        seriesCO: sco.count || 10,
        questionsCE: qce.count || 1521,
        questionsCO: qco.count || 390,
        combinaisonsEE: ee.count || 326,
        sujetsEO: eo.count || 2855,
      })
    })
  }, [])

  const nclcResults = {
    ce: nclcScores.ce ? getNclcCeCo(Number(nclcScores.ce)) : null,
    co: nclcScores.co ? getNclcCeCo(Number(nclcScores.co)) : null,
    ee: nclcScores.ee ? getNclcEeEo(Number(nclcScores.ee)) : null,
    eo: nclcScores.eo ? getNclcEeEo(Number(nclcScores.eo)) : null,
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1A5276] to-[#2E86C1] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6 animate-pulse">
              🔥 Sujets Récents d'Expression Écrite & Orale — Avril 2026
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight">
              Se préparer au<br className="hidden md:block" /> TCF Canada – TCF Québec
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Plateforme spécialisée dans la préparation au TCF Canada. Tests en conditions réelles avec correction IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link to="/inscription" className="bg-white text-[#1A5276] hover:bg-blue-50 font-bold px-8 py-3.5 rounded-xl text-lg no-underline transition-colors shadow-lg">
                Commencer gratuitement →
              </Link>
              <Link to="/tarifs" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold px-8 py-3.5 rounded-xl text-lg no-underline transition-colors">
                Voir les tarifs
              </Link>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                [stats.questionsCE + stats.questionsCO, 'Questions C. Orale + Écrite'],
                [stats.seriesCE + stats.seriesCO, 'Séries d\'entraînement'],
                [stats.combinaisonsEE, 'Combinaisons Expression Écrite'],
                [stats.sujetsEO, 'Sujets Expression Orale'],
              ].map(([val, label]) => (
                <div key={label} className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                  <div className="text-3xl font-extrabold">{val}</div>
                  <div className="text-xs text-blue-200 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4 Épreuves */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Les 4 Épreuves TCF</h2>
        <p className="text-center text-gray-500 mb-10">Préparez-vous à chaque compétence avec des exercices authentiques</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {EPREUVES.map((ep, i) => (
            <motion.div key={ep.path} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Link to={ep.path} className={`block ${ep.bg} ${ep.border} border-2 rounded-2xl p-6 no-underline hover:shadow-lg transition-all hover:-translate-y-1`}>
                <div className="text-4xl mb-3">{ep.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{ep.label}</h3>
                <p className="text-gray-600 text-sm mb-4">{ep.desc}</p>
                <div className={`inline-block bg-gradient-to-r ${ep.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                  {ep.details}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">Pourquoi choisir TCF Canada ?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVANTAGES.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm flex gap-4">
                <div className="text-[#1A5276] shrink-0">{a.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{a.title}</h4>
                  <p className="text-gray-500 text-sm">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fondateur */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-br from-[#1A5276] to-[#2E86C1] rounded-2xl p-10 text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">👨‍🏫</div>
          <h3 className="text-2xl font-extrabold mb-2">Ayoub — Fondateur</h3>
          <p className="text-blue-100 text-lg mb-6">Expert TCF Canada depuis 2019</p>
          <div className="grid grid-cols-3 gap-4">
            {[['5+', 'Ans d\'expérience'], ['25 000+', 'Candidats aidés'], ['95%', 'Taux de réussite']].map(([v, l]) => (
              <div key={l}>
                <div className="text-3xl font-extrabold">{v}</div>
                <div className="text-blue-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing aperçu */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Nos Forfaits</h2>
          <p className="text-center text-gray-500 mb-10">Commencez gratuitement, upgradez quand vous le souhaitez</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING.map(p => (
              <div key={p.name} className={`bg-white rounded-2xl p-6 shadow-sm relative ${p.popular ? 'ring-2 ring-[#1A5276]' : ''}`}>
                {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A5276] text-white text-xs font-bold px-4 py-1 rounded-full">POPULAIRE</div>}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{p.name}</h3>
                <div className="text-4xl font-extrabold text-[#1A5276] mb-1">${p.price}</div>
                <div className="text-gray-400 text-sm mb-4">/ {p.days} jours</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>✅ Accès toutes les épreuves</li>
                  <li>✅ {p.credits} corrections IA Expression Écrite</li>
                  <li>✅ Suivi de progression</li>
                </ul>
                <Link to="/tarifs" className="block bg-[#1A5276] hover:bg-[#154360] text-white text-center py-3 rounded-xl font-bold no-underline transition-colors">
                  Choisir {p.name}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/tarifs" className="text-[#1A5276] font-semibold hover:underline">Voir toutes les offres →</Link>
          </div>
        </div>
      </section>

      {/* Calculateur NCLC */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-3">Calculateur NCLC</h2>
        <p className="text-center text-gray-500 mb-10">Entrez vos scores pour connaître votre niveau NCLC</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'ce', label: 'Compréhension Écrite', max: 699, placeholder: '0 – 699' },
                { key: 'co', label: 'Compréhension Orale', max: 699, placeholder: '0 – 699' },
                { key: 'ee', label: 'Expression Écrite', max: 20, placeholder: '0 – 20' },
                { key: 'eo', label: 'Expression Orale', max: 20, placeholder: '0 – 20' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{f.label}</label>
                  <input type="number" min="0" max={f.max} placeholder={f.placeholder}
                    value={nclcScores[f.key]}
                    onChange={e => setNclcScores(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {nclcResults[f.key] && (
                    <div className="mt-1 bg-blue-50 text-blue-700 text-center rounded-lg py-1 text-sm font-bold">
                      NCLC {nclcResults[f.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-700 mb-3 text-sm">Table NCLC (CE / CO)</h4>
            <div className="space-y-1">
              {NCLC_TABLE.map(r => (
                <div key={r.range} className="flex justify-between text-sm bg-gray-50 rounded-lg px-3 py-1.5">
                  <span className="text-gray-600">{r.range} pts</span>
                  <span className="font-bold text-[#1A5276]">NCLC {r.nclc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">Questions fréquentes</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button className="w-full px-6 py-4 text-left flex justify-between items-center font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  {item.q}
                  <span className="text-[#1A5276] text-xl">{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 py-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-10">Contactez-nous</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <a href="https://wa.me/15062536067" target="_blank" rel="noreferrer"
              className="flex items-center gap-4 bg-green-600 hover:bg-green-700 text-white p-5 rounded-xl no-underline transition-colors">
              <span className="text-3xl">💬</span>
              <div>
                <div className="font-bold text-lg">WhatsApp</div>
                <div className="text-green-100 text-sm">+1 506 253 6067</div>
              </div>
            </a>
            <a href="mailto:ayoub@tcfcanada.com"
              className="flex items-center gap-4 bg-[#1A5276] hover:bg-[#154360] text-white p-5 rounded-xl no-underline transition-colors">
              <span className="text-3xl">✉️</span>
              <div>
                <div className="font-bold text-lg">Email</div>
                <div className="text-blue-200 text-sm">ayoub@tcfcanada.com</div>
              </div>
            </a>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4">Envoyer un message</h4>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Votre email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea rows={4} placeholder="Votre message..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              <button className="w-full bg-[#1A5276] hover:bg-[#154360] text-white py-3 rounded-lg font-bold text-sm transition-colors">
                Envoyer →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
