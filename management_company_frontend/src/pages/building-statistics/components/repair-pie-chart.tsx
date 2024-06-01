import type { RepairCount } from '@/types'
import { Pie, PieChart, Tooltip, Legend } from 'recharts'

export interface RepairPieChartProps {
  repairCounts: RepairCount
}

const RepairPieChart = ({ repairCounts }: RepairPieChartProps) => {
  const data = [
    {
      name: 'Аварийные ремонты',
      value: repairCounts.emergencyRepairs
    },
    {
      name: 'Плановые ремонты',
      value: repairCounts.scheduledRepairs
    }
  ]
  
  return (
    <div className='w-full flex items-start justify-center text-xs rounded-2xl'>
      <PieChart height={300} width={300}>
        <Pie
          className='fill-primary'
          data={data}
          dataKey='value'
          nameKey='name'
          outerRadius='90%'
          stroke='#888888'
          fill='currentColor'
          activeIndex={1}
          legendType='line'
          innerRadius={'40%'}
        />
        <Legend />
        <Tooltip />
      </PieChart>
    </div>
  )
}

export default RepairPieChart