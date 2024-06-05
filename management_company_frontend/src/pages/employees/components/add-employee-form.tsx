import { AddEmployee, GetAllPositionsAtWork } from '@/api/employeeApi'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { type NewEmployee, NewEmployeeSchema } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

const NewEmployeeForm = ({
                           className,
                           ...props
                         }: HTMLAttributes<HTMLDivElement>) => {
  const form = useForm<z.infer<typeof NewEmployeeSchema>>({
    resolver: zodResolver(NewEmployeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: '',
      gender: '',
      positionId: ''
    }
  })
  
  const positionsQuery = useQuery({
    queryKey: ['positions'],
    queryFn: GetAllPositionsAtWork
  })
  
  const client = useQueryClient()
  
  const newEmployeeMutation = useMutation({
    mutationKey: ['createEmployee'],
    mutationFn: AddEmployee,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ['employees'] })
    }
  })
  
  function onSubmit(newEmployee: NewEmployee) {
    newEmployeeMutation.mutate(newEmployee)
  }
  
  return (
    <div className={cn('grid gap-8', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder='Фамилия сотрудника' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder='Имя сотрудника' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='middleName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Отчество</FormLabel>
                  <FormControl>
                    <Input placeholder='Отчество сотрудника' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder='Рабочий номер телефона' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Рабочий email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-3 gap-4 w-full'>
              <FormField
                control={form.control}
                name='passportSeries'
                render={({ field }) => (
                  <FormItem className='space-y-1 col-span-1'>
                    <FormLabel>Серия</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Серия паспорта'
                        {...field}
                        onChange={(event) => {
                          field.onChange(Number(event.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='passportNumber'
                render={({ field }) => (
                  <FormItem className='space-y-1 col-span-2'>
                    <FormLabel>Номер</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Номер паспорта'
                        {...field}
                        onChange={(event) => {
                          field.onChange(Number(event.target.value))
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='space-y-1 col-span-1'>
                    <FormLabel>Пол</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Указать' className='px-4' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Пол</SelectLabel>
                            <SelectItem value={'male'}>
                              <div className='flex gap-2 items-center'>
                                Муж.
                              </div>
                            </SelectItem>
                            <SelectItem value={'female'}>
                              <div className='flex gap-2 items-center'>
                                Жен.
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='positionId'
                render={({ field }) => (
                  <FormItem className='space-y-1 col-span-2'>
                    <FormLabel>Должность</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Указать' className='px-4' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Должность</SelectLabel>
                            {positionsQuery.isSuccess &&
                              positionsQuery.data.positions.map((position) => {
                                return (
                                  <SelectItem
                                    key={position.id}
                                    value={position.id}
                                  >
                                    <div className='flex gap-2 items-center'>
                                      {position.name}
                                    </div>
                                  </SelectItem>
                                )
                              })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogClose asChild>
              <Button type='submit' className='test-lg px-6'>
                Добавить сотрудника
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default NewEmployeeForm
