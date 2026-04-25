import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

/**
 * 🎨 HERO PREMIUM - Formation TCF Canada
 * Design de niveau 50 000$ avec gradient mesh, particules Canvas, animations orchestrées
 */

// Composant Particules Canvas (background interactif)
const ParticlesCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    // Dimensionner le canvas
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Créer des particules
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * 0.5 - 0.25
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        ctx.fillStyle = `rgba(96, 165, 250, ${this.opacity})` // Bleu sky
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialiser particules
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      // Dessiner des connexions entre particules proches
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.2
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  )
}

// Stats counter avec animation
const AnimatedStat = ({ value, label, suffix = '', delay = 0 }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="relative"
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300">
        <div className="text-4xl md:text-5xl font-black mb-2 gradient-text">
          {inView && (
            <CountUp end={value} duration={2.5} separator=" " suffix={suffix} />
          )}
        </div>
        <div className="text-sm text-blue-200 font-medium">{label}</div>
      </div>
    </motion.div>
  )
}

// CTA Button avec glow pulsant
const CTAButton = ({ children, to, primary = false, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        to={to}
        className={`
          group relative inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold no-underline
          transition-all duration-300 overflow-hidden
          ${primary
            ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xl hover:shadow-2xl hover:scale-105'
            : 'bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20'
          }
        `}
        style={primary ? { boxShadow: '0 10px 40px rgba(220, 38, 38, 0.4)' } : {}}
      >
        {/* Effet shimmer au hover */}
        <span className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <span className="relative z-10">{children}</span>
        <ArrowRight
          size={20}
          className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </motion.div>
  )
}

// Composant principal Hero
export default function HeroPremium({ stats }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] // Custom spring easing
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background: Gradient Mesh Animé */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(at 10% 20%, rgba(59, 130, 246, 0.6) 0px, transparent 50%),
            radial-gradient(at 90% 10%, rgba(139, 92, 246, 0.5) 0px, transparent 50%),
            radial-gradient(at 50% 80%, rgba(220, 38, 38, 0.4) 0px, transparent 50%),
            linear-gradient(135deg, #0A1128 0%, #1E3A8A 100%)
          `
        }}
      >
        {/* Grain overlay pour texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Particules Canvas */}
      <ParticlesCanvas />

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 md:py-32 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge "Nouveau" */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-full px-5 py-2.5 backdrop-blur-md animate-pulse-glow">
              <Sparkles size={18} className="text-red-300" />
              <span className="text-sm font-bold text-white">
                Sujets Récents Expression Écrite & Orale — Avril 2026
              </span>
            </div>
          </motion.div>

          {/* Headline principale avec text reveal */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1]"
            style={{ letterSpacing: '-0.04em' }}
          >
            <span className="block">
              Préparez votre
            </span>
            <span className="block gradient-text">
              TCF Canada
            </span>
            <span className="block">
              comme jamais
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-4 leading-relaxed font-medium"
          >
            Plateforme IA pour maximiser vos chances de réussir.
            <br />
            Tests en conditions réelles, corrections instantanées, progression garantie.
          </motion.p>

          {/* 3 Value Props avec icônes */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 max-w-4xl mx-auto"
          >
            {[
              { icon: '🤖', text: 'Correction IA instantanée' },
              { icon: '📊', text: 'Suivi en temps réel' },
              { icon: '🎯', text: 'Conditions réelles' }
            ].map((prop, i) => (
              <div key={i} className="flex items-center gap-2 text-white/90">
                <span className="text-2xl">{prop.icon}</span>
                <span className="text-sm md:text-base font-medium">{prop.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <CTAButton to="/tarifs" primary delay={0.3}>
              Commencer gratuitement
            </CTAButton>
            <CTAButton to="#epreuves" delay={0.4}>
              Découvrir les épreuves
            </CTAButton>
          </motion.div>

          {/* Stats animés */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              <AnimatedStat
                value={stats.questionsCE + stats.questionsCO}
                label="Questions CO + CE"
                delay={0.5}
              />
              <AnimatedStat
                value={stats.seriesCE + stats.seriesCO}
                label="Séries d'entraînement"
                delay={0.6}
              />
              <AnimatedStat
                value={stats.combinaisonsEE}
                label="Combinaisons EE"
                delay={0.7}
              />
              <AnimatedStat
                value={stats.sujetsEO}
                label="Sujets EO"
                delay={0.8}
              />
            </div>
          </motion.div>

          {/* Trust badges (social proof) */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-60"
          >
            {[
              { icon: CheckCircle, text: '5000+ étudiants' },
              { icon: CheckCircle, text: '95% de réussite' },
              { icon: CheckCircle, text: '4.9/5 étoiles' }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-white/80">
                <badge.icon size={20} />
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator animé */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
