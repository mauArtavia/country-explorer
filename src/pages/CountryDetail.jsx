import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useExchange } from '../hooks/useExchange'
import { useVisited } from '../hooks/useVisited'
import { fetchCountryByCode } from '../services/api'
import { ArrowLeft, Wind, CheckCircle, Circle } from 'lucide-react'
import { CountryMap } from '../components/CountryMap'
import { BorderCountries } from '../components/BorderCountries'

function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

function formatArea(n) {
  return n ? n.toLocaleString() + ' km²' : '—'
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '0.5px solid var(--border)',
      borderRadius: '6px',
      padding: '14px 16px',
    }}>
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '9px',
        color: 'var(--text-3)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '6px',
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 500,
        fontSize: '14px',
        color: 'var(--text)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {value}
      </p>
    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '9px',
      color: 'var(--text-3)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '12px',
    }}>
      {children}
    </p>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>
      {[16, 200, 40, 20, 100, 120].map((h, i) => (
        <div key={i} style={{
          height: `${h}px`,
          borderRadius: '6px',
          background: 'var(--surface)',
          marginBottom: '16px',
          opacity: 0.6,
        }} />
      ))}
    </div>
  )
}

export function CountryDetail() {
  const { code } = useParams()
  const navigate  = useNavigate()

  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchCountryByCode(code)
      .then(setCountry)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [code])

  const lat          = country?.latlng?.[0]
  const lng          = country?.latlng?.[1]
  const currencyCode = country ? Object.keys(country.currencies ?? {})[0] : null

  const { weather, loading: wLoading } = useWeather(lat, lng)
  const { rates,   loading: eLoading } = useExchange(currencyCode)
  const { isVisited, addVisited, removeVisited } = useVisited()

  if (loading) return <LoadingSkeleton />
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-3)', fontSize: '13px' }}>
      Country not found.
    </div>
  )

  const name      = country.name.common
  const flag      = country.flags?.svg ?? country.flags?.png
  const capital   = country.capital?.[0] ?? '—'
  const region    = country.region
  const subregion = country.subregion ?? '—'
  const pop       = formatPopulation(country.population)
  const area      = formatArea(country.area)
  const currency  = currencyCode
    ? `${country.currencies[currencyCode].name} (${country.currencies[currencyCode].symbol ?? currencyCode})`
    : '—'
  const languages = country.languages ? Object.values(country.languages).join(', ') : '—'
  const visited   = isVisited(country.cca2)

  const widget = {
    background: 'var(--surface)',
    border: '0.5px solid var(--border)',
    borderRadius: '6px',
    padding: '16px',
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
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

      {/* Flag hero */}
      <div style={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: '0.5px solid var(--border)',
        marginBottom: '28px',
        height: '220px',
      }}>
        <img
          src={flag}
          alt={`Flag of ${name}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Name + region */}
      <p style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        color: 'var(--text-3)',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        marginBottom: '6px',
      }}>
        {subregion} · {region}
      </p>
      <h1 style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: '40px',
        fontWeight: 400,
        color: 'var(--text)',
        lineHeight: 1.1,
        marginBottom: '16px',
      }}>
        {name}
      </h1>

      {/* Visited button */}
      <button
        onClick={() => visited ? removeVisited(country.cca2) : addVisited(country.cca2)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '11px',
          fontFamily: "'IBM Plex Mono', monospace",
          padding: '7px 16px',
          borderRadius: '4px',
          border: visited ? '0.5px solid var(--green)' : '0.5px solid var(--border)',
          background: visited ? 'rgba(42, 107, 74, 0.12)' : 'transparent',
          color: visited ? '#4CAF82' : 'var(--text-3)',
          cursor: 'pointer',
          marginBottom: '28px',
          transition: 'all 0.15s',
          letterSpacing: '0.5px',
        }}
      >
        {visited ? <CheckCircle size={13} /> : <Circle size={13} />}
        {visited ? 'visited' : 'mark as visited'}
      </button>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
        marginBottom: '8px',
      }}>
        <StatCard label="Population" value={pop} />
        <StatCard label="Area"       value={area} />
        <StatCard label="Capital"    value={capital} />
        <StatCard label="Currency"   value={currency} />
      </div>

      {/* Languages */}
      <div style={{ ...widget, marginBottom: '8px' }}>
        <SectionLabel>Languages</SectionLabel>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: '13px',
          fontWeight: 300,
          color: 'var(--text-2)',
        }}>
          {languages}
        </p>
      </div>

      {/* Weather + Exchange */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>

        {/* Weather */}
        <div style={widget}>
          <SectionLabel>Weather now</SectionLabel>
          {wLoading ? (
            <div style={{ height: '48px', borderRadius: '4px', background: 'var(--surface2)' }} />
          ) : weather ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '8px' }}>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '42px',
                  fontWeight: 400,
                  color: 'var(--text)',
                  lineHeight: 1,
                }}>
                  {weather.temp}°
                </span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: 'var(--text-3)',
                }}>
                  C
                </span>
              </div>
              <p style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 300,
                color: 'var(--text-2)',
                marginBottom: '6px',
              }}>
                {weather.description}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: 'var(--text-3)',
              }}>
                <Wind size={11} />
                {weather.wind} km/h
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>No data</p>
          )}
        </div>

        {/* Exchange */}
        <div style={widget}>
          <SectionLabel>Exchange rates</SectionLabel>
          {eLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ height: '14px', borderRadius: '3px', background: 'var(--surface2)' }} />
              <div style={{ height: '14px', borderRadius: '3px', background: 'var(--surface2)', width: '75%' }} />
            </div>
          ) : rates && currencyCode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { from: 'USD', to: currencyCode },
                { from: 'EUR', to: currencyCode },
                { from: currencyCode, to: 'USD' },
              ]
                .filter(r => rates[r.from] && rates[r.to])
                .map(({ from, to }) => (
                  <div key={from + to} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '11px',
                      color: 'var(--text-3)',
                    }}>
                      1 {from}
                    </span>
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '12px',
                      color: 'var(--accent)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {(rates[to] / rates[from]).toFixed(4)} {to}
                    </span>
                  </div>
                ))
              }
            </div>
          ) : (
            <p style={{ fontSize: '12px', color: 'var(--text-3)' }}>No data</p>
          )}
        </div>

      </div>

      {/* Map */}
      <div style={{ ...widget, marginBottom: '8px' }}>
        <SectionLabel>Location</SectionLabel>
        <CountryMap lat={lat} lng={lng} name={name} />
      </div>

      {/* Borders */}
      <div style={widget}>
        <SectionLabel>Bordering countries</SectionLabel>
        <BorderCountries borders={country.borders} />
      </div>

    </div>
  )
}