import { GetAllIncidentsDetails } from '@/api/incidentsApi.ts'
import { DateRangePicker } from '@/components/date-range-picker.tsx'
import ThemeSwitch from '@/components/theme-switch'
import { Layout, LayoutBody, LayoutHeader } from '@/components/ui/layout'
import Loader from '@/components/ui/loader.tsx'
import { UserNav } from '@/components/user-nav'
import { formatDate } from '@/utils.ts'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import IncidentsTable from './components/incident-table.tsx'

export default function Incidents() {
  const queryClient = useQueryClient()
  const [startDate, setStartDate] = useState('2003-01-01')
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  
  const { data, isSuccess } = useQuery({
    queryKey: ['AllIncidentsDetails'],
    queryFn: async () => GetAllIncidentsDetails(startDate, endDate)
  })
  
  useEffect(() => {
    if (startDate && endDate) {
      queryClient.invalidateQueries({ queryKey: ['AllIncidentsDetails'] })
    }
  }, [startDate, endDate, queryClient])
  
  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      {!isSuccess && (
        <div className='flex items-center justify-center w-full'>
          <Loader />
        </div>
      )}
      {isSuccess && (
        <LayoutBody className='space-y-1'>
          <div className='flex items-center justify-end space-y-2'>
            <div className='flex items-center justify-between w-full space-x-3'>
              <h1 className='text-2xl lg:text-3xl font-bold tracking-tight'>
                Аварии
              </h1>
              <div className='flex flex-row gap-2 items-end justify-between'>
                <DateRangePicker
                  onUpdate={(values) => {
                    setStartDate(formatDate(values.range.from))
                    setEndDate(formatDate(values.range.to!))
                  }}
                  initialDateFrom='2003-01-01'
                  initialDateTo={new Date().toISOString().split('T')[0]}
                  align='start'
                  locale='ru-RU'
                  showCompare={false}
                />
              </div>
            </div>
          
          </div>
          <div className='w-full h-full'>
            <IncidentsTable incidentsDetails={data.incidents} />
          </div>
        </LayoutBody>
      )}
    </Layout>
  )
}
