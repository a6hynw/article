import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from 'lucide-react'
import { Button } from './ui/button'
import { ArticleCard } from './ArticleCard'

export function ArticleView({ article, recommendations, onBack, onSelectArticle }) {
  if (!article) return null

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
  const readTime = article.readTime || Math.ceil((content.length || 0) / 200)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent/10 transition-all duration-300 font-semibold text-accent"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-accent/10 transition-all duration-300">
              <Bookmark className="w-5 h-5 text-foreground hover:text-accent" />
            </button>
            <button className="p-2 rounded-lg hover:bg-accent/10 transition-all duration-300">
              <Share2 className="w-5 h-5 text-foreground hover:text-accent" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Article */}
        <article className="mb-16 slide-up">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-10 h-96 shadow-elevated">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=800&h=400&fit=crop'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            {title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-8 border-b-2 border-border/50 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-glow">
                <span className="font-bold text-accent-foreground text-lg">
                  {author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{author}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.publishedAt || article.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg text-sm font-semibold text-foreground">
                <Clock className="w-4 h-4 text-accent" />
                {readTime} min read
              </span>
            </div>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-10 p-6 bg-accent/10 border-l-4 border-accent rounded-lg">
              <p className="font-semibold text-foreground mb-2">Summary</p>
              <p className="text-foreground/90">{summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="space-y-6 mb-12 text-lg leading-relaxed">
            <p className="text-foreground/90 first-letter:text-3xl first-letter:font-bold first-letter:text-accent first-letter:mr-2">
              {content}
            </p>
          </div>
        </article>

        {/* Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <aside className="mt-20 fade-in">
            <div className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                You might also like
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-accent to-accent/50 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendations.map((rec, idx) => (
                <div key={rec.article_id || idx} className="fade-in">
                  <ArticleCard
                    article={rec}
                    onClick={() => onSelectArticle(rec)}
                  />
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
