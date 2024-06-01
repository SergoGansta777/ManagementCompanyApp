import { Card, CardDescription, CardTitle } from '@/components/ui/card.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import {
  type IncidentCost,
  rub_format
} from '@/types'

interface IncidentTypeCostsProps {
  incidentTypes: IncidentCost[]
}

export function IncidentTypeCosts({ incidentTypes }: IncidentTypeCostsProps) {
  return (
    <ScrollArea className='h-[575px]'>
      <div
        className='flex items-center flex-col justify-around gap-4 p-4 w-full'>
        {incidentTypes.map((incidentType) => (
          <Card key={incidentType.incidentType}
                className='w-full p-2 gap-2 flex flex-col items-center justify-between'>
            <CardTitle className='text-center'>
              {incidentType.incidentType}
            </CardTitle>
            <CardDescription>
              {rub_format.format(incidentType.totalCost)}
            </CardDescription>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
