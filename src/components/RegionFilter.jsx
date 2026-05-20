const REGIONS = ['All', 'Americas', 'Europe', 'Asia', 'Africa', 'Oceania', 'Antarctic']

export function RegionFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {REGIONS.map(region => (
        <button
          key={region}
          onClick={() => onChange(region)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors
            ${active === region
              ? 'bg-neutral-100 text-neutral-900 border-neutral-100'
              : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-neutral-300'
            }`}
        >
          {region}
        </button>
      ))}
    </div>
  )
}