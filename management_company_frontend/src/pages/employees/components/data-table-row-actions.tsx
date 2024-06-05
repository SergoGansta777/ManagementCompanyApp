import { DeleteEmployeeWithId } from '@/api/employeeApi'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx'
import { EmployeeDetailsSchema } from '@/types'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { Delete, Pencil } from 'lucide-react'
import UpdateEmployeeForm from './update-employee-form'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
                                             row
                                           }: DataTableRowActionsProps<TData>) {
  const employee = EmployeeDetailsSchema.parse(row.original)
  
  const client = useQueryClient()
  
  const deleteEmployeeMutation = useMutation({
    mutationKey: ['deleteEmployee'],
    mutationFn: DeleteEmployeeWithId,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['employees'] })
    }
  })
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <Dialog>
        <DropdownMenuContent align='end' className='w-[160px] '>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Pencil size={20} className='pr-1' />
              Изменить
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className='group'
            onClick={() => deleteEmployeeMutation.mutate(employee.id)}
          >
            <div className='group-hover:text-red-500/70 flex flex-row'>
              <Delete size={20} className='pr-1' />
              Удалить
            </div>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
        <DialogContent>
          <DialogHeader className='text-3xl tracking-wide font-semibold'>
            Обновить информацию о сотрудника
          </DialogHeader>
          <DialogDescription>
            Пожалуйста, предоставьте актуальные данные
          </DialogDescription>
          <UpdateEmployeeForm employee={employee} />
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  )
}
