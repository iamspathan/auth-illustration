import { cn } from '@/lib/utils'

interface StepperProps {
  currentSlide: number
  totalSlides: number
  onSlideChange: (slide: number) => void
}

/**
 * Progress stepper showing slide navigation - monochrome theme
 */
export function Stepper({ currentSlide, totalSlides, onSlideChange }: StepperProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideNum) => (
        <button
          key={slideNum}
          onClick={() => onSlideChange(slideNum)}
          className={cn(
            'flex items-center gap-2 transition-all',
            'focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 rounded'
          )}
          aria-label={`Go to slide ${slideNum}`}
        >
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all',
              currentSlide === slideNum
                ? 'bg-neutral-800 text-neutral-100 scale-110 border-2 border-neutral-600'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300'
            )}
          >
            {slideNum}
          </div>
        </button>
      ))}
    </div>
  )
}