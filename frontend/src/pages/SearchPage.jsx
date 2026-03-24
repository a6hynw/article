import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchArticles } from '@/utils/api'
import { ArticleGrid } from '@/components/ArticleGrid'
import { SearchBar } from '@/components/SearchBar'
import { ArrowLeft, Search } from 'lucide-react'

export default function SearchPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async (q) => {
    if (!q.trim()) { setArticles([]); setHasSearched(false); return }
    setQuery(q)
    setIsSearching(true)
    setHasSearched(true)
    try {
      const results = await searchArticles(q, 50)
      setArticles(results)
    } catch {
      setArticles([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleSelectArticle = (article) => {
    const id = article.article_id || article.id
    navigate(`/article/${id}`, { state: { article } })
  }

  return (
    <div className="min-h-screen bg-[#F0F4F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F0F4F3]/80 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 font-semibold text-[#183D3D] flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex-1 max-w-2xl">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} placeholder="Search all articles…" />
          </div>
        </div>
      </header>

      {/* Hero — only shown before first search */}
      {!hasSearched && (
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-[#5C8374]/10 flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-[#5C8374]/50" />
          </div>
          <h2 className="text-3xl font-bold text-[#183D3D] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            Search Articles
          </h2>
          <p className="text-[#183D3D]/60 max-w-sm mx-auto">
            Type a keyword, topic, or phrase to search across all articles.
          </p>
        </div>
      )}

      {/* No results */}
      {hasSearched && !isSearching && articles.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl font-semibold text-[#183D3D]">No results for "{query}"</p>
          <p className="text-[#183D3D]/60 mt-2">Try a different keyword or phrase.</p>
        </div>
      )}

      {/* Results grid */}
      {(isSearching || articles.length > 0) && (
        <ArticleGrid
          articles={articles}
          onSelectArticle={handleSelectArticle}
          loading={isSearching}
          highlightQuery={query}
        />
      )}
    </div>
  )
}
