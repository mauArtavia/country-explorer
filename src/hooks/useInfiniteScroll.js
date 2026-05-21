import { useState, useEffect, useRef } from 'react'

export function useInfiniteScroll(items, pageSize = 40) {
  const [page, setPage]     = useState(1)
  const loaderRef           = useRef(null)
  const visible             = items.slice(0, page * pageSize)
  const hasMore             = visible.length < items.length

  // reset cuando cambian los items (nuevo filtro o sort)
  useEffect(() => {
    setPage(1)
  }, [items])

  useEffect(() => {
    const el = loaderRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(p => p + 1)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore])

  return { visible, hasMore, loaderRef }
}