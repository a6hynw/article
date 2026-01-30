import { useState } from 'react';
import { CATEGORIES } from '@/utils/constants';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#183D3D]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#5C8374]/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#183D3D] border border-[#5C8374]/40 shadow">
            <Sparkles className="w-4 h-4 text-[#93B1A6]" />
            <span className="text-xs font-medium uppercase text-[#93B1A6]">
              Personalized For You
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-[#183D3D]">
            <span className="block">What sparks your</span>
            <span className="block italic text-[#5C8374]">curiosity?</span>
          </h1>

          <p className="text-[#183D3D]/70 max-w-xl mx-auto">
            Select the topics that resonate with you, and we'll personalize your experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {CATEGORIES.map((category, index) => {
            const isSelected = selected.includes(category.id);

            return (
              <button
                key={category.id}
                onClick={() => toggleInterest(category.id)}
                style={{ animationDelay: `${index * 40}ms` }}
                className={`
                  group relative p-5 rounded-xl transition-all duration-300
                  transform hover:-translate-y-1 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-[#5C8374]
                  ${
                    isSelected
                      ? `
                        bg-gradient-to-br from-[#183D3D] via-[#5C8374] to-[#93B1A6]
                        border border-[#93B1A6]
                        shadow-[0_0_25px_rgba(147,177,166,0.6)]
                      `
                      : `
                        bg-gradient-to-br from-[#040D12] via-[#183D3D] to-[#5C8374]
                        border border-[#5C8374]/40
                        hover:border-[#93B1A6]
                        hover:shadow-lg
                      `
                  }
                `}
              >
                {/* Selected check */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center border-2 border-[#93B1A6] shadow">
                    <Check className="w-4 h-4 text-[#5C8374]" strokeWidth={3} />
                  </div>
                )}

                {/* Glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#93B1A6]/30 via-transparent to-[#5C8374]/30 blur-xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <div
                    className={`
                      w-11 h-11 rounded-lg flex items-center justify-center
                      shadow transition-all duration-300
                      ${
                        isSelected
                          ? 'bg-white text-[#183D3D]'
                          : 'bg-white/80 text-[#183D3D] group-hover:bg-white'
                      }
                    `}
                  >
                    {category.icon}
                  </div>

                  <span className="text-sm font-semibold text-white">
                    {category.label}
                  </span>

                  <span className="text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={selected.length === 0}
            onClick={handleContinue}
            className={`
              px-8 py-6 rounded-xl font-semibold transition-all
              ${
                selected.length > 0
                  ? 'bg-[#5C8374] text-white hover:bg-[#93B1A6] shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          <p className="mt-3 text-xs text-gray-500">
            You can change these later in settings
          </p>
        </div>
      </div>
    </div>
  );
}

export default InterestSelector;
