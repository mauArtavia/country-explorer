import { useState } from 'react'

function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export function CountryCard({ country, onClick }) {
  const [hovered, setHovered] = useState(false)
  const name    = country.name.common
  const flag    = country.flags?.svg ?? country.flags?.png
  const capital = country.capital?.[0] ?? '—'
  const pop     = formatPopulation(country.population)
  const region  = country.region

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        background: hovered ? 'var(--surface2)' : 'var(--surface)',
        border: hovered
          ? '0.5px solid var(--border2)'
          : '0.5px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {/* Flag */}
      <div style={{ height: '120px', overflow: 'hidden', background: 'var(--surface2)' }}>
        <img
          src={flag}
          alt={`Flag of ${name}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.3s',
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '12px' }}>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 500,
          fontSize: '13px',
          color: 'var(--text)',
          marginBottom: '4px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {name}
        </p>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: 'var(--text-3)',
          marginBottom: '8px',
        }}>
          {capital}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: 'var(--accent)',
            border: '0.5px solid rgba(193, 127, 60, 0.3)',
            padding: '2px 7px',
            borderRadius: '3px',
          }}>
            {region}
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: 'var(--text-3)',
          }}>
            {pop}
          </span>
        </div>
      </div>
    </button>
  )
}