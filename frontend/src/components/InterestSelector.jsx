import { useState } from 'react';
import { CATEGORIES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import './InterestSelector.css';

export function InterestSelector({ onComplete }) {
  const [selected, setSelected] = useState([]);

  const toggleInterest = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length > 0) {
      onComplete(selected);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F3] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5C8374]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#93B1A6]/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5C8374]/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #183D3D 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 container max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-14 space-y-6 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#5C8374]/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#5C8374]" />
            <span className="text-xs font-medium tracking-widest text-[#183D3D]/70 uppercase">
              Personalized For You
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            <span className="block text-[#183D3D]" style={{ fontFamily: 'Georgia, serif' }}>What sparks your</span>
            <span className="block text-[#5C8374] italic" style={{ fontFamily: 'Georgia, serif' }}>curiosity?</span>
          </h1>

          <div className="flex items-center justify-center gap-2 py-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#5C8374]/30 to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#5C8374]/40" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#5C8374]/30 to-transparent" />
          </div>

          <p className="text-base sm:text-lg text-[#183D3D]/60 max-w-xl mx-auto leading-relaxed font-light">
            Select the topics that resonate with you, and we'll craft a personalized experience just for you.
          </p>
        </div>

        {/* Cards Grid - Clean Design */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-12">
          {CATEGORIES.map((category, index) => {
            const isSelected = selected.includes(category.id);

            return (
              <button
                key={category.id}
                onClick={() => toggleInterest(category.id)}
                className={`
                  group relative p-5 sm:p-6 rounded-xl border-2 transition-all duration-300
                  transform hover:-translate-y-1 active:scale-[0.98]
                  animate-fade-in-up focus:outline-none focus:ring-2 focus:ring-[#5C8374]/50 focus:ring-offset-2
                  ${isSelected
                    ? 'bg-[#183D3D] border-[#183D3D] shadow-[0_10px_40px_-10px_rgba(24,61,61,0.4)]'
                    : 'bg-white/60 backdrop-blur-sm border-[#5C8374]/20 hover:border-[#5C8374]/40 hover:shadow-[0_8px_24px_-8px_rgba(92,131,116,0.15)]'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Check Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#F0F4F3] rounded-full flex items-center justify-center shadow-lg border-2 border-[#93B1A6] animate-scale-in z-20">
                    <Check className="w-4 h-4 text-[#183D3D]" strokeWidth={3} />
                  </div>
                )}

                {/* Hover gradient overlay */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  ${isSelected ? '' : 'bg-gradient-to-br from-[#5C8374]/5 to-[#93B1A6]/5'}
                `} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  {/* Icon Container */}
                  <div className={`
                    w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isSelected
                      ? 'bg-white/20 text-[#93B1A6]'
                      : 'bg-[#F0F4F3] text-[#183D3D] group-hover:bg-[#5C8374]/10 group-hover:text-[#5C8374]'
                    }
                  `}>
                    <span className="material-icons text-2xl">{category.icon}</span>
                  </div>

                  {/* Label */}
                  <span className={`
                    font-semibold text-sm transition-colors duration-300
                    ${isSelected ? 'text-white' : 'text-[#183D3D]'}
                  `} style={{ fontFamily: 'Georgia, serif' }}>
                    {category.label}
                  </span>

                  {/* Description */}
                  <span className={`
                    text-xs leading-snug transition-all duration-300
                    ${isSelected
                      ? 'text-[#93B1A6]/80'
                      : 'text-[#183D3D]/50 opacity-0 group-hover:opacity-100'
                    }
                  `}>
                    {category.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected count indicator */}
        <div className={`
          text-center mb-8 transition-all duration-500 transform
          ${selected.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}>
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#5C8374]/20 shadow-sm">
            <div className="flex -space-x-1">
              {[...Array(Math.min(selected.length, 3))].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-[#5C8374] border-2 border-[#F0F4F3]" />
              ))}
            </div>
            <span className="text-sm font-medium text-[#183D3D]">
              {selected.length} {selected.length === 1 ? 'topic' : 'topics'} selected
            </span>
          </div>
        </div>

        {/* Continue button */}
        <div className="text-center space-y-4">
          <Button
            onClick={handleContinue}
            disabled={selected.length === 0}
            className={`
              group px-8 py-6 text-base font-semibold rounded-xl
              transition-all duration-300 transform
              ${selected.length > 0
                ? 'bg-[#183D3D] hover:bg-[#132F2F] text-white shadow-[0_10px_40px_-10px_rgba(24,61,61,0.4)] hover:-translate-y-0.5'
                : 'bg-[#E6EBE9] text-[#183D3D]/40 cursor-not-allowed'
              }
            `}
          >
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${selected.length > 0 ? 'group-hover:translate-x-1' : ''}`} />
            </span>
          </Button>

          <p className="text-xs text-[#183D3D]/50 font-medium">
            You can always change these later in settings
          </p>
        </div>
      </div>

    </div>
  );
}