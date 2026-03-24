import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArticleView } from '@/components/ArticleView'
import { getRecommendations } from '@/utils/api'

export default function ArticleViewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const article = location.state?.article

  const [recommendations, setRecommendations] = useState([])
  const [recsLoading, setRecsLoading] = useState(false)

  // If no article in state, go back
  useEffect(() => {
    if (!article) {
      navigate(-1)
      return
    }
    setRecsLoading(true)
    getRecommendations(article.article_id || article.id, 6)
      .then(recs => { setRecommendations(recs); setRecsLoading(false) })
      .catch(() => setRecsLoading(false))
  }, [article])

  if (!article) return null

  return (
    <ArticleView
      article={article}
      recommendations={recommendations}
      recommendationsLoading={recsLoading}
      onBack={() => navigate(-1)}
      onSelectArticle={(rec) => navigate('/article/' + (rec.article_id || rec.id), { state: { article: rec } })}
    />
  )
}
