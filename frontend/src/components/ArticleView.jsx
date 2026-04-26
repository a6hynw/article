import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, BookmarkCheck, Check } from 'lucide-react'
import { Button } from './ui/button'
import { ArticleCard } from './ArticleCard'
import { CATEGORIES } from '@/utils/constants'
import { useBookmarks } from '@/hooks/useBookmarks'


export function ArticleView({ article, recommendations, recommendationsLoading, onBack, onSelectArticle }) {
  // Hooks MUST be called before any returns
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const [copied, setCopied] = useState(false)

  // Sync bookmark state when article changes
  const [bookmarked, setBookmarked] = useState(() => {
    const articleId = article?.article_id || article?.id
    return articleId ? isBookmarked(articleId) : false
  })

  useEffect(() => {
    if (article) {
      const articleId = article.article_id || article.id
      setBookmarked(isBookmarked(articleId))
    }
  }, [article, isBookmarked])

  if (!article) return null

  const articleId = article.article_id || article.id

  const handleBookmark = () => {
    toggleBookmark(articleId)
    setBookmarked(!bookmarked)
  }

  const handleShare = async () => {
    const shareData = {
      title: article.title || 'Article',
      text: article.summary || article.excerpt || '',
      url: window.location.href,
    }
    if (navigator.share) {
      try { await navigator.share(shareData) } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // final fallback: select a temporary input
        const el = document.createElement('input')
        el.value = window.location.href
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  const CATEGORY_ID_MAP = { 'sports': 'sport', 'technology': 'tech' }
  const categoryId = CATEGORY_ID_MAP[article.category] || article.category
  const category = CATEGORIES.find((c) => c.id === categoryId)

  const formatDate = (date) => {
    if (!date) return new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const title = article.title || 'Untitled'
  const content = article.content || 'No content available'
  const author = article.author || 'Unknown Author'
  const imageUrl = article.imageUrl || 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=800&h=400&fit=crop'
  const summary = article.summary || ''
  const readTime = article.readTime || Math.max(1, Math.ceil((content.split(/\s+/).length || 0) / 200))

  return (
    <div className="min-h-screen bg-[#F0F4F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F0F4F3]/80 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 font-semibold text-[#183D3D]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleBookmark}
              title={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
              className={`p-2 rounded-lg transition-all duration-300 ${bookmarked
                ? 'bg-[#5C8374] text-white hover:bg-[#183D3D]'
                : 'hover:bg-[#5C8374]/10 text-[#183D3D] hover:text-[#5C8374]'
                }`}
            >
              {bookmarked
                ? <BookmarkCheck className="w-5 h-5" />
                : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              onClick={handleShare}
              title="Share article"
              className="p-2 rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 text-[#183D3D] hover:text-[#5C8374] relative"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            {copied && (
              <span className="absolute right-0 top-10 whitespace-nowrap bg-[#183D3D] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg z-10">
                Link copied!
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Article */}
        <article className="lg:col-span-2 slide-up">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg h-64 md:h-96">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=800&h=400&fit=crop'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#183D3D]/60 via-transparent to-transparent" />
            {category && (
              <div className="absolute bottom-6 left-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#93B1A6] text-[#040D12] rounded-full text-sm font-semibold shadow-lg">
                  <span className="material-icons text-sm">{category.icon}</span>
                  {category.label}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#183D3D] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b-2 border-[#5C8374]/30 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#5C8374] to-[#93B1A6] flex items-center justify-center shadow-lg">
                <span className="font-bold text-white text-lg">
                  {author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-[#183D3D] text-lg">{author}</p>
                <p className="text-sm text-[#183D3D]/60 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt || article.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="flex items-center gap-2 bg-white/70 border border-[#5C8374]/20 px-4 py-2 rounded-lg text-sm font-semibold text-[#183D3D]">
                <Clock className="w-4 h-4 text-[#5C8374]" />
                {readTime} min read
              </span>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-10 p-6 bg-gradient-to-br from-[#5C8374]/10 to-[#93B1A6]/10 border-l-4 border-[#5C8374] rounded-lg">
              <p className="font-semibold text-[#183D3D] mb-2">Summary</p>
              <p className="text-[#183D3D]/80 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="space-y-6 mb-12 text-lg leading-relaxed">
            <p className="text-[#183D3D]/80 first-letter:text-5xl first-letter:font-bold first-letter:text-[#5C8374] first-letter:mr-2 first-letter:float-left first-letter:leading-[1]" style={{ fontFamily: 'Georgia, serif' }}>
              {content}
            </p>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[#5C8374]/20">
              <h3 className="text-sm font-semibold text-[#183D3D]/70 mb-3 uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/70 text-[#183D3D] rounded-full text-sm font-medium border border-[#5C8374]/20 hover:border-[#5C8374]/40 hover:bg-white transition-all duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Recommendations Sidebar */}
        {(recommendationsLoading || (recommendations && recommendations.length > 0)) && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[#5C8374]/20 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-[#5C8374] to-[#93B1A6] rounded-full" />
                <h2 className="text-xl font-bold text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>
                  Recommended for you
                </h2>
              </div>

              

              {/* Loading skeleton */}
              {recommendationsLoading && (
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-white/50">
                      <div className="w-16 h-16 rounded-lg bg-[#5C8374]/10 animate-pulse flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 bg-[#5C8374]/10 rounded animate-pulse w-full" />
                        <div className="h-3 bg-[#5C8374]/10 rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-[#5C8374]/10 rounded animate-pulse w-1/2 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actual recommendation cards */}
              {!recommendationsLoading && (
                <div className="space-y-3">
                  {recommendations.slice(0, 4).map((rec, index) => (
                    <div
                      key={rec.id || rec.article_id || index}
                      className="fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ArticleCard
                        article={rec}
                        onClick={() => onSelectArticle(rec)}
                        variant="compact"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category info card */}
            {category && (
              <div className="bg-gradient-to-br from-[#183D3D] to-[#0a2626] rounded-xl p-6 shadow-lg border border-[#5C8374]/30">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#93B1A6]/20 flex items-center justify-center">
                    <span className="material-icons text-xl text-[#93B1A6]">{category.icon}</span>
                  </div>
                  <h3 className="font-bold text-[#93B1A6]">About this topic</h3>
                </div>
                <p className="text-sm text-[#93B1A6]/80 leading-relaxed">
                  Explore more articles in {category.label} to deepen your knowledge and stay updated.
                </p>
                <button
                  onClick={onBack}
                  className="mt-4 w-full px-4 py-2 bg-[#5C8374] hover:bg-[#4a6b5f] text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Explore {category.label}
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

    </div>
  )
}