import { Loader2, CheckCircle, ShieldCheck } from 'lucide-react'

interface ValidationIndicatorProps {
  isValidated: boolean
  validatingText?: string
  validatedText?: string
  validatingSubtext?: string
  validatedSubtext?: string
}

export function ValidationIndicator({
  isValidated,
  validatingText = 'Validating Identity',
  validatedText = 'Identity Validated',
  validatingSubtext = 'Checking credentials...',
  validatedSubtext = 'Credentials verified ✓',
}: ValidationIndicatorProps) {
  return (
    <div className="relative">
      {!isValidated ? (
        // Validating state - spinning loader
        <div className="flex flex-col items-center gap-3 animate-in fade-in duration-500">
          <div className="flex items-center gap-3 bg-blue-600/95 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-blue-400">
            <Loader2 className="h-6 w-6 animate-spin" />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{validatingText}</span>
              <span className="text-xs text-blue-100">{validatingSubtext}</span>
            </div>
            <ShieldCheck className="h-6 w-6 opacity-70" />
          </div>
          {/* Animated pulse circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-24 h-24 rounded-full bg-blue-500/30 animate-ping" style={{ animationDuration: '2s' }}></div>
          </div>
        </div>
      ) : (
        // Validated state - checkmark
        <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-500">
          <div className="flex items-center gap-3 bg-green-600/95 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-green-400">
            <CheckCircle className="h-7 w-7" />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{validatedText}</span>
              <span className="text-xs text-green-100">{validatedSubtext}</span>
            </div>
          </div>
          {/* Success pulse effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-20 h-20 rounded-full bg-green-500/40 animate-pulse" style={{ animationDuration: '1s' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}
