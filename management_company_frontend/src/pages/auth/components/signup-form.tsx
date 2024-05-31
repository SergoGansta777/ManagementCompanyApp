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
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/context/authContext'
import { cn } from '@/lib/utils'
import { SignupInput, signupScheme } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
}

const formSchema = signupScheme.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords don\'t match.',
  path: ['confirmPassword']
})

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  
  function onSubmit(data: z.infer<typeof formSchema>) {
    mutate(data)
  }
  
  const { signup } = useAuth()
  
  const signupMutation = async (data: SignupInput) => {
    return await signup(data)
  }
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signupMutation,
    onSuccess: () => {
      navigate('/')
    }
  })
  
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='employee_id'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>ID сотрудника</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='00194862-3821-4d47-861e-5a7bc3fa6429' {...field} />
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
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Подтвердите пароль</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' type='submit' disabled={isPending}>
              Создать аккаунт
            </Button>
            {isError && <FormMessage>{error.message}</FormMessage>}
          </div>
        </form>
      </Form>
    </div>
  )
}
