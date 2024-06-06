import {
  DataTableColumnHeader
} from '@/components/data-table-column-header.tsx'
import { type Repair, ruDateFormat } from '@/types/index.ts'
import type { ColumnDef } from '@tanstack/react-table'

const TableColumns = () => {
  return [
    {
      accessorKey: 'buildingAddress',
      meta: 'Адрес',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Адрес' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem] translate-y-[2px]'>
        {row.getValue('buildingAddress')}
      </span>
        )
      }
    },
    {
      accessorKey: 'repairType',
      meta: 'Тип ремонта',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тип ремонта' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{row.getValue('repairType')}
					</span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'startedAt',
      meta: 'Дата начала',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата начала' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{ruDateFormat.format(new Date(row.getValue('startedAt')))}
					</span>
        )
      }
    },
    {
      accessorKey: 'endedAt',
      meta: 'Дата конца',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата конца' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{ruDateFormat.format(new Date(row.getValue('endedAt')))}
					</span>
        )
      }
    },
    {
      accessorKey: 'status',
      meta: 'Статус',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Статус' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{row.getValue('status')}
					</span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'description',
      meta: 'Описание',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Описание' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
					{row.getValue('description')}
				</span>
        )
      }
    }
  ] as ColumnDef<Repair>[]
}
export default TableColumns
