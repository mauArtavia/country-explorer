const REGIONS = ['All', 'Americas', 'Europe', 'Asia', 'Africa', 'Oceania', 'Antarctic']

export function RegionFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {REGIONS.map(region => (
        <button
          key={region}
          onClick={() => onChange(region)}
          style={{
            fontSize: '10px',
            fontFamily: "'IBM Plex Mono', monospace",
            padding: '4px 12px',
            borderRadius: '3px',
            border: active === region
              ? '0.5px solid var(--accent)'
              : '0.5px solid var(--border)',
            background: active === region
              ? 'var(--accent-dim)'
              : 'transparent',
            color: active === region
              ? 'var(--accent)'
              : 'var(--text-3)',
            cursor: 'pointer',
            letterSpacing: '0.5px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (active !== region) {
              e.currentTarget.style.borderColor = 'var(--border2)'
              e.currentTarget.style.color = 'var(--text-2)'
            }
          }}
          onMouseLeave={e => {
            if (active !== region) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-3)'
            }
          }}
        >
          {region}
        </button>
      ))}
    </div>
  )
}