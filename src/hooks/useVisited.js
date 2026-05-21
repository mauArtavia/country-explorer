import { useState, useEffect } from 'react'

const KEY = 'country-explorer-visited'

export function useVisited() {
  const [visited, setVisited] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) ?? []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(visited))
  }, [visited])

  function addVisited(cca2) {
    setVisited(prev => prev.includes(cca2) ? prev : [...prev, cca2])
  }

  function removeVisited(cca2) {
    setVisited(prev => prev.filter(c => c !== cca2))
  }

  function isVisited(cca2) {
    return visited.includes(cca2)
  }

  return { visited, addVisited, removeVisited, isVisited }
}