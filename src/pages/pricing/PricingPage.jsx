import { useState } from 'react'
import { Link } from 'react-router-dom'

const REVISION_PLANS = [
  {
    name: 'Bronze',
    price: 14.99,
    duration: '5 jours',
    credits: 3,
    popular: false,
    features: [
      'Acces 5 jours aux 4 epreuves',
      '3 corrections IA Expression Ecrite',
      'Suivi de progression',
      'Sujets Actualites 2026',
    ],
  },
  {
    name: 'Silver',
    price: 29.99,
    duration: '30 jours',
    credits: 8,
    popular: true,
    features: [
      'Acces 30 jours aux 4 epreuves',
      '8 corrections IA Expression Ecrite',
      'Suivi de progression avance',
      'Sujets Actualites 2026',
      'Support prioritaire WhatsApp',
    ],
  },
  {
    name: 'Gold',
    price: 49.99,
    duration: '60 jours',
    credits: 15,
    popular: false,
    features: [
      'Acces 60 jours aux 4 epreuves',
      '15 corrections IA Expression Ecrite',
      'Suivi de progression avance',
      'Sujets Actualites 2026',
      'Support prioritaire WhatsApp',
      'Acces aux nouvelles series en avant-premiere',
    ],
  },
]

const ZOOM_PLANS = [
  {
    name: 'Standard',
    price: 149.99,
    duration: '15 jours',
    sessions: 6,
    popular: false,
    features: [
      '6 seances Zoom avec formateur certifie',
      'Acces plateforme 15 jours',
      'Support WhatsApp',
      'Materiel pedagogique inclus',
    ],
  },
  {
    name: 'Premium',
    price: 199.99,
    duration: '30 jours',
    sessions: 8,
    popular: true,
    features: [
      '8 seances Zoom avec formateur certifie',
      'Acces plateforme 30 jours',
      'Support WhatsApp prioritaire',
      'Materiel pedagogique inclus',
      'Acces groupe WhatsApp premium',
    ],
  },
  {
    name: 'VIP',
    price: 249.99,
    duration: '60 jours',
    sessions: 12,
    popular: false,
    features: [
      '12 seances Zoom avec formateur certifie',
      'Acces plateforme 60 jours',
      'Support WhatsApp illimite',
      'Materiel pedagogique premium',
      'Acces groupe WhatsApp premium',
      "Simulations d'examen blanc",
    ],
  },
]

const PAYMENT_METHODS = [
  'Western Union',
  'Ria',
  'Orange Money',
  'MTN',
  'Wave',
  'PayPal',
]

export default function PricingPage() {
  const [tab, setTab] = useState('revision')

  const plans = tab === 'revision' ? REVISION_PLANS : ZOOM_PLANS

  return (
    <div style={{ fontFamily: 'var(--font)' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
          color: 'var(--white)',
          padding: '80px 24px 56px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: '0 0 12px',
            color: 'var(--white)',
          }}
        >
          Choisissez votre forfait
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: 'oklch(90% 0.02 240)',
            maxWidth: 560,
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          Des formules adaptees a chaque objectif. Commencez votre preparation TCF Canada des aujourd'hui.
        </p>

        {/* Tab toggle */}
        <div
          style={{
            display: 'inline-flex',
            background: 'oklch(100% 0 0 / 0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: 4,
            gap: 4,
          }}
        >
          {[
            { key: 'revision', label: 'Revision autonome' },
            { key: 'zoom', label: 'Formations Zoom' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '10px 28px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'var(--font)',
                transition: 'all 0.2s',
                background: tab === key ? 'var(--white)' : 'transparent',
                color: tab === key ? 'var(--navy)' : 'oklch(100% 0 0 / 0.7)',
                boxShadow: tab === key ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Plans grid */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '64px 24px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {plans.map((plan) => {
            const isPopular = plan.popular
            return (
              <div
                key={plan.name}
                style={{
                  position: 'relative',
                  background: isPopular ? 'var(--navy)' : 'var(--white)',
                  borderRadius: 24,
                  border: isPopular ? 'none' : '1px solid var(--border)',
                  boxShadow: isPopular ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
                  padding: '40px 32px 32px',
                  transform: isPopular ? 'scale(1.03)' : 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#f59e0b',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '5px 20px',
                      borderRadius: 'var(--radius-full)',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    POPULAIRE
                  </div>
                )}

                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    margin: '0 0 4px',
                    color: isPopular ? 'var(--white)' : 'var(--text-1)',
                  }}
                >
                  {plan.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, margin: '0 0 4px' }}>
                  <span
                    style={{
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      color: isPopular ? 'var(--white)' : 'var(--navy)',
                    }}
                  >
                    ${plan.price}
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      color: isPopular ? 'oklch(100% 0 0 / 0.6)' : 'var(--text-3)',
                    }}
                  >
                    USD
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.875rem',
                    color: isPopular ? 'oklch(100% 0 0 / 0.6)' : 'var(--text-3)',
                    margin: '0 0 24px',
                  }}
                >
                  Acces {plan.duration}
                  {plan.credits ? ` \u00B7 ${plan.credits} credits IA` : ''}
                  {plan.sessions ? ` \u00B7 ${plan.sessions} seances` : ''}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px' }}>
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: '0.875rem',
                        color: isPopular ? 'oklch(100% 0 0 / 0.85)' : 'var(--text-2)',
                        marginBottom: 10,
                        lineHeight: 1.5,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ flexShrink: 0, marginTop: 2 }}
                      >
                        <circle cx="8" cy="8" r="8" fill={isPopular ? 'oklch(85% 0.15 145)' : '#22c55e'} opacity="0.2" />
                        <path
                          d="M5 8l2 2 4-4"
                          stroke={isPopular ? 'oklch(85% 0.15 145)' : '#22c55e'}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/15147467431?text=Bonjour%2C+je+souhaite+souscrire+au+Pack+${encodeURIComponent(plan.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '14px 0',
                    borderRadius: 'var(--radius-lg)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    fontFamily: 'var(--font)',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    background: isPopular ? 'var(--white)' : 'var(--navy)',
                    color: isPopular ? 'var(--navy)' : 'var(--white)',
                  }}
                >
                  Choisir {plan.name} &rarr;
                </a>
              </div>
            )
          })}
        </div>
      </section>

      {/* Payment methods */}
      <section
        style={{
          background: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-1)',
            margin: '0 0 8px',
          }}
        >
          Moyens de paiement acceptes
        </h2>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-3)',
            margin: '0 0 24px',
          }}
        >
          Payez facilement depuis votre pays
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '8px 20px',
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-2)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              {method}
            </span>
          ))}
        </div>
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-4)',
            marginTop: 20,
          }}
        >
          Acces active dans les 30 minutes apres confirmation du paiement - 7j/7
        </p>
      </section>

      {/* CTA final */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
          color: 'var(--white)',
          padding: '72px 24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            margin: '0 0 12px',
            color: 'var(--white)',
          }}
        >
          Pret a commencer ?
        </h2>
        <p
          style={{
            fontSize: '1rem',
            color: 'oklch(85% 0.02 240)',
            margin: '0 0 32px',
          }}
        >
          Choisissez votre forfait et commencez des aujourd'hui
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Link
            to="/inscription"
            style={{
              background: 'var(--white)',
              color: 'var(--navy)',
              fontWeight: 700,
              padding: '14px 32px',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              transition: 'opacity 0.2s',
            }}
          >
            Choisir un forfait &rarr;
          </Link>
          <a
            href="https://wa.me/15147467431"
            target="_blank"
            rel="noreferrer"
            style={{
              border: '2px solid oklch(100% 0 0 / 0.4)',
              background: 'transparent',
              color: 'var(--white)',
              fontWeight: 700,
              padding: '14px 32px',
              borderRadius: 'var(--radius-lg)',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              transition: 'opacity 0.2s',
            }}
          >
            Contacter via WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
