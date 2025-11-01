import { useState, useEffect } from 'react'
import { SlideFrame } from '@/components/SlideFrame'
import { Slide1_OAuthConsent } from '@/slides/Slide1_OAuthConsent'
import { Slide2_AppToApp } from '@/slides/Slide2_AppToApp'

const SLIDES = [
  {
    component: Slide1_OAuthConsent,
  },
  {
    component: Slide2_AppToApp,
  },
]

/**
 * Main App component with slide navigation and keyboard controls
 */
function App() {
  const [currentSlide, setCurrentSlide] = useState(1)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys: ← / →
      if (e.key === 'ArrowLeft' && currentSlide > 1) {
        setCurrentSlide(currentSlide - 1)
      } else if (e.key === 'ArrowRight' && currentSlide < SLIDES.length) {
        setCurrentSlide(currentSlide + 1)
      }
      // Number keys: 1, 2
      else if (e.key === '1' || e.key === '2') {
        const slideNum = parseInt(e.key, 10)
        if (slideNum >= 1 && slideNum <= SLIDES.length) {
          setCurrentSlide(slideNum)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentSlide])

  const handleSlideChange = (slide: number) => {
    if (slide >= 1 && slide <= SLIDES.length) {
      setCurrentSlide(slide)
    }
  }

  const currentSlideData = SLIDES[currentSlide - 1]
  const SlideComponent = currentSlideData.component

  return (
    <SlideFrame
      currentSlide={currentSlide}
      totalSlides={SLIDES.length}
      onSlideChange={handleSlideChange}
    >
      <SlideComponent />
    </SlideFrame>
  )
}

export default App