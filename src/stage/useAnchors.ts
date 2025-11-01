import { useStage } from './Stage'

interface Point {
  x: number
  y: number
}

interface Anchors {
  center: Point
  north: Point
  south: Point
  east: Point
  west: Point
}

/**
 * Hook to get anchor points for a node
 */
export function useAnchors(nodeId: string): Anchors | null {
  const { nodeRefs, scale } = useStage()
  const ref = nodeRefs.get(nodeId)

  if (!ref?.current) return null

  const rect = ref.current.getBoundingClientRect()
  const centerX = rect.left / scale + rect.width / scale / 2
  const centerY = rect.top / scale + rect.height / scale / 2
  const halfWidth = rect.width / scale / 2
  const halfHeight = rect.height / scale / 2

  return {
    center: { x: centerX, y: centerY },
    north: { x: centerX, y: centerY - halfHeight },
    south: { x: centerX, y: centerY + halfHeight },
    east: { x: centerX + halfWidth, y: centerY },
    west: { x: centerX - halfWidth, y: centerY },
  }
}
