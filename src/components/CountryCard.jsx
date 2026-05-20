import { Users, MapPin } from 'lucide-react'

function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

export function CountryCard({ country, onClick }) {
  const name     = country.name.common
  const flag     = country.flags?.svg ?? country.flags?.png
  const capital  = country.capital?.[0] ?? '—'
  const pop      = formatPopulation(country.population)
  const region   = country.region

  return (
    <button
      onClick={onClick}
      className="group w-full text-left bg-neutral-900 border border-neutral-800
                 rounded-2xl overflow-hidden
                 hover:border-neutral-600 hover:bg-neutral-800
                 transition-all duration-200"
    >
      {/* Flag */}
      <div className="h-36 overflow-hidden bg-neutral-800">
        <img
          src={flag}
          alt={`Flag of ${name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-medium text-neutral-100 text-sm mb-3 truncate">{name}</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <MapPin size={12} />
            <span className="truncate">{capital}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Users size={12} />
            <span>{pop}</span>
          </div>
        </div>
        <span className="mt-3 inline-block text-xs px-2 py-0.5 rounded-full
                         bg-neutral-800 border border-neutral-700 text-neutral-400">
          {region}
        </span>
      </div>
    </button>
  )
}