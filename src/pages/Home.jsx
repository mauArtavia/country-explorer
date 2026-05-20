import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCountry } from '../hooks/useCountry'
import { SearchBar } from '../components/SearchBar'
import { RegionFilter } from '../components/RegionFilter'
import { CountryCard } from '../components/CountryCard'
import { Globe } from 'lucide-react'

export function Home() {
  const { countries, loading, error } = useCountry()
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
    <div className="flex items-center justify-center min-h-screen text-neutral-500">
      Failed to load countries. Check your connection.
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Globe size={28} className="text-neutral-400" />
        <div>
          <h1 className="text-2xl font-medium text-neutral-100 leading-none">
            Country Explorer
          </h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {loading ? 'Loading…' : `${filtered.length} countries`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 mb-8">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
        <RegionFilter active={region} onChange={setRegion} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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