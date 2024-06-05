import {
  DataTableColumnHeader
} from '@/components/data-table-column-header.tsx'
import { type IncidentDetails, ruDateFormat } from '@/types/index.ts'
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
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {row.getValue('buildingAddress')}
      </span>
        )
      }
    }, {
      accessorKey: 'incidentTypeName',
      meta: 'Тип инцидента',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тип инцидента' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{row.getValue('incidentTypeName')}
					</span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'reportedAt',
      meta: 'Дата обращения',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Дата обращения' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{ruDateFormat.format(new Date(row.getValue('reportedAt')))}
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
  ] as ColumnDef<IncidentDetails>[]
}
export default TableColumns
