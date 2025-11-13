import { useEffect, useState } from 'react'
import { useStage } from '@/stage/Stage'
import { ValidationIndicator } from './ValidationIndicator'

interface ValidationIndicatorPositionedProps {
  isValidated: boolean
  nodeId: string
  position?: 'top' | 'right' | 'bottom' | 'left'
  validatingText?: string
  validatedText?: string
  validatingSubtext?: string
  validatedSubtext?: string
}

export function ValidationIndicatorPositioned({
  isValidated,
  nodeId,
  position = 'top',
  validatingText,
  validatedText,
  validatingSubtext,
  validatedSubtext,
}: ValidationIndicatorPositionedProps) {
  const { nodeRefs, scale } = useStage()
  const [pos, setPos] = useState({ left: 0, top: 0 })
  const [transform, setTransform] = useState('translate(-50%, -100%)')

  useEffect(() => {
    const updatePosition = () => {
      const nodeRef = nodeRefs.get(nodeId)
      if (nodeRef?.current) {
        const rect = nodeRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const rightX = rect.right
        const topY = rect.top
        const bottomY = rect.bottom
        const leftX = rect.left
        
        let newPos = { left: 0, top: 0 }
        let newTransform = ''
        
        switch (position) {
          case 'top':
            newPos = { left: centerX, top: topY - 20 }
            newTransform = 'translate(-50%, -100%)'
            break
          case 'right':
            newPos = { left: rightX + 20, top: centerY }
            newTransform = 'translate(0, -50%)'
            break
          case 'bottom':
            newPos = { left: centerX, top: bottomY + 20 }
            newTransform = 'translate(-50%, 0)'
            break
          case 'left':
            newPos = { left: leftX - 20, top: centerY }
            newTransform = 'translate(-100%, -50%)'
            break
        }
        
        setPos(newPos)
        setTransform(newTransform)
      }
    }

    // Update position initially and on resize
    updatePosition()
    const timer = setInterval(updatePosition, 100) // Poll for position updates

    return () => clearInterval(timer)
  }, [nodeId, nodeRefs, scale, position])

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${pos.left}px`,
        top: `${pos.top}px`,
        transform: transform,
      }}
    >
      <ValidationIndicator
        isValidated={isValidated}
        validatingText={validatingText}
        validatedText={validatedText}
        validatingSubtext={validatingSubtext}
        validatedSubtext={validatedSubtext}
      />
    </div>
  )
}
