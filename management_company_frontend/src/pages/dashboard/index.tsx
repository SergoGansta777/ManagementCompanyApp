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
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/ui/layout'
import {
  ActivityIcon,
  PersonStandingIcon,
  RussianRubleIcon,
  WrenchIcon
} from 'lucide-react'
import { RecentRepairs } from './components/recent-repairs.tsx'
import { ExpencesByMonthGraphic } from './components/expencesByMonthGraphic.tsx'

export default function Dashboard() {
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      
      {/* ===== Main ===== */}
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-end space-y-2'>
          <div className='flex items-center justify-between w-full space-x-3'>
            <h1
              className='text-2xl lg:text-3xl font-bold tracking-tight'>
              Общие показатели за год
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
              <div className='text-2xl font-bold'>45 231 989</div>
              <p className='text-xs text-muted-foreground'>
                +20% за прошлый месяц
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
              <div className='text-2xl font-bold'>2350</div>
              <p className='text-xs text-muted-foreground'>
                +180.1% с прошлого месяца
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
              <div className='text-2xl font-bold'>573</div>
              <p className='text-xs text-muted-foreground'>
                +123 за последную неделю
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Сотрудники</CardTitle>
              <PersonStandingIcon className='size-5' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>12,234</div>
              <p className='text-xs text-muted-foreground'>
                +34 за последний месяц
              </p>
            </CardContent>
          </Card>
        </div>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
          <Card className='col-span-1 lg:col-span-4'>
            <CardHeader>
              <CardTitle>Распределение расходов по месяцам</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <ExpencesByMonthGraphic />
            </CardContent>
          </Card>
          <Card className='col-span-1 lg:col-span-3'>
            <CardHeader>
              <CardTitle>Последние плановые ремонты</CardTitle>
              <CardDescription>
                Всего 300 ремонтов в этом месяце
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentRepairs />
            </CardContent>
          </Card>
        </div>
      </LayoutBody>
    </Layout>
  )
}

const topNav = [
  {
    title: 'Обзор',
    href: 'dashboard/overview',
    isActive: true
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false
  }
]
