import type { ExpenseDistributionByMonth } from '@/types'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface ExpensesByMonthGraphicProps {
  data: ExpenseDistributionByMonth[]
}

export function ExpensesDistributionByMonth({ data }: ExpensesByMonthGraphicProps) {
  const rub_format = new Intl.NumberFormat('ru-Ru', {
    style: 'currency',
    currency: 'RUB',
    maximumSignificantDigits: 3
  })
  
  return (
    <ResponsiveContainer width='100%' height={420}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={8}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => rub_format.format(value)}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
