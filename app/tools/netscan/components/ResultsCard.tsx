import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'


export default function ResultsCard({ data }: { data: any }) {
  return (
    <Card className="mb-0">
      <CardContent className="text-sm py-3">
        <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
