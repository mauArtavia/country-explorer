import { useState, useEffect } from "react";
import { fectchExchangeRates } from "../services/api";

export function useExchange(currencyCode) {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currencyCode) return
    setLoading(true)
    fectchExchangeRates('USD')
      .then(data => setRates(data.rates))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [currencyCode])

  return { rates, loading, error }
}