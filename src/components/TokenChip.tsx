import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface TokenChipProps {
  label: string
  scopes?: string[]
  value: string
  className?: string
}

/**
 * Visual chip for displaying OAuth tokens with copy functionality - monochrome theme
 */
export function TokenChip({ label, scopes, value, className }: TokenChipProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const truncatedValue = value.length > 40 ? `${value.substring(0, 37)}...` : value

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-xs font-medium text-neutral-400 uppercase tracking-wide">{label}</div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono text-xs px-3 py-1.5 bg-neutral-800 border-neutral-700 text-neutral-100">
          {truncatedValue}
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-neutral-800 transition-colors text-neutral-300"
                aria-label="Copy token"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-neutral-100" />
                ) : (
                  <Copy className="h-4 w-4 text-neutral-400" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-neutral-900 border-neutral-700 text-neutral-200">
              <p>{copied ? 'Copied!' : 'Copy token'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {scopes && scopes.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {scopes.map((scope) => (
            <Badge key={scope} variant="secondary" className="text-xs bg-neutral-800 border-neutral-700 text-neutral-200">
              {scope}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}