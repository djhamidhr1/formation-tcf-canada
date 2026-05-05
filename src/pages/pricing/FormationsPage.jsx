import { Link } from 'react-router-dom'

const FORMATIONS = [
  {
    name: 'Standard',
    price: 149.99,
    sessions: 6,
    duration: '15 jours',
    popular: false,
    features: [
      '6 seances Zoom en direct',
      'Acces plateforme 15 jours',
      'Support WhatsApp',
      'Materiel pedagogique inclus',
    ],
  },
  {
    name: 'Premium',
    price: 199.99,
    sessions: 8,
    duration: '30 jours',
    popular: true,
    features: [
      '8 seances Zoom en direct',
      'Acces plateforme 30 jours',
      'Support WhatsApp prioritaire',
      'Materiel pedagogique inclus',
      'Acces groupe WhatsApp premium',
    ],
  },
  {
    name: 'VIP',
    price: 249.99,
    sessions: 12,
    duration: '60 jours',
    popular: false,
    features: [
      '12 seances Zoom en direct',
      'Acces plateforme 60 jours',
      'Support WhatsApp illimite',
      'Materiel pedagogique premium',
      "Simulations d'examen blanc",
      'Seance individuelle de bilan',
    ],
  },
]

const FORMATEUR_BADGES = [
  'Certifie FLE',
  '5 ans exp.',
  'TCF Expert',
  'Zoom Pro',
]

function getWhatsAppUrl(name) {
  const text = encodeURIComponent(`Bonjour, je souhaite m'inscrire a la formation ${name} TCF Canada`)
  return `https://wa.me/15147467431?text=${text}`
}

export default function FormationsPage() {
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
          Formations Zoom
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#FDF2E9',
            maxWidth: 580,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Preparez votre TCF Canada avec un formateur certifie FLE en seances individuelles ou petit groupe sur Zoom.
        </p>
      </section>

      {/* Main content: 2-col grid */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '64px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 40,
          alignItems: 'start',
        }}
      >
        {/* Left: Formateur card */}
        <div
          style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
            padding: 32,
          }}
        >
          {/* Avatar + Name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--white)',
                fontSize: '1.5rem',
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              H
            </div>
            <div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-1)',
                  margin: 0,
                }}
              >
                Hamid
              </h2>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-3)',
                  margin: '2px 0 0',
                }}
              >
                Formateur certifie FLE
              </p>
            </div>
          </div>

          {/* Badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 28,
            }}
          >
            {FORMATEUR_BADGES.map((badge) => (
              <span
                key={badge}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '5px 14px',
                  background: 'var(--blue-pale)',
                  color: 'var(--navy)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            {[
              { value: '25 000+', label: 'Candidats formes' },
              { value: '95%', label: 'Taux de reussite' },
              { value: '5 ans', label: "Experience" },
              { value: '4.9/5', label: 'Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'var(--surface)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 12px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--navy)',
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-3)',
                    marginTop: 2,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Formation cards stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {FORMATIONS.map((f) => {
            const isPopular = f.popular
            return (
              <div
                key={f.name}
                style={{
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-lg)',
                  border: isPopular ? '2px solid var(--navy)' : '1px solid var(--border)',
                  boxShadow: isPopular ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  padding: '24px 28px',
                  position: 'relative',
                }}
              >
                {isPopular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      background: '#f59e0b',
                      color: '#fff',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '4px 14px',
                      borderRadius: 'var(--radius-full)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    POPULAIRE
                  </span>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: '1.125rem',
                        fontWeight: 800,
                        color: 'var(--text-1)',
                        margin: '0 0 4px',
                      }}
                    >
                      {f.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-3)',
                        margin: 0,
                      }}
                    >
                      {f.sessions} seances &middot; {f.duration}
                    </p>
                  </div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      color: 'var(--navy)',
                    }}
                  >
                    ${f.price}
                  </div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {f.features.map((feat) => (
                    <li
                      key={feat}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: '0.8125rem',
                        color: 'var(--text-2)',
                        marginBottom: 6,
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ flexShrink: 0 }}
                      >
                        <path
                          d="M5 8l2 2 4-4"
                          stroke="#22c55e"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          {/* WhatsApp CTA */}
          <a
            href={getWhatsAppUrl('Zoom')}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              padding: '16px 0',
              background: '#22c55e',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 700,
              fontSize: '0.9375rem',
              fontFamily: 'var(--font)',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'opacity 0.2s',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            S'inscrire via WhatsApp &rarr;
          </a>
        </div>
      </section>
    </div>
  )
}
