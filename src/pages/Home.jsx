import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCountry } from '../hooks/useCountry'
import { useVisited } from '../hooks/useVisited'
import { SearchBar } from '../components/SearchBar'
import { RegionFilter } from '../components/RegionFilter'
import { CountryCard } from '../components/CountryCard'
import { GitCompare, Bookmark } from 'lucide-react'

export function Home() {
  const { countries, loading, error } = useCountry()
  const { visited } = useVisited()
  const [query, setQuery]   = useState('')
  const [region, setRegion] = useState('All')
  const navigate = useNavigate()

  const filtered = useMemo(() => {
    return countries.filter(c => {
      const matchRegion = region === 'All' || c.region === region
      const q = query.toLowerCase()
      const matchQuery =
        c.name.common.toLowerCase().includes(q) ||
        c.capital?.[0]?.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      return matchRegion && matchQuery
    })
  }, [countries, query, region])

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-3)', fontSize: '13px' }}>
      Failed to load countries. Check your connection.
    </div>
  )

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            color: 'var(--text-3)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}>
            world atlas
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            fontWeight: 400,
            color: 'var(--text)',
            lineHeight: 1,
          }}>
            Country{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Explorer</em>
          </h1>
          <p style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: 'var(--text-3)',
            marginTop: '8px',
            letterSpacing: '0.5px',
          }}>
            {loading ? 'loading…' : `${filtered.length} countries`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/visited')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '11px',
              fontFamily: "'IBM Plex Mono', monospace",
              padding: '8px 16px',
              borderRadius: '4px',
              border: '0.5px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-3)',
              cursor: 'pointer',
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
            <Bookmark size={13} />
            visited
            {visited.length > 0 && (
              <span style={{
                fontSize: '9px',
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                border: '0.5px solid rgba(193,127,60,0.3)',
                padding: '1px 6px',
                borderRadius: '2px',
                fontFamily: "'IBM Plex Mono', monospace",
              }}>
                {visited.length}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/compare')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '11px',
              fontFamily: "'IBM Plex Mono', monospace",
              padding: '8px 16px',
              borderRadius: '4px',
              border: '0.5px solid var(--accent)',
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(193,127,60,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent-dim)'}
          >
            <GitCompare size={13} />
            compare
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
        <SearchBar value={query} onChange={setQuery} onClear={() => setQuery('')} />
        <RegionFilter active={region} onChange={setRegion} />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{
              height: '200px',
              borderRadius: '8px',
              background: 'var(--surface)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {filtered.map(country => (
            <CountryCard
              key={country.cca2}
              country={country}
              onClick={() => navigate(`/country/${country.cca2}`)}
            />
          ))}
        </div>
      )}

    </div>
  )
}