import { Sparkles, RotateCcw, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { CATEGORIES } from '@/utils/constants'

export function Header({ interests, onChangeInterests, onRefresh }) {
  const selectedCategories = CATEGORIES.filter((c) => interests.includes(c.id))

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-card">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-4 slide-down">
            <div className="p-3 bg-gradient-to-br from-accent to-accent/80 rounded-lg shadow-glow">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Article Discovery
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                {selectedCategories.length} interests • {selectedCategories.length === 0 ? 'All articles' : 'Personalized feed'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onRefresh}
              variant="ghost"
              className="gap-2 hover:bg-accent/10 hover:text-accent transition-all duration-300"
              title="Refresh articles"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={onChangeInterests}
              variant="outline"
              className="gap-2 hover:bg-accent/10 hover:border-accent transition-all duration-300"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Change Interests</span>
              <span className="sm:hidden">Interests</span>
            </Button>
          </div>
        </div>

        {/* Selected interests display */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 fade-in">
            {selectedCategories.map((cat, idx) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-accent/10 to-accent/5 text-accent-foreground rounded-full text-xs font-semibold border border-accent/30 hover:border-accent/60 transition-all duration-300 hover:shadow-glow"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="text-sm">{cat.icon}</span>
                {cat.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
