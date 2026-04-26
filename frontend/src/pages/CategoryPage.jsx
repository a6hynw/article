import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticlesByCategory } from '@/utils/api'
import { ArticleGrid } from '@/components/ArticleGrid'
import { CATEGORIES } from '@/utils/constants'
import { ArrowLeft } from 'lucide-react'

export default function CategoryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const category = CATEGORIES.find(c => c.id === id)

  // Map URL param to backend category value (handles legacy URLs like /category/sports)
  const CATEGORY_BACKEND_MAP = {
    'sports': 'sport',
    'technology': 'tech',
  }

  useEffect(() => {
    if (!id) { navigate('/'); return }
    setLoading(true)
    const backendId = CATEGORY_BACKEND_MAP[id] || id
    getArticlesByCategory(backendId, 100)
      .then(data => { setArticles(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleSelectArticle = (article) => {
    const artId = article.article_id || article.id
    navigate(`/article/${artId}`, { state: { article } })
  }

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
          <div className="flex items-center gap-3">
            {category && (
              <div className="w-9 h-9 rounded-lg bg-[#5C8374]/15 flex items-center justify-center">
                <span className="material-icons text-xl text-[#5C8374]">{category.icon}</span>
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>
                {category?.label || id}
              </h1>
              {category && (
                <p className="text-xs text-[#183D3D]/50">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <ArticleGrid
        articles={articles}
        onSelectArticle={handleSelectArticle}
        loading={loading}
      />
    </div>
  )
}
