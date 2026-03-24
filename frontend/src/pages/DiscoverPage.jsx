import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllArticles } from '@/utils/api'
import { ArticleCard } from '@/components/ArticleCard'
import { CATEGORIES } from '@/utils/constants'
import { ArrowLeft, Flame, ChevronRight } from 'lucide-react'

export default function DiscoverPage() {
  const navigate = useNavigate()
  const [allArticles, setAllArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    getAllArticles(200)
      .then(data => { setAllArticles(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleSelectArticle = (article) => {
    const id = article.article_id || article.id
    navigate(`/article/${id}`, { state: { article } })
  }

  const filtered = activeCategory === 'all'
    ? allArticles
    : allArticles.filter(a => a.category === activeCategory)

  const categories = [{ id: 'all', label: 'All', icon: 'apps' }, ...CATEGORIES]

  return (
    <div className="min-h-screen bg-[#F0F4F3]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F0F4F3]/80 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#5C8374]/10 transition-all duration-300 font-semibold text-[#183D3D]"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#5C8374]" />
            <h1 className="text-xl font-bold text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>
              Discover
            </h1>
          </div>
        </div>

        {/* Category filter pills */}
        <div className="max-w-7xl mx-auto px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${activeCategory === cat.id
                  ? 'bg-[#183D3D] text-white shadow-md'
                  : 'bg-white/70 text-[#183D3D] border border-[#5C8374]/20 hover:border-[#5C8374]/50 hover:bg-white'
                }`}
            >
              <span className="material-icons text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="relative mx-auto mb-4 w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-[#5C8374]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#5C8374] animate-spin" />
          </div>
          <p className="text-[#183D3D]/70 font-medium">Loading articles…</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Category section shortcuts */}
          {activeCategory === 'all' && (
            <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/category/${cat.id}`)}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/70 border border-[#5C8374]/20 hover:border-[#5C8374]/50 hover:shadow-md transition-all duration-200 group text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-xl text-[#5C8374]">{cat.icon}</span>
                    <span className="text-sm font-semibold text-[#183D3D]">{cat.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#183D3D]/30 group-hover:text-[#5C8374] transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Article results */}
          <p className="text-sm text-[#183D3D]/50 font-medium mb-6">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'all' ? ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}` : ' total'}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold text-[#183D3D]">No articles in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, i) => (
                <div key={article.id || article.article_id || i} className="fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  <ArticleCard article={article} onClick={() => handleSelectArticle(article)} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
