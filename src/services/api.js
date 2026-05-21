const BASE_COUNTRIES = 'https://restcountries.com/v3.1'
const BASE_WEATHER   = 'https://api.open-meteo.com/v1'
const BASE_EXCHANGE  = 'https://api.exchangerate-api.com/v4/latest'

export async function fetchAllCountries() {
  const res = await fetch(`${BASE_COUNTRIES}/all?fields=name,flags,capital,population,area,region,subregion,currencies,latlng,cca2`)
  if (!res.ok) throw new Error('Error fetching countries')
  return res.json()
}

export async function fetchCountryByCode(code) {
  const res = await fetch(`${BASE_COUNTRIES}/alpha/${code}`)
  if (!res.ok) throw new Error('Country not found')
  const data = await res.json()
  return data[0]
}

export async function searchCountriesByName(name) {
  const res = await fetch(`${BASE_COUNTRIES}/name/${name}?fields=name,flags,capital,population,region,cca2`)
  if (!res.ok) return []
  return res.json()
}

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

export async function fetchExchangeRates(base = 'USD') {
  const res = await fetch(`${BASE_EXCHANGE}/${base}`)
  if (!res.ok) throw new Error('Error fetching exchange rates')
  return res.json()
}

export function weatherCodeToText(code) {
  if (code === 0)  return 'Clear sky'
  if (code <= 3)   return 'Partly cloudy'
  if (code <= 48)  return 'Foggy'
  if (code <= 67)  return 'Rainy'
  if (code <= 77)  return 'Snow'
  if (code <= 82)  return 'Rain showers'
  return 'Thunderstorm'
}