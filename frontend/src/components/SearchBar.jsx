/**
 * SearchBar.jsx
 * Re-usable themed search bar — used inside ArticleView for in-article search.
 * The full-page search bar is embedded directly in Header.jsx.
 */
import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({ onSearch, isLoading, placeholder = 'Search articles…' }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') handleClear();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        {isLoading ? (
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C8374] animate-spin"
            fill="none" viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C8374]/60 pointer-events-none" />
        )}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className="
            w-full pl-9 pr-8 py-2.5 text-sm rounded-xl
            border-2 border-[#5C8374]/25 bg-white/70 backdrop-blur-sm
            text-[#183D3D] placeholder-[#183D3D]/35
            focus:outline-none focus:border-[#5C8374] focus:bg-white
            focus:shadow-[0_0_0_4px_rgba(92,131,116,0.12)]
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />

        {query && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#183D3D]/40 hover:text-[#183D3D] hover:bg-[#5C8374]/10 transition-all duration-150"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="
          px-4 py-2.5 text-sm font-semibold rounded-xl
          bg-gradient-to-br from-[#5C8374] to-[#93B1A6] text-white shadow-sm
          hover:from-[#4a6b5f] hover:to-[#7a9a8e] hover:shadow-md
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200 whitespace-nowrap flex-shrink-0
        "
      >
        {isLoading ? 'Searching…' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
