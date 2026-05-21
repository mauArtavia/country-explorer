import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCountryByCode } from '../services/api'

export function BorderCountries({ borders }) {
  const navigate = useNavigate()
  const [borderData, setBorderData] = useState([])

  useEffect(() => {
    if (!borders?.length) return
    Promise.all(borders.map(code => fetchCountryByCode(code)))
      .then(setBorderData)
      .catch(() => {})
  }, [borders])

  if (!borders?.length) return (
    <p style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '11px',
      color: 'var(--text-3)',
    }}>
      no bordering countries
    </p>
  )

  if (!borderData.length) return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {borders.map(code => (
        <div key={code} style={{
          width: '60px',
          height: '24px',
          borderRadius: '3px',
          background: 'var(--surface2)',
          opacity: 0.5,
        }} />
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {borderData.map(country => (
        <button
          key={country.cca2}
          onClick={() => navigate(`/country/${country.cca2}`)}
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            padding: '5px 12px',
            borderRadius: '3px',
            border: '0.5px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text-2)',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            transition: 'all 0.15s',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-2)'
          }}
        >
          <img
            src={country.flags?.svg ?? country.flags?.png}
            alt=""
            style={{ width: '16px', height: '11px', objectFit: 'cover', borderRadius: '1px' }}
          />
          {country.name.common}
        </button>
      ))}
    </div>
  )
}