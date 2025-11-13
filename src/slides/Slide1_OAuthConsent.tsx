import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Stage } from '@/stage/Stage'
import { TokenChip } from '@/components/TokenChip'
import { LoginDialog } from '@/components/LoginDialog'
import { ValidationIndicatorPositioned } from '@/components/ValidationIndicatorPositioned'
import { makeJwt } from '@/lib/tokens'
import { Play, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react'

type FlowStep =
  | 'idle'
  | 'user_clicks_login'
  | 'auth_request'
  | 'login_shown'
  | 'idp_validates'
  | 'tokens_received'

// Step metadata for captions and sequence numbers
const stepMetadata: Record<FlowStep, { number: number; caption: string } | null> = {
  idle: null,
  user_clicks_login: {
    number: 1,
    caption: 'User clicks "Sign in" - User wants to access Google Calendar and clicks the login button to start the authentication process',
  },
  auth_request: {
    number: 2,
    caption: 'Calendar app initiates SSO - Calendar redirects to Okta with client_id, redirect_uri, and state parameters',
  },
  login_shown: {
    number: 3,
    caption: 'Okta presents login screen - User enters their username and password to authenticate with the Identity Provider',
  },
  idp_validates: {
    number: 4,
    caption: 'IDP validates user identity - Okta verifies the user credentials and validates their identity',
  },
  tokens_received: {
    number: 5,
    caption: 'Authentication complete - Calendar app receives ID token containing user identity information and can now authenticate the user',
  },
}

/**
 * Slide 1: Basic OIDC Authentication Flow
 * Full-screen Stage-based layout
 * Shows simplified login flow: SSO -> username/password -> IDP validates -> ID token
 * Each step is shown individually for presenter mode
 */
export function Slide1_OAuthConsent() {
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [idToken, setIdToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [isValidated, setIsValidated] = useState(false)

  const nodes = [
    { id: 'user', x: 64, y: 240, w: 220 },
    { id: 'calendar', x: 480, y: 240, w: 260 }, 
    { id: 'okta', x: 1000, y: 240, w: 240 }, // Increased distance for better arrow visibility
  ]

  // Calculate token positions based on node centers
  // calendar: x=400, w=260 -> center at 530, right edge at 660
  // okta: x=920, w=240 -> center at 1040, left edge at 920
  // All nodes at y=240, h≈120 -> center at y≈300

  // Each arrow is visible only at its specific step - no overlapping
  const edges = [
    {
      id: 'user-to-calendar',
      from: 'user',
      to: 'calendar',
      label: 'Clicks "Sign in"',
      color: '#3b82f6', // Bright Blue
      pulse: flowStep === 'user_clicks_login',
      visible: flowStep === 'user_clicks_login',
    },
    {
      id: 'calendar-to-okta',
      from: 'calendar',
      to: 'okta',
      label: 'SSO (OIDC)',
      color: '#60a5fa', // Blue
      pulse: flowStep === 'auth_request',
      visible: flowStep === 'auth_request', // Only visible at this step
    },
    {
      id: 'okta-to-calendar-token',
      from: 'okta',
      to: 'calendar',
      label: 'ID Token',
      color: '#ec4899', // Pink
      pulse: flowStep === 'tokens_received',
      visible: flowStep === 'tokens_received', // Only visible at this step
    },
  ]

  const handleStartOAuth = () => {
    setFlowStep('user_clicks_login')
  }

  const handleNextStep = () => {
    switch (flowStep) {
      case 'idle':
        handleStartOAuth()
        break
      case 'user_clicks_login':
        // User clicked login, now Calendar initiates SSO
        setFlowStep('auth_request')
        break
      case 'auth_request':
        // After SSO request, show login dialog
        setFlowStep('login_shown')
        setShowLoginDialog(true)
        break
      case 'login_shown':
        // Wait for user to login
        break
      case 'idp_validates':
        // IDP validates identity and returns ID token
        const newIdToken = makeJwt({
          sub: username || 'user@example.com',
          email: username || 'user@example.com',
          iss: 'https://okta.example.com',
          aud: 'google-calendar-client-id',
        })
        setIdToken(newIdToken)
        setFlowStep('tokens_received')
        break
      case 'tokens_received':
        // Already received, do nothing
        break
    }
  }

  const handlePreviousStep = () => {
    switch (flowStep) {
      case 'tokens_received':
        setIdToken(null)
        setIsValidated(true) // Show validated state when going back
        setFlowStep('idp_validates')
        break
      case 'idp_validates':
        setIsValidated(false)
        setFlowStep('login_shown')
        setShowLoginDialog(true)
        break
      case 'login_shown':
        setShowLoginDialog(false)
        setFlowStep('auth_request')
        break
      case 'auth_request':
        setFlowStep('user_clicks_login')
        break
      case 'user_clicks_login':
        setFlowStep('idle')
        break
    }
  }

  const handleLogin = (enteredUsername: string, _password: string) => {
    setUsername(enteredUsername)
    setShowLoginDialog(false)
    setIsValidated(false)
    setFlowStep('idp_validates')
  }

  const handleReset = () => {
    setFlowStep('idle')
    setIdToken(null)
    setUsername(null)
    setShowLoginDialog(false)
    setIsValidated(false)
  }

  // Can go to next step if not idle, not waiting for dialog, and not at final step
  const canGoNext = 
    flowStep !== 'idle' && 
    flowStep !== 'login_shown' && 
    flowStep !== 'tokens_received'

  const canGoPrevious = 
    flowStep !== 'idle'

  // Auto-validate after showing validation spinner
  useEffect(() => {
    if (flowStep === 'idp_validates' && !isValidated) {
      const timer = setTimeout(() => {
        setIsValidated(true)
      }, 1500) // Show validation spinner for 1.5 seconds before showing checkmark
      
      return () => clearTimeout(timer)
    }
  }, [flowStep, isValidated])

  // Listen for global next step event (from presentation clicker)
  useEffect(() => {
    const handleGlobalNextStep = () => {
      if (flowStep === 'idle') {
        handleStartOAuth()
      } else if (canGoNext) {
        handleNextStep()
      }
    }

    window.addEventListener('slideNextStep', handleGlobalNextStep)
    return () => {
      window.removeEventListener('slideNextStep', handleGlobalNextStep)
    }
  }, [flowStep, canGoNext])

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Control Buttons - Top left */}
      <div className="absolute top-4 left-4 z-50 flex gap-4">
        {flowStep === 'idle' ? (
          <Button onClick={handleStartOAuth} size="lg" className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 shadow-lg">
            <Play className="h-5 w-5 mr-2" />
            Start OAuth Flow
          </Button>
        ) : (
          <>
            <Button
              onClick={handlePreviousStep}
              disabled={!canGoPrevious}
              size="lg"
              className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 disabled:opacity-50 shadow-lg"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={!canGoNext}
              size="lg"
              className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 disabled:opacity-50 shadow-lg"
            >
              <ArrowRight className="h-5 w-5 mr-2" />
              Next Step
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg" className="bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800 shadow-lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Slide Title - Top center */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <h2 className="text-2xl font-bold text-neutral-100 bg-neutral-800/90 px-6 py-3 rounded-lg shadow-lg border border-neutral-700">
          Basic OIDC Authentication Flow
        </h2>
      </div>

      {/* Closed Caption - Bottom center */}
      {flowStep !== 'idle' && stepMetadata[flowStep] && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-[900px] w-[90%]">
          <div className="bg-black/90 text-white px-6 py-4 rounded-lg shadow-2xl border border-neutral-700">
            <div className="flex items-start gap-4">
              <div className="bg-neutral-700 text-neutral-100 px-3 py-1 rounded font-bold text-sm flex-shrink-0 mt-0.5">
                {stepMetadata[flowStep]!.number}
              </div>
              <p className="text-base leading-relaxed">{stepMetadata[flowStep]!.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Stage */}
      <div className="w-full h-full">
        <Stage nodes={nodes} edges={edges} className="w-full h-full">
          {/* IDP Validation Indicator - positioned directly above Okta node */}
          {flowStep === 'idp_validates' && (
            <ValidationIndicatorPositioned isValidated={isValidated} nodeId="okta" />
          )}

          {/* ID Token Display - positioned absolutely within Stage */}
          {flowStep === 'tokens_received' && idToken && (
            <div className="absolute right-8 bottom-8 w-[420px] bg-neutral-900/95 p-6 rounded-lg shadow-2xl border border-neutral-800 z-50 pointer-events-auto">
              <h3 className="text-xl font-semibold text-center mb-4 text-neutral-100">Login Complete</h3>
              <div className="flex flex-col gap-4">
                <TokenChip
                  label="ID Token"
                  value={idToken}
                  scopes={['profile.email']}
                />
                <div className="text-xs text-neutral-400 mt-2 text-center">
                  Authenticated as: <span className="font-mono text-neutral-300">{username || 'user@example.com'}</span>
                </div>
              </div>
            </div>
          )}
        </Stage>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onLogin={handleLogin}
      />
    </div>
  )
}