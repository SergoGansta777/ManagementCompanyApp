import { GetYearStatisticOverview } from '@/api/statisticApi.ts'
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
import { ruMoneyFormat } from '@/types'
import { useQuery } from '@tanstack/react-query'
import jsPDF from 'jspdf'
import {
  ActivityIcon,
  PersonStandingIcon,
  RussianRubleIcon,
  WrenchIcon
} from 'lucide-react'
import React, { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  ExpensesDistributionByMonth
} from './components/expensesDistributionByMonth.tsx'
import {
  TopFrequentIncidentTypes
} from './components/top-frequent-incident-types.tsx'


export default function Dashboard() {
  const { data, isSuccess } = useQuery({
    queryKey: ['year_statistic_overview'],
    queryFn: GetYearStatisticOverview
  })
  
  const ReportComponent = React.forwardRef((props, ref) => (
    // @ts-ignore
    <div ref={ref} className='px-14 py-10'>
      <h1 className='text-2xl text-center mx-auto mb-1 font-semibold'>Годовой
        отчет</h1>
      <p className='text-xl mx-auto text-center mb-3'>За период с января по
        декабрь</p>
      <div className='my-3'>
        <div className='space-y-1 py-1 mb-2'>
          <p className='text-left'>Общие
            расходы: {data?.totalExpensesLastYear}</p>
          <p className='text-left'>Общее количество
            инцидентов: {data?.totalIncidentsLastYear}</p>
        </div>
      </div>
      <h2 className='text-xl py-3 text-left font-semibold'>Наиболее частые виды
        аварий</h2>
      <table border={1} cellPadding='5' cellSpacing='0'
             className='w-full mx-auto px-5 py-4 mb-20'>
        <thead>
        <tr className='grid grid-cols-5'>
          <th className='col-span-3 text-left'>Тип инцидента</th>
          <th className='col-span-2 text-left'>Количество</th>
        </tr>
        </thead>
        <tbody>
        {data?.top5IncidentTypesLastYear.map((incident, index) => (
          <tr key={index} className='grid grid-cols-5'>
            <td className='col-span-3'>{incident.name}</td>
            <td className='col-span-2'>{incident.count}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <h2 className='text-xl py-3 text-left font-semibold'>Распределение
        расходов
        по месяцам</h2>
      <table border={1} cellPadding='5' cellSpacing='0'
             className='w-full mx-auto px-5 py-4 mb-20'>
        <thead>
        </thead>
        <tbody
          className='flex items-start justify-between gap-1 flex-col'
        >
        {data?.expenseDistributionByMonthLastYear.map((month, index) => (
          <tr className='flex items-start justify-between gap-4'>
            <td key={index}>{month.name}</td>
            <td key={index}>{ruMoneyFormat.format(month.total)}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  ))
  
  
  const componentRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'yearly_report',
    onAfterPrint: () => handleGeneratePDF()
  })
  
  const handleGeneratePDF = () => {
    const doc = new jsPDF()
    doc.html(componentRef.current, {
      callback: function(doc) {
        doc.save('yearly_report.pdf')
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
      {!isSuccess && (
        <div className='flex items-center justify-center w-full'>
          <Loader />
        </div>
      )}
      {isSuccess && (
        <LayoutBody className='space-y-4'>
          <div className='flex items-center justify-end space-y-2'>
            <div className='flex items-center justify-between w-full space-x-3'>
              <h1 className='text-2xl lg:text-3xl font-bold tracking-tight'>
                Общие показатели
              </h1>
              <div style={{ display: 'none' }}>
                <ReportComponent ref={componentRef} data={data} />
              </div>
              <Button onClick={handlePrint}>Скачать pdf-отчет</Button>
            </div>
          </div>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader
                className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Общие расходы
                </CardTitle>
                <RussianRubleIcon className='size-5' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl pb-1 font-bold'>
                  {data.totalExpensesLastYear}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {data.percentChangesInExpenseFromLastYear} в сравнении с
                  прошлым годом
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Ремонты</CardTitle>
                <WrenchIcon className='size-5' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl pb-1 font-bold'>
                  {data.countOfRepairsLastYear}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {data.percentChangesInCountRepairLastYear} в сравнении с
                  прошлым годом
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Активные заявки
                </CardTitle>
                <ActivityIcon className='size-5' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl pb-1 font-bold'>
                  {data.countOfActiveRepairRequests}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {data.percentChangesInActiveRepairRequestsLastYear} в
                  сравнении с прошлым годом
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Сотрудники
                </CardTitle>
                <PersonStandingIcon className='size-5' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl pb-1 font-bold'>
                  {data.countOfEmployees}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {data.countNewEmployeeLastYear} в этом году
                </p>
              </CardContent>
            </Card>
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-9'>
            <Card className='col-span-1 lg:col-span-6 w-full overflow-visible'>
              <CardHeader>
                <CardTitle>Распределение расходов по месяцам</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpensesDistributionByMonth
                  data={data.expenseDistributionByMonthLastYear}
                />
              </CardContent>
            </Card>
            <Card className='col-span-1 lg:col-span-3'>
              <CardHeader className='mb-3'>
                <CardTitle>Наиболее частые виды аварий</CardTitle>
                <CardDescription>
                  Всего аварий - {data.totalIncidentsLastYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopFrequentIncidentTypes
                  incidentTypes={data.top5IncidentTypesLastYear}
                />
              </CardContent>
            </Card>
          </div>
        </LayoutBody>
      )}
    </Layout>
  )
}

const topNav = [
  {
    title: 'За последний год',
    href: '/',
    isActive: true
  },
  {
    title: 'Отчет по зданиям',
    href: '/statistics/building',
    isActive: false
  }
]
