import { useState, useMemo } from 'react'
import { useCountry } from '../hooks/useCountry'
import { useWeather } from '../hooks/useWeather'
import { ArrowLeft, Users, Globe, MapPin, Landmark, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n?.toString() ?? '—'
}

function formatArea(n) {
  return n ? n.toLocaleString() + ' km²' : '—'
}

function Selector({ label, value, onChange, countries }) {
  return (
    <div className="flex-1">
      <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl
                   px-4 py-3 text-sm text-neutral-100
                   focus:outline-none focus:border-neutral-600 transition-colors"
      >
        <option value="">Select a country…</option>
        {countries
          .slice()
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map(c => (
            <option key={c.cca2} value={c.cca2}>{c.name.common}</option>
          ))
        }
      </select>
    </div>
  )
}

function WeatherBadge({ lat, lng }) {
  const { weather, loading } = useWeather(lat, lng)
  if (loading) return <span className="text-neutral-600 text-sm">Loading…</span>
  if (!weather) return <span className="text-neutral-600 text-sm">—</span>
  return (
    <div>
      <span className="text-2xl font-light text-neutral-100">{weather.temp}°C</span>
      <p className="text-xs text-neutral-500 mt-0.5">{weather.description}</p>
    </div>
  )
}

function CompareRow({ label, icon, valA, valB, winner }) {
  return (
    <div className="grid grid-cols-3 items-center gap-4 py-3
                    border-b border-neutral-800 last:border-0">
      <div className={`text-sm text-right pr-2 font-medium
        ${winner === 'A' ? 'text-neutral-100' : 'text-neutral-500'}`}>
        {valA}
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-neutral-600">{icon}</div>
        <span className="text-xs text-neutral-600 text-center">{label}</span>
      </div>
      <div className={`text-sm text-left pl-2 font-medium
        ${winner === 'B' ? 'text-neutral-100' : 'text-neutral-500'}`}>
        {valB}
      </div>
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
        icon: <Users size={14} />,
        valA: formatPopulation(countryA.population),
        valB: formatPopulation(countryB.population),
        winner: countryA.population > countryB.population ? 'A'
              : countryB.population > countryA.population ? 'B' : null
      },
      {
        label: 'Area',
        icon: <Globe size={14} />,
        valA: formatArea(countryA.area),
        valB: formatArea(countryB.area),
        winner: countryA.area > countryB.area ? 'A'
              : countryB.area > countryA.area ? 'B' : null
      },
      {
        label: 'Capital',
        icon: <MapPin size={14} />,
        valA: countryA.capital?.[0] ?? '—',
        valB: countryB.capital?.[0] ?? '—',
        winner: null
      },
      {
        label: 'Currency',
        icon: <Landmark size={14} />,
        valA: Object.keys(countryA.currencies ?? {})[0] ?? '—',
        valB: Object.keys(countryB.currencies ?? {})[0] ?? '—',
        winner: null
      },
      {
        label: 'Region',
        icon: <TrendingUp size={14} />,
        valA: countryA.region,
        valB: countryB.region,
        winner: null
      },
    ]
  }, [countryA, countryB])

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-neutral-500
                   hover:text-neutral-300 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <h1 className="text-2xl font-medium text-neutral-100 mb-8">Compare countries</h1>

      {/* Selectors */}
      {loading ? (
        <div className="h-12 rounded-xl bg-neutral-900 animate-pulse mb-6" />
      ) : (
        <div className="flex gap-4 mb-8">
          <Selector label="Country A" value={codeA} onChange={setCodeA} countries={countries} />
          <Selector label="Country B" value={codeB} onChange={setCodeB} countries={countries} />
        </div>
      )}

      {/* Flags preview */}
      {countryA && countryB && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[countryA, countryB].map((c, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-neutral-800">
                <img
                  src={c.flags?.svg ?? c.flags?.png}
                  alt={c.name.common}
                  className="w-full h-28 object-cover"
                />
                <div className="px-4 py-3 bg-neutral-900">
                  <p className="text-sm font-medium text-neutral-100">{c.name.common}</p>
                  <div className="mt-1">
                    <WeatherBadge lat={c.latlng?.[0]} lng={c.latlng?.[1]} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-2">
            {rows.map(row => (
              <CompareRow key={row.label} {...row} />
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {(!countryA || !countryB) && !loading && (
        <div className="text-center py-16 text-neutral-600 text-sm">
          Select two countries to compare them
        </div>
      )}

    </div>
  )
}