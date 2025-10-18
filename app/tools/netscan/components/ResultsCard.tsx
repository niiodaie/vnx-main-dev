import { Card, CardContent } from '@/components/ui/card'

export default function ResultsCard({ data }: { data: any }) {
  return (
    <Card className="mb-2">
      <CardContent className="text-sm py-2">
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
