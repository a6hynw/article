import { CATEGORIES } from '@/utils/constants'
import { ArticleCard } from './ArticleCard'
import { ArrowLeft, Clock, Calendar, Share2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ArticleModal({
  article,
  recommendations,
  onBack,
  onSelectArticle,
}) {
  const category = CATEGORIES.find((c) => c.id === article.category)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to articles
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <article className="lg:col-span-2 slide-up">
          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-8">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                <span>{category?.icon}</span>
                {category?.label}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="font-medium text-accent">
                  {article.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>

              <div>
                <p className="font-medium">{article.author}</p>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.publishedAt).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.readTime} min read
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p
                key={index}
                className="text-foreground/90 leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        {/* Recommendations Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-accent rounded-full" />
              <h2 className="font-serif text-xl font-semibold">
                Recommended for you
              </h2>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Based on content similarity using TF-IDF analysis
            </p>

            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div
                  key={rec.id}
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
          </div>
        </aside>
      </div>
    </div>
  )
}

export default ArticleView