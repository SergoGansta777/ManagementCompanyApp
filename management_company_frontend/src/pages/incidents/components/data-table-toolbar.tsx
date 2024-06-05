import { getAllIncidentsTypes } from '@/api/incidentsApi.ts'
import {
  DataTableFacetedFilter
} from '@/components/data-table-faceted-filter.tsx'
import { DataTableViewOptions } from '@/components/data-table-view-options.tsx'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { Download } from 'lucide-react'
import { CSVLink } from 'react-csv'
import type { Data } from 'react-csv/lib/core'

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  dataToExport: TData[];
}

export function DataTableToolbar<TData>({
                                          table,
                                          dataToExport
                                        }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  
  const incidentTypesQuery = useQuery({
    queryKey: ['incidentTypes'],
    queryFn: getAllIncidentsTypes
  })
  const incidentTypesOptions = incidentTypesQuery.data?.incidentTypes.map((incident) => {
    return {
      label: incident.name,
      id: incident.name
    }
  })
  
  
  return (
    <div className='flex items-center justify-between'>
      <div
        className='flex flex-1 flex-col-reverse items-start gap-y-2
        sm:flex-row sm:items-center sm:space-x-2'
      >
        <Input
          placeholder='Поиск по  адресу...'
          value={(table.getColumn('buildingAddress')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('buildingAddress')?.setFilterValue(event.target.value)
          }
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('incidentTypeName') && (
            <DataTableFacetedFilter
              column={table.getColumn('incidentTypeName')}
              title='Тип инцидента'
              options={incidentTypesOptions !== undefined ? incidentTypesOptions : []}
            />
          )}
        </div>
        <div>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Статус'
              options={[
                {
                  id: 'Закрыто',
                  label: 'Закрыто'
                },
                {
                  id: 'Отменено',
                  label: 'Отменено'
                },
                {
                  id: 'В процессе ремонта',
                  label: 'В процессе ремонта'
                },
                {
                  id: 'Обработка заявки',
                  label: 'Обработка заявки'
                },
                {
                  id: 'Исправлено',
                  label: 'Исправлено'
                }
              
              ]}
            />
          )}
        </div>
        
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Сбросить
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex justify-between items-center gap-2'>
        <CSVLink data={dataToExport as Data} filename='incidents.csv'>
          <Button variant='secondary' className='h-8 px-2 lg:px-3 '>
            <Download className='px-1' />
            Экспорт
          </Button>
        </CSVLink>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
