import { useNavigate } from 'react-router-dom'
import { useVisited } from '../hooks/useVisited'
import { useCountry } from '../hooks/useCountry'
import { ArrowLeft, Trash2, Globe } from 'lucide-react'
import { useMemo } from 'react'

export function Visited() {
  const navigate = useNavigate()
  const { visited, removeVisited } = useVisited()
  const { countries } = useCountry()

  const visitedCountries = useMemo(() => {
    return visited
      .map(code => countries.find(c => c.cca2 === code))
      .filter(Boolean)
  }, [visited, countries])

  const regions = useMemo(() =>
    new Set(visitedCountries.map(c => c.region)).size
  , [visitedCountries])

  const topRegion = useMemo(() => {
    if (!visitedCountries.length) return '—'
    const counts = visitedCountries.reduce((acc, c) => ({
      ...acc, [c.region]: (acc[c.region] ?? 0) + 1
    }), {})
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }, [visitedCountries])

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

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '32px',
          fontWeight: 400,
          color: 'var(--text)',
          lineHeight: 1.1,
        }}>
          Visited <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>countries</em>
        </h1>
        <p style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: 'var(--text-3)',
          marginTop: '8px',
          letterSpacing: '0.5px',
        }}>
          {visitedCountries.length} {visitedCountries.length === 1 ? 'country' : 'countries'}
        </p>

        {/* Stats */}
        {visitedCountries.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            marginTop: '20px',
          }}>
            {[
              {
                label: 'of the world',
                value: `${((visitedCountries.length / 195) * 100).toFixed(1)}%`,
              },
              {
                label: 'regions covered',
                value: `${regions} / 6`,
              },
              {
                label: 'most visited',
                value: topRegion,
              },
            ].map(({ label, value }) => (
              <div key={label} style={{
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
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  fontWeight: 400,
                  color: 'var(--accent)',
                  lineHeight: 1,
                }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty state */}
      {visitedCountries.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}>
          <Globe size={28} style={{ color: 'var(--border2)' }} />
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: 'var(--text-3)',
            letterSpacing: '0.5px',
          }}>
            no visited countries yet
          </p>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 300,
            color: 'var(--text-3)',
          }}>
            open any country and mark it as visited
          </p>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {visitedCountries.map((country, i) => (
          <div
            key={country.cca2}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '6px',
              padding: '12px 14px',
            }}
          >
            {/* Index */}
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'var(--text-3)',
              minWidth: '20px',
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Flag */}
            <img
              src={country.flags?.svg ?? country.flags?.png}
              alt={country.name.common}
              style={{
                width: '48px',
                height: '32px',
                objectFit: 'cover',
                borderRadius: '3px',
                border: '0.5px solid var(--border)',
                flexShrink: 0,
              }}
            />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 500,
                fontSize: '13px',
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {country.name.common}
              </p>
              <p style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: 'var(--text-3)',
                marginTop: '2px',
              }}>
                {country.capital?.[0] ?? '—'} · {country.region}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => navigate(`/country/${country.cca2}`)}
                style={{
                  fontSize: '10px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  padding: '6px 14px',
                  borderRadius: '3px',
                  border: '0.5px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-3)',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--border2)'
                  e.currentTarget.style.color = 'var(--text-2)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-3)'
                }}
              >
                view
              </button>
              <button
                onClick={() => removeVisited(country.cca2)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-3)',
                  padding: '4px',
                  transition: 'color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#E24B4A'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}