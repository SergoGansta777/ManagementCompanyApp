import { Checkbox } from '@/components/ui/checkbox.tsx'
import type { EmployeeDetails } from '@/types/index.ts'
import type { ColumnDef } from '@tanstack/react-table'
import {
  DataTableColumnHeader
} from '@/components/data-table-column-header.tsx'
import { DataTableRowActions } from './data-table-row-actions.tsx'

const TableColumns = () => {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'lastName',
      meta: 'Фамилия',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Фамилия' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{row.getValue('lastName')}
					</span>
        )
      }
    },
    {
      accessorKey: 'firstName',
      meta: 'Имя',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Имя' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{row.getValue('firstName')}
					</span>
        )
      }
    },
    {
      accessorKey: 'middleName',
      meta: 'Отчество',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Отчество' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{row.getValue('middleName')}
					</span>
        )
      }
    },
    {
      accessorKey: 'email',
      meta: 'Email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
					{row.getValue('email')}
				</span>
        )
      }
    },
    {
      accessorKey: 'phone',
      meta: 'Телефон',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Телефон' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
					{row.getValue('phone')}
				</span>
        )
      }
    },
    {
      accessorKey: 'gender',
      meta: 'Пол',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Пол' />
      ),
      cell: ({ row }) => {
        const gender = row.getValue('gender')
        const formatted_gender = gender === 'male' ? 'Муж.' : 'Жен.'
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
						{formatted_gender}
					</span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    
    {
      accessorKey: 'positionName',
      meta: 'Должность',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Должность' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
					{row.getValue('positionName')}
				</span>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      }
    },
    {
      accessorKey: 'positionSalary',
      meta: 'Зарплата',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Зарплата' />
      ),
      cell: ({ row }) => {
        return (
          <span
            className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
					{row.getValue('positionSalary')}
				</span>
        )
      }
    },
    // {
    //   accessorKey: 'passportSeries',
    //   meta: 'Серия паспорта',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Серия паспорта' />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <span
    //         className='ml-auto w-auto font-medium'>
    // 			{row.getValue('passportSeries')}
    // 		</span>
    //     )
    //   }
    // },
    // {
    //   accessorKey: 'passportNumber',
    //   meta: 'Номер паспорта',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Номер паспорта' />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <span
    //         className='w-auto truncate font-medium ml-auto'>
    // 			{row.getValue('passportNumber')}
    // 		</span>
    //     )
    //   }
    // },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions row={row} />
    }
  ] as ColumnDef<EmployeeDetails>[]
}
export default TableColumns
