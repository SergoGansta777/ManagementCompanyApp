import { GetAllRepairs } from '@/api/repairApi.ts'
import ThemeSwitch from '@/components/theme-switch'
import { Layout, LayoutBody, LayoutHeader } from '@/components/ui/layout'
import Loader from '@/components/ui/loader.tsx'
import { UserNav } from '@/components/user-nav'
import { useQuery } from '@tanstack/react-query'
import RepairTable from './components/repair-table.tsx'

export default function Repairs() {
  const { data, isSuccess } = useQuery({
    queryKey: ['AllRepairs'],
    queryFn: GetAllRepairs
  })
  
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
        <LayoutBody className='space-y-4'>
          <div className='flex items-center justify-end space-y-2'>
            <div className='flex items-center justify-between w-full space-x-3'>
              <h1 className='text-2xl lg:text-3xl font-bold tracking-tight'>
                Ремонты
              </h1>
            </div>
          
          </div>
          <div className='w-full h-full'>
            <RepairTable repairs={data.repairs} />
          </div>
        </LayoutBody>
      )}
    </Layout>
  )
}
