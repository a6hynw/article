import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArticleView } from '@/components/ArticleView'
import { getRecommendations, getArticle } from '@/utils/api'

export default function ArticleViewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  
  const article = location.state?.article
  const [fetchedArticle, setFetchedArticle] = useState(null)
  const [loading, setLoading] = useState(!article)
  
  const [recommendations, setRecommendations] = useState([])
  const [recsLoading, setRecsLoading] = useState(false)

  const currentArticle = article || fetchedArticle

  useEffect(() => {
    if (!currentArticle) {
      getArticle(id).then(data => {
        if (data && !data.error) {
          setFetchedArticle(data)
          setLoading(false)
        } else {
          navigate('/article')
        }
      }).catch(() => navigate('/article'))
      return
    }

    setRecsLoading(true)
    getRecommendations(currentArticle.article_id || currentArticle.id, 6)
      .then(recs => { setRecommendations(recs); setRecsLoading(false) })
      .catch(() => setRecsLoading(false))
  }, [currentArticle, id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F4F3] flex items-center justify-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#5C8374]/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#5C8374] animate-spin" />
        </div>
      </div>
    )
  }

  if (!currentArticle) return null

  return (
    <ArticleView
      article={currentArticle}
      recommendations={recommendations}
      recommendationsLoading={recsLoading}
      onBack={() => navigate(-1)}
      onSelectArticle={(rec) => navigate('/article/' + (rec.article_id || rec.id), { state: { article: rec } })}
    />
  )
}
