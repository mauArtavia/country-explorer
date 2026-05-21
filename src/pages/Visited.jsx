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

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-neutral-500
                   hover:text-neutral-300 transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium text-neutral-100">Visited</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {visitedCountries.length} {visitedCountries.length === 1 ? 'country' : 'countries'}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {visitedCountries.length === 0 && (
        <div className="text-center py-20">
          <Globe size={32} className="text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-600 text-sm">No visited countries yet.</p>
          <p className="text-neutral-700 text-xs mt-1">
            Open any country and mark it as visited.
          </p>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {visitedCountries.map(country => (
          <div
            key={country.cca2}
            className="flex items-center gap-4 bg-neutral-900 border border-neutral-800
                       rounded-2xl px-4 py-3 group"
          >
            <img
              src={country.flags?.svg ?? country.flags?.png}
              alt={country.name.common}
              className="w-12 h-8 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-100 truncate">
                {country.name.common}
              </p>
              <p className="text-xs text-neutral-500">
                {country.capital?.[0] ?? '—'} · {country.region}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/country/${country.cca2}`)}
                className="text-xs text-neutral-600 hover:text-neutral-300
                           transition-colors px-3 py-1.5 rounded-lg
                           border border-neutral-800 hover:border-neutral-600"
              >
                View
              </button>
              <button
                onClick={() => removeVisited(country.cca2)}
                className="text-neutral-700 hover:text-red-400 transition-colors p-1.5"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}