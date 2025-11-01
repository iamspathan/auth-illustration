/**
 * GridLayer - renders a subtle 16px grid pattern
 */
export function GridLayer() {
  return (
    <svg
      className="absolute inset-0 pointer-events-none z-0"
      width="1280"
      height="720"
      xmlns="http://www.w3.org/2000/svg"
      style={{ visibility: 'visible' }}
    >
      <defs>
        <pattern
          id="grid"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 16 0 L 0 0 0 16"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}