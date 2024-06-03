import { Avatar, AvatarFallback } from '@/components/ui/avatar.tsx'
import { type BuildingRepairCost, ruMoneyFormat } from '@/types'
import { IconHome } from '@tabler/icons-react'

interface TopBuildingsByRepairCostsProps {
  buildingRepairCosts: BuildingRepairCost[]
}

export function TopBuildingsByRepairCosts({ buildingRepairCosts }: TopBuildingsByRepairCostsProps) {
  return (
    <div
      className='flex items-center flex-col justify-around gap-5 w-full h-full'>
      {buildingRepairCosts.map((buildingDetails) => (
        <div key={buildingDetails.buildingId}
             className='flex justify-between items-center w-full'>
          <Avatar className='size-9'>
            <AvatarFallback>
              <IconHome />
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p
              className='text-sm font-medium leading-none'>Здание
              № {buildingDetails.buildingNumber}</p>
            <p
              className='text-sm text-muted-foreground'>Количество ремонтов
              - {buildingDetails.repairCount}</p>
          </div>
          <div
            className='ml-auto text-lg font-medium'>{ruMoneyFormat.format(buildingDetails.totalCost)}</div>
        </div>
      ))}
    </div>
  )
}
