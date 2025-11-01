import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Video, Bot } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppBadgeProps {
  type: 'calendar' | 'zoom' | 'ai'
  className?: string
}

const appConfig = {
  calendar: {
    name: 'Google Calendar',
    icon: Calendar,
    color: 'text-blue-600',
  },
  zoom: {
    name: 'Zoom API',
    icon: Video,
    color: 'text-blue-500',
  },
  ai: {
    name: 'AI Agent',
    icon: Bot,
    color: 'text-purple-600',
  },
}

/**
 * Badge component for applications (Calendar, Zoom, AI Agent)
 */
export function AppBadge({ type, className }: AppBadgeProps) {
  const config = appConfig[type]
  const Icon = config.icon

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center p-6 gap-3 min-w-[200px]">
        <Icon className={cn('h-8 w-8', config.color)} />
        <div className="text-xl font-bold">{config.name}</div>
        <Badge variant="outline">{type === 'ai' ? 'Orchestrator' : 'Client App'}</Badge>
      </CardContent>
    </Card>
  )
}
