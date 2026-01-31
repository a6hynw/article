import { Clock, ArrowRight, Bookmark } from 'lucide-react'
import { CATEGORIES } from '@/utils/constants'

export function ArticleCard({ article, onClick, variant = 'default' }) {
    // Get category from categories list or use article.category directly
    let category = null
    if (CATEGORIES && CATEGORIES.length > 0) {
        category = CATEGORIES.find((c) => c.id === article.category)
    }

    // Fallback for articles from backend
    const getMaterialIcon = (label) => {
        const lowerLabel = (label || '').toLowerCase();
        const iconMap = {
            'tech': 'laptop',
            'technology': 'laptop',
            'business': 'trending_up',
            'health': 'favorite',
            'science': 'science',
            'entertainment': 'movie',
            'sports': 'emoji_events',
            'politics': 'account_balance',
            'travel': 'flight',
            'education': 'school',
            'food': 'restaurant',
            'lifestyle': 'nightlife',
            'finance': 'attach_money',
            'market': 'bar_chart',
            'wellness': 'spa',
            'research': 'biotech'
        };

        // Check for exact match or partial match
        for (const [key, icon] of Object.entries(iconMap)) {
            if (lowerLabel.includes(key)) return icon;
        }

        return 'article'; // Default icon
    };

    const categoryLabel = category?.label || article.category || 'Article'
    const categoryIcon = category?.icon || getMaterialIcon(categoryLabel)
    const imageUrl = article.imageUrl || 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'
    const title = article.title || 'Untitled Article'
    const excerpt = article.content_preview || article.excerpt || article.content?.substring(0, 150) || 'No preview available'
    const author = article.author || 'Unknown Author'
    const readTime = article.readTime || Math.ceil((article.content?.length || 0) / 200)

    if (variant === 'compact') {
        return (
            <button
                onClick={onClick}
                className="w-full text-left p-4 rounded-lg bg-white/70 hover:bg-white backdrop-blur-sm transition-all duration-300 group border border-[#5C8374]/20 hover:border-[#5C8374]/50 shadow-sm hover:shadow-md"
            >
                <div className="flex gap-3">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'}
                    />

                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-[#183D3D] group-hover:text-[#5C8374] transition-colors duration-300 overflow-hidden"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: '1.4em',
                                maxHeight: '2.8em'
                            }}>
                            {title}
                        </h4>

                        <div className="flex items-center gap-2 mt-2 text-xs text-[#183D3D]/60">
                            <span className="material-icons text-lg text-[#5C8374]">{categoryIcon}</span>
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
            className="group cursor-pointer bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
            <div className="relative overflow-hidden h-48">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1504711331062-f86b0b51b552?w=500&h=300&fit=crop'}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#183D3D]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#93B1A6] backdrop-blur-md rounded-full text-xs font-semibold shadow-lg text-[#040D12]">
                        <span className="material-icons text-base">{categoryIcon}</span>
                        {categoryLabel}
                    </span>
                </div>

                <button
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/95 backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#5C8374] hover:text-white text-[#183D3D]"
                    aria-label="Bookmark"
                >
                    <Bookmark className="w-4 h-4" />
                </button>
            </div>

            <div className="p-5 space-y-4">
                <h3 className="font-bold text-lg text-[#183D3D] group-hover:text-[#5C8374] transition-colors duration-300" style={{
                    fontFamily: 'Georgia, serif',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4em',
                    maxHeight: '2.8em',
                    overflow: 'hidden'
                }}>
                    {title}
                </h3>

                <p className="text-[#183D3D]/70 text-sm leading-relaxed"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.4em',
                        maxHeight: '2.8em',
                        overflow: 'hidden'
                    }}>
                    {excerpt}
                </p>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 text-xs text-[#183D3D]/60">
                        <span className="font-medium truncate">{author}</span>

                        <span className="flex items-center gap-1 bg-[#5C8374]/10 text-[#183D3D] px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 text-[#5C8374]" />
                            {readTime}m
                        </span>
                    </div>

                    <span className="flex items-center gap-1 text-[#5C8374] font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                        Read
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </article>
    )
}

export default ArticleCard