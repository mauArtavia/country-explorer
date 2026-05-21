import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useExchange } from '../hooks/useExchange'
import { fetchCountryByCode } from '../services/api'
import { ArrowLeft, Wind, Thermometer, Globe, Users, MapPin, Landmark } from 'lucide-react'

function formatPopulation(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

function formatArea(n) {
  return n?.toLocaleString() + ' km²'
}

export function CountryDetail() {
  const { code } = useParams()
  const navigate  = useNavigate()

  const [country, setCountry]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

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

  if (loading) return <LoadingSkeleton />
  if (error)   return (
    <div className="flex items-center justify-center min-h-screen text-neutral-500">
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

  // Tasas relevantes vs la moneda del país
  const targetRate = rates && currencyCode ? rates[currencyCode] : null
  const usdRate    = targetRate ? (1 / targetRate * rates['USD']).toFixed(4) : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300
                   transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden border border-neutral-800 mb-6">
        <img
          src={flag}
          alt={`Flag of ${name}`}
          className="w-full h-52 object-cover"
        />
      </div>

      {/* Name + region */}
      <h1 className="text-3xl font-medium text-neutral-100 mb-1">{name}</h1>
      <p className="text-neutral-500 text-sm mb-8">{subregion} · {region}</p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<Users size={14} />}      label="Population" value={pop} />
        <StatCard icon={<Globe size={14} />}       label="Area"       value={area} />
        <StatCard icon={<MapPin size={14} />}      label="Capital"    value={capital} />
        <StatCard icon={<Landmark size={14} />}    label="Currency"   value={currency} />
      </div>

      {/* Languages */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 mb-4">
        <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Languages</p>
        <p className="text-sm text-neutral-200">{languages}</p>
      </div>

      {/* Weather + Exchange row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Weather */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Weather now</p>
          {wLoading ? (
            <div className="h-12 rounded-lg bg-neutral-800 animate-pulse" />
          ) : weather ? (
            <div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-light text-neutral-100">{weather.temp}°C</span>
                <span className="text-sm text-neutral-400 mb-1">{weather.description}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Wind size={12} />
                <span>{weather.wind} km/h wind</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No weather data</p>
          )}
        </div>

        {/* Exchange */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Exchange rates</p>
          {eLoading ? (
            <div className="space-y-2">
              <div className="h-4 rounded bg-neutral-800 animate-pulse" />
              <div className="h-4 rounded bg-neutral-800 animate-pulse w-3/4" />
            </div>
          ) : rates && currencyCode ? (
            <div className="space-y-2">
              {[
                { from: 'USD', to: currencyCode },
                { from: 'EUR', to: currencyCode },
                { from: currencyCode, to: 'USD' },
              ]
                .filter(r => rates[r.from] && rates[r.to])
                .map(({ from, to }) => (
                  <div key={from+to} className="flex justify-between text-sm">
                    <span className="text-neutral-400">1 {from}</span>
                    <span className="text-neutral-200 tabular-nums">
                      {(rates[to] / rates[from]).toFixed(4)} {to}
                    </span>
                  </div>
                ))
              }
            </div>
          ) : (
            <p className="text-sm text-neutral-600">No exchange data</p>
          )}
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
        {icon}
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-medium text-neutral-100 truncate">{value}</p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-4 animate-pulse">
      <div className="h-4 w-16 rounded bg-neutral-800" />
      <div className="h-52 rounded-2xl bg-neutral-800" />
      <div className="h-8 w-48 rounded bg-neutral-800" />
      <div className="h-4 w-32 rounded bg-neutral-800" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({length:4}).map((_,i) => (
          <div key={i} className="h-16 rounded-2xl bg-neutral-800" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 rounded-2xl bg-neutral-800" />
        <div className="h-32 rounded-2xl bg-neutral-800" />
      </div>
    </div>
  )
}