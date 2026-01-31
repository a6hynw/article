import { Newspaper , RotateCcw, Settings } from 'lucide-react'
import { Button } from './ui/button'
import { CATEGORIES } from '@/utils/constants'

export function Header({ interests, onChangeInterests, onRefresh }) {
  const selectedCategories = CATEGORIES.filter((c) => interests.includes(c.id))

  return (
    <header className="sticky top-0 z-50 bg-[#F0F4F3]/80 backdrop-blur-xl border-b border-[#5C8374]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-4 slide-down">
            <div className="p-3 bg-gradient-to-br from-[#5C8374] to-[#93B1A6] rounded-lg shadow-lg">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>
                記事 (Kiji)
              </h1>
              <p className="text-sm text-[#183D3D]/60 font-medium">
                {selectedCategories.length} interests • {selectedCategories.length === 0 ? 'All articles' : 'Personalized feed'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={onRefresh}
              variant="ghost"
              className="gap-2 text-[#183D3D] hover:bg-[#5C8374]/10 hover:text-[#5C8374] transition-all duration-300"
              title="Refresh articles"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={onChangeInterests}
              variant="outline"
              className="gap-2 text-[#183D3D] border-[#5C8374]/30 hover:bg-[#5C8374]/10 hover:border-[#5C8374] transition-all duration-300"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#5C8374]/10 to-[#93B1A6]/10 text-[#183D3D] rounded-full text-xs font-semibold border border-[#5C8374]/30 hover:border-[#5C8374] transition-all duration-300 hover:shadow-md"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className="material-icons text-sm">{cat.icon}</span>
                {cat.label}
              </span>
            ))}
          </div>
        )}
      </div>


    </header>
  )
}