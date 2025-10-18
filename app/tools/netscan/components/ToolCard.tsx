import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'


export default function ToolCard({
  toolKey,
  name,
  tier,
  description,
  onRun,
}: {
  toolKey: string
  name: string
  tier: 'free' | 'pro'
  description?: string
  onRun: () => void
}) {
  return (
    <Card className="h-full flex flex-col justify-between">
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-slate-500">{description ?? 'Network diagnostic'}</p>
          </div>

          <div>
            {tier === 'pro' ? (
              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-md">Pro</span>
            ) : (
              <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md">Free</span>
            )}
          </div>
        </div>
      </CardContent>

      <div className="p-4 pt-0">
        <Button onClick={onRun} className="w-full">
          Run {name}
        </Button>
      </div>
    </Card>
  )
}
