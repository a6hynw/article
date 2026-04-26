import { useState, useEffect } from 'react'
import { ArrowLeft, Bookmark, BookmarkX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getArticle } from '@/utils/api'
import { ArticleCard } from '@/components/ArticleCard'

import { useBookmarks } from '@/hooks/useBookmarks'

export default function BookmarksPage() {
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const { bookmarkIds, toggleBookmark } = useBookmarks()

  useEffect(() => {
    if (bookmarkIds.length === 0) { setLoading(false); return }

    Promise.all(bookmarkIds.map(id => getArticle(id).catch(() => null)))
      .then(results => {
        setArticles(results.filter(Boolean))
        setLoading(false)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep articles list synced with bookmarkIds when items are removed
  useEffect(() => {
    setArticles(prev => prev.filter(a => bookmarkIds.includes(a.article_id || a.id)))
  }, [bookmarkIds])

  const handleRemoveBookmark = (articleId) => {
    toggleBookmark(articleId)
  }

  const handleOpenArticle = (article) => {
    navigate('/article/' + (article.article_id || article.id), { state: { article } })
  }

  return (
    <div className="min-h-screen bg-[#F0F4F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F0F4F3]/80 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate('/article')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 font-semibold text-[#183D3D]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#5C8374]" />
            <h1 className="text-xl font-bold text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>
              My Bookmarks
            </h1>
          </div>
          <span className="ml-2 px-2.5 py-0.5 bg-[#5C8374]/10 text-[#5C8374] text-sm font-semibold rounded-full">
            {articles.length || bookmarkIds.length}
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full border-4 border-[#5C8374]/20" />
              <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-t-[#5C8374] animate-spin" />
            </div>
            <p className="text-[#183D3D]/70 font-medium">Loading bookmarks…</p>
          </div>
        )}

        {!loading && bookmarkIds.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[#5C8374]/10 flex items-center justify-center mb-2">
              <Bookmark className="w-10 h-10 text-[#5C8374]/40" />
            </div>
            <h2 className="text-2xl font-bold text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>
              No bookmarks yet
            </h2>
            <p className="text-[#183D3D]/60 max-w-sm">
              Hover over any article card and click the bookmark icon, or use the bookmark button while reading an article.
            </p>
            <button
              onClick={() => navigate('/article')}
              className="mt-4 px-6 py-3 bg-[#5C8374] text-white rounded-xl font-semibold hover:bg-[#183D3D] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Browse Articles
            </button>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <>
            <p className="text-sm text-[#183D3D]/50 mb-6 font-medium">
              {articles.length} saved article{articles.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, idx) => {
                const artId = article.article_id || article.id
                return (
                  <div key={artId || idx} className="relative group/card">
                    <ArticleCard
                      article={article}
                      onClick={() => handleOpenArticle(article)}
                    />
                    {/* Remove from bookmarks overlay button */}

                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
