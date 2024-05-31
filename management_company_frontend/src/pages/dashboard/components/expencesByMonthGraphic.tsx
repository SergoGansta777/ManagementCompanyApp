import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Янв',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Фев',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Мар',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Апр',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Май',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Июнь',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Июль',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Авг',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Сен',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Окт',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Нояб',
    total: Math.floor(Math.random() * 5000) + 1000
  },
  {
    name: 'Дек',
    total: Math.floor(Math.random() * 5000) + 1000
  }
]

export function ExpencesByMonthGraphic() {
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
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₽ ${value}`}
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
