import { ArticleCard } from './ArticleCard'

export function ArticleGrid({ articles, onSelectArticle }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-xl font-semibold text-foreground">
            No articles found
          </p>
          <p className="text-muted-foreground">
            Try adjusting your interests to discover more articles
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          Recommended Articles
        </h2>
        <p className="text-muted-foreground mt-2">
          {articles.length} articles matching your interests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={article.id}
            className="fade-in"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <ArticleCard
              article={article}
              onClick={() => onSelectArticle(article)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
