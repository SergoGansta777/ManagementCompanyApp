import { GetStatistics } from '@/api/statisticApi.ts'
import { DateRangePicker } from '@/components/date-range-picker.tsx'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Layout, LayoutBody, LayoutHeader } from '@/components/ui/layout'
import Loader from '@/components/ui/loader.tsx'
import { UserNav } from '@/components/user-nav'
import {
  IncidentTypeCosts
} from '@/pages/building-statistics/components/incident-type-costs.tsx'
import RepairPieChart
  from '@/pages/building-statistics/components/repair-pie-chart.tsx'
import {
  TopBuildingsByRepairCosts
} from '@/pages/building-statistics/components/top-buildings-by-repair-costs.tsx'
import { ruDateFormat, ruMoneyFormat } from '@/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as jsPDF from 'jspdf'
import { ArrowUp, FireExtinguisherIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useReactToPrint } from 'react-to-print'

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function Dashboard() {
  const queryClient = useQueryClient()
  const [startDate, setStartDate] = useState('2003-01-01')
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const { data, isSuccess } = useQuery({
    queryKey: ['Overview'],
    queryFn: async () => GetStatistics(startDate, endDate)
  })
  
  useEffect(() => {
    if (startDate && endDate) {
      queryClient.invalidateQueries({ queryKey: ['Overview'] })
    }
  }, [startDate, endDate, queryClient])
  
  const ReportComponent = React.forwardRef((props, ref) => (
    // @ts-ignore
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Отчёт о ремонтах за период с {startDate} по {endDate}</h1>
      <p>Общее количество инцидентов: {data?.totalIncidents}</p>
      <p>Общая стоимость: {data?.totalCost.toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'RUB'
      })}</p>
      <h2>Количество ремонтов</h2>
      <ul>
        <li>Аварийные ремонты: {data?.repairCounts.emergencyRepairs}</li>
        <li>Плановые ремонты: {data?.repairCounts.scheduledRepairs}</li>
        <li>Всего: {data?.repairCounts.total}</li>
      </ul>
      <h2>Стоимость инцидентов по типам</h2>
      <table border={1} cellPadding='5' cellSpacing='0'>
        <thead>
        <tr>
          <th>Тип инцидента</th>
          <th>Общая стоимость</th>
        </tr>
        </thead>
        <tbody>
        {data?.incidentCosts.map((incident, index) => (
          <tr key={index}>
            <td>{incident.incidentType}</td>
            <td>{incident.totalCost.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB'
            })}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <h2>Топ зданий по стоимости ремонта</h2>
      <table border={1} cellPadding='5' cellSpacing='0'>
        <thead>
        <tr>
          <th>Номер здания</th>
          <th>Общая стоимость</th>
          <th>Количество ремонтов</th>
        </tr>
        </thead>
        <tbody>
        {data?.topBuildingsByRepairCost.map((building, index) => (
          <tr key={index}>
            <td>{building.buildingNumber}</td>
            <td>{building.totalCost.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB'
            })}</td>
            <td>{building.repairCount}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  ))
  const componentRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'report',
    onAfterPrint: () => handleGeneratePDF()
  })
  
  const handleGeneratePDF = () => {
    const doc = new jsPDF()
    doc.html(componentRef.current, {
      callback: function(doc) {
        doc.save('report.pdf')
      },
      x: 10,
      y: 10
    })
  }
  
  return (
    <Layout>
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      {!isSuccess &&
        (
          <div className='flex items-center justify-center w-full'>
            <Loader />
          </div>
        )
      }
      {isSuccess &&
        (
          <LayoutBody className='space-y-4'>
            <div className='flex items-center justify-end space-y-2'>
              <div
                className='flex flex-col md:flex-row items-center justify-between w-full gap-3'>
                <h1
                  className='text-2xl lg:text-3xl font-bold tracking-tight'>
                  Статистика по авариям
                </h1>
                <div style={{ display: 'none' }}>
                  <ReportComponent ref={componentRef} data={data} />
                </div>
                <div
                  className='flex flex-row items-center justify-between gap-4'>
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
                  <Button
                    onClick={handlePrint}
                  >Скачать pdf-отчет</Button>
                </div>
              </div>
            </div>
            <div
              className='grid gap-4 sm:grid-cols-2 lg:grid-cols-11 lg:grid-rows-4'>
              <Card
                className='sm:col-span-1 lg:row-span-4 lg:col-span-3'>
                <CardHeader
                  className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Затраты на устранение аварий
                  </CardTitle>
                  <FireExtinguisherIcon className='size-5' />
                </CardHeader>
                <CardContent className='px-2'>
                  <IncidentTypeCosts incidentTypes={data.incidentCosts} />
                </CardContent>
              </Card>
              <Card className='lg:col-span-5 sm:col-span-1 lg:row-span-4'>
                <CardHeader
                  className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    10 домов с самыми большими затратами на ремонт
                  </CardTitle>
                  <ArrowUp className='size-5' />
                </CardHeader>
                <CardContent className='pt-4'>
                  <TopBuildingsByRepairCosts
                    buildingRepairCosts={data.topBuildingsByRepairCost} />
                </CardContent>
              </Card>
              <Card
                className='lg:row-span-2 lg:col-span-3 sm:col-span-2'>
                <CardContent className='w-full h-full p-3 m-0'>
                  <RepairPieChart repairCounts={data.repairCounts} />
                </CardContent>
              </Card>
              <Card
                className='sm:col-span-2 lg:col-span-3 lg:row-span-1 mb-0 pb-0'>
                <CardHeader
                  className='flex flex-row items-center justify-between gap-2'>
                  <CardTitle className='text-sm font-medium'>
                    Количество ремонтов
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className='flex flex-col gap-4 items-start justify-between w-full'>
                  <CardDescription
                    className='flex flex-col items-center justify-between w-full'>
                    <span
                      className='flex flex-row items-center justify-between w-full'>
                      <span>
                        Всего ремонтов
                      </span>
                      <span
                      >{data.repairCounts.total}</span>
                    </span>
                    <span
                      className='flex flex-row items-center justify-between w-full'>
                      <span>
                        Аварийных ремонтов
                      </span>
                      {data.repairCounts.emergencyRepairs}
                    </span>
                    <span
                      className='flex flex-row items-center justify-between w-full'>
                      <span>
                        Плановых ремонтов
                      </span>
                      {data.repairCounts.scheduledRepairs}
                    </span>
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className='sm:col-span-2 lg:col-span-3 lg:row-span-1'>
                <CardHeader
                  className='flex flex-row items-center justify-between gap-2'>
                  <CardTitle className='text-sm font-medium'>
                    Общее количество затрат на аварии
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className='flex flex-col gap-0.5 items-start w-full'>
                  <CardDescription>
                    Аварий - {data.totalIncidents}
                  </CardDescription>
                  <span className='text-xl'>
                    {ruMoneyFormat.format(data.totalCost)}
                  </span>
                </CardContent>
              </Card>
            </div>
          </LayoutBody>
        )
      }
    </Layout>
  )
}


const topNav = [
  {
    title: 'За последний год',
    href: '/',
    isActive: false
  },
  {
    title: 'Отчет по зданиям',
    href: '/statistics/building',
    isActive: true
  }
]
