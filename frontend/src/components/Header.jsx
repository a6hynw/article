import { useState, useRef, useEffect } from 'react'
import { Newspaper, RotateCcw, Settings, Search, X } from 'lucide-react'
import { Button } from './ui/button'
import { CATEGORIES } from '@/utils/constants'

export function Header({ interests, onChangeInterests, onRefresh, onSearch, isSearching }) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const selectedCategories = interests
    ? CATEGORIES.filter((c) => interests.includes(c.id))
    : []

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && onSearch) onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    if (onSearch) onSearch('')
    inputRef.current?.focus()
  }

  // Submit on Enter through the input directly
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e)
    if (e.key === 'Escape') handleClear()
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F0F4F3]/90 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">

        {/* ── Row 1: Logo + Search + Actions ── */}
        <div className="flex items-center gap-4 flex-wrap mb-3">

          {/* Logo */}
          <div className="flex items-center gap-3 slide-down flex-shrink-0">
            <div className="p-2.5 bg-gradient-to-br from-[#5C8374] to-[#93B1A6] rounded-lg shadow-md">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#183D3D] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                記事 (Kiji)
              </h1>
              <p className="text-xs text-[#183D3D]/50 font-medium">
                {selectedCategories.length > 0 ? 'Personalized feed' : 'All articles'}
              </p>
            </div>
          </div>

          {/* ── Search Bar ── */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 min-w-[220px] max-w-xl"
          >
            <div
              className={`
                relative flex items-center rounded-xl border-2 transition-all duration-300
                ${focused
                  ? 'border-[#5C8374] shadow-[0_0_0_4px_rgba(92,131,116,0.12)] bg-white'
                  : 'border-[#5C8374]/25 bg-white/60 hover:border-[#5C8374]/50 hover:bg-white/80'
                }
              `}
            >
              {/* Search icon / spinner */}
              <div className="pl-3.5 pr-2 flex-shrink-0">
                {isSearching ? (
                  <svg className="w-4 h-4 text-[#5C8374] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <Search className={`w-4 h-4 transition-colors duration-200 ${focused ? 'text-[#5C8374]' : 'text-[#183D3D]/40'}`} />
                )}
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search articles…"
                className="
                  flex-1 py-2.5 pr-2 text-sm bg-transparent text-[#183D3D]
                  placeholder-[#183D3D]/35 focus:outline-none
                "
              />

              {/* Clear button */}
              {query && (
                <button
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleClear() }}
                  className="mr-1 p-1 rounded-full text-[#183D3D]/40 hover:text-[#183D3D] hover:bg-[#5C8374]/10 transition-all duration-150"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Search button */}
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="
                  mx-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg
                  bg-gradient-to-br from-[#5C8374] to-[#93B1A6]
                  text-white shadow-sm
                  hover:from-[#4a6b5f] hover:to-[#7a9a8e] hover:shadow-md
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200 flex-shrink-0
                "
              >
                {isSearching ? 'Searching…' : 'Search'}
              </button>
            </div>
          </form>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              onClick={onRefresh}
              variant="ghost"
              className="gap-2 text-[#183D3D] hover:bg-[#5C8374]/10 hover:text-[#5C8374] transition-all duration-300"
              title="Refresh articles"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={onChangeInterests}
              variant="outline"
              className="gap-2 text-[#183D3D] border-[#5C8374]/30 hover:bg-[#5C8374]/10 hover:border-[#5C8374] transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Change Interests</span>
              <span className="sm:hidden">Interests</span>
            </Button>
          </div>
        </div>

        {/* ── Row 2: Interest pills ── */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 fade-in">
            {selectedCategories.map((cat, idx) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#5C8374]/10 to-[#93B1A6]/10 text-[#183D3D] rounded-full text-xs font-semibold border border-[#5C8374]/30 hover:border-[#5C8374] transition-all duration-300 hover:shadow-md"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="material-icons text-sm">{cat.icon}</span>
                {cat.label}
              </span>
            ))}
          </div>
        )}

      </div>
    </header>
  )
}