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
import { LoginInput, loginScheme } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {
}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  
  const { login } = useAuth()
  
  const loginMutation = async (data: LoginInput) => {
    return await login(data)
  }
  
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginMutation,
    onSuccess: () => {
      navigate('/')
    },
    onError: () => {
      console.log(error)
    }
  })
  
  function onSubmit(data: LoginInput) {
    mutate(data)
  }
  
  const getErrorMessage = (err: Error) => {
    if (err.message.includes('401')) {
      return 'Неправильный логин или пароль. Попробуйте еще раз.'
    }
    if (err.message.includes('404')) {
      return 'Пользователя с такими входными данными не существует'
    }
    return 'Произошла непредвиденная ошибка. Попробуйте в другой раз.'
  }
  
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Email</FormLabel>
                  </div>
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
                <FormItem className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Пароль</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' type='submit' disabled={isPending}>
              Войти
            </Button>
            {isError && <FormMessage>{getErrorMessage(error)}</FormMessage>}
          </div>
        </form>
      </Form>
    </div>
  )
}
