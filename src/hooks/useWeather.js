import { useState, useEffect } from 'react'
import { fetchWeather, weatherCodeToText } from '../services/api'

export function useWeather(lat, lng) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (lat == null || lng == null) return
    setLoading(true)
    fetchWeather(lat, lng)
      .then(data => setWeather({
        temp: Math.round(data.current.temperature_2m),
        wind: Math.round(data.current.windspeed_10m),
        description: weatherCodeToText(data.current.weathercode)
      }))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [lat, lng])

  return { weather, loading, error }
}