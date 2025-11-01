import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface FlowArrowProps {
  fromId: string
  toId: string
  label: string
  direction?: 'horizontal' | 'vertical'
  pulse?: boolean
  animated?: boolean
  color?: 'blue' | 'green' | 'orange' | 'purple'
  className?: string
  visible?: boolean
  rotation?: number // Rotation in degrees (0-360)
}

const colorMap = {
  blue: { stroke: '#3b82f6', text: 'text-blue-700', border: 'border-blue-300' },
  green: { stroke: '#22c55e', text: 'text-green-700', border: 'border-green-300' },
  orange: { stroke: '#f97316', text: 'text-orange-700', border: 'border-orange-300' },
  purple: { stroke: '#a855f7', text: 'text-purple-700', border: 'border-purple-300' },
}

/**
 * Enhanced animated SVG arrow component for visualizing OAuth flow
 * Supports horizontal, vertical, and rotated/diagonal arrows with proper animations
 * Uses CSS transforms for rotation, ensuring animations work correctly regardless of position
 */
export function FlowArrow({
  fromId,
  toId,
  label,
  direction = 'horizontal',
  pulse = false,
  animated = false,
  color = 'blue',
  className,
  visible = true,
  rotation = 0,
}: FlowArrowProps) {
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<number>()
  const isHorizontal = direction === 'horizontal'
  const colors = colorMap[color] || colorMap.blue

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    if (animated) {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1500 // 1.5 second cycle
        setProgress(elapsed % 1)
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      setProgress(0)
    }
  }, [animated])

  // Calculate dot position along the path (always calculated as horizontal, then rotated via CSS)
  const getDotPosition = () => {
    const pathLength = 150 // Length of the path (170 - 20)
    const startX = 20
    const startY = 30
    
    if (isHorizontal) {
      const currentX = startX + progress * pathLength
      return { x: currentX, y: startY }
    } else {
      const startYVert = 20
      const currentY = startYVert + progress * pathLength
      return { x: 30, y: currentY }
    }
  }

  const dotPos = getDotPosition()
  
  // Path data - always drawn as horizontal/vertical in SVG coordinates
  const pathData = isHorizontal ? 'M 20 30 L 170 30' : 'M 30 20 L 30 170'

  if (!visible) return null

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        isHorizontal ? 'w-full h-16' : 'h-full w-16',
        className
      )}
      style={
        rotation !== 0
          ? {
              transform: `rotate(${rotation}deg)`,
              transformOrigin: 'center center',
            }
          : {}
      }
    >
      <svg
        className={cn('absolute', isHorizontal ? 'w-full h-16' : 'h-full w-16')}
        viewBox={isHorizontal ? '0 0 200 60' : '0 0 60 200'}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker
            id={`arrowhead-${fromId}-${toId}`}
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 12 6, 0 12" fill={colors.stroke} />
          </marker>
        </defs>
        <path
          d={pathData}
          stroke={colors.stroke}
          strokeWidth="4"
          fill="none"
          markerEnd={`url(#arrowhead-${fromId}-${toId})`}
          strokeDasharray={pulse ? '12,6' : 'none'}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-300',
            pulse && !animated && 'animate-pulse'
          )}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            strokeDashoffset: animated && pulse ? progress * 12 : 0,
          }}
        />
        {/* Animated dot - position calculated along path, rotates with container */}
        {animated && (
          <circle
            cx={dotPos.x}
            cy={dotPos.y}
            r="6"
            fill={colors.stroke}
            opacity="0.95"
            className="transition-all duration-75 ease-linear"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
            }}
          >
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values="5;7;5"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
      <span
        className={cn(
          'absolute z-20 px-3 py-1.5 text-xs font-bold bg-white border-2 rounded-lg shadow-lg',
          'backdrop-blur-sm whitespace-nowrap',
          isHorizontal ? 'top-0' : 'left-0',
          colors.border,
          colors.text
        )}
        style={
          rotation !== 0
            ? {
                transform: `rotate(${-rotation}deg)`,
                transformOrigin: 'center center',
              }
            : {}
        }
      >
        {label}
      </span>
    </div>
  )
}