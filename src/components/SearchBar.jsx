import { Search, X } from 'lucide-react'

export function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative flex items-center">
      <Search
        size={16}
        className="absolute left-4 pointer-events-none"
        style={{ color: 'var(--text-3)' }}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search countries, capitals, regions…"
        style={{
          width: '100%',
          background: 'var(--surface)',
          border: '0.5px solid var(--border)',
          borderRadius: '6px',
          padding: '11px 40px',
          fontSize: '13px',
          color: 'var(--text)',
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontWeight: 300,
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--border2)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 transition-colors"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-2)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}