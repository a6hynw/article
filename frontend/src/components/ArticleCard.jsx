import { Clock, ArrowRight, Bookmark } from 'lucide-react'
import { CATEGORIES } from '@/utils/constants'

export function ArticleCard({ article, onClick, variant = 'default' }) {
    // Get category from categories list or use article.category directly
    let category = null
    if (CATEGORIES && CATEGORIES.length > 0) {
        category = CATEGORIES.find((c) => c.id === article.category)
    }

    // Fallback for articles from backend
    const categoryLabel = category?.label || article.category || 'Article'
    const categoryIcon = category?.icon || '📄'
    const imageUrl = article.imageUrl || 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'
    const title = article.title || 'Untitled Article'
    const excerpt = article.content_preview || article.excerpt || article.content?.substring(0, 150) || 'No preview available'
    const author = article.author || 'Unknown Author'
    const readTime = article.readTime || Math.ceil((article.content?.length || 0) / 200)

    if (variant === 'compact') {
        return (
            <button
                onClick={onClick}
                className="w-full text-left p-4 rounded-lg bg-card hover:bg-secondary transition-all duration-300 group border border-border hover:border-accent/50 shadow-card"
            >
                <div className="flex gap-3">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'}
                    />

                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-accent transition-colors duration-300">
                            {title}
                        </h4>

                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="text-lg">{categoryIcon}</span>
                            <span className="font-medium">{categoryLabel}</span>
                        </div>
                    </div>
                </div>
            </button>
        )
    }

    return (
        <article
            onClick={onClick}
            className="group cursor-pointer bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated card-hover border border-border/50 hover:border-accent/30 transition-all duration-300"
        >
            <div className="relative overflow-hidden h-48">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-xs font-semibold shadow-lg">
                        <span className="text-base">{categoryIcon}</span>
                        {categoryLabel}
                    </span>
                </div>

                <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                    aria-label="Bookmark"
                >
                    <Bookmark className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 space-y-4">
                <h3 className="font-serif font-bold text-lg line-clamp-2 group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>

                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                    {excerpt}
                </p>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-medium truncate">{author}</span>

                        <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3" />
                            {readTime}m
                        </span>
                    </div>

                    <span className="flex items-center gap-1 text-accent font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                        Read
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </article>
    )
}
export default ArticleCard