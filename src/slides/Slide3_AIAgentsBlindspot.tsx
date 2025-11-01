import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Stage } from '@/stage/Stage'
import { AlertTriangle } from 'lucide-react'

/**
 * Slide 3: AI Agents & the IDP Blind Spot
 * Monochrome Stage-based layout
 */
export function Slide3_AIAgentsBlindspot() {
  const mitigations = [
    'Fine-grained, purpose-bound scopes',
    'Short token TTL + rotation',
    'Audit trails at the app/resource layer',
    'Consent receipts with data categories',
  ]

  const nodes = [
    { id: 'agent', x: 320, y: 80, w: 240 },
    { id: 'calendar', x: 320, y: 320, w: 260 },
    { id: 'zoom', x: 960, y: 320, w: 260 },
    { id: 'okta', x: 960, y: 80, w: 240 },
  ]

  const edges = [
    {
      id: 'calendar-to-zoom-data1',
      from: 'calendar',
      to: 'zoom',
      label: 'Event details',
      dashed: true,
      pulse: true,
      visible: true,
    },
    {
      id: 'calendar-to-zoom-data2',
      from: 'calendar',
      to: 'zoom',
      label: 'Join URL',
      dashed: true,
      pulse: true,
      visible: true,
    },
    {
      id: 'zoom-to-calendar-data',
      from: 'zoom',
      to: 'calendar',
      label: 'Participants',
      dashed: true,
      pulse: true,
      visible: true,
    },
  ]

  return (
    <div className="flex flex-col w-full h-full">
      <div className="text-center mb-4 z-10 flex-shrink-0">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-neutral-100">
          Step 3: AI agents orchestrate across apps—but IDP can't see data flow
        </h2>
        <p className="text-sm md:text-base text-neutral-400">Identity != Data Governance</p>
      </div>

      {/* Stage */}
      <div className="flex-1 w-full min-h-[600px]">
        <Stage nodes={nodes} edges={edges}>
          {/* Visibility Boundary - Vertical dashed line */}
          <div className="absolute left-[800px] top-0 bottom-0 w-px border-l-2 border-dashed border-neutral-600 opacity-50 z-10" />
          <div className="absolute left-[780px] top-[200px] bg-neutral-900/90 border border-neutral-800 rounded px-3 py-2 z-20">
            <div className="text-xs uppercase tracking-wide text-neutral-400">IDP visibility boundary</div>
          </div>

          {/* Data Exchange Note - Bottom Center */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
            <Card className="bg-neutral-900/80 border border-dashed border-neutral-700 min-w-[500px]">
              <CardContent className="p-4">
                <div className="text-sm font-medium text-neutral-300 italic text-center">
                  ⚠️ Data flows directly between Calendar and Zoom using tokens issued by Okta
                </div>
              </CardContent>
            </Card>
          </div>
        </Stage>
      </div>

      {/* Technical Blind Spot Alert - Below Canvas */}
      <div className="w-full max-w-4xl mt-4 flex-shrink-0">
        <Alert variant="destructive" className="bg-neutral-900 border border-neutral-800 shadow-xl">
          <AlertTriangle className="h-5 w-5 text-neutral-300" />
          <AlertTitle className="text-xl font-bold text-neutral-100">Technical blind spot</AlertTitle>
          <AlertDescription className="text-base text-neutral-300 mt-2">
            Once tokens are issued, the IDP is <strong>not aware</strong> of the content
            exchanged between apps. Risk: policy drift, oversharing, or sensitive context
            leakage when agents act across systems.
          </AlertDescription>
        </Alert>
      </div>

      {/* Mitigations - Below Alert */}
      <div className="w-full max-w-4xl mt-6 bg-neutral-900 p-8 rounded-lg shadow-xl border border-neutral-800 flex-shrink-0">
        <h3 className="text-2xl font-bold mb-6 text-center text-neutral-100">Mitigations (examples)</h3>
        <div className="flex flex-wrap gap-4 justify-center">
          {mitigations.map((mitigation, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-base px-6 py-3 border border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-colors"
            >
              {mitigation}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}