import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCountry } from '../hooks/useCountry'
import { useWeather } from '../hooks/useWeather'
import { ArrowLeft, Users, Globe, MapPin, Landmark, TrendingUp } from 'lucide-react'

function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n?.toString() ?? '—'
}

function formatArea(n) {
  return n ? n.toLocaleString() + ' km²' : '—'
}

function WeatherBadge({ lat, lng }) {
  const { weather, loading } = useWeather(lat, lng)
  if (loading) return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: 'var(--text-3)' }}>
      loading…
    </span>
  )
  if (!weather) return <span style={{ color: 'var(--text-3)', fontSize: '10px' }}>—</span>
  return (
    <div>
      <span style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '28px',
        fontWeight: 400,
        color: 'var(--text)',
      }}>
        {weather.temp}°
      </span>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color: 'var(--text-3)',
        marginTop: '2px',
      }}>
        {weather.description}
      </p>
    </div>
  )
}

function Selector({ label, value, onChange, countries }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '9px',
        color: 'var(--text-3)',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        {label}
      </p>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--surface)',
          border: '0.5px solid var(--border)',
          borderRadius: '6px',
          padding: '10px 14px',
          fontSize: '12px',
          fontFamily: "'IBM Plex Sans', sans-serif",
          color: value ? 'var(--text)' : 'var(--text-3)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        <option value="">select a country…</option>
        {countries
          .slice()
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map(c => (
            <option key={c.cca2} value={c.cca2}>{c.name.common}</option>
          ))}
      </select>
    </div>
  )
}

function CompareRow({ label, icon, valA, valB, winner }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: '16px',
      padding: '12px 0',
      borderBottom: '0.5px solid var(--border)',
    }}>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '12px',
        textAlign: 'right',
        color: winner === 'A' ? 'var(--accent)' : 'var(--text-2)',
        fontWeight: winner === 'A' ? 500 : 400,
      }}>
        {valA}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '80px' }}>
        <span style={{ color: 'var(--text-3)' }}>{icon}</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          color: 'var(--text-3)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </div>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '12px',
        textAlign: 'left',
        color: winner === 'B' ? 'var(--accent)' : 'var(--text-2)',
        fontWeight: winner === 'B' ? 500 : 400,
      }}>
        {valB}
      </p>
    </div>
  )
}

export function Compare() {
  const { countries, loading } = useCountry()
  const navigate = useNavigate()
  const [codeA, setCodeA] = useState('')
  const [codeB, setCodeB] = useState('')

  const countryA = useMemo(() => countries.find(c => c.cca2 === codeA), [countries, codeA])
  const countryB = useMemo(() => countries.find(c => c.cca2 === codeB), [countries, codeB])

  const rows = useMemo(() => {
    if (!countryA || !countryB) return []
    return [
      {
        label: 'Population',
        icon: <Users size={13} />,
        valA: formatPopulation(countryA.population),
        valB: formatPopulation(countryB.population),
        winner: countryA.population > countryB.population ? 'A'
              : countryB.population > countryA.population ? 'B' : null,
      },
      {
        label: 'Area',
        icon: <Globe size={13} />,
        valA: formatArea(countryA.area),
        valB: formatArea(countryB.area),
        winner: countryA.area > countryB.area ? 'A'
              : countryB.area > countryA.area ? 'B' : null,
      },
      {
        label: 'Capital',
        icon: <MapPin size={13} />,
        valA: countryA.capital?.[0] ?? '—',
        valB: countryB.capital?.[0] ?? '—',
        winner: null,
      },
      {
        label: 'Currency',
        icon: <Landmark size={13} />,
        valA: Object.keys(countryA.currencies ?? {})[0] ?? '—',
        valB: Object.keys(countryB.currencies ?? {})[0] ?? '—',
        winner: null,
      },
      {
        label: 'Region',
        icon: <TrendingUp size={13} />,
        valA: countryA.region,
        valB: countryB.region,
        winner: null,
      },
    ]
  }, [countryA, countryB])

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontFamily: "'IBM Plex Mono', monospace",
          color: 'var(--text-3)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '32px',
          letterSpacing: '0.5px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
      >
        <ArrowLeft size={14} /> back
      </button>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '32px',
        fontWeight: 400,
        color: 'var(--text)',
        marginBottom: '28px',
      }}>
        Compare <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>countries</em>
      </h1>

      {/* Selectors */}
      {loading ? (
        <div style={{ height: '52px', borderRadius: '6px', background: 'var(--surface)', marginBottom: '24px' }} />
      ) : (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          <Selector label="Country A" value={codeA} onChange={setCodeA} countries={countries} />
          <Selector label="Country B" value={codeB} onChange={setCodeB} countries={countries} />
        </div>
      )}

      {/* Flags + weather */}
      {countryA && countryB && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
            {[countryA, countryB].map((c, i) => (
              <div key={i} style={{
                background: 'var(--surface)',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <img
                  src={c.flags?.svg ?? c.flags?.png}
                  alt={c.name.common}
                  style={{ width: '100%', height: '110px', objectFit: 'cover' }}
                />
                <div style={{ padding: '12px 14px' }}>
                  <p style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: '13px',
                    color: 'var(--text)',
                    marginBottom: '8px',
                  }}>
                    {c.name.common}
                  </p>
                  <WeatherBadge lat={c.latlng?.[0]} lng={c.latlng?.[1]} />
                </div>
              </div>
            ))}
          </div>

          {/* Comparison rows */}
          <div style={{
            background: 'var(--surface)',
            border: '0.5px solid var(--border)',
            borderRadius: '8px',
            padding: '4px 20px',
          }}>
            {rows.map((row, i) => (
              <div key={row.label} style={{
                borderBottom: i === rows.length - 1 ? 'none' : '0.5px solid var(--border)',
              }}>
                <CompareRow {...row} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {(!countryA || !countryB) && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '64px 0',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: 'var(--text-3)',
          letterSpacing: '0.5px',
        }}>
          select two countries to compare
        </div>
      )}

    </div>
  )
}