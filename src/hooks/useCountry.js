import { useState, useEffect, use } from "react";
import { fetchAllCountries } from "../services/api";

export function useCountry() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllCountries()
    .then(setCountries)
    .catch(setError)
    .finally(() => setLoading(false))
  }, [])

  return { countries, loading, error }
}
