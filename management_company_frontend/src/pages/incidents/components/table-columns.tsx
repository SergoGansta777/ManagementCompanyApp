import {
  type Building,
  type IncidentDetails, type IncidentType, ruDateFormat
} from '@/types/index.ts'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DataTableColumnHeader
} from '@/components/data-table-column-header.tsx'

const TableColumns = () => {
  return [
    {
      accessorKey: 'building',
      meta: 'Адрес',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Адрес' />
      ),
      cell: ({ row }) => {
        const building = (row.getValue('building') as Building)
        const formattedAddress = `${building.address.region}, ${building.address.street}, дом №${building.number}`
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
        {formattedAddress}
      </span>
        )
      }
    }, {
      accessorKey: 'incidentType',
      meta: 'Тип инцидента',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Тип инцидента' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{(row.getValue('incidentType') as IncidentType).name}
					</span>
        )
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
