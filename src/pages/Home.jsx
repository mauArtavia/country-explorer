import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCountry } from '../hooks/useCountry'
import { useVisited } from '../hooks/useVisited'
import { useDebounce } from '../hooks/useDebounce'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { useTheme } from '../hooks/useTheme'
import { SearchBar } from '../components/SearchBar'
import { RegionFilter } from '../components/RegionFilter'
import { CountryCard } from '../components/CountryCard'
import { SkeletonCard } from '../components/Skeleton'
import { GitCompare, Bookmark, Sun, Moon } from 'lucide-react'

export function Home() {
  const { countries, loading, error } = useCountry()
  const { visited } = useVisited()
  const { theme, toggle } = useTheme()
  const [query, setQuery]   = useState('')
  const [region, setRegion] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const navigate = useNavigate()

  const debouncedQuery = useDebounce(query, 200)

  const filtered = useMemo(() => {
    const result = countries.filter(c => {
      const matchRegion = region === 'All' || c.region === region
      const q = debouncedQuery.toLowerCase()
      const matchQuery =
        c.name.common.toLowerCase().includes(q) ||
        c.capital?.[0]?.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      return matchRegion && matchQuery
    })

    return result.sort((a, b) => {
      if (sortBy === 'name')       return a.name.common.localeCompare(b.name.common)
      if (sortBy === 'population') return b.population - a.population
      if (sortBy === 'area')       return (b.area ?? 0) - (a.area ?? 0)
      return 0
    })
  }, [countries, debouncedQuery, region, sortBy])

  const { visible, hasMore, loaderRef } = useInfiniteScroll(filtered, 40)

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

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={toggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '4px',
              border: '0.5px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-3)',
              cursor: 'pointer',
              transition: 'all 0.15s',
              flexShrink: 0,
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
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <RegionFilter active={region} onChange={setRegion} />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{
              background: 'var(--surface)',
              border: '0.5px solid var(--border)',
              borderRadius: '4px',
              padding: '4px 12px',
              fontSize: '10px',
              fontFamily: "'IBM Plex Mono', monospace",
              color: 'var(--text-3)',
              cursor: 'pointer',
              outline: 'none',
              flexShrink: 0,
              letterSpacing: '0.5px',
            }}
          >
            <option value="name">name A→Z</option>
            <option value="population">population</option>
            <option value="area">area</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
            {visible.map(country => (
              <CountryCard
                key={country.cca2}
                country={country}
                onClick={() => navigate(`/country/${country.cca2}`)}
              />
            ))}
          </div>
          {hasMore && (
            <div
              ref={loaderRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: '12px',
                marginTop: '12px',
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  )
}