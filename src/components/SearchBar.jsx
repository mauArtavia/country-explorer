import { Search, X } from "lucide-react";

export function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="relative flex items-center">
      <Search
        size={18}
        className="absolute left-4 text-neutral-500 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search countries, capitals..."
        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl
                   pl-11 pr-10 py-3 text-sm text-neutral-100
                   placeholder:text-neutral-600
                   focus:outline-none focus:border-neutral-600
                   transition-colors"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-3 text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
