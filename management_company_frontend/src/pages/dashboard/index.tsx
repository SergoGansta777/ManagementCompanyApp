import { GetYearStatisticOverview } from '@/api/statisticApi.ts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import Loader from '@/components/ui/loader.tsx'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/ui/layout'
import { useQuery } from '@tanstack/react-query'
import {
  ActivityIcon,
  PersonStandingIcon,
  RussianRubleIcon,
  WrenchIcon
} from 'lucide-react'
import {
  TopFrequentIncidentTypes
} from './components/top-frequent-incident-types.tsx'
import {
  ExpensesDistributionByMonth
} from './components/expensesDistributionByMonth.tsx'


export default function Dashboard() {
  const { data, isSuccess } = useQuery({
    queryKey: ['year_statistic_overview'],
    queryFn: GetYearStatisticOverview
  })
  
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
                className='flex items-center justify-between w-full space-x-3'>
                <h1
                  className='text-2xl lg:text-3xl font-bold tracking-tight'>
                  Общие показатели
                </h1>
                <Button>Скачать pdf-отчет</Button>
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
                  <div
                    className='text-2xl pb-1 font-bold'>{data.totalExpensesLastYear}</div>
                  <p className='text-xs text-muted-foreground'>
                    {data.percentChangesInExpenseFromLastYear} в сравнении с
                    прошлым годом
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader
                  className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Ремонты
                  </CardTitle>
                  <WrenchIcon className='size-5' />
                </CardHeader>
                <CardContent>
                  <div
                    className='text-2xl pb-1 font-bold'>{data.countOfRepairsLastYear}</div>
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
                  <div
                    className='text-2xl pb-1 font-bold'>{data.countOfActiveRepairRequests}</div>
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
                    Сотрудники</CardTitle>
                  <PersonStandingIcon className='size-5' />
                </CardHeader>
                <CardContent>
                  <div
                    className='text-2xl pb-1 font-bold'>{data.countOfEmployees}</div>
                  <p className='text-xs text-muted-foreground'>
                    {data.countNewEmployeeLastYear} в этом году
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-9'>
              <Card
                className='col-span-1 lg:col-span-6 w-full overflow-visible'>
                <CardHeader>
                  <CardTitle>Распределение расходов по месяцам</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpensesDistributionByMonth
                    data={data.expenseDistributionByMonthLastYear} />
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
                    incidentTypes={data.top5IncidentTypesLastYear} />
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
    isActive: true
  },
  {
    title: 'Отчет по зданиям',
    href: '/statistics/building',
    isActive: false
  }
]
