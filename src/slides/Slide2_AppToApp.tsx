import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Stage } from '@/stage/Stage'
import { TokenChip } from '@/components/TokenChip'
import { ConsentDialog } from '@/components/ConsentDialog'
import { makeJwt } from '@/lib/tokens'
import { Play, StepForward, RotateCcw, ArrowRight } from 'lucide-react'

type FlowStep =
  | 'idle'
  | 'initiate'
  | 'zoom_auth_request'
  | 'consent_allowed'
  | 'code_received'
  | 'token_exchange'
  | 'tokens_received'
  | 'api_call'
  | 'api_response'

/**
 * Slide 2: App-to-App via OAuth: Google Calendar ↔ Zoom
 * Full-screen Stage-based layout
 */
export function Slide2_AppToApp() {
  const [showConsentDialog, setShowConsentDialog] = useState(false)
  const [flowStep, setFlowStep] = useState<FlowStep>('idle')
  const [zoomAccessToken, setZoomAccessToken] = useState<string | null>(null)
  const [meetingResponse, setMeetingResponse] = useState<{ id: string; join_url: string } | null>(
    null
  )

  const nodes = [
    { id: 'calendar', x: 320, y: 240, w: 260 },
    { id: 'okta', x: 640, y: 96, w: 240 },
    { id: 'zoom', x: 960, y: 240, w: 260 },
  ]

  const edges = [
    {
      id: 'calendar-to-zoom-init',
      from: 'calendar',
      to: 'zoom',
      label: 'Initiate Install / Connect',
      visible: ['initiate', 'zoom_auth_request', 'consent_allowed', 'code_received', 'token_exchange', 'tokens_received', 'api_call', 'api_response'].includes(flowStep),
    },
    {
      id: 'zoom-to-okta-auth',
      from: 'zoom',
      to: 'okta',
      label: 'Auth Request (meeting.read, meeting.write)',
      pulse: flowStep === 'zoom_auth_request',
      visible: ['zoom_auth_request', 'consent_allowed', 'code_received', 'token_exchange', 'tokens_received'].includes(flowStep),
    },
    {
      id: 'okta-to-zoom-code',
      from: 'okta',
      to: 'zoom',
      label: 'Authorization Code',
      visible: ['code_received', 'token_exchange', 'tokens_received', 'api_call', 'api_response'].includes(flowStep),
    },
    {
      id: 'zoom-to-okta-token',
      from: 'zoom',
      to: 'okta',
      label: 'Token Exchange',
      visible: ['token_exchange', 'tokens_received', 'api_call', 'api_response'].includes(flowStep),
    },
    {
      id: 'okta-to-zoom-tokens',
      from: 'okta',
      to: 'zoom',
      label: 'Access Token (Zoom)',
      visible: ['tokens_received', 'api_call', 'api_response'].includes(flowStep),
    },
    {
      id: 'calendar-to-zoom-api',
      from: 'calendar',
      to: 'zoom',
      label: 'POST /meetings (Bearer ...)',
      visible: ['api_call', 'api_response'].includes(flowStep),
    },
  ]

  const handlePlayFlow = () => {
    setFlowStep('initiate')
    setTimeout(() => {
      setFlowStep('zoom_auth_request')
      setShowConsentDialog(true)
    }, 800)
  }

  const handleStep = () => {
    switch (flowStep) {
      case 'idle':
        setFlowStep('initiate')
        break
      case 'initiate':
        setFlowStep('zoom_auth_request')
        setShowConsentDialog(true)
        break
      case 'zoom_auth_request':
        break
      case 'consent_allowed':
        setFlowStep('code_received')
        break
      case 'code_received':
        setFlowStep('token_exchange')
        break
      case 'token_exchange':
        setFlowStep('tokens_received')
        setZoomAccessToken(
          makeJwt({
            sub: 'google-calendar-app',
            client_id: 'zoom-client-id',
            scope: 'meeting.read meeting.write',
            iss: 'https://okta.example.com',
          })
        )
        break
      case 'tokens_received':
        setFlowStep('api_call')
        setTimeout(() => {
          setFlowStep('api_response')
          setMeetingResponse({
            id: '987654321',
            join_url: 'https://zoom.us/j/987654321',
          })
        }, 1000)
        break
      case 'api_call':
        setFlowStep('api_response')
        setMeetingResponse({
          id: '987654321',
          join_url: 'https://zoom.us/j/987654321',
        })
        break
    }
  }

  const handleNextStep = handleStep

  const handleAllow = () => {
    setFlowStep('consent_allowed')
    setTimeout(() => {
      setFlowStep('code_received')
      setTimeout(() => {
        setFlowStep('token_exchange')
        setTimeout(() => {
          setFlowStep('tokens_received')
          setZoomAccessToken(
            makeJwt({
              sub: 'google-calendar-app',
              client_id: 'zoom-client-id',
              scope: 'meeting.read meeting.write',
              iss: 'https://okta.example.com',
            })
          )
          setTimeout(() => {
            setFlowStep('api_call')
            setTimeout(() => {
              setFlowStep('api_response')
              setMeetingResponse({
                id: '987654321',
                join_url: 'https://zoom.us/j/987654321',
              })
            }, 1000)
          }, 500)
        }, 500)
      }, 500)
    }, 500)
  }

  const handleDeny = () => {
    setFlowStep('idle')
    setZoomAccessToken(null)
    setMeetingResponse(null)
  }

  const handleReset = () => {
    setFlowStep('idle')
    setZoomAccessToken(null)
    setMeetingResponse(null)
    setShowConsentDialog(false)
  }

  const scopes = [
    { key: 'meeting.read', description: 'Read meeting details' },
    { key: 'meeting.write', description: 'Schedule & update meetings' },
  ]

  const activeScopes = zoomAccessToken ? ['meeting.read', 'meeting.write'] : []
  const canGoNext = flowStep !== 'idle' && flowStep !== 'zoom_auth_request' && flowStep !== 'api_response'

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Control Buttons - Top left */}
      <div className="absolute top-4 left-4 z-50 flex gap-4">
        {flowStep === 'idle' ? (
          <>
            <Button onClick={handlePlayFlow} size="lg" className="bg-neutral-800 text-neutral-100 hover:bg-neutral-700 shadow-lg">
              <Play className="h-5 w-5 mr-2" />
              Play Flow
            </Button>
            <Button onClick={handleStep} variant="outline" size="lg" className="bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800 shadow-lg">
              <StepForward className="h-5 w-5 mr-2" />
              Step
            </Button>
          </>
        ) : (
          <>
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

      {/* Full-screen Stage */}
      <div className="w-full h-full">
        <Stage nodes={nodes} edges={edges} className="w-full h-full">
          {/* Scope Viewer - Bottom Right */}
          {zoomAccessToken && (
            <div className="absolute right-8 bottom-8 w-[320px] bg-neutral-900/95 border border-neutral-800 rounded-lg p-4 z-50 shadow-xl">
              <h4 className="text-sm font-semibold mb-3 text-neutral-200">Active Scopes</h4>
              <div className="flex flex-wrap gap-2">
                {activeScopes.map((scope) => (
                  <Badge key={scope} variant="secondary" className="text-xs bg-neutral-800 border-neutral-700 text-neutral-200">
                    {scope}
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <TokenChip
                  label="zoom_access_token"
                  value={zoomAccessToken}
                  scopes={['meeting.read', 'meeting.write']}
                />
              </div>
            </div>
          )}

          {/* API Response - Bottom Left */}
          {meetingResponse && (
            <div className="absolute left-8 bottom-8 w-[380px] bg-neutral-900/95 border border-neutral-800 rounded-lg p-4 z-50 shadow-xl">
              <div className="font-mono text-sm">
                <div className="font-semibold mb-2 text-neutral-200">Response:</div>
                <pre className="bg-neutral-950 p-3 rounded border border-neutral-800 text-xs text-neutral-300 overflow-auto">
                  {JSON.stringify(meetingResponse, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Stage>
      </div>

      {/* Consent Dialog */}
      <ConsentDialog
        open={showConsentDialog}
        onOpenChange={setShowConsentDialog}
        appName="Zoom"
        scopes={scopes}
        onAllow={handleAllow}
        onDeny={handleDeny}
        variant="app-to-app"
      />
    </div>
  )
}