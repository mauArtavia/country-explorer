const BASE_COUNTRIES = 'https://restcountries.com/v3.1'
const BASE_WEATHER = 'https://api.open-meteo.com/v1'
const BASE_EXCHANGE = 'https://api.exchangerate-api.com/v4/latest'

// REST Countries
export async function fetchAllCountries() {
  const res = await fetch(`${BASE_COUNTRIES}/all?fields=name,flags,capital,population,area,region,subregion,currencies,latlng,cca2`)
  if (!res.ok) throw new Error('Error fetching countries')
  return res.json()
}

export async function fecthCountryByCode(code) {
  const res = await fetch(`${BASE_COUNTRIES}/alpha/${code}`)
  if (!res.ok) throw new Error('Country not found')
  const data = await res.json()
  return data[0]
}

export async function searchCountriesByName(name) {
  const res = await fetch(`${BASE_COUNTRIES}/name/${name}?fields=name, flags, capital, population, region, cca2`)
  if (!res.ok) return [0]
  return res.json()
}

// Open-Meteo (recibe lat/lng)
export async function fetchWeather(lat, lng) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lng,
    current: 'temperature_2m,weathercode,windspeed_10m',
    timezone: 'auto'
  })
  const res = await fetch(`${BASE_WEATHER}/forecast?${params}`)
  if (!res.ok) throw new Error('Error fetching weather')
  return res.json()
}

// ExchangeRate (base USD)
export async function fectchExchangeRates(base = 'USD') {
  const res = await fetch(`${BASE_EXCHANGE}/${base}`)
  if (!res.ok) throw new Error('Error fetching exchange rates')
  return res.json()
}

// Helper: convierte weathercode de Open-Meteo a texto legible
export function weatherCodeToText(code) {
  if (code === 0) return 'Clear Sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Rain showers'
  return 'Thunderstorm'
}
