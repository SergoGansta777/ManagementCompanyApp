import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import type { IncidentTypeStatistic } from '@/types'
import { CircleAlert } from 'lucide-react'

interface TopFrequentIncidentTypesProps {
  incidentTypes: IncidentTypeStatistic[]
}

export function TopFrequentIncidentTypes({ incidentTypes }: TopFrequentIncidentTypesProps) {
  return (
    <div
      className='flex items-center flex-col justify-around gap-10 w-full h-full'>
      {incidentTypes.map((incidentType) => (
        <div key={incidentType.id}
             className='flex justify-between items-center w-full'>
          <Avatar className='size-9'>
            <AvatarFallback>
              <CircleAlert />
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p
              className='text-sm font-medium leading-none'>{incidentType.name}</p>
            <p
              className='text-sm text-muted-foreground'>Количество аварий
              - {incidentType.count}</p>
          </div>
          <div
            className='ml-auto text-lg font-medium'>{incidentType.percentage}</div>
        </div>
      ))}
    </div>
  )
}
